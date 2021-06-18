import React from 'react';
import PropTypes from 'prop-types';
import './liked.css';

const Liked = () => {
    return (
        <div className="main">
            <div className="board">
                <div className="board--main">
                    <h2 className="">Đã thích bạn</h2>
                    <div className="interaction row">
                        <div className="interaction--item--contain col-lg-3">
                            <div className="interaction--item" style={{ backgroundImage: `url('https://pd2us.badoocdn.com/p523/hidden?euri=jzGo0F9-uV2T8F.Zu2433qX4kgEGUyT9fb4qj2SnFqJtEj09eyaTCsPfCYU0wAxisnss60TQbOpkUkzdf8bhKMeumvNl7RsTkNWmGGF-j5DrSzc9t05qtouU-3D7667tTyE4IDClsBSbUs3.Tgxwaw&size=__size__&wm_size=120x120&wm_offs=23x23&')` }}>
                                <div className="interaction--item--detail--contain">
                                    <div className="interaction--item--detail">
                                        <p className="interaction--item__name">Võ Nguyễn Khoa Đăng</p>
                                        <p className="interaction--item__intro">18 tuổi</p>
                                        <p className="interaction--item__intro">Hồ Chí Minh</p>
                                        {/* <p className="interaction--item__name--main--title">Đã thích bạn</p> */}
                                    </div>
                                    <div className="interaction--item--hover">
                                        <i class="fas fa-comment-dots"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


Liked.propTypes = {

};


export default Liked;
