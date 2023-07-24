import {Link, useNavigate,} from "react-router-dom";
import React, {SyntheticEvent, useEffect, useRef, useState} from "react";
import dom from "@left4code/tw-starter/dist/js/dom";
// @ts-ignore
import logoUrl from "../../../assets/images/logo.svg";
import {useForm} from "react-hook-form";
import {useSnackbar} from "notistack";
// @ts-ignore
import {LoadingIcon} from "@/components";
import {ForgotPasswordBy, ResetPasswordBy} from "../../../routes/routes";
import useError from "../../../hooks/useError";
import '../../../../src/assets/css/public/icons.css'
import CustomButton from "../../../components/customButton/CustomButon";

const ForgotPassword = () => {

    //will add and remove needed designs
    useEffect(() => {
        dom("body").removeClass("main").removeClass("error-page").addClass("login");
    }, []);

    //useForm is needed for the validation
    //mode is set to onChange so that it updates while we type
    const {register, formState, resetField, getValues} = useForm({
        mode: 'onChange',
        defaultValues: {
            email: ''
        }
    });

//useStates allows us to have state variables in functional components
    const [email, setEmail] = useState("");
    const navigate = useNavigate()
    const {enqueueSnackbar} = useSnackbar()
    const setError = useError()
    const [isLoading, setLoading] = useState(false);
    const firstRef = useRef(null);


    //the request
    const submit = async (e) => {
        console.log('submit ran');
        e.preventDefault()
        try {
            setLoading(true);
            console.log(getValues('email'))
            await ForgotPasswordBy({
                email: getValues('email')
            })
            enqueueSnackbar('Please check your email, to reset your password', {variant: 'success'});
            setLoading(false)
            resetField('email')
        } catch (err) {
            setError(err)
            setLoading(false)
        }
        setEmail('');
    }


    function signupHandler() {
        navigate('/login', {replace: true})
    }

    return (
        <>
            <div>
                <div className="container sm:px-10">
                    <div className="block xl:grid grid-cols-2 gap-4">
                        {/* BEGIN: Register Info */}
                        <div className="hidden xl:flex flex-col min-h-screen">
                            <a href="/" className="-intro-x flex items-center pt-5">
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="w-6"
                                    src={logoUrl}
                                />
                                <span className="text-white text-lg ml-3"> BSD </span>
                            </a>
                            <div className="my-auto">
                                <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                                    Please enter your email <br/> to reset for your account.
                                </div>
                                <div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
                                </div>
                            </div>
                        </div>
                        {/* END: Register Info */}
                        {/* BEGIN: Register Form */}
                        <form onSubmit={submit}
                              className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                            <div
                                className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                                    Enter email
                                </h2>
                                <div
                                    className="intro-x mt-2 text-slate-400 dark:text-slate-400 xl:hidden text-center">
                                    A few more clicks to sign in to your account. Manage all your
                                    e-commerce accounts in one place
                                </div>

                                <>
                                    <div className="intro-x mt-8">
                                        <input
                                            onInput={(e) => {
                                                setEmail(e.target['value'])
                                            }}
                                            value={email}
                                            type="text"
                                            className="intro-x login__input form-control py-3 px-4 block mt-4"
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
                                    <div
                                        className="intro-x flex items-center text-slate-600 dark:text-slate-500 mt-4 text-xs sm:text-sm">
                                    </div>

                                    <CustomButton type={'submit'}
                                                  className={'btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top'}
                                                  disabled={!formState.isValid} isLoading={isLoading}
                                                  children={'Send Email'}/>
                                    <button
                                        className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top"
                                        onClick={signupHandler}>
                                        Sign in
                                    </button>
                                </>

                            </div>
                        </form>
                        {/* END: Register Form */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword;
