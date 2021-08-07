import React from 'react';
import heartBlue from '../../assets/img/heartbluee.gif'

const NoneInteract = () => {
    return (
        <div className="none-contain">
            <div className="none">
                <p className="none-main-content">
                    Hãy tích cực tìm kiếm để tìm ra người ấy
                </p>
                <p className="none-sub-content">
                    Khám phá ngay!
                </p>
                <img src={heartBlue} className="none-image"></img>
            </div>
        </div>
    );
};

export default NoneInteract;
