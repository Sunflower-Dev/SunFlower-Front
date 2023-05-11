import moment from "moment";
import { Fragment, useState } from "react";
import { Route, useLocation, useHistory } from "react-router";
import PrimaryButton from "../../UI/Bottons/PrimaryButton";
import DeletePopup from "../../UI/Popup/Delete/DeletePopup";

import classes from './Calender.module.css'
import DaysRow from "./DaysRow/DaysRow";
import HourLine from "./HourLine/HourLine";
import MonthView from "./MonthView/MonthView";
import Event from "../Calender/Event/Event"
import NewSchedule from "../../Pages/Calender/NewSchedule/NewSchedule";
import { axiosInstance } from "../../../axios-global";
import { useSelector } from "react-redux";

const CalenderView = (props) => {

    const [CurrentDate, SetCurrentDate] = useState(moment())
    const [MonthYear, SetMonthYear] = useState(CurrentDate.format(`MMMM ${window.innerWidth > 550 ? "\xa0\xa0" : ""} YYYY`))
    const [CanGoNextMonth, SetCanGoNextMonth] = useState(false)
    const [DayInMonth, SetDayInMonth] = useState(CurrentDate.daysInMonth())
    const [IsRemoving, SetIsRemoving] = useState(false)
    const { search } = useLocation()
    const URL = new URLSearchParams(search)
    const history = useHistory()

    const AdminData = JSON.parse(useSelector((state) => state.Auth.Admin))
    const Permissions = AdminData.Permissions


    const PrevMonth = () => {
        var newDate = CurrentDate.add('-1', 'M')
        SetCurrentDate(newDate)

        SetMonthYear(newDate.format(`MMMM ${window.innerWidth > 550 ? "\xa0\xa0" : ""} YYYY`))
        SetCanGoNextMonth(true)
        SetDayInMonth(newDate.daysInMonth())
    }

    const NextMonth = () => {
        if (CanGoNextMonth) {
            var newDate = CurrentDate.add('1', 'M')
            SetCurrentDate(newDate)
            SetMonthYear(newDate.format(`MMMM ${window.innerWidth > 550 ? "\xa0\xa0" : ""} YYYY`))
            SetDayInMonth(newDate.daysInMonth())
        }
        if (CurrentDate.format(`MMMM \xa0\xa0 YYYY`) === moment().format(`MMMM ${window.innerWidth > 550 ? "\xa0\xa0" : ""} YYYY`)) {
            SetCanGoNextMonth(false)
        }
    }
    const DayClickHandler = (e, daynumber) => {
        if (daynumber < 10) {
            daynumber = '0' + daynumber
        }
        var newDate = moment(CurrentDate.format('YYYYMM') + daynumber)
        SetCurrentDate(newDate)
    }


    var CurrentDateMeetings = []
    if (props.Schedules !== 'no schedule') {
        if (window.innerWidth > 550) {
            props.Schedules.forEach(element => {
                if (element.AdminID) {
                    if ((CurrentDate.format('YYYY') === moment(element.ScheduleDate).format('YYYY')) &&
                        (CurrentDate.format('MM') === moment(element.ScheduleDate).format('MM')) &&
                        (CurrentDate.format('DD') === moment(element.ScheduleDate).format('DD'))) {

                        var period = +moment(element.ScheduleDate).format('HH')
                        if (CurrentDateMeetings.find(x => x.Period === period)) {
                            var i = CurrentDateMeetings.findIndex(x => x.Period === period)
                            CurrentDateMeetings[i].Mettings.push({
                                ID: element._id,
                                Title: element.Description,
                                DrName: element.AdminID.Name,
                                Type: element.Type,
                                State: element.Status,
                                Time: moment(element.ScheduleDate).format('hh:mm A'),
                                ContainerType: 'COLOUMN'
                            })
                        } else {
                            CurrentDateMeetings.push({
                                Period: period,
                                Mettings: [
                                    {
                                        ID: element._id,
                                        Title: element.Description,
                                        DrName: element.AdminID.Name,
                                        Type: element.Type,
                                        State: element.Status,
                                        Time: moment(element.ScheduleDate).format('hh:mm A'),
                                        ContainerType: 'COLOUMN'
                                    }
                                ]
                            });
                        }
                    }
                }
            });
            var MinHour = Math.min.apply(Math, CurrentDateMeetings.map(function (o) { return o.Period; }))
            var MaxHour = Math.max.apply(Math, CurrentDateMeetings.map(function (o) { return o.Period; }))

            for (let i = MinHour + 1; i < MaxHour; i++) {
                if (!CurrentDateMeetings.find(x => x.Period === i)) {
                    CurrentDateMeetings.push({
                        Period: i,
                        Mettings: []
                    })
                }
            }
            if (CurrentDateMeetings.length > 0) {
                CurrentDateMeetings.push({
                    Period: MaxHour + 1,
                    Mettings: []
                })
            }

            CurrentDateMeetings = CurrentDateMeetings.sort((i, j) => { return i.Period - j.Period })
        }
        else {
            props.Schedules.forEach(element => {
                if ((CurrentDate.format('YYYY') === moment(element.ScheduleDate).format('YYYY')) &&
                    (CurrentDate.format('MM') === moment(element.ScheduleDate).format('MM')) &&
                    (CurrentDate.format('DD') === moment(element.ScheduleDate).format('DD'))) {

                    CurrentDateMeetings.push({

                        ID: element._id,
                        Title: element.Description,
                        DrName: element.AdminID.Name,
                        Type: element.Type,
                        State: element.Status,
                        Time: moment(element.ScheduleDate).format('hh:mm A'),
                        ContainerType: 'COLOUMN'

                    });
                }
            });
            CurrentDateMeetings = CurrentDateMeetings.sort((i, j) => { return i.Time - j.Time })
        }
    }
    const RemoveScheduleConfirm = async () => {
        SetIsRemoving(true)
        const id = URL.get('ID')

        const call = await axiosInstance.delete('/schedules/' + id)
        var Response = call.data
        if (Response) {
            SetIsRemoving(false)
            history.goBack()
        }
    }
    const CancelScheduleConfirm = async () => {
        SetIsRemoving(true)
        const id = URL.get('ID')
        try {
            const call = await axiosInstance.put('/schedules/Cancel/' + id)
            var Response = call.data
            if (Response) {
                SetIsRemoving(false)
                history.goBack()
            }
        } catch (error) {

        }
    }

    return (
        <div className={`${props.className} ${classes.CalenderMin} ${props.Type === "FULL" && window.innerWidth < 550 && classes.CalenderFullMobile}`}>
            {props.Type === "MINI" &&
                <Fragment>
                    {window.innerWidth > 550 ?
                        <Fragment>
                            <span className={`font-600 size-14 text-black mt-25 ml-20`}>
                                Calender
                            </span>
                            <MonthView
                                PrevClick={PrevMonth} NextClick={NextMonth}
                                CanGoNextMonth={CanGoNextMonth} className="mr-20"
                                style={{ justifyContent: 'flex-end' }}>
                                {MonthYear}
                            </MonthView>
                        </Fragment>
                        :
                        <Fragment>
                            <span className={`font-500 size-6 text-lightgray `}>
                                Today 🖐️
                            </span>
                            <span className={`font-700 size-10 text-black`}>
                                {moment().format('MMM DD, YYYY')}
                            </span>
                        </Fragment>
                    }
                </Fragment>
            }
            {props.Type === "FULL" &&
                <Fragment>
                    <MonthView
                        PrevClick={PrevMonth} NextClick={NextMonth}
                        CanGoNextMonth={CanGoNextMonth} className={window.innerWidth > 550 && "ml-20"}
                        style={{ justifyContent: 'flex-start' }}>
                        {MonthYear}
                    </MonthView>
                    {window.innerWidth > 550 && Permissions.Edit.includes('calender') &&
                        <PrimaryButton className={classes.ActionButton} onClick={props.NewScheduleClickHandler}>
                            <img src="/svg/plus-white.svg" style={{ marginRight: "6px" }} alt="Add" />New Schedule
                        </PrimaryButton>
                    }
                </Fragment>
            }

            <DaysRow
                className={classes.DaysContainer}
                DayInMonth={DayInMonth}
                CurrentDate={CurrentDate}
                DayClickHandler={DayClickHandler} />

            <div className={`${classes.CalenderBody} ${props.Type === "FULL" && classes.CalenderBodyFULL} ${CurrentDateMeetings.length === 0 && classes.Empty} `}>
                {CurrentDateMeetings.length === 0 &&
                    <span className='size-5 text-darkgray font-400'>There is no Event for this Date</span>
                }
                {(CurrentDateMeetings.length !== 0 && window.innerWidth > 550) && CurrentDateMeetings.map(data =>
                    <HourLine
                        Meetings={data.Mettings}
                        HourTitle={data.Period}
                        key={data.Period}
                    />
                )}
                {(CurrentDateMeetings.length !== 0 && window.innerWidth < 550) &&


                    <div style={{
                        display: "grid", gap: "10px",
                        gridTemplateColumns: `${props.Type === "MINI" ? (CurrentDateMeetings.length > 0 ? 'repeat(' + CurrentDateMeetings.length + ',1fr)' : "1fr") : "auto"}`,
                        gridTemplateRows: `${props.Type === "FULL" ? (CurrentDateMeetings.length > 0 ? 'auto auto repeat(' + CurrentDateMeetings.length + ',1fr)' : "1fr") : "auto"}`
                    }}>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <svg width="32" height="3" viewBox="0 0 32 3" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="3" rx="1.5" fill="#E1E2E6"></rect></svg>
                        </div>

                        <div className={`text-black size-7 font-700 mt-15 mb-15`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>Schedules
                            <div className={`text-lightgray font-400 size-3`}>4 Schedule</div>
                        </div>


                        {CurrentDateMeetings.map(metting =>
                            <Event
                                ContainerType={props.Type}
                                Type={metting.Type}
                                Title={metting.Title}
                                DrName={metting.DrName}
                                Time={metting.Time}
                                key={metting.ID}
                                State={metting.State}
                                ID={metting.ID} />
                        )}
                    </div>
                }
            </div>

            <Route path="*/deleteEvent">
                <DeletePopup
                    Title="Remove the schedule"
                    SubTitle="Are you sure you want to delete the schedule?"
                    onClick={RemoveScheduleConfirm}
                    IsLoading={IsRemoving}
                />
            </Route>
            <Route path="*/CancelSchedule">
                <DeletePopup
                    Title="Cancel the schedule"
                    SubTitle="Are you sure you want to cancel this schedule?"
                    onClick={CancelScheduleConfirm}
                    IsLoading={IsRemoving}
                />
            </Route>

            <Route path="*/EditEvent/:id">
                <NewSchedule type="EDIT" />
            </Route>


        </div>
    )
}

export default CalenderView