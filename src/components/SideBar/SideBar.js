import React, { useEffect, useState } from 'react';
import './SideBar.css';
import logo from './../../assets/img/LOGO.png';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import callApi from '../../helper/axiosClient';
import * as actions from '../../actions/index';
import { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const SideBar = (props) => {
    const { socket } = props;
    const [feedback, setFeedback] = useState("");
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const notify = useSelector(state => state.notify)
    const history = useHistory();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    function handleCountNotify() {
        if (!notify) return;
        var count =
            ((notify.liked || 0) && notify.liked.noti.quantity) +
            ((notify.matched || 0) && notify.matched.noti.quantity) +
            ((notify.messenger || 0) && notify.messenger.noti.quantity);
        var pattern = /^\(\d+\)/;
        if (count === 0) {
            document.title = document.title.replace(pattern, "")
            return;
        }
        if (pattern.test(document.title)) {
            document.title = document.title.replace(pattern, "(" + count + ") ")
        }
        else {
            document.title = "(" + count + ") " + document.title
        }
    }
    async function handleSubmitFeedBack(e) {
        e.preventDefault();
        try {
            const data = await callApi({
                url: `http://localhost/replies/feedback`,
                method: "post",
                data: {
                    mess: feedback,
                }
            })
            toast.success(data.message);
            setOpen(false);
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }
    function MenuLink({ label, to, activeOnlyWhenExact, icon, notify }) {
        let match = useRouteMatch({
            path: to,
            exact: activeOnlyWhenExact
        });
        return (
            <Link to={to} className={`${!match ? "sidebar-category__item" : "sidebar-category__item--active"}`}>
                <table>
                    <tbody>
                        <tr style={{ position: "relative" }}>
                            <td className="sidebar-category__item--td--icon">
                                <i className={`${icon} sidebar-category__item--icon`}></i>
                            </td>
                            <td className="sidebar-category__item--td--label">
                                <p className="sidebar-category__item--title">{label}</p>
                            </td>
                            {notify ?
                                <td className="sidebar-category__item--circle--contain">
                                    <div className="sidebar-category__item--circle">
                                        {notify}
                                    </div>
                                </td>
                                :
                                ""
                            }
                        </tr>
                    </tbody>
                </table>
            </Link>
        );
    }

    async function logOut() {
        if (socket)
            socket.disconnect();
        dispatch(actions.logoutUser());
        await callApi({
            url: `http://localhost/users/logout`,
            method: "post",
            data: {
                refreshToken: localStorage.getItem("refreshToken")
            }
        })
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        history.push('/login')
    }

    function renderSideBar() {
        if (user.data.role === 0) {
            return (
                <Fragment>
                    <MenuLink label="B???ng ??i???u khi???n" to="/management" activeOnlyWhenExact={true} icon="fas fa-tachometer-alt"></MenuLink>
                    <MenuLink label="Ng?????i d??ng" to="/management/users" activeOnlyWhenExact={true} icon="fas fa-users"></MenuLink>
                    <MenuLink label="B??o c??o" to="/management/report" activeOnlyWhenExact={true} icon="fas fa-flag"></MenuLink>
                    <MenuLink label="Giao d???ch" to="/management/credit" activeOnlyWhenExact={true} icon="fas fa-money-check"></MenuLink>
                    <MenuLink label="Ph???n h???i" to="/management/feedback" activeOnlyWhenExact={true} icon="fas fa-comment-alt"></MenuLink>
                </Fragment>)
        }
        else {
            return (
                <Fragment>
                    <MenuLink label="H??? s??" to="/profile" activeOnlyWhenExact={true} icon="fas fa-user"></MenuLink>
                    <MenuLink label="Kh??m ph??" to="/discovery" activeOnlyWhenExact={true} icon="fas fa-search-location"></MenuLink>
                    <MenuLink label="Tin nh???n" to="/messenger" activeOnlyWhenExact={true} icon="fas fa-comments" notify={notify.messenger ? notify.messenger.noti.quantity : null}></MenuLink>
                    <MenuLink label="K???t ????i" to="/loved" activeOnlyWhenExact={true} icon="fas fa-heart" notify={notify.matched ? notify.matched.noti.quantity : null}></MenuLink>
                    <MenuLink label="???? th??ch b???n" to="/liked" activeOnlyWhenExact={true} icon="far fa-heart" notify={notify.liked ? notify.liked.noti.quantity : null}></MenuLink>
                    <MenuLink label="N??ng c???p" to="/upgrade" activeOnlyWhenExact={true} icon="fas fa-crown"></MenuLink>
                    <li className="sidebar-category__item" onClick={handleClickOpen}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="sidebar-category__item--td--icon">
                                        <i className={`fas fa-comment-alt sidebar-category__item--icon`}></i>
                                    </td>
                                    <td className="sidebar-category__item--td--label">
                                        <p className="sidebar-category__item--title">Ph???n h???i</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </li>
                </Fragment>)
        }
    }
    useEffect(() => {
        handleCountNotify();
    }, [notify])// eslint-disable-line react-hooks/exhaustive-deps
    return user && notify && (
        <div className="sidebar">
            <img src={logo} alt="logo" className="sidebar-logo"></img>
            <h1 className="sidebar-logo--des">HAPE</h1>
            <div className="sidebar__intro">
                <Link to="/profile" style={{ backgroundImage: `url("http://localhost/images/${user.data.avatar}")` }} className="sidebar--avatar"></Link>
                <p className="sidebar__intro__name">{user.data.name}</p>
            </div>
            <div className="sidebar-credit--contain">
                <p className="sidebar-credit">
                    <i class="fas fa-money-bill-wave"></i>
                    HP: <span>{user.data.credit}</span>
                </p>
            </div>
            <div className="sidebar__line"></div>
            <ul className="sidebar-category">
                {renderSideBar()}
                <li className="sidebar-category__item" onClick={logOut}>
                    <table>
                        <tbody>
                            <tr>
                                <td className="sidebar-category__item--td--icon">
                                    <i className={`fas fa-sign-out-alt sidebar-category__item--icon`}></i>
                                </td>
                                <td className="sidebar-category__item--td--label">
                                    <p className="sidebar-category__item--title">????ng xu???t</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </li>
            </ul>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <form onSubmit={handleSubmitFeedBack}>
                    <DialogTitle id="form-dialog-title">G???I PH???N H???I</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            B???n c?? ?? ki???n? Ch??ng t??i lu??n hoan ngh??nh, nh??ng vui l??ng kh??ng chia s??? th??ng tin nh???y c???m. B???n c?? c??u h???i? H??y th??? xem th??ng tin tr??? gi??p ho???c li??n h??? v???i nh??m h??? tr???
                        </DialogContentText>
                        <TextField
                            autoFocus
                            id="outlined-multiline-static"
                            label="Ph???n h???i"
                            multiline
                            rows={4}
                            variant="outlined"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            H???y
                        </Button>
                        <Button type="submit" color="primary">
                            G???i
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

export default SideBar;
