import * as types from '../constants/ActionTypes';

var initialState = null;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOGIN_USER:
            return { ...action.data };
        case types.LOGOUT_USER:
            return null;
        default:
            return state;
    }
}
export default reducer