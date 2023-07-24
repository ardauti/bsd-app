import {Transition} from "react-transition-group";
import React, {useState, useEffect, useMemo, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {helper as $h} from "@/utils";
import {sideMenu as useSideMenuStore} from "@/stores/side-menu";
import {useRecoilValue} from "recoil";
import {linkTo, nestedMenu, enter, leave} from "@/layouts/side-menu";
import SideMenuTooltip from "@/components/side-menu-tooltip/Main";
import {AiOutlineCar} from "@react-icons/all-files/ai/AiOutlineCar";
import {Lucide, MaterialIcon} from "@/components";
import classnames from "classnames";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

function Main({openSidenav, activeMobileMenu, setActiveMobileMenu}) {
    const location = useLocation();
    const sidebarRef = useRef();
    const navigate = useNavigate();
    const [formattedMenu, setFormattedMenu] = useState([]);
    const sideMenuStore = useRecoilValue(useSideMenuStore);
    const sideMenu = () => nestedMenu($h.toRaw(sideMenuStore.menu), location);

    useMemo(() => {
        setFormattedMenu(sideMenu());
    }, [sideMenuStore, location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && activeMobileMenu) {
                setActiveMobileMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeMobileMenu]);

    return (
            <aside ref={sidebarRef} className={`sidebar-area shadow-md`} style={ openSidenav ? {width: '260px'} : { width: '105px'} }>
                <SimpleBar className="max-h-screen overflow-x-hidden" forceVisible="y" >
                <ul className="sidebar-nav">
                        {/* BEGIN: First Child */}
                        {formattedMenu.map((menu, menuKey) =>
                            menu == "devider" ? (

                                <li
                                    className="side-nav__devider my-6"
                                    key={menu + menuKey}
                                ></li>
                            ) : (
                                <li key={menu + menuKey}>
                                    <SideMenuTooltip
                                        tag="a"
                                        opensidenav={openSidenav.toString()}
                                        content={menu.title}
                                        href={menu.subMenu ? "#" : menu.pathname}
                                        className={classnames({
                                            "side-menu": true,
                                            "side-menu--active": menu.active,
                                            "side-menu--open": menu.activeDropdown,
                                        })}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            linkTo(menu, navigate, setActiveMobileMenu);
                                            setFormattedMenu($h.toRaw(formattedMenu));
                                        }}
                                    >
                                        <div className="side-menu__icon">
                                            <MaterialIcon iconName={menu.icon} iconClass="text-2xl" />
                                        </div>
                                        <div className={ `${openSidenav ? 'side-menu__title' : 'hidden'}`}>
                                            {menu.title}
                                            {menu.subMenu && (
                                                <div
                                                    className={classnames({
                                                        "side-menu__sub-icon": true,
                                                        "transform rotate-180": menu.activeDropdown,
                                                    })}
                                                >
                                                    <Lucide icon="ChevronDown"/>
                                                </div>
                                            )}
                                        </div>
                                    </SideMenuTooltip>
                                    {/* BEGIN: Second Child */}
                                    {menu.subMenu && (
                                        <Transition
                                            in={menu.activeDropdown}
                                            onEnter={enter}
                                            onExit={leave}
                                            timeout={300}
                                        >
                                            <ul
                                                className={classnames({
                                                    "side-menu__sub-open": menu.activeDropdown,
                                                })}
                                            >
                                                {menu.subMenu.map((subMenu, subMenuKey) => (
                                                    <li key={subMenuKey}>
                                                        <SideMenuTooltip
                                                            tag="a"
                                                            content={subMenu.title}
                                                            href={subMenu.subMenu ? "#" : subMenu.pathname}
                                                            opensidenav={openSidenav.toString()}
                                                            className={classnames({
                                                                "side-menu": true,
                                                                "side-menu--active": subMenu.active,
                                                            })}
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                linkTo(subMenu, navigate, setActiveMobileMenu);
                                                                setFormattedMenu($h.toRaw(formattedMenu));
                                                            }}
                                                        >
                                                            <div className="side-menu__icon">
                                                                {subMenu.iconReact ? <AiOutlineCar className={'w-6 h-6'} /> : <MaterialIcon iconName={subMenu.icon} iconClass="text-2xl"/>}
                                                            </div>
                                                            <div className={`${openSidenav ? 'side-menu__title' : 'hidden'}`}>
                                                                {subMenu.title}
                                                                {subMenu.subMenu && (
                                                                    <div
                                                                        className={classnames({
                                                                            "side-menu__sub-icon": true,
                                                                            "transform rotate-180":
                                                                            subMenu.activeDropdown,
                                                                        })}
                                                                    >
                                                                        <Lucide icon="ChevronDown"/>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </SideMenuTooltip>
                                                        {/* BEGIN: Third Child */}
                                                        {subMenu.subMenu && (
                                                            <Transition
                                                                in={subMenu.activeDropdown}
                                                                onEnter={enter}
                                                                onExit={leave}
                                                                timeout={300}
                                                            >
                                                                <ul
                                                                    className={classnames({
                                                                        "side-menu__sub-open":
                                                                        subMenu.activeDropdown,
                                                                    })}
                                                                >
                                                                    {subMenu.subMenu.map(
                                                                        (lastSubMenu, lastSubMenuKey) => (
                                                                            <li key={lastSubMenuKey}>
                                                                                <SideMenuTooltip
                                                                                    tag="a"
                                                                                    content={lastSubMenu.title}
                                                                                    href={
                                                                                        lastSubMenu.subMenu
                                                                                            ? "#"
                                                                                            : lastSubMenu.pathname
                                                                                    }
                                                                                    className={classnames({
                                                                                        "side-menu": true,
                                                                                        "side-menu--active":
                                                                                        lastSubMenu.active,
                                                                                    })}
                                                                                    onClick={(event) => {
                                                                                        event.preventDefault();
                                                                                        linkTo(lastSubMenu, navigate, setActiveMobileMenu);
                                                                                    }}
                                                                                >
                                                                                    <div className="side-menu__icon">
                                                                                        <Lucide icon="Zap"/>
                                                                                    </div>
                                                                                    <div className="side-menu__title">
                                                                                        {lastSubMenu.title}
                                                                                    </div>
                                                                                </SideMenuTooltip>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </Transition>
                                                        )}
                                                        {/* END: Third Child */}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Transition>
                                    )}
                                    {/* END: Second Child */}
                                </li>
                            )
                        )}
                        {/* END: First Child */}
                    </ul>
                </SimpleBar>
            </aside>
    );
}

export default Main;
