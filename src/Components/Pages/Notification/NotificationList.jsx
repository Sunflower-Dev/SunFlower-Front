import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Route, useHistory } from 'react-router-dom'
import { axiosInstance } from "../../../axios-global"
import { OnlineActions } from "../../../store"
import NotAuthBlur from "../../Layout/NotAuthBlur/NotAuthBlur"
import PrimaryButton from "../../UI/Bottons/PrimaryButton"
import LoadingSpinner from "../../UI/LoadingSpinner"
import NewNotif from "./NewNotif/NewNotif"
import NotifItem from "./Notif/NotifItem"
import classes from "./NotificationList.module.css"

const NotificationList = (props) => {

    const history = useHistory()
    const [Notifs, SetNotifs] = useState(null)
    const [SeenNotifs, SetSeenNotifs] = useState([])
    const dispatch = useDispatch()
    const HaveUnseenNotif = useSelector((state) => state.Online.HaveUnseenNotif)

    const AdminData = JSON.parse(useSelector((state) => state.Auth.Admin))
    const Permissions = AdminData.Permissions

    useEffect(() => {
        (async () => {
            try {
                const call = await axiosInstance.get('/Notifications')
                var response = call.data
                SetNotifs(response.Notifs)
                SetSeenNotifs(response.Seen)
                dispatch(OnlineActions.UpdateUnseenNotif({ HaveUnseenNotif: false }))

            } catch (error) {
                console.log(error);
            }
        })()
    }, [HaveUnseenNotif, dispatch])

    const openAddNotifClickHandler = () => {
        history.push('/Notifications/Add')
    }


    return (
        !Notifs ? <LoadingSpinner /> :
            <>
                <div className={classes.Container}>
                    <div className={classes.Header}>
                        {window.innerWidth > 550 ?
                            <Fragment>

                                <div className={`font-600 size-14 text-black`}>Notification</div>
                                <div className={`font-400 size-6 text-lightgray d-flex items-center gap-20`}>
                                    <div>
                                        <span className={`text-secondaryred`}>{Notifs.length}</span>
                                        <span> unread messages</span>
                                    </div>
                                    {Permissions.Edit.includes('notification') &&
                                        <PrimaryButton style={{ padding: "10px 20px", height: "auto" }} onClick={openAddNotifClickHandler}>
                                            <img src="/svg/plus-white.svg" alt="add" />
                                            Send notification
                                        </PrimaryButton>
                                    }
                                </div>
                            </Fragment>
                            :
                            <div className={`font-700 size-10 text-black`}>
                                <span className={`text-secondaryred`}>{Notifs.length}</span>
                                Unread notifications
                            </div>
                        }
                    </div>

                    <div className={classes.List}>
                        {Notifs.map(item =>
                            <NotifItem
                                key={item._id}
                                data={{
                                    Status: "UNREAD",
                                    Type: item.Type,
                                    Title: item.Title,
                                    Date: item.CreatedAt,
                                    Body: item.Body,
                                    id: item._id
                                }} />
                        )}

                        {SeenNotifs.length > 0 &&
                            <Fragment>

                                <div className={`${classes.Divider} font-500 size-5 text-darkgray mt-25 mb-25`}>
                                    <div>New notifications</div>
                                    <div className={classes.dashed}></div>
                                </div>

                                {SeenNotifs.map(item =>
                                    <NotifItem
                                        key={item._id}
                                        data={{
                                            Status: "READED",
                                            Type: item.Type,
                                            Title: item.Title,
                                            Date: item.CreatedAt,
                                            Body: item.Body,
                                            id: item._id
                                        }} />
                                )}
                            </Fragment>
                        }
                    </div>
                    {Permissions.Edit.includes('notification') &&
                        <Route path="/Notifications/Add">
                            <NewNotif />
                        </Route>
                    }

                </div>
                {!Permissions.View.includes('notification') &&
                    <NotAuthBlur>
                        you have not permitted to access notifications! please contact administator
                    </NotAuthBlur>
                }
            </>
    )
}

export default NotificationList