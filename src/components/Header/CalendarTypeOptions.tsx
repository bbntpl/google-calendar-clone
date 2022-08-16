import React, { useContext } from 'react';
import { CalendarType } from '../../context/global/index.model';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

import UserImage from '../../assets/icons/user.png';

export default function CalendarTypeOptions() {
	const {
		calendarType,
		setCalendarType,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const handleChangeCalendarType = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCalendarType(e.target.value as CalendarType);
	}

	return (
		<div className='row center-xs middle-xs max-content col-xs-offset-1'>
			<select
				className='header-input'
				value={calendarType}
				onChange={handleChangeCalendarType}
			>
				<option value='day'>Day</option>
				<option value='week'>Week</option>
				<option value='fourDays'>4 Days</option>
			</select>
			<a className='user-image-wrapper row middle-xs center-xs' href='#'>
				<img className='user-image' src={UserImage} />
			</a>
		</div>
	)
}