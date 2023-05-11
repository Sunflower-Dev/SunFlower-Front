import { useState } from 'react';
import { useHistory } from 'react-router-dom'
import classes from './MobilePopup.module.css'

const MobilePopup = (props) => {
    const history = useHistory();
    const [IsClosing, setIsClosing] = useState(false)

    const emptyareaClickHandler = () => {
        setIsClosing(true)
        setTimeout(() => {
            history.goBack();
        }, 300)
    }
    return (
        <div className={`${classes.Container} ${(IsClosing || props.IsClosing) && classes.active}`}>
            <div onClick={emptyareaClickHandler}></div>
            <div className={`${classes.Body} ${(IsClosing || props.IsClosing) && classes.active}`}>
                <svg width="32" height="3" viewBox="0 0 32 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="3" rx="1.5" fill="#E1E2E6" />
                </svg>
                <div className={`${props.className} ${classes.content}`}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default MobilePopup