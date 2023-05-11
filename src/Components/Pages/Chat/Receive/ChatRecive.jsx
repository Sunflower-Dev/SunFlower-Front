
import classes from "./ChatRecive.module.css"

const ChatRecive = (props) => {
    return (
        <div className={classes.Container}>
            {window.innerWidth > 550 && <img src={process.env.REACT_APP_SRC_URL + props.Avatar} alt='logo' width="45px" />}
            {(props.MessageType === 'TEXT' || props.MessageType === 'IMAGE') ?
                <div className={`${classes.Message} text-lightgray font-400 ${window.innerWidth > 550 ? "size-6" : "size-3"}`}>
                    {props.MessageType === 'TEXT' ?
                        <div dangerouslySetInnerHTML={{ __html: props.Message }}>
                        </div>
                        : <img src={process.env.REACT_APP_SRC_URL + props.Message} alt="img" />}
                </div>
                :
                <div className={`${classes.Message} text-lightgray font-400 ${window.innerWidth > 550 ? "size-6" : "size-3"}`}>
                    <a href={process.env.REACT_APP_SRC_URL + props.Message} target="_blank" rel="noreferrer">
                        <img src="/svg/FileTypes/zip.svg" width={50} alt="file" />
                        {props.Message.split(/\//g)[props.Message.split(/\//g).length - 1]}
                    </a>
                </div>
            }
            <div className={`text-lightgray font-400 ${window.innerWidth > 550 ? "size-4" : "size-2"} ${classes.Time}`}>{props.Time}</div>

        </div>
    )
}

export default ChatRecive