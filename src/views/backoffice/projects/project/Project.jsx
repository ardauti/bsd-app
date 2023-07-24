import {
    Lucide,
    Tab,
    TabGroup,
    TabList,
    TabPanels,
    Litepicker,
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
import React, {useCallback, useEffect, useState} from 'react';
import {
    DeleteProjects,
    getProjectbyId,
    getProjectStatus,
    getUsersOnChange,
    getUsersTest,
    updateProject,
    createTask,
    getTaskStatus
} from "../../../../routes/routes";
import Toastify from "toastify-js";
import useError from "../../../../hooks/useError";
import {useLocation, useParams} from "react-router-dom";
import {useNavigate} from "react-router";
import ProjectFiles from "./project-files/project-files";
import ListTasks from "./tasks/list-tasks/list-tasks";
import Resources from "./resources/Resources";
import Skeleton from "react-loading-skeleton";
import classnames from "classnames";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import moment from "moment";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CustomButton from "../../../../components/customButton/CustomButon";
import TimeSheet from "./work-log/Main";
import Dashboard from "@/views/backoffice/projects/project/dashboard/dashboard";

const animatedComponents = makeAnimated();

function Project() {
    const [activeTab, setActiveTab] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const setError = useError()
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [deleteModalPreview, setDeleteModalPreview] = useState(false);
    const {id} = useParams();
    const [editProjectModalPreview, setEditProjectModalPreview] = useState(false);
    const [project, setProject] = useState({
        id: '',
        name: '',
        startDate: '',
        endDate: '',
        clientId: '',
        statusId: '',
        progress: '',
        description: '',
        resources: {
            employees: ''
        },
        statusDescription: '',
        projectStatus: '',
        client: ''
    });
    const [editProject, setEditProject] = useState({
        name: '',
        startDate: '',
        endDate: '',
        statusId: '',
        description: '',
    });
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [projectStatuses, setProjectStatuses] = useState([]);
    const [addNewTaskModalPreview, setAddNewTaskModalPreview] = useState(false);
    const [createTaskState, setCreateTaskState] = useState({
        projectId: Number(id),
        taskName: '',
        assigneeId: [],
        deadline: '',
        description: '',
        taskStatusId: [],
    });
    const [employees, setEmployees] = useState([]);
    const [employeesDefault, setEmployeesDefault] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingCreate, setIsLoadingCreate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getProjectbyId(id);
                setProject(prevState => {
                    return {
                        ...prevState,
                        id: res.id,
                        name: res.name,
                        startDate: res.start_date,
                        endDate: res.end_date,
                        progress: res.progress,
                        statusId: res.status.id,
                        clientId: res.client.id,
                        description: res.description,
                        statusDescription: res.status.description,
                        projectStatus: res.status.status,
                        client: res.client.company_name
                    }
                })
                setIsLoading(false);
            } catch (err) {
                setError(err);
            }
        };
        fetchData()
    }, []);


    useEffect(() => {
        const pathname = window.location.pathname;
        let activeTabValue;
        let selectedIndexValue;
        if (pathname === `/projects/project/${id}/tasks`) {
            activeTabValue = 'tasks';
            selectedIndexValue = 1;
        } else if (pathname === `/projects/project/${id}/timesheet`) {
            activeTabValue = 'timesheet';
            selectedIndexValue = 2;
        } else if (pathname === `/projects/project/${id}/files`) {
            activeTabValue = 'files';
            selectedIndexValue = 3;
        } else if (pathname === `/projects/project/${id}/resources`) {
            activeTabValue = 'resources';
            selectedIndexValue = 4;
        } else {
            activeTabValue = 'dashboard';
            selectedIndexValue = 0;
        }
        setActiveTab(activeTabValue);
        setSelectedIndex(selectedIndexValue);
        const handlePopstate = () => {
            const url = window.location.href;
            const arrayUrl = url.split('/');
            const lastSegment = arrayUrl[arrayUrl.length - 1];

            if (lastSegment === 'dashboard' || lastSegment === id) {
                setActiveTab('dashboard');
                setSelectedIndex(0);
                if (lastSegment === id) {
                    navigate(`/projects/project/${id}/dashboard`);
                }
            } else if (lastSegment === 'tasks') {
                setActiveTab('tasks');
                setSelectedIndex(1);
            } else if (lastSegment === 'timesheet') {
                setActiveTab('timesheet');
                setSelectedIndex(2);
            } else if (lastSegment === 'files') {
                setActiveTab('files');
                setSelectedIndex(3);
            } else if (lastSegment === 'resources') {
                setActiveTab('resources');
                setSelectedIndex(4);
            }
        };

        window.addEventListener('popstate', handlePopstate);


        return () => {
            window.removeEventListener('popstate', handlePopstate);
        };
    }, [location.pathname]);

    const onEdit = async () => {
        setEditProject(prevState => {
            return {
                ...prevState,
                name: project.name,
                description: project.description,
                startDate: project.startDate,
                endDate: project.endDate,
                statusId: project.statusId,
            }
        })
        setEditProjectModalPreview(true)
        setIsLoadingModal(true)
        const statuses = await getProjectStatus()
        setProjectStatuses(statuses)
        setIsLoadingModal(false)
    }
    const onCreate = async () => {
        setAddNewTaskModalPreview(true)
    }

    const deleteProject = async () => {
        try {
            await DeleteProjects(id)
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
            navigate(`/projects/page/1`, {replace: true})
        } catch (err) {
            setError(err)
        }
        setDeleteModalPreview(false)
    }
    const schema = yup
        .object({
            name: yup.string().required(),
            description: yup.number().required(),
            startDate: yup.string().required(),
            endDate: yup.string().required(),
        })
        .required();


    const {
        register,
        resetField,
        setValue,
        formState: {errors},
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });


    function handleDatePickerStartDate(e) {
        setValue('startDate', e.value)
        setEditProject(prevState => {
            return {
                ...prevState,
                startDate: e
            }
        })
    }

    function handleDatePickerEndDate(e) {
        setValue('endDate', e.value)
        setEditProject(prevState => {
            return {
                ...prevState,
                endDate: e
            }
        })
    }

    const style = {
        control: base => ({
            ...base,
            borderColor: 'e2e8f0',
            cursor: 'pointer',
// This line disable the blue border
// boxShadow: "none"
        }),
        option: (base, {data, isDisabled, isFocused, isSelected}) => {
            return {
                ...base,
                backgroundColor: isFocused ? "#e2e8f0" : "",
                color: isSelected ? '#1f5164' : '',
                fontWeight: isSelected ? 'bolder' : 'normal',
                cursor: 'pointer',
            };
        }
    };

    const options = projectStatuses.map(function (status) {
        return {value: status.id, label: status.status};
    });

    const noOptionsMessage = function (obj) {
        if (obj.inputValue.trim().length === 0) {
            return null;
        }
        return 'No matching';
    };

    useEffect(() => {
        setValue('name', editProject.name);
        setValue('description', editProject.description);
        setValue('startDate', editProject.startDate);
        setValue('endDate', editProject.endDate);
        setValue('statusId', editProject.statusId);
    }, [editProject]);

    const onUpdate = useCallback(async (event) => {
        event.preventDefault();
        try {
            const params = {
                name: editProject.name,
                description: editProject.description,
                start_date: moment(editProject.startDate).format("YYYY-MM-DD"),
                end_date: moment(editProject.endDate).format("YYYY-MM-DD"),
                status_id: editProject.statusId,
            }
            const response = await updateProject(params, project.id)
            setProject(prevState => {
                return {
                    ...prevState,
                    id: response.id,
                    name: response.name,
                    description: response.description,
                    startDate: response.start_date,
                    endDate: response.end_date,
                    statusId: response.status.id,
                    clientId: response.client_id,
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
        setEditProjectModalPreview(false)
    }, [editProject, project]);

    useEffect(() => {
        const fetchModalData = async () => {
            if (addNewTaskModalPreview) {
                setIsLoadingModal(true)
                try {
                    const status = await getTaskStatus()
                    const employees = await getUsersTest()
                    setEmployees(employees)
                    setEmployeesDefault(employees)
                    setTaskStatus(status)
                } catch (err) {
                    setError(err)
                }
                setIsLoadingModal(false)
            }
        };
        fetchModalData()
    }, [addNewTaskModalPreview])

    const optionStatus = taskStatus.map(function (status) {
        return {value: status.id, label: status.status};
    })

    //functionality for single Assignee
    const handleSearchForAssignee = async (searchQuery) => {
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


    const optionsAssignies = employees.map(function (employee) {
        return {value: employee.id, label: employee.user_profile.display_name};
    })

    const handleChangeAssignee = (e) => {
        setCreateTaskState(prevState => {
            return {
                ...prevState,
                assigneeId: e
            }
        })
    };
    const handleChangeProjectStatus = (e) => {
        setCreateTaskState(prevState => {
            return {
                ...prevState,
                taskStatusId: e
            }
        })
    };


    const handleInputAssigneeChange = function (inputText, meta) {
        if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
            // …
            handleSearchForAssignee(inputText);
        }
    };
    const [createdTask, setCreatedTask] = useState(null);

    const onSubmit = useCallback(async (e) => {
        e.preventDefault()
        setIsLoadingCreate(true)
        try {
            const params = {
                project_id: createTaskState.projectId,
                name: createTaskState.taskName,
                assignee_id: createTaskState.assigneeId.value,
                deadline: moment(createTaskState.deadline).format("YYYY-MM-DD"),
                description: createTaskState.description,
                task_statuses_id: createTaskState.taskStatusId.value,
            }
            const response = await createTask(params)
            setCreatedTask(response)
            resetField('taskName', '');
            resetField('taskDescription', '');
            setCreateTaskState(prevState => {
                return {
                    ...prevState,
                    deadline: moment(Date.now()).format("D MMM, YYYY"),
                    taskStatusId: [],
                    assigneeId: [],
                }
            })
            navigate(`/projects/project/${id}/tasks`, {replace: true})
        } catch (err) {
            setError(err)
        }
        setIsLoadingCreate(false)
        setAddNewTaskModalPreview(false)
    }, [createTaskState.deadline, createTaskState.assigneeId, createTaskState.taskStatusId])

    return (
        isLoading ? (
            <div>
                {/* BEGIN: Profile Info */}
                <div className="intro-y box px-5 pt-5 mt-5">
                    <div
                        className="flex w-full ml-auto mr-auto border-b border-slate-200/60 dark:border-darkmode-400 pb-5 -mx-5">

                        <div className="font-medium text-center lg:text-left lg:mt-3">
                            <Skeleton width={200}/>
                        </div>
                    </div>
                    <div
                        className="nav-link-tabs flex-col sm:flex-row lg:justify-between flex lg:justify-between text-center">
                        <div className='p-5'>
                            <Skeleton width={70}/>
                        </div>
                        <div className='p-5'>
                            <Skeleton width={50}/>
                        </div>
                        <div className='p-5'>
                            <Skeleton width={60}/>
                        </div>
                        <div className='p-5'>
                            <Skeleton width={50}/>
                        </div>
                        <div className='p-5'>
                            <Skeleton width={70}/>
                        </div>
                        <div className='p-5'>
                            <Skeleton width={60}/>
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
                            <button onClick={deleteProject} type="button" className="btn btn-danger w-24">
                                Delete
                            </button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal
                    show={editProjectModalPreview}
                    onHidden={() => {
                        setEditProjectModalPreview(false);
                    }}
                    size={'modal-xl'}
                >
                    <form className="validate-form" onSubmit={onUpdate}>
                        {isLoadingModal ? (
                            <>
                                <ModalHeader>
                                    <Skeleton width={200}/>
                                </ModalHeader>
                                <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                    <div className="col-span-12 mt-2">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 mt-2">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 mt-2">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 mt-2">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 mt-2">
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
                                </ModalFooter></>
                        ) : (
                            <>
                                <ModalHeader>
                                    <h2 className="font-medium text-base mr-auto">
                                        Edit Project
                                    </h2>
                                </ModalHeader>
                                <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-1"
                                            className="form-label w-full flex flex-col sm:flex-row">
                                            Project Name
                                        </label>
                                        <input
                                            {...register("name")}
                                            id="validation-form-1"
                                            type="text"
                                            name="name"
                                            value={editProject.name}
                                            onChange={(e) => setEditProject(prevState => {
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
                                            htmlFor="validation-form-2"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            Description
                                        </label>
                                        <input
                                            {...register("description")}
                                            id="validation-form-2"
                                            type="text"
                                            name="description"
                                            value={editProject.description}
                                            onChange={(e) => setEditProject(prevState => {
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
                                        </label>
                                        <Litepicker
                                            getRef={(e) => setValue('startDate', e.value)}
                                            value={moment(editProject.startDate).format("D MMM, YYYY")}
                                            onChange={(e) => handleDatePickerStartDate(e)}
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
                                        </label>
                                        <Litepicker
                                            getRef={(e) => setValue('endDate', e.value)}
                                            value={moment(editProject.endDate).format("D MMM, YYYY")}
                                            onChange={(e) => handleDatePickerEndDate(e)}
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
                                            Project Status
                                        </label>
                                        <Select
                                            options={options}
                                            components={animatedComponents}
                                            value={options.find(obj => obj.value === editProject.statusId)}
                                            onChange={(e) => setEditProject(prevState => {
                                                return {
                                                    ...prevState,
                                                    statusId: e.value
                                                }
                                            })}
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
                                            noOptionsMessage={noOptionsMessage}
                                        />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <button
                                        type="button"
                                        onClick={() => setEditProjectModalPreview(false)}
                                        className="btn btn-outline-secondary w-20 mr-1"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary ">
                                        Update
                                    </button>
                                </ModalFooter>
                            </>
                        )}

                    </form>
                </Modal>

                <Modal
                    show={addNewTaskModalPreview}
                    onHidden={() => {
                        setAddNewTaskModalPreview(false);
                    }}
                    size={'modal-xl'}
                >
                    <form className="validate-form" onSubmit={onSubmit}>
                        {isLoadingModal ? (
                            <>
                                <ModalHeader>
                                    <Skeleton width={100}/>
                                </ModalHeader>
                                <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                    <div className="col-span-12 mt-5">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 mt-2">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 mt-2">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 mt-2">
                                        <Skeleton width={100}/>
                                        <Skeleton count={1}/>
                                    </div>
                                    <div className="col-span-12 mt-2">
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
                                </ModalFooter></>
                        ) : (
                            <>
                                <ModalHeader>
                                    <h2 className="font-medium text-base mr-auto">
                                        Create task
                                    </h2>
                                </ModalHeader>
                                <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-1"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            Task Name
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, task name
</span>
                                        </label>
                                        <input
                                            {...register("taskName")}
                                            id="validation-form-1"
                                            type="text"
                                            name="taskName"
                                            onInput={(e) => setCreateTaskState(prevState => {
                                                return {
                                                    ...prevState,
                                                    taskName: e.target['value']
                                                }
                                            })}
                                            className={classnames({
                                                "form-control": true,
                                                "border-danger": errors.taskName,
                                            })}
                                            placeholder="Task name"
                                        />
                                        {errors.taskName && (
                                            <div className="text-danger mt-2">
                                                {errors.taskName.message}
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
                                            {...register("taskDescription")}
                                            id="validation-form-1"
                                            type="text"
                                            name="taskDescription"
                                            onInput={(e) => setCreateTaskState(prevState => {
                                                return {
                                                    ...prevState,
                                                    description: e.target['value']
                                                }
                                            })}
                                            className={classnames({
                                                "form-control": true,
                                                "border-danger": errors.taskDescription,
                                            })}
                                            placeholder="Description"
                                        />
                                        {errors.taskDescription && (
                                            <div className="text-danger mt-2">
                                                {errors.taskDescription.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-3"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            Deadline
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, deadline
</span>
                                        </label>
                                        <Litepicker
                                            value={createTaskState.deadline}
                                            onChange={(e) => setCreateTaskState(prevState => {
                                                return {
                                                    ...prevState,
                                                    deadline: e
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
                                        {errors.deadline && (
                                            <div className="text-danger mt-2">
                                                {errors.deadline.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-4"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            Assignee
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                            Required, just one Assignee
                          </span>
                                        </label>
                                        <Select
                                            value={createTaskState.assigneeId}
                                            options={optionsAssignies}
                                            components={animatedComponents}
                                            onChange={handleChangeAssignee}
                                            onInputChange={handleInputAssigneeChange}
                                            isLoading={loading}
                                            styles={style}
                                            filterOption={null}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: '#E2E8F0',
                                                    primary: '#e2e8f0',
                                                },
                                            })}
                                            placeholder={'Search for employee'}
                                            noOptionsMessage={noOptionsMessage}


                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="validation-form-4"
                                            className="form-label w-full flex flex-col sm:flex-row"
                                        >
                                            Task Status
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                                  Required, just one task Status
                                </span>
                                        </label>
                                        <Select
                                            value={createTaskState.taskStatusId}
                                            options={optionStatus}
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
                                        onClick={() => setAddNewTaskModalPreview(false)}
                                        className="btn btn-outline-secondary w-20 mr-1"
                                    >
                                        Cancel
                                    </button>
                                    <CustomButton type={'submit'} isLoading={isLoadingCreate} disabled={isLoadingCreate}
                                                  className={'btn btn-primary '}>Create</CustomButton>
                                </ModalFooter>
                            </>
                        )}
                    </form>
                </Modal>
                <TabGroup selectedIndex={selectedIndex}>
                    {/* BEGIN: Profile Info */}
                    <div className="box px-5 pt-5 mt-5">
                        <div
                            className="flex w-full ml-auto mr-auto border-b border-slate-200/60 dark:border-darkmode-400 pb-5 -mx-5">

                            <div className="font-medium text-center lg:text-left lg:mt-3">
                                <h2 className={'text-2xl'}>{project.name}</h2>
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
                                        <DropdownItem onClick={() => onCreate()}>
                                            <Lucide icon="Plus" className="w-4 h-4 mr-2"/> Create Task
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
                            }} className='cursor-pointer'>
                                <Tab
                                    fullWidth={false}
                                    className="py-4 flex items-center "
                                >
                                    <Lucide icon="LayoutDashboard" className="cursor-pointer w-4 h-4 mr-2"/>
                                    <div>Dashboard</div>
                                </Tab>
                            </div>
                            <div onClick={() => {
                                setActiveTab('tasks')
                                navigate(location.pathname.split('/').slice(0, -1).join('/') + '/tasks')
                            }} className='cursor-pointer'>
                                <Tab
                                    fullWidth={false}
                                    className="py-4 flex items-center "
                                >
                                    <Lucide icon="ClipboardList" className=" cursor-pointer w-4 h-4 mr-2"/>
                                    <div>Tasks</div>
                                </Tab>
                            </div>
                            <div onClick={() => {
                                setActiveTab('timesheet')
                                navigate(location.pathname.split('/').slice(0, -1).join('/') + '/timesheet')
                            }} className='cursor-pointer'>
                                <Tab
                                    fullWidth={false}
                                    className="py-4 flex items-center "
                                >
                                    <Lucide icon="Sheet" className="cursor-pointer w-4 h-4 mr-2"/>
                                    <div>Worklog</div>
                                </Tab>
                            </div>
                            <div onClick={() => {
                                setActiveTab('files')
                                navigate(location.pathname.split('/').slice(0, -1).join('/') + '/files')
                            }} className='cursor-pointer'>
                                <Tab
                                    fullWidth={false}
                                    className="py-4 flex items-center "
                                >
                                    <Lucide icon="Files" className="cursor-pointer w-4 h-4 mr-2"/>
                                    <div>Files</div>
                                </Tab>
                            </div>
                            <div onClick={() => {
                                setActiveTab('resources')
                                navigate(location.pathname.split('/').slice(0, -1).join('/') + `/resources`)
                            }} className='cursor-pointer'>
                                <Tab
                                    fullWidth={false}
                                    className="py-4 flex items-center "
                                >
                                    <Lucide icon="Database" className="cursor-pointer w-4 h-4 mr-2"/>
                                    <div>Resources</div>
                                </Tab>
                            </div>
                        </TabList>
                    </div>
                    {/* END: Profile Info */}
                    <TabPanels className="mt-5">
                        {activeTab === 'dashboard' && <div className="leading-relaxed">
                            <Dashboard data={project}/>
                        </div>
                        }
                        {activeTab === 'tasks' && <div className="leading-relaxed">
                            <ListTasks createdTask={createdTask}/>
                        </div>}
                        {activeTab === 'timesheet' && <div className="leading-relaxed">
                            <TimeSheet/>
                        </div>}
                        {activeTab === 'files' && <div className="leading-relaxed">
                            <ProjectFiles/>
                        </div>}
                        {activeTab === 'resources' && <div className="leading-relaxed">
                            <Resources/>
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
                            Please check projects list!
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
                            Please check project details!
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
            </div>)
    )
}

export default Project