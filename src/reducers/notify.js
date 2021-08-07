import * as types from '../constants/ActionTypes';

var initialState = null;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_NOTIFY:
            return { ...action.data };
        case types.DELETE_NOTIFY:
            var newState={...state};
            delete newState[action.name];
            return newState;
        case types.ADD_NOTIFY:
            var {name} =action;
            if(state[name]){
                state[name].noti.quantity+=1;
                return {...state};
            }
            else{
                var newstate={
                    ...state,
                    [name]:{
                        noti:{
                            quantity:1
                        }
                    }
                }
                return newstate;
            }
        default:
            return state;
    }
}
export default reducer