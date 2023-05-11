
import classes from './Header.module.css'
import SecondaryButton from '../../UI/Bottons/SecondaryButton';
import { useHistory, useLocation } from 'react-router';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';

const Header = (props) => {
    const AdminData = JSON.parse(useSelector((state) => state.Auth.Admin))
    const HaveUnseenMessage = useSelector((state) => state.Online.HaveUnseenMessage)
    const HaveUnseenNotif = useSelector((state) => state.Online.HaveUnseenNotif)

    const history = useHistory();
    const location = useLocation();

    const BackHandler = () => {
        history.goBack();
    }

    const OpenNotificationHandler = () => {
        history.push('/Notifications')
    }
    const openProfileHandler = () => {
        history.push('/Profile')
    }
    const openMessagesHandler = () => {
        history.push('/Messages')
    }
    const openFloatSidebar = () => {
        if (location.pathname === '/Dashboard') {
            history.push('/Dashboard/Sidebar')
        }
        if (location.pathname === '/Dashboard/Logs') {
            history.push('/Dashboard/Logs/filter')
        }
    }

    return (
        <Fragment>
            {window.innerWidth > 550 ?
                <header className={classes.header}>

                    {location.pathname === '/Dashboard' &&
                        <div className={`size-22 font-700 text-black ${classes.header_title}`}>Dashboard</div>
                    }
                    {(location.pathname === '/Dashboard/Logs' || location.pathname === '/Calender'
                        || location.pathname === '/Calender/NewSchedule' || location.pathname.includes('/Client/')) &&
                        <SecondaryButton className={`${classes.header_title}`} onClick={BackHandler}>
                            <img src="/svg/arrow-long-left.svg" style={{ marginRight: "8px" }} alt="back" /> Back to home
                        </SecondaryButton>
                    }
                    {(location.pathname.includes('/Notifications/') || location.pathname === "/Notifications"
                        || location.pathname === "/Profile" || location.pathname === "/Messages" ||
                        location.pathname.includes("/Messages/")) &&
                        <SecondaryButton className={`${classes.header_title}`} onClick={BackHandler}>
                            <img src="/svg/arrow-long-left.svg" style={{ marginRight: "8px" }} alt="back" /> Back
                        </SecondaryButton>
                    }
                    {(location.pathname === "/Client-Add") &&
                        <SecondaryButton className={`${classes.header_title}`} onClick={BackHandler}>
                            <img src="/svg/cross.svg" style={{ marginRight: "8px" }} alt="back" /> cancel
                        </SecondaryButton>
                    }
                    {location.pathname === '/Dashboard/Logs/Filter' &&
                        <SecondaryButton className={`${classes.header_title}`} onClick={BackHandler}>
                            <img src="/svg/close.svg" style={{ marginRight: "8px", width: "22px" }} alt="back" /> Close Filters
                        </SecondaryButton>
                    }

                    {location.pathname === '/Client' &&
                        <div className={`size-22 font-700 text-black ${classes.header_title}`}>Client</div>
                    }

                    <button className={classes.Message_container} onClick={openMessagesHandler}>
                        <img src="/svg/Message-ic.svg" alt="Messages" />
                        {HaveUnseenMessage &&
                            <div className={classes.NotifCircle}></div>}
                    </button>
                    <button className={classes.Notif_container} onClick={OpenNotificationHandler} >
                        <img src="/svg/Notif-ic.svg" alt="Notification Center" />
                        {HaveUnseenNotif &&
                            <div className={classes.NotifCircle}></div>}
                    </button>

                    <div className={classes.Profile_container} onClick={openProfileHandler}>
                        <img src={`${process.env.REACT_APP_SRC_URL}${AdminData.Avatar}`} alt="Profile Icon" />
                        <div className={classes.Name}>{AdminData.Name}</div>
                        <div className={classes.Welcome}>Welcome back</div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.92 8.94995L13.4 15.47C12.63 16.24 11.37 16.24 10.6 15.47L4.07999 8.94995" stroke="#5E5F6E" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                    </div>

                </header>

                :
                <Fragment>
                    {(location.pathname === '/Dashboard' || location.pathname === '/Dashboard/Sidebar'
                        || location.pathname === '/Dashboard/EventManager' || location.pathname.includes('/Dashboard/deleteEvent')
                        || location.pathname === '/Calender' || location.pathname === '/Calender/EventManager'
                        || location.pathname === "/Calender/deleteEvent") &&
                        <header>
                            <div className={classes.MiniHeader3}>
                                <div className="font-500 size-8"><span className="text-yellow">Sun</span>flowers</div>
                                <div></div>
                                <button className={classes.Message_container} onClick={openMessagesHandler}>
                                    <img src="/svg/Message-ic.svg" alt="Messages" />
                                </button>
                                <button className={classes.hamburger} onClick={openFloatSidebar}>
                                    <img src="/svg/Mobile-hamburger.svg" alt="Messages" />
                                </button>
                            </div>
                        </header>
                    }
                    {(location.pathname === '/Dashboard/Logs') &&
                        <header>
                            <div className={classes.MiniHeader_TitleMode} style={{ alignItems: "center" }}>
                                <img src="/svg/arrow-left.svg" alt="back" onClick={BackHandler} />
                                <div className={`font-600 size-7 text-black`}>
                                    Latest client updates
                                </div>
                                <button className={classes.hamburger} onClick={openFloatSidebar}>
                                    <img src="/svg/filter-black.svg" alt="filter" width={24} />
                                </button>
                            </div>
                        </header>
                    }

                    {(location.pathname === '/Notifications' || location.pathname === "/Settings/Password"
                        || location.pathname === '/Settings/Notification' || location.pathname === '/Settings/More'
                        || location.pathname === "/Profile" || location.pathname === '/Dashboard/Logs/filter'
                        || location.pathname === '/Client-Add' || location.pathname === '/Staff-Add' ||
                        location.pathname.includes('Courses/Setting/EditLesson') || location.pathname.endsWith('AddTrainnig')
                        || location.pathname === '/Courses/Setting' || location.pathname.endsWith('EditExam')) &&
                        <header>
                            <div className={classes.MiniHeader_TitleMode} >
                                <img src="/svg/arrow-left.svg" alt="back" onClick={BackHandler} />
                                <div className={`font-600 size-7 text-black`}>
                                    {location.pathname === '/Notifications' && "Notification"}
                                    {location.pathname === '/Settings/Password' && "password"}
                                    {location.pathname === '/Settings/Notification' && "Notification settings"}
                                    {location.pathname === '/Settings/More' && "More settings"}
                                    {location.pathname === '/Profile' && "Profile"}
                                    {location.pathname === '/Dashboard/Logs/filter' && "Filters"}
                                    {location.pathname === '/Client-Add' && "Add a client"}
                                    {location.pathname === '/Staff-Add' && "Add a Staff"}
                                    {location.pathname.includes('Courses/Setting/EditLesson') && "Edit training"}
                                    {location.pathname.endsWith('AddTrainnig') && "Add a training"}
                                    {location.pathname === '/Courses/Setting' && "Course settings"}
                                    {location.pathname.endsWith('EditExam') && "Edit course questions"}
                                </div>
                                <div style={{ width: "24px" }}></div>
                            </div>

                        </header>
                    }
                    {(location.pathname.includes('/Client') && location.pathname.endsWith('/Edit')) &&
                        <header>
                            <div className={classes.MiniHeader_TitleMode} style={{ alignItems: "center" }}>
                                <img src="/svg/cross.svg" alt="back" onClick={BackHandler} width={24} />
                                <div className={`font-600 size-7 text-black`}>
                                    Edit client profile
                                </div>
                                <div style={{ width: "24px" }}></div>
                            </div>

                        </header>
                    }

                    {(location.pathname.includes('/Client') || location.pathname.includes('/Message')) &&
                        <header></header>
                    }
                </Fragment>
            }
        </Fragment >
    )
}

export default Header