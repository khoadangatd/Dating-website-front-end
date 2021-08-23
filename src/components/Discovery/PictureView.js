import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actions from '../../actions'
const PictureView = (props) => {
    const { pictures, socket, removeUserOther, other, me, dialog } = props;
    const [view, setview] = useState(null);
    const dispatch = useDispatch();
    var index = useRef(0);
    function changePicture(value) {
        if (!pictures) return;
        index.current += parseInt(value);
        if (index.current === pictures.data.length)
            index.current = 0;
        if (index.current < 0)
            index.current = pictures.data.length - 1;
        setview("http://localhost/images/" + pictures.data[index.current].src);
    }
    function onHandleReport() {
        if(!dialog) return;
        dialog();
    }
    useEffect(() => {
        if (!pictures || pictures.data.length < 1) return;
        setview("http://localhost/images/" + pictures.data[index.current].src);
    }, [pictures])
    // Socket
    function handleInteract(data) {
        if (socket) {
            if (data) {
                socket.emit("like", {
                    _idother: other._id,
                    name: me.data.name,
                    liked: me.data.liked
                });
                dispatch(actions.interactUser(other._id, "like"))
            }
            else {
                socket.emit("unlike", {
                    _idother: other._id,
                });
                dispatch(actions.interactUser(other._id, "unlike"))
            }
        }
    }
    function renderVideo() {
        var rs = null;
        if (!view) return;
        if (view.includes(".mp4")) {
            rs = <video className="discovery__user--video" loop autoPlay key={`${view}`}>
                <source src={`${view}`} type="video/mp4"></source>
            </video>
        }
        return rs;
    }
    return pictures && (
        <div class="discovery__user--image" style={{ backgroundImage: `url("${view}"` }}>
            {renderVideo()}
            {pictures.data.length > 1 ?
                <button class="discovery__user--button discovery__user--button--left" onClick={() => changePicture(-1)}>
                    <i class="fas fa-chevron-left"></i>
                </button> : ""}
            {pictures.data.length > 1 ?
                <button class="discovery__user--button discovery__user--button--right" onClick={() => changePicture(1)}>
                    <i class="fas fa-chevron-right"></i>
                </button> : ""}
            <div class="discovery__user--button-main">
                <div className="discovery__user--image--info--tablet-mobile">
                    <div className="discovery__user--image--info--tablet-mobile__name">
                        <h1 class="discovery__info--name" style={{ color: "#fff" }}>
                            {other.name},{other.age} tuổi
                        </h1>
                        <p class="discovery__info--detail" style={{ color: "#fff" }}>
                            {other.city}
                        </p>
                    </div>
                </div>
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
