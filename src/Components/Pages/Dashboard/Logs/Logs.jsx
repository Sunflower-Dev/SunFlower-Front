import { Fragment, useEffect, useState } from 'react';
import { Route } from 'react-router';
import Logs from '../../../Layout/Log/LogContainer';
import LogFilter from './Filter/LogFilter';
import { axiosInstance } from '../../../../axios-global';
import LoadingSpinner from '../../../UI/LoadingSpinner';

const LogPage = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/client-log');
				var response = call.data;
				setData(response);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	return (
		<Fragment>
			<Route path='/Dashboard/Logs/Filter'>
				<LogFilter />
			</Route>
			{!data ? (
				<LoadingSpinner />
			) : (
				<Logs style={{ gridColumn: '1/3', padding: window.innerWidth < 550 && '10px 16px 70px' }} type='FULL' Logs={data} />
			)}
		</Fragment>
	);
};

export default LogPage;
