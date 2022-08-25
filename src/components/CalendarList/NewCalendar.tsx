import React, { useState } from 'react';
import {
	UserActionType,
	CalendarLabelType,
	COLORS,
} from '../../context/global/index.model';
import useComponentVisible from '../../hooks/useComponentVisible';
import { uniqueID } from '../../util/reusable-funcs';
import { AddNewCalendarProps, InitCalendarLblProps } from './index.model';
import { DialogProps } from '../../lib/Dialog/index.model';
import './styles.scss';

import Dialog from '../../lib/Dialog';
import Options from './Options';

const initCalendarLblProps: InitCalendarLblProps = {
	name: '',
	color: 'black',
	selected: false,
	removable: true,
}

export default function NewCalendar(props: AddNewCalendarProps) {
	const {
		setShowAddLblBtn,
		calendarList,
		dispatchCalendarList,
		recordPos,
	} = props;

	const [newCalendar, setNewCalendar] = useState(initCalendarLblProps);
	const [dialogRef, isDialogVisible, setIsDialogVisible] = useComponentVisible(false);

	// event handlers
	const addCalendar = () => {
		dispatchCalendarList({
			type: UserActionType.ADD,
			payload: { ...newCalendar, id: uniqueID() },
		})
	}

	const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return
		handleLblInput();
	};

	const handleLblInput = () => {
		addCalendar();
		setShowAddLblBtn(false);
	}

	const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewCalendar({ ...newCalendar, name: e.target.value });
	}

	const handleColorChange = (color: COLORS) => {
		setNewCalendar({ ...newCalendar, color });
	}

	// props to be passed on the reusable dialog component
	const componentProps = {
		flags: { options: false, colors: true },
		calendarProps: newCalendar as CalendarLabelType,
		globalContextProps: {
			calendarList,
			dispatchCalendarList,
		},
		eventHandlers: {
			setNewCalendar,
			handleColorChange,
		},
	}

	const dialogOptionsProps: DialogProps = {
		componentProps,
		Component: Options,
		isDialogVisible,
		positionOffset: { x: 0, y: 0 },
		setIsDialogVisible,
		stylePosition: 'absolute',
	}

	return (
		<>
			<li className='row between-xs middle-xs'>
				<input
					placeholder='Add calendar name'
					onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyUp(e)}
					onChange={handleCalendarChange}
				/>
				<div style={{ position: 'relative' }}>
					<button
						className={`${newCalendar.color} rounded-color`}
						onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
							recordPos(e);
							setIsDialogVisible(visible => !visible);
						}}
					/>
					<Dialog ref={dialogRef} {...dialogOptionsProps} />
				</div>
			</li>
		</>
	)
}