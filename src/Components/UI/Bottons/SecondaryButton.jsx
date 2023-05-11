import classes from "./buttons.module.css";

const SecondaryButton = (props) => {


    return (
        <button style={props.style}
            className={`${classes.SecondaryButton} ${props.className}`}
            onClick={props.onClick}
            type={props.type}>
            {props.children}

        </button>
    )
}

export default SecondaryButton