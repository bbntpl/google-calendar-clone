import { LegacyRef } from 'react';
import { GooglePlus } from '../../../lib/icons';
import { ScheduleButtonProps } from './index.model';

function MiniScheduleButton(
	props: ScheduleButtonProps,
	linkRef: LegacyRef<HTMLButtonElement> | undefined,
): JSX.Element {
	const { hocMethods } = props;
	const { toggleVisibility } = hocMethods;
	return (
		<div className='google-plus-wrapper'>
			<button
				ref={linkRef}
				className='google-plus-wrapper--small'
				onClick={toggleVisibility}>
				<GooglePlus />
			</button>
		</div>
	)
}

export default MiniScheduleButton