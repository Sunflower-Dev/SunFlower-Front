import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { axiosInstance } from "../../../axios-global";
import PrimaryButton from "../../UI/Bottons/PrimaryButton";
import LeftIconInput from "../../UI/Inputs/LeftIconInput";
import LoadingSpinner from "../../UI/LoadingSpinner";

import classes from "./ClientList.module.css";
import ClientItem from "./ClientListItem";

const ClientList = () => {
  const history = useHistory();
  const [Clients, SetClients] = useState(null);
  const [SearchText, SetSearchText] = useState("");
  const [SortList, SetSortList] = useState("");

  const SearchRef = useRef(null);

  const addClientClickhandler = () => {
    history.push("/Client-Add");
  };
  const Permissions = JSON.parse(
    useSelector((state) => state.Auth.Admin)
  ).Permissions;

  useEffect(() => {
    if (
      Permissions.View.includes("client") ||
      Permissions.View.includes("client-all")
    ) {
      (async () => {
        try {
          const call = await axiosInstance.get("/Clients");
          var response = call.data;
          SetClients(response);
        } catch (error) {
          console.log(error);
        }
      })();
    }
    // eslint-disable-next-line
  }, []);

  const OnSearchChange = () => {
    let _Clients = Clients;
    SetSearchText(SearchRef.current.value);
    _Clients.forEach((element) => {
      var Re = new RegExp(SearchRef.current.value, "g");
      if (Re.test(element.Name)) {
        element.Visible = true;
      } else {
        element.Visible = false;
      }
    });
    SetClients(_Clients);
  };

  const SortListClickHandler = (type) => {
    let __sort = "";
    if (SortList === type + "-A") {
      SetSortList(type + "-D");
      __sort = "D";
    } else {
      SetSortList(type + "-A");
      __sort = "A";
    }

    let _Clients = Clients;
    _Clients = _Clients.sort((x, y) => {
      if (type === "ID") {
        let a = x._id.toUpperCase(),
          b = y._id.toUpperCase();
        if (__sort === "A") {
          return a === b ? 0 : a > b ? 1 : -1;
        } else {
          return a === b ? 0 : a > b ? -1 : 1;
        }
      } else if (type === "Name") {
        let a = x.Name.toUpperCase(),
          b = y.Name.toUpperCase();
        if (__sort === "A") {
          return a === b ? 0 : a > b ? 1 : -1;
        } else {
          return a === b ? 0 : a > b ? -1 : 1;
        }
      } else if (type === "Date") {
        let a = x.CreatedAt.toUpperCase(),
          b = y.CreatedAt.toUpperCase();
        if (__sort === "A") {
          return a === b ? 0 : a > b ? 1 : -1;
        } else {
          return a === b ? 0 : a > b ? -1 : 1;
        }
      } else {
        let a = x.Status.toUpperCase(),
          b = y.Status.toUpperCase();
        if (__sort === "A") {
          return a === b ? 0 : a > b ? 1 : -1;
        } else {
          return a === b ? 0 : a > b ? -1 : 1;
        }
      }
    });

    SetClients(_Clients);
  };

  return (
    <Fragment>
      {Permissions.View.includes("client") ? (
        <div className={`${classes.Container}`}>
          <div className={classes.Header}>
            <LeftIconInput
              icon="search"
              type="text"
              placeholder="Search..."
              className={`width-full`}
              onChange={OnSearchChange}
              ref={SearchRef}
              style={{
                width: window.innerWidth > 550 ? "340px" : "100%",
                height: "52px",
                background: window.innerWidth > 550 ? "white" : "transparent",
              }}
            />
            {window.innerWidth > 550 && Permissions.Edit.includes("client") ? (
              <PrimaryButton
                style={{
                  height: "41px",
                  padding: "10px 20px",
                  minWidth: "fit-content",
                }}
                onClick={addClientClickhandler}
              >
                <img src="/svg/plus-white.svg" width={20} alt="add" />
                <span className={`ml-8`}>Add client</span>
              </PrimaryButton>
            ) : (
              Permissions.Edit.includes("client") && (
                <img
                  src="/svg/plus-gray.svg"
                  width="30px"
                  alt="add"
                  onClick={addClientClickhandler}
                />
              )
            )}
          </div>

          {Clients === null ? (
            <LoadingSpinner />
          ) : Clients.length === 0 ? (
            <div className="text-center">You have no clients</div>
          ) : (
            <Fragment>
              <div className={classes.tableHeader}>
                {window.innerWidth > 550 ? (
                  <Fragment>
                    <div
                      className={classes.IDHeader}
                      onClick={() => SortListClickHandler("ID")}
                    >
                      <span>ID</span>
                      <div>
                        <img
                          src={`/svg/sort-${
                            SortList === "ID-A" ? "up-active" : "up"
                          }.svg`}
                          alt="sort"
                        />
                        <img
                          src={`/svg/sort-${
                            SortList === "ID-D" ? "down-active" : "down"
                          }.svg`}
                          alt="sort"
                        />
                      </div>
                    </div>
                    <div
                      className={classes.NameHeader}
                      onClick={() => SortListClickHandler("Name")}
                    >
                      <span>Name</span>
                      <div>
                        <img
                          src={`/svg/sort-${
                            SortList === "Name-A" ? "up-active" : "up"
                          }.svg`}
                          alt="sort"
                        />
                        <img
                          src={`/svg/sort-${
                            SortList === "Name-D" ? "down-active" : "down"
                          }.svg`}
                          alt="sort"
                        />
                      </div>
                    </div>
                    <div
                      className={classes.DateHeader}
                      onClick={() => SortListClickHandler("Date")}
                    >
                      <span>Registration date</span>
                      <div>
                        <img
                          src={`/svg/sort-${
                            SortList === "Date-A" ? "up-active" : "up"
                          }.svg`}
                          alt="sort"
                        />
                        <img
                          src={`/svg/sort-${
                            SortList === "Date-D" ? "down-active" : "down"
                          }.svg`}
                          alt="sort"
                        />
                      </div>
                    </div>
                    <div className={classes.SuperHeader}>
                      <span>Supervisor</span>
                    </div>
                    <div
                      className={classes.StatusHeader}
                      onClick={() => SortListClickHandler("Status")}
                    >
                      <span>Status</span>
                      <div>
                        <img
                          src={`/svg/sort-${
                            SortList === "Status-A" ? "up-active" : "up"
                          }.svg`}
                          alt="sort"
                        />
                        <img
                          src={`/svg/sort-${
                            SortList === "Status-D" ? "down-active" : "down"
                          }.svg`}
                          alt="sort"
                        />
                      </div>
                    </div>
                    <div></div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <div className={`font-700 size-10 text-black`}>Clients</div>
                    <div style={{ margin: "auto 0 auto auto" }}>{Clients.length} Client</div>
                  </Fragment>
                )}
              </div>

              {Clients.map(
                (client) =>
                  client.Visible !== false && (
                    <ClientItem
                      key={client._id}
                      item={{
                        RouteID: client._id,
                        ID: client._id.substring(0, 4),
                        Name: client.Name,
                        RegisterDate: moment(client.CreatedAt),
                        Supervisor: client.Admins,
                        Status: client.Status,
                        Avatar: client.Avatar,
                      }}
                      SearchText={SearchText}
                    />
                  )
              )}
            </Fragment>
          )}
        </div>
      ) : (
        <div className={`text-darkgray text-center mt-30 size-8 ml-8 mr-8`}>
          You have Not Right Privileges to access Clients List
        </div>
      )}
    </Fragment>
  );
};

export default ClientList;
