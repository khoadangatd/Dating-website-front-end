import React, { useEffect, useRef, useState } from 'react';
import './discovery.css';
import { useSelector, useDispatch } from 'react-redux';
import callApi from '../../helper/axiosClient';
import Info from './../../components/Discovery/Info';
import PictureView from './../../components/Discovery/PictureView';
import NoneInfo from './../../components/Discovery/NoneInfo';

const Discovery = (props) => {
    const { socket } = props;
    const [userOther, setuserOther] = useState([]);
    const [images, setimages] = useState([]);
    const user = useSelector(state => state.user);
    socket.on("like",function(){

    })
    const findPartner = async () => {
        const userFind = await callApi({
            url: `http://localhost/users/findUser`,
            method: "post",
            data: {
                setting: user.data.setting,
                unlike: user.data.unlike,
                like: user.data.like,
            }
        })
        return userFind.data;
    }
    const getPicture = async (data) => {
        var temp = [];
        for (let i = 0; i < data.length; i++) {
            var form = await callApi({
                url: `http://localhost/pictures/${data[i]._id}`,
                method: "get",
            })
            temp.push(form);
        }
        setimages(temp);
        setuserOther(data);
    }
    useEffect(() => {
        if (user) {
            findPartner().then((data) => getPicture(data));
        }
    }, [user]);
    function renderInfo() {
        if (userOther.length > 0) {
            console.log("chạy thằng này");
            return (
                <div className="discovery--main">
                    <PictureView pictures={images[0]}></PictureView>
                    <Info user={userOther[0]}></Info>
                </div>
            )
        }
        else {
            return (
                <NoneInfo></NoneInfo>
            )
        }
    }
    return (
        <div className="main">
            <div className="board">
                {renderInfo()}
            </div>
        </div>
    );
};


export default Discovery;
