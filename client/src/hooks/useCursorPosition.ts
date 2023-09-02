import { useState } from 'react';

// A custom hook that records the mouse position on click
export default function useCursorPosition(initPos = { x: 0, y: 0 }) {
	const [position, setPosition] = useState(initPos);
	const recordPos = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		setPosition({
			x: e.clientX,
			y: e.clientY,
		})
	};
	return { position, recordPos };
}