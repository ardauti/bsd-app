import makeAnimated from "react-select/animated";
import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import useError from "../../../../../../hooks/useError";
import {
    createProjectResource,
    getTools,
    getToolsOnChange,
    getUsersOnChange,
    getUsersTest, getVehicles, getVehiclesOnChange
} from "../../../../../../routes/routes";
import CustomButton from "../../../../../../components/customButton/CustomButon";
import Select from "react-select";
import DataContext from "../../../../../../context/DataContext";

const animatedComponents = makeAnimated();

function CreateResource() {
    const navigate = useNavigate()
    const setError = useError()
    const {id, resourceTypeId} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [tools, setTools] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectMultiple, setSelectMultiple] = useState([]);
    let options;
    let {employeesResource, toolsResource, vehiclesResource} = useContext(DataContext)
    const [employeesResourceIds, setEmployeesResourceIds] = useState([])
    const [toolsResourceIds, setToolsResourceIds] = useState([])
    const [vehiclesResourceIds, setVehiclesResourceIds] = useState([])

    useEffect(() => {
        setEmployeesResourceIds(employeesResource.map(({id}) => id))
        setToolsResourceIds(toolsResource.map(({tool_id}) => tool_id))
        setVehiclesResourceIds(vehiclesResource.map(({vehicle_id}) => vehicle_id))
        if (resourceTypeId === '1') {
            const fetchData = async () => {
                try {
                    const employees = await getUsersTest()
                    setEmployees(employees)
                } catch (err) {
                    setError(err);
                }
            };
            fetchData();
        } else if (resourceTypeId === '2') {
            const fetchData = async () => {
                try {
                    const vehicles = await getVehicles()
                    setVehicles(vehicles)
                } catch (err) {
                    setError(err);
                }
            };
            fetchData();
        } else if (resourceTypeId === '3') {
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
    }, [0]);


    const handleSearch = async (searchQuery) => {
        if (resourceTypeId === '1') {
            if (searchQuery.trim().length === 0) {
                setEmployees([])
                return
            }
            setIsLoading(true)
            let employees = []
            try {
                employees = await getUsersOnChange(searchQuery)
            } catch (err) {
                setError(err)
            } finally {
                setEmployees(employees)
                setIsLoading(false)
            }
        }
        if (resourceTypeId === '2') {
            if (searchQuery.trim().length === 0) {
                setVehicles([])
                return
            }
            setIsLoading(true)
            let vehicles = []
            try {
                vehicles = await getVehiclesOnChange(searchQuery)
            } catch (err) {
                setError(err)
            } finally {
                setVehicles(vehicles)
                setIsLoading(false)
            }
        }
        if (resourceTypeId === '3') {
            if (searchQuery.trim().length === 0) {
                setTools([])
                return
            }
            setIsLoading(true)
            let tools = []
            try {
                tools = await getToolsOnChange(searchQuery)
            } catch (err) {
                setError(err)
            } finally {
                setTools(tools)
                setIsLoading(false)
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
    if (resourceTypeId === '1') {
        options = optionsEmployee
    } else if (resourceTypeId === '2') {
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
        setSelectMultiple(e.map(x => x.value))
    };

    const handleInputChange = function (inputText, meta) {
        if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
            // …
            handleSearch(inputText);
        }
    };
    const addResource = async (event) => {
        event.preventDefault();
        try {
            const params = {
                resources: selectMultiple.map(i => Number(i)),
                resource_type_id: Number(resourceTypeId)
            }
            await createProjectResource(Number(id), params)
            navigate(`/projects/project/${id}/resources`, {replace: true})
        } catch (err) {
            setError(err)
        }
    }
    return (
        <>
            <form className="validate-form" onSubmit={addResource}>
                <div
                    className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 className="font-medium text-base mr-auto">
                        Add new Resource
                    </h2>
                    <div
                        className="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <CustomButton
                            isLoading={isLoading}
                            type={'submit'}
                            className={'btn btn-primary w-40'}
                            children={'Add'}/>
                    </div>
                </div>
                {resourceTypeId === '1' ? (<div className="input-form  mt-3">
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
                        options={options}
                        components={animatedComponents}
                        onChange={handleChange}
                        onInputChange={handleInputChange}
                        isLoading={isLoading}
                        filterOption={null}
                        noOptionsMessage={noOptionsMessage}
                    />
                </div>) : resourceTypeId === '2' ? (
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
                            options={options}
                            components={animatedComponents}
                            onChange={handleChange}
                            onInputChange={handleInputChange}
                            isLoading={isLoading}
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
                            options={options}
                            components={animatedComponents}
                            onChange={handleChange}
                            onInputChange={handleInputChange}
                            isLoading={isLoading}
                            filterOption={null}
                            noOptionsMessage={noOptionsMessage}
                        />
                    </div>
                  )}
            </form>
        </>
    )
}

export default CreateResource;
