import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import callApi from '../../helper/axiosClient';
import FormData from 'form-data';
import { toast } from 'react-toastify';
import ModalPicture from './../Modal/ModalPicture';
import { FetchLoginUser } from '../../actions/index';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Fragment } from 'react';

import heart from '../../assets/img/heartbluee.gif'

const UpdatePicture = (props) => {
    const { user } = props
    const dispatch = useDispatch();
    const [pictures, setpictures] = useState(null);
    const [uploaded, setuploaded] = useState(false);
    const [dismodal, setdismodal] = useState(null);
    const [open, setOpen] = useState({
        status: false,
        idpic: null,
    });
    const NextSlide = (props) => {
        const { onClick } = props;
        return (<div className="update-picture-button-slide update-picture-button-slide--left">
            <span className="update-picture-button-slide--main" onClick={onClick}>
                <i className="fas fa-chevron-left"></i>
            </span>
        </div>)
    }
    const PrevSlide = (props) => {
        const { onClick } = props;
        return (<div className="update-picture-button-slide update-picture-button-slide--right">
            <span className="update-picture-button-slide--main" onClick={onClick}>
                <i className="fas fa-chevron-right"></i>
            </span>
        </div>)
    }
    const handleClickOpen = (e, idpic) => {
        e.stopPropagation();
        setOpen({
            status: true,
            idpic: idpic,
        });
    };

    const handleClose = () => {
        setOpen({
            status: false,
            idpic: null
        });
    };

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
    async function handleDeleteImage() {
        try {
            console.log(open.idpic);
            await callApi({
                url: `http://localhost/pictures/${open.idpic}`,
                method: "delete",
            })
            setuploaded(!uploaded);
            toast.success("Xóa hình ảnh thành công");
            handleClose();

        }
        catch (error) {
            toast.error(error.response.data.message);
        }
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
        if (!pictures) return;
        if (pictures && pictures.data.length > 0) {
            result = pictures.data.map((pic, index) => {
                return (
                    <div className="item">
                        <div className="board--profile-image__box board--profile-image__box--img"
                            key={index}
                            style={{ backgroundImage: `url("http://localhost/images/${pic.src}")` }}
                        >
                            {pic.src.includes(".mp4") ?
                                <video className="board--profile-video" loop>
                                    <source src={`http://localhost/images/${pic.src}`} type="video/mp4"></source>
                                </video>
                                : ""}
                            <div className="board--profile-image__box__button-contain">
                                <button className="board--profile-image__box__button" onClick={() => setdismodal({ item: pic, stt: index })}>
                                    <i class="fas fa-arrows-alt"></i>
                                </button>
                                <button className="board--profile-image__box__button" onClick={(e) => handleClickOpen(e, pic._id)}>
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        return result;
    }
    async function onHandleChange(e) {
        var picUpload = {
            file: e.target.files[0],
            name: e.target.files[0].name
        }
        // Byte->Megabyte
        var maxsize = e.target.files[0].size / (1000 * 1000);
        if (maxsize > 16) {
            toast.error("Vui lòng chọn file nhỏ hơn 8 MB");
            return;
        }
        const formData = new FormData();
        formData.append('image', picUpload.file);
        formData.append('name', picUpload.name);
        try {
            const data = await callApi({
                url: `http://localhost/pictures/upload`,
                method: "post",
                data: formData,
            })
            toast.success("Ảnh của bạn thêm thành công");
            if (data.first) {
                dispatch(FetchLoginUser());
            }
            setuploaded(!uploaded);
        }
        catch {
            toast.error("Ảnh của bạn không đúng định dạng");
        }
    }
    // Setting slider slick 
    const settings = {
        dots: true,
        infinite: false,
        lazyLoad: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        nextArrow: <PrevSlide />,
        prevArrow: <NextSlide />,
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: true,
                }
            },
            {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: true,
                }
            },
            {
                breakpoint: 630,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: true,
                }
            }
        ]
    };
    return pictures && (
        <div className="board--profile-image">
            {window.location.pathname === "/profile"
                ?
                <div className="board--profile-image__upload-main">
                    <input type="file" name="image" id="upload-image" onChange={onHandleChange} style={{ display: "none" }}></input>
                    <label for="upload-image" className="board--profile-image__box">
                        <div className="board--profile-image__box__detail" >
                            <i class="fas fa-camera"></i>
                            <p>Thêm ảnh của bạn</p>
                        </div>
                    </label>
                </div>
                :
                <div className="board--profile-image__upload-main">
                    <div className="board--profile-other-heart">
                        <img src={heart} className="board--profile-other-heart--img"></img>
                    </div>
                </div>
            }
            <div className="board--profile-image__image-main" >
                <Slider {...settings}>
                    {renderListImage()}
                </Slider>
            </div>
            {dismodal ? <ModalPicture src={dismodal} QuitModal={QuitModal} ChangeModal={ChangeModal}></ModalPicture> : ""}
            <Dialog
                open={open.status}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Cảnh báo xóa ảnh</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa tấm ảnh này?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteImage} color="primary" autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};


UpdatePicture.propTypes = {

};


export default UpdatePicture;
