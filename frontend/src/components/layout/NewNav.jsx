import { Link } from "react-router-dom";
import Styles from "./Newnav.module.css";
import mark_slim from "../../assets/mark_slim.png";
import Hamburger from "./Hamburger";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { actionCreators } from "../../store";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import token2 from "../../assets/token.png"
import {checkPOL} from "../../contracts/CallContract";

// function NewNav({state,token,rendering2}) {
// function NewNav({state,rendering2,setRendering2}) {
function NewNav({state, reward}) {
// function NewNav() {
    const wallet = sessionStorage.getItem("wallet");
    const role = sessionStorage.getItem("role");
    const nickname = sessionStorage.getItem("nickname");
    let firstnick ="";
    if(nickname !== null){
        firstnick = nickname.substring(0, 1);
    }
    console.log(wallet);
    // const [token, setToken] = useState();

    const [token1, setToken1] = useState();
    
    const getToken1 = () => {
        //없을때 아웃
        if(wallet === null){
            return;
        }
        //checkPOL
        checkPOL(wallet).then(res => {setToken1(res); console.log("resToken",res);});
    };

    useEffect(() => {
        console.log("working?")
        getToken1();
    })


    // const [rendering2, setRendering2] = useState(0);
    //햄버거 버튼에서 로그아웃하면, 같이 바뀌게?
    const [rendering, setRendering] = useState(0);

    return (
        <div >
            <div className={Styles.outbox}></div>
            <div>
                <Link to="/"><img src={mark_slim}  alt="mark" className={Styles.mark} /></Link>
                <Link to="/" className={Styles.title}>POLLING</Link>
            </div>
            <div>
                {nickname === null?
                    <div className={Styles.mininick}>
                        {/* 로그인 후 이용바랍니다. */}
                    {/* {state[0].nickname}님, 안녕하세요. */}
                    </div>
                    :
                    (
                        <div>
                            <div className={Styles.mininick}>
                                {/* <Avatar sx={{ bgcolor: "Highlight"[400], width: 24, height: 24}}>{""}{firstnick}</Avatar>{nickname} */}
                                <Avatar  style={{fontSize:'1.5vw',backgroundColor:'#77a3a9', width:'2vw', height:'4vh', top:'-0.1vh'}}>{""}{firstnick}</Avatar>&nbsp;{nickname}
                                {/* sx={{ width: 35, height: 35}} */}
                            </div>
                            <div>
                                {/* <div> </div> */}
                                <img className={Styles.tokenimg} src={token2}/>
                                {/* <div className={Styles.token}>{""}</div> */}
                                {/* <div className={Styles.token}>{token}</div> */}
                                <div className={Styles.token}>{token1}</div>
                            </div>
                        </div>
                    )
                }
                {/* 토큰이미지와 토큰값 */}
                
            </div>
            <div>
                <Hamburger setRendering={setRendering} />
            </div>
            <div className={Styles.user}>
                <div className={Styles.userNav}>
                    {/* <Link to="/" className={Styles.text}> {" "}Home&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "} </Link> */}
                    <Link to="/whypolling" className={Styles.text}> {" "}ABOUT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "} </Link>
                    {
                        // role === "" ?
                        role === null ?
                        <Link to="/login" className={Styles.text}> {" "}LOGIN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "} </Link>
                        : (
                            role === "ROLE_USER"?
                            <Link to="/mypage" className={Styles.text}> MYPAGE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Link>
                            : (
                                role === "ROLE_ADMIN" ?
                                <Link to="/management" className={Styles.text}> ADMIN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Link>
                                : 
                                ( role === "ROLE_COMPANY"?
                                <Link to="/management" className={Styles.text}> COMPANY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Link>
                                :
                                <Link to="/login" className={Styles.text}> {" "}LOGIN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "} </Link>
                                )
                            )
                        )
                    }
                    <Link to="/notice" className={Styles.text}> {" "}FAQ{" "} </Link>
                </div>
            </div>
            <div className={Styles.poll}>
                <div className={Styles.pollNav}>
                    <Link to="/polllist" className={Styles.text} style={{textDecoration: 'none'}}> {" "} POLL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "} </Link>
                    <Link to="/hall" className={Styles.text} style={{textDecoration: 'none'}}> {" "}HALL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "} </Link>
                    <Link to="/history" className={Styles.text} style={{textDecoration: 'none'}}> {" "}HISTORY{" "} </Link>
                </div>
            </div>
    </div>
  );
}
function mapStateToProps(state) {
    return { state };
}

// export default NewNav;
export default connect(mapStateToProps)(NewNav);
