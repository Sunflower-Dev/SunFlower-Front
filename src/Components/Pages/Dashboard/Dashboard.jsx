import { Route } from "react-router-dom";
import CalenderView from "../../Layout/Calender/CalenderView";
import Logs from "../../Layout/Log/LogContainer";
import Tasks from "../../Layout/Tasks/Tasks";
import classes from "./Dashboard.module.css";
import { FloatSideBar } from "../../Layout/Sidebar/Sidebar";
import { Fragment, useEffect, useState } from "react";
import EventManager from "../../UI/Popup/MobilePopup/EventManager/EventManager";
import { axiosInstance } from "../../../axios-global";
import LoadingSpinner from "../../UI/LoadingSpinner";
import { useSelector } from "react-redux";
import StaffList from "../Staff/StaffList/StaffList";
// import { useDispatch } from "react-redux";
// import { LinkAction } from "../../../store/index";

const Dashboard = () => {
  const [Schedules, setSchedules] = useState([]);
  const [TasksData, setTasks] = useState(null);
  const [AdminType, SetAdminType] = useState(null);
  const [SuperAdmin, SetSuperAdmin] = useState(null);
  const [LogsData, setLogs] = useState(null);
  const Permissions = JSON.parse(
    useSelector((state) => state.Auth.Admin)
  ).Permissions;

  useEffect(() => {
    (async () => {
      try {
        const call = await axiosInstance.get(
          `/dashboard/${window.innerWidth > 550 ? "Web" : "Mobile"}`
        );
        var response = call.data;
        if (response.length === 0) {
          response = "no schedule";
        }
        setSchedules(response.Schedules);
        setTasks(response.Tasks);
        SetAdminType(response.AdminType);
        if (response.AdminType === "SuperAdmin") {
          SetSuperAdmin(response.SuperAdmin);
        }
        if (window.innerWidth > 550) {
          setLogs(response.Logs);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className={classes.topContainer}>
      {!Schedules ? (
        <LoadingSpinner />
      ) : Schedules?.status ? (
        Schedules.message
      ) : (
        <CalenderView
          className={classes.Calender}
          Type="MINI"
          Schedules={Schedules}
        />
      )}

      {AdminType === "SuperAdmin" ? (
        SuperAdmin && (
          <div className={`${classes.SuperAdminContainer}`}>
            <div className={`${classes.SuperAdminItem}`}>
              <img src="/svg/vector/client-70.svg" alt="" />
              <div
                className={`text-lightgray font-400 ${
                  window.innerWidth > 550 ? "size-5" : "size-4"
                }`}
              >
                Number of clients
              </div>
              <div
                className={`text-darkgray ${
                  window.innerWidth > 550
                    ? "font-600 size-10"
                    : "font-500 size-6"
                }`}
              >
                {SuperAdmin.Clients} people
              </div>
            </div>

            <div className={`${classes.SuperAdminItem}`}>
              <img src="/svg/vector/Staff-70.svg" alt="" />
              <div
                className={`text-lightgray font-400 ${
                  window.innerWidth > 550 ? "size-5" : "size-4"
                }`}
              >
                Number of Employees
              </div>
              <div
                className={`text-darkgray ${
                  window.innerWidth > 550
                    ? "font-600 size-10"
                    : "font-500 size-6"
                }`}
              >
                {SuperAdmin.Admins} people
              </div>
            </div>

            <div className={`${classes.SuperAdminItem}`}>
              <img src="/svg/vector/Message-70.svg" alt="" />
              <div
                className={`text-lightgray font-400 ${
                  window.innerWidth > 550 ? "size-5" : "size-4"
                }`}
              >
                Number of sessions
              </div>
              <div
                className={`text-darkgray ${
                  window.innerWidth > 550
                    ? "font-600 size-10"
                    : "font-500 size-6"
                }`}
              >
                {SuperAdmin.Schedules} sessions
              </div>
            </div>
          </div>
        )
      ) : (
        <Tasks className={classes.Tasks} Tasks={TasksData} />
      )}
      {AdminType === "SuperAdmin" ? (
        <StaffList
          style={{ gridColumn: window.innerWidth > 550 ? "1/3" : "1" }}
        />
      ) : (
        (Permissions.View.includes("update") ||
          Permissions.View.includes("update-all")) &&
        window.innerWidth > 550 && (
          <Logs style={{ gridColumn: "1/3" }} type="MINI" Logs={LogsData} />
        )
      )}

      {window.innerWidth <= 550 && (
        <Fragment>
          <Route path="/Dashboard/Sidebar">
            <FloatSideBar />
          </Route>
          <Route path="/Dashboard/EventManager">
            <EventManager />
          </Route>
        </Fragment>
      )}
    </div>
  );
};

export default Dashboard;
