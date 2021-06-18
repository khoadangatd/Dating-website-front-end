import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import callApi from '../../helper/axiosClient'

const PictureView = (props) => {
    const { pictures } = props;
    console.log(pictures);
    const [view, setview] = useState(null);
    var i = 0;
    if (pictures) {
        i = pictures.data.findIndex(picture => picture.type === "main")
    }
    var index = useRef(i);
    function changePicture(value) {
        if (!pictures) return;
        index.current += parseInt(value);
        if (index.current === pictures.data.length)
            index.current=0;
        if(index.current + value < 0)
            index.current=pictures.data.length-1;
        setview("http://localhost/images/" + pictures.data[index.current].src);

    }
    useEffect(() => {
        if (pictures && pictures.data.length > 0) {
            var pic = pictures.data.find(picture => picture.type === "main");
            setview("http://localhost/images/" + pic.src);
            console.log(pic.src);
        }
    }, [pictures])
    return (
        <div class="discovery__user--image" style={{ backgroundImage: `url("${view}"` }}>
            <button class="discovery__user--button discovery__user--button--left" onClick={() => changePicture(-1)}><i class="fas fa-chevron-left"></i></button>
            <button class="discovery__user--button discovery__user--button--right" onClick={() => changePicture(1)}><i class="fas fa-chevron-right"></i></button>
            <div class="discovery__user--button-main">
                <button class="discovery__user--button-main--detail btn-discovery-like"><i class="fas fa-heart"></i></button>
                <button class="discovery__user--button-main--detail btn-discovery-unlike"><i class="fas fa-times"></i></button>
            </div>
            <button class="discovery__user--button--report"><i class="fas fa-flag"></i></button>
        </div>
    );
};


PictureView.propTypes = {

};


export default PictureView;
