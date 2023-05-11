import moment from 'moment';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../../axios-global';
import LoadingSpinner from '../../../../UI/LoadingSpinner';
import classes from './ClientReport.module.css';

const ClientReport = () => {
	const { ReportId } = useParams();

	const [Data, SetData] = useState(null);
	const [ActiveTab, setActiveTab] = useState('details');
	const [BottomLineTabWidth, SetBottomLineTabWidth] = useState('0px');

	const TabsRef = useRef(null);

	const TabChangeHandler = Tab => {
		setActiveTab(Tab);
	};

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/Clients/GetReport/' + ReportId);
				var response = call.data;
				SetData(response);

				if (window.innerWidth < 550) {
					setTimeout(() => {
						SetBottomLineTabWidth('100%');
					}, 20);
				}
			} catch (error) {
				console.log(error);
			}
		})();
	}, [ReportId]);

	return !Data ? (
		<LoadingSpinner />
	) : (
		<>
			<div className={`${classes.Card}`}>
				<div className={`${classes.HeaderTitle} text-black size-14 font-600 mb-10`}>Client report</div>
				<div className={classes.HeaderInfo}>
					<img src={`${process.env.REACT_APP_SRC_URL}${Data.Reporter.Avatar}`} alt='' />
					{Data.Reporter.Name} {moment(Data.CreatedAt).format('\xa0\xa0|\xa0\xa0DD MMM YYYY\xa0\xa0|\xa0\xa0 hh:mmA')}
				</div>
			</div>

			<div className={`mt-40 ${classes.Tabs}`} ref={TabsRef}>
				<div
					className={`${classes.TabItem} ${ActiveTab === 'details' && classes.active}`}
					onClick={() => TabChangeHandler('details')}
				>
					Your details
				</div>
				<div
					className={`${classes.TabItem} ${ActiveTab === 'Incident' && classes.active}`}
					onClick={() => TabChangeHandler('Incident')}
				>
					Incident
				</div>
				<div
					className={`${classes.TabItem} ${ActiveTab === 'Actions' && classes.active}`}
					onClick={() => TabChangeHandler('Actions')}
				>
					Actions Taken
				</div>

				{window.innerWidth < 550 && <div className={classes.tabLine} style={{ width: BottomLineTabWidth }}></div>}
			</div>

			<div className={`${classes.detailsTab} ${classes.tabbody} ${ActiveTab === 'details' && classes.active}`}>
				<div className={`${classes.Card}`}>
					<div className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'} text-black`}>Your details</div>
					<div className={`${classes.bgGray} mt-25`}>
						<div className={classes.ReportTitle}>Your name</div>
						<div className={classes.ReportValue}>{Data.Name}</div>
					</div>

					<div className={`${classes.bgWhite}`}>
						<div className={classes.ReportTitle}>Position / Title</div>
						<div className={classes.ReportValue}>{Data.Position}</div>
					</div>

					<div className={`${classes.bgGray}`}>
						<div className={classes.ReportTitle}>{Data.ContactType}</div>
						<div className={classes.ReportValue}>{Data.Contact}</div>
					</div>
				</div>
			</div>

			<div className={`${classes.IncidentTab} ${classes.tabbody} ${ActiveTab === 'Incident' && classes.active}`}>
				<div className={`${classes.Card}`}>
					<div className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'} text-black`}>Incident</div>

					<div className={`${classes.bgGray} mt-25`}>
						<div className={classes.ReportTitle}>Time and date incident occurred:</div>
						<div className={classes.ReportValue}>{moment(Data.IncidentDate).format('MMMM DD, YYYY - hh:mmA')}</div>
					</div>

					<div className={`${classes.bgWhite}`}>
						<div className={classes.ReportTitle}>Duration of incident:</div>
						<div className={classes.ReportValue}>{Data.IncidentDuration}</div>
					</div>

					<div className={`${classes.bgGray}`}>
						<div className={classes.ReportTitle}>Who was affected?</div>
						<div className={classes.ReportValue}>{Data.Affected.join(' , ')}</div>
					</div>

					<div className={`${classes.bgWhite}`}>
						<div className={classes.ReportTitle}>Type of incident:</div>
						<div className={classes.ReportValue}>{Data.IncidentType.join(' , ')}</div>
					</div>

					<div className={`${classes.bgGray} ${classes.AffectedSection}`}>
						<div className={classes.ReportTitle}>names and contact details of people affected</div>
						<div className={classes.AffectedTableHeader}>
							<div className={classes.ReportTitle}>Name</div>
							<div className={classes.ReportTitle}>Contact details</div>
						</div>
						{Data.AffectedPerson.map(item => (
							<div className={classes.AffectedTableHeader} key={item._id}>
								<div className={classes.ReportValue} style={{ textAlign: 'Left' }}>
									{item.Name}
								</div>
								<div className={classes.ReportValue}>{item.Contact}</div>
							</div>
						))}
					</div>

					<div className={`${classes.bgWhite}  ${classes.AffectedSection}`}>
						<div className={classes.ReportTitle}>Clear, concise and factual account of the incident</div>
						<div className={classes.ReportValue}>{Data.IncidentDescription}</div>
					</div>
				</div>
			</div>

			<div className={`${classes.ActionsTab} ${classes.tabbody} ${ActiveTab === 'Actions' && classes.active}`}>
				<div className={`${classes.Card}`}>
					<div className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'} text-black`}>Actions Taken </div>

					<div className={`${classes.bgGray} mt-25`}>
						<div className={classes.ReportTitle}>Were emergency services in attendance?</div>
						<div className={classes.ReportValue}>{Data.EmergencyService.join(' , ')}</div>
					</div>

					<div className={`${classes.bgWhite}`}>
						<div className={classes.ReportTitle}>Duration of incident:</div>
						<div className={classes.ReportValue}>{Data.IncidentDuration}</div>
					</div>

					<div className={`${classes.bgGray}`}>
						<div className={classes.ReportTitle}>Who was affected?</div>
						<div className={classes.ReportValue}>{Data.Affected.join(' , ')}</div>
					</div>

					<div className={`${classes.bgWhite}`}>
						<div className={classes.ReportTitle}>Type of incident:</div>
						<div className={classes.ReportValue}>{Data.IncidentType.join(' , ')}</div>
					</div>

					<div className={`${classes.bgGray} ${classes.AffectedSection}`}>
						<div className={classes.ReportTitle}>notified person detail</div>
						<div className={classes.NotifiedTableHeader}>
							<div className={classes.ReportTitle}>Name</div>
							<div className={classes.ReportTitle}>Role</div>
							<div className={classes.ReportTitle}>Contact details</div>
							<div className={classes.ReportTitle}>Time/date notified</div>
						</div>
						{Data.NotifiedPerson.map(item => (
							<div className={classes.NotifiedTableHeader} key={item._id}>
								<div className={classes.ReportValue} style={{ textAlign: 'Left' }}>
									{item.Name}
								</div>
								<div className={classes.ReportValue} style={{ textAlign: 'Left' }}>
									{item.Role}
								</div>
								<div className={classes.ReportValue} style={{ textAlign: 'Left' }}>
									{item.Contact}
								</div>
								<div className={classes.ReportValue} style={{ textAlign: 'Left' }}>
									{moment(item.NotifiedTime).format('MMMM DD, YYYY - hh:mmA')}
								</div>
							</div>
						))}
					</div>

					<div className={`${classes.bgWhite}  ${classes.AffectedSection}`}>
						<div className={classes.ReportTitle}>If no one was notified – why / why not?</div>
						<div className={classes.ReportValue}>{Data.NotifiedDescription}</div>
					</div>

					<div className={`${classes.bgGray}`}>
						<div className={classes.ReportTitle}>Time and date that report submitted</div>
						<div className={classes.ReportValue}>{moment(Data.CreatedAt).format('MMMM DD, YYYY - hh:mmA')}</div>
					</div>

					<div className={`${classes.bgWhite}`}>
						<div className={classes.ReportTitle}>Your (reporter’s) signature</div>
						{/* <div className={classes.ReportValue}> */}
						<img src={`${process.env.REACT_APP_SRC_URL}/${Data.Signature}`} alt='' width={120} />
						{/* </div> */}
					</div>
				</div>

				<div className={`${classes.Card} mt-30`}>
					<div className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'} text-black`}>Office use only</div>

					<div className={`${classes.bgGray} mt-25`}>
						<div className={classes.ReportTitle}>Sunflower Support Services representative name & title</div>
						<div className={classes.ReportValue}>{Data.OfficeName}</div>
					</div>

					<div className={`${classes.bgWhite}`}>
						<div className={classes.ReportTitle}>Phone number</div>
						<div className={classes.ReportValue}>{Data.OfficePhone}</div>
					</div>

					<div className={`${classes.bgGray}`}>
						<div className={classes.ReportTitle}>Email</div>
						<div className={classes.ReportValue}>{Data.OfficeEmail}</div>
					</div>

					<div className={`${classes.bgWhite}`}>
						<div className={classes.ReportTitle}>Time and date form submitted</div>
						<div className={classes.ReportValue}>{moment(Data.CreatedAt).format('MMM DD, YYYY - hh:mm A')}</div>
					</div>

					<div className={`${classes.bgGray}`}>
						<div className={classes.ReportTitle}>Time and date incident followed up</div>
						<div className={classes.ReportValue}>{moment(Data.IncidentDate).format('MMM DD, YYYY - hh:mm A')}</div>
					</div>

					<div className={`${classes.bgWhite}`}>
						<div className={classes.ReportTitle}>Reportable to the NDIS Commission</div>
						<div className={classes.ReportValue}>{Data.NDISReport[0] + ' - ' + Data.NDISReason}</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ClientReport;
