import styles from "./Poll.module.css";
import Footer from "../components/layout/Footer";
import Newnav from "../components/layout/NewNav";
import CandList from "../components/poll/CandList";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import FlipCountdown from "@rumess/react-flip-countdown";

function Poll() {
  const params = useParams();
  const [itemDetail, setItemDetail] = useState({});
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [cand, setCand] = useState([]);
  const [countOpen, setcountOpen] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`https://j6a304.p.ssafy.io/api/polls/${params.pollnum}`)
      .then((res) => {
        setItemDetail((prev) => {
          return { ...prev, ...res.data };
        });
        setStart(res.data.startDate);
        setEnd(res.data.endDate);
        setCand(res.data.candidates);
        setcountOpen(res.data.openStatus);
        sessionStorage.setItem("open", res.data.openStatus);
        sessionStorage.setItem("poll", res.data.title);
      })
      .catch((error) => {
        // console.log(error.response);
      });
  }, []);

  const startYMD = start.slice(0, 10).replaceAll("-", ".");
  const endYMD = end.slice(0, 10).replaceAll("-", ".");

  return (
    <>
      <Newnav />
      <div className={styles.poll_container}>
        <div className={styles.pl_top}>
          <div className={styles.pl_top2}>
            <div id={styles.poll_box}>
              <img
                src={itemDetail.thumbnail}
                alt="main"
                className={styles.pollImg}
                col={4}
              />
              <div id={styles.poll_box2} col={8}>
                <div className={styles.left_title}>{itemDetail.title}</div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div id={styles.poll_date}>
                    {startYMD} - {endYMD}
                  </div>
                  <div id={styles.poll_content}>{itemDetail.content}</div>
                </div>
              </div>
            </div>
            <div id={styles.flip}>
              <p id={styles.flip_text}> 투표 종료까지 남은 시간</p>
              <FlipCountdown size="medium" endAt={end} />
            </div>
          </div>
        </div>

        <div className={styles.pl_bottom}>
          <CandList cand={cand} countOpen={countOpen} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Poll;
