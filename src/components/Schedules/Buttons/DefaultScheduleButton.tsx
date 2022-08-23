import { ScheduleButtonProps } from './index.model';

import '../styles.scss';
import SortDown from '../../../assets/icons/sort-down.png';

import { GooglePlus } from '../../../lib/icons';

export default function DefaultScheduleButton(
	props: ScheduleButtonProps): JSX.Element {
	const { hocMethods } = props;
	const { toggleVisibility } = hocMethods;
	return (
		<div className='schedule__create-btn-wrapper'>
			<div className='create-schedule-inner'>
				<button
					className='create-schedule row center-xs middle-xs'
					onClick={toggleVisibility}
				>
					<GooglePlus />
					Create
					<img className='icon--small' src={SortDown} />
				</button>
			</div>
		</div>
	)
}