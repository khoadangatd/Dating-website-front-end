import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './messenger.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useHistory } from 'react-router-dom';
import callApi from '../../helper/axiosClient';
import queryString from 'query-string';
import ListChat from '../../components/Messenger/ListChat'
import MainChat from './../../components/Messenger/MainChat';
import { toast } from 'react-toastify';
import { deleteNotify } from '../../actions/index';
import NoneMessage from '../../components/Messenger/NoneMessage';
import loadingGif from '../../assets/img/loading.gif';
import NoneMain from '../../components/Messenger/NoneMain';
import { useMediaPredicate } from "react-media-hook";

const Messenger = (props) => {
    const { socket } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const { search } = useLocation();
    // id của conversation
    const { idcon } = queryString.parse(search);
    const user = useSelector(state => state.user);
    const [matchers, setmatchers] = useState(null);
    const [matcher, setmatcher] = useState(null);
    const [loading, setLoading] = useState(true);

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
        if (!user || form.conversation.length === 0) return;
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
        return match;
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
        setmatchers(cloneMatchers)
    }

    function renderNone() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(!loading)
            }, 500);
        })
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
                    ></MainChat>)
            }
            else {
                rs.push(
                    <NoneMain></NoneMain>
                )
            }
        }
        else {
            if (loading) {
                rs.push
                    (<div className="none-contain">
                        <img src={loadingGif} className="loading-gif"></img>
                    </div>)
                renderNone().then(a => setLoading(a));
                rs.push(
                    <div className="messenger--right" key="none-main">
                        <img src={loadingGif} className="loading-gif"></img>
                    </div>
                )
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
            .then((data) => setmatchers(data))
    }, [user])

    useEffect(() => {
        handleGetChatPerson();
    }, [matchers, user, idcon])


    useEffect(() => {
        deleteNotifyServer();
        dispatch(deleteNotify("messenger"));
    }, [])

    useEffect(() => {
        if (!socket) return;
        if (!matchers) return;
        socket.on("getMessage", (message) => {
            sendMessage(message);
        })
    }, [socket, matchers])

    return user && (
        <div className="main">
            <div className="board">
                <div className="board--main messenger--main" style={{display:`${loading||!matchers?"block":"flex"}`}}>
                    {renderMessenger()}
                </div>
            </div>
        </div>
    );
};


Messenger.propTypes = {

};


export default Messenger;
