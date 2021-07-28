import * as types from '../constants/ActionTypes';
import CallApi from '../helper/axiosClient';
import * as actions from '../actions';

export const loginUser=(data)=>{
    return(
        {
            type:types.LOGIN_USER,
            data
        }
    )
}

export const interactLiked=(liked)=>{
    return(
        {
            type:types.INTERACT_LIKED,
            liked
        }
    )
}

export const interactMatch=(match)=>{
    return(
        {
            type:types.INTERACT_MATCHED,
            match
        }
    )
}

export const disabledUser=(disable)=>{
    return(
        {
            type:types.DISABLED_USER,
            disable
        }
    )
}

export const FetchLoginUser=()=>{
    return (dispatch)=>{
        return CallApi({
            url: `http://localhost/users/`,
            method: "get",
        }).then(data=>{
            dispatch(actions.loginUser(data));
        });
    }
}

export const logoutUser=()=>{
    return(
        {
            type:types.LOGOUT_USER,
        }
    )
}

export const onlineUser=(data)=>{
    return(
        {
            type:types.ONLINE_USER,
            data
        }
    )
}
