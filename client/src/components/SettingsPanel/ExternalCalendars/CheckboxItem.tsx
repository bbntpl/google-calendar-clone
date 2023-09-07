import { HolidayItem } from './index.model';

interface CheckboxItem {
  holidayItem: HolidayItem
  handleCboxToggle: (regionName: string) => () => void
}

export default function CheckboxItem(props: CheckboxItem) {
  const { holidayItem, handleCboxToggle } = props;
  const { selected, name } = holidayItem;

  return <li className='row middle-xs start-xs checkbox-item'>
    <input
      type='checkbox'
      checked={selected}
      onChange={() => handleCboxToggle(name)}
    />
    <div>
      <p>{name}</p>
    </div>
  </li>
}