import React, { useEffect, useState } from 'react';
import callApi from '../../helper/axiosClient';
import ItemInteract from '../../components/Interact/ItemInteract';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteNotify } from '../../actions/index';
import NoneInteract from '../../components/Interact/NoneInteract';
import loadingGif from '../../assets/img/loading.gif';

const Match = () => {
    const [userMatch, setUserMatch] = useState(null);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [loading,setLoading]= useState(true);
    const [noneUser,setNoneUser]= useState(false);
    const getUserMatch = async () => {
        try {
            const data = await callApi({
                url: `http://localhost/users/matchers`,
                method: `POST`,
                data: {
                    match: user.data.match
                }
            })
            setUserMatch(data.data);
            setLoading(false);
        }
        catch (err) {
            toast.error("Có lỗi cơ sở dữ liệu. Vui lòng truy cập lại sau!")
        }
    }

    function renderItemInteract() {
        var rs = null;
        if (!userMatch) return;
        if (userMatch.length > 0) {
            rs = userMatch.map((other, index) => {
                return <ItemInteract other={other} key={index} me={user}></ItemInteract>
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
                <h2 className="">Kết Đôi</h2>
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
                url: `http://localhost/replies/notify/matched`,
                method: `delete`
            })
        }
        catch (error) {
            toast.error("Có lỗi hệ thống vui lòng truy cập lại sau");
        }
    }

    useEffect(() => {
        deleteNotifyServer();
        dispatch(deleteNotify("matched"));
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (user)
            getUserMatch();
    }, [user])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="main">
            <div className="board">
                {renderInteract()}
            </div>
        </div>
    );
}

export default Match;
