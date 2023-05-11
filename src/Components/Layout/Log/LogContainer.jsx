import { NavLink } from 'react-router-dom'
import { useHistory } from 'react-router'

import SecondaryButton from '../../UI/Bottons/SecondaryButton'
import classes from './Log.module.css'
import Log from './LogItem'
import LoadingSpinner from '../../UI/LoadingSpinner'

const Logs = (props) => {

    const history = useHistory();

    const FiltersOpenClickHandler = () => {
        history.push('/Dashboard/Logs/Filter')
    }

    return (
        <div className={`${classes.Container} ${classes.Animation}`} style={props.style} >
            <div className={classes.header}>
                {window.innerWidth > 550 ?
                    <div className={`font-600 text-black size-14 mb-25`}>{props.type === 'CLIENT' ? "List" : "Latest client updates"}</div>
                    :
                    <div className={`font-700 text-black size-7 mb-15`}>List</div>
                }
                {props.type === 'MINI' &&

                    <NavLink className={classes.SeeAll} to="/Dashboard/Logs" exact>
                        <span className={`font-400 size-6 text-secondaryred mr-8`}>See all</span>
                        <img src="/svg/arrow-right-red.svg" alt="seeAll" />
                    </NavLink>
                }
                {props.type === 'FULL' && window.innerWidth > 550 &&

                    <SecondaryButton onClick={FiltersOpenClickHandler}>
                        <img style={{ marginRight: "8px" }} src="/svg/filter-gray.svg" width="20px" alt="Filter" />
                        Filter
                    </SecondaryButton>
                }
            </div>
            {window.innerWidth > 550 &&
                <div className={classes.titles}>
                    <div className="font-500 size-8 text-darkgray">Staff</div>
                    <div className="font-500 size-8 text-darkgray">date and time</div>
                    <div className="font-500 size-8 text-darkgray">Changes</div>
                </div>
            }
            {!props.Logs ? <LoadingSpinner /> : props.Logs.map(item =>
                <Log key={item._id} size="FULL" type={props.type} data={item} />
            )}


            {/* <div className={classes.bottomShadow}></div> */}
        </div>
    )
}

export default Logs