import React, { useEffect, useRef, useState } from 'react';
import './discovery.css';
import { useSelector, useDispatch } from 'react-redux';
import callApi from '../../helper/axiosClient';
import Info from './../../components/Discovery/Info';
import PictureView from './../../components/Discovery/PictureView';
import NoneInfo from './../../components/Discovery/NoneInfo';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const Discovery = (props) => {
    const { socket } = props;
    const [userOther, setuserOther] = useState([]);
    const [images, setimages] = useState([]);
    const [open, setOpen] = useState(false);
    const [report, setReport] = useState({
        checkedA: false,
        checkedB: false,
        checkedC: false,
        detail: null
    });
    const user = useSelector(state => state.user);
    const history = useHistory();
    const findPartner = async () => {
        // try{
        const userFind = await callApi({
            url: `http://localhost/users/findUser`,
            method: "post",
            data: {
                setting: user.data.setting,
                unlike: user.data.unlike,
                like: user.data.like,
            }
        })
        return userFind.data;
        // }
        // catch{
        //     setTimeout(findPartner,2000)
        // }
    }
    const getPicture = async (data) => {
        // try{
        if (!data) return;
        var temp = [];
        for (let i = 0; i < data.length; i++) {
            var form = await callApi({
                url: `http://localhost/pictures/${data[i]._id}`,
                method: "get",
            })
            temp.push(form);
        }
        setimages(temp);
        setuserOther(data);
        // }
        // catch{
        //     setTimeout(getPicture,2000)
        // }
    }
    useEffect(() => {
        if (user) {
            if (user.data.role == 0)
                history.push('/management')
            findPartner().then((data) => getPicture(data));
        }
    }, [user, userOther.length == 0]);
    function removeUserOther() {
        var cloneuserOther = [...userOther];
        var cloneimages = [...images];
        cloneuserOther.shift();
        cloneimages.shift();
        setimages(cloneimages);
        setuserOther(cloneuserOther);
    }
    const handleClose = () => {
        setOpen(false);
    };
    function handleClickOpen() {
        setOpen(true);
    }
    const handleChange = (event) => {
        setReport({
            ...report,
            [event.target.name]: event.target.checked || event.target.value
        });
    };
    const onSubmitReport = async (e) => {
        e.preventDefault();
        if (userOther.length <= 0) return;
        try {
            const data=await callApi({
                url: `http://localhost/replies/report`,
                method: "post",
                data: {
                    targetId: userOther[0]._id,
                    detail: report.detail,
                    reason: 
                        report.checkedA?"- Đăng hình ảnh không phù hợp.":""+
                        report.checkedB?"- Sử dụng ngôn từ không phù hợp.":""+
                        report.checkedC?"- Tạo tài khoản giả đăng thông tin sai sự thật.":""
                }
            })
            toast.success(data.message);
            setOpen(false);
            setReport({
                checkedA: false,
                checkedB: false,
                checkedC: false,
                detail: null
            });
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }
    function renderInfo() {
        if (userOther.length > 0 && images.length > 0 && user) {
            return (
                <div className="discovery--main">
                    <PictureView
                        pictures={images[0]}
                        socket={socket}
                        other={userOther[0]}
                        me={user}
                        removeUserOther={removeUserOther}
                        dialog={handleClickOpen}
                    ></PictureView>
                    <Info user={userOther[0]}></Info>
                </div>
            )
        }
        else {
            return (
                <NoneInfo></NoneInfo>
            )
        }
    }
    return (
        <div className="main">
            <div className="board">
                {renderInfo()}
            </div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <form onSubmit={onSubmitReport}>
                    <DialogTitle id="form-dialog-title">TỐ CÁO NGƯỜI DÙNG</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Hãy chọn lý do bạn muốn tố cáo người dùng này
                        </DialogContentText>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={report.checkedA}
                                    onChange={handleChange}
                                    name="checkedA"
                                    color="primary"
                                />
                            }
                            label="Người dùng này đăng hình ảnh không phù hợp"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={report.checkedB}
                                    onChange={handleChange}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Người dùng này sử dụng ngôn từ không phù hợp"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={report.checkedC}
                                    onChange={handleChange}
                                    name="checkedC"
                                    color="primary"
                                />
                            }
                            label="Người dùng này tạo tài khoản giả đăng thông tin sai sự thật"
                        />
                        <TextField
                            autoFocus
                            id="outlined-multiline-static"
                            label="Hãy mô tả chi tiết lý do tố cáo người dùng"
                            multiline
                            rows={4}
                            variant="outlined"
                            value={report.detail}
                            onChange={handleChange}
                            name="detail"
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Hủy
                        </Button>
                        <Button type="submit" color="primary">
                            Tố Cáo
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};


export default Discovery;
