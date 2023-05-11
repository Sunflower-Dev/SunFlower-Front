import { Fragment, useEffect, useRef, useState } from 'react';
import Logs from '../../../../Layout/Log/LogContainer';
import DocumentItem from './DocumentItem/DocumentItem';
import DrugDropDown from './DrugDropDown/DrugDropDown';
import classes from './TabView.module.css';
import NoteItem from './NoteItem/NoteItem';
import ReportItem from './ReportItem/ReportItem';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import PrimaryButton from '../../../../UI/Bottons/PrimaryButton';
import SecondaryButton from '../../../../UI/Bottons/SecondaryButton';

const TabView = props => {
	const [ActiveTab, setActiveTab] = useState('Documents');
	const TabsRef = useRef(null);
	const [BottomLineTabWidth, SetBottomLineTabWidth] = useState('0px');
	const history = useHistory();

	const [Notes, SetNotes] = useState();
	const [selectionRangeNotes, SetselectionRangeNotes] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: 'selection',
		},
	]);
	const [NotesDateFilter, SetNotesDateFilter] = useState('Filter date');
	const [IsFilterShow, SetIsFilterShow] = useState(false);

	useEffect(() => {
		SetNotes(props.Notes);
	}, [props.Notes]);

	const Permissions = JSON.parse(useSelector(state => state.Auth.Admin)).Permissions;

	const NotesFilterChange = ranges => {
		SetselectionRangeNotes([ranges.selection]);
	};
	const DoneFilterClickHandler = () => {
		const Start = moment(selectionRangeNotes[0].startDate).format('DD/MM/YYYY');
		const End = moment(selectionRangeNotes[0].endDate).format('DD/MM/YYYY');
		SetNotesDateFilter(Start === End ? Start : Start + ' - ' + End);
		SetIsFilterShow(false);
		const Filtered = props.Notes.filter(
			item =>
				moment(item.CreatedAt).isSameOrAfter(moment(selectionRangeNotes[0].startDate)) &&
				moment(item.CreatedAt).isBefore(moment(selectionRangeNotes[0].endDate)),
		);
		SetNotes(Filtered);
	};

	const TabChangeHandler = Tab => {
		setActiveTab(Tab);
	};
	const Documents = props.Client.Documents;

	if (window.innerWidth < 550) {
		setTimeout(() => {
			SetBottomLineTabWidth(TabsRef.current.scrollWidth);
		}, 20);
	}
	const addNoteClickHandler = () => {
		history.push(history.location.pathname + '/AddNote');
	};
	const AddDocumentClickHandler = () => {
		history.push(history.location.pathname + '/AddDocument');
	};

	const AddScheduleClickHandler = () => {
		history.push(history.location.pathname + '/AddSchedule');
	};

	return (
		<Fragment>
			<div className={`mt-40 ${classes.Tabs}`} ref={TabsRef}>
				<div
					className={`${classes.TabItem} ${ActiveTab === 'Documents' && classes.active}`}
					onClick={() => TabChangeHandler('Documents')}
				>
					Documents
				</div>
				<div className={`${classes.TabItem} ${ActiveTab === 'Goals' && classes.active}`} onClick={() => TabChangeHandler('Goals')}>
					Goal and aim's
				</div>
				<div
					className={`${classes.TabItem} ${ActiveTab === 'General' && classes.active}`}
					onClick={() => TabChangeHandler('General')}
				>
					General information
				</div>
				<div
					className={`${classes.TabItem} ${ActiveTab === 'Client' && classes.active}`}
					onClick={() => TabChangeHandler('Client')}
				>
					Client Medication
				</div>
				<div
					className={`${classes.TabItem} ${ActiveTab === 'Updates' && classes.active}`}
					onClick={() => TabChangeHandler('Updates')}
				>
					Updates
				</div>
				<div className={`${classes.TabItem} ${ActiveTab === 'Notes' && classes.active}`} onClick={() => TabChangeHandler('Notes')}>
					Notes
				</div>
				<div
					className={`${classes.TabItem} ${ActiveTab === 'Report' && classes.active}`}
					onClick={() => TabChangeHandler('Report')}
				>
					Report
				</div>
				{window.innerWidth < 550 && (
					<Fragment>
						<div></div>
						<div className={classes.tabLine} style={{ width: BottomLineTabWidth }}></div>
					</Fragment>
				)}
			</div>

			<div className={`${classes.DocumentTab} ${classes.tabbody} ${ActiveTab === 'Documents' && classes.active}`}>
				<span className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'} text-black ${classes.BodyTitle}`}>
					Documents
				</span>
				{window.innerWidth > 550 && (
					<div className={`${classes.UploadContainer}`} onClick={AddDocumentClickHandler}>
						<img alt='download' src='/svg/vector/download-80.svg' width='80px' />
						<span className={`size-8 font-400 text-lightgray`}>Upload your document</span>
					</div>
				)}
				{Documents.map(item => (
					<DocumentItem key={item._id} data={item} />
				))}
			</div>

			<div className={`${classes.GoalTab} ${classes.tabbody} ${ActiveTab === 'Goals' && classes.active}`}>
				<div className={`${classes.goal}`}>
					<div className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'} text-black mb-25`}>
						Description of goals{' '}
					</div>
					<div className={`${window.innerWidth > 550 ? 'size-6' : 'size-3'} font-400 text-lightgray`}>{props.Client.Goals}</div>
				</div>
			</div>

			<div className={`${classes.GeneralTab} ${classes.tabbody} ${ActiveTab === 'General' && classes.active}`}>
				<div className={`${classes.card} ${classes.ClientInfoLeft}`}>
					<div className={`${window.innerWidth > 550 ? 'font-600 size-14 mb-10' : 'font-700 size-7 '} text-black`}>
						About Client
					</div>
					<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray mb-20`}>
						{props.Client.About}
					</div>

					<div className={`${window.innerWidth > 550 ? 'font-600 size-14 mb-10' : 'font-700 size-7 '} text-black`}>
						Personality/disposition
					</div>
					<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray mb-20`}>
						{props.Client.Personality}
					</div>

					<div className={`${window.innerWidth > 550 ? 'font-600 size-14 mb-10' : 'font-700 size-7 '} text-black`}>
						Interests/Likes/Hobbies
					</div>
					<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray mb-20`}>
						{props.Client.Interests}
					</div>

					<div className={`${window.innerWidth > 550 ? 'font-600 size-14 mb-10' : 'font-700 size-7 '} text-black`}>
						Conversation topics
					</div>
					<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray mb-20`}>
						{props.Client.Conversation}
					</div>

					<div className={`${window.innerWidth > 550 ? 'font-600 size-14 mb-10' : 'font-700 size-7 '} text-black`}>
						Triggers/Dislikes
					</div>
					<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray mb-20`}>
						{props.Client.Triggers}
					</div>

					<div className={`${window.innerWidth > 550 ? 'font-600 size-14 mb-10' : 'font-700 size-7 '} text-black`}>
						EARLY WARNING SIGNS
					</div>
					<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray mb-20`}>
						{props.Client.Warnings}
					</div>

					<div className={`${window.innerWidth > 550 ? 'font-600 size-14 mb-10' : 'font-700 size-7 '} text-black`}>
						Risk assessments
					</div>
					<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray mb-20`}>
						{props.Client.Risks}
					</div>

					<div className={`font-600 ${window.innerWidth > 550 ? 'size-10 text-darkgray' : 'size-4 text-black'} mb-15`}>
						Medical condition
					</div>

					{props.Client.DiseaseBackground.map(item => (
						<div
							className={`${classes.conditionItem} font-400 ${
								window.innerWidth > 550 ? 'size-6' : 'size-3'
							} text-lightgray mb-12`}
							key={uuidv4()}
						>
							<img alt='dot' src='/svg/dot-red.svg' className='mr-8' />
							{item}
						</div>
					))}
				</div>

				{props.Schedules && (
					<div className={`${window.innerWidth > 550 && classes.card} pb-0`}>
						<div className={` ${window.innerWidth > 550 ? 'font-500 size-6 mb-6' : 'font-400 size-3 mb-3'} text-lightgray `}>
							{props.Schedules.filter(x => x.Status === 'DONE').length} sessions were held
						</div>
						<div className={`${classes.rowflex} mb-8`}>
							<span className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'} text-black`}>
								Client Meetings
							</span>
							{window.innerWidth > 550 ? (
								<div className={classes.addflex} style={{ cursor: 'pointer' }} onClick={AddScheduleClickHandler}>
									<img src='/svg/plus-gray.svg' alt='all' width='22px' className='mr-8' />
									<span className={`font-400 size-6 text-darkgray`}>Add</span>
								</div>
							) : (
								<div className={classes.addflex}>
									<span className={`font-400 size-3 text-darkgray`}>See all</span>
									<img src='/svg/arrow-long-right.svg' alt='all' width='22px' className='ml-8' />
								</div>
							)}
						</div>

						<div className={`${classes.EventContainer}`}>
							{props.Schedules.map(
								item =>
									item.AdminID && (
										<div key={item._id} className={`${classes.EventItem}`}>
											<img src={`/svg/${item.Type === 'MEET' ? 'meeting' : 'call'}.svg`} alt='Type' />
											<div className={classes.EventTitle}>{item.Type === 'MEET' ? 'Appointment' : 'call'}</div>
											{window.innerWidth < 550 && (
												<div
													className={`font-500 size-1 ${
														item.Status === 'DONE'
															? 'text-green'
															: item.Status === 'IDLE'
															? 'text-lightgray'
															: 'text-secondaryred'
													} ${classes.EventStatus}`}
													style={{
														background:
															item.Status === 'IDLE'
																? 'transparent'
																: item.Status === 'DONE'
																? ''
																: '#F589861F',
													}}
												>
													{item.Status === 'IDLE' && 'Not held yet'}
													{item.Status === 'DONE' && 'Done'}
													{item.Status === 'CANCELED' && 'Canceled'}
												</div>
											)}

											<div
												className={`${classes.eventSubtitle} text-lightgray font-400 ${
													window.innerWidth > 550 ? 'size-4' : 'size-1'
												}`}
											>
												{item.AdminID.Name} &nbsp; | &nbsp; {moment(item.ScheduleDate).format('DD/MM/YYYY')} &nbsp;
												{window.innerWidth > 550 && (
													<Fragment>
														| &nbsp;
														<span
															className={`font-500 size-4 ${
																item.Status === 'DONE'
																	? 'text-green'
																	: item.Status === 'IDLE'
																	? 'text-lightgray'
																	: 'text-secondaryred'
															}`}
														>
															{item.Status === 'IDLE' && 'Not held yet'}
															{item.Status === 'DONE' && 'Done'}
															{item.Status === 'CANCELED' && 'Canceled'}
														</span>
													</Fragment>
												)}
											</div>
										</div>
									),
							)}
						</div>
					</div>
				)}
			</div>

			<div className={`${classes.ClientTab} ${classes.tabbody} ${ActiveTab === 'Client' && classes.active}`}>
				<div>
					<div
						className={`d-flex ${window.innerWidth > 550 ? 'mb-25' : 'mb-10'}`}
						style={{ justifyContent: 'space-between', alignItems: 'center' }}
					>
						<div className={`text-black ${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'}`}>Medications</div>
						<div
							className='d-flex font-400 size-6 text-darkgray'
							style={{ alignItems: 'center', cursor: 'pointer' }}
							onClick={() => history.push(history.location.pathname + '/AddMedicine')}
						>
							<img src='/svg/plus-gray.svg' alt='' className='mr-8' width={24} />
							Prescribing new Medications
						</div>
					</div>

					{props.Client.Medications &&
						props.Client.Medications.map((item, index) => (
							<DrugDropDown
								key={item._id}
								id={item._id}
								data={{
									Counter: index + 1,
									Title: item.Title,
									DrName: item.Admin ? item.Admin.Name : 'Removed Staff',
									Date: moment(item.CreatedAt).format('DD/MM/YYYY'),
									Time: moment(item.CreatedAt).format('hh:mmA'),
									Drugs: item.Pills,
								}}
							/>
						))}
				</div>

				<div className={`${classes.card} ${classes.drugSensivity}`}>
					<div className={`text-black ${window.innerWidth > 550 ? 'font-600 size-14 mb-25' : 'font-700 size-7 mb-10'}`}>
						client sensitivity to the Medications
					</div>
					{props.Client.MedicineSensitivity.map(item => (
						<div
							className={`${classes.SensivityItem} text-lightgray font-400 ${window.innerWidth > 550 ? 'size-5' : 'size-3'}`}
							key={uuidv4()}
						>
							{item}
						</div>
					))}
				</div>
			</div>

			<div className={`${classes.UpdateTab} ${classes.tabbody} ${ActiveTab === 'Updates' && classes.active}`}>
				{props.Logs && <Logs type='CLIENT' Logs={props.Logs} />}
			</div>

			<div className={`${classes.NoteTab} ${classes.tabbody} ${ActiveTab === 'Notes' && classes.active}`}>
				<span className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'} text-black`}>Case notes</span>

				{window.innerWidth > 550 && <div></div>}
				{window.innerWidth > 550 ? (
					IsFilterShow ? (
						<PrimaryButton onClick={DoneFilterClickHandler}>Done</PrimaryButton>
					) : (
						<SecondaryButton style={{ height: '52px' }} onClick={() => SetIsFilterShow(!IsFilterShow)}>
							{NotesDateFilter}
						</SecondaryButton>
					)
				) : (
					<div></div>
				)}

				{IsFilterShow && (
					<DateRangePicker className={`${classes.FloatDatePicker}`} ranges={selectionRangeNotes} onChange={NotesFilterChange} />
				)}
				{!Permissions.View.includes('client-note') ? (
					<div
						className={`${window.innerWidth > 550 ? 'size-6' : 'size-3'} font-400 text-lightgray text-center`}
						style={{ gridColumn: '1/4' }}
					>
						you have not right privilages to view this section! Contact the Administrator
					</div>
				) : (
					<Fragment>
						{window.innerWidth > 550 && (
							<div className={`${classes.AddNote}`} onClick={addNoteClickHandler}>
								<img src='/svg/vector/add-80.svg' width='80px' alt='add' />
								<div className={`text-lightgray font-400 size-8 mt-10`}>Add Note</div>
							</div>
						)}

						{Notes &&
							Notes.map(item => (
								<NoteItem
									key={item._id}
									data={{
										Title: item.Title,
										Description: item.Description,
										Name: item.Admin?.Name ?? 'Deleted Staff',
										Date: moment(item.CreatedAt).format('DD MMM \xa0\xa0|\xa0\xa0 hh:mmA'),
										id: item._id,
										Avatar: item.Admin?.Avatar ?? '/Uploads/Admin/profile-placeholder.svg',
									}}
								/>
							))}
					</Fragment>
				)}
			</div>

			<div className={`${classes.ReportTab} ${classes.tabbody} ${ActiveTab === 'Report' && classes.active}`}>
				<span
					className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7 mb-5'} text-black`}
					style={{ gridColumn: '1/3' }}
				>
					Report
				</span>
				{!Permissions.View.includes('client-report') ? (
					<div
						className={`${window.innerWidth > 550 ? 'size-6' : 'size-3'} font-400 text-lightgray text-center`}
						style={{ gridColumn: '1/4' }}
					>
						you have not right privilages to view this section! Contact the Administrator
					</div>
				) : props.Client.Reports.length === 0 ? (
					<div
						className={`${window.innerWidth > 550 ? 'size-6' : 'size-3'} font-400 text-lightgray text-center`}
						style={{ gridColumn: '1/4' }}
					>
						No Reports Found
					</div>
				) : (
					<Fragment>
						{props.Client.Reports.map(item => (
							<ReportItem
								key={item._id}
								data={{
									Name: item.Reporter?.Name,
									Date: moment(item.CreatedAt).format('DD MMM YYYY\xa0\xa0|\xa0\xa0hh:mmA'),
									id: item._id,
								}}
							/>
						))}
					</Fragment>
				)}
			</div>
		</Fragment>
	);
};

export default TabView;
