import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AuthActions } from '../../../store/index';

import LeftIconInput from '../../UI/Inputs/LeftIconInput';
import Input from '../../UI/Inputs/Input';
import PasswordInput from '../../UI/Inputs/PasswordInput';
import PrimaryButton from '../../UI/Bottons/PrimaryButton';
import SecondaryButton from '../../UI/Bottons/SecondaryButton';
import CheckBox from '../../UI/Inputs/CheckBox';

import classes from './login.module.css';
import axios from 'axios';
import { RefreshToken } from '../../../axios-global';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
	const dispatch = useDispatch();

	const [IsLoading, setIsLoading] = useState(false);
	const [usernameError, setUsernameError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);
	const [CodeError, setCodeError] = useState(null);
	const [Form_data, SetFormSata] = useState({});

	const [LoginState, SetLoginState] = useState('Login');

	const formSubmissionHandler = async event => {
		event.preventDefault();
		setIsLoading(true);

		try {
			const call = await axios.post(process.env.REACT_APP_BASE_URL + '/admins/Login', Form_data);
			var response = call.data;
			setIsLoading(false);
			const { Name, Permissions, Avatar, token, _id } = response;
			localStorage.setItem('token', token);

			RefreshToken(token);
			dispatch(
				AuthActions.Login({
					Token: token,
					_id,
					Admin: JSON.stringify({
						Name,
						Avatar,
						Permissions,
					}),
				}),
			);
		} catch (error) {
			console.log(error);

			var errdata = error.response.data;
			setIsLoading(false);

			if (errdata.message.includes('Password')) {
				setPasswordError(errdata.message);
			} else if (errdata.message.includes('Email')) {
				setUsernameError(errdata.message);
			}
		}
	};

	const SendRecoveryCodeHandler = async event => {
		event.preventDefault();
		setIsLoading(true);
		try {
			const call = await axios.post(process.env.REACT_APP_BASE_URL + '/admins/forgotpass/SendRecoveryCode', {
				Email: Form_data.Email,
			});
			var response = call.data;
			setIsLoading(false);
			SetLoginState('RecoverCode');
		} catch (error) {
			console.log(error);
			var errdata = error.response.data;
			setIsLoading(false);
			setUsernameError(errdata.message);
		}
	};

	const VerifyCodeHandler = async event => {
		event.preventDefault();
		setIsLoading(true);
		try {
			const call = await axios.post(process.env.REACT_APP_BASE_URL + '/admins/forgotpass/VerifyRecoveryCode', {
				Email: Form_data.Email,
				Code: Form_data.Code,
			});
			var response = call.data;
			setIsLoading(false);
			setPasswordError(null);
			SetLoginState('ChangePassword');
		} catch (error) {
			console.log(error);

			var errdata = error.response.data;
			setIsLoading(false);
			setCodeError(errdata.message);
		}
	};

	const ChangePasswordHandler = async event => {
		event.preventDefault();
		if (Form_data.NewPassword === Form_data.RepeatPassword) {
			setIsLoading(true);
			try {
				const call = await axios.put(process.env.REACT_APP_BASE_URL + '/admins/forgotpass/NewPassword', {
					Email: Form_data.Email,
					Code: Form_data.Code,
					Password: Form_data.NewPassword,
				});
				var response = call.data;
				setIsLoading(false);
				SetLoginState('Login');
				setUsernameError(null);
				setPasswordError(null);

				toast.success('Password changed successfully! Login Now!', {
					position: 'bottom-center',
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			} catch (error) {
				console.log(error);
				var errdata = error.response.data;
				setIsLoading(false);
				setUsernameError(errdata.message);
			}
		} else {
			setPasswordError('Repeat password not match!');
		}
	};

	const handleChange = event => {
		const name = event.target.name;
		const value = event.target.value;

		SetFormSata({ ...Form_data, [name]: value });
	};

	return (
		<div
			className={classes['login--background']}
			style={{ background: `url('${process.env.PUBLIC_URL}/images/login-background.png')` }}
		>
			<img src='/svg/logo-white.svg' width='92px' alt='logo' className={classes.logo} />

			{LoginState === 'Login' && (
				<form onSubmit={formSubmissionHandler} className={classes.card}>
					<div className={`text-black size-22 font-700 ${classes.title}`}>Welcome back!</div>
					<div className={`text-lightgray size-6 font-400 ${classes.title} ${classes.description}`}>
						Welcome to the Sunflower panel
					</div>
					<LeftIconInput
						className={`mt-50 ${classes.Username}`}
						label='Username or Email'
						icon='user'
						placeholder='Enter your email'
						type='text'
						name='Email'
						onFocus={() => {
							setUsernameError(null);
						}}
						ErrorText={usernameError}
						onChange={handleChange}
					/>

					<PasswordInput className='mt-20' onChange={handleChange} name='Password' ErrorText={passwordError} />

					<div className={classes.forgetContainer}>
						<span
							className={`text-secondaryred size-4 font-400 ${classes.link}`}
							onClick={() => SetLoginState('ForgetPasswrod')}
						>
							Forget password!
						</span>

						<CheckBox className={`mt-42 mb-20 ${classes.rememberme}`}>Remember me</CheckBox>
					</div>

					<PrimaryButton className={`font-500 size-6 ${classes.button_login}`} type='submit' IsLoading={IsLoading}>
						sign In
					</PrimaryButton>
				</form>
			)}
			{LoginState === 'ForgetPasswrod' && (
				<form onSubmit={SendRecoveryCodeHandler} className={classes.card}>
					<div className={`text-black size-22 font-700 ${classes.title}`}>ForgetPassword!</div>
					<div className={`text-lightgray size-6 font-400 ${classes.title} ${classes.description}`}>
						For recover your password enter your email
					</div>
					<LeftIconInput
						className={`mt-50 ${classes.Username}`}
						label='Email'
						icon='user'
						placeholder='Enter your email'
						type='text'
						name='Email'
						onFocus={() => {
							setUsernameError(null);
						}}
						ErrorText={usernameError}
						onChange={handleChange}
					/>

					<div className={classes.row}>
						<SecondaryButton
							style={{ height: '52px' }}
							type='button'
							onClick={() => SetLoginState('Login')}
							className={`font-500 size-6 ${classes.button_login}`}
						>
							Cancel
						</SecondaryButton>
						<PrimaryButton className={`font-500 size-6 ${classes.button_login}`} type='submit' IsLoading={IsLoading}>
							Send recover code
						</PrimaryButton>
					</div>
				</form>
			)}
			{LoginState === 'RecoverCode' && (
				<form onSubmit={VerifyCodeHandler} className={classes.card}>
					<div className={`text-black size-22 font-700 ${classes.title}`}>Verify Code!</div>
					<div className={`text-lightgray size-6 font-400 ${classes.title} ${classes.description}`}>
						Enter A 4 digit number received in your email
					</div>
					<Input
						className={`mt-50 ${classes.Username}`}
						label='Recover code'
						placeholder='Enter 4 digit code'
						type='text'
						name='Code'
						onFocus={() => {
							setCodeError(null);
						}}
						ErrorText={CodeError}
						onChange={handleChange}
					/>

					<div className={classes.row}>
						<SecondaryButton
							style={{ height: '52px' }}
							type='button'
							onClick={() => SetLoginState('ForgetPasswrod')}
							className={`font-500 size-6 ${classes.button_login}`}
						>
							Back
						</SecondaryButton>
						<PrimaryButton className={`font-500 size-6 ${classes.button_login}`} type='submit' IsLoading={IsLoading}>
							Verify
						</PrimaryButton>
					</div>
				</form>
			)}
			{LoginState === 'ChangePassword' && (
				<form onSubmit={ChangePasswordHandler} className={classes.card}>
					<div className={`text-black size-22 font-700 ${classes.title}`}>new password!</div>
					<div className={`text-lightgray size-6 font-400 ${classes.title} ${classes.description}`}>
						Enter new password for your Account
					</div>

					<PasswordInput
						className='mt-20'
						onChange={handleChange}
						label='New password'
						name='NewPassword'
						ErrorText={passwordError}
					/>

					<PasswordInput
						className='mt-20'
						onChange={handleChange}
						label='Repeat password'
						name='RepeatPassword'
						ErrorText={passwordError}
					/>

					<PrimaryButton className={`font-500 size-6 ${classes.button_login} mt-40`} type='submit' IsLoading={IsLoading}>
						Change Password
					</PrimaryButton>
				</form>
			)}

			<ToastContainer
				position='bottom-center'
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='colored'
			/>
		</div>
	);
};

export default Login;
