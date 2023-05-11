import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../axios-global';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import SecondaryButton from '../../../UI/Bottons/SecondaryButton';
import LoadingSpinner from '../../../UI/LoadingSpinner';

import classes from './ExamDescription.module.css';

const ExamDescription = () => {
	const { Chapter } = useParams();

	const [Data, SetData] = useState(null);

	const history = useHistory();

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/courses/GetExamDescription/' + Chapter);
				var response = call.data;
				SetData(response);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [Chapter]);

	const TakeExamClickHandler = () => {
		history.push('/TakeExam/' + Chapter);
	};

	return !Data ? (
		<LoadingSpinner />
	) : (
		<div>
			<div className={`font-500 size-18 text-black`}>
				<span className='font-700'>Exam:</span>
				{' ' + Data.Title}
			</div>
			<div className={`mt-15 d-flex font-400 size-6`} style={{ gap: '8px' }}>
				<img src='/svg/eye-dark.svg' alt='' width={20} />
				<span className={`${!Data.IsPassed ? 'text-lightgray' : 'text-green'}`}>{!Data.IsPassed ? 'NotPassed' : 'Passed'}</span>
			</div>
			<div className={classes.HeaderImage}>
				<img src={`/svg/vector/Exam-${Data.CanPass ? (Data.IsPassed ? 'pass-bg' : 'bg') : 'lock-bg'}.svg`} alt='' />
				{Data.IsPassed && (
					<div className={classes.ExamPassData}>
						<div className='text-white font-600' style={{ fontSize: '75px', lineHeight: '72px' }}>
							{Data.Score}
						</div>
						<div
							className='text-white font-400 size-16 text-center'
							style={{ opacity: '0.8', padding: '0 20px', lineHeight: '30px' }}
						>
							You passed the exam
						</div>
					</div>
				)}
			</div>

			{!Data.CanPass && (
				<div className={`${classes.ExamAlert}`}>
					<img src='/svg/danger-triangle.svg' alt='' />
					<div className=' text-white size-8 font-600'>See the tutorials first</div>
					<div className=' text-white size-5 font-500' style={{ opacity: '0.75' }}>
						To pass the course exam, you must first view the course training
					</div>
				</div>
			)}

			<div className={`mt-30 mb-20 text-black font-700 size-14`}>Description</div>

			<div className={`text-lightgray size-6 font-400 mb-40`}>{Data.Description}</div>

			<div className='d-flex mb-40' style={{ gap: '20px' }}>
				{Data.IsPassed ? (
					<PrimaryButton
						onClick={() => {
							history.push('/Certificate/' + Chapter);
						}}
					>
						<img src='/svg/download-mini-white.svg' alt='' width={22} className='mr-8' />
						<span className='font-500 size-6 '>Download the certificate</span>
					</PrimaryButton>
				) : (
					<SecondaryButton style={{ height: '52px', padding: '0 24px' }}>
						<img src='/svg/download-mini-gray.svg' alt='' width={22} style={{ opacity: '0.5' }} className='mr-8' />
						<span className='font-500 size-6 text-lightgray'>Download the certificate</span>
					</SecondaryButton>
				)}

				{!Data.IsPassed ? (
					Data.CanPass && (
						<PrimaryButton onClick={TakeExamClickHandler}>
							<span className='font-500 size-6 text-white'>Start your exam</span>
							<img src='/svg/arrow-long-right-white.svg' alt='' width={22} className='ml-8' />
						</PrimaryButton>
					)
				) : (
					<SecondaryButton style={{ height: '52px', padding: '0 24px' }}>
						<span className='font-500 size-6 text-lightgray'>
							{Data.IsPassed ? 'Course Passed' : 'See the tutorials first'}
						</span>
						<img src='/svg/arrow-long-right.svg' alt='' width={22} style={{ opacity: '0.5' }} className='ml-8' />
					</SecondaryButton>
				)}
			</div>
		</div>
	);
};

export default ExamDescription;
