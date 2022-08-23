import { GooglePlus } from '../../../lib/icons';
import { ScheduleButtonProps } from './index.model';

export default function MiniScheduleButton(props: ScheduleButtonProps): JSX.Element {
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