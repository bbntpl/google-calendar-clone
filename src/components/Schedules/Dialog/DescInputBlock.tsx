import React, { Dispatch, SetStateAction } from 'react';
import { ScheduleStates } from '../index.model';

import '../styles.scss';
import DescIcon from '../../../assets/icons/desc.png';

interface DescriptionTextProps {
	description: string;
	setScheduleProps: Dispatch<SetStateAction<ScheduleStates>>
}

export default function DescInputBlock(props: DescriptionTextProps) {
	const {
		description,
		setScheduleProps,
	} = props;

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;

		// update desc prop values on change
		setScheduleProps((scheduleProps: ScheduleStates) => ({
			...scheduleProps,
			description: newValue,
		}));
	}

	return (
		<div className='schedule-input-list'>
			<span>
				<img src={DescIcon} />
			</span>
			<textarea
				{...props}
				className='schedule-input__textarea'
				placeholder={'Add description'}
				onChange={handleChange}
				value={description}
			/>
		</div>

	)
}