import classes from './NotAuthBlur.module.css'
const NotAuthBlur = (props) => {
    return (
        <div className={classes.BlurContainer}>
            <div className={`font-500 size-12 text-darkgray ${classes.Container}`}>
                {props.children}
            </div>
        </div>
    )
}
export default NotAuthBlur