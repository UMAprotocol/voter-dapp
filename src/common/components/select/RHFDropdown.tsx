import { ForwardRefRenderFunction, forwardRef } from "react";
import { useController, Control } from "react-hook-form";
import { useSelect } from "downshift";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownContainer,
  DropdownHeader,
  DropdownList,
  DropdownListItem,
  UpArrow,
  DownArrow,
} from "./Dropdown.styled";

interface OptionType {
  value: string;
  label: string;
}

interface Props {
  name: string;
  items: OptionType[];
  control: Control;
}

// Integration of Dropdown component with React Hook Form.

const _RHFDropdown: ForwardRefRenderFunction<HTMLDivElement, Props> = (
  props,
  externalRef
) => {
  const handleSelectChange = ({ selectedItem }: any) => {
    field.onChange(selectedItem.value);
  };

  const { items } = props;
  const { field } = useController(props);
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items, onSelectedItemChange: handleSelectChange });

  return (
    <DropdownContainer>
      <input {...field} ref={field.ref} value={field.value} type="hidden" />
      <DropdownHeader {...getToggleButtonProps()} isOpen={isOpen}>
        {(selectedItem && selectedItem.label) || "---"}
        {isOpen ? (
          <UpArrow>
            <FontAwesomeIcon icon={faAngleUp} />
          </UpArrow>
        ) : (
          <DownArrow>
            <FontAwesomeIcon icon={faAngleDown} />
          </DownArrow>
        )}
      </DropdownHeader>
      <DropdownList {...getMenuProps()} isOpen={isOpen} isRHF>
        {isOpen &&
          items.map((item, index) => (
            <DropdownListItem
              isHighlighted={highlightedIndex === index}
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
            >
              {item.label}
            </DropdownListItem>
          ))}
      </DropdownList>
      <div tabIndex={0} />
    </DropdownContainer>
  );
};

const RHFDropdown = forwardRef(_RHFDropdown);
RHFDropdown.displayName = "RHFDropdown";

export default RHFDropdown;
