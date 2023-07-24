import classnames from "classnames";
import React, {useCallback, useEffect, useState} from "react";
import {approveWorkLogOption, getWorkLogs} from "../../../../../routes/routes";
import {User} from "../../../../../services/User";
import {useParams} from "react-router-dom";
import useError from "../../../../../hooks/useError";
import Skeleton from "react-loading-skeleton";
import moment from "moment/moment";
import {Lucide, Modal, ModalBody} from "../../../../../components";
import Toastify from "toastify-js";
import NoData from "../../../../public/no-data/Main";


function main() {
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const {id} = useParams()
    const setError = useError()
    const [workLogs, setWorkLogs] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [selectedWorkLogId, setSelectedWorkLogId] = useState(null);
    const [approveModal, setApproveModal] = useState(false);


    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            try {
                const res = await getWorkLogs(id, User.data.id);
                setWorkLogs(res['work-logs']);
                setUserProfile(res['userProfile']);
                console.log(res)
            } catch (err) {
                setError(err);
            }
            setIsLoading(false)
        };

        fetchData();
    }, []);

    const approveWorkLog = useCallback(async (logId) => {
        try {
            const log = workLogs.find((log) => log.id === logId);
            if (!log) {
                return;
            }
            const params = {
                work_logs: [log.id], // Pass the individual work log ID in an array
            };
            const res = await approveWorkLogOption(params);
            console.log(res);
            console.log(params);

            setWorkLogs((prevWorkLogs) =>
                prevWorkLogs.filter((item) => item.id !== log.id)
            );
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

        }
        setApproveModal(false);
    });


    const openApproveModal = (logId) => {
        setSelectedWorkLogId(logId);
        setApproveModal(true);
    };


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
                                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-2"/>
                                        <Skeleton width={100}/>
                                    </div>
                                </td>
                                <td className="table-report__action w-56">
                                    <div className="flex justify-center items-center">
                                        <a className="flex items-center mr-3">
                                            <Lucide icon="CheckSquare" className="w-4 h-4 mr-1"/> <Skeleton
                                            width={100}/>
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
            workLogs && workLogs.length !== 0 ? (
                <>
                    <Modal
                        show={approveModal}
                        onHidden={() => {
                            setApproveModal(false)
                        }}>
                        <ModalBody className={'p-0'}>
                            <div className={'p-5 text-center'}>
                                <Lucide
                                    icon="Calendar"
                                    className="w-16 h-16 text-success mx-auto mt-3"
                                />
                                <div className="text-3xl mt-5">Are you sure?</div>
                                <div className="text-slate-500 mt-2">
                                    Do you really want approve these worklog?
                                </div>
                            </div>
                            <div className="px-5 pb-8 text-center">
                                <button
                                    onClick={() => approveWorkLog(selectedWorkLogId)}
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
                        show={deleteConfirmationModal}
                        onHidden={() => {
                            setDeleteConfirmationModal(false)
                        }}>
                        <ModalBody className={'p-0'}>
                            <div className={'p-5 text-center'}>
                                <Lucide
                                    icon="Calendar"
                                    className="w-16 h-16 text-success mx-auto mt-3"
                                />
                                <div className="text-3xl mt-5">Are you sure?</div>
                                <div className="text-slate-500 mt-2">
                                    Do you really want delete these worklog?
                                </div>
                            </div>
                            <div className="px-5 pb-8 text-center">

                                <button
                                    type="button" className="btn btn-success w-24">
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteConfirmationModal(false);
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
                                Worklog updated successfully
                            </div>
                        </div>
                    </div>


                    <h2 className="intro-y text-lg font-medium mt-10">Time Sheet</h2>
                    <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                            <table className="table table-report -mt-2">
                                <thead>
                                <tr>
                                    <th className="whitespace-nowrap">EMPLOYEE</th>
                                    <th className="whitespace-nowrap">TASK</th>
                                    <th className="text-center whitespace-nowrap">CHECK IN</th>
                                    <th className="text-center whitespace-nowrap">CHECK OUT</th>
                                    <th className="text-center whitespace-nowrap">WORKING HOURS</th>
                                    <th className="text-center whitespace-nowrap">PROLONGED</th>
                                    <th className="text-center whitespace-nowrap">ACTIONS</th>
                                </tr>
                                </thead>
                                <tbody className='cursor-pointer'>
                                {workLogs?.map((log) => (
                                    <tr key={log.id} className="intro-x">
                                        <td className="w-40">
                                            <div className="flex">
                                                <div className="w-10 font-medium h-10 image-fit zoom-in">
                                                    {userProfile.display_name}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <a
                                                href="src/views/backoffice/projects/project/work-log/Main.jsx"
                                                className="font-medium whitespace-nowrap"
                                            >
                                                {log.task.name}
                                            </a>
                                        </td>
                                        <td className="text-center font-medium">{moment(log.check_in).format("MMMM Do YYYY, h:mm a")}</td>
                                        <td className="text-center font-medium">{moment(log.check_out).format("MMMM do YYYY h:mm a")}</td>
                                        <td className="w-40 font-bold text-center">
                                            {log.task.total_working_hours}
                                        </td>
                                        <td className="w-40  text-center">
                                            <div
                                                className={classnames({
                                                    "flex items-center justify-center": true,

                                                    'font-bold': 'font-bold'
                                                })}
                                            >
                                                <Lucide icon="CheckSquare" className="w-4 h-4 mr-2"/>
                                                {log.prolonged}
                                            </div>
                                        </td>
                                        <td className="table-report__action w-56">
                                            <div className="flex justify-center items-center">
                                                <div onClick={() => openApproveModal(log.id)}

                                                     className="flex items-center text-success mr-3">
                                                    <Lucide icon="CheckSquare" className="w-4 h-4 mr-1"/> Approve
                                                </div>
                                                <div className="flex items-center text-danger" onClick={() => {
                                                        setDeleteConfirmationModal(true);
                                                    }}
                                                >
                                                    <Lucide icon="X" className="w-4 h-4 mr-1"/> Deny
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </>
            ) : (
                <NoData navigateTo={`projects/project/${id}/tasks`} label={'tasks'}/>
            )
        )
    );
}

export default main;