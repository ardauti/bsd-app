import React, {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Lucide,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    DropdownHeader,
    DropdownDivider,
    LoadingIcon
} from "@/components";
import logoUrl from "../../assets/images/logo.svg";
import {faker as $f} from "@/utils";
import * as $_ from "lodash";
import classnames from "classnames";
import AuthContext from "../../context/AuthProvider";
import {User} from "../../services/User";
import moment from "moment";
import {getSearchInfoOnChange} from "../../routes/routes";
import useError from "../../hooks/useError";

function TopBarMobile(props) {
    const {logout} = useContext(AuthContext)
    const [searchDropdown, setSearchDropdown] = useState(false);
    const setError = useError()
    const [usersList, setUsersList] = useState(null);
    const [projectList, setProjectList] = useState(null);
    const [clientList, setClientList] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const showSearchDropdown = () => {
        setSearchDropdown(true);
    };
    const hideSearchDropdown = () => {
        setSearchDropdown(false);
    };

    const clickLogout = () => {
        logout()
    }
    const navigate = useNavigate()

    function navigateToProfile() {
        navigate('/profile', {replace: true})
    }

    const handleSearch = async (e) => {
        let searchQuery = e.target.value
        if (searchQuery === '') {
            setUsersList(null)
            setClientList(null)
            setProjectList(null)
            return
        }
        setIsLoading(true)
        let search = []
        try {
            search = await getSearchInfoOnChange(searchQuery)
        } catch (err) {
            setError(err)
        } finally {
            setUsersList(search.users)
            setProjectList(search.projects)
            setClientList(search.clients)
        }
        setIsLoading(false)
    }

    return (
        <>
            {/* BEGIN: Top Bar */}
            <div style={{padding: '0px 2rem 0px 2rem'}}
                 className={' fixed  md:block  top-bar-boxed py-0   z-[0]  border-white/[0.08]  md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700'}
            >
                <div style={{position: 'relative', top: '-50px'}} className="flex justify-between items-center h-full">
                    {/* BEGIN: Logo */}
                    <div className={'mr-10'}>
                        <Link
                            to="/"
                            className="logo -intro-x hidden   block"
                        >
                            <img
                                alt="Enigma Tailwind HTML Admin Template"
                                className="flex logo__image w-6"
                                src={logoUrl}
                            />
                            <span className="logo__text text-black text-lg ml-3"> BSD </span>
                        </Link>
                    </div>
                    {/* END: Logo */}
                    {/* BEGIN: Search */}
                    <div className="intro-x w-1/2 md:ml-8 ">
                        <div className="search w-full ">
                            <input type="text"
                                   className="form-control bg-gray-100 border-transparent pl-6 w-full"
                                   placeholder="Search..."
                                   onFocus={showSearchDropdown}
                                   onBlur={hideSearchDropdown}
                                   onChange={handleSearch}
                            />
                            <Lucide
                                icon="Search"
                                className="search__icon dark:text-slate-500"
                            />
                        </div>
                        <div
                            className={classnames({
                                "search-result": true,
                                show: searchDropdown,
                            })}
                        >
                            <div className="search-result__content">
                                <div className="search-result__content__title">Clients</div>
                                {
                                    !clientList || clientList.length === 0 ? (
                                        <div className="mb-5">
                                            <div className="ml-3 text-gray-400">No Clients Found</div>
                                        </div>
                                    ) : (
                                        isLoading ? (
                                            <div
                                                className="flex justify-center items-center ">
                                                Loading more <LoadingIcon icon="three-dots" className="w-5 h-5 ml-2 "/>
                                            </div>
                                        ) : (
                                            <div className="mb-5">
                                                {$_.take(clientList, 4).map((client, index) => (
                                                    <a
                                                        key={index}
                                                        href=""
                                                        className="flex items-center mt-2 space-y-4"
                                                    >
                                                        <div className="ml-3">{client.company_name}</div>
                                                    </a>
                                                ))}
                                            </div>
                                        )
                                    )
                                }
                                <div className="search-result__content__title">Users</div>
                                {
                                    !usersList || usersList.length === 0 ? (
                                        <div className="mb-5">
                                            <div className="ml-3 text-gray-400">No Users Found</div>
                                        </div>
                                    ) : (
                                        isLoading ? (
                                            <div
                                                className="flex justify-center items-center ">
                                                Loading more <LoadingIcon icon="three-dots" className="w-5 h-5 ml-2 "/>
                                            </div>
                                        ) : (
                                            <div className="mb-5">
                                                {$_.take(usersList, 4).map((user, index) => (
                                                    <a
                                                        key={index}
                                                        href=""
                                                        className="flex items-center mt-2"
                                                    >
                                                        <div className="ml-3">{user.user_profile.display_name}</div>
                                                    </a>
                                                ))}
                                            </div>
                                        )
                                    )
                                }
                                <div className="search-result__content__title">Projects</div>
                                {
                                    !projectList || projectList.length === 0 ? (
                                        <div className="mb-5">
                                            <div className="ml-3 text-gray-400">No Projects Found</div>
                                        </div>
                                    ) : (
                                        isLoading ? (
                                            <div
                                                className="flex justify-center items-center ">
                                                Loading more <LoadingIcon icon="three-dots" className="w-5 h-5 ml-2 "/>
                                            </div>
                                        ) : (
                                            <div className="mb-5">
                                                {$_.take(projectList, 4).map((project, index) => (
                                                    <a key={index} href="" className="flex items-center mt-2 space-y-4">
                                                        <div className="ml-3">{project.name}</div>
                                                    </a>
                                                ))}
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    {/* END: Search */}
                    {/* BEGIN: Notifications */}
                    <div className='flex flex-row justify-end items-center'>
                        <Dropdown className="intro-x bg-gray-100 p-1.5 rounded mr-4 sm:mr-6">
                            <div onClick={() => props.setOpen(true)}>
                                <DropdownToggle
                                    tag="div"
                                    role="button"
                                    className="notification notification--bullet cursor-pointer"
                                >
                                    <Lucide
                                        style={{strokeWidth: '0.7px'}}
                                        icon="Bell"
                                        className="notification__icon text-black dark:text-slate-500"
                                    />
                                    <span className={props.open ? '' : 'dot'}></span>
                                </DropdownToggle>
                            </div>
                            <DropdownMenu className="notification-content pt-2">
                                <DropdownContent tag="div" className="notification-content__box">
                                    <div className="notification-content__title">
                                        Notifications
                                        <span
                                            className={'ml-auto float-right text-sm text-slate-400 font-light whitespace-nowrap cursor-pointer'}
                                            onClick={() => navigate('/notifications', {replace: true})}>See all</span>
                                    </div>
                                    {$_.take(props.notifications, 5).map((notification, i) => (
                                        <div
                                            key={i}
                                            className={classnames({
                                                "cursor-pointer relative flex items-center": true,
                                                "mt-5": i,
                                            })}
                                        >
                                            <div className="ml-2 overflow-hidden">
                                                <div className="flex items-center">
                                                    <a className="w-full text-slate-500 mr-5 mt-0.5">
                                                        {notification.data.notification}
                                                    </a>
                                                    <div className="text-xs text-slate-400 ml-auto whitespace-nowrap">
                                                        {notification.created_at ? moment(notification.created_at).format("HH:mm") : 'now'}
                                                    </div>
                                                </div>
                                                {/*<div className="w-full truncate text-slate-500 mt-0.5">*/}
                                                {/*    {faker.news[0].shortContent}*/}
                                                {/*</div>*/}
                                            </div>
                                            {/*<div className="ml-2 overflow-hidden">*/}
                                            {/*    <div className="flex items-center">*/}
                                            {/*        <a href="" className="font-medium  mr-5">*/}
                                            {/*            /!*{notification.data.notification}*!/*/}
                                            {/*            /!*{faker.employees[0].name}*!/*/}
                                            {/*        </a>*/}
                                            {/*        <div className="text-xs text-slate-400 ml-auto whitespace-nowrap">*/}
                                            {/*            /!*{notification.created_at}*!/*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*    <div className="w-full text-slate-500 mt-0.5">*/}
                                            {/*        /!*{notification.created_at}*!/*/}
                                            {/*        {notification.data.notification}*/}
                                            {/*        <span className={'float-right text-sm text-slate-400 font-light'} onClick={() => markNotificationRead(notification.id)}>Read</span>*/}
                                            {/*        /!*{faker.news[0].shortContent}*!/*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                    ))}
                                </DropdownContent>
                            </DropdownMenu>
                        </Dropdown>
                        {/* END: Notifications */}
                        {/* BEGIN: Account Menu */}
                        <Dropdown className="intro-x w-8 h-8">
                            <DropdownToggle
                                tag="div"
                                role="button"
                                className="w-8 h-8 rounded-md overflow-hidden shadow-lg image-fit zoom-in"
                            >
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    src={$f()[9].photos[0]}
                                />
                            </DropdownToggle>
                            <DropdownMenu className="w-56">
                                <DropdownContent
                                    className="bg-white before:block before:absolute before:inset-0 before:rounded-md before:z-[-1] text-primary">
                                    <DropdownHeader tag="div" className="!font-normal">
                                        <div className="font-medium">{User?.data?.email}</div>
                                        <div className="text-xs text-primary/80 mt-0.5 dark:text-slate-500">
                                            {User.data?.roles[0]?.name}
                                        </div>
                                    </DropdownHeader>
                                    <DropdownDivider className="border-primary/[0.08]"/>
                                    <DropdownItem onClick={navigateToProfile} className="hover:bg-primary/5">
                                        <Lucide icon="User" className="w-4 h-4 mr-2"/> Profile
                                    </DropdownItem>
                                    <DropdownItem className="hover:bg-primary/5">
                                        <Lucide icon="Edit" className="w-4 h-4 mr-2"/> Add Account
                                    </DropdownItem>
                                    <DropdownItem className="hover:bg-primary/5">
                                        <Lucide icon="Lock" className="w-4 h-4 mr-2"/> Reset Password
                                    </DropdownItem>
                                    <DropdownItem className="hover:bg-primary/5">
                                        <Lucide icon="HelpCircle" className="w-4 h-4 mr-2"/> Help
                                    </DropdownItem>
                                    <DropdownDivider className="border-primary/[0.08]"/>
                                    <DropdownItem onClick={clickLogout} className="hover:bg-primary/5">
                                        <Lucide icon="ToggleRight" className="w-4 h-4 mr-2"/> Logout
                                    </DropdownItem>
                                </DropdownContent>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </>
    );
}

// Main.propTypes = {
//     className: PropTypes.string,
// };
//
// Main.defaultProps = {
//     className: "",
// };

export default TopBarMobile;
