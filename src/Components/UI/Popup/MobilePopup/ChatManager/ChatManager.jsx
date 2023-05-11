import { useState } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import MobilePopup from "../MobilePopup"
import classes from "./ChatManager.module.css"
const ChatManager = () => {

    const [IsClosing, setIsclosing] = useState(false)

    const history = useHistory()

    const deletepopupClickHandler = () => {
        setIsclosing(true)
        setTimeout(() => {
            history.goBack();
            setTimeout(() => {
                history.push(history.location.pathname.replace(/\/Manage/, '') + '/Clear')
            }, 10)
        }, 300);
    }
    const Permissions = JSON.parse(useSelector((state) => state.Auth.Admin)).Permissions


    return (
        <MobilePopup IsClosing={IsClosing}>
            <div className={`${classes.ActionItem} size-4 font-400 text-darkgray`}>
                <img src="/svg/search-black.svg" alt="Search" /> <span>Search</span>
            </div>
            {Permissions.Delete.includes("message") &&
                <div className={`${classes.ActionItem} size-4 font-400 text-darkgray`} onClick={deletepopupClickHandler}>
                    <img src="/svg/Clear-black.svg" alt="delete" /> <span>Clear history</span>
                </div>
            }

        </MobilePopup>
    )
}

export default ChatManager