import classes from './Tasks.module.css';
import CheckBox from '../../UI/Inputs/CheckBox';
import { Fragment, useEffect, useState } from 'react';
import LoadingSpinner from '../../UI/LoadingSpinner';
import moment from 'moment';
import { axiosInstance } from '../../../axios-global';
const Tasks = props => {
	const [ActiveTab, SetActiveTab] = useState('Today');
	const [TodayTask, SetTodayTask] = useState(false);
	const [UnfinishTask, SetUnfinishTask] = useState(false);

	useEffect(() => {
		if (props.Tasks) {
			props.Tasks.forEach(item => {
				if (moment(item.ExpireDate).isSameOrAfter(moment())) {
					SetTodayTask(true);
				}
				if (moment(item.ExpireDate).isBefore(moment())) {
					SetUnfinishTask(true);
				}
			});
		}
	}, [props.Tasks]);

	const CheckboxChangeHandler = async (id, checked) => {
		try {
			const Call = await axiosInstance.put('/tasks/ChangeStatus/' + id, { Status: checked ? 'DONE' : 'IDLE' });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={`${props.className} ${classes.TaskContainer}`}>
			{window.innerWidth > 550 ? (
				<div className={`${classes.Title} font-600 text-black size-14 mb-20`}>Tasks</div>
			) : (
				<Fragment>
					<svg width='32' height='3' viewBox='0 0 32 3' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<rect width='32' height='3' rx='1.5' fill='#E1E2E6' />
					</svg>

					<div className={`${classes.Title} font-700 text-black size-7 mb-15 mt-20`}>Tasks</div>
				</Fragment>
			)}
			<div className={classes.Tab}>
				<div className={`${classes.TaskItem} ${ActiveTab === 'Today' && classes.active}`} onClick={() => SetActiveTab('Today')}>
					Today's tasks
					{TodayTask && <div className={`${classes.Bullet}`}></div>}
				</div>
				<div
					className={` ${classes.TaskItem} ${ActiveTab === 'Unfinished' && classes.active}`}
					onClick={() => SetActiveTab('Unfinished')}
				>
					Unfinished tasks
					{UnfinishTask && <div className={`${classes.Bullet}`}></div>}
				</div>
			</div>

			<div className={`${classes.Container} ${ActiveTab === 'Today' && classes.active}`}>
				{!props.Tasks ? (
					<LoadingSpinner />
				) : (
					props.Tasks.map(
						item =>
							moment(item.ExpireDate).isSameOrAfter(moment()) && (
								<div className={classes.Task} key={item._id}>
									<CheckBox IsGreen={true} onChange={CheckboxChangeHandler} ID={item._id}>
										{item.Title}
									</CheckBox>
								</div>
							),
					)
				)}
			</div>
			<div className={`${classes.Container} ${ActiveTab === 'Unfinished' && classes.active}`}>
				{!props.Tasks ? (
					<LoadingSpinner />
				) : (
					props.Tasks.map(
						item =>
							moment(item.ExpireDate).isBefore(moment()) && (
								<div className={classes.Task} key={item._id}>
									<CheckBox IsGreen={true} onChange={CheckboxChangeHandler} ID={item._id}>
										{item.Title}
									</CheckBox>
								</div>
							),
					)
				)}
			</div>

			<div className={classes.bottomShadow}></div>
		</div>
	);
};

export default Tasks;
