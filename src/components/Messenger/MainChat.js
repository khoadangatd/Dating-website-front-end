import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import callApi from '../../helper/axiosClient';
import ScrollToBottom from 'react-scroll-to-bottom';
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";

const MainChat = (props) => {
    const { matcher, user, socket, idcon } = props;
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
        console.log(emoji)
    }

    const getMessage = async () => {
        const data = await callApi({
            url: `http://localhost/chats/message/${idcon}`
        })
        setmessages(data.data);
    }

    useEffect(() => {
        if (!socket) return;
        socket.on("getMessage", (message) => {
            console.log(123);
            setmessages([...messages, message]);
        })
    }, [socket, messages])

    useEffect(() => {
        getMessage();
    }, [idcon])// eslint-disable-line react-hooks/exhaustive-deps

    function renderMessage() {
        var rs = null;
        if (messages.length > 0) {
            rs = messages.map((message, index) => {
                if (message.sender !== user.data._id)
                    return (
                        <div className="messenger-content--main messenger-content--main--left" key={message._id}>
                            <img src={user.data.avatar || user.data.avatarD} alt="avatar" className="messenger--user__item-avatar--img"></img>
                            <div className="messenger-content--main--detail">{message.text}</div>
                        </div>
                    )
                else
                    return (
                        <div className="messenger-content--main messenger-content--main--right" key={message._id}>
                            <div className="messenger-content--main--detail messenger-content--main--detail--user">{message.text}</div>
                            <img src={matcher.avatar || matcher.avatarD} alt="avatar" className="messenger--user__item-avatar--img"></img>
                        </div>
                    )
            })
        }
        return rs;
    }

    function onHandleSubmit(e) {
        e.preventDefault();
        console.log(text);
        if (text.trim() === '') return;
        setmessages([...messages, {
            idconversation: idcon,
            sender: user.data._id,
            text: text,
        }])
        settext("");
        setOpenEmoji(false);
        if (socket) {
            socket.emit("sendMessage", {
                idconversation: idcon,
                text: text
            }, matcher._id)
        }
        else {
            toast.error("Có lỗi xảy ra");
        }
    }

    return matcher && (
        <div className="messenger--right">
            <div className="messenger--user__item">
                <div className="messenger--user__item-avatar">
                    <img src={matcher.avatarD || matcher.avatar} alt="avatar" className="messenger--user__item-avatar--img"></img>
                    <div class={`messenger--user__item-avatar-circle ${handleOnline() ? "user__item-avatar-circle--online" : "user__item-avatar-circle--offline"}`}></div>
                </div>
                <div className="messenger--user__item__detail">
                    <p className="messenger--user__item__detail--name">{matcher.name}</p>
                    <p className="messenger--user__item__detail--content">{!handleOnline() ? "Không hoạt động":"Đang hoạt động"}</p>
                </div>
            </div>
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
                                {/* {chosenEmoji && <EmojiData chosenEmoji={chosenEmoji} />} */}
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
