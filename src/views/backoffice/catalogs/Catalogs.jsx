import {
    Dropdown,
    DropdownContent,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Lucide,
    Modal,
    ModalBody
} from "@/components";
import React, {useEffect, useState} from "react";
import {deleteCatalogById, getCatalogsByClientID} from "../../../routes/routes";
import useError from "../../../hooks/useError";
import {useNavigate, useParams} from "react-router-dom";
import Toastify from "toastify-js";
import Skeleton from "react-loading-skeleton";

function Catalogs() {
    const setError = useError();
    const {id} = useParams();
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [catalogs, setCatalogs] = useState(null);
    const [catalogId, setCatalogId] = useState(null);
    const [deleteModalPreview, setDeleteModalPreview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await getCatalogsByClientID(id)
                setCatalogs(response)
                setIsLoading(false)
            } catch (err) {
                setError(err);
                setIsLoading(false)
            }
        };
        fetchData();
    }, [0]);

    const onEdit = (id) => {
        setCatalogId(id)
        navigate(`catalog/edit/${id}`)
    }
    const onDelete = (id) => {
        setDeleteModalPreview(true)
        setCatalogId(id)
    }

    const deleteCatalog = async () => {

        try {
            const response = await deleteCatalogById(catalogId)
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
            const newList = catalogs.filter((item) => item.id !== catalogId);
            setCatalogs(newList)

        } catch (err) {
            setError(err)
        }
        setDeleteModalPreview(false)
    }

    return (
        isLoading ? (
            <div>
                <div className="intro-y block sm:flex items-center h-10">
                    <div className="ml-5 mr-5">
                        <Skeleton width={100}/>
                    </div>
                </div>
                <div
                    className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                    <div className="grid grid-cols-12 gap-6 mt-5 w-full">
                        <div className="intro-y col-span-12 md:col-span-6 lg:col-span-4">
                            <div className="box">
                                <div className="flex items-start px-5 pt-5">
                                    <div className="w-full flex flex-col lg:flex-row items-center">
                                        <div className=" text-center lg:text-left mt-3 lg:mt-0">
                                            <Skeleton width={70}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center lg:text-left p-5">
                                    <Skeleton count={3}/>
                                </div>
                            </div>
                        </div>
                        <div className="intro-y col-span-12 md:col-span-6 lg:col-span-4">
                            <div className="box">
                                <div className="flex items-start px-5 pt-5">
                                    <div className="w-full flex flex-col lg:flex-row items-center">
                                        <div className=" text-center lg:text-left mt-3 lg:mt-0">
                                            <Skeleton width={70}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center lg:text-left p-5">
                                    <Skeleton count={3}/>
                                </div>
                            </div>
                        </div>
                        <div className="intro-y col-span-12 md:col-span-6 lg:col-span-4">
                            <div className="box">
                                <div className="flex items-start px-5 pt-5">
                                    <div className="w-full flex flex-col lg:flex-row items-center">
                                        <div className=" text-center lg:text-left mt-3 lg:mt-0">
                                            <Skeleton width={70}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center lg:text-left p-5">
                                    <Skeleton count={3}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
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
                            <button onClick={deleteCatalog} type="button" className="btn btn-danger w-24">
                                Delete
                            </button>
                        </div>
                    </ModalBody>
                </Modal>
                <div>
                    <div className="block sm:flex items-center h-10">
                        <h2 className="text-lg ml-5 font-medium truncate mr-5">
                            Catalogs
                        </h2>
                        <div className="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                            <Dropdown className="mr-5">
                                <DropdownToggle tag="a" className="w-5 h-5 block" href="#">
                                    <Lucide
                                        icon="MoreHorizontal"
                                        className="w-5 h-5 text-slate-500"
                                    />
                                </DropdownToggle>
                                <DropdownMenu className="w-40">
                                    <DropdownContent>
                                        <DropdownItem onClick={() => {
                                            navigate(`catalog/create`)
                                        }}>
                                            <Lucide icon="Plus" className="w-4 h-4 mr-2"/> Add Catalog
                                        </DropdownItem>
                                    </DropdownContent>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                    <div
                        className="col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                        <div className="grid grid-cols-12 gap-6 mt-5 w-full">
                            {catalogs === null ? ('no catalogs') : (
                                catalogs.map((catalog, i) => (
                                    <div
                                        key={i}
                                        className="col-span-12 md:col-span-6 lg:col-span-4"
                                    >
                                        <div className="box">
                                            <div className="flex items-start px-5 pt-5">
                                                <div className="w-full flex flex-col lg:flex-row items-center">
                                                    <div className=" text-center lg:text-left mt-3 lg:mt-0">
                                                        <a href="" className="font-medium text-lg">
                                                            {catalog.name}
                                                        </a>
                                                        <div className="text-slate-500 text-xs mt-0.5">
                                                            {/*{employee?.roles[0]?.name}*/}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Dropdown className="absolute right-0 top-0 mr-5 mt-3">
                                                    <DropdownToggle tag="a" className="w-5 h-5 block"
                                                                    href="#">
                                                        <Lucide
                                                            icon="MoreHorizontal"
                                                            className="w-5 h-5 text-slate-500"
                                                        />
                                                    </DropdownToggle>
                                                    <DropdownMenu className="w-40">
                                                        <DropdownContent>
                                                            <DropdownItem onClick={() => onEdit(catalog.id)}>
                                                                <Lucide icon="Edit2" className="w-4 h-4 mr-2"/> Edit
                                                            </DropdownItem>
                                                            <DropdownItem onClick={() => onDelete(catalog.id)}>
                                                                <Lucide icon="Trash" className="w-4 h-4 mr-2"/> Delete
                                                            </DropdownItem>
                                                        </DropdownContent>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                            <div className="text-center lg:text-left p-5">
                                                <div
                                                    className="flex items-center justify-center lg:justify-start text-slate-500 mt-5">
                                                    Description: {catalog.description}

                                                </div>
                                                {/*<div*/}
                                                {/*    className="flex items-center justify-center lg:justify-start text-slate-500 mt-1">*/}
                                                {/*    Joined: {employee.created_at}*/}
                                                {/*</div>*/}
                                                {/*<div*/}
                                                {/*    className="flex items-center justify-center lg:justify-start text-slate-500 mt-1">*/}
                                                {/*    Gender : {employee.gender}*/}
                                                {/*</div>*/}
                                                {/*<div*/}
                                                {/*    className="flex items-center justify-center lg:justify-start text-slate-500 mt-1">*/}
                                                {/*    Phone Number: {employee.phone_number}*/}
                                                {/*</div>*/}
                                                {/*<div*/}
                                                {/*    className="flex items-center justify-center lg:justify-start text-slate-500 mt-1">*/}
                                                {/*    Status : {employee.status}*/}
                                                {/*</div>*/}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>
                    </div>
                    <div
                        id="success-notification-content"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-success"/>
                        <div className="ml-4 mr-4">
                            <div className="font-medium">Deleted successfully!</div>
                            <div className="text-slate-500 mt-1">
                                Please check your catalog list!
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    );
}

export default Catalogs;
