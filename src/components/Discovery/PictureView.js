import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actions from  '../../actions'
const PictureView = (props) => {
    const { pictures, socket, removeUserOther, other,me,dialog } = props;
    const [view, setview] = useState(null);
    const dispatch = useDispatch();
    console.log(pictures);
    var i = 0;
    if (pictures) {
        i = pictures.data.findIndex(picture => picture.type === "main")
    }
    var index = useRef(i);
    console.log(index.current);
    function changePicture(value) {
        if (!pictures) return;
        index.current += parseInt(value);
        if (index.current === pictures.data.length)
            index.current = 0;
        if (index.current < 0)
            index.current = pictures.data.length - 1;
        setview("http://localhost/images/" + pictures.data[index.current].src);
    }
    function onHandleReport(){
        dialog();
    }
    useEffect(() => {
        if(!pictures) return;
        if (pictures.data.length > 0&&pictures) {
            var pic = pictures.data.find(picture => picture.type === "main");
            setview("http://localhost/images/" + pic.src);
        }
        else {
            setview(null);
        }
    }, [pictures])
    // Socket
    function handleInteract(data) {
        if(socket){
            if (data){
                socket.emit("like", {
                    _idother:other._id,
                    name:me.data.name,
                    liked:me.data.liked
                });
            }
            else{
                socket.emit("unlike", other._id);
            }
            dispatch(actions.FetchLoginUser())
        }
    }
    return pictures&&(
        <div class="discovery__user--image" style={{ backgroundImage: `url("${view}"` }}>
            {pictures.data.length > 1 ?
                <button class="discovery__user--button discovery__user--button--left" onClick={() => changePicture(-1)}>
                    <i class="fas fa-chevron-left"></i>
                </button> : ""}
            {pictures.data.length > 1 ?
                <button class="discovery__user--button discovery__user--button--right" onClick={() => changePicture(1)}>
                    <i class="fas fa-chevron-right"></i>
                </button> : ""}
            <div class="discovery__user--button-main">
                <button class="discovery__user--button-main--detail btn-discovery-like"
                    onClick={() => {
                        handleInteract(true);
                        removeUserOther();
                    }}
                >
                    <i class="fas fa-heart"></i>
                </button>
                <button class="discovery__user--button-main--detail btn-discovery-unlike"
                    onClick={() => {
                        handleInteract(false);
                        removeUserOther();
                    }}
                >
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <button class="discovery__user--button--report" onClick={onHandleReport}>
                <i class="fas fa-flag"></i>
            </button>
        </div>
    );
};

export default PictureView;
