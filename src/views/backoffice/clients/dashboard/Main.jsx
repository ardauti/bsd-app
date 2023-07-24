import ReportLineChart from "../../../../components/report-line-chart/Main";

function Main () {
    return (
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Clients Dashboard</h2>
            </div>
            {/* BEGIN: Page Layout */}
            <div className="intro-y box p-5 mt-5">Clients Dashboard</div>
            {/* END: Page Layout */}
            <ReportLineChart height={275} className="mt-6 -mb-6" />
        </>
    );
}

export default Main;
