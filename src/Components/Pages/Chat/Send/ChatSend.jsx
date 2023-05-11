
import classes from "./ChatSend.module.css"

const ChatSend = (props) => {
    return (
        <div className={classes.Container}>
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
            {window.innerWidth > 550 && <img src={process.env.REACT_APP_SRC_URL + props.Avatar} alt='logo' width="45px" />}
            <div className={`text-lightgray font-400 ${window.innerWidth > 550 ? "size-4" : "size-2"}`}>{props.Time}</div>

        </div>
    )
}

export default ChatSend