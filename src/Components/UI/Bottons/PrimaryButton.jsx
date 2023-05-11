import classes from "./buttons.module.css";

const PrimaryButton = (props) => {


    const SpinnerClasses = `${classes.spinner} ${props.IsLoading && classes.active} `
    return (
        <button
            className={`${classes.button} ${props.className}`}
            onClick={props.onClick}
            style={props.style}
            type={props.type}>
            {props.children}
            <img src="/svg/spinner.svg" alt="Spinner" className={SpinnerClasses} />
        </button>
    )
}

export default PrimaryButton