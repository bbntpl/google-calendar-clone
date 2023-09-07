import { ReactElement } from 'react'

export interface HolidayItem {
	name: string
	region: string
	selected: boolean
}

export interface CheckboxItemProps {
	holidayItem: HolidayItem
	handleCboxToggle: () => void
}

export interface RenderCboxItemsProps {
	filterBySelected?: boolean;
	displayAll?: boolean
}

export interface RenderCboxListProps extends RenderCboxItemsProps {
	listDesc: ReactElement;
}