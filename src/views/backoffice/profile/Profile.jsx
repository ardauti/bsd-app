import {
    Accordion, AccordionGroup, AccordionItem, AccordionPanel,
    LoadingIcon,
    Lucide,
    Tab,
    TabGroup,
    TabList,
    TabPanels
} from "../../../components";
import {faker as $f} from "@/utils";
import {User} from "../../../services/User";
import React, {useEffect, useState} from 'react';
import EditUserInfo from "./edit-profile/update-user-info";
import Settings from "./edit-profile/settings";
import useError from "../../../hooks/useError";
import {getNotificationsSettings, NotificationTypes} from "../../../routes/routes";
import {Switch} from "@mui/material";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import Skeleton from "react-loading-skeleton";

function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [activeTab, setActiveTab] = useState('')
    const [notificationSettings, setNotificationSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const setError = useError()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (location.pathname === '/profile') {
            navigate('/profile/update-profile')
        }
    }, [location.pathname])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await getNotificationsSettings()
                setNotificationSettings(response)
                setIsLoading(false)
            } catch (err) {
                setError(err)
            }
        }
        let url = window.location.href
        let arrayUrl = url.split('/')
        setActiveTab(arrayUrl[arrayUrl.length - 1])
        if (arrayUrl[arrayUrl.length - 1] === 'update-profile') {
            setActiveTab('update-profile')
            setSelectedIndex(0)
        } else if (arrayUrl[arrayUrl.length - 1] === 'notifications') {
            setActiveTab('notifications')
            setSelectedIndex(1)
        } else if (arrayUrl[arrayUrl.length - 1] === 'settings') {
            setActiveTab('settings')
            setSelectedIndex(2)
        }
        fetchData()
    }, [])

    const handleClick = async (e, key, value, notificationTypeId, param) => {
        let newNotifications = [...notificationSettings];
        let params = {}
        switch (param) {
            case 'status':
                params = {
                    status: value,
                }
                newNotifications[key].status = value
                break
            case 'broadcast':
                params = {
                    broadcast: value,
                }
                newNotifications[key].broadcast = value
                break
            case 'mail':
                params = {
                    mail: value,
                }
                newNotifications[key].mail = value
                break
            case 'sms':
                params = {
                    sms: value,
                }
                newNotifications[key].sms = value
                break
        }
        setNotificationSettings(newNotifications)
        await NotificationTypes(notificationTypeId, params)
    }

    function toggleFunction(id) {
        setOpen({
            [id]: !open[id],
        });
    }

    return (
        isLoading ? (
            <div>
                <div className="intro-y box px-5 pt-5 mt-5">
                    <div
                        className="flex flex-col lg:flex-row border-b border-slate-200/60 dark:border-darkmode-400 pb-5 -mx-5">
                        <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
                                <Skeleton circle width={100} height={100}/>
                            </div>
                            <div className="ml-5">
                                <Skeleton width={110}/>
                                <Skeleton width={100}/>
                            </div>
                        </div>
                        <div
                            className="mt-6 lg:mt-0 flex-1 px-5 border-l border-r border-slate-200/60 dark:border-darkmode-400 border-t lg:border-t-0 pt-5 lg:pt-0">
                            <div className="lg:mt-3">
                                <Skeleton width={80}/>
                            </div>
                            <div className="flex flex-col justify-center items-center lg:items-start mt-4">
                                <div className="truncate sm:whitespace-normal flex items-center">
                                    <Skeleton width={100}/>
                                </div>
                                <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                    <Skeleton width={100}/>
                                </div>
                                <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                    <Skeleton width={100}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="nav-link-tabs flex-col sm:flex-row  lg:justify-between flex lg:justify-between text-center">
                        <div className='cursor-pointer'>
                            <div
                                className="py-4 flex items-center "
                            >
                                <Skeleton width={120}/>
                            </div>
                        </div>
                        <div className='cursor-pointer'>
                            <div

                                className="py-4 flex items-center "
                            >
                                <Skeleton width={120}/>
                            </div>
                        </div>
                        <div className='cursor-pointer'>
                            <div
                                className="py-4 flex items-center "
                            >
                                <Skeleton width={120}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mt-5">
                        {activeTab === 'update-profile' && <div className="leading-relaxed">
                            <EditUserInfo/>
                        </div>
                        }
                        {activeTab === 'notifications' && <div className="leading-relaxed">
                            <div className={'w-full mx-auto intro-y box'}>
                                <>
                                    <div
                                        className="flex flex-col border-b-2 sm:flex-row items-center p-5 ">
                                        <Skeleton width={300}/>
                                    </div>
                                    <div className="p-5">
                                        <div className={'mt-5'}>
                                            <div className={'p-3 flex items-center'}>
                                                <div>
                                                    <Skeleton width={200}/>
                                                    <Skeleton width={120}/>
                                                </div>
                                                <div className="ml-auto">
                                                    <Skeleton width={20}/>
                                                </div>
                                            </div>
                                            <div className={'p-3 flex items-center'}>
                                                <div>
                                                    <Skeleton width={200}/>
                                                    <Skeleton width={120}/>
                                                </div>
                                                <div className="ml-auto">
                                                    <Skeleton width={20}/>
                                                </div>
                                            </div>
                                            <div className={'p-3 flex items-center'}>
                                                <div>
                                                    <Skeleton width={200}/>
                                                    <Skeleton width={120}/>
                                                </div>
                                                <div className="ml-auto">
                                                    <Skeleton width={20}/>
                                                </div>
                                            </div>
                                            <div className={'p-3 flex items-center'}>
                                                <div>
                                                    <Skeleton width={200}/>
                                                    <Skeleton width={120}/>
                                                </div>
                                                <div className="ml-auto">
                                                    <Skeleton width={20}/>
                                                </div>
                                            </div>
                                            <div className={'p-3 flex items-center'}>
                                                <div>
                                                    <Skeleton width={200}/>
                                                    <Skeleton width={120}/>
                                                </div>
                                                <div className="ml-auto">
                                                    <Skeleton width={20}/>
                                                </div>
                                            </div>
                                            <div className={'p-3 flex items-center'}>
                                                <div>
                                                    <Skeleton width={200}/>
                                                    <Skeleton width={120}/>
                                                </div>
                                                <div className="ml-auto">
                                                    <Skeleton width={20}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </div>
                        </div>}
                        {activeTab === 'settings' && <div className="leading-relaxed">
                            <Settings/>
                        </div>}
                    </div>
                </div>
            </div>
        ) : (
            <>
                <TabGroup selectedIndex={selectedIndex}>
                    {/* BEGIN: Profile Info */}
                    <div className="box px-5 pt-5 mt-5">
                        <div
                            className="flex flex-col lg:flex-row border-b border-slate-200/60 dark:border-darkmode-400 pb-5 -mx-5">
                            <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
                                    <img
                                        alt="Midone Tailwind HTML Admin Template"
                                        className="rounded-full"
                                        src={$f()[0].photos[0]}
                                    />
                                </div>
                                <div className="ml-5">
                                    <div className="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">
                                        {User.data.user_profile.display_name}
                                    </div>
                                    <div className="text-slate-500"> {User.data.roles[0]?.name}</div>
                                </div>
                            </div>
                            <div
                                className="mt-6 lg:mt-0 flex-1 px-5 border-l border-r border-slate-200/60 dark:border-darkmode-400 border-t lg:border-t-0 pt-5 lg:pt-0">
                                <div className="font-medium text-center lg:text-left lg:mt-3">
                                    Contact Details
                                </div>
                                <div className="flex flex-col justify-center items-center lg:items-start mt-4">
                                    <div className="truncate sm:whitespace-normal flex items-center">
                                        <Lucide icon="Mail" className="w-4 h-4 mr-2"/>
                                        {User.data?.email}
                                    </div>
                                    <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                        <Lucide icon="Instagram" className="w-4 h-4 mr-2"/>
                                        {User.data.user_profile.display_name}
                                    </div>
                                    <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                        <Lucide icon="Phone" className="w-4 h-4 mr-2"/>
                                        {User.data.phone_number}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <TabList
                            className="nav-link-tabs flex-col sm:flex-row  lg:justify-between flex lg:justify-between text-center">
                            <div onClick={() => {
                                setActiveTab('update-profile')
                                navigate(location.pathname.split('/').slice(0, -1).join('/') + '/update-profile')
                            }
                            } className='cursor-pointer'>
                                <Tab
                                    fullWidth={false}
                                    className="py-4 flex items-center "
                                >
                                    <Lucide icon="User" className="cursor-pointer  w-4 h-4 mr-2"/>
                                    <div>Profile</div>
                                </Tab>
                            </div>
                            <div onClick={() => {
                                setActiveTab('notifications')
                                navigate(location.pathname.split('/').slice(0, -1).join('/') + '/notifications')

                            }} className='cursor-pointer'>
                                <Tab
                                    fullWidth={false}
                                    className="py-4 flex items-center "
                                >
                                    <Lucide icon="Bell" className=" cursor-pointer w-4 h-4 mr-2"/>
                                    <div>Notifications</div>
                                </Tab>
                            </div>
                            <div onClick={() => {
                                setActiveTab('settings')
                                navigate(location.pathname.split('/').slice(0, -1).join('/') + '/settings')
                            }} className='cursor-pointer'>
                                <Tab
                                    fullWidth={false}
                                    className="py-4 flex items-center "
                                >
                                    <Lucide icon="Settings" className="cursor-pointer w-4 h-4 mr-2"/>
                                    <div>Settings</div>
                                </Tab>
                            </div>
                        </TabList>
                    </div>
                    <TabPanels className="mt-5">
                        {activeTab === 'update-profile' && <div className="leading-relaxed">
                            <EditUserInfo/>
                        </div>
                        }
                        {activeTab === 'notifications' && <div className="leading-relaxed">
                            <div className={'w-full mx-auto intro-y box'}>
                                <>
                                    <div
                                        className="flex flex-col border-b-2 sm:flex-row items-center p-5 ">
                                        <h2 className="font-medium p-3 text-base mr-auto">
                                            What notifications you receive
                                        </h2>
                                    </div>
                                    <div className="p-5">
                                        <AccordionGroup>
                                            {notificationSettings.map((notification, i) => (
                                                <div
                                                    key={i}
                                                >
                                                    <div className={'mt-5'}>
                                                        <AccordionItem>
                                                            <div>
                                                                <div onClick={() => {
                                                                    toggleFunction(i)
                                                                }}>
                                                                    <Accordion
                                                                        className={'pm-0 hover:bg-slate-200 rounded-md '}>
                                                                        <div
                                                                            className={'p-3 flex items-center'}>
                                                                            <div
                                                                                className="text-base font-medium flex-col col-span-2 flex justify-start ">{notification.notification_type.display_text}
                                                                                <span className={''}>
                                                                                                {Boolean(notification.broadcast && !notification.mail && !notification.sms && notification.status) &&
                                                                                                    <span
                                                                                                        className={'font-normal text-sm'}> Broadcast only </span>}
                                                                                    {Boolean(notification.broadcast && notification.mail && !notification.sms && notification.status) &&
                                                                                        <span
                                                                                            className={'font-normal text-sm'}> Broadcast, Mail </span>}
                                                                                    {Boolean(notification.broadcast && notification.mail && notification.sms && notification.status) &&
                                                                                        <span
                                                                                            className={'font-normal text-sm'}> Broadcast, Mail, SMS </span>}
                                                                                    {Boolean(!notification.broadcast && notification.mail && !notification.sms && notification.status) &&
                                                                                        <span
                                                                                            className={'font-normal text-sm'}> Mail only </span>}
                                                                                    {Boolean(!notification.broadcast && notification.mail && notification.sms && notification.status) &&
                                                                                        <span
                                                                                            className={'font-normal text-sm'}> Mail, SMS </span>}
                                                                                    {Boolean(!notification.broadcast && !notification.mail && notification.sms && notification.status) &&
                                                                                        <span
                                                                                            className={'font-normal text-sm'}> SMS only </span>}
                                                                                    {Boolean(notification.broadcast && !notification.mail && notification.sms && notification.status) &&
                                                                                        <span
                                                                                            className={'font-normal text-sm'}> Broadcast, SMS </span>}
                                                                                    {Boolean(!notification.broadcast && !notification.mail && !notification.sms && notification.status) &&
                                                                                        <span
                                                                                            className={'font-normal text-sm'}> None </span>}
                                                                                    {Boolean(!notification.status) &&
                                                                                        <span
                                                                                            className={'font-normal text-sm'}> Off </span>}
                                                                                            </span>
                                                                            </div>
                                                                            <div
                                                                                className="ml-auto">
                                                                                <Lucide
                                                                                    className={`${open[i] && "rotate-180"} mt-2 w-5 h-5 ml-auto mr-2 duration-300 `}
                                                                                    icon="ChevronDown"/>
                                                                            </div>
                                                                        </div>
                                                                    </Accordion>
                                                                </div>
                                                                <AccordionPanel className={'pl-5 pb-4'}>
                                                                    <div>
                                                                        <div
                                                                            className={'font-medium text-base'}>There
                                                                            are notifications
                                                                            about {notification.notification_type.display_text}</div>
                                                                        <div
                                                                            className={'flex items-center w-full'}>
                                                                            <div
                                                                                className={'text-sm font-medium ml-5'}>Allow
                                                                                notification on project
                                                                            </div>
                                                                            <div className={'ml-auto mr-5'}>
                                                                                <Switch
                                                                                    onClick={(e) =>
                                                                                        handleClick(e, i, !notification.status, notification.notification_type.id, 'status')}
                                                                                    checked={Boolean(notification.status)}
                                                                                /></div>
                                                                        </div>
                                                                        <div
                                                                            className={'grid py-2 rounded items-center grid-flow-row-dense grid-cols-3 hover:bg-slate-200'}>
                                                                            <div
                                                                                className={'col-span-2 pl-4 flex '}>
                                                                                                <span> <Lucide
                                                                                                    icon='Radio'/></span>
                                                                                <span
                                                                                    className={'pl-4'}> Broadcast</span>
                                                                            </div>
                                                                            <div
                                                                                className={'flex justify-end pr-5 '}>
                                                                                <Switch
                                                                                    onClick={(e) =>
                                                                                        handleClick(e, i, !notification.broadcast, notification.notification_type.id, 'broadcast')}
                                                                                    checked={Boolean(notification.broadcast)}
                                                                                    disabled={!notification.status}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className={'grid py-2 rounded items-center grid-flow-row-dense grid-cols-3 hover:bg-slate-200'}>
                                                                            <div
                                                                                className={'col-span-2 pl-4 flex'}>
                                                                                                <span> <Lucide
                                                                                                    icon='Mail'/></span>
                                                                                <span
                                                                                    className={'pl-4'}> Mail</span>
                                                                            </div>
                                                                            <div
                                                                                className={'flex justify-end pr-5'}>
                                                                                <Switch
                                                                                    onClick={(e) =>
                                                                                        handleClick(e, i, !notification.mail, notification.notification_type.id, 'mail')}
                                                                                    checked={Boolean(notification.mail)}
                                                                                    disabled={!notification.status}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className={'grid py-2 rounded items-center grid-flow-row-dense grid-cols-3 pr-5 hover:bg-slate-200'}>
                                                                            <div
                                                                                className={'col-span-2 pl-4 flex '}>
                                                                                                <span> <Lucide
                                                                                                    icon='Vibrate'/></span>
                                                                                <span
                                                                                    className={'pl-4'}> Sms</span>
                                                                            </div>
                                                                            <div
                                                                                className={'flex justify-end'}>
                                                                                <Switch
                                                                                    onClick={(e) =>
                                                                                        handleClick(e, i, !notification.sms, notification.notification_type.id, 'sms')}
                                                                                    checked={Boolean(notification.sms)}
                                                                                    disabled={!notification.status}

                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </AccordionPanel>
                                                            </div>
                                                        </AccordionItem>
                                                    </div>
                                                </div>))}
                                        </AccordionGroup>
                                    </div>
                                </>
                            </div>
                        </div>}
                        {activeTab === 'settings' && <div className="leading-relaxed">
                            <Settings/>
                        </div>}
                    </TabPanels>
                </TabGroup>
            </>)
    );
}

export default Profile
