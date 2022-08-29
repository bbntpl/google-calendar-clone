import Select, {
	GroupBase,
	Props,
} from 'react-select';

import { Option } from '../../index.model';

export default function CustomSelect<
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
	const {
		isClearable = false,
		components = {
			IndicatorSeparator: () => null,
		},
	} = props;
	return (
		<Select
			{...props}
			theme={(theme) => ({ ...theme, borderRadius: 0 })}
			isClearable={isClearable}
			components={components}
		/>
	);
}