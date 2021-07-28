import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import callApi from '../../helper/axiosClient';
import * as actions from '../../actions/index';
import UpdatePicture from './../../components/Profile/UpdatePicture';
import Modal from './../../components/Modal/Modal';
import Criteria from './../../components/Profile/Criteria';
import AboutMe from './../../components/Profile/AboutMe';

const Profile = () => {
    const user = useSelector(state => state.user);
    const [modal, setmodal] = useState(false);
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
                            <Link to="setting">
                                <button class="btn-board"><i class="fas fa-cog"></i></button>
                            </Link>
                            <button class="btn-board" onClick={() => setmodal(true)}><i class="fas fa-user"></i></button>
                        </div>
                    </div>
                    <UpdatePicture user={user}></UpdatePicture>
                    <Criteria user={user}></Criteria>
                    <AboutMe user={user}></AboutMe>
                </div>
            </div>
            {modal ? <Modal dismodal={handleDismodal} user={user}></Modal> : ""}
        </div>
    );
};


Profile.propTypes = {

};


export default Profile;
