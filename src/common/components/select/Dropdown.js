/** @jsxImportSource @emotion/react */
import { useSelect, UseSelectProps } from "downshift";
import tw, { styled } from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";

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
  /* border-radius: 6px; */
  border: 1px solid grey;
  min-width: 100%;
  background-color: #f1f0f0;
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
  position: absolute;
  width: 200px;
`;
const DropDownListItem = styled.li`
  padding: 5px;
  background: ${(props) => (props.ishighlighted ? "#A0AEC0" : "")};
  border-radius: 8px;
`;

const Arrow = styled.span`
  position: absolute;
  margin-left: 160px;
`;

const UpArrow = styled(Arrow)`
  opacity: 0.8;
  color: #ff4b4b;
`;

const DownArrow = styled(Arrow)`
  color: #919191;
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
        {isOpen ? (
          <UpArrow>
            <FontAwesomeIcon icon={faAngleUp} />
          </UpArrow>
        ) : (
          <DownArrow>
            <FontAwesomeIcon icon={faAngleDown} />
          </DownArrow>
        )}
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
