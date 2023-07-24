import logoUrl from "../../../assets/images/logo.svg";
import illustrationUrl from "../../../assets/images/illustration.svg";
import {useForm, useFormState} from 'react-hook-form'
import {useSnackbar} from "notistack";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {Link, useNavigate, useLocation} from 'react-router-dom';
import AuthContext from "../../../context/AuthProvider";
import {loginFunction} from "../../../routes/routes";
import useError from "../../../hooks/useError";
import dom from "@left4code/tw-starter/dist/js/dom";
import CustomButton from "../../../components/customButton/CustomButon";

function Main() {
    const {login} = useContext(AuthContext);

    //will add and remove needed designs
    useEffect(() => {
        dom("body").removeClass("main").removeClass("error-page").addClass("login");
    }, []);

    //useForm is needed for the validation
    //mode is set to onChange so that it updates while we type
    const {register, formState} = useForm({
        mode: 'onChange'
    });

    //useStates allows us to have state variables in functional components
    const navigate = useNavigate()
    const userRef = useRef();
    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [selected, setIsSelected] = useState(false);
    const setError = useError()
    const {enqueueSnackbar} = useSnackbar()
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

    //request
    // @ts-ignore
    const handleSubmit = async (e) => {
        // e.preventDefault();
        // if (user && pwd) {
        //     try {
        //         setLoading(true);
        //         const params = {
        //             username: user,
        //             password: pwd,
        //             client_id: 2,
        //             client_secret: 'hTt2G5eizAuvWEp4ORMGxbb5I8PDWk7nGsGsTcfP',
        //             grant_type: 'password'
        //         }
        //
        //         const response = await loginFunction(params);
        //         console.log(response)
        //         login(response.access_token, response.refresh_token, response.expires_in, selected);
        //         setLoading(false)
        //     } catch (err) {
        //         setError(err)
        //         setLoading(false)
        //     }
        // } else {
        //     enqueueSnackbar('Inputs cant be empty or min length is 8', {variant: 'error'});
        // }
        navigate('/dashboard', {replace: true})

    };
    useEffect(() => {
        const listener = event => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, []);


    function signUp() {
        navigate('/signup', {replace: true})
    }

    return (
        <>
            <div>
                <div className="container sm:px-10">
                    <div className="block xl:grid grid-cols-2 gap-4">
                        {/* BEGIN: Login Info */}
                        <div className="hidden xl:flex flex-col min-h-screen">
                            <a href="" className="-intro-x flex items-center pt-5">
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="w-6"
                                    src={logoUrl}
                                />
                                <span className="text-white text-lg ml-3"> BSD </span>
                            </a>
                            <div className="my-auto">
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="-intro-x w-1/2 -mt-16"
                                    src={illustrationUrl}
                                />
                                <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                                    A few more clicks to <br/>
                                    sign in to your account.
                                </div>
                                <div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
                                    Manage all your e-commerce accounts in one place
                                </div>
                            </div>
                        </div>
                        {/* END: Login Info */}
                        {/* BEGIN: Login Form */}
                        <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                            <div
                                className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                                    Sign In
                                </h2>
                                <div className="intro-x mt-2 text-slate-400 xl:hidden text-center">
                                    A few more clicks to sign in to your account. Manage all your
                                    e-commerce accounts in one place
                                </div>
                                <form>
                                <div className="intro-x mt-8">
                                    <input
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        autoComplete="off"
                                        onInput={(e) => setUser(e.target['value'])}
                                        // onChange={(e) => setUser(e.target.value)}
                                        value={user}
                                        required
                                        className={`intro-x login__input form-control py-3 px-4 block mt-4 ${formState.errors.email && "focus:border-red-500 focus:ring-red-500 border-red-500"}`}
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
                                    <span className='text-sm text-red-500'>{formState.errors.email.message}</span>}

                                    <input
                                        onKeyUp={checkCapsLock}
                                        type="password"
                                        id="password"
                                        onInput={(e) => setPwd(e.target['value'])}
                                        // onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                        required
                                        className="intro-x login__input form-control py-3 px-4 block mt-4"
                                        placeholder="Password"
                                        {...register("password", {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Minimum Required length is 8'
                                            }

                                        })}

                                    />
                                    {formState.errors.password &&
                                    <span
                                        className='text-sm text-red-500'>{formState.errors.password.message}</span>}
                                    {isCapsLockOn && (
                                        <p style={{color: "red"}} className='caps-lock-warning'>Warning: Caps Lock is
                                            ON</p>)}


                                </div>
                                <div
                                    className="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
                                    <div className="flex items-center mr-auto">
                                        <input
                                            id="remember-me"
                                            type="checkbox"
                                            selected={selected}
                                            onChange={e => setIsSelected(!selected)}
                                            className="form-check-input border mr-2"
                                        />
                                        <label
                                            className="cursor-pointer select-none"
                                            htmlFor="remember-me"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                </div>
                                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">

                                    <CustomButton
                                        type='submit'
                                        isLoading={isLoading}
                                        className={'btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top'}
                                        onClick={handleSubmit} children={'Login'}/>
                                    {/*<button*/}
                                    {/*    // disabled={!formState.isValid}*/}
                                    {/*    onClick={handleSubmit}*/}
                                    {/*    className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top">*/}
                                    {/*    Login*/}
                                    {/*</button>*/}
                                    <button onClick={signUp}
                                            className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top">
                                        Register
                                    </button>
                                </div>
                                </form>
                            </div>
                        </div>
                        {/* END: Login Form */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;
