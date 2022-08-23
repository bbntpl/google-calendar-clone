import { DialogProps } from '../../../lib/Dialog/index.model';

interface HOCMethods {
	toggleVisibility: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
}

export interface ScheduleButtonProps {
	dialogProps: DialogProps,
	hocMethods: HOCMethods
}
