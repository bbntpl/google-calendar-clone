import React from 'react';
import LocationIcon from '../../../assets/icons/location.png';

export default function LocationInput() {
	return (
		<div className='schedule-input-list'>
			<span>
				<img src={LocationIcon} />
			</span>
			<div>
				<input
					type='text'
					placeholder='Add location of the event'
					value={location}
					onChange={(e) => {
						setScheduleProps(scheduleProps => ({
							...scheduleProps,
							location: e.target.value,
						}));
					}}
				/>
			</div>
		</div>
	)
}