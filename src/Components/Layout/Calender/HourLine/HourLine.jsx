
import Event from '../Event/Event'
import classes from './HourLine.module.css'

const HourLine = (props) => {
    return (
        <div className={classes.Row}>
            <div className={classes.HourLine}>
                <span>{+props.HourTitle > 12 ? (props.HourTitle - 12) + 'PM' : props.HourTitle + 'AM'}</span>
                <div className={classes.line}></div>
            </div>
            <div className={classes.Container} style={{ gridTemplateColumns: 'repeat(' + (props.Meetings.length) + ',auto) 1fr' }}>
                {props.Meetings.map(metting =>
                    <Event
                        ContainerType={metting.ContainerType}
                        Type={metting.Type}
                        Title={metting.Title}
                        DrName={metting.DrName}
                        Time={metting.Time}
                        key={metting.ID}
                        ID={metting.ID}
                        State={metting.State}
                    // SubTitle={metting.SubTitle}
                    />
                )}
            </div>
        </div>
    )
}

export default HourLine