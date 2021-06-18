import * as types from '../constants/ActionTypes'

var initialState = false;

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.TOGGLE_BAR:
            return !state;
        case types.SHOW_BAR:
            return true;
        case types.CLOSE_BAR:
            return false;
        default:
            return state;
    }
}

export default Reducer;