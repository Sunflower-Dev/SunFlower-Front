import { useState } from "react"
import { useHistory } from "react-router-dom"
import SecondaryButton from "../../../../../UI/Bottons/SecondaryButton"
import classes from "./DrugDropDown.module.css"

const DrugDropDown = (props) => {
    const [IsOpen, setIsOpen] = useState(false)
    const OpenHandler = () => {
        if (IsOpen) {
            setIsOpen(false)
        } else {
            setIsOpen(true)
        }
    }
    const history = useHistory(0)

    const RemoveMedicineHandler = () => {
        history.push(history.location.pathname + '/DeleteMedicine/' + props.id)
    }

    return (
        <div className={`${classes.Container} ${IsOpen && classes.active}`}>
            <div className={`${classes.Main} ${IsOpen && classes.active}`} onClick={OpenHandler}>
                {window.innerWidth > 550 &&
                    <div className={classes.Counter}>
                        {props.data.Counter}
                    </div>
                }
                <div className={`${classes.Title} font-500 ${window.innerWidth > 550 ? "size-6" : "size-3"} text-darkgray`}>
                    {props.data.Title}
                </div>
                <div className={`${classes.SubTitle} font-400 ${window.innerWidth > 550 ? "size-4" : "size-2"} text-lightgray`}>
                    {props.data.DrName}&nbsp; | &nbsp;{props.data.Date} &nbsp;&nbsp;{props.data.Time}
                </div>
                <SecondaryButton onClick={RemoveMedicineHandler}
                    style={{ width: "42px", height: "42px", borderRadius: "42px", gridRow: '1/3', margin: "auto" }}>
                    <img src="/svg/trash-darkgray.svg" alt="" width={20} />
                </SecondaryButton>
                <div className={`${classes.arrow} ${IsOpen && classes.active}`} >
                    <svg width="18" height="9" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.2602 1.2041L10.2836 7.18077C9.57773 7.8866 8.42273 7.8866 7.7169 7.18077L1.74023 1.2041" stroke={IsOpen ? "#fff" : "#5E5F6E"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                </div>
            </div>

            <div className={`${classes.body} ${IsOpen && classes.active}`}>
                {props.data.Drugs.map(dt =>
                    <div className={`${classes.drug} ${IsOpen && classes.active}`} key={dt._id}>
                        <span className={`font-400 ${window.innerWidth > 550 ? "size-6 text-darkgray" : "size-3 text-lightgray"} `}>{dt.Medication}</span>
                        <span className={`font-400 ${window.innerWidth > 550 ? "size-6" : "size-3"} text-lightgray`}>{dt.Number} Pills</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DrugDropDown