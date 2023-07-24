import React, {useEffect, useRef, useState} from "react";
import {getRoles, InviteUserBy} from "../../../../routes/routes";
import useError from "../../../../hooks/useError";
import {PreviewComponent, TomSelect} from "../../../../components";
import {useForm} from "react-hook-form";
import CustomButton from "../../../../components/customButton/CustomButon";
import {useSnackbar} from "notistack";
import './invite-user.css'
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";


function InviteUser() {
    const userRef = useRef();
    const [selectMultiple, setSelectMultiple] = useState([]);
    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState('')
    const [email, setEmail] = useState('')
    const [isLoading, setLoading] = useState(false);
    const setError = useError()
    const [showText, setShowText] = useState('')
    const {enqueueSnackbar} = useSnackbar()

    const schema = yup
        .object({
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            email: yup.string().required().email(),
            birthdate: yup.date().required(),
            roles: yup
                .object()
                .required()
            ,
        })
        .required();

    const {register, formState, getValues} = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            email: ''
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getRoles();
                console.log(response)
                setRoles(response)

            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, []);

    const InviteUserIn = async (e) => {
        e.preventDefault()
        try {
            setLoading(true);
            const params = {
                email: getValues('email'),
                roles: selectMultiple.map(i => Number(i))
            }
            console.log(email, role)
            const response = await InviteUserBy(params)
            enqueueSnackbar(`A email has been sent to the user to create they'r account`, {variant: 'success'});
            console.log(response)
            setLoading(false)
        } catch (err) {
            setError(err)
            setLoading(false)
        }
        setEmail('');
        setRole('')

    }
    console.log(roles)
    console.log(role)


    if (role === 1) {
        const show = 'What role one can do'
        setShowText(show)
    } else if (role === 2) {
        const show = 'What role two can do'
        setShowText(show)
    } else if (role === 3) {
        const show = 'What role three can do'
        setShowText(show)
    }


    return (

        <div>
            <PreviewComponent className="intro-y box">
                <form onSubmit={InviteUserIn}>
                    <div
                        className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 className="font-medium text-base mr-auto">
                            Send Invitation
                        </h2>


                    </div>
                    <div className={'p-5 '}>
                        <span className={'text-lg font-bold'}>
                        Info:</span>
                        <br/>An email will be sent to the invited employee.
                        As soon as the employee registers in BSD,
                        you
                        will be able to add this employee to projects
                    </div>
                    <div className={'p-5' }>
                        <label
                            htmlFor="validation-form-1"
                            className="form-label w-full flex flex-col sm:flex-row"
                        >
                            Email
                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs pr-6 text-slate-500">
                            Required, Email
                          </span>
                        </label>
                        <div
                            className="w-full">
                            <input
                                value={email}
                                onInput={(e) => setEmail(e.target['value'])}
                                type="text"
                                id="email"
                                ref={userRef}
                                autoComplete="off"
                                required
                                className={"  form-control"}
                                placeholder="Email"
                                {...register("email", {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Za-z0-9+_.-]+@(.+)$/,
                                        message: 'Email should be valid'
                                    }
                                })}
                            />
                            {formState.errors.email &&
                            <span
                                className='text-sm text-red-500'>{formState.errors.email.message}</span>}
                        </div>
                        <div className={'pt-5'}>
                        <label
                            htmlFor="validation-form-1"
                            className="form-label w-full flex flex-col sm:flex-row"
                        >
                            Role
                            <span className="sm:ml-auto mt-1 sm:mt-0 text-xs pr-6 text-slate-500">
                            Required at least one role
                          </span>
                        </label>
                        <TomSelect
                            value={selectMultiple}
                            onChange={setSelectMultiple}
                            className={"  form-control"}
                            options={{
                                placeholder: "Select your favorite actors",
                            }}
                            multiple
                        >
                            {
                                roles?.map((e, key) => {
                                    return (
                                        <option key={key} value={e.id}>{e.name}</option>
                                    )
                                })
                            }
                        </TomSelect>
                        {formState.errors.role &&
                        <span
                            className='text-sm text-red-500'>{formState.errors.role.message}</span>}
                        </div>
                    </div>
                    <div className={' border-t '}>
                    </div>
                    <div className="form-check p-8 flex justify-end form-switch w-full sm:w-auto sm:ml-auto mt-3  sm:mt-0">
                        <CustomButton type={'submit'}
                                      className="absolute right-3 btn btn-primary shadow-md mr-2"
                                      disabled={!formState.isValid} isLoading={isLoading}
                                      children={'Send Invitation'}/>
                    </div>
                </form>
            </PreviewComponent>
        </div>
    )
}

export default InviteUser
