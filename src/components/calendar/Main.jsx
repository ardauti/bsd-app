import "@fullcalendar/core/vdom";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import dom from "@left4code/tw-starter/dist/js/dom";
import {
    FullCalendar,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    LoadingIcon,
    Lucide,
    Preview,
    PreviewComponent,
    Litepicker
} from "@/components";
import React, {useCallback, useEffect, useState} from "react";
import {
    createNewBoardCustom,
    createNewBoardLeave,
    createNewBoardResource,
    createNewBoardTask,
    deleteBoardCustom,
    deleteBoardLeave,
    deleteBoardResource,
    deleteBoardTask,
    getBoardCustom,
    getBoardCustomById,
    getBoardLeaveById,
    getBoardLeaves,
    getBoardResource,
    getBoardResourceById,
    getBoardTask,
    getBoardTaskById,
    getCategoryEntries,
    getEmployeeEntryTypes,
    getProjects,
    getProjectsOnChange,
    getResourceEntryTypes,
    getSearchedTasksByStatus,
    getTasksForProject,
    getTools,
    getToolsOnChange,
    getUsersOnChange,
    getUsersTest,
    getVehicles,
    getVehiclesOnChange,
    updateBoardCustomById,
    updateBoardLeaveById,
    updateBoardResourceById,
    updateBoardTaskById,
} from "../../routes/routes";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import * as yup from "yup";
import classnames from "classnames";
import Toastify from "toastify-js";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import moment from "moment";
import Skeleton from "react-loading-skeleton";

const animatedComponents = makeAnimated();

function Main({setError}) {
    const [events, setEvents] = useState({
        id: "",
        title: "",
        start: "",
        end: "",
        allDay: false
    })
    const [addNewEventModalPreview, setAddNewEventModalPreview] = useState(false);
    const [editModalPreview, setEditModalPreview] = useState(false);
    const [boardLeave, setBoardLeave] = useState({
        type: 'ongoing',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        employee_entry_type_id: 1,
        user_id: '',
        status: 'Accepted',
        user_profile: {
            name: ''
        }
    })
    const [boardTask, setBoardTask] = useState({
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        description: '',
        project_id: '',
        project_entry_type_id: 1,
        assignee_id: 3,
        task_id: '',
        assignee_profile: {
            name: ''
        }
    })
    const [boardResource, setBoardResource] = useState({
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        description: '',
        project_id: '',
        resource_id: '',
        resource_entry_type_id: 1,
        resource_type_id: '',
        resource: {
            name: '',
        }
    })
    const [boardCustom, setBoardCustom] = useState({
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        description: '',
        type: '',
        entry_category_id: '',
        employees: [],
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingModal, setIsLoadingModal] = useState(false)
    const [isLoadingEditModal, setIsLoadingEditModal] = useState(false)
    const [categoryEntries, setCategoryEntries] = useState([])
    const [activeState, setActiveState] = useState(0);
    const [employeeEntryTypes, setEmployeeEntryTypes] = useState([])
    const [resourceEntryTypes, setResourceEntryTypes] = useState([])
    const [activeEmployeeEntryType, setActiveEmployeeEntryType] = useState(0);
    const [activeResourceEntryType, setActiveResourceEntryType] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [employeesDefault, setEmployeesDefault] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [eventId, setEventId] = useState('');
    const [eventType, setEventType] = useState('');
    const [projects, setProjects] = useState([]);
    const [projectsDefault, setProjectsDefault] = useState([]);
    const [isLoadingModalEmployee, setIsLoadingModalEmployee] = useState(false)
    const [isLoadingModalResource, setIsLoadingModalResource] = useState(false)
    const [isLoadingModalProject, setIsLoadingModalProject] = useState(false)
    const [isLoadingModalCustom, setIsLoadingModalCustom] = useState(false)
    const [isLoadingModalProjectTasks, setIsLoadingModalProjectTasks] = useState(false)
    const [isLoadingModalResourceContent, setIsLoadingModalResourceContent] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedResource, setSelectedResource] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [defaultTasks, setDefaultTasks] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [defaultVehicles, setDefaultVehicles] = useState([]);
    const [tools, setTools] = useState([]);
    const [defaultTools, setDefaultTools] = useState([]);
    const schema = yup
        .object({
            dateFrom: yup.date().required(),
        })
        .required();
    const {
        register,
        formState: {errors},
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: {
            dateForm: boardResource.startDate
        }
    });

    const boardLeavesData= {
        data: [
            {
                id: 1,
                start_date: "2023-07-24",
                end_date: "2023-07-26",
                start_time: "12:00:00",
                end_time: "13:00:00",
                employee_entry: {
                    id: 1,
                    type: "vacation",
                    entry_category_id: 1
                },
                user_id: 2,
                status: "Pending",
                user_profile: {
                    id: 2,
                    user_id: 2,
                    display_name: "Enes Ismaili",
                    first_name: "Enes",
                    last_name: "Ismaili",
                    profile_picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    birthdate: "2000-01-01",
                    created_at: "2023-07-24T08:23:30.000000Z",
                    updated_at: "2023-07-24T08:23:30.000000Z",
                    deleted_at: null
                }
            },
        ],
        links: {
            first: "http://localhost:8000/api/board/leaves?page=1",
            last: "http://localhost:8000/api/board/leaves?page=1",
            prev: null,
            next: null
        },
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            links: [
                {
                    url: null,
                    label: "&laquo; Previous",
                    active: false
                },
                {
                    url: "http://localhost:8000/api/board/leaves?page=1",
                    label: "1",
                    active: true
                },
                {
                    url: null,
                    label: "Next &raquo;",
                    active: false
                }
            ],
            path: "http://localhost:8000/api/board/leaves",
            per_page: 20,
            to: 6,
            total: 6,
            timestamp: 1690190145482
        }
    };
    const boardTasksData= {
        data: [
            {
                id: 1,
                start_date: "2023-07-22",
                end_date: "2023-07-24",
                start_time: "12:00:00",
                end_time: "13:00:00",
                description: "Description",
                project_id: 6,
                task_id: 219,
                project_entry_type: {
                    id: 1,
                    type: "task",
                    entry_category_id: 3
                },
                assignee_id: 3,
                assignee_profile: {
                    id: 3,
                    user_id: 3,
                    display_name: "Jon Kurtishi",
                    first_name: "Jon",
                    last_name: "Kurtishi",
                    profile_picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    birthdate: "2000-01-01",
                    created_at: "2023-07-24T08:23:32.000000Z",
                    updated_at: "2023-07-24T08:23:32.000000Z",
                    deleted_at: null
                }
            },
        ],
        meta: {
            timestamp: 1690190429014
        }
    };
    const boardResourcesData= {
        data: [
            {
                id: 1,
                start_date: "2023-07-24",
                end_date: "2023-07-27",
                start_time: "12:00:00",
                end_time: "13:00:00",
                description: "Description",
                resource: {
                    id: 2,
                    manufacturer: "VW",
                    plate_number: "HH DE 124"
                },
                resource_type_id: {
                    id: 2,
                    type: "Vehicle"
                },
                resource_entry_type_id: {
                    id: 1,
                    type: "defect",
                    entry_category_id: 2
                }
            },
        ],
        links: {
            first: "http://localhost:8000/api/board/resources?page=1",
            last: "http://localhost:8000/api/board/resources?page=1",
            prev: null,
            next: null
        },
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            links: [
                {
                    url: null,
                    label: "&laquo; Previous",
                    active: false
                },
                {
                    url: "http://localhost:8000/api/board/resources?page=1",
                    label: "1",
                    active: true
                },
                {
                    url: null,
                    label: "Next &raquo;",
                    active: false
                }
            ],
            path: "http://localhost:8000/api/board/resources",
            per_page: 20,
            to: 6,
            total: 6,
            timestamp: 1690190462497
        }
    };
    const boardCustomData= {
        data: [{
            id: 1,
            type: "Meeting",
            start_date: "2023-07-24",
            end_date: "2023-07-28",
            start_time: "12:00",
            end_time: "14:30",
            description: "This is a custom boarding to discuss about some chosen topic",
            entry_category_id: "4",
            employees: [
                {
                    id: 2,
                    user_id: 2,
                    display_name: "Enes Ismaili",
                    first_name: "Enes",
                    last_name: "Ismaili",
                    profile_picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    birthdate: "2000-01-01",
                    created_at: "2023-07-24T08:23:30.000000Z",
                    updated_at: "2023-07-24T08:23:30.000000Z",
                    deleted_at: null
                },
                {
                    id: 1,
                    user_id: 1,
                    display_name: "Jon Kurtishi",
                    first_name: "Jon",
                    last_name: "Kurtishi",
                    profile_picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    birthdate: "2000-01-01",
                    created_at: "2023-07-24T08:23:27.000000Z",
                    updated_at: "2023-07-24T08:23:27.000000Z",
                    deleted_at: null
                },
            ]
        }],
        meta: {
            timestamp: 1690190540779
        }
    }
    const employeeTypesData ={
        data: [
            {
                id: 1,
                type: "vacation",
                entry_category_id: 1
            },
            {
                id: 2,
                type: "sick",
                entry_category_id: 1
            }
        ]
    }
    const resourcesTypesData ={
        data: [
            {
                id: 1,
                type: "defect",
                entry_category_id: 2
            },
            {
                id: 2,
                type: "workshop",
                entry_category_id: 2
            }
        ]
    }
    const boardEntryTypes = {
        data: [
            {
                id: 1,
                type: "employee"
            },
            {
                id: 2,
                type: "resource"
            },
            {
                id: 3,
                type: "project"
            },
            {
                id: 4,
                type: "custom"
            }
        ]
    }
    const projectsData = {
        data: [
            {
                id: 1,
                name: "Project Artemis 1",
                description: "This is the description for the 1st project",
                start_date: "2022-01-01",
                end_date: "2024-09-20",
                address: "Address of project 1",
                client: {
                    id: 3,
                    company_name: "Pofix",
                    email: "pofix@mail.com",
                    phone_number: "123456789",
                    country: "North Macedonia",
                    city: "Tetovo",
                    street: "ul. BR. BB",
                    postal_code: "1200",
                    created_at: null,
                    updated_at: null,
                    deleted_at: null
                },
                status: {
                    id: 3,
                    status: "Completed",
                    description: "description"
                },
                progress: [
                    {
                        "Backlog": 25
                    },
                    {
                        "In Progress": 25
                    },
                    {
                        "Review": 25
                    },
                    {
                        "Completed": 25
                    }
                ]
            },
            {
                id:2,
                name: "Project Artemis 2",
                description: "This is the description for the 1st project",
                start_date: "2022-01-01",
                end_date: "2024-09-20",
                address: "Address of project 2",
                client: {
                    id: 3,
                    company_name: "Pofix",
                    email: "pofix@mail.com",
                    phone_number: "123456789",
                    country: "North Macedonia",
                    city: "Tetovo",
                    street: "ul. BR. BB",
                    postal_code: "1200",
                    created_at: null,
                    updated_at: null,
                    deleted_at: null
                },
                status: {
                    id: 3,
                    status: "Completed",
                    description: "description"
                },
                progress: [
                    {
                        "Backlog": 25
                    },
                    {
                        "In Progress": 25
                    },
                    {
                        "Review": 25
                    },
                    {
                        "Completed": 25
                    }
                ]
            },
            {
                id: 3,
                name: "Project Artemis 3",
                description: "This is the description for the 1st project",
                start_date: "2022-01-01",
                end_date: "2024-09-20",
                address: "Address of project 3",
                client: {
                    id: 3,
                    company_name: "Pofix",
                    email: "pofix@mail.com",
                    phone_number: "123456789",
                    country: "North Macedonia",
                    city: "Tetovo",
                    street: "ul. BR. BB",
                    postal_code: "1200",
                    created_at: null,
                    updated_at: null,
                    deleted_at: null
                },
                status: {
                    id: 3,
                    status: "Completed",
                    description: "description"
                },
                progress: [
                    {
                        "Backlog": 25
                    },
                    {
                        "In Progress": 25
                    },
                    {
                        "Review": 25
                    },
                    {
                        "Completed": 25
                    }
                ]
            },
            {
                id: 4,
                name: "Project Artemis 4",
                description: "This is the description for the 1st project",
                start_date: "2022-01-01",
                end_date: "2024-09-20",
                address: "Address of project 4",
                client: {
                    id: 3,
                    company_name: "Pofix",
                    email: "pofix@mail.com",
                    phone_number: "123456789",
                    country: "North Macedonia",
                    city: "Tetovo",
                    street: "ul. BR. BB",
                    postal_code: "1200",
                    created_at: null,
                    updated_at: null,
                    deleted_at: null
                },
                status: {
                    id: 3,
                    status: "Completed",
                    description: "description"
                },
                progress: [
                    {
                        "Backlog": 25
                    },
                    {
                        "In Progress": 25
                    },
                    {
                        "Review": 25
                    },
                    {
                        "Completed": 25
                    }
                ]
            },
        ],
        links: {
            first: "http://localhost:8000/api/backoffice/users?page=1",
            last: "http://localhost:8000/api/backoffice/users?page=1",
            prev: null,
            next: null
        },
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            links: [
                {
                    "url": null,
                    "label": "&laquo; Previous",
                    "active": false
                },
                {
                    "url": "http://localhost:8000/api/backoffice/users?page=1",
                    "label": "1",
                    "active": true
                },
                {
                    "url": null,
                    "label": "Next &raquo;",
                    "active": false
                }
            ],
            path: "http://localhost:8000/api/backoffice/users",
            per_page: 110,
            to: 8,
            total: 8,
            timestamp: 1690186231713
        }
    }
    const employeesData = {
        data: [
            {
                id: 2,
                email: "e.ismaili@ineting.net",
                phone_number: "070111222",
                gender: "Male",
                user_profile: {
                    id: 2,
                    user_id: 2,
                    display_name: "Enes Ismaili",
                    first_name: "Enes",
                    last_name: "Ismaili",
                    profile_picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    birthdate: "2000-01-01",
                    created_at: "2023-07-11T08:56:11.000000Z",
                    updated_at: "2023-07-11T08:56:11.000000Z",
                    deleted_at: null
                },
                created_at: "2023-07-11T08:56:11.000000Z",
                updated_at: "2023-07-11T08:56:11.000000Z",
                roles: [
                    {
                        id: 1,
                        name: "Master Admin",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 2,
                        name: "Admin",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 3,
                        name: "User",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 4,
                        name: "Project Manager",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                ]
            },
            {
                id: 3,
                email: "j.kurtishi@ineting.net",
                phone_number: "070111222",
                gender: "Male",
                user_profile: {
                    id: 2,
                    user_id: 2,
                    display_name: "Jon Kurtishi",
                    first_name: "Jon",
                    last_name: "Kurtishi",
                    profile_picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    birthdate: "2000-01-01",
                    created_at: "2023-07-11T08:56:11.000000Z",
                    updated_at: "2023-07-11T08:56:11.000000Z",
                    deleted_at: null
                },
                created_at: "2023-07-11T08:56:11.000000Z",
                updated_at: "2023-07-11T08:56:11.000000Z",
                roles: [
                    {
                        id: 1,
                        name: "Master Admin",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 2,
                        name: "Admin",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 3,
                        name: "User",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 4,
                        name: "Project Manager",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                ]
            },
            {
                id: 4,
                email: "d.dika@ineting.net",
                phone_number: "070111222",
                gender: "Male",
                user_profile: {
                    id: 2,
                    user_id: 2,
                    display_name: "Drenas Dika",
                    first_name: "Drenas",
                    last_name: "Dika`",
                    profile_picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    birthdate: "2000-01-01",
                    created_at: "2023-07-11T08:56:11.000000Z",
                    updated_at: "2023-07-11T08:56:11.000000Z",
                    deleted_at: null
                },
                created_at: "2023-07-11T08:56:11.000000Z",
                updated_at: "2023-07-11T08:56:11.000000Z",
                roles: [
                    {
                        id: 1,
                        name: "Master Admin",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 2,
                        name: "Admin",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 3,
                        name: "User",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 4,
                        name: "Project Manager",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                ]
            },
            {
                id: 5,
                email: "artim.dauti@gmail.com",
                phone_number: "070111222",
                gender: "Male",
                user_profile: {
                    id: 2,
                    user_id: 2,
                    display_name: "Artim Dauti",
                    first_name: "Artim",
                    last_name: "Dauti",
                    profile_picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    birthdate: "2000-01-01",
                    created_at: "2023-07-11T08:56:11.000000Z",
                    updated_at: "2023-07-11T08:56:11.000000Z",
                    deleted_at: null
                },
                created_at: "2023-07-11T08:56:11.000000Z",
                updated_at: "2023-07-11T08:56:11.000000Z",
                roles: [
                    {
                        id: 1,
                        name: "Master Admin",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 2,
                        name: "Admin",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 3,
                        name: "User",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                    {
                        id: 4,
                        name: "Project Manager",
                        guard_name: "api",
                        created_at: null,
                        updated_at: null
                    },
                ]
            },
        ],
        links: {
            first: "http://localhost:8000/api/backoffice/users?page=1",
            last: "http://localhost:8000/api/backoffice/users?page=1",
            prev: null,
            next: null
        },
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            links: [
                {
                    "url": null,
                    "label": "&laquo; Previous",
                    "active": false
                },
                {
                    "url": "http://localhost:8000/api/backoffice/users?page=1",
                    "label": "1",
                    "active": true
                },
                {
                    "url": null,
                    "label": "Next &raquo;",
                    "active": false
                }
            ],
            path: "http://localhost:8000/api/backoffice/users",
            per_page: 110,
            to: 8,
            total: 8,
            timestamp: 1690186231713
        }
    }
    const toolsData = {
        data: [
            {
                id: 1,
                name: "Makita",
                serial_number: "DE120",
                weight: 30
            },
            {
                id: 2,
                name: "Makita 2",
                serial_number: "DE121",
                weight: 18
            },
            {
                id: 3,
                name: "Makita 3",
                serial_number: "DE122",
                weight: 24
            },
        ],
        links: {
            first: "http://localhost:8000/api/projects/tools?page=1",
            last: "http://localhost:8000/api/projects/tools?page=1",
            prev: null,
            next: null
        },
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            path: "http://localhost:8000/api/projects/tools",
            per_page: 200,
            to: 6,
            total: 6,
            timestamp: 1690192961914
        }
    }
    const vehiclesData = {
        data: [
            {
                id: 1,
                manufacturer: "Mercedes",
                plate_number: "HH DE 123"
            },
            {
                id: 2,
                manufacturer: "BMW",
                plate_number: "HH DE 121"
            },
            {
                id: 3,
                manufacturer: "Golf",
                plate_number: "HH DE 122"
            },
        ],
        links: {
            first: "http://localhost:8000/api/projects/tools?page=1",
            last: "http://localhost:8000/api/projects/tools?page=1",
            prev: null,
            next: null
        },
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            path: "http://localhost:8000/api/projects/tools",
            per_page: 200,
            to: 6,
            total: 6,
            timestamp: 1690192961914
        }
    }



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // const res = await getBoardLeaves()
                const boardLeavesEvents = boardLeavesData.data.filter((x) => x.status !== 'Pending').map((x) => {
                    return {
                        title: x.user_profile.display_name,
                        start: x.start_date + ' ' + x.start_time,
                        end: x.end_date + ' ' + x.end_time,
                        extendedProps: {
                            id: x.id,
                            type: 'boardLeave',
                        },
                    }
                })
                // const boardTasks = await getBoardTask()
                const boardTasksEvents = boardTasksData.data.map((x) => {
                    return {
                        title: x.assignee_profile?.display_name,
                        start: x.start_date + ' ' + x.start_time,
                        end: x.end_date + ' ' + x.end_time,
                        color: '#d57515',
                        extendedProps: {
                            id: x.id,
                            type: 'boardTask',
                        },
                    }
                })
                // const boardResource = await getBoardResource()
                const boardResourceEvents = boardResourcesData.data.map((x) => {
                    return {
                        title: x.resource.name ? x.resource.name + ' ' + `(${x.resource.serial_number})` : x.resource.manufacturer + ' ' + `(${x.resource.plate_number})`,
                        start: x.start_date + ' ' + x.start_time,
                        end: x.end_date + ' ' + x.end_time,
                        color: 'green',
                        extendedProps: {
                            id: x.id,
                            type: 'boardResource',
                        },
                    }
                })
                // const boardCustom = await getBoardCustom()
                const boardCustomEvents = boardCustomData?.data?.map((x) => {
                    return {
                        title: x.type + ' ' + `(${x.employees.map(employee => employee.length > 1 ? `${employee.display_name},` : `${employee.display_name}`)})`,
                        start: x.start_date + ' ' + x.start_time,
                        end: x.end_date + ' ' + x.end_time,
                        color: 'blue',
                        extendedProps: {
                            id: x.id,
                            type: 'boardCustom',
                        },
                    }
                })
                setEvents([...boardLeavesEvents, ...boardTasksEvents, ...boardResourceEvents, ...boardCustomEvents])
                setIsLoading(false)
            } catch (err) {
                setError(err)
            }
        };
        fetchData();
    }, []);

    const onSubmit = useCallback(async (event) => {
        event.preventDefault()
        // try {
        //     if (activeState === 0) {
        //         const params = {
        //             type: boardLeave.type,
        //             start_date: moment(boardLeave.startDate).format("YYYY-MM-DD"),
        //             end_date: moment(boardLeave.endDate).format("YYYY-MM-DD"),
        //             start_time: boardLeave.startTime,
        //             end_time: boardLeave.endTime,
        //             employee_entry_type_id: boardLeave.employee_entry_type_id,
        //             user_id: boardLeave.user_id,
        //             status: boardLeave.status
        //         }
        //        const response = await createNewBoardLeave(params);
        //         const newEvents = {
        //             title: response.user_profile.display_name,
        //             start: response.start_date + ' ' + response.start_time,
        //             end: response.end_date + ' ' + response.end_time,
        //             extendedProps: {
        //                 id: response.id,
        //                 type: 'boardLeave',
        //             },
        //
        //         }
        //         setEvents([...events, newEvents])
        //         setBoardLeave(prevState => {
        //             return {
        //                 ...prevState,
        //                 startDate: '',
        //                 endDate: '',
        //                 startTime: '',
        //                 endTime: '',
        //             }
        //         })
        //         Toastify({
        //             node: dom("#success-notification-content")
        //                 .clone()
        //                 .removeClass("hidden")[0],
        //             duration: 3000,
        //             newWindow: true,
        //             close: true,
        //             gravity: "top",
        //             position: "right",
        //             stopOnFocus: true,
        //         }).showToast();
        //     } else if (activeState === 1) {
        //         const params = {
        //             description: boardResource.description,
        //             start_date: moment(boardResource.startDate).format("YYYY-MM-DD"),
        //             end_date: moment(boardResource.endDate).format("YYYY-MM-DD"),
        //             start_time: boardResource.startTime,
        //             end_time: boardResource.endTime,
        //             resource_entry_type_id: boardResource.resource_entry_type_id,
        //             resource_type_id: boardResource.resource_type_id,
        //             resource_id: boardResource.resource_id,
        //             project_id: boardResource.project_id
        //         }
        //         const response = await createNewBoardResource(params);
        //         const newEvents = {
        //             title: response.resource.name ? response.resource.name + ' ' + `(${response.resource.serial_number})` : response.resource.manufacturer + ' ' + `(${response.resource.plate_number})`,
        //             start: response.start_date + ' ' + response.start_time,
        //             end: response.end_date + ' ' + response.end_time,
        //             color: 'green',
        //             extendedProps: {
        //                 id: response.id,
        //                 type: 'boardResource',
        //             },
        //         }
        //         setEvents([...events, newEvents])
        //         setBoardResource(prevState => {
        //             return {
        //                 ...prevState,
        //                 startDate: '',
        //                 endDate: '',
        //                 startTime: '',
        //                 endTime: '',
        //             }
        //         })
        //         Toastify({
        //             node: dom("#success-notification-content")
        //                 .clone()
        //                 .removeClass("hidden")[0],
        //             duration: 3000,
        //             newWindow: true,
        //             close: true,
        //             gravity: "top",
        //             position: "right",
        //             stopOnFocus: true,
        //         }).showToast();
        //     } else if (activeState === 2) {
        //         const params = {
        //             description: boardTask.description,
        //             start_date: moment(boardTask.startDate).format("YYYY-MM-DD"),
        //             end_date: moment(boardTask.endDate).format("YYYY-MM-DD"),
        //             start_time: boardTask.startTime,
        //             end_time: boardTask.endTime,
        //             project_entry_type_id: boardTask.project_entry_type_id,
        //             assignee_id: boardTask.assignee_id,
        //             task_id: boardTask.task_id,
        //             project_id: boardTask.project_id
        //         }
        //         const response = await createNewBoardTask(params);
        //         const newEvents = {
        //             title: response.assignee_profile?.display_name,
        //             start: response.start_date + ' ' + response.start_time,
        //             end: response.end_date + ' ' + response.end_time,
        //             extendedProps: {
        //                 id: response.id,
        //                 type: 'boardTask',
        //             },
        //             color: '#d57515'
        //         }
        //         setEvents([...events, newEvents])
        //         setBoardTask(prevState => {
        //             return {
        //                 ...prevState,
        //                 startDate: '',
        //                 endDate: '',
        //                 startTime: '',
        //                 endTime: '',
        //             }
        //         })
        //         Toastify({
        //             node: dom("#success-notification-content")
        //                 .clone()
        //                 .removeClass("hidden")[0],
        //             duration: 3000,
        //             newWindow: true,
        //             close: true,
        //             gravity: "top",
        //             position: "right",
        //             stopOnFocus: true,
        //         }).showToast();
        //     } else if (activeState === 3) {
        //         const params = {
        //             description: boardCustom.description,
        //             start_date: moment(boardCustom.startDate).format("YYYY-MM-DD"),
        //             end_date: moment(boardCustom.endDate).format("YYYY-MM-DD"),
        //             start_time: boardCustom.startTime,
        //             end_time: boardCustom.endTime,
        //             entry_category_id: 4,
        //             employees: boardCustom.employees.map(x => x.value),
        //             type: boardCustom.type
        //         }
        //         const response = await createNewBoardCustom(params);
        //         const newEvents = {
        //             title: response.type + ' ' + `(${response.employees.map(employee => employee.display_name)})`,
        //             start: response.start_date + ' ' + response.start_time,
        //             end: response.end_date + ' ' + response.end_time,
        //             extendedProps: {
        //                 id: response.id,
        //                 type: 'boardCustom',
        //             },
        //             color: 'blue'
        //         }
        //         setEvents([...events, newEvents])
        //         setBoardCustom(prevState => {
        //             return {
        //                 ...prevState,
        //                 startDate: '',
        //                 endDate: '',
        //                 startTime: '',
        //                 endTime: '',
        //             }
        //         })
        //         Toastify({
        //             node: dom("#success-notification-content")
        //                 .clone()
        //                 .removeClass("hidden")[0],
        //             duration: 3000,
        //             newWindow: true,
        //             close: true,
        //             gravity: "top",
        //             position: "right",
        //             stopOnFocus: true,
        //         }).showToast();
        //     }
        // } catch (err) {
        //     Toastify({
        //         node: dom("#failed-notification-content")
        //             .clone()
        //             .removeClass("hidden")[0],
        //         duration: 3000,
        //         newWindow: true,
        //         close: true,
        //         gravity: "top",
        //         position: "right",
        //         stopOnFocus: true,
        //     }).showToast();
        //     setError(err)
        // }
        setAddNewEventModalPreview(false)
    }, [boardLeave, activeState, boardTask, boardResource, boardCustom])

    const onAddEvent = useCallback(async () => {
        setAddNewEventModalPreview(true)
        setActiveState(0)
        setIsLoadingModal(true)
        try {
            // const res = await getCategoryEntries()
            setCategoryEntries(boardEntryTypes.data)
            // const employees = await getUsersTest()
            if (activeState === 0) {
                try {
                    // const employeeEntryTypes = await getEmployeeEntryTypes()
                    setEmployeeEntryTypes(employeeTypesData.data)
                } catch (err) {
                    setError(err)
                }
            }
            if (activeState === 1) {
                try {
                    // const resourceEntryTypes = await getResourceEntryTypes()
                    setResourceEntryTypes(resourcesTypesData.data)
                } catch (err) {
                    setError(err)
                }
            }
            if (activeState === 2) {
                try {
                    // const projects = await getProjects()
                    setProjects(projectsData.data)
                    setProjectsDefault(projectsData.data)
                } catch (err) {
                    setError(err)
                }
            }
            if (activeState === 3) {
                try {
                    // const employeeEntryTypes = await getEmployeeEntryTypes()
                    setEmployeeEntryTypes(employeeTypesData.data)
                } catch (err) {
                    setError(err)
                }
            }
            setEmployees(employeesData.data)
            setEmployeesDefault(employeesData.data)
        } catch (err) {
            setError(err)
        }
        setIsLoadingModal(false)
    }, [categoryEntries, employees, projects, activeState])

    const handleResource = useCallback(async (event, categoryEntryID) => {
        setActiveState(categoryEntryID)
        if (categoryEntryID === 0) {
            setIsLoadingModalEmployee(true)
            try {
                setSelectedProject(null)
                // const employeeEntryTypes = await getEmployeeEntryTypes()
                setEmployeeEntryTypes(employeeTypesData.data)
            } catch (err) {
                setError(err)
            }
            setIsLoadingModalEmployee(false)
        }
        if (categoryEntryID === 1) {
            setIsLoadingModalResource(true)
            try {
                setSelectedResource(null)
                setSelectedProject(null)
                // const resourceEntryTypes = await getResourceEntryTypes()
                setResourceEntryTypes(resourcesTypesData.data)
            } catch (err) {
                setError(err)
            }
            setIsLoadingModalResource(false)
        }
        if (categoryEntryID === 2) {
            setIsLoadingModalProject(true)
            try {
                // const projects = await getProjects()
                setProjects(projectsData.data)
                setProjectsDefault(projectsData.data)
            } catch (err) {
                setError(err)
            }
            setIsLoadingModalProject(false)
        }
        if (categoryEntryID === 3) {
            setIsLoadingModalCustom(true)
            try {
                setSelectedProject(null)
                // const employeeEntryTypes = await getEmployeeEntryTypes()
                setEmployeeEntryTypes(employeeTypesData.data)
            } catch (err) {
                setError(err)
            }
            setIsLoadingModalCustom(false)
        }
    }, [activeState])

    const handleEmployeeEntryTypes = useCallback(async (event, employeeEntryTypeId) => {
        setActiveEmployeeEntryType(Number(event.currentTarget.id))
        setBoardLeave(prevState => {
            return {
                ...prevState,
                employee_entry_type_id: employeeEntryTypeId
            }
        })
    }, [activeEmployeeEntryType])

    const handleResourceEntryTypes = useCallback(async (event, resourceEntryTypeId) => {
        setActiveResourceEntryType(Number(event.currentTarget.id))
        setBoardResource(prevState => {
            return {
                ...prevState,
                resource_entry_type_id: resourceEntryTypeId
            }
        })
    }, [activeResourceEntryType])

    const handleSearch = async (searchQuery) => {
        // if (searchQuery.trim().length === 0) {
        //     setEmployees(employeesDefault)
        //     return
        // }
        // setLoadingSearch(true)
        // let employees = []
        // try {
        //     employees = await getUsersOnChange(searchQuery)
        //
        // } catch (err) {
        //     setError(err)
        // } finally {
        //     setEmployees(employees)
        //     setLoadingSearch(false)
        // }
    }

    const handleSearchProject = async (searchQuery) => {
        // if (searchQuery.trim().length === 0) {
        //     setProjects(projectsDefault)
        //     return
        // }
        // setLoadingSearch(true)
        // let projects = []
        // try {
        //     projects = await getProjectsOnChange(searchQuery)
        // } catch (err) {
        //     setError(err)
        // } finally {
        //     setProjects(projects)
        //     setLoadingSearch(false)
        // }
    }
    const handleSearchProjectTasks = async (searchQuery) => {
        // if (searchQuery.trim().length === 0) {
        //     setTasks(defaultTasks)
        //     return
        // }
        // setLoadingSearch(true)
        // let tasks = []
        // try {
        //     tasks = await getSearchedTasksByStatus(searchQuery, selectedProject, 'Backlog')
        // } catch (err) {
        //     setError(err)
        // } finally {
        //     setTasks(tasks)
        //     setLoadingSearch(false)
        // }
    }

    const handleSearchVehicles = async (searchQuery) => {
        // if (searchQuery.trim().length === 0) {
        //     setVehicles(defaultVehicles)
        //     return
        // }
        // setLoadingSearch(true)
        // let vehicles = []
        // try {
        //     vehicles = await getVehiclesOnChange(searchQuery)
        // } catch (err) {
        //     setError(err)
        // } finally {
        //     setVehicles(vehicles)
        //     setLoadingSearch(false)
        // }
    }

    const handleSearchTools = async (searchQuery) => {
        // if (searchQuery.trim().length === 0) {
        //     setTools(defaultTools)
        //     return
        // }
        // setLoadingSearch(true)
        // let tools = []
        // try {
        //     tools = await getToolsOnChange(searchQuery)
        // } catch (err) {
        //     setError(err)
        // } finally {
        //     setTools(tools)
        //     setLoadingSearch(false)
        // }
    }

    const optionsEmployees = employees.map(function (employee) {
        return {value: employee.id, label: employee.user_profile?.display_name};
    })
    const optionsProject = projects.map(function (project) {
        return {value: project.id, label: project.name};
    })
    // const optionsProjectTasks = tasks?.map(function (task) {
    //     return {value: task.id, label: task.name};
    // })
    const optionsResource = [
        {value: 1, label: 'Vehicles'},
        {value: 2, label: 'Tools'},
    ]
    const optionsVehicles = vehicles.map(function (vehicle) {
        return {value: vehicle.id, label: vehicle.manufacturer};
    })
    const optionsTools = tools.map(function (tool) {
        return {value: tool.id, label: tool.name};
    })


    const noOptionsMessage = function (obj) {
        if (obj.inputValue.trim().length === 0) {
            return null;
        }
        return 'No matching';
    };
    const handleInputChange = function (inputText, meta) {
        if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
            handleSearch(inputText);
        }
    };
    const handleInputProjectChange = function (inputText, meta) {
        if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
            // …
            handleSearchProject(inputText);
        }
    };
    const handleInputProjectTasksChange = function (inputText, meta) {
        if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
            // …
            handleSearchProjectTasks(inputText);
        }
    };
    const handleInputVehiclesChange = function (inputText, meta) {
        if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
            // …
            handleSearchVehicles(inputText);
        }
    };

    const handleInputToolsChange = function (inputText, meta) {
        if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
            // …
            handleSearchTools(inputText);
        }
    };
    const handleChange = (e) => {
        if (activeState === 0) {
            setBoardLeave(prevState => {
                return {
                    ...prevState,
                    user_id: e.value
                }
            })
        } else if (activeState === 2) {
            setBoardTask(prevState => {
                return {
                    ...prevState,
                    assignee_id: e.value
                }
            })
        }
        else if (activeState === 3) {
            setBoardCustom(prevState => {
                return {
                    ...prevState,
                    employees: e
                }
            })
        }
    };

    const handleEditEmployeesSelect = useCallback((e) => {
        setBoardCustom(prevState => {
            return {
                ...prevState,
                employees: e
            }
        })
    }, [boardCustom]);

    const handleChangeProjects = useCallback(async (e) => {
        setSelectedProject(e.value)
        setBoardTask(prevState => {
            return {
                ...prevState,
                project_id: e.value
            }
        })
        // try {
        //     setIsLoadingModalProjectTasks(true)
        //     const res = await getTasksForProject(e.value, 'Backlog')
        //     setTasks(res)
        //     setDefaultTasks(res)
        //     setIsLoadingModalProjectTasks(false)
        // } catch (err) {
        //     setError(err)
        //     setIsLoadingModalProjectTasks(false)
        // }

    }, [selectedProject, tasks, boardTask]);

    const handleChangeResources = useCallback(async (e) => {
        setSelectedResource(e.value)
        setBoardResource(prevState => {
            return {
                ...prevState,
                resource_type_id: e.value + 1
            }
        })
        try {
            setIsLoadingModalResourceContent(true)
            if (e.value === 1) {
                try {
                    // const res = await getVehicles()
                    setVehicles(vehiclesData.data)
                    setDefaultVehicles(vehiclesData.data)
                } catch (err) {
                    setError(err)
                    setIsLoadingModalResourceContent(false)
                }
            } else if (e.value === 2) {
                try {
                    // const res = await getTools()
                    setTools(toolsData.data)
                    setDefaultTools(toolsData.data)
                } catch (err) {
                    setError(err)
                    setIsLoadingModalResourceContent(false)
                }
            }
            // const projects = await getProjects()
            setProjects(projectsData.data)
            setProjectsDefault(projectsData.data)
            setIsLoadingModalResourceContent(false)

        } catch (err) {
            setError(err)
            setIsLoadingModalResourceContent(false)

        }
    }, [selectedResource, tools, vehicles, projects]);
    const handleChangeProject = useCallback(async (e) => {
        setBoardResource(prevState => {
            return {
                ...prevState,
                project_id: e.value
            }
        })
    }, []);

    const handleChangeProjectTasks = (e) => {
        setBoardTask(prevState => {
            return {
                ...prevState,
                task_id: e.value
            }
        })
    };

    const handleChangeVehicle = (e) => {
        setBoardResource(prevState => {
            return {
                ...prevState,
                resource_id: e.value
            }
        })
    };
    const handleChangeTool = (e) => {
        setBoardResource(prevState => {
            return {
                ...prevState,
                resource_id: e.value
            }
        })
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

    const deleteEvent = useCallback(async () => {
        // try {
        //     if (eventType === 'boardLeave') {
        //         await deleteBoardLeave(Number(eventId))
        //     } else if (eventType === 'boardTask') {
        //         await deleteBoardTask(Number(eventId))
        //     } else if (eventType === 'boardResource') {
        //         await deleteBoardResource(Number(eventId))
        //     } else if (eventType === 'boardCustom') {
        //         await deleteBoardCustom(Number(eventId))
        //     }
        //
        //     Toastify({
        //         node: dom("#success-deleted-content")
        //             .clone()
        //             .removeClass("hidden")[0],
        //         duration: 3000,
        //         newWindow: true,
        //         close: true,
        //         gravity: "top",
        //         position: "right",
        //         stopOnFocus: true,
        //     }).showToast();
        //
        //     const newList = events.filter((item) => {
        //         return !(item.extendedProps.type === eventType && item.extendedProps.id === Number(eventId));
        //     })
        //     setEvents(newList)
        // } catch (err) {
        //     setError(err)
        // }
        setEditModalPreview(false)
    }, [eventId, eventType])

    const updateEvent = async (info) => {
        // try {
        //     if (info.event.extendedProps.type === 'boardLeave') {
        //         const params = {
        //             type: 'ongoing',
        //             start_date: moment(info.event.start).format("YYYY-MM-DD"),
        //             end_date: moment(info.event.end).format("YYYY-MM-DD"),
        //             start_time: moment(info.event.start).format("HH:mm"),
        //             end_time: moment(info.event.end).format("HH:mm"),
        //             status: 'Accepted',
        //         }
        //         const response = await updateBoardLeaveById(params, Number(info.event.extendedProps.id));
        //         const newList = events.map((item) => {
        //             if (item.extendedProps.type === info.event.extendedProps.type && item.extendedProps.id === Number(info.event.extendedProps.id)) {
        //                 return {
        //                     ...item,
        //                     extendedProps: {id: response.id, type: 'boardLeave',},
        //                     start: response.start_date + ' ' + response.start_time,
        //                     end: response.end_date + ' ' + response.end_time
        //                 }
        //             } else {
        //                 return {
        //                     ...item
        //                 }
        //             }
        //         });
        //         setEvents(newList)
        //     } else if (info.event.extendedProps.type === 'boardTask') {
        //         const params = {
        //             start_date: moment(info.event.start).format("YYYY-MM-DD"),
        //             end_date: moment(info.event.end).format("YYYY-MM-DD"),
        //             start_time: moment(info.event.start).format("HH:mm"),
        //             end_time: moment(info.event.end).format("HH:mm"),
        //         }
        //         const response = await updateBoardTaskById(params, Number(info.event.extendedProps.id));
        //         const newList = events.map((item) => {
        //             if (item.extendedProps.type === info.event.extendedProps.type && item.extendedProps.id === Number(info.event.extendedProps.id)) {
        //                 return {
        //                     ...item,
        //                     extendedProps: {id: response.id, type: 'boardTask',},
        //                     start: response.start_date + ' ' + response.start_time,
        //                     end: response.end_date + ' ' + response.end_time
        //                 }
        //             } else {
        //                 return {
        //                     ...item
        //                 }
        //             }
        //         });
        //         setEvents(newList)
        //     } else if (info.event.extendedProps.type === 'boardTask') {
        //         const params = {
        //             start_date: moment(info.event.start).format("YYYY-MM-DD"),
        //             end_date: moment(info.event.end).format("YYYY-MM-DD"),
        //             start_time: moment(info.event.start).format("HH:mm"),
        //             end_time: moment(info.event.end).format("HH:mm"),
        //         }
        //         const response = await updateBoardResourceById(params, Number(info.event.extendedProps.id));
        //         const newList = events.map((item) => {
        //             if (item.extendedProps.type === info.event.extendedProps.type && item.extendedProps.id === Number(info.event.extendedProps.id)) {
        //                 return {
        //                     ...item,
        //                     extendedProps: {id: response.id, type: 'boardResource',},
        //                     start: response.start_date + ' ' + response.start_time,
        //                     end: response.end_date + ' ' + response.end_time
        //                 }
        //             } else {
        //                 return {
        //                     ...item
        //                 }
        //             }
        //         });
        //         setEvents(newList)
        //     } else if (info.event.extendedProps.type === 'boardCustom') {
        //         const params = {
        //             start_date: moment(info.event.start).format("YYYY-MM-DD"),
        //             end_date: moment(info.event.end).format("YYYY-MM-DD"),
        //             start_time: moment(info.event.start).format("HH:mm"),
        //             end_time: moment(info.event.end).format("HH:mm"),
        //         }
        //         const response = await updateBoardCustomById(params, Number(info.event.extendedProps.id));
        //         const newList = events.map((item) => {
        //             if (item.extendedProps.type === info.event.extendedProps.type && item.extendedProps.id === Number(info.event.extendedProps.id)) {
        //                 return {
        //                     ...item,
        //                     extendedProps: {id: response.id, type: 'boardCustom',},
        //                     start: response.start_date + ' ' + response.start_time,
        //                     end: response.end_date + ' ' + response.end_time
        //                 }
        //             } else {
        //                 return {
        //                     ...item
        //                 }
        //             }
        //         });
        //         setEvents(newList)
        //     }
        //     Toastify({
        //         node: dom("#success-updated-content")
        //             .clone()
        //             .removeClass("hidden")[0],
        //         duration: 3000,
        //         newWindow: true,
        //         close: true,
        //         gravity: "top",
        //         position: "right",
        //         stopOnFocus: true,
        //     }).showToast();
        // } catch (err) {
        //     setError(err)
        //     Toastify({
        //         node: dom("#failed-notification-content")
        //             .clone()
        //             .removeClass("hidden")[0],
        //         duration: 3000,
        //         newWindow: true,
        //         close: true,
        //         gravity: "top",
        //         position: "right",
        //         stopOnFocus: true,
        //     }).showToast();
        //     info.revert();
        // }
    }

    const options = {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        droppable: true,
        headerToolbar: {
            left: "prev,next today myCustomButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        initialDate: new Date(),
        navLinks: true,
        editable: true,
        dayMaxEvents: true,
        eventTimeFormat: { // like '14:30'
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        eventDrop: async function (info) {
            await updateEvent(info)
        },
        eventResize: async function (info) {
            await updateEvent(info)
        },
        eventClick: async function (info) {
            // if (info.event.extendedProps.type === 'boardResource') {
            //     setEditModalPreview(true)
            //     try {
            //         setIsLoadingEditModal(true)
            //         const res = await getBoardResourceById(info.event.extendedProps.id)
            //         setBoardResource(prevState => {
            //             return {
            //                 ...prevState,
            //                 startDate: res.start_date,
            //                 endDate: res.end_date,
            //                 startTime: res.start_time,
            //                 endTime: res.end_time,
            //                 description: res.description,
            //                 resource: {
            //                     name: res.resource.name ? res.resource.name : res.resource.manufacturer
            //                 },
            //                 resource_id: res.id
            //             }
            //         })
            //         setIsLoadingEditModal(false)
            //     } catch (err) {
            //         setError(err)
            //         setIsLoadingEditModal(false)
            //         setEditModalPreview(false)
            //     }
            //
            // } else if (info.event.extendedProps.type === 'boardTask') {
            //     setEditModalPreview(true)
            //     try {
            //         setIsLoadingEditModal(true)
            //         const res = await getBoardTaskById(info.event.extendedProps.id)
            //         setBoardTask(prevState => {
            //             return {
            //                 ...prevState,
            //                 startDate: res.start_date,
            //                 endDate: res.end_date,
            //                 startTime: res.start_time,
            //                 endTime: res.end_time,
            //                 description: res.description,
            //                 assignee_profile: {
            //                     name: res.assignee_profile.display_name
            //                 },
            //             }
            //         })
            //         setIsLoadingEditModal(false)
            //     } catch (err) {
            //         setError(err)
            //         setIsLoadingEditModal(false)
            //         setEditModalPreview(false)
            //     }
            // } else if (info.event.extendedProps.type === 'boardLeave') {
            //     setEditModalPreview(true)
            //     try {
            //         setIsLoadingEditModal(true)
            //         const res = await getBoardLeaveById(info.event.extendedProps.id)
            //         setBoardLeave(prevState => {
            //             return {
            //                 ...prevState,
            //                 startDate: res.start_date,
            //                 endDate: res.end_date,
            //                 startTime: res.start_time,
            //                 endTime: res.end_time,
            //                 user_profile: {
            //                     name: res.user_profile.display_name
            //                 },
            //             }
            //         })
            //         setIsLoadingEditModal(false)
            //     } catch (err) {
            //         setError(err)
            //         setIsLoadingEditModal(false)
            //         setEditModalPreview(false)
            //     }
            // } else if (info.event.extendedProps.type === 'boardCustom') {
            //     setEditModalPreview(true)
            //     try {
            //         setIsLoadingEditModal(true)
            //         const res = await getBoardCustomById(info.event.extendedProps.id)
            //         setBoardCustom(prevState => {
            //             return {
            //                 ...prevState,
            //                 startDate: res.start_date,
            //                 endDate: res.end_date,
            //                 startTime: res.start_time,
            //                 endTime: res.end_time,
            //                 type: res.type,
            //                 description: res.description,
            //                 employees: res.employees.map((x) => {
            //                     return {
            //                         value: x.id,
            //                         label: x.display_name
            //                     }
            //                 })
            //             }
            //         })
            //         setIsLoadingEditModal(false)
            //     } catch (err) {
            //         setError(err)
            //         setIsLoadingEditModal(false)
            //         setEditModalPreview(false)
            //     }
            // }
            setEventId(info.event.extendedProps.id)
            setEventType(info.event.extendedProps.type)
        },
        events: events,
        drop: function (info) {
            if (
                dom("#checkbox-events").length &&
                dom("#checkbox-events")[0].checked
            ) {
                dom(info.draggedEl).parent().remove();

                if (dom("#calendar-functions-events").children().length == 1) {
                    dom("#calendar-functions-no-events").removeClass("hidden");
                }
            }
        },
        customButtons: {
            myCustomButton: {
                text: 'Add new event!',
                click: function () {
                    onAddEvent()
                }
            }
        },
    };

    const onUpdate = useCallback(async (event) => {
        event.preventDefault()
        // try {
        //     if (eventType === 'boardResource') {
        //         const params = {
        //             start_date: moment(boardResource.startDate).format("YYYY-MM-DD"),
        //             end_date: moment(boardResource.endDate).format("YYYY-MM-DD"),
        //             start_time: boardResource.startTime,
        //             end_time: boardResource.endTime,
        //             description: boardResource.description
        //         }
        //         const response = await updateBoardResourceById(params, Number(boardResource.resource_id));
        //         const newList = events.map((item) => {
        //             if (item.extendedProps.type === 'boardResource' && item.extendedProps.id === Number(boardResource.resource_id)) {
        //                 return {
        //                     ...item,
        //                     extendedProps: {id: response.id, type: 'boardResource',},
        //                     start: response.start_date + ' ' + response.start_time,
        //                     end: response.end_date + ' ' + response.end_time
        //                 }
        //             } else {
        //                 return {
        //                     ...item
        //                 }
        //             }
        //         });
        //         setEvents(newList)
        //     } else if (eventType === 'boardTask') {
        //         const params = {
        //             start_date: moment(boardTask.startDate).format("YYYY-MM-DD"),
        //             end_date: moment(boardTask.endDate).format("YYYY-MM-DD"),
        //             start_time: boardTask.startTime,
        //             end_time: boardTask.endTime,
        //             description: boardTask.description
        //         }
        //         const response = await updateBoardTaskById(params, Number(eventId));
        //         const newList = events.map((item) => {
        //             if (item.extendedProps.type === 'boardTask' && item.extendedProps.id === Number(eventId)) {
        //                 return {
        //                     ...item,
        //                     extendedProps: {id: response.id, type: 'boardTask',},
        //                     start: response.start_date + ' ' + response.start_time,
        //                     end: response.end_date + ' ' + response.end_time
        //                 }
        //             } else {
        //                 return {
        //                     ...item
        //                 }
        //             }
        //         });
        //         setEvents(newList)
        //     } else if (eventType === 'boardLeave') {
        //         const params = {
        //             start_date: moment(boardLeave.startDate).format("YYYY-MM-DD"),
        //             end_date: moment(boardLeave.endDate).format("YYYY-MM-DD"),
        //             start_time: boardLeave.startTime,
        //             end_time: boardLeave.endTime,
        //         }
        //         const response = await updateBoardLeaveById(params, Number(eventId));
        //         const newList = events.map((item) => {
        //             if (item.extendedProps.type === 'boardLeave' && item.extendedProps.id === Number(eventId)) {
        //                 return {
        //                     ...item,
        //                     extendedProps: {id: response.id, type: 'boardLeave',},
        //                     start: response.start_date + ' ' + response.start_time,
        //                     end: response.end_date + ' ' + response.end_time
        //                 }
        //             } else {
        //                 return {
        //                     ...item
        //                 }
        //             }
        //         });
        //         setEvents(newList)
        //     } else if (eventType === 'boardCustom') {
        //         const params = {
        //             start_date: moment(boardCustom.startDate).format("YYYY-MM-DD"),
        //             end_date: moment(boardCustom.endDate).format("YYYY-MM-DD"),
        //             start_time: boardCustom.startTime,
        //             end_time: boardCustom.endTime,
        //             description: boardCustom.description,
        //             type: boardCustom.type,
        //             employees: boardCustom.employees.map(x => x.value)
        //         }
        //         const response = await updateBoardCustomById(params, Number(eventId));
        //         const newList = events.map((item) => {
        //             if (item.extendedProps.type === 'boardCustom' && item.extendedProps.id === Number(eventId)) {
        //                 return {
        //                     ...item,
        //                     title: response.type + ' ' + `(${response.employees.map(employee => employee.length > 1 ? `${employee.display_name},` : `${employee.display_name}`)})`,
        //                     extendedProps: {id: response.id, type: 'boardCustom',},
        //                     start: response.start_date + ' ' + response.start_time,
        //                     end: response.end_date + ' ' + response.end_time
        //                 }
        //             } else {
        //                 return {
        //                     ...item
        //                 }
        //             }
        //         });
        //         setEvents(newList)
        //     }
        // } catch (err) {
        //     setError(err)
        // }
        setEditModalPreview(false)
    }, [boardResource, boardTask, boardLeave, boardCustom])
    return (
        <>
            {
                isLoading ? (
                    <div
                        className="col-span-6 sm:col-span-3 xl:col-span-2 grid h-screen place-items-center">
                        <LoadingIcon icon="puff" className="w-14 h-14"/>
                    </div>
                ) : (
                    <div>
                        <PreviewComponent className="intro-y">
                            <Preview>
                                <Modal
                                    show={addNewEventModalPreview}
                                    onHidden={() => {
                                        setAddNewEventModalPreview(false);
                                    }}
                                    size={'modal-xl'}
                                >
                                    <form className="validate-form" onSubmit={onSubmit}>
                                        <ModalHeader>
                                            <h2 className="font-medium text-base mr-auto">
                                                Add new event
                                            </h2>
                                        </ModalHeader>
                                        <ModalBody className="grid grid-cols-1">
                                            {
                                                isLoadingModal ? (
                                                    <div className="col-span-12">
                                                        <div>
                                                            <div
                                                                className={'col-span-12 mt-5 flex w-full ml-auto mr-auto'}>
                                                                <TabList
                                                                    className="nav-boxed-tabs items-center grid grid-cols-3 gap-4 flex  justify-around text-center">
                                                                    <Skeleton width={200}/>
                                                                    <Skeleton width={200}/>
                                                                    <Skeleton width={200}/>
                                                                </TabList>
                                                            </div>
                                                            <div className="mt-5">
                                                                <div
                                                                    selectedIndex={activeEmployeeEntryType}>
                                                                    <div
                                                                        className="nav-link-tabs grid grid-cols-2 gap-4 flex capitalize justify-around text-center">
                                                                        <div>
                                                                            <div
                                                                                className="flex items-center ml-auto mr-auto ">
                                                                                <div
                                                                                    className={' flex ml-auto mr-auto'}>
                                                                                    <Skeleton width={40}/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div
                                                                                className="flex items-center ml-auto mr-auto ">
                                                                                <div
                                                                                    className={' flex ml-auto mr-auto'}>
                                                                                    <Skeleton width={40}/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-span-12 mt-4">
                                                                        <div className="col-span-12">
                                                                            <label className="form-label">
                                                                                <Skeleton width={60}/>
                                                                            </label>
                                                                            <Skeleton count={1}/>
                                                                        </div>
                                                                        <div className="col-span-12">
                                                                            <label className="form-label">
                                                                                <Skeleton width={60}/>
                                                                            </label>
                                                                            <Skeleton count={1}/>
                                                                        </div>
                                                                        <div className="col-span-12">
                                                                            <label className="form-label">
                                                                                <Skeleton width={60}/>
                                                                            </label>
                                                                            <Skeleton count={1}/>
                                                                        </div>
                                                                        <div className="col-span-12">
                                                                            <label className="form-label">
                                                                                <Skeleton width={60}/>
                                                                            </label>
                                                                            <Skeleton count={1}/>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="col-span-12">
                                                        <TabGroup>
                                                            <div className={'col-span-12 flex w-full ml-auto mr-auto'}>
                                                                <TabList
                                                                    className="nav-boxed-tabs grid grid-cols-3 gap-4 flex  justify-around text-center">
                                                                    {categoryEntries.map((categoryEntry, index) =>
                                                                        (
                                                                            <div className="intro-y" key={index}
                                                                                 id={index}
                                                                                 onClick={(event) => handleResource(event, index)}>
                                                                                <div
                                                                                    className={activeState === index ? 'box p-3 zoom-in activeState' : 'box p-3 zoom-in'}>
                                                                                    <div className="flex">
                                                                                        {index === 0 ? (
                                                                                            <Lucide icon="User"
                                                                                                    className=" ml-auto justify-center "/>) : index === 1 ? (
                                                                                            <Lucide icon="Settings"
                                                                                                    className=" ml-auto justify-center "/>) : index === 2 ? (
                                                                                            <Lucide icon="Archive"
                                                                                                    className=" ml-auto justify-center "/>) : (
                                                                                            <Lucide icon="Paperclip"
                                                                                                    className=" ml-auto justify-center "/>
                                                                                        )}
                                                                                        <div
                                                                                            className="text-lg font-medium capitalize mr-auto ml-3">
                                                                                            {categoryEntry.type}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </TabList>
                                                            </div>
                                                            <TabPanels className="mt-5">
                                                                {activeState === 0 && <div className="leading-relaxed">
                                                                    {
                                                                        isLoadingModalEmployee ? (
                                                                            <div className="col-span-12">
                                                                                <div>
                                                                                    <div className="mt-5">
                                                                                        <div
                                                                                            selectedIndex={activeEmployeeEntryType}>
                                                                                            <div
                                                                                                className="nav-link-tabs grid grid-cols-2 gap-4 flex capitalize justify-around text-center">
                                                                                                <div>
                                                                                                    <div
                                                                                                        className="flex items-center ml-auto mr-auto ">
                                                                                                        <div
                                                                                                            className={' flex ml-auto mr-auto'}>
                                                                                                            <Skeleton
                                                                                                                width={80}/>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <div
                                                                                                        className="flex items-center ml-auto mr-auto ">
                                                                                                        <div
                                                                                                            className={' flex ml-auto mr-auto'}>
                                                                                                            <Skeleton
                                                                                                                width={80}/>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div
                                                                                                className="col-span-12 mt-4">
                                                                                                <div
                                                                                                    className="col-span-12">
                                                                                                    <label
                                                                                                        className="form-label">
                                                                                                        <Skeleton
                                                                                                            width={60}/>
                                                                                                    </label>
                                                                                                    <Skeleton
                                                                                                        count={1}/>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="col-span-12">
                                                                                                    <label
                                                                                                        className="form-label">
                                                                                                        <Skeleton
                                                                                                            width={60}/>
                                                                                                    </label>
                                                                                                    <Skeleton
                                                                                                        count={1}/>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="col-span-12">
                                                                                                    <label
                                                                                                        className="form-label">
                                                                                                        <Skeleton
                                                                                                            width={60}/>
                                                                                                    </label>
                                                                                                    <Skeleton
                                                                                                        count={1}/>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="col-span-12">
                                                                                                    <label
                                                                                                        className="form-label">
                                                                                                        <Skeleton
                                                                                                            width={60}/>
                                                                                                    </label>
                                                                                                    <Skeleton
                                                                                                        count={1}/>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <TabGroup
                                                                                selectedIndex={activeEmployeeEntryType}>
                                                                                <TabList
                                                                                    className="nav-link-tabs grid grid-cols-2 gap-4 flex capitalize justify-around text-center">
                                                                                    {employeeEntryTypes.map((employeeEntryType, index) => (
                                                                                        <div className="cursor-pointer"
                                                                                             key={index}
                                                                                             id={index}
                                                                                             onClick={(event) => handleEmployeeEntryTypes(event, employeeEntryType.id)}>
                                                                                            <Tab

                                                                                                fullWidth={false}
                                                                                                className="flex items-center ml-auto mr-auto "
                                                                                            >
                                                                                                <div
                                                                                                    className={' flex ml-auto mr-auto'}>
                                                                                                    <Lucide
                                                                                                        icon="LayoutDashboard"
                                                                                                        className="cursor-pointer  w-4 h-4 mr-2"/>
                                                                                                    <div>{employeeEntryType.type}</div>
                                                                                                </div>
                                                                                            </Tab>
                                                                                        </div>
                                                                                    ))}
                                                                                </TabList>
                                                                                <div className="col-span-12">
                                                                                    <div className="col-span-12">
                                                                                        <label htmlFor="modal-form-8"
                                                                                               className="form-label">
                                                                                            Employee
                                                                                        </label>
                                                                                        <Select
                                                                                            options={optionsEmployees}
                                                                                            components={animatedComponents}
                                                                                            onChange={handleChange}
                                                                                            onInputChange={handleInputChange}
                                                                                            isLoading={loadingSearch}
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
                                                                                    <div
                                                                                        className="col-span-12 sm:col-span-6">
                                                                                        <label htmlFor="modal-form-1"
                                                                                               className="form-label">
                                                                                            Date From
                                                                                        </label>
                                                                                        <Litepicker
                                                                                            value={boardLeave.startDate}
                                                                                            onChange={(e) => setBoardLeave(prevState => {
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
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-span-12 sm:col-span-6">
                                                                                        <label htmlFor="modal-form-2"
                                                                                               className="form-label">
                                                                                            Date To
                                                                                        </label>
                                                                                        <Litepicker
                                                                                            value={boardLeave.endDate}
                                                                                            onChange={(e) => setBoardLeave(prevState => {
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
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-span-12 sm:col-span-6">
                                                                                        <label htmlFor="modal-form-3"
                                                                                               className="form-label">
                                                                                            Hour From
                                                                                        </label>
                                                                                        <input
                                                                                            value={boardLeave.startTime}
                                                                                            id="validation-form-3"
                                                                                            type="time"
                                                                                            name="hourFrom"
                                                                                            onInput={(e) => setBoardLeave(prevState => {
                                                                                                return {
                                                                                                    ...prevState,
                                                                                                    startTime: e.target['value']
                                                                                                }
                                                                                            })}
                                                                                            className={classnames({
                                                                                                "form-control": true,
                                                                                                "border-danger": errors.hourFrom,
                                                                                            })}
                                                                                            placeholder="Hour from"
                                                                                        />
                                                                                        {errors.hourFrom && (
                                                                                            <div
                                                                                                className="text-danger mt-2">
                                                                                                {errors.hourFrom.message}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-span-12 sm:col-span-6">
                                                                                        <label htmlFor="modal-form-4"
                                                                                               className="form-label">
                                                                                            Hour to
                                                                                        </label>
                                                                                        <input
                                                                                            value={boardLeave.endTime}
                                                                                            id="validation-form-4"
                                                                                            type="time"
                                                                                            name="hourTo"
                                                                                            onInput={(e) => setBoardLeave(prevState => {
                                                                                                return {
                                                                                                    ...prevState,
                                                                                                    endTime: e.target['value']
                                                                                                }
                                                                                            })}
                                                                                            className={classnames({
                                                                                                "form-control": true,
                                                                                                "border-danger": errors.hourTo,
                                                                                            })}
                                                                                            placeholder="Hour to"
                                                                                        />
                                                                                        {errors.hourTo && (
                                                                                            <div
                                                                                                className="text-danger mt-2">
                                                                                                {errors.hourTo.message}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </TabGroup>
                                                                        )}
                                                                </div>}
                                                                {activeState === 1 && <div className="leading-relaxed">
                                                                    {
                                                                        isLoadingModalResource ? (
                                                                            <div className="col-span-12 mt-4">
                                                                                <div className="col-span-12">
                                                                                    <label className="form-label">
                                                                                        <Skeleton width={60}/>
                                                                                    </label>
                                                                                    <Skeleton count={1}/>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                <div className="col-span-12">
                                                                                    <div className="col-span-12">
                                                                                        <label htmlFor="modal-form-8"
                                                                                               className="form-label">
                                                                                            Resource
                                                                                        </label>
                                                                                        <Select
                                                                                            options={optionsResource}
                                                                                            components={animatedComponents}
                                                                                            onChange={handleChangeResources}
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
                                                                                            placeholder={'Select for resource'}
                                                                                            noOptionsMessage={noOptionsMessage}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                {
                                                                                    selectedResource ? (
                                                                                        isLoadingModalResourceContent ? (
                                                                                            <div className="mt-5">
                                                                                                <div
                                                                                                    selectedIndex={activeEmployeeEntryType}>
                                                                                                    <div
                                                                                                        className="nav-link-tabs grid grid-cols-2 gap-4 flex capitalize justify-around text-center">
                                                                                                        <div>
                                                                                                            <div
                                                                                                                className="flex items-center ml-auto mr-auto ">
                                                                                                                <div
                                                                                                                    className={' flex ml-auto mr-auto'}>
                                                                                                                    <Skeleton
                                                                                                                        width={80}/>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <div
                                                                                                                className="flex items-center ml-auto mr-auto ">
                                                                                                                <div
                                                                                                                    className={' flex ml-auto mr-auto'}>
                                                                                                                    <Skeleton
                                                                                                                        width={80}/>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="col-span-12 mt-4">
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <TabGroup
                                                                                                selectedIndex={activeResourceEntryType}>
                                                                                                <TabList
                                                                                                    className="nav-link-tabs grid grid-cols-2 gap-4 flex capitalize justify-around text-center">
                                                                                                    {resourceEntryTypes.map((resourceEntryType, index) => (
                                                                                                        <div
                                                                                                            className="cursor-pointer"
                                                                                                            key={index}
                                                                                                            id={index}
                                                                                                            onClick={(event) => handleResourceEntryTypes(event, resourceEntryType.id)}>
                                                                                                            <Tab

                                                                                                                fullWidth={false}
                                                                                                                className="flex items-center ml-auto mr-auto "
                                                                                                            >
                                                                                                                <div
                                                                                                                    className={' flex ml-auto mr-auto'}>
                                                                                                                    <Lucide
                                                                                                                        icon="LayoutDashboard"
                                                                                                                        className="cursor-pointer  w-4 h-4 mr-2"/>
                                                                                                                    <div>{resourceEntryType.type}</div>
                                                                                                                </div>
                                                                                                            </Tab>
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </TabList>
                                                                                                <div
                                                                                                    className="col-span-12">
                                                                                                    <div
                                                                                                        className="col-span-12">
                                                                                                        <label
                                                                                                            htmlFor="modal-form-8"
                                                                                                            className="form-label">
                                                                                                            Projects
                                                                                                        </label>
                                                                                                        <Select
                                                                                                            options={optionsProject}
                                                                                                            components={animatedComponents}
                                                                                                            onChange={handleChangeProject}
                                                                                                            onInputChange={handleInputProjectChange}
                                                                                                            isLoading={loadingSearch}
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
                                                                                                            placeholder={'Search for project'}
                                                                                                            noOptionsMessage={noOptionsMessage}
                                                                                                        />
                                                                                                    </div>
                                                                                                    {
                                                                                                        selectedResource === 1 ? (
                                                                                                            <div
                                                                                                                className="col-span-12">
                                                                                                                <label
                                                                                                                    htmlFor="modal-form-8"
                                                                                                                    className="form-label">
                                                                                                                    Vehicles
                                                                                                                </label>
                                                                                                                <Select
                                                                                                                    options={optionsVehicles}
                                                                                                                    components={animatedComponents}
                                                                                                                    onChange={handleChangeVehicle}
                                                                                                                    onInputChange={handleInputVehiclesChange}
                                                                                                                    isLoading={loadingSearch}
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
                                                                                                                    placeholder={'Search for vehicle'}
                                                                                                                    noOptionsMessage={noOptionsMessage}
                                                                                                                />
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <div
                                                                                                                className="col-span-12">
                                                                                                                <label
                                                                                                                    htmlFor="modal-form-8"
                                                                                                                    className="form-label">
                                                                                                                    Tools
                                                                                                                </label>
                                                                                                                <Select
                                                                                                                    options={optionsTools}
                                                                                                                    components={animatedComponents}
                                                                                                                    onChange={handleChangeTool}
                                                                                                                    onInputChange={handleInputToolsChange}
                                                                                                                    isLoading={loadingSearch}
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
                                                                                                                    placeholder={'Search for tools'}
                                                                                                                    noOptionsMessage={noOptionsMessage}
                                                                                                                />
                                                                                                            </div>
                                                                                                        )
                                                                                                    }
                                                                                                    <div
                                                                                                        className="col-span-12 sm:col-span-6">
                                                                                                        <label
                                                                                                            htmlFor="modal-form-1"
                                                                                                            className="form-label">
                                                                                                            Date From
                                                                                                        </label>
                                                                                                        <Litepicker
                                                                                                            value={boardResource.startDate}
                                                                                                            onChange={(e) => setBoardResource(prevState => {
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
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="col-span-12 sm:col-span-6">
                                                                                                        <label
                                                                                                            htmlFor="modal-form-2"
                                                                                                            className="form-label">
                                                                                                            Date To
                                                                                                        </label>
                                                                                                        <Litepicker
                                                                                                            value={boardResource.endDate}
                                                                                                            onChange={(e) => setBoardResource(prevState => {
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
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="col-span-12 sm:col-span-6">
                                                                                                        <label
                                                                                                            htmlFor="modal-form-3"
                                                                                                            className="form-label">
                                                                                                            Hour From
                                                                                                        </label>
                                                                                                        <input
                                                                                                            {...register("hourFrom")}
                                                                                                            id="validation-form-3"
                                                                                                            type="time"
                                                                                                            name="hourFrom"
                                                                                                            onInput={(e) => setBoardResource(prevState => {
                                                                                                                return {
                                                                                                                    ...prevState,
                                                                                                                    startTime: e.target['value']
                                                                                                                }
                                                                                                            })}
                                                                                                            className={classnames({
                                                                                                                "form-control": true,
                                                                                                                "border-danger": errors.hourFrom,
                                                                                                            })}
                                                                                                            placeholder="Hour from"
                                                                                                        />
                                                                                                        {errors.hourFrom && (
                                                                                                            <div
                                                                                                                className="text-danger mt-2">
                                                                                                                {errors.hourFrom.message}
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="col-span-12 sm:col-span-6">
                                                                                                        <label
                                                                                                            htmlFor="modal-form-4"
                                                                                                            className="form-label">
                                                                                                            Hour to
                                                                                                        </label>
                                                                                                        <input
                                                                                                            value={boardResource.endTime}
                                                                                                            id="validation-form-4"
                                                                                                            type="time"
                                                                                                            name="hourTo"
                                                                                                            onInput={(e) => setBoardResource(prevState => {
                                                                                                                return {
                                                                                                                    ...prevState,
                                                                                                                    endTime: e.target['value']
                                                                                                                }
                                                                                                            })}
                                                                                                            className={classnames({
                                                                                                                "form-control": true,
                                                                                                                "border-danger": errors.hourTo,
                                                                                                            })}
                                                                                                            placeholder="Hour to"
                                                                                                        />
                                                                                                        {errors.hourTo && (
                                                                                                            <div
                                                                                                                className="text-danger mt-2">
                                                                                                                {errors.hourTo.message}
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="col-span-12 sm:col-span-6">
                                                                                                        <label
                                                                                                            htmlFor="modal-form-4"
                                                                                                            className="form-label">
                                                                                                            Description
                                                                                                        </label>
                                                                                                        <input
                                                                                                            value={boardResource.description}
                                                                                                            id="validation-form-4"
                                                                                                            type="text"
                                                                                                            name="description"
                                                                                                            onInput={(e) => setBoardResource(prevState => {
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
                                                                                                            <div
                                                                                                                className="text-danger mt-2">
                                                                                                                {errors.description.message}
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </TabGroup>

                                                                                        )
                                                                                    ) : ('')
                                                                                }
                                                                            </div>
                                                                        )}
                                                                </div>}
                                                                {activeState === 2 && <div className="leading-relaxed">
                                                                    {
                                                                        isLoadingModalProject ? (
                                                                            <div className="col-span-12 mt-4">
                                                                                <div className="col-span-12">
                                                                                    <label className="form-label">
                                                                                        <Skeleton width={60}/>
                                                                                    </label>
                                                                                    <Skeleton count={1}/>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                <div className="col-span-12">
                                                                                    <div className="col-span-12">
                                                                                        <label htmlFor="modal-form-8"
                                                                                               className="form-label">
                                                                                            Projects
                                                                                        </label>
                                                                                        <Select
                                                                                            options={optionsProject}
                                                                                            components={animatedComponents}
                                                                                            onChange={handleChangeProjects}
                                                                                            onInputChange={handleInputProjectChange}
                                                                                            isLoading={loadingSearch}
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
                                                                                            placeholder={'Search for project'}
                                                                                            noOptionsMessage={noOptionsMessage}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                {
                                                                                    selectedProject ? (
                                                                                        isLoadingModalProjectTasks ? (
                                                                                            <div className="mt-5">
                                                                                                <div>
                                                                                                    <div
                                                                                                        className="col-span-12 mt-4">
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="col-span-12">
                                                                                                            <label
                                                                                                                className="form-label">
                                                                                                                <Skeleton
                                                                                                                    width={60}/>
                                                                                                            </label>
                                                                                                            <Skeleton
                                                                                                                count={1}/>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div
                                                                                                className="col-span-12">
                                                                                                <div
                                                                                                    className="col-span-12">
                                                                                                    <label
                                                                                                        htmlFor="modal-form-8"
                                                                                                        className="form-label">
                                                                                                        Employee
                                                                                                    </label>
                                                                                                    <Select
                                                                                                        options={optionsEmployees}
                                                                                                        components={animatedComponents}
                                                                                                        onChange={handleChange}
                                                                                                        onInputChange={handleInputChange}
                                                                                                        isLoading={loadingSearch}
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
                                                                                                {/*<div*/}
                                                                                                {/*    className="col-span-12">*/}
                                                                                                {/*    <label*/}
                                                                                                {/*        htmlFor="modal-form-8"*/}
                                                                                                {/*        className="form-label">*/}
                                                                                                {/*        Tasks*/}
                                                                                                {/*    </label>*/}
                                                                                                {/*    <Select*/}
                                                                                                {/*        options={optionsProjectTasks}*/}
                                                                                                {/*        components={animatedComponents}*/}
                                                                                                {/*        onChange={handleChangeProjectTasks}*/}
                                                                                                {/*        onInputChange={handleInputProjectTasksChange}*/}
                                                                                                {/*        isLoading={loadingSearch}*/}
                                                                                                {/*        styles={style}*/}
                                                                                                {/*        theme={(theme) => ({*/}
                                                                                                {/*            ...theme,*/}
                                                                                                {/*            colors: {*/}
                                                                                                {/*                ...theme.colors,*/}
                                                                                                {/*                primary25: '#E2E8F0',*/}
                                                                                                {/*                primary: '#e2e8f0',*/}
                                                                                                {/*            },*/}
                                                                                                {/*        })}*/}
                                                                                                {/*        filterOption={null}*/}
                                                                                                {/*        placeholder={'Search for tasks'}*/}
                                                                                                {/*        noOptionsMessage={noOptionsMessage}*/}
                                                                                                {/*    />*/}
                                                                                                {/*</div>*/}
                                                                                                <div
                                                                                                    className="col-span-12 sm:col-span-6">
                                                                                                    <label
                                                                                                        htmlFor="modal-form-4"
                                                                                                        className="form-label">
                                                                                                        Description
                                                                                                    </label>
                                                                                                    <input
                                                                                                        {...register("description")}
                                                                                                        id="validation-form-4"
                                                                                                        type="text"
                                                                                                        name="description"
                                                                                                        onInput={(e) => setBoardTask(prevState => {
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
                                                                                                        <div
                                                                                                            className="text-danger mt-2">
                                                                                                            {errors.description.message}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div
                                                                                                    className="col-span-12 sm:col-span-6">
                                                                                                    <label
                                                                                                        htmlFor="modal-form-1"
                                                                                                        className="form-label">
                                                                                                        Date From
                                                                                                    </label>
                                                                                                    <Litepicker
                                                                                                        value={boardTask.startDate}
                                                                                                        onChange={(e) => setBoardTask(prevState => {
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
                                                                                                </div>
                                                                                                <div
                                                                                                    className="col-span-12 sm:col-span-6">
                                                                                                    <label
                                                                                                        htmlFor="modal-form-2"
                                                                                                        className="form-label">
                                                                                                        Date To
                                                                                                    </label>
                                                                                                    <Litepicker
                                                                                                        value={boardTask.startDate}
                                                                                                        onChange={(e) => setBoardTask(prevState => {
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
                                                                                                </div>
                                                                                                <div
                                                                                                    className="col-span-12 sm:col-span-6">
                                                                                                    <label
                                                                                                        htmlFor="modal-form-3"
                                                                                                        className="form-label">
                                                                                                        Hour From
                                                                                                    </label>
                                                                                                    <input
                                                                                                        value={boardTask.startTime}
                                                                                                        id="validation-form-3"
                                                                                                        type="time"
                                                                                                        name="hourFrom"
                                                                                                        onInput={(e) => setBoardTask(prevState => {
                                                                                                            return {
                                                                                                                ...prevState,
                                                                                                                startTime: e.target['value']
                                                                                                            }
                                                                                                        })}
                                                                                                        className={classnames({
                                                                                                            "form-control": true,
                                                                                                            "border-danger": errors.hourFrom,
                                                                                                        })}
                                                                                                        placeholder="Hour from"
                                                                                                    />
                                                                                                    {errors.hourFrom && (
                                                                                                        <div
                                                                                                            className="text-danger mt-2">
                                                                                                            {errors.hourFrom.message}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div
                                                                                                    className="col-span-12 sm:col-span-6">
                                                                                                    <label
                                                                                                        htmlFor="modal-form-4"
                                                                                                        className="form-label">
                                                                                                        Hour to
                                                                                                    </label>
                                                                                                    <input
                                                                                                        value={boardTask.endTime}
                                                                                                        id="validation-form-4"
                                                                                                        type="time"
                                                                                                        name="hourTo"
                                                                                                        onInput={(e) => setBoardTask(prevState => {
                                                                                                            return {
                                                                                                                ...prevState,
                                                                                                                endTime: e.target['value']
                                                                                                            }
                                                                                                        })}
                                                                                                        className={classnames({
                                                                                                            "form-control": true,
                                                                                                            "border-danger": errors.hourTo,
                                                                                                        })}
                                                                                                        placeholder="Hour to"
                                                                                                    />
                                                                                                    {errors.hourTo && (
                                                                                                        <div
                                                                                                            className="text-danger mt-2">
                                                                                                            {errors.hourTo.message}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>

                                                                                            </div>
                                                                                        )
                                                                                    ) : ('')
                                                                                }
                                                                            </div>

                                                                        )}
                                                                </div>}
                                                                {activeState === 3 && <div className="leading-relaxed">
                                                                    {
                                                                        isLoadingModalCustom ? (
                                                                            <div className="mt-5">
                                                                                <div>
                                                                                    <div className="col-span-12 mt-4">
                                                                                        <div className="col-span-12">
                                                                                            <label
                                                                                                className="form-label">
                                                                                                <Skeleton width={60}/>
                                                                                            </label>
                                                                                            <Skeleton count={1}/>
                                                                                        </div>
                                                                                        <div className="col-span-12">
                                                                                            <label
                                                                                                className="form-label">
                                                                                                <Skeleton width={60}/>
                                                                                            </label>
                                                                                            <Skeleton count={1}/>
                                                                                        </div>
                                                                                        <div className="col-span-12">
                                                                                            <label
                                                                                                className="form-label">
                                                                                                <Skeleton width={60}/>
                                                                                            </label>
                                                                                            <Skeleton count={1}/>
                                                                                        </div>
                                                                                        <div className="col-span-12">
                                                                                            <label
                                                                                                className="form-label">
                                                                                                <Skeleton width={60}/>
                                                                                            </label>
                                                                                            <Skeleton count={1}/>
                                                                                        </div>
                                                                                        <div className="col-span-12">
                                                                                            <label
                                                                                                className="form-label">
                                                                                                <Skeleton width={60}/>
                                                                                            </label>
                                                                                            <Skeleton count={1}/>
                                                                                        </div>
                                                                                        <div className="col-span-12">
                                                                                            <label
                                                                                                className="form-label">
                                                                                                <Skeleton width={60}/>
                                                                                            </label>
                                                                                            <Skeleton count={1}/>
                                                                                        </div>
                                                                                        <div className="col-span-12">
                                                                                            <label
                                                                                                className="form-label">
                                                                                                <Skeleton width={60}/>
                                                                                            </label>
                                                                                            <Skeleton count={1}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                <div className="col-span-12">
                                                                                    <div className="col-span-12">
                                                                                        <label htmlFor="modal-form-8"
                                                                                               className="form-label">
                                                                                            Employee
                                                                                        </label>
                                                                                        <Select
                                                                                            options={optionsEmployees}
                                                                                            components={animatedComponents}
                                                                                            onChange={handleChange}
                                                                                            onInputChange={handleInputChange}
                                                                                            isLoading={loadingSearch}
                                                                                            styles={style}
                                                                                            theme={(theme) => ({
                                                                                                ...theme,
                                                                                                colors: {
                                                                                                    ...theme.colors,
                                                                                                    primary25: '#E2E8F0',
                                                                                                    primary: '#e2e8f0',
                                                                                                },
                                                                                            })}
                                                                                            isMulti
                                                                                            filterOption={null}
                                                                                            placeholder={'Search for employees'}
                                                                                            noOptionsMessage={noOptionsMessage}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-span-12">
                                                                                        <label className="form-label">
                                                                                            Type
                                                                                        </label>
                                                                                        <input
                                                                                            value={boardCustom.type}
                                                                                            type="text"
                                                                                            name="type"
                                                                                            onInput={(e) => setBoardCustom(prevState => {
                                                                                                return {
                                                                                                    ...prevState,
                                                                                                    type: e.target['value']
                                                                                                }
                                                                                            })}
                                                                                            className={classnames({
                                                                                                "form-control": true,
                                                                                                "border-danger": errors.type,
                                                                                            })}
                                                                                            placeholder="Type of event"
                                                                                        />
                                                                                        {errors.type && (
                                                                                            <div
                                                                                                className="text-danger mt-2">
                                                                                                {errors.type.message}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="col-span-12">
                                                                                        <label className="form-label">
                                                                                            Description
                                                                                        </label>
                                                                                        <input
                                                                                            value={boardCustom.description}
                                                                                            type="text"
                                                                                            name="description"
                                                                                            onInput={(e) => setBoardCustom(prevState => {
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
                                                                                            <div
                                                                                                className="text-danger mt-2">
                                                                                                {errors.description.message}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-span-12 sm:col-span-6">
                                                                                        <label htmlFor="modal-form-1"
                                                                                               className="form-label">
                                                                                            Date From
                                                                                        </label>
                                                                                        <Litepicker
                                                                                            value={boardCustom.startDate}
                                                                                            onChange={(e) => setBoardCustom(prevState => {
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
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-span-12 sm:col-span-6">
                                                                                        <label htmlFor="modal-form-2"
                                                                                               className="form-label">
                                                                                            Date To
                                                                                        </label>
                                                                                        <Litepicker
                                                                                            value={boardCustom.endDate}
                                                                                            onChange={(e) => setBoardCustom(prevState => {
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
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-span-12 sm:col-span-6">
                                                                                        <label htmlFor="modal-form-3"
                                                                                               className="form-label">
                                                                                            Hour From
                                                                                        </label>
                                                                                        <input
                                                                                            value={boardCustom.startTime}
                                                                                            id="validation-form-3"
                                                                                            type="time"
                                                                                            name="hourFrom"
                                                                                            onInput={(e) => setBoardCustom(prevState => {
                                                                                                return {
                                                                                                    ...prevState,
                                                                                                    startTime: e.target['value']
                                                                                                }
                                                                                            })}
                                                                                            className={classnames({
                                                                                                "form-control": true,
                                                                                                "border-danger": errors.hourFrom,
                                                                                            })}
                                                                                            placeholder="Hour from"
                                                                                        />
                                                                                        {errors.hourFrom && (
                                                                                            <div
                                                                                                className="text-danger mt-2">
                                                                                                {errors.hourFrom.message}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-span-12 sm:col-span-6">
                                                                                        <label htmlFor="modal-form-4"
                                                                                               className="form-label">
                                                                                            Hour to
                                                                                        </label>
                                                                                        <input
                                                                                            value={boardCustom.endTime}
                                                                                            id="validation-form-4"
                                                                                            type="time"
                                                                                            name="hourTo"
                                                                                            onInput={(e) => setBoardCustom(prevState => {
                                                                                                return {
                                                                                                    ...prevState,
                                                                                                    endTime: e.target['value']
                                                                                                }
                                                                                            })}
                                                                                            className={classnames({
                                                                                                "form-control": true,
                                                                                                "border-danger": errors.hourTo,
                                                                                            })}
                                                                                            placeholder="Hour to"
                                                                                        />
                                                                                        {errors.hourTo && (
                                                                                            <div
                                                                                                className="text-danger mt-2">
                                                                                                {errors.hourTo.message}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                </div>}
                                                            </TabPanels>
                                                        </TabGroup>
                                                    </div>
                                                )
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            {isLoadingModal ? (
                                                <div className={'inline-flex'}>
                                                    <Skeleton width={60} className={'mr-1'}/>
                                                    <Skeleton width={60} className={'mr-1'}/>
                                                </div>
                                            ) : (
                                                <div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setAddNewEventModalPreview(false);
                                                        }}
                                                        className="btn btn-outline-secondary w-20 mr-1"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="btn btn-primary w-20">
                                                        Send
                                                    </button>
                                                </div>
                                            )}

                                        </ModalFooter>
                                    </form>
                                </Modal>
                                <Modal
                                    show={editModalPreview}
                                    onHidden={() => {
                                        setEditModalPreview(false);
                                    }}
                                    size={'modal-xl'}
                                >
                                    {
                                        isLoadingEditModal ? (
                                            <div>
                                                <ModalHeader>
                                                    <h2 className="font-medium text-base mr-auto">
                                                        <Skeleton width={100}/>
                                                    </h2>
                                                    <div
                                                        className="flex items-center cursor-pointer text-danger">
                                                        <Skeleton width={50}/>
                                                    </div>
                                                </ModalHeader>
                                                <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                                    <div className="col-span-12">
                                                        <label className="form-label">
                                                            <Skeleton width={60}/>
                                                        </label>
                                                        <Skeleton count={1}/>
                                                    </div>
                                                    <div className="col-span-12">
                                                        <label className="form-label">
                                                            <Skeleton width={60}/>
                                                        </label>
                                                        <Skeleton count={1}/>
                                                    </div>
                                                    <div className="col-span-12">
                                                        <label className="form-label">
                                                            <Skeleton width={60}/>
                                                        </label>
                                                        <Skeleton count={1}/>
                                                    </div>
                                                    <div className="col-span-12">
                                                        <label className="form-label">
                                                            <Skeleton width={60}/>
                                                        </label>
                                                        <Skeleton count={1}/>
                                                    </div>
                                                    <div className="col-span-12">
                                                        <label className="form-label">
                                                            <Skeleton width={60}/>
                                                        </label>
                                                        <Skeleton count={1}/>
                                                    </div>
                                                    <div className="col-span-12">
                                                        <label className="form-label">
                                                            <Skeleton width={60}/>
                                                        </label>
                                                        <Skeleton count={1}/>
                                                    </div>
                                                    <div className="col-span-12">
                                                        <label className="form-label">
                                                            <Skeleton width={60}/>
                                                        </label>
                                                        <Skeleton count={1}/>
                                                    </div>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditModalPreview(false);
                                                        }}
                                                        className="btn btn-outline-secondary w-20 mr-1"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="btn btn-primary ">
                                                        Update
                                                    </button>
                                                </ModalFooter>
                                            </div>
                                        ) : (
                                            eventType === 'boardResource' ? (
                                                    <form className="validate-form" onSubmit={onUpdate}>
                                                        <ModalHeader>
                                                            <h2 className="font-medium text-base mr-auto">
                                                                Edit {boardResource?.resource?.name}
                                                            </h2>
                                                            <div
                                                                className="flex items-center cursor-pointer text-danger"
                                                                onClick={deleteEvent}
                                                            >
                                                                <Lucide icon="Trash2"
                                                                        className="w-4 h-4 mr-1"/> Delete
                                                            </div>
                                                        </ModalHeader>
                                                        <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                                            <div className="col-span-12">
                                                                <label className="form-label">
                                                                    Date From
                                                                </label>
                                                                <Litepicker
                                                                    value={boardResource.startDate}
                                                                    onChange={(e) => setBoardResource(prevState => {
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
                                                            </div>
                                                            <div className="col-span-12">
                                                                <label className="form-label">
                                                                    Date To
                                                                </label>
                                                                <Litepicker
                                                                    value={boardResource.endDate}
                                                                    onChange={(e) => setBoardResource(prevState => {
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
                                                            </div>
                                                            <div className="col-span-12">
                                                                <label className="form-label">
                                                                    Time From
                                                                </label>
                                                                <input
                                                                    value={boardResource.startTime}
                                                                    type="time"
                                                                    name="timeFrom"
                                                                    onInput={(e) => setBoardResource(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            startTime: e.target['value']
                                                                        }
                                                                    })}
                                                                    className={classnames({
                                                                        "form-control": true,
                                                                        "border-danger": errors.timeFrom,
                                                                    })}
                                                                    placeholder="timeFrom"
                                                                />
                                                                {errors.timeFrom && (
                                                                    <div className="text-danger mt-2">
                                                                        {errors.timeFrom.message}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-span-12">
                                                                <label className="form-label">
                                                                    Time to
                                                                </label>
                                                                <input
                                                                    value={boardResource.endTime}
                                                                    type="time"
                                                                    name="timeTo"
                                                                    onInput={(e) => setBoardResource(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            endTime: e.target['value']
                                                                        }
                                                                    })}
                                                                    className={classnames({
                                                                        "form-control": true,
                                                                        "border-danger": errors.timeTo,
                                                                    })}
                                                                    placeholder="dateFrom"
                                                                />
                                                                {errors.timeTo && (
                                                                    <div className="text-danger mt-2">
                                                                        {errors.timeTo.message}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-span-12">
                                                                <label className="form-label">
                                                                    Description
                                                                </label>
                                                                <input
                                                                    value={boardResource.description}
                                                                    type="text"
                                                                    name="description"
                                                                    onInput={(e) => setBoardResource(prevState => {
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
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditModalPreview(false);
                                                                }}
                                                                className="btn btn-outline-secondary w-20 mr-1"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button type="submit" className="btn btn-primary ">
                                                                Update
                                                            </button>
                                                        </ModalFooter>
                                                    </form>)
                                                : eventType === 'boardTask' ?
                                                    (
                                                        <form className="validate-form" onSubmit={onUpdate}>
                                                            <ModalHeader>
                                                                <h2 className="font-medium text-base mr-auto">
                                                                    Edit {boardTask.assignee_profile.name}
                                                                </h2>
                                                                <div
                                                                    className="flex items-center cursor-pointer text-danger"
                                                                    onClick={deleteEvent}
                                                                >
                                                                    <Lucide icon="Trash2"
                                                                            className="w-4 h-4 mr-1"/> Delete
                                                                </div>
                                                            </ModalHeader>
                                                            <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Date From
                                                                    </label>
                                                                    <Litepicker
                                                                        value={boardTask.startDate}
                                                                        onChange={(e) => setBoardTask(prevState => {
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
                                                                </div>
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Date To
                                                                    </label>
                                                                    <Litepicker
                                                                        value={boardTask.endDate}
                                                                        onChange={(e) => setBoardTask(prevState => {
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
                                                                </div>
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Time From
                                                                    </label>
                                                                    <input
                                                                        value={boardTask.startTime}
                                                                        type="time"
                                                                        name="timeFrom"
                                                                        onInput={(e) => setBoardTask(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                startTime: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.timeFrom,
                                                                        })}
                                                                        placeholder="timeFrom"
                                                                    />
                                                                    {errors.timeFrom && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.timeFrom.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Time to
                                                                    </label>
                                                                    <input
                                                                        value={boardTask.endTime}
                                                                        type="time"
                                                                        name="timeTo"
                                                                        onInput={(e) => setBoardTask(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                endTime: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.timeTo,
                                                                        })}
                                                                        placeholder="dateFrom"
                                                                    />
                                                                    {errors.timeTo && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.timeTo.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Description
                                                                    </label>
                                                                    <input
                                                                        value={boardTask.description}
                                                                        type="text"
                                                                        name="description"
                                                                        onInput={(e) => setBoardTask(prevState => {
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
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditModalPreview(false);
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
                                                    ) : eventType === 'boardLeave' ? (
                                                        <form className="validate-form" onSubmit={onUpdate}>
                                                            <ModalHeader>
                                                                <h2 className="font-medium text-base mr-auto">
                                                                    Edit {boardLeave.user_profile.name}
                                                                </h2>
                                                                <div
                                                                    className="flex items-center cursor-pointer text-danger"
                                                                    onClick={deleteEvent}
                                                                >
                                                                    <Lucide icon="Trash2"
                                                                            className="w-4 h-4 mr-1"/> Delete
                                                                </div>
                                                            </ModalHeader>
                                                            <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Date From
                                                                    </label>
                                                                    <Litepicker
                                                                        value={boardLeave.startDate}
                                                                        onChange={(e) => setBoardLeave(prevState => {
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
                                                                </div>
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Date To
                                                                    </label>
                                                                    <Litepicker
                                                                        value={boardLeave.endDate}
                                                                        onChange={(e) => setBoardLeave(prevState => {
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
                                                                </div>
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Time From
                                                                    </label>
                                                                    <input
                                                                        value={boardLeave.startTime}
                                                                        type="time"
                                                                        name="timeFrom"
                                                                        onInput={(e) => setBoardLeave(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                startTime: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.timeFrom,
                                                                        })}
                                                                        placeholder="timeFrom"
                                                                    />
                                                                    {errors.timeFrom && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.timeFrom.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Time to
                                                                    </label>
                                                                    <input
                                                                        value={boardLeave.endTime}
                                                                        type="time"
                                                                        name="timeTo"
                                                                        onInput={(e) => setBoardLeave(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                endTime: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.timeTo,
                                                                        })}
                                                                        placeholder="dateFrom"
                                                                    />
                                                                    {errors.timeTo && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.timeTo.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditModalPreview(false);
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
                                                    ) : (<form className="validate-form" onSubmit={onUpdate}>
                                                        <ModalHeader>
                                                            <h2 className="font-medium text-base mr-auto">
                                                                {boardCustom.type}
                                                            </h2>
                                                            <div
                                                                className="flex items-center cursor-pointer text-danger"
                                                                onClick={deleteEvent}
                                                            >
                                                                <Lucide icon="Trash2"
                                                                        className="w-4 h-4 mr-1"/> Delete
                                                            </div>
                                                        </ModalHeader>
                                                        <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                                            <div className="col-span-12">
                                                                <label className="form-label">
                                                                    Event Type
                                                                </label>
                                                                <input
                                                                    value={boardCustom.type}
                                                                    type="text"
                                                                    name="type"
                                                                    onInput={(e) => setBoardCustom(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            type: e.target['value']
                                                                        }
                                                                    })}
                                                                    className={classnames({
                                                                        "form-control": true,
                                                                        "border-danger": errors.type,
                                                                    })}
                                                                    placeholder="Type"
                                                                />
                                                                {errors.type && (
                                                                    <div className="text-danger mt-2">
                                                                        {errors.type.message}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-span-12">
                                                                <label htmlFor="modal-form-8"
                                                                       className="form-label">
                                                                    Employee
                                                                </label>
                                                                <Select
                                                                    defaultValue={boardCustom.employees}
                                                                    options={optionsEmployees}
                                                                    components={animatedComponents}
                                                                    onChange={handleEditEmployeesSelect}
                                                                    onInputChange={handleInputChange}
                                                                    isLoading={loadingSearch}
                                                                    styles={style}
                                                                    isMulti
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
                                                                <label className="form-label">
                                                                    Description
                                                                </label>
                                                                <input
                                                                    value={boardCustom.description}
                                                                    type="text"
                                                                    name="description"
                                                                    onInput={(e) => setBoardCustom(prevState => {
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
                                                                <label className="form-label">
                                                                    Date From
                                                                </label>
                                                                <Litepicker
                                                                    value={boardCustom.startDate}
                                                                    onChange={(e) => setBoardCustom(prevState => {
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
                                                            </div>
                                                            <div className="col-span-12">
                                                                <label className="form-label">
                                                                    Date To
                                                                </label>
                                                                <Litepicker
                                                                    value={boardCustom.endDate}
                                                                    onChange={(e) => setBoardCustom(prevState => {
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
                                                            </div>
                                                            <div className="col-span-12">
                                                                <label className="form-label">
                                                                    Time From
                                                                </label>
                                                                <input
                                                                    value={boardCustom.startTime}
                                                                    type="time"
                                                                    name="timeFrom"
                                                                    onInput={(e) => setBoardCustom(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            startTime: e.target['value']
                                                                        }
                                                                    })}
                                                                    className={classnames({
                                                                        "form-control": true,
                                                                        "border-danger": errors.timeFrom,
                                                                    })}
                                                                    placeholder="timeFrom"
                                                                />
                                                                {errors.timeFrom && (
                                                                    <div className="text-danger mt-2">
                                                                        {errors.timeFrom.message}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-span-12">
                                                                <label className="form-label">
                                                                    Time to
                                                                </label>
                                                                <input
                                                                    value={boardCustom.endTime}
                                                                    type="time"
                                                                    name="timeTo"
                                                                    onInput={(e) => setBoardCustom(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            endTime: e.target['value']
                                                                        }
                                                                    })}
                                                                    className={classnames({
                                                                        "form-control": true,
                                                                        "border-danger": errors.timeTo,
                                                                    })}
                                                                    placeholder="dateFrom"
                                                                />
                                                                {errors.timeTo && (
                                                                    <div className="text-danger mt-2">
                                                                        {errors.timeTo.message}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditModalPreview(false);
                                                                }}
                                                                className="btn btn-outline-secondary w-20 mr-1"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button type="submit" className="btn btn-primary ">
                                                                Update
                                                            </button>
                                                        </ModalFooter>
                                                    </form>))
                                    }
                                </Modal>
                                <div
                                    id="success-notification-content"
                                    className="toastify-content hidden flex"
                                >
                                    <Lucide icon="CheckCircle" className="text-success"/>
                                    <div className="ml-4 mr-4">
                                        <div className="font-medium">Created successfully!</div>
                                        <div className="text-slate-500 mt-1">
                                            Please check your Calendar!
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
                                            Please check your Calendar!
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
                                            Please check your Calendar!
                                        </div>
                                    </div>
                                </div>
                                <FullCalendar options={options}/>
                            </Preview>
                        </PreviewComponent>
                    </div>
                )
            }
        </>
    )
}

export default Main;





