import { Fragment, useEffect, useRef, useState } from 'react';
import Logs from '../../Layout/Log/LogContainer';
import SecondaryButton from '../../UI/Bottons/SecondaryButton';
import CheckBox from '../../UI/Inputs/CheckBox';
import classes from './Profile.module.css';
import { axiosInstance } from '../../../axios-global';
import LoadingSpinner from '../../UI/LoadingSpinner';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { AuthActions } from '../../../store';

const Profile = () => {
	const [ActiveTab, setActiveTab] = useState('General');
	const [isInfoOpen, setIsInfoOpen] = useState(false);
	const TabsRef = useRef(null);
	const [BottomLineTabWidth, SetBottomLineTabWidth] = useState('0px');
	const [StaffData, SetStaffData] = useState(null);
	const [UpdateLogs, SetLogs] = useState([]);
	const [TaskData, SetTaskData] = useState([]);

	const [IsAvatarUploading, SetIsAvatarUploading] = useState(false);
	const [Avatar, SetAvatar] = useState('');
	const [Progress, setProgress] = useState(0);

	const dispatch = useDispatch();

	const TabChangeHandler = Tab => {
		setActiveTab(Tab);
	};

	const ShowExtraInfoHandler = () => {
		if (isInfoOpen) {
			setIsInfoOpen(false);
		} else {
			setIsInfoOpen(true);
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/admins/myprofile');
				var response = call.data;
				SetStaffData(response.Admin);
				SetTaskData(response.Tasks);
				SetLogs(response.Logs);
				SetAvatar(response.Admin.Avatar);

				if (window.innerWidth < 550) {
					setTimeout(() => {
						SetBottomLineTabWidth(TabsRef.current.scrollWidth);
					}, 20);
				}
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const AvatarClickHandler = async event => {
		try {
			SetIsAvatarUploading(true);
			const formData = new FormData();
			formData.append('File', event.target.files[0]);

			const call = await axiosInstance({
				method: 'POST',
				url: '/admins/ChangeMyAvatar',
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
				dispatch(AuthActions.UpdateAvatar({ Avatar: call.data.Avatar }));
			}
		} catch (error) {
			console.log(error);
		}
	};

	const TasksChangeHandler = async (id, checked) => {
		try {
			const Call = await axiosInstance.put('/tasks/ChangeStatus/' + id, {
				Status: checked ? 'DONE' : 'IDLE',
			});
		} catch (error) {
			console.log(error);
		}
	};

	return StaffData === null ? (
		<LoadingSpinner />
	) : (
		<div className={classes.Container}>
			<section style={{ height: window.innerWidth > 550 && '100%' }}>
				<div className={`${classes.Tabs}`} ref={TabsRef}>
					<div
						className={`${classes.TabItem} ${ActiveTab === 'General' && classes.active}`}
						onClick={() => TabChangeHandler('General')}
					>
						General information
					</div>
					<div
						className={`${classes.TabItem} ${ActiveTab === 'Tasks' && classes.active}`}
						onClick={() => TabChangeHandler('Tasks')}
					>
						Tasks
					</div>
					<div
						className={`${classes.TabItem} ${ActiveTab === 'Client' && classes.active}`}
						onClick={() => TabChangeHandler('Client')}
					>
						Client
					</div>
					<div
						className={`${classes.TabItem} ${ActiveTab === 'Updates' && classes.active}`}
						onClick={() => TabChangeHandler('Updates')}
					>
						Updates
					</div>
					{window.innerWidth < 550 && (
						<Fragment>
							<div></div>
							<div className={classes.tabLine} style={{ width: BottomLineTabWidth }}></div>
						</Fragment>
					)}
				</div>

				<div className={`${classes.GeneralTab} ${classes.tabbody} ${ActiveTab === 'General' && classes.active}`}>
					<div className={`${classes.Card}`}>
						<div className={`${window.innerWidth > 550 ? 'font-600 size-14 mb-25' : 'font-700 size-7 mb-10'} text-black`}>
							About the members{' '}
						</div>
						<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray`}>{StaffData.About}</div>
					</div>
				</div>
				<div className={`${classes.TasksTab} ${classes.tabbody} ${ActiveTab === 'Tasks' && classes.active}`}>
					{/* {window.innerWidth > 550 ? */}
					<section>
						<div className={`font-600 text-black ${window.innerWidth > 550 ? 'size-14' : 'size-7'}`}>Tasks</div>
						<div className={`${classes.TaskContainerLarge}`}>
							{TaskData.map(
								item =>
									moment(item.ExpireDate).isSameOrAfter(moment(new Date())) && (
										<CheckBox
											key={item._id}
											className={`${classes.CheckBox_white}`}
											ID={item._id}
											onChange={TasksChangeHandler}
										>
											{item.Title}
										</CheckBox>
									),
							)}
						</div>
						<div className={`${classes.Card} ${classes.TaskContainerMini} mt-30`}>
							<div className={`font-600 text-black mb-25 ${window.innerWidth > 550 ? 'size-14' : 'size-7'}`}>
								Unfinished tasks
							</div>
							<div className={`${classes.tasksgap}`}>
								{TaskData.map(
									item =>
										moment(item.ExpireDate).isBefore(moment(new Date())) && (
											<CheckBox
												key={item._id}
												className={`${classes.CheckBox_gray}`}
												ID={item._id}
												onChange={TasksChangeHandler}
											>
												{item.Title}
											</CheckBox>
										),
								)}
							</div>
						</div>
					</section>
				</div>

				<div className={`${classes.ClientTab} ${classes.tabbody} ${ActiveTab === 'Client' && classes.active}`}>
					<div className={``}>
						<div className={`font-600 ${window.innerWidth > 550 ? 'size-14 mb-25' : ' size-7 mb-15'} text-black`}>Clients </div>

						{StaffData.Clients_IDs.map(item => (
							<div className={`${classes.ClientItem}`} key={item._id}>
								<img src='/images/profile_icon.png' alt='logo' width='50px' />
								<div
									className={`font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-darkgray ${
										classes.ClientName
									}`}
								>
									{item.Name}
								</div>
								<div
									className={`font-400 ${window.innerWidth > 550 ? 'size-4' : 'size-1'} text-lightgray ${
										classes.ClientItemDate
									}`}
								>
									{moment(item.CreatedAt).format('DD MMMM YYYY')}
								</div>
								<Link to={'/Client/' + item._id} className={classes.ClientBTN}>
									<SecondaryButton>View File</SecondaryButton>
								</Link>
							</div>
						))}
					</div>
				</div>

				<div className={`${classes.UpdatesTab} ${classes.tabbody} ${ActiveTab === 'Updates' && classes.active}`}>
					<div>
						<Logs type='CLIENT' style={{ animation: 'none' }} Logs={UpdateLogs} />
					</div>
				</div>
			</section>

			<div className={`${window.innerWidth > 550 && classes.Card} ${classes.infoContainer}`}>
				<div className={`${classes.TopInfo}`}>
					{IsAvatarUploading ? (
						window.innerWidth > 550 ? (
							<div
								style={{
									gridRow: '1',
									gridColumn: '1/3',
									position: 'relative',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<LoadingSpinner />
								<span style={{ position: 'absolute', top: '44%' }}>{Progress}</span>
							</div>
						) : (
							<div
								style={{
									gridRow: 'unset',
									gridColumn: 'unset',
									position: 'absolute',
									top: '-66px',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									left: 0,
									right: 0,
								}}
							>
								<LoadingSpinner
									style={{
										background: '#fff',
										borderRadius: '50px',
										boxShadow: '0px 2px 20px rgb(40 42 62 / 4%)',
									}}
								/>
								<span style={{ position: 'absolute', top: '44%' }}>{Progress}</span>
							</div>
						)
					) : (
						<img
							src={`${process.env.REACT_APP_SRC_URL}${Avatar}`}
							width={window.innerWidth > 550 ? 110 : 80}
							height={window.innerWidth > 550 ? 110 : 80}
							alt='avatar'
						/>
					)}
					<div className={`text-black ${window.innerWidth > 550 ? 'size-9' : 'size-7'} font-600 mt-15 m-a ${classes.Name}`}>
						{StaffData.Name}

						<SecondaryButton type='button'>
							<label
								htmlFor='Client_Avatar'
								style={{
									display: 'flex',
									gap: '8px',
									cursor: 'pointer',
									alignItems: 'center',
								}}
							>
								<img src='/svg/profile.svg' alt='edit' width={20} style={{ opacity: '0.8' }} /> <span>Change Avatar</span>
							</label>
							<input
								type='file'
								id='Client_Avatar'
								style={{ display: 'none' }}
								accept='image/*'
								onChange={AvatarClickHandler}
							/>
						</SecondaryButton>
					</div>

					{window.innerWidth < 550 && (
						<div className={`${classes.Profile_Client_Age} m-a ${window.innerWidth > 550 ? 'mt-30' : 'mt-20'}`}>
							<div className={`text-darkgray ${window.innerWidth > 550 ? 'size-6' : 'size-2'} font-400 m-a ${classes.Name}`}>
								age
							</div>
							<div className={`text-black ${window.innerWidth > 550 ? 'size-9' : 'size-4'} font-600  m-a ${classes.Name}`}>
								{moment().diff(StaffData.BirthDate, 'years')} Years
							</div>
						</div>
					)}
					<div className={`${classes.Profile_Client_Counter_Container} m-a ${window.innerWidth > 550 ? 'mt-30' : 'mt-20'}`}>
						<div className={`text-darkgray ${window.innerWidth > 550 ? 'size-6' : 'size-2'} font-400 m-a ${classes.Name}`}>
							Clients
						</div>
						<div className={`text-black ${window.innerWidth > 550 ? 'size-9' : 'size-4'} font-600  m-a ${classes.Name}`}>
							{StaffData.Clients_IDs.length} clients
						</div>
					</div>
					<div className={`${classes.Profile_Status} m-a ${window.innerWidth > 550 ? 'mt-30' : 'mt-20'}`}>
						<div className={`text-darkgray ${window.innerWidth > 550 ? 'size-6' : 'size-2'} font-400 m-a ${classes.Name}`}>
							Status
						</div>
						<div className={`text-green ${window.innerWidth > 550 ? 'size-9' : 'size-4'} font-600  m-a ${classes.Name}`}>
							Online
						</div>
					</div>
				</div>

				<div className={`${classes.ProfileInfo_Grid}`}>
					{window.innerWidth > 550 && (
						<Fragment>
							<div className={`text-lightgray size-5 font-400`}>Age</div>
							<div className={`text-darkgray size-5 font-500 mr-0`}>{moment().diff(StaffData.BirthDate, 'years')} Years</div>
						</Fragment>
					)}
					{window.innerWidth > 550 ? (
						<Fragment>
							<div className={`text-lightgray size-5 font-400`}>Sex</div>
							<div className={`text-darkgray size-5 font-500 mr-0`}>{StaffData.Sex}</div>

							<div className={`text-lightgray size-5 font-400`}>Nationality</div>
							<div className={`text-darkgray size-5 font-500 mr-0`}>{StaffData.Nationality}</div>

							<div className={`text-lightgray size-5 font-400`}>Preferred language</div>
							<div className={`text-darkgray size-5 font-500 mr-0`}>{StaffData.Language}</div>

							<div className={`text-lightgray size-5 font-400`}>Phone number</div>
							<div className={`text-darkgray size-5 font-500 mr-0`}>{StaffData.PhoneNumber}</div>

							<div className={`text-lightgray size-5 font-400`}>Email</div>
							<div className={`text-darkgray size-5 font-500 mr-0 ${classes.truncateText}`}>{StaffData.Email}</div>

							<div className={`text-lightgray size-5 font-400`}>Address</div>
							<div className={`text-darkgray size-5 font-500 mr-0 text-right`}>{StaffData.Address}</div>
						</Fragment>
					) : (
						<Fragment>
							<div className={`${classes.OtherInfoItemMini} ${!isInfoOpen && classes.active}`}>
								<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Date of birth</div>
								<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>
									{moment(StaffData.BirthDate).format('MMMM DD, YYYY')}
								</div>
							</div>
							{isInfoOpen && (
								<Fragment>
									<div className={classes.OtherInfoItemMini}>
										<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Sex</div>
										<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{StaffData.Sex}</div>
									</div>

									<div className={classes.OtherInfoItemMini}>
										<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Nationality</div>
										<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{StaffData.Nationality}</div>
									</div>

									<div className={classes.OtherInfoItemMini}>
										<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Referred language</div>
										<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{StaffData.Language}</div>
									</div>

									<div className={classes.OtherInfoItemMini}>
										<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Phone number</div>
										<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{StaffData.PhoneNumber}</div>
									</div>

									<div className={classes.OtherInfoItemMini}>
										<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Email</div>
										<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{StaffData.Email}</div>
									</div>

									<div className={classes.OtherInfoItemMini}>
										<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Address</div>
										<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{StaffData.Address}</div>
									</div>
								</Fragment>
							)}

							<div className={`${classes.OtherInfoShowMore} ${isInfoOpen && classes.active}`}>
								{isInfoOpen ? <div></div> : '....'}
								<img src='/svg/arrow-right.svg' alt='expander' onClick={ShowExtraInfoHandler} />
							</div>
						</Fragment>
					)}
				</div>
			</div>

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
		</div>
	);
};

export default Profile;
