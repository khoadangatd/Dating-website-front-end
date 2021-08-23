import React, { useEffect } from 'react';

const ModalPicture = (props) => {
    const { src, QuitModal, ChangeModal } = props;
    useEffect(() => {
        var modal = document.querySelector(".modal");
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                QuitModal();
            }
        });
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    function renderMainModal() {
        var rs = null;
        if (src.item.src.includes(".mp4")) {
            rs = <video className="board--profile-video--modal" controls poster="">
                <source src={`https://localhost/images/${src.item.src}`} type="video/mp4"></source>
            </video>
        }
        else{
            rs =<img src={`https://localhost/images/${src.item.src}`} alt="hinhanh" className="modal__body--image-detail"></img>
        }
        return rs;
    }
    return (
        <div className="modal">
            <button className="modal--button modal--button-quit" onClick={QuitModal}><i className="fas fa-times"></i></button>
            <button className="modal--button modal--button-left" onClick={() => ChangeModal(-1)}><i className="fas fa-chevron-left"></i></button>
            {renderMainModal()}
            <button className="modal--button modal--button-right" onClick={() => ChangeModal(1)}><i className="fas fa-chevron-right"></i></button>
        </div>
    );
};

export default ModalPicture;
