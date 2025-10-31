import StatCards from "../card/StatCards";
import SalesOverviewChart from "../chart/SalesOverviewChart";
import RecentDealsTable from "../table/RecentDealsTable";

const Dashboard = () => {
    return (
        <div className="p-6 bg-gray-50 space-y-6 pt-24">
            <StatCards />
            <SalesOverviewChart />
            <RecentDealsTable />
        </div>
    );
};

export default Dashboard;