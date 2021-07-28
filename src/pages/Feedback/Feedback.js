import React, { useEffect, useState } from 'react';
import callApi from '../../helper/axiosClient';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ItemFeedback = (props) => {
    const {user,createdAt,mess}=props.feedback;
    const { stt } = props;
    return (
        <tr>
            <td class="manage--users-item">#{stt}</td>
            <td>
                <Link to={`/profileOther?id=${user._id}`}>
                    <div className="manage--users-item__name">
                        <div className="manage--users-item__name--image">
                            <img class="manage--users-item__name--image__main" src={user.avatar} alt="Avatar" />
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
    const [feedback, setFeedback] = useState(null);
    const getFeedback = async () => {
        try {
            const data = await callApi({
                url: `http://localhost/replies/feedback`,
                method: `GET`,
            })
            console.log(data);
            setFeedback(data.data);
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
        rs = feedback.map((feedback, index) => {
            return (
                <ItemFeedback feedback={feedback} key={index} stt={index}></ItemFeedback>
            )
        })
        return rs;
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
                            <div>

                            </div>
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
