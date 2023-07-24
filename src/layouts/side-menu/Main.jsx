import React, {useState, useEffect, useMemo, useRef} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Notification} from "@/components";
import GlobalNav from "@/components/global-nav/Main.jsx";
import GlobalNavMobile from "@/components/global-nav/Mobile.jsx";
import AsideNav from "../../components/aside-nav/Main";
import {User} from "../../services/User";
import Pusher from 'pusher-js';
import {getNotifications} from "../../routes/routes";
import useError from "../../hooks/useError";

window.Pusher = Pusher;

function Main() {
    const location = useLocation();
    const [activeMobileMenu, setActiveMobileMenu] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [open, setOpen] = useState(false);
    const basicNonStickyNotification = useRef();
    const setError = useError()
    const [openSidenav, setOpenSidenav] = useState(false)


    useMemo(() => {
        dom("body").removeClass("error-page").removeClass("login").addClass("main");
        if (location.pathname === '/notifications') {
            setOpen(true)
        }
    }, [location.pathname]);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await getNotifications()
    //             setNotifications(response)
    //         } catch (err) {
    //             setError(err)
    //         }
    //     };
    //     fetchData()
    // }, [])

    // useEffect(() => {
    //     window.Echo.private(`users.${User.data.id}`).notification((notification) => {
    //         // setNotifications((prevState) => [
    //         //     ...prevState, notification
    //         // ])
    //         setNotificationMessage(notification.data.notification)
    //         basicNonStickyNotification.current.showToast();
    //         setNotifications((notifications) => [notification, ...notifications])
    //         setOpen(false)
    //     });
    // }, [])

    return (
        <div className={`overflow-hidden${activeMobileMenu ? ' mobile-mode' : ''}`}>
            <Notification
                getRef={(el) => {
                    basicNonStickyNotification.current = el;
                }}
                options={{
                    duration: 3000,
                }}
                className="flex flex-col sm:flex-row"
            >
                <div className="font-medium">
                    {notificationMessage}
                </div>
                <a
                    className="font-medium text-primary dark:text-slate-400 mt-1 sm:mt-0 sm:ml-40"
                    href="/notifications"
                >
                    Review Changes
                </a>
            </Notification>
            {/* BEGIN: Side Menu */}
            <AsideNav {...{openSidenav, activeMobileMenu, setActiveMobileMenu}}/>
            {/* END: Side Menu */}
            {/* BEGIN: Content */}
            <main className={`content ${openSidenav ? ' side-bar-open' : ''}`}>
                <GlobalNav notifications={notifications} {...{open, setOpen, openSidenav, setOpenSidenav}}/>
                <GlobalNavMobile notifications={notifications} {...{open, setOpen, activeMobileMenu, setActiveMobileMenu}}/>
                <Outlet/>
            </main>
            {/* END: Content */}
        </div>
    );
}

export default Main;