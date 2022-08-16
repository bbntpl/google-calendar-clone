import { useState, useEffect, useRef } from 'react';

// a custom hook that controls the visibility of a component using
// the written events
export default function useComponentVisible(initialIsVisible: boolean) {
	const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
	const componentRef = useRef<HTMLDivElement>(null);

	const handleHideDropdown = (e: KeyboardEvent) => {
		if (e.key !== 'Escape') return;
		setIsComponentVisible(false);
	};

	const handleCurrentTarget = (
		ref: React.MutableRefObject<HTMLElement | null>,
		{ target }: MouseEvent,
	) => {
		if (ref.current != null) {
			return (!ref.current.contains(target as Node))
		}
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (componentRef.current && handleCurrentTarget(componentRef, event)) {
			setIsComponentVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', handleHideDropdown, true);
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('keydown', handleHideDropdown, true);
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	return [componentRef, isComponentVisible, setIsComponentVisible] as const;
}