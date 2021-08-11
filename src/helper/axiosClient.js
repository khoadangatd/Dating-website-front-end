import axios from 'axios';

function getLocalToken() {
    const token = localStorage.getItem('accessToken');
    return token
}

const AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    headers: {
        'content-type': 'application/json',
    }
})

AxiosInstance.interceptors.request.use(async (config) => {
    const token = getLocalToken();
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
}, (err) => {
    return Promise.reject(err);
})

//response interceptor to refresh token on receiving token expired error
AxiosInstance.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, async function (error) {
    const originalRequest = error.config;
    const refreshToken= localStorage.getItem('refreshToken');
    if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        const data =await axios.post('https://hape-dating.herokuapp.com/users/refreshToken',{refreshToken:refreshToken});
        localStorage.setItem("accessToken",data.data.accessToken);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.data.accessToken;
        return AxiosInstance(originalRequest);
    }
    return Promise.reject(error);
});

export default AxiosInstance;