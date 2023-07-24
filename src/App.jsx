import ScrollToTop from "./components/scroll-to-top/Main";
import {AuthProvider} from "./context/AuthProvider";
import useAuth from "./hooks/useAuth";
import {Route, Routes,} from "react-router-dom";
import SideMenu from "./layouts/side-menu/Main";
import TopMenu from "./layouts/top-menu/Main";
import Login from "./views/public/login/main"
import Signup from "./views/public/sign-up/Main"
import ForgotPassword from "./views/public/forgot-password/forgot-password";
import ResetPassword from "./views/public/reset-password/reset-password";
import ProjectsDashboard from "./views/backoffice/projects/dashboard/Main";
import Projects from "./views/backoffice/projects/Projects";
import Profile from "./views/backoffice/profile/Profile";
import Employees from "./views/backoffice/employees/Main";
import CreateUser from "./views/public/create-user/CreateUser";
import CreateRoleBackoffice from "./views/backoffice/system-settings/roles/create-role/Main";
import EditRoleBackoffice from "./views/backoffice/system-settings/roles/update-role/Main";
import Dashboard from "./views/backoffice/dashboard/Dashboard";
import Roles from "./views/backoffice/system-settings/roles/Main";
import DashboardEmployee from "./views/employee/dashboard/Dashboard";
import ProfileEmployee from "./views/employee/profile/Profile";
import Calendar from "./views/backoffice/calendar/Main";
import Page2 from "./views/employee/page-2/Main";
import {User} from "./services/User";
import PageNotFound from "./views/public/Page-not-found/PageNotFound";
import InviteUser from "./views/backoffice/employees/invite-user/invite-user";
import Settings from "./views/backoffice/profile/edit-profile/settings";
import DeletedUsers from "./views/backoffice/employees/deleted-users/deleted-users";
import CancelInvitation from "./views/backoffice/employees/cancel-invitation/cancel-invitation";
import Clients from "./views/backoffice/clients/Clients";
import ClientsDashboard from "./views/backoffice/clients/dashboard/Main";
import Client from "./views/backoffice/clients/client/Client";
import DeletedClients from "./views/backoffice/clients/deleted-clients/deleted-clients";
import Project from "./views/backoffice/projects/project/Project";
import DeletedProjects from "./views/backoffice/projects/deleted-projects/deleted-projects";
import CreateResource from "./views/backoffice/projects/project/resources/create-resource/CreateResource";
import Catalogs from "./views/backoffice/catalogs/Catalogs";
import CreateCatalog from "./views/backoffice/catalogs/create-catalog/CreateCatalog";
import UpdateCatalog from "./views/backoffice/catalogs/update-catalog/Main";
import Echo from "laravel-echo";
import Notifications from "./views/backoffice/notifications/Main";
import {DataProvider} from "./context/DataContext";
import {useMemo, useState} from "react";
import ResourceTools from "./views/backoffice/resources/tools/ResourceTools";
import ResourceVehicles from "./views/backoffice/resources/vehicles/ResourceVehicles";
import Chat from "./views/backoffice/chat/Main";
import {LoadingIcon} from "@/components";
import SalesDashboard from "./views/backoffice/sales/dashboard/Main";
import Orders from "./views/backoffice/sales/orders/Main";
import Invoices from "./views/backoffice/sales/invoices/Main";
import Inventory from "./views/backoffice/inventory/inventory/Main";
import InventoryDashboard from "./views/backoffice/inventory/dashboard/Main";
import InventoryCategories from "./views/backoffice/inventory/categories/Main";
import UsersSettings from "./views/backoffice/users-managment/users/Main";
import RolesSettings from "./views/backoffice/users-managment/roles/Main";
import SystemSettings from "./views/backoffice/system-settings/settings/Main";
import LocalizationSettings from "./views/backoffice/system-settings/localization/Main";
import SystemRolesSettings from "./views/backoffice/system-settings/roles/Main";
import BoardLeaves from "./views/backoffice/employees/employee-leaves/Main";


function App() {
    const {token, login, logout, refreshToken, can} = useAuth();
    const userPermissions = [].concat.apply([], User.data?.roles.map(role => role.permissions.map(permission => permission.name)));
    let [employeesResource, setEmployeesResource] = useState([])
    let [toolsResource, setToolsResource] = useState([])
    let [vehiclesResource, setVehiclesResource] = useState([])
    let [taskUpdated, setTaskUpdated] = useState(false)
    let providerValue = useMemo(() => ({
        employeesResource,
        setEmployeesResource,
        toolsResource,
        setToolsResource,
        vehiclesResource,
        setVehiclesResource,
        taskUpdated,
        setTaskUpdated,
    }), [employeesResource, setEmployeesResource, toolsResource, setToolsResource, vehiclesResource, setVehiclesResource, taskUpdated, setTaskUpdated])

    window.Echo = new Echo({
        authEndpoint: 'https://gateway.salmonsea-2b5f480f.westeurope.azurecontainerapps.io/broadcasting/auth',
        // authEndpoint: 'http://192.168.100.24:8000/broadcasting/auth',
        broadcaster: 'pusher',
        key: '12abe569938fb9eba158',
        // wsHost: 'gateway.salmonsea-2b5f480f.westeurope.azurecontainerapps.io',
        // wssHost: 'gateway.salmonsea-2b5f480f.westeurope.azurecontainerapps.io',
        // wsPort: '',
        // wssPort: '',
        forceTLS: true,
        appId: '1473413',
        secret: 'c9b47a7647569a267486',
        cluster: 'eu',
        useTLS: true,
        disableStats: true,
        encrypted: true,
        // enabledTransports: ['ws', 'wss'],
        // cluster: 'mt1',
        auth: {
            headers: {
                Authorization: `Bearer ${token}`
            },
        },
    });

    return (
        <AuthProvider value={{token, login, logout, refreshToken, can}}>
            <div>
                <DataProvider value={providerValue}>
                    <Routes>
                        <Route index element={<Login/>}/>
                        <Route path='/' element={<SideMenu/>}>
                            <Route path='/dashboard' element={<Dashboard/>}/>
                            <Route path='projects' element={<ProjectsDashboard/>}>
                                    <Route index element={<ProjectsDashboard/>}/>
                                    <Route path=":id" element={<ProjectsDashboard/>}/>
                                    <Route path=":id/chat" element={<ProjectsDashboard/>}/>
                                    <Route path=":id/worklogs" element={<ProjectsDashboard/>}/>
                                    <Route path=":id/tasks" element={<ProjectsDashboard/>}/>
                                    <Route path=":id/files" element={<ProjectsDashboard/>}/>
                                    <Route path=":id/members" element={<ProjectsDashboard/>}/>
                                </Route>
                                <Route path='tasks' element={<Dashboard/>}/>
                                <Route path='calendar' element={<Calendar/>}/>
                                <Route path='planning-board' element={<Calendar/>}/>
                                <Route path='employees' element={<Employees/>}/>
                            </Route>
                            <Route path='*' element={<PageNotFound/>}/>
                        {/*{*/}
                        {/*    token ? (*/}
                        {/*        <>*/}
                        {/*            {*/}
                        {/*                User.data ? (*/}
                        {/*                    <>*/}
                        {/*                        {*/}
                        {/*                            userPermissions.find(permission => permission.startsWith("system.backoffice")) ? (*/}
                        {/*                                // <>*/}
                        {/*                                //     <Route path='/' element={<SideMenu/>}>*/}
                        {/*                                //         <Route index element={<Dashboard/>}/>*/}
                        {/*                                //         <Route path='backoffice' element={<Dashboard/>}/>*/}
                        {/*                                //         <Route path='dashboard' element={<Dashboard/>}/>*/}
                        {/*                                //         <Route path='calendar' element={<Calendar/>}/>*/}
                        {/*                                //         <Route path='employees'>*/}
                        {/*                                //             <Route path={'page/:pageNumber'} element={<Employees/>}/>*/}
                        {/*                                //             <Route path='invite' element={<InviteUser/>}/>*/}
                        {/*                                //             <Route path='deleted-employees' element={<DeletedUsers/>}/>*/}
                        {/*                                //             <Route path='worklog' element={<CancelInvitation/>}/>*/}
                        {/*                                //             <Route path='leaves/page/:pageNumber' element={<BoardLeaves/>}/>*/}
                        {/*                                //         </Route>*/}
                        {/*                                //         <Route path='clients'>*/}
                        {/*                                //             <Route index element={<ClientsDashboard/>}/>*/}
                        {/*                                //             <Route path={'dashboard'} element={<ClientsDashboard/>}/>*/}
                        {/*                                //             <Route path={'page/:pageNumber'} element={<Clients/>}/>*/}
                        {/*                                //             <Route path='deleted' element={<DeletedClients/>}/>*/}
                        {/*                                //             <Route path='client/:id/catalogs' element={<Catalogs/>}/>*/}
                        {/*                                //             <Route path='client/:id/catalogs/catalog/create' element={<CreateCatalog/>}/>*/}
                        {/*                                //             <Route path='client/:id/catalogs/catalog/edit/:catalogId' element={<UpdateCatalog/>}/>*/}
                        {/*                                //             <Route path='client/:id/dashboard' element={<Client/>}/>*/}
                        {/*                                //             <Route path='client/:id/client-details' element={<Client/>}/>*/}
                        {/*                                //         </Route>*/}
                        {/*                                //         <Route path='projects'>*/}
                        {/*                                //             <Route index element={<ProjectsDashboard/>}/>*/}
                        {/*                                //             <Route path='dashboard' element={<ProjectsDashboard/>}/>*/}
                        {/*                                //             <Route path={'page/:pageNumber'} element={<Projects/>}/>*/}
                        {/*                                //             <Route path='project/:id/dashboard' element={<Project/>}/>*/}
                        {/*                                //             <Route path='project/:id/tasks' element={<Project/>}/>*/}
                        {/*                                //             <Route path='project/:id/timesheet' element={<Project/>}/>*/}
                        {/*                                //             <Route path='project/:id/files' element={<Project/>}/>*/}
                        {/*                                //             <Route path='project/:id/project-details' element={<Project/>}/>*/}
                        {/*                                //             <Route path='project/:id/resources' element={<Project/>}/>*/}
                        {/*                                //             <Route path='project/:id/resources/resource/:resourceTypeId' element={<CreateResource/>}/>*/}
                        {/*                                //             <Route path='deleted-projects' element={<DeletedProjects/>}/>*/}
                        {/*                                //         </Route>*/}
                        {/*                                //         <Route path='sales'>*/}
                        {/*                                //             <Route index element={<SalesDashboard/>}/>*/}
                        {/*                                //             <Route path={'dashboard'} element={<SalesDashboard/>}/>*/}
                        {/*                                //             <Route path={'orders'} element={<Orders/>}/>*/}
                        {/*                                //             <Route path={'invoices'} element={<Invoices/>}/>*/}
                        {/*                                //         </Route>*/}
                        {/*                                //         <Route path='inventory'>*/}
                        {/*                                //             <Route index element={<Inventory/>}/>*/}
                        {/*                                //             <Route path={'dashboard'} element={<InventoryDashboard/>}/>*/}
                        {/*                                //             <Route path={'categories'} element={<InventoryCategories/>}/>*/}
                        {/*                                //         </Route>*/}
                        {/*                                //         <Route path='resources'>*/}
                        {/*                                //             <Route path='tools' element={<ResourceTools/>}/>*/}
                        {/*                                //             <Route path='vehicles' element={<ResourceVehicles/>}/>*/}
                        {/*                                //         </Route>*/}
                        {/*                                //         <Route path='users'>*/}
                        {/*                                //             <Route index element={<UsersSettings/>}/>*/}
                        {/*                                //             <Route path='roles' element={<RolesSettings/>}/>*/}
                        {/*                                //         </Route>*/}
                        {/*                                //         <Route path='system'>*/}
                        {/*                                //             <Route index element={<SystemSettings/>}/>*/}
                        {/*                                //             <Route path='localization' element={<LocalizationSettings/>}/>*/}
                        {/*                                //             <Route path='roles' element={<SystemRolesSettings/>}/>*/}
                        {/*                                //             <Route path='roles/create' element={<CreateRoleBackoffice/>}/>*/}
                        {/*                                //             <Route path='roles/edit/:id' element={<EditRoleBackoffice/>}/>*/}
                        {/*                                //         </Route>*/}
                        {/*                                //         <Route path='profile' element={<Profile/>}/>*/}
                        {/*                                //         <Route path='profile/update-profile' element={<Profile/>}/>*/}
                        {/*                                //         <Route path='profile/notifications' element={<Profile/>}/>*/}
                        {/*                                //         <Route path='profile/settings' element={<Profile/>}/>*/}
                        {/*                                //         <Route path='catalogs'>*/}
                        {/*                                //             <Route index element={<Catalogs/>}/>*/}
                        {/*                                //         </Route>*/}
                        {/*                                //         <Route path='settings' element={<Settings/>}/>*/}
                        {/*                                //         <Route path='notifications' element={<Notifications/>}/>*/}
                        {/*                                //         <Route path='chat' element={<Chat/>}/>*/}
                        {/*                                //     </Route>*/}
                        {/*                                //     <Route path='*' element={<PageNotFound/>}/>*/}
                        {/*                                // </>*/}
                        {/*                                <>*/}
                        {/*                                    <Route path='/' element={<SideMenu/>}>*/}
                        {/*                                        <Route index element={<Dashboard/>}/>*/}
                        {/*                                        <Route path='projects' element={<ProjectsDashboard/>}>*/}
                        {/*                                            <Route index element={<ProjectsDashboard/>}/>*/}
                        {/*                                            <Route path=":id" element={<ProjectsDashboard/>}/>*/}
                        {/*                                            <Route path=":id/chat" element={<ProjectsDashboard/>}/>*/}
                        {/*                                            <Route path=":id/worklogs" element={<ProjectsDashboard/>}/>*/}
                        {/*                                            <Route path=":id/tasks" element={<ProjectsDashboard/>}/>*/}
                        {/*                                            <Route path=":id/files" element={<ProjectsDashboard/>}/>*/}
                        {/*                                            <Route path=":id/members" element={<ProjectsDashboard/>}/>*/}
                        {/*                                        </Route>*/}
                        {/*                                        <Route path='tasks' element={<Dashboard/>}/>*/}
                        {/*                                        <Route path='calendar' element={<Calendar/>}/>*/}
                        {/*                                        <Route path='planning-board' element={<Calendar/>}/>*/}
                        {/*                                        <Route path='employees' element={<Employees/>}/>*/}
                        {/*                                    </Route>*/}
                        {/*                                    <Route path='*' element={<PageNotFound/>}/>*/}
                        {/*                                </>*/}
                        {/*                            ) : userPermissions.length === 0 || userPermissions.find(permission => permission.startsWith("system.user"))*/}
                        {/*                                ? (*/}
                        {/*                                    <>*/}
                        {/*                                        <Route path='/' element={<TopMenu/>}>*/}
                        {/*                                            <Route index element={<DashboardEmployee/>}/>*/}
                        {/*                                            <Route path='dashboard'*/}
                        {/*                                                   element={<DashboardEmployee/>}/>*/}
                        {/*                                            <Route path='profile' element={<ProfileEmployee/>}/>*/}
                        {/*                                            <Route path='page' element={<Page2/>}/>*/}
                        {/*                                        </Route>*/}
                        {/*                                        <Route path='*' element={<PageNotFound/>}/>*/}

                        {/*                                    </>*/}
                        {/*                                ) : (*/}
                        {/*                                    <>*/}
                        {/*                                        <Route path='*' element={<PageNotFound/>}></Route>*/}
                        {/*                                    </>*/}
                        {/*                                )*/}
                        {/*                        }*/}
                        {/*                    </>*/}
                        {/*                ) : (*/}
                        {/*                    <Route path='*' element={*/}
                        {/*                        <div*/}
                        {/*                            className="col-span-6 sm:col-span-3 xl:col-span-2 grid h-screen place-items-center">*/}
                        {/*                            <LoadingIcon icon="puff" className="w-14 h-14"/>*/}
                        {/*                        </div>}/>*/}
                        {/*                )*/}
                        {/*            }*/}
                        {/*        </>*/}
                        {/*    ) : (*/}
                        {/*        <>*/}
                        {/*            <Route index element={<Login/>}/>*/}
                        {/*            <Route path='login' element={<Login/>}/>*/}
                        {/*            <Route path='signup' element={<Signup/>}/>*/}
                        {/*            <Route path='forgot-password' element={<ForgotPassword/>}/>*/}
                        {/*            <Route path='/password/reset/:id/:email' element={<ResetPassword/>}/>*/}
                        {/*            <Route path='users/create/:invitationToken' element={<CreateUser/>}/>*/}
                        {/*            <Route path='/forgot-password' element={<ForgotPassword/>}/>*/}
                        {/*            <Route path='*' element={<PageNotFound/>}/>*/}
                        {/*        </>*/}
                        {/*    )*/}
                        {/*}*/}
                    </Routes>
                </DataProvider>
                <ScrollToTop/>
            </div>
        </AuthProvider>
    );
}

export default App;
