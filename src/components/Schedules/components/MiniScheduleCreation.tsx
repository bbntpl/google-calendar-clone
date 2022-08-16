import { GooglePlus } from '../../../lib/icons';
import { ScheduleCreationProps } from './ScheduleHOC';

export default function MiniScheduleCreation(props: ScheduleCreationProps): JSX.Element {
	const { hocMethods } = props;
	const { toggleVisibility } = hocMethods;
	return (
		<div className='google-plus-wrapper'>
			<button className='google-plus-wrapper--small' onClick={toggleVisibility}>
				<GooglePlus />
			</button>
		</div>
	)
}