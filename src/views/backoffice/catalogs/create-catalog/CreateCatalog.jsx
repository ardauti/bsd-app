import {
    Lucide,
    PreviewComponent,
    Preview,
    LoadingIcon
} from "@/components";
import {useForm} from "react-hook-form";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";
import classnames from "classnames";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, {useEffect, useState} from "react";
import {
    createCatalog,
    createClient, GetClientById,
} from "../../../../routes/routes";
import useError from "../../../../hooks/useError";
import CustomButton from "../../../../components/customButton/CustomButon";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";

function CreateCatalog() {
    const setError = useError()
    const {id} = useParams()
    const navigate = useNavigate()
    const [catalogName, setCatalogName] = useState('');
    const [description, setDescription] = useState('');
    const [client, setClient] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await GetClientById(id)
                console.log(response)
                setClient(response)
                setIsLoading(false)
            } catch (err) {
                setError(err);
                setIsLoading(false)
            }
        };
        fetchData();
    }, [0]);

    const schema = yup
        .object({
            catalogName: yup.string().required(),
            description: yup.string().required(),
        })
        .required();


    const {
        register,
        setValue,
        formState: {errors},
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(catalogName, description, client.id)
        if (catalogName && description) {
            try {
                setIsLoadingButton(true);
                const params = {
                    name: catalogName,
                    description: description,
                    client_id: client.id,
                }
                console.log(params)
                await createCatalog(params);
                setCatalogName('')
                setDescription('')

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
                navigate(`/clients/client/${id}/catalogs`, {replace: true})
            } catch (err) {
                setError(err)
                setIsLoadingButton(false)
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
        setIsLoadingButton(false)


    };

    return (
        isLoading ? (
            <div
                className="col-span-6 sm:col-span-3 xl:col-span-2 grid h-screen place-items-center">
                <LoadingIcon icon="puff" className="w-14 h-14"/>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-12 gap-6 mt-5">
                    <div className="intro-y col-span-12 lg:col-span-12">
                        {/* BEGIN: Form Validation */}
                        <PreviewComponent className="intro-y  box">
                            {({toggle}) => (
                                <>
                                    <form className="validate-form" onSubmit={onSubmit}>

                                        <div
                                            className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                                            <h2 className="font-medium text-base mr-auto">
                                                Create Catalog
                                            </h2>

                                        </div>
                                        <div className="p-5">
                                            <Preview>
                                                {/* BEGIN: Validation Form */}
                                                <div className="input-form">
                                                    <label
                                                        htmlFor="validation-form-1"
                                                        className="form-label w-full flex flex-col sm:flex-row"
                                                    >
                                                        Catalog Name
                                                        <span
                                                            className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                            Required, Catalog name
                          </span>
                                                    </label>
                                                    <input
                                                        {...register("catalogName")}
                                                        id="validation-form-1"
                                                        type="text"
                                                        name="catalogName"
                                                        onInput={(e) => setCatalogName(e.target['value'])}

                                                        className={classnames({
                                                            "form-control": true,
                                                            "border-danger": errors.companyName,
                                                        })}
                                                        placeholder="Catalog Name"
                                                    />
                                                    {errors.catalogName && (
                                                        <div className="text-danger mt-2">
                                                            {errors.catalogName.message}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="input-form mt-3">
                                                    <label
                                                        htmlFor="validation-form-1"
                                                        className="form-label w-full flex flex-col sm:flex-row"
                                                    >
                                                        Description
                                                        <span
                                                            className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">
                            Required, Description
                          </span>
                                                    </label>
                                                    <input
                                                        {...register("description")}
                                                        id="validation-form-1"
                                                        type="text"
                                                        name="description"
                                                        onInput={(e) => setDescription(e.target['value'])}

                                                        className={classnames({
                                                            "form-control": true,
                                                            "border-danger": errors.description,
                                                        })}
                                                        placeholder="Description"
                                                    />
                                                    {errors.description && (
                                                        <div className="text-danger mt-2">
                                                            {errors.description.message}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="input-form mt-3">
                                                    <label
                                                        htmlFor="validation-form-1"
                                                        className="form-label w-full flex flex-col sm:flex-row"
                                                    >
                                                        Client
                                                        <span
                                                            className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, Client</span>
                                                    </label>
                                                    <input
                                                        {...register("client")}
                                                        {...setValue('client', `${client.company_name}`)}
                                                        disabled
                                                        id="validation-form-1"
                                                        type="text"
                                                        name="description"
                                                        className={classnames({
                                                            "form-control": true,
                                                            "border-danger": errors.client,
                                                        })}
                                                        placeholder="Client"
                                                    />
                                                    {errors.client && (
                                                        <div className="text-danger mt-2">
                                                            {errors.client.message}
                                                        </div>
                                                    )}
                                                </div>
                                                {/* END: Validation Form */}
                                            </Preview>
                                        </div>
                                        <div className={'border-t'}></div>
                                        <div
                                            className="form-check flex justify-end p-5 form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                                            <CustomButton isLoading={isLoadingButton}
                                                          className={'btn btn-primary w-40'}
                                                          type={'submit'}
                                                          children={'Create Catalog'}/>
                                        </div>
                                    </form>

                                </>
                            )}
                        </PreviewComponent>
                        {/* END: Form Validation */}
                        {/* BEGIN: Success Notification Content */}
                        <div
                            id="success-notification-content"
                            className="toastify-content hidden flex"
                        >
                            <Lucide icon="CheckCircle" className="text-success"/>
                            <div className="ml-4 mr-4">
                                <div className="font-medium">Create success!</div>
                                <div className="text-slate-500 mt-1">
                                    Please check Catalog list!
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
                                <div className="font-medium">Create failed!</div>
                                <div className="text-slate-500 mt-1">
                                    Please check the fileld form.
                                </div>
                            </div>

                        </div>

                        {/* END: Failed Notification Content */}
                    </div>

                </div>
            </>)
    );
}

export default CreateCatalog;
