
import { useRef, useState } from 'react';
import classes from './radioButton.module.css'
const RadioButton = (props) => {
    const [isChecked, setIschecked] = useState(false)
    const radioref = useRef(null)

    const RadioClickHandler = (event) => {

        if (isChecked) {
            setIschecked(false)
            radioref.current.value = 'off'
            if (props.onChange) {
                props.onChange(event)
            }
            props.isChecked(false)
        } else {
            setIschecked(true)
            radioref.current.value = 'on'
            props.isChecked(true)
        }
    }
    return (
        <div className={`${props.IsGreen ? classes.GreenRadioButton : classes.RadioButton} ${props.className}`}>
            <input type="radio"
                id={props.ID}
                name={props.name}
                onChange={props.onChange ? props.onChange : null}
                onClick={RadioClickHandler}
                checked={isChecked}
                ref={radioref} />
            <label htmlFor={props.ID} className={`font-400 text-lightgray size-4 ml-8 ${classes.label} ${props.LabelClassName}`}>{props.children}</label>
        </div>
    )
}

export default RadioButton