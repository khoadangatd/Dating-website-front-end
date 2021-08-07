import React from 'react';
import heart from '../../assets/img/heart-mainchat.png'

const NoneMain = () => {
    return (
        <div className="none-contain none-contain--messenger">
            <div className="none">
                <p className="none-main-content none-main-content--main-chat">
                    Hãy lựa chọn người bạn thấy thoải mái để nhắn tin 
                </p>
                <p className="none-sub-content">
                    Chat ngay!
                </p>
                <img src={heart} className="none-image"></img>
            </div>
        </div>
    );
};

export default NoneMain;
