import {cancelInvitation, renderInvitedUsers} from "../../../../routes/routes";
import React, {useEffect, useState} from "react";
import * as $_ from "lodash";
import useError from "../../../../hooks/useError";
import {LoadingIcon, Lucide, Modal, ModalBody} from "../../../../components";
import classnames from "classnames";
import Toastify from "toastify-js";
import {useNavigate} from "react-router";
import NoData from "../../../public/no-data/Main";

function CancelInvitation() {

    const [invitedList, setInvitedList] = useState(null);
    const [invitationToken, setInvitationToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const setError = useError()
    const [deleteModalPreview, setDeleteModalPreview] = useState(false);
    const [invitationFill, setInvitationFill] = useState(true)
    const navigate = useNavigate()


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await renderInvitedUsers();
                setIsLoading(false)
                console.log(response)
                setInvitedList(response)
                if (response.length < 1) {
                    setInvitationFill(false)
                }
            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, []);

    const onDelete = (invitation_token) => {
        setDeleteModalPreview(true)
        setInvitationToken(invitation_token)
    }

    const cancelInvitationRequest = async () => {
        try {
            await cancelInvitation({
                invitation_token: invitationToken
            })
            const newList = invitedList.filter((item) => item.invitation_token !== invitationToken);
            setInvitedList(newList)
            if (newList.length < 1) {
                setInvitationFill(false)
            }
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
        setDeleteModalPreview(false)
    }

    function navigateToInvitation() {
        navigate('/employees/invite', {replace: true})
    }

    return (
        isLoading ? (
            <div
                className="col-span-6 sm:col-span-3 xl:col-span-2 grid h-screen place-items-center">
                <LoadingIcon icon="puff" className="w-14 h-14"/>
            </div>
        ) : (
            invitationFill ? (
                <>

                    <Modal
                        show={deleteModalPreview}
                        onHidden={() => {
                            setDeleteModalPreview(false);
                        }}
                    >
                        <ModalBody className="p-0">
                            <div className="p-5 text-center">
                                <Lucide
                                    icon="UserMinus"
                                    className="w-16 h-16 text-danger mx-auto mt-3"
                                />
                                <div className="text-3xl mt-5">Are you sure?</div>
                                <div className="text-slate-500 mt-2">
                                    Do you really want to delete these records? <br/>
                                    This process cannot be undone.
                                </div>
                            </div>
                            <div className="px-5 pb-8 text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteModalPreview(false);
                                    }}
                                    className="btn btn-outline-secondary w-24 mr-1"
                                >
                                    Cancel
                                </button>
                                <button onClick={cancelInvitationRequest} type="button" className="btn btn-danger w-24">
                                    Remove
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
                                Invitation canceled successfully!
                            </div>
                        </div>
                    </div>


                    <h2 className="intro-y text-lg font-medium mt-10">Invited Users</h2>

                    <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        <table className="table table-report -mt-2">
                            <thead>
                            <tr>
                                <th className="whitespace-nowrap">AMOUNT</th>
                                <th className="whitespace-nowrap">ROLE</th>
                                <th className="text-center whitespace-nowrap">EMAIL</th>
                                <th className="whitespace-nowrap"></th>
                                <th className="whitespace-nowrap"></th>
                                <th className="text-center whitespace-nowrap">REMOVE</th>
                            </tr>
                            </thead>
                            <tbody>
                            {$_.take(invitedList, 20).map((user, i) => (

                                <tr key={i} className="intro-x">
                                    <td className="w-40">
                                        <div className="flex pl-6">
                                            {i + 1}
                                        </div>
                                    </td>
                                    <td>
                                        <a href="" className="font-medium whitespace-nowrap">
                                            {user.roles[0].name}
                                        </a>
                                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">

                                        </div>
                                    </td>
                                    <td className="text-center">
                                        {user.email}
                                    </td>
                                    <td className="text-center">
                                        {/*${faker.totals[0]}*/}
                                    </td>
                                    <td className="w-40">
                                        <div
                                            className={classnames({
                                                "flex items-center justify-center": true,
                                            })}
                                        >

                                        </div>
                                    </td>
                                    <td
                                        className="table-report__action w-56">
                                        <div onClick={() => onDelete(user.invitation_token)}
                                             className="flex justify-center items-center">

                                            <a
                                                className="flex items-center text-danger"
                                                href="#"
                                            >
                                                <Lucide
                                                    icon="Trash2" className="w-4 h-4 mr-1"/> Remove invitation
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <NoData navigateTo={'employees/invite'} label={'invite employees'}/>
            )
        )
    )
}

export default CancelInvitation
