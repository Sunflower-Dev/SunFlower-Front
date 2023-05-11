
import { forwardRef } from 'react'
import classes from './input.module.css'
const Input = forwardRef((props, ref) => {


    return (
        <div className={`${props.className} ${classes.inputContainer} `} style={props.style}>

            <label className={classes.label}>{props.label}</label>
            <input
                type={props.type}
                onFocus={props.onFocus}
                className={`${props.ErrorText && classes.haveError} ${classes.input} pl-20`}
                placeholder={props.placeholder}
                style={props.type === 'file' ? { display: "none" } : props.style}
                ref={ref}
                onChange={props.onChange}
                name={props.name}
                value={props.value}
                autoComplete={props.autoComplete ? props.autoComplete : "on"}
                id={props.id} />
            {props.type === 'file' &&
                <label htmlFor={props.id} className={classes.filelabel}>
                    {props.placeholder}
                    <img src='/svg/Uploader-icon.svg' alt='uploader' />
                </label>
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

export default Input