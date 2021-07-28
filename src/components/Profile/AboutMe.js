import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './aboutme.css';
import citys from '../../helper/City';
import gif from '../../assets/img/heartprofile.gif';
import { toast } from 'react-toastify';
import CallApi from '../../helper/axiosClient';
import { useDispatch } from 'react-redux';
import * as actions from '../../actions';

const AboutMe = (props) => {
    const { user } = props;
    const dispatch=useDispatch();
    const [edit, setEdit] = useState({
        job: false,
        city: false,
        target: false,
        about: false,
    })
    const [form, setform] = useState({
        aboutme:user.data.aboutme,
        job: user.data.job,
        target: user.data.target,
        gender: user.data.gender,
        marriage: user.data.marriage,
        height: user.data.height,
        smoking: user.data.smoking,
        liquor: user.data.liquor,
        city: user.data.city,
    })
    function renderFormCity() {
        var rs = null;
        rs = citys.map((city, index) => {
            return (<option className="" value={city}>{city}</option>)
        })
        return rs;
    }

    function onHandleInput(e, input, value, change) {
        e.stopPropagation();
        if(window.location.pathname!=="/profile")
            return;
        setEdit({
            ...edit,
            [input]: value,
        })
        if (!value && !change) {
            setform({
                ...form,
                [input]: user.data[input]
            })
        }
    }

    function onHandleChange(e) {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
        console.log(form);
    }

    async function onSubmitEdit() {
        // console.log(form);
        try {
            const data = await CallApi({
                url: `http://localhost/users/info`,
                method: `put`,
                data: form,
            })
            dispatch(actions.FetchLoginUser());
            toast.success(data.message);
            // toast.success(data.submessage);
        }
        catch {
            toast.error("Có lỗi gì đó!");
        }
    }
    return (
        <div className="about-me">
            <div className={window.location.pathname==="/profile"?"about-me-category":""} onClick={(e) => onHandleInput(e, "job", true)}>
                <h3 className="about-me-category--title">Công việc & học vấn<i class="far fa-edit about-me-category--edit"></i></h3>
                {!edit.job ?
                    <p>{form.job || "Hãy cho mọi người biết thêm về bạn bằng cách điền thông tin về công việc và học vấn"}</p>
                    : <div>
                        <input type="text" className="about-me-category--input" name="job" onChange={onHandleChange} value={form.job || ""}></input>
                        <button className="about-me-btn--save-part-small about-me-btn--save-part-small--save" onClick={(e) => onHandleInput(e, "job", false, true)}>Lưu</button>
                        <button className="about-me-btn--save-part-small" onClick={(e) => onHandleInput(e, "job", false, false)}>Hủy</button>
                    </div>
                }
            </div>
            <div className={window.location.pathname==="/profile"?"about-me-category":""} onClick={(e) => onHandleInput(e, "city", true)}>
                <h3 className="about-me-category--title">Vị trí<i class="far fa-edit about-me-category--edit"></i></h3>
                {!edit.city ?
                    <p>{form.city || "Hãy cho vị trí của bạn"}</p>
                    : <div>
                        <select className="about-me-category--input" name="city" onChange={onHandleChange} value={form.city} required>
                            {renderFormCity()}
                        </select>
                        <button className="about-me-btn--save-part-small about-me-btn--save-part-small--save" onClick={(e) => onHandleInput(e, "city", false, true)}>Lưu</button>
                        <button className="about-me-btn--save-part-small" onClick={(e) => onHandleInput(e, "city", false, false)}>Hủy</button>
                    </div>
                }
            </div>
            <div className={window.location.pathname==="/profile"?"about-me-category":""} onClick={(e) => onHandleInput(e, "target", true)}>
                <h3 className="about-me-category--title">Tôi ở đây để <i class="far fa-edit about-me-category--edit"></i></h3>
                {!edit.target ?
                    <p>{form.target || "Hãy cho mọi người câu trả lời chính xác từ bạn"}</p>
                    : <div>
                        <input type="text" className="about-me-category--input" name="target" onChange={onHandleChange} value={form.target || ""}></input>
                        <button className="about-me-btn--save-part-small about-me-btn--save-part-small--save" onClick={(e) => onHandleInput(e, "target", false, true)}>Lưu</button>
                        <button className="about-me-btn--save-part-small" onClick={(e) => onHandleInput(e, "target", false, false)}>Hủy</button>
                    </div>
                }
            </div>
            <div className={window.location.pathname==="/profile"?"about-me-category":""} onClick={(e) => onHandleInput(e, "about", true)}>
                <h3 className="about-me-category--title">Thông tin cá nhân <i class="far fa-edit about-me-category--edit"></i></h3>
                <table className="about-me-category--child">
                    <tr className="about-me-category--child--tr">
                        <th>
                            <p className="about-me-category--child--title">Về tôi</p>
                        </th>
                        <td>
                            {!edit.about ?
                                <p className="about-me-category--child--title">{form.aboutme || "Hãy mô tả về bản thân bạn"}</p> :
                                <textarea type="text" rows = "4" cols="50" className="about-me-category--input" name="aboutme" onChange={onHandleChange} value={form.aboutme} placeholder="Hãy viết gì đó chân thật nhất về bản thân bạn"></textarea>
                            }
                        </td>
                    </tr>
                    <tr className="about-me-category--child--tr">
                        <th>
                            <p className="about-me-category--child--title">Về hôn nhân</p>
                        </th>
                        <td>
                            {!edit.about ?
                                <p className="about-me-category--child--title">{form.marriage || "Chưa xác định"}</p> :
                                <input type="text" className="about-me-category--input" name="marriage" onChange={onHandleChange} value={form.marriage} placeholder="Chưa xác định"></input>
                            }
                        </td>
                    </tr>
                    <tr className="about-me-category--child--tr">
                        <th>
                            <p className="about-me-category--child--title">Giới tính</p>
                        </th>
                        <td>
                            {!edit.about ?
                                <p className="about-me-category--child--title">{form.gender || "Chưa xác định"}</p> :
                                <select className="about-me-category--input" name="gender" onChange={onHandleChange} value={form.gender} required>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            }
                        </td>
                    </tr>
                    <tr className="about-me-category--child--tr">
                        <th>
                            <p className="about-me-category--child--title">Chiều cao</p>
                        </th>
                        <td>
                            {!edit.about ?
                                <p className="about-me-category--child--title">{form.height || "Chưa xác định"}</p> :
                                <input type="text" className="about-me-category--input" name="height" onChange={onHandleChange} value={form.height} placeholder="Chưa xác định"></input>
                            }
                        </td>
                    </tr>
                    <tr className="about-me-category--child--tr">
                        <th>
                            <p className="about-me-category--child--title">Hút thuốc</p>
                        </th>
                        <td>
                            {!edit.about ?
                                <p className="about-me-category--child--title">{form.smoking || "Chưa xác định"}</p> :
                                <input type="text" className="about-me-category--input" name="smoking" onChange={onHandleChange} value={form.smoking} placeholder="Chưa xác định"></input>
                            }
                        </td>
                    </tr>
                    <tr className="about-me-category--child--tr">
                        <th>
                            <p className="about-me-category--child--title">Rượu bia</p>
                        </th>
                        <td>
                            {!edit.about ?
                                <p className="about-me-category--child--title">{form.liquor || "Chưa xác định"}</p> :
                                <input type="text" className="about-me-category--input" name="liquor" onChange={onHandleChange} value={form.liquor} placeholder="Chưa xác định"></input>
                            }
                        </td>
                    </tr>
                </table>
                {!edit.about ? "" :
                    <div className="about-me-btn--save-part-small--contain">
                        <button className="about-me-btn--save-part-small about-me-btn--save-part-small--save" onClick={(e) => onHandleInput(e, "about", false, true)}>Lưu</button>
                        <button className="about-me-btn--save-part-small" onClick={(e) => onHandleInput(e, "about", false, false)}>Hủy</button>
                    </div>
                }
            </div>
            {window.location.pathname==="/profile"
            ?
            <div className="about-me-category--submit">
                <button className="about-me-category--submit--btn" onClick={onSubmitEdit}>Cập nhật</button>
            </div>
            :""
            }
            <img src={gif} alt="gif" className="about-me--gif"></img>
        </div>
    );
};


AboutMe.propTypes = {

};


export default AboutMe;
