import React, {useCallback, useEffect, useState} from "react";
import {
    createVehicle,
    deleteVehicleById, getVehicles, getVehiclesOnChange,
    getVehiclesWithPagination,
    updateVehicleById
} from "../../../../routes/routes";
import useError from "../../../../hooks/useError";
import {
    LoadingIcon,
    PreviewComponent,
    Preview,
    Lucide,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TinySlider,
} from "@/components";
import classnames from "classnames";
import Toastify from "toastify-js";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useNavigate} from "react-router";
import Pagination from "../../../../components/pagination/Main";
import image from '../../../../assets/images/preview-7.jpg'
import image2 from '../../../../assets/images/preview-6.jpg'
import image3 from '../../../../assets/images/preview-9.jpg'
import image4 from '../../../../assets/images/preview-10.jpg'
import Skeleton from "react-loading-skeleton";

function ResourceVehicles() {
    const [isLoading, setIsLoading] = useState(false)
    const [vehicles, setVehicles] = useState([])
    const [addVehicleModalPreview, setAddVehicleModalPreview] = useState(false);
    const [deleteVehicleModalPreview, setDeleteVehicleModalPreview] = useState(false);
    const [editVehicleModalPreview, setEditVehicleModalPreview] = useState(false);
    const [vehicle, setVehicle] = useState({
        id: '',
        manufacturer: '',
        plate_number: ''
    })
    const [response, setResponse] = useState([])
    const pageNumberLimit = 5;
    const [maxPageLimit, setMaxPageLimit] = useState(5);
    const [minPageLimit, setMinPageLimit] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const setError = useError();
    const [modalImages, setModalImages] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                console.log('here')
                const res = await getVehiclesWithPagination(currentPage, pageSize)
                setVehicles(res.data)
                setResponse(res)
                setPageSize(res.meta?.per_page)
                setTotalCount(res.meta?.total)
                setIsLoading(false)
            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, [currentPage, pageSize]);
    const schema = yup
        .object({
            manufacturer: yup.string().required(),
            plate_number: yup.string().required(),
        })
        .required();

    const {
        register,
        resetField,
        setValue,
        formState: {errors},
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            manufacturer: '',
            plate_number: '',
        },
        resolver: yupResolver(schema),
    });

    const onSubmit = useCallback(async (event) => {
        event.preventDefault()
        if (vehicle.manufacturer && vehicle.plate_number) {
            try {
                const params = {
                    manufacturer: vehicle.manufacturer,
                    plate_number: vehicle.plate_number,
                }
                const response = await createVehicle(params);
                setVehicles([...vehicles, response])
                vehicle.manufacturer = ''
                vehicle.plate_number = ''
                resetField('manufacturer')
                resetField('plate_number')
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
                setError(err)
                Toastify({
                    node: dom("#failed-notification-content")
                        .clone()
                        .removeClass("hidden")[0],
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                }).showToast();
            }
        } else {
            Toastify({
                node: dom("#failed-notification-content")
                    .clone()
                    .removeClass("hidden")[0],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        }
        setAddVehicleModalPreview(false)
    }, [vehicle])

    const onDelete = useCallback(async (id) => {
        setVehicle({id: id, name: '', number: ''})
        setDeleteVehicleModalPreview(true)
    }, [])

    const deleteVehicle = useCallback(async () => {
        try {
            await deleteVehicleById(vehicle.id)
            Toastify({
                node: dom("#success-deleted-content")
                    .clone()
                    .removeClass("hidden")[0],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
            const newList = vehicles.filter((item) => item.id !== vehicle.id);
            setVehicles(newList)
        } catch (err) {
            setError(err)
        }
        setDeleteVehicleModalPreview(false)
    }, [vehicle])

    const updateVehicle = async (vehicle) => {
        setVehicle({
            id: vehicle.id,
            manufacturer: vehicle.manufacturer,
            plate_number: vehicle.plate_number
        })
        setEditVehicleModalPreview(true);
    }
    const onUpdate = useCallback(async (event) => {
        event.preventDefault()
        if (vehicle.manufacturer && vehicle.plate_number) {
            try {
                const params = {
                    manufacturer: vehicle.manufacturer,
                    plate_number: vehicle.plate_number,
                }
                const response = await updateVehicleById(params, vehicle.id);
                const newList = vehicles.map((item) => {
                    if (item.id === vehicle.id) {
                        return {
                            ...item, manufacturer: response.manufacturer, plate_number: response.plate_number
                        }
                    } else {
                        return {
                            ...item
                        }
                    }
                });
                setVehicles(newList)
                vehicle.manufacturer = ''
                vehicle.plate_number = ''
                Toastify({
                    node: dom("#success-updated-content")
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
                setError(err)
                Toastify({
                    node: dom("#failed-notification-content")
                        .clone()
                        .removeClass("hidden")[0],
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                }).showToast();
            }
        } else {
            Toastify({
                node: dom("#failed-notification-content")
                    .clone()
                    .removeClass("hidden")[0],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        }
        setEditVehicleModalPreview(false)
    }, [vehicle])
    const onPageChange = (pageNumber) => {
        navigate(`/resources/vehicles`)
        setCurrentPage(pageNumber);
    }
    const onChange = (e) => {
        setPageSize(e)
    }

    const onNextClick = () => {
        if (currentPage + 1 > maxPageLimit) {
            setMaxPageLimit(maxPageLimit + pageNumberLimit);
            setMinPageLimit(minPageLimit + pageNumberLimit);
        }
        navigate(`/resources/vehicles`)
        setCurrentPage(prev => prev + 1);
    }

    const onPrevClick = () => {
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageLimit(maxPageLimit - pageNumberLimit);
            setMinPageLimit(minPageLimit - pageNumberLimit);
        }
        navigate(`/resources/vehicles`)
        setCurrentPage(prev => prev - 1);
    }

    const onNavigate = () => {
        navigate(`/resources/vehicles`, {replace: true})
    }

    const paginationAttributes = {
        currentPage,
        maxPageLimit,
        minPageLimit,
        pageSize,
        totalCount,
        response: response,
    };
    const handleSearch = async (e) => {
        let searchQuery = e.target.value
        if (searchQuery === '') {
            const vehicles = await getVehicles()
            setVehicles(vehicles)
            return
        }
        let searchVehicles = []
        try {
            searchVehicles = await getVehiclesOnChange(searchQuery)
        } catch (err) {
            setError(err)
        } finally {
            setVehicles(searchVehicles)
        }
    }

    return (
        <>
            {
                isLoading ? (
                    <div>
                        <div className="intro-y flex items-center mt-8">
                            <div className="mr-auto"><Skeleton width={80}/></div>
                            <div className="w-full sm:w-auto flex mr-2  sm:mt-0 sm:ml-auto md:ml-0">
                                <Skeleton width={200}/>
                            </div>
                            <div className={'ml-auto'}>
                                <Skeleton width={100}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-6 mt-16">
                            <div className="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
                                <div className="box">
                                    <div className="p-5">
                                        <div
                                            className="h-40 2xl:h-56 image-fit rounded-md overflow-hidden ">
                                            <Skeleton height={200}/>
                                            <div
                                                className="absolute bottom-0 px-5 pb-6 z-10">
                                                <Skeleton width={70}/>
                                                <Skeleton width={50}/>
                                            </div>
                                        </div>
                                        <div
                                            className="mt-5">
                                            <div className="flex items-center">
                                                <Skeleton width={150}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center lg:justify-end items-center p-5 border-t">
                                        <div
                                            className="flex items-center cursor-pointer text-primary mr-auto"
                                        >
                                            <Skeleton width={70}/>
                                        </div>
                                        <div
                                            className="flex cursor-pointer items-center mr-3">
                                            <Skeleton width={50}/>
                                        </div>
                                        <div
                                            className="flex items-center cursor-pointer text-danger"
                                        >
                                            <Skeleton width={60}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
                                <div className="box">
                                    <div className="p-5">
                                        <div
                                            className="h-40 2xl:h-56 image-fit rounded-md overflow-hidden ">
                                            <Skeleton height={200}/>
                                            <div
                                                className="absolute bottom-0 px-5 pb-6 z-10">
                                                <Skeleton width={70}/>
                                                <Skeleton width={50}/>
                                            </div>
                                        </div>
                                        <div
                                            className="mt-5">
                                            <div className="flex items-center">
                                                <Skeleton width={150}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="flex justify-center lg:justify-end items-center p-5 border-t">
                                        <div
                                            className="flex items-center cursor-pointer text-primary mr-auto"
                                        >
                                            <Skeleton width={70}/>
                                        </div>
                                        <div
                                            className="flex cursor-pointer items-center mr-3">
                                            <Skeleton width={50}/>
                                        </div>
                                        <div
                                            className="flex items-center cursor-pointer text-danger"
                                        >
                                            <Skeleton width={60}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
                                <div className="box">
                                    <div className="p-5">
                                        <div
                                            className="h-40 2xl:h-56 image-fit rounded-md overflow-hidden ">
                                            <Skeleton height={200}/>
                                            <div
                                                className="absolute bottom-0 px-5 pb-6 z-10">
                                                <Skeleton width={70}/>
                                                <Skeleton width={50}/>
                                            </div>
                                        </div>
                                        <div
                                            className="mt-5">
                                            <div className="flex items-center">
                                                <Skeleton width={150}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="flex justify-center lg:justify-end items-center p-5 border-t">
                                        <div
                                            className="flex items-center cursor-pointer text-primary mr-auto"
                                        >
                                            <Skeleton width={70}/>
                                        </div>
                                        <div
                                            className="flex cursor-pointer items-center mr-3">
                                            <Skeleton width={50}/>
                                        </div>
                                        <div
                                            className="flex items-center cursor-pointer text-danger"
                                        >
                                            <Skeleton width={60}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
                                <div className="box">
                                    <div className="p-5">
                                        <div
                                            className="h-40 2xl:h-56 image-fit rounded-md overflow-hidden ">
                                            <Skeleton height={200}/>
                                            <div
                                                className="absolute bottom-0 px-5 pb-6 z-10">
                                                <Skeleton width={70}/>
                                                <Skeleton width={50}/>
                                            </div>
                                        </div>
                                        <div
                                            className="mt-5">
                                            <div className="flex items-center">
                                                <Skeleton width={150}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="flex justify-center lg:justify-end items-center p-5 border-t">
                                        <div
                                            className="flex items-center cursor-pointer text-primary mr-auto"
                                        >
                                            <Skeleton width={70}/>
                                        </div>
                                        <div
                                            className="flex cursor-pointer items-center mr-3">
                                            <Skeleton width={50}/>
                                        </div>
                                        <div
                                            className="flex items-center cursor-pointer text-danger"
                                        >
                                            <Skeleton width={60}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center mt-8">
                            <h2 className="text-lg font-medium mr-auto">Vehicles</h2>
                            <div className="w-full sm:w-auto flex mr-2  sm:mt-0 sm:ml-auto md:ml-0">
                                <div className="w-56 relative text-slate-500">
                                    <input
                                        type="text"
                                        className="form-control w-56 box pr-10"
                                        placeholder="Search..."
                                        onChange={handleSearch}
                                    />
                                    <Lucide
                                        icon="Search"
                                        className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                    />
                                </div>
                            </div>
                            <div className={'flex  ml-auto'}>
                                <button onClick={() => {
                                    setAddVehicleModalPreview(true);
                                }} className="btn btn-primary shadow-md mr-2">
                                    Add New Vehicle
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 ">
                                {/* BEGIN: Modal Size */}
                                <PreviewComponent>
                                    {({toggle}) => (
                                        <>
                                            <div className="p-5">
                                                <Preview>
                                                    <Modal
                                                        show={addVehicleModalPreview}
                                                        onHidden={() => {
                                                            setAddVehicleModalPreview(false);
                                                        }}
                                                    >
                                                        <form className="validate-form" onSubmit={onSubmit}>
                                                            <ModalHeader>
                                                                <h2 className="font-medium text-base mr-auto">
                                                                    Add new vehicle
                                                                </h2>
                                                            </ModalHeader>
                                                            <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Manufacturer
                                                                    </label>
                                                                    <input
                                                                        {...register("manufacturer")}
                                                                        id="validation-form-1"
                                                                        type="text"
                                                                        name="manufacturer"
                                                                        onInput={(e) => setVehicle(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                manufacturer: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.manufacturer,
                                                                        })}
                                                                        placeholder="Manufacturer"
                                                                    />
                                                                    {errors.manufacturer && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.manufacturer.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Plate number
                                                                    </label>
                                                                    <input
                                                                        {...register("plate_number")}
                                                                        id="validation-form-1"
                                                                        type="text"
                                                                        name="plate_number"
                                                                        onInput={(e) => setVehicle(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                plate_number: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.plate_number,
                                                                        })}
                                                                        placeholder="Serial number"
                                                                    />
                                                                    {errors.plate_number && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.plate_number.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setAddVehicleModalPreview(false)}
                                                                    className="btn btn-outline-secondary w-20 mr-1"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button type="submit" className="btn btn-primary ">
                                                                    Create
                                                                </button>
                                                            </ModalFooter>
                                                        </form>
                                                    </Modal>
                                                    <Modal
                                                        show={deleteVehicleModalPreview}
                                                        onHidden={() => {
                                                            setDeleteVehicleModalPreview(false);
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
                                                                        setDeleteVehicleModalPreview(false);
                                                                    }}
                                                                    className="btn btn-outline-secondary w-24 mr-1"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button onClick={deleteVehicle} type="button"
                                                                        className="btn btn-danger w-24">
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                    <Modal
                                                        show={editVehicleModalPreview}
                                                        onHidden={() => {
                                                            setEditVehicleModalPreview(false);
                                                        }}
                                                    >
                                                        <form className="validate-form" onSubmit={onUpdate}>
                                                            <ModalHeader>
                                                                <h2 className="font-medium text-base mr-auto">
                                                                    Edit Vehicle
                                                                </h2>
                                                            </ModalHeader>
                                                            <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Manufacturer
                                                                    </label>
                                                                    <input
                                                                        {...register("manufacturer")}
                                                                        {...setValue('manufacturer', `${vehicle.manufacturer}`)}
                                                                        id="validation-form-1"
                                                                        type="text"
                                                                        name="manufacturer"
                                                                        onInput={(e) => setVehicle(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                manufacturer: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.manufacturer,
                                                                        })}
                                                                        placeholder="Manufacturer"
                                                                    />
                                                                    {errors.manufacturer && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.manufacturer.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Plate Number
                                                                    </label>
                                                                    <input
                                                                        {...register("plate_number")}
                                                                        {...setValue('plate_number', `${vehicle.plate_number}`)}
                                                                        id="validation-form-1"
                                                                        type="text"
                                                                        name="plate_number"
                                                                        onInput={(e) => setVehicle(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                plate_number: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.plate_number,
                                                                        })}
                                                                        placeholder="Plate number"
                                                                    />
                                                                    {errors.plate_number && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.plate_number.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditVehicleModalPreview(false);
                                                                    }}
                                                                    className="btn btn-outline-secondary w-20 mr-1"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button type="submit" className="btn btn-primary ">
                                                                    Update
                                                                </button>
                                                            </ModalFooter>
                                                        </form>
                                                    </Modal>
                                                    <Modal
                                                        show={modalImages}
                                                        size={'modal-xl'}
                                                        onHidden={() => {
                                                            setModalImages(false);
                                                        }}
                                                    >
                                                        <ModalBody>
                                                            <div className="mx-6">
                                                                <TinySlider
                                                                    options={{
                                                                        mouseDrag: true,
                                                                        autoplay: false,
                                                                        controls: true,
                                                                        center: true,
                                                                        nav: false,
                                                                        items: 3,
                                                                        swipeAngle: false,
                                                                        speed: 400,
                                                                        responsive: {
                                                                            350: {
                                                                                items: 2
                                                                            },
                                                                        },
                                                                    }}
                                                                >
                                                                    <div className="h-56 px-2">
                                                                        <div
                                                                            className="h-full image-fit rounded-md overflow-hidden">
                                                                            <img
                                                                                alt="Midone Tailwind HTML Admin Template"
                                                                                src={image}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="h-56 px-2">
                                                                        <div
                                                                            className="h-full image-fit rounded-md overflow-hidden">
                                                                            <img
                                                                                alt="Midone Tailwind HTML Admin Template"
                                                                                src={image2}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="h-56 px-2">
                                                                        <div
                                                                            className="h-full image-fit rounded-md overflow-hidden">
                                                                            <img
                                                                                alt="Midone Tailwind HTML Admin Template"
                                                                                src={image3}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="h-56 px-2">
                                                                        <div
                                                                            className="h-full image-fit rounded-md overflow-hidden">
                                                                            <img
                                                                                alt="Midone Tailwind HTML Admin Template"
                                                                                src={image4}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </TinySlider>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                    {vehicles.length === 0 ? (
                                                        <div
                                                            className="col-span-12 sm:col-span-3 lg:col-span-12 xl:col-span-1 flex mt-8 justify-center items-center">
                                                            <div className="m-auto">
                                                                <Lucide icon="FolderMinus" color={'#bfbfbf70'}
                                                                        className="block mx-auto w-20 h-20"/>
                                                                <div
                                                                    className="text-center text-lg text-gray-400 mt-2">No
                                                                    Data
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-12 gap-6 mt-5">
                                                            {vehicles.map((vehicle, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
                                                                >
                                                                    <div className="box">
                                                                        <div className="p-5">
                                                                            <div
                                                                                className="h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                                                                <img
                                                                                    alt="Midone - HTML Admin Template"
                                                                                    className="rounded-md"
                                                                                    src={image}
                                                                                />

                                                                                <div
                                                                                    className="absolute bottom-0 text-white px-5 pb-6 z-10">
                                                                                    <a href=""
                                                                                       className="block font-medium text-base">
                                                                                        {vehicle.manufacturer}
                                                                                    </a>
                                                                                    <span
                                                                                        className="text-white/90 text-xs mt-3">
                      {vehicle.plate_number}
                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="text-slate-600 dark:text-slate-500 mt-5">
                                                                                <div className="flex items-center">
                                                                                    <Lucide icon="Link"
                                                                                            className="w-4 h-4 mr-2"/> Price:
                                                                                    $
                                                                                    test
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                                                            <div
                                                                                className="flex items-center cursor-pointer text-primary mr-auto"
                                                                                onClick={() => {
                                                                                    setModalImages(true);
                                                                                }}>
                                                                                <Lucide icon="Eye"
                                                                                        className="w-4 h-4 mr-1"/> Preview
                                                                            </div>
                                                                            <div
                                                                                className="flex cursor-pointer items-center mr-3"
                                                                                onClick={() => {
                                                                                    updateVehicle(vehicle)
                                                                                }}>
                                                                                <Lucide icon="CheckSquare"
                                                                                        className="w-4 h-4 mr-1"/> Edit
                                                                            </div>
                                                                            <div
                                                                                className="flex items-center cursor-pointer text-danger"
                                                                                onClick={() => onDelete(vehicle.id)}
                                                                            >
                                                                                <Lucide icon="Trash2"
                                                                                        className="w-4 h-4 mr-1"/> Delete
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <Pagination {...paginationAttributes}
                                                                onPrevClick={onPrevClick}
                                                                onNextClick={onNextClick}
                                                                onPageChange={onPageChange}
                                                                onChange={onChange}
                                                                onNavigate={onNavigate}
                                                    />


                                                    <div
                                                        id="success-notification-content"
                                                        className="toastify-content hidden flex"
                                                    >
                                                        <Lucide icon="CheckCircle" className="text-success"/>
                                                        <div className="ml-4 mr-4">
                                                            <div className="font-medium">Created successfully!</div>
                                                            <div className="text-slate-500 mt-1">
                                                                Please check your vehicles list!
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        id="failed-notification-content"
                                                        className="toastify-content hidden flex"
                                                    >
                                                        <Lucide icon="XCircle" className="text-danger"/>
                                                        <div className="ml-4 mr-4">
                                                            <div className="font-medium">Create failed!</div>
                                                            <div className="text-slate-500 mt-1">
                                                                Please check the field form.
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        id="success-deleted-content"
                                                        className="toastify-content hidden flex"
                                                    >
                                                        <Lucide icon="CheckCircle" className="text-success"/>
                                                        <div className="ml-4 mr-4">
                                                            <div className="font-medium">Deleted successfully!</div>
                                                            <div className="text-slate-500 mt-1">
                                                                Please check your vehicles list!
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        id="success-updated-content"
                                                        className="toastify-content hidden flex"
                                                    >
                                                        <Lucide icon="CheckCircle" className="text-success"/>
                                                        <div className="ml-4 mr-4">
                                                            <div className="font-medium">Updated successfully!</div>
                                                            <div className="text-slate-500 mt-1">
                                                                Please check your vehicles list!
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Preview>
                                            </div>
                                        </>
                                    )}
                                </PreviewComponent>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );

}

export default ResourceVehicles;
