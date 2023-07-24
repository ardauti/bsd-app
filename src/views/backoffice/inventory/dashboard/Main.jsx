import ReportLineChart from "../../../../components/report-line-chart/Main";
import {useContext} from "react";
import AuthContext from "../../../../context/AuthProvider";

function Main () {
    const {userInfo, token} = useContext(AuthContext)
    return (
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Inventory Dashboard</h2>
            </div>
            {/* BEGIN: Page Layout */}
            <div className="intro-y box p-5 mt-5">Example Inventory</div>
            {/* END: Page Layout */}
            <ReportLineChart height={275} className="mt-6 -mb-6" />
        </>
    );
}

export default Main;
