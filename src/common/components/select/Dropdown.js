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
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => (props.isOpen ? "#ff4b4b" : "#919191")};
  min-width: 100%;
  background-color: ${(props) => (props.isOpen ? "#fff" : "#F1F0F0")};
  color: ${(props) => (props.isOpen ? "#ff4b4b" : "#919191")};
`;

const DropDownHeaderItemIcon = styled.div``;
const DropDownHeaderItem = styled.p``;
const DropDownList = styled.ul`
  max-height: "200px";
  overflow-y: "auto";
  width: "150px";
  margin: 12px 0 0 0;
  /* border-top: 0; */
  border-width: ${(props) => (props.isOpen ? "1px" : "0")};
  border-style: solid;
  border-color: #e5e4e4;
  background-color: "#fff";
  list-style: none;
  position: absolute;
  width: 200px;
  border-radius: 8px;
  color: #ff4b4b;
`;
const DropDownListItem = styled.li`
  padding: 5px;
  background: ${(props) => (props.ishighlighted ? "#A0AEC0" : "")};
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
      <DropDownHeader {...getToggleButtonProps()} isOpen={isOpen}>
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
      <DropDownList {...getMenuProps()} isOpen={isOpen}>
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
