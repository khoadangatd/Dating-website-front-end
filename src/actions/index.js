import * as types from '../constants/ActionTypes';
import CallApi from '../helper/axiosClient';

export const loginUser = (data) => {
    return (
        {
            type: types.LOGIN_USER,
            data
        }
    )
}

export const FetchLoginUser = () => {
    return (dispatch) => {
        return CallApi({
            url: `http://localhost/users/`,
            method: "get",
        }).then(data => {
            dispatch(loginUser(data));
        });
    }
}

export const logoutUser = () => {
    return (
        {
            type: types.LOGOUT_USER,
        }
    )
}

export const onlineUser = (data) => {
    return (
        {
            type: types.ONLINE_USER,
            data
        }
    )
}


export const interactUser = (_id, name) => {
    return (
        {
            type: types.INTERACT_USER,
            _id,
            name
        }
    )
}

export const removeInteract = (_id, name) => {
    return (
        {
            type: types.REMOVE_INTERACT,
            _id,
            name
        }
    )
}

export const receiveNotify = (data) => {
    return (
        {
            type: types.RECEIVE_NOTIFY,
            data
        }
    )
}

export const FetchReceiveNotify = () => {
    return (dispatch) => {
        return CallApi({
            url: "http://localhost/replies/notify",
            method: "get",
        }).then(data => {
            var newNotify={};
            console.log(data);
            data.data.forEach(noti => {
                switch (noti.type) {
                    case "liked":
                        newNotify={
                            ...newNotify,
                            liked: { noti }
                        }
                        break;
                    case "messenger":
                        newNotify={
                            ...newNotify,
                            messenger: { noti }
                        }
                        break;
                    case "matched":
                        newNotify={
                            ...newNotify,
                            matched: { noti }
                        }
                        break;
                    default:
                        break;
                }
            })
            console.log(newNotify);
            dispatch(receiveNotify(newNotify));
        });
    }
}

export const deleteNotify = (name) => {
    return (
        {
            type: types.DELETE_NOTIFY,
            name
        }
    )
}

export const addNotify = (name) => {
    return (
        {
            type: types.ADD_NOTIFY,
            name
        }
    )
}


export const disabledUser = (disable) => {
    return (
        {
            type: types.DISABLED_USER,
            disable
        }
    )
}

