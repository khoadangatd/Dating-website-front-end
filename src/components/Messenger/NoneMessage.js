import React from 'react';
import message from '../../assets/img/none-message.png'

const NoneMessage = () => {
    return (
        <div className="none-contain">
            <div className="none">
                <p className="none-main-content">
                    Hãy tích cực tìm kiếm để tìm ra người ấy
                </p>
                <p className="none-sub-content">
                    Khám phá ngay!
                </p>
                <img src={message} className="none-image"></img>
            </div>
        </div>
    );
};

export default NoneMessage;
