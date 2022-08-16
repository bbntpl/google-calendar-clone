import { useEffect, useState, useCallback } from 'react';
import { Position } from '../context/global/index.model';

interface ModalDimension {
	width: number,
	height: number,
}

export default function usePositionModal(
	initCursorPos: Position,
	delta: Position,
	modalDim: ModalDimension,
	) {
	const [modalPos, setModalPos] = useState({
		x: initCursorPos.x + delta.x,
		y: initCursorPos.y + delta.y,
	});

	const browserDim = useCallback(() => ({
		innerWidth: window.innerWidth, innerHeight: window.innerHeight,
	}), [window.innerWidth, window.innerHeight]);
	const { height, width } = modalDim;
	const { innerHeight, innerWidth } = browserDim();

	const isCursorPositioned = ({ x, y }: Position) => ({
		left: Math.round(x / innerWidth) * 100 < Math.round(innerWidth / 2) / 100,
		right: Math.round(x / innerWidth) * 100 > Math.round(innerWidth / 2) / 100,
		top: Math.round(y / innerHeight) * 100 < Math.round(innerHeight / 2) / 100,
		bottom: Math.round(y / innerHeight) * 100 > Math.round(innerHeight / 2) / 100,
	})

	// position the modal
	useEffect(() => {
		const { left, right, top, bottom } = isCursorPositioned(initCursorPos);
		if (left && bottom) {
			setModalPos({ ...modalPos, 
				x: modalPos.x, 
				y: innerHeight - height,
			});
		} else if (right && top) {
			setModalPos({ ...modalPos, x: innerWidth + width });
		} else if (right && bottom) {
			setModalPos({
				x: innerWidth + width,
				y: innerHeight - height,
			});
		}
	}, [])

	return modalPos;
}