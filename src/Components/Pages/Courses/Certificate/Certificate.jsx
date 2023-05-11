import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../axios-global';
import LoadingSpinner from '../../../UI/LoadingSpinner';
import classes from './Certificate.module.css';
const Certificate = () => {
	const { id } = useParams();
	const [Data, SetData] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/courses/GetCertificate/' + id);
				var response = call.data;
				SetData(response);
				document.title = 'Certificate';

				setTimeout(() => {
					window.print();
				}, 500);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [id]);
	return (
		<div className={classes.container}>
			{!Data ? (
				<LoadingSpinner />
			) : !Data.IsPassed ? (
				<div> You have not passed this Course , so You can't get a Certificate!</div>
			) : (
				<div className={`${classes.PrintArea}`} id='print'>
					<img src='/svg/vector/Certificate-Left.svg' alt='' className={classes.LeftVector} />
					<img src='/svg/vector/Certificate-Right.svg' alt='' className={classes.RightVector} />
					<div className={`${classes.CertificateContainer}`}>
						<div className={`${classes.CertificateTitle}`}>CERTIFICATE</div>
						<div className={`${classes.CertificateSubTitle}`}>OF APPRECIATION</div>
						<div className={`${classes.CertificatePresent}`}>PROUDLY PRESENTED TO</div>

						<h1 className={`${classes.CertificateAdminName}`}>{Data.Admin}</h1>
						<p className={`${classes.Description}`}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
							magna aliqua. Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue Sapien faucibus et molestie
							ac feugiat sed lectus vestibulum. Ullamcorper velit sed
						</p>
						<div className={`${classes.Footer}`}>
							<div className={classes.FooterContainer}>
								<div className={classes.FooterValue}>{moment(Data.PassedAt).format('DD/MM/YYYY')}</div>
								<div className={classes.FooterTitle}>Date</div>
							</div>

							<div className={classes.FooterContainer}>
								<div className={classes.FooterValue}>{Data.Name}</div>
								<div className={classes.FooterTitle}>Course</div>
							</div>

							<div className={classes.FooterContainer}>
								<div className={classes.FooterValue}>23/06/2022</div>
								<div className={classes.FooterTitle}>Signature</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Certificate;
