import { useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import MobilePopup from "../MobilePopup"
import classes from "./StaffManager.module.css"
const StaffManager = () => {

    const [IsClosing, setIsclosing] = useState(false)

    const history = useHistory()
    const { id } = useParams()

    const deletepopupClickHandler = () => {
        setIsclosing(true)
        setTimeout(() => {
            history.replace("/Staff/" + id + '/Detail/Delete')
        }, 300);
    }
    const EditMemberClickHandler = () => {
        setIsclosing(true)
        setTimeout(() => {
            history.replace("/Staff/" + id + '/Detail')
        }, 300);
    }
    const MessageClickHandler = () => {
        setIsclosing(true)
        setTimeout(() => {
            history.replace("/Messages/" + id)
        }, 300);
    }

    return (
        <MobilePopup IsClosing={IsClosing}>
            <div className={`${classes.ActionItem} size-4 font-400 text-lightgray`} onClick={MessageClickHandler}>
                <img src="/svg/message-black.svg" alt="Message" width={24} /> <span>Message</span>
            </div>
            <div className={`${classes.ActionItem} size-4 font-400 text-lightgray`} onClick={EditMemberClickHandler}>
                <img src="/svg/edit-black.svg" alt="cancel" width={24} /> <span>View member</span>
            </div>

            <div className={`${classes.ActionItem} size-4 font-400 text-lightgray`} onClick={deletepopupClickHandler}>
                <img src="/svg/trash-black.svg" alt="delete" width={24} /> <span>Delete member</span>
            </div>

        </MobilePopup>
    )
}

export default StaffManager