import ChevronLeft from '../../assets/icons/chevron-left.png';
import ChevronRight from '../../assets/icons/chevron-right.png';
import '../../styles/main.scss';

interface SwitcherProps {
	goPrev: () => void,
	goNext: () => void,
}

const containerStyles = {
	div: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '.8rem',
	width: '70px',
}

export default function Switcher(props: SwitcherProps): JSX.Element {
	const { goPrev, goNext } = props;
	return (
		<div style={containerStyles as React.CSSProperties}>
			<button className='clear-btn' onClick={goPrev}>
				<img src={ChevronLeft} />
			</button>
			<button className='clear-btn' onClick={goNext}>
				<img src={ChevronRight} />
			</button>
		</div>
	)
}