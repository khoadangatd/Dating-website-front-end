import React, { useEffect, useState } from 'react';
import './login.css';
import { Link, Redirect, withRouter } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import callApi from '../../helper/axiosClient';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../actions/index';
import logo from '../../assets/img/LOGO.png';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const Login = (props) => {
    const { setupSocket } = props;
    const user = useSelector(state => state.user);
    const [totalUser, setTotalUser] = useState(null);
    const [form, setform] = useState({
        email: '',
        password: '',
    });
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    // const user = useSelector(state => state.user);
    let history = useHistory();
    const [dispass, setdispass] = useState(false);
    const [forgot,setForgot] = useState('');
    async function getTotalUser() {
        const data = await callApi({
            url: `https://hape-dating.herokuapp.com/users/totalUser/`,
            method: `get`
        });
        setTotalUser(data.total);
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    function onChangeForm(e) {
        var name = e.target.name;
        var value = e.target.value;
        setform({
            ...form,
            [name]: value
        })
    }
    function formatMoney() {
        if (!totalUser) return;
        return (Math.round(totalUser * 100) / 100).toLocaleString();
    }
    const responseFacebook = (response) => {
        callApi({
            url: `https://hape-dating.herokuapp.com/users/loginfb`,
            method: "post",
            data: {
                idFace: response.id,
                name: response.name,
                picture: {
                    type: "avatar",
                    name: "",
                    src: response.picture.data.url,
                },
                authMail: true
            }
        }).then(async (data) => {
            try {
                toast.success(data.message);
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                dispatch(actions.FetchLoginUser());
                history.push("/discovery");
            }
            catch (err) {

            }
        })
            .catch((error) => {
                toast.error(error.response.data.message);
            })
    }
    async function onSubmitForm(e) {
        try {
            e.preventDefault();
            const data = await callApi({
                url: `https://hape-dating.herokuapp.com/users/login`,
                method: "post",
                data: form
            })
            toast.success(data.message);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            dispatch(actions.FetchReceiveNotify());
            dispatch(actions.FetchLoginUser());
            setupSocket();
            history.push("/discovery");
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }
    async function handleSubmitForgotPassword(){
        try{
            await callApi({
                url:`https://hape-dating.herokuapp.com/users/forgot`,
                method:'post',
                data:{
                    email:forgot
                }
            })
            toast.success("Đã gửi mật khẩu về email");
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }
    useEffect(() => {
        getTotalUser();
    }, []);
    return (
        <form class="login-main-form" onSubmit={onSubmitForm}>
            <div class="row">
                <div class="col-lg-6 col-md-6 login-first-intro">
                    <div class="descripttion-quantity-people">
                        <h3 class="quantity-people">{formatMoney()}</h3>
                        <p>người đã tham gia, đăng ký ngay</p>
                    </div>
                    <div class="login-main-form--external">
                        <a href="" class="login-main-form--external-link">
                            <i class="fab fa-google"></i>Google</a>
                        <FacebookLogin
                            appId="1375981766109023"
                            autoLoad={false}
                            fields="name,email,picture"
                            scope="public_profile, email, user_birthday"
                            render={renderProps => (
                                <a href="" class="login-main-form--external-link">
                                    <i class="fab fa-facebook"></i>Facebook</a>
                            )}
                            callback={responseFacebook} />,
                    </div>
                </div>
                <div class="col-lg-6 col-md-6">
                    <img src={logo} alt="" class="login-main-form--logo" />
                    <h1 class="login-main-form--title">Đăng nhập</h1>
                    <h2 class="login-main-form--sub-title">Tiếp tục tới Hape</h2>
                    <input type="email" class="login-main-form--input" name="email" value={form.email} onChange={onChangeForm} placeholder="Email" required />
                    <input type={`${!dispass ? "password" : "text"}`} class="login-main-form--input" name="password" value={form.password} onChange={onChangeForm} placeholder="Mật khẩu" required />
                    <input type="checkbox" name="displaypass" id="displaypass" onClick={() => setdispass(!dispass)} />
                    <label for="displaypass">Hiển thị mật khẩu</label>
                    <div class="login-main-form--forgot-contain">
                        <span class="login-main-form--forgot" onClick={handleClickOpen}>Bạn quên mật khẩu?</span>
                    </div>
                    <div class="login-main-form--submit">
                        <Link to="/register" class="login-main-form--create">Tạo tài khoản</Link>
                        <input type="submit" class="login-main-form--submit__main" value="Đăng nhập"></input>
                    </div>
                    <div class="login-main-form--external login-main-form--external--login">
                        <a href="" class="login-main-form--external-link">
                            <i class="fab fa-google"></i>Google</a>
                        <FacebookLogin
                            appId="1375981766109023"
                            autoLoad={false}
                            fields="name,email,picture"
                            scope="public_profile, email, user_birthday"
                            render={renderProps => (
                                <a href="" class="login-main-form--external-link">
                                    <i class="fab fa-facebook"></i>Facebook</a>
                            )}
                            callback={responseFacebook} />,
                    </div>
                </div>
            </div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Quên mật khẩu</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Hãy nhập email bạn đã đăng ký
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email"
                        type="email"
                        value={forgot}
                        onChange={(e)=>{setForgot(e.target.value)}}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleSubmitForgotPassword} color="primary">
                        Gửi Mail
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default withRouter(Login);
