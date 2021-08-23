import './App.css';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Discovery from './pages/Discovery/Discovery';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { ToastContainer } from 'react-toastify';
import SideBar from './components/SideBar/SideBar';
import Profile from './pages/Profile/Profile';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actions from './actions/index';
import Messenger from './pages/Messenger/Messenger';
import Match from './pages/Match/Match';
import Liked from './pages/Liked/Liked';
import io from "socket.io-client";
import { toast } from 'react-toastify';
import ProfileOther from './pages/ProfileOther/ProfileOther';
import Setting from './pages/Setting/Setting';
import Dashboard from './pages/Dashboard/Dashboard';
import ManageUser from './pages/ManageUser/ManageUser';
import Report from './pages/Report/Report';
import Feedback from './pages/Feedback/Feedback';
import Upgrade from './pages/Upgrade/Upgrade';
import callApi from './helper/axiosClient';
import ManageDeal from './pages/ManageDeal/ManageDeal';
import ResponsiveHeight from './components/ResponsiveHeight/ResponsiveHeight';


function App() {
    const [Ssocket, setSsocket] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        setupSocket();
        dispatch(actions.FetchLoginUser());
        dispatch(actions.FetchReceiveNotify());
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (Ssocket) {
            Ssocket.on("matched", async (data) => {
                toast.success(data.message);
                dispatch(actions.interactUser(data.id, "match"))
                if (window.location.pathname !== "/loved") {
                    await callApi({
                        url: `https://localhost/replies/notify/matched`,
                        method: `post`
                    })
                    dispatch(actions.addNotify('matched'));
                }
            })
            Ssocket.on("liked", async (data) => {
                toast.success(data.message);
                dispatch(actions.interactUser(data.id, "liked"))
                if (window.location.pathname !== "/liked") {
                    await callApi({
                        url: `https://localhost/replies/notify/liked`,
                        method: `post`
                    })
                    dispatch(actions.addNotify('liked'));
                }
            })
            Ssocket.on("online", (online) => {
                dispatch(actions.onlineUser(online));
            })
            Ssocket.on("getMessage", async (message) => {
                if (window.location.pathname !== "/messenger") {
                    await callApi({
                        url: `https://localhost/replies/notify/messenger`,
                        method: `post`
                    })
                    dispatch(actions.addNotify('messenger'));
                }   
            })
        }
    }, [Ssocket])// eslint-disable-line react-hooks/exhaustive-deps

    const setupSocket = () => {
        const token = localStorage.getItem("refreshToken");
        console.log('chay socket')
        if (token && !Ssocket) {
            const socket = io("https://localhost", {
                query: {
                    token
                }
            });
            socket.on("disconnect", () => {
                setSsocket(null);
                // setTimeout(setupSocket, 3000);
                // toast.error("Ngắt kết nối đến socket");
            })
            setSsocket(socket);
        }
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
            localStorage.getItem('accessToken')
                ? <Component {...props} socket={Ssocket} />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
        )} />
    )
    return (
        <Router>
            <SideBar socket={Ssocket}></SideBar>
            <ResponsiveHeight></ResponsiveHeight>
            <Switch>
                <PrivateRoute path='/discovery' exact={true} component={Discovery}></PrivateRoute>
                <PrivateRoute path='/profile' exact={true} component={Profile}></PrivateRoute>
                <PrivateRoute path='/messenger' exact={false} component={Messenger}></PrivateRoute>
                <PrivateRoute path='/loved' exact={true} component={Match}></PrivateRoute>
                <PrivateRoute path='/liked' exact={true} component={Liked}></PrivateRoute>
                <Route
                    path="/login"
                    render={() => <Login setupSocket={setupSocket} />}
                    exact
                />
                <Route path='/register' exact={true} component={Register}></Route>
                <PrivateRoute path='/profileOther' exact={false} component={ProfileOther}></PrivateRoute>
                <PrivateRoute path='/setting' exact={false} component={Setting}></PrivateRoute>
                <PrivateRoute path='/upgrade' exact={false} component={Upgrade}></PrivateRoute>
                <PrivateRoute path='/management' exact={true} component={Dashboard}></PrivateRoute>
                <PrivateRoute path='/management/users' exact={true} component={ManageUser}></PrivateRoute>
                <PrivateRoute path='/management/report' exact={true} component={Report}></PrivateRoute>
                <PrivateRoute path='/management/credit' exact={true} component={ManageDeal}></PrivateRoute>
                <PrivateRoute path='/management/feedback' exact={true} component={Feedback}></PrivateRoute>
            </Switch>
            <ToastContainer />
        </Router>
    );
}

export default App;
