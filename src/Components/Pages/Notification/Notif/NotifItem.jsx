import moment from 'moment'
import { useHistory } from 'react-router'
import classes from './NotifItem.module.css'

const NotifItem = (props) => {
    var history = useHistory()


    const OnItemClickHandler = () => {
        history.push('/Notifications/item/' + props.data.id)
    }

    return (
        <div className={`${classes.row} ${props.data.Status === "READED" && classes.readed}`} onClick={OnItemClickHandler}>
            <img src={`/svg/Notifs/${props.data.Type}.svg`} alt="NotifType" />
            <div className={`${classes.Title} font-500 ${window.innerWidth > 550 ? "size-6" : "size-3"} text-darkgray`}>
                {window.innerWidth > 550 ? props.data.Title : <div>{props.data.Title}</div>}
                {window.innerWidth < 550 &&
                    <span className={`size-1 text-lightgray`}>{moment(new Date(props.data.Date)).format('MMM DD')}</span>
                }
            </div>
            {window.innerWidth > 550 &&
                <div className={`${classes.Date} font-400 size-4 text-lightgray`}>
                    <span>{moment(new Date(props.data.Date)).format('MMMM DD, YYYY')} &nbsp;|&nbsp;&nbsp;</span>
                    <span className={`${props.data.Status === "READED" ? 'text-lightgray' : 'text-secondaryred'}`}>
                        {props.data.Status === "READED" ? "Read" : "Unread"}
                    </span>
                </div>
            }

            <div className={`${classes.Body} font-400 ${window.innerWidth > 550 ? "size-5" : "size-1"} text-lightgray`}>
                {props.data.Body}
            </div>

            {window.innerWidth > 550 &&
                <div className={classes.arrow}>
                    <svg width="18" height="9" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.2602 1.2041L10.2836 7.18077C9.57773 7.8866 8.42273 7.8866 7.7169 7.18077L1.74023 1.2041" stroke="#5E5F6E" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round">
                        </path>
                    </svg>
                </div>
            }


        </div>
    );
}

export default NotifItem;