import NewNav from "../components/layout/NewNav.jsx";
import styles from "./Candidate.module.css";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/comment/Comment";
import mark from "../assets/mark_slim.png";
import crown from "../assets/crown.png";
import tx from "../assets/tx.png";
import tokenimg from "../assets/token.png";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Swal from "sweetalert2";
import x from "../assets/x.png";
import stamp from "../assets/stamp.png";
import Lock from "../assets/Lock.png";
import {
  voteBlock,
  totalVotesBlock,
  unlockAccount,
  lockAccount,
  approveAccount,
  sendPOL,
  checkPOL,
} from "../contracts/CallContract";
import TextField from "@mui/material/TextField";
import { connect } from "react-redux";
import Txid2 from "./Txid2.jsx";

function Candidate2({ state }) {
  const navigate = useNavigate();
  const params = useParams();
  const [candIdx, setCandIdx] = useState(0);
  const [candi_name, setCandi_name] = useState("");
  const [profile, setProfile] = useState("");
  const [profile_image, setProfile_image] = useState("");
  const [photo1, setPhoto1] = useState("");
  const [photo2, setPhoto2] = useState("");
  const [photo3, setPhoto3] = useState("");
  const [voteCount, setVoteCount] = useState(0);
  const [commentdata, setCommentdata] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [modalOpen, setmodalOpen] = useState(false);
  const [picked, setPicked] = useState(false);
  const [modalOpen2, setmodalOpen2] = useState(false);
  const [imageLock, setimageLock] = useState(true);
  const [modalOpen3, setmodalOpen3] = useState(false);
  const pollOpen = sessionStorage.getItem("open");
  const polltitle = sessionStorage.getItem("poll");
  const token = sessionStorage.getItem("token");
  const [inputWalletPw, setInputWalletPw] = useState("");
  const [inputImgPw, setInputImgtPw] = useState("");

  const wallet = sessionStorage.getItem("wallet");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    axios
      .get(`https://j6a304.p.ssafy.io/api/polls/candidates/${params.id}`)
      .then((res) => {
        setCandIdx(res.data.candidateIndex);
        setProfile_image(res.data.thumbnail);
        setPhoto1(res.data.imagePath1);
        setPhoto2(res.data.imagePath2);
        setPhoto3(res.data.imagePath3);
        setCandi_name(res.data.name);
        setProfile(res.data.profile);
        setCommentdata(res.data.comments);
        // "이 후보의 id:", params.id
        // "이 후보의 IDX:", res.data.candidateIndex
      })
      .catch((error) => {
      });
  }, [renderCount]);

  getTotalVotes(candIdx);

  useEffect(() => {
    axios
      .get(`https://j6a304.p.ssafy.io/api/use-tokens/candidates/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          Accept: "*/*",
        },
      })
      .then((res) => {
        const imagebuy = res.data[0];
        if (imagebuy) {
          setimageLock(false);
        } else {
          setimageLock(true);
        }
      })
      .catch((error) => {
      });
  }, []);

  async function getTotalVotes(idx) {
    const totalVotes = await totalVotesBlock(idx, wallet);
    setVoteCount(totalVotes);
  }

  function changePhoto1() {
    setProfile_image(photo1);
    setPhoto1(profile_image);
  }

  function changePhoto2() {
    setProfile_image(photo2);
    setPhoto2(profile_image);
  }

  function changePhoto3() {
    setProfile_image(photo3);
    setPhoto3(profile_image);
  }

  function gotoList() {
    navigate(`/poll/${params.pollnum}`);
  }

  function renderCheck() {
    setRenderCount((renderCount) => renderCount + 1);
  }

  function handleOpen() {
    axios
      .get(
        `https://j6a304.p.ssafy.io/api/polls/candidates/limit/${params.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
            Accept: "*/*",
          },
        }
      )
      .then((res) => {
        setmodalOpen(true);
      })
      .catch((error) => {
        Swal.fire({
          title: "한 대회당 한 명에게만 투표할 수 있습니다.",
          icon: "error",
        });
      });
  }

  function handleClose() {
    setmodalOpen(false);
    setPicked(false);
  }

  function handlePicked() {
    setPicked((prev) => !prev);
  }

  const pollfin = () => {
    Swal.fire({
      title: "투표가 완료되었습니다.",
      icon: "success",
    });
  };

  const adminAddress = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
  // const adminAddress = "0x0BcE168eb0fd21A6ae9bAD5C156bcC08633c2328";

  function getWalletPw(e) {
    setInputWalletPw(e.target.value);
  }

  const [reward, setReward] = useState(0);

  async function handlepoll() {
    if (picked && inputWalletPw !== "") {
      // 블록체인 투표 하는 부분
      //   1. Unlock 해준다.(비밀번호 입력받아서)
      unlockAccount(wallet, inputWalletPw);
      // 2. 투표로직을 블록체인에 전송한다. & 서버에 후보자의 득표내역 전송한다.
      const res = await voteBlock(candIdx, wallet);
      const txId = res.transactionHash;
      axios
        .post(
          `https://j6a304.p.ssafy.io/api/polls/candidates`,
          {
            candidateId: params.id,
            transactionId: txId,
            voteCount: 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
              Accept: "*/*",
            },
          }
        )
        .then(async (res) => {
          //   투표 성공하면 후보자 득표수 리렌더링 해줘야하니 아무 state값이나 업데이트
          renderCheck();
          lockAccount(wallet); //블록체인 계좌 잠금
          pollfin(); //스윗알랏
          handleClose(); //모달 종료
          await approveAccount(100, adminAddress);
          await sendPOL(100, adminAddress, wallet);
          setReward((prev) => prev + 1);
        })
        .catch((error) => {
        });
      // 3. 다시 lock 한다.
    } else if (picked && inputWalletPw === "") {
      Swal.fire({
        title: "지갑 비밀번호를 입력하세요.",
        icon: "error",
      });
    } else if (!picked && inputWalletPw !== "") {
      Swal.fire({
        title: "투표 도장을 찍어주세요.",
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "투표 도장과 비밀번호를 입력하세요.",
        icon: "error",
      });
    }
  }

  function handleOpen2() {
    setmodalOpen2(true);
  }

  function handleClose2() {
    setmodalOpen2(false);
  }

  const imgopen = () => {
    Swal.fire({
      title: "사진이 공개 되었습니다.",
      icon: "success",
    });
  };

  const notoken = () => {
    Swal.fire({
      title: "토큰이 부족합니다.",
      icon: "error",
    });
  };
  const nopw = () => {
    Swal.fire({
      title: "지갑 비밀번호가 틀렸습니다.",
      icon: "error",
    });
  };

  function getImgPw(e) {
    setInputImgtPw(e.target.value);
  }

  const [tminus, setTminus] = useState(0);

  async function handleLock() {
    const balance = await checkPOL(wallet);
    if (balance >= 500 && inputImgPw !== "") {
      axios
        .post(
          "https://j6a304.p.ssafy.io/api/use-tokens/candidates",
          {
            candidateId: params.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
              Accept: "*/*",
            },
          }
        )
        .then(async (res) => {
          unlockAccount(wallet, inputImgPw);
          await approveAccount(500, wallet);
          await sendPOL(500, wallet, adminAddress);
          imgopen(); //스윗알럿
          handleClose3(); //모달 닫기
          setimageLock(false); //사진 잠금 풀기
          lockAccount(wallet); //lock해줘야 하는데, 얘가 먼저 되어버림
          setTminus((prev) => prev + 1); //렌더링 안먹음
        })
        .catch((error) => {
        });
    } else if (balance < 500 && inputImgPw !== "") {
      notoken();
    } else if (balance >= 500 && inputImgPw === "") {
      nopw();
    } else {
      Swal.fire({
        title: "토큰 부족 && 비밀번호를 입력하세요.",
        icon: "error",
      });
    }
  }

  function handleOpen3() {
    setmodalOpen3(true);
  }
  function handleClose3() {
    setmodalOpen3(false);
  }
  const rank = sessionStorage.getItem("rank");
  const listType = sessionStorage.getItem("listType");
  return (
    <div>
      <NewNav reward={reward} tminus={tminus} />
      <div className={styles.container}>
        <img id={styles.crown2} src={crown} alt="crown" />
        <img id={styles.tx2} src={tx} alt="tx2" />
        <span id={styles.name2}>{candi_name}</span>
        <p id={styles.profile2}>{profile}</p>
        <img
          id={styles.profile_image2}
          src={profile_image}
          alt="profile_image"
        />
        {listType === "rank" && (
          <p id={styles.nowrank2}> 현재 순위: {rank}위 </p>
        )}
        {listType === "register" && (
          <p id={styles.nowrank2}> 후보 No. {rank}번 </p>
        )}
        {pollOpen === "true" && (
          <p id={styles.nowpoll2}>
            {" "}
            <img id={styles.mark} src={mark} alt={mark} />
            현재 투표수: {voteCount}표{" "}
          </p>
        )}
        {pollOpen === "false" && (
          <p id={styles.nowpoll2}>
            {" "}
            <img id={styles.mark} src={mark} alt={mark} />
            현재 투표수:???표{" "}
          </p>
        )}

        <Button
          id={styles.poll_button2}
          onClick={handleOpen}
          variant="contained"
        >
          투표하기
        </Button>

        <Modal open={modalOpen} onClose={handleClose}>
          <div id={styles.poll_paper}>
            <div id={styles.poll_paper2}>
              <img onClick={handleClose} id={styles.x_button} src={x} alt="x" />
              <p id={styles.poll_title}>{polltitle}</p>
              <p id={styles.paper_image}>
                <img
                  id={styles.paper_image}
                  src={profile_image}
                  alt="profile"
                ></img>
                {candi_name}
              </p>
              <p id={styles.stamp_box} onClick={handlePicked}>
                {picked ? (
                  <img id={styles.stamp} src={mark} alt="mark2" />
                ) : null}
              </p>
              <p id={styles.wallet_box}>
                <TextField
                  id={styles.wallet_password}
                  placeholder="Wallet Password"
                  variant="standard"
                  type="password"
                  onChange={getWalletPw}
                />
              </p>
              <p id={styles.paper_button}>
                <Button
                  onClick={handlepoll}
                  id={styles.paper_button2}
                  variant="contained"
                >
                  {" "}
                  투표하기
                </Button>
              </p>
              <p id={styles.stamp_box2}>
                <img id={styles.stamp2} src={stamp} alt="stamp" />
              </p>
              <p id={styles.paper_text}>
                해당 투표는 하루에 한 번만 가능합니다.{" "}
              </p>
              <p id={styles.paper_text2}>투표관리관 </p>
            </div>
          </div>
        </Modal>

        <Txid2 id={params.id} />

        <Button id={styles.back_button2} onClick={gotoList} variant="contained">
          참가자 목록
        </Button>
        <div id={styles.photobox2}>
          {photo1 ? (
            <img
              id={styles.photo1}
              onClick={changePhoto1}
              src={photo1}
              alt="photo1"
            />
          ) : null}
          {photo2 ? (
            <img
              id={styles.photo2}
              onClick={changePhoto2}
              src={photo2}
              alt="photo2"
            />
          ) : null}
          {photo3 && imageLock ? (
            <img
              id={styles.photo3}
              onClick={handleOpen3}
              src={Lock}
              alt="Lock"
            />
          ) : null}

          <Modal open={modalOpen3} onClose={handleClose3}>
            <div id={styles.behind_box}>
              <img id={styles.behind_mark} src={mark} alt="mark" />
              <p id={styles.behind_marktext}>POLLING</p>
              <p id={styles.behind_text}>
                {" "}
                <img id={styles.tokenimg} src={tokenimg} alt="token" />
                500POL를 사용하여 <br />
                미공개 사진을 여시겠습니까?
              </p>
              <TextField
                className={styles.img_password}
                placeholder="Wallet Password"
                variant="standard"
                type="password"
                onChange={getImgPw}
              />
              <Button
                id={styles.behind_btn}
                onClick={handleLock}
                variant="contained"
              >
                {" "}
                예{" "}
              </Button>
              <Button
                id={styles.behind_btn2}
                onClick={handleClose3}
                variant="contained"
              >
                {" "}
                아니오{" "}
              </Button>
            </div>
          </Modal>

          {photo3 && imageLock === false ? (
            <img
              id={styles.photo3}
              onClick={changePhoto3}
              src={photo3}
              alt="photo3"
            />
          ) : null}
        </div>

        <Comment
          candiId={params.id}
          data={commentdata}
          renderCheck={renderCheck}
        ></Comment>
        <Button id={styles.list_button} onClick={gotoList} variant="contained">
          리스트로 돌아가기
        </Button>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { state };
}

export default connect(mapStateToProps, null)(Candidate2);
