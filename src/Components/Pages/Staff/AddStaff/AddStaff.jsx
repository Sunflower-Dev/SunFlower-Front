import classes from './AddStaff.module.css';
import Input from '../../../UI/Inputs/Input';
import AccessDropDown from '../StaffPage/AccessDropDown/AccessDropDown';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../axios-global';
import moment from 'moment';
import LoadingSpinner from '../../../UI/LoadingSpinner';
require('dotenv').config();

const AddStaff = () => {
	const [Form_data, SetFormData] = useState({ Clients_IDs: [] });
	const [Download_data, SetDownloadData] = useState({ Clients_IDs: [] });
	const [AccessUpdateData, SetAccessUpdateData] = useState({ View: [], Edit: [], Delete: [] });
	const [AccessData, SetAccessData] = useState({ View: [], Edit: [], Delete: [] });
	const [Search, SetSearch] = useState({ isSearching: false, Clients: [] });
	const [Clients, SetClients] = useState([]);

	const [IsLoaded, SetIsLoaded] = useState(false);

	const ClientRef = useRef(null);

	const history = useHistory();
	const location = useLocation();
	const { id } = useParams();

	const handleChange = event => {
		const name = event.target.name;
		const value = event.target.value;

		SetFormData(Form_data => {
			return { ...Form_data, [name]: value };
		});
		SetDownloadData(Download_data => {
			return { ...Download_data, [name]: value };
		});
	};

	const ClientOnChangeHandler = () => {
		if (ClientRef.current.value === '') {
			SetSearch({ isSearching: false, Clients: [] });
		} else {
			var searched = Clients.filter(item => item.Name.includes(ClientRef.current.value));
			if (searched.length > 0) {
				SetSearch({ isSearching: true, Clients: searched });
			} else {
				SetSearch({ isSearching: false, Clients: [] });
			}
		}
	};

	const addClientHandler = id => {
		var SelectedClient = Clients.find(x => {
			return x._id === id;
		});
		if (!Form_data.Clients_IDs.includes(id)) {
			SetFormData(data => {
				return { ...data, Clients_IDs: [...data.Clients_IDs, SelectedClient._id] };
			});
			ClientRef.current.value = '';
			SetSearch({ isSearching: false, Clients: [] });
		}
	};
	const removeClientConnection = id => {
		var newClients = Form_data.Clients_IDs.filter(x => x !== id);
		SetFormData(data => {
			return { ...data, Clients_IDs: newClients };
		});
	};

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
		SetAccessData(tmp);
	};

	const onsubmitHandler = async event => {
		event.preventDefault();

		if (!location.pathname.endsWith('Edit')) {
			const data = { ...Form_data, Permissions: AccessUpdateData };
			try {
				const call = await axiosInstance.post('/admins/New', data);
				var responseadd = call.data;
				if (responseadd) {
					history.replace('/Staff');
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				const data = { ...Form_data, Permissions: AccessUpdateData };
				const call = await axiosInstance.put('/admins/Edit/' + id, data);
				var responseedit = call.data;
				if (responseedit) {
					history.replace('/Staff');
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	useEffect(() => {
		if (location.pathname.endsWith('Edit')) {
			(async () => {
				try {
					const call = await axiosInstance.get('/admins/' + id);
					var response = call.data;
					response.Admin.BirthDate = moment(response.Admin.BirthDate).format('YYYY-MM-DD');
					SetClients(response.AvailableClients);
					response.Admin.Clients_IDs = response.Admin.Clients_IDs.map(item => item._id);
					SetFormData(response.Admin);
					SetDownloadData(response.Admin);
					SetAccessData(response.Admin.Permissions);
					SetAccessUpdateData(response.Admin.Permissions);
					SetIsLoaded(true);
				} catch (error) {
					console.log(error);
				}
			})();
		} else {
			(async () => {
				try {
					const call = await axiosInstance.get('/clients');
					var response = call.data;
					SetClients(response);
					SetIsLoaded(true);
				} catch (error) {
					console.log(error);
				}
			})();
		}
	}, [id, location.pathname]);

	return !IsLoaded ? (
		<LoadingSpinner />
	) : (
		<form onSubmit={onsubmitHandler}>
			{window.innerWidth > 550 && (
				<h2 className='text-black font-600 size-14 m-0 mb-25'>
					{location.pathname.endsWith('Edit') ? 'Edit a member' : 'Add a Member'}{' '}
				</h2>
			)}

			<div className={`${classes.formContainer}`}>
				<h3 className={`text-black ${window.innerWidth > 550 ? 'font-500 size-10' : 'font-600 size-7'} m-0`}>Information</h3>
				<Input
					type='text'
					placeholder='Enter your full name'
					label='Member Name'
					onChange={handleChange}
					name='Name'
					value={Download_data ? Download_data.Name : ''}
				/>
				<Input
					type='text'
					placeholder='Enter your text'
					label='Sex'
					onChange={handleChange}
					name='Sex'
					value={Download_data ? Download_data.Sex : ''}
				/>

				<Input
					type='date'
					placeholder='Enter your text'
					label='Date of birth'
					onChange={handleChange}
					name='BirthDate'
					value={Download_data ? Download_data.BirthDate : ''}
				/>

				<Input
					type='text'
					placeholder='Enter your text'
					label='Nationality'
					onChange={handleChange}
					name='Nationality'
					value={Download_data ? Download_data.Nationality : ''}
				/>

				<Input
					type='text'
					placeholder='Enter your text'
					label='preferred language'
					onChange={handleChange}
					name='Language'
					value={Download_data ? Download_data.Language : ''}
				/>
			</div>

			<div className={`${classes.formContainer} ${window.innerWidth > 550 ? 'mt-25' : 'mt-14'}`}>
				<h3 className={`text-black ${window.innerWidth > 550 ? 'font-500 size-10' : 'font-600 size-7'} m-0`}>Contacts</h3>
				<Input
					type='text'
					placeholder='Enter your text'
					label='Phone number'
					onChange={handleChange}
					name='PhoneNumber'
					value={Download_data ? Download_data.PhoneNumber : ''}
				/>

				<Input
					type='email'
					placeholder='Enter your text'
					label='email'
					onChange={handleChange}
					name='Email'
					value={Download_data ? Download_data.Email : ''}
				/>
				<Input
					type='text'
					placeholder='Enter your text'
					label='Address'
					style={{ gridColumn: window.innerWidth > 550 ? '1/3' : '1' }}
					onChange={handleChange}
					name='Address'
					value={Download_data ? Download_data.Address : ''}
				/>
			</div>

			<div className={`${classes.formContainer} ${window.innerWidth > 550 ? 'mt-25' : 'mt-14'}`}>
				<h3 className={`text-black ${window.innerWidth > 550 ? 'font-500 size-10' : 'font-600 size-7'} m-0`}>
					General information
				</h3>
				<fieldset className={`${classes.FullFormTextArea}`}>
					<label htmlFor='About' className={`text-darkgray font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-4'} mb-6`}>
						About the member
					</label>
					<textarea
						placeholder='Enter your text'
						name='About'
						onChange={handleChange}
						value={Download_data ? Download_data.About : ''}
					></textarea>
				</fieldset>
			</div>

			<AccessDropDown
				data={{
					Title: 'Access to edits',
					SubTitle: 'manage add and edit accesses to dashboard',
					Type: 'EDIT',
				}}
				className={`${window.innerWidth > 550 ? 'mt-25' : 'mt-14'}`}
				PermissionUpdateHandler={PermissionUpdateHandler}
				AccessData={AccessData.Edit}
			/>
			<AccessDropDown
				data={{
					Title: 'Access to deletions',
					SubTitle: 'manage Delete opration accesses to dashboard',
					Type: 'DELETE',
				}}
				PermissionUpdateHandler={PermissionUpdateHandler}
				AccessData={AccessData.Delete}
			/>
			<AccessDropDown
				data={{
					Title: 'Access to views',
					SubTitle: 'manage Viewing accesses to dashboard',
					Type: 'VIEW',
				}}
				PermissionUpdateHandler={PermissionUpdateHandler}
				AccessData={AccessData.View}
			/>

			<div className={`${classes.formContainer} ${window.innerWidth > 550 ? 'mt-25 mb-30' : 'mt-14 mb-100'} `}>
				<h3 className={`text-black ${window.innerWidth > 550 ? 'font-500 size-10' : 'font-600 size-7'} m-0`}>Clients</h3>

				<div className={`${classes.ClientSensivityContainer}`}>
					<div>
						<Input
							type='text'
							placeholder='Enter your text'
							label='Clients'
							autoComplete='off'
							style={{ gridColumn: '1/3' }}
							ref={ClientRef}
							onChange={ClientOnChangeHandler}
						/>
					</div>
					{Clients.length > 0 &&
						Form_data.Clients_IDs.map(item => (
							<div className={`${classes.CareGiverItem}`} key={item}>
								<img src='/images/profile_icon.png' alt='avatar' />
								<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray`}>
									{Clients.find(x => x._id === item).Name}
								</div>
								<img src='/svg/minus.svg' alt='remove' onClick={() => removeClientConnection(item)} />
							</div>
						))}
					{Search.isSearching && (
						<div className={classes.SearchContainer}>
							{Search.Clients.map(item => (
								<div className={classes.SearchItem} key={item._id} onClick={() => addClientHandler(item._id)}>
									<img src='/images/profile_icon.png' alt='avatar' />
									<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray`}>
										{item.Name}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{window.innerWidth > 550 ? (
				<PrimaryButton className={`mb-40 size-6`} style={{ padding: '14px 28px' }}>
					Save and add Staff
				</PrimaryButton>
			) : (
				<PrimaryButton
					className={`mb-40 size-3`}
					style={{
						position: 'absolute',
						bottom: '0',
						left: '16px',
						width: 'calc(100% - 32px)',
					}}
				>
					Save and add Staff
				</PrimaryButton>
			)}
		</form>
	);
};

export default AddStaff;
