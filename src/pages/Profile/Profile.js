import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import callApi from '../../helper/axiosClient';
import * as actions from '../../actions/index';
import UpdatePicture from './../../components/Profile/UpdatePicture';
import Modal from './../../components/Modal/Modal';
import Criteria from './../../components/Profile/Criteria';
import AboutMe from './../../components/Profile/AboutMe';

const Profile = () => {
    // const dispatch = useDispatch();
    // let history = useHistory();
    const user = useSelector(state => state.user);
    const [modal, setmodal] = useState(false);
    // useEffect(() => {
    //     callApi({
    //         url: `http://localhost/users/login`,
    //         method: "get",
    //     }).then(data => { dispatch(actions.loginUser(data)); })
    //         .catch(() => history.push("/login"));
    // }, []);
    function handleDismodal(data) {
        setmodal(data);
    }
    return user && (
        <div className="main">
            <div className="board">
                <div className="board--main">
                    <div className="board__heading">
                        <div className="board__heading__name">
                            <img src="https://i.stack.imgur.com/l60Hf.png" alt="avatar" class="sidebar--avatar"></img>
                            <h1>{user.data.name}, {user.data.age} tuổi</h1>
                        </div>
                        <div className="board__heading__setting">
                            <button class="btn-board"><i class="fas fa-cog"></i></button>
                            <button class="btn-board" onClick={() => setmodal(true)}><i class="fas fa-user"></i></button>
                        </div>
                    </div>
                    <UpdatePicture user={user}></UpdatePicture>
                    <Criteria user={user}></Criteria>
                    <AboutMe user={user}></AboutMe>
                    {/* <div className="board-category">
                        <h3 className="board-category--title">Công việc & học vấn</h3>
                        <p>Hãy cho mọi người biết thêm về bạn bằng cách điền thông tin về công việc và học vấn</p>
                    </div>
                    <div className="board-category">
                        <h3 className="board-category--title">Vị trí</h3>
                        <p>Bạn đang ở {user.data.city}</p>
                    </div>
                    <div className="board-category">
                        <h3>Tôi ở đây để</h3>
                        <p>Hãy cho mọi người biết thêm về bạn bằng cách điền thông tin về công việc và học vấn</p>
                    </div>
                    <div className="board-category">
                        <h3>Thông tin cá nhân</h3>
                        <p>Hãy cho mọi người biết thêm về bạn bằng cách điền thông tin về công việc và học vấn</p>
                        <h3>Thông tin cá nhân</h3>
                        <p>Hãy cho mọi người biết thêm về bạn bằng cách điền thông tin về công việc và học vấn</p>
                        <h3>Thông tin cá nhân</h3>
                        <p>Hãy cho mọi người biết thêm về bạn bằng cách điền thông tin về công việc và học vấn</p>
                    </div> */}
                </div>
            </div>
            {modal ? <Modal dismodal={handleDismodal} user={user}></Modal> : ""}
        </div>
    );
};


Profile.propTypes = {

};


export default Profile;
