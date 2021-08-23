import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import callApi from '../../helper/axiosClient';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { disabledUser } from '../../actions/index';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

const ItemUser = (props) => {
    const { _id, gender, name, email, avatar, city, role, disable } = props.user;
    const { stt, dialog } = props;

    function handleClick() {
        dialog(_id, !disable);
    }

    return (
        <tr>
            <td class="manage--users-item">#{stt}</td>
            <td>
                <div className="manage--users-item__name">
                    <div className="manage--users-item__name--image" style={{ backgroundImage: `url("https://localhost/images/${avatar}"` }}>
                    </div>
                    <div class="manage--users-item__name--detail">
                        <div class="manage--users-item__name--detail--main">
                            {name}
                        </div>
                        <div class="manage--users-item__name--detail--city">
                            {gender}
                        </div>
                    </div>
                </div>
            </td>
            <td class="manage--users-item">
                {email}
            </td>
            <td class="manage--users-item">
                {city}
            </td>
            <td class="manage--users-item">
                {role === 1 ?
                    <div class="manage--users-item--member manage--users-item--member--free">
                        Free
                    </div> :
                    role === 0 ?
                        <div class="manage--users-item--member manage--users-item--member--admin">
                            Admin
                        </div> :
                        <div class="manage--users-item--member manage--users-item--member--premium">
                            Premium
                        </div>
                }
            </td>
            <td class="manage--users-item">
                <button type="button" class="manage--users-item--btn--disable" onClick={handleClick}>
                    {disable ? "Bỏ vô hiệu hóa" : "Vô hiệu hóa"}
                </button>
            </td>
        </tr>
    )
}
const ManageUser = () => {
    const classes = useStyles();
    const user = useSelector(state => state.user);
    const history = useHistory();
    const [allUser, setAllUser] = useState(null);
    const { search } = useLocation();
    var { q, page } = queryString.parse(search);
    page = page || 1;
    const [find, setFind] = useState('');

    async function getAllUser() {
        try {
            const data = await callApi({
                url: `https://localhost/users/all?page=${page}${q ? `&search=${q}` : ""}`,
                method: `get`
            })
            setAllUser(data);
        }
        catch (error) {
            toast.error(error.response.data.message);
            history.push("/discovery");
        }
    }

    function renderItemUser() {
        var rs = null;
        rs = allUser.data.map((user, index) => {
            return (
                <ItemUser user={user} key={index} dialog={handleClickOpen} stt={index + ((page - 1) * allUser.itemInPage)}></ItemUser>
            )
        })
        return rs;
    }

    useEffect(() => {
        if (!user) return;
        getAllUser();
    }, [user, q, page])// eslint-disable-line react-hooks/exhaustive-deps
    function onHandleChange(e) {
        setFind(e.target.value);
        // var filterUser=null
        // filterUser=allUser.data.filter((user,index)=>{
        //     return user.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !=== -1;
        // })
        // console.log(filterUser);
        // setAllUser({
        //     ...allUser,
        //     data:[
        //         ...filterUser
        //     ]
        // });
    }
    function onHandleSubmit(e) {
        e.preventDefault();
        history.push(window.location.pathname + `${find.trim() ? `?q=${find}` : ""}`)
    }
    // Xử lý khi click vào vô hiệu hóa
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [formDisabled, setFormDisabled] = useState({
        _id: null,
        disabled: null,
    });

    // Khi nhấn nút vô hiệu hóa từ component con truyền sang cha và set vào state
    const handleClickOpen = (_id, disabled) => {
        setFormDisabled({
            _id,
            disabled
        })
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function onClickDisable() {
        await callApi({
            url: `https://localhost/users/disable`,
            method: `put`,
            data: {
                id: formDisabled._id,
                disable: formDisabled.disabled
            }
        })
        dispatch(disabledUser(formDisabled.disabled));
    }
    return allUser && (
        <div className="main-manage">
            <div className="manage row">
                <div className="col-lg-12">
                    <div className="manage__item">
                        <div className="manage__item--head">
                            <div className="manage__item--head--title">
                                <i class="fas fa-users"></i>
                                BÁO CÁO NGƯỜI DÙNG SỬ DỤNG
                            </div>
                            <form onSubmit={onHandleSubmit}>
                                <FormControl className={classes.margin} >
                                    <InputLabel htmlFor="input-with-icon-adornment">Tìm kiếm</InputLabel>
                                    <Input
                                        id="input-with-icon-adornment"
                                        value={find}
                                        onChange={onHandleChange}
                                        startAdornment={
                                            <InputAdornment position='end'>
                                                <SearchIcon type="submit" />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </form>
                        </div>
                        <table className="manage__item--users">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th style={{ textAlign: "start" }}>Họ và Tên</th>
                                    <th>Email</th>
                                    <th>Thành Phố</th>
                                    <th>Thành viên</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderItemUser()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="manage--user--pagination">
                <Pagination totalPage={allUser.totalPage} crrpage={parseInt(allUser.page)} search={allUser.search} category="users"></Pagination>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"CẢNH BÁO VÔ HIỆU HÓA"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn {formDisabled.disabled ? "vô" : "bỏ vô"} hiệu hóa người dùng này
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={() => {
                        onClickDisable();
                        handleClose();
                    }
                    } autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};


export default ManageUser;
