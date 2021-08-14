import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import callApi from '../../helper/axiosClient';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiFormControl-root': {
            margin: theme.spacing(1),
            width: '30ch',
        },

    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const Setting = () => {
    const user = useSelector(state => state.user);
    const [form, setform] = useState({
        fullname: null,
        gender: "Nam",
        age: null,
        email: null,
        phone: null,
        passwordold: null,
        password: null,
        repassword: null,
    });
    const [values, setValues] = useState({
        showPasswordold: false,
        showPassword: false,
        showRepassword: false,
    });
    const handleClickShowPassword = (name) => {
        setValues({
            ...values,
            [name]: !values[name]
        });
    };
    const classes = useStyles();
    function onChangeForm(e) {
        setform({
            ...form,
            [e.target.name]: e.target.value
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
        e.preventDefault();
        console.log(form);
        try {
            if (validateForm()) {
                const data = await callApi({
                    url: `https://hape-dating.herokuapp.com/users/private`,
                    method: "PUT",
                    data: {
                        name: form.fullname,
                        gender: form.gender,
                        age: form.age,
                        phone: form.phone,
                        passwordold: form.passwordold,
                        password: form.password
                    }
                });
                toast.success(data.message);
            }
        }
        catch (error) {
            console.log(error.response);
            toast.error(error.response.data.message);
        }
    }
    useEffect(() => {
        if (user) {
            setform({
                fullname: user.data.name,
                gender: user.data.gender,
                age: user.data.age.toString(),
                email: user.data.email,
                phone: user.data.phone,
                passwordold: null,
                password: null,
                repassword: null,
            })
        }
    }, [user])
    return user && (
        <div className="main">
            <div className="board">
                <div className="board--main">
                    <div className="board__heading">
                        <h1>Thông tin hồ sơ</h1>
                        <Link to="/profile">
                            <button class="btn-board"><i class="fas fa-undo"></i></button>
                        </Link>
                    </div>
                    <form className={classes.root} autoComplete="off" onSubmit={onSubmitForm}>
                        <div>
                            <TextField
                                required
                                id="outlined-textarea"
                                label="Email"
                                placeholder=""
                                disabled
                                multiline
                                variant="outlined"
                                value={form.email}
                                onChange={onChangeForm}
                            />
                        </div>
                        <TextField
                            required
                            id="outlined-textarea"
                            label="Họ và tên"
                            placeholder="Hãy nhập tên của bạn"
                            multiline
                            variant="outlined"
                            value={form.fullname}
                            onChange={onChangeForm}
                            name="fullname"
                        />
                        <TextField
                            required
                            id="outlined-textarea"
                            label="Tuổi"
                            placeholder="Hãy nhập tuổi của bạn"
                            multiline
                            variant="outlined"
                            value={form.age}
                            onChange={onChangeForm}
                            name="age"
                        />
                        <div>
                            <TextField
                                required
                                id="outlined-textarea"
                                label="Số điện thoại"
                                placeholder="Hãy nhập số điện thoại của bạn"
                                multiline
                                variant="outlined"
                                value={form.phone}
                                onChange={onChangeForm}
                                name="phone"
                            />
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-helper-label">Giới tính</InputLabel>
                                <Select
                                    required
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    name="gender"
                                    value={form.gender}
                                    onChange={onChangeForm}
                                >
                                    <MenuItem value="Nam">Nam</MenuItem>
                                    <MenuItem value="Nữ">Nữ</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Mật khẩu cũ</InputLabel>
                                <OutlinedInput
                                    required
                                    id="outlined-adornment-password"
                                    type={values.showPasswordOld ? 'text' : 'password'}
                                    name="passwordold"
                                    value={form.passwordold}
                                    onChange={onChangeForm}
                                    placeholder="Hãy nhập mật khẩu cũ"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword("showPasswordOld")}
                                                edge="end"
                                            >
                                                {values.showPasswordOld ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    labelWidth={100}
                                />
                            </FormControl>
                        </div>
                        <div>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Mật khẩu mới</InputLabel>
                                <OutlinedInput
                                    required
                                    id="outlined-adornment-password"
                                    name="password"
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={onChangeForm}
                                    placeholder="Hãy nhập mật khẩu mới"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword("showPassword")}
                                                edge="end"
                                            >
                                                {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    labelWidth={100}
                                />
                            </FormControl>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Mật khẩu xác nhận</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={values.showRepassword ? 'text' : 'password'}
                                    name="repassword"
                                    value={form.repassword}
                                    onChange={onChangeForm}
                                    placeholder="Hãy xác nhận mật khẩu"
                                    required
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword("showRepassword")}
                                                edge="end"
                                            >
                                                {values.showRepassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    labelWidth={140}
                                />
                            </FormControl>
                        </div>
                        <div className="about-me-category--submit" style={{ marginTop: "20px" }}>
                            <button class="about-me-category--submit--btn">Cập nhật</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};


Setting.propTypes = {

};


export default Setting;
