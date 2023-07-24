import {
    LoadingIcon,
    Lucide,
    Tippy,
    Notification,
    Dropdown,
    DropdownContent,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from "@/components";
import classnames from "classnames";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    deleteNotificationById,
    getNotificationsWithPagination,
    getUnReadNotificationsWithPagination,
    markAllNotificationsAsRead,
    markNotificationAsReadById
} from "../../../routes/routes";
import useError from "../../../hooks/useError";
import moment from "moment";
import {BsCircleFill} from "@react-icons/all-files/bs/BsCircleFill";
import {useNavigate} from "react-router-dom";

function Main() {
    const setError = useError();
    const deleteNotificationModal = useRef();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [active, setActive] = useState('1');
    const [isLoadingComponent, setIsLoadingComponent] = useState(false);
    const [loading, setLoading] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [pageNum, setPageNum] = useState(1)

    const fetchNotifications = async () => {
        setLoading(true)
        if (pageNum === 1) {
            setIsLoadingComponent(true)
        }
        switch (active) {
            case '1':
                try {
                    const response = await getNotificationsWithPagination(pageNum)
                    setNotifications(prev => [...prev, ...response.data])
                    if (pageNum === 1) {
                        setIsLoadingComponent(false)
                    }
                    setHasNextPage(Boolean(response.data.length))
                    setLoading(false)
                } catch (err) {
                    setError(err);
                    setLoading(false)
                    setIsLoadingComponent(false)
                }
                break;
            case '2':
                try {
                    const res = await getUnReadNotificationsWithPagination(pageNum)
                    setNotifications(prev => [...prev, ...res.data])
                    setHasNextPage(Boolean(res.data.length))
                    setLoading(false)
                    setIsLoadingComponent(false)
                } catch (err) {
                    setLoading(false)
                    setError(err)
                }
                break;
        }
        setLoading(false)
    };

    useEffect(() => {
        fetchNotifications();
    }, [pageNum, active])

    const intObserver = useRef()
    const lastPostRef = useCallback(data => {
        if (loading) return
        if (intObserver.current) intObserver.current.disconnect()
        intObserver.current = new IntersectionObserver(res => {
            if (res[0].isIntersecting && hasNextPage) {
                setPageNum(prev => prev + 1)
            }
        })
        if (data) intObserver.current.observe(data)
    }, [loading, hasNextPage, notifications])

    const markNotificationAsRead = useCallback(async (notificationId) => {
        try {
            await markNotificationAsReadById(notificationId)
            const newList = notifications.map((item) => {
                if (item.id === notificationId) {
                    return {
                        ...item, read_at: new Date().toDateString()
                    }
                } else {
                    return {...item}
                }
            });
            setNotifications(newList)
        } catch (err) {
            setError(err)
        }
    }, [notifications, active])

    const handleReadNotifications = useCallback(async (event) => {
        setPageNum(1)
        setNotifications([])
        setActive(event.target.id);
    }, [active])


    const handleUnreadNotifications = useCallback(async (event) => {
        setActive(event.target.id);
        setPageNum(1)
        setNotifications([])
    }, [active])

    const deleteNotification = useCallback(async (notificationId) => {
        try {
            await deleteNotificationById(notificationId)
            const newList = notifications.filter((item) => item.id !== notificationId);
            setNotifications(newList)
            deleteNotificationModal.current.showToast();
        } catch (err) {
            setError(err)
        }
    }, [notifications])

    const markNotificationsAsRead = useCallback(async () => {
        try {
            await markAllNotificationsAsRead()
            const newNotificationsList = notifications.map((item) => {
                return {
                    ...item, read_at: new Date().toDateString()
                }
            });
            setNotifications(newNotificationsList)
        } catch (err) {
            setError(err)
        }
    }, [notifications, active])
    return (
        <>
            <div className="grid grid-cols-12 gap-6 mt-8">
                <Notification
                    getRef={(el) => {
                        deleteNotificationModal.current = el;
                    }}
                    options={{
                        duration: 2000,
                    }}
                    className="flex"
                >
                    <Lucide icon="CheckCircle" className="text-success"/>
                    <div className="ml-4 mr-4">
                        <div className="font-medium">Notification Removed!</div>
                    </div>
                </Notification>
                <div className="col-span-12 lg:col-span-3 2xl:col-span-2">
                    <h2 className="intro-y text-lg font-medium mr-auto mt-2">Notifications</h2>
                </div>
                <div className="col-span-12 lg:col-span-12 2xl:col-span-12">
                    {/* BEGIN: Inbox Content */}
                    <div className="intro-y inbox box mt-5">
                        <div
                            className="p-5 flex flex-col-reverse  sm:flex-row text-slate-500 border-b border-slate-200/60">
                            <div
                                className="flex items-center w-full px-5 ">
                                <button
                                    key={1}
                                    type="button"
                                    id={'1'}
                                    className={active === '1' ? "btn box box-shadow-none mr-2 flex border-cyan-900 items-center  sm:ml-0" : 'btn box box-shadow-none mr-2 flex items-center  sm:ml-0'}
                                    onClick={handleReadNotifications}
                                >
                                    All
                                </button>
                                <button
                                    key={2}
                                    type="button"
                                    id={'2'}
                                    className={active === '2' ? "btn box box-shadow-none mr-2 flex border-cyan-900 items-center  sm:ml-0" : 'btn box box-shadow-none mr-2 flex items-center  sm:ml-0'}
                                    onClick={handleUnreadNotifications}
                                >
                                    Unread
                                </button>
                                <Dropdown className="z-50 ml-auto items-center">
                                    <DropdownToggle tag="a" className="w-5 h-5 block" href="#">
                                        <Lucide
                                            icon="MoreHorizontal"
                                            className="w-5 h-5 text-slate-500"
                                        />
                                    </DropdownToggle>
                                    <DropdownMenu className="w-48">
                                        <DropdownContent>
                                            <DropdownItem onClick={markNotificationsAsRead}>
                                                <Lucide icon="Check" className="w-4 h-4 mr-2"/> Mark all as read
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => navigate('/profile/notifications', {replace: true})}>
                                                <Lucide icon="Settings" className="w-4 h-4 mr-2"/> Notification
                                                Settings
                                            </DropdownItem>
                                        </DropdownContent>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                        {active === '1' && notifications && (
                            isLoadingComponent ? (
                                <div
                                    className="col-span-6 sm:col-span-3 xl:col-span-2 mt-8 grid place-items-center">
                                    <LoadingIcon icon="puff" className="w-10 h-10"/>
                                </div>
                            ) : (
                                <div>
                                    <div className="overflow-x-auto sm:overflow-x-visible">
                                        {notifications.length !== 0 ? (notifications.map((notification, index) => (
                                            <div key={index} ref={lastPostRef}>
                                                <div
                                                    className={classnames({
                                                        "inbox__item inline-block w-full sm:block text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-darkmode-400/70 border-b border-slate-200/60 dark:border-darkmode-400": true,
                                                        "inbox__item--active": !notification.read_at,
                                                    })}
                                                >

                                                    <div className="flex px-5 py-3">
                                                        <div className="w-full sm:w-auto flex truncate">
                                                            {notification.read_at !== null ?
                                                                <div className={'ml-3'}></div> :
                                                                <Tippy variant="primary"
                                                                       className={'self-center mb-0.5'}
                                                                       content="Mark notification as read"
                                                                       options={{
                                                                           theme: "light",
                                                                       }}>
                                                                    <span
                                                                        onClick={() => markNotificationAsRead(notification.id)}
                                                                        className={'mt-1 cursor-pointer'}
                                                                        style={{fontSize: 10}}><BsCircleFill/></span>
                                                                </Tippy>
                                                            }
                                                            <span
                                                                className="inbox__item--highlight ml-4 self-center">
                                                     {notification.data?.notification}
                                                  </span>
                                                        </div>
                                                        <div
                                                            className="inbox__item--time flex whitespace-nowrap ml-auto self-center pl-10">
                                                            <Tippy variant="primary"
                                                                   className={'self-center mb-0.5'}
                                                                   content="Remove this notification" options={{
                                                                theme: "light",
                                                            }}>
                                                                <Lucide icon="X"
                                                                        onClick={() => deleteNotification(notification.id)}
                                                                        className="mr-3 w-5 text-center h-5 self-center"/>
                                                            </Tippy>
                                                            {moment(notification.created_at).format("HH:mm")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))) : (
                                            <div
                                                className="col-span-12 sm:col-span-3 lg:col-span-12 xl:col-span-1 flex mt-8 justify-center items-center">
                                                <div className="m-auto">
                                                    <Lucide icon="FolderMinus" color={'#bfbfbf70'}
                                                            className="block mx-auto w-20 h-20"/>
                                                    <div className="text-center text-lg text-gray-400 mt-2">No Data
                                                    </div>
                                                </div>
                                            </div>)}

                                    </div>
                                    {loading && <div
                                        className="col-span-6 sm:col-span-3 xl:col-span-2 grid ml-12"
                                        style={{display: 'flex'}}>
                                        Loading more <LoadingIcon icon="three-dots" className="w-5 h-5 ml-2 "/>
                                    </div>}
                                </div>)
                        )}
                        {active === '2' && notifications && (
                            isLoadingComponent ? (
                                <div
                                    className="col-span-6 sm:col-span-3 xl:col-span-2 grid mt-8 place-items-center">
                                    <LoadingIcon icon="puff" className="w-10 h-10"/>
                                </div>
                            ) : (
                                <div>
                                    <div className="overflow-x-auto sm:overflow-x-visible">
                                        {notifications.length !== 0 ? (notifications.map((notification, index) => (
                                            <div key={index} ref={lastPostRef}>
                                                <div
                                                    className={classnames({
                                                        "inbox__item inline-block sm:block text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-darkmode-400/70 border-b border-slate-200/60 dark:border-darkmode-400": true,
                                                        "inbox__item--active": !notification.read_at,
                                                    })}
                                                >

                                                    <div className="flex px-5 py-3">
                                                        <div className="w-64 sm:w-auto flex truncate">
                                                            {notification.read_at !== null ?
                                                                <div className={'ml-3'}></div> :
                                                                <Tippy variant="primary"
                                                                       className={'self-center mb-0.5'}
                                                                       content="Mark notification as read"
                                                                       options={{
                                                                           theme: "light",
                                                                       }}>
                                                                    <span
                                                                        onClick={() => markNotificationAsRead(notification.id)}
                                                                        className={'mt-1 cursor-pointer'}
                                                                        style={{fontSize: 10}}><BsCircleFill/></span>
                                                                </Tippy>
                                                            }
                                                            <span
                                                                className="inbox__item--highlight ml-4 self-center">
                                                     {notification.data?.notification}
                                                  </span>
                                                        </div>
                                                        <div
                                                            className="inbox__item--time flex whitespace-nowrap ml-auto self-center pl-10">
                                                            <Tippy variant="primary"
                                                                   className={'self-center mb-0.5'}
                                                                   content="Remove this notification" options={{
                                                                theme: "light",
                                                            }}>
                                                                <Lucide icon="X"
                                                                        onClick={() => deleteNotification(notification.id)}
                                                                        className="mr-3 w-5 text-center h-5 self-center"/>
                                                            </Tippy>
                                                            {moment(notification.created_at).format("HH:mm")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))) : (
                                            <div
                                                className="col-span-12 sm:col-span-3 lg:col-span-12 xl:col-span-1 flex mt-8 justify-center items-center">
                                                <div className="m-auto">
                                                    <Lucide icon="FolderMinus" color={'#bfbfbf70'}
                                                            className="block mx-auto w-20 h-20"/>
                                                    <div className="text-center text-lg text-gray-400 mt-2">No Data
                                                    </div>
                                                </div>
                                            </div>)}

                                    </div>
                                    {loading && <div
                                        className="col-span-6 sm:col-span-3 xl:col-span-2 grid ml-12 mt-2"
                                        style={{display: 'flex'}}>
                                        Loading more <LoadingIcon icon="three-dots" className="w-5 h-5 ml-2  "/>
                                    </div>}
                                </div>
                            )
                        )}
                        <div
                            className="p-5 flex flex-col sm:flex-row items-center text-center sm:text-left self-center text-slate-500">
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Main;
