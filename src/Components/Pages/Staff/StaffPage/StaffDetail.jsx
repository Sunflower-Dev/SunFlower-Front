import classes from './StaffDetail.module.css';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Route, useHistory, useParams } from 'react-router-dom';

import CheckBox from '../../../UI/Inputs/CheckBox';
import SecondaryButton from '../../../UI/Bottons/SecondaryButton';
import DeletePopup from '../../../UI/Popup/Delete/DeletePopup';
import Popup from '../../../UI/Popup/Popup';
import Input from '../../../UI/Inputs/Input';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import AccessDropDown from './AccessDropDown/AccessDropDown';
import { axiosInstance } from '../../../../axios-global';
import LoadingSpinner from '../../../UI/LoadingSpinner';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Logs from '../../../Layout/Log/LogContainer';
import { toast, ToastContainer } from 'react-toastify';
import NotAuthBlur from '../../../Layout/NotAuthBlur/NotAuthBlur';

const StaffDetail = props => {
	const OnlineList = useSelector(state => state.Online.List);

	const history = useHistory();
	const { id } = useParams();

	const [StaffData, SetStaffData] = useState(null);
	const [ClientData, SetClientData] = useState(null);
	const [TaskData, SetTaskData] = useState([]);
	const [UpdateLogs, SetLogs] = useState([]);
	const [AccessData, SetAccessData] = useState([]);
	const [AccessUpdateData, SetAccessUpdateData] = useState([]);
	const [ActiveTab, setActiveTab] = useState('General');
	const [isInfoOpen, setIsInfoOpen] = useState(false);
	const [BottomLineTabWidth, SetBottomLineTabWidth] = useState('0px');
	const [IsActionVisible, setActionVisibility] = useState(false);
	const [IsActionClosing, setIsActionClosing] = useState(false);
	const [IsActionOpen, setIsActionOpen] = useState(false);
	const [IsDeletingStaff, setIsDeletingStaff] = useState(false);
	const [IsDeletingClient, setIsDeletingClient] = useState(false);
	const [IsLoading, setIsLoading] = useState(false);
	const [DeletingClientID, setDeletingClientID] = useState();
	const [ClientSearching, setClientSearching] = useState([]);
	const [AddingClientToAdmin, setAddingClientToAdmin] = useState(null);

	const TabsRef = useRef(null);

	const ClientRef = useRef(null);

	let popupref = useRef(null);
	let Actionref = useRef(null);
	const AddTaskInput = useRef(null);
	const AddTaskDateInput = useRef(null);
	const Permissions = JSON.parse(useSelector(state => state.Auth.Admin)).Permissions;

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
				const call = await axiosInstance.get('/admins/' + id);
				var response = call.data;
				SetStaffData(response.Admin);
				SetTaskData(response.Tasks);
				SetLogs(response.Logs);
				SetAccessData(response.Admin.Permissions);
				SetAccessUpdateData(response.Admin.Permissions);

				var clients = [];
				response.AvailableClients.forEach(element => {
					if (!response.Admin.Clients_IDs.find(x => x._id === element._id)) {
						clients.push(element);
					}
				});
				SetClientData(clients);

				if (window.innerWidth < 550) {
					SetBottomLineTabWidth(TabsRef.current.scrollWidth);
				}
			} catch (error) {
				console.log(error);
			}
		})();
	}, [id]);

	const showActionHandler = () => {
		if (window.innerWidth > 550) {
			setIsActionClosing(false);
			setActionVisibility(true);
		} else {
			history.push(history.location.pathname + '/EventManager');
		}
	};

	const openActionHandler = () => {
		if (IsActionOpen) {
			setIsActionOpen(false);
		} else {
			setIsActionOpen(true);
		}
	};

	const AddTaskClickHandler = () => {
		history.push(history.location.pathname + '/AddTask');
	};
	const AddClientClickHander = () => {
		history.push(history.location.pathname + '/AddClient');
	};

	const handleClickOutside = event => {
		if (IsActionVisible) {
			setIsActionClosing(true);
			setTimeout(() => {
				setActionVisibility(false);
			}, 300);
		}
	};

	const RemoveEventHandler = () => {
		history.push(history.location.pathname + '/Delete');
	};

	const DeleteClientClickHander = clientID => {
		history.push(history.location.pathname + '/DeleteClient/' + clientID);
		setDeletingClientID(clientID);
	};

	const DeleteClientRequestHandler = async () => {
		setIsDeletingClient(true);
		try {
			const call = await axiosInstance.put('/admins/DeleteClient/' + id, { ClientID: DeletingClientID });
			var response = call.data;
			if (response) {
				history.goBack();
				setIsDeletingClient(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const EditStaffHandler = () => {
		history.push('/Staff/' + id + '/Edit');
	};

	const DeleteStaffClickHandler = async () => {
		setIsDeletingStaff(true);
		try {
			const call = await axiosInstance.delete('/admins/' + id);
			var response = call.data;
			if (response) {
				setIsDeletingStaff(false);
				history.replace('/Staff');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const ClientViewFileClickHandler = id => {
		history.push('/Client/' + id);
	};

	const ClienthandleChange = event => {
		const value = event.target.value;
		if (value === '') {
			setClientSearching([]);
		} else {
			const search = ClientData.filter(x => x.Name.includes(value));
			setClientSearching(search);
		}
	};

	const SelectClientHandler = (id, name) => {
		ClientRef.current.value = name;
		setClientSearching([]);
		setAddingClientToAdmin(id);
	};

	const AddClientSubmitHandler = async () => {
		setIsLoading(true);
		if (AddingClientToAdmin) {
			try {
				const call = await axiosInstance.put('/admins/AddClient/' + id, { ClientID: AddingClientToAdmin });
				var response = call.data;
				if (response) {
					history.goBack();
					setIsLoading(false);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const AddTaskSubmitClickHandler = async () => {
		setIsLoading(true);
		try {
			const call = await axiosInstance.post('/tasks', {
				Title: AddTaskInput.current.value,
				ExpireDate: AddTaskDateInput.current.value,
				To: id,
			});
			var response = call.data;
			if (response) {
				history.goBack();
				setIsLoading(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	const PermissionUpdateHandler = (PermissionId, IsChecked, Type) => {
		var TYPE = '';
		if (Type === 'VIEW') {
			TYPE = 'View';
			PermissionId = PermissionId.replace(/-view/, '');
		} else if (Type === 'EDIT') {
			TYPE = 'Edit';
			PermissionId = PermissionId.replace(/-edit/, '');
		} else {
			TYPE = 'Delete';
			PermissionId = PermissionId.replace(/-delete/, '');
		}
		var tmp = AccessUpdateData;
		var Update = AccessUpdateData[TYPE];
		if (IsChecked) {
			Update.push(PermissionId);
		} else {
			Update = Update.filter(item => {
				return item !== PermissionId;
			});
		}
		tmp[TYPE] = Update;
		SetAccessUpdateData(tmp);
	};

	const PermissionUpdateSubmitHandler = async () => {
		setIsLoading(true);
		try {
			const call = await axiosInstance.put('/admins/UpdatePermission/' + id, AccessUpdateData);
			var response = call.data;
			if (response) {
				setIsLoading(false);
				toast.success('Permissions Updated!', {
					position: 'bottom-center',
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: 'colored',
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const TasksChangeHandler = async (id, checked) => {
		try {
			const Call = await axiosInstance.put('/tasks/ChangeStatus/' + id, { Status: checked ? 'DONE' : 'IDLE' });
		} catch (error) {
			console.log(error);
		}
	};

	return Permissions.View.includes('staff') ? (
		StaffData === null ? (
			<LoadingSpinner />
		) : StaffData === '' ? (
			'There is No Staff With This ID: ' + id
		) : (
			<div className={classes.Container}>
				{window.innerWidth < 550 && (
					<header>
						<div className={classes.MiniHeader_TitleMode}>
							<img src='/svg/arrow-left.svg' alt='back' onClick={() => history.goBack()} />
							<div className={`font-600 size-7 text-black m-a`}>Profile</div>
							<div style={{ width: '24px' }}></div>
						</div>
					</header>
				)}
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
						<div
							className={`${classes.TabItem} ${ActiveTab === 'Access' && classes.active}`}
							onClick={() => TabChangeHandler('Access')}
						>
							Access
						</div>
						<div
							className={`${classes.TabItem} ${ActiveTab === 'Status' && classes.active}`}
							onClick={() => TabChangeHandler('Status')}
						>
							Online Status
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
							<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray`}>
								{StaffData.About}
							</div>
						</div>
					</div>

					<div className={`${classes.TasksTab} ${classes.tabbody} ${ActiveTab === 'Tasks' && classes.active}`}>
						{/* {window.innerWidth > 550 ? */}
						<section>
							<div className={`${classes.BodyTitle}`}>
								<div className={`font-600 ${window.innerWidth > 550 ? 'size-14' : 'size-7'} text-black`}>Tasks</div>
								{Permissions.Edit.includes('staff') && window.innerWidth > 550 && (
									<div className={`font-400 text-darkgray ${classes.AddTaskButton}`} onClick={AddTaskClickHandler}>
										<img src='/svg/plus-gray.svg' alt='add' width={22} />
										<span>Add Task</span>
									</div>
								)}
							</div>
							<div className={`${classes.TaskContainerLarge}`}>
								{TaskData.map(
									item =>
										moment(item.ExpireDate).isAfter(moment(new Date())) && (
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
								<div className={`font-600 ${window.innerWidth > 550 ? 'size-14' : 'size-7'} text-black mb-25`}>
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
						{/* :
                                    <Tasks />
                                } */}
					</div>

					<div className={`${classes.ClientTab} ${classes.tabbody} ${ActiveTab === 'Client' && classes.active}`}>
						<div>
							<div className={`${classes.BodyTitle}`}>
								<div className={`font-600 ${window.innerWidth > 550 ? 'size-14' : ' size-7'} text-black`}>Clients </div>
								{Permissions.Edit.includes('staff') && (
									<>
										{window.innerWidth > 550 && (
											<div
												className={`font-400 text-darkgray ${classes.AddTaskButton}`}
												onClick={AddClientClickHander}
											>
												<img src='/svg/plus-gray.svg' alt='add' width={22} />
												<span>Add Client</span>
											</div>
										)}
									</>
								)}
							</div>

							{StaffData.Clients_IDs.map(item => (
								<div className={`${classes.ClientItem}`} key={item._id}>
									<img src={`${process.env.REACT_APP_SRC_URL}${item.Avatar}`} alt='logo' width='50px' />
									<div
										className={`font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-darkgray ${
											classes.ClientName
										}`}
									>
										{item.Name}{' '}
									</div>
									<div
										className={`font-400 ${window.innerWidth > 550 ? 'size-4' : 'size-1'} text-lightgray ${
											classes.ClientItemDate
										}`}
									>
										Registred : {moment(item.CreatedAt).format('DD MMMM YYYY')}
									</div>
									{window.innerWidth > 500 ? (
										<Fragment>
											{Permissions.View.includes('client') && (
												<SecondaryButton
													className={classes.ClientBTN}
													onClick={() => ClientViewFileClickHandler(item._id)}
												>
													View File
												</SecondaryButton>
											)}
											{Permissions.Edit.includes('staff') && (
												<SecondaryButton
													className={classes.ClientRowDelete}
													onClick={() => DeleteClientClickHander(item._id)}
												>
													<img src='/svg/Trash-black.svg' alt='delete' width={20} />
												</SecondaryButton>
											)}
										</Fragment>
									) : (
										Permissions.Edit.includes('staff') && (
											<img src='/svg/Trash-black.svg' alt='delete' onClick={DeleteClientClickHander} />
										)
									)}
								</div>
							))}
						</div>
					</div>

					<div className={`${classes.UpdatesTab} ${classes.tabbody} ${ActiveTab === 'Updates' && classes.active}`}>
						<div>
							<Logs type='CLIENT' style={{ animation: 'none' }} Logs={UpdateLogs} />
						</div>
					</div>

					<div className={`${classes.AccessTab} ${classes.tabbody} ${ActiveTab === 'Access' && classes.active}`}>
						{Permissions.Edit.includes('staff') ? (
							<>
								<AccessDropDown
									data={{
										Title: 'Access to views',
										SubTitle: 'manage Viewing accesses to dashboard',
										Type: 'VIEW',
									}}
									AccessData={AccessData.View}
									PermissionUpdateHandler={PermissionUpdateHandler}
								/>
								<AccessDropDown
									data={{
										Title: 'Access to edits',
										SubTitle: 'manage add and edit accesses to dashboard',
										Type: 'EDIT',
									}}
									AccessData={AccessData.Edit}
									PermissionUpdateHandler={PermissionUpdateHandler}
								/>
								<AccessDropDown
									data={{
										Title: 'Access to deletions',
										SubTitle: 'manage Delete opration accesses to dashboard',
										Type: 'DELETE',
									}}
									AccessData={AccessData.Delete}
									PermissionUpdateHandler={PermissionUpdateHandler}
								/>
								<div className={`mt-18 mb-18`}>
									<PrimaryButton IsLoading={IsLoading} onClick={PermissionUpdateSubmitHandler}>
										Save Permission Changes
									</PrimaryButton>
								</div>
							</>
						) : (
							" You Can't Edit Staff Permissions"
						)}
					</div>

					<div className={`${classes.StatusTab} ${classes.tabbody} ${ActiveTab === 'Status' && classes.active}`}>
						<div className={classes.StatusHeader}>
							<div className={`text-black font-600 ${window.innerWidth > 550 ? 'size-14' : 'size-7'}`}>Online status</div>
						</div>
						<div className={`${classes.StatusItem}`}>
							<img src={`${process.env.REACT_APP_SRC_URL}${StaffData.Avatar}`} alt='logo' />
							<div
								className={`${classes.StatusItemDate} font-500 ${
									window.innerWidth > 550 ? 'size-6' : 'size-3'
								} text-darkgray`}
							>
								{StaffData.Name}
							</div>
							{window.innerWidth > 550 ? (
								<Fragment>
									<div
										className={`${classes.StatusOnline} font-500 size-4 ${
											OnlineList.find(x => x.userID === id) ? classes.Online : classes.Offline
										}`}
									>
										{OnlineList.find(x => x.userID === id) ? 'Online' : 'Offline'}
									</div>
								</Fragment>
							) : (
								<div className={`${classes.StatusItemName} font-400 size-1 text-lightgray`}>
									Kristin Watson |
									<span
										className={`${classes.StatusOnline} ${
											OnlineList.find(x => x.userID === id) ? 'text-green' : 'text-secondaryred'
										}`}
									>
										{OnlineList.find(x => x.userID === id) ? 'Online' : 'Offline'}
									</span>
								</div>
							)}
						</div>
					</div>
				</section>

				<div className={`${window.innerWidth > 550 && classes.Card} ${classes.infoContainer}`}>
					{(Permissions.Edit.includes('staff') || Permissions.Delete.includes('staff')) && window.innerWidth > 550 && (
						<img
							src='/svg/more.svg'
							width={24}
							className={classes.StaffMore}
							alt='more'
							ref={Actionref}
							onClick={showActionHandler}
						/>
					)}
					<div className={`${classes.TopInfo}`}>
						<img src={`${process.env.REACT_APP_SRC_URL}${StaffData.Avatar}`} alt='logo' width='110px' />
						<div className={`text-black ${window.innerWidth > 550 ? 'size-9' : 'size-7'} font-600 mt-15 m-a ${classes.Name}`}>
							{StaffData.Name}
						</div>

						{window.innerWidth < 550 && (
							<div className={`${classes.Profile_Client_Age} m-a ${window.innerWidth > 550 ? 'mt-30' : 'mt-20'}`}>
								<div
									className={`text-darkgray ${window.innerWidth > 550 ? 'size-6' : 'size-2'} font-400 m-a ${
										classes.Name
									}`}
								>
									age
								</div>
								<div
									className={`text-black ${window.innerWidth > 550 ? 'size-9' : 'size-4'} font-600  m-a ${classes.Name}`}
								>
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
							<div
								className={`${OnlineList.find(x => x.userID === id) ? 'text-green' : 'text-secondaryred'} ${
									window.innerWidth > 550 ? 'size-9' : 'size-4'
								} font-600  m-a ${classes.Name}`}
							>
								{OnlineList.find(x => x.userID === id) ? 'Online' : 'Offline'}
							</div>
						</div>
					</div>

					<div className={`${classes.ProfileInfo_Grid}`}>
						{window.innerWidth > 550 && (
							<Fragment>
								<div className={`text-lightgray size-5 font-400`}>Age</div>
								<div className={`text-darkgray size-5 font-500 mr-0`}>
									{moment().diff(StaffData.BirthDate, 'years')} Years
								</div>
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
								<div
									className={`text-darkgray size-5 font-500 mr-0 text-right`}
									title={StaffData.Email}
									style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}
								>
									{StaffData.Email}
								</div>

								<div className={`text-lightgray size-5 font-400`}>Address</div>
								<div className={`text-darkgray size-5 font-500 mr-0 text-right`}>{StaffData.Address}</div>
								<div className={classes.ActionRow}>
									<SecondaryButton className={`font-500 size-6`} style={{ padding: '15px 20px', height: 'auto' }}>
										<img src='/svg/Message-ic.svg' width={22} alt='message' className={`mr-8`} />
										Message
									</SecondaryButton>
									<a href={`tel:${StaffData.PhoneNumber}`}>
										<SecondaryButton
											className={`font-500 size-6`}
											style={{ padding: '15px 20px', height: 'auto', width: '-webkit-fill-available' }}
										>
											<img src='/svg/call-black.svg' width={22} alt='message' className={`mr-8`} />
											Contact
										</SecondaryButton>
									</a>
								</div>
							</Fragment>
						) : (
							<Fragment>
								<div className={`${classes.OtherInfoItemMini} ${!isInfoOpen && classes.active}`}>
									<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Date of birth</div>
									<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>
										{moment(StaffData.BirthDate).utc().format('MMMM DD, YYYY')}
									</div>
								</div>
								{isInfoOpen && (
									<Fragment>
										<div className={classes.OtherInfoItemMini}>
											<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Nationality</div>
											<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>
												{StaffData.Nationality}
											</div>
										</div>

										<div className={classes.OtherInfoItemMini}>
											<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>preferred language</div>
											<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>
												{StaffData.Language}
											</div>
										</div>

										<div className={classes.OtherInfoItemMini}>
											<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Sex</div>
											<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>{StaffData.Sex}</div>
										</div>

										<div className={classes.OtherInfoItemMini}>
											<div className={`font-400 size-3 text-lightgray ${classes.infoTitle}`}>Phone number</div>
											<div className={`font-500 size-3 text-darkgray ${classes.infoAnswer}`}>
												{StaffData.PhoneNumber}
											</div>
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

					{window.innerWidth > 550 && (
						<div
							className={`${classes.actionContainer} ${IsActionClosing ? classes.fadeout : classes.fadein}`}
							ref={popupref}
							style={{ display: IsActionVisible ? 'flex' : 'none' }}
						>
							{Permissions.Delete.includes('staff') && (
								<div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={RemoveEventHandler}>
									<img src='/svg/trash.svg' alt='delete' /> <span>Delete Member</span>
								</div>
							)}
							{Permissions.Edit.includes('staff') && (
								<div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={EditStaffHandler}>
									<img src='/svg/edit.svg' alt='edit' /> <span>Edit Member</span>
								</div>
							)}
						</div>
					)}
				</div>

				<Route path='/Staff/:id/Detail/DeleteClient/:clientID'>
					<DeletePopup
						Title='Delete client'
						SubTitle='Are you sure you want to delete the client?'
						Type='DELETE'
						onClick={DeleteClientRequestHandler}
						IsLoading={IsDeletingClient}
					/>
				</Route>

				<Route path='/Staff/:id/Detail/Delete'>
					<DeletePopup
						Title='Delete client'
						SubTitle='Are you sure you want to delete the client?'
						Type='DELETE'
						IsLoading={IsDeletingStaff}
						onClick={DeleteStaffClickHandler}
					/>
				</Route>

				<Route path='/Staff/:id/Detail/AddTask'>
					<Popup BodyClassName={classes.AddTaskContainer}>
						<div className={classes.AddTaskHeader}>
							<div className={`font-600 size-14`}>Add Task</div>
							<img src='/svg/close.svg' alt='close' width={36} onClick={() => history.goBack()} />
						</div>

						<Input placeholder='Write your text' label='Task' type='text' ref={AddTaskInput} />
						<Input
							placeholder='Write your text'
							label='ExpireDate'
							type='datetime-local'
							className='mt-20'
							ref={AddTaskDateInput}
						/>

						<div style={{ display: 'flex', gap: '14px' }} className={`mt-40`}>
							<PrimaryButton
								style={{ padding: '14px 28px', height: 'auto' }}
								className={`size-6`}
								onClick={AddTaskSubmitClickHandler}
								IsLoading={IsLoading}
							>
								Add Task
							</PrimaryButton>
							<SecondaryButton
								style={{ padding: '14px 28px', height: 'auto' }}
								className={`size-6`}
								onClick={() => history.goBack()}
							>
								cancel
							</SecondaryButton>
						</div>
					</Popup>
				</Route>

				<Route path='/Staff/:id/Detail/AddClient'>
					<Popup BodyClassName={classes.AddTaskContainer}>
						<div className={classes.AddTaskHeader}>
							<div className={`font-600 size-14`}>Add Client</div>
							<img src='/svg/close.svg' alt='close' width={36} onClick={() => history.goBack()} />
						</div>

						<div className={classes.StaffContainer}>
							<Input
								type='text'
								placeholder='Client Name'
								label='Client Name'
								onChange={ClienthandleChange}
								name='ClientID'
								ref={ClientRef}
							/>
							{ClientSearching.length > 0 && (
								<div className={classes.InputSerachContainer}>
									{ClientSearching.map(Client => (
										<div
											key={Client._id}
											className={`text-lightgray font-400 size-5`}
											onClick={() => SelectClientHandler(Client._id, Client.Name)}
										>
											{Client.Name}
										</div>
									))}
								</div>
							)}
						</div>

						<div style={{ display: 'flex', gap: '14px' }} className={`mt-40`}>
							<PrimaryButton
								style={{ padding: '14px 28px', height: 'auto' }}
								className={`size-6`}
								onClick={AddClientSubmitHandler}
								IsLoading={IsLoading}
							>
								Add Client
							</PrimaryButton>
							<SecondaryButton
								style={{ padding: '14px 28px', height: 'auto' }}
								className={`size-6`}
								onClick={() => history.goBack()}
							>
								cancel
							</SecondaryButton>
						</div>
					</Popup>
				</Route>

				{window.innerWidth < 550 && Permissions.Edit.includes('staff') && (
					<Fragment>
						<div className={`${classes.ActionButton} ${IsActionOpen && classes.active}`} onClick={openActionHandler}>
							<img src='/svg/plus-white.svg' width={32} alt='action' />
						</div>
						<div className={`${classes.ActionContainer} ${IsActionOpen && classes.active}`}>
							<div className={`${classes.ActionItem}`} onClick={() => history.push(history.location.pathname + '/AddClient')}>
								<div className={classes.ActionItemTitle}>Client</div>
								<div className={classes.ActionItemIcon}>
									<img src='/svg/note.svg' width={24} alt='action' />
								</div>
							</div>
							<div className={`${classes.ActionItem}`} onClick={() => history.push(history.location.pathname + '/AddTask')}>
								<div className={classes.ActionItemTitle}>Tasks</div>
								<div className={classes.ActionItemIcon}>
									<img src='/svg/Task.svg' width={24} alt='action' />
								</div>
							</div>
						</div>
					</Fragment>
				)}
				<ToastContainer
					position='bottom-center'
					autoClose={2000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</div>
		)
	) : (
		<NotAuthBlur>You have not right privilages to access staff detail</NotAuthBlur>
	);
};

export default StaffDetail;
