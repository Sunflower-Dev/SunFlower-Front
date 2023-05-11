import { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Route, useHistory } from 'react-router-dom';
import { axiosInstance } from '../../../../axios-global';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import LeftIconInput from '../../../UI/Inputs/LeftIconInput';
import LoadingSpinner from '../../../UI/LoadingSpinner';
import DeletePopup from '../../../UI/Popup/Delete/DeletePopup';
import StaffManager from '../../../UI/Popup/MobilePopup/StaffManager/StaffManager';
import StaffListItem from './StaffList-Item';
import classes from './StaffList.module.css';
import NotAuthBlur from '../../../Layout/NotAuthBlur/NotAuthBlur';
const StaffList = props => {
	const history = useHistory();
	const [Staffs, SetStaffs] = useState([]);
	const [SearchText, SetSearchText] = useState('');

	const OnlineList = useSelector(state => state.Online.List);
	const Permissions = JSON.parse(useSelector(state => state.Auth.Admin)).Permissions;

	const SearchRef = useRef(null);

	const addStaffClickhandler = () => {
		history.push('/Staff-Add');
	};
	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/admins');
				var response = call.data;
				SetStaffs(response);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const OnSearchChange = () => {
		let _Staff = Staffs;
		SetSearchText(SearchRef.current.value);
		_Staff.forEach(element => {
			var Re = new RegExp(SearchRef.current.value, 'g');
			if (Re.test(element.Name)) {
				element.Visible = true;
			} else {
				element.Visible = false;
			}
		});
		SetStaffs(_Staff);
	};

	return Permissions.View.includes('staff') ? (
		<div className={classes.Container} style={props.style}>
			<div className={classes.Header}>
				{history.location.pathname.includes('/Dashboard') ? (
					<div className={`text-black font-600 size-14`}>Staffs</div>
				) : (
					<LeftIconInput
						icon='search'
						type='text'
						placeholder='Search...'
						className={`width-full`}
						ref={SearchRef}
						onChange={OnSearchChange}
						style={{
							width: window.innerWidth > 550 ? '340px' : '100%',
							height: '52px',
							background: window.innerWidth > 550 ? 'white' : 'transparent',
						}}
					/>
				)}
				{history.location.pathname.includes('/Dashboard') ? (
					<NavLink className={classes.SeeAll} to='/Staff' exact>
						<span className={`font-400 size-6 text-darkgray mr-8`}>See all</span>
						<img src='/svg/arrow-long-right.svg' alt='seeAll' />
					</NavLink>
				) : (
					<>
						{Permissions.Edit.includes('staff') && (
							<>
								{window.innerWidth > 550 ? (
									<PrimaryButton
										style={{
											height: '41px',
											padding: '10px 20px',
											minWidth: 'fit-content',
										}}
										onClick={addStaffClickhandler}
									>
										<img src='/svg/plus-white.svg' width={20} alt='add' />
										<span className={`ml-8`}>Add member</span>
									</PrimaryButton>
								) : (
									<img src='/svg/plus-gray.svg' width='30px' alt='add' onClick={addStaffClickhandler} />
								)}
							</>
						)}
					</>
				)}
			</div>

			{Staffs.length === 0 ? (
				<LoadingSpinner />
			) : (
				<Fragment>
					<div className={classes.tableHeader}>
						{window.innerWidth > 550 ? (
							<Fragment>
								<div className={classes.StaffHeader}>
									<span>Staff</span>
								</div>

								<div className={classes.DateHeader}>
									<span>Registration date</span>
								</div>

								<div className={classes.StatusHeader}>
									<span>Status</span>
								</div>

								<div className={classes.ClientHeader}>
									<span>Clients</span>
								</div>
								<div className={`font-400 size-8 text-lightgray ${classes.CounterHeader}`}>{Staffs.length} Staffs</div>
							</Fragment>
						) : (
							<Fragment>
								<div className={`font-700 size-10 text-black`}>Staff</div>
								<div style={{ margin: 'auto 0 auto auto' }}>{Staffs.length} Staff</div>
							</Fragment>
						)}
					</div>

					{Staffs.map(
						staff =>
							staff.Visible !== false && (
								<StaffListItem
									item={{
										ID: staff._id,
										Name: staff.Name,
										RegisterDate: staff.CreatedAt,
										Clients: staff.Clients_IDs.length,
										Status: OnlineList.find(x => x.userID === staff._id) ? 'Online' : 'Offline',
										Avatar: staff.Avatar,
									}}
									key={staff._id}
									SearchText={SearchText}
								/>
							),
					)}
				</Fragment>
			)}

			{window.innerWidth < 550 && (
				<Fragment>
					<Route path='/Staff/:id/Manage'>
						<StaffManager />
					</Route>
					<Route path='/Staff/Delete'>
						<DeletePopup Title='Delete member' SubTitle='Are you sure you want to delete the  member?' />
					</Route>
				</Fragment>
			)}
		</div>
	) : (
		<NotAuthBlur>You have not right privilages to access staff list</NotAuthBlur>
	);
};

export default StaffList;
