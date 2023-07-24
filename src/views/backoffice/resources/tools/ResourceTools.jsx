import React, {useCallback, useEffect, useState} from "react";
import {
    createTool,
    deleteToolbyId, getTools, getToolsOnChange,
    getToolsWithPagination,
    updateToolById
} from "../../../../routes/routes";
import useError from "../../../../hooks/useError";
import {useNavigate} from "react-router";
import {
    Lucide,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    PreviewComponent,
    Preview,
    Tippy,
    LoadingIcon
} from "@/components";
import Pagination from "../../../../components/pagination/Main";
import Toastify from "toastify-js";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import classnames from "classnames";
import Skeleton from "react-loading-skeleton";

function ResourceTools() {
    const [isLoading, setIsLoading] = useState(false)
    const [tools, setTools] = useState([])
    const [response, setResponse] = useState([])
    const [addNewToolModalPreview, setAddNewToolModalPreview] = useState(false);
    const [deleteToolModalPreview, setDeleteToolModalPreview] = useState(false);
    const [editToolModalPreview, setEditToolModalPreview] = useState(false);
    const pageNumberLimit = 5;
    const [maxPageLimit, setMaxPageLimit] = useState(5);
    const [minPageLimit, setMinPageLimit] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const setError = useError()
    const navigate = useNavigate();
    const [tool, setTool] = useState({
        id: '',
        name: '',
        number: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const res = await getToolsWithPagination(currentPage, pageSize)
                console.log(res.data)
                setTools(res.data)
                setResponse(res)
                setPageSize(res.meta?.per_page)
                setTotalCount(res.meta?.total)
                setIsLoading(false)
            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, [currentPage, pageSize]);


    const onPageChange = (pageNumber) => {
        navigate(`/resources/tools`)
        setCurrentPage(pageNumber);
    }
    const onChange = (e) => {
        setPageSize(e)
    }

    const onNextClick = () => {
        if (currentPage + 1 > maxPageLimit) {
            setMaxPageLimit(maxPageLimit + pageNumberLimit);
            setMinPageLimit(minPageLimit + pageNumberLimit);
        }
        navigate(`/resources/tools`)
        setCurrentPage(prev => prev + 1);
    }

    const onPrevClick = () => {
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageLimit(maxPageLimit - pageNumberLimit);
            setMinPageLimit(minPageLimit - pageNumberLimit);
        }
        navigate(`/resources/tools`)
        setCurrentPage(prev => prev - 1);
    }

    const onNavigate = () => {
        navigate(`/resources/tools`, {replace: true})
    }

    const paginationAttributes = {
        currentPage,
        maxPageLimit,
        minPageLimit,
        pageSize,
        totalCount,
        response: response,
    };
    const schema = yup
        .object({
            toolName: yup.string().required(),
            serialNumber: yup.string().required(),
        })
        .required();

    const {
        register,
        resetField,
        setValue,
        formState: {errors},
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            toolName: '',
            serialNumber: '',
            serialNumberUpdate: '',
            toolNameUpdate: '',
            addNewToolModalPreview: false
        },
        resolver: yupResolver(schema),
    });


    const onSubmit = useCallback(async (event) => {
        event.preventDefault()
        if (tool.name && tool.number) {
            try {
                const params = {
                    name: tool.name,
                    serial_number: tool.number,
                }
                const response = await createTool(params);
                setTools([...tools, response])
                resetField('toolName')
                resetField('serialNumber')
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
                Toastify({
                    node: dom("#failed-notification-content")
                        .clone()
                        .removeClass("hidden")[0],
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                }).showToast();
            }
        } else {
            Toastify({
                node: dom("#failed-notification-content")
                    .clone()
                    .removeClass("hidden")[0],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        }
        setAddNewToolModalPreview(false)
    }, [tool])

    const deleteTool = useCallback(async () => {
        try {
            await deleteToolbyId(tool.id)
            Toastify({
                node: dom("#success-deleted-content")
                    .clone()
                    .removeClass("hidden")[0],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
            const newList = tools.filter((item) => item.id !== tool.id);
            setTools(newList)
        } catch (err) {
            setError(err)
        }
        setDeleteToolModalPreview(false)
    }, [tool])

    const updateTool = async (tool) => {
        setTool({
            id: tool.id,
            name: tool.name,
            number: tool.serial_number
        })
        setEditToolModalPreview(true);
    }

    const onUpdate = useCallback(async (event) => {
        event.preventDefault()
        if (tool.name && tool.number) {
            try {
                const params = {
                    name: tool.name,
                    serial_number: tool.number,
                }
                const response = await updateToolById(params, tool.id);
                const newList = tools.map((item) => {
                    if (item.id === tool.id) {
                        return {
                            ...item, name: response.name, serial_number: response.serial_number
                        }
                    } else {
                        return {
                            ...item
                        }
                    }
                });
                setTools(newList)
                Toastify({
                    node: dom("#success-updated-content")
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
                Toastify({
                    node: dom("#failed-notification-content")
                        .clone()
                        .removeClass("hidden")[0],
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                }).showToast();
            }
        } else {
            Toastify({
                node: dom("#failed-notification-content")
                    .clone()
                    .removeClass("hidden")[0],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        }
        setEditToolModalPreview(false)
    }, [tool])

    const onDelete = useCallback(async (id) => {
        setTool({id: id, name: '', number: ''})
        setDeleteToolModalPreview(true)
    }, [])

    const handleSearch = async (e) => {

        let searchQuery = e.target.value
        if (searchQuery === '') {
            const tools = await getTools()
            setTools(tools)
            return
        }
        let searchTools = []
        try {
            searchTools = await getToolsOnChange(searchQuery)

        } catch (err) {
            setError(err)
        } finally {
            setTools(searchTools)
        }
    }


    return (
        <>
            {
                isLoading ? (
                    <div>
                        <div className="intro-y flex items-center mt-8">
                            <div className="mr-auto">
                                <Skeleton width={80}/>
                            </div>
                            <div className="w-full sm:w-auto flex mr-2  sm:mt-0 sm:ml-auto md:ml-0">
                                <Skeleton width={200}/>
                            </div>
                            <div className={'ml-auto'}>
                                <Skeleton width={100}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-6 ">
                            <div className="intro-y col-span-12 ">
                                <div className="p-5">
                                    <div className="grid grid-cols-12 gap-6 mt-5">
                                        <div className="intro-y col-span-12 md:col-span-6">
                                            <div className="box">
                                                <div className="flex flex-col lg:flex-row items-center p-5">
                                                    <div
                                                        className="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                                        <Skeleton width={200}/>
                                                        <div className="text-sm mt-0.5">
                                                            <Skeleton width={100}/>
                                                        </div>
                                                    </div>
                                                    <div className="flex mt-4 lg:mt-0">
                                                        <Skeleton width={50}/>
                                                        <Skeleton width={50} className={'ml-2'}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="intro-y col-span-12 md:col-span-6">
                                            <div className="box">
                                                <div className="flex flex-col lg:flex-row items-center p-5">
                                                    <div
                                                        className="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                                        <Skeleton width={200}/>
                                                        <div className="text-sm mt-0.5">
                                                            <Skeleton width={100}/>
                                                        </div>
                                                    </div>
                                                    <div className="flex mt-4 lg:mt-0">
                                                        <Skeleton width={50}/>
                                                        <Skeleton width={50} className={'ml-2'}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center mt-8">
                            <h2 className="text-lg font-medium mr-auto">Tools</h2>
                            <div className="w-56 relative text-slate-500">
                                <input
                                    type="text"
                                    className="form-control w-56 box pr-10"
                                    placeholder="Search..."
                                    onChange={handleSearch}
                                />
                                <Lucide
                                    icon="Search"
                                    className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                />
                            </div>
                            <div className={'flex  ml-auto'}>
                                <button onClick={() => {
                                    setAddNewToolModalPreview(true);
                                }} className="btn btn-primary shadow-md mr-2">
                                    Add New Tool
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-6 ">
                            <div className="col-span-12 ">
                                {/* BEGIN: Modal Size */}
                                <PreviewComponent>
                                    {({toggle}) => (
                                        <>
                                            <div className="p-5">
                                                <Preview>
                                                    <Modal
                                                        show={addNewToolModalPreview}
                                                        onHidden={() => {
                                                            setAddNewToolModalPreview(false);
                                                        }}
                                                    >
                                                        <form className="validate-form" onSubmit={onSubmit}>
                                                            <ModalHeader>
                                                                <h2 className="font-medium text-base mr-auto">
                                                                    Add new tool
                                                                </h2>
                                                            </ModalHeader>
                                                            <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        {...register("toolName")}
                                                                        id="validation-form-1"
                                                                        type="text"
                                                                        name="toolName"
                                                                        onInput={(e) => setTool(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                name: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.toolName,
                                                                        })}
                                                                        placeholder="Tool Name"
                                                                    />
                                                                    {errors.toolName && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.toolName.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Serial number
                                                                    </label>
                                                                    <input
                                                                        {...register("serialNumber")}
                                                                        id="validation-form-1"
                                                                        type="text"
                                                                        name="serialNumber"
                                                                        onInput={(e) => setTool(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                number: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.serialNumber,
                                                                        })}
                                                                        placeholder="Serial number"
                                                                    />
                                                                    {errors.serialNumber && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.serialNumber.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setAddNewToolModalPreview(false)}
                                                                    className="btn btn-outline-secondary w-20 mr-1"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button type="submit" className="btn btn-primary ">
                                                                    Create
                                                                </button>
                                                            </ModalFooter>
                                                        </form>
                                                    </Modal>
                                                    <Modal
                                                        show={editToolModalPreview}
                                                        onHidden={() => {
                                                            setEditToolModalPreview(false);
                                                        }}
                                                    >
                                                        <form className="validate-form" onSubmit={onUpdate}>
                                                            <ModalHeader>
                                                                <h2 className="font-medium text-base mr-auto">
                                                                    Edit tool
                                                                </h2>
                                                            </ModalHeader>
                                                            <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        {...register("toolNameUpdate")}
                                                                        {...setValue('toolNameUpdate', `${tool.name}`)}
                                                                        id="validation-form-1"
                                                                        type="text"
                                                                        name="toolNameUpdate"
                                                                        onInput={(e) => setTool(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                name: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.toolNameUpdate,
                                                                        })}
                                                                        placeholder="Tool Name"
                                                                    />
                                                                    {errors.toolNameUpdate && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.toolNameUpdate.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="col-span-12">
                                                                    <label className="form-label">
                                                                        Serial number
                                                                    </label>
                                                                    <input
                                                                        {...register("serialNumberUpdate")}
                                                                        {...setValue('serialNumberUpdate', `${tool.number}`)}
                                                                        id="validation-form-1"
                                                                        type="text"
                                                                        name="serialNumberUpdate"
                                                                        onInput={(e) => setTool(prevState => {
                                                                            return {
                                                                                ...prevState,
                                                                                number: e.target['value']
                                                                            }
                                                                        })}
                                                                        className={classnames({
                                                                            "form-control": true,
                                                                            "border-danger": errors.serialNumberUpdate,
                                                                        })}
                                                                        placeholder="Serial number"
                                                                    />
                                                                    {errors.serialNumberUpdate && (
                                                                        <div className="text-danger mt-2">
                                                                            {errors.serialNumberUpdate.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditToolModalPreview(false);
                                                                    }}
                                                                    className="btn btn-outline-secondary w-20 mr-1"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button type="submit" className="btn btn-primary ">
                                                                    Update
                                                                </button>
                                                            </ModalFooter>
                                                        </form>
                                                    </Modal>
                                                    <Modal
                                                        show={deleteToolModalPreview}
                                                        onHidden={() => {
                                                            setDeleteToolModalPreview(false);
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
                                                                        setDeleteToolModalPreview(false);
                                                                    }}
                                                                    className="btn btn-outline-secondary w-24 mr-1"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button onClick={deleteTool} type="button"
                                                                        className="btn btn-danger w-24">
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                    <div className="grid grid-cols-12 gap-6 mt-5">
                                                        {tools.map((tool, index) => (
                                                            <div key={index}
                                                                 className="col-span-12 md:col-span-6">
                                                                <div className="box">
                                                                    <div
                                                                        className="flex flex-col lg:flex-row items-center p-5">

                                                                        <div
                                                                            className="lg:ml-2 lg:mr-auto text-center lg:text-left text-2xl mt-3 lg:mt-0">
                                                                            <div className="font-medium">
                                                                                {tool.name}
                                                                            </div>
                                                                            <div
                                                                                className="text-slate-500 text-sm  mt-0.5">
                                                                                {tool.serial_number}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex mt-4 lg:mt-0">
                                                                            <Tippy
                                                                                tag="div"
                                                                                className=" text-gray-400 cursor-pointer"
                                                                                content="Edit this tool"
                                                                                options={{
                                                                                    theme: "light",
                                                                                }}
                                                                            >
                                                                                <div className="flex items-center mr-3"
                                                                                     onClick={() => {
                                                                                         updateTool(tool)
                                                                                     }}>
                                                                                    <Lucide icon="CheckSquare"
                                                                                            className="w-4 h-4 mr-1"/> Edit
                                                                                </div>

                                                                            </Tippy>

                                                                            <Tippy
                                                                                tag="div"
                                                                                className=" text-gray-400 cursor-pointer"
                                                                                content="Delete this tool"
                                                                                options={{
                                                                                    theme: "light",
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    className="flex items-center text-danger"
                                                                                    onClick={() => onDelete(tool.id)}
                                                                                >
                                                                                    <Lucide icon="Trash2"
                                                                                            className="w-4 h-4 mr-1"/> Delete
                                                                                </div>
                                                                            </Tippy>

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
                                                                onNavigate={onNavigate}
                                                    />

                                                    <div
                                                        id="success-notification-content"
                                                        className="toastify-content hidden flex"
                                                    >
                                                        <Lucide icon="CheckCircle" className="text-success"/>
                                                        <div className="ml-4 mr-4">
                                                            <div className="font-medium">Created successfully!</div>
                                                            <div className="text-slate-500 mt-1">
                                                                Please check your tools list!
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        id="failed-notification-content"
                                                        className="toastify-content hidden flex"
                                                    >
                                                        <Lucide icon="XCircle" className="text-danger"/>
                                                        <div className="ml-4 mr-4">
                                                            <div className="font-medium">Create failed!</div>
                                                            <div className="text-slate-500 mt-1">
                                                                Please check the field form.
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        id="success-deleted-content"
                                                        className="toastify-content hidden flex"
                                                    >
                                                        <Lucide icon="CheckCircle" className="text-success"/>
                                                        <div className="ml-4 mr-4">
                                                            <div className="font-medium">Deleted successfully!</div>
                                                            <div className="text-slate-500 mt-1">
                                                                Please check your tools list!
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        id="success-updated-content"
                                                        className="toastify-content hidden flex"
                                                    >
                                                        <Lucide icon="CheckCircle" className="text-success"/>
                                                        <div className="ml-4 mr-4">
                                                            <div className="font-medium">Updated successfully!</div>
                                                            <div className="text-slate-500 mt-1">
                                                                Please check your tools list!
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Preview>
                                            </div>
                                        </>
                                    )}
                                </PreviewComponent>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}

export default ResourceTools;
