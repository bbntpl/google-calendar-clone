import React from 'react';
import ClockIcon from '../../../assets/icons/clock.png';

import {
	getScheduleTimeOptions,
} from '../../../util/calendar-arrangement';

export default function DateTimeInputs() {

	const selectHoursEl = () => {
		return (
			<select>
				{
					getScheduleTimeOptions().map(({ time }, hourIndex) => {
						return (
							<option
								key={`hour-${hourIndex}`}
							>{time}</option>
						)
					})
				}
			</select>
		)
	}

	return (
		<>
			<div className='schedule-input-list flex-centered'>
				<span>
					<img src={ClockIcon} />
				</span>
				<span className='input-division'>
					<div>
						<span>
							{/* {getShortDate(dayjsObj())} */}
						</span>
					</div>
					<div>
						{selectHoursEl()}
						{selectHoursEl()}
					</div>
				</span>
			</div>
		</>
	)
}