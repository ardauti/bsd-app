import React from 'react'
import './pagination.css'
import {
    Lucide,
} from "@/components";

const Pagination = (props) => {
    // init
    const {currentPage, maxPageLimit, minPageLimit, pageSize, totalCount} = props;
    const totalPages = props.response.meta?.last_page;
    // const data = props.response.data;

    // build page numbers list based on total number of pages
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {

        pages.push(i);
    }

    const handlePrevClick = () => {
        props.onPrevClick();
    }

    const handleNextClick = () => {
        props.onNextClick();
    }

    const handlePageClick = (e) => {
        e.preventDefault()
        console.log(e)
        props.onPageChange(Number(e.target.id));
    }
    const handleChange = (e) => {
        e.preventDefault()
        console.log(e.target.value)
        props.onChange(Number(e.target.value))
    }
    const pageNumbers = pages.map(page => {

            if (page <= maxPageLimit && page > minPageLimit) {
                return (
                    <li className={Number(currentPage) === page ? 'page-item active' : 'page-item'} key={page}>
                        <button id={page} onClick={handlePageClick}
                                className={Number(currentPage) === page ? 'page-link active' : 'page-link'}>{page}</button>
                    </li>
                );
            } else {
                return null;
            }
        }
    );

    // page ellipses
    let pageIncrementEllipses = null;
    if (pages.length > maxPageLimit) {
        pageIncrementEllipses =
            <li className="page-item" onClick={handleNextClick}><a className="page-link"> ...</a></li>
    }

    let pageDecremenEllipses = null;
    if (minPageLimit >= 1) {
        pageDecremenEllipses =
            <li className="page-item" onClick={handlePrevClick}><a className="page-link"> ...</a></li>
    }
    return (
        <div className="main mt-10 intro-y">
            <div className="intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3">
                <nav className="w-full sm:w-auto sm:mr-auto">
                    <ul className="pagination">
                        <li className="page-item">
                            <button className="page-link" onClick={handlePrevClick} disabled={currentPage === pages[0]}>
                                <Lucide icon="ChevronLeft" className="w-4 h-4"/>
                            </button>
                        </li>

                        {pageDecremenEllipses}
                        {pageNumbers}
                        {pageIncrementEllipses}

                        <li className="page-item">
                            <button onClick={handleNextClick} disabled={currentPage === pages[pages.length - 1]}
                                    className="page-link">
                                <Lucide icon="ChevronRight" className="w-4 h-4"/>
                            </button>
                        </li>
                    </ul>
                </nav>
                <select
                    className="w-20 form-select box mt-3 sm:mt-0"
                    value={pageSize}
                    onChange={(e) => handleChange(e)}
                >
                    {[5, 10, 15, totalCount].map((pageSize, index) => (
                        <option key={index} value={pageSize}>
                            {totalCount === pageSize ? "All" : pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default Pagination
