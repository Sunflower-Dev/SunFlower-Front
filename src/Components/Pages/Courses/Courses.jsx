import { Fragment, useEffect, useState } from 'react';
import classes from './Courses.module.css';
import { PieChart, Pie, Cell, Label } from 'recharts';
import { Route, useHistory, useLocation } from 'react-router-dom';
import CourseBody from './CourseBody';
import Chapter from './Chapter';
import SecondaryButton from '../../UI/Bottons/SecondaryButton';
import CourseSetting from './CourseSetting/CourseSetting';
import { axiosInstance } from '../../../axios-global';
import LoadingSpinner from '../../UI/LoadingSpinner';
import { useSelector } from 'react-redux';

const Courses = () => {
	const history = useHistory();
	const location = useLocation();
	const [CourseList, SetCourseList] = useState(null);
	const [MyId, SetMyId] = useState('');
	const [MaxScore, SetMaxScore] = useState(0);
	const [MyScore, SetMyScore] = useState(0);
	const [PassedCourseCount, SetPassedCourseCount] = useState(0);
	const [chartData, SetchartData] = useState([]);

	const Permissions = JSON.parse(useSelector(state => state.Auth.Admin)).Permissions;

	const COLORS = ['#dfdfe2', '#f58986'];

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/courses');
				var response = call.data;
				SetCourseList(response.CourseList);
				SetMyId(response.id);

				var FinalScore = 0;
				var __MyScore = 0;
				var __PassedCourseCount = 0;
				response.CourseList.forEach(element => {
					FinalScore += element.Exam.Questions.length;
					if (element.Passed.includes(response.id)) {
						__MyScore += element.Exam.Questions.length;
						__PassedCourseCount++;
					}
				});
				SetMaxScore(FinalScore);
				SetMyScore(__MyScore);
				SetPassedCourseCount(__PassedCourseCount);
				let FillPercentage = parseInt((100 * __PassedCourseCount) / response.CourseList.length);

				SetchartData([
					{ name: 'empty', value: 100 - FillPercentage },
					{ name: 'Filled', value: FillPercentage },
				]);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const OpenChapterClickHander = link => {
		if (location.pathname === '/Courses') {
			history.push('/Courses/' + link);
		} else {
			if (location.pathname.endsWith(link)) {
				history.goBack();
			} else {
				history.replace('/Courses/' + link);
			}
		}
	};
	const SidebarOpenClickHandler = () => {
		history.push(history.location.pathname + '/Sidebar');
	};

	const openSettingClickHandler = () => {
		history.push('/Courses/Setting');
	};

	return !CourseList ? (
		<LoadingSpinner />
	) : (
		<Fragment>
			<div className={classes.StatusContainer}>
				<div className={`${classes.StatusSection}`}>
					{window.innerWidth < 550 && (
						<div className={classes.MiniHeader}>
							<div className='font-600 size-8 text-black'>Sunflower</div>
							<img src='/images/profile_icon.png' width={38} alt='Avatar' onClick={SidebarOpenClickHandler} />
						</div>
					)}
					<div className={`${classes.StatusTitle} font-700 ${window.innerWidth > 550 ? 'size-20' : 'size-10'} text-black`}>
						Welcome to the courses
					</div>
					<div className={`${classes.StatusSubTitle} font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-4'} text-black`}>
						If other parts of the panel are locked for you and you can not use the panel, you must first pass the courses with
						full grades, and finally, after getting a score of {MaxScore}, the panel will open for you.
					</div>
					{window.innerWidth > 550 && (
						<div className={`${classes.StatusScoreContainer}`}>
							<div className={`font-600 size-22 text-green text-center mb-8`}>{MyScore}</div>
							<div className={`font-500 size-6 text-darkgray text-center ${classes.StatusScoreTitle}`}>
								Your current score
							</div>
							<div className={`${classes.StatusScoreScroll}`}>
								{CourseList.map(item => (
									<div className={`${classes.StatusScoreItem}`} key={item._id}>
										<span className={`font-400 size-4 text-lightgray`}>{item.Title}</span>
										<span className={`font-500 size-4 text-lightgray`}>
											{item.Passed.includes(MyId) ? item.Exam.Questions.length : 0}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<div className={`${classes.Card} ${classes.StatusChartContainer}`}>
					<PieChart
						width={window.innerWidth > 550 ? 289 : 60}
						height={window.innerWidth > 550 ? 165 : 60}
						className={`${classes.chart}`}
					>
						<Pie
							data={chartData}
							cx={window.innerWidth > 550 ? 144 : 25}
							cy={window.innerWidth > 550 ? 77 : 25}
							innerRadius={window.innerWidth > 550 ? 70 : 26}
							outerRadius={window.innerWidth > 550 ? 80 : 29}
							startAngle={90}
							endAngle={450}
							fill='#dfdfe2'
							paddingAngle={0}
							dataKey='value'
							barGap={0}
							isAnimationActive={false}
							legendType='circle'
						>
							{chartData.length > 0 && (
								<Label
									position={'center'}
									className={`font-600 ${window.innerWidth > 550 ? 'size-22 text-darkgray' : 'size-4 text-lightgray'}`}
								>
									{chartData[1].value + '%'}
								</Label>
							)}
							{chartData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
							))}
						</Pie>
					</PieChart>

					<div
						className={`font-600 text-darkgray ${window.innerWidth > 550 ? 'size-10 mt-24 mb-10 text-center' : 'size-5'} ${
							classes.ChartTitle
						}`}
					>
						passed courses
					</div>
					<div
						className={`font-400 text-lightgray ${window.innerWidth > 550 ? 'size-6 text-center' : 'size-2'} ${
							classes.ChartSubTitle
						}`}
					>
						{PassedCourseCount} of {CourseList.length} courses
					</div>
					{window.innerWidth < 500 && <img src='/images/doublehand-Emoji.png' alt='emoji' className={classes.ChartImg} />}
				</div>
			</div>
			<div className={classes.CourseContainer}>
				<div className={` ${classes.CourseList}`}>
					<div className={`${window.innerWidth > 550 && classes.Card} ${window.innerWidth > 550 && 'pr-20'} pt-25 mb-20`}>
						<div
							className={`text-black ${window.innerWidth > 550 ? 'font-600 size-14 mb-25 ml-20' : 'font-700 size-10 mb-15'} ${
								classes.CourseListTitle
							}`}
						>
							Courses
							{window.innerWidth < 550 && (
								<span className={`font-400 size-4 text-lightgray`}>{CourseList.length} courses</span>
							)}
						</div>
						{window.innerWidth > 550 ? (
							<Fragment>
								{CourseList.map(course => (
									<div className={`${classes.CourseParallax}`} key={course._id}>
										<div
											className={`${classes.CourseParallaxHeader} ${
												history.location.pathname.includes('/Courses/' + course._id) && classes.active
											}`}
											onClick={() => OpenChapterClickHander(course._id)}
										>
											<img
												src={`/svg/lock-${
													history.location.pathname.includes('/Courses/' + course._id) ? 'open' : 'close'
												}.svg`}
												className={classes.CourseParallaxLock}
												alt='lock'
											/>
											<div className={`font-500 size-6 text-darkgray`}>{course.Title}</div>
											<svg
												width='16'
												height='16'
												viewBox='0 0 16 16'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
												className={classes.CourseParallaxArrow}
											>
												<path
													d='M13.28 5.9668L8.9333 10.3135C8.41997 10.8268 7.57997 10.8268 7.06664 10.3135L2.71997 5.9668'
													stroke='#9899A2'
													strokeWidth='1.5'
													strokeMiterlimit='10'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										</div>
										<Route path={`/Courses/${course._id}`}>
											<Chapter
												Title={course.Title}
												data={course.Lessons}
												exam={course.Exam}
												MyId={MyId}
												Passed={course.Passed}
											/>
										</Route>
									</div>
								))}
							</Fragment>
						) : (
							<Fragment>
								{CourseList.map(course => (
									<div
										className={`${classes.CourseParallax}`}
										key={course._id}
										onClick={() => OpenChapterClickHander(course._id)}
									>
										<div className={classes.MiniLockGreen}>
											<img src='/svg/lock-open-fill.svg' className={classes.CourseParallaxLock} alt='lock' />
										</div>

										<div className={`font-500 size-3 text-darkgray`}>{course.Title}</div>
										<div className={`${classes.ChapterListMiniSubTitle} font-400 size-1 text-lightgray`}>
											<img src='/svg/eye-green.svg' alt='eye' className='mr-6' />
											<span className='text-green mr-8'>Passed</span>
											<span className='mr-8'>|</span>
											<img src='/svg/sidebar/Course-normal.svg' alt='course' className='mr-6' width={14} />
											<span>{course.Lessons.length} Education</span>
										</div>
										<img src='/svg/arrow-right.svg' width={24} className={classes.MiniArrowChapterItem} alt='lock' />
									</div>
								))}
							</Fragment>
						)}
					</div>

					{Permissions.Edit.includes('course') && (
						<SecondaryButton
							style={{ padding: '15px 0', height: 'auto', display: 'flex', gap: '8px' }}
							onClick={openSettingClickHandler}
						>
							<img src='/svg/setting.svg' alt='' />
							<div className={`text-darkgray font-500 size-6`}>Course settings</div>
						</SecondaryButton>
					)}
				</div>

				<Route path='/Courses/Setting' exact>
					<CourseSetting />
				</Route>

				<Route path='/Courses/:Chapter/:Course' exact>
					<CourseBody />
				</Route>
			</div>
		</Fragment>
	);
};

export default Courses;
