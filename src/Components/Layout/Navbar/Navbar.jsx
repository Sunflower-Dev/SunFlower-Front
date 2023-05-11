import classes from './Navbar.module.css'
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';

const Navbar = () => {
    const location = useLocation()
    const Permissions = JSON.parse(useSelector((state) => state.Auth.Admin)).Permissions

    return (
        !(location.pathname.includes('/Messages') || location.pathname === '/Client-Add'
            || location.pathname === '/Staff-Add' || (location.pathname.includes('/Client') && location.pathname.includes('/Edit'))
            || (location.pathname.includes('/Client') && location.pathname.includes('/AddNote'))
            || (location.pathname.includes('/Client') && location.pathname.includes('/AddDocument'))
            || (location.pathname.includes('/Client') && location.pathname.includes('/NoteItem'))
            || location.pathname.endsWith('AddTrainnig') || location.pathname.includes('Courses/Setting/EditLesson')
            || location.pathname.startsWith("/Courses") || location.pathname.includes('TakeExam')
            || location.pathname.includes('ExamPassed') || location.pathname === '/Online-Office/AddService'
            || location.pathname.includes('/Online-Office/Service/') || location.pathname.includes('Certificate')) &&
        <nav className={classes.nav}>
            <NavLink to="/Dashboard" className={classes.navItem} activeClassName={classes.active} >
                <svg width="26" height="2" viewBox="0 0 26 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H26C26 1.10457 25.1046 2 24 2H2C0.89543 2 0 1.10457 0 0Z" fill="#F58986" />
                </svg>

                <img src="/svg/sidebar/Dashboard-normal.svg" alt="logo" width="24px" className={classes.normal} />
                <img src="/svg/sidebar/Dashboard-active.svg" alt="logo" width="24px" className={classes.active} />

                <span>Dashboard</span>
            </NavLink>

            {(Permissions.View.includes('calender') || Permissions.View.includes('calender-all')) &&
                <NavLink to="Calender" className={classes.navItem} activeClassName={classes.active} exact >
                    <svg width="26" height="2" viewBox="0 0 26 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H26C26 1.10457 25.1046 2 24 2H2C0.89543 2 0 1.10457 0 0Z" fill="#F58986" />
                    </svg>

                    <img src="/svg/sidebar/Calender-normal.svg" alt="logo" width="24px" className={classes.normal} />
                    <img src="/svg/sidebar/Calender-active.svg" alt="logo" width="24px" className={classes.active} />
                    <span>Calender</span>
                </NavLink>
            }

            {(Permissions.View.includes('client') || Permissions.View.includes('client-all')) &&
                <NavLink to="/Client" className={classes.navItem} activeClassName={classes.active} >
                    <svg width="26" height="2" viewBox="0 0 26 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H26C26 1.10457 25.1046 2 24 2H2C0.89543 2 0 1.10457 0 0Z" fill="#F58986" />
                    </svg>

                    <img src="/svg/sidebar/Client-normal.svg" alt="logo" width="24px" className={classes.normal} />
                    <img src="/svg/sidebar/Client-active.svg" alt="logo" width="24px" className={classes.active} />
                    <span>Client</span>
                </NavLink>
            }

            {Permissions.View.includes('staff') &&
                <NavLink to="/Staff" className={classes.navItem} activeClassName={classes.active} >
                    <svg width="26" height="2" viewBox="0 0 26 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H26C26 1.10457 25.1046 2 24 2H2C0.89543 2 0 1.10457 0 0Z" fill="#F58986" />
                    </svg>

                    <img src="/svg/sidebar/Staff-normal.svg" alt="logo" width="24px" className={classes.normal} />
                    <img src="/svg/sidebar/Staff-active.svg" alt="logo" width="24px" className={classes.active} />
                    <span>Staff</span>
                </NavLink>
            }

            {Permissions.View.includes('online-office') ?
                <NavLink to="/online-office" className={classes.navItem} activeClassName={classes.active} >
                    <svg width="26" height="2" viewBox="0 0 26 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H26C26 1.10457 25.1046 2 24 2H2C0.89543 2 0 1.10457 0 0Z" fill="#F58986" />
                    </svg>

                    <img src="/svg/sidebar/Office-normal.svg" alt="logo" width="24px" className={classes.normal} />
                    <img src="/svg/sidebar/Office-active.svg" alt="logo" width="24px" className={classes.active} />
                    <span>Online Office</span>
                </NavLink>
                :
                <NavLink to="/Settings" className={classes.navItem} activeClassName={classes.active} >
                    <svg width="26" height="2" viewBox="0 0 26 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H26C26 1.10457 25.1046 2 24 2H2C0.89543 2 0 1.10457 0 0Z" fill="#F58986" />
                    </svg>

                    <img src="/svg/sidebar/Setting-normal.svg" alt="logo" width="24px" className={classes.normal} />
                    <img src="/svg/sidebar/Setting-active.svg" alt="logo" width="24px" className={classes.active} />
                    <span>Settings</span>
                </NavLink>
            }

        </nav>
    )
}

export default Navbar