import React, { useState } from 'react';
import callApi from '../../helper/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import './upgrade.css';
import message from '../../assets/img/message.png'
import liked from '../../assets/img/liked.png'
import present from '../../assets/img/present.jpg'
import { FetchLoginUser } from '../../actions';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toast } from 'react-toastify';

const Upgrade = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [open, setOpen] = useState({
        dialogCard: false,
        dialogPre: false
    });
    const [money, setMoney] = useState(0);

    function onHandleChange(e) {
        setMoney(e.target.value);
        console.log(e.target.value);
    }

    function renderCredit() {
        // // Tìm tổng số trong credit vd như 800 sẽ có 3 số
        var rs = [];
        var temp = parseInt(user.data.credit);
        if (temp === 0) {
            rs = <div class="upgrade--credits-header__counter__list__item">
                0
            </div>
            return rs;
        }
        var temp1 = [];
        while (temp > 0) {
            temp1.push(temp % 10);
            temp = Math.floor(temp / 10);
        }
        for (let i = temp1.length - 1; i >= 0; i--) {
            rs.push(
                <div class="upgrade--credits-header__counter__list__item" key={i}>
                    {temp1[i]}
                </div>
            )
        }
        return rs;
    }

    async function handleBuyingHP() {
        try {
            const data = await callApi({
                url: `http://localhost/deals/create_payment_url`,
                method: `post`,
                data: {
                    credit: parseFloat(user.data.credit),
                    money,
                }
            })
            window.open(data.data, "_blank");
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function handleUpgradeUser() {
        try {
            const data = await callApi({
                url: `http://localhost/deals/premium`,
                method: `get`,
            })
            dispatch(FetchLoginUser())
            toast.success(data.message)
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return user && (
        <div className="main">
            <div className="board">
                <div className="board--main">
                    <h2 className="">Nâng cấp</h2>
                    <div className="upgrade-heading">
                        <p className="upgrade-heading--title">
                            <i class="fas fa-dot-circle"></i>
                            Tài khoản HP của bạn:
                        </p>
                        <div className="upgrade-heading--credit">
                            <div className="upgrade-heading--credit__decor">

                            </div>
                            <div className="upgrade-heading--credit__main">
                                <div className="upgrade--credits-header__counter">
                                    <div class="upgrade--credits-header__counter__list">
                                        {renderCredit()}
                                    </div>
                                </div>
                            </div>
                            <div className="upgrade-heading--credit__decor">

                            </div>
                        </div>
                    </div>
                    <div className="upgrade-button">
                        <button className="upgrade-button__main" onClick={() => setOpen({ ...open, dialogCard: true })}>
                            Nạp ngay
                        </button>
                    </div>
                    <div className="upgrade-main">
                        <div className="row">
                            <div className="col-lg-4 col-md-4 upgrade-main__item">
                                <img src={message} alt="message" className="upgrade-main--image"></img>
                                <p>
                                    Bạn có thể gửi tin nhắn cho bất kì ai
                                </p>
                            </div>
                            <div className="col-lg-4 col-md-4 upgrade-main__item">
                                <img src={liked} alt="liked" className="upgrade-main--image"></img>
                                <p>
                                    Xem được những người đã thích bạn
                                </p>
                            </div>
                            <div className="col-lg-4 col-md-4 upgrade-main__item">
                                <img src={present} alt="present" className="upgrade-main--image"></img>
                                <p>
                                    Tặng quà cho người nhắn tin
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="upgrade-button">
                        <button className="upgrade-button__main upgrade-button--premium" onClick={() => setOpen({ ...open, dialogPre: true })}>
                            Nâng cấp tài khoản premium
                        </button>
                    </div>
                    <Dialog open={open.dialogCard} onClose={() => { setOpen({ ...open, dialogCard: false }) }} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Nạp HP</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Cảm ơn đã sử dụng dịch vụ của chúng tôi. Vui lòng nhập số tiền hoặc chọn các mệnh giá sau đây :
                                <div className="row">
                                    <p className="col-lg-6">
                                        <div className="upgrade-denominations upgrade-denominations--1" onClick={() => setMoney(10000)}>
                                            10.000VND
                                        </div>
                                    </p>
                                    <p className="col-lg-6">
                                        <div className="upgrade-denominations upgrade-denominations--2" onClick={() => setMoney(20000)}>
                                            20.000VND
                                        </div>
                                    </p>
                                </div>
                                <div className="row">
                                    <p className="col-lg-6">
                                        <div className="upgrade-denominations upgrade-denominations--3" onClick={() => setMoney(50000)}>
                                            50.000VND
                                        </div>
                                    </p>
                                    <p className="col-lg-6">
                                        <div className="upgrade-denominations upgrade-denominations--4" onClick={() => setMoney(100000)}>
                                            100.000VND
                                        </div>
                                    </p>
                                </div>
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Số tiền muốn nạp"
                                type="number"
                                value={money}
                                name="money"
                                onChange={onHandleChange}
                                fullWidth
                            />
                            <p>Quy đổi thành HP: {money / 100}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setOpen({ ...open, dialogCard: false }) }} color="primary">
                                Hủy
                            </Button>
                            <Button onClick={handleBuyingHP} color="primary">
                                Nạp ngay
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={open.dialogPre}
                        onClose={() => setOpen({ ...open, dialogPre: false })}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Nâng cấp tài khoản Premium</DialogTitle>
                        <DialogContent>
                            <h2 className="LOGO_PREMIUM">
                                HAPE PREMIUM
                                <i class="fas fa-crown"></i>
                            </h2>
                            <DialogContentText id="alert-dialog-description">
                                Bạn có chắc chắn muốn tiêu tốn 500HP để nâng cấp tài khoản trở thành Premium?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen({ ...open, dialogPre: false })} color="primary" >
                                Hủy
                            </Button>
                            <Button onClick={() => { handleUpgradeUser(); setOpen({ ...open, dialogPre: false }) }} color="primary" autoFocus>
                                Đồng ý
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Upgrade;
