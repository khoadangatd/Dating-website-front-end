import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import callApi from '../../helper/axiosClient';
import ScrollToBottom from 'react-scroll-to-bottom';
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import { Link } from 'react-router-dom';

const MainChat = (props) => {
    const { matcher, user, socket, idcon, sendMessage, socketOff } = props;
    const online = useSelector(state => state.online);
    const [text, settext] = useState('');
    const [messages, setmessages] = useState([]);
    const [openEmoji, setOpenEmoji] = useState(false);
    function handleOnline() {
        if (!online) return;
        if (online.length > 0) {
            for (let i = 0; i < online.length; i++) {
                if (matcher._id === online[i]._id)
                    return true;
            }
            return false;
        }
    }

    function onHandleChange(e) {
        settext(e.target.value);
    }

    function onClickEmoji(e, emoji) {
        settext(text + emoji.emoji);
    }

    const getMessage = async () => {
        const data = await callApi({
            url: `https://hape-dating.herokuapp.com/chats/message/${idcon}`,
            method: "get"
        })
        setmessages(data.data);
    }
    
    useEffect(() => {
        if (!socket) return;
        socket.on("getMessage", (message) => {
            if (message.idconversation === idcon) {
                setmessages([...messages, message]);
            }
        })
        return ()=>{
            socket.off('getMessage')
            socketOff();
        };
    }, [socket, messages])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getMessage();
    }, [idcon])// eslint-disable-line react-hooks/exhaustive-deps

    function renderMessage() {
        var rs = null;
        if (messages.length > 0) {
            rs = messages.map((message, index, arr) => {
                if (message.sender === user.data._id)
                    return (
                        <div className="messenger-content--main messenger-content--main--right" key={message._id}>
                            <div className="messenger-content--main--detail messenger-content--main--detail--user">
                                {message.text}
                                <div className="messenger-content--main--detail--user__time">
                                    {`${new Date(message.createdAt).getDate()}/${new Date(message.createdAt).getMonth()}/${new Date(message.createdAt).getFullYear()} 
                                    ${new Date(message.createdAt).getUTCHours()}:${new Date(message.createdAt).getUTCMinutes()}`}
                                </div>
                            </div>
                            {/* <div style={{ backgroundImage: `url("https://hape-dating.herokuapp.com/images/${user.data.avatar}")` }} className="sidebar--avatar"></div> */}
                        </div>
                    )
                else
                    return (
                        <div className="messenger-content--main messenger-content--main--left" key={message._id}>
                            {arr[index - 1] && arr[index - 1].sender !== user.data._id ?
                                <div className="messenger--user__item-avatar--img"></div>
                                : <div style={{ backgroundImage: `url("https://hape-dating.herokuapp.com/images/${matcher.avatar}")` }} className="messenger--user__item-avatar--img"></div>
                            }
                            <div className="messenger-content--main--detail messenger-content--partner--detail--user">
                                {message.text}
                                <div className="messenger-content--partner--detail--user__time">
                                    {`${new Date(message.createdAt).getDate()}/${new Date(message.createdAt).getMonth()}/${new Date(message.createdAt).getFullYear()} 
                                    ${new Date(message.createdAt).getUTCHours()}:${new Date(message.createdAt).getUTCMinutes()}`}
                                </div>
                            </div>
                        </div>
                    )
            })
        }
        return rs;
    }

    function onHandleSubmit(e) {
        e.preventDefault();
        if (text.trim() === '') return;
        setmessages([...messages, {
            idconversation: idcon,
            sender: user.data._id,
            text: text,
            createdAt: new Date()
        }])
        settext("");
        setOpenEmoji(false);
        if (socket) {
            socket.emit("sendMessage", {
                idconversation: idcon,
                text: text,
                createdAt: new Date()
            }, matcher._id)
        }
        else {
            toast.error("Có lỗi xảy ra");
        }
        sendMessage({
            idconversation: idcon,
            text,
            sender: user.data._id,
        });
    }

    return matcher && (
        <div className="messenger--right">
            <Link to={`/profileOther?id=${matcher._id}`} className="messenger--user__item messenger--user__item--main-chat">
                <div style={{ display: "flex" }}>
                    <div className="messenger--user__item-avatar">
                        <div style={{ backgroundImage: `url("https://hape-dating.herokuapp.com/images/${matcher.avatar}")` }} className="messenger--user__item-avatar--img"></div>
                        <div class={`messenger--user__item-avatar-circle ${handleOnline() ? "user__item-avatar-circle--online" : "user__item-avatar-circle--offline"}`}></div>
                    </div>
                    <div className="messenger--user__item__detail">
                        <p className="messenger--user__item__detail--name">{matcher.name}</p>
                        <p className="messenger--user__item__detail--content">{!handleOnline() ? "Không hoạt động" : "Đang hoạt động"}</p>
                    </div>
                </div>
                <div>
                    <Link to="/messenger" className="messenger-mobile-turn-back">
                        <i class="fas fa-undo"></i>
                    </Link>
                </div>
            </Link>
            <ScrollToBottom initialScrollBehavior="auto" className="messenger-content">
                {renderMessage()}
            </ScrollToBottom>
            <form className="messenger-chat-input" onSubmit={onHandleSubmit}>
                <input className="messenger-chat-input--main" placeholder="Aa" value={text} onChange={onHandleChange}></input>
                <div className="messenger-chat-input-contain-icon">
                    <div className="messenger-chat-input-icon-emoji-contain">
                        <i class="fas fa-smile" onClick={() => setOpenEmoji(!openEmoji)}></i>
                        {openEmoji ?
                            <div className="messenger-chat-input-icon-emoji--contain__main">
                                <Picker
                                    onEmojiClick={onClickEmoji}
                                    disableAutoFocus={true}
                                    skinTone={SKIN_TONE_MEDIUM_DARK}
                                    groupNames={{ smileys_people: "PEOPLE" }}
                                    native
                                />
                            </div>
                            :
                            ""
                        }
                    </div>
                    <button type="submit" className="messenger-chat-input-icon-submit">
                        <i class="fas fa-location-arrow"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MainChat;
