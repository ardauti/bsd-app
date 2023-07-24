import {
    Dropdown, DropdownContent, DropdownItem, DropdownMenu, DropdownToggle, Lucide, Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Litepicker,
} from "@/components";

import React, {useCallback, useEffect, useState} from "react";
import {
    createUserFunction,
    DeleteUser, getRoles, getUsersOnChange, getUsersTest, ListOfUsers, updateUserById, updateUserRole
} from "../../../routes/routes";
import useError from "../../../hooks/useError";
import {UsersList} from "../../../services/User";
import {useNavigate} from "react-router";
import Toastify from "toastify-js";
import Pagination from "../../../components/pagination/Main";
import {Link, useParams} from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import classnames from "classnames";
import Select from "react-select";
import moment from "moment";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

function Main() {
    const [usersList, setUsersList] = useState([]);
    const [response, setResponse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteModalPreview, setDeleteModalPreview] = useState(false);
    const [userId, setUserId] = useState(null);
    const pageNumberLimit = 5;
    const [maxPageLimit, setMaxPageLimit] = useState(5);
    const [minPageLimit, setMinPageLimit] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [totalCount, setTotalCount] = useState(0);
    const {pageNumber} = useParams();
    const [currentPage, setCurrentPage] = useState(Number(pageNumber));
    const setError = useError()
    const navigate = useNavigate();
    const [userFill, setUserFill] = useState(true)
    const [addNewToolModalPreview, setAddNewToolModalPreview] = useState(false);
    const [selectMultiple, setSelectMultiple] = useState([]);
    const [roles, setRoles] = useState([]);
    const [user, setUser] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        birthdate: '',
        phoneNumber: '',
        gender: '',
        roles: []
    });
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [isLoadingModalEdit, setIsLoadingModalEdit] = useState(false);
    const [editUserModalPreview, setEditUserModalPreview] = useState(false);
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
    const rolesData = {
        data: [
            {
                id: 1,
                name: "Master Admin",
                guard_name: "api",
                permissions: [
                    {
                        id: 20,
                        name: "service.catalogs.create",
                        guard_name: "api"
                    },
                    {
                        id: 21,
                        name: "service.catalogs.delete",
                        guard_name: "api"
                    },
                    {
                        id: 19,
                        name: "service.catalogs.edit",
                        guard_name: "api"
                    },
                    {
                        id: 18,
                        name: "service.catalogs.read",
                        guard_name: "api"
                    },
                    {
                        id: 16,
                        name: "service.clients.create",
                        guard_name: "api"
                    },
                ],
                created_at: null,
                updated_at: null
            },
            {
                id: 2,
                name: "Admin",
                guard_name: "api",
                permissions: [
                    {
                        id: 20,
                        name: "service.catalogs.create",
                        guard_name: "api"
                    },
                    {
                        id: 21,
                        name: "service.catalogs.delete",
                        guard_name: "api"
                    },
                    {
                        id: 19,
                        name: "service.catalogs.edit",
                        guard_name: "api"
                    },
                    {
                        id: 18,
                        name: "service.catalogs.read",
                        guard_name: "api"
                    },
                ],
                created_at: null,
                updated_at: null
            },
            {
                id: 3,
                name: "User",
                guard_name: "api",
                permissions: [],
                created_at: null,
                updated_at: null
            },
            {
                id: 4,
                name: "Project Manager",
                guard_name: "api",
                permissions: [],
                created_at: null,
                updated_at: null
            },
        ],
        links: {
            first: "http://localhost:8000/api/backoffice/roles?page=1",
            last: "http://localhost:8000/api/backoffice/roles?page=1",
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
                    url: "http://localhost:8000/api/backoffice/roles?page=1",
                    label: "1",
                    active: true
                },
                {
                    url: null,
                    label: "Next &raquo;",
                    active: false
                }
            ],
            path: "http://localhost:8000/api/backoffice/roles",
            per_page: 20,
            to: 5,
            total: 5,
            timestamp: 1690188459710
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // const res = await ListOfUsers(pageNumber, pageSize)
                setUsersList(employeesData.data)
                setResponse(employeesData)
                if (employeesData.data.length < 1) {
                    setUserFill(false)
                }
                console.log(pageNumber)
                console.log(pageSize)
                setPageSize(employeesData.meta.per_page)
                setTotalCount(employeesData.meta.total)
                UsersList.data = employeesData.data
                setIsLoading(false)
            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, [currentPage, pageSize, pageNumber,]);

    const onPageChange = (pageNumber) => {
        navigate(`/users/page/${pageNumber}`)
        setCurrentPage(pageNumber);
    }

    const onPrevClick = () => {
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageLimit(maxPageLimit - pageNumberLimit);
            setMinPageLimit(minPageLimit - pageNumberLimit);
        }
        navigate(`/users/page/${currentPage - 1}`)
        setCurrentPage(prev => prev - 1);
    }

    const onNextClick = () => {
        if (currentPage + 1 > maxPageLimit) {
            setMaxPageLimit(maxPageLimit + pageNumberLimit);
            setMinPageLimit(minPageLimit + pageNumberLimit);
        }
        navigate(`/users/page/${currentPage + 1}`)
        setCurrentPage(prev => prev + 1);
    }

    const onChange = (e) => {
        setPageSize(e)
    }
    const onEdit = (id) => {
        setUserId(id)
        navigate(`edit/${id}`)
    }
    const onDelete = (id) => {
        setDeleteModalPreview(true)
        setUserId(id)
    }

    const paginationAttributes = {
        currentPage, maxPageLimit, minPageLimit, pageNumber, pageSize, totalCount, response: response,
    };

    const deleteUser = async () => {
        // try {
        //     const response = await DeleteUser(userId)
        //     const newList = usersList.filter((item) => item.id !== userId);
        //     setUsersList(newList)
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
        //
        // } catch (err) {
        //     setError(err)
        // }
        setDeleteModalPreview(false)
    }
    const handleSearch = async (e) => {
        let searchQuery = e.target.value
        if (searchQuery === '') {
            const users = await getUsersTest()
            setUsersList(users)
            return
        }
        let searchUsers = []
        try {
            searchUsers = await getUsersOnChange(searchQuery)
        } catch (err) {
            setError(err)
        } finally {
            setUsersList(searchUsers)
        }
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

    const schema = yup
        .object({
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            email: yup.string().required().email(),
            gender: yup.string().required(),
            phoneNumber: yup.string().required(),
            birthdate: yup.date().required(),
            roles: yup
                .object()
                .required()
            ,
        })
        .required();

    const {
        register,
        setValue,
        resetField,
        formState: {errors},
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });
    const options = roles.map(function (role) {
        return {value: role.id, label: role.name};
    });
    const noOptionsMessage = function (obj) {
        if (obj.inputValue.trim().length === 0) {
            return null;
        }
        return 'No matching';
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        // if (user.firstName) {
        //     try {
        //         const params = {
        //             first_name: user.firstName,
        //             last_name: user.lastName,
        //             birthdate: moment(user.birthdate).format("YYYY-MM-DD"),
        //             email: user.email,
        //             roles: selectMultiple.map(x => x.value),
        //             phone_number: user.phoneNumber,
        //             gender: user.gender
        //         }
        //         const response = await createUserFunction(params);
        //         setUsersList([...usersList, response])
        //         resetField('firstName')
        //         resetField('lastName')
        //         resetField('email')
        //         resetField('gender')
        //         resetField('phoneNumber')
        //         setUser({
        //             birthdate: '',
        //         })
        //         setSelectMultiple([])
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
        //     } catch (err) {
        //         setError(err)
        //         Toastify({
        //             node: dom("#failed-notification-content")
        //                 .clone()
        //                 .removeClass("hidden")[0],
        //             duration: 3000,
        //             newWindow: true,
        //             close: true,
        //             gravity: "top",
        //             position: "right",
        //             stopOnFocus: true,
        //         }).showToast();
        //
        //     }
        //     setAddNewToolModalPreview(false)
        // } else {
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
        // }
        setAddNewToolModalPreview(false)
    };

    const onCreate = async () => {
        setAddNewToolModalPreview(true)
        resetField('firstName')
        resetField('lastName')
        resetField('email')
        resetField('gender')
        resetField('birthdate')
        resetField('phoneNumber')
        resetField('date')
        resetField('roles')
        setIsLoadingModal(true)
        // const roles = await getRoles()
        setRoles(rolesData.data)
        setIsLoadingModal(false)
    };

    const onUpdate = async (user) => {
        setEditUserModalPreview(true);
        setIsLoadingModalEdit(true)
        // const roles = await getRoles()
        setRoles(rolesData.data)
        setUser({
            id: user.id,
            firstName: user.user_profile?.first_name,
            lastName: user.user_profile?.last_name,
            email: user.email,
            gender: user.gender,
            phoneNumber: user.phone_number,
            birthdate: user.user_profile?.birthdate,
            roles: user.roles?.map((x) => {
                return {
                    label: x.name,
                    value: x.id
                }
            })
        })
        setIsLoadingModalEdit(false)
    }

    const updateUser = useCallback(async (event) => {
        event.preventDefault();
        // try {
        //     const params = {
        //         first_name: user.firstName,
        //         last_name: user.lastName,
        //         birthdate: moment(user.birthdate).format("YYYY-MM-DD"),
        //         email: user.email,
        //         phone_number: user.phoneNumber,
        //         gender: user.gender
        //     }
        //     await updateUserById(params, user.id);
        //     const paramsRole = {
        //         user_id: user.id,
        //         roles: user.roles.map(x => x.label),
        //     }
        //     const res = await updateUserRole(paramsRole)
        //     const newList = usersList.map((item) => {
        //         if (item.id === user.id) {
        //             return {
        //                 ...item,
        //                 user_profile: {
        //                     first_name: res.user_profile.first_name,
        //                     last_name: res.user_profile.last_name,
        //                     birthdate: moment(res.user_profile.birthdate).format("YYYY-MM-DD"),
        //                     phone_number: res.user_profile.phone_number,
        //                 },
        //                 email: res.email,
        //                 gender: res.gender,
        //                 roles: res.roles.map(x => {
        //                     return {
        //                         id: x.id,
        //                         name: x.name
        //                     }
        //                 })
        //             }
        //         } else {
        //             return {
        //                 ...item
        //             }
        //         }
        //     });
        //     setUsersList(newList)
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
        //
        // }
        setEditUserModalPreview(false)
    }, [user]);

    useEffect(() => {
        setValue('firstName', user.firstName);
        setValue('lastName', user.lastName);
        setValue('email', user.email);
        setValue('gender', user.gender);
        setValue('phoneNumber', user.phoneNumber);
        setValue('date', user.birthdate);
        setValue('roles', user.roles);
    }, [user]);

    function handleDatePicker(e) {
        setValue('date', e.value)
        setUser(prevState => {
            return {
                ...prevState,
                birthdate: e
            }
        })
    }

    const Loading = () => {
        return (
            <>
                <ModalHeader>
                    <Skeleton width={200}/>
                </ModalHeader>
                <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                    <div className="col-span-12">
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
                </ModalFooter>
            </>
        )
    }
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setValue(name, value);
        setUser((prevUser) => ({...prevUser, [name]: value}));
    };

    return (
        isLoading ? (
            <div>
                <div className="intro-y flex items-center mt-8">
                    <div className="mr-auto">
                        <Skeleton width={80}/>
                    </div>
                    <div className="w-full sm:w-auto flex mr-2 sm:mt-0 sm:ml-auto md:ml-0">
                        <Skeleton width={200}/>
                    </div>
                    <div className={'ml-auto flex'}>
                        <Skeleton width={100}/>
                        <Skeleton width={100} className={'ml-2'}/>
                    </div>
                </div>
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-10">
                    <div className="grid grid-cols-12 gap-6 mt-5 w-full">
                        <div className="intro-y box col-span-12 md:col-span-6 lg:col-span-4">
                            <div
                                className="-mt-2 image-fit rounded-md overflow-hidden">
                                <Skeleton height={200}/>
                                <div className="absolute bottom-0 px-5 pb-6 z-10">
                                    <Skeleton width={200}/>
                                    <Skeleton width={100}/>
                                </div>
                            </div>
                            <div className="text-center lg:text-left p-5">

                                <div
                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                    <Skeleton width={90}/>
                                </div>
                                <div
                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                    <Skeleton width={170}/>
                                </div>
                                <div
                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                    <Skeleton width={70}/>
                                </div>
                            </div>
                        </div>
                        <div className="intro-y box col-span-12 md:col-span-6 lg:col-span-4">
                            <div
                                className="-mt-2 image-fit rounded-md overflow-hidden">
                                <Skeleton height={200}/>
                                <div className="absolute bottom-0 px-5 pb-6 z-10">
                                    <Skeleton width={200}/>
                                    <Skeleton width={100}/>
                                </div>
                            </div>
                            <div className="text-center lg:text-left p-5">

                                <div
                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                    <Skeleton width={90}/>
                                </div>
                                <div
                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                    <Skeleton width={170}/>
                                </div>
                                <div
                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                    <Skeleton width={70}/>
                                </div>
                            </div>
                        </div>
                        <div className="intro-y box col-span-12 md:col-span-6 lg:col-span-4">
                            <div
                                className="-mt-2 image-fit rounded-md overflow-hidden">
                                <Skeleton height={200}/>
                                <div className="absolute bottom-0 px-5 pb-6 z-10">
                                    <Skeleton width={200}/>
                                    <Skeleton width={100}/>
                                </div>
                            </div>
                            <div className="text-center lg:text-left p-5">

                                <div
                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                    <Skeleton width={90}/>
                                </div>
                                <div
                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                    <Skeleton width={170}/>
                                </div>
                                <div
                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                    <Skeleton width={70}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            userFill ?
                (
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
                                    <Loading/>
                                ) : (
                                    <>
                                        <ModalHeader>
                                            <h2 className="font-medium text-base mr-auto">
                                                Add new User
                                            </h2>
                                        </ModalHeader>
                                        <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-1"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    First Name
                                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, first name
</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    {...register('firstName', {required: true})}
                                                    onChange={handleInputChange}
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.firstName,
                                                    })}
                                                    placeholder="First Name"
                                                />
                                                {errors.firstName && (
                                                    <div className="text-danger mt-2">
                                                        {errors.firstName.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-1"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Last Name
                                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, last name
</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    {...register("lastName")}
                                                    onChange={handleInputChange}
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.lastName,
                                                    })}
                                                    placeholder="Last Name"
                                                />
                                                {errors.lastName && (
                                                    <div className="text-danger mt-2">
                                                        {errors.lastName.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-2"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Email
                                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, email address format
</span>
                                                </label>
                                                <input
                                                    {...register("email")}
                                                    type="email"
                                                    name="email"
                                                    onChange={handleInputChange}
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
                                                    htmlFor="validation-form-1"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Gender
                                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, gender
</span>
                                                </label>
                                                <div className="mt-3">
                                                    <div className="flex flex-col sm:flex-row mt-2">
                                                        <div className="form-check mr-2">
                                                            <input
                                                                {...register("gender")}
                                                                onClick={(e) => {
                                                                    setUser(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            gender: e.target['value']
                                                                        }
                                                                    })
                                                                    setValue("gender", e.target['value'])
                                                                }}
                                                                id="radio-switch-4"
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="vertically_radio_button"
                                                                value="Male"
                                                            />
                                                            <span
                                                                className="form-check-label"
                                                                htmlFor="radio-switch-4"
                                                            >Male</span>
                                                        </div>
                                                        <div className="form-check ml-6 mr-2 mt-2 sm:mt-0">
                                                            <input
                                                                {...register("gender")}
                                                                onClick={(e) => {
                                                                    setUser(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            gender: e.target['value']
                                                                        }
                                                                    })
                                                                    setValue("gender", e.target['value'])
                                                                }}
                                                                id="radio-switch-5"
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="vertically_radio_button"
                                                                value="Female"
                                                            />
                                                            <span
                                                                className="form-check-label"
                                                                htmlFor="radio-switch-5"
                                                            >
Female
</span>
                                                        </div>
                                                        <div className="form-check ml-6 mr-2 mt-2 sm:mt-0">
                                                            <input
                                                                {...register("gender")}
                                                                onClick={(e) => {
                                                                    setUser(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            gender: e.target['value']
                                                                        }
                                                                    })
                                                                    setValue("gender", e.target['value'])
                                                                }}
                                                                id="radio-switch-6"
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="vertically_radio_button"
                                                                value="Other"
                                                            />
                                                            <span
                                                                className="form-check-label"
                                                                htmlFor="radio-switch-6"
                                                            >
Other
</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-2"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Phone Number
                                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Phone number is required
</span>
                                                </label>
                                                <input
                                                    {...register("phoneNumber")}
                                                    id="validation-form-2"
                                                    type="text"
                                                    name="phoneNumber"
                                                    onChange={handleInputChange}
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.phone_number,
                                                    })}
                                                    placeholder="Phone Number"
                                                />
                                                {errors.phone_number && (
                                                    <div className="text-danger mt-2">
                                                        {errors.phone_number.message}
                                                    </div>
                                                )}
                                            </div>


                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-3"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Birthdate
                                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, birthdate
</span>
                                                </label>
                                                <Litepicker
                                                    value={user.birthdate}
                                                    onChange={(e) => setUser(prevState => {
                                                        return {
                                                            ...prevState,
                                                            birthdate: e
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
                                                {errors.birthdate && (
                                                    <div className="text-danger mt-2">
                                                        {errors.birthdate.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-4"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Roles
                                                    <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
Required, at least one Role
</span>
                                                </label>
                                                <Select
                                                    isMulti
                                                    options={options}
                                                    components={animatedComponents}
                                                    value={selectMultiple}
                                                    onChange={setSelectMultiple}
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
                        <Modal
                            show={editUserModalPreview}
                            onHidden={() => {
                                setEditUserModalPreview(false);
                            }}
                            size={'modal-xl'}
                        >
                            <form className="validate-form" onSubmit={updateUser}>
                                {isLoadingModalEdit ? (
                                    <Loading/>
                                ) : (
                                    <>
                                        <ModalHeader>
                                            <h2 className="font-medium text-base mr-auto">
                                                Edit User
                                            </h2>
                                        </ModalHeader>
                                        <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-1"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    First Name
                                                </label>
                                                <input
                                                    {...register("firstName")}
                                                    id="validation-form-1"
                                                    type="text"
                                                    name="firstName"
                                                    onInput={(e) => setUser(prevState => {
                                                        return {
                                                            ...prevState,
                                                            firstName: e.target['value']
                                                        }
                                                    })}
                                                    defaultValue={user.firstName}
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.firstName,
                                                    })}
                                                    placeholder="First Name"
                                                />
                                                {errors.firstName && (
                                                    <div className="text-danger mt-2">
                                                        {errors.firstName.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-1"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Last Name
                                                </label>
                                                <input
                                                    {...register("lastName")}
                                                    id="validation-form-1"
                                                    type="text"
                                                    name="lastName"
                                                    onInput={(e) => setUser(prevState => {
                                                        return {
                                                            ...prevState,
                                                            lastName: e.target['value']
                                                        }
                                                    })}
                                                    defaultValue={user.lastName}
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.lastName,
                                                    })}
                                                    placeholder="Last Name"
                                                />
                                                {errors.lastName && (
                                                    <div className="text-danger mt-2">
                                                        {errors.lastName.message}
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
                                                    onInput={(e) => setUser(prevState => {
                                                        return {
                                                            ...prevState,
                                                            email: e.target['value']
                                                        }
                                                    })}
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.email,
                                                    })}
                                                    defaultValue={user.email}
                                                    placeholder="Email"
                                                />
                                                {errors.email && (
                                                    <div className="text-danger mt-2">
                                                        {errors.email.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-1"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Gender
                                                </label>
                                                <div className="mt-3">
                                                    <div className="flex flex-col sm:flex-row mt-2">
                                                        <div className="form-check mr-2">
                                                            <input
                                                                {...register("gender")}
                                                                onClick={(e) => {
                                                                    setUser(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            gender: e.target['value']
                                                                        }
                                                                    })
                                                                    setValue("gender", e.target['value'])
                                                                }}
                                                                id="radio-switch-4"
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="vertically_radio_button"
                                                                value="Male"
                                                            />
                                                            <span
                                                                className="form-check-label"
                                                                htmlFor="radio-switch-4">Male</span>
                                                        </div>
                                                        <div className="form-check ml-6 mr-2 mt-2 sm:mt-0">
                                                            <input
                                                                {...register("gender")}
                                                                onClick={(e) => {
                                                                    setUser(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            gender: e.target['value']
                                                                        }
                                                                    })
                                                                    setValue("gender", e.target['value'])
                                                                }}
                                                                id="radio-switch-5"
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="vertically_radio_button"
                                                                value="Female"
                                                            />
                                                            <span
                                                                className="form-check-label"
                                                                htmlFor="radio-switch-5">Female</span>
                                                        </div>
                                                        <div className="form-check ml-6 mr-2 mt-2 sm:mt-0">
                                                            <input
                                                                {...register("gender")}
                                                                onClick={(e) => {
                                                                    setUser(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            gender: e.target['value']
                                                                        }
                                                                    })
                                                                    setValue("gender", e.target['value'])
                                                                }}
                                                                id="radio-switch-6"
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="vertically_radio_button"
                                                                value="Other"
                                                            />
                                                            <span
                                                                className="form-check-label"
                                                                htmlFor="radio-switch-6">Other</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-2"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Phone Number
                                                </label>
                                                <input
                                                    {...register("phoneNumber")}
                                                    id="validation-form-2"
                                                    type="text"
                                                    name="phoneNumber"
                                                    onInput={(e) => setUser(prevState => {
                                                        return {
                                                            ...prevState,
                                                            phoneNumber: e.target['value']
                                                        }
                                                    })}
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.phone_number,
                                                    })}
                                                    defaultValue={user.phoneNumber}
                                                    placeholder="Phone Number"
                                                />
                                                {errors.phone_number && (
                                                    <div className="text-danger mt-2">
                                                        {errors.phone_number.message}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-3"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Birthdate
                                                </label>
                                                <Litepicker
                                                    getRef={(e) => setValue('date', e.value)}
                                                    value={user.birthdate}
                                                    onChange={(e) => handleDatePicker(e)}
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
                                                {errors.birthdate && (
                                                    <div className="text-danger mt-2">
                                                        {errors.birthdate.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="validation-form-4"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Roles
                                                </label>
                                                <Select
                                                    isMulti
                                                    {...register("roles")}
                                                    options={options}
                                                    components={animatedComponents}
                                                    value={user.roles}
                                                    onChange={(e) => setUser(prevState => {
                                                        return {
                                                            ...prevState,
                                                            roles: e
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
                                                onClick={() => setEditUserModalPreview(false)}
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
                            show={deleteModalPreview}
                            onHidden={() => {
                                setDeleteModalPreview(false);
                            }}
                        >
                            <ModalBody className="p-0">
                                <div className="p-5 text-center">
                                    <Lucide
                                        icon="UserMinus"
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
                                    <button onClick={deleteUser} type="button" className="btn btn-danger w-24">
                                        Delete
                                    </button>
                                </div>
                            </ModalBody>
                        </Modal>
                        <div className="grid grid-cols-12 gap-6 mt-5">
                            <div
                                className="intro-y col-span-12 flex justify-between flex-wrap sm:flex-nowrap items-center mt-2">
                                <h2 className="intro-y text-lg font-medium mt-2">Users</h2>

                                <div className="w-full sm:w-auto flex mr-2 sm:mt-0 sm:ml-auto md:ml-0">
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
                                <div className={'flex'}>
                                    <button className="btn btn-primary shadow-md mr-2"
                                            onClick={() => onCreate()}>
                                        Add New User
                                    </button>
                                    <Link
                                        to={`/users/invite`}
                                    >
                                        <button className="btn btn-primary shadow-md mr-2">
                                            Invite user
                                        </button>
                                    </Link>
                                </div>

                            </div>
                            <div
                                id="success-notification-content"
                                className="toastify-content hidden flex"
                            >
                                <Lucide icon="CheckCircle" className="text-success"/>
                                <div className="ml-4 mr-4">
                                    <div className="text-slate-500 mt-1">
                                        User deleted successfully!
                                    </div>
                                </div>
                            </div>
                            <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                                <div className="grid grid-cols-12 gap-6 mt-5 w-full">
                                    {usersList.map((user, i) => (<div
                                        key={i}
                                        className="intro-y col-span-12 md:col-span-6 lg:col-span-4"
                                    >
                                        <div className="box">
                                            <div
                                                className="h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0
before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                                <img
                                                    alt="Midone - HTML Admin Template"
                                                    className="rounded-md"
                                                    src={user.user_profile.profile_picture}
                                                />

                                                <div className="absolute bottom-0 text-white px-5 pb-6 z-10">
                                                    <a href="" className="block font-medium text-base">
                                                        {user.user_profile.first_name} {user.user_profile.last_name}

                                                    </a>
                                                    <span className="text-white/90 text-xs mt-3">{user.roles[0].name}
</span>
                                                </div>
                                            </div>
                                            <div className="flex z-50 z-[5] items-start px-5 pt-5">

                                                <Dropdown className="absolute z-50 right-0 top-0 mr-5 mt-3">
                                                    <DropdownToggle tag="a" className="w-5 h-5 block" href="#">
                                                        <Lucide
                                                            icon="MoreHorizontal"
                                                            className="w-5 h-5 text-slate-500"
                                                        />
                                                    </DropdownToggle>
                                                    <DropdownMenu className="w-40">
                                                        <DropdownContent>
                                                            <DropdownItem onClick={() => onUpdate(user)}>
                                                                <Lucide icon="Edit2" className="w-4 h-4 mr-2"/> Edit
                                                            </DropdownItem>
                                                            <DropdownItem onClick={() => onDelete(user.id)}>
                                                                <Lucide icon="Trash" className="w-4 h-4 mr-2"/> Delete
                                                            </DropdownItem>
                                                        </DropdownContent>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                            <div className="text-center lg:text-left p-5">

                                                <div
                                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                                    <Lucide icon="Phone" className="w-3 h-3 mr-2"/>
                                                    {user.phone_number}
                                                </div>
                                                <div
                                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                                    <Lucide icon="Mail" className="w-3 h-3 mr-2"/>
                                                    {user.email}
                                                </div>
                                                <div
                                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-2">
                                                    <Lucide icon="Instagram" className="w-3 h-3 mr-2"/>
                                                    {user.user_profile.first_name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>))}
                                </div>
                            </div>
                            <Pagination {...paginationAttributes}
                                        onPrevClick={onPrevClick}
                                        onNextClick={onNextClick}
                                        onPageChange={onPageChange}
                                        onChange={onChange}
                                        onEdit={(id) => onEdit(id)}
                                        onDelete={(id) => onDelete(id)}/>
                        </div>
                    </>) : (<>
                    <div className="container">
                        <div
                            className="intro-y col-span-12 flex justify-between flex-wrap sm:flex-nowrap items-center mt-2">
                            <h2 className="intro-y text-lg font-medium mt-2">Users Layout</h2>

                            <div className={'flex'}>
                                <Link
                                    to={`/users/create`}
                                >
                                    <button className="btn btn-primary shadow-md mr-2">
                                        Add New User
                                    </button>
                                </Link>
                                <Link
                                    to={`/users/invite`}
                                >
                                    <button className="btn btn-primary shadow-md mr-2">
                                        Invite user
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div
                            className="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left">
                            <div>
                                <div className={'flex flex-col items-center justify-center text-center'}>
                                    <Lucide icon="Info" className="h-12 justify-center "/>
                                </div>
                                <div style={{color: 'grey'}} className="intro-x text-xl lg:text-3xl font-medium mt-5">
                                    At this moment there are no user's available yet
                                </div>
                            </div>
                        </div>
                    </div>
                </>)));
}

export default Main;
