import classes from './MonthView.module.css'

const MonthView = (props) => {

    return (
        <div className={`${classes.MonthView} ${props.className} ${window.innerWidth > 550 ? "mt-25 text-darkgray" : "text-black"} `} style={props.style}>
            <img src='/svg/arrow-left.svg' width='22px' alt="back" onClick={props.PrevClick} />

            <div className={classes.MonthText}>{props.children}</div>

            <img src='/svg/arrow-right.svg' width='22px' alt="back"
                onClick={props.NextClick}
                className={`${!props.CanGoNextMonth && classes.deactive}`} />
        </div>
    )
}

export default MonthView