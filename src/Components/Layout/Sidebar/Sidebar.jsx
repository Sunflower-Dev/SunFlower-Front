import { Link, NavLink, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";

import { AuthActions } from "../../../store/index";
import classes from './Sidebar.module.css'
import { useState } from "react";

const Sidebar = () => {
    const dispatch = useDispatch();

    const LogoutClick = () => {
        dispatch(AuthActions.Logout())
    }

    const AdminData = JSON.parse(useSelector((state) => state.Auth.Admin))
    const Permissions = AdminData.Permissions

    return (
        <div className={classes.sidebar}>

            <div className={classes.logo}>
                <img src="/images/logo.png" alt="logo" width="50" />
                <div className={`font-600 size-10`}>
                    <span className="text-yellow">Sun</span>flowers
                </div>
                <div className="text-darkgray font-500 size-3">Support Services</div>
            </div>

            <NavLink to="/Dashboard" className={classes.navItem} activeClassName={classes.active}  >
                <img src="/svg/sidebar/Dashboard-normal.svg" alt="logo" width="24px" className={classes.normal} />
                <img src="/svg/sidebar/Dashboard-active.svg" alt="logo" width="24px" className={classes.active} />
                <span>Dashboard</span>
            </NavLink>

            {(Permissions.View.includes('calender') || Permissions.View.includes('calender-all')) &&
                <NavLink to="/Calender" className={classes.navItem} activeClassName={classes.active} >
                    <img src="/svg/sidebar/Calender-normal.svg" alt="logo" width="24px" className={classes.normal} />
                    <img src="/svg/sidebar/Calender-active.svg" alt="logo" width="24px" className={classes.active} />
                    <span>Calender</span>
                </NavLink>
            }

            {(Permissions.View.includes('client') || Permissions.View.includes('client-all')) &&
                <NavLink to="/Client" className={classes.navItem} activeClassName={classes.active} exact >
                    <img src="/svg/sidebar/Client-normal.svg" alt="logo" width="24px" className={classes.normal} />
                    <img src="/svg/sidebar/Client-active.svg" alt="logo" width="24px" className={classes.active} />
                    <span>Client</span>
                </NavLink>
            }

            {(Permissions.View.includes('staff')) &&
                <NavLink to="/Staff" className={classes.navItem} activeClassName={classes.active} exact >
                    <img src="/svg/sidebar/Staff-normal.svg" alt="logo" width="24px" className={classes.normal} />
                    <img src="/svg/sidebar/Staff-active.svg" alt="logo" width="24px" className={classes.active} />
                    <span>Staff</span>
                </NavLink>
            }

            {(Permissions.View.includes('online-office')) &&
                <NavLink to="/Online-Office" className={classes.navItem} activeClassName={classes.active} exact >
                    <img src="/svg/sidebar/Office-normal.svg" alt="logo" width="24px" className={classes.normal} />
                    <img src="/svg/sidebar/Office-active.svg" alt="logo" width="24px" className={classes.active} />
                    <span>Online Office</span>
                </NavLink>
            }

            {(Permissions.View.includes('course')) &&
                <NavLink to="/Courses" className={classes.navItem} activeClassName={classes.active}  >
                    <img src="/svg/sidebar/Course-normal.svg" alt="logo" width="24px" className={classes.normal} />
                    <img src="/svg/sidebar/Course-active.svg" alt="logo" width="24px" className={classes.active} />
                    <span>Courses</span>
                </NavLink>
            }

            <NavLink to="/Settings" className={classes.navItem} activeClassName={classes.active}  >
                <img src="/svg/sidebar/Setting-normal.svg" alt="logo" width="24px" className={classes.normal} />
                <img src="/svg/sidebar/Setting-active.svg" alt="logo" width="24px" className={classes.active} />
                <span>Settings</span>
            </NavLink>


            <button className={`${classes.navItem} ${classes.Logout}`} onClick={LogoutClick} >
                <img src="/svg/sidebar/Logout.svg" alt="logo" width="24px" />
                <span>Logout</span>
            </button>




        </div>
    )
}

const FloatSideBar = () => {
    const history = useHistory()
    const [IsClosing, setIsClosing] = useState(false)
    const AdminData = JSON.parse(useSelector((state) => state.Auth.Admin))
    const Permissions = JSON.parse(useSelector((state) => state.Auth.Admin)).Permissions

    const SidebarCloseClickHandler = () => {
        setIsClosing(true)
        setTimeout(() => {
            history.goBack()
        }, 300)
    }

    const dispatch = useDispatch();

    const LogoutClick = () => {
        dispatch(AuthActions.Logout())
    }

    const openProfileHandler = () => {
        history.push('/Profile')
    }
    return (
        <div className={`${classes.FloatSideBar} ${IsClosing && classes.active}`} >

            <div className={`${classes.FloatSideBarContainer} ${IsClosing && classes.active}`}>

                <div className={`${classes.FloatHeaderContainer}`} onClick={openProfileHandler}>
                    <img src={`${process.env.REACT_APP_SRC_URL}${AdminData.Avatar}`} alt="logo" width="50px" />
                    <div className={`font-500 size-3 text-darkgray mt-a`}>{AdminData.Name}</div>
                    <div className={`font-400 size-1 text-lightgray`}>Welcome Back</div>
                </div>

                {(Permissions.View.includes('course')) &&
                    <Link to="/Courses" className={classes.FloatItem}>
                        <img src="/svg/sidebar/Course-black.svg" alt="logo" width="24px" className={classes.normal} />
                        <span>Courses</span>
                    </Link>
                }

                {(Permissions.View.includes('notification')) &&
                    <Link to="/Notifications" className={classes.FloatItem}>
                        <img src="/svg/sidebar/Notification-black.svg" alt="logo" width="24px" className={classes.normal} />
                        <span>Notification</span>
                    </Link>
                }

                {(Permissions.View.includes('update') || Permissions.View.includes('update-all')) &&
                    <Link to="/Dashboard/Logs" className={classes.FloatItem}>
                        <img src="/svg/sidebar/Logs-black.svg" alt="logo" width="24px" className={classes.normal} />
                        <span>Logs</span>
                    </Link>
                }


                <Link to="/Settings" className={classes.FloatItem}>
                    <img src="/svg/sidebar/Setting-black.svg" alt="logo" width="24px" className={classes.normal} />
                    <span>Setting</span>
                </Link>


                <div></div>

                <div className={`${classes.FloatItem} ${classes.FloatLogout}`} onClick={LogoutClick}>
                    <img src="/svg/sidebar/Logout-red.svg" alt="logo" width="24px" />
                    <span>Logout</span>
                </div>
            </div>

            <div onClick={SidebarCloseClickHandler}></div>
        </div>
    )
}

export { FloatSideBar }

export default Sidebar