import * as types from '../constants/ActionTypes';

var initialState = null;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOGIN_USER:
            return { ...action.data };
        case types.INTERACT_LIKED:
            var { liked } = action;
            return {
                ...state,
                data: {
                    ...state.data,
                    liked: [...liked, liked]
                }
            };
        case types.INTERACT_MATCHED:
            var { match } = action;
            return {
                ...state,
                data: {
                    ...state.data,
                    match: [...match, match]
                }
            };
        case types.DISABLED_USER:
            var { disable } = action;
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