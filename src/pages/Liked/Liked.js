import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './liked.css';
import callApi from '../../helper/axiosClient';
import ItemInteract from '../../components/Interact/ItemInteract';
import { useSelector } from 'react-redux';

const Liked = () => {
    const [userLiked,setUserLiked]=useState(null);
    const user=useSelector(state=>state.user);
    const getUserLiked=async ()=>{
        try{
            const data=await callApi({
                url:`http://localhost/users/likers`,
                method:`POST`,
                data:{
                    liked: user.data.liked
                }
            })
            setUserLiked(data.data);
        }
        catch{
            setTimeout(getUserLiked,3000);
        }
    }
    useEffect(()=>{
        if(user)
            getUserLiked();
    },[user])
    function renderItemInteract(){
        var rs=null;
        rs=userLiked.map((other,index)=>{
            return <ItemInteract other={other} key={index}></ItemInteract>
        })
        return rs;
    }
    return userLiked&&(
        <div className="main">
            <div className="board">
                <div className="board--main">
                    <h2 className="">Đã thích bạn</h2>
                    <div className="interaction row">
                        {renderItemInteract()}
                    </div>
                </div>
            </div>
        </div>
    );
};


Liked.propTypes = {

};


export default Liked;
