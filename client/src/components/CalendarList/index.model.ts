import { Dispatch, SetStateAction } from 'react';

import { DialogViewState } from '../../lib/Dialog/index.model';
import { Calendar, CalendarListActions } from '../../contexts/StoreContext/types/calendar';
import { ColorOption } from '../../util/color-options';

interface CalendarListSetStateAction {
	calendars: Array<Calendar> | [];
	dispatchCalendars: Dispatch<CalendarListActions>;
}

export interface CalendarItemsProps extends CalendarListSetStateAction {
	recordPosition: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export interface AddNewCalendarProps {
	dispatchCalendars: Dispatch<CalendarListActions>;
	recordPosition: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	setShowAddLblBtn: Dispatch<SetStateAction<boolean>>;
}

export type InitCalendarItemProps = Omit<Calendar, 'id'>;
export type LblColorChange = (colorOption: ColorOption) => void;

export interface EventHandlers {
	setNewCalendar?: Dispatch<SetStateAction<InitCalendarItemProps>>;
	handleColorChange?: LblColorChange;
}

export interface LabelProps {
	calendarProps: Calendar;
	globalContextProps: CalendarListSetStateAction;
}

export interface WrappedComponentProps extends
	LabelProps, DialogViewState {
	eventHandlers?: EventHandlers;
	flags: Record<string, boolean>;
}