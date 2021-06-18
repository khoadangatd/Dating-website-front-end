import './App.css';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Discovery from './pages/Discovery/Discovery';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { ToastContainer } from 'react-toastify';
import SideBar from './components/SideBar/SideBar';
import Profile from './pages/Profile/Profile';
import { useEffect, useState } from 'react';
import callApi from './helper/axiosClient';
import { useDispatch } from 'react-redux';
import * as actions from './actions/index';
import Messenger from './pages/Messenger/Messenger';
import Match from './pages/Match/Match';
import Liked from './pages/Liked/Liked';
import io from "socket.io-client";
import { toast } from 'react-toastify';

function App() {
    const [Ssocket, setSsocket] = useState(null);
    const dispatch = useDispatch();
    const getUser=async()=>{
        try{
            const data=await callApi({
                url: `http://localhost/users/login`,
                method: "get",
            })
            dispatch(actions.loginUser(data));
        }
        catch(err){

        }
    }
    useEffect(() => {
        getUser().then(setupSocket());
    }, []);

    const setupSocket = () => {
        const token=localStorage.getItem("refreshToken");//Storage id user and no expired
        if(token&&!Ssocket){
            const socket=io("http://localhost", {
                query: {
                    token
                }
            });
            socket.on("disconnect",()=>{
                setSsocket(null);
                setTimeout(setupSocket,3000);
                toast.error("Ngắt kết nối đến socket");
            })
            socket.on("connect",()=>{
                toast.success("Đã kết nối đến socket");
            })
            setSsocket(socket);
        }
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
            localStorage.getItem('accessToken')
                ? <Component {...props} socket={Ssocket}/>
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
        )} />
    )
    return (
        <Router>
            <SideBar></SideBar>
            <Switch>
                <PrivateRoute path='/discovery' exact={true} component={Discovery}></PrivateRoute>
                <PrivateRoute path='/profile' exact={true} component={Profile}></PrivateRoute>
                <PrivateRoute path='/messenger/:id' exact={true} component={Messenger}></PrivateRoute>
                <PrivateRoute path='/loved' exact={true} component={Match}></PrivateRoute>
                <PrivateRoute path='/liked' exact={true} component={Liked}></PrivateRoute>
                <Route path='/login' exact={true} component={Login}></Route>
                <Route path='/register' exact={true} component={Register}></Route>
            </Switch>
            <ToastContainer />
        </Router>
    );
}

export default App;
