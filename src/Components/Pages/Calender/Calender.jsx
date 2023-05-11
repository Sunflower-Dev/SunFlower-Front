import CalenderView from '../../Layout/Calender/CalenderView';
import classes from './Calender.module.css';

import { useHistory } from 'react-router';
import { Fragment, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import NewSchedule from './NewSchedule/NewSchedule';
import EventManager from '../../UI/Popup/MobilePopup/EventManager/EventManager';
import { axiosInstance } from '../../../axios-global';
import LoadingSpinner from '../../UI/LoadingSpinner';
import { useSelector } from 'react-redux';
import NotAuthBlur from '../../Layout/NotAuthBlur/NotAuthBlur';

const Calender = () => {
	const history = useHistory();
	const [Schedules, setSchedules] = useState([]);

	const AdminData = JSON.parse(useSelector(state => state.Auth.Admin));
	const Permissions = AdminData.Permissions;

	const NewScheduleClickHandler = () => {
		history.push('/Calender/NewSchedule');
	};

	useEffect(() => {
		if (Permissions.View.includes('calender') || Permissions.View.includes('calender-all')) {
			(async () => {
				try {
					const call = await axiosInstance.get('/schedules');
					var response = call.data;
					if (response.length === 0) {
						response = 'no schedule';
					}
					setSchedules(response);
				} catch (error) {
					console.log(error);
				}
			})();
		}
		// eslint-disable-next-line
	}, []);

	return !Permissions.View.includes('calender') && !Permissions.View.includes('calender-all') ? (
		<NotAuthBlur>you have not permitted to access Calender! please contact administator</NotAuthBlur>
	) : (
		<Fragment>
			{window.innerWidth > 550 && Permissions.Edit.includes('calender') && (
				<Route path='/Calender/NewSchedule'>
					<NewSchedule type='NEW' />
				</Route>
			)}
			{Schedules.length === 0 ? (
				<LoadingSpinner />
			) : (
				<CalenderView
					className={classes.Container}
					Type='FULL'
					Schedules={Schedules}
					NewScheduleClickHandler={NewScheduleClickHandler}
				/>
			)}
			{window.innerWidth < 550 && (
				<Fragment>
					{Permissions.Edit.includes('calender') && (
						<div className={classes.CalenderActionButton} onClick={NewScheduleClickHandler}>
							<img src='/svg/plus-white.svg' width={32} alt='Add' />
						</div>
					)}
					<Route path='/Calender/EventManager'>
						<EventManager />
					</Route>
				</Fragment>
			)}
		</Fragment>
	);
};

export default Calender;
