import classes from './Event.module.css';
import { Fragment, useState, useEffect, useRef } from 'react';

import { useHistory } from 'react-router';
import { axiosInstance } from '../../../../axios-global';
import { useSelector } from 'react-redux';

const Event = props => {
	const history = useHistory();

	let popupref = useRef(null);
	let Actionref = useRef(null);

	const [IsActionVisible, setActionVisibility] = useState(false);
	const [IsActionClosing, setIsActionClosing] = useState(false);
	const [ActionLeft, SetActionLeft] = useState('0px');

	const AdminData = JSON.parse(useSelector(state => state.Auth.Admin));
	const Permissions = AdminData.Permissions;

	const showActionHandler = () => {
		if (window.innerWidth > 550) {
			setIsActionClosing(false);

			SetActionLeft(+Actionref.current.offsetLeft + 26 + 'px');
			setActionVisibility(true);
		} else {
			history.push(history.location.pathname + '/EventManager?ID=' + props.ID);
		}
	};

	const handleClickOutside = event => {
		if (IsActionVisible) {
			setIsActionClosing(true);
			setTimeout(() => {
				setActionVisibility(false);
			}, 300);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	const RemoveEventHandler = () => {
		history.push(history.location.pathname + '/deleteEvent?ID=' + props.ID);
	};
	const EditSchedule = () => {
		history.push(history.location.pathname + '/EditEvent/' + props.ID);
	};
	const CancelSchedule = () => {
		history.push(history.location.pathname + '/CancelSchedule?ID=' + props.ID);
	};

	const CompleteSchedule = async () => {
		try {
			const call = await axiosInstance.put('/schedules/Complete/' + props.ID);
			var Response = call.data;
			if (Response) {
				history.go(0);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const containerClass =
		props.ContainerType === 'FULL' && window.innerWidth < 550
			? classes.RowContainer
			: window.innerWidth > 550
			? classes.Container
			: classes.MiniContainer;
	const ViewType = props.ContainerType === 'FULL' && window.innerWidth < 550 ? 'ROW' : window.innerWidth > 550 ? 'NORMAL' : 'MINI';
	return (
		<Fragment>
			<div className={`${containerClass} EventItem`}>
				<img src={`${props.Type === 'CALL' ? '/svg/call.svg' : '/svg/meeting.svg'}`} alt='Type' className={classes.Type} />
				<div className={classes.Title}>{props.Title}</div>
				<div className={classes.SubTitle}>
					{ViewType === 'ROW' && (
						<div className={`${classes.MiniTime}`}>
							{props.Time + '\xa0\xa0|'}
							{props.State === 'DONE' && <span style={{ color: 'var(--green)' }}>Done</span>}
							{props.State === 'CANCELED' && <span style={{ color: 'var(--SecondaryRed)' }}>Canceled</span>}
						</div>
					)}
					{ViewType === 'MINI' && (
						<div className={`${classes.MiniTime}`}>
							<img src='/svg/clock.svg' alt='clock' />
							{props.Time}
						</div>
					)}
					{ViewType === 'NORMAL' && (
						<Fragment>
							<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
								<span>{props.DrName + '\xa0\xa0|\xa0\xa0' + props.Time}</span>
								{props.State === 'DONE' && <span style={{ color: 'var(--green)' }}>Done</span>}

								{props.State === 'CANCELED' && <span style={{ color: 'var(--SecondaryRed)' }}>Canceled</span>}
							</div>
						</Fragment>
					)}
				</div>
				<img src='/svg/kebab-menu.svg' alt='actions' ref={Actionref} className={classes.Action} onClick={showActionHandler} />
			</div>

			{window.innerWidth > 550 && (
				<div
					className={`${classes.actionContainer} ${IsActionClosing ? classes.fadeout : classes.fadein}`}
					ref={popupref}
					style={{ display: IsActionVisible ? 'flex' : 'none', left: ActionLeft }}
				>
					{Permissions.Delete.includes('calender') && (
						<div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={RemoveEventHandler}>
							<img src='/svg/trash.svg' alt='delete' /> <span>Remove Schedule</span>
						</div>
					)}

					{Permissions.Edit.includes('calender') && (
						<div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={EditSchedule}>
							<img src='/svg/edit.svg' alt='edit' /> <span>Schedule Editing</span>
						</div>
					)}

					<div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={CompleteSchedule}>
						<img src='/svg/tick-circle.svg' alt='complete' /> <span>Complicated</span>
					</div>
					<div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={CancelSchedule}>
						<img src='/svg/close-gray.svg' alt='cancel' /> <span>canceled</span>
					</div>
				</div>
			)}
		</Fragment>
	);
};

export default Event;
