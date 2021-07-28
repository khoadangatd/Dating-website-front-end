import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ListChat = (props) => {
    const {matchers,user,idcon}= props;
    const online = useSelector(state=>state.online);
    function handleOnline(match){
        if(!online) return;
        if(online.length>0){
            for(let i=0;i<online.length;i++){
                if(match._id===online[i]._id)
                    return true;
            }
            return false;
        }
    }
    function handleRenderListChatUser() {
        var result = null;
        if (matchers) {
            result = matchers.map((match, index) => {
                return (
                    <Link to={`/messenger?idcon=${match.conversation._id}`} className={`${match.conversation._id==idcon?"messenger--user__item--active":""} messenger--user__item`} key={match._id}>
                        <div className="messenger--user__item-avatar">
                            <img src={match.avatar||match.avatarD} alt="avatar" className="messenger--user__item-avatar--img"></img>
                            <div class={`messenger--user__item-avatar-circle ${handleOnline(match) ? "user__item-avatar-circle--online" : "user__item-avatar-circle--offline"}`}></div>
                        </div>
                        <div className="messenger--user__item__detail">
                            <p class="messenger--user__item__detail--name">{match.name}</p>
                            <p class="messenger--user__item__detail--content">{user.data._id === match.messageNewest.sender ? "Bạn" : `${match.name}`}:{match.messageNewest.text}</p>
                        </div>
                    </Link>
                )
            })
        }
        return result;
    }
    return (
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
    );
};

export default ListChat;
