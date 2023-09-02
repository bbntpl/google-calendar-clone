import React from 'react';

interface CustomInputProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
}

export default function CustomInput(props: CustomInputProps) {
	return (
		<input
			{...props}
			className='schedule-input__text'
			type='text'
		/>
	)
}