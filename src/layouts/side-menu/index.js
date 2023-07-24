import dom from "@left4code/tw-starter/dist/js/dom";
import {User} from "../../services/User";

// Setup side menu
const findActiveMenu = (subMenu, location) => {
  let match = false;
  subMenu.forEach((item) => {
    if (
      ((location.forceActiveMenu !== undefined &&
        item.pathname === location.forceActiveMenu) ||
        (location.forceActiveMenu === undefined &&
          item.pathname === location.pathname)) ||
        ((item.children && location.forceActiveMenu !== undefined) &&
            item.children.some(x => location.pathname.startsWith(x))) ||
        ((item.children && location.forceActiveMenu === undefined) &&
            item.children.some(x => location.pathname.startsWith(x))) &&
      !item.ignore
    ) {
      match = true;
    } else if (!match && item.subMenu) {
      match = findActiveMenu(item.subMenu, location);
    }
  });
  return match;
};

const nestedMenu = (menu, location) => {
  menu.forEach((item, key) => {
    if (typeof item !== "string") {
      let menuItem = menu[key];

      // [item.children].forEach(child => {
      //   [child].forEach(pathname =>  console.log(pathname))
      //   console.log(child);
      // });
      //
      // if ([menuItem.children].forEach(child => console.log(child))) {
      //   [item.children].forEach(child => {
      //     [child].forEach(pathname =>  console.log(pathname))
      //     console.log(child);
      //   });
      // }

      // console.log(menuItem.map(x => x.children))
      // menuItem.active =
      //   ((location.forceActiveMenu !== undefined &&
      //     item.pathname === location.forceActiveMenu) ||
      //     (location.forceActiveMenu === undefined &&
      //       item.pathname === location.pathname) ||
      //     (item.subMenu && findActiveMenu(item.subMenu, location))) &&
      //   !item.ignore;

      item.active =
          ((location.forceActiveMenu !== undefined &&
                  item.pathname === location.forceActiveMenu) ||
              (location.forceActiveMenu === undefined &&
                  item.pathname === location.pathname) ||
              ((item.children !== undefined && location.forceActiveMenu !== undefined) &&
                  item.children.some(x => location.pathname.startsWith(x))) ||
              ((item.children !== undefined && location.forceActiveMenu === undefined) &&
                  item.children.some(x => location.pathname.startsWith(x))) ||
              ((item.subMenu !== undefined && location.forceActiveMenu === undefined) &&
                  item.subMenu.some(x => location.pathname.startsWith(x.children))) ||
              (item.subMenu && findActiveMenu(item.subMenu, location))) &&
          !item.ignore;

      if (item.subMenu) {
        menuItem.activeDropdown = findActiveMenu(item.subMenu, location);
        menuItem = {
          ...item,
          ...nestedMenu(item.subMenu, location),
        };
      }
    }
  });

  return menu;
};

const linkTo = (menu, navigate, setActiveMobileMenu) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown;
  } else {
    setActiveMobileMenu(false);
    navigate(menu.pathname);
  }
};

const enter = (el, done) => {
  dom(el).slideDown(300);
};

const leave = (el, done) => {
  dom(el).slideUp(300);
};

export { nestedMenu, linkTo, enter, leave };
