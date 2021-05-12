/** @jsxImportSource @emotion/react */
import { useSelect, UseSelectProps } from "downshift";
import tw, { styled } from "twin.macro";

type OptionType = {
  value?: string,
};

interface IDropdownProps {
  items: UseSelectProps<OptionType[]>;
  onChange: (selectedItem: string) => void;
}

const DropDownContainer = styled.div`
  width: 200px;
`;
const DropDownHeader = styled.button`
  padding: 10px;
  display: flex;
  border-radius: 6px;
  border: 1px solid grey;
`;
const DropDownHeaderItemIcon = styled.div``;
const DropDownHeaderItem = styled.p``;
const DropDownList = styled.ul`
  max-height: "200px";
  overflow-y: "auto";
  width: "150px";
  margin: 0;
  border-top: 0;
  background: "white";
  list-style: none;
`;
const DropDownListItem = styled.li`
  padding: 5px;
  background: ${(props) => (props.ishighlighted ? "#A0AEC0" : "")};
  border-radius: 8px;
`;

const DropDown = ({ items }) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items });

  return (
    <DropDownContainer>
      <DropDownHeader {...getToggleButtonProps()}>
        {(selectedItem && selectedItem.label) || "---"}
      </DropDownHeader>
      <DropDownList {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownListItem
              ishighlighted={highlightedIndex === index}
              key={`${item.id}${index}`}
              {...getItemProps({ item, index })}
            >
              {item.label}
            </DropDownListItem>
          ))}
      </DropDownList>
      <div tabIndex="0" />
    </DropDownContainer>
  );
};
export default DropDown;
