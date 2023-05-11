import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import classes from '../Service.module.css'
const ServiceFolder = (props) => {
    const [IsActionVisible, setActionVisibility] = useState(false)
    const [IsActionClosing, setIsActionClosing] = useState(false)

    const Actionref = useRef(null)
    const popupref = useRef(null)

    const history = useHistory()

    const Permissions = JSON.parse(useSelector((state) => state.Auth.Admin)).Permissions


    const showFolderActionHandler = () => {
        // if (window.innerWidth > 550) {
        setIsActionClosing(false)
        setActionVisibility(true)
        // }
        // else {
        //     history.push(history.location.pathname + '/EventManager?ID=' + props.id)
        // }
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

    const deletefolderClickHandler = () => {
        history.push(history.location.pathname + '/DeleteFolder')

    }
    const EditfolderClickHandler = () => {
        history.push(history.location.pathname + '/EditFolder/' + props.id)

    }
    return (
        <div className={`${classes.FolderItem} ${props.ActiveFolder && classes.active}`}
            onClick={() => props.OpenFolderClickHandler(props.id)}>
            {window.innerWidth < 550 &&
                <img src='/svg/FileTypes/zip.svg' width={50} alt="file" />
            }
            <div className={`font-500 size-6 text-darkgray ${classes.FolderTitle}`}>
                {props.Title}
            </div>
            {(Permissions.Edit.includes('online-office') || Permissions.Delete.includes('online-office')) &&
                <img src="/svg/kebab-menu.svg" className={classes.FolderAction}
                    onClick={showFolderActionHandler} alt="actions" ref={Actionref} />
            }
            <div className={`font-400 size-4 text-lightgray`} style={{ gridRow: window.innerWidth > 550 ? 2 : 3 }}>
                {props.Documents} Documents

            </div>
            {
                // window.innerWidth > 550 &&
                <div className={`${classes.actionContainer} ${IsActionClosing ? classes.fadeout : classes.fadein}`} ref={popupref}
                    style={{ display: IsActionVisible ? 'flex' : "none" }}>
                    {Permissions.Delete.includes('online-office') &&
                        <div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={deletefolderClickHandler}>
                            <img src="/svg/trash.svg" alt="delete" /> <span>Delete folder</span>
                        </div>
                    }
                    {Permissions.Edit.includes('online-office') &&
                        <div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={EditfolderClickHandler}>
                            <img src="/svg/edit.svg" alt="edit" /> <span>Edit folder</span>
                        </div>
                    }


                </div>
            }
        </div>
    )
}

export default ServiceFolder