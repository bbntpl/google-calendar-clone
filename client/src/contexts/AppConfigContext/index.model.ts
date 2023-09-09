import { Dispatch, SetStateAction } from 'react';
import { Position } from '../index.model';

export interface BooleansOnlyObj {
	[key: string]: boolean
}

export interface ContextState {
	position: Position
	visibilities: BooleansOnlyObj
}

export interface DispatchContextState {
	recordPosition: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
	setVisibilities: Dispatch<SetStateAction<BooleansOnlyObj>>
}