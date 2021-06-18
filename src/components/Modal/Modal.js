import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PictureView from './../Discovery/PictureView';
import Info from './../Discovery/Info';
import callApi from '../../helper/axiosClient';
import './modal.css'

const Modal = (props) => {
    const { user, dismodal } = props;
    const [pictures, setpictures] = useState(null);
    console.log(pictures);
    const getPicture = async () => {
        try{
            const data = await callApi({
                url: `http://localhost/pictures/${user.data._id}`,
                method: "get",
            })
            setpictures(data);
        }
        catch(err){
            getPicture();
        } 
    }
    useEffect(() => {
        getPicture();
        var modal = document.querySelector(".modal");
        window.addEventListener("click", (e) => {
            if (e.target == modal) {
                dismodal(false);
            }
        });
    }, []);
    return user && (
        <div className="modal">
            <div className="modal-board">
                <div className="modal-main">
                    <PictureView pictures={pictures}></PictureView>
                    <Info user={{
                        name: user.data.name,
                        age: user.data.age,
                        city: user.data.city
                    }}></Info>
                </div>
            </div>
        </div>
    );
};


Modal.propTypes = {

};


export default Modal;
