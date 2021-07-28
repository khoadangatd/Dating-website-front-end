import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './messenger.css';
import { useSelector } from 'react-redux';
import { Link, useLocation, useHistory } from 'react-router-dom';
import callApi from '../../helper/axiosClient';
import queryString from 'query-string';
import ListChat from '../../components/Messenger/ListChat'
import MainChat from './../../components/Messenger/MainChat';

const Messenger = (props) => {
    const { socket } = props;
    const history = useHistory();
    const { search } = useLocation();
    // id của conversation
    const { idcon } = queryString.parse(search);
    const user = useSelector(state => state.user);
    const [matchers, setmatchers] = useState(null);
    const [matcher, setmatcher] = useState(null);
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
                messageNewest: form.messageNewest[i] || {
                    sender: user.data._id,
                    text: "Hãy gửi lời xin chào"
                },
            }
            i++;
            return temp;
        })
        // Xử lý khi vào trang message sẽ auto chuyển đến trang có query string
        history.push(`/messenger?idcon=${match[0].conversation._id}`)
        return match;
    };

    function handleGetChatPerson() {
        if (!matchers || !user) return;
        setmatcher(matchers.find((matcher) => idcon === matcher.conversation._id));
    }

    useEffect(() => {
        getConversation()
            .then((data) => getAllMessageNewest(data))
            .then((data) => getHandleMatcher(data))
            .then((data) => setmatchers(data))
    }, [user])

    useEffect(() => {
        handleGetChatPerson();
    }, [matchers, user,idcon])

    return user && (
        <div className="main">
            <div className="board">
                {idcon ?
                    <div className="board--main messenger--main">
                        <ListChat user={user} matchers={matchers} socket={socket} idcon={idcon}></ListChat>
                        <MainChat user={user} matcher={matcher} socket={socket} idcon={idcon}></MainChat>
                    </div>
                    : "Bạn quá xấu nến chưa có ai match để nhắn tin"}
            </div>
        </div>
    );
};


Messenger.propTypes = {

};


export default Messenger;
