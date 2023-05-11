import moment from "moment"
import { Fragment } from "react"
import SecondaryButton from "../../UI/Bottons/SecondaryButton"
import classes from "./Log.module.css"

const Log = (props) => {
    return (
        <div className={`${classes.Item} ${window.innerWidth > 550 && (props.size === 'FULL' ? classes.Full : classes.Mini)}`}>
            <img width="45px" height={45} src={`${process.env.REACT_APP_SRC_URL}${props.data.Admin?.Avatar ?? "/Uploads/Admin/profile-placeholder.svg"}`} alt="avatar" />
            <div className={`font-400 text-lightgray ${window.innerWidth > 550 ? "size-6" : "size-1"} ${classes.Name}`}>{props.data.Admin?.Name ?? "Deleted Staff"}</div>
            <div className={`font-400 text-lightgray ${window.innerWidth > 550 ? "size-6" : "size-1"} ${classes.Date}`}>{moment(props.data.CreatedAt).format('DD/MM/YYYY \xa0\xa0 hh:mmA')}</div>
            <div className={`${window.innerWidth > 550 ? "font-400 size-6 text-lightgray" : "font-500 size-3 text-darkgray"} ${classes.Change}`}>
                {props.data.Type === 'EDIT' &&
                    <Fragment>
                        Edit < span className="font-500">{props.data.Client.Name}'s</span> {props.data.Change}
                    </Fragment>
                }
                {props.data.Type === 'ADD' &&
                    <Fragment>
                        Add {props.data.Change} for <span className="font-500">{props.data.Client.Name}</span>
                    </Fragment>
                }
            </div>

            {
                (props.type === 'FULL' || props.type === 'MINI') && window.innerWidth > 550 &&
                <SecondaryButton style={{ height: '41px', padding: '0 20px' }} className={classes.button}>
                    View file
                </SecondaryButton>
            }
        </div >
    )
}



export default Log
