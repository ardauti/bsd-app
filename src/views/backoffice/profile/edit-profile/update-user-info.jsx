import {
    Lucide,
    PreviewComponent,
    Preview,
    Litepicker
} from "@/components";
import {useForm} from "react-hook-form";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";
import classnames from "classnames";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, {useState, useEffect} from "react";
import {GetUserInfo, updateUserInfo} from "../../../../routes/routes";
import useError from "../../../../hooks/useError";
import CustomButton from "../../../../components/customButton/CustomButon";
import {Modal, ModalBody} from "../../../../components";
import moment from "moment";
import Skeleton from "react-loading-skeleton";

function Main() {
    const setError = useError()
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [birthdate, setBirthdate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [updateInfo, setUpdateInfo] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await GetUserInfo()
                console.log(response)
                setFirstName(response.user_profile.first_name)
                setLastName(response.user_profile.last_name)
                setEmail(response.email)
                setPhoneNumber(response.phone_number)
                setBirthdate(response.user_profile.birthdate)
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
            email: yup.string().required(),
            phoneNumber: yup.number().required(),
            birthdate: yup.date().required(),
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
        try {
            setIsLoading(true)
            const params = {
                first_name: firstName,
                last_name: lastName,
                birthdate: moment(birthdate).format("YYYY-MM-DD"),
                phone_number: phoneNumber,
            }
            await updateUserInfo(params)
            setIsLoading(false)
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
        setUpdateInfo(false)
    };

    const onUpdate = () => {
        setUpdateInfo(true)
    }

    return (
        isLoading ? (
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 lg:col-span-12">
                    <PreviewComponent className="intro-y box">
                        <div
                            className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                            <Skeleton width={100}/>
                        </div>
                        <div className="p-5">
                            <Preview>
                                <div className="input-form">
                                    <label
                                        htmlFor="validation-form-1"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                                        <Skeleton width={80}/>
                                    </label>
                                    <Skeleton count={1}/>
                                </div>
                                <div className="input-form">
                                    <label
                                        htmlFor="validation-form-1"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                                        <Skeleton width={80}/>
                                    </label>
                                    <Skeleton count={1}/>
                                </div>
                                <div className="input-form">
                                    <label
                                        htmlFor="validation-form-1"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                                        <Skeleton width={80}/>
                                    </label>
                                    <Skeleton count={1}/>
                                </div>
                                <div className="input-form">
                                    <label
                                        htmlFor="validation-form-1"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                                        <Skeleton width={80}/>
                                    </label>
                                    <Skeleton count={1}/>
                                </div>
                                <div className="input-form">
                                    <label
                                        htmlFor="validation-form-1"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                                        <Skeleton width={80}/>
                                    </label>
                                    <Skeleton count={1}/>
                                </div>
                            </Preview>
                        </div>
                        <div
                            className="form-check p-5 flex justify-end form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                            <Skeleton width={150}/>
                        </div>
                    </PreviewComponent>
                </div>
            </div>
        ) : (
            <>
                <Modal
                    show={updateInfo}
                    onHidden={() => {
                        setUpdateInfo(false)
                    }}>
                    <ModalBody className={'p-0'}>
                        <div className={'p-5 text-center'}>
                            <Lucide
                                icon="UserCheck"
                                className="w-16 h-16 text-success mx-auto mt-3"
                            />
                            <div className="text-3xl mt-5">Are you sure?</div>
                            <div className="text-slate-500 mt-2">
                                Do you really want to update these records?
                            </div>
                        </div>
                        <div className="px-5 pb-8 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setUpdateInfo(false);
                                }}
                                className="btn btn-outline-secondary w-24 mr-1">
                                Cancel
                            </button>
                            <button
                                onClick={onSubmit} type="button" className="btn btn-success w-24">
                                Update
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
                            User info updated successfully
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6 mt-5">
                    <div className="col-span-12 lg:col-span-12">
                        {/* BEGIN: Form Validation */}
                        <PreviewComponent className="box">
                            {({toggle}) => (
                                <>

                                    <div
                                        className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                                        <h2 className="font-medium text-base mr-auto">
                                            Update Profile
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
                                                    First Name
                                                    <span
                                                        className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, First Name</span>
                                                </label>
                                                <input
                                                    {...register("firstName")}
                                                    {...setValue('firstName', `${firstName}`)}
                                                    id="validation-form-1"
                                                    type="text"
                                                    name="firstName"
                                                    onInput={(e) => setFirstName(e.target['value'])}
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.firstName,
                                                    })}
                                                />
                                                {errors.firstName && (
                                                    <div className="text-danger mt-2">
                                                        {errors.firstName.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="input-form mt-3">
                                                <label
                                                    htmlFor="validation-form-1"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Last Name
                                                    <span
                                                        className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, Last Name</span>
                                                </label>
                                                <input
                                                    {...register("lastName")}
                                                    {...setValue('lastName', `${lastName}`)}
                                                    id="validation-form-1"
                                                    type="text"
                                                    name="lastName"
                                                    onInput={(e) => setLastName(e.target['value'])}

                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.lastName,
                                                    })}
                                                    placeholder="Last Name"
                                                />
                                                {errors.lastName && (
                                                    <div className="text-danger mt-2">
                                                        {errors.lastName.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="input-form mt-3">
                                                <label
                                                    htmlFor="validation-form-1"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Email
                                                    <span
                                                        className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, Email</span>
                                                </label>
                                                <input
                                                    disabled
                                                    {...register("email")}
                                                    {...setValue('email', `${email}`)}
                                                    id="validation-form-1"
                                                    type="text"
                                                    name="email"
                                                    onInput={(e) => setEmail(e.target['value'])}

                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.email,
                                                    })}
                                                    placeholder="Email"
                                                />
                                                {errors.email && (
                                                    <div className="text-danger mt-2">
                                                        {errors.email.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="input-form mt-3">
                                                <label
                                                    htmlFor="validation-form-3"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Birthdate
                                                    <span
                                                        className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, Birthdate</span>
                                                </label>

                                                <Litepicker
                                                    value={birthdate}
                                                    onChange={(e) => setBirthdate(e)}
                                                    options={{
                                                        autoApply: true,
                                                        showWeekNumbers: true,
                                                        dropdowns: {
                                                            minYear: 1990,
                                                            maxYear: null,
                                                            months: true,
                                                            years: true,
                                                        },
                                                    }}
                                                    className="form-control"
                                                />
                                                {/*<input*/}
                                                {/*    {...register("birthdate")}*/}
                                                {/*    {...setValue('birthdate', `${birthdate}`)}*/}
                                                {/*    id="validation-form-3"*/}
                                                {/*    type="date"*/}
                                                {/*    name="startDate"*/}
                                                {/*    onInput={(e) => setBirthdate(e.target['value'])}*/}
                                                {/*    className={classnames({*/}
                                                {/*        "form-control": true,*/}
                                                {/*        "border-danger": errors.birthdate,*/}
                                                {/*    })}*/}
                                                {/*    placeholder="Birthdate"*/}
                                                {/*/>*/}
                                                {errors.birthdate && (
                                                    <div className="text-danger mt-2">
                                                        {errors.birthdate.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="input-form mt-3">
                                                <label
                                                    htmlFor="validation-form-3"
                                                    className="form-label w-full flex flex-col sm:flex-row"
                                                >
                                                    Phone Number
                                                    <span
                                                        className="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500">Required, Phone Number</span>
                                                </label>
                                                <input
                                                    {...register("phoneNumber")}
                                                    {...setValue('phoneNumber', `${phoneNumber}`)}
                                                    id="validation-form-3"
                                                    type="number"
                                                    name="phoneNumber"
                                                    onInput={(e) => setPhoneNumber(e.target['value'])}
                                                    className={classnames({
                                                        "form-control": true,
                                                        "border-danger": errors.phoneNumber,
                                                    })}
                                                    placeholder="Phone Number"
                                                />
                                                {errors.phoneNumber && (
                                                    <div className="text-danger mt-2">
                                                        {errors.phoneNumber.message}
                                                    </div>
                                                )}
                                            </div>
                                        </Preview>

                                    </div>
                                    <div className={'border-t'}></div>
                                    <div onClick={onUpdate}
                                         className="form-check p-5 flex justify-end form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                                        <CustomButton className={'btn btn-primary w-40'}
                                                      children={'Update'}/>
                                    </div>
                                </>
                            )}
                        </PreviewComponent>
                        {/* END: Form Validation */}

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
            </>
        )
    );
}

export default Main;
