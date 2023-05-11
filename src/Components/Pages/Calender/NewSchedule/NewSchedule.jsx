import Input from '../../../UI/Inputs/Input';
import Popup from '../../../UI/Popup/Popup';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import SecondaryButton from '../../../UI/Bottons/SecondaryButton';
import classes from './Schedule.module.css';

import { useHistory, useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';

import RadioGroup from '../../../UI/Inputs/RadioGroup';
import { axiosInstance } from '../../../../axios-global';
import axios from 'axios';
import moment from 'moment';

const NewSchedule = props => {
	const history = useHistory();
	const [IsClosing, SetIsClosing] = useState(false);
	const [FormData, setFormData] = useState({});
	const [StaffData, setStaffData] = useState([]);
	const [StaffSearching, setStaffSearching] = useState([]);
	const [ClientData, setClientData] = useState([]);
	const [ClientSearching, setClientSearching] = useState([]);
	const [IsSumbitting, setIsSumbitting] = useState(false);

	const StaffRef = useRef(null);
	const ClientRef = useRef(null);
	const DateRef = useRef(null),
		TimeRef = useRef(null),
		DescriptionRef = useRef(null);
	const { id } = useParams();

	useEffect(() => {
		(async () => {
			try {
				if (props.type === 'NEW') {
					const call = await axiosInstance.get('/admins');
					var response = call.data;
					setStaffData(response);
				} else {
					const getAdmins = axiosInstance.get('/admins');
					const GetScheduleForEdit = axiosInstance.get('/Schedules/' + id);

					axios.all([getAdmins, GetScheduleForEdit]).then(
						axios.spread((...responses) => {
							const AdminsResponse = responses[0];
							const ScheduleResponse = responses[1];

							setStaffData(AdminsResponse.data);

							DateRef.current.value = moment(ScheduleResponse.data.ScheduleDate).format('YYYY-MM-DD');
							TimeRef.current.value = moment(ScheduleResponse.data.ScheduleDate).format('HH:mm');
							DescriptionRef.current.value = ScheduleResponse.data.Description;
							StaffRef.current.value = ScheduleResponse.data.AdminID.Name;
							ClientRef.current.value = ScheduleResponse.data.ClientID.Name;
							setFormData({
								AdminID: ScheduleResponse.data.AdminID._id,
								ClientID: ScheduleResponse.data.ClientID._id,
								ScheduleDate: moment(ScheduleResponse.data.ScheduleDate).format('YYYY-MM-DD'),
								ScheduleTime: moment(ScheduleResponse.data.ScheduleDate).format('HH:mm'),
								Description: ScheduleResponse.data.Description,
								Type: ScheduleResponse.data.Type,
							});
							setClientData(AdminsResponse.data.find(x => x._id === ScheduleResponse.data.AdminID._id).Clients_IDs);
						}),
					);
				}
			} catch (error) {
				console.log(error);
			}
		})();
	}, [id, props.type]);

	const closeClickHandler = () => {
		SetIsClosing(true);

		setTimeout(() => {
			history.goBack();
		}, 300);
	};

	const checkboxChanges = (name, value) => {
		setFormData({ ...FormData, [name]: value });
	};

	const handleChange = event => {
		const name = event.target.name;
		const value = event.target.value;
		setFormData({ ...FormData, [name]: value });
	};

	const StaffhandleChange = event => {
		const value = event.target.value;
		if (value === '') {
			setStaffSearching([]);
		} else {
			const search = StaffData.filter(x => x.Name.includes(value));
			setStaffSearching(search);
		}
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

	const SelectStaffHandler = (id, name) => {
		StaffRef.current.value = name;
		setStaffSearching([]);
		setFormData({ ...FormData, AdminID: id });
		setClientData(StaffData.find(x => x._id === id).Clients_IDs);
	};

	const SelectClientHandler = (id, name) => {
		ClientRef.current.value = name;
		setClientSearching([]);
		setFormData({ ...FormData, ClientID: id });
	};

	const onsubmitHandler = async event => {
		event.preventDefault();

		try {
			setIsSumbitting(true);
			if (props.type === 'NEW') {
				const call = await axiosInstance.post('/schedules', FormData);
				var responseadd = call.data;
				if (responseadd) {
					setIsSumbitting(false);
					history.goBack();
				}
			} else {
				const call = await axiosInstance.put('/schedules/' + id, FormData);
				var ResponseEdit = call.data;
				if (ResponseEdit) {
					setIsSumbitting(false);
					history.goBack();
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form onSubmit={onsubmitHandler}>
			<Popup width='680px' IsClosing={IsClosing}>
				<div className={classes.header}>
					<span className={`font-600 text-black ${window.innerWidth > 550 ? 'size-14' : 'size-7'}`}>
						{' '}
						{props.type === 'NEW' ? 'New Schedule' : 'Editing Schedule'}
					</span>
					<img
						src={`/svg/${window.innerWidth > 550 ? 'close' : 'arrow-left'}.svg`}
						width='30px'
						alt='close'
						onClick={closeClickHandler}
					/>
					<span className={`font-400 text-lightgray size-6`}>
						{window.innerWidth > 550 && 'Record your schedule on the calendar'}
					</span>
				</div>
				<div className={classes.body}>
					<Input
						type='date'
						placeholder='Example: 12/06/2012'
						label='Date Schedule'
						onChange={handleChange}
						name='ScheduleDate'
						ref={DateRef}
					/>
					<Input
						type='time'
						placeholder='Example: 10:30AM'
						label='Time Schedule'
						onChange={handleChange}
						name='ScheduleTime'
						ref={TimeRef}
					/>
					<div className={classes.StaffContainer}>
						<Input
							type='text'
							placeholder='Staff Name'
							label='Staff Name'
							onChange={StaffhandleChange}
							name='AdminID'
							autoComplete='off'
							ref={StaffRef}
						/>
						{StaffSearching.length > 0 && (
							<div className={classes.InputSerachContainer}>
								{StaffSearching.map(staff => (
									<div
										key={staff._id}
										className={`text-lightgray font-400 size-5`}
										onClick={() => SelectStaffHandler(staff._id, staff.Name)}
									>
										{staff.Name}
									</div>
								))}
							</div>
						)}
					</div>
					<div className={classes.StaffContainer}>
						<Input
							type='text'
							placeholder='client name'
							label='client name'
							onChange={ClienthandleChange}
							name='ClientID'
							autoComplete='off'
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
					<Input
						type='text'
						placeholder='Schedule'
						label='Specify your schedule'
						className={classes.inputrow}
						onChange={handleChange}
						name='Description'
						ref={DescriptionRef}
					/>
					<div className={classes.RadioGroup_Type}>
						<div className='text-darkgray font-500 size-6 mb-10' style={{ gridColumn: '1/3' }}>
							Type
						</div>
						<RadioGroup
							data={[
								{ id: 'CALL', name: 'Type', required: true },
								{ id: 'MEET', name: 'Type', required: true },
							]}
							name='Type'
							onChange={checkboxChanges}
							selected={FormData.Type}
						/>
					</div>
				</div>

				<div className={classes.Action}>
					<PrimaryButton type='submit' IsLoading={IsSumbitting} className={`font-500 size-6`} style={{ padding: '14px 28px' }}>
						Schedule registration
					</PrimaryButton>

					{window.innerWidth > 550 && (
						<SecondaryButton
							type='button'
							onClick={() => {
								history.goBack();
							}}
							style={{ padding: '14px 28px', height: '52px' }}
						>
							<span className={`font-500 text-darkgray size-6`}>cancel</span>
						</SecondaryButton>
					)}
				</div>
			</Popup>
		</form>
	);
};

export default NewSchedule;
