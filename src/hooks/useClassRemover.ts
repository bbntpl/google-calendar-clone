
export default function useClassRemover(element: HTMLElement, className: string) {
	const classRemover = (event) => {
		element.classList.remove(className);
	};

	const component = document.querySelector(`.${className}`);
	component?.addEventListener('transition', (e) => classRemover(e));

	return () => {
		component?.removeEventListener('animationend', classRemover);
	};
}