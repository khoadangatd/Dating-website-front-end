import React, { useEffect, useState } from 'react';
import callApi from '../../helper/axiosClient';
import { Link } from 'react-router-dom';

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

const ItemFeedback = (props) => {
    const {user,createdAt,mess}=props.feedback;
    const { stt } = props;
    return (
        <tr>
            <td class="manage--users-item">#{stt}</td>
            <td>
                <Link to={`/profileOther?id=${user._id}`}>
                    <div className="manage--users-item__name">
                        <div className="manage--users-item__name--image" style={{backgroundImage:`url("https://hape-dating.herokuapp.com/images/${user.avatar}"`}}>
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
                {createdAt}
            </td>
        </tr>
    )
}

const Feedback = () => {
    const classes = useStyles();
    const [feedback, setFeedback] = useState(null);
    const [viewFeedback, setViewFeedback] = useState(null);
    const [find, setFind] = useState('');
    const getFeedback = async () => {
        try {
            const data = await callApi({
                url: `https://hape-dating.herokuapp.com/replies/feedback`,
                method: `GET`,
            })
            console.log(data);
            setFeedback(data.data);
            setViewFeedback(data.data);
        }
        catch (err) {
            // setTimeout(getReport, 3000);
        }
    }
    
    useEffect(() => {
        getFeedback();
    }, [])

    function renderFeedback() {
        var rs = null;
        if(!viewFeedback) return
        rs = viewFeedback.map((feedback, index) => {
            return (
                <ItemFeedback feedback={feedback} key={index} stt={index}></ItemFeedback>
            )
        })
        return rs;
    }

    function onHandleChange(e) {
        setFind(e.target.value);
        var filterUser = null
        filterUser = feedback.filter((fchild, index) => {
            return fchild.user.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1;
        })
        setViewFeedback([
            ...filterUser
        ]);
    }

    return feedback && (
        <div className="main-manage">
            <div className="manage row">
                <div className="col-lg-12">
                    <div className="manage__item  manage__item--overflow">
                        <div className="manage__item--head">
                            <div className="manage__item--head--title">
                                <i class="fas fa-people-arrows"></i>
                                NGƯỜI DÙNG PHẢN HỒI
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
                                    <th style={{ textAlign: "start" }}>Người dùng</th>
                                    <th>Phản hồi</th>
                                    <th>Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderFeedback()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feedback;
