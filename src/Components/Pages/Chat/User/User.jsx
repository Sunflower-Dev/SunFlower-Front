import { useState } from 'react';
import classes from './User.module.css';
const User = props => {
	// eslint-disable-next-line
	const [Name, SetName] = useState(props.Admin.Name);
	var Re = new RegExp(props.SearchText, 'g');
	var NewName = Name;
	if (Re.test(Name) && props.SearchText.length > 0) {
		NewName = Name.replace(Re, '<span class="searchedText-Red">' + props.SearchText + '</span>');
	}

	return (
		<div className={`${classes.UserItem} ${props.isActive && classes.Active}`} onClick={props.onclick}>
			<div className={classes.Avatar}>
				<img src={process.env.REACT_APP_SRC_URL + props.Admin.Avatar} alt='logo' width='55px' />

				<svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
					<circle cx='7' cy='7' r='6.25' fill={`${props.isOnline ? '#48EA81' : '#E1E2E6'}`} stroke='white' strokeWidth='1.5' />
				</svg>
			</div>
			<div className={classes.Title}>
				<div
					className={`font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-darkgray`}
					dangerouslySetInnerHTML={{ __html: NewName }}
				></div>

				<div className={`font-400 ${window.innerWidth > 550 ? 'size-4' : 'size-1'} text-lightgray`}>10:30AM</div>
			</div>

			<div className={classes.SubTitle}>
				<div className={`font-400 ${window.innerWidth > 550 ? 'size-4' : 'size-1'} text-lightgray ${classes.Message}`}>
					{props.Message}
				</div>
				{!props.isActive && props.Counter > 0 && <div className={classes.counter}>{props.Counter}</div>}
			</div>
		</div>
	);
};

export default User;
