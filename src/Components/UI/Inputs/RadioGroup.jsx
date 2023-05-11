
import classes from './radioButton.module.css'
const RadioGroup = (props) => {
    const onchange = event => {
        props.onChange(props.name, event.target.id)
    }
    return (

        props.data.map(d =>
            <div className={`${props.IsGreen ? classes.GreenRadioButton : classes.RadioButton} ${props.className}`} key={d.id}>
                <input type="radio"
                    id={d.id}
                    name={d.name}
                    onChange={onchange}
                    required={d.required}
                    checked={props.selected === d.id ? true : false}
                />
                <label htmlFor={d.id} className={`font-400 text-lightgray size-4 ml-8 ${classes.label} ${props.LabelClassName}`}>{d.id}</label>
            </div>

        )
    )
}

export default RadioGroup