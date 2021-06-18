import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './messenger.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Messenger = (props) => {
    let { slug } = useParams();
    const { socket } = props;
    const [online, setonline] = useState([]);
    const user = useSelector(state => state.user);
    socket.on("online", (user) => {
        setonline(user);
    })
    function handleRenderListChatUser() {
        var result = null;
        if (user) {
            result = user.match.map((match, index) => {
                return (
                    <li className="messenger--user__item">
                        <div className="messenger--user__item-avatar">
                            <img src={match.avatar} alt="avatar" className="messenger--user__item-avatar--img"></img>
                            <div class={`messenger--user__item-avatar-circle ${online.indexOf(match.email||match.IdFace)>0?"user__item-avatar-circle--online":"user__item-avatar-circle--offline"}`}></div>
                        </div>
                        <div className="messenger--user__item__detail">
                            <p class="messenger--user__item__detail--name">{match.name}</p>
                            <p class="messenger--user__item__detail--content">Bạn:Mày bị ngáo hả</p>
                        </div>
                    </li>
                )
            })
        }
        return result;
    }
    return (
        <div className="main">
            <div className="board">
                <div className="board--main messenger--main">
                    <div className="messenger--left">
                        <h2 className="messenger--title">Chat</h2>
                        <div className="messenger--user-search">
                            <i className="fas fa-search"></i>
                            <input placeholder="Tìm kiếm" className="messenger--user-search--main"></input>
                        </div>
                        <ul className="messenger--user">
                            {handleRenderListChatUser()}
                        </ul>
                    </div>
                    <div className="messenger--right">
                        <div className="messenger--user__item">
                            <div className="messenger--user__item-avatar">
                                <img src="https://scontent-sin6-3.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=1-3&_nc_sid=12b3be&_nc_ohc=yR5clup7cjYAX-u45OQ&_nc_ht=scontent-sin6-3.xx&tp=27&oh=ee5533f7f69cbe6b86c995be5b827ae9&oe=60C97DB8" alt="avatar" className="messenger--user__item-avatar--img"></img>
                                <div class="messenger--user__item-avatar-circle user__item-avatar-circle--online"></div>
                            </div>
                            <div className="messenger--user__item__detail">
                                <p className="messenger--user__item__detail--name">Võ Nguyễn Khoa Đăng</p>
                                <p className="messenger--user__item__detail--content">Đang hoạt động</p>
                            </div>
                        </div>
                        <div className="messenger-content">
                            <div className="messenger-content--main messenger-content--main--left">
                                <img src="https://scontent-sin6-3.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=1-3&_nc_sid=12b3be&_nc_ohc=yR5clup7cjYAX-u45OQ&_nc_ht=scontent-sin6-3.xx&tp=27&oh=ee5533f7f69cbe6b86c995be5b827ae9&oe=60C97DB8" alt="avatar" className="messenger--user__item-avatar--img"></img>
                                <div className="messenger-content--main--detail">Mày là con chó</div>
                            </div>
                            <div className="messenger-content--main messenger-content--main--right">
                                <div className="messenger-content--main--detail">Mày bị ngáo hả</div>
                                <img src="https://scontent-sin6-3.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=1-3&_nc_sid=12b3be&_nc_ohc=yR5clup7cjYAX-u45OQ&_nc_ht=scontent-sin6-3.xx&tp=27&oh=ee5533f7f69cbe6b86c995be5b827ae9&oe=60C97DB8" alt="avatar" className="messenger--user__item-avatar--img"></img>
                            </div>
                        </div>
                        <div className="messenger-chat-input">
                            <input className="messenger-chat-input--main" placeholder="Aa"></input>
                            <i class="fas fa-location-arrow"></i>
                            {/* <button className="messenger-chat-input--submit">Gửi</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


Messenger.propTypes = {

};


export default Messenger;
