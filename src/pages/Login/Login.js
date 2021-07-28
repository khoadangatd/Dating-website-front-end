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

const Login = (props) => {
    const { setupSocket } = props;
    const user = useSelector(state => state.user);
    const [form, setform] = useState({
        email: null,
        password: null,
    });
    const dispatch = useDispatch();
    // const user = useSelector(state => state.user);
    let history = useHistory();
    const [dispass, setdispass] = useState(false);
    // useEffect(() => {
    //     if(user===""){
    //         history.push('/discovery');
    //     }
    // }, []);
    function onChangeForm(e) {
        var name = e.target.name;
        var value = e.target.value;
        setform({
            ...form,
            [name]: value
        })
    }
    const responseFacebook = (response) => {
        callApi({
            url: `http://localhost/users/loginfb`,
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
                url: `http://localhost/users/login`,
                method: "post",
                data: form
            })
            toast.success(data.message);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            dispatch(actions.FetchLoginUser());
            setupSocket();
            history.push("/discovery");
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <form class="login-main-form" onSubmit={onSubmitForm}>
            <div class="row">
                <div class="col-lg-6">
                    <div class="descripttion-quantity-people">
                        <h3 class="quantity-people">100.000 </h3>
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
                <div class="col-lg-6">
                    <img src={logo} alt="" class="login-main-form--logo" />
                    <h1 class="login-main-form--title">Đăng nhập</h1>
                    <h2 class="login-main-form--sub-title">Tiếp tục tới Hape</h2>
                    <input type="email" class="login-main-form--input" name="email" value={form.email} onChange={onChangeForm} placeholder="Email" required />
                    <input type={`${!dispass ? "password" : "text"}`} class="login-main-form--input" name="password" value={form.password} onChange={onChangeForm} placeholder="Mật khẩu" required />
                    <input type="checkbox" name="displaypass" id="displaypass" onClick={() => setdispass(!dispass)} />
                    <label for="displaypass">Hiển thị mật khẩu</label>
                    <div class="login-main-form--forgot-contain">
                        <a href="" class="login-main-form--forgot">Bạn quên mật khẩu?</a>
                    </div>
                    <div class="login-main-form--submit">
                        <Link to="/register" class="login-main-form--create">Tạo tài khoản</Link>
                        <input type="submit" class="login-main-form--submit__main" value="Đăng nhập"></input>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default withRouter(Login);
