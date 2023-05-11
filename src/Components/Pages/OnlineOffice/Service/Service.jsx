import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Route, useHistory } from "react-router-dom";
import { axiosInstance } from "../../../../axios-global";
import SecondaryButton from "../../../UI/Bottons/SecondaryButton";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import DeletePopup from "../../../UI/Popup/Delete/DeletePopup";
import DeleteDocumentConfirm from "../../../UI/Popup/DeleteDocumentConfirm/DeleteDocumentConfirm";
import MobilePopup from "../../../UI/Popup/MobilePopup/MobilePopup";
import RequestDeleteDocument from "../../../UI/Popup/RequestDeleteDocument/RequestDeleteDocument";
import AddClientDocument from "../../Client/ClientProfile/AddDocument/AddDocument";
import DocumentItem from "../../Client/ClientProfile/TabView/DocumentItem/DocumentItem";
import AddService from "../AddService/AddService";
import AddFolder from "./AddFolder/AddFolder";
import classes from "./Service.module.css";
import ServiceFolder from "./ServiceFolder/ServiceFolder";

const Service = () => {
  const [data, SetData] = useState(null);
  const [ActiveFolder, SetActiveFolder] = useState("");
  const [ActiveFolderTitle, SetActiveFolderTitle] = useState("");
  const [Documents, SetDocuments] = useState([]);
  const [IsServiceDeleting, SetIsServiceDeleting] = useState(false);
  const [IsFolderDeleting, SetIsFolderDeleting] = useState(false);

  const [IsActionOpen, setIsActionOpen] = useState(false);
  const ScrollHRef = useRef(null);

  // const [Documents, SetDocuments] = useState([])
  const { id } = useParams();

  const history = useHistory();

  const Permissions = JSON.parse(
    useSelector((state) => state.Auth.Admin)
  ).Permissions;

  const openActionHandler = () => {
    if (IsActionOpen) {
      setIsActionOpen(false);
    } else {
      setIsActionOpen(true);
    }
  };

  useEffect(() => {
    if (history.location.pathname === "/Online-Office/Service/" + id) {
      SetActiveFolder("");
    }
    (async () => {
      try {
        const call = await axiosInstance.get("/online-office/GetService/" + id);
        var response = call.data;
        var TMP = response;
        var DocCount = 0;
        TMP.Folders.forEach((element) => {
          DocCount += element.Documents.length;
        });
        TMP.DocCount = DocCount;

        SetData(TMP);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id, history.location.pathname]);

  // The scroll listener
  const handleScroll = useCallback(
    (evt) => {
      evt.preventDefault();
      ScrollHRef.current.scrollLeft += evt.deltaY;
    },
    [ScrollHRef]
  );

  useEffect(() => {
    if (window.innerWidth > 550) {
      if (ScrollHRef.current) {
        ScrollHRef.current.addEventListener("wheel", handleScroll);
      }
    }
  }, [handleScroll, data]);

  const EditServiceClickHandler = () => {
    history.push(history.location.pathname + "/EditService");
  };

  const DeleteServiceClickHandler = () => {
    history.push(history.location.pathname + "/DeleteService");
  };

  const DeleteServiceConfirmHandler = async () => {
    SetIsServiceDeleting(true);
    try {
      const call = await axiosInstance.delete(
        "/online-office/DeleteService/" + id
      );
      var response = call.data;
      if (response) {
        SetIsServiceDeleting(false);
        history.go(-2);
      }
    } catch (error) {
      console.log(error);
      SetIsServiceDeleting(false);
    }
  };

  const OpenFolderClickHandler = (id) => {
    if (ActiveFolder === "") {
      SetActiveFolder(id);
      SetDocuments(data.Folders.find((x) => x._id === id).Documents);
      SetActiveFolderTitle(data.Folders.find((x) => x._id === id).Title);
    } else {
      if (ActiveFolder !== id) {
        SetActiveFolder("");

        setTimeout(() => {
          SetActiveFolder(id);
          SetDocuments(data.Folders.find((x) => x._id === id).Documents);
          SetActiveFolderTitle(data.Folders.find((x) => x._id === id).Title);
        }, 10);
      }
    }
  };

  const AddDocumentClickHandler = () => {
    history.push(history.location.pathname + "/AddDocument");
  };

  const DeleteFolderConfirmHandler = async () => {
    SetIsFolderDeleting(true);
    try {
      const call = await axiosInstance.delete(
        "/online-office/DeleteFolder/" + id + "/" + ActiveFolder
      );
      var response = call.data;
      if (response) {
        SetIsServiceDeleting(false);
        history.goBack();
      }
    } catch (error) {
      console.log(error);
      SetIsServiceDeleting(false);
    }
  };

  return !data ? (
    <LoadingSpinner />
  ) : (
    <div>
      {window.innerWidth < 550 && (
        <div className={`${classes.MobileHeader}`}>
          <img
            src="/svg/arrow-left.svg"
            alt=""
            onClick={() => history.goBack()}
          />
          <h2 className={`font-600 size-7 text-black `}>{data.Title}</h2>
          <img
            src="/svg/kebab-menu.svg"
            alt=""
            onClick={() => history.push(history.location.pathname + "/Manage")}
          />
        </div>
      )}

      <div className={`${classes.Header}`}>
        <h2
          className={`${
            window.innerWidth > 550 ? "font-600 size-14" : "font-700 size-10"
          } text-black ${classes.ServiceTitle}`}
        >
          {data.Title}
        </h2>
        <div
          className={`font-400 ${
            window.innerWidth > 550 ? "size-6" : "size-2"
          } text-lightgray ${classes.ServiceInfo}`}
        >
          {data.DocCount} Documents &nbsp;|&nbsp; {data.Folders.length} Folders
          &nbsp;|&nbsp; {moment(data.CreatedAt).format("DD/MM/YYYY")}
        </div>
        {Permissions.Edit.includes("online-office") && window.innerWidth > 550 && (
          <SecondaryButton
            className={`${classes.EditServiceBTN}`}
            onClick={EditServiceClickHandler}
          >
            <img src="/svg/edit-black.svg" alt="" width={20} />
            <div className="font-500 size-4 text-darkgray ml-8">
              Edit Service
            </div>
          </SecondaryButton>
        )}
        {Permissions.Delete.includes("online-office") &&
          window.innerWidth > 550 && (
            <SecondaryButton
              className={`${classes.DeleteServiceBTN}`}
              onClick={DeleteServiceClickHandler}
            >
              <img src="/svg/trash-black.svg" alt="" width={20} />
              <div className="font-500 size-4 text-darkgray ml-8">
                Delete Service
              </div>
            </SecondaryButton>
          )}
      </div>

      <div
        className={` font-400 ${
          window.innerWidth > 550 ? "size-6 mt-25" : "size-2 mt-10 pr-16 pl-16"
        } text-lightgray`}
      >
        {data.Description}
      </div>

      <div className={`${classes.FoldersHeader}`}>
        <h4
          className={`${
            window.innerWidth > 550
              ? "font-500 size-10 text-darkgray"
              : "font-600 size-7 text-black"
          } m-0`}
        >
          folders
        </h4>
        {Permissions.Edit.includes("online-office") && window.innerWidth > 550 && (
          <div
            className={`${classes.AddFolderButton}`}
            onClick={() =>
              history.push(history.location.pathname + "/AddFolder")
            }
          >
            <img src="/svg/plus-gray.svg" alt="" />
            <div className={`font-400 size-6 text-darkgray ml-8`}>
              Add Folder
            </div>
          </div>
        )}
      </div>
      <div className={`${classes.FoldersContainer}`} ref={ScrollHRef}>
        {data &&
          data.Folders.map((item) => (
            <ServiceFolder
              key={item._id}
              OpenFolderClickHandler={OpenFolderClickHandler}
              id={item._id}
              ActiveFolder={ActiveFolder === item._id ? true : false}
              Title={item.Title}
              Documents={item.Documents.length}
            />
          ))}
      </div>

      {ActiveFolder !== "" && (
        <div className={classes.DocumentContainer}>
          {window.innerWidth < 550 && (
            <svg
              width="32"
              height="3"
              viewBox="0 0 32 3"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ margin: "0 auto" }}
            >
              <rect width="32" height="3" rx="1.5" fill="#E1E2E6" />
            </svg>
          )}
          <div className={`${classes.DocumentsHeader} mt-40`}>
            <h2
              className={`${
                window.innerWidth > 550 ? "font-500 size-10" : "font-600 size-7"
              } text-black m-0`}
            >
              Documents
            </h2>
            {/* <SecondaryButton >
                                <img style={{ marginRight: "8px" }} src="/svg/filter-gray.svg" width="20px" alt="Filter" />
                                Filter
                            </SecondaryButton> */}
          </div>
          {Permissions.Edit.includes("online-office") &&
            window.innerWidth > 550 && (
              <div
                className={`${classes.UploadContainer}`}
                onClick={AddDocumentClickHandler}
              >
                <img
                  alt="download"
                  src="/svg/vector/download-80.svg"
                  width="80px"
                />
                <span className={`size-8 font-400 text-lightgray`}>
                  Upload your document
                </span>
              </div>
            )}
          {Documents &&
            Documents.map((item) => (
              <DocumentItem key={item._id} data={item} />
            ))}
        </div>
      )}

      {Permissions.Edit.includes("online-office") && (
        <>
          <Route path="/Online-Office/Service/:id/AddFolder">
            <AddFolder type="NEW" />
          </Route>

          <Route path="/Online-Office/Service/:id/AddDocument">
            <AddClientDocument Type="Service" FolderID={ActiveFolder} />
          </Route>

          <Route path="/Online-Office/Service/:id/EditService">
            <AddService type="EDIT" Service={data} />
          </Route>
          <Route path="/Online-Office/Service/:id/EditFolder/:FolderID">
            <AddFolder type="EDIT" Folder={{ Title: ActiveFolderTitle }} />
          </Route>
        </>
      )}

      {Permissions.Delete.includes("online-office") && (
        <>
          <Route path="/Online-Office/Service/:id/DeleteService">
            <DeletePopup
              Title="Delete service"
              SubTitle="Are you sure you want to delete the service?"
              onClick={DeleteServiceConfirmHandler}
              IsLoading={IsServiceDeleting}
            />
          </Route>

          <Route path="/Online-Office/Service/:id/DeleteFolder">
            <DeletePopup
              Title="Delete folder"
              SubTitle="Are you sure you want to delete the folder?"
              onClick={DeleteFolderConfirmHandler}
              IsLoading={IsFolderDeleting}
            />
          </Route>
        </>
      )}

      <Route path={"/Online-Office/Service/:id/DeleteDocument/:DocumentId"}>
        {Permissions.Delete.includes("online-office") ? (
          <DeleteDocumentConfirm
            get={`/online-office/GetDocumentRequestsFromService/${id}/${ActiveFolder}/`}
            delete={`/online-office/DeleteDocumentConfirmFromService/${id}/${ActiveFolder}/`}
          />
        ) : (
          <RequestDeleteDocument
            urlPost={`/online-office/RequestDeleteDocumentFromService/${id}/${ActiveFolder}/`}
          />
        )}
      </Route>

      <Route path={"/Online-Office/Service/:id/Manage"}>
        <MobilePopup>
          {Permissions.Edit.includes("online-office") && (
            <div
              className={`${classes.PopUpItem} size-4 font-400 text-darkgray`}
              onClick={() =>
                history.replace(
                  history.location.pathname.replace(/Manage/g, "") +
                    "EditService"
                )
              }
            >
              <img src="/svg/edit-black.svg" alt="edit" />{" "}
              <span>Edit service</span>
            </div>
          )}
          {Permissions.Delete.includes("online-office") && (
            <div
              className={`${classes.PopUpItem} size-4 font-400 text-darkgray`}
              onClick={() =>
                history.replace(
                  history.location.pathname.replace(/Manage/g, "") +
                    "DeleteService"
                )
              }
            >
              <img src="/svg/Clear-black.svg" alt="delete" />{" "}
              <span>Delete service</span>
            </div>
          )}
        </MobilePopup>
      </Route>

      {window.innerWidth < 550 && (
        <>
          <div
            className={`${classes.ActionButton} ${
              IsActionOpen && classes.active
            }`}
            onClick={openActionHandler}
          >
            <img src="/svg/plus-white.svg" width={32} alt="action" />
          </div>
          <div
            className={`${classes.ActionContainer} ${
              IsActionOpen && classes.active
            }`}
          >
            <div
              className={`${classes.ActionItem}`}
              onClick={() =>
                history.push(history.location.pathname + "/AddFolder")
              }
            >
              <div className={classes.ActionItemTitle}>Folders</div>
              <div className={classes.ActionItemIcon}>
                <img src="/svg/flag.svg" width={24} alt="action" />
              </div>
            </div>

            {ActiveFolder !== "" && (
              <div
                className={`${classes.ActionItem}`}
                onClick={() =>
                  history.push(history.location.pathname + "/AddDocument")
                }
              >
                <div className={classes.ActionItemTitle}>Documents</div>
                <div className={classes.ActionItemIcon}>
                  <img src="/svg/attachment.svg" width={24} alt="action" />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Service;
