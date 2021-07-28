import React, { useEffect, useState } from 'react';
import callApi from '../../helper/axiosClient';
import ItemInteract from '../../components/Interact/ItemInteract';
import { useSelector } from 'react-redux';

const Match = () => {
    const [userMatch, setUserMatch] = useState(null);
    console.log(userMatch);
    const user = useSelector(state => state.user);
    const getUserMatch = async () => {
        try {
            const data = await callApi({
                url: `http://localhost/users/matchers`,
                method: `POST`,
                data: {
                    match: user.data.match
                }
            })
            setUserMatch(data.data);
        }
        catch (err){
            console.log(err);
        }
    }
    useEffect(() => {
        if (user)
            getUserMatch();
    }, [user])
    function renderItemInteract() {
        var rs = null;
        rs = userMatch.map((other, index) => {
            return <ItemInteract other={other} key={index}></ItemInteract>
        })
        return rs;
    }
    return userMatch && (
        <div className="main">
            <div className="board">
                <div className="board--main">
                    <h2 className="">Kết Đôi</h2>
                    <div className="interaction row">
                        {renderItemInteract()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Match;
