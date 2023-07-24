import { atom } from "recoil";

const topMenu = atom({
  key: "topMenu",
  default: {
    menu: [
      {
        icon: "Home",
        pathname: "/",
        title: "Dashboard",
      },
      {
        icon: "Settings",
        pathname: "/profile",
        title: "Profile",
      },
    ],
  },
});

export { topMenu };
