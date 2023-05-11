import { useState } from "react";

import classes from "./DaysRow.module.css";
import moment from "moment";

const DaysRow = (props) => {

    const [isInit, SetIsInit] = useState(true)

    const OnDayScroll = (event) => {
        // const delta = Math.max(-1, Math.min(1, (event.nativeEvent.wheelDelta || -event.nativeEvent.detail)))
        // event.currentTarget.scrollLeft -= (delta * 25)
    }

    const onClick = (e, i) => {
        props.DayClickHandler(e, i)

        var elems = document.querySelectorAll(".Day");

        [].forEach.call(elems, function (el) {
            el.classList.remove(classes.Active);
        });
        e.currentTarget.classList.add(classes.Active)
    }

    var Days = []
    for (let i = 0; i < props.DayInMonth; i++) {
        Days.push(<div onClick={(e) => onClick(e, i + 1)} className={`${classes.Day} Day
        ${props.CurrentDate.format(`MMMM \xa0\xa0 YYYY`) === moment().format(`MMMM \xa0\xa0 YYYY`) && (i + 1 === +moment().format('D')) && classes.Active + ' Today'}`} key={i + 1}>
            <span>{i + 1}</span>
            <div>{moment(props.CurrentDate.format('YYYYMM') + (i + 1 < 9 ? '0' + (i + 1) : (i + 1))).format('ddd')}</div>
        </div>)
    }


    setTimeout(() => {
        if (isInit) {
            SetIsInit(false)
            if (+moment().format('D') > 6 && +moment().format('D') < 25) {
                if (window.innerWidth > 550) {
                    document.getElementsByClassName('DaysScroll')[0].scrollLeft = +moment().format('D') * 60
                }
                else {
                    document.getElementsByClassName('DaysScroll')[0].scrollLeft = +moment().format('D') * 42
                }
            }
            else {
                if (+moment().format('D') >= 25) {
                    if (window.innerWidth > 550) {
                        document.getElementsByClassName('DaysScroll')[0].scrollLeft = 28 * 60
                    }
                    else {
                        document.getElementsByClassName('DaysScroll')[0].scrollLeft = +moment().format('D') * 42
                    }
                }
            }
        }

    }, 10)


    return (
        <div className={`${classes.DaysContainer} ${props.className}`}>
            {window.innerWidth > 550 &&
                <div className={classes.leftShoadow}></div>
            }
            <div className={`${classes.DaysScroll} DaysScroll`}
                style={{
                    gridTemplateColumns: `${window.innerWidth > 550 ? '85px repeat(' + (props.DayInMonth - 2) + ',65px) 85px' :
                        'repeat(' + (props.DayInMonth) + ',44px)'}`
                }}
                onWheel={OnDayScroll}>
                {Days}
            </div>
            {window.innerWidth > 550 &&
                <div className={classes.rightShadow}></div>
            }
        </div>
    )
}

export default DaysRow