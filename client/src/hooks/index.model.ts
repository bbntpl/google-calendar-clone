import { Position } from '../contexts/index.model';
export interface QuadrantConfirmation {
	left: boolean
	right: boolean
	bottom: boolean
	top: boolean
}

export interface UseBoundariesProps {
	dialogDim: Dimension
	initCursorPos: Position
	viewportDim: Dimension
}

export interface Dimension {
	width: number
	height: number
}