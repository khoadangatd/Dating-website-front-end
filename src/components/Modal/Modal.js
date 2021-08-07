import React, { useEffect, useState } from 'react';
import PictureView from './../Discovery/PictureView';
import Info from './../Discovery/Info';
import callApi from '../../helper/axiosClient';
import './modal.css'

const Modal = (props) => {
    const { user, dismodal } = props;
    const [pictures, setpictures] = useState(null);
    console.log(user);
    const getPicture = async () => {
        try{
            const data = await callApi({
                url: `http://localhost/pictures/${user.data._id}`,
                method: "get",
            })
            setpictures(data);
        }
        catch(err){
            setTimeout(getPicture(),3000);
        } 
    }
    useEffect(() => {
        getPicture();
        var modal = document.querySelector(".modal");
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                dismodal(false);
            }
        });
    }, []);
    return (
        <div className="modal">
            <div className="modal-board">
                <div className="modal-main">
                    <PictureView pictures={pictures} other={user.data} removeUserOther={()=>{}}></PictureView>
                    <Info user={user.data}></Info>
                </div>
            </div>
        </div>
    );
};

export default Modal;
