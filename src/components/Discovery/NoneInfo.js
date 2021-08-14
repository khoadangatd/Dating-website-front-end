import React from 'react';
import lamp from '../../assets/img/lamp.jpg'

const NoneInfo = () => {
    return (
        <div className="none-contain">
            <div className="none">
                <p className="none-main-content">
                    Không tìm thấy người phù hợp.
                </p>
                <p className="none-sub-content">
                    Hãy lựa chọn lại tiêu chí của bạn!
                </p>
                <img src={lamp} alt="lamp" className="none-image"></img>
            </div>
        </div>
    );
};

export default NoneInfo;
