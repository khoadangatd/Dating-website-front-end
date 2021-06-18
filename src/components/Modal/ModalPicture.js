import React, { useEffect } from 'react';
import PropTypes from 'prop-types';


const ModalPicture = (props) => {
    const { src, QuitModal, ChangeModal } = props;
    useEffect(() => {
        var modal = document.querySelector(".modal");
        window.addEventListener("click", (e) => {
            if (e.target == modal) {
                QuitModal();
            }
        });
    }, []);
    return (
        <div className="modal">
            <button className="modal--button modal--button-quit" onClick={QuitModal}><i className="fas fa-times"></i></button>
            <button className="modal--button modal--button-left" onClick={() => ChangeModal(-1)}><i className="fas fa-chevron-left"></i></button>
            <img src={`http://localhost/images/${src.item.src}`} alt="hinhanh" className="modal__body--image-detail"></img>
            <button className="modal--button modal--button-right" onClick={() => ChangeModal(1)}><i className="fas fa-chevron-right"></i></button>
        </div>
    );
};


ModalPicture.propTypes = {

};


export default ModalPicture;
