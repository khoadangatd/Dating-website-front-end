import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
const NotPage =()=>{
    const history=useHistory();
    useEffect(()=>{
        if(localStorage.getItem("refreshToken")||localStorage.getItem('accessToken'))
            history.push('/discovery')
    },[])
    return(
        <div className="login-main-form">
            Trang không tìm thấy !
        </div>
    )
}
export default NotPage;