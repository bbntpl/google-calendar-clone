import { useEffect, useState } from 'react';
import { Position } from '../contexts/index.model';
import { UseBoundariesProps } from './index.model';
import useBoundaries from './useBoundaries';

interface QuadrantConfirmation {
	left: boolean
	right: boolean
	bottom: boolean
	top: boolean
}

interface UseDialogAdjusterProps extends UseBoundariesProps {
	delta: Position
}

export default function useDialogAdjuster(props: UseDialogAdjusterProps) {
	const { dialogDim, initCursorPos, delta, viewportDim } = props;
	const { height, width } = dialogDim;
	const { width: viewportWidth, height: viewportHeight } = viewportDim;
	const {
		bounds,
		computeBounds,
		computeCenteredBounds,
	} = useBoundaries({ dialogDim, initCursorPos, viewportDim })

	const [adjustedDialogPos, setAdjustedDialogPos] = useState<Position>({
		x: initCursorPos.x + delta.x,
		y: initCursorPos.y + delta.y,
	});

	const [isPosAdjusted, setIsPosAdjusted] = useState(false);

	// Defines the quadrant site of the cursor position
	const positionedTo = ({ x, y }: Position) => ({
		left: x < innerWidth / 2,
		right: x >= innerWidth / 2,
		top: y < innerHeight / 2,
		bottom: y >= innerHeight / 2,
	});

	// Adjust the position of the dialog relative to 
	// which four quadrants it belongs to
	function adjustDialogPosition(positionedTo: QuadrantConfirmation) {
		const { left, right, top, bottom } = positionedTo;
		const { x, y } = adjustedDialogPos;
		if (!x && !y) return;

		// The gap between edge of the screen and 
		// boundary of the viewport dimension;
		const safeGap = 10;
		const newX = initCursorPos.x - width;
		const newY = initCursorPos.y - height;

		if (left && bottom) {
			setAdjustedDialogPos({
				x: ((viewportWidth - initCursorPos.x) - width) < 0
					? newX < 0
						? safeGap
						: newX
					: initCursorPos.x,
				y: newY < 0 ? safeGap : newY,
			});
		} else if (right && top) {
			setAdjustedDialogPos(prevDialogPos => ({
				...prevDialogPos,
				x: (viewportWidth - initCursorPos.x) < 0
					? viewportWidth - safeGap - width
					: newX,
			}));
		} else if (right && bottom) {
			setAdjustedDialogPos({
				x: (viewportWidth - initCursorPos.x) < 0
					? viewportWidth - safeGap - width
					: newX,
				y: newY < 0 ? safeGap : newY,
			});
		} else {
			setAdjustedDialogPos(prevDialogPos => ({
				...prevDialogPos,
				x: ((viewportWidth - initCursorPos.x) - width) < 0
					? newX < 0
						? safeGap
						: newX
					: initCursorPos.x,
			}));
		}
	}

	function adjustDialogInTheCenter() {
		const centerX = viewportWidth / 2;
		const centerY = viewportHeight / 2;

		setAdjustedDialogPos({
			x: centerX - (dialogDim.width / 2),
			y: centerY - (dialogDim.height / 2),
		});
	}

	useEffect(() => {
		if (!dialogDim.width && !dialogDim.height) {
			setIsPosAdjusted(true);
		}
	}, [adjustedDialogPos]);

	useEffect(() => {
		const maxMobileDeviceWidlth = 768;
		const bufferZone = viewportWidth * 0.10;
		const halfScreenWidth = viewportWidth / 2;
		const quadrantConfirmations = positionedTo(initCursorPos);

		// The buffer zone refers to the central area of the app where
		// the dialog might overlap if dialog width exceeds half the viewport width.
		// This determines if the user's click is within this buffer zone.
		const isBufferZoneClicked = dialogDim.width > halfScreenWidth
			&& (initCursorPos.x > halfScreenWidth - bufferZone
				&& initCursorPos.x < halfScreenWidth + bufferZone);

		// For mobile devices, the dialog must always be centered
		if (viewportWidth <= maxMobileDeviceWidlth) {
			adjustDialogInTheCenter();
			computeCenteredBounds();
		} else if (isBufferZoneClicked) {
			adjustDialogInTheCenter();
			computeCenteredBounds();
		} else {
			adjustDialogPosition(quadrantConfirmations);
			computeBounds(quadrantConfirmations);
		}
	}, [viewportDim, initCursorPos, isPosAdjusted]);

	return { adjustedDialogPos, bounds, isPosAdjusted };
}