import classes from './DeleteDocumentConfirm.module.css';

import Popup from '../Popup';
import SecondaryButton from '../../Bottons/SecondaryButton';
import PrimaryButton from '../../Bottons/PrimaryButton';
import { useHistory, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import MobilePopup from '../MobilePopup/MobilePopup';

import { axiosInstance } from '../../../../axios-global';
import LoadingSpinner from '../../LoadingSpinner';
import moment from 'moment';

const DeleteDocumentConfirm = props => {
	const history = useHistory();

	const [IsClosing, setIsClosing] = useState(false);
	// eslint-disable-next-line
	const [IsSumbitting, setIsSumbitting] = useState(false);

	const { DocumentId } = useParams();

	const [Requests, SetRequests] = useState(null);

	const closePopupHandler = () => {
		setIsClosing(true);
		setTimeout(() => {
			history.goBack();
		}, 300);
	};

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get(props.get + DocumentId);
				var response = call.data;
				SetRequests(response);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [DocumentId, props.get]);

	const OnSubmitClickHandler = async () => {
		try {
			const call = await axiosInstance.delete(props.delete + DocumentId);
			var response = call.data;
			if (response) {
				history.goBack();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return window.innerWidth > 550 ? (
		<Popup IsClosing={IsClosing} width='680px'>
			<div className={classes.header}>
				<span className={`font-600 text-black size-14`}>Delete document</span>
				<img src={`/svg/close.svg`} width='30px' alt='close' onClick={closePopupHandler} />
			</div>
			{!Requests ? (
				<LoadingSpinner />
			) : (
				<>
					<div className={classes.body}>
						{Requests.length > 0 ? (
							<>
								<div className={`font-500 text-darkgray size-10`}>Deleting request</div>
								{Requests.map(item => (
									<div key={item._id} className={`${classes.RequestItem}`}>
										<div className={classes.RequestHeader}>
											<img src={`${process.env.REACT_APP_SRC_URL}/${item.Admin.Avatar}`} alt='' />
											<div className={`text-lightgray size-6 font-500`}>{item.Admin.Name}</div>
											<div className={`text-lightgray size-5 font-400`}>
												{moment(item.CreatedAt).format('DD MMM YYYY')}
											</div>
										</div>
										<div className={classes.RequestBody}>
											<div className={`text-lightgray size-5 font-400`}>{item.Reason}</div>
											<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
												<path
													d='M10.0001 18.3332C14.5834 18.3332 18.3334 14.5832 18.3334 9.99984C18.3334 5.4165 14.5834 1.6665 10.0001 1.6665C5.41675 1.6665 1.66675 5.4165 1.66675 9.99984C1.66675 14.5832 5.41675 18.3332 10.0001 18.3332Z'
													stroke='#F58986'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M10 6.6665V10.8332'
													stroke='#F58986'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M9.99561 13.3335H10.0031'
													stroke='#F58986'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										</div>
									</div>
								))}
							</>
						) : (
							<span className={`font-400 text-lightgray size-5`}>Are you sure you want to delete the document?</span>
						)}
					</div>

					<div className={classes.Action}>
						<PrimaryButton
							type='submit'
							IsLoading={IsSumbitting}
							className={`font-500 size-6`}
							style={{ padding: '14px 28px' }}
							onClick={OnSubmitClickHandler}
						>
							<img src='/svg/trash-white.svg' alt='' className='mr-8' />
							Delete document
						</PrimaryButton>

						<SecondaryButton onClick={closePopupHandler} style={{ padding: '14px 28px', height: '52px' }}>
							<span className={`font-500 text-darkgray size-6`}>cancel</span>
						</SecondaryButton>
					</div>
				</>
			)}
		</Popup>
	) : (
		<MobilePopup IsClosing={IsClosing}>
			<div className={classes.header}>
				<span className={`font-600 text-black size-10`}>Delete document</span>
			</div>
			{!Requests ? (
				<LoadingSpinner />
			) : (
				<>
					<div className={classes.body}>
						{Requests.length > 0 ? (
							<>
								<div className={`font-500 text-darkgray size-7`}>Deleting request</div>
								{Requests.map(item => (
									<div key={item._id} className={`${classes.RequestItem}`}>
										<div className={classes.RequestHeader}>
											<img src={`${process.env.REACT_APP_SRC_URL}/${item.Admin.Avatar}`} alt='' />
											<div className={`text-lightgray size-4 font-500`}>{item.Admin.Name}</div>
											<div className={`text-lightgray size-3 font-400`}>
												{moment(item.CreatedAt).format('DD MMM YYYY')}
											</div>
										</div>
										<div className={classes.RequestBody}>
											<div className={`text-lightgray size-3 font-400`}>{item.Reason}</div>
											<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
												<path
													d='M10.0001 18.3332C14.5834 18.3332 18.3334 14.5832 18.3334 9.99984C18.3334 5.4165 14.5834 1.6665 10.0001 1.6665C5.41675 1.6665 1.66675 5.4165 1.66675 9.99984C1.66675 14.5832 5.41675 18.3332 10.0001 18.3332Z'
													stroke='#F58986'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M10 6.6665V10.8332'
													stroke='#F58986'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M9.99561 13.3335H10.0031'
													stroke='#F58986'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										</div>
									</div>
								))}
							</>
						) : (
							<span className={`font-400 text-lightgray size-6 text-center`}>
								Are you sure you want to delete the document?
							</span>
						)}
					</div>

					<div className={classes.Action}>
						<PrimaryButton
							type='submit'
							IsLoading={IsSumbitting}
							className={`font-400 size-3`}
							style={{ padding: '14px 28px' }}
							onClick={OnSubmitClickHandler}
						>
							<img src='/svg/trash-white.svg' alt='' className='mr-8' />
							Delete document
						</PrimaryButton>

						<SecondaryButton onClick={closePopupHandler} style={{ padding: '14px 28px', height: '52px' }}>
							<span className={`font-400 text-darkgray size-3`}>cancel</span>
						</SecondaryButton>
					</div>
				</>
			)}
		</MobilePopup>
	);
};

export default DeleteDocumentConfirm;
