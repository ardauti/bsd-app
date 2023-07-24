import React, {useCallback, useEffect, useState} from "react";
import {employeeApproveReject, getEmployeeLeaves} from "../../../../routes/routes";
import moment from "moment";
import {Lucide, Modal, ModalBody} from "../../../../components";
import Skeleton from "react-loading-skeleton";
import classnames from "classnames";
import NoData from "../../../public/no-data/Main";
import Toastify from "toastify-js";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router";
import Pagination from "../../../../components/pagination/Main";


function BoardLeaves() {
    const [employeeLeaves, setEmployeeLeaves] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [approveModal, setApproveModal] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);
    const [selectedWorkLogId, setSelectedWorkLogId] = useState(null);
    const [oppositeStatus, setOppositeStatus] = useState('');
    const {pageNumber} = useParams();
    const [pageSize, setPageSize] = useState(15);
    const [response, setResponse] = useState([]);
    const [currentPage, setCurrentPage] = useState(Number(pageNumber));
    const pageNumberLimit = 5;
    const [maxPageLimit, setMaxPageLimit] = useState(5);
    const [minPageLimit, setMinPageLimit] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();



    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            try {
                const res = await getEmployeeLeaves(pageNumber, pageSize);
                const oppositeStatus = res.status === 'accepted' ? 'rejected' : 'accepted';
                setOppositeStatus(oppositeStatus);
                setResponse(res)
                setPageSize(res.meta.per_page)
                setTotalCount(res.meta.total)

                setEmployeeLeaves(res.data);
                console.log(res);
            } catch (err) {
                throw err;
            }
            setIsLoading(false)
        };
        fetchData();
    }, [currentPage, pageSize, pageNumber]);

    const leavesApproveOrReject = useCallback(async (leaveID, status) => {
        try {
            const params = {
                status: status === 'accepted' ? 'Accepted' : 'Rejected',
            };
            const res = await employeeApproveReject(params, leaveID);
            console.log(res);
            const updatedLeaves = employeeLeaves.map((leave) => {
                if (leave.id === leaveID) {
                    return {...leave, status};
                }
                return leave;
            });
            setEmployeeLeaves(updatedLeaves);
            Toastify({
                node: dom("#success-notification-content")
                    .clone()
                    .removeClass("hidden")[0],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        } catch (err) {
            throw err;
        }
        setApproveModal(false);
        setRejectModal(false)
    }, [employeeLeaves]);

    const openApproveModal = (leavesID) => {
        setSelectedWorkLogId(leavesID);
        setApproveModal(true);
    };

    const rejectApproveModal = (leavesID) => {
        setSelectedWorkLogId(leavesID)
        setRejectModal(true)
    }

    const onPageChange = (pageNumber) => {
        navigate(`/employees/leaves/page/${pageNumber}`)
        setCurrentPage(pageNumber)
    }

    const onPrevClick = () => {
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageLimit(maxPageLimit - pageNumberLimit);
            setMinPageLimit(minPageLimit - pageNumberLimit);
        }
        navigate(`/employees/leaves/page/${currentPage - 1}`)
        setCurrentPage(prev => prev - 1);
    }

    const onNextClick = () => {
        if (currentPage + 1 > maxPageLimit) {
            setMaxPageLimit(maxPageLimit + pageNumberLimit);
            setMinPageLimit(minPageLimit + pageNumberLimit);
        }
        navigate(`/employees/leaves/page/${currentPage + 1}`)
        setCurrentPage(prev => prev + 1);
    }


    const paginationAttributes = {
        currentPage, maxPageLimit, minPageLimit, pageNumber, pageSize, totalCount, response: response,
    };
    const onChange = (e) => {
        setPageSize(e)
    }


    return (
        isLoading ? (
            <>
                <h2 className='intro-y text-lg font-medium mt-10'><Skeleton width={100}/></h2>
                <div className="grid grid-cols-12 gap-6 mt-5">


                    <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        <table className="table table-report -mt-2">
                            <thead>
                            <tr>
                                <th className="whitespace-nowrap"><Skeleton width={100}/></th>
                                <th className="whitespace-nowrap"><Skeleton width={100}/></th>
                                <th className="text-center whitespace-nowrap"><Skeleton width={100}/></th>
                                <th className="text-center whitespace-nowrap"><Skeleton width={100}/></th>
                                <th className="text-center whitespace-nowrap"><Skeleton width={100}/></th>
                                <th className="text-center whitespace-nowrap"><Skeleton width={100}/></th>
                            </tr>
                            </thead>
                            <tbody>

                            <tr className="intro-x">
                                <td className="w-40">
                                    <div className="flex">
                                        <div className="w-10 h-10 image-fit zoom-in">
                                            <Skeleton width={100}/>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <a
                                        href="src/views/backoffice/projects/project/work-log/Main.jsx"
                                        className="font-medium whitespace-nowrap"
                                    >
                                        <Skeleton width={100}/>
                                    </a>
                                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                        <Skeleton width={100}/>
                                    </div>
                                </td>
                                <td className="text-center"><Skeleton width={100}/></td>
                                <td className="text-center"><Skeleton width={100}/></td>
                                <td className="w-40">
                                    <div
                                        className={classnames({
                                            "flex items-center justify-center": true,
                                            "text-success": "text-success",
                                            "text-danger": "text-danger",
                                        })}
                                    >
                                        <Skeleton width={100}/>
                                    </div>
                                </td>
                                <td className="table-report__action w-56">
                                    <div className="flex justify-center items-center">
                                        <a className="flex items-center mr-3">
                                            <Skeleton
                                                width={100}/>
                                        </a>
                                        <a>
                                            <Skeleton width={100}/>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        ) : (

            employeeLeaves && employeeLeaves.length !== 0 ? (
                <>

                    <Modal
                        show={approveModal}
                        onHidden={() => {
                            setApproveModal(false)
                        }}
                    >
                        <ModalBody className={'p-0'}>
                            <div className={'p-5 text-center'}>
                                <Lucide
                                    icon="Calendar"
                                    className="w-16 h-16 text-success mx-auto mt-3"
                                />
                                <div className="text-3xl mt-5">Are you sure?</div>
                                <div className="text-slate-500 mt-2">
                                    Do you really want accept these leave?
                                </div>
                            </div>
                            <div className="px-5 pb-8 text-center">
                                <button
                                    onClick={() => leavesApproveOrReject(selectedWorkLogId, 'accepted')}
                                    type="button" className="btn btn-success w-24">
                                    Approve
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setApproveModal(false);
                                    }}
                                    className="btn btn-outline-secondary w-24 mr-1">
                                    Cancel
                                </button>

                            </div>
                        </ModalBody>
                    </Modal>

                    <Modal
                        show={rejectModal}
                        onHidden={() => {
                            setRejectModal(false)
                        }}
                    >
                        <ModalBody className={'p-0'}>
                            <div className={'p-5 text-center'}>
                                <Lucide
                                    icon="Calendar"
                                    className="w-16 h-16 text-success mx-auto mt-3"
                                />
                                <div className="text-3xl mt-5">Are you sure?</div>
                                <div className="text-slate-500 mt-2">
                                    Do you really want reject these leave?
                                </div>
                            </div>
                            <div className="px-5 pb-8  text-center">
                                <button
                                    onClick={() => leavesApproveOrReject(selectedWorkLogId, 'rejected')}
                                    type="button" className="btn  btn-success w-24">
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRejectModal(false);
                                    }}
                                    className="btn btn-outline-secondary w-24 mr-1">
                                    Cancel
                                </button>
                            </div>
                        </ModalBody>
                    </Modal>


                    <div
                        id="success-notification-content"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-success"/>
                        <div className="ml-4 mr-4">
                            <div className="text-slate-500 mt-1">
                                Leave updated successfully
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-between'>
                        <div><h2 className="intro-y text-lg font-medium mt-10">Employee
                            Leaves {(employeeLeaves.length)}</h2></div>
                        <div>
                            <div className="intro-y text-lg font-medium mt-10">
                                <div className="w-56 text-slate-500">
                                    <input
                                        type="text"
                                        className="form-control w-56 box pr-10"
                                        placeholder="Search..."

                                    />
                                    <Lucide
                                        icon="Search"
                                        className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                    />
                                </div>
                            </div>
                        </div>
                        <div><>
                        </>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                            <table className="table table-report -mt-2">
                                <thead>
                                <tr>
                                    <th className="whitespace-nowrap">EMPLOYEE</th>
                                    <th className="text-center">LEAVE TYPE</th>
                                    <th className="text-center">FROM</th>
                                    <th className="text-center">TO</th>
                                    <th className="text-center">CURRENT STATUS</th>
                                    <th className="text-center whitespace-nowrap">ACTIONS</th>
                                </tr>
                                </thead>
                                <tbody className='cursor-pointer'>
                                {employeeLeaves?.map((leaves) => (
                                    <tr key={leaves.id} className="intro-x">
                                        <td className="w-40">
                                            <div className="flex">
                                                <div className="w-10 font-medium h-10 ">
                                                    {leaves.user_profile.display_name}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col items-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="flex font-medium items-center mr-3">
                                                        {leaves.employee_entry.id === 1 ? (
                                                            <Lucide icon="Palmtree"
                                                                    className="w-4 text-success h-4 mr-1"/>
                                                        ) : leaves.employee_entry.id === 2 ? (
                                                            <Lucide icon="UserMinus"
                                                                    className="w-4 h-4 text-warning mr-6"/>
                                                        ) : null}
                                                        {leaves.employee_entry.type.charAt(0).toUpperCase() + leaves.employee_entry.type.slice(1)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col items-center">
                                                <a className="font-medium whitespace-nowrap">
                                                    {moment(leaves.start_date).format("MMMM Do YYYY")}
                                                </a>
                                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                    {moment(leaves.start_time, "HH:mm").format("h:mm A")}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col items-center">
                                                <a className="font-medium whitespace-nowrap">
                                                    {moment(leaves.end_date).format("MMMM Do YYYY")}
                                                </a>
                                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                    {moment(leaves.end_time, "HH:mm").format("h:mm A")}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col   items-center">
                                                <a className="font-medium capitalize whitespace-nowrap">
                                                    {leaves.status}
                                                </a>
                                            </div>
                                        </td>
                                        <td className=" table-report__action w-56">
                                            <div className="flex justify-center items-center">
                                                {leaves.status.toLowerCase() === 'pending' && (
                                                    <div className='flex'>
                                                        <div onClick={() => openApproveModal(leaves.id)}
                                                             className="flex items-center text-success mr-3">
                                                            <Lucide icon="CheckSquare" className="w-4 h-4 mr-1"/> Accept
                                                        </div>
                                                        <div onClick={() => rejectApproveModal(leaves.id)}
                                                             className="flex items-center text-danger">
                                                            <Lucide icon="X" className="w-4 h-4 mr-1"/> Reject
                                                        </div>
                                                    </div>
                                                )}

                                                {leaves.status.toLowerCase() !== 'pending' && (
                                                    <div className="flex">
                                                        {leaves.status.toLowerCase() !== oppositeStatus && (
                                                            <div onClick={() => openApproveModal(leaves.id)}
                                                                 className="flex items-center text-success mr-3">
                                                                <Lucide icon="CheckSquare"
                                                                        className="w-4 h-4 mr-1"/> Accept
                                                            </div>
                                                        )}
                                                        {leaves.status.toLowerCase() === oppositeStatus && (
                                                            <div onClick={() => rejectApproveModal(leaves.id)}
                                                                 className="flex items-center text-danger">
                                                                <Lucide icon="X" className="w-4 h-4 mr-1"/> Reject
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>


                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination {...paginationAttributes}
                                    onPrevClick={onPrevClick}
                                    onNextClick={onNextClick}
                                    onPageChange={onPageChange}
                                    onChange={onChange}
                            // onEdit={(id) => onEdit(id)}
                            // onDelete={(id) => onDelete(id)}
                        />
                    </div>
                </>
            ) : (
                <NoData navigateTo={`employees/page/1`} label={'employees'}/>
            )
        )
    )

}

export default BoardLeaves