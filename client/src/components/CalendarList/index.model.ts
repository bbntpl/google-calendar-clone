import { Dispatch, SetStateAction } from 'react';
import {
	CalendarItem,
	CalendarListActions,
} from '../../context/global/index.model';
import { ColorOption } from '../../themes/data';
import { DialogViewState } from '../../lib/Dialog/index.model';

interface CalendarListSetStateAction {
	calendarList: Array<CalendarItem> | [];
	dispatchCalendarList: Dispatch<CalendarListActions>;
}

export interface LabelListProps extends CalendarListSetStateAction {
	recordPos: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export interface AddNewCalendarProps extends LabelListProps {
	setShowAddLblBtn: Dispatch<SetStateAction<boolean>>;
}

export type InitCalendarLblProps = Omit<CalendarItem, 'id'>;
export type LblColorChange = (colorOption: ColorOption) => void;

export interface EventHandlers {
	setNewCalendar?: Dispatch<SetStateAction<InitCalendarLblProps>>;
	handleColorChange?: LblColorChange;
}

export interface LabelProps {
	calendarProps: CalendarItem;
	globalContextProps: CalendarListSetStateAction;
}

export interface WrappedComponentProps extends
	LabelProps, DialogViewState {
	eventHandlers?: EventHandlers;
	flags: Record<string, boolean>;
}