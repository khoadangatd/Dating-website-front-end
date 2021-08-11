import React, { useEffect, useState } from 'react';
import './register.css';
import { Link, useHistory } from 'react-router-dom';
import callApi from '../../helper/axiosClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/img/LOGO.png';
import citys from '../../helper/City';

const Register = () => {
    const [form, setform] = useState({
        name:'',
        gender: "Nam",
        age: '',
        email: '',
        phone: '',
        city: '',
        password: '',
        repassword: '',
    });
    let history = useHistory();
    const [dispass, setdispass] = useState(false);
    function onChangeForm(e) {
        var name = e.target.name;
        var value = e.target.value;
        setform({
            ...form,
            [name]: value
        })
    }
    function validateForm() {
        if (form.phone.length < 8) {
            toast.error("Số điện thoại chưa đúng");
            return false;
        }
        if (form.password !== form.repassword) {
            toast.error("Mật khẩu xác nhận không đúng");
            return false;
        }
        if (form.password.length < 6) {
            toast.error("Mật khẩu phải trên 6 ký tự");
            return false;
        }
        return true;
    }
    async function onSubmitForm(e) {
        try {
            e.preventDefault();
            if (validateForm()) {
                const data = await callApi({
                    url: `https://hape-dating.herokuapp.com/users/register`,
                    method: "post",
                    data: {
                        email: form.email,
                        name: form.name,
                        gender: form.gender,
                        age: form.age,
                        phone: form.phone,
                        city: form.city,
                        password: form.password,
                        authMail: false
                    }
                })
                toast.success(data.message);
                toast.success("Truy cập vào Email để kích hoạt tài khoản");
                history.push("/login");
            }
        }
        catch (error) {
            toast.error(error.response.data.message);
            console.log(form);
        }
    }
    function renderFormCity() {
        var rs = null;
        rs = citys.map((city, index) => {
            return (<option className="" value={city}>{city}</option>)
        })
        return rs;
    }
    return (
        <form class="register-main-form" onSubmit={onSubmitForm}>
            <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6">
                    <img src={logo}
                        alt="" class="register-main-form--logo" />
                    <h1 class="register-main-form--title">Tạo tài khoản HAPE</h1>
                    <div class="register-form">
                        <input type="text" class="register-main-form--input" name="name" placeholder="Họ và tên" onChange={onChangeForm} value={form.lastname} required />
                    </div>
                    <div class="register-form--render">
                        <div class="form--input--age">
                            <input type="number" class="register-main-form--input" name="age" value={form.age} onChange={onChangeForm} placeholder="Tuổi" required></input>
                        </div>
                        <div class="register-form--render--main">
                            <div class="form--input--render--detail">
                                <input type="radio" class="form--input--render" name="gender" onChange={onChangeForm} value="Nam" id="render--male" checked />
                                <label for="render--male" >Nam</label>
                            </div>
                            <div class="form--input--render--detail">
                                <input type="radio" class="form--input--render" name="gender" onChange={onChangeForm} value="Nữ" id="render--female" />
                                <label for="render--female">Nữ</label>
                            </div>
                        </div>
                    </div>
                    <div class="register-form">
                        <input type="text" class="register-main-form--input" name="phone" placeholder="Số điện thoại" onChange={onChangeForm} value={form.phone} required />
                    </div>
                    <select className="register-main-form--input form--input--half" name="city" onChange={onChangeForm} value={form.city} required>
                        <option disabled value="" selected>--Thành phố--</option>
                        {renderFormCity()}
                    </select>
                    <div class="register-form">
                        <input type="email" class="register-main-form--input" name="email" placeholder="Email" onChange={onChangeForm} value={form.email} required />
                    </div>
                    <div class="register-form">
                        <input type={`${!dispass ? "password" : "text"}`} name="password" class="register-main-form--input form--input--half" placeholder="Mật khẩu" onChange={onChangeForm} value={form.password} required />
                        <input type={`${!dispass ? "password" : "text"}`} name="repassword" class="register-main-form--input form--input--half" placeholder="Xác nhận" onChange={onChangeForm} value={form.repassword} required />
                    </div>
                    <input type="checkbox" name="displaypass" id="displaypass" onClick={() => setdispass(!dispass)} />
                    <label for="displaypass">Hiển thị mật khẩu</label>
                    <div class="register-main-form--submit">
                        <Link to='/login' className="login-main-form--create">Đăng nhập</Link>
                        <button type="submit" class="register-main-form--submit__main">Đăng ký</button>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 image--register">
                    <img src="https://ssl.gstatic.com/accounts/signup/glif/account.svg" alt="" />
                </div>
            </div>
        </form>
    );
};


Register.propTypes = {

};


export default Register;
