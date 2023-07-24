import React, {useEffect, useState} from "react";
import {ListOfDeletedProjects, RestoreDeletedProject} from "../../../../routes/routes";
import useError from "../../../../hooks/useError";
import {
    LoadingIcon,
    Lucide,
    Tippy,
    Modal,
    ModalBody
} from "../../../../components";
import NoData from "../../../public/no-data/Main";
import moment from "moment";
import Toastify from "toastify-js";

function DeletedProjects() {
    const [projectList, setProjectList] = useState([]);
    const [restoreModalPreview, setRestoreModalPreview] = useState(false);
    const [projectId, setProjectId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const setError = useError()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await ListOfDeletedProjects()
                setProjectList(response)
                setIsLoading(false)
            } catch (err) {
                setError(err)
            }
        };
        fetchData()
    }, [])

    const onRestoreProject = (id) => {
        setRestoreModalPreview(true)
        setProjectId(id)
    }

    const restoreDeletedProject = async () => {
        try {
            await RestoreDeletedProject({
                project_id: projectId
            })
            const newList = projectList.filter((item) => item.id !== projectId);
            setProjectList(newList)
            Toastify({
                node: dom("#success-notification-content")
                    .clone()
                    .removeClass("hidden")[0],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        } catch (err) {
            setError(err)
        }
        setRestoreModalPreview(false)
    }
    return (
        isLoading ? (
            <div
                className="col-span-6 sm:col-span-3 xl:col-span-2 grid h-screen place-items-center">
                <LoadingIcon icon="puff" className="w-14 h-14"/>
            </div>
        ) : (
            projectList.length !== 0 ? (
                <>
                    <Modal
                        show={restoreModalPreview}
                        onHidden={() => {
                            setRestoreModalPreview(false);
                        }}
                    >
                        <ModalBody className="p-0">
                            <div className="p-5 text-center">
                                <Lucide
                                    icon="XCircle"
                                    className="w-16 h-16 text-success mx-auto mt-3"
                                />
                                <div className="text-3xl mt-5">Are you sure?</div>
                                <div className="text-slate-500 mt-2">
                                    Do you really want to restore this project? <br/>
                                    This process can be undone if you wish to delete them again.
                                </div>
                            </div>
                            <div className="px-5 pb-8 text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRestoreModalPreview(false);
                                    }}
                                    className="btn btn-outline-secondary w-24 mr-1"
                                >
                                    Cancel
                                </button>
                                <button onClick={restoreDeletedProject} type="button" className="btn btn-success w-24">
                                    Restore
                                </button>
                            </div>
                        </ModalBody>
                    </Modal>
                    <h2 className="intro-y pb-5 pl-5 text-lg font-medium mt-10">Deleted Projects</h2>
                    <div className="grid grid-cols-12 gap-6 mt-5">
                        {projectList.map((project, i) => (
                            <div
                                key={i}
                                className="intro-y col-span-12 md:col-span-6 lg:col-span-4"
                            >
                                <div className="box">
                                    <div className="flex items-start px-5 pt-5">
                                        <div className="w-full items-center">
                                            <div className="text-center flex items-center lg:text-left mt-3 lg:mt-0">
                                                <a href="" className="font-medium">
                                                    {project.name}
                                                </a>
                                                <Tippy variant="primary"
                                                       className={'self-center cursor-pointer ml-auto mb-0.5'}
                                                       content="Restore this project"
                                                       options={{
                                                           theme: "light",
                                                       }}>
                                                    <Lucide icon={'RefreshCcw'} color={'green'}
                                                            onClick={() => onRestoreProject(project.id)}
                                                            className={'w-5 h-5'}/>
                                                </Tippy>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center lg:text-left p-5">
                                        <div>
                                            {project.description}
                                        </div>
                                        <div
                                            className="flex items-center justify-center lg:justify-start text-slate-500 mt-5">
                                            Start date: {moment(project.start_date).format("D MMM, YYYY")}
                                        </div>
                                        <div
                                            className="flex items-center justify-center lg:justify-start text-slate-500 mt-1">
                                            End date: {moment(project.end).format("D MMM, YYYY")}
                                        </div>
                                    </div>
                                    <div
                                        className="border-t pt-2 border-slate-200/60 dark:border-darkmode-400">
                                        <div className={'px-4 pb-4'}>
                                            Progress
                                            <div className="progress h-3.5">
                                                <div
                                                    style={{width: `${project.progress[project.progress.length - 1].Completed}%`}}
                                                    className={`progress-bar`}
                                                    role="progressbar"
                                                    aria-valuenow="0"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                >
                                                    {project.progress[project.progress.length - 1].Completed === 0 ? '' : project.progress[project.progress.length - 1].Completed + '%'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        id="success-notification-content"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-success"/>
                        <div className="ml-4 mr-4">
                            <div className="font-medium">Restored successfully!</div>
                            <div className="text-slate-500 mt-1">
                                Please check projects list!
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <NoData navigateTo={'projects/page/1'} label={'projects'}/>
            )
        )
    )
}

export default DeletedProjects
