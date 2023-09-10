import { useState } from 'react';
import {
	QuadrantConfirmation,
	UseBoundariesProps,
} from './index.model';

export default function useBoundaries(props: UseBoundariesProps) {
	const { dialogDim, viewportDim, initCursorPos } = props;
	const { width: viewportWidth, height: viewportHeight } = viewportDim;

	console.log('useDialogAdjuster')
	// The movement boundaries of the dialog element
	const [bounds, setBounds] = useState({
		// These properties are default left-top cursor position except
		// for right/bottom as the dialog dim obj won't be update 'til later
		left: initCursorPos.x * -1,
		top: initCursorPos.y * -1,
		right: viewportWidth - initCursorPos.x - dialogDim.width,
		bottom: viewportHeight - initCursorPos.y - dialogDim.height,
	})

	// Compute the movement boundaries of the dialog based on the
	// window dimension, cursor position and dialog dimension
	function computeBounds(positionedTo: QuadrantConfirmation) {
		const { left, right, top, bottom } = positionedTo;
		if (left && top) {
			setBounds(bounds => ({
				...bounds,
				right: viewportWidth - initCursorPos.x - dialogDim.width,
				bottom: viewportHeight - initCursorPos.y - dialogDim.height,
			}));
		} else if (left && bottom) {
			setBounds(bounds => ({
				...bounds,
				top: initCursorPos.y * -1 + dialogDim.height,
				bottom: viewportHeight - initCursorPos.y,
				right: viewportWidth - initCursorPos.x - dialogDim.width,
			}));
		} else if (right && top) {
			setBounds(bounds => ({
				...bounds,
				left: dialogDim.width - initCursorPos.x,
				right: viewportWidth - initCursorPos.x,
				bottom: viewportHeight - initCursorPos.y - dialogDim.height,
			}));
		} else if (right && bottom) {
			setBounds({
				right: viewportWidth - initCursorPos.x,
				left: dialogDim.width - initCursorPos.x,
				top: initCursorPos.y * -1 + dialogDim.height,
				bottom: viewportHeight - initCursorPos.y,
			});
		}
	}

	function computeCenteredBounds() {
		const centerX = viewportWidth / 2;
		const centerY = viewportHeight / 2;

		const centeredDialogPosX = centerX - (dialogDim.width / 2);
		const centeredDialogPosY = centerY - (dialogDim.height / 2);

		const leftBound = centeredDialogPosX;
		const rightBound = viewportWidth - (centeredDialogPosX + dialogDim.width);
		const topBound = centeredDialogPosY;
		const bottomBound = viewportHeight - (centeredDialogPosY + dialogDim.height);

		setBounds({
			left: -leftBound,
			right: rightBound,
			top: -topBound,
			bottom: bottomBound,
		});
	}

	return {
		bounds,
		computeBounds,
		computeCenteredBounds,
	}
}