import {
    Lucide,
    Modal,
    ModalBody,
    Tippy
} from "@/components";
import React, {useContext, useEffect, useState} from 'react';
import Pagination from "../../../../../../components/pagination/Main";
import useError from "../../../../../../hooks/useError";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import {
    deleteProjectResource,
    getToolResources,
} from "../../../../../../routes/routes";
import Toastify from "toastify-js";
import {VscTools} from "@react-icons/all-files/vsc/VscTools";
import DataContext from "../../../../../../context/DataContext";
import NoData from "../../../../../public/no-data/Main";
import Skeleton from "react-loading-skeleton";


function ResourceTools(props) {
    const navigate = useNavigate();
    const setError = useError()
    const [tools, setTools] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [resourceId, setResourceId] = useState('')
    const {id} = useParams();
    const [pageSize, setPageSize] = useState(15);
    const [deleteModalForToolResource, setDeleteModalForToolResource] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageNumberLimit = 5;
    const [maxPageLimit, setMaxPageLimit] = useState(5);
    const [minPageLimit, setMinPageLimit] = useState(0);
    const [response, setResponse] = useState([]);
    let {setToolsResource} = useContext(DataContext)


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await getToolResources(id, currentPage, pageSize)
                setTools(response.data)
                setToolsResource(response.data)
                setResponse(response)
                setPageSize(response.meta.per_page)
                setTotalCount(response.meta.total)
                setIsLoading(false)
            } catch (err) {
                setError(err);
                setIsLoading(false)
            }
        };

        fetchData();
    }, [currentPage, pageSize, props.createdResource]);

    const onPageChange = (pageNumber) => {
        if (pageNumber)
            navigate(`/projects/project/${id}/resources`)
        setCurrentPage(pageNumber);
    }

    const onPrevClick = () => {
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageLimit(maxPageLimit - pageNumberLimit);
            setMinPageLimit(minPageLimit - pageNumberLimit);
        }
        navigate(`/projects/project/${id}/resources`, {replace: true})
        setCurrentPage(prev => prev - 1);
    }
    const onNextClick = () => {
        if (currentPage + 1 > maxPageLimit) {
            setMaxPageLimit(maxPageLimit + pageNumberLimit);
            setMinPageLimit(minPageLimit + pageNumberLimit);
        }
        navigate(`/projects/project/${id}/resources`, {replace: true})
        setCurrentPage(prev => prev + 1);
    }
    const onChange = (e) => {
        setPageSize(e)
    }
    const onNavigate = (id) => {
        navigate(`/projects/project/${id}/resources`, {replace: true})
    }

    const paginationAttributes = {
        currentPage,
        maxPageLimit,
        minPageLimit,
        pageSize,
        totalCount,
        response: response,
    };

    const removeResource = async () => {
        try {
            await deleteProjectResource(Number(id), props.resourceType, resourceId)
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
            const newList = tools.filter((item) => item.tool_id !== resourceId);
            setTools(newList)
            setToolsResource(newList)
        } catch (err) {
            setError(err)
        }
        setDeleteModalForToolResource(false)
    }

    return (
        isLoading ? (
            <div className="intro-y flex items-center mt-2">
                <div className={'w-full'}>
                    <div className="grid grid-cols-12 gap-6 mt-5">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div className="report-box zoom-in">
                                    <div className="box p-5">
                                        <div className="flex">
                                            <Skeleton circle width={30} height={30}/>
                                            <div className="ml-auto">
                                                <Skeleton circle width={30} height={30}/>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-medium leading-8 mt-6">
                                            <Skeleton width={100} />
                                        </div>
                                        <div className="text-base text-slate-500 mt-1">
                                            <Skeleton width={50} />
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            <Skeleton width={70} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                            <div className="report-box zoom-in">
                                <div className="box p-5">
                                    <div className="flex">
                                        <Skeleton circle width={30} height={30}/>
                                        <div className="ml-auto">
                                            <Skeleton circle width={30} height={30}/>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-medium leading-8 mt-6">
                                        <Skeleton width={100} />
                                    </div>
                                    <div className="text-base text-slate-500 mt-1">
                                        <Skeleton width={50} />
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">
                                        <Skeleton width={70} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                            <div className="report-box zoom-in">
                                <div className="box p-5">
                                    <div className="flex">
                                        <Skeleton circle width={30} height={30}/>
                                        <div className="ml-auto">
                                            <Skeleton circle width={30} height={30}/>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-medium leading-8 mt-6">
                                        <Skeleton width={100} />
                                    </div>
                                    <div className="text-base text-slate-500 mt-1">
                                        <Skeleton width={50} />
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">
                                        <Skeleton width={70} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                            <div className="report-box zoom-in">
                                <div className="box p-5">
                                    <div className="flex">
                                        <Skeleton circle width={30} height={30}/>
                                        <div className="ml-auto">
                                            <Skeleton circle width={30} height={30}/>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-medium leading-8 mt-6">
                                        <Skeleton width={100} />
                                    </div>
                                    <div className="text-base text-slate-500 mt-1">
                                        <Skeleton width={50} />
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">
                                        <Skeleton width={70} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            tools.length !== 0 ? (
                <>
                <Modal
                    show={deleteModalForToolResource}
                    onHidden={() => {
                        setDeleteModalForToolResource(false);
                    }}
                >
                    <ModalBody className="p-0">
                        <div className="p-5 text-center">
                            <Lucide
                                icon="XCircle"
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
                                    setDeleteModalForToolResource(false);
                                }}
                                className="btn btn-outline-secondary w-24 mr-1"
                            >
                                Cancel
                            </button>
                            <button onClick={removeResource} type="button" className="btn btn-danger w-24">
                                Delete
                            </button>
                        </div>
                    </ModalBody>
                </Modal>
                <div className="flex items-center mt-2">
                    <div className={'w-full'}>
                        <div className="grid grid-cols-12 gap-6 mt-5">
                            {tools.map((tool, i) => (
                                <div className="col-span-12 sm:col-span-6 xl:col-span-3" key={i}>
                                    <div className="report-box zoom-in">
                                        <div className="box p-5">
                                            <div className="flex">
                                                <VscTools className={'w-6 h-6'} color={'#202a3b'}/>
                                                <div className="ml-auto">
                                                    <Tippy
                                                        tag="div"
                                                        className=" text-gray-400 cursor-pointer"
                                                        content="Remove this tool"
                                                        options={{
                                                            theme: "light",
                                                        }}
                                                    >
                                                        <Lucide onClick={() => {
                                                            setDeleteModalForToolResource(true)
                                                            setResourceId(tool.tool_id)
                                                        }} icon="Trash" color={'#b4141b'} className="w-5 h-5"/>
                                                    </Tippy>
                                                </div>
                                            </div>
                                            <div className="text-3xl font-medium leading-8 mt-6">
                                                {tool.name}
                                            </div>
                                            <div className="text-base text-slate-500 mt-1">
                                                {tool.serial_number}
                                            </div>
                                            <div className="text-sm text-gray-400 mt-1">
                                                Weight: {tool.weight}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination {...paginationAttributes}
                                    onPrevClick={onPrevClick}
                                    onNextClick={onNextClick}
                                    onPageChange={onPageChange}
                                    onChange={onChange}
                                    onNavigate={(id) => onNavigate(id)}
                        />
                    </div>
                    <div
                        id="success-notification-content"
                        className="toastify-content hidden flex"
                    >
                        <Lucide icon="CheckCircle" className="text-success"/>
                        <div className="ml-4 mr-4">
                            <div className="font-medium">Deleted successfully!</div>
                            <div className="text-slate-500 mt-1">
                                Please check your tool list!
                            </div>
                        </div>
                    </div>
                </div>
            </>
            ) : (
                <NoData customize={true}/>
            )
          )

    );
}

export default ResourceTools;
