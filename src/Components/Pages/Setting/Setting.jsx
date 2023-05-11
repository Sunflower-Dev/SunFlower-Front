
import { Fragment } from 'react'
import { NavLink, Route, useHistory } from 'react-router-dom'
import LeftIconInput from '../../UI/Inputs/LeftIconInput'
import classes from './Setting.module.css'
import { ChangePasswordSetting, UpdatePermissions, MoreSetting } from './SettingItem'


const Setting = () => {
    const history = useHistory()
    const BackClickHandler = () => {
        history.goBack();
    }
    return (
        <div className={classes.Container}>
            {window.innerWidth < 550 &&
                <header>
                    <div className={classes.MiniHeader_TitleMode}>
                        <img src="/svg/arrow-left.svg" alt="back" onClick={BackClickHandler} />
                        <div className={`font-600 size-7 text-black`}>
                            Settings
                        </div>
                        <img src="/svg/Search-black.svg" alt="back" />
                    </div>

                </header>
            }
            <div className={`${classes.Card}`} style={{ marginBottom: window.innerWidth <= 550 && "30px" }}>
                {window.innerWidth > 550 &&
                    <LeftIconInput
                        icon="search"
                        type="text"
                        placeholder="search..."
                        style={{ height: "52px" }}
                    />
                }
                <NavLink to="/Settings/Password" className={`${classes.navItem} ${classes.password}`} activeClassName={classes.active}  >
                    <svg width={22} height={22} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.1408 13.6855C16.2525 15.5646 13.5483 16.1421 11.1741 15.3996L6.85664 19.708C6.54497 20.0288 5.9308 20.2213 5.4908 20.1571L3.49247 19.8821C2.83247 19.7905 2.2183 19.1671 2.11747 18.5071L1.84247 16.5088C1.7783 16.0688 1.98914 15.4546 2.29164 15.143L6.59997 10.8346C5.86664 8.4513 6.43497 5.74714 8.3233 3.86797C11.0275 1.1638 15.4183 1.1638 18.1316 3.86797C20.845 6.57214 20.845 10.9813 18.1408 13.6855Z" stroke="#9899A2" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.3158 16.0332L8.42413 18.1415" stroke="#9899A2" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.2916 10.084C14.051 10.084 14.6666 9.46838 14.6666 8.70898C14.6666 7.94959 14.051 7.33398 13.2916 7.33398C12.5322 7.33398 11.9166 7.94959 11.9166 8.70898C11.9166 9.46838 12.5322 10.084 13.2916 10.084Z" stroke="#9899A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>password</span>
                    {window.innerWidth < 550 &&
                        <img src='/svg/arrow-right.svg' alt='item' width={18} />
                    }
                </NavLink>

                <NavLink to="/Settings/UpdatePermissions" className={`${classes.navItem} ${classes.Notifs}`} activeClassName={classes.active}  >
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.44 8.90002C20.04 9.21002 21.51 11.06 21.51 15.11V15.24C21.51 19.71 19.72 21.5 15.25 21.5H8.74001C4.27001 21.5 2.48001 19.71 2.48001 15.24V15.11C2.48001 11.09 3.93001 9.24002 7.47001 8.91002" stroke="#9899A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 2V14.88" stroke="#9899A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15.35 12.65L12 16L8.64999 12.65" stroke="#9899A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Update Permissions</span>
                    {window.innerWidth < 550 &&
                        <img src='/svg/arrow-right.svg' alt='item' width={18} />
                    }
                </NavLink>

                <NavLink to="/Settings/More" className={`${classes.navItem} ${classes.More}`} activeClassName={classes.active}  >
                    <svg width={22} height={22} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.1666 5.95898H14.6666" stroke="#9899A2" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.50004 5.95898H1.83337" stroke="#9899A2" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.16671 9.16667C10.9386 9.16667 12.375 7.73025 12.375 5.95833C12.375 4.18642 10.9386 2.75 9.16671 2.75C7.39479 2.75 5.95837 4.18642 5.95837 5.95833C5.95837 7.73025 7.39479 9.16667 9.16671 9.16667Z" stroke="#9899A2" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.1667 16.041H16.5" stroke="#9899A2" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.33337 16.041H1.83337" stroke="#9899A2" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.8333 19.2507C14.6052 19.2507 16.0417 17.8142 16.0417 16.0423C16.0417 14.2704 14.6052 12.834 12.8333 12.834C11.0614 12.834 9.625 14.2704 9.625 16.0423C9.625 17.8142 11.0614 19.2507 12.8333 19.2507Z" stroke="#9899A2" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <span>More settings</span>
                    {window.innerWidth < 550 &&
                        <img src='/svg/arrow-right.svg' alt='item' width={18} />
                    }
                </NavLink>
            </div>
            {window.innerWidth > 550 &&
                <Fragment>
                    <Route path="/Settings/Password">
                        <ChangePasswordSetting />
                    </Route>

                    <Route path="/Settings/UpdatePermissions">
                        <UpdatePermissions />
                    </Route>

                    <Route path="/Settings/More">
                        <MoreSetting />
                    </Route>
                </Fragment>
            }
        </div>
    )
}

export default Setting