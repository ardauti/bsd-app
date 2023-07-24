import React from "react";
import {Dropdown, DropdownContent, DropdownItem, DropdownMenu, DropdownToggle, Lucide} from "../../../components";
import profilePicturee from "../../../../src/components/images/profilePicture.png"

export default function UserList() {

    const employeeList = [
        {
            name: 'Jon Kurtishi',
            description: 'Job position: Developer',
            profilePicture: profilePicturee,
            email: 'jon@example.com',
            telephone: '1234567890'
        },
        {
            name: 'Drenas Dika',
            description: 'Job position: Designer',
            profilePicture: profilePicturee,
            email: 'drenas@example.com',
            telephone: '2345678901'
        },
        {
            name: 'Enes Ismaili',
            description: 'Job position: Engineer',
            profilePicture: profilePicturee,
            email: 'enes@example.com',
            telephone: '3456789012'
        },
        {
            name: 'Artim Dauti',
            description: 'Job position: Analyst',
            profilePicture: profilePicturee,
            email: 'artim@example.com',
            telephone: '4567890123'
        },
        {
            name: 'Nermin Dauti',
            description: 'Job position: Manager',
            profilePicture: profilePicturee,
            email: 'nermin@example.com',
            telephone: '5678901234'
        },
    ];

    return (
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
            <div className="grid grid-cols-12 gap-6 mt-5 w-full">
                {employeeList.map((employee, i) => (<div
                    key={i}
                    className="intro-y col-span-12 md:col-span-6 lg:col-span-4"
                >
                    <div className="box">

                        <div className="flex z-50 z-[5] items-start px-5 pt-5">

                            <Dropdown className="absolute z-50 right-0 top-0 mr-5 mt-3">
                                <DropdownToggle tag="a" className="w-5 h-5 block" href="#">
                                    <Lucide
                                        icon="MoreHorizontal"
                                        className="w-5 h-5 text-slate-500"
                                    />
                                </DropdownToggle>
                                <DropdownMenu className="w-40">
                                    <DropdownContent>
                                        <DropdownItem>
                                            <Lucide icon="Edit2" className="w-4 h-4 mr-2"/> Remove
                                        </DropdownItem>

                                    </DropdownContent>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div className="text-center lg:text-left p-5">
                            <div
                                className="flex  text-lg items-center justify-center lg:justify-start  mt-2">
                                <Lucide icon="User" className="w-3 text-lg h-3 mr-2"/>
                                {employee.name}
                            </div>
                            <div
                                className="flex items-center   justify-center lg:justify-start text-slate-500 mt-2">
                                <Lucide icon="Phone" className="w-3 h-3 mr-2"/>
                                {employee.telephone}
                            </div>
                            <div
                                className="flex items-center  justify-center lg:justify-start text-slate-500 mt-2">
                                <Lucide icon="Mail" className="w-3 h-3 mr-2"/>
                                {employee.email}
                            </div>
                        </div>
                    </div>
                </div>))}
            </div>
        </div>

    )
}
