import {
    Lucide,
    LoadingIcon,
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
    getVehicleResources,
} from "../../../../../../routes/routes";
import Toastify from "toastify-js";
import {GiCarWheel} from "@react-icons/all-files/gi/GiCarWheel";
import DataContext from "../../../../../../context/DataContext";
import NoData from "../../../../../public/no-data/Main"
import Skeleton from "react-loading-skeleton";


function ResourceVehicles(props) {
    const navigate = useNavigate();
    const setError = useError()
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [resourceId, setResourceId] = useState('')
    const [deleteModalForVehicleResource, setDeleteModalForVehicleResource] = useState(false);
    const {id} = useParams();
    const [pageSize, setPageSize] = useState(15);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageNumberLimit = 5;
    const [maxPageLimit, setMaxPageLimit] = useState(5);
    const [minPageLimit, setMinPageLimit] = useState(0);
    const [response, setResponse] = useState([]);
    let {setVehiclesResource} = useContext(DataContext)


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await getVehicleResources(id, currentPage, pageSize)
                setVehicles(response.data)
                setVehiclesResource(response.data)
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
            await deleteProjectResource(Number(id), props.resourceType, resourceId)
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
            const newList = vehicles.filter((item) => item.vehicle_id !== resourceId);
            setVehicles(newList)
            setVehiclesResource(newList)
        } catch (err) {
            setError(err)
        }
        setDeleteModalForVehicleResource(false)
    }

    return (
        isLoading ? (
            <div className="intro-y flex items-center mt-2">
                <div className={'w-full'}>
                    <div className="col-span-12 grid grid-cols-12 gap-6 mt-8">
                        <div className="col-span-12 sm:col-span-6 2xl:col-span-6 intro-y">
                            <div className="box p-5 flex items-center zoom-in">
                                <Skeleton circle width={50} height={50}/>
                                <div className="ml-4 mr-auto">
                                    <Skeleton width={100}/>
                                    <div className="text-xs mt-0.5">
                                        <Skeleton width={50}/>
                                    </div>
                                </div>
                                <div
                                    className="py-1 px-2">
                                    <Skeleton width={70}/>
                                </div>
                                <div className="ml-3">
                                    <Skeleton circle width={30} height={30}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 2xl:col-span-6 intro-y">
                            <div className="box p-5 flex items-center zoom-in">
                                <Skeleton circle width={50} height={50}/>
                                <div className="ml-4 mr-auto">
                                    <Skeleton width={100}/>
                                    <div className="text-xs mt-0.5">
                                        <Skeleton width={50}/>
                                    </div>
                                </div>
                                <div
                                    className="py-1 px-2">
                                    <Skeleton width={70}/>
                                </div>
                                <div className="ml-3">
                                    <Skeleton circle width={30} height={30}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            vehicles.length !== 0 ? (
                <>
                    <Modal
                        show={deleteModalForVehicleResource}
                        onHidden={() => {
                            setDeleteModalForVehicleResource(false);
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
                                        setDeleteModalForVehicleResource(false);
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
                    <div className="flex items-center mt-2">
                        <div className={'w-full'}>
                            <div className=" col-span-12 grid grid-cols-12 gap-6 mt-8">
                                {vehicles.map((vehicle, fakerKey) => (
                                    <div key={fakerKey} className="col-span-12 sm:col-span-6 2xl:col-span-6">
                                        <div className="box p-5 flex items-center zoom-in">
                                            <div className="w-10 h-10 flex-none image-fit rounded-md overflow-hidden">
                                                <GiCarWheel className={'w-10 h-10'} color={'#202a3b'}/>
                                            </div>
                                            <div className="ml-4 mr-auto">
                                                <div className="font-medium">{vehicle.manufacturer}</div>
                                                <div className="text-slate-500 text-xs mt-0.5">
                                                    {vehicle.plate_number}
                                                </div>
                                            </div>
                                            <div
                                                className="py-1 px-2 rounded-full text-xs bg-blue-900 text-white cursor-pointer font-medium">
                                                {vehicle.plate_number}
                                            </div>
                                            <div className="ml-3">
                                                <Tippy
                                                    tag="div"
                                                    className=" text-gray-400 cursor-pointer"
                                                    content="Remove this vehicle"
                                                    options={{
                                                        theme: "light",
                                                    }}
                                                >
                                                    <Lucide onClick={() => {
                                                        setDeleteModalForVehicleResource(true)
                                                        setResourceId(vehicle.vehicle_id)
                                                    }} icon="Trash" color={'#b4141b'} className="w-5 h-5"/>
                                                </Tippy>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                    Please check your tool list!
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

export default ResourceVehicles;
