import { Link } from "react-router-dom";
import Styles from "./Newnav.module.css";
import mark_slim from "../../assets/mark_slim.png";
import Hamburger from "./Hamburger";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { actionCreators } from "../../store";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

function NewNav({state}) {
// function NewNav() {

    const role = sessionStorage.getItem("role");
    const nickname = sessionStorage.getItem("nickname");
    let firstnick ="";
    if(nickname !== null){
        firstnick = nickname.substring(0, 1);
    }

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
                    <div className={Styles.mininick}>
                        {/* <Avatar sx={{ bgcolor: "Highlight"[400], width: 24, height: 24}}>{""}{firstnick}</Avatar>{nickname} */}
                        <Avatar sx={{ width: 35, height: 35}} style={{backgroundColor:'#77a3a9'}}>{""}{firstnick}</Avatar>&nbsp;{nickname}
                    </div>
                    
                }
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
