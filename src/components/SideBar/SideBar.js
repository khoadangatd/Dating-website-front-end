import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './SideBar.css';
import logo from './../../assets/img/LOGO.png';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import * as actions from '../../actions/index';
const SideBar = () => {
    function MenuLink({ label, to, activeOnlyWhenExact, icon }) {
        let match = useRouteMatch({
            path: to,
            exact: activeOnlyWhenExact
        });
        return (
            <Link to={to} class={`${!match ? "sidebar-category__item" : "sidebar-category__item--active"}`}>
                <p className="sidebar-category__item--title"><i class={icon}></i>{label}</p>
            </Link>
        );
    }
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const history = useHistory();
    return user && (
        <div class="sidebar">
            <img src={logo} alt="logo" className="sidebar-logo"></img>
            <h1 class="sidebar-logo--des">HAPE</h1>
            <div class="sidebar__intro">
                <img src={user.data.avatar} alt="avatar" class="sidebar--avatar"></img>
                <p>{user.data.name}</p>
            </div>
            <div className="sidebar__line"></div>
            <ul class="sidebar-category">
                <MenuLink label="Hồ sơ" to="/profile" activeOnlyWhenExact={true} icon="fas fa-user"></MenuLink>
                <MenuLink label="Khám phá" to="/discovery" activeOnlyWhenExact={true} icon="fas fa-search-location"></MenuLink>
                <MenuLink label="Tin nhắn" to="/messenger" activeOnlyWhenExact={true} icon="fas fa-comments"></MenuLink>
                <MenuLink label="Kết đôi" to="/loved" activeOnlyWhenExact={true} icon="fas fa-heart"></MenuLink>
                <MenuLink label="Đã thích bạn" to="/liked" activeOnlyWhenExact={true} icon="far fa-heart"></MenuLink>
                <li class="sidebar-category__item">
                    <p className="sidebar-category__item--title" onClick={() => { dispatch(actions.logoutUser()); localStorage.removeItem("Authorization"); history.push('/login') }}><i class="fas fa-sign-out-alt"></i>Đăng xuất</p>
                </li>
            </ul>
        </div>
    );
};


SideBar.propTypes = {

};


export default SideBar;
