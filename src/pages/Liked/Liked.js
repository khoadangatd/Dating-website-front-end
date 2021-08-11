import React, { useEffect, useState } from 'react';
import './liked.css';
import callApi from '../../helper/axiosClient';
import ItemInteract from '../../components/Interact/ItemInteract';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteNotify } from '../../actions/index';
import NoneInteract from '../../components/Interact/NoneInteract';
import loadingGif from '../../assets/img/loading.gif';

const Liked = (props) => {
    const [userLiked, setUserLiked] = useState(null);
    const { socket } = props;
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [noneUser, setNoneUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const getUserLiked = async () => {
        try {
            const data = await callApi({
                url: `https://hape-dating.herokuapp.com/users/likers`,
                method: `POST`,
                data: {
                    liked: user.data.liked
                }
            })
            console.log(data);
            setUserLiked(data.data);
        }
        catch {
            setTimeout(getUserLiked, 3000);
        }
    }

    function renderItemInteract() {
        var rs = null;
        if (!userLiked) return;
        if (userLiked.length > 0) {
            rs = userLiked.map((other, index) => {
                return <ItemInteract other={other} key={index} socket={socket} me={user}></ItemInteract>
            })
        }
        else {
            setNoneUser(true);
        }
        return rs;
    }

    function renderNone() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(false)
            }, 500);
        })
    }

    function renderInteract() {
        var rs = null;
        if (loading) {
            rs = 
            (<div className="none-contain">
                <img src={loadingGif} className="loading-gif"></img>
            </div>)
            renderNone().then(a => setLoading(a));
            return rs;
        }
        if (noneUser) {
            rs = <NoneInteract></NoneInteract>;
        }
        else {
            rs = <div className="board--main">
                <h2 className="">Đã thích bạn</h2>
                <div className="interaction row">
                    {renderItemInteract()}
                </div>
            </div>
        }
        return rs;
    }

    async function deleteNotifyServer() {
        try {
            await callApi({
                url: `https://hape-dating.herokuapp.com/replies/notify/liked`,
                method: `delete`
            })
        }
        catch (error) {
            toast.error("Có lỗi hệ thống vui lòng truy cập lại sau");
        }
    }

    useEffect(() => {
        deleteNotifyServer();
        dispatch(deleteNotify("liked"));
    }, [])

    useEffect(() => {
        if (user)
            getUserLiked();
    }, [user])
    return (
        <div className="main">
            <div className="board">
                {renderInteract()}
            </div>
        </div>
    );
};

export default Liked;
