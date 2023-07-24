import {
    Lucide, PreviewComponent, Preview
} from "@/components";
import {useForm} from "react-hook-form";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useState, useEffect} from "react";
import {
    getPermissions, getRolesById, syncPermissions
} from "../../../../../routes/routes";
import useError from "../../../../../hooks/useError";
import CustomButton from "../../../../../components/customButton/CustomButon";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import {LoadingIcon} from "@/components";

function Main() {
    const setError = useError()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [permissions, setPermissions] = useState([])
    const [state, setState] = useState({selections: []});
    const {id} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const res = await getRolesById(id)
                setState({
                    selections: res.permissions.map(x => x.name),
                })
                const response = await getPermissions()
                console.log(response)
                setPermissions(response)
                setIsLoading(false)
            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, [0]);

    const schema = yup
        .object({
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            email: yup.string().required().email(),
            birthdate: yup.date().required(),
            roles: yup
                .object()
                .required(),
        })
        .required();

    const {
        register, setValue, trigger, formState: {errors},
    } = useForm({
        mode: "onChange", resolver: yupResolver(schema),
    });
    const onSubmit = async (event) => {
        event.preventDefault();

        if (permissions) {
            try {
                const params = {
                    role: id, permissions: state.selections
                }
                console.log(params.permissions)
                await syncPermissions(params);
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
                navigate('/roles', {replace: true})
            } catch (err) {
                setError(err)
                setIsLoading(false)
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
    };

    const handleOnChange = (key) => {
        let sel = state.selections
        let find = sel.indexOf(key)
        if (find > -1) {
            sel.splice(find, 1)
        } else {
            sel.push(key)
        }

        setState({
            selections: sel,
        })
    }

    return (isLoading ? (<div
        className="col-span-6 sm:col-span-3 xl:col-span-2 grid h-screen place-items-center">
        <LoadingIcon icon="puff" className="w-14 h-14"/>
    </div>) : (<>
        <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="intro-y col-span-12 lg:col-span-12">
                {/* BEGIN: Form Validation */}
                <PreviewComponent className="intro-y box">
                    {({toggle}) => (<>
                        <form className="validate-form" onSubmit={onSubmit}>

                            <div
                                className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                                <h2 className="font-medium text-base mr-auto">
                                    Update Role
                                </h2>
                                <div
                                    className="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                                    <CustomButton isLoading={isLoading} className={'btn btn-primary w-40'}
                                                  type={'submit'}
                                                  children={'Update Role'}/>
                                </div>
                            </div>
                            <div className="p-5">
                                <Preview>
                                    <div className="input-form mt-3">
                                        <div className="block">
                                            <label
                                                htmlFor="validation-form-1"
                                                className="form-label w-full flex flex-col sm:flex-row"
                                            >
                                                Permissions
                                                <span
                                                    className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                            Required, at least one permission
                          </span>
                                            </label>
                                            <div className={'grid grid-cols-1 gap-4 md:grid-cols-4 sm:grid-cols-2'}>
                                                <div>
                                                    <div
                                                        className="w-full flex flex-col sm:flex-row">Backoffice
                                                    </div>
                                                    {permissions.map((permission, index) => {
                                                        if (permission.name.startsWith('system.backoffice') || permission.name.startsWith('system.log') || permission.name.startsWith('system.activityLogs')) {
                                                            return (<div className="mt-2">
                                                                <label
                                                                    className="inline-flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={'form-check-input'}
                                                                        id={`custom-checkbox-${index}`}
                                                                        name={permission.name}
                                                                        value={permission.name}
                                                                        checked={state.selections.includes(permission.name)}
                                                                        onChange={() => handleOnChange(permission.name)}
                                                                    />
                                                                    <span
                                                                        className="ml-2">{permission.name}</span>
                                                                </label>
                                                            </div>)
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                    <div>User</div>
                                                    {permissions.map((permission, index) => {
                                                        if (permission.name.startsWith('system.user')) {
                                                            return (<div className="mt-2">
                                                                <label
                                                                    className="inline-flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={'form-check-input'}
                                                                        id={`custom-checkbox-${index}`}
                                                                        name={permission.name}
                                                                        value={permission.name}
                                                                        checked={state.selections.includes(permission.name)}
                                                                        onChange={() => handleOnChange(permission.name)}
                                                                    />
                                                                    <span
                                                                        className="ml-2">{permission.name}</span>
                                                                </label>
                                                            </div>)
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                    <div>Roles</div>
                                                    {permissions.map((permission, index) => {
                                                        if (permission.name.startsWith('system.roles')) {
                                                            return (<div className="mt-2">
                                                                <label
                                                                    className="inline-flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={'form-check-input'}
                                                                        id={`custom-checkbox-${index}`}
                                                                        name={permission.name}
                                                                        value={permission.name}
                                                                        checked={state.selections.includes(permission.name)}
                                                                        onChange={() => handleOnChange(permission.name)}
                                                                    />
                                                                    <span
                                                                        className="ml-2">{permission.name}</span>
                                                                </label>
                                                            </div>)
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                    <div>Clients</div>
                                                    {permissions.map((permission, index) => {
                                                        if (permission.name.startsWith('service.clients')) {
                                                            return (<div className="mt-2">
                                                                <label
                                                                    className="inline-flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={'form-check-input'}
                                                                        id={`custom-checkbox-${index}`}
                                                                        name={permission.name}
                                                                        value={permission.name}
                                                                        checked={state.selections.includes(permission.name)}
                                                                        onChange={() => handleOnChange(permission.name)}
                                                                    />
                                                                    <span
                                                                        className="ml-2">{permission.name}</span>
                                                                </label>
                                                            </div>)
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                    <div>Catalog</div>
                                                    {permissions.map((permission, index) => {
                                                        if (permission.name.startsWith('service.catalogs')) {
                                                            return (<div className="mt-2">
                                                                <label
                                                                    className="inline-flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={'form-check-input'}
                                                                        id={`custom-checkbox-${index}`}
                                                                        name={permission.name}
                                                                        value={permission.name}
                                                                        checked={state.selections.includes(permission.name)}
                                                                        onChange={() => handleOnChange(permission.name)}
                                                                    />
                                                                    <span
                                                                        className="ml-2">{permission.name}</span>
                                                                </label>
                                                            </div>)
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                    <div>Projects</div>
                                                    {permissions.map((permission, index) => {
                                                        if (permission.name.startsWith('service.projects')) {
                                                            return (<div className="mt-2">
                                                                <label
                                                                    className="inline-flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={'form-check-input'}
                                                                        id={`custom-checkbox-${index}`}
                                                                        name={permission.name}
                                                                        value={permission.name}
                                                                        checked={state.selections.includes(permission.name)}
                                                                        onChange={() => handleOnChange(permission.name)}
                                                                    />
                                                                    <span
                                                                        className="ml-2">{permission.name}</span>
                                                                </label>
                                                            </div>)
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                    <div>Tasks</div>
                                                    {permissions.map((permission, index) => {
                                                        if (permission.name.startsWith('service.tasks')) {
                                                            return (<div className="mt-2">
                                                                <label
                                                                    className="inline-flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={'form-check-input'}
                                                                        id={`custom-checkbox-${index}`}
                                                                        name={permission.name}
                                                                        value={permission.name}
                                                                        checked={state.selections.includes(permission.name)}
                                                                        onChange={() => handleOnChange(permission.name)}
                                                                    />
                                                                    <span
                                                                        className="ml-2">{permission.name}</span>
                                                                </label>
                                                            </div>)
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                    <div>PlanningBoards</div>
                                                    {permissions.map((permission, index) => {
                                                        if (permission.name.startsWith('service.planningBoards')) {
                                                            return (<div className="mt-2">
                                                                <label
                                                                    className="inline-flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={'form-check-input'}
                                                                        id={`custom-checkbox-${index}`}
                                                                        name={permission.name}
                                                                        value={permission.name}
                                                                        checked={state.selections.includes(permission.name)}
                                                                        onChange={() => handleOnChange(permission.name)}
                                                                    />
                                                                    <span
                                                                        className="ml-2">{permission.name}</span>
                                                                </label>
                                                            </div>)
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                    <div>Stocks</div>
                                                    {permissions.map((permission, index) => {
                                                        if (permission.name.startsWith('service.stocks')) {
                                                            return (<div className="mt-2">
                                                                <label
                                                                    className="inline-flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={'form-check-input'}
                                                                        id={`custom-checkbox-${index}`}
                                                                        name={permission.name}
                                                                        value={permission.name}
                                                                        checked={state.selections.includes(permission.name)}
                                                                        onChange={() => handleOnChange(permission.name)}
                                                                    />
                                                                    <span
                                                                        className="ml-2">{permission.name}</span>
                                                                </label>
                                                            </div>)
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                    <div>Orders</div>
                                                    {permissions.map((permission, index) => {
                                                        if (permission.name.startsWith('service.orders')) {
                                                            return (<div className="mt-2">
                                                                <label
                                                                    className="inline-flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={'form-check-input'}
                                                                        id={`custom-checkbox-${index}`}
                                                                        name={permission.name}
                                                                        value={permission.name}
                                                                        checked={state.selections.includes(permission.name)}
                                                                        onChange={() => handleOnChange(permission.name)}
                                                                    />
                                                                    <span
                                                                        className="ml-2">{permission.name}</span>
                                                                </label>
                                                            </div>)
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                    <div>Invoice</div>
                                                    {permissions.map((permission, index) => {
                                                        if (permission.name.startsWith('service.invoice')) {
                                                            return (<div className="mt-2">
                                                                <label
                                                                    className="inline-flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={'form-check-input'}
                                                                        id={`custom-checkbox-${index}`}
                                                                        name={permission.name}
                                                                        value={permission.name}
                                                                        checked={state.selections.includes(permission.name)}
                                                                        onChange={() => handleOnChange(permission.name)}
                                                                    />
                                                                    <span
                                                                        className="ml-2">{permission.name}</span>
                                                                </label>
                                                            </div>)
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Preview>
                            </div>
                        </form>

                    </>)}
                </PreviewComponent>
                {/* END: Form Validation */}
                {/* BEGIN: Success Notification Content */}
                <div
                    id="success-notification-content"
                    className="toastify-content hidden flex"
                >
                    <Lucide icon="CheckCircle" className="text-success"/>
                    <div className="ml-4 mr-4">
                        <div className="font-medium">Updated success!</div>
                        <div className="text-slate-500 mt-1">
                            Please check the User Information
                        </div>
                    </div>
                </div>
                {/* END: Success Notification Content */}
                {/* BEGIN: Failed Notification Content */}
                <div
                    id="failed-notification-content"
                    className="toastify-content hidden flex"
                >
                    <Lucide icon="XCircle" className="text-danger"/>
                    <div className="ml-4 mr-4">
                        <div className="font-medium">Update failed!</div>
                        <div className="text-slate-500 mt-1">
                            Please check the fileld form.
                        </div>
                    </div>
                </div>
                {/* END: Failed Notification Content */}
            </div>
        </div>
    </>));
}

export default Main;
