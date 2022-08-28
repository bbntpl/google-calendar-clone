import Select, { GroupBase, Props } from 'react-select'
import { SelectOption } from '../../index.model';

export default function CustomSelect<
	IsMulti extends boolean = false,
	Group extends GroupBase<SelectOption> = GroupBase<SelectOption>
>(props: Props<SelectOption, IsMulti, Group>) {
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