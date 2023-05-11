
import MobilePopup from './MobilePopup/MobilePopup'
import classes from './Popup.module.css'

const Popup = (props) => {


    // const onBlurLayoutClickHandler = () => {
    //     SetIsClosing(true)

    //     setTimeout(() => {
    //         history.goBack();
    //     }, 300);
    // }

    return (
        window.innerWidth > 550 ?
            <div className={`${props.className} ${classes.Container} ${props.IsClosing && classes.close}`}
                style={props.style}>
                <div className={`${classes.Body} ${props.BodyClassName} ${props.IsClosing && classes.close}`} style={{ width: props.width }}>
                    {props.children}
                </div>
            </div>
            :
            props.Mobile === "EMPTY" ?
                props.children
                :
                <MobilePopup>
                    {props.children}
                </MobilePopup>
    )
}

export default Popup