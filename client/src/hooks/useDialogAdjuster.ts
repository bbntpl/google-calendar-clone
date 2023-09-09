import { useEffect, useState } from 'react';
import { Position } from '../contexts/index.model';

interface Dimension {
	width: number
	height: number
}

interface QuadrantConfirmation {
	left: boolean
	right: boolean
	bottom: boolean
	top: boolean
}

interface UseDialogAdjusterProps {
	dialogDim: Dimension
	initCursorPos: Position
	delta: Position
	windowDim: Dimension
}

export default function useDialogAdjuster({
	dialogDim,
	initCursorPos,
	delta,
	windowDim,
}: UseDialogAdjusterProps) {
	const { height, width } = dialogDim;
	const { width: innerWidth, height: innerHeight } = windowDim;

	const [adjustedDialogPos, setAdjustedDialogPos] = useState<Position>({
		x: initCursorPos.x + delta.x,
		y: initCursorPos.y + delta.y,
	});

	const [isPosAdjusted, setIsPosAdjusted] = useState(false);

	// The movement boundaries of the dialog element
	const [bounds, setBounds] = useState({
		// These properties are default left-top cursor position except
		// for right/bottom as the dialog dim obj won't be update 'til later
		left: initCursorPos.x * -1,
		top: initCursorPos.y * -1,
		right: windowDim.width - initCursorPos.x - dialogDim.width,
		bottom: windowDim.height - initCursorPos.y - dialogDim.height,
	})

	// defines the quadrant site of the cursor position
	const positionedTo = ({ x, y }: Position) => ({
		left: Math.round(x / innerWidth) * 100 < Math.round(innerWidth / 2) / 100,
		right: Math.round(x / innerWidth) * 100 > Math.round(innerWidth / 2) / 100,
		top: Math.round(y / innerHeight) * 100 < Math.round(innerHeight / 2) / 100,
		bottom: Math.round(y / innerHeight) * 100 > Math.round(innerHeight / 2) / 100,
	});

	// Adjust the position of the dialog relative to 
	// which four quadrants it belongs to
	function adjustDialogPosition(positionedTo: QuadrantConfirmation) {
		const { left, right, top, bottom } = positionedTo;
		const { x, y } = adjustedDialogPos;
		if (!x && !y) return;

		// The gap between edge of the screen and 
		// boundary of the viewport dimension;
		const safeGap = 20;
		const newX = initCursorPos.x - width
		const newY = initCursorPos.y - height;
		if (left && bottom) {
			setAdjustedDialogPos({
				x: ((windowDim.width - initCursorPos.x) - width) < 0 ? newX < 0 ? safeGap : newX : initCursorPos.x,
				y: newY < 0 ? safeGap : newY,
			});
		} else if (right && top) {
			setAdjustedDialogPos(adjustedDialogPos => ({
				...adjustedDialogPos,
				x: (windowDim.width - initCursorPos.x) < 0 ? windowDim.width - safeGap - width : newX,
			}));
		} else if (right && bottom) {
			setAdjustedDialogPos({
				x: (windowDim.width - initCursorPos.x) < 0 ? windowDim.width - safeGap - width : newX,
				y: newY < 0 ? safeGap : newY,
			});
		} else {
			setAdjustedDialogPos(adjustedDialogPos => ({
				...adjustedDialogPos,
				x: ((windowDim.width - initCursorPos.x) - width) < 0 ? newX < 0 ? safeGap : newX : initCursorPos.x,
			}));
		}
	}

	function adjustBounds(positionedTo: QuadrantConfirmation) {
		const { left, right, top, bottom } = positionedTo;

		// Adjust the position of the dialog relative
		// to the location of the cursor positions
		if (left && top) {
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