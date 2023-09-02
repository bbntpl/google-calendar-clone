import React, { useContext } from 'react';
import { CalendarUnits } from '../../context/global/index.model';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

import UserImage from '../../assets/icons/user.png';

export default function CalendarUnitSelector() {
	const {
		selectedCalendarUnit,
		setSelectedCalendarUnit,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const handleCalendarUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCalendarUnit(e.target.value as CalendarUnits);
	}

	return (
		<div className='row center-xs middle-xs max-content col-xs-offset-1'>
			<select
				className='header-input'
				value={selectedCalendarUnit}
				onChange={handleCalendarUnitChange}
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