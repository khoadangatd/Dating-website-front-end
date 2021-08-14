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
            setUserLiked(data.data);
            setLoading(false);
        }
        catch {
            toast.error("Có lỗi cơ sở dữ liệu. Vui lòng truy cập lại sau!")
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

    function renderInteract() {
        var rs = null;
        if (loading) {
            rs = 
            (<div className="none-contain">
                <img src={loadingGif} alt="loading" className="loading-gif"></img>
            </div>)
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
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (user)
            getUserLiked();
    }, [user])// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="main">
            <div className="board">
                {renderInteract()}
            </div>
        </div>
    );
};

export default Liked;
