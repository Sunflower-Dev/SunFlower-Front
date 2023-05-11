import { Fragment, useEffect, useRef, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';

import classes from './ClientProfile.module.css';
import TabView from './TabView/TabView';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../axios-global';
import LoadingSpinner from '../../../UI/LoadingSpinner';
import moment from 'moment';
import AddNote from './AddNote/AddNote';
import AddClientDocument from './AddDocument/AddDocument';
import { useSelector } from 'react-redux';
import NotAuthBlur from '../../../Layout/NotAuthBlur/NotAuthBlur';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientManager from '../../../UI/Popup/MobilePopup/ClientManager/ClientManager';
import DeletePopup from '../../../UI/Popup/Delete/DeletePopup';
import RequestDeleteDocument from '../../../UI/Popup/RequestDeleteDocument/RequestDeleteDocument';
import DeleteDocumentConfirm from '../../../UI/Popup/DeleteDocumentConfirm/DeleteDocumentConfirm';
import NewSchedule from '../../Calender/NewSchedule/NewSchedule';
import AddMedicine from './AddMedicine/AddMedicine';

const ClientProfile = props => {
	const [isInfoOpen, setIsInfoOpen] = useState(false);
	const [IsActionOpen, setIsActionOpen] = useState(false);
	const [Client, SetClient] = useState(null);
	const [Schedules, SetSchedules] = useState(null);
	const [Notes, SetNotes] = useState(null);
	const [Logs, SetLogs] = useState(null);
	const [IsAvatarUploading, SetIsAvatarUploading] = useState(false);
	const [IsDeleting, SetIsDeleting] = useState(false);
	const [Avatar, SetAvatar] = useState('');
	const [Progress, setProgress] = useState(0);

	const history = useHistory();
	const { id, MedicineId } = useParams();
	const Permissions = JSON.parse(useSelector(state => state.Auth.Admin)).Permissions;

	let popupref = useRef(null);
	let Actionref = useRef(null);

	const [IsActionVisible, setActionVisibility] = useState(false);
	const [IsActionClosing, setIsActionClosing] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/Clients/' + id);
				var response = call.data;
				SetClient(response.Client);
				SetAvatar(response.Client.Avatar);
				SetSchedules(response.Schedules);
				SetNotes(response.Notes);
				SetLogs(response.Logs);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [id]);

	const showActionHandler = () => {
		setIsActionClosing(false);
		setActionVisibility(true);
	};

	const ShowExtraInfoHandler = () => {
		if (isInfoOpen) {
			setIsInfoOpen(false);
		} else {
			setIsInfoOpen(true);
		}
	};

	const openActionHandler = () => {
		if (IsActionOpen) {
			setIsActionOpen(false);
		} else {
			setIsActionOpen(true);
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

	const AvatarClickHandler = async event => {
		try {
			SetIsAvatarUploading(true);
			const formData = new FormData();
			formData.append('File', event.target.files[0]);

			const call = await axiosInstance({
				method: 'POST',
				url: '/clients/ChangeAvatar/' + id,
				data: formData,
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: progressEvent => {
					const progress = (progressEvent.loaded / progressEvent.total) * 100;
					setProgress(parseInt(progress) + '%');
				},
				onDownloadProgress: progressEvent => {
					const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
					setProgress(parseInt(progress) + '%');
				},
			});
			if (call) {
				SetIsAvatarUploading(false);
				SetAvatar(call.data.Avatar);
				toast.success('Avatar Updated!', {
					position: 'bottom-center',
					autoClose: 2500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const onDeleteClientClickHandler = async () => {
		if (Permissions.Delete.includes('client')) {
			SetIsDeleting(true);
			try {
				const call = await axiosInstance.delete('/clients/' + id);
				var response = call.data;
				SetIsDeleting(false);
				history.go(-2);
			} catch (error) {
				console.log(error);
			}
		}
	};
	const onDeleteMedicineClickHandler = async () => {
		if (Permissions.Edit.includes('client')) {
			SetIsDeleting(true);
			try {
				const call = await axiosInstance.delete('/clients/DeleteMedicine/' + id + '/' + MedicineId);
				var response = call.data;
				SetIsDeleting(false);
				history.go(-1);
			} catch (error) {
				console.log(error);
			}
		}
	};
	return Client === null ? (
		<LoadingSpinner />
	) : (
		<Fragment>
			{window.innerWidth > 550 ? (
				<div className={classes.TopGrid}>
					<div className={classes.InfoContainer}>
						<div className={classes.Info}>
							<div className={classes.SimpleInfo}>
								<div className={classes.profileName}>
									{IsAvatarUploading ? (
										<div
											style={{
												gridRow: '1/3',
												position: 'relative',
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											<LoadingSpinner />
											<span style={{ position: 'absolute', top: '44%' }}>{Progress}</span>
										</div>
									) : (
										<img src={`${process.env.REACT_APP_SRC_URL}${Avatar}`} width='90px' alt='client_logo' />
									)}
									<div className={`font-400 size-6 text-darkgray ${classes.NameTitle}`}>Name</div>
									<div className={`font-600 size-9 text-black ${classes.Name}`}>{Client.Name}</div>
								</div>
								<div className={classes.restProfileInfo}>
									<div className={`font-400 size-6 text-darkgray ${classes.NameTitle}`}>Age</div>
									<div className={`font-400 size-6 text-darkgray ${classes.NameTitle}`}>Sex</div>
									<div className={`font-400 size-6 text-darkgray ${classes.NameTitle}`}>Status</div>

									<div className={`font-600 size-9 text-black ${classes.Name}`}>
										{moment().diff(Client.BirthDate, 'years')} Years
									</div>
									<div className={`font-600 size-9 text-black ${classes.Name}`}>{Client.Sex}</div>
									<div
										className={`font-600 size-9 ${
											Client.Status === 'Active Client'
												? 'text-green'
												: Client.Status === 'None'
												? 'text-orange'
												: 'text-secondaryred'
										} ${classes.Name}`}
									>
										{Client.Status === 'Status None' ? 'None' : Client.Status}
									</div>
								</div>
							</div>

							<div className={classes.OtherInfo}>
								<div>
									<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>Date of birth</div>
									<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>
										{moment(Client.BirthDate).format('MMMM DD, YYYY')}
									</div>

									<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>Nationality</div>
									<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>{Client.Nationality}</div>

									<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>preferred languagee</div>
									<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>{Client.Language}</div>

									<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>Pronouns</div>
									<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>{Client.Pronouns}</div>

									<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>NDIS number</div>
									<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>{Client.NDIS}</div>

									<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>Aboriginal?</div>
									<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>{Client.Aboriginal}</div>
								</div>

								<div className={classes.divider}></div>

								<div>
									<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>Phone number</div>
									<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>{Client.PhoneNumber}</div>

									<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>Emergency contact</div>
									<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>{Client.EmergencyContact}</div>

									<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>Email</div>
									<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>{Client.Email}</div>

									{Client.PreferredName && (
										<>
											<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>Preferred Name</div>
											<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>
												{Client.PreferredName}
											</div>
										</>
									)}

									<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>Communication Help</div>
									<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>{Client.Communication}</div>

									<div className={`font-400 size-5 text-lightgray ${classes.infoTitle}`}>Address</div>
									<div className={`font-500 size-5 text-darkgray ${classes.infoAnswer}`}>{Client.Address}</div>
								</div>
							</div>
							{(Permissions.Edit.includes('client') || Permissions.Delete.includes('client')) && (
								<>
									<img
										src='/svg/kebab-menu.svg'
										alt='actions'
										ref={Actionref}
										className={classes.Action}
										onClick={showActionHandler}
									/>

									{window.innerWidth > 550 && (
										<div
											className={`${classes.actionContainer} ${IsActionClosing ? classes.fadeout : classes.fadein}`}
											ref={popupref}
											style={{ display: IsActionVisible ? 'flex' : 'none' }}
										>
											{Permissions.Edit.includes('client') && (
												<div className={`${classes.ActionItem} size-5 font-400 text-lightgray`}>
													<label
														htmlFor='Client_Avatar'
														style={{
															display: 'flex',
															gap: '8px',
															cursor: 'pointer',
														}}
													>
														<img src='/svg/profile.svg' alt='edit' width={20} style={{ opacity: '0.8' }} />{' '}
														<span>Change Avatar</span>
													</label>
													<input
														type='file'
														id='Client_Avatar'
														style={{ display: 'none' }}
														accept='image/*'
														onChange={AvatarClickHandler}
													/>
												</div>
											)}

											{Permissions.Delete.includes('client') && (
												<div
													className={`${classes.ActionItem} size-5 font-400 text-lightgray`}
													onClick={() => history.push('/Client/' + id + '/Delete')}
												>
													<img src='/svg/trash.svg' alt='delete' /> <span>Delete client</span>
												</div>
											)}

											{Permissions.Edit.includes('client') && (
												<div
													className={`${classes.ActionItem} size-5 font-400 text-lightgray`}
													onClick={() => history.push(history.location.pathname + '/Edit')}
												>
													<img src='/svg/edit.svg' alt='edit' /> <span>Edit client</span>
												</div>
											)}
										</div>
									)}
								</>
							)}
						</div>

						{Client.Alerts.length > 1 && (
							<div className={classes.AlertContainer}>
								<img src='/svg/alert-circlered.svg' className={`mr-8`} alt='alert' />
								<span className={`font-500 size-8 text-secondaryred`}>Alerts:</span>
								<div className={`font-400 size-6 text-lightgray`}>{Client.Alerts}</div>
							</div>
						)}
					</div>

					<div className={classes.CareGiver}>
						<div className={classes.CareGiverList}>
							<div className={`text-black font-600 size-14 mb-10`}>Support team</div>
							{Client.Admins.map(item => (
								<div className={classes.CareGiverItem} key={item._id}>
									<img alt='caregiverAvatar' src={`${process.env.REACT_APP_SRC_URL}${item.Avatar}`} width={40} />
									<div className={classes.CaregiverName}>{item.Name}</div>
									<div className={classes.CaregiverStatus}>Is caregiver </div>
								</div>
							))}
						</div>

						{Permissions.Edit.includes('client-report') && (
							<button className={classes.reportButton} onClick={() => history.push('/Client/' + id + '/AddReport')}>
								<img src='/svg/alert-circlered.svg' className={`mr-8`} alt='alert' />
								<span className={`font-500 size-6 text-secondaryred`}>Client report</span>
							</button>
						)}
					</div>
				</div>
			) : (
				<Fragment>
					<div className={classes.HeaderMini}>
						<img src='/svg/arrow-left.svg' alt='back' onClick={() => history.goBack()} />
						<div className={`font-600 size-7 text-black `}>{Client.Name}</div>
						<img src='/svg/kebab-menu.svg' alt='back' onClick={() => history.push(history.location.pathname + '/Manage')} />

						<img src={`${process.env.REACT_APP_SRC_URL}${Avatar}`} width='80px' alt='client_logo' />
					</div>
					<div className={`${classes.restProfileInfo} mt-34`}>
						<div className={`font-400 size-3 text-darkgray ${classes.NameTitle}`}>Age</div>
						<div className={`font-400 size-3 text-darkgray ${classes.NameTitle}`}>Sex</div>
						<div className={`font-400 size-3 text-darkgray ${classes.NameTitle}`}>Status</div>

						<div className={`font-600 size-6 text-black ${classes.Name}`}>{moment().diff(Client.BirthDate, 'years')} Years</div>
						<div className={`font-600 size-6 text-black ${classes.Name}`}>{Client.Sex}</div>
						<div
							className={`font-600 size-6 ${
								Client.Status === 'Active Client'
									? 'text-green'
									: Client.Status === 'None'
									? 'text-orange'
									: 'text-secondaryred'
							} ${classes.Name}`}
						>
							{Client.Status === 'Status None' ? 'None' : Client.Status}
						</div>
					</div>

					<div className={`${classes.OtherInfo} ${isInfoOpen ? classes.OpenInfo : classes.CloseInfo}`}>
						<div className={`font-600 size-4 text-black mb-8`}>Information</div>
						<div className={`${classes.OtherInfoItemMini} ${!isInfoOpen && classes.active}`}>
							<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Date of birth</div>
							<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>
								{moment(Client.BirthDate).format('MMMM DD, YYYY')}
							</div>
						</div>
						{isInfoOpen && (
							<Fragment>
								<div className={classes.OtherInfoItemMini}>
									<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Nationality</div>
									<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{Client.Nationality}</div>
								</div>

								<div className={classes.OtherInfoItemMini}>
									<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>preferred language</div>
									<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{Client.Language}</div>
								</div>

								<div className={classes.OtherInfoItemMini}>
									<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Pronouns</div>
									<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{Client.Pronouns}</div>
								</div>

								<div className={classes.OtherInfoItemMini}>
									<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>NDIS number</div>
									<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{Client.NDIS}</div>
								</div>

								<div className={classes.OtherInfoItemMini}>
									<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Phone number</div>
									<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{Client.PhoneNumber}</div>
								</div>

								<div className={classes.OtherInfoItemMini}>
									<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Emergency contact</div>
									<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{Client.EmergencyContact}</div>
								</div>

								<div className={classes.OtherInfoItemMini}>
									<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Email</div>
									<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{Client.Email}</div>
								</div>

								{Client.PreferredName && (
									<div className={classes.OtherInfoItemMini}>
										<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>preferred Name</div>
										<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{Client.PreferredName}</div>
									</div>
								)}

								<div className={classes.OtherInfoItemMini}>
									<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Communication Help</div>
									<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{Client.Communication}</div>
								</div>

								<div className={classes.OtherInfoItemMini}>
									<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Aboriginal?</div>
									<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{Client.Aboriginal}</div>
								</div>

								<div className={classes.OtherInfoItemMini}>
									<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Address</div>
									<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{Client.Address}</div>
								</div>
							</Fragment>
						)}

						<div className={`${classes.OtherInfoShowMore} ${isInfoOpen && classes.active}`}>
							{isInfoOpen ? <div></div> : '....'}
							<img src='/svg/arrow-right.svg' alt='expander' onClick={ShowExtraInfoHandler} />
						</div>
					</div>

					{Client.Alerts.length > 1 && (
						<div className={classes.AlertContainer}>
							<img src='/svg/alert-rectred.svg' alt='alert' />
							<span className={`font-500 size-3 text-secondaryred`}>Alerts:</span>
							<div className={`font-400 size-3 text-lightgray`}>{Client.Alerts}</div>
						</div>
					)}

					<div className={`${classes.ActionButton} ${IsActionOpen && classes.active}`} onClick={openActionHandler}>
						<img src='/svg/plus-white.svg' width={32} alt='action' />
					</div>
					<div className={`${classes.ActionContainer} ${IsActionOpen && classes.active}`}>
						<div className={`${classes.ActionItem}`} onClick={() => history.push(history.location.pathname + '/AddNote')}>
							<div className={classes.ActionItemTitle}>Note</div>
							<div className={classes.ActionItemIcon}>
								<img src='/svg/note.svg' width={24} alt='action' />
							</div>
						</div>
						<div className={`${classes.ActionItem}`} onClick={() => history.push(history.location.pathname + '/AddSchedule')}>
							<div className={classes.ActionItemTitle}>Schedule</div>
							<div className={classes.ActionItemIcon}>
								<img src='/svg/chat.svg' width={24} alt='action' />
							</div>
						</div>
						<div className={`${classes.ActionItem}`} onClick={() => history.push(history.location.pathname + '/AddDocument')}>
							<div className={classes.ActionItemTitle}>Documents</div>
							<div className={classes.ActionItemIcon}>
								<img src='/svg/attachment.svg' width={24} alt='action' />
							</div>
						</div>
					</div>
				</Fragment>
			)}
			<TabView Client={Client} Schedules={Schedules} Notes={Notes} Logs={Logs} />
			{window.innerWidth > 550 && (
				<>
					<Route path='/Client/:id/AddNote'>
						<AddNote type='NEW' Page='Client' />
					</Route>
					<Route path='/Client/:id/EditNote/:NoteID'>
						<AddNote type='EDIT' Page='Client' />
					</Route>

					<Route path='/Client/:id/AddDocument'>
						<AddClientDocument Type='Client' />
					</Route>
				</>
			)}
			{(!Permissions.View.includes('client') || !Permissions.View.includes('client')) && (
				<NotAuthBlur>You have Not Right Privileges to access Client Detail</NotAuthBlur>
			)}
			<ToastContainer
				position='bottom-center'
				autoClose={2500}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='colored'
			/>
			{window.innerWidth < 550 && (
				<>
					<Route path={'/Client/:id/Manage'}>
						<ClientManager SetAvatar={SetAvatar} />
					</Route>
				</>
			)}

			<Route path={'/Client/:id/Delete'}>
				<DeletePopup
					Title='Delete client'
					IsLoading={IsDeleting}
					onClick={onDeleteClientClickHandler}
					SubTitle='Are you sure you want to delete the client?'
				/>
			</Route>
			<Route path={'/Client/:id/DeleteDocument/:DocumentId'}>
				{Permissions.Delete.includes('client-document') ? (
					<DeleteDocumentConfirm get='/Clients/GetDocumentRequests/' delete='/clients/DeleteDocumentConfirm/' />
				) : (
					<RequestDeleteDocument urlPost='/clients/RequestDeleteDocument/' />
				)}
			</Route>
			<Route path='/Client/:id/AddSchedule'>
				<NewSchedule type='NEW' />
			</Route>
			<Route path='/Client/:id/AddMedicine'>
				<AddMedicine />
			</Route>
			<Route path={'/Client/:id/DeleteMedicine/:MedicineId'}>
				<DeletePopup
					Title='Delete medicine'
					IsLoading={IsDeleting}
					onClick={onDeleteMedicineClickHandler}
					SubTitle='Are you sure you want to delete this medicine?'
				/>
			</Route>
		</Fragment>
	);
};
export default ClientProfile;
