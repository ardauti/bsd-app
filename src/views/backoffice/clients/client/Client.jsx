import {
    Lucide,
    Tab,
    TabGroup,
    TabList,
    TabPanels,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Dropdown,
    DropdownContent,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from "@/components";
import React, {useEffect, useState} from 'react';
import {
    deleteClient,
    GetClientById, updateClient,
} from "../../../../routes/routes";
import Toastify from "toastify-js";
import useError from "../../../../hooks/useError";
import {useLocation, useParams} from "react-router-dom";
import {useNavigate} from "react-router";
import Catalogs from "../../catalogs/Catalogs";
import Skeleton from "react-loading-skeleton";
import classnames from "classnames";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";


function Client() {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [activeTab, setActiveTab] = useState('')
    const setError = useError()
    const navigate = useNavigate();
    const location = useLocation();
    const [client, setClient] = useState({
        id: '',
        companyName: '',
        email: '',
        phoneNumber: '',
        country: '',
        city: '',
        street: '',
        postalCode: ''
    });
    const [editClient, setEditClient] = useState({
        companyName: '',
        email: '',
        phoneNumber: '',
        country: '',
        city: '',
        street: '',
        postalCode: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [deleteModalPreview, setDeleteModalPreview] = useState(false);
    const {id} = useParams();
    const [editClientModalPreview, setEditClientModalPreview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await GetClientById(id);
                setClient(prevState => {
                    return {
                        ...prevState,
                        id: res.id,
                        companyName: res.company_name,
                        email: res.email,
                        country: res.country,
                        city: res.city,
                        phoneNumber: res.phone_number,
                        street: res.street,
                        postalCode: res.postal_code,
                    }
                })
                setIsLoading(false);
            } catch (err) {
                setError(err);
            }
        };
        fetchData();

        const setTabs = () => {
            const pathname = window.location.pathname;
            console.log(pathname)
            if (pathname === `/clients/client/${id}/client-details`) {
                setActiveTab('client-details');
                setSelectedIndex(1);
            } else if (pathname === `/clients/client/${id}/catalogs`) {
                setActiveTab('catalogs');
                setSelectedIndex(2);
            } else {
                setActiveTab('/dashboard');
                setSelectedIndex(0);
            }
        }

        setTabs();

        const handleLocationChange = () => {
            setTabs();
        }

        window.addEventListener('popstate', handleLocationChange);

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
        };


    }, [id, setActiveTab, setSelectedIndex, setIsLoading, setClient, setError]);

    const DeleteClient = async () => {
        try {
            await deleteClient(id)
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
            navigate(`/clients/page/1`, {replace: true})
        } catch (err) {
            setError(err)
        }
        setDeleteModalPreview(false)
    }

    const onEdit = async () => {
        setEditClient(prevState => {
            return {
                ...prevState,
                companyName: client.companyName,
                email: client.email,
                phoneNumber: client.phoneNumber,
                country: client.country,
                city: client.city,
                street: client.street,
                postalCode: client.postalCode
            }
        })
        setEditClientModalPreview(true)
    }

    const onUpdate = async (event) => {
        event.preventDefault();
            try {
                const params = {
                    company_name: editClient.companyName,
                    email: editClient.email,
                    phone_number: editClient.phoneNumber,
                    country: editClient.country,
                    city: editClient.city,
                    street: editClient.street,
                    postal_code: editClient.postalCode,
                }
                const response = await updateClient(params, client.id)
                setClient(prevState => {
                    return {
                        ...prevState,
                        id: response.id,
                        companyName: response.company_name,
                        email: response.email,
                        phoneNumber: response.phone_number,
                        country: response.country,
                        city: response.city,
                        street: response.street,
                        postalCode: response.postal_code,
                    }
                })
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
                    node: dom("#failed-updated-content")
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
            setEditClientModalPreview(false)
    };

    const schema = yup
        .object({
            companyName: yup.string().required(),
            phoneNumber: yup.number().required(),
            email: yup.string().required(),
            country: yup.string().required(),
            city: yup.string().required(),
            street: yup.string().required(),
            postalCode: yup.number().required(),
        })
        .required();


    const {
        register,
        trigger,
        formState: {errors},
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    return (
        isLoading ? (
            <div>
                <div className="intro-y box px-5 pt-5 mt-5">
                    <div
                        className="flex w-full ml-auto mr-auto border-b border-slate-200/60 dark:border-darkmode-400 pb-5 -mx-5">

                        <div className="font-medium text-center lg:text-left lg:mt-3">
                            <Skeleton width={200} />
                        </div>
                    </div>
                    <div
                        className="nav-link-tabs flex-col sm:flex-row lg:justify-between flex lg:justify-between text-center">
                        <div className='p-5'>
                            <Skeleton width={70} />
                        </div>
                        <div className='p-5'>
                            <Skeleton width={60} />
                        </div>
                        <div className='p-5'>
                            <Skeleton width={50} />
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div>
                <Modal
                    show={deleteModalPreview}
                    onHidden={() => {
                        setDeleteModalPreview(false);
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
                                    setDeleteModalPreview(false);
                                }}
                                className="btn btn-outline-secondary w-24 mr-1"
                            >
                                Cancel
                            </button>
                            <button onClick={DeleteClient} type="button" className="btn btn-danger w-24">
                                Delete
                            </button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal
                    show={editClientModalPreview}
                    onHidden={() => {
                        setEditClientModalPreview(false);
                    }}
                    size={'modal-xl'}
                >
                    <form className="validate-form" onSubmit={onUpdate}>
                        <>
                            <ModalHeader>
                                <h2 className="font-medium text-base mr-auto">
                                    Edit Client
                                </h2>
                            </ModalHeader>
                            <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                <div className="col-span-12">
                                    <label
                                        htmlFor="validation-form-1"
                                        className="form-label w-full flex flex-col sm:flex-row">
                                        Company Name
                                    </label>
                                    <input
                                        {...register("companyName")}
                                        id="validation-form-1"
                                        type="text"
                                        name="companyName"
                                        value={editClient.companyName}
                                        onChange={(e) => setEditClient(prevState => {
                                            return {
                                                ...prevState,
                                                companyName: e.target['value']
                                            }
                                        })}
                                        className={classnames({
                                            "form-control": true,
                                            "border-danger": errors.companyName,
                                        })}
                                        placeholder="Company Name"
                                    />
                                    {errors.companyName && (
                                        <div className="text-danger mt-2">
                                            {errors.companyName.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-12">
                                    <label
                                        htmlFor="validation-form-2"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                                        Email
                                    </label>
                                    <input
                                        {...register("email")}
                                        id="validation-form-2"
                                        type="email"
                                        name="email"
                                        value={editClient.email}
                                        onChange={(e) => setEditClient(prevState => {
                                            return {
                                                ...prevState,
                                                email: e.target['value']
                                            }
                                        })}
                                        className={classnames({
                                            "form-control": true,
                                            "border-danger": errors.email,
                                        })}
                                        placeholder="example@gmail.com"
                                    />
                                    {errors.email && (
                                        <div className="text-danger mt-2">
                                            {errors.email.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-12">
                                    <label
                                        htmlFor="validation-form-2"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                                        Phone number
                                    </label>
                                    <input
                                        {...register("phoneNumber")}
                                        id="validation-form-2"
                                        type="number"
                                        name="phoneNumber"
                                        value={editClient.phoneNumber}
                                        onChange={(e) => setEditClient(prevState => {
                                            return {
                                                ...prevState,
                                                phoneNumber: e.target['value']
                                            }
                                        })}
                                        className={classnames({
                                            "form-control": true,
                                            "border-danger": errors.phoneNumber,
                                        })}
                                        placeholder="Phone number"
                                    />
                                    {errors.phoneNumber && (
                                        <div className="text-danger mt-2">
                                            {errors.phoneNumber.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-12">
                                    <label
                                        htmlFor="validation-form-2"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                                        Country
                                    </label>
                                    <input
                                        {...register("country")}
                                        id="validation-form-2"
                                        type="text"
                                        name="country"
                                        value={editClient.country}
                                        onChange={(e) => setEditClient(prevState => {
                                            return {
                                                ...prevState,
                                                country: e.target['value']
                                            }
                                        })}
                                        className={classnames({
                                            "form-control": true,
                                            "border-danger": errors.country,
                                        })}
                                        placeholder="Country"
                                    />
                                    {errors.country && (
                                        <div className="text-danger mt-2">
                                            {errors.country.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-12">
                                    <label
                                        htmlFor="validation-form-2"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                                        City
                                    </label>
                                    <input
                                        {...register("city")}
                                        id="validation-form-2"
                                        type="text"
                                        name="city"
                                        value={editClient.city}
                                        onChange={(e) => setEditClient(prevState => {
                                            return {
                                                ...prevState,
                                                city: e.target['value']
                                            }
                                        })}
                                        className={classnames({
                                            "form-control": true,
                                            "border-danger": errors.city,
                                        })}
                                        placeholder="City"
                                    />
                                    {errors.city && (
                                        <div className="text-danger mt-2">
                                            {errors.city.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-12">
                                    <label
                                        htmlFor="validation-form-2"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                                        Street
                                    </label>
                                    <input
                                        {...register("street")}
                                        id="validation-form-2"
                                        type="text"
                                        name="street"
                                        value={editClient.street}
                                        onChange={(e) => setEditClient(prevState => {
                                            return {
                                                ...prevState,
                                                street: e.target['value']
                                            }
                                        })}
                                        className={classnames({
                                            "form-control": true,
                                            "border-danger": errors.street,
                                        })}
                                        placeholder="Street"
                                    />
                                    {errors.street && (
                                        <div className="text-danger mt-2">
                                            {errors.street.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-12">
                                    <label
                                        htmlFor="validation-form-2"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                                        Postal code
                                    </label>
                                    <input
                                        {...register("postalCode")}
                                        id="validation-form-2"
                                        type="text"
                                        name="postalCode"
                                        value={editClient.postalCode}
                                        onChange={(e) => setEditClient(prevState => {
                                            return {
                                                ...prevState,
                                                postalCode: e.target['value']
                                            }
                                        })}
                                        className={classnames({
                                            "form-control": true,
                                            "border-danger": errors.postalCode,
                                        })}
                                        placeholder="Postal Code"
                                    />
                                    {errors.postalCode && (
                                        <div className="text-danger mt-2">
                                            {errors.postalCode.message}
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <button
                                    type="button"
                                    onClick={() => setEditClientModalPreview(false)}
                                    className="btn btn-outline-secondary w-20 mr-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary ">
                                    Update
                                </button>
                            </ModalFooter>
                        </>
                    </form>
                </Modal>
                <TabGroup selectedIndex={selectedIndex}>
                    {/* BEGIN: Profile Info */}
                    <div className="intro-y box px-5 pt-5 mt-5">
                        <div
                            className="flex w-full ml-auto mr-auto border-b border-slate-200/60 dark:border-darkmode-400 pb-5 -mx-5">

                            <div className="font-medium text-center lg:text-left lg:mt-3">
                                <h2 className={'text-2xl'}>{client.companyName}</h2>
                            </div>
                            <div className='flex z-50'>
                            </div>
                            <Dropdown className="absolute right-0 top-0 mr-5 mt-7">
                                <DropdownToggle tag="a" className="w-5 h-5 block" href="#">
                                    <Lucide
                                        icon="MoreHorizontal"
                                        className="w-5 h-5 text-slate-500"
                                    />
                                </DropdownToggle>
                                <DropdownMenu className="w-40">
                                    <DropdownContent>
                                        <DropdownItem onClick={() => onEdit()}>
                                            <Lucide icon="Edit2" className="w-4 h-4 mr-2"/> Edit
                                        </DropdownItem>
                                        <DropdownItem onClick={() => setDeleteModalPreview(true)}>
                                            <Lucide icon="Trash" className="w-4 h-4 mr-2"/> Delete
                                        </DropdownItem>
                                    </DropdownContent>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <TabList
                            className="nav-link-tabs flex-col sm:flex-row lg:justify-between flex lg:justify-between text-center">
                            <div onClick={() => {
                                setActiveTab('dashboard')
                                navigate(location.pathname.split('/').slice(0, -1).join('/') + '/dashboard')
                            }
                            } className='cursor-pointer'>
                                <Tab
                                    fullWidth={false}
                                    className="py-4 flex items-center "
                                >
                                    <Lucide icon="LayoutDashboard" className="cursor-pointer w-4 h-4 mr-2"/>
                                    <div>Dashboard</div>
                                </Tab>
                            </div>
                            <div onClick={() => {
                                setActiveTab('client-details')
                                navigate(location.pathname.split('/').slice(0, -1).join('/') + '/client-details')

                            }} className='cursor-pointer'>
                                <Tab
                                    fullWidth={false}
                                    className="py-4 flex items-center "
                                >
                                    <Lucide icon="Codesandbox" className=" cursor-pointer w-4 h-4 mr-2"/>
                                    <div>Client Details</div>
                                </Tab>
                            </div>
                            <div onClick={() => {
                                setActiveTab('catalogs')
                                navigate(location.pathname.split('/').slice(0, -1).join('/') + '/catalogs')
                            }} className='cursor-pointer'>
                                <Tab
                                    fullWidth={false}
                                    className="py-4 flex items-center "
                                >
                                    <Lucide icon="ClipboardCheck" className="cursor-pointer w-4 h-4 mr-2"/>
                                    <div>Catalogs</div>
                                </Tab>
                            </div>
                        </TabList>
                    </div>
                    {/* END: Profile Info */}
                    <TabPanels className="mt-5">
                        {activeTab === 'dashboard' && <div className="leading-relaxed">
                            Dashboard
                        </div>
                        }
                        {activeTab === 'client-details' && <div className="leading-relaxed">
                            clientdetails
                        </div>}
                        {activeTab === 'catalogs' && <div className="leading-relaxed">
                            <Catalogs/>
                        </div>}
                    </TabPanels>
                </TabGroup>
                <div
                    id="success-notification-content"
                    className="toastify-content hidden flex"
                >
                    <Lucide icon="CheckCircle" className="text-success"/>
                    <div className="ml-4 mr-4">
                        <div className="font-medium">Deleted successfully!</div>
                        <div className="text-slate-500 mt-1">
                            Please check clients list!
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
                            Please check client details!
                        </div>

                    </div>

                </div>
                <div
                    id="failed-updated-content"
                    className="toastify-content hidden flex"
                >
                    <Lucide icon="CheckCircle" className="text-success"/>
                    <div className="ml-4 mr-4">
                        <div className="font-medium">Failed field!</div>
                        <div className="text-slate-500 mt-1">
                            Please check field form!
                        </div>

                    </div>

                </div>
            </div>
        )
    )
}

export default Client