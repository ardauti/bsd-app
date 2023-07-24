import {atom} from "recoil";

// const sideMenu = atom({
//     key: "sideMenu",
//     default: {
//         menu: [
//             {
//                 icon: "dashboard",
//                 pathname: "/",
//                 title: "Dashboard",
//             },
//             {
//                 icon: "calendar_month",
//                 pathname: "/calendar",
//                 title: "Calendar",
//             },
//             {
//                 icon: "badge",
//                 title: "Employees",
//                 children: ['/employees'],
//                 subMenu: [
//                     {
//                         icon: "group",
//                         pathname: "/employees/page/1",
//                         title: "Employees",
//                     },
//                     {
//                         icon: "perm_contact_calendar",
//                         pathname: "employees/leaves/page/1",
//                         title: 'Leaves'
//                     },
//
//                     {
//                         icon: "schedule",
//                         pathname: "/employees/worklog",
//                         title: 'Worklog'
//                     },
//                     // {
//                     //     icon: "perm_contact_calendar",
//                     //     pathname: "/employees/deleted-employees",
//                     //     title: 'Deleted Employees'
//                     // },
//
//                 ],
//             },
//             {
//                 icon: "supervisor_account",
//                 pathname: "/clients",
//                 title: "Clients",
//                 children: ["/clients"],
//                 subMenu: [
//                     {
//                         icon: "dashboard",
//                         pathname: "/clients/dashboard",
//                         title: 'Dashboard'
//                     },
//                     {
//                         icon: "supervisor_account",
//                         pathname: "/clients/page/1",
//                         title: 'Clients',
//                     },
//                     {
//                         icon: "description",
//                         pathname: "/clients/catalogs",
//                         title: 'Catalogs',
//                         children: ['/clients/catalogs'],
//                     },
//                 ]
//             },
//             {
//                 icon: "task",
//                 pathname: "/projects",
//                 title: "Projects",
//                 children: ["/projects"],
//                 subMenu: [
//                     {
//                         icon: "dashboard",
//                         pathname: "/projects/dashboard",
//                         title: 'Dashboard'
//                     },
//                     {
//                         icon: "task",
//                         pathname: "/projects/page/1",
//                         title: 'Projects',
//                     },
//                 ]
//             },
//             {
//                 icon: "point_of_sale",
//                 pathname: "/sales",
//                 title: "Sales",
//                 children: ["/sales"],
//                 subMenu: [
//                     {
//                         icon: "dashboard",
//                         pathname: "/sales/dashboard",
//                         title: 'Dashboard'
//                     },
//                     {
//                         icon: "list_alt",
//                         pathname: "/sales/orders",
//                         title: 'Orders',
//                     },
//                     {
//                         icon: "receipt_long",
//                         pathname: "/sales/invoices",
//                         title: 'Invoices',
//                     },
//                 ]
//             },
//             {
//                 icon: "store",
//                 pathname: "/inventory",
//                 title: "Inventory",
//                 children: ["/inventory"],
//                 subMenu: [
//                     {
//                         icon: "dashboard",
//                         pathname: "/inventory/dashboard",
//                         title: 'Dashboard'
//                     },
//                     {
//                         icon: "category",
//                         pathname: "/inventory/categories",
//                         title: 'Categories',
//                     },
//                     {
//                         icon: "inventory_2",
//                         pathname: "/inventory",
//                         title: 'Inventory',
//                     },
//                 ]
//             },
//             {
//                 icon: "build_circle",
//                 title: "Resources",
//                 children: ['/resources', 'tools', 'vehicles'],
//                 subMenu: [
//                     {
//                         icon: "construction",
//                         pathname: "/resources/tools",
//                         title: "Tools",
//                         children: ["/tools"],
//                     },
//                     {
//                         icon: "local_shipping",
//                         pathname: "/resources/vehicles",
//                         title: 'Vehicles',
//                         children: ["/vehicles"],
//                     },
//                 ],
//             },
//             {
//                 icon: "manage_accounts",
//                 children: ["/users"],
//                 title: "User Management",
//                 subMenu: [
//                     {
//                         icon: "group",
//                         pathname: "/users",
//                         title: "Users",
//                     },
//                     {
//                         icon: "admin_panel_settings",
//                         pathname: "/users/roles",
//                         title: "Roles & Permissions",
//                         children: ["/roles"],
//                     },
//                 ],
//             },
//             {
//                 icon: "settings_suggest",
//                 children: ["/system"],
//                 title: "System Settings",
//                 subMenu: [
//                     {
//                         icon: "settings",
//                         pathname: "/system",
//                         title: "Settings",
//                     },
//                     {
//                         icon: "language",
//                         pathname: "/system/localization",
//                         title: 'Localization',
//                         children: ["/localization"],
//                     },
//                     {
//                         icon: "folder",
//                         pathname: "/system/roles",
//                         title: "Invoice Settings",
//                         children: ["/roles"],
//                     },
//                 ],
//             },
//         ],
//     },
// });

const sideMenu = atom({
    key: "sideMenu",
    default: {
        menu: [
            {
                icon: "dashboard",
                pathname: "/dashboard",
                title: "Dashboard",
            },
            {
                icon: "home",
                pathname: "/projects",
                title: "Projects",
                children: ['/projects']
            },
            {
                icon: "event_note",
                pathname: "/tasks",
                title: "Tasks",
            },
            {
                icon: "calendar_month",
                pathname: "/calendar",
                title: "Calendar",
            },
            {
                icon: "calendar_today",
                pathname: "/planning-board",
                title: "Planning Board",
            },
            {
                icon: "badge",
                pathname: "/employees",
                title: "Employees",
            },

        ],
    },
});
export {sideMenu};