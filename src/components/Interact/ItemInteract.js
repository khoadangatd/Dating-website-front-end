import React, { useEffect, useState } from 'react';
import callApi from '../../helper/axiosClient';
import { Link } from 'react-router-dom';

const ItemInteract = (props) => {
    const { other } = props;
    const [pictures,setpictures]=useState(null);
    const [view,setview]=useState(null);
    const getPicture = async () => {
        try {
            const data = await callApi({
                url: `http://localhost/pictures/${other._id}`,
                method: "get",
            })
            console.log(data);
            setpictures(data);
        }
        catch (err) {
        }
    }
    useEffect(() => {
        getPicture();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    useEffect(()=>{
        if(!pictures) return;
        if (pictures.data.length > 0) {
            var pic = pictures.data.find(picture => picture.type === "main");
            setview("http://localhost/images/" + pic.src);
        }
        else {
            setview("https://wallpaperaccess.com/full/173801.png");
        }
    },[pictures])
    return (
        <Link to={`/profileOther?id=${other._id}`} className="interaction--item--contain col-lg-3">
            <div className="interaction--item" style={{ backgroundImage: `url('${view}')` }}>
                <div className="interaction--item--detail--contain">
                    <div className="interaction--item--detail">
                        <p className="interaction--item__name">{other.name}</p>
                        <p className="interaction--item__intro">{other.age} tuổi</p>
                        <p className="interaction--item__intro">{other.city}</p>
                        {/* <p className="interaction--item__name--main--title">Đã thích bạn</p> */}
                    </div>
                    <div className="interaction--item--hover">
                        <i class="fas fa-comment-dots"></i>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ItemInteract;
