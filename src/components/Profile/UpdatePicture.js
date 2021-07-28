import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import callApi from '../../helper/axiosClient';
import FormData from 'form-data';
import { toast } from 'react-toastify';
import ModalPicture from './../Modal/ModalPicture';

const UpdatePicture = (props) => {
    const { user } = props
    const [pictures, setpictures] = useState(null);
    const [uploaded, setuploaded] = useState(false);
    const [dismodal, setdismodal] = useState(null);
    function QuitModal() {
        setdismodal(null);
    }
    function ChangeModal(data) {
        var lengthPic = pictures.data.length;
        setdismodal({
            item: pictures.data[dismodal.stt + data],
            stt: dismodal.stt + data
        })
        if (data === -1 && dismodal.stt === 0)
            setdismodal({
                item: pictures.data[lengthPic + data],
                stt: lengthPic + data
            });
        if (data === 1 && dismodal.stt === lengthPic - 1)
            setdismodal({
                item: pictures.data[0],
                stt: 0
            });
    }
    const getPicture = async () => {
        try {
            const data = await callApi({
                url: `http://localhost/pictures/${user.data._id}`,
                method: "get",
            })
            console.log(data);
            setpictures(data);
        }
        catch (err) {
            toast.error(err.msg);
        }
    }
    useEffect(() => {
        getPicture();
    }, [uploaded]);
    function renderListImage() {
        var result = null;
        if (pictures && pictures.data.length > 0) {
            result = pictures.data.map((pic, index) => {
                return (
                    <div className="board--profile-image__box board--profile-image__box--img"
                        key={index}
                        style={{ backgroundImage: `url("http://localhost/images/${pic.src}")` }}
                        onClick={() => setdismodal({ item: pic, stt: index })}
                    >
                    </div>
                )
            })
        }
        // else{
        //     result=(<img src="https://icon-library.com/images/loading-icon-animated-gif/loading-icon-animated-gif-19.jpg"></img>)
        //     setTimeout(
        //         result=(<h1>Người dùng chưa cập nhật hình ảnh</h1>)
        //     ,500)
        // }
        return result;
    }
    async function onHandleChange(e) {
        var picUpload = {
            file: e.target.files[0],
            name: e.target.files[0].name
        }
        const formData = new FormData();
        formData.append('image', picUpload.file);
        formData.append('name', picUpload.name);
        await callApi({
            url: `http://localhost/pictures/upload`,
            method: "post",
            data: formData,
        })
        try {
            toast.success("Ảnh của bạn thêm thành công");
            setuploaded(!uploaded);
        }
        catch {
            toast.error("Ảnh của bạn không đúng định dạng");
        }
    }
    return (
        <div className="board--profile-image">
            <input type="file" name="image" id="upload-image" onChange={onHandleChange} style={{ display: "none" }}></input>
            {window.location.pathname==="/profile"
            ?
            <label for="upload-image" className="board--profile-image__box">
                <div className="board--profile-image__box__detail" >
                    <i class="fas fa-camera"></i>
                    <p>Thêm ảnh của bạn</p>
                </div>
            </label>
            :
            ""
            }
            {renderListImage()}
            {dismodal ? <ModalPicture src={dismodal} QuitModal={QuitModal} ChangeModal={ChangeModal}></ModalPicture> : ""}
        </div>
    );
};


UpdatePicture.propTypes = {

};


export default UpdatePicture;
