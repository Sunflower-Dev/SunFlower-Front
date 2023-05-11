import { useState } from "react";

import classes from './input.module.css'
const PasswordInput = (props) => {

    const [IsPasswordVisible, SetIsPasswordVisible] = useState(false)

    const EYEActive = IsPasswordVisible ? "" : classes.active
    const DashedEYEActive = IsPasswordVisible ? classes.active : ''

    const ToggleVisible = () => {
        if (IsPasswordVisible) {
            SetIsPasswordVisible(false)
        }
        if (!IsPasswordVisible) {
            SetIsPasswordVisible(true)
        }
    }


    return (
        <div className={`${props.className} ${classes.inputContainer}`}>
            <label className={classes.label}>{props.label ? props.label : "Password"}</label>
            <input
                type={!IsPasswordVisible ? "password" : "text"}
                placeholder="Enter your password"
                className={`${classes.input} pl-60`}
                name={props.name}
                onChange={props.onChange} />

            <svg className={classes.svg} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 9.16666V7.33333C5.5 4.29917 6.41667 1.83333 11 1.83333C15.5833 1.83333 16.5 4.29917 16.5 7.33333V9.16666" stroke="#9899A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.9999 16.9583C12.2656 16.9583 13.2916 15.9323 13.2916 14.6667C13.2916 13.401 12.2656 12.375 10.9999 12.375C9.73427 12.375 8.70825 13.401 8.70825 14.6667C8.70825 15.9323 9.73427 16.9583 10.9999 16.9583Z" stroke="#9899A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.5833 20.1667H6.41659C2.74992 20.1667 1.83325 19.25 1.83325 15.5833V13.75C1.83325 10.0833 2.74992 9.16666 6.41659 9.16666H15.5833C19.2499 9.16666 20.1666 10.0833 20.1666 13.75V15.5833C20.1666 19.25 19.2499 20.1667 15.5833 20.1667Z" stroke="#9899A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <svg onClick={ToggleVisible} className={`${classes.eye} ${EYEActive}`} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.2816 11C14.2816 12.815 12.8149 14.2817 10.9999 14.2817C9.18493 14.2817 7.71826 12.815 7.71826 11C7.71826 9.185 9.18493 7.71833 10.9999 7.71833C12.8149 7.71833 14.2816 9.185 14.2816 11Z" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.0001 18.5808C14.2359 18.5808 17.2518 16.6742 19.3509 13.3742C20.1759 12.0817 20.1759 9.90917 19.3509 8.61667C17.2518 5.31667 14.2359 3.41 11.0001 3.41C7.76427 3.41 4.74843 5.31667 2.64927 8.61667C1.82427 9.90917 1.82427 12.0817 2.64927 13.3742C4.74843 16.6742 7.76427 18.5808 11.0001 18.5808Z" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <svg onClick={ToggleVisible} className={`${classes.eye} ${DashedEYEActive}`} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3192 8.68088L8.68083 13.3192C8.085 12.7234 7.71833 11.9075 7.71833 11.0001C7.71833 9.18505 9.185 7.71838 11 7.71838C11.9075 7.71838 12.7233 8.08505 13.3192 8.68088Z" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.335 5.28919C14.7308 4.07919 12.8975 3.41919 11 3.41919C7.76417 3.41919 4.74833 5.32586 2.64917 8.62586C1.82417 9.91835 1.82417 12.0909 2.64917 13.3834C3.37333 14.52 4.21667 15.5009 5.13333 16.2892" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.71833 17.9025C8.76333 18.3425 9.8725 18.5808 11 18.5808C14.2358 18.5808 17.2517 16.6742 19.3508 13.3742C20.1758 12.0817 20.1758 9.90917 19.3508 8.61666C19.0483 8.14 18.7183 7.69083 18.3792 7.26917" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.2175 11.6417C13.9792 12.9342 12.925 13.9884 11.6325 14.2267" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.68083 13.3192L1.83333 20.1667" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.1667 1.83337L13.3192 8.68087" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {props.ErrorText &&
                <div className={`${classes.error}`}>
                    <img src="/svg/danger-ic.svg" alt="error" />
                    <span className="font-400 size-4">{props.ErrorText}</span>
                </div>
            }
        </div>
    )
}

export default PasswordInput