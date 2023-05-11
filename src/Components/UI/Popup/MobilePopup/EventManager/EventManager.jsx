import { useState } from "react"
import { useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import { axiosInstance } from "../../../../../axios-global"
import MobilePopup from "../MobilePopup"
import classes from "./EventManager.module.css"
const EventManager = () => {

    const [IsClosing, setIsclosing] = useState(false)

    const history = useHistory()
    const { search } = useLocation()
    const URL = new URLSearchParams(search)

    const Permissions = JSON.parse(useSelector((state) => state.Auth.Admin)).Permissions


    const deletepopupClickHandler = () => {
        setIsclosing(true)
        setTimeout(() => {
            history.goBack();
            setTimeout(() => {
                history.push(history.location.pathname + '/deleteEvent?ID=' + URL.get("ID"))
            }, 10)
        }, 300);
    }
    const EditSchedule = () => {
        setIsclosing(true)
        setTimeout(() => {
            history.goBack();
            setTimeout(() => {
                history.push(history.location.pathname + '/EditEvent/' + URL.get("ID"))
            }, 10)
        }, 300);
    }
    const CancelSchedule = () => {
        setIsclosing(true)
        setTimeout(() => {
            history.goBack();
            setTimeout(() => {
                history.push(history.location.pathname + '/CancelSchedule?ID=' + URL.get("ID"))
            }, 10)
        }, 300);
    }
    const CompleteSchedule = async () => {
        try {
            const call = await axiosInstance.put('/schedules/Complete/' + URL.get("ID"))
            var Response = call.data
            if (Response) {
                history.goBack();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <MobilePopup IsClosing={IsClosing}>
            {Permissions.Delete.includes('calender') &&
                <div className={`${classes.ActionItem} size-4 font-400 text-lightgray`} onClick={deletepopupClickHandler}>
                    <img src="/svg/trash-black.svg" alt="delete" /> <span>Remove Schedule</span>
                </div>
            }
            {Permissions.Edit.includes('calender') &&
                <div className={`${classes.ActionItem} size-4 font-400 text-lightgray`} onClick={EditSchedule}>
                    <img src="/svg/edit-black.svg" alt="edit" /> <span>Schedule Editing</span>
                </div>
            }
            <div className={`${classes.ActionItem} size-4 font-400 text-lightgray`} onClick={CompleteSchedule}>
                <img src="/svg/tick-circle-black.svg" alt="complete" /> <span>Complicated</span>
            </div>
            <div className={`${classes.ActionItem} size-4 font-400 text-lightgray`} onClick={CancelSchedule}>
                <img src="/svg/close-black.svg" alt="cancel" /> <span>canceled</span>
            </div>


        </MobilePopup>
    )
}

export default EventManager