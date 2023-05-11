import { Fragment, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../axios-global';
import { FloatSideBar } from '../../Layout/Sidebar/Sidebar';
import LoadingSpinner from '../../UI/LoadingSpinner';
import classes from './Courses.module.css';
import CourseSetting from './CourseSetting/CourseSetting';

const Chapter = props => {
	const history = useHistory();
	const location = useLocation();
	const { Chapter } = useParams();
	const [data, SetData] = useState(null);

	const OpenCourseClickHander = link => {
		const reg = /\/Courses\/\w*/;
		if (reg.exec(location.pathname)[0] === location.pathname) {
			history.push(location.pathname + '/' + link);
		} else {
			if (location.pathname.endsWith(link)) {
				history.goBack();
			} else {
				history.replace(reg.exec(location.pathname)[0] + '/' + link);
			}
		}
	};
	useEffect(() => {
		if (window.innerWidth < 550 && Chapter !== 'Setting') {
			(async () => {
				try {
					const call = await axiosInstance.get('/courses/GetCourseItem/' + Chapter);
					var response = call.data;
					SetData(response);
				} catch (error) {
					console.log(error);
				}
			})();
		} else {
			SetData({ Title: props.Title, Lessons: props.data, Exam: props.exam, Passed: props.Passed });
		}
	}, [Chapter, props]);

	const SidebarOpenClickHandler = () => {
		history.push(history.location.pathname + '/Sidebar');
	};
	return Chapter === 'Sidebar' ? (
		<FloatSideBar />
	) : Chapter === 'Setting' ? (
		<CourseSetting />
	) : data ? (
		<div className={`${classes.CourseItemContainer}`}>
			{window.innerWidth < 550 && (
				<Fragment>
					<div className={classes.MiniHeader}>
						<img src='/svg/arrow-left.svg' width={24} alt='back' onClick={() => history.goBack()} />
						<div className='font-600 size-8 text-black'>Courses</div>
						<img src='/images/profile_icon.png' width={38} alt='Avatar' onClick={SidebarOpenClickHandler} />
					</div>
					<div className='font-500 size-6 text-lightgray mt-20'>Course:</div>
					<div className='font-700 size-10 text-black mt-2 mb-15'>{data.Title}</div>
				</Fragment>
			)}

			{data.Lessons.map(item => (
				<div
					key={item._id}
					className={`${classes.CourseItemRow}`}
					onClick={() => OpenCourseClickHander(item._id)}
					style={{ opacity: window.innerWidth < 550 && item.status === 'PASSED' && '0.7' }}
				>
					{window.innerWidth > 550 &&
						(history.location.pathname.endsWith(item._id) ? (
							<svg width='4' height='30' viewBox='0 0 4 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<path d='M0 0H2C3.10457 0 4 0.895431 4 2V28C4 29.1046 3.10457 30 2 30H0V0Z' fill='#FFD020' />
							</svg>
						) : (
							<div></div>
						))}
					{window.innerWidth < 550 ? (
						<Fragment>
							<img src='/images/course.png' width={69} alt='img' />
							<div className={`font-500 size-3 text-darkgray ${classes.CourseItemMiniTitle}`}>{item.Title}</div>
							<div
								className={`${classes.ChapterListMiniSubTitle} font-400 size-1 text-lightgray ${classes.CourseItemMiniSub}`}
							>
								<img src={`/svg/eye${item.status === 'PASSED' ? '-green' : ''}.svg`} alt='eye' className='mr-6' />
								<span className={`${item.status === 'PASSED' && 'text-green'} mr-8`}>
									{item.status === 'PASSED' ? 'Passed' : 'Not Passed'}
								</span>
								<span className='mr-8'>|</span>
								<img src='/svg/clock.svg' alt='course' className='mr-6' width={14} />
								<span>{item.Time} min read</span>
							</div>
							<img src='/svg/arrow-right.svg' width={24} className={classes.MiniArrowChapterItem} alt='lock' />
						</Fragment>
					) : (
						<div className={`${classes.CourseItemTitle}`}>
							<svg width='8' height='8' viewBox='0 0 8 8' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<circle cx='4' cy='4' r='4' fill={item.Passed.includes(props.MyId) ? '#48EA81' : '#E1E2E6'} />
							</svg>
							<span
								className={`${
									history.location.pathname.endsWith(item._id) ? 'text-darkgray font-500' : 'text-lightgray font-400'
								} size-5 ml-8`}
							>
								{item.Title}
							</span>
						</div>
					)}
				</div>
			))}

			<div
				className={`${classes.CourseItemRow}`}
				onClick={() => OpenCourseClickHander('Exam')}
				style={{ opacity: window.innerWidth < 550 && '0.7' }}
			>
				{window.innerWidth < 550 ? (
					<Fragment>
						<img src='/images/course.png' width={69} alt='img' />
						<div className={`font-500 size-3 text-darkgray ${classes.CourseItemMiniTitle}`}>{data.Exam.Title}</div>
						<div className={`${classes.ChapterListMiniSubTitle} font-400 size-1 text-lightgray ${classes.CourseItemMiniSub}`}>
							<img src={`/svg/eye.svg`} alt='eye' className='mr-6' />
							<span className={`mr-8`}>Not Passed</span>
						</div>
						<img src='/svg/arrow-right.svg' width={24} className={classes.MiniArrowChapterItem} alt='lock' />
					</Fragment>
				) : (
					<>
						{window.innerWidth > 550 &&
							(history.location.pathname.endsWith('Exam') ? (
								<svg width='4' height='30' viewBox='0 0 4 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
									<path d='M0 0H2C3.10457 0 4 0.895431 4 2V28C4 29.1046 3.10457 30 2 30H0V0Z' fill='#FFD020' />
								</svg>
							) : (
								<div></div>
							))}
						<div className={`${classes.CourseItemTitle}`}>
							<svg width='8' height='8' viewBox='0 0 8 8' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<circle
									cx='4'
									cy='4'
									r='4'
									fill={data.Passed.filter(p => p.Admin === props.MyId).length > 0 ? '#48EA81' : '#E1E2E6'}
								/>
							</svg>
							<span className={`font-400 size-5 text-lightgray ml-8`}>{data.Exam.Title}</span>
						</div>
					</>
				)}
			</div>
		</div>
	) : (
		!data && <LoadingSpinner />
	);
};

export default Chapter;
