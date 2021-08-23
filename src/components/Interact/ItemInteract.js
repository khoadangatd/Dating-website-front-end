import React, { useEffect, useState } from 'react';
import callApi from '../../helper/axiosClient';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { interactUser } from '../../actions/index';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { removeInteract } from '../../actions/index';

const ItemInteract = (props) => {
    const { other, socket, me } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const [pictures, setpictures] = useState(null);
    const [view, setview] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClose = (e) => {
        e.stopPropagation();
        setOpen(false);
    };
    const getPicture = async () => {
        if(!other._id){
            setpictures({data:[]});
            return;
        }
        try {
            const data = await callApi({
                url: `http://localhost/pictures/${other._id}`,
                method: "get",
            })
            console.log(data);
            setpictures(data);
        }
        catch (err) {
            console.log("loi");
        }
    }

    function handleProfileUser() {
        if (!other._id) {
            setOpen(true);
            return;
        }
        history.push(`/profileOther?id=${other._id}`)
    }
    function handleUpgrade(e){
        e.stopPropagation();
        history.push(`/upgrade`)
    }

    useEffect(() => {
        getPicture();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!pictures) return;
        if (pictures.data.length > 0) {
            setview("http://localhost/images/" + pictures.data[0].src);
        }
        else {
            setview("http://wallpaperaccess.com/full/173801.png");
        }
    }, [pictures])

    function handleInteract(e, data) {
        e.stopPropagation();
        if(me.data.role===1){
            setOpen(true);
            return;
        }
        if (socket) {
            if (!other._id) return;
            if (data) {
                socket.emit("like", {
                    _idother: other._id,
                    name: me.data.name,
                    liked: me.data.liked
                });
                dispatch(interactUser(other._id, "like"))
                dispatch(interactUser(other._id, "match"))
            }
            else {
                socket.emit("unlike", {
                    _idother: other._id,
                });
                dispatch(interactUser(other._id, "unlike"))
            }
            dispatch(removeInteract(other._id, "liked"))
        }
    };

    return (
        <div className="interaction--item--contain col-lg-3 col-md-4 col-sm-6" onClick={handleProfileUser}>
            <div className="interaction--item" style={{ backgroundImage: `url('${view}')` }}>
                <div className="interaction--item--detail--contain">
                    <div className="interaction--item--detail">
                        <p className="interaction--item__name">{other.name}</p>
                        <p className="interaction--item__intro">{other.age} tuổi</p>
                        <p className="interaction--item__intro">{other.city}</p>
                        {/* <p className="interaction--item__name--main--title">Đã thích bạn</p> */}
                    </div>
                    <div className="interaction--item--hover">
                        {window.location.pathname === "/loved" ?
                            <i class="fas fa-user-friends"></i> :
                            <div className="row interaction--item--hover--liked">
                                <div className="col-lg-6 interaction--item--hover--liked__icon" onClick={(e) => handleInteract(e, true)}>
                                    <i class="fas fa-heart"></i>
                                </div>
                                <div className="col-lg-6 interaction--item--hover--liked__icon" onClick={(e) => handleInteract(e, false)}>
                                    <i class="fas fa-times"></i>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Nâng cấp tài khoản</DialogTitle>
                <DialogContent>
                    <h2 className="LOGO_PREMIUM">
                        HAPE PREMIUM
                        <i class="fas fa-crown"></i>
                    </h2>
                    <DialogContentText id="alert-dialog-description">
                        Hãy nâng cấp tài khoản Premium để biết được ai là người thích bạn.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" >
                        Hủy
                    </Button>
                    <Button onClick={handleUpgrade} color="primary" autoFocus>
                        Nâng cấp
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ItemInteract;
