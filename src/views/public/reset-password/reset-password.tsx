import React, {useState, useEffect, SyntheticEvent} from 'react'
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import '../../../assets/css/public/reset-password.css'
import dom from "@left4code/tw-starter/dist/js/dom";
import {useForm} from "react-hook-form";
import {useSnackbar} from "notistack";
import {ResetPasswordBy} from "../../../routes/routes";
import useError from "../../../hooks/useError";
import CustomButton from "../../../components/customButton/CustomButon";


const ResetPassword = () => {

//useStates allows us to have state variables in functional components
    const {id, email} = useParams()
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate();
    const setError = useError()
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);
    const [isLoading, setLoading] = useState(false);

    // This function is triggered on the keyup event
    const checkCapsLock = (event) => {
        if (event.getModifierState('CapsLock')) {
            setIsCapsLockOn(true);
        } else {
            setIsCapsLockOn(false);
        }
    };

    //will add and remove needed designs
    useEffect(() => {
        dom("body").removeClass("main").removeClass("error-page").addClass("login");
    }, []);

    //useForm is needed for the validation
    //mode is set to onChange so that it updates while we type
    const {register, formState} = useForm({
        mode: 'onChange'
    });

    //the request
    const requestNew = async (e: SyntheticEvent) => {
        try {
            setLoading(true);
            e.preventDefault()
            console.log(password, cPassword)
                await ResetPasswordBy({
                    token: id,
                    email: email,
                    password: password,
                    password_confirmation: cPassword,
                })
                enqueueSnackbar('Your password was reset.', {variant: 'success'});
            setLoading(false)
                navigate('/', {replace: true})
        } catch (err) {
            setError(err)
            setLoading(false)
        }
    };
    return (
        <>
            <div>
                <div className="container sm:px-10">
                    <div className="block xl:grid grid-cols-2 gap-4">
                        {/* BEGIN: Register Info */}
                        <div className="hidden xl:flex flex-col min-h-screen">
                            <a href="" className="-intro-x flex items-center pt-5">

                                <span className="text-white text-lg ml-3"> BSD </span>
                            </a>
                            <div className="my-auto">

                                <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">

                                    A few more clicks to<br/>
                                    reseting your account.
                                </div>

                            </div>
                        </div>
                        {/* END: Register Info */}
                        {/* BEGIN: Register Form */}
                        <form onSubmit={requestNew}
                            className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                            <div
                                className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                                    Reset Password
                                </h2>
                                <div className="intro-x mt-2 text-slate-400 dark:text-slate-400 xl:hidden text-center">
                                    A few more clicks to sign in to your account. Manage all your
                                    e-commerce accounts in one place
                                </div>
                                <div className="intro-x mt-8">


                                    <input
                                        onKeyUp={checkCapsLock}
                                        value={password}
                                        required
                                        onInput={(e) => {
                                            setPassword(e.target['value'])
                                        }}
                                        type={'password'}
                                        id="password"
                                        className={`intro-x login__input form-control py-3 px-4 block mt-4 ${formState.errors.password && "focus:border-red-500 focus:ring-red-500 border-red-500"}`}
                                        onPaste={(e) => {
                                            e.preventDefault()
                                            return false;
                                        }}
                                        placeholder="Password"
                                        {...register("password", {
                                            required: 'Password is required',
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                                                message: 'Password should include at least one uppercase, one numeric value and one special value'
                                            },
                                            minLength: {
                                                value: 8,
                                                message: 'Minimum Required length is 8'
                                            },
                                        })}
                                        // added requirements for the password to be valid

                                    />
                                    {formState.errors.password &&
                                    <span className='text-sm text-red-500'>{formState.errors.password.message}</span>}
                                    {isCapsLockOn && (
                                        <p style={{color:"red"}} className='caps-lock-warning'>Warning: Caps Lock is ON</p>)}

                                    <input
                                        value={cPassword}
                                        required
                                        type={'password'}
                                        id="confirmPassword"
                                        className={`intro-x login__input form-control py-3 px-4 block mt-4 ${formState.errors.confirmPassword && "focus:border-red-500 focus:ring-red-500 border-red-500"}`}
                                        onPaste={(e) => {
                                            e.preventDefault()
                                            return false;
                                        }}
                                        onInput={(e) => setCPassword(e.target['value'])}
                                        placeholder="Password Confirmation"
                                        {...register("confirmPassword", {
                                            required: 'Confirm password is required',
                                            validate: (value) =>
                                                value === password || 'The passwords do not match',
                                        })}
                                    />
                                    {formState.errors.confirmPassword &&
                                    <span className='text-sm text-red-500'>{formState.errors.confirmPassword.message}</span>}


                                </div>
                                <div
                                    className="intro-x flex items-center text-slate-600 dark:text-slate-500 mt-4 text-xs sm:text-sm">
                                </div>
                                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                                    <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">


                                        <CustomButton  type={'submit'}
                                                      className={'btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top'}
                                                      children={'Reset '}
                                                      disabled={!formState.isValid} isLoading={isLoading}
                                        />


                                        <Link to={'/'}
                                              className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top">
                                            Sign in
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                        {/* END: Register Form */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword
