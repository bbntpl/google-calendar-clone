import React from 'react';

import '../styles.scss';
import DescIcon from '../../../assets/icons/desc.png';

interface DescriptionTextProps {
	description: string;
	handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function DescInputBlock(props: DescriptionTextProps) {
	const { description, handleChange, ...textAreaAttrs } = props;

	return (
		<div className='schedule-input-list'>
			<span>
				<img src={DescIcon} />
			</span>
			<textarea
				{...textAreaAttrs}
				className='schedule-input__textarea'
				placeholder={'Add description'}
				onChange={handleChange}
				value={description}
			/>
		</div>
	)
}