import React, {useEffect, useState} from "react";
import {listDeletedClients, restoreClient} from "../../../../routes/routes";
import useError from "../../../../hooks/useError";
import {LoadingIcon, Lucide, Modal, ModalBody, Tippy} from "../../../../components";
import classnames from "classnames";
import NoData from "../../../public/no-data/Main";
import Toastify from "toastify-js";

function DeletedClients() {
    const [clientList, setClientList] = useState([]);
    const setError = useError()
    const [isLoading, setIsLoading] = useState(false);
    const [restoreModalPreview, setRestoreModalPreview] = useState(false);
    const [clientId, setClientId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await listDeletedClients();
                setIsLoading(false)
                setClientList(response)
            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, []);

    const onRestoreClient = (id) => {
        setRestoreModalPreview(true)
        setClientId(id)
    }

    const restoreDeletedClient = async () => {
        try {
            await restoreClient({
                client_id: clientId
            })
            const newList = clientList.filter((item) => item.id !== clientId);
            setClientList(newList)
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
            clientList.length !== 0 ? (
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
                                    Do you really want to restore this client? <br/>
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
                                <button onClick={restoreDeletedClient} type="button" className="btn btn-success w-24">
                                    Restore
                                </button>
                            </div>
                        </ModalBody>
                    </Modal>
                    <h2 className="intro-y text-lg font-medium mt-10">Deleted Client List</h2>
                    <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        <table className="table table-report -mt-2">
                            <thead>
                            <tr>
                                <th className="whitespace-nowrap">Client's</th>
                                <th className="whitespace-nowrap">Company Name & Email</th>
                                <th className="whitespace-nowrap">Phone Number</th>
                                <th className="whitespace-nowrap">Country</th>
                                <th className="whitespace-nowrap">City</th>
                                <th className="whitespace-nowrap">Street & Postal Code</th>
                                <th className="whitespace-nowrap">Restore Client</th>
                            </tr>
                            </thead>
                            <tbody>
                            {clientList.map((client, i) => (
                                <tr key={i} className="intro-x">
                                    <td className="text-center">
                                        {i + 1}
                                    </td>
                                    <td>
                                        <a href="" className="font-medium whitespace-nowrap">
                                            {client.company_name}
                                        </a>
                                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                            {client.email}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        {client.phone_number}
                                    </td>
                                    <td className="text-center">
                                        {client.country}
                                    </td>
                                    <td className="w-40">
                                        <div
                                            className={classnames({
                                                "flex items-center justify-center": true,
                                            })}
                                        >
                                            {client.city}
                                        </div>
                                    </td>
                                    <td>
                                        <a href="" className="font-medium whitespace-nowrap">
                                            {client.street}
                                        </a>
                                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                            {client.postal_code}
                                        </div>
                                    </td>
                                    <td
                                        className="table-report__action ">
                                        <div
                                            className={classnames({
                                                "flex items-center justify-center": true,
                                            })}
                                        >
                                            <Tippy variant="primary"
                                                   className={'cursor-pointer mb-0.5'}
                                                   content="Restore this project"
                                                   options={{
                                                       theme: "light",
                                                   }}>
                                                <Lucide icon={'RefreshCcw'} color={'green'}
                                                        onClick={() => onRestoreClient(client.id)}
                                                        className={'w-5 h-5 text-center'}/>
                                            </Tippy>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div
                        id="success-notification-content"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-success"/>
                        <div className="ml-4 mr-4">
                            <div className="font-medium">Restored successfully!</div>
                            <div className="text-slate-500 mt-1">
                                Please check clients list!
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <NoData navigateTo={'clients/page/1'} label={'clients'}/>
            )
        )
    )
}

export default DeletedClients
