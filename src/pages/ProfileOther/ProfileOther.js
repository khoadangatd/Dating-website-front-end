import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import UpdatePicture from './../../components/Profile/UpdatePicture';
import AboutMe from './../../components/Profile/AboutMe';
import Modal from './../../components/Modal/Modal';
import CallApi from '../../helper/axiosClient';

const ProfileOther = () => {
    const { search } = useLocation();
    const [user, setuser] = useState(null);
    // id của conversation
    const { id } = queryString.parse(search);
    const [modal, setmodal] = useState(false);
    function handleDismodal(data) {
        setmodal(data);
    }
    useEffect(() => {
        CallApi({
            url: `https://localhost/users/${id}`,
            method: "get",
        }).then(data => {
            setuser(data);
        });
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    function renderProfileUser() {
        if (!user || user.data.length < 0) {
            setTimeout(function () {
                return (<h1>Không tìm thấy hồ sơ của người này</h1>)
            }, 500)
        }
        else {
            return (
                <div className="board--main">
                    <div className="board__heading">
                        <div className="board__heading__name">
                            <div style={{ backgroundImage: `url("https://localhost/images/${user.data.avatar}")` }} className="sidebar--avatar"></div>
                            <h1 className="board__heading__name--main">{user.data.name}, {user.data.age} tuổi</h1>
                        </div>
                        {/* <div className="board__heading__setting">
                            <button class="btn-board"><i class="fas fa-cog"></i></button>
                            <button class="btn-board" onClick={() => setmodal(true)}><i class="fas fa-user"></i></button>
                        </div> */}
                    </div>
                    <UpdatePicture user={user}></UpdatePicture>
                    <AboutMe user={user}></AboutMe>
                </div>
            )
        }
    }
    return (
        <div className="main">
            <div className="board">
                {renderProfileUser()}
            </div>
            {modal ? <Modal dismodal={handleDismodal} user={user}></Modal> : ""}
        </div>
    );
};

export default ProfileOther;
