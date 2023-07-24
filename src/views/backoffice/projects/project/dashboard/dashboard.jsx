import React, {useContext, useEffect, useState} from 'react';
import ReportBarChart1 from "../../../../../components/report-bar-chart-1/Main";
import {Lucide} from "../../../../../components";
import {Link, useParams} from "react-router-dom";
import './dashboard.css'
import {getProjectbyId} from "../../../../../routes/routes";
import useError from "../../../../../hooks/useError";
import DataContext from "../../../../../context/DataContext";
function Dashboard(props) {

    const [isLoading, setIsLoading] = useState(false);
    const [project, setProject] = useState({
        id: '',
        name: '',
        startDate: '',
        endDate: '',
        clientId: '',
        statusId: '',
        progress: [],
        description: '',
        resources: {
            employees: ''
        },
        statusDescription: '',
        projectStatus: '',
        client: ''
    });
    const setError = useError();
    const {id} = useParams();
    let {taskUpdated, setTaskUpdated} = useContext(DataContext)

    useEffect(() => {
        const fetchData = async () => {
            if (taskUpdated) {
                setIsLoading(true);
                try {
                    const res = await getProjectbyId(id);
                    setProject(prevState => {
                        return {
                            ...prevState,
                            id: res.id,
                            name: res.name,
                            startDate: res.start_date,
                            endDate: res.end_date,
                            progress: res.progress,
                            statusId: res.status.id,
                            clientId: res.client.id,
                            description: res.description,
                            statusDescription: res.status.description,
                            projectStatus: res.status.status,
                            client: res.client.company_name
                        }
                    })
                    props.data.progress = res.progress
                    setIsLoading(false);
                    setTaskUpdated(false)
                } catch (err) {
                    setError(err);
                }
            }
        };
        fetchData()
    }, []);

    const client_id = project.clientId ? project.clientId : props.data.clientId;

    const colors = ['bg-secondary', 'bg-warning', 'bg-danger', 'bg-success'];

    return (
        isLoading ? (
            <div>

            </div>
        ) : (
            <div className="grid  grid-cols-1 md:grid-cols-5 gap-4">
                <div className="col-span-1 md:col-span-4 p-4">
                    <div className=" flex items-center ">
                        <h2 className="text-lg font-medium truncate mr-5">
                            General Report
                        </h2>
                    </div>
                    <div className="box intro-y mt-5 task-report-box">
                        <div className="box general-report-box grid grid-cols-12">
                            <div className="col-span-12 lg:col-span-4 px-8 py-12 flex flex-col justify-center">
                                <Lucide icon="PieChart" className="w-10 h-10 text-pending"/>
                                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mt-12">
                                    Description
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-slate-500">{project.description ? project.description : props.data.description}</p>
                                </div>
                            </div>
                            <div
                                className="col-span-12 lg:col-span-8 p-8 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-darkmode-300 border-dashed">
                                <div>
                                    <div
                                        className="nav-pills w-60 border border-slate-300 dark:border-darkmode-300 border-dashed rounded-md mx-auto p-1 mb-8 text-center">
                                        <div className="w-full py-1.5 px-2">
                                            {project.name ? project.name : props.data.name}
                                        </div>
                                    </div>
                                    <div className="px-5 pb-5">
                                        <div className="grid grid-cols-12 gap-y-8 gap-x-10">
                                            <div className="col-span-6 sm:col-span-6 md:col-span-4">
                                                <div className="text-slate-500">Start Date</div>
                                                <div className="mt-1.5 flex items-center">
                                                    <div
                                                        className="text-base">{project.startDate ? project.startDate : props.data.startDate}</div>
                                                </div>
                                            </div>
                                            <div className="col-span-12 sm:col-span-6 md:col-span-4">
                                                <div className="text-slate-500">End Date</div>
                                                <div className="mt-1.5 flex items-center">
                                                    <div
                                                        className="text-base">{project.endDate ? project.endDate : props.data.endDate}</div>
                                                </div>
                                            </div>
                                            <div className="col-span-12 sm:col-span-6 md:col-span-4">
                                                <div className="text-slate-500">
                                                    Client
                                                </div>
                                                <Link to={`/clients/client/${client_id}/dashboard`}
                                                      className="mt-1.5 flex items-center">
                                                    {project.client ? project.client : props.data.client}
                                                </Link>
                                            </div>
                                            <div className="col-span-12 sm:col-span-6 md:col-span-4">
                                                <div className="col-span-12 sm:col-span-6 md:col-span-4">
                                                    <div className="text-slate-500">Status</div>
                                                    <div className="mt-1.5 flex items-center">
                                                        <div
                                                            className="text-base">{project.projectStatus ? project.projectStatus : props.data.projectStatus}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-12 sm:col-span-6 md:col-span-4">
                                                <div className="text-slate-500">
                                                    Status Description
                                                </div>
                                                <div className="mt-1.5 flex items-center">
                                                    <div
                                                        className="text-base">{project.statusDescription ? project.statusDescription : props.data.statusDescription}</div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-1 p-4">
                    <div className=" flex items-center ">
                        <h2 className="text-lg  font-medium truncate mr-5">
                            Task Report
                        </h2>
                    </div>
                    <div className="intro-y box p-5 mt-5 general-report-box">
                        <div className="mt-3">
                            <ReportBarChart1 data={project.id ? project : props.data} height={200}/>
                        </div>
                        <div className="w-52 sm:w-auto mx-auto mt-8">
                            {project.progress.length !== 0 ? (
                                project.progress.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className={`w-2 h-2 ${colors[index]} rounded-full mr-3`}></div>
                                        <span className="truncate">{Object.keys(item)[0]}</span>
                                        <span className="font-medium ml-auto">{Object.values(item)[0]}%</span>
                                    </div>
                                ))
                            ) : (
                                props.data.progress.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className={`w-2 h-2 ${colors[index]} rounded-full mr-3`}></div>
                                        <span className="truncate">{Object.keys(item)[0]}</span>
                                        <span className="font-medium ml-auto">{Object.values(item)[0]}%</span>
                                    </div>
                                ))
                            )}

                        </div>

                    </div>
                </div>
                <br/>
            </div>))


}


export default Dashboard;