import { useEffect, useState } from 'react';
import { Position } from '../context/global/index.model';

interface Dimension {
	width: number,
	height: number,
}
interface PositionOffset {
	x: number | string,
	y: number | string
}

interface QuadrantConfirmation {
	left: boolean,
	right: boolean,
	bottom: boolean,
	top: boolean,
}

export default function useDialogAdjuster(
	dialogDim: Dimension,
	initCursorPos: Position,
	delta: Position,
	windowDim: Dimension,
) {
	const { height, width } = dialogDim;
	const { width: innerWidth, height: innerHeight } = windowDim;

	const [adjustedDialogPos, setAdjustedDialogPos] = useState<PositionOffset>({
		x: initCursorPos.x + delta.x,
		y: initCursorPos.y + delta.y,
	});
	const [isPosAdjusted, setIsPosAdjusted] = useState(false);
	
	//specifies movement boundaries
	const [bounds, setBounds] = useState({
		// these properties are default left-top cursor position except
		// for right/bottom as the dialog dim obj won't be update 'til later
		left: initCursorPos.x * -1,
		top: initCursorPos.y * -1,
		right: windowDim.width - initCursorPos.x - dialogDim.width,
		bottom: windowDim.height - initCursorPos.y - dialogDim.height,
	})

	// specifies the quadrant site of the cursor position
	const positionedTo = ({ x, y }: Position) => ({
		left: Math.round(x / innerWidth) * 100 < Math.round(innerWidth / 2) / 100,
		right: Math.round(x / innerWidth) * 100 > Math.round(innerWidth / 2) / 100,
		top: Math.round(y / innerHeight) * 100 < Math.round(innerHeight / 2) / 100,
		bottom: Math.round(y / innerHeight) * 100 > Math.round(innerHeight / 2) / 100,
	})

	// adjust the position of the dialog relative to 
	// which four quadrants it belongs to
	function adjustDialogPosition(positionedTo: QuadrantConfirmation) {
		const { left, right, top, bottom } = positionedTo;
		const { x, y } = adjustedDialogPos;
		if (!x && !y) return;

		// the gap between edge of the screen and 
		// boundary of the viewport dimension;
		const safeGap = 20;
		const newX = initCursorPos.x - width
		const newY = initCursorPos.y - height;

		if (left && bottom) {
			setAdjustedDialogPos(adjustedDialogPos => ({
				...adjustedDialogPos,
				y: newY < 0 ? safeGap : newY,
			}));
		} else if (right && top) {
			setAdjustedDialogPos(adjustedDialogPos => ({
				...adjustedDialogPos,
				x: newX < 0 ? safeGap : newX,
			}));
		} else if (right && bottom) {
			setAdjustedDialogPos({
				x: newX < 0 ? safeGap : newX,
				y: newY < 0 ? safeGap : newY,
			});
		}
	}

	function adjustBounds(positionedTo: QuadrantConfirmation) {
		const { left, right, top, bottom } = positionedTo;

		// adjust the position of the dialog depending
		// on the location of the cursor positions
		if(left && top) {
			setBounds(bounds => ({
				...bounds,
				right: windowDim.width - initCursorPos.x - dialogDim.width,
				bottom: windowDim.height - initCursorPos.y - dialogDim.height,
			}));
		} else if (left && bottom) {
			setBounds(bounds => ({
				...bounds,
				top: initCursorPos.y * -1 + dialogDim.height,
				bottom: windowDim.height - initCursorPos.y,
				right: windowDim.width - initCursorPos.x - dialogDim.width,
			}));
		} else if (right && top) {
			setBounds(bounds => ({
				...bounds,
				left: dialogDim.width - initCursorPos.x,
				right: windowDim.width - initCursorPos.x,
				bottom: windowDim.height - initCursorPos.y - dialogDim.height,
			}));
		} else if (right && bottom) {
			setBounds({
				right: windowDim.width - initCursorPos.x,
				left: dialogDim.width - initCursorPos.x,
				top: initCursorPos.y * -1 + dialogDim.height,
				bottom: windowDim.height - initCursorPos.y,
			});
		}
	}

	useEffect(() => {
		if (!dialogDim.width && !dialogDim.height) {
				setIsPosAdjusted(true);
		}
	}, [adjustedDialogPos]);

	useEffect(() => {
		const quadrantConfirmations = positionedTo(initCursorPos);
		adjustDialogPosition(quadrantConfirmations);
		adjustBounds(quadrantConfirmations);
	}, [windowDim, initCursorPos, isPosAdjusted]);

	return { adjustedDialogPos, bounds, isPosAdjusted };
}