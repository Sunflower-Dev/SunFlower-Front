import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory, useParams } from 'react-router';
import { axiosInstance } from '../../../axios-global';
import LoadingSpinner from '../../UI/LoadingSpinner';
import DeletePopup from '../../UI/Popup/Delete/DeletePopup';
import classes from './Notification.module.css';

const Notification = props => {
	const history = useHistory();
	const { id } = useParams();
	const [NotifData, SetNotifData] = useState(null);
	const [IsLoading, SetIsLoading] = useState(false);

	const Permissions = JSON.parse(useSelector(state => state.Auth.Admin)).Permissions;

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/Notifications/' + id);
				var response = call.data;
				SetNotifData(response);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [id]);

	const onDeletePopupShow = () => {
		history.push('/Notifications/item/' + id + '/Delete');
	};

	const BackClickHandler = () => {
		history.goBack();
	};

	const onDeleteConfirmed = async () => {
		SetIsLoading(true);
		try {
			const call = await axiosInstance.delete('/Notifications/' + id);
			var response = call.data;
			SetIsLoading(false);
			history.go(-2);
		} catch (error) {
			console.log(error);
		}
	};

	return !NotifData ? (
		<LoadingSpinner />
	) : (
		<Fragment>
			{window.innerWidth < 550 && (
				<header>
					<div className={classes.MiniHeader_TitleMode}>
						<img src='/svg/arrow-left.svg' alt='back' onClick={BackClickHandler} />
						<div className={`font-600 size-7 text-black`}>Open notification</div>
						{Permissions.Delete.includes('notification') && (
							<img src='/svg/trash-black.svg' alt='back' onClick={onDeletePopupShow} />
						)}
					</div>
				</header>
			)}
			<div className={classes.Container}>
				<div className={classes.Header}>
					<img src={`/svg/Notifs/${NotifData.Type}.svg`} alt='NotifType' width='80px' />
					<div className={`${classes.Title} text-black ${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'}`}>
						{NotifData.Title}
					</div>
					<div className={`${classes.Date} font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray`}>
						{window.innerWidth > 550 ? (
							<span>{moment(new Date(NotifData.CreatedAt)).format('MMMM DD, YYYY')}&nbsp;|&nbsp;&nbsp;</span>
						) : (
							<span>{moment(new Date(NotifData.CreatedAt)).format('MMM DD')} &nbsp;|&nbsp;&nbsp;</span>
						)}
						<span className={`text-lightgray`}>Read</span>
					</div>
					{Permissions.Delete.includes('notification') && window.innerWidth > 550 && (
						<div className={classes.delete} onClick={onDeletePopupShow}>
							<svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<path
									d='M28 7.97331C23.56 7.53331 19.0933 7.30664 14.64 7.30664C12 7.30664 9.36 7.43997 6.72 7.70664L4 7.97331'
									stroke='#5E5F6E'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M11.3335 6.62699L11.6268 4.88033C11.8402 3.61366 12.0002 2.66699 14.2535 2.66699H17.7468C20.0002 2.66699 20.1735 3.66699 20.3735 4.89366L20.6668 6.62699'
									stroke='#5E5F6E'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M25.1334 12.1865L24.2667 25.6132C24.12 27.7065 24 29.3332 20.28 29.3332H11.72C8.00003 29.3332 7.88003 27.7065 7.73337 25.6132L6.8667 12.1865'
									stroke='#5E5F6E'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M13.7734 22H18.2134'
									stroke='#5E5F6E'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M12.6665 16.667H19.3332'
									stroke='#5E5F6E'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</div>
					)}
				</div>

				<div className={`font-400 size-6 text-lightgray ${classes.body}`}>{NotifData.Body}</div>
			</div>

			{Permissions.Delete.includes('notification') && (
				<Route path='/Notifications/item/:id/Delete'>
					<DeletePopup
						Title='Delete Notification'
						SubTitle='Are you sure you want to delete the notification?'
						onClick={onDeleteConfirmed}
						IsLoading={IsLoading}
					/>
				</Route>
			)}
		</Fragment>
	);
};

export default Notification;
