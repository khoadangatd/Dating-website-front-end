import {combineReducers} from 'redux';
import user from './user';
import online from './online';
import notify from './notify';

const Reducer = combineReducers({
    user,
    online,
    notify
});

export default Reducer;