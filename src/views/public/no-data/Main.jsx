import {
    Lucide,
    PreviewComponent,
    Preview
} from "@/components";
import CustomButton from "../../../components/customButton/CustomButon";
import {useNavigate} from "react-router-dom";
import dom from "@left4code/tw-starter/dist/js/dom";
import {useEffect} from "react";


function Main(props) {
    const navigate = useNavigate()

    function navigateTo() {
        navigate(`/${props.navigateTo}`, {replace: true})
    }
    useEffect(() => {
        dom("body")[0].classList.remove("overflow-y-hidden")
    },[])

    return (
        <div>
            <PreviewComponent>
                {({toggle}) => (
                    <>
                        <div className="p-5">
                            <Preview>
                                <div className="container">
                                    <div
                                        className={props.customize ? "flex justify-center items-center mt-10" : "flex justify-center items-center h-screen"}>
                                        <div className="m-auto">
                                            <Lucide icon="FolderMinus" color={'#bfbfbf70'}
                                                    className="block mx-auto w-48 h-48"/>
                                            <div className="text-center text-lg text-gray-400 mt-2">No Data Found</div>
                                            {
                                                !props.customize &&
                                                <div className="text-center flex items-center justify-center text-gray-800 mt-2">
                                                    <CustomButton icon={'ArrowLeftCircle'} className={'text-lg'} widthIconSize={'w-6'}
                                                                  heightIconSize={'h-6'} iconColor={'#1F2937'} onClick={navigateTo}
                                                                  children={`Go back to ${props.label}`}></CustomButton>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Preview>
                        </div>
                    </>
                )}
            </PreviewComponent>
        </div>
    )
}

export default Main
