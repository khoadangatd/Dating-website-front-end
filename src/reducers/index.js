import {combineReducers} from 'redux';
import user from './user';
import online from './online';
const Reducer = combineReducers({
    user,
    online
});

export default Reducer;