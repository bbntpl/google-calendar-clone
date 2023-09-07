import { CheckboxItemProps } from './index.model';

export default function CheckboxItem(props: CheckboxItemProps) {
  const { holidayItem, handleCboxToggle } = props;
  const { selected, name } = holidayItem;

  return <li className='row middle-xs start-xs checkbox-item'>
    <input
      type='checkbox'
      checked={selected}
      onChange={() => handleCboxToggle()}
    />
    <div>
      <p>{name}</p>
    </div>
  </li>
}