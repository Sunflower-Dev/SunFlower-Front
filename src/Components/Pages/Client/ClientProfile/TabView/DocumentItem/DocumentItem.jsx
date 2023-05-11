import moment from 'moment';
import { useEffect } from 'react';
import { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MobilePopup from '../../../../../UI/Popup/MobilePopup/MobilePopup';
import classes from './DocumentItem.module.css';

const DocumentItem = props => {
	const history = useHistory();
	const [isManagerOpen, setIsManagerOpen] = useState(false);

	var IMGSRC;
	if (props.data.Type === 'ZIP') IMGSRC = '/svg/FileTypes/zip.svg';
	if (props.data.Type === 'JPG' || props.data.Type === 'PNG' || props.data.Type === 'JPEG') IMGSRC = '/svg/FileTypes/img.svg';
	if (props.data.Type === 'PDF' || props.data.Type === 'DOCX' || props.data.Type === 'XLSX' || props.data.Type === 'TXT')
		IMGSRC = '/svg/FileTypes/pdf.svg';
	if (props.data.Type === 'MP4') IMGSRC = '/svg/FileTypes/video.svg';
	if (props.data.Type === 'MP3') IMGSRC = '/svg/FileTypes/sound.svg';

	const onDocumentDeleteHandler = () => {
		if (history.location.pathname.includes('/DocSetting')) {
			history.replace(history.location.pathname.replace('/DocSetting', '') + '/DeleteDocument/' + props.data._id);
		} else {
			history.push(history.location.pathname + '/DeleteDocument/' + props.data._id);
		}
	};

	const DocClickHandler = () => {
		if (window.innerWidth < 550) {
			setIsManagerOpen(true);
			history.push(history.location.pathname + '/DocSetting');
		}
	};

	useEffect(() => {
		if (!history.location.pathname.includes('/DocSetting')) {
			setIsManagerOpen(false);
		}
	}, [history.location.pathname]);

	return (
		<>
			<div className={`${classes.Container} ${props.data.Status === 'PENDING' && classes.redborder}`}>
				<div className={classes.detail}>
					<img alt='Type' src={IMGSRC} />
					<div className={`font-500 ${window.innerWidth > 550 ? 'size-8' : 'size-3'} text-darkgray`}>{props.data.Title}</div>

					{window.innerWidth > 550 ? (
						<Fragment>
							<a
								className={classes.download}
								href={`${process.env.REACT_APP_BASE_URL}${props.data.File}`}
								target='_blank'
								rel='noreferrer'
							>
								<img alt='download' src='/svg/download-mini-gray.svg' />
							</a>

							<div className={classes.delete} onClick={onDocumentDeleteHandler}>
								<img alt='delete' src='/svg/trash-darkgray.svg' />
							</div>
						</Fragment>
					) : (
						<svg
							width='18'
							height='18'
							viewBox='0 0 18 18'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							onClick={DocClickHandler}
						>
							<path
								d='M10.5 3.75C10.5 2.925 9.825 2.25 9 2.25C8.175 2.25 7.5 2.925 7.5 3.75C7.5 4.575 8.175 5.25 9 5.25C9.825 5.25 10.5 4.575 10.5 3.75Z'
								fill='#282A3E'
							/>
							<path
								d='M10.5 14.25C10.5 13.425 9.825 12.75 9 12.75C8.175 12.75 7.5 13.425 7.5 14.25C7.5 15.075 8.175 15.75 9 15.75C9.825 15.75 10.5 15.075 10.5 14.25Z'
								fill='#282A3E'
							/>
							<path
								d='M10.5 9C10.5 8.175 9.825 7.5 9 7.5C8.175 7.5 7.5 8.175 7.5 9C7.5 9.825 8.175 10.5 9 10.5C9.825 10.5 10.5 9.825 10.5 9Z'
								fill='#282A3E'
							/>
						</svg>
					)}
				</div>

				<div
					className={`${props.data.Status === 'PENDING' ? classes['info-confirmation'] : classes['info-normal']} ${classes.info}`}
				>
					<img alt='avatar' src={process.env.REACT_APP_SRC_URL + props.data.Uploader?.Avatar ?? ''} />
					<div className={`font-400 ${window.innerWidth > 550 ? 'size-4' : 'size-1'} text-lightgray`}>
						{props.data.Uploader?.Name}
					</div>
					{props.data.Status === 'PENDING' && window.innerWidth > 550 && (
						<div className={`font-400 size-4 text-secondaryred ${classes.rightbordered}`}>confirmation</div>
					)}
					<div className={`font-400 ${window.innerWidth > 550 ? 'size-4' : 'size-1'} text-lightgray ${classes.rightbordered}`}>
						{moment(props.data.CreatedAt).format('DD MMM YYYY')}
					</div>

					<div className={`${classes.Type} font-400 size-4 text-lightgray`}>{props.data.Type}</div>
				</div>
			</div>

			{history.location.pathname.includes('/DocSetting') && isManagerOpen && (
				<MobilePopup>
					<a
						className={`${classes.ActionItem} size-4 font-400 text-lightgray`}
						href={`${process.env.REACT_APP_BASE_URL}${props.data.File}`}
						target='_blank'
						rel='noreferrer'
					>
						<img src='/svg/eye-dark.svg' width={24} alt='view' /> <span>view Document</span>
					</a>

					<div className={`${classes.ActionItem} size-4 font-400 text-lightgray`} onClick={onDocumentDeleteHandler}>
						<img src='/svg/trash-darkgray.svg' width={24} alt='view' /> <span>delete Document</span>
					</div>
				</MobilePopup>
			)}
		</>
	);
};

export default DocumentItem;
