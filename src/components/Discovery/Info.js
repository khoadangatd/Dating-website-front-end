import React from 'react';

const Info = (props) => {
    const {user}=props;
    return (
        <div className="discovery__info">
            <h1 class="discovery__info--name">{user.name},{user.age} tuổi</h1>
            <p class="discovery__info--detail">{user.city}</p>
            <h3 className="discovery__info-category--title">Về tôi</h3>
            <p class="discovery__info--detail">{user.aboutme||"Không có gì về bản thân"}</p>
            <h3 className="discovery__info-category--title">Thông tin cá nhân</h3>
            <p class="discovery__info--detail">Về hôn nhân: {user.marriage||"Chưa cập nhật"}</p>
            <p class="discovery__info--detail">Chiều cao: {user.height||"Chưa cập nhật"}</p>
            <p class="discovery__info--detail">Hút thuốc: {user.smoking||"Chưa cập nhật"}</p>
            <p class="discovery__info--detail">Rượu bia: {user.liquor||"Chưa cập nhật"}</p>
        </div>
    );
};

export default Info;
