
import { useRef } from 'react';
import classes from './checkbox.module.css'
const CheckBox = (props) => {
    const ref = useRef(null)
    const onchangeHandler = () => {
        props.onChange(props.ID, ref.current.checked)
    }
    return (
        <div className={`${props.IsGreen ? classes.GreenCheckBox : classes.CheckBox} ${props.className}`} style={props.style}>
            <input type="checkbox" id={props.ID} defaultChecked={props.defaultChecked} onChange={onchangeHandler} ref={ref} name={props.name} />
            <label htmlFor={props.ID} className={`font-400 text-lightgray size-4 ml-8 ${classes.label} ${props.LabelClassName}`}>{props.children}</label>
        </div>
    )
}

export default CheckBox