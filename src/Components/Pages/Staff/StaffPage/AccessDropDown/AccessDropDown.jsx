import { Fragment, useState } from "react"
import classes from "./AccessDropDown.module.css"
// import RadioButton from "../../../../UI/Inputs/RadioButton"
import CheckBox from "../../../../UI/Inputs/CheckBox"
import { useLocation } from "react-router-dom"
import PrimaryButton from "../../../../UI/Bottons/PrimaryButton"
import SecondaryButton from "../../../../UI/Bottons/SecondaryButton"

const AccessDropDown = (props) => {
    const location = useLocation()
    const [IsOpen, setIsOpen] = useState((location.pathname === '/Staff-Add' && window.innerWidth > 550) ? true : false)

    const OpenHandler = () => {
        if (IsOpen) {
            setIsOpen(false)
        } else {
            setIsOpen(true)
        }
    }
    const PermissionUpdateHandler = (PermissionId, IsChecked) => {
        props.PermissionUpdateHandler(PermissionId, IsChecked, props.data.Type);

    }

    const selectAll = (isChecked) => {
        var checkboxes = document.getElementsByName(props.data.Type);
        for (var i = 0, n = checkboxes.length; i < n; i++) {
            if (checkboxes[i].checked !== isChecked) {
                checkboxes[i].checked = isChecked;
            }
            props.PermissionUpdateHandler(checkboxes[i].id, isChecked, props.data.Type);
        }
    }


    return (
        <div className={`${location.pathname === '/Staff-Add' ? classes.AddContainer : classes.Container} ${IsOpen && classes.active}`}>
            <div className={`${location.pathname === '/Staff-Add' ? classes.AddMain : classes.Main} ${IsOpen && classes.active}`} onClick={() => location.pathname !== '/Staff-Add' && window.innerWidth > 500 && OpenHandler()}>
                {location.pathname === '/Staff-Add' ?
                    <div className={`${classes.Title} font-500 ${window.innerWidth > 550 ? "size-10" : " size-7"} text-black`}>
                        {props.data.Title}
                    </div>
                    :
                    <div className={`${classes.Title} font-600 ${window.innerWidth > 550 ? "size-14" : " size-7"} text-black`}>
                        {props.data.Title}
                    </div>
                }

                {window.innerWidth > 550 && location.pathname !== '/Staff-Add' &&
                    <div className={`${classes.arrow} ${IsOpen && classes.active}`} >
                        <svg width="18" height="9" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.2602 1.2041L10.2836 7.18077C9.57773 7.8866 8.42273 7.8866 7.7169 7.18077L1.74023 1.2041" stroke={IsOpen ? "#fff" : "#5E5F6E"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                }
            </div>

            {(window.innerWidth < 550 || IsOpen) &&
                <div className={`${location.pathname === '/Staff-Add' ? classes.Addbody : classes.body} ${(window.innerWidth < 550 || IsOpen) && classes.active}`}>
                    <div className={`font-400 text-lightgray ${window.innerWidth > 550 ? "mb-20 size-6" : "size-3"}`}>
                        {props.data.SubTitle}
                    </div>
                    {window.innerWidth > 550 ?
                        // <RadioButton
                        //     LabelClassName={`size-6`}
                        //     name={`${props.data.Type}radio`}
                        //     ID={`${props.data.Type}radio`}
                        //     // onChange={props.onChange}
                        //     isChecked={selectAll}>
                        //     All accesses</RadioButton>
                        <div style={{ display: "flex", "gap": "14px", alignItems: " center" }}>

                            <PrimaryButton onClick={() => selectAll(true)} style={{ height: "41px" }} type="button">
                                Select All
                            </PrimaryButton>
                            <SecondaryButton onClick={() => selectAll(false)} type="button">
                                Deselect All
                            </SecondaryButton>

                        </div>
                        :
                        <div className={`${classes.RadioContainer} ${(IsOpen) && classes.active}`} onClick={OpenHandler}>
                            <div className="text-darkgray size-5 font-500">
                                {!IsOpen ? "Open" : "Close"}
                            </div>

                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                <path d="M16.5999 7.4585L11.1666 12.8918C10.5249 13.5335 9.4749 13.5335 8.83324 12.8918L3.3999 7.4585" stroke="#5E5F6E" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    }
                    {IsOpen &&
                        <>
                            {window.innerWidth < 500 &&
                                <div style={{ display: "flex", "gap": "14px", alignItems: " center" }} className={`mb-20`}>

                                    <PrimaryButton onClick={() => selectAll(true)} style={{ height: "41px" }}>
                                        Select All
                                    </PrimaryButton>
                                    <SecondaryButton onClick={() => selectAll(false)}>
                                        Deselect All
                                    </SecondaryButton>

                                </div>
                            }
                            <div className={`${location.pathname === '/Staff-Add' ? classes.AddCheckboxContainer : classes.CheckboxContainer}`}>

                                {props.data.Type === 'EDIT' &&
                                    <Fragment>
                                        <CheckBox name="EDIT" onChange={PermissionUpdateHandler} ID="calender-edit" defaultChecked={props.AccessData.includes("calender")} LabelClassName={`size-6`}>Edit Schedule</CheckBox>
                                        <CheckBox name="EDIT" onChange={PermissionUpdateHandler} ID="client-edit" defaultChecked={props.AccessData.includes("client")} LabelClassName={`size-6`}>Edit client profile</CheckBox>
                                        <CheckBox name="EDIT" onChange={PermissionUpdateHandler} ID="client-note-edit" defaultChecked={props.AccessData.includes("client-note")} LabelClassName={`size-6`}>Edit client notes</CheckBox>
                                        <CheckBox name="EDIT" onChange={PermissionUpdateHandler} ID="client-report-edit" defaultChecked={props.AccessData.includes("client-report")} LabelClassName={`size-6`}>Edit reports</CheckBox>
                                        <CheckBox name="EDIT" onChange={PermissionUpdateHandler} ID="course-edit" defaultChecked={props.AccessData.includes("course")} LabelClassName={`size-6`}>Edit courses</CheckBox>
                                        <CheckBox name="EDIT" onChange={PermissionUpdateHandler} ID="course-exam-edit" defaultChecked={props.AccessData.includes("course-exam")} LabelClassName={`size-6`}>Edit course Exam</CheckBox>
                                        <CheckBox name="EDIT" onChange={PermissionUpdateHandler} ID="notification-edit" defaultChecked={props.AccessData.includes("notification")} LabelClassName={`size-6`}>Edit notification</CheckBox>
                                        <CheckBox name="EDIT" onChange={PermissionUpdateHandler} ID="message-edit" defaultChecked={props.AccessData.includes("message")} LabelClassName={`size-6`}>Edit message</CheckBox>
                                        <CheckBox name="EDIT" onChange={PermissionUpdateHandler} ID="staff-edit" defaultChecked={props.AccessData.includes("staff")} LabelClassName={`size-6`}>Edit staff profiles</CheckBox>
                                        <CheckBox name="EDIT" onChange={PermissionUpdateHandler} ID="online-office-edit" defaultChecked={props.AccessData.includes("online-office")} LabelClassName={`size-6`}>Edit Online Office</CheckBox>
                                    </Fragment>
                                }
                                {props.data.Type === 'DELETE' &&
                                    <Fragment>
                                        <CheckBox name="DELETE" ID="calender-delete" onChange={PermissionUpdateHandler} defaultChecked={props.AccessData.includes("calender")} LabelClassName={`size-6`}>delete Schedule</CheckBox>
                                        <CheckBox name="DELETE" ID="course-delete" onChange={PermissionUpdateHandler} defaultChecked={props.AccessData.includes("course")} LabelClassName={`size-6`}>Delete the course</CheckBox>
                                        <CheckBox name="DELETE" ID="client-delete" onChange={PermissionUpdateHandler} defaultChecked={props.AccessData.includes("client")} LabelClassName={`size-6`}>Delete client</CheckBox>
                                        <CheckBox name="DELETE" ID="client-note-delete" onChange={PermissionUpdateHandler} defaultChecked={props.AccessData.includes("client-note")} LabelClassName={`size-6`}>Delete client notes</CheckBox>
                                        <CheckBox name="DELETE" ID="client-document-delete" onChange={PermissionUpdateHandler} defaultChecked={props.AccessData.includes("client-document")} LabelClassName={`size-6`}>Delete client Documents</CheckBox>
                                        <CheckBox name="DELETE" ID="notification-delete" onChange={PermissionUpdateHandler} defaultChecked={props.AccessData.includes("notification")} LabelClassName={`size-6`}>Delete notification</CheckBox>
                                        <CheckBox name="DELETE" ID="message-delete" onChange={PermissionUpdateHandler} defaultChecked={props.AccessData.includes("message")} LabelClassName={`size-6`}>Delete message</CheckBox>
                                        <CheckBox name="DELETE" ID="online-office-delete" onChange={PermissionUpdateHandler} defaultChecked={props.AccessData.includes("online-office")} LabelClassName={`size-6`}>Deleting In Online Office</CheckBox>
                                        <CheckBox name="DELETE" ID="staff-delete" onChange={PermissionUpdateHandler} defaultChecked={props.AccessData.includes("staff")} LabelClassName={`size-6`}>Eliminate employees</CheckBox>

                                    </Fragment>
                                }
                                {props.data.Type === 'VIEW' &&
                                    <Fragment>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="calender-view" defaultChecked={props.AccessData.includes("calender")} LabelClassName={`size-6`}>View Calender</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="calender-all-view" defaultChecked={props.AccessData.includes("calender-all")} LabelClassName={`size-6`}>View All Calender</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="client-view" defaultChecked={props.AccessData.includes("client")} LabelClassName={`size-6`}>View client</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="client-all-view" defaultChecked={props.AccessData.includes("client-all")} LabelClassName={`size-6`}>View All client</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="client-note-view" defaultChecked={props.AccessData.includes("client-note")} LabelClassName={`size-6`}>View client notes</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="client-report-view" defaultChecked={props.AccessData.includes("client-report")} LabelClassName={`size-6`}>See the reports section</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="course-view" defaultChecked={props.AccessData.includes("course")} LabelClassName={`size-6`}>View courses</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="online-office-view" defaultChecked={props.AccessData.includes("online-office")} LabelClassName={`size-6`}>View Online Office</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="update-view" defaultChecked={props.AccessData.includes("update")} LabelClassName={`size-6`}>View Updates</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="update-all-view" defaultChecked={props.AccessData.includes("update-all")} LabelClassName={`size-6`}>View All Updates</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="staff-view" defaultChecked={props.AccessData.includes("staff")} LabelClassName={`size-6`}>View Staffs</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="message-view" defaultChecked={props.AccessData.includes("message")} LabelClassName={`size-6`}>View message</CheckBox>
                                        <CheckBox name="VIEW" onChange={PermissionUpdateHandler} ID="notification-view" defaultChecked={props.AccessData.includes("notification")} LabelClassName={`size-6`}>View notification</CheckBox>
                                    </Fragment>
                                }
                                {(location.pathname === '/Staff-Add' && window.innerWidth > 550) ?
                                    <Fragment>
                                        <div className={classes.divider} style={{ gridRow: props.data.Type === 'VIEW' ? "1/6" : "1/5", gridColumn: 2 }}></div>
                                        <div className={classes.divider} style={{ gridRow: props.data.Type === 'VIEW' ? "1/6" : "1/5", gridColumn: 4 }}></div>
                                    </Fragment>
                                    :
                                    <div className={classes.divider} style={{ gridRow: props.data.Type === 'EDIT' ? "1/7" : "1/8" }}></div>
                                }
                            </div>
                        </>

                    }
                </div>
            }
        </div>

    )
}

export default AccessDropDown