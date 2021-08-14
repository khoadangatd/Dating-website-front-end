import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import callApi from '../../helper/axiosClient';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

const ItemDeal = (props) => {
    const { updatedAt, mess, money, status, user } = props.deal;
    const { stt } = props;
    return (
        <tr>
            <td class="manage--users-item">#{stt}</td>
            <td>
                <Link to={`/profileOther?id=${user._id}`}>
                    <div className="manage--users-item__name">
                        <div className="manage--users-item__name--image" style={{ backgroundImage: `url("https://hape-dating.herokuapp.com/images/${user.avatar}"` }}>
                        </div>
                        <div class="manage--users-item__name--detail">
                            <div class="manage--users-item__name--detail--main">
                                {user.name}
                            </div>
                        </div>
                    </div>
                </Link>
            </td>
            <td class="manage--users-item">
                {mess}
            </td>
            <td class="manage--users-item">
                {status ? "Thành công" : "Chưa thực hiện gd"}
            </td>
            <td class="manage--users-item">
                {money} VND
            </td>
            <td class="manage--users-item">
                {updatedAt}
            </td>
        </tr>
    )
}
const ManageDeal = () => {
    const classes = useStyles();
    const [deal, setDeal] = useState(null);
    const [viewDeal, setViewDeal] = useState(null);
    const [find, setFind] = useState('');
    const getDeal = async () => {
        try {
            const data = await callApi({
                url: `https://hape-dating.herokuapp.com/deals/`,
                method: `GET`,
            })
            setDeal(data.data);
            setViewDeal(data.data);
        }
        catch (err) {
            // setTimeout(getDeal, 3000);
        }
    }

    useEffect(() => {
        getDeal();
    }, [])

    function renderDeal() {
        var rs = null;
        if (!viewDeal) return;
        console.log(viewDeal);
        rs = viewDeal.map((deal, index) => {
            return (
                <ItemDeal deal={deal} key={index} stt={index}></ItemDeal>
            )
        })
        return rs;
    }
    function onHandleChange(e) {
        setFind(e.target.value);
        var filterUser = null
        filterUser = deal.filter((dchild, index) => {
            return dchild.user.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1;
        })
        console.log(filterUser);
        setViewDeal([
            ...filterUser
        ]);
    }
    return (
        <div className="main-manage">
            <div className="manage row">
                <div className="col-lg-12">
                    <div className="manage__item  manage__item--overflow">
                        <div className="manage__item--head">
                            <div className="manage__item--head--title">
                                <i class="fas fa-hands-helping"></i>
                                LỊCH SỬ GIAO DỊCH
                            </div>
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
                        </div>
                        <table className="manage__item--users">
                            <thead className="manage__item--overflow__fix">
                                <tr>
                                    <th>#</th>
                                    <th style={{ textAlign: "start" }}>Người giao dịch</th>
                                    <th>Nội dung</th>
                                    <th>Thực hiện</th>
                                    <th>Số tiền</th>
                                    <th>Ngày thực hiện</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderDeal()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default ManageDeal;
