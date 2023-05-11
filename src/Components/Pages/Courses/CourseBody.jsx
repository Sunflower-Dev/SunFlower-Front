import { Fragment, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../axios-global';
import { FloatSideBar } from '../../Layout/Sidebar/Sidebar';

import PrimaryButton from '../../UI/Bottons/PrimaryButton';
import LoadingSpinner from '../../UI/LoadingSpinner';
import classes from './Courses.module.css';
import {
	ControlBar,
	CurrentTimeDisplay,
	ForwardControl,
	PlaybackRateMenuButton,
	Player,
	ReplayControl,
	TimeDivider,
	VolumeMenuButton,
} from 'video-react';
import './video-react.css';
import ExamDescription from './ExamDescription/ExamDescription';

const CourseBody = props => {
	let { Course } = useParams();
	const history = useHistory();

	const [LessonData, SetLessonData] = useState(null);

	const SidebarOpenClickHandler = () => {
		history.push(history.location.pathname + '/Sidebar');
	};

	useEffect(() => {
		if (Course !== 'Sidebar' && Course !== 'Exam') {
			(async () => {
				try {
					const call = await axiosInstance.get('/courses/GetLesson/' + Course);
					var response = call.data;
					SetLessonData(response);
					if (response.Lesson.IsPassed === false) {
						setTimeout(async () => {
							try {
								const call = await axiosInstance.put('/courses/PassLesson/' + Course);
								var response = call.data;
							} catch (error) {
								console.log(error);
							}
						}, 10000);
					}
				} catch (error) {
					console.log(error);
				}
			})();
		}
	}, [Course]);

	return Course === 'Sidebar' ? (
		<FloatSideBar />
	) : Course === 'Exam' ? (
		<ExamDescription />
	) : !LessonData ? (
		<LoadingSpinner />
	) : (
		<div className={`${classes.CourseBodyContainer}`}>
			{window.innerWidth < 550 && (
				<Fragment>
					<div className={classes.MiniHeader}>
						<img src='/svg/arrow-left.svg' width={24} alt='back' onClick={() => history.goBack()} />
						<div className='font-600 size-8 text-black'>Training</div>
						<img src='/images/profile_icon.png' width={38} alt='Avatar' onClick={SidebarOpenClickHandler} />
					</div>
				</Fragment>
			)}

			<div className={`font-700 ${window.innerWidth > 550 ? 'size-18 mb-20' : 'size-10 mt-20 mb-4'} text-black `}>
				{LessonData.Lesson.Title}
			</div>

			{window.innerWidth < 550 && (
				<div className={`${classes.ChapterListMiniSubTitle} font-400 size-1 mb-12 text-lightgray`}>
					<img src={`/svg/eye.svg`} alt='eye' className='mr-6' />
					<span className={`mr-8`}>Not Passed</span>
					<span className='mr-8'>|</span>
					<img src='/svg/clock.svg' alt='course' className='mr-6' width={14} />
					<span>{LessonData.Lesson.ReadingTime} min read</span>
				</div>
			)}

			{LessonData.Lesson.Video !== 'NONE' && (
				<Player className={`${classes.VideoContainer}`}>
					<source src={`${process.env.REACT_APP_SRC_URL}${LessonData.Lesson.Video}`} />
					<ControlBar>
						<ReplayControl seconds={10} order={1.1} />
						<ForwardControl seconds={30} order={1.2} />
						<CurrentTimeDisplay order={4.1} />
						<TimeDivider order={4.2} />
						<PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
						<VolumeMenuButton disabled />
					</ControlBar>
				</Player>
			)}

			{window.innerWidth > 550 && (
				<div className={`${classes.CourseInfo}`}>
					<div className={`${classes.CourseInfoItem}`}>
						<div className={`${classes.CourseInfoItemImg}`}>
							<img src='/svg/clock-dark.svg' alt='clock' />
						</div>
						<div className={`font-600 size-3 text-darkgray ${classes.CourseInfoItemTitle}`}>Training time</div>
						<div className={`font-400 size-5 text-lightgray ${classes.CourseInfoItemSubTitle}`}>
							{LessonData.Lesson.ReadingTime} min read
						</div>
					</div>
					<div className={classes.divider}></div>

					<div className={`${classes.CourseInfoItem} ml-30`}>
						<div className={`${classes.CourseInfoItemImg}`}>
							<img src='/svg/eye-dark.svg' alt='clock' />
						</div>
						<div className={`font-600 size-3 text-darkgray ${classes.CourseInfoItemTitle}`}>Training status</div>
						<div
							className={`font-400 size-5 ${LessonData.Lesson.IsPassed ? 'text-green' : 'text-lightgray'} 
                                ${classes.CourseInfoItemSubTitle}`}
						>
							{LessonData.Lesson.IsPassed ? 'Passed' : 'Not Passed'}
						</div>
					</div>

					<div className={classes.divider}></div>

					<div className={`${classes.CourseInfoItem} ml-30 `}>
						<div className={`${classes.CourseInfoItemImg}`}>
							<img src='/svg/course-dark.svg' alt='clock' />
						</div>
						<div className={`font-600 size-3 text-darkgray ${classes.CourseInfoItemTitle}`}>Course</div>
						<div className={`font-400 size-5 text-lightgray ${classes.CourseInfoItemSubTitle}`}>{LessonData.CourseTitle}</div>
					</div>
				</div>
			)}

			<div className={`font-400 text-lightgray mb-40 ${window.innerWidth > 550 ? 'size-6' : 'size-3 mt-25'}`}>
				{/* <div className={`${window.innerWidth > 550 ? "size-14 mb-20" : "size-7 mb-12"} font-700 text-black`}>Description</div> */}
				<div dangerouslySetInnerHTML={{ __html: LessonData.Lesson.Description }}></div>
			</div>

			<PrimaryButton
				className={`mb-40 font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-4'}`}
				style={{ width: window.innerWidth < 550 && '100%' }}
			>
				Next tutorial
				<img src='/svg/arrow-long-right-white.svg' className='ml-8' alt='arrow' />
			</PrimaryButton>
		</div>
	);
};

export default CourseBody;
