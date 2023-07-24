import {useRoutes} from "react-router";
import SideMenu from "../layouts/side-menu/Main";
import SimpleMenu from "../layouts/simple-menu/Main";
import TopMenu from "../layouts/top-menu/Main";
import Page2 from "../views/employee/page-2/Main";
import Login from "../views/public/login/main"
import Signup from "../views/public/sign-up/Main"
import ForgotPassword from "../views/public/forgot-password/forgot-password";
import ResetPassword from "../views/public/reset-password/reset-password";
import CreateUser from "../views/public/create-user/CreateUser";
import Projects from "../views/backoffice/projects/dashboard/Main";
import Profile from "../views/backoffice/profile/Profile";
import Calendar from "../views/backoffice/calendar/Main";
import Users from "../views/backoffice/employees/Main";
import Dashboard from "../views/backoffice/dashboard/Dashboard";
import {useContext} from "react";
import AuthContext from "../context/AuthProvider";


function Router() {


    const {token} = useContext(AuthContext)

    //routes of project
    const routes = [
        {
            path: "/",
            element: <Login/>,
        },
        {
            path: "/login",
            element: <Login/>,
        },
        {
            path: "/signup",
            element: <Signup/>,
        },
        {
            path: "/forgot-password",
            element: <ForgotPassword/>
        },

        {
            path: "/password/reset/:id/:email",
            element: <ResetPassword/>,

        },
        {
            path: "employees/create/:invitationToken",
            element: <CreateUser/>
        },

        {
            path: "/backoffice",
            element: <SideMenu/>,
            children: [
                {
                    path: "projects",
                    element: <Projects/>,
                },

                {
                    path: "profile",
                    element: <Profile/>,
                },
                {
                    path: "calendar",
                    element: <Calendar/>,
                },
                {
                    path: "users",
                    element: <Users/>,
                },
                {
                    path: "dashboard",
                    element: <Dashboard/>,
                },
            ],
        },
        {
            path: "/simple-menu",
            element: <SimpleMenu/>,
            children: [
                {
                    path: "projects",
                    element: <Projects/>,
                },
                {
                    path: "page-2",
                    element: <Page2/>,
                },
            ],
        },
        {
            path: "/top-menu",
            element: <TopMenu/>,
            children: [
                {
                    path: "projects",
                    element: <Projects/>,
                },
                {
                    path: "page-2",
                    element: <Page2/>,
                },
            ],
        },
    ];

    return useRoutes(routes);
}

export default Router;
