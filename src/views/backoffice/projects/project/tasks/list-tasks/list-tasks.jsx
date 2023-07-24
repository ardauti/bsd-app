import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {
    checkInToTaskById,
    checkOutToTaskById,
    CreateTaskComment,
    DeleteTask,
    DeleteTaskComment, getEmployeeResources, getSearchTasksOnChange,
    getTaskComments,
    getTasksForProject,
    getTaskWorkLogs,
    getUsersTest, NewestComments, OldestComments,
    prolongToTaskById,
    Task,
    updateCommentOfTask,
    UpdateTask
} from "../../../../../../routes/routes";
import useError from "../../../../../../hooks/useError";
import {useParams} from "react-router-dom";
import {
    LoadingIcon,
    Lucide,
    Modal,
    ModalBody,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Tippy,
    Litepicker,
    AccordionGroup,
    AccordionItem,
    Accordion,
    AccordionPanel,
} from "../../../../../../components";
import CustomButton from "../../../../../../components/customButton/CustomButon";
import Toastify from "toastify-js";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {User} from "../../../../../../services/User";
import moment from "moment";
import image from '../../../../../../assets/images/preview-7.jpg'
import classnames from "classnames";
import Skeleton from 'react-loading-skeleton';
import DataContext from "../../../../../../context/DataContext";

const animatedComponents = makeAnimated();

function Tasks(props) {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const setError = useError()
    const {id} = useParams();
    const [taskCategories, setTaskCategories] = useState([])
    const [modalPreview, setModalPreview] = useState(false);
    const [task, setTask] = useState([]);
    const [taskId, setTaskId] = useState(null);
    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [overlappingModalPreview, setOverlappingModalPreview] = useState(false);
    const [nextOverlappingModalPreview, setNextOverlappingModalPreview] = useState(false);
    const [commentId, setCommentId] = useState(null)
    const [loadingModal, setLoadingModal] = useState(false)
    const [currentTask, setCurrentTask] = useState({})
    const [name, setName] = useState('')
    const [description, setDescription] = useState("")
    const [editState, setEditState] = useState(false)
    const [deadline, setDeadline] = useState('')
    const [employees, setEmployees] = useState([]);
    const [employeesProject, setEmployeesProject] = useState([]);
    const [selectAssignee, setSelectAssignee] = useState([])
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [commentUpdateState, setCommentUpdateState] = useState(false)
    const [commentUpdated, setCommentUpdated] = useState(null)
    const [overlappingModalPreviewForTask, setOverlappingModalPreviewForTask] = useState(false);
    const [overlappingModalPreviewProlong, setOverlappingModalPreviewProlong] = useState(false);
    const [nextOverlappingModalPreviewProlong, setNextOverlappingModalPreviewProlong] = useState(false);
    const [nextOverlappingModalPreviewForTask, setNextOverlappingModalPreviewForTask] = useState(false);
    const [commenterId, setCommenterId] = useState([])
    const [checkInStatus, setCheckInStatus] = useState(false)
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [workLog, setWorkLog] = useState(null)
    const [selectedProlongTime, setSelectedProlongTime] = useState(null);
    const [sort, setSort] = useState(false);
    const [prolonged, setProlonged] = useState(0);
    const [workLogs, setWorkLogs] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [showUpdateButtons, setShowUpdateButtons] = useState(false);
    const [updateTaskDesc, setUpdateTaskDesc] = useState(false);
    const [updateTaskName, setUpdateTaskName] = useState(false);
    const [updateTaskDeadline, setUpdateTaskDeadline] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const divRefs = useRef([]);
    const [showCommentButtons, setShowCommentButtons] = useState(false);
    const [isLoadingButtonComment, setIsLoadingButtonComment] = useState(false);
    const [contentCurrentComment, setContentCurrentComment] = useState("");
    const [open, setOpen] = useState(true)
    const [commentListForLoading, setCommentListForLoading] = useState([{}, {}]);
    const [statusForLoading, setStatusForLoading] = useState([{}, {}, {}, {}]);
    const [statuses, setStatuses] = useState([]);
    const [isLoadingWorkLogs, setIsLoadingWorkLogs] = useState(false);
    let {setTaskUpdated} = useContext(DataContext)
    const [showAssignedTasks, setShowAssignedTasks] = useState(false);
    const [taskCounts, setTaskCounts] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoadingTasks(true);
                const employees = await getUsersTest();
                const employeesProject = await getEmployeeResources(id,1,15);
                const tasks = await getTasksForProject(id);
                setEmployees(employees);
                setEmployeesProject(employeesProject.data);
                setTaskCategories(tasks);
                setStatuses(Object.keys(tasks));
                setIsLoadingTasks(false);
            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, [props.createdTask]);

    useEffect(() => {
        const getWorkLogs = async () => {
            try {
                if (activeTab === 1) {
                    if (workLogs.length === 0) {
                        setIsLoadingWorkLogs(true)
                        const workLogs = await getTaskWorkLogs(taskId)
                        setWorkLogs(workLogs)
                        setIsLoadingWorkLogs(false)
                    }
                }

            } catch (err) {
                setError(err);
            }
        };
        getWorkLogs();
    }, [activeTab, taskId]);

    // useEffect to calculate the task counts
    useEffect(() => {
        const counts = {};
        Object.keys(taskCategories).forEach((status) => {
            const filteredTasks = Object.values(taskCategories[status]).filter(
                (task) => (showAssignedTasks ? task.assignee_profile?.id === User.data.id : true)
            );
            counts[status] = filteredTasks.length;
        });
        setTaskCounts(counts);
    }, [showAssignedTasks, taskCategories, User.data]);

    //options
    const options = [
        {label: '30 Minutes', value: 0.5},
        {label: '1 Hour', value: 1},
        {label: '1 Hour and 30 Minutes', value: 1.50},
        {label: '2 Hours', value: 2},
        {label: '2 Hours and 30 Minutes', value: 2.5},
        {label: '3 Hours', value: 3},
        {label: '3 Hours and 30 Minutes', value: 3.5},
    ];

    const optionStatus = statuses.map(function (status, index) {
        return {
            value: index + 1,
            label: status
        }
    });

    const optionsAssignies = employees.map(function (assignee) {
        return {value: assignee.id, label: assignee.user_profile?.display_name, image: 'true'};
    })

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

    const noOptionsMessage = function (obj) {
        if (obj.inputValue.trim().length === 0) {
            return null;
        }
        return 'No matching';
    };

    const schema = yup
        .object({
            name: yup.string().required(),
            description: yup.string().required(),
            deadline: yup.date().required(),
            selectedStatus: yup.number().required(),
            selectAssignee: yup.number().required(),
            commentUpdated: yup.string().required()

        })
        .required();

    const {
        register,
        setValue,
        formState: {errors},
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });


    //task functionality
    const getTaskById = useCallback(async (taskNumber) => {
        try {
            setLoadingModal(true)
            const res = await Task(taskNumber)
            const allComments = await getTaskComments(taskNumber)
            setCommentList(allComments)
            setProlonged(workLogs[0]?.prolonged)
            setCheckInStatus(res.checked_in)
            setSelectAssignee(res.assignee_profile?.display_name)
            setTask(res)
            setLoadingModal(false)
            setWorkLogs([])
            setActiveTab(0)
        } catch (err) {
            throw setError(err)
        }
    }, [checkInStatus, selectAssignee, task, taskId, prolonged, activeTab, workLogs])

    //update task: name, deadline, description
    const updateTask = useCallback(async (event) => {
        if (!editState) {
            try {
                setShowUpdateButtons(false)
                if (updateTaskDesc) {
                    const params = {
                        project_id: Number(currentTask.project_id),
                        name: name,
                        deadline: deadline,
                        description: event.target.innerText,
                    }
                    setDescription(event.target.innerText)
                    const updatedTask = await UpdateTask(params, Number(currentTask.id))
                    const updatedTaskCategories = { ...taskCategories };
                    const category = Object.keys(updatedTaskCategories).find(
                        (key) => updatedTaskCategories[key].find((task) => task.id === currentTask.id)
                    );
                    if (category) {
                        updatedTaskCategories[category] = updatedTaskCategories[category].map((task) => {
                            if (task.id === currentTask.id) {
                                return { ...task, assignee_id: event.target.innerText, description: updatedTask.description };
                            }
                            return task;
                        });
                    }
                    setTaskCategories(updatedTaskCategories);;
                } else if (updateTaskName) {
                    const params = {
                        project_id: Number(currentTask.project_id),
                        name: event.target.innerText,
                        deadline: deadline,
                        description: description,
                    }
                    setName(event.target.innerText)
                    const updatedTask = await UpdateTask(params, Number(currentTask.id))
                    const updatedTaskCategories = { ...taskCategories };
                    const category = Object.keys(updatedTaskCategories).find(
                        (key) => updatedTaskCategories[key].find((task) => task.id === currentTask.id)
                    );
                    if (category) {
                        updatedTaskCategories[category] = updatedTaskCategories[category].map((task) => {
                            if (task.id === currentTask.id) {
                                return { ...task, assignee_id: event.target.innerText, name: updatedTask.name };
                            }
                            return task;
                        });
                    }
                    setTaskCategories(updatedTaskCategories);

                } else if (updateTaskDeadline) {
                    const params = {
                        project_id: Number(currentTask.project_id),
                        name: name,
                        deadline: moment(deadline).format("YYYY-MM-DD"),
                        description: description,
                    }
                    const updatedTask = await UpdateTask(params, Number(currentTask.id))

                    const updatedTaskCategories = { ...taskCategories };
                    const category = Object.keys(updatedTaskCategories).find(
                        (key) => updatedTaskCategories[key].find((task) => task.id === currentTask.id)
                    );
                    if (category) {
                        updatedTaskCategories[category] = updatedTaskCategories[category].map((task) => {
                            if (task.id === currentTask.id) {
                                return { ...task, deadline: updatedTask.deadline };
                            }
                            return task;
                        });
                    }
                    setTaskCategories(updatedTaskCategories);
                }

                if (updateTaskDesc || updateTaskDeadline || updateTaskName) {

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
                }
                setEditState(false)
                setLoadingModal(false)
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
        } else {
            if (updateTaskDesc) {
                event.target.innerText = currentTask.description
            } else if (updateTaskName) {
                event.target.innerText = currentTask.name
            }
        }

        setUpdateTaskDeadline(false)
        setUpdateTaskName(false)
        setUpdateTaskDesc(false)
    }, [showUpdateButtons, updateTaskName, deadline, editState, updateTaskDeadline, updateTaskDesc])

    //delete task func...
    const deleteTask = async (taskId) => {
        try {
            await DeleteTask(taskId);
            Toastify({
                node: dom("#success-notification-content-delete")
                    .clone()
                    .removeClass("hidden")[0],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();

            const updatedTasks = {...taskCategories};
            Object.keys(updatedTasks).forEach(status => {
                updatedTasks[status] = updatedTasks[status].filter(task => task.id !== taskId);
            });
            setTaskCategories(updatedTasks);

        } catch (err) {
            setError(err)
        }
        setNextOverlappingModalPreviewForTask(false)
        setModalPreview(false)
    }


    const onDeleteTask = (id) => {
        setNextOverlappingModalPreviewForTask(true)
        setTaskId(id)
    }

    //task comment functionality
    const createComment = useCallback(async (e) => {
        e.preventDefault();
        if (comment) {
            try {
                setIsLoadingButtonComment(true);
                const params = {
                    task_id: task.id,
                    comment: comment,
                };
                const response = await CreateTaskComment(params);
                if (sort) {
                    setCommentList([response, ...commentList]);
                } else {
                    setCommentList([...commentList, response]);
                }
            } catch (err) {
                setError(err);
            }
            setIsLoadingButtonComment(false);
        }
        setShowCommentButtons(false);
        setComment('');
    }, [commentList, comment, task, taskId, showCommentButtons, sort]);

    //update comment func...
    const updateComment = useCallback(async (event) => {
        try {
            if (User.data.id === commenterId) {
                const params = {
                    comment: commentUpdated,
                    commenter_id: commenterId
                }
                const updatedComment = await updateCommentOfTask(commentId, params);
                const updatedCommentList = [...commentList];
                const index = updatedCommentList.findIndex(comment => comment.id === updatedComment.id);
                updatedCommentList[index] = updatedComment;
                setCommentList(updatedCommentList);
                setCommentId(null)
            } else {
                Toastify({
                    node: dom("#failied")
                        .clone()
                        .removeClass("hidden")[0],
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                }).showToast();
                setLoadingModal(false)
            }
        } catch (err) {
            setError(err)
        }
        setCommentUpdateState(false)
    }, [commentList, commentUpdated, commenterId, commentId])

    //delete task comment func...
    const deleteTaskComment = async () => {
        try {
            await DeleteTaskComment(commentId)
            setCommentId(commentId)
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

            const newList = commentList.filter((item) => item.id !== commentId);
            setCommentList(newList)
        } catch (err) {
            setError(err)
        }
        setNextOverlappingModalPreview(false)
    }

    const onDeleteComment = (commentId) => {
        setNextOverlappingModalPreview(true)
        setCommentId(commentId)
    }

    function handleInputChangeComment(e, i) {
        if (focusedIndex === i.tabIndex) {
            setCommentUpdated(i.innerText)
        }
    }

    const handleCancelComment = useCallback((i) => {
        i.innerText = contentCurrentComment
        setCommentUpdateState(false)
    }, [commentUpdateState])

    const handleCommentUpdate = useCallback((index, commenter_id, commentId) => {
        setFocusedIndex(index);
        divRefs.current[index].focus();
        setCommentUpdateState(true)
        setCommentId(commentId)
        setCommenterId(commenter_id)
    }, [commentUpdateState, commentId, commenterId])

    const handleInputComment = useCallback(() => {
        setShowCommentButtons(true);
    }, [showCommentButtons]);

    const cancelCommentButton = useCallback(() => {
        setShowCommentButtons(false)
        setComment('')
    }, [showCommentButtons, comment]);

    //sort comments based on date
    const handleSort = useCallback(async (taskNumber) => {
        setIsLoadingButton(true)
        try {
            if (sort) {
                const response = await OldestComments(taskNumber);
                setCommentList([...response]);
            } else {
                const response = await NewestComments(taskNumber);
                setCommentList([...response]);
            }
            setSort(!sort);
            setIsLoadingButton(false)
        } catch (err) {
            setError(err);
        }
    }, [sort]);


    //task update statuses
    const updateStatus =  async (event) => {
        try {
            const params = {
                task_statuses_id: event.value,
            };
            await UpdateTask(params, Number(currentTask.id));
            // Create a copy of taskCategories object
            const updatedTasks = { ...taskCategories };

            // Filter out the updated task from the old task list
            Object.keys(updatedTasks).forEach((status) => {
                updatedTasks[status] = updatedTasks[status].filter(
                    (task) => task.id !== taskId
                );
            });

            // Add the updated task to the new task list
            updatedTasks[event.label] = [      ...updatedTasks[event.label],
                { ...currentTask, task_statuses_id: event.value },
            ];

            // Set the updated taskCategories object to state
            setTaskCategories(updatedTasks);
            setTaskUpdated(true)
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

            setLoadingModal(false);
        } catch (err) {
            setError(err);
            setIsLoading(false);
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

    //task update assignee
    const updateAssignee = async (event) => {
        try {
            const params = {
                assignee_id: event.value,
            };
            const updatedTask = await UpdateTask(params, Number(currentTask.id));
            const updatedTaskCategories = { ...taskCategories };
            const category = Object.keys(updatedTaskCategories).find(
                (key) => updatedTaskCategories[key].find((task) => task.id === currentTask.id)
            );
            if (category) {
                updatedTaskCategories[category] = updatedTaskCategories[category].map((task) => {
                    if (task.id === currentTask.id) {
                        return { ...task, assignee_id: event.value, assignee_profile: updatedTask.assignee_profile };
                    }
                    return task;
                });
            }
            setTaskCategories(updatedTaskCategories);
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
            setEditState(false);
            setLoadingModal(false);
        } catch (err) {
            setError(err);
            setIsLoading(false);
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

    //task workLogs
    const checkIn = useCallback(async () => {
        try {
            setIsLoadingButton(true)
            const response = await checkInToTaskById(taskId)
            setWorkLog(response)
            const workLogs = await getTaskWorkLogs(taskId)
            setWorkLogs(workLogs)
            const res = await Task(taskId)
            setCheckInStatus(res.checked_in)
            setIsLoadingButton(false)
            setProlonged(0)
        } catch (err) {
            setError(err)
            setIsLoadingButton(false)
        }
    }, [checkInStatus, workLog, prolonged, taskId])

    const checkOut = useCallback(async () => {
        try {
            setIsLoadingButton(true)
            const workLogs = await getTaskWorkLogs(taskId)
            setWorkLog(workLogs[0])
            const updateUI = await getTaskWorkLogs(taskId)
            setWorkLogs(updateUI)
            if (workLogs[0].length === 0) {
                if (!workLog.check_out) {
                    await checkOutToTaskById(workLog.id)
                }
            } else {
                if (!workLogs[0].check_out) {
                    await checkOutToTaskById(workLogs[0].id)
                }
            }
            const res = await Task(taskId)
            setCheckInStatus(res.checked_in)
            setIsLoadingButton(false)
        } catch (err) {
            setError(err)
            setIsLoadingButton(false)
        }
        setProlonged(0)
        setSelectedProlongTime(null)
    }, [checkInStatus, workLog, taskId])

    const prolong = useCallback(async () => {
        try {
            setIsLoadingButton(true)
            const workLogs = await getTaskWorkLogs(taskId)
            setWorkLog(workLogs[0])
            const updateUI = await getTaskWorkLogs(taskId)
            setWorkLogs(updateUI)
            const params = {
                prolonged_time: selectedProlongTime?.value
            }
            if (workLogs[0].length === 0) {
                if (!workLog.check_out) {
                    const res = await prolongToTaskById(workLog.id, params)
                    setProlonged(res)
                }
            } else {
                if (!workLogs[0].check_out) {
                    const res = await prolongToTaskById(workLogs[0].id, params)
                    setProlonged(res)
                }
            }
            const res = await Task(taskId)
            setCheckInStatus(res.checked_in)
            setIsLoadingButton(false)
        } catch (err) {
            setError(err)
            setIsLoadingButton(false)
        }
        setNextOverlappingModalPreviewProlong(false)
        setSelectedProlongTime(null)
    }, [checkInStatus, workLog, selectedProlongTime, prolonged, taskId])

    //other functionalities
    const cancelUpdate = useCallback(async () => {
        setEditState(true)
        setUpdateTaskDeadline(false)
        setDeadline(moment(deadline).format("D MMM, YYYY"))
        setCommentId(null)
        setCommentUpdateState(false)
        setCommentUpdated(null)
    }, [editState, updateTaskDeadline, commentId, commentUpdateState, commentUpdated])

    const handleSearch = async (e) => {
        let searchQuery = e.target.value
        if (searchQuery === '') {
            const tasks = await getTasksForProject(id);
            setTaskCategories(tasks)
            return
        }
        let searchTasks = []
        try {
            searchTasks = await getSearchTasksOnChange(id,searchQuery)
        } catch (err) {
            setError(err)
        } finally {
            setTaskCategories(searchTasks)
        }
    }

    return (
        isLoading ? (
            <div
                className="col-span-6 sm:col-span-3 xl:col-span-2 grid h-screen place-items-center">
                <LoadingIcon icon="puff" className="w-14 h-14"/>
            </div>
        ) : (
            <>
                <div>
                    <Modal
                        show={modalPreview}
                        onHidden={() => {
                            setModalPreview(false)
                            setEditState(false)
                            setModalPreview(false);

                        }}
                        size={'modal-xxl'}
                    >
                        <ModalBody>
                            {loadingModal ? (
                                <div>
                                    <div className='flex accent-gray-500 items-center mb-7 '>
                                        <>
                                            <div>
                                                {<Skeleton width={70}/>}
                                            </div>
                                        </>
                                    </div>
                                    <div className="flex flex-col md:flex-row">
                                        <div className="overflow-y-auto h-60-vh basis-full md:basis-3/4">
                                            <div>
                                                <div className='pt-1'>
                                                    <>
                                                        <Skeleton width={50}/>
                                                        <div
                                                            className={'focus:border-2 focus:border-blue-500 text-sm rounded-md p-2 focus:outline-none'}
                                                        >
                                                            <Skeleton count={8}/>
                                                        </div>
                                                    </>
                                                </div>
                                                <div
                                                    className="nav-link-tabs grid grid-cols-2 gap-4 flex capitalize justify-around text-center">
                                                    <div
                                                        className="flex items-center cursor-pointer ml-auto mr-auto "
                                                    >
                                                        <div
                                                            className={' flex ml-auto mr-auto'}>
                                                            <div><Skeleton width={50}/></div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex items-center cursor-pointer ml-auto mr-auto "
                                                    >
                                                        <div
                                                            className={' flex ml-auto mr-auto'}>
                                                            <Skeleton width={50}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-5">
                                                    <div className="leading-relaxed">
                                                        <div>
                                                            <div className="flex items-center justify-between ">
                                                                <div
                                                                    className="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit">
                                                                    <Skeleton circle width={50} height={50}/>
                                                                </div>
                                                                <div className={'mx-5 flex-1 form-control'}>
                                                                    <Skeleton count={1}/>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div
                                                                    className='pt-4 pr-4 flex justify-between'>
                                                                    <div className='pr-4 font-medium'>
                                                                        <Skeleton width={50}/>
                                                                    </div>
                                                                    <div>
                                                                        <Skeleton width={50}/>
                                                                    </div>
                                                                </div>
                                                                <div className=" mt-5 pr-4 ">
                                                                    {commentListForLoading.map((comment, i) => (
                                                                        <div
                                                                            key={i}
                                                                        >
                                                                            <div>
                                                                                <div
                                                                                    className="intro-y">

                                                                                    <div
                                                                                        className="pt-5">
                                                                                        <div
                                                                                            className="flex">
                                                                                            <div
                                                                                                className="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit">
                                                                                                <Skeleton circle
                                                                                                          width={50}
                                                                                                          height={50}/>
                                                                                            </div>
                                                                                            <div
                                                                                                className="ml-3 flex-1">
                                                                                                <div
                                                                                                    className="flex items-center">
                                                                                                    <Skeleton
                                                                                                        width={50}/>
                                                                                                </div>
                                                                                                <div
                                                                                                    className={'focus:border-2 focus:border-blue-500 rounded-md p-2 focus:outline-none'}
                                                                                                >
                                                                                                    <Skeleton
                                                                                                        count={3}/>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="basis-full md:basis-1/4">
                                            <div className={'ml-3'}>
                                                <AccordionGroup selectedIndex={0} className="accordion-boxed">
                                                    <AccordionItem className={'rounded'}>
                                                        <div
                                                            className={`${open ? 'border-b-2  duration-300 ' : ''}`}>
                                                            <Accordion>
                                                                <div className={'py-3 flex'}>
                                                                    <Skeleton width={70}/>
                                                                </div>
                                                            </Accordion>

                                                        </div>
                                                        <AccordionPanel
                                                            className="text-slate-600 dark:text-slate-500 leading-relaxed">
                                                            <div><Skeleton count={8}/></div>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                </AccordionGroup>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className='flex accent-gray-500 items-center mb-7 '>
                                        <>
                                            <div
                                                className={'focus:border-2 focus:border-blue-500 rounded-md p-2 focus:outline-none text-xl font-medium'}
                                                onFocus={(e) => {
                                                    setShowUpdateButtons(true)
                                                    setEditState(false)
                                                    setUpdateTaskDesc(false)
                                                    setUpdateTaskName(true)
                                                }}
                                                onBlur={updateTask}
                                                contentEditable
                                                suppressContentEditableWarning={true}
                                            >
                                                {name}
                                            </div>
                                        </>
                                        {showUpdateButtons && updateTaskName ? (
                                            <div className="flex">
                                                <div onClick={updateTask}
                                                     className={'rounded place-items-center p-1 bg-slate-100 ml-2 mr-3 transition duration-500 hover:scale-125 cursor-pointer'}>
                                                    <Lucide className=' p-1' icon='Check'/></div>
                                                <div onMouseDown={cancelUpdate}
                                                     className={'rounded place-items-center p-1 bg-slate-100 transition duration-500 hover:scale-125 cursor-pointer'}>
                                                    <Lucide className=' p-1' icon='X'/></div>
                                            </div>
                                        ) : ('')}
                                        <div className='flex items-center ml-auto'>
                                            {
                                                User.data.id === task.assignee_id ? (
                                                    checkInStatus ? (
                                                        <div className={'flex'}>
                                                            <CustomButton onClick={checkOut}
                                                                          disabled={isLoadingButton}
                                                                          className={'btn btn-danger w-32 mr-2'}
                                                                          icon={'XSquare'} children={'Check-out'}
                                                                          widthIconSize={'w-4'}
                                                                          heightIconSize={'h-4'}
                                                                          isLoading={isLoadingButton}/>
                                                            {
                                                                prolonged === 1 ? (
                                                                    <div className={'flex items-center'}>
                                                                        <div>
                                                                            <Lucide
                                                                                style={{color: '#289589'}}
                                                                                icon="Clock"
                                                                                className="w-6 h-6"
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className={'text-success font-medium mr-2 ml-1'}>
                                                                            Prolonged
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className={'flex'}>
                                                                        <Select
                                                                            options={options}
                                                                            components={animatedComponents}
                                                                            value={selectedProlongTime}
                                                                            onChange={setSelectedProlongTime}
                                                                            className={'w-48 mr-2'}
                                                                            styles={style}
                                                                            isSearchable={false}
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
                                                                        <CustomButton
                                                                            onClick={() => setNextOverlappingModalPreviewProlong(true)}
                                                                            disabled={isLoadingButton}
                                                                            className={'btn btn-warning w-32 mr-2'}
                                                                            icon={'Clock'} children={'Prolong'}
                                                                            widthIconSize={'w-4'}
                                                                            heightIconSize={'h-4'}
                                                                            isLoading={isLoadingButton}/>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    ) : (
                                                        <CustomButton onClick={checkIn} disabled={isLoadingButton}
                                                                      className={'btn btn-success w-32 mr-2'}
                                                                      icon={'CheckSquare'} children={'Check-in'}
                                                                      widthIconSize={'w-4'} heightIconSize={'h-4'}
                                                                      isLoading={isLoadingButton}/>
                                                    )
                                                ) : ('')
                                            }
                                            <div className='flex items-center'>
                                                        <Lucide
                                                            style={{color: 'black'}}
                                                            icon="Trash"
                                                            className="w-4 h-4 text-slate-500 cursor-pointer"
                                                            onClick={() => {
                                                                onDeleteTask(task.id)
                                                            }}
                                                        />
                                                <button
                                                    onClick={() => {
                                                        setModalPreview(false)
                                                    }}
                                                    className="">
                                                    <Lucide onClick={() => {
                                                        setModalPreview(false)
                                                        setEditState(false)
                                                    }}
                                                            icon="X"></Lucide>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row">
                                        <div className="overflow-y-auto h-60-vh basis-3/4" >
                                            {/* END: Modal Toggle */}
                                            {/* BEGIN: Modal Content */}
                                            <Modal
                                                show={overlappingModalPreview}
                                                onHidden={() => {
                                                    setOverlappingModalPreview(false);
                                                }}
                                            >
                                                <ModalBody className="px-5 py-10">
                                                    <Modal
                                                        show={nextOverlappingModalPreview}
                                                        onHidden={() => {
                                                            setNextOverlappingModalPreview(false);
                                                        }}
                                                    >
                                                        <ModalBody className="text-center">
                                                            <div className="p-5 text-center">
                                                                <Lucide
                                                                    icon="MessageSquare"
                                                                    className="w-16 h-16 text-danger mx-auto mt-3"
                                                                />
                                                                <div className="text-3xl mt-5">Are you sure?</div>
                                                                <div className="text-slate-500 mt-2">
                                                                    Do you really want to delete these
                                                                    comment? <br/>
                                                                    This process cannot be undone.
                                                                </div>
                                                            </div>
                                                            <div className="px-5 pb-8 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setNextOverlappingModalPreview(false);
                                                                    }}
                                                                    className="btn btn-outline-secondary w-24 mr-1"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteTaskComment(comment.id)}
                                                                    type="button" className="btn btn-danger w-24">
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                    {/* END: Overlapping Modal Content */}
                                                </ModalBody>
                                            </Modal>

                                            {/*This is the overlapping modal for delete task */}
                                            <Modal
                                                show={overlappingModalPreviewForTask}
                                                onHidden={() => {
                                                    setOverlappingModalPreviewForTask(false);
                                                }}
                                            >
                                                <ModalBody className="px-5 py-10">

                                                    <Modal
                                                        show={nextOverlappingModalPreviewForTask}
                                                        onHidden={() => {
                                                            setNextOverlappingModalPreviewForTask(false);
                                                        }}
                                                    >
                                                        <ModalBody className="text-center">
                                                            <div className="p-5 text-center">
                                                                <Lucide
                                                                    icon="ClipboardList"
                                                                    className="w-16 h-16 text-danger mx-auto mt-3"
                                                                />
                                                                <div className="text-3xl mt-5">Are you sure?</div>
                                                                <div className="text-slate-500 mt-2">
                                                                    Do you really want to delete these
                                                                    task? <br/>
                                                                    This process cannot be undone.
                                                                </div>
                                                            </div>
                                                            <div className="px-5 pb-8 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setNextOverlappingModalPreviewForTask(false);
                                                                    }}
                                                                    className="btn btn-outline-secondary w-24 mr-1"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteTask(taskId)}
                                                                    type="button" className="btn btn-danger w-24">
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                    {/* END: Overlapping Modal Content */}
                                                </ModalBody>
                                            </Modal>
                                            {/*end*/}

                                            <Modal
                                                show={overlappingModalPreviewProlong}
                                                onHidden={() => {
                                                    setOverlappingModalPreviewProlong(false);
                                                }}
                                            >
                                                <ModalBody className="px-5 py-10">

                                                    <Modal
                                                        show={nextOverlappingModalPreviewProlong}
                                                        onHidden={() => {
                                                            setNextOverlappingModalPreviewProlong(false);
                                                        }}
                                                    >
                                                        <ModalBody className="text-center">
                                                            <div className="p-5 text-center">
                                                                <Lucide
                                                                    icon="Clock"
                                                                    className="w-16 h-16 text-warning mx-auto mt-3"
                                                                />
                                                                {
                                                                    selectedProlongTime === null ? (
                                                                        <div className="text-3xl mt-5">Please select
                                                                            a time that you want to prolong!!!</div>
                                                                    ) : (
                                                                        <>
                                                                            <div className="text-3xl mt-5">Are you
                                                                                sure you want to prolong?
                                                                            </div>
                                                                            <div className="text-slate-500 mt-2">
                                                                                Do you really want to prolong these
                                                                                task
                                                                                for {selectedProlongTime?.label}? <br/>
                                                                                This process cannot be undone.
                                                                            </div>
                                                                        </>
                                                                    )
                                                                }

                                                            </div>
                                                            <div className="px-5 pb-8 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setNextOverlappingModalPreviewProlong(false);
                                                                    }}
                                                                    className="btn btn-outline-secondary w-24 mr-1"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <CustomButton
                                                                    disabled={selectedProlongTime === null}
                                                                    onClick={prolong}
                                                                    isLoading={isLoadingButton}
                                                                    type="button"
                                                                    className="btn btn-warning w-24">
                                                                    Prolong
                                                                </CustomButton>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                    {/* END: Overlapping Modal Content */}
                                                </ModalBody>
                                            </Modal>
                                            <div>
                                                <div className='pt-1'>
                                                    <>
                                                        <span
                                                            className={'ml-2 font-medium text-base'}>Description</span>

                                                        <div
                                                            className={'focus:border-2 focus:border-blue-500 text-sm rounded-md p-2 focus:outline-none'}
                                                            onFocus={e => {
                                                                setShowUpdateButtons(true)
                                                                setEditState(false)
                                                                setUpdateTaskDesc(true)
                                                                setUpdateTaskName(false)
                                                                setUpdateTaskDeadline(false)
                                                            }}
                                                            onBlur={updateTask}
                                                            contentEditable
                                                            suppressContentEditableWarning={true}
                                                        >
                                                            {description}
                                                        </div>
                                                        {showUpdateButtons && updateTaskDesc ? (
                                                            <div className="flex mt-2">
                                                                <div onClick={updateTask}
                                                                     className={'rounded place-items-center p-1 bg-slate-100 ml-auto mr-3 transition duration-500 hover:scale-125 cursor-pointer'}>
                                                                    <Lucide className=' p-1' icon='Check'/></div>
                                                                <div onMouseDown={cancelUpdate}
                                                                     className={'rounded place-items-center p-1 bg-slate-100 mr-4 transition duration-500 hover:scale-125 cursor-pointer'}>
                                                                    <Lucide className=' p-1' icon='X'/></div>
                                                            </div>
                                                        ) : ('')}
                                                    </>
                                                </div>
                                                <TabGroup selectedIndex={Number(activeTab)}
                                                          onChange={(e) => setActiveTab(e)}>
                                                    <TabList
                                                        className="nav-link-tabs grid grid-cols-2 gap-4 flex capitalize justify-around text-center">
                                                        <Tab
                                                            fullWidth={false}
                                                            className="flex items-center cursor-pointer ml-auto mr-auto "
                                                        >
                                                            <div
                                                                className={' flex ml-auto mr-auto'}>
                                                                <Lucide
                                                                    icon="MessageSquare"
                                                                    className="cursor-pointer  w-4 h-4 mr-2"/>
                                                                <div>Comments</div>
                                                            </div>
                                                        </Tab>
                                                        <Tab
                                                            fullWidth={false}
                                                            className="flex items-center cursor-pointer ml-auto mr-auto "
                                                        >
                                                            <div
                                                                className={' flex ml-auto mr-auto'}>
                                                                <Lucide
                                                                    icon="Clock"
                                                                    className="cursor-pointer  w-4 h-4 mr-2"/>
                                                                <div>WorkLogs</div>
                                                            </div>
                                                        </Tab>
                                                    </TabList>
                                                    <TabPanels className="mt-5">
                                                        <TabPanel className="leading-relaxed">
                                                            <form
                                                                onSubmit={createComment}>
                                                                <div className="flex items-center justify-between ">
                                                                    <div
                                                                        className="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit">
                                                                        <img
                                                                            alt="Midone Tailwind HTML Admin Template"
                                                                            className="rounded-full"
                                                                            src={image}
                                                                        />
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        name="comment"
                                                                        value={comment}
                                                                        onChange={(e) => {
                                                                            setComment(e.target.value)
                                                                        }}
                                                                        className={classnames({
                                                                            "mx-5": true,
                                                                            "flex-1": true,
                                                                            "form-control": true,
                                                                        })}
                                                                        onClick={handleInputComment}
                                                                        placeholder="Add a comment..."
                                                                    />
                                                                    {showCommentButtons && <CustomButton
                                                                        isLoading={isLoadingButtonComment}
                                                                        className={'btn btn-primary px-4 mr-2 py-2 '}
                                                                        type={'submit'}
                                                                        children={'Comment'}/>}
                                                                    {showCommentButtons &&
                                                                        <CustomButton
                                                                            isLoading={isLoadingButtonComment}
                                                                            className={'btn btn-outline-primary px-4 mr-2 py-2 '}
                                                                            type={'button'}
                                                                            onClick={cancelCommentButton}
                                                                            children={'Cancel'}/>}
                                                                </div>
                                                            </form>
                                                            <div>
                                                                <div>
                                                                    <div
                                                                        className='pt-4 pr-4 flex justify-between'>
                                                                        <div className='pt-4 pr-4 font-medium'>
                                                                            Comments:
                                                                        </div>
                                                                        <div>
                                                                            <CustomButton
                                                                                isLoading={isLoadingButton}
                                                                                className={'btn '}
                                                                                children={sort ? 'Oldest first' : 'Newest First '}
                                                                                onClick={() => handleSort(task.id)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className=" mt-5 pr-4 ">
                                                                        {commentList.map((comment, i) => (
                                                                            <div
                                                                                key={i}
                                                                            >
                                                                                <div>
                                                                                    <div
                                                                                        className="intro-y">

                                                                                        <div
                                                                                            className="pt-5">
                                                                                            <div
                                                                                                className="flex">
                                                                                                <div
                                                                                                    className="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit">
                                                                                                    <img
                                                                                                        alt="Midone Tailwind HTML Admin Template"
                                                                                                        className="rounded-full"
                                                                                                        src={image}
                                                                                                    />
                                                                                                </div>
                                                                                                <div
                                                                                                    className="ml-3 flex-1">
                                                                                                    <div
                                                                                                        className="flex items-center">
                                                                                                        <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                                                           className="font-medium">
                                                                                                            {comment.commenter_profile?.display_name}
                                                                                                        </a>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="text-slate-500 text-xs sm:text-sm">
                                                                                                        {comment.created_at === null ? '' :
                                                                                                            <Tippy
                                                                                                                tag="div"
                                                                                                                className=" w-32 text-gray-400 cursor-pointer"
                                                                                                                content={`${moment(comment.created_at).format("MMMM D, YYYY")} at ${moment(comment.created_at).format("HH:mm")}`}
                                                                                                                options={{
                                                                                                                    theme: "light",
                                                                                                                }}
                                                                                                            >
                                                                                                                {moment(comment.created_at).fromNow()}
                                                                                                            </Tippy>
                                                                                                        }
                                                                                                    </div>
                                                                                                    <div
                                                                                                        contentEditable={i === focusedIndex}
                                                                                                        key={i}
                                                                                                        tabIndex={i}
                                                                                                        ref={(el) => (divRefs.current[i] = el)}
                                                                                                        onFocus={(e) => setContentCurrentComment(e.target.innerText)}
                                                                                                        onInput={(e) => handleInputChangeComment(e, divRefs.current[i])}
                                                                                                        suppressContentEditableWarning={true}
                                                                                                        className={'focus:border-2 focus:border-blue-500 rounded-md p-2 focus:outline-none'}
                                                                                                    > {comment.comment}</div>
                                                                                                    {commentUpdateState && i === focusedIndex && (
                                                                                                        <div
                                                                                                            className="flex">
                                                                                                            <div
                                                                                                                onClick={updateComment}
                                                                                                                className={'rounded place-items-center p-1 bg-slate-100 ml-2 mr-3 transition duration-500 hover:scale-125 cursor-pointer'}>
                                                                                                                <Lucide
                                                                                                                    className=' p-1'
                                                                                                                    icon='Check'/>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                onMouseDown={() => handleCancelComment(divRefs.current[i])}
                                                                                                                className={'rounded place-items-center p-1 bg-slate-100 transition duration-500 hover:scale-125 cursor-pointer'}>
                                                                                                                <Lucide
                                                                                                                    className=' p-1'
                                                                                                                    icon='X'/>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                    {User.data.id === comment.commenter_id &&
                                                                                                        <div
                                                                                                            className="ml-auto flex text-sm mt-2 font-medium text-gray-500">
                                                                                                            <div
                                                                                                                className={'cursor-pointer hover:text-gray-400 hover:underline'}
                                                                                                                onClick={() => handleCommentUpdate(i, comment.commenter_id, comment.id)}>
                                                                                                                Edit
                                                                                                            </div>
                                                                                                            <div
                                                                                                                className={'ml-5 cursor-pointer hover:text-gray-400 hover:underline'}
                                                                                                                onClick={() => {
                                                                                                                    onDeleteComment(comment.id)
                                                                                                                }}
                                                                                                            >
                                                                                                                Delete
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabPanel>
                                                        <TabPanel className="leading-relaxed">
                                                            {
                                                                isLoadingWorkLogs ? (
                                                                    <>
                                                                        <div className="grid grid-cols-12 gap-6 ">
                                                                            {/* BEGIN: Data List -*/}
                                                                            <div
                                                                                className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                                                                                <table className="table table-report -mt-2">
                                                                                    <thead>
                                                                                    <tr>
                                                                                        <th className="whitespace-nowrap">
                                                                                            <Skeleton width={80} />
                                                                                        </th>
                                                                                        <th className="whitespace-nowrap">
                                                                                            <Skeleton width={80} />
                                                                                        </th>
                                                                                        <th className="whitespace-nowrap">
                                                                                            <Skeleton width={80} />
                                                                                        </th>
                                                                                        <th className="text-center whitespace-nowrap">
                                                                                            <Skeleton width={80} /> </th>
                                                                                    </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        <tr  className="intro-x">
                                                                                            <td>
                                                                                                <Skeleton width={60} />
                                                                                            </td>
                                                                                            <td>
                                                                                                <Skeleton width={60} />
                                                                                            </td>
                                                                                            <td>
                                                                                                <Skeleton width={60} />
                                                                                            </td>
                                                                                            <td className="text-center"><Skeleton width={60} /></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                            {/* END: Data List -*/}
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="grid grid-cols-12 gap-6 ">
                                                                            {/* BEGIN: Data List -*/}
                                                                            <div
                                                                                className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                                                                                <table className="table table-report -mt-2">
                                                                                    <thead>
                                                                                    <tr>
                                                                                        <th className="whitespace-nowrap">FULL
                                                                                            NAME
                                                                                        </th>
                                                                                        <th className="whitespace-nowrap">CHECK
                                                                                            IN
                                                                                        </th>
                                                                                        <th className="whitespace-nowrap">CHECK
                                                                                            OUT
                                                                                        </th>
                                                                                        <th className="text-center whitespace-nowrap">TOTAL
                                                                                            (hr)
                                                                                        </th>
                                                                                    </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                    {workLogs.map((workLog, index) => (
                                                                                        <tr key={index}>
                                                                                            <td>
                                                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                                                   className="font-medium whitespace-nowrap">
                                                                                                    {workLog.assignee_profile.display_name}
                                                                                                </a>
                                                                                            </td>
                                                                                            <td>
                                                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                                                   className="font-medium whitespace-nowrap">
                                                                                                    {moment(workLog.check_in).format("D MMM, YYYY")}
                                                                                                </a>
                                                                                                <div
                                                                                                    className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                                                    {moment(workLog.check_in).format("HH:mm")}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                                                   className="font-medium whitespace-nowrap">
                                                                                                    {moment(workLog.check_out).format("D MMM, YYYY")}
                                                                                                </a>
                                                                                                <div
                                                                                                    className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                                                    {moment(workLog.check_out).format("HH:mm")}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="text-center">{workLog.total}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                            {/* END: Data List -*/}
                                                                        </div>
                                                                    </>
                                                                )
                                                            }

                                                        </TabPanel>
                                                    </TabPanels>
                                                </TabGroup>
                                            </div>
                                        </div>
                                        <div className="basis-4/12">
                                            <div className={'ml-3'}>
                                                <AccordionGroup selectedIndex={0} className="accordion-boxed">
                                                    <AccordionItem className={'rounded'}>
                                                        <div
                                                            className={`${open ? 'border-b-2  duration-300 ' : ''}`}
                                                            onClick={() => {
                                                                setOpen(!open)
                                                            }}>
                                                            <Accordion>
                                                                <div className={'py-3 flex'}>
                                                                    Details {open ? '' : <span
                                                                    className={'ml-2 mt-0.5 font-normal text-xs text-gray-400'}>Status, Assignee, Reporter, Deadline</span>}
                                                                    <Lucide
                                                                        className={`${open && "rotate-180"} w-5 h-5 ml-auto duration-300 `}
                                                                        icon="ChevronDown"/>
                                                                </div>
                                                            </Accordion>

                                                        </div>

                                                        <AccordionPanel
                                                            className="text-slate-600 dark:text-slate-500 leading-relaxed">
                                                            <div className={'flex items-center'}>
                                                                <label>Status:</label>
                                                                <Select
                                                                    defaultValue={optionStatus.find(obj => obj.label === selectedStatus.status)}
                                                                    options={optionStatus}
                                                                    components={animatedComponents}
                                                                    onChange={updateStatus}
                                                                    filterOption={null}
                                                                    styles={style}
                                                                    className='w-40 ml-auto'
                                                                    theme={(theme) => ({
                                                                        ...theme,
                                                                        colors: {
                                                                            ...theme.colors,
                                                                            primary25: '#E2E8F0',
                                                                            primary: '#e2e8f0',
                                                                        },
                                                                    })}
                                                                    noOptionsMessage={noOptionsMessage}
                                                                    name='name'
                                                                />
                                                            </div>
                                                            <div className={'flex mt-4 items-center'}>
                                                                <label>Assignee:</label>
                                                                <Select
                                                                    defaultValue={optionsAssignies.find((obj) => obj.value === task?.assignee_id)}
                                                                    formatOptionLabel={(option) => (
                                                                        <div className="flex items-center">
                                                                            {option.image ? (
                                                                                <div className="ml-1 w-10 h-10 image-fit zoom-in">
                                                                                    <img src={image} className="rounded-full" />
                                                                                </div>
                                                                            ) : (
                                                                                ''
                                                                            )}
                                                                            <span className="ml-5">{option.label}</span>
                                                                        </div>
                                                                    )}
                                                                    filterOption={(candidate, input) =>
                                                                        candidate.label.toLowerCase().includes(input.toLowerCase())
                                                                    }
                                                                    options={optionsAssignies}
                                                                    className="w-3/4 ml-auto"
                                                                    components={animatedComponents}
                                                                    onChange={updateAssignee}
                                                                    id="validation-form-1"
                                                                    name="name"
                                                                    isSearchable={true}
                                                                />
                                                            </div>
                                                            <div className='flex mt-4 items-center'>
                                                                <label>Reporter:</label>
                                                                <div className={'ml-auto mr-auto'}>
                                                                    <div
                                                                        className="w-10 h-10 image-fit zoom-in">
                                                                        <Tippy
                                                                            tag="img"
                                                                            alt="Midone Tailwind HTML Admin Template"
                                                                            className="rounded-full"
                                                                            src={image}
                                                                            content={`Uploaded at 10 March`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className='mr-auto ml-auto'>  {task.reporter_profile?.display_name}</div>
                                                            </div>
                                                            <div className='flex mt-4 mb-4 items-center'>
                                                                <label className={'mr-auto'}>Deadline:</label>
                                                                <div onFocus={(e) => {
                                                                    setUpdateTaskDeadline(true)
                                                                    setShowUpdateButtons(true)
                                                                }}
                                                                >
                                                                    <Litepicker
                                                                        value={moment(deadline).format("D MMM, YYYY")}
                                                                        onChange={setDeadline}
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
                                                                </div>
                                                                {showUpdateButtons && updateTaskDeadline ? (
                                                                    <div className="flex h-10 items-center">
                                                                        <div onClick={updateTask}
                                                                             className={'flex rounded place-items-center p-1 bg-slate-100 ml-2 mr-3 transition duration-500 hover:scale-125 cursor-pointer'}>
                                                                            <Lucide className=' p-1' icon='Check'/>
                                                                        </div>
                                                                        <div onMouseDown={cancelUpdate}
                                                                             className={' flex rounded place-items-center p-1 bg-slate-100 transition duration-500 hover:scale-125 cursor-pointer'}>
                                                                            <Lucide className=' p-1' icon='X'/></div>
                                                                    </div>
                                                                ) : ('')}
                                                            </div>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                </AccordionGroup>
                                            </div>
                                        </div>
                                    </div>
                                </div>)}
                        </ModalBody>
                    </Modal>
                    <div className='justify-between flex'>
                        <div className="w-full sm:w-auto block md:flex mr-2  sm:mt-0 sm:ml-auto md:ml-0">
                            <div className="w-56 relative text-slate-500">
                                <input
                                    type="text"
                                    className="form-control w-56 box pr-10"
                                    placeholder="Search..."
                                    onChange={handleSearch}
                                />
                                <Lucide
                                    icon="Search"
                                    className="w-4 h-4 absolute mt-2.5 inset-y-0 mr-3 right-0"
                                />
                            </div>
                            {employeesProject.length > 0 ? (
                                <div className="flex mt-2 md:mt-0 ml-2">
                                    {employeesProject.map((user,index) => (
                                        <div className={`${index === 0 ? 'w-10 h-10 image-fit zoom-in' : 'w-10 h-10 image-fit zoom-in -ml-2'}`} key={index}>
                                            <Tippy
                                                tag="img"
                                                alt="Midone Tailwind HTML Admin Template"
                                                className="rounded-full"
                                                src={image}
                                                content={`${user.user_profile.display_name}`}
                                            />
                                        </div>
                                    ))}
                                    <div className={'ml-2'}>
                                        <CustomButton
                                            isLoading={isLoadingButton}
                                            className={`btn ${showAssignedTasks ? 'btn-primary' : 'btn-outline-primary'} mb-5`}
                                            children= {'Only My tasks'}
                                            onClick={() => setShowAssignedTasks(!showAssignedTasks)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>No Employees</div>
                            )}

                        </div>

                    </div>
                    <div className="overflow-x-auto whitespace-nowrap">
                        {isLoadingTasks ? (
                            statusForLoading.map((x, i) => (
                                <div
                                    key={i}
                                    className="intro-y overflow-y-auto h-35-rem w-26-rem mr-5 inline-block"
                                >
                                    <div className="box p-5 ">
                                        <Skeleton width={100}/>
                                        <div className="flex items-center justify-between">
                                            <div
                                                className=" w-full pt-4  flex flex-col justify-center items-center ">
                                                <div
                                                    className=" text-white cursor-pointer w-full max-w-md flex flex-col  shadow-lg p-4">
                                                    <div
                                                        className="flex items-center justify-between">
                                                        <div>
                                                            <Skeleton width={70}/>
                                                        </div>
                                                        <div className='flex flex-end'>
                                                            <Skeleton width={20}/>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="mt-4 text-gray-500  text-sm">
                                                        <Skeleton width={80}/>
                                                        <Skeleton width={100}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div
                                                className=" w-full pt-4  flex flex-col justify-center items-center ">
                                                <div
                                                    className=" text-white cursor-pointer w-full max-w-md flex flex-col  shadow-lg p-4">
                                                    <div
                                                        className="flex items-center justify-between">
                                                        <div>
                                                            <Skeleton width={70}/>
                                                        </div>
                                                        <div className='flex flex-end'>
                                                            <Skeleton width={20}/>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="mt-4 text-gray-500  text-sm">
                                                        <Skeleton width={80}/>
                                                        <Skeleton width={100}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div
                                                className=" w-full pt-4  flex flex-col justify-center items-center ">
                                                <div
                                                    className=" text-white cursor-pointer w-full max-w-md flex flex-col  shadow-lg p-4">
                                                    <div
                                                        className="flex items-center justify-between">
                                                        <div>
                                                            <Skeleton width={70}/>
                                                        </div>
                                                        <div className='flex flex-end'>
                                                            <Skeleton width={30}/>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="mt-4 text-gray-500  text-sm">
                                                        <Skeleton width={80}/>
                                                        <Skeleton width={100}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div
                                                className=" w-full pt-4  flex flex-col justify-center items-center ">
                                                <div
                                                    className=" text-white cursor-pointer w-full max-w-md flex flex-col  shadow-lg p-4">
                                                    <div
                                                        className="flex items-center justify-between">
                                                        <div>
                                                            <Skeleton width={70}/>
                                                        </div>
                                                        <div className='flex flex-end'>
                                                            <Skeleton width={30}/>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="mt-4 text-gray-500  text-sm">
                                                        <Skeleton width={80}/>
                                                        <Skeleton width={100}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>))
                        ) : (
                            statuses
                                .filter((status) => taskCategories[status])
                                .map((status, i) => (
                                <div
                                    key={i}
                                    className="intro-y overflow-y-auto h-35-rem w-26-rem mr-5 inline-block"
                                >
                                    <div className="box p-5">
                                        <div className='font-bold'>
                                            {status} ({taskCounts[status]})</div>
                                        <div className="overflow-x-auto md:overflow-x-hidden">
                                            {taskCategories[status] &&
                                                Object.values(taskCategories[status])
                                                    .filter(task => showAssignedTasks ? task.assignee_profile?.id === User.data.id : true)
                                                    .map((task) => (
                                            <div key={task.id}>
                                                    <div className="flex items-center justify-between">
                                                        <div
                                                            className="w-full pt-4 flex flex-col justify-center items-center">
                                                            <div
                                                                onClick={() => {
                                                                    setModalPreview(true)
                                                                    getTaskById(task.id)
                                                                    setTaskId(task.id)
                                                                    setCurrentTask(task)
                                                                    setName(task.name)
                                                                    setDescription(task.description)
                                                                    setDeadline(task.deadline)
                                                                    setSelectAssignee(task.assignee)
                                                                    setSelectedStatus(task.status)
                                                                    setCommentUpdated(task.comment)
                                                                }}
                                                                className="text-white cursor-pointer w-full max-w-md flex flex-col shadow-lg p-4"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div
                                                                        className="flex truncate items-center space-x-4">
                                                                        <div style={{color: 'black'}}
                                                                             className="text-md z-50 truncate z-[50]">{task.name}</div>
                                                                    </div>
                                                                    <div data-modal-target="defaultModal"
                                                                         className="flex items-center space-x-4">
                                                                        <div
                                                                            className="text-gray-500 hover:text-gray-300 cursor-pointer">
                                                                            <div className="flex flex-end"
                                                                                 style={{color: 'black'}}>
                                                                                {task.id}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4 text-gray-500 text-sm">
                                                                    <span style={{fontSize: '90%'}}>Assignee </span>

                                                                    <br/>
                                                                    <div className='flex'>
                                                                    <span
                                                                        className="text-gray-500 ">{task?.assignee_profile?.display_name}</span>
                                                                    <div className={'ml-auto '}>
                                                                        <div
                                                                            className="w-10 h-10 image-fit zoom-in">
                                                                            <Tippy
                                                                                tag="img"
                                                                                alt="Midone Tailwind HTML Admin Template"
                                                                                className="rounded-full"
                                                                                src={image}
                                                                                content={`Uploaded at 10 March`}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                </div>
                            ))

                        )}
                    </div>
                    <div
                        id="success-notification-content"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-success"/>
                        <div className="ml-4 mr-4">
                            <div className="font-medium">Task Updated successfully!</div>

                        </div>
                    </div>
                    <div
                        id="failied"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-danger"/>
                        <div className="ml-4 mr-4">
                            <div className="font-medium">Cannot update comment of different user!</div>

                        </div>
                    </div>
                    <div
                        id="success-notification-content-delete"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-success"/>
                        <div className="ml-4 mr-4">
                            <div className="font-medium">Task Deleted successfully!</div>

                        </div>
                    </div>
                    <div
                        id="failed-notification-content"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="XCircle" className="text-danger"/>
                        <div className="ml-4 mr-4">
                            <div className="font-medium"> Update failed!</div>
                            <div className="text-slate-500 mt-1">
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    )
}

export default Tasks
