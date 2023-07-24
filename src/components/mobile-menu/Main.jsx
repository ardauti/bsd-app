import {Transition} from "react-transition-group";
import {useState, useEffect, useRef, useContext} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {helper as $h} from "@/utils";
import {sideMenu as useSideMenuStore} from "@/stores/side-menu";
import {useRecoilValue} from "recoil";
import {nestedMenu} from "@/layouts/side-menu";
import {toggleMobileMenu, linkTo, enter, leave} from "./index";
import {Lucide} from "@/components";
import classnames from "classnames";
import dom from "@left4code/tw-starter/dist/js/dom";
import SimpleBar from "simplebar";
import './mobile.css'
import TopBarMobile from "../global-nav/Mobile";
import '../../assets/css/app.css'


function Main({activeMobileMenu, setActiveMobileMenu, notifications, open, setOpen}) {
    const navigate = useNavigate();
    const location = useLocation();
    const sidebarRef = useRef();
    const [formattedMenu, setFormattedMenu] = useState([]);
    const sideMenuStore = useRecoilValue(useSideMenuStore);
    const mobileMenu = () => nestedMenu($h.toRaw(sideMenuStore.menu), location);

    useEffect(() => {
        new SimpleBar(dom(".mobile-menu .scrollable")[0]);
        setFormattedMenu(mobileMenu());
    }, [sideMenuStore, location.pathname]);

    useEffect(() => {
        // console.log('here')
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
        <>
            {/* BEGIN: Mobile Menu */}
            <div style={{height: '5rem', width: '90%', marginLeft: '5%',  backgroundColor: '#ffffff', borderRadius: '5px'}}
                 className={classnames({
                     "mobile-menu md:hidden": true,
                     "mobile-menu--active": activeMobileMenu,
                 })}
            >
                <div>
                    <div
                        className="h-full  mobile-menu-bar">
                        <Lucide
                            icon="Menu"
                            style={{strokeWidth: '0.7px'}}
                            className="w-8 h-8 z-[5] mr-5 mt-2 items-center text-black"
                            onClick={() => {
                                toggleMobileMenu(activeMobileMenu, setActiveMobileMenu);
                            }}
                        />
                    </div>
                </div>
                <TopBarMobile notifications={notifications} {...{open, setOpen}}/>
                <div ref={sidebarRef} className="scrollable">
                    <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="mobile-menu-toggler"
                    >

                    </a>
                    <ul className="scrollable__content py-2">
                        {/* BEGIN: First Child */}
                        {formattedMenu.map((menu, menuKey) =>
                            menu == "devider" ? (
                                <li className="menu__devider my-6" key={menu + menuKey}></li>
                            ) : (
                                <li key={menu + menuKey}>
                                    <a
                                        href={menu.subMenu ? "#" : menu.pathname}
                                        className={classnames({
                                            menu: true,
                                            "menu--active": menu.active,
                                            "menu--open": menu.activeDropdown,
                                        })}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            linkTo(menu, navigate, setActiveMobileMenu);
                                            setFormattedMenu($h.toRaw(formattedMenu));
                                        }}
                                    >
                                        <div className="menu__icon">
                                            <Lucide icon={menu.icon}/>
                                        </div>
                                        <div className="menu__title">
                                            {menu.title}
                                            {menu.subMenu && (
                                                <div
                                                    className={classnames({
                                                        "menu__sub-icon": true,
                                                        "transform rotate-180": menu.activeDropdown,
                                                    })}
                                                >
                                                    <Lucide icon="ChevronDown"/>
                                                </div>
                                            )}
                                        </div>
                                    </a>
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
                                                    "menu__sub-open": menu.activeDropdown,
                                                })}
                                            >
                                                {menu.subMenu.map((subMenu, subMenuKey) => (
                                                    <li key={subMenuKey}>
                                                        <a
                                                            href={subMenu.subMenu ? "#" : subMenu.pathname}
                                                            className={classnames({
                                                                menu: true,
                                                                "menu--active": subMenu.active,
                                                            })}
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                linkTo(subMenu, navigate, setActiveMobileMenu);
                                                                setFormattedMenu($h.toRaw(formattedMenu));
                                                            }}
                                                        >
                                                            <div className="menu__icon">
                                                                <Lucide icon="Activity"/>
                                                            </div>
                                                            <div className="menu__title">
                                                                {subMenu.title}
                                                                {subMenu.subMenu && (
                                                                    <div
                                                                        className={classnames({
                                                                            "menu__sub-icon": true,
                                                                            "transform rotate-180":
                                                                            subMenu.activeDropdown,
                                                                        })}
                                                                    >
                                                                        <Lucide icon="ChevronDown"/>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </a>
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
                                                                        "menu__sub-open": subMenu.activeDropdown,
                                                                    })}
                                                                >
                                                                    {subMenu.subMenu.map(
                                                                        (lastSubMenu, lastSubMenuKey) => (
                                                                            <li key={lastSubMenuKey}>
                                                                                <a
                                                                                    href={
                                                                                        lastSubMenu.subMenu
                                                                                            ? "#"
                                                                                            : lastSubMenu.pathname
                                                                                    }
                                                                                    className={classnames({
                                                                                        menu: true,
                                                                                        "menu--active": lastSubMenu.active,
                                                                                    })}
                                                                                    onClick={(event) => {
                                                                                        event.preventDefault();
                                                                                        linkTo(
                                                                                            lastSubMenu,
                                                                                            navigate,
                                                                                            setActiveMobileMenu
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <div className="menu__icon">
                                                                                        <Lucide icon="Zap"/>
                                                                                    </div>
                                                                                    <div className="menu__title">
                                                                                        {lastSubMenu.title}
                                                                                    </div>
                                                                                </a>
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
                </div>
            </div>
            {/* END: Mobile Menu */}
        </>
    );
}

export default Main;
