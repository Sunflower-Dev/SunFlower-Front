import { useHistory } from 'react-router-dom'
import classes from './ReportItem.module.css'

const ReportItem = (props) => {

    const history = useHistory()

    const SeeReportClickHandler = () => {
        history.push(history.location.pathname + "/Report/" + props.data.id)
    }

    return (
        <div className={`${classes.Item}`} onClick={() => window.innerWidth < 550 && SeeReportClickHandler()}>
            <img alt="alert" src="/svg/report.svg" />
            <div className={`font-500 ${window.innerWidth > 550 ? "size-8" : "size-3"} text-darkgray`}>{props.data.Name}</div>
            <div className={`font-400 ${window.innerWidth > 550 ? "size-4" : "size-1"} text-lightgray ${classes.Date}`}>{props.data.Date}</div>
            {window.innerWidth > 550 &&
                <div className={classes.eye} onClick={() => window.innerWidth > 550 && SeeReportClickHandler()}>
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.6322 10.4997C13.6322 12.2322 12.2322 13.6322 10.4997 13.6322C8.76719 13.6322 7.36719 12.2322 7.36719 10.4997C7.36719 8.76719 8.76719 7.36719 10.4997 7.36719C12.2322 7.36719 13.6322 8.76719 13.6322 10.4997Z" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.4994 17.7361C13.5881 17.7361 16.4669 15.9161 18.4706 12.7661C19.2581 11.5324 19.2581 9.45863 18.4706 8.22488C16.4669 5.07488 13.5881 3.25488 10.4994 3.25488C7.41062 3.25488 4.53187 5.07488 2.52812 8.22488C1.74062 9.45863 1.74062 11.5324 2.52812 12.7661C4.53187 15.9161 7.41062 17.7361 10.4994 17.7361Z" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                </div>
            }
        </div>
    )
}

export default ReportItem