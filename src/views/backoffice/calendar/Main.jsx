import Calendar from "@/components/calendar/Main";
import useError from "../../../hooks/useError";

function Main() {
    const setError = useError()
    return (
        <>
            <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Calendar</h2>
            </div>
            <div className="grid grid-cols-12 gap-5 mt-5">
                {/* BEGIN: Calendar Content */}
                <div className="col-span-12 xl:col-span-12 2xl:col-span-12">
                    <div className="box p-5">
                        <Calendar {...{setError}} />
                    </div>
                </div>
                {/* END: Calendar Content */}
            </div>
        </>
    );
}

export default Main;
