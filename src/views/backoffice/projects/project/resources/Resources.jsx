import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    Lucide,
    Dropdown,
    DropdownContent,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@/components";
import ResourceEmployees from "./employees/ResourceEmployees";
import {
    createProjectResource,
    getResourceTypes,
    getTools, getToolsOnChange,
    getUsersOnChange,
    getUsersTest,
    getVehicles,
    getVehiclesOnChange
} from "../../../../../routes/routes";
import useError from "../../../../../hooks/useError";
import ResourceTools from "./tools/ResourceTools";
import ResourceVehicles from "./vehicles/ResourceVehicles";
import {useNavigate} from "react-router";
import {AiOutlineCar} from "@react-icons/all-files/ai/AiOutlineCar";
import Skeleton from 'react-loading-skeleton';
import Select from "react-select";
import DataContext from "../../../../../context/DataContext";
import makeAnimated from "react-select/animated";
import {useParams} from "react-router-dom";
import CustomButton from "../../../../../components/customButton/CustomButon";

const animatedComponents = makeAnimated();

function Resources() {
    const [activeState, setActiveState] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [resourceTypes, setResourceTypes] = useState([]);
    const [resourceType, setResourceType] = useState('Employee');
    const [resourceTypeId, setResourceTypeId] = useState(1);
    const setError = useError();
    const {id} = useParams();
    const [addNewToolModalPreview, setAddNewToolModalPreview] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [tools, setTools] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectMultiple, setSelectMultiple] = useState([]);
    let options;
    let {employeesResource, toolsResource, vehiclesResource} = useContext(DataContext)
    const [employeesResourceIds, setEmployeesResourceIds] = useState([])
    const [toolsResourceIds, setToolsResourceIds] = useState([])
    const [vehiclesResourceIds, setVehiclesResourceIds] = useState([])
    const [loading, setLoading] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);




    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await getResourceTypes()
                setResourceTypes(response)
                setIsLoading(false)
            } catch (err) {
                setError(err);
                setIsLoading(false)
            }
        };
        fetchData();
    }, []);

    const handleResource = useCallback(async (event, resourceType) => {
        setResourceTypeId(resourceType.id)
        setResourceType(resourceType.type)
        setActiveState(Number(event.currentTarget.id))
    }, [activeState, resourceTypeId])

    useEffect(() => {
        setEmployeesResourceIds(employeesResource.map(({id}) => id))
        setToolsResourceIds(toolsResource.map(({tool_id}) => tool_id))
        setVehiclesResourceIds(vehiclesResource.map(({vehicle_id}) => vehicle_id))
        if (resourceTypeId === 1) {
            const fetchData = async () => {
                try {
                    const employees = await getUsersTest()
                    setEmployees(employees)
                } catch (err) {
                    setError(err);
                }
            };
            fetchData();
        } else if (resourceTypeId === 2) {
            const fetchData = async () => {
                try {
                    const vehicles = await getVehicles()
                    setVehicles(vehicles)
                } catch (err) {
                    setError(err);
                }
            };
            fetchData();
        } else if (resourceTypeId === 3) {
            const fetchData = async () => {
                try {
                    const tools = await getTools()
                    setTools(tools)
                } catch (err) {
                    setError(err);
                }
            };
            fetchData();
        }
    }, [employeesResource, toolsResource, vehiclesResource]);

    console.log(employeesResource)
    console.log(toolsResource)
    console.log(vehiclesResource)


    const handleSearch = async (searchQuery) => {
        if (resourceTypeId === 1) {
            if (searchQuery.trim().length === 0) {
                setEmployees([])
                return
            }
            setLoading(true)
            let employees = []
            try {
                employees = await getUsersOnChange(searchQuery)
            } catch (err) {
                setError(err)
            } finally {
                setEmployees(employees)
                setLoading(false)
            }
        }
        if (resourceTypeId === 2) {
            if (searchQuery.trim().length === 0) {
                setVehicles([])
                return
            }
            setLoading(true)
            let vehicles = []
            try {
                vehicles = await getVehiclesOnChange(searchQuery)
            } catch (err) {
                setError(err)
            } finally {
                setVehicles(vehicles)
                setLoading(false)
            }
        }
        if (resourceTypeId === 3) {
            if (searchQuery.trim().length === 0) {
                setTools([])
                return
            }
            setLoading(true)
            let tools = []
            try {
                tools = await getToolsOnChange(searchQuery)
            } catch (err) {
                setError(err)
            } finally {
                setTools(tools)
                setLoading(false)
            }
        }
    }
    const optionsEmployee = employees.map(function (employee) {
        if (employeesResourceIds.includes(employee.id)) {
            return {
                value: employee.id,
                label: employee.user_profile.display_name + ' (Already added) ',
                isDisabled: true
            };
        }
        return {value: employee.id, label: employee.user_profile.display_name};

    })
    const optionsTools = tools.map(function (tool) {
        if (toolsResourceIds.includes(tool.id)) {
            return {
                value: tool.id,
                label: tool.name + ' (Already added) ',
                isDisabled: true
            };
        }
        return {value: tool.id, label: tool.name};
    })
    const optionsVehicles = vehicles.map(function (vehicle) {
        if (vehiclesResourceIds.includes(vehicle.id)) {
            return {
                value: vehicle.id,
                label: vehicle.manufacturer + ' (Already added) ',
                isDisabled: true
            };
        }
        return {value: vehicle.id, label: vehicle.manufacturer};
    })
    if (resourceTypeId === 1) {
        options = optionsEmployee
    } else if (resourceTypeId === 2) {
        options = optionsVehicles
    } else {
        options = optionsTools
    }


    const noOptionsMessage = function (obj) {
        if (obj.inputValue.trim().length === 0) {
            return null;
        }
        return 'No matching';
    };

    const handleChange = (e) => {
        setSelectMultiple(e)
    };

    const handleInputChange = function (inputText, meta) {
        if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
            // …
            handleSearch(inputText);
        }
    };
    const [createdResource, setCreatedResource] = useState(null)

    const addResource = async (event) => {
        event.preventDefault();
        setIsLoadingButton(true)
        try {
            const params = {
                resources: selectMultiple.map(x => Number(x.value)),
                resource_type_id: Number(resourceTypeId)
            }
            const response = await createProjectResource(Number(id), params)
            setCreatedResource(response)
            setSelectMultiple([])
        } catch (err) {
            setError(err)
        }
        setIsLoadingButton(false)
        setAddNewToolModalPreview(false)
    }

    return (
        isLoading ? (
            <div className="col-span-12 grid grid-cols-12 gap-6 mt-8">
                <div className="col-span-12 sm:col-span-6 2xl:col-span-4 intro-y">
                    <div
                        className={'box p-5 zoom-in'}>
                        <div className="flex">
                            <div className="text-lg font-medium truncate mr-3">
                                <Skeleton width={120}/>
                            </div>
                            <div
                                className="font-medium absolute w-full h-full flex items-center justify-end pr-5 top-0 left-0">
                                <Skeleton circle width={20} height={20}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 sm:col-span-6 2xl:col-span-4 intro-y">
                    <div
                        className={'box p-5 zoom-in'}>
                        <div className="flex">
                            <div className="text-lg font-medium truncate mr-3">
                                <Skeleton width={100}/>
                            </div>
                            <div
                                className="font-medium absolute w-full h-full flex items-center justify-end pr-5 top-0 left-0">
                                <Skeleton circle width={20} height={20}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 sm:col-span-6 2xl:col-span-4 intro-y">
                    <div
                        className={'box p-5 zoom-in'}>
                        <div className="flex">
                            <div className="text-lg font-medium truncate mr-3">
                                <Skeleton width={90}/>
                            </div>
                            <div
                                className="font-medium absolute w-full h-full flex items-center justify-end pr-5 top-0 left-0">
                                <Skeleton circle width={20} height={20}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <>
                <Modal
                    show={addNewToolModalPreview}
                    onHidden={() => {
                        setAddNewToolModalPreview(false);
                    }}
                >
                    <form className="validate-form" onSubmit={addResource}>
                        <ModalHeader>
                            <h2 className="font-medium text-base mr-auto">
                                Add new {resourceType}
                            </h2>
                        </ModalHeader>
                        <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
                            <div className="col-span-12">
                                {resourceTypeId === 1 ? (<div className="input-form  mt-3">
                                    <label
                                        htmlFor="validation-form-4"
                                        className="form-label  w-full flex flex-col sm:flex-row"
                                    >
                                        Employees
                                        <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                            Required, at least one Employee
                          </span>
                                    </label>
                                    <Select
                                        isMulti
                                        value={selectMultiple}
                                        options={options}
                                        components={animatedComponents}
                                        onChange={handleChange}
                                        onInputChange={handleInputChange}
                                        isLoading={loading}
                                        filterOption={null}
                                        noOptionsMessage={noOptionsMessage}
                                    />
                                </div>) : resourceTypeId === 2 ? (
                                    <div><label
                                        htmlFor="validation-form-4"
                                        className="form-label  w-full flex flex-col sm:flex-row"
                                    >
                                        Vehicles
                                        <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                            Required, at least one Vehicle
                          </span>
                                    </label>
                                        <Select
                                            isMulti
                                            value={selectMultiple}
                                            options={options}
                                            components={animatedComponents}
                                            onChange={handleChange}
                                            onInputChange={handleInputChange}
                                            isLoading={loading}
                                            filterOption={null}
                                            noOptionsMessage={noOptionsMessage}
                                        /></div>
                                ) : (
                                    <div className="input-form  mt-3">
                                        <label
                                            htmlFor="validation-form-4"
                                            className="form-label  w-full flex flex-col sm:flex-row"
                                        >
                                            Tools
                                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                            Required, at least one Tool
                          </span>
                                        </label>
                                        <Select
                                            isMulti
                                            value={selectMultiple}
                                            options={options}
                                            components={animatedComponents}
                                            onChange={handleChange}
                                            onInputChange={handleInputChange}
                                            isLoading={loading}
                                            filterOption={null}
                                            noOptionsMessage={noOptionsMessage}
                                        />
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
                            <CustomButton type={'submit'} className={'btn btn-primary'} disabled={isLoadingButton} isLoading={isLoadingButton}>Add new</CustomButton>
                        </ModalFooter>
                    </form>
                </Modal>
                <div>
                    <div className="col-span-12 grid grid-cols-12 gap-6 mt-8">
                        {resourceTypes.map((resourceType, index) =>
                            (
                                <div className="col-span-12 sm:col-span-6 2xl:col-span-4 intro-y" key={index} id={index}
                                     onClick={(event) => handleResource(event, resourceType)}>
                                    <div
                                        className={activeState === index ? 'box p-5 zoom-in activeState' : 'box p-5 zoom-in'}>
                                        <div className="flex">
                                            <div className="text-lg font-medium truncate mr-3">
                                                {resourceType.type}
                                            </div>
                                            <div
                                                className="font-medium absolute w-full h-full flex items-center justify-end pr-5 top-0 left-0">
                                                {index === 0 ? (<Lucide icon="Users"
                                                                        className="h-12 justify-center "/>) : index === 1 ? (
                                                    <AiOutlineCar className={'w-6 h-6'} color={'#202a3b'}/>
                                                ) : (
                                                    <Lucide icon="Settings" className="h-12 justify-center "/>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                        )}
                    </div>
                    <div className="intro-y block sm:flex items-center mt-5">
                        <h2 className="text-lg ml-5 font-medium truncate mr-5">
                            {resourceType}'s in this project
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
                                        <DropdownItem onClick={() => setAddNewToolModalPreview(true)}>
                                            <Lucide icon="Plus" className="w-4 h-4 mr-2"/> Add Resource
                                        </DropdownItem>
                                    </DropdownContent>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                    {activeState === 0 ? (
                        <div className={'intro-y'}>
                            <ResourceEmployees createdResource={createdResource} resourceType={resourceTypeId}/>
                        </div>) : activeState === 1 ? (
                        <div className={'intro-y'}>
                            <ResourceVehicles createdResource={createdResource} resourceType={resourceTypeId}/>
                        </div>) : activeState === 2 ? (
                        <div>
                            <ResourceTools createdResource={createdResource} resourceType={resourceTypeId}/>
                        </div>) : ('')}
                </div>
            </>)
    );
}

export default Resources;
