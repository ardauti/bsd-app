import ReportLineChart from "../../../components/report-line-chart/Main";

function Dashboard () {
    return (
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Dashboard of Employee</h2>
            </div>
            {/* BEGIN: Page Layout */}
            <div className="intro-y box p-5 mt-5">Example Dashboard</div>
            {/* END: Page Layout */}

            <ReportLineChart height={275} className="mt-6 -mb-6" />
        </>
    );
}

export default Dashboard
