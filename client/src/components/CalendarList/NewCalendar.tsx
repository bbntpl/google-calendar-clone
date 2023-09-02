import React, { useState } from 'react';

import {
	UserActionType,
	CalendarItem,
} from '../../context/global/index.model';
import useComponentVisible from '../../hooks/useComponentVisible';
import { uniqueID } from '../../util/reusable-funcs';

import { AddNewCalendarProps, InitCalendarLblProps } from './index.model';
import { DialogProps } from '../../lib/Dialog/index.model';
import Dialog from '../../lib/Dialog';

import './styles.scss';

import Options from './Options';
import { ColorOption, defaultColorOption } from '../../themes/data';

type NewCalendar = InitCalendarLblProps | CalendarItem;
const initCalendarLblProps: InitCalendarLblProps = {
	name: '',
	colorOption: defaultColorOption,
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

	const [newCalendar, setNewCalendar] = useState<NewCalendar>(initCalendarLblProps);
	const [
		dialogRef,
		isDialogVisible,
		setIsDialogVisible,
		dialogLinkRef,
	] = useComponentVisible();

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

	const handleColorChange = (colorOption: ColorOption) => {
		setNewCalendar({ ...newCalendar, colorOption });
	}

	// Props that'll be passed to the reusable dialog component
	const componentProps = {
		flags: { options: false, colors: true },
		calendarProps: newCalendar,
		globalContextProps: {
			calendarList,
			dispatchCalendarList,
		},
		eventHandlers: {
			setNewCalendar,
			handleColorChange,
		},
	}

	const dialogProps: DialogProps = {
		componentProps,
		Component: Options,
		isDialogVisible,
		positionOffset: { x: 20, y: 20 },
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
						ref={dialogLinkRef}
						className='rounded-color'
						style={{ backgroundColor: newCalendar.colorOption.value }}
						onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
							recordPos(e);
							setIsDialogVisible(visible => !visible);
						}}
					/>
					<Dialog ref={dialogRef} {...dialogProps} />
				</div>
			</li>
		</>
	)
}