import { useState, useEffect, useRef } from 'react';

// a custom hook that controls the visibility of a component using
// the written events
export default function useComponentVisible(initialIsVisible: boolean) {
	const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
	const linkRef = useRef<HTMLButtonElement | null>(null);
	const componentRef = useRef<HTMLDivElement | null>(null);

	const handleHideDropdown = (e: KeyboardEvent) => {
		if (e.key !== 'Escape') return;
		setIsComponentVisible(false);
	};
	type TargetElements = HTMLDivElement | HTMLElement | HTMLButtonElement | null;
	const handleCurrentTarget = (
		ref: React.MutableRefObject<TargetElements>,
		{ target }: MouseEvent,
	) => {
		if (ref.current != null) {
			return (!ref.current.contains(target as Node))
		}
	}
	const handleClickOutside = (event: MouseEvent) => {
		if (
			componentRef.current &&
			handleCurrentTarget(componentRef, event) &&
			handleCurrentTarget(linkRef, event)) {
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

	return [
		componentRef,
		isComponentVisible,
		setIsComponentVisible,
		linkRef,
	] as const;
}