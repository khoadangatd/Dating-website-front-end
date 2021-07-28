import * as types from '../constants/ActionTypes';

var initialState = null;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ONLINE_USER:
            return [...action.data ];
        default:
            return state;
    }
}
export default reducer