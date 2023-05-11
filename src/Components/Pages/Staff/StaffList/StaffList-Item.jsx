// import moment from 'moment';
import moment from 'moment';
import { Fragment, useState } from 'react';
import { useHistory } from 'react-router'
import SecondaryButton from "../../../UI/Bottons/SecondaryButton";

import classes from "./StaffList.module.css"


const StaffListItem = (props) => {

    const history = useHistory();

    // eslint-disable-next-line
    const [Name, SetName] = useState(props.item.Name)
    var Re = new RegExp(props.SearchText, 'g')
    var NewName = Name
    if (Re.test(Name) && props.SearchText.length > 0) {
        NewName = Name.replace(Re, '<span class="searchedText-Red">' + props.SearchText + "</span>")
    }

    const onProfileClickHandler = () => {
        if (window.innerWidth > 550) {
            history.push('/Staff/' + props.item.ID + '/Detail')
        } else {
            history.push('/Staff/' + props.item.ID + '/Manage')
        }
    }
    return (
        <div className={classes.row} onClick={window.innerWidth < 550 ? onProfileClickHandler : null}>

            <img src={process.env.REACT_APP_SRC_URL + props.item.Avatar} alt='avatar' className={classes.Avatar} />

            <div className={`${window.innerWidth < 550 && "font-500 size-3 text-darkgray "} ${classes.NameMini}`} dangerouslySetInnerHTML={{ __html: NewName }}></div>
            {window.innerWidth < 550 &&
                <div className={`${classes.SubTitleMini}`}>
                    {moment(props.item.RegisterDate).format('DD MMM YYYY') + ' | '}
                    {props.item.Clients} Clients |
                    <span className={`${props.item.Status === 'Online' ? "text-green" : "text-yellow"} `}>
                        {' ' + props.item.Status}
                    </span>
                </div>
            }
            {window.innerWidth > 550 &&
                <Fragment>
                    <div>{moment(props.item.RegisterDate).format('DD MMM YYYY')}</div>
                    <div className={`${props.item.Status === 'Online' ? classes.OnStatus : classes.OffStatus}`}>
                        {props.item.Status}
                    </div>

                    <div>
                        {props.item.Clients} Clients
                    </div>
                </Fragment>
            }
            {window.innerWidth > 550 ?
                <div style={{ display: "flex", gap: "14px" }}>

                    <SecondaryButton style={{ padding: "10.5px" }} onClick={() => history.push('/Messages/' + props.item.ID)}>
                        <img src="/svg/Message-ic.svg" width={20} alt='Message' />
                    </SecondaryButton>

                    <SecondaryButton onClick={onProfileClickHandler}>View File</SecondaryButton>
                </div>
                :
                <img src="/svg/arrow-right.svg" width={24} alt='detail' className={classes.arrowMini} />
            }


        </div>
    )
}

export default StaffListItem