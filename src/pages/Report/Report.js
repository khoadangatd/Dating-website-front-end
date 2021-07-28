import React, { useEffect, useState } from 'react';
import callApi from '../../helper/axiosClient';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ItemReport = (props) => {
    const { _id,detail, createdAt, reason, target, user } = props.report;
    const { stt } = props;
    async function handleClickWarning() {
        try {
            const data = await callApi({
                url: `http://localhost/replies/warning`,
                method: `post`,
                data: {
                    email: target.email,
                    detail: detail,
                    reason: reason
                }
            })
            toast.success(data.message);
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function handleClickDelete() {
        try {
            const data = await callApi({
                url: `http://localhost/replies/`,
                method: `delete`,
                data: {
                    _id:_id
                }
            })
            toast.success(data.message);
            props.delete();
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <tr>
            <td class="manage--users-item">#{stt}</td>
            <td>
                <Link to={`/profileOther?id=${target._id}`}>
                    <div className="manage--users-item__name">
                        <div className="manage--users-item__name--image">
                            <img class="manage--users-item__name--image__main" src={target.avatar} alt="Avatar" />
                        </div>
                        <div class="manage--users-item__name--detail">
                            <div class="manage--users-item__name--detail--main">
                                {target.name}
                            </div>
                        </div>
                    </div>
                </Link>
            </td>
            <td class="manage--users-item">
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
                {reason}
            </td>
            <td class="manage--users-item">
                {detail}
            </td>
            <td class="manage--users-item">
                <button type="button" class="manage--users-item--btn--warning" onClick={handleClickWarning}>
                    Gửi cảnh báo
                </button>
                <button type="button" class="manage--users-item--btn--delete" onClick={handleClickDelete}>
                    Xóa
                </button>
            </td>
        </tr>
    )
}

const Report = () => {
    const [report, setReport] = useState(null);
    const user = useSelector(state => state.user);
    const [rerender,setRerender]=useState(false);
    const getReport = async () => {
        try {
            const data = await callApi({
                url: `http://localhost/replies/report`,
                method: `GET`,
            })
            console.log(data);
            setReport(data.data);
        }
        catch (err) {
            // setTimeout(getReport, 3000);
        }
    }
    useEffect(() => {
        getReport();
    }, [rerender])
    function ClickDelete(){
        setRerender(!rerender);
    }
    function renderReport() {
        var rs = null;
        rs = report.map((report, index) => {
            return (
                <ItemReport report={report} key={index} stt={index} delete={ClickDelete}></ItemReport>
            )
        })
        return rs;
    }
    return report && (
        <div className="main-manage">
            <div className="manage row">
                <div className="col-lg-12">
                    <div className="manage__item  manage__item--overflow">
                        <div className="manage__item--head">
                            <div className="manage__item--head--title">
                                <i class="fas fa-people-arrows"></i>
                                NGƯỜI DÙNG TỐ CÁO
                            </div>
                            <div>

                            </div>
                        </div>
                        <table className="manage__item--users">
                            <thead className="manage__item--overflow__fix">
                                <tr>
                                    <th>#</th>
                                    <th style={{ textAlign: "start" }}>Đối tượng</th>
                                    <th style={{ textAlign: "start" }}>Người gửi</th>
                                    <th>Lý do</th>
                                    <th>Mô tả</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderReport()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Report;
