import moment from "moment"
import { Fragment, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import ChatRecive from "../Receive/ChatRecive"
import ChatSend from "../Send/ChatSend"
import classes from "./Conversation.module.css"
const Conversation = (props) => {
    const _id = useSelector((state) => state.Auth._id)
    const containerRef = useRef(null)
    var Regex = new RegExp(props.SearchText, 'g')

    if (props.Messages) {
        var Chats = []
        props.Messages.forEach(element => {

            if (element.MessageType === "TEXT") {
                if (props.SearchText.length > 0) {
                    if (Regex.test(element.Message)) {
                        element.CustomMessage = element.Message
                        element.CustomMessage = element.CustomMessage.replace(Regex, '<span class="searchedText-Yellow">' + props.SearchText + "</span>")
                    } else {
                        element.CustomMessage = element.Message
                    }
                }
                else {
                    element.CustomMessage = element.Message
                }
            }

            if (Chats.find(x => x.Date === 'Today') && moment(element.CreatedAt).isSame(new Date(), 'day')) {
                Chats.find(x => x.Date === 'Today').List.push(element)

            } else if (Chats.find(x => x.Date === moment(element.CreatedAt).format('MMMM DD, YYYY')) && !moment(element.CreatedAt).isSame(new Date(), 'day')) {
                Chats.find(x => x.Date === moment(element.CreatedAt).format('MMMM DD, YYYY')).List.push(element)
            }
            else {
                if (moment(element.CreatedAt).isSame(new Date(), 'day')) {

                    Chats.push({
                        Date: "Today",
                        List: [element]
                    })
                } else {
                    Chats.push({
                        Date: moment(element.CreatedAt).format('MMMM DD, YYYY'),
                        List: [element]
                    })
                }
            }
        });
        if (!Chats.find(x => x.Date === "Today")) {
            Chats.push({ Date: "Today", List: [] })
        }
    }


    useEffect(() => {
        const scroll =
            containerRef.current.scrollHeight - containerRef.current.clientHeight;
        containerRef.current.scrollTo(0, scroll);
    }, [props.Messages])

    return (
        <div className={classes.Container} ref={containerRef}>
            {props.Messages && Chats.map(ct =>
                <Fragment key={ct.Date}>
                    <div className={classes.Divider}>
                        <div className={classes.DashedLine}></div>
                        <div className={`${classes.Date} text-darkgray font-500 ${window.innerWidth > 550 ? "size-5" : "size-3"} `}>{ct.Date}</div>
                        <div className={classes.DashedLine}></div>
                    </div>
                    {ct.List.map(item =>
                        item.From === _id ?
                            <ChatSend
                                key={item._id}
                                Message={item.CustomMessage ? item.CustomMessage : item.Message}
                                MessageType={item.MessageType}
                                Avatar={props.MyAvatar}
                                Time={moment(item.CreatedAt).format('hh:mm a')}
                            />
                            :
                            <ChatRecive
                                key={item._id}
                                Message={item.CustomMessage ? item.CustomMessage : item.Message}
                                MessageType={item.MessageType}
                                Avatar={props.Avatar}
                                Time={moment(item.CreatedAt).format('hh:mm a')}
                            />
                    )}

                </Fragment>
            )}
            {props.Upload &&
                <div className="text-darkgray text-center">Uploading ... {props.Upload}%</div>
            }
        </div>
    )
}

export default Conversation