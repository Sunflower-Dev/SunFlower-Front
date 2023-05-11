import { Fragment, useEffect, useState } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Header from './Components/Layout/Header/Header';
import Sidebar from './Components/Layout/Sidebar/Sidebar';
import Dashboard from './Components/Pages/Dashboard/Dashboard';

import Login from './Components/Pages/Login/Login';
import Navbar from './Components/Layout/Navbar/Navbar';
import LogPage from './Components/Pages/Dashboard/Logs/Logs';
import Calender from './Components/Pages/Calender/Calender';
import ClientList from './Components/Pages/Client/ClientList';
import ClientProfile from './Components/Pages/Client/ClientProfile/ClientProfile';
import NotificationList from './Components/Pages/Notification/NotificationList';
import Notification from './Components/Pages/Notification/Notification';
import Setting from './Components/Pages/Setting/Setting';
import Profile from './Components/Pages/Profile/Profile';
import Chat, { ChatPage } from './Components/Pages/Chat/Chat';
import { ChangePasswordSetting, UpdatePermissions, MoreSetting } from './Components/Pages/Setting/SettingItem';
import LogFilter from './Components/Pages/Dashboard/Logs/Filter/LogFilter';
import NewSchedule from './Components/Pages/Calender/NewSchedule/NewSchedule';
import StaffList from './Components/Pages/Staff/StaffList/StaffList';
import StaffDetail from './Components/Pages/Staff/StaffPage/StaffDetail';
import Courses from './Components/Pages/Courses/Courses';
import CourseBody from './Components/Pages/Courses/CourseBody';
import Chapter from './Components/Pages/Courses/Chapter';
import AddClient from './Components/Pages/Client/AddClient/AddClient';
import AddStaff from './Components/Pages/Staff/AddStaff/AddStaff';
import io from 'socket.io-client';
import { OnlineActions } from './store';
import OnlineOffice from './Components/Pages/OnlineOffice/OnlineOffice';
import AddTrainning from './Components/Pages/Courses/AddTrainning/AddTrainning';
import Service from './Components/Pages/OnlineOffice/Service/Service';
import AddNote from './Components/Pages/Client/ClientProfile/AddNote/AddNote';
import AddClientDocument from './Components/Pages/Client/ClientProfile/AddDocument/AddDocument';
import MobileNote from './Components/Pages/Client/ClientProfile/MobileNote/MobileNote';
import EditExam from './Components/Pages/Courses/EditExam/EditExam';
import AddClientReport from './Components/Pages/Client/Report/AddClientReport/AddClientReport';
import ClientReport from './Components/Pages/Client/Report/ClientReport/ClientReport';
import TakeExam from './Components/Pages/Courses/TakeExam/TakeExam';
import ExamPassed from './Components/Pages/Courses/ExamPassed/ExamPassed';
import AddService from './Components/Pages/OnlineOffice/AddService/AddService';
import Certificate from './Components/Pages/Courses/Certificate/Certificate';

const socket = io(process.env.REACT_APP_BASE_URL, {
	transports: ['websocket'],
});

const App = () => {
	const dispatch = useDispatch();
	const [NotifBody, SetNotifBody] = useState(null);
	const [NotifClosing, SetNotifClosing] = useState(false);

	const IsLoggedin = useSelector(state => state.Auth.Token);
	const _id = useSelector(state => state.Auth._id);
	const FontSize = useSelector(state => state.Theme.FontSize);

	const location = useLocation();

	useEffect(() => {
		if (IsLoggedin) {
			socket.emit('join', _id);
			socket.on('OnlineStatus', args => {
				dispatch(OnlineActions.Update({ data: args }));
			});

			socket.on(_id, args => {
				dispatch(OnlineActions.UpdateUnseenMessage({ HaveUnseenMessage: true }));
			});

			socket.on('NewNotification', args => {
				dispatch(OnlineActions.UpdateUnseenNotif({ HaveUnseenNotif: true }));
				SetNotifBody(args);
				setTimeout(() => {
					SetNotifClosing(true);

					setTimeout(() => {
						SetNotifBody(null);
						SetNotifClosing(false);
					}, 1000);
				}, 3000);
			});

			return () => {
				// socket.emit('disconnect', IsLoggedin);
				socket.off();
			};
		}
	}, [IsLoggedin, dispatch, _id]);

	if (FontSize === 16) {
		import('./global-font/16px.css');
	}
	if (FontSize === 17) {
		import('./global-font/17px.css');
	}
	if (FontSize === 18) {
		import('./global-font/18px.css');
	}
	return (
		<Fragment>
			{!IsLoggedin && (
				<Fragment>
					<Route path='*'>
						<Redirect to='/Login' />
					</Route>
					<Route path='/Login'>
						<Login />
					</Route>
				</Fragment>
			)}

			{IsLoggedin && window.innerWidth <= 550 && <Navbar />}
			{IsLoggedin &&
				(location.pathname.includes('/TakeExam') ||
				location.pathname.includes('/ExamPassed') ||
				location.pathname.includes('Certificate') ? (
					<>
						<Route path={'/TakeExam/:id'}>
							<TakeExam />
						</Route>
						<Route path={'/ExamPassed/:id'}>
							<ExamPassed />
						</Route>
						<Route path='/Certificate/:id' component={Certificate} />
					</>
				) : (
					<div className='container'>
						{NotifBody && (
							<div className={`notif-container ${NotifClosing && 'Disappearing'}`}>
								<img src={`/svg/Notifs/${NotifBody.Type}.svg`} alt='' width={50} />
								<div className='notif--Title'>{NotifBody.Title}</div>
								<div className='notif--Body'>{NotifBody.Body}</div>
							</div>
						)}

						{window.innerWidth > 550 && <Sidebar />}
						<div className='body'>
							<Header />

							<div className='scroll-container'>
								<Route path='/Login'>
									<Redirect to='/Dashboard' />
								</Route>
								<Route path='/' exact>
									<Redirect to='/Dashboard' />
								</Route>

								<Route path={['/Notifications', '/Notifications/Add']} exact>
									<NotificationList />
								</Route>
								<Route path={['/Notifications/item/:id', '/Notifications/item/:id/Delete']} exact>
									<Notification />
								</Route>

								<Route path='/Profile' exact>
									<Profile />
								</Route>

								<Route path='/Messages' exact={window.innerWidth < 550 ? true : false}>
									<Chat socket={socket} />
								</Route>
								{window.innerWidth < 550 && (
									<Route path='/Messages/:id'>
										<ChatPage socket={socket} />
									</Route>
								)}

								<Route
									path={['/Dashboard', '/Dashboard/deleteEvent', '/Dashboard/Sidebar', '/Dashboard/EventManager']}
									exact
								>
									<Dashboard />
								</Route>
								<Route path='/Dashboard/Logs' exact={window.innerWidth < 550 ? true : false}>
									<LogPage />
								</Route>
								{window.innerWidth < 550 && (
									<Route path='/Dashboard/Logs/Filter'>
										<LogFilter />
									</Route>
								)}

								<Route
									path={['/Calender', '/Calender/EventManager', '/Calender/deleteEvent', '/Calender/CancelSchedule']}
									exact={window.innerWidth < 550 ? true : false}
								>
									<Calender />
								</Route>
								{window.innerWidth < 550 && (
									<Fragment>
										<Route path='/Calender/NewSchedule'>
											<NewSchedule type='NEW' />
										</Route>
										<Route path='/Calender/EditEvent/:id'>
											<NewSchedule type='EDIT' />
										</Route>
									</Fragment>
								)}

								<Route path={['/Client']} exact>
									<ClientList />
								</Route>
								<Route path='/Client-Add' exact>
									<AddClient />
								</Route>
								{window.innerWidth > 550 ? (
									<Route
										path={[
											'/Client/:id',
											'/Client/:id/AddNote',
											'/Client/:id/Delete',
											'/Client/:id/AddDocument',
											'/Client/:id/AddMedicine',
											'/Client/:id/AddSchedule',
											'/Client/:id/EditNote/:NoteID',
											'/Client/:id/DeleteDocument/:DocumentId',
											'/Client/:id/DeleteMedicine/:MedicineId',
										]}
										exact
									>
										<ClientProfile />
									</Route>
								) : (
									<>
										<Route
											path={[
												'/Client/:id',
												'/Client/:id/Manage',
												'/Client/:id/Delete',
												'/Client/:id/AddMedicine',
												'/Client/:id/DeleteMedicine/:MedicineId',
												'/Client/:id/DocSetting',
												'/Client/:id/DeleteDocument/:DocumentId',
											]}
											exact
										>
											<ClientProfile />
										</Route>
										<Route path={['/Client/:id/AddNote']} exact>
											<AddNote type='NEW' Page='Client' />
										</Route>
										<Route path='/Client/:id/AddDocument' exact>
											<AddClientDocument Type='Client' />
										</Route>
										<Route path='/Client/:id/NoteItem/:NoteID' exact>
											<MobileNote />
										</Route>
										<Route path='/Client/:id/EditNote/:NoteID' exact>
											<AddNote type='EDIT' Page='Client' />
										</Route>
										<Route path='/Client/:id/AddSchedule'>
											<NewSchedule type='NEW' />
										</Route>
									</>
								)}
								<Route path='/Client/:id/Edit' exact>
									<AddClient />
								</Route>

								<Route path='/Client/:id/AddReport' exact>
									<AddClientReport />
								</Route>

								<Route path='/Client/:id/Report/:ReportId' exact>
									<ClientReport />
								</Route>

								<Route path={['/Staff', '/Staff/:id/Manage', '/Staff/Delete']} exact>
									<StaffList />
								</Route>
								<Route path='/Staff-Add' exact>
									<AddStaff />
								</Route>
								<Route path='/Staff/:id/Edit' exact>
									<AddStaff />
								</Route>
								<Route path={['/Staff/:id/Detail']}>
									<StaffDetail />
								</Route>

								{window.innerWidth > 550 ? (
									<Route
										path={[
											'/Online-Office',
											'/Online-Office/AddDocument',
											'/Online-Office/EditNote/:NoteID',
											'/Online-Office/AddNote',
											'/Online-Office/AddService',
											'/Online-Office/DeleteDocument/:DocumentId',
										]}
										component={OnlineOffice}
										exact
									/>
								) : (
									<>
										<Route
											path={[
												'/Online-Office',
												'/Online-Office/DocSetting',
												'/Online-Office/DeleteDocument/:DocumentId',
											]}
											component={OnlineOffice}
											exact
										/>
										<Route path={'/Online-Office/AddService'} exact>
											<AddService type='NEW' />
										</Route>
										<Route path={'/Online-Office/AddNote'} exact>
											<AddNote Page='OnlineOffice' type='NEW' />
										</Route>
										<Route path={'/Online-Office/AddDocument'} exact>
											<AddClientDocument Type='OnlineOffice' />
										</Route>
										<Route path={'/Online-Office/NoteItem/:NoteID'} exact>
											<MobileNote Page='online-office' />
										</Route>
										<Route path={'/Online-Office/EditNote/:NoteID'} exact>
											<AddNote Page='OnlineOffice' type='EDIT' />
										</Route>
									</>
								)}
								<Route
									path={[
										'/Online-Office/Service/:id',
										'/Online-Office/Service/:id/DocSetting',
										'/Online-Office/Service/:id/AddFolder',
										'/Online-Office/Service/:id/AddDocument',
										'/Online-Office/Service/:id/EditService',
										'/Online-Office/Service/:id/DeleteService',
										'/Online-Office/Service/:id/DeleteFolder',
										'/Online-Office/Service/:id/EditFolder/:FolderId',
										'/Online-Office/Service/:id/DeleteDocument/:DocumentId',
										'/Online-Office/Service/:id/Manage',
									]}
									component={Service}
									exact
								/>

								{window.innerWidth > 550 && (
									<Route
										path={['/Courses', '/Courses/:Chapter', '/Courses/:Chapter/:Course', '/Courses/:Chapter/Exam']}
										exact
									>
										<Courses />
									</Route>
								)}
								<Route path='/Courses/Setting/:id/AddTrainnig' exact>
									<AddTrainning type='NEW' />
								</Route>
								<Route path='/Courses/Setting/EditLesson/:id' exact>
									<AddTrainning type='EDIT' />
								</Route>
								<Route path='/Courses/Setting/:id/EditExam' exact>
									<EditExam />
								</Route>

								{window.innerWidth < 550 && (
									<Fragment>
										<Route path={['/Courses', '/Courses/Sidebar']} exact>
											<Courses />
										</Route>

										<Route path={['/Courses/:Chapter', '/Courses/:Chapter/Sidebar']} exact>
											<Chapter />
										</Route>

										<Route path='/Courses/:Chapter/:Course' exact>
											<CourseBody />
										</Route>
									</Fragment>
								)}

								{window.innerWidth > 550 ? (
									<Route path={['/Settings', '/Settings/Password', '/Settings/Notification', '/Settings/More']}>
										<Setting />
									</Route>
								) : (
									<Fragment>
										<Route path={'/Settings'} exact>
											<Setting />
										</Route>
										<Route path={'/Settings/Password'}>
											<ChangePasswordSetting />
										</Route>
										<Route path={'/Settings/UpdatePermissions'}>
											<UpdatePermissions />
										</Route>
										<Route path={'/Settings/More'}>
											<MoreSetting />
										</Route>
									</Fragment>
								)}
							</div>
						</div>
					</div>
				))}
		</Fragment>
	);
};

export default App;
