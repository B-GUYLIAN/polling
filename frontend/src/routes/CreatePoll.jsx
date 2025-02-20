import styles from "./CreatePoll.module.css";
import NewNav  from "../components/layout/NewNav.jsx"
import React, { useRef, useState } from "react";
import NomineeInput from "../components/admin/NomineeInput"
import NomineeList from "../components/admin/NomineeList"
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import { useSelector } from 'react-redux'
// import { actionCreators } from "../store"
import Footer from "../components/layout/Footer";
import logo from "../assets/mark_slim.png"
import nonono from "../assets/nonono.png"
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import dayjs from "dayjs";
import axios from "axios";


function CreatePoll() {
    const [pollImage, setpollImage] = useState("");
    const [pollName, setpollName] = useState("");
    const [pollStart, setpollStart] = useState("");
    const [pollEnd, setpollEnd] = useState("");
    const [pollDescribe, setpollDescribe] = useState("");    
    const [pollRealtime, setpollRealtime] = useState(false);


    const token = sessionStorage.getItem("token")

    const navigate = useNavigate();
    const no = useRef(1)
    const [nomiList, setnomiList] = useState([{
        id: 0,
        name: "",
        profile: "",
        thumbnail: "",
        imagePath1: "",
        imagePath2: "",
        imagePath3: ""
    }])
    const [current, setCurrent] = useState({})
    const [isEdit, setIsEdit] = useState(false)


    const onDel=(id)=>{
        setnomiList(nomiList.filter(nomiList => nomiList.id !== id))
    }
    const onAdd=(form)=>{
        form.id = no.current++;
        setnomiList((nomiList)=> nomiList.concat(form));
    }
    const onEdit=(nominee)=>{
        setCurrent(nominee)    
        setIsEdit(true) 
    }

    const onUpdate=(nominee)=>{
        setnomiList(nomiList.map(nomilist=> nomilist.id===nominee.id ? nominee : nomilist ))
        setIsEdit(false);        
    }

    function changeUrl(e) {
        setpollImage(e.target.value);
    }
    function changePollName(e) {
        setpollName(e.target.value);
    }
    function changePollStart(e) {
        const startdate = dayjs(e).format("YYYY-MM-DD HH:mm")
        setpollStart(String(startdate));
    }
    function changePollEnd(e) {
        const enddate = dayjs(e).format("YYYY-MM-DD HH:mm")
        setpollEnd(String(enddate));
        
    }
    function changepollDescribe(e) {
        setpollDescribe(e.target.value);
    }
    function changepollRealtime(e) {
        if (e.target.checked === true){
            setpollRealtime(true);
        } else {
            setpollRealtime(false);
        }
    }
    

    function savePolldata(){
              
        axios.post(
            "https://j6a304.p.ssafy.io/api/polls/admin",
            {
                "candidateDtos": nomiList,
                "content":pollDescribe,
                "endDate":pollEnd,
                "openStatus": pollRealtime,
                "startDate":pollStart,
                "thumbnail":pollImage,
                "title":pollName
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "Accept" : "*/*",
                },
            }
        )
        .then((res) =>{
            Swal.fire({
                title: '투표가 생성되었습니다.',
                icon: 'success'                        
            })
        })
        .then(()=>{
            navigate("/admin");
        })
        .catch(error => {
        });

        
    }

    return (
        <div>
              <NewNav  />
            <div className={styles.title}> CREATE A POLL </div>
            
            <div className={styles.container} style={{marginBottom: "1vw"}}>
                <div id={styles.info}> POLL&nbsp;&nbsp;INFORMATION </div>
                <img id={styles.logo} src={logo} alt="logo" /> 
                <div id={styles.box1}></div>
                <div id={styles.box2}>
                    {pollImage === "" && (
                        <img src={nonono} alt="noimage" id={styles.no_image} />
                        )}
                    {pollImage !== "" && (
                        <img src={pollImage} alt="pollimage" id={styles.poll_image} />
                        )}
                    <div id={styles.poll_title}>
                        <span id={styles.input_name3}>Poll Title</span>
                        <TextField id={styles.title_input}
                        onChange={changePollName} 
                        variant="standard" placeholder="투표 이름을 입력하세요."/>
                    </div>
                    <div id={styles.poll_title2}>
                        <span id={styles.input_name}>Main Image</span>
                        <TextField id={styles.title_input}
                        onChange={changeUrl}
                        variant="standard" placeholder="이미지 주소를 입력하세요."/>
                    </div>
                    <div id={styles.poll_title3}>
                        <span id={styles.input_name2}> Deadline </span>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            id={styles.datepick}
                            label="투표 시작일"
                            value={pollStart}
                            onChange={changePollStart}
                            inputFormat={"yyyy-MM-dd HH:mm"}
                            mask={"____-__-__"}
                            renderInput={(params) => <TextField {...params} />}/>
                        &nbsp;&nbsp;&nbsp;
                        <DateTimePicker
                            id={styles.datepick}
                            label="투표 종료일"
                            value={pollEnd}
                            onChange={changePollEnd}
                            inputFormat={"yyyy-MM-dd HH:mm"}
                            mask={"____-__-__"}
                            renderInput={(params) => <TextField {...params} />}/>
                        </LocalizationProvider>
                    </div>
                    <div id={styles.poll_title4}>
                        <span id={styles.input_name4}> Poll Option </span>
                    
                        <div id={styles.check_div}>
                                <input id={styles.poll_input3} type="checkbox" value="now"
                                onChange={changepollRealtime}/> 
                                <span id={styles.check_text}>실시간 투표 수 공개</span>
                        </div>
                    </div>
                    <div id={styles.poll_title5}>
                        <span id={styles.input_name5}> Description </span>
                        <TextField
                            id={styles.poll_input2}
                            multiline
                            rows={4}
                            onChange={changepollDescribe}
                            placeholder="투표에 대한 설명을 입력하세요."
                            />
                    </div>
                    <div id={styles.poll_title6}> <span id={styles.input_name6}>Candidate Registration</span> </div> 
                </div>

                <NomineeInput onAdd={onAdd} current={current} isEdit={isEdit} onUpdate={onUpdate}/>
                <NomineeList nomiList={nomiList} onDel={onDel} onEdit={onEdit}/>
                
                <div id={styles.poll_savebox}>
                    <button id={styles.poll_save2} onClick={()=>{
                        if (pollImage !=='' || pollName !=='' || pollStart !==''){
                            savePolldata();
                        } else {
                            Swal.fire({
                                title: '투표 정보를 입력해주세요.',
                                icon: 'error'                        
                            })
                        }
                    }}>투표 생성하기</button>
                    <Link to="/admin" id={styles.poll_back2}> <span>돌아가기</span></Link>

                </div>
            </div>

        <Footer></Footer>
        </div>
    );
}

export default CreatePoll;