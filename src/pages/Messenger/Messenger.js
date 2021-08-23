import React, { useEffect, useState } from 'react';
import './messenger.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import callApi from '../../helper/axiosClient';
import queryString from 'query-string';
import ListChat from '../../components/Messenger/ListChat'
import MainChat from './../../components/Messenger/MainChat';
import { toast } from 'react-toastify';
import { deleteNotify } from '../../actions/index';
import NoneMessage from '../../components/Messenger/NoneMessage';
import loadingGif from '../../assets/img/loading.gif';
import NoneMain from '../../components/Messenger/NoneMain';

const Messenger = (props) => {
    const { socket } = props;
    const dispatch = useDispatch();
    const { search } = useLocation();
    // id của conversation
    const { idcon } = queryString.parse(search);
    const user = useSelector(state => state.user);
    const [matchers, setmatchers] = useState(null);
    const [matcher, setmatcher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socketOff,setSocketOff]=useState(false);
    
    const handleSocketOff=()=>{
        setSocketOff(!socketOff);
    }

    const getConversation = async () => {
        const data = await callApi({
            url: `http://localhost/chats/conversation/`,
            method: "get",
        })
        return data.data;
    };

    const getAllMessageNewest = async (conversation) => {
        var form;
        var data = [];
        for (let i = 0; i < conversation.length; i++) {
            form = await callApi({
                url: `http://localhost/chats/message/newest/${conversation[i]._id}`,
                method: "get",
            })
            data.push(form.data);
        }
        return {
            conversation: conversation,
            messageNewest: data
        }
    }

    const getHandleMatcher = async (form) => {
        console.log(form);
        if (!user || form.conversation.length === 0) {
            setLoading(false);
            return;
        }
        const data = await callApi({
            url: `http://localhost/users/matchers`,
            method: "post",
            data: {
                match: user.data.match
            }
        })
        var i = 0;
        // Cần thêm chức năng sort conversation theo thời gian nhắn tin
        var temp;
        var match = data.data.map((matcher, index) => {
            temp = {
                ...matcher,
                conversation: form.conversation[i],
                messageNewest: form.messageNewest[i] ? {
                    ...form.messageNewest[i],
                    createdAt: new Date(form.messageNewest[i].createdAt)
                }
                    : {
                        sender: user.data._id,
                        text: "Hãy gửi lời xin chào",
                        createdAt: new Date(form.conversation[i].createdAt)
                    },
            }
            i++;
            return temp;
        })
        // Xử lý khi vào trang message sẽ auto chuyển đến trang có query string
        // history.push(`/messenger?idcon=${match[0].conversation._id}`)
        setmatchers(match);
        setLoading(false);
    };

    function handleGetChatPerson() {
        if (!matchers) return;
        setmatcher(matchers.find((matcher) => idcon === matcher.conversation._id));
    }

    async function deleteNotifyServer() {
        try {
            await callApi({
                url: `http://localhost/replies/notify/messenger`,
                method: `delete`
            })
        }
        catch (error) {
            toast.error("Có lỗi hệ thống vui lòng truy cập lại sau");
        }
    }

    function sendMessage(message) {
        let cloneMatchers = [...matchers];
        let index = cloneMatchers.findIndex((match) => match.conversation._id === message.idconversation);
        cloneMatchers[index].messageNewest = {
            sender: message.sender,
            text: message.text,
            createdAt: new Date(),
        }
        setmatchers(cloneMatchers);
    }

    function renderMessenger() {
        var rs = [];
        if (matchers) {
            rs.push(
                <ListChat
                    user={user}
                    matchers={matchers}
                    socket={socket}
                    idcon={idcon}
                    key="list-chat"
                ></ListChat>)
            if (idcon && matcher) {
                rs.push(
                    <MainChat
                        key="main-chat"
                        user={user}
                        matcher={matcher}
                        socket={socket}
                        idcon={idcon}
                        sendMessage={sendMessage}
                        socketOff={handleSocketOff}
                    ></MainChat>)
            }
            else {
                rs.push(
                    <NoneMain
                        key="none-main"
                    ></NoneMain>
                )
            }
        }
        else {
            if (loading) {
                rs.push
                    (<div className="none-contain" key="none-main">
                        <img src={loadingGif} alt="loading" className="loading-gif"></img>
                    </div>)
            }
            else {
                rs = <NoneMessage></NoneMessage>
            }
        }
        return rs;
    }

    useEffect(() => {
        getConversation()
            .then((data) => getAllMessageNewest(data))
            .then((data) => getHandleMatcher(data))
    }, [user])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        handleGetChatPerson();
    }, [matchers, user, idcon])// eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {
        deleteNotifyServer();
        dispatch(deleteNotify("messenger"));
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!socket) return;
        if (!matchers) return;
        socket.on("getMessage", (message) => {
            sendMessage(message);
        })
    }, [socket, matchers,socketOff])// eslint-disable-line react-hooks/exhaustive-deps

    return user && (
        <div className="main">
            <div className="board board-message">
                <div className="board--main messenger--main" style={{ display: `${loading || !matchers ? "block" : "flex"}` }}>
                    {renderMessenger()}
                </div>
            </div>
        </div>
    );
};

export default Messenger;
