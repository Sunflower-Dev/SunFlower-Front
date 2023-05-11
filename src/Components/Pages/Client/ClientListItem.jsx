import { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router'
import SecondaryButton from '../../UI/Bottons/SecondaryButton'

import classes from "./ClientList.module.css"
const ClientItem = (props) => {


    let popupref = useRef(null);
    let Actionref = useRef(null);

    const [IsActionVisible, setActionVisibility] = useState(false)
    const [IsActionClosing, setIsActionClosing] = useState(false)

    const Permissions = JSON.parse(useSelector((state) => state.Auth.Admin)).Permissions

    const handleClickOutside = (event) => {
        if (IsActionVisible) {
            setIsActionClosing(true)
            setTimeout(() => {
                setActionVisibility(false)
            }, 300)
        }
    };

    const showActionHandler = () => {
        if (window.innerWidth > 550) {
            setIsActionClosing(false)
            setActionVisibility(true)
        }
        else {
            history.push(history.location.pathname + '/EventManager?ID=' + props.ID)
        }
    }


    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });

    const history = useHistory();

    const onProfileClickHandler = () => {
        history.push('/Client/' + props.item.RouteID)
    }

    // eslint-disable-next-line
    const [Name, SetName] = useState(props.item.Name)
    var Re = new RegExp(props.SearchText, 'g')
    var NewName = Name
    if (Re.test(Name) && props.SearchText.length > 0) {
        NewName = Name.replace(Re, '<span class="searchedText-Red">' + props.SearchText + "</span>")
    }
    return (
        <div className={classes.row} onClick={window.innerWidth < 550 ? onProfileClickHandler : null}>
            {window.innerWidth > 550
                ?
                <div>#{props.item.ID}</div>
                :
                <img src={process.env.REACT_APP_SRC_URL + props.item.Avatar} width={48} alt='avatar' />
            }
            <div className={`${window.innerWidth < 550 && "font-500 size-3 text-darkgray "} ${classes.NameMini}`} dangerouslySetInnerHTML={{ __html: NewName }} ></div>
            {window.innerWidth < 550 &&
                <div className={`${classes.SubTitleMini}`}>
                    {props.item.RegisterDate.format('DD MMM YYYY') + ' | '}
                    <span className={` ${props.item.Status === 'Active Client' ? "text-green" : props.item.Status === 'Status None' ? "text-yellow" : "text-secondaryred"} `}>
                        {props.item.Status === 'Status None' ? "None" : props.item.Status}
                    </span>
                </div>
            }

            {window.innerWidth > 550 &&
                <Fragment>
                    <div>{props.item.RegisterDate.format('DD MMM YYYY')}</div>
                    {props.item.Supervisor.length > 0 ?
                        <div title={props.item.Supervisor.map(item =>
                            item.Name)}>
                            {props.item.Supervisor.length === 1 ? props.item.Supervisor[0].Name : props.item.Supervisor[0].Name + '...+' + (props.item.Supervisor.length - 1)}
                        </div>
                        :
                        <div> - </div>
                    }
                    <div className={`${props.item.Status === 'Active Client' && classes.GreenStatus}  ${props.item.Status === 'Past Client' && classes.RedStatus}
            ${props.item.Status === 'Status None' && classes.OrangeStatus}`}>
                        {props.item.Status === 'Status None' ? "None" : props.item.Status}

                    </div>
                </Fragment>
            }
            {window.innerWidth > 550 ?
                <div style={{ display: 'flex', gap: "14px", alignItems: "center", justifyContent: "flex-end" }}>
                    <SecondaryButton onClick={onProfileClickHandler}>View Profile</SecondaryButton>
                    {(Permissions.Edit.includes('client') || Permissions.Delete.includes('client')) &&
                        <img src="/svg/kebab-menu.svg"
                            alt="actions" ref={Actionref}
                            className={classes.Action} onClick={showActionHandler} />
                    }
                </div>
                :
                <div className={classes.arrowMini}>
                    <img src="svg/arrow-right.svg" width={24} alt='detail' />
                </div>
            }

            {window.innerWidth > 550 &&
                <div className={`${classes.actionContainer} ${IsActionClosing ? classes.fadeout : classes.fadein}`} ref={popupref}
                    style={{ display: IsActionVisible ? 'flex' : "none" }}>

                    {Permissions.Delete.includes('client') &&
                        <div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={() => history.push('/client/' + props.item.RouteID + '/Delete')}>
                            <img src="/svg/trash.svg" alt="delete" /> <span>Delete client</span>
                        </div>
                    }

                    {Permissions.Edit.includes('client') &&
                        <div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={() => history.push('/client/' + props.item.RouteID + '/Edit')}>
                            <img src="/svg/edit.svg" alt="edit" /> <span>Edit client</span>
                        </div>
                    }


                </div>
            }

        </div>
    )
}

export default ClientItem