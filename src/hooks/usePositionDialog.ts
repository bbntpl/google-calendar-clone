import { useEffect, useState, useMemo } from 'react';
import { Position } from '../context/global/index.model';

interface Dimension {
	width: number,
	height: number,
}

export default function usePositionDialog(
	dialogDim: Dimension,
	initCursorPos: Position,
	delta: Position,
) {
	const [dialogPos, setDialogPos] = useState({
		x: initCursorPos.x + delta.x,
		y: initCursorPos.y + delta.y,
	});

	const browserDim = useMemo(() => ({
		innerWidth: window.innerWidth, 
		innerHeight: window.innerHeight,
	}), [window.innerWidth, window.innerHeight]);

	const { height, width } = dialogDim;
	const { innerHeight, innerWidth } = browserDim;

	const isCursorPositioned = ({ x, y }: Position) => ({
		left: Math.round(x / innerWidth) * 100 < Math.round(innerWidth / 2) / 100,
		right: Math.round(x / innerWidth) * 100 > Math.round(innerWidth / 2) / 100,
		top: Math.round(y / innerHeight) * 100 < Math.round(innerHeight / 2) / 100,
		bottom: Math.round(y / innerHeight) * 100 > Math.round(innerHeight / 2) / 100,
	})
	
	// position the dialog
	useEffect(() => {
		const { left, right, top, bottom } = isCursorPositioned(initCursorPos);
		if (left && bottom) {
			setDialogPos({
				...dialogPos,
				x: dialogPos.x,
				y: innerHeight - height,
			});
		} else if (right && top) {
			setDialogPos({ ...dialogPos, x: innerWidth + width });
		} else if (right && bottom) {
			setDialogPos({
				...dialogPos,
				x: innerWidth + width,
				y: innerHeight - height,
			});
		}
	}, [browserDim, initCursorPos]);

	console.log(browserDim, dialogDim, dialogPos);
	return dialogPos;
}