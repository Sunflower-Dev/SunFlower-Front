
import { useState } from 'react'
import { useHistory } from 'react-router'

import classes from './LogFilter.module.css'
import CheckBox from "../../../../UI/Inputs/CheckBox"
import RadioButton from '../../../../UI/Inputs/RadioButton'
import PrimaryButton from '../../../../UI/Bottons/PrimaryButton'

const LogFilter = () => {
    const history = useHistory()
    const [IsClosing, SetIsClosing] = useState(false)



    const CloseFiltersHandler = () => {
        SetIsClosing(true)

        setTimeout(() => {
            history.goBack();
        }, 300);
    }

    return (
        <div className={`${classes.Container} ${IsClosing && classes.Close}`}>
            {window.innerWidth > 550 &&
                <div className={classes.Header}>
                    <img src="/svg/filter-black.svg" alt="filter" />
                    <span className={`size-14 font-600 text-black ml-8`}>Filters</span>
                    <div></div>
                    <img src="/svg/close.svg" alt="close" onClick={CloseFiltersHandler} />
                </div>
            }

            <div className={classes.Types}>
                <div className={`font-500 ${window.innerWidth > 550 ? "size-8 mt-25" : "size-4 mt-10 mb-4"} text-darkgray`}>Type of changes</div>
                <RadioButton ID="All">All</RadioButton>
                <CheckBox ID="Edit">Edit</CheckBox>
                <CheckBox ID="Note">Add a note</CheckBox>
                <CheckBox ID="Document">Add a document</CheckBox>
            </div>
            <div className={classes.Date}>

            </div>
            <div></div>

            <PrimaryButton>
                <img src='/svg/filter-white.svg' alt="filter" style={{ marginRight: "8px" }} /> Apply Filter
            </PrimaryButton>
        </div>
    )
}

export default LogFilter