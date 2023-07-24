import dom from "@left4code/tw-starter/dist/js/dom";
import errorIllustration from "@/assets/images/error-illustration.svg";
import {useContext, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import AuthContext from "../../../context/AuthProvider";

function PageNotFound() {

    useEffect(() => {
        dom("body").removeClass("main").removeClass("login").addClass("error-page");
    }, []);


    const { token } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation();


    function goBack() {

        navigate('/', {replace: true})
    }

    return (
        <>
            <div style={{background:"#5E716A"}}>
                <div className="container">
                    {/* BEGIN: Error Page */}
                    <div
                        className="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left">
                        <div className="-intro-x lg:mr-20">
                            <img
                                alt="Midone Tailwind HTML Admin Template"
                                className="h-48 lg:h-auto"
                                src={errorIllustration}
                            />
                        </div>
                        <div  className="text-white mt-10 lg:mt-0">
                            <div className="intro-x text-8xl font-medium">404</div>
                            <div className="intro-x text-xl lg:text-3xl font-medium mt-5">
                                Oops. This page has gone missing.
                            </div>
                            <div className="intro-x text-lg mt-3">
                                You may have mistyped the address or the page may have moved.
                            </div>
                            <button
                                onClick={goBack}
                               style={{color:'white'}}
                                className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top">
                                Back to Home Page
                            </button>
                        </div>
                    </div>
                    {/* END: Error Page */}
                </div>
            </div>
        </>
    );
}

export default PageNotFound;
