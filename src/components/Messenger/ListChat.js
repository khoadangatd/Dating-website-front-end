import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function sortMatch(matchers){
    for(let i=0;i<matchers.length-1;i++){
        for(let j=i+1;j<matchers.length;j++){
            if(matchers[i].messageNewest.createdAt.getTime()<matchers[j].messageNewest.createdAt.getTime()){
                let temp=matchers[i];
                matchers[i]=matchers[j];
                matchers[j]=temp;
            }
        }
    }
}
const ListChat = (props) => {
    const { matchers, user, idcon } = props;
    const online = useSelector(state => state.online);
    const [viewList,setViewList]=useState(null);
    const [search,setSearch]= useState("");
    function handleOnline(match) {
        if (!online) return;
        if (online.length > 0) {
            for (let i = 0; i < online.length; i++) {
                if (match._id === online[i]._id)
                    return true;
            }
            return false;
        }
    }
    function handleRenderListChatUser() {
        var result = null;
        if (viewList) {
            sortMatch(viewList);
            result = viewList.map((match, index) => {
                return (
                    <Link to={`/messenger?idcon=${match.conversation._id}`} className={`${match.conversation._id == idcon ? "messenger--user__item--active" : ""} messenger--user__item`} key={match._id}>
                        <div className="messenger--user__item-avatar">
                            <div style={{ backgroundImage: `url("http://localhost/images/${match.avatar}")` }} className="sidebar--avatar"></div>
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
    function onSearchList(e){
        if(!matchers) return;
        setSearch(e.target.value);
        let newView=matchers.filter(match=>{
            return match.name.toLowerCase().indexOf(e.target.value.toLowerCase())!==-1;
        })
        setViewList(newView);
    }

    useEffect(()=>{
        setViewList(matchers);
    },[matchers])

    return (
        <div className={`messenger--left ${idcon?"messenger--left-none":""}`}>
            <h2 className="messenger--title">Chat</h2>
            <div className="messenger--user-search">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm kiếm" className="messenger--user-search--main" onChange={onSearchList} value={search}></input>
            </div>
            <ul className="messenger--user">
                {handleRenderListChatUser()}
            </ul>
        </div>
    );
};

export default ListChat;
