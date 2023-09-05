import { useState } from 'react';

export default function useCursorPosition(initPos = { x: 0, y: 0 }) {
	const [position, setPosition] = useState(initPos);

	const recordPosition = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		setPosition({
			x: e.clientX,
			y: e.clientY,
		})
	};

	return { position, recordPosition };
}