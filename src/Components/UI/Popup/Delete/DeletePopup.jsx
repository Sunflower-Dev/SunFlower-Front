import classes from "./DeletePopup.module.css"

import Popup from "../Popup"
import SecondaryButton from "../../Bottons/SecondaryButton"
import PrimaryButton from "../../Bottons/PrimaryButton"
import { useHistory } from "react-router"
import { useState } from "react"
import MobilePopup from "../MobilePopup/MobilePopup"



const DeletePopup = (props) => {
    const history = useHistory();

    const [IsClosing, setIsClosing] = useState(false)

    const closePopupHandler = () => {
        setIsClosing(true)
        setTimeout(() => {
            history.goBack();
        }, 300)
    }

    return (
        window.innerWidth > 550 ?
            <Popup IsClosing={IsClosing} style={{ borderRadius: `${props.Type === "CLEAR" ? '15px' : "0"}` }}>
                <div className={classes.Container}>
                    {/* TODO - FIX Vector SIZE */}
                    {props.Type === 'CLEAR' ?
                        <img src="/svg/vector/clear-150.svg" width="150px" alt="delete" />
                        :
                        <img src="/svg/vector/delete-150.svg" width="150px" alt="delete" />
                    }
                    <div className={`text-black font-600 size-14 ${classes.Title}`}>{props.Title}</div>
                    <div className={`text-lightgray font-400 size-6 ${classes.SubTitle}`}>{props.SubTitle}</div>
                    <SecondaryButton className={classes.cancelButton} onClick={closePopupHandler} >
                        No, hold it
                    </SecondaryButton>

                    <PrimaryButton className={classes.deleteButton} IsLoading={props.IsLoading} onClick={props.onClick}>
                        Yes
                    </PrimaryButton>
                </div>
            </Popup>

            :
            <MobilePopup IsClosing={IsClosing}>
                <div className={classes.Container}>

                    {props.Type === 'CLEAR' ?
                        <img src="/svg/vector/clear-150.svg" width="70px" alt="delete" />
                        :
                        <img src="/svg/vector/delete-150.svg" width="70px" alt="delete" />
                    }
                    <div className={`text-black font-600 size-7 ${classes.Title}`}>{props.Title}</div>
                    <div className={`text-lightgray font-400 size-3 ${classes.SubTitle}`}>{props.SubTitle}</div>
                    <SecondaryButton className={classes.cancelButton} onClick={closePopupHandler} >
                        No, hold it
                    </SecondaryButton>

                    <PrimaryButton className={classes.deleteButton} IsLoading={props.IsLoading} onClick={props.onClick}>
                        Yes

                    </PrimaryButton>
                </div>
            </MobilePopup>

    )
}

export default DeletePopup