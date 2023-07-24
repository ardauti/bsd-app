import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import React from "react";
import '../../../assets/css/public/CreateUser.css'
import dom from "@left4code/tw-starter/dist/js/dom";
import {useForm} from 'react-hook-form';
import {useSnackbar} from "notistack";
import {CreateUserBy, UserInvitation} from "../../../routes/routes";
import errorIllustration from "@/assets/images/error-illustration.svg";



const CreateUser = () => {

    //useStates allows us to have state variables in functional components
    const [invitationToken, setInvitationToken] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmedPassword] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const {enqueueSnackbar} = useSnackbar()
    const [phone_number, setPhone_number] = useState('')
    const [isValid, setIsValid] = useState(true);
    const [gender, setGender]=useState('')


    //useForm is needed for the validation
    //mode is set to onChange so that it updates while we type
    const {register, handleSubmit, formState} = useForm({
        mode: 'onChange',
    });


//will add and remove needed designs
    useEffect(() => {
        dom("body").removeClass("main").removeClass("error-page").addClass("login");
    }, []);

//request
    const CreateUser = async (e) => {
        try {
            const response = await CreateUserBy
            ({
                invitation_token: invitationToken,
                password: password,
                password_confirmation: confirmPassword,
                first_name: firstName,
                last_name: lastName,
                birthdate: birthdate,
                phone_number: phone_number,
                gender:gender
            }

            ).catch(function (error){
                console.log(error.response.status)

            //     (response)=>{
            //         response.json()
            //             .then((response)=>{
            //                 if (response.catch == 200){
            //                 }
            //             })
            //     }
            })

        } catch (err) {
            console.log(err)
        }

        enqueueSnackbar('Account has been created!', {variant: 'success'});
        navigate('/', {replace: true})

    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    //this use effect cuts the invitation token from the url and only stores the token
    //the process is done by the separator '/'

    useEffect(() => {
        let url = window.location.href
        let arrayUrl = url.split('/')
        setInvitationToken(arrayUrl[arrayUrl.length - 1]);
        let token = arrayUrl[arrayUrl.length - 1]

        getUserInformation(token);
    }, []);

    const getUserInformation = async (token: string) => {
        console.log(token)
        try {
            console.log(token)
            console.log(email)
            const response = await UserInvitation({email: email, token: token})
            console.log(response.email)
            setEmail(response.email)
            console.log(response)
            if (token == '')
                alert('no token')
        } catch (err) {
            setIsValid(false)
            console.log(err.response.data.data.message)
        }
    }

    const navigate = useNavigate()

    function signupHandler() {
        navigate('/login', {replace: true})
    }

    function goBack() {
        navigate('/', {replace: true})
    }

    return (
       isValid ? (
            <div className="container sm:px-10">
                <div className="block xl:grid grid-cols-2 gap-4">
                    {/* BEGIN: Register Info */}
                    <div className="hidden xl:flex flex-col min-h-screen">
                        <a href="" className="-intro-x flex items-center pt-5">

                            <span className="text-white text-lg ml-3"> BSD </span>
                        </a>
                        <div className="my-auto">

                            <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                                Hello there <br/>
                                {email} <br/>
                                A few more clicks to <br/>
                                sign up to your account.
                            </div>
                            <div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
                                Manage all your work stuff accounts in one place
                            </div>
                        </div>
                    </div>
                    {/* END: Register Info */}
                    {/* BEGIN: Register Form */}
                    <form
                        className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                        <div
                            className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                            <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                                Sign Up
                            </h2>
                            <div className="intro-x mt-2 text-slate-400 dark:text-slate-400 xl:hidden text-center">
                                A few more clicks to sign in to your account. Manage all your
                                e-commerce accounts in one place
                            </div>
                            <div className="intro-x mt-8">
                                <input
                                    onInput={(e) => setFirstName(e.target['value'])}

                                    type="text"
                                    className={`intro-x login__input form-control py-3 px-4 block mt-4 ${formState.errors.firstName && "focus:border-red-500 focus:ring-red-500 border-red-500"}`}
                                    placeholder="First Name"
                                    {...register("firstName", {required: 'First Name is required'})}

                                />
                                {formState.errors.firstName &&
                                <span className='text-sm text-red-500'>{formState.errors.firstName.message}</span>}

                                <input
                                    onInput={(e) => setLastName(e.target['value'])}
                                    type="text"
                                    className={`intro-x login__input form-control py-3 px-4 block mt-4 ${formState.errors.lastName && "focus:border-red-500 focus:ring-red-500 border-red-500"}`}
                                    placeholder="Last Name"
                                    {...register("lastName", {required: 'Last Name is required'})}
                                />
                                {formState.errors.lastName &&
                                <span className='text-sm text-red-500'>{formState.errors.lastName.message}</span>}

                                <input
                                    onInput={(e) => setBirthdate(e.target['value'])}
                                    value={birthdate}
                                    type="date"
                                    className={`intro-x login__input form-control py-3 px-4 block mt-4 ${formState.errors.birthday && "focus:border-red-500 focus:ring-red-500 border-red-500"}`}
                                    placeholder="Birthday"
                                    {...register("birthday", {required: 'Birthday is required'})}

                                />
                                {formState.errors.birthday &&
                                <span className='text-sm text-red-500'>{formState.errors.birthday.message}</span>}


                                <input

                                    value={email}
                                    disabled={true}
                                    type="text"
                                    className="intro-x login__input form-control py-3 px-4 block mt-4"
                                    placeholder="Email"
                                />

                                <div className="input-form mt-3">
                                    <label
                                        htmlFor="validation-form-1"
                                        className="form-label w-full flex flex-col sm:flex-row"
                                    >
                             Gender

                                    </label>
                                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center pl-3">
                                                <input id="horizontal-list-radio-license"
                                                       onClick={(e) => setGender(e.target['value'])}
                                                       type="radio"
                                                       value="Female"
                                                       name="list-radio"
                                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600
                                                            dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                </input>
                                                <label htmlFor="horizontal-list-radio-license"
                                                       className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Female
                                                </label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center pl-3">
                                                <input id="horizontal-list-radio-id"
                                                       onClick={(e) => setGender(e.target['value'])}
                                                       type="radio"
                                                       value="Male"
                                                       name="list-radio"
                                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600
                                                            dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                </input>
                                                <label htmlFor="horizontal-list-radio-license"
                                                       className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Male
                                                </label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center pl-3">
                                                <input id="horizontal-list-radio-millitary"
                                                       onClick={(e) => setGender(e.target['value'])}
                                                       type="radio"
                                                       value="Other"
                                                       name="list-radio"
                                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600
                                                            dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                </input>
                                                <label htmlFor="horizontal-list-radio-license"
                                                       className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Other
                                                </label>

                                            </div>
                                        </li>
                                    </ul>
                                </div>


                                <input
                                    onInput={(e) => setPhone_number(e.target['value'])}
                                    type="text"
                                    className={`intro-x login__input form-control py-3 px-4 block mt-4 ${formState.errors.phone_number && "focus:border-red-500 focus:ring-red-500 border-red-500"}`}
                                    placeholder="Phone Number"
                                    {...register("phone_number", {required: 'Phone Number is required'})}
                                />
                                {formState.errors.phone_number &&
                                <span className='text-sm text-red-500'>{formState.errors.phone_number.message}</span>}

                                <input
                                    type={'password'}
                                    className={`intro-x login__input form-control py-3 px-4 block mt-4 ${formState.errors.password && "focus:border-red-500 focus:ring-red-500 border-red-500"}`}
                                    placeholder="Password"
                                    onInput={handlePasswordChange}
                                    {...register("password", {
                                        required: 'Password is required',
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                                            message: 'Password should include at least one uppercase, one numeric value and one special value'
                                        },
                                        minLength: {
                                            value: 8,
                                            message: 'Minimum Required length is 8'
                                        }
                                    })}
                                />

                                {formState.errors.password &&
                                <span className='text-sm text-red-500'>{formState.errors.password.message}</span>}
                                <input
                                    type={'password'}
                                    className={`intro-x login__input form-control py-3 px-4 block mt-4 ${formState.errors.confirmPassword && "focus:border-red-500 focus:ring-red-500 border-red-500"}`}
                                    onPaste={(e) => {
                                        e.preventDefault()
                                        return false;
                                    }}

                                    placeholder="Password Confirmation"
                                    onInput={(e) => setConfirmedPassword(e.target['value'])}
                                    {...register("confirmPassword", {
                                        required: 'Confirm password is required',
                                        validate: (value) =>
                                            value === password || 'The passwords do not match',
                                    })}
                                />

                                {formState.errors.confirmPassword &&
                                <span
                                    className='text-sm text-red-500'>{formState.errors.confirmPassword.message}</span>}
                            </div>
                            <div
                                className="intro-x flex items-center text-slate-600 dark:text-slate-500 mt-4 text-xs sm:text-sm">
                            </div>
                            <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                                <button
                                    disabled={!formState.isValid}
                                    onClick={handleSubmit(CreateUser)}
                                    className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top">
                                    Create
                                </button>

                                <button
                                    className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top"
                                    onClick={signupHandler}>
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </form>
                    {/* END: Register Form */}
                </div>
            </div>
        ) : (
            <>
           <>
               <div>
                   <div className="container">
                       {/* BEGIN: Error Page */}
                       <div
                           className="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left">
                           <div  className="-intro-x ml-9 lg:mr-20">
                               <img
                                   alt="Midone Tailwind HTML Admin Template"
                                   className="h-48 lg:h-auto"
                                   src={errorIllustration}
                               />
                           </div>
                           <div  className="text-white mt-10 lg:mt-0">
                               <div className="intro-x text-8xl font-medium">404</div>
                               <div style={{color:'black'}} className="intro-x text-xl lg:text-3xl font-medium mt-5">
                                   Oops. This page has gone missing.
                               </div>
                               <div style={{color:'black'}} className="intro-x text-lg mt-3">
                                   The invitation has been canceled
                               </div>
                               <button
                                   onClick={goBack}
                                   style={{color:'black'}}
                                   className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top">
                                   Back to Home
                               </button>
                           </div>
                       </div>
                       {/* END: Error Page */}
                   </div>
               </div>
           </>

        </>)

    )
}

export default CreateUser;
