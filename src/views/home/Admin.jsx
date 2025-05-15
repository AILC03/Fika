// import NavigationMenu from "../../components/adminMenu";
import ManagementDashboard from "../../components/managerView/ManagementDashboard";

const General = () => {
  return (
    <div className="p-4 sm:p-6 md:p-7 w-full max-h-2/3">
      <div className="w-full max-w-screen-3xl max-h-2/3">
        <ManagementDashboard />
      </div>
    </div>
  );
};

export default General;
