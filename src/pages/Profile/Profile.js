import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import callApi from '../../helper/axiosClient';
import UpdatePicture from './../../components/Profile/UpdatePicture';
import Modal from './../../components/Modal/Modal';
import Criteria from './../../components/Profile/Criteria';
import AboutMe from './../../components/Profile/AboutMe';
import { toast } from 'react-toastify';
import './profile.css';
import { FetchLoginUser } from '../../actions';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const Profile = () => {
    const user = useSelector(state => state.user);
    const [modal, setmodal] = useState(false);
    const [open, setOpen] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const pictureAvatar = useRef(null);
    const dispatch = useDispatch();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    function handleDismodal(data) {
        setmodal(data);
    }
    function onUpdateAvatar(e) {
        var picUpload = {
            file: e.target.files[0],
            name: e.target.files[0].name
        }
        // Byte->Megabyte
        var maxsize = e.target.files[0].size / (1000 * 1000);
        if (maxsize > 8) {
            toast.error("Vui lòng chọn file nhỏ hơn 8 MB");
            return;
        }
        setAvatar(picUpload);
        pictureAvatar.current.style.backgroundImage = `url('${URL.createObjectURL(e.target.files[0])}`;
    }
    async function onSubmitUpdateAvatar() {
        const formData = new FormData();
        formData.append('image', avatar.file);
        formData.append('name', avatar.name);
        try {
            await callApi({
                url: `http://localhost/users/uploadAvatar`,
                method: "put",
                data: formData,
            })
            toast.success("Cập nhật ảnh đại diện thành công");
            dispatch(FetchLoginUser());
        }
        catch {
            toast.error("Ảnh của bạn không đúng định dạng");
        }
    }
    return user && (
        <div className="main">
            <div className="board">
                <div className="board--main">
                    <div className="board__heading">
                        <div className="board__heading__name">
                            <div
                                style={{ backgroundImage: `url("http://localhost/images/${user.data.avatar}")` }}
                                className="sidebar--avatar update-avatar"
                                onClick={handleClickOpen}
                                title="Chỉnh sửa ảnh đại diện"
                            ></div>
                            <h1 className="board__heading__name--main">{user.data.name}, {user.data.age} tuổi</h1>
                        </div>
                        <div className="board__heading__setting">
                            <Link to="setting">
                                <button className="btn-board"><i className="fas fa-cog"></i></button>
                            </Link>
                            <button className="btn-board" onClick={() => setmodal(true)}><i className="fas fa-user"></i></button>
                        </div>
                    </div>
                    <UpdatePicture user={user}></UpdatePicture>
                    <Criteria user={user}></Criteria>
                    <AboutMe user={user}></AboutMe>
                </div>
            </div>
            {modal ? <Modal dismodal={handleDismodal} user={user}></Modal> : ""}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Chỉnh sửa ảnh đại diện của bạn</DialogTitle>
                <DialogContent>
                    <div className="row">
                        <div className="col-lg-6">
                            <h3 className="perform-update-avatar--h3">Ảnh đại diện</h3>
                            <div
                                ref={pictureAvatar}
                                style={{ backgroundImage: `url("http://localhost/images/${user.data.avatar}")` }}
                                className="sidebar--avatar perform-update-avatar"
                                title="Chỉnh sửa ảnh đại diện"
                            ></div>
                        </div>
                        <div className="col-lg-6">
                            <h3 className="perform-update-avatar--h3">Ảnh chỉnh sửa</h3>
                            <input type="file" name="image" id="upload-avatar" onChange={onUpdateAvatar} style={{ display: "none" }}></input>
                            <label htmlFor="upload-avatar" className="profile-update-avatar">
                                <div className="profile-update-avatar--detail" >
                                    <i className="fas fa-camera"></i>
                                    <p>Chọn ảnh đại diện</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={onSubmitUpdateAvatar} color="primary" autoFocus>
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};


Profile.propTypes = {

};


export default Profile;
