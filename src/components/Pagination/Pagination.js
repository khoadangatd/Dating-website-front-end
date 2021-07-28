import React from 'react';
import { Link } from 'react-router-dom';
import './pagination.css';

const Pagination = (props) => {
    const { totalPage, crrpage, category, search } = props;
    function renderPagination() {
        var result = [];
        var start = Math.floor(crrpage / 5) * 5;
        for (let i = start; i <= start + 5; i++) {
            if (i == 0) i++;
            if (i - 1 === totalPage)
                break;
            if (crrpage === i)
                result.push(<Link to={`${category}?${search ? 'q=' + search + '&' : ''}page=${i}`} key={i}>
                    <button className="pagination-number pagination-number--current ">{i}</button>
                </Link>)
            else
                result.push(<Link to={`${category}?${search ? 'q=' + search + '&' : ''}page=${i}`} key={i}>
                    <button className="pagination-number">{i}</button>
                </Link>)
        }
        return result;
    }
    return (
        <div className="pagination">
            <Link to={`${category}?${search ? 'q=' + search + '&' : ''}page=${crrpage - 1 < 1 ? 1 : crrpage - 1}`}>
                <button href="" className="pagination-number pagination-number-left">
                    <i className="fas fa-chevron-left"></i>
                </button>
            </Link>
            {renderPagination()}
            <Link to={`${category}?${search ? 'q=' + search + '&' : ''}page=${totalPage}`}><button className="pagination-number">...</button></Link>
            <Link to={`${category}?${search ? 'q=' + search + '&' : ''}page=${totalPage}`}><button className="pagination-number">{totalPage}</button></Link>
            <Link to={`${category}?${search ? 'q=' + search + '&' : ''}page=${crrpage + 1 > totalPage ? totalPage : crrpage + 1}`}>
                <button href="" className="pagination-number pagination-number-right">
                    <i className="fas fa-chevron-right"></i>
                </button>
            </Link>
        </div>
    );
};


Pagination.propTypes = {

};


export default Pagination;
