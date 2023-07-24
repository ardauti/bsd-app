import React, {useEffect, useState} from "react";
import {
    createProject,
    GetAllProjects, getClientsOnChange,
    getProjectStatus,
    getUsersOnChange,
    getUsersTest,
    listOfClients
} from "../../../routes/routes";
import useError from "../../../hooks/useError";
import $_ from "lodash/array";
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
    Lucide, Tippy,
    Litepicker,
} from "@/components";
import {Link, useNavigate, useParams} from "react-router-dom";
import Pagination from "../../../components/pagination/Main";
import {faker as $f} from "@/utils";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import makeAnimated from 'react-select/animated';
import moment from "moment";
import classnames from "classnames";
import Toastify from "toastify-js";

const animatedComponents = makeAnimated();

function Projects() {

    const [projectList, setProjectList] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {pageNumber} = useParams();
    const [pageSize, setPageSize] = useState(15);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(Number(pageNumber));
    const pageNumberLimit = 5;
    const [maxPageLimit, setMaxPageLimit] = useState(5);
    const [minPageLimit, setMinPageLimit] = useState(0);
    const [response, setResponse] = useState([]);
    const [open, setOpen] = useState({})
    const setError = useError()
    const navigate = useNavigate()
    const [addNewToolModalPreview, setAddNewToolModalPreview] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [project, setProject] = useState({
        id: '',
        name: '',
        startDate: '',
        endDate: '',
        clientId: '',
        statusId: '',
        description: '',
        resources: {
            employees: ''
        },
    });
    const [clients, setClients] = useState([]);
    const [clientsDefault, setClientsDefault] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeesDefault, setEmployeesDefault] = useState([]);
    const [projectStatus, setProjectStatus] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await GetAllProjects(pageNumber, pageSize)
                console.log(response)
                setProjectList(response.data)
                setResponse(response)
                setPageSize(response.meta.per_page)
                setTotalCount(response.meta.total)
                console.log(response.meta.total)
                console.log(response)
                setIsLoading(false)
            } catch (err) {
                setError(err)
            }
        };
        fetchData()
    }, [currentPage, pageSize, pageNumber,])

    useEffect(() => {
        const fetchModalData = async () => {
            if (addNewToolModalPreview) {
                setIsLoadingModal(true)
                try {
                    const clients = await listOfClients()
                    const status = await getProjectStatus()
                    const employees = await getUsersTest()
                    setClients(clients)
                    setClientsDefault(clients)
                    setEmployees(employees)
                    setEmployeesDefault(employees)
                    setProjectStatus(status)
                } catch (err) {
                    setError(err)
                }
                setIsLoadingModal(false)
            } else {
            }
        };
        fetchModalData()
    }, [addNewToolModalPreview])

    const onPageChange = (pageNumber) => {
        if (pageNumber)
            navigate(`/projects/page/${pageNumber}`)
        else navigate(`/projects/page/1`)
        setCurrentPage(pageNumber);
    }

    const onPrevClick = () => {
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageLimit(maxPageLimit - pageNumberLimit);
            setMinPageLimit(minPageLimit - pageNumberLimit);
        }
        navigate(`/projects/page/${currentPage - 1}`)
        setCurrentPage(prev => prev - 1);
    }

    const onNextClick = () => {
        if (currentPage + 1 > maxPageLimit) {
            setMaxPageLimit(maxPageLimit + pageNumberLimit);
            setMinPageLimit(minPageLimit + pageNumberLimit);
        }
        navigate(`/projects/page/${currentPage + 1}`)
        setCurrentPage(prev => prev + 1);
    }

    const onChange = (e) => {
        setPageSize(e)
    }
    const onNavigate = (id) => {
        navigate(`/projects/project/${id}/dashboard`)
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
            projectName: yup.string().required(),
            description: yup.string().required(),
            startDate: yup.date().required(),
            endDate: yup.date().required(),
            selectClient: yup
                .object()
                .required()
            ,
            selectProjectStatus: yup
                .object()
                .required()
            ,
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

    const optionsClient = clients.map(function (client) {
        return {value: client.id, label: client.company_name};
    })

    const options = employees.map(function (employee) {
        return {value: employee.id, label: employee.user_profile.display_name};
    })

    const optionsStatus = projectStatus.map(function (status) {
        return {value: status.id, label: status.status};
    })

    const handleChange = (e) => {
        setProject(prevState => {
            return {
                ...prevState,
                resources: {
                    employees: e.map(x => x.value)
                }
            }
        })
    };
    const handleChangeClients = (e) => {
        setProject(prevState => {
            return {
                ...prevState,
                clientId: e.value
            }
        })
    };

    const handleChangeProjectStatus = (e) => {
        setProject(prevState => {
            return {
                ...prevState,
                statusId: e.value
            }
        })
    };

    const handleSearch = async (searchQuery) => {
        if (searchQuery.trim().length === 0) {
            setEmployees(employeesDefault)
            return
        }
        setLoading(true)
        let employees = []
        try {
            employees = await getUsersOnChange(searchQuery)
        } catch (err) {
            setError(err)
        } finally {
            setEmployees(employees)
            setLoading(false)
        }
    }

    const handleSearchForClient = async (searchQuery) => {
        if (searchQuery.trim().length === 0) {
            setClients(clientsDefault)
            return
        }
        setLoading(true)
        let clients = []
        try {
            clients = await getClientsOnChange(searchQuery)
        } catch (err) {
            setError(err)
        } finally {
            setClients(clients)
            setLoading(false)
        }
    }

    const noOptionsMessage = function (obj) {
        if (obj.inputValue.trim().length === 0) {
            return null;
        }
        return 'No matching';
    };
    const handleInputChange = function (inputText, meta) {
        if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
            // …
            handleSearch(inputText);
        }
    };
    const handleInputClientsChange = function (inputText, meta) {
        if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
            // …
            handleSearchForClient(inputText);
        }
    };

    const style = {
        control: base => ({
            ...base,
            borderColor: 'e2e8f0',
            cursor: 'pointer',
        }),
        option: (base, {isFocused, isSelected}) => {
            return {
                ...base,
                backgroundColor: isFocused ? "#e2e8f0" : "",
                color: isSelected ? '#1f5164' : '',
                fontWeight: isSelected ? 'bolder' : 'normal',
                cursor: 'pointer',
            };
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const params = {
                name: project.name,
                description: project.description,
                start_date: moment(project.startDate).format("YYYY-MM-DD"),
                end_date: moment(project.endDate).format("YYYY-MM-DD"),
                client_id: project.clientId,
                status_id: project.statusId,
                resources: {employees: project.resources.employees}
            }
            const response = await createProject(params);
            setProjectList([...projectList, response])
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
            setIsLoading(false)
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
    };

    return (
        isLoading ? (
            <div>
                <div className={' intro-y flex text-center  justify-between'}>
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
                        {isLoadingModal ? (
                            <>
                                <ModalHeader>
                                    <Skeleton width={200}/>
                                </ModalHeader>
                                <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                    <div className="col-span-12 mx-4">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 m-4">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 m-4">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 m-4">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 m-4">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 m-4">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 m-4">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <div className={'w-full flex'}>
                                        <div className={'ml-auto'}>
                                            <Skeleton width={100} className={'mr-1'}/>
                                        </div>
                                        <div>
                                            <Skeleton width={100} className={'mr-1'}/>
                                        </div>
                                    </div>
                                </ModalFooter>
                            </>
                        ) : (
                            <>
                                <ModalHeader>
                                    <h2 className="font-medium text-base mr-auto">
                                        Add Project
                                    </h2>
                                </ModalHeader>
                                <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-1"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            Project Name
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, project name
</span>
                                        </label>
                                        <input
                                            {...register("name")}
                                            id="validation-form-1"
                                            type="text"
                                            name="name"
                                            onInput={(e) => setProject(prevState => {
                                                return {
                                                    ...prevState,
                                                    name: e.target['value']
                                                }
                                            })}
                                            className={classnames({
                                                "form-control": true,
                                                "border-danger": errors.name,
                                            })}
                                            placeholder="Project Name"
                                        />
                                        {errors.name && (
                                            <div className="text-danger mt-2">
                                                {errors.name.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-1"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            Description
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, description
</span>
                                        </label>
                                        <input
                                            {...register("description")}
                                            id="validation-form-1"
                                            type="text"
                                            name="description"
                                            onInput={(e) => setProject(prevState => {
                                                return {
                                                    ...prevState,
                                                    description: e.target['value']
                                                }
                                            })}
                                            className={classnames({
                                                "form-control": true,
                                                "border-danger": errors.description,
                                            })}
                                            placeholder="Description"
                                        />
                                        {errors.description && (
                                            <div className="text-danger mt-2">
                                                {errors.description.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-3"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            Start Date
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, start date
</span>
                                        </label>
                                        <Litepicker
                                            value={project.startDate}
                                            onChange={(e) => setProject(prevState => {
                                                return {
                                                    ...prevState,
                                                    startDate: e
                                                }
                                            })}
                                            options={{
                                                autoApply: true,
                                                showWeekNumbers: true,
                                                dropdowns: {
                                                    minYear: 1990,
                                                    maxYear: null,
                                                    months: true,
                                                    years: true,
                                                },
                                            }}
                                            className="form-control"
                                        />
                                        {errors.startDate && (
                                            <div className="text-danger mt-2">
                                                {errors.startDate.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-3"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            End Date
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, end date
</span>
                                        </label>
                                        <Litepicker
                                            value={project.endDate}
                                            onChange={(e) => setProject(prevState => {
                                                return {
                                                    ...prevState,
                                                    endDate: e
                                                }
                                            })}
                                            options={{
                                                autoApply: true,
                                                showWeekNumbers: true,
                                                dropdowns: {
                                                    minYear: 1990,
                                                    maxYear: null,
                                                    months: true,
                                                    years: true,
                                                },
                                            }}
                                            className="form-control"
                                        />
                                        {errors.endDate && (
                                            <div className="text-danger mt-2">
                                                {errors.endDate.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-4"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            Employees
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, at least one employee
</span>
                                        </label>
                                        <Select
                                            isMulti
                                            options={options}
                                            components={animatedComponents}
                                            onChange={handleChange}
                                            onInputChange={handleInputChange}
                                            isLoading={loading}
                                            styles={style}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: '#E2E8F0',
                                                    primary: '#e2e8f0',
                                                },
                                            })}
                                            filterOption={null}
                                            placeholder={'Search for employees'}
                                            noOptionsMessage={noOptionsMessage}
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-4"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            Clients
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                            Required, just one Client
                          </span>
                                        </label>
                                        <Select
                                            options={optionsClient}
                                            components={animatedComponents}
                                            onChange={handleChangeClients}
                                            onInputChange={handleInputClientsChange}
                                            filterOption={null}
                                            styles={style}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: '#E2E8F0',
                                                    primary: '#e2e8f0',
                                                },
                                            })}
                                            placeholder={'Search for clients'}
                                            noOptionsMessage={noOptionsMessage}
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-4"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            Project Status
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                            Required, just one Project Status
                          </span>
                                        </label>
                                        <Select
                                            options={optionsStatus}
                                            components={animatedComponents}
                                            onChange={handleChangeProjectStatus}
                                            filterOption={null}
                                            styles={style}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: '#E2E8F0',
                                                    primary: '#e2e8f0',
                                                },
                                            })}
                                            noOptionsMessage={noOptionsMessage}
                                        />
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
                        )}

                    </form>
                </Modal>
                <div className={'flex text-center  justify-between'}>
                    <div className="flex-start col-span-12 flex flex-wrap sm:flex-nowrap mt-2 ">
                        <h2 className="pb-5 pl-5 text-lg font-medium mt-8">Projects</h2>
                    </div>
                    <div className={'flex mt-9 pb-5'}>
                        <Link
                            to={`/projects/deleted-projects`}
                        >
                            <button className="btn btn-primary shadow-md mr-2">
                                Deleted Projects
                            </button>
                        </Link>
                        <button onClick={() => setAddNewToolModalPreview(true)}
                                className="btn btn-primary shadow-md mr-2">
                            Add New Projects
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-5 ">
                    {$_.take(projectList, 20).map((project, i) => (
                        <div
                            key={i}
                            className="intro-y mt-9 col-span-12 md:col-span-6 lg:col-span-4"
                        >
                            <PreviewComponent className=" shadow-none box">
                                <AccordionGroup>
                                    <AccordionItem className={'shadow-none '}>
                                        <div className={'grid grid-cols-3 p-2 gap-4'}>
                                            <div className={'font-medium p-2 w-60 cursor-pointer'}
                                                 onClick={() => onNavigate(project.id)}>
                                                <h3>{project.name}</h3>
                                            </div>
                                            <div
                                                className={'col-span-2'}
                                                onClick={() => {
                                                    toggleFunction(i)
                                                }}>
                                                <Accordion
                                                    className={'cursor-pointer'}>
                                                    <Lucide
                                                        className={`${open[i] && "rotate-180"} mt-2 w-5 h-5 ml-auto mr-2 duration-300 `}
                                                        icon="ChevronDown"/>
                                                </Accordion>
                                            </div>
                                        </div>
                                        <AccordionPanel>
                                            <div className={'px-4 pb-2'}>{project.description}</div>
                                            <div
                                                className={'px-4 justify-center grid-flow-row-dense grid-cols-3 grid-rows-3'}>
                                                <div className={"col-span-12 flex"}>
                                                    <div className={'col-span-6 '}> Project Started:</div>
                                                    <div
                                                        className={' col-span-6 font-medium ml-1'}>{moment(project.start_date).format("D MMM, YYYY")}</div>
                                                </div>
                                                <div className={"col-span-12 flex"}>
                                                    <div className={'col-span-6 '}>Due date:</div>
                                                    <div
                                                        className={' col-span-6 font-medium ml-1'}>{moment(project.end_date).format("D MMM, YYYY")}</div>
                                                </div>
                                                <div className={'col-span-12 items-center pt-2 flex'}>
                                                    <div className={'text-sm col-span-6'}>Employees:</div>
                                                    <div>
                                                        {$_.take($f(), 1).map((faker, fakerKey) => (
                                                            <div
                                                                key={i}
                                                                className={"col-span-6"}>
                                                                <div className="w-40 ">
                                                                    <div className="flex">
                                                                        <div
                                                                            className="w-10 h-10 image-fit zoom-in ml-auto">
                                                                            <Tippy
                                                                                tag="img"
                                                                                alt="Midone Tailwind HTML Admin Template"
                                                                                className="rounded-full"
                                                                                src={faker.images[0]}
                                                                                content={`Uploaded at ${faker.dates[0]}`}
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className="w-10 h-10 image-fit zoom-in -ml-5">
                                                                            <Tippy
                                                                                tag="img"
                                                                                alt="Midone Tailwind HTML Admin Template"
                                                                                className="rounded-full"
                                                                                src={faker.images[1]}
                                                                                content={`Uploaded at ${faker.dates[1]}`}
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className="w-10 h-10 image-fit zoom-in -ml-5">
                                                                            <Tippy
                                                                                tag="img"
                                                                                alt="Midone Tailwind HTML Admin Template"
                                                                                className="rounded-full"
                                                                                src={faker.images[2]}
                                                                                content={`Uploaded at ${faker.dates[2]}`}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={'px-4 pb-4'}>
                                                Progress
                                                <div className="progress h-3.5">
                                                    <div
                                                        style={{width: `${project.progress[project.progress.length - 1].Completed}%`}}
                                                        className={`progress-bar`}
                                                        role="progressbar"
                                                        aria-valuenow="0"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    >
                                                        {project.progress[project.progress.length - 1].Completed === 0 ? '' : project.progress[project.progress.length - 1].Completed + '%'}
                                                    </div>
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

                {/* BEGIN: Success Notification Content */}
                <div
                    id="success-notification-content"
                    className="toastify-content hidden flex"
                >
                    <Lucide icon="CheckCircle" className="text-success"/>
                    <div className="ml-4 mr-4">
                        <div className="font-medium">Create success!</div>
                        <div className="text-slate-500 mt-1">
                            Please check project list!
                        </div>
                    </div>
                </div>
                {/* END: Success Notification Content */}
                {/* BEGIN: Failed Notification Content */}
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
                {/* END: Failed Notification Content */}

            </>)
    )
}

export default Projects
