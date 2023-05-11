import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom"
import classes from "./NoteItem.module.css"

const NoteItem = (props) => {

    let popupref = useRef(null);
    let Actionref = useRef(null);

    const [IsActionVisible, setActionVisibility] = useState(false)
    const [IsActionClosing, setIsActionClosing] = useState(false)
    const [ActionRight, SetActionRight] = useState('0px')
    const history = useHistory()

    const Permissions = JSON.parse(useSelector((state) => state.Auth.Admin)).Permissions


    const showActionHandler = () => {
        setIsActionClosing(false)

        SetActionRight('20px');
        setActionVisibility(true)
    }


    const handleClickOutside = (event) => {
        if (IsActionVisible) {
            setIsActionClosing(true)
            setTimeout(() => {
                setActionVisibility(false)
            }, 300)
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });
    const openEditPopupHandler = () => {
        history.push(history.location.pathname + '/EditNote/' + props.data.id)
    }
    var CanEdit = false

    if (history.location.pathname.includes('Client')) {
        if (Permissions.Edit.includes('client-note')) {
            CanEdit = true
        }

    }
    if (history.location.pathname.includes('Online-Office')) {
        if (Permissions.Edit.includes('online-office')) {
            CanEdit = true
        }

    }

    const onNoteClickHandler = () => {
        if (window.innerWidth < 550) {
            history.push(history.location.pathname + '/NoteItem/' + props.data.id)
        }
    }

    return (
        <div className={`${classes.Container}`} onClick={onNoteClickHandler}>
            <div className={`font-500 ${window.innerWidth > 550 ? "size-10" : "size-3"} text-darkgray`}>{props.data.Title}</div>
            <p className={`font-400 ${window.innerWidth > 550 ? "size-6" : "size-1"} text-lightgray mt-10 ${classes.Description}`}>
                {props.data.Description}
            </p>
            <div className={classes.footer}>
                <img alt="NoteAvatar" src={`${process.env.REACT_APP_SRC_URL}${props.data.Avatar}`} />

                {window.innerWidth > 550 && <div className={`${classes.Name} font-500 size-5 text-darkgray`}>{props.data.Name}</div>}
                <div className={`${classes.Date} font-400 ${window.innerWidth > 550 ? "size-3" : "size-1"} text-lightgray`}>{props.data.Date}</div>
                {(CanEdit && window.innerWidth > 550) &&
                    <img src="/svg/kebab-menu.svg"
                        alt="actions" ref={Actionref}
                        className={classes.Action} onClick={showActionHandler} />
                }
                <div className={`${classes.actionContainer} ${IsActionClosing ? classes.fadeout : classes.fadein}`} ref={popupref}
                    style={{ display: IsActionVisible ? 'flex' : "none", right: ActionRight }}>

                    <div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={openEditPopupHandler}>
                        <img src="/svg/edit.svg" alt="edit" /> <span>Edit Note</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteItem