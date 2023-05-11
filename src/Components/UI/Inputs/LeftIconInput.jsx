
import { forwardRef, Fragment } from 'react'
import classes from './input.module.css'
const LeftIconInput = forwardRef((props, ref) => {

    return (
        <div className={`${props.className} ${classes.inputContainer} `}>

            {props.icon !== "search" &&
                <label className={classes.label}>{props.label}</label>
            }
            <input
                type={props.type}
                onFocus={props.onFocus}
                className={`${props.ErrorText && classes.haveError} ${classes.input} ${props.icon === "search" ? 'pl-66' : 'pl-60'}`}
                placeholder={props.placeholder}
                style={props.style}
                name={props.name}
                ref={ref}
                autoComplete={props.autoComplete ? props.autoComplete : "on"}
                onChange={props.onChange} />

            {props.icon === "user" &&
                <svg className={classes.svg} width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 11.5C13.5313 11.5 15.5833 9.44798 15.5833 6.91668C15.5833 4.38537 13.5313 2.33334 11 2.33334C8.46865 2.33334 6.41663 4.38537 6.41663 6.91668C6.41663 9.44798 8.46865 11.5 11 11.5Z" stroke="#9899A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.8742 20.6667C18.8742 17.1192 15.345 14.25 11 14.25C6.65502 14.25 3.12585 17.1192 3.12585 20.6667" stroke="#9899A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            }
            {props.icon === "search" &&
                <Fragment>

                    <svg className={classes.searchsvg} style={props.IconStyle} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 22L20 20" stroke="#5E5F6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className={classes.Line} style={props.LineStyle}></div>
                </Fragment>

            }
            {props.ErrorText &&
                <div className={`${classes.error}`}>
                    <img src="/svg/danger-ic.svg" alt="error" />
                    <span className="font-400 size-4">{props.ErrorText}</span>
                </div>
            }
        </div>
    )
})

export default LeftIconInput