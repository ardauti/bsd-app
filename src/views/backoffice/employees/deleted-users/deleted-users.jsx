import {allOfDeletedUsers, restoreUser} from "../../../../routes/routes";
import useError from "../../../../hooks/useError";
import React, {useEffect, useState} from "react";
import {
    LoadingIcon,
    Lucide, Modal, ModalBody
} from "../../../../components";
import Toastify from "toastify-js";
import NoData from "../../../public/no-data/Main";

function DeletedUsers() {
    const [usersList, setUsersList] = useState([]);
    const setError = useError()
    const [restoreModalPreview, setRestoreModalPreview] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await allOfDeletedUsers();
                setUsersList(response)
                setIsLoading(false)
            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, []);

    const onRestoreUser = (id) => {
        setRestoreModalPreview(true)
        setUserId(id)
    }

    const restoreDeletedUser = async () => {
        try {
            await restoreUser(userId)
            const newList = usersList.filter((item) => item.id !== userId);
            setUsersList(newList)
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
            usersList.length !== 0 ? (
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
                                    Do you really want to restore this user? <br/>
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
                                <button onClick={restoreDeletedUser} type="button" className="btn btn-success w-24">
                                    Restore
                                </button>
                            </div>
                        </ModalBody>
                    </Modal>
                    <div
                        id="success-notification-content"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-success"/>
                        <div className="ml-4 mr-4">
                            <div className="text-slate-500 mt-1">
                                User restored successfully!
                            </div>
                        </div>
                    </div>
                    <h2 className="intro-y text-lg font-medium mt-10">Deleted Users</h2>
                    <div className="grid grid-cols-12 gap-6 mt-5">
                        {usersList.map((user, i) => (
                            <div
                                key={i}
                                className="intro-y col-span-12 md:col-span-6 lg:col-span-4"
                            >
                                <div className="box">
                                    <div className="flex items-start px-5 pt-5">
                                        <div className="w-full flex flex-col lg:flex-row items-center">
                                            <div className="w-16 h-16 image-fit">
                                                <img
                                                    alt="Midone Tailwind HTML Admin Template"
                                                    className="rounded-full"
                                                    src={user?.user_profile?.profile_picture}
                                                />
                                            </div>
                                            <div className="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
                                                <a href="" className="font-medium">
                                                    {user.user_profile.first_name} {user.user_profile.last_name}
                                                </a>
                                                <div className="text-slate-500 text-xs mt-0.5">
                                                    {user.roles[0].name}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="text-center lg:text-left p-5">
                                        <div>
                                            Description part
                                        </div>
                                        <div
                                            className="flex items-center justify-center lg:justify-start text-slate-500 mt-5">
                                            <Lucide icon="Mail" className="w-3 h-3 mr-2"/>
                                            {user.email}
                                        </div>
                                        <div
                                            className="flex items-center justify-center lg:justify-start text-slate-500 mt-1">
                                            <Lucide icon="Instagram" className="w-3 h-3 mr-2"/>
                                            {user.user_profile.first_name}
                                        </div>
                                    </div>
                                    <div
                                        className="text-center lg:text-right p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                        <button onClick={() => onRestoreUser(user.id)}
                                                className="btn btn-outline-secondary py-1 px-2">
                                            Restore this user
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
               <NoData navigateTo={'employees/page/1'} label={'users'}/>
            )
        )
    );
}

export default DeletedUsers
