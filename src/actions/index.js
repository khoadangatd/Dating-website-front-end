import * as types from '../constants/ActionTypes';
export const loginUser=(data)=>{
    return(
        {
            type:types.LOGIN_USER,
            data
        }
    )
}
export const logoutUser=()=>{
    return(
        {
            type:types.LOGOUT_USER,
        }
    )
}
