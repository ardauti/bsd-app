import useError from "../../../hooks/useError";
import {
    AccordionGroup,
    AccordionItem,
    Accordion,
    AccordionPanel,
    PreviewComponent,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@/components";
import {Link, useNavigate, useParams} from "react-router-dom";
import Pagination from "../../../components/pagination/Main";
import {createClient, listClients} from "../../../routes/routes";
import React, {useEffect, useState} from "react";
import {Lucide} from "../../../components";
import Skeleton from "react-loading-skeleton";
import classnames from "classnames";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import Toastify from "toastify-js";
function Clients() {

    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const {pageNumber} = useParams();
    const [pageSize, setPageSize] = useState(15);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(Number(pageNumber));
    const pageNumberLimit = 5;
    const [maxPageLimit, setMaxPageLimit] = useState(5);
    const [minPageLimit, setMinPageLimit] = useState(0);
    const [open, setOpen] = useState({})
    const [response, setResponse] = useState([]);
    const setError = useError()
    const navigate = useNavigate()
    const [addNewToolModalPreview, setAddNewToolModalPreview] = useState(false);
    const [client, setClient] = useState({
        id: '',
        companyName: '',
        email: '',
        birthdate: '',
        phoneNumber: '',
        country: '',
        city: '',
        street: '',
        postalCode: ''
    });


    useEffect(() => {
        const fetchData = async () => {
            if (!pageNumber) {
                navigate('/clients/page/1', {replace: true})
                setCurrentPage(1)
            } else {
                setIsLoading(true)
                try {
                    const response = await listClients(pageNumber, pageSize)
                    setClients(response.data)
                    setResponse(response)
                    setPageSize(response.meta.per_page)
                    setTotalCount(response.meta.total)
                    setIsLoading(false)
                } catch (err) {
                    setError(err)
                }
            }
        };
        fetchData()
    }, [currentPage, pageSize, pageNumber])

    const onPageChange = (pageNumber) => {
        if (pageNumber)
            navigate(`/clients/page/${pageNumber}`)
        else navigate(`/clients/page/1`)
        setCurrentPage(pageNumber);
    }

    const onPrevClick = () => {
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageLimit(maxPageLimit - pageNumberLimit);
            setMinPageLimit(minPageLimit - pageNumberLimit);
        }
        navigate(`/clients/page/${currentPage - 1}`)
        setCurrentPage(prev => prev - 1);
    }

    const onNextClick = () => {
        if (currentPage + 1 > maxPageLimit) {
            setMaxPageLimit(maxPageLimit + pageNumberLimit);
            setMinPageLimit(minPageLimit + pageNumberLimit);
        }
        navigate(`/clients/page/${currentPage + 1}`)
        setCurrentPage(prev => prev + 1);
    }

    const onChange = (e) => {
        setPageSize(e)
    }

    const onNavigate = (id) => {
        navigate(`/clients/client/${id}/dashboard`)
    }

    const paginationAttributes = {
        currentPage,
        maxPageLimit,
        minPageLimit,
        pageNumber,
        pageSize,
        totalCount,
        response: response,
    };

    function toggleFunction(id) {
        setOpen({
            ...open,
            [id]: !open[id],
        });
    }

    const schema = yup
        .object({
            companyName: yup.string().required(),
            email: yup.string().required(),
            phoneNumber: yup.number().required(),
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

    const onSubmit = async (event) => {
        event.preventDefault();
        if (client.companyName) {
            try {
                const params = {
                    company_name: client.companyName,
                    email: client.email,
                    phone_number: client.phoneNumber,
                    country: client.country,
                    city: client.city,
                    street: client.street,
                    postal_code: client.postalCode,
                }
                console.log(params)
                const response = await createClient(params);
                setClients([...clients, response])
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
            setAddNewToolModalPreview(false)
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
    };

    return (
        isLoading ? (
            <div >
                <div className={'intro-y flex text-center  justify-between'}>
                    <div className=" flex-start col-span-12 flex flex-wrap sm:flex-nowrap mt-10 ">
                        <Skeleton width={100}/>
                    </div>
                    <div className={'flex mt-9 pb-5'}>
                        <Skeleton width={70}/>
                        <Skeleton width={70} className={'ml-2'}/>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-5 ">
                    <div className="intro-y mt-9 col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="intro-y shadow-none box">
                            <div className={'shadow-none '}>
                                <div className={'grid grid-cols-1 p-2 gap-4'}>
                                    <div className={'font-medium p-2 flex cursor-pointer'}>
                                        <Skeleton width={150}/>
                                        <div className={'ml-auto'}>
                                            <Skeleton circle width={15} height={15}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="intro-y mt-9 col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="intro-y shadow-none box">
                            <div className={'shadow-none '}>
                                <div className={'grid grid-cols-1 p-2 gap-4'}>
                                    <div className={'font-medium p-2 flex cursor-pointer'}>
                                        <Skeleton width={150}/>
                                        <div className={'ml-auto'}>
                                            <Skeleton circle width={15} height={15}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="intro-y mt-9 col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="intro-y shadow-none box">
                            <div className={'shadow-none '}>
                                <div className={'grid grid-cols-1 p-2 gap-4'}>
                                    <div className={'font-medium p-2 flex cursor-pointer'}>
                                        <Skeleton width={150}/>
                                        <div className={'ml-auto'}>
                                            <Skeleton circle width={15} height={15}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <>
                <Modal
                    show={addNewToolModalPreview}
                    onHidden={() => {
                        setAddNewToolModalPreview(false);
                    }}
                    size={'modal-xl'}
                >
                    <form className="validate-form" onSubmit={onSubmit}>
                            <>
                                <ModalHeader>
                                    <h2 className="font-medium text-base mr-auto">
                                        Add new Client
                                    </h2>
                                </ModalHeader>
                                <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-1"
                                            className="form-label w-full flex flex-col sm:flex-row">
                                            Company Name
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, company name</span>
                                        </label>
                                        <input
                                            {...register("companyName")}
                                            id="validation-form-1"
                                            type="text"
                                            name="companyName"
                                            onInput={(e) => setClient(prevState => {
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
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, email address format</span>
                                        </label>
                                        <input
                                            {...register("email")}
                                            id="validation-form-2"
                                            type="email"
                                            name="email"
                                            onInput={(e) => setClient(prevState => {
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
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, phone number</span>
                                        </label>
                                        <input
                                            {...register("phoneNumber")}
                                            id="validation-form-2"
                                            type="number"
                                            name="phoneNumber"
                                            onInput={(e) => setClient(prevState => {
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
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, country</span>
                                        </label>
                                        <input
                                            {...register("country")}
                                            id="validation-form-2"
                                            type="text"
                                            name="country"
                                            onInput={(e) => setClient(prevState => {
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
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, city</span>
                                        </label>
                                        <input
                                            {...register("city")}
                                            id="validation-form-2"
                                            type="text"
                                            name="city"
                                            onInput={(e) => setClient(prevState => {
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
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, street</span>
                                        </label>
                                        <input
                                            {...register("street")}
                                            id="validation-form-2"
                                            type="text"
                                            name="street"
                                            onInput={(e) => setClient(prevState => {
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
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, postal code</span>
                                        </label>
                                        <input
                                            {...register("postalCode")}
                                            id="validation-form-2"
                                            type="text"
                                            name="postalCode"
                                            onInput={(e) => setClient(prevState => {
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
                                        onClick={() => setAddNewToolModalPreview(false)}
                                        className="btn btn-outline-secondary w-20 mr-1"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary ">
                                        Create
                                    </button>
                                </ModalFooter>
                            </>
                    </form>
                </Modal>
                <div className={'flex justify-between'}>
                    <div className="intro-y pb-3 col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                        <h2 className="intro-y pb-5 pl-5 text-lg font-medium mt-6">Clients</h2>
                    </div>
                    <div className={'mt-5 pb-3'}>
                        <Link
                            to={`/clients/deleted`}
                        >
                            <button className="btn btn-primary shadow-md mr-2">
                                Deleted Clients
                            </button>
                        </Link>
                            <button onClick={() => setAddNewToolModalPreview(true)} className="btn btn-primary shadow-md mr-2">
                                Add New Client
                            </button>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-5 ">
                    {clients.map((client, i) => (
                        <div
                            key={i}
                            className="intro-y mt-9 col-span-12 md:col-span-6 lg:col-span-4"
                        >
                            <PreviewComponent className="intro-y shadow-none box">
                                <AccordionGroup>
                                    <AccordionItem className={'shadow-none'}>
                                        <div className={'grid grid-cols-3 p-2 gap-4'}>
                                            <div className={'font-medium p-2 w-60 cursor-pointer'}
                                                 onClick={() => onNavigate(client.id)}>
                                                <h3>{client.company_name}</h3>
                                            </div>
                                            <div
                                                className={'col-span-2'}
                                                onClick={() => {
                                                    toggleFunction(i)
                                                }}>
                                                <Accordion
                                                    className={'cursor-pointer'}>
                                                    <Lucide className={`${open[i] && "rotate-180"} mt-2 w-5 h-5 ml-auto mr-2 duration-300 `} icon="ChevronDown"/>
                                                </Accordion>
                                            </div>
                                        </div>
                                        <AccordionPanel>
                                            <div className="px-4 z-10">
                                                <div className="block font-medium text-base">
                                                    {client.country}
                                                </div>
                                                <span className="text-xs mt-3">{client.city}</span>
                                            </div>
                                            <div className={'px-4 justify-center grid-flow-row-dense grid-cols-3 grid-rows-3'}>
                                                <div className={"col-span-12 flex"}>
                                                    <div className={'col-span-6 '}>Email: </div>
                                                    <div className={' col-span-6 font-medium ml-1'}>{client.email}</div>
                                                </div>
                                                <div className={"col-span-12 flex"}>
                                                    <div className={'col-span-6 '}> Phone Number:</div>
                                                    <div className={' col-span-6 font-medium ml-1'}>{client.phone_number}</div>
                                                </div>
                                                <div className={"col-span-12 pb-4 flex"}>
                                                    <div className={'col-span-6 '}>Postal code:</div>
                                                    <div className={'col-span-6 font-medium ml-1'}>{client.postal_code}</div>
                                                </div>
                                            </div>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </AccordionGroup>
                            </PreviewComponent>
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
            </>)
    )
}

export default Clients
