import {
    Lucide,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    TabGroup,
    TabList,
    Tippy,
    Tab,
    Modal,
    ModalHeader,
    ModalBody,
    TabPanels,
    TinySlider,
} from "@/components";
import {faker as $f} from "@/utils";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {GetAllProjects, getProjectsByCompanyId} from "@/routes/routes";
import useError from "@/hooks/useError";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import {Litepicker, ModalFooter} from "../../../../components";
import * as $_ from "lodash";

const animatedComponents = makeAnimated();

import {useNavigate} from "react-router";
import {useLocation, useParams} from "react-router-dom";
import classnames from "classnames";
import FileManager from "../../file-manager/Main";
import UserList from "../../user-list/user-list";
import Skeleton from "react-loading-skeleton";
import moment from "moment/moment";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    createProject,
    getClientsOnChange,
    getProjectStatus,
    getUsersOnChange,
    getUsersTest,
    listOfClients
} from "../../../../routes/routes";
import Toastify from "toastify-js";
import CraftNoteCartoon from "@/components/cartoons/CraftNoteCartoon";

function Main() {
    const setError = useError();
    const [projectList, setProjectList] = useState([]);
    const [activeState, setActiveState] = useState(0);
    const [nextOverlappingSlideOverPreview, setNextOverlappingSlideOverPreview] = useState(false);
    const [overlappingSlideOverPreview, setOverlappingSlideOverPreview] = useState(false);
    const [activeTab, setActiveTab] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = useParams();
    const [focusedProjectId, setFocusedProjectId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [createSingleProject, setCreateProject] = useState(false)
    const [project, setProject] = useState({
        id: '',
        name: '',
        startDate: '',
        endDate: '',
        clientId: '',
        statusId: '',
        description: '',
        address: '',
        resources: {
            employees: ''
        },
    });
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [clientsDefault, setClientsDefault] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeesDefault, setEmployeesDefault] = useState([]);
    const [projectStatus, setProjectStatus] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [chatMessages, setChatMessages] = useState([
        {
            content: '',
            timestamp: new Date().toLocaleString(),
            files: [
                {
                    name: 'download.jpg',
                    type: 'image/jpeg',
                    data: '/src/components/images/download.jpg',
                },
            ],
        },
        {
            content: '',
            timestamp: new Date().toLocaleString(),
            files: [
                {
                    name: 'images.jpg',
                    type: 'image/jpeg',
                    data: '/src/components/images/images.jpg',
                },
            ],
        }
    ]);
    const textareaRef = useRef(null);

    const clientsData = {
        data: [
            {
                id: 1,
                company_name: "SEEU",
                email: "seeu@mail.com",
                phone_number: "123456789",
                country: "North Macedonia",
                city: "Tetovo",
                street: "ul. BR. BB",
                postal_code: "1200",
                created_at: null,
                updated_at: null
            },
            {
                id: 2,
                company_name: "Ecolog",
                email: "ecolog@mail.com",
                phone_number: "123456789",
                country: "North Macedonia",
                city: "Tetovo",
                street: "ul. BR. BB",
                postal_code: "1200",
                created_at: null,
                updated_at: null
            },
            {
                id: 3,
                company_name: "pofix",
                email: "pofix@mail.com",
                phone_number: "123456789",
                country: "North Macedonia",
                city: "Tetovo",
                street: "ul. BR. BB",
                postal_code: "1200",
                created_at: null,
                updated_at: null
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
    };

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

        const statusData = {
            data: [
                {
                    id: 1,
                    status: "Offer",
                    description: "description"
                },
                {
                    id: 2,
                    status: "Ongoing",
                    description: "description"
                },
                {
                    id: 3,
                    status: "Completed",
                    description: "description"
                }
            ],
            meta: {
                timestamp: 1690186187083
            }
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

        const projectsByCompanyIdData = {
            data: [
                {
                    id: 7,
                    name: "Project test",
                    description: "This is the description for the second project",
                    start_date: "2023-12-07",
                    end_date: "2023-12-14",
                    address: "New Address",
                    client: {
                        id: 2,
                        company_name: "Ecolog",
                        email: "ecolog@mail.com",
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
                        id: 1,
                        status: "Offer",
                        description: "description"
                    },
                    progress: [
                        {
                            "Backlog": 0
                        },
                        {
                            "In Progress": 0
                        },
                        {
                            "Review": 0
                        },
                        {
                            "Completed": 0
                        }
                    ]
                },
                {
                    id: 9,
                    name: "Project test 9",
                    description: "This is the description for the second project",
                    start_date: "2023-12-07",
                    end_date: "2023-12-14",
                    address: "New Address",
                    client: {
                        id: 2,
                        company_name: "Ecolog",
                        email: "ecolog@mail.com",
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
                        id: 1,
                        status: "Offer",
                        description: "description"
                    },
                    progress: [
                        {
                            "Backlog": 0
                        },
                        {
                            "In Progress": 0
                        },
                        {
                            "Review": 0
                        },
                        {
                            "Completed": 0
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


    useEffect(() => {
        const fetchModalData = async () => {
            setIsLoading(true)
            try {
                // const clients = await listOfClients()
                // const status = await getProjectStatus()
                // const employees = await getUsersTest()
                setClients(clientsData.data)
                setClientsDefault(clients.data)
                setEmployees(employeesData.data)
                setEmployeesDefault(employeesData.data)
                setProjectStatus(statusData.data)
                if (selectedCompany.value === 'showAll') {
                    fetchProjectsForShowAll();
                } else {
                    fetchProjectsForCompany(selectedCompany.value);
                }
            } catch (err) {
                setError(err)
            }
            setIsLoading(false)
        };
        fetchModalData()
    }, [])

    const optionsClient = [
        {value: 'showAll', label: 'Show All'},
        ...clients.map((client) => ({value: client.id, label: client.company_name}))
    ];
    const defaultValue = optionsClient[0];

    const [selectedCompany, setSelectedCompany] = useState(defaultValue);


    const options = employees.map(function (employee) {
        return {value: employee.id, label: employee.user_profile.display_name};
    })

    const optionsPositions = [
        {value: '101.1', label: '101.1 - Position 1'},
        {value: '101.2', label: '101.2 - Position 2'},
        {value: '101.3', label: '101.3 - Position 3'},
        {value: '101.3', label: '101.3 - Position 4'},
    ];

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

    const fetchProjectsForShowAll = async () => {
        setIsLoading(true)
        try {
            // const response = await GetAllProjects(1, 100);
            setProjectList(projectsData.data);
            setIsLoading(false);

            const selectedProjectId = parseInt(id);
            const selectedProject = projectsData.data?.find((project) => project.id === selectedProjectId);
            setSelectedProject(selectedProject);
        } catch (err) {
            setError(err)
        }
        setIsLoading(false)
    };

    const fetchProjectsForCompany = async (companyId) => {
        setIsLoading(true)
        try {
            // const response = await getProjectsByCompanyId(companyId);
            setProjectList(projectsByCompanyIdData.data);
            setIsLoading(false);

            const selectedProjectId = parseInt(id);
            const selectedProject = projectsByCompanyIdData.data?.find((project) => project.id === selectedProjectId);
            setSelectedProject(selectedProject);
        } catch (err) {
            setError(err)
        }
        setIsLoading(false)
    };

    const handleChangeClients = (e) => {
        setSelectedCompany(e);
        if (e.value === 'showAll') {
            // Handle "Show All" option
            fetchProjectsForShowAll();
        } else {
            // Handle other clients
            fetchProjectsForCompany(e.value);
        }
        setActiveTab(null)
        setFocusedProjectId(NaN)
        navigate('/projects')
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
        // if (searchQuery.trim().length === 0) {
        //     setEmployees(employeesDefault)
        //     return
        // }
        // setLoading(true)
        // let employees = []
        // try {
        //     employees = await getUsersOnChange(searchQuery)
        // } catch (err) {
        //     setError(err)
        // } finally {
        //     setEmployees(employees)
        //     setLoading(false)
        // }
    }

    const handleSearchForClient = async (searchQuery) => {
        // if (searchQuery.trim().length === 0) {
        //     setClients(clientsData.data)
        //     return
        // }
        // setLoading(true)
        // let clients = []
        // try {
        //     // clients = await getClientsOnChange(searchQuery)
        // } catch (err) {
        //     setError(err)
        // } finally {
        //     setClients(clientsData.data)
        //     setLoading(false)
        // }
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

    const onSubmit = async (event) => {
        event.preventDefault();
        // try {
        //     const params = {
        //         name: project.name,
        //         description: project.description,
        //         start_date: moment(project.startDate).format("YYYY-MM-DD"),
        //         end_date: moment(project.endDate).format("YYYY-MM-DD"),
        //         client_id: project.clientId,
        //         status_id: project.statusId,
        //         resources: {employees: project.resources.employees},
        //         address: project.address
        //     };
        //     const response = await createProject(params);
        //     setProjectList([...projectList, response]);
        //     Toastify({
        //         node: dom("#success-notification-content")
        //             .clone()
        //             .removeClass("hidden")[0],
        //         duration: 3000,
        //         newWindow: true,
        //         close: true,
        //         gravity: "top",
        //         position: "right",
        //         stopOnFocus: true,
        //     }).showToast();
        //     setProject({
        //         id: "",
        //         name: "",
        //         startDate: "",
        //         endDate: "",
        //         clientId: "",
        //         statusId: "",
        //         description: "",
        //         address: "",
        //         resources: {
        //             employees: ""
        //         },
        //     });
        //
        // } catch (err) {
        //     setError(err);
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
        //
        // }
        setCreateProject(false);
    };

    const employeeList = [
        {
            name: 'Jon Kurtishi',
            description: 'Job position: Developer'
        },
        {
            name: 'Drenas Dika',
            description: 'Job position: Designer'
        },
        {
            name: 'Enes Ismaili',
            description: 'Job position: Engineer'
        },
        {
            name: 'Artim Dauti',
            description: 'Job position: Analyst'

        }, {
            name: 'Nermin Dauti',
            description: 'Job position: Manager'
        },];

    useEffect(() => {
        const pathname = window.location.pathname;
        let activeTabValue;
        let selectedIndexValue;
        let focusedProjectIdValue;

        if (pathname === `/projects/${id}/chat`) {
            activeTabValue = 'chat';
            selectedIndexValue = 0;
        } else if (pathname.includes(`/projects/${id}/worklogs`)) {
            activeTabValue = 'worklogs';
            selectedIndexValue = 1;
        } else if (pathname.includes(`/projects/${id}/tasks`)) {
            activeTabValue = 'tasks';
            selectedIndexValue = 2;
        } else if (pathname.includes(`/projects/${id}/members`)) {
            activeTabValue = 'members';
            selectedIndexValue = 3;
        } else if (pathname.includes(`/projects/${id}/files`)) {
            activeTabValue = 'files';
            selectedIndexValue = 4;
        } else {
            activeTabValue = null
        }

        setActiveTab(activeTabValue);
        setSelectedIndex(selectedIndexValue);

        focusedProjectIdValue = Number(id)
        setFocusedProjectId(focusedProjectIdValue);
    }, [location.pathname, id, activeTab, selectedIndex]);

    const handleProject = useCallback(async (event, projectId) => {
        event.preventDefault();
        setActiveState(Number(event.currentTarget.id));

        const currentTab = activeTab === null ? '/chat' : `/${activeTab}`;
        navigate(`/projects/${projectId}${currentTab}`);
        setSelectedIndex(null);

        setFocusedProjectId(projectId);
    }, [activeTab]);


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

    //chat fixes
    const fileInputRef = useRef(null);
    const handleChangeChat = (e) => {
        setMessage(e.target.value);
        if (fileInputRef.current && e.target !== textareaRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
            textarea.style.overflowY = message ? 'auto' : 'hidden';
        }
    }, [message]);
    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        setFiles([...files, ...selectedFiles]);
    };

    useEffect(() => {
        const messageContainer = document.getElementById('messageContainer');
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }, [chatMessages]);

    const handleSend = () => {
        console.log('Message:', message);
        console.log('Files:', files);

        // Convert files to ArrayBuffer or string
        files.forEach((file) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function () {
                console.log(fileReader.result);
            };
            fileReader.onerror = function (error) {
                console.log('Error: ', error);
            };
        });

        if (message.trim() !== "" || files.length > 0) {
            const newMessage = {
                content: message.trim(),
                timestamp: new Date().toLocaleString(),
                files: files.map((file) => ({
                    name: file.name,
                    type: file.type,
                    data: URL.createObjectURL(file),
                })),
            };
            setChatMessages([...chatMessages, newMessage]);
            setMessage("");
            setFiles([]);
            handleNewChatMessage(newMessage);
        }
    };

    const getFileNames = () => {
        if (files.length === 0) {
            return 'No files selected';
        } else {
            return files.map((file) => file.name).join(', ');
        }
    };

    const [tinySliderModalPreview, setTinySliderModalPreview] = useState(false);
    const [allImages, setAllImages] = useState([]);
    const [clickedImageIndex, setClickedImageIndex] = useState(1);
    const handleNewChatMessage = (newMessage) => {
        const imageFiles = newMessage.files.filter((file) => file.type.startsWith('image/'));
        setAllImages((prevImages) => [...prevImages, ...imageFiles]);
    };

    const ImageSlider = ({ images, currentIndex }) => {
        return (
            <Modal show={tinySliderModalPreview} onHidden={() => setTinySliderModalPreview(false)} size={'modal-xxl'}>
                <ModalBody>
                    <div className="mx-6">
                        <TinySlider
                            settings={{
                                startIndex: currentIndex
                            }}
                            options={{
                                mouseDrag: true,
                                autoplay: false,
                                controls: true,
                                center: true,
                                items: 1,
                                nav: false,
                                speed: 500,
                                index: currentIndex,
                            }}
                        >
                            {images.map((image, index) => (
                                <div key={index} className="h-60-vh px-2">
                                    <div className="h-full rounded-md overflow-hidden">
                                        <img alt={`Image ${index + 1}`} src={image.data} className={'object-contain h-full w-full'}  />
                                    </div>
                                </div>
                            ))}
                        </TinySlider>
                    </div>
                </ModalBody>
            </Modal>
        );
    };
    const handleImageClick = (clickedIndex) => {
        setClickedImageIndex(clickedIndex);
        setTinySliderModalPreview(true)
    };

    useEffect(() => {
        const allImageFiles = chatMessages.flatMap((message) =>
            message.files.filter((file) => file.type.startsWith('image/'))
        );
        setAllImages(allImageFiles);
    }, [chatMessages]);


    const [positions, setPositions] = useState([]);

    const handleAddPositionClick = () => {
        setPositions([...positions, { employee: null, position: null }]);
    };

    const handleEmployeeChange = (index, selectedOptions) => {
        const updatedPositions = [...positions];
        updatedPositions[index].employee = selectedOptions;
        setPositions(updatedPositions);
    };

    const handlePositionChange = (index, selectedOptions) => {
        const updatedPositions = [...positions];
        updatedPositions[index].position = selectedOptions;
        setPositions(updatedPositions);
    };

    const removePosition = (index) => {
        const updatedPositions = [...positions];
        updatedPositions.splice(index, 1);
        setPositions(updatedPositions);
    };

    return (
        <>
            <Modal
                slideOver={true}
                show={overlappingSlideOverPreview}
                onHidden={() => {
                    setOverlappingSlideOverPreview(false);
                }}>
                <ModalHeader className="p-5">
                    <h2 className="font-medium text-base mr-auto">
                        Project Details
                    </h2>
                    <div className=' flex justify-end'>
                        <button className='btn justify-end btn-primary shadow-md'> Update Project</button>
                    </div>
                </ModalHeader>
                <ModalBody className="px-5 py-10">
                    <div className="text-center">

                    </div>
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
                            id="validation-form-1"
                            type="text"
                            name="name"
                            className={classnames({
                                "form-control": true,
                            })}
                            placeholder="Project Name"
                            value={selectedProject?.name || ''}
                            onChange={(e) => {
                                setSelectedProject({
                                    ...selectedProject,
                                    name: e.target.value
                                });
                            }}
                        />
                    </div>
                    <br/>
                    <div className='flex '>
                        <div className=" mr-7 col-span-12">
                            <label
                                htmlFor="validation-form-3"
                                className="form-label w-full flex flex-col sm:flex-row"
                            >
                                Start Datee
                                <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, start date
</span>
                            </label>
                            <Litepicker
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
                                value={project.startDate || ''}
                                onChange={(date) => {
                                    setProject({
                                        ...project,
                                        startDate: date
                                    });
                                }}
                            />
                        </div>
                        <div className='flex'>
                            <div className=" ml-7 col-span-12">
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
                                    value={project.endDate || ''}
                                    onChange={(date) => {
                                        setProject({
                                            ...project,
                                            endDate: date
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="col-span-12">
                        <label
                            htmlFor="validation-form-1"
                            className="form-label w-full flex flex-col sm:flex-row"
                        >
                            Address
                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, Address
</span>
                        </label>
                        <input
                            id="validation-form-1"
                            type="text"
                            name="name"
                            className={classnames({
                                "form-control": true,
                            })}
                            placeholder="ID Number"
                            value={selectedProject?.address || ''}
                            onChange={(e) => {
                                setSelectedProject({
                                    ...selectedProject,
                                    address: e.target.value
                                });
                            }}
                        />
                    </div>
                    <br/>
                    <div className="col-span-12">
                        <label
                            htmlFor="validation-form-1"
                            className="form-label w-full flex flex-col sm:flex-row"
                        >
                            Project Status
                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, Status
</span>
                        </label>
                        <Select
                            isMulti
                            components={animatedComponents}
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
                            placeholder={'Search for status'}
                        />
                    </div>
                    <br/>
                    <div className="col-span-12">
                        <label
                            htmlFor="validation-form-1"
                            className="form-label w-full flex flex-col sm:flex-row"
                        >
                            Project Description
                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, Description
</span>
                        </label>
                        <textarea className={classnames({
                            "form-control": true,
                        })}
                                  placeholder={'Description'}
                                  value={selectedProject?.description || ''}
                                  onChange={(e) => {
                                      setSelectedProject({
                                          ...selectedProject,
                                          description: e.target.value
                                      });
                                  }}
                        />
                    </div>
                    <br/>
                    <div className="col-span-12">
                        <div
                            onClick={() => {
                                setNextOverlappingSlideOverPreview(true);
                            }}
                        >
                            <label htmlFor="validation-form-1"
                                   className="cursor-pointer form-label w-full flex flex-col sm:flex-row justify-between">
                                <div>Employee's</div>
                                <div className="pl-5 font-medium">({employeeList.length})</div>
                            </label>
                        </div>
                        <div className="flex items-center justify-end">
                        </div>
                    </div>

                    <br/>
                    <div>
                        <label
                            htmlFor="validation-form-1"
                            className="form-label w-full flex flex-col sm:flex-row"
                        >
                            Progress </label>
                        <div className="progress h-4 mt-3">
                            <div
                                className="progress-bar w-2/3"
                                role="progressbar"
                                aria-valuenow="0"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                60%
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className=' flex justify-end'>
                        <button className='btn justify-end btn-primary shadow-md'> Delete Project</button>
                    </div>
                    <Modal
                        slideOver={true}
                        show={nextOverlappingSlideOverPreview}
                        onHidden={() => {
                            setNextOverlappingSlideOverPreview(false);
                        }}
                    >
                        <ModalHeader className="p-5">
                            <h2 className="font-medium text-base mr-auto">
                                Employees
                            </h2>
                            <div
                                onClick={() => {
                                    setNextOverlappingSlideOverPreview(false)
                                }}
                                className='cursor-pointer'><Lucide icon='X'/></div>
                        </ModalHeader>
                        <ModalBody className="text-center">
                            <div className="chat__chat-list overflow-y-auto scrollbar-hidden pr-1 pt-1 mt-4">
                                {employeeList.map((employee, index) => (
                                    <div
                                        key={index}
                                        className={`intro-x cursor-pointer box relative flex items-center p-5 mt-5 ${
                                            activeState === index ? 'activeState' : ''
                                        }`}
                                    >
                                        <div className="ml-2 overflow-hidden">
                                            <div className="flex items-center">
                                                <a href="#" className="font-medium">
                                                    {employee.name}
                                                </a>
                                            </div>
                                            <div className="w-full truncate text-slate-500 mt-0.5">
                                                {employee.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ModalBody>
                    </Modal>
                </ModalBody>
            </Modal>
            <Modal
                show={createSingleProject}
                onHidden={() => {
                    setCreateProject(false)
                }}
                size={'modal-xl'}
            >
                <ModalBody className={'p-0'}>
                    <div className={'p-5 text-center'}>
                        <form onSubmit={onSubmit}>

                            <div className="col-span-12">
                                <h4 className='text-left font-medium'> Create Project</h4>
                                <br/>
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
                                    htmlFor="validation-form-1"
                                    className="form-label w-full flex flex-col sm:flex-row"
                                >
                                    Address
                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                                Address,
</span>
                                </label>
                                <input
                                    {...register("address")}
                                    id="validation-form-1"
                                    type="text"
                                    name="address"
                                    onInput={(e) => setProject(prevState => {
                                        return {
                                            ...prevState,
                                            address: e.target['value']
                                        }
                                    })}
                                    className={classnames({
                                        "form-control": true,
                                        "border-danger": errors.address,
                                    })}
                                    placeholder="address"
                                />
                                {errors.address && (
                                    <div className="text-danger mt-2">
                                        {errors.address.message}
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
                                    className='text-left justify-start'
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
                                    className='text-left justify-start'
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
                                    className='text-left justify-start'
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
                            <div className="col-span-12">
                                <div className="w-full max-w-3xl ml-auto mr-auto">
                                    {positions.map((pos, index) => (
                                        <div key={index} className="flex items-center mb-4">
                                            <div className="w-1/2 mr-2">
                                                <label  className="form-label w-full flex flex-col sm:flex-row">Employee:</label>
                                                <Select
                                                    className='text-left justify-start'
                                                    isMulti
                                                    options={options}
                                                    components={animatedComponents}
                                                    onChange={(selectedOptions) =>
                                                        handleEmployeeChange(index, selectedOptions)
                                                    }
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
                                            <div className="w-1/2  mr-2">
                                                <label  className="form-label w-full flex flex-col sm:flex-row">Positions:</label>
                                                <Select
                                                    className='text-left justify-start'
                                                    isMulti
                                                    options={optionsPositions}
                                                    components={animatedComponents}
                                                    onChange={(selectedOptions) =>
                                                        handlePositionChange(index, selectedOptions)
                                                    }
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

                                                    placeholder={'Search for Positions'}
                                                    noOptionsMessage={noOptionsMessage}
                                                />
                                            </div>
                                            <div className="mt-8">
                                                {/* "Remove Position" icon */}
                                                <button
                                                    type="button"
                                                    onClick={() => removePosition(index)}
                                                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-12 my-2">
                                <button
                                    type="button"
                                    onClick={handleAddPositionClick}
                                    className="btn btn-primary"
                                >
                                    Add New Position
                                </button>
                            </div>
                            <ModalFooter>
                                <button type="submit" className="btn btn-primary  ">
                                    Create
                                </button>
                                <button

                                    type="button"
                                    onClick={() => setCreateProject(false)}
                                    className="btn btn-outline-secondary w-20 ml-3"
                                >
                                    Cancel
                                </button>
                            </ModalFooter>
                        </form>
                    </div>

                </ModalBody>
            </Modal>
            <TabGroup selectedIndex={selectedIndex}>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="text-lg flex font-medium ">Projects</h2>
                    <div className='mr-auto ml-4'>
                        <Dropdown>
                            <DropdownToggle className="btn px-2 box">
              <span className="w-5 h-5 flex items-center justify-center">
                <Lucide icon="Plus" className="w-4 h-4"/>
              </span>
                            </DropdownToggle>
                            <DropdownMenu className="w-40">
                                <DropdownContent>
                                    <DropdownItem
                                        onClick={() => {
                                            setCreateProject(true)
                                        }}
                                    >
                                        <Lucide icon="Plus" className="w-4 h-4 mr-2"/>
                                        Create Project
                                    </DropdownItem>
                                </DropdownContent>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    {
                        !isNaN(focusedProjectId) && activeTab !== null && (
                            <>
                                <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0 mr-auto">
                                    <div className="w-56 relative text-slate-500">
                                        <input
                                            type="text"
                                            className="form-control w-56 box pr-10"
                                            placeholder="Search..."
                                        />
                                        <Lucide
                                            icon="Search"
                                            className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                        />
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
                                    <TabList
                                        className="nav-link-tabs flex-col sm:flex-row lg:justify-between flex text-center">
                                        <div onClick={() => {
                                            setActiveTab('chat')
                                            setSelectedIndex(0)
                                            navigate(`/projects/${id}/chat`)
                                        }} className='cursor-pointer'>
                                            <Tab
                                                fullWidth={false}
                                                className="py-4 flex items-center "
                                            >
                                                <Lucide icon="MessageSquare" className="cursor-pointer w-4 h-4 mr-2"/>
                                                <div>Chat</div>
                                            </Tab>
                                        </div>
                                        <div onClick={() => {
                                            setActiveTab('worklogs')
                                            setSelectedIndex(1)
                                            navigate(`/projects/${id}/worklogs`)
                                        }} className='cursor-pointer'>
                                            <Tab
                                                fullWidth={false}
                                                className="py-4 flex items-center "
                                            >
                                                <Lucide icon="Sheet" className="cursor-pointer w-4 h-4 mr-2"/>
                                                <div>Worklogs</div>
                                            </Tab>
                                        </div>
                                        <div onClick={() => {
                                            setActiveTab('tasks')
                                            setSelectedIndex(2)
                                            navigate(`/projects/${id}/tasks`)
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
                                            setActiveTab('members')
                                            setSelectedIndex(3)
                                            navigate(`/projects/${id}/members`)
                                        }} className='cursor-pointer'>
                                            <Tab
                                                fullWidth={false}
                                                className="py-4 flex items-center "
                                            >
                                                <Lucide icon="Sheet" className="cursor-pointer w-4 h-4 mr-2"/>
                                                <div>Members</div>
                                            </Tab>
                                        </div>
                                        <div onClick={() => {
                                            setActiveTab('files')
                                            setSelectedIndex(4)
                                            navigate(`/projects/${id}/files`)
                                        }} className='cursor-pointer'>
                                            <Tab
                                                fullWidth={false}
                                                className="py-4 flex items-center "
                                            >
                                                <Lucide icon="Files" className="cursor-pointer w-4 h-4 mr-2"/>
                                                <div>Files</div>
                                            </Tab>
                                        </div>
                                    </TabList>
                                    <div onClick={() => {
                                        setOverlappingSlideOverPreview(true);
                                    }} className='cursor-pointer'>
                                        <div
                                            className="p-4 flex items-center "
                                        >
                                            <Lucide icon="Database" className="cursor-pointer w-4 h-4 mr-2"/>
                                            <div>Details</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
                <div className="intro-y chat grid grid-cols-12 gap-5 mt-5">
                    {/* BEGIN: Chat Side Menu */}
                    <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                        <div className="intro-y pr-1">
                            <div className="box p-2">
                                <Select
                                    options={optionsClient}
                                    components={animatedComponents}
                                    defaultValue={defaultValue}
                                    onChange={handleChangeClients}
                                    onInputChange={handleInputClientsChange}
                                    filterOption={null}
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
                                    className={'w-80 ml-auto pt-3 mr-auto'}
                                    placeholder={'Search for Company'}
                                    noOptionsMessage={noOptionsMessage}
                                />
                                {isLoading ? (
                                    <div>
                                        <div
                                            className={`intro-x cursor-pointer box relative flex items-center p-5 mt-5`}>
                                            <div className="ml-2 overflow-hidden w-full">
                                                <div>
                                                    <Skeleton width={120} height={12}/>
                                                </div>
                                                <div>
                                                    <Skeleton width={100} height={10}/>
                                                </div>
                                                <Skeleton width={50} height={9} className={'ml-2'}/>
                                                <Skeleton count={1}/>
                                            </div>
                                        </div>
                                        <div
                                            className={`intro-x cursor-pointer box relative flex items-center p-5 mt-5`}>
                                            <div className="ml-2 overflow-hidden w-full">
                                                <div>
                                                    <Skeleton width={120}/>
                                                </div>
                                                <div>
                                                    <Skeleton width={100} height={10}/>
                                                </div>
                                                <Skeleton width={50} height={9} className={'ml-2'}/>
                                                <Skeleton count={1}/>
                                            </div>
                                        </div>
                                        <div
                                            className={`intro-x cursor-pointer box relative flex items-center p-5 mt-5`}>
                                            <div className="ml-2 overflow-hidden w-full">
                                                <div>
                                                    <Skeleton width={120}/>
                                                </div>
                                                <div>
                                                    <Skeleton width={100} height={10}/>
                                                </div>
                                                <Skeleton width={50} height={9} className={'ml-2'}/>
                                                <Skeleton count={1}/>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="chat__chat-list overflow-y-auto scrollbar-hidden pr-1">
                                        {projectList.map((project, index) => (
                                            <div
                                                key={index}
                                                id={index}
                                                className={`cursor-pointer box relative flex items-center p-5 mt-5 ${project.id === focusedProjectId ? 'activeState' : ''}`}
                                                onClick={(event) => handleProject(event, project.id)}
                                            >
                                                <div className="ml-2 overflow-hidden w-full">
                                                    <div className="flex items-center">
                                                        <a href="#" className="font-medium">
                                                            {project.name}
                                                        </a>
                                                    </div>
                                                    <div className="w-full truncate text-slate-500 mt-0.5">
                                                        {project.address}
                                                    </div>
                                                    <div className="w-full truncate text-slate-500 mt-0.5">
                                                        <div>
                                                            <label
                                                                htmlFor="validation-form-1"
                                                                className="form-label w-full flex flex-col sm:flex-row"
                                                            >
                                                                Progress </label>
                                                            <div className="progress h-4 mt-3">
                                                                <div
                                                                    className="progress-bar w-2/3"
                                                                    role="progressbar"
                                                                    aria-valuenow="0"
                                                                    aria-valuemin="0"
                                                                    aria-valuemax="100"
                                                                >
                                                                    60%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                    <div className="intro-y col-span-12 lg:col-span-8 2xl:col-span-9 flex justify-center h-full">
                        {projectList.length !== 0 ? (
                            !isNaN(focusedProjectId) ? (
                                <TabPanels>
                                    {activeTab === 'chat' && <div className="leading-relaxed items-center">
                                        <div className="chat__box box">
                                            <div className="h-full flex flex-col">
                                                <div className="flex flex-col sm:flex-row border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit relative">
                                                            <img
                                                                alt="Midone Tailwind HTML Admin Template"
                                                                className="rounded-full"
                                                                src={$f()[0].photos[0]}
                                                            />
                                                        </div>
                                                        <div className="ml-3 mr-auto">
                                                            <div className="font-medium text-base">
                                                                {$f()[0]["users"][0]["name"]}
                                                            </div>
                                                            <div className="text-slate-500 text-xs sm:text-sm">
                                                                Hey, I am using chat <span className="mx-1">•</span>{" "}
                                                                Online
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center sm:ml-auto mt-5 sm:mt-0 border-t sm:border-0 border-slate-200/60 pt-3 sm:pt-0 -mx-5 sm:mx-0 px-5 sm:px-0">
                                                        <a href="#" className="w-5 h-5 text-slate-500">
                                                            <Lucide icon="Search" className="w-5 h-5" />
                                                        </a>
                                                        <a href="#" className="w-5 h-5 text-slate-500 ml-5">
                                                            <Lucide icon="UserPlus" className="w-5 h-5" />
                                                        </a>
                                                        <Dropdown className="ml-auto sm:ml-3">
                                                            <DropdownToggle
                                                                tag="a"
                                                                href="#"
                                                                className="w-5 h-5 text-slate-500"
                                                            >
                                                                <Lucide icon="MoreVertical" className="w-5 h-5" />
                                                            </DropdownToggle>
                                                            <DropdownMenu className="w-40">
                                                                <DropdownContent>
                                                                    <DropdownItem>
                                                                        <Lucide icon="Share2" className="w-4 h-4 mr-2" />
                                                                        Share Contact
                                                                    </DropdownItem>
                                                                    <DropdownItem>
                                                                        <Lucide icon="Settings" className="w-4 h-4 mr-2" />
                                                                        Settings
                                                                    </DropdownItem>
                                                                </DropdownContent>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <div
                                                    className="overflow-y-scroll scrollbar-hidden px-5 pt-5 flex-1"
                                                    id="messageContainer"
                                                >
                                                    <div className="chat__box__text-box flex items-end float-left mb-4">
                                                        <div className="w-10 h-10 hidden sm:block flex-none image-fit relative mr-5">
                                                            <img
                                                                alt="Midone Tailwind HTML Admin Template"
                                                                className="rounded-full"
                                                                src={$f()[0].photos[0]}
                                                            />
                                                        </div>
                                                        <div className="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-r-md rounded-t-md">
                                                            <img
                                                                alt="Broken Bathroom Image 4"
                                                                className="h-15 w-15"
                                                                src="/src/components/images/download.jpg"
                                                            />

                                                            <div className="mt-1 text-xs text-slate-500">
                                                                10 secs ago
                                                            </div>
                                                        </div>
                                                        <Dropdown className="hidden sm:block ml-3 my-auto">
                                                            <DropdownToggle
                                                                tag="a"
                                                                href="#"
                                                                className="w-4 h-4 text-slate-500"
                                                            >
                                                                <Lucide icon="MoreVertical" className="w-4 h-4" />
                                                            </DropdownToggle>
                                                            <DropdownMenu className="w-40">
                                                                <DropdownContent>
                                                                    <DropdownItem>
                                                                        <Lucide
                                                                            icon="CornerUpLeft"
                                                                            className="w-4 h-4 mr-2"
                                                                        />
                                                                        Reply
                                                                    </DropdownItem>
                                                                    <DropdownItem>
                                                                        <Lucide icon="Trash" className="w-4 h-4 mr-2" />{" "}
                                                                        Delete
                                                                    </DropdownItem>
                                                                </DropdownContent>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div>
                                                    <div className="clear-both"></div>
                                                    {chatMessages.map((chatMessage, index) => (
                                                        <React.Fragment key={index}>
                                                            <div className="chat__box__text-box flex items-end float-right mb-4">
                                                                {chatMessage.files.length === 0 ? (
                                                                    <div className="bg-primary px-4 py-3 text-white rounded-l-md rounded-t-md whitespace-pre-wrap">
                                                                        {chatMessage.content}
                                                                        <div className="mt-1 text-xs text-white text-opacity-80">
                                                                            {chatMessage.timestamp}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="bg-primary px-4 py-3 text-white rounded-l-md rounded-t-md whitespace-pre-wrap">
                                                                        {chatMessage.content}
                                                                        {chatMessage.files.map((file, fileIndex) => (
                                                                            <div
                                                                                key={fileIndex}
                                                                                onClick={() => handleImageClick(fileIndex)} // Update the state when the image is clicked
                                                                                style={{ cursor: 'pointer' }}
                                                                            >
                                                                                <img
                                                                                    src={file.data}
                                                                                    alt={file.name}
                                                                                    className="max-w-sm h-auto rounded-lg mx-2"
                                                                                />
                                                                                <div className="text-xs text-slate-500 mt-1">
                                                                                    {file.name}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                        <div className="mt-1 text-xs text-white text-opacity-80">
                                                                            {chatMessage.timestamp}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="w-10 h-10 hidden sm:block flex-none image-fit relative ml-5">
                                                                    <img
                                                                        alt="Midone Tailwind HTML Admin Template"
                                                                        className="rounded-full"
                                                                        src={$f()[1].photos[0]}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="clear-both"></div>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                                {allImages.length > 0 && (
                                                    <ImageSlider
                                                        images={allImages}
                                                        currentIndex={1}
                                                    />
                                                )}

                                                <div className="pt-4 pb-10 sm:py-4 flex items-center border-t border-slate-200/60 dark:border-darkmode-400">
      <textarea
          className="chat__box__input form-control dark:bg-darkmode-600 h-16 resize-none border-transparent px-5 py-3 shadow-none focus:border-transparent focus:ring-0"
          rows="1"
          placeholder="Type your message..."
          value={message}
          ref={textareaRef}
          onChange={handleChangeChat}
          onKeyDown={handleKeyDown}
      ></textarea>
                                                    <div className="text-gray-500 ml-2">{getFileNames()}</div>
                                                    <div className="flex absolute sm:static left-0 bottom-0 ml-5 sm:ml-0 mb-5 sm:mb-0">
                                                        <Dropdown className="mr-3 sm:mr-5">
                                                            <DropdownToggle
                                                                tag="a"
                                                                href="#"
                                                                className="w-4 h-4 sm:w-5 sm:h-5 block text-slate-500"
                                                            >
                                                                <Lucide icon="Smile" className="w-full h-full" />
                                                            </DropdownToggle>
                                                            <DropdownMenu className="chat-dropdown">
                                                                <DropdownContent tag="div">
                                                                    <TabGroup
                                                                        className="chat-dropdown__box flex flex-col"
                                                                        selectedIndex={1}
                                                                    >
                                                                        <div className="px-1 pt-1">
                                                                            <div className="relative text-slate-500">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control border-transparent bg-slate-100 pr-10"
                                                                                    placeholder="Search emojis..."
                                                                                />
                                                                                <Lucide
                                                                                    icon="Search"
                                                                                    className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </TabGroup>
                                                                </DropdownContent>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                        <div className="w-4 h-4 sm:w-5 sm:h-5 relative text-slate-500 mr-3 sm:mr-5">
                                                            <label htmlFor="fileInput" className="cursor-pointer">
                                                                <Lucide icon="Paperclip" className="w-full h-full" />
                                                            </label>
                                                            <input
                                                                type="file"
                                                                id="fileInput"
                                                                className="w-full h-full top-0 left-0 absolute opacity-0 cursor-pointer"
                                                                onChange={handleFileChange}
                                                                ref={fileInputRef}
                                                                multiple
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="w-8 h-8 sm:w-10 sm:h-10 block bg-primary text-white rounded-full flex-none flex items-center justify-center mr-5"
                                                        onClick={handleSend}
                                                    >
                                                        <Lucide icon="Send" className="w-4 h-4" />
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                    {activeTab === 'worklogs' && <div className="leading-relaxed ">
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
                                                        <tr>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    Enes Ismaili
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    10.07.2023
                                                                </a>
                                                                <div
                                                                    className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                    08:00
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    10.07.2023
                                                                </a>
                                                                <div
                                                                    className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                    16:00
                                                                </div>
                                                            </td>
                                                            <td className="text-center">8</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    Artim Dauti
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    10.07.2023
                                                                </a>
                                                                <div
                                                                    className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                    08:00
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    10.07.2023
                                                                </a>
                                                                <div
                                                                    className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                    16:00
                                                                </div>
                                                            </td>
                                                            <td className="text-center">8</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    Enes Ismaili
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    10.07.2023
                                                                </a>
                                                                <div
                                                                    className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                    08:00
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    10.07.2023
                                                                </a>
                                                                <div
                                                                    className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                    16:00
                                                                </div>
                                                            </td>
                                                            <td className="text-center">8</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    Artim Dauti
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    10.07.2023
                                                                </a>
                                                                <div
                                                                    className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                    08:00
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <a href="src/views/backoffice/projects/project/tasks/list-tasks/list-tasks"
                                                                   className="font-medium whitespace-nowrap">
                                                                    10.07.2023
                                                                </a>
                                                                <div
                                                                    className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                    16:00
                                                                </div>
                                                            </td>
                                                            <td className="text-center">8</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {/* END: Data List -*/}
                                            </div>
                                        </>
                                    </div>}
                                    {activeTab === 'tasks' && <div className="leading-relaxed items-center">
                                        <>
                                            <div className="grid grid-cols-12 gap-6 mt-5">
                                                <div
                                                    className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                                                    <button className="btn btn-primary shadow-md mr-2">
                                                        Add New Task
                                                    </button>
                                                    <Dropdown>
                                                        <DropdownToggle className="btn px-2 box">
              <span className="w-5 h-5 flex items-center justify-center">
                <Lucide icon="Plus" className="w-4 h-4"/>
              </span>
                                                        </DropdownToggle>
                                                        <DropdownMenu className="w-40">
                                                            <DropdownContent>
                                                                <DropdownItem>
                                                                    <Lucide icon="Printer"
                                                                            className="w-4 h-4 mr-2"/> Print
                                                                </DropdownItem>
                                                                <DropdownItem>
                                                                    <Lucide icon="FileText"
                                                                            className="w-4 h-4 mr-2"/> Export to
                                                                    Excel
                                                                </DropdownItem>
                                                                <DropdownItem>
                                                                    <Lucide icon="FileText"
                                                                            className="w-4 h-4 mr-2"/> Export to
                                                                    PDF
                                                                </DropdownItem>
                                                            </DropdownContent>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                    <div className="hidden md:block mx-auto text-slate-500">
                                                        Showing 1 to 10 of 150 entries
                                                    </div>
                                                    <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                                                        <div className="w-56 relative text-slate-500">
                                                            <input
                                                                type="text"
                                                                className="form-control w-56 box pr-10"
                                                                placeholder="Search..."
                                                            />
                                                            <Lucide
                                                                icon="Search"
                                                                className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* BEGIN: Data List */}
                                                <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                                                    <table className="table table-report -mt-2">
                                                        <thead>
                                                        <tr>
                                                            <th className="whitespace-nowrap">IMAGES</th>
                                                            <th className="whitespace-nowrap">TASKS NAME</th>
                                                            <th className="text-center whitespace-nowrap">STATUS</th>
                                                            <th className="text-center whitespace-nowrap">ACTIONS</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {$_.take($f(), 9).map((faker, fakerKey) => (
                                                            <tr key={fakerKey} className="intro-x">
                                                                <td className="w-40">
                                                                    <div className="flex">
                                                                        <div className="w-10 h-10 image-fit zoom-in">
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
                                                                </td>
                                                                <td>
                                                                    <a href=""
                                                                       className="font-medium whitespace-nowrap">
                                                                        task
                                                                    </a>
                                                                    <div
                                                                        className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                                        Tags: task
                                                                    </div>
                                                                </td>
                                                                <td className="w-40">
                                                                    <div
                                                                        className={classnames({
                                                                            "flex items-center justify-center": true,
                                                                            "text-success": faker.trueFalse[0],
                                                                            "text-danger": !faker.trueFalse[0],
                                                                        })}
                                                                    >
                                                                        <Lucide icon="CheckSquare"
                                                                                className="w-4 h-4 mr-2"/>
                                                                        {faker.trueFalse[0] ? "Active" : "Inactive"}
                                                                    </div>
                                                                </td>
                                                                <td className="table-report__action w-56">
                                                                    <div className="flex justify-center items-center">
                                                                        <a className="flex items-center mr-3" href="#">
                                                                            <Lucide icon="CheckSquare"
                                                                                    className="w-4 h-4 mr-1"/>{" "}
                                                                            Edit
                                                                        </a>
                                                                        <a
                                                                            className="flex items-center text-danger"
                                                                            href="#"
                                                                        >
                                                                            <Lucide icon="Trash2"
                                                                                    className="w-4 h-4 mr-1"/> Delete
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {/* END: Data List */}
                                                {/* BEGIN: Pagination */}
                                                <div
                                                    className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                                                    <nav className="w-full sm:w-auto sm:mr-auto">
                                                        <ul className="pagination">
                                                            <li className="page-item">
                                                                <a className="page-link" href="#">
                                                                    <Lucide icon="ChevronsLeft" className="w-4 h-4"/>
                                                                </a>
                                                            </li>
                                                            <li className="page-item">
                                                                <a className="page-link" href="#">
                                                                    <Lucide icon="ChevronLeft" className="w-4 h-4"/>
                                                                </a>
                                                            </li>
                                                            <li className="page-item">
                                                                <a className="page-link" href="#">
                                                                    ...
                                                                </a>
                                                            </li>
                                                            <li className="page-item">
                                                                <a className="page-link" href="#">
                                                                    1
                                                                </a>
                                                            </li>
                                                            <li className="page-item active">
                                                                <a className="page-link" href="#">
                                                                    2
                                                                </a>
                                                            </li>
                                                            <li className="page-item">
                                                                <a className="page-link" href="#">
                                                                    3
                                                                </a>
                                                            </li>
                                                            <li className="page-item">
                                                                <a className="page-link" href="#">
                                                                    ...
                                                                </a>
                                                            </li>
                                                            <li className="page-item">
                                                                <a className="page-link" href="#">
                                                                    <Lucide icon="ChevronRight" className="w-4 h-4"/>
                                                                </a>
                                                            </li>
                                                            <li className="page-item">
                                                                <a className="page-link" href="#">
                                                                    <Lucide icon="ChevronsRight" className="w-4 h-4"/>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </nav>
                                                    <select className="w-20 form-select box mt-3 sm:mt-0">
                                                        <option>10</option>
                                                        <option>25</option>
                                                        <option>35</option>
                                                        <option>50</option>
                                                    </select>
                                                </div>
                                                {/* END: Pagination */}
                                            </div>
                                        </>
                                    </div>}
                                    {activeTab === 'members' && <div className='leading-relaxed'>
                                        <div>
                                            <UserList/>
                                        </div>
                                    </div>}
                                    {activeTab === 'files' && <div className="leading-relaxed">
                                        <div>
                                            <FileManager/>
                                        </div>
                                    </div>}
                                </TabPanels>
                            ) : (
                                <div className="text-center mb-96">
                                    <h2 className="text-lg font-medium truncate ml-5 mb-5">Please select a project</h2>
                                    <CraftNoteCartoon />
                                </div>
                            )
                        ) : (
                            <div className="text-center mb-96">
                                <h2 className="text-lg font-medium truncate ml-5 mb-5">
                                    No projects found
                                    <CraftNoteCartoon />
                                </h2>
                            </div>
                        )}
                    </div>
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
                </div>
            </TabGroup>
        </>
    );
}

export default Main;
