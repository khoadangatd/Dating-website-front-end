import * as types from '../constants/ActionTypes';

var initialState = null;

const reducer = (state = initialState, action) => {
    let { _id, name, disable } = action;
    switch (action.type) {
        case types.LOGIN_USER:
            return { ...action.data };
        case types.INTERACT_USER:
            return {
                ...state,
                data: {
                    ...state.data,
                    [name]: [...state.data[name], _id]
                }
            };
        case types.REMOVE_INTERACT:
            let index = state.data[name].findIndex((id) => {
                return id === _id;
            })
            state.data[name].split(index, 1);
            return {
                ...state,
            };
        case types.DISABLED_USER:   
            return {
                ...state,
                data: {
                    ...state.data,
                    disable,
                }
            };
        case types.LOGOUT_USER:
            return null;
        default:
            return state;
    }
}
export default reducer