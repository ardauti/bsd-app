import {
    Lucide,
    Modal,
    ModalBody,
    Tippy
} from "@/components";
import React, {useContext, useEffect, useState} from 'react';
import Pagination from "../../../../../../components/pagination/Main";
import useError from "../../../../../../hooks/useError";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import {
    deleteProjectResource,
    getEmployeeResources,
} from "../../../../../../routes/routes";
import Toastify from "toastify-js";
import DataContext from "../../../../../../context/DataContext";
import NoData from "../../../../../public/no-data/Main"
import Skeleton from "react-loading-skeleton";

function ResourceEmployees(props) {
    const setError = useError()
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [resourceId, setResourceId] = useState('')
    const [deleteModalForEmployeePreview, setDeleteModalForEmployeePreview] = useState(false);
    const {id} = useParams();
    const [pageSize, setPageSize] = useState(15);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageNumberLimit = 5;
    let {setEmployeesResource} = useContext(DataContext)
    const [maxPageLimit, setMaxPageLimit] = useState(5);
    const [minPageLimit, setMinPageLimit] = useState(0);
    const [response, setResponse] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await getEmployeeResources(id, currentPage, pageSize)
                setEmployees(response.data)
                setEmployeesResource(response.data)
                setResponse(response)
                setPageSize(response.meta.per_page)
                setTotalCount(response.meta.total)
                setIsLoading(false)
            } catch (err) {
                setError(err);
                setIsLoading(false)
            }
        };

        fetchData();
    }, [currentPage, pageSize, props.createdResource]);

    const onPageChange = (pageNumber) => {
        if (pageNumber)
            navigate(`/projects/project/${id}/resources`)
        setCurrentPage(pageNumber);
    }

    const onPrevClick = () => {
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageLimit(maxPageLimit - pageNumberLimit);
            setMinPageLimit(minPageLimit - pageNumberLimit);
        }
        navigate(`/projects/project/${id}/resources`, {replace: true})
        setCurrentPage(prev => prev - 1);
    }
    const onNextClick = () => {
        if (currentPage + 1 > maxPageLimit) {
            setMaxPageLimit(maxPageLimit + pageNumberLimit);
            setMinPageLimit(minPageLimit + pageNumberLimit);
        }
        navigate(`/projects/project/${id}/resources`, {replace: true})
        setCurrentPage(prev => prev + 1);
    }
    const onChange = (e) => {
        setPageSize(e)
    }
    const onNavigate = (id) => {
        navigate(`/projects/project/${id}/resources`, {replace: true})
    }

    const paginationAttributes = {
        currentPage,
        maxPageLimit,
        minPageLimit,
        pageSize,
        totalCount,
        response: response,
    };

    const removeResource = async () => {
        try {
            await deleteProjectResource(id, props.resourceType, resourceId)
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
            const newList = employees.filter((item) => item.id !== resourceId);
            setEmployees(newList)
            setEmployeesResource(newList)
        } catch (err) {
            setError(err)
        }
        setDeleteModalForEmployeePreview(false)
    }

    return (
        isLoading ? (
            <>
                <div className="intro-y flex items-center mt-2">
                    <div className={'w-full'}>
                        <div
                            className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                            <div className="grid grid-cols-12 gap-6 mt-5 w-full">
                                <div
                                    className="intro-y col-span-12 md:col-span-6 lg:col-span-4"
                                >
                                    <div className="box">
                                        <div className="flex items-start px-5 pt-5">
                                            <div
                                                className="w-full flex flex-col lg:flex-row items-center">
                                                <Skeleton circle width={40} height={40}/>
                                                <div
                                                    className="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
                                                    <Skeleton width={100}/>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <Skeleton circle width={20} height={20}/>
                                            </div>
                                        </div>
                                        <div className="text-center lg:text-left p-5">
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-5">
                                                <Skeleton width={150}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={50}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={70}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={100}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={60}/>
                                            </div>
                                        </div>
                                        <div
                                            className="flex p-5">
                                            <div className={'ml-auto'}>
                                                <Skeleton width={50}/>
                                            </div>
                                            <div className={'ml-3'}>
                                                <Skeleton width={50}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="intro-y col-span-12 md:col-span-6 lg:col-span-4"
                                >
                                    <div className="box">
                                        <div className="flex items-start px-5 pt-5">
                                            <div
                                                className="w-full flex flex-col lg:flex-row items-center">
                                                <Skeleton circle width={40} height={40}/>
                                                <div
                                                    className="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
                                                    <Skeleton width={100}/>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <Skeleton circle width={20} height={20}/>
                                            </div>
                                        </div>
                                        <div className="text-center lg:text-left p-5">
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-5">
                                                <Skeleton width={150}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={50}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={70}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={100}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={60}/>
                                            </div>
                                        </div>
                                        <div
                                            className="flex p-5">
                                            <div className={'ml-auto'}>
                                                <Skeleton width={50}/>
                                            </div>
                                            <div className={'ml-3'}>
                                                <Skeleton width={50}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="intro-y col-span-12 md:col-span-6 lg:col-span-4"
                                >
                                    <div className="box">
                                        <div className="flex items-start px-5 pt-5">
                                            <div
                                                className="w-full flex flex-col lg:flex-row items-center">
                                                <Skeleton circle width={40} height={40}/>
                                                <div
                                                    className="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
                                                    <Skeleton width={100}/>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <Skeleton circle width={20} height={20}/>
                                            </div>
                                        </div>
                                        <div className="text-center lg:text-left p-5">
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-5">
                                                <Skeleton width={150}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={50}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={70}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={100}/>
                                            </div>
                                            <div
                                                className="flex items-center justify-center lg:justify-start mt-1">
                                                <Skeleton width={60}/>
                                            </div>
                                        </div>
                                        <div
                                            className="flex p-5">
                                            <div className={'ml-auto'}>
                                                <Skeleton width={50}/>
                                            </div>
                                            <div className={'ml-3'}>
                                                <Skeleton width={50}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            employees.length !== 0 ? (
                <>
                    <Modal
                        show={deleteModalForEmployeePreview}
                        onHidden={() => {
                            setDeleteModalForEmployeePreview(false);
                        }}
                    >
                        <ModalBody className="p-0">
                            <div className="p-5 text-center">
                                <Lucide
                                    icon="XCircle"
                                    className="w-16 h-16 text-danger mx-auto mt-3"
                                />
                                <div className="text-3xl mt-5">Are you sure?</div>
                                <div className="text-slate-500 mt-2">
                                    Do you really want to delete these records? <br/>
                                    This process cannot be undone.
                                </div>
                            </div>
                            <div className="px-5 pb-8 text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteModalForEmployeePreview(false);
                                    }}
                                    className="btn btn-outline-secondary w-24 mr-1"
                                >
                                    Cancel
                                </button>
                                <button onClick={removeResource} type="button" className="btn btn-danger w-24">
                                    Delete
                                </button>
                            </div>
                        </ModalBody>
                    </Modal>
                    <div className=" flex items-center mt-2">
                        <div className={'w-full'}>
                            <div
                                className=" col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                                <div className="grid grid-cols-12 gap-6 mt-5 w-full">
                                    {employees.map((employee, i) => (
                                        <div
                                            key={i}
                                            className="col-span-12 md:col-span-6 lg:col-span-4"
                                        >
                                            <div className="box">
                                                <div className="flex items-start px-5 pt-5">
                                                    <div
                                                        className="w-full flex flex-col lg:flex-row items-center">
                                                        <div className="w-16 h-16 image-fit">
                                                            <img
                                                                alt="Midone Tailwind HTML Admin Template"
                                                                className="rounded-full"
                                                                src={employee.user_profile.profile_picture}
                                                            />
                                                        </div>
                                                        <div
                                                            className="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
                                                            <a href="" className="font-medium">
                                                                {employee.user_profile.first_name} {employee.user_profile.last_name}

                                                            </a>
                                                            <div className="text-slate-500 text-xs mt-0.5">
                                                                {/*{employee?.roles[0]?.name}*/}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <Tippy
                                                            tag="div"
                                                            className=" text-gray-400 cursor-pointer"
                                                            content="Remove this employee"
                                                            options={{
                                                                theme: "light",
                                                            }}
                                                        >
                                                            <Lucide onClick={() => {
                                                                setDeleteModalForEmployeePreview(true)
                                                                setResourceId(employee.id)
                                                            }} icon="Trash" color={'#b4141b'} className="w-5 h-5"/>
                                                        </Tippy>
                                                    </div>
                                                </div>
                                                <div className="text-center lg:text-left p-5">
                                                    <div
                                                        className="flex items-center justify-center lg:justify-start text-slate-500 mt-5">
                                                        Email: {employee.email}

                                                    </div>
                                                    <div
                                                        className="flex items-center justify-center lg:justify-start text-slate-500 mt-1">
                                                        Joined: {employee.created_at}
                                                    </div>
                                                    <div
                                                        className="flex items-center justify-center lg:justify-start text-slate-500 mt-1">
                                                        Gender : {employee.gender}
                                                    </div>
                                                    <div
                                                        className="flex items-center justify-center lg:justify-start text-slate-500 mt-1">
                                                        Phone Number: {employee.phone_number}
                                                    </div>
                                                    <div
                                                        className="flex items-center justify-center lg:justify-start text-slate-500 mt-1">
                                                        Status : {employee.status}
                                                    </div>
                                                </div>
                                                <div
                                                    className="text-center lg:text-right p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                                    <button className="btn btn-primary py-1 px-2 mr-2">
                                                        Message
                                                    </button>
                                                    <button className="btn btn-outline-secondary py-1 px-2">
                                                        Profile
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Pagination {...paginationAttributes}
                                        onPrevClick={onPrevClick}
                                        onNextClick={onNextClick}
                                        onPageChange={onPageChange}
                                        onChange={onChange}
                                        onNavigate={(id) => onNavigate(id)}
                            />
                        </div>
                        <div
                            id="success-notification-content"
                            className="toastify-content hidden flex"
                        >
                            <Lucide icon="CheckCircle" className="text-success"/>
                            <div className="ml-4 mr-4">
                                <div className="font-medium">Deleted successfully!</div>
                                <div className="text-slate-500 mt-1">
                                    Please check your employee list!
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <NoData customize={true}/>
            )
        )

    );
}

export default ResourceEmployees;
