// Dependencies
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useClickAway, useWindowSize } from "react-use";
import { Portal } from "react-portal";

// Styled Components
import { Layout, ViewPort, Dropdown, Icon, Container } from "./styles";

// Types
import { IconButtonProps } from "./types";

const IconButton = ({
  icon,
  disabled = false,
  size = "medium",
  variant = "primary",
  onClick = null,
  dropDownOptions = {
    width: "auto",
    componentOverflowRef: null,
    alignment: "left",
  },
  renderDropDown = null,
}: IconButtonProps) => {
  // Ref
  const layoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Hooks
  const { width } = useWindowSize();
  const [isActiveDropdown, setDropdownActive] = useState(false);

  /**
   * @function handleClickButton:
   * @description Function in charge of indicating the logic when pressing the button.
   */
  const handleClickButton = useCallback(() => {
    setDropdownActive((current) => !current);
  }, []);

  useClickAway(layoutRef, (event: Event) => {
    if (event && event.target && dropdownRef) {
      const container = dropdownRef.current as unknown as HTMLElement;

      if (container && !container.contains(event.target as Node) && isActiveDropdown) {
        handleClickButton();
      }
    }
  });

  useEffect(() => {
    if (layoutRef && layoutRef.current) {
      if (isActiveDropdown) {
        const { offsetTop, clientHeight, offsetLeft, clientWidth } = layoutRef.current;

        if (dropdownRef && dropdownRef.current) {
          const container = dropdownRef.current as HTMLElement;

          const { alignment, componentOverflowRef } = dropDownOptions;
          container.style.top = `${offsetTop + clientHeight}px`;

          const scrollLeft = componentOverflowRef ? componentOverflowRef.current.scrollLeft : 0;

          if (alignment === "right") {
            container.style.left = `${
              offsetLeft - (container.clientWidth - clientWidth) - scrollLeft
            }px`;
          } else {
            container.style.left = `${offsetLeft - scrollLeft}px`;
          }
          container.style.opacity = "1";
        }
      } else {
        if (dropdownRef && dropdownRef.current) {
          setDropdownActive(true);
        }
      }
    }
  }, [width, isActiveDropdown, dropDownOptions.componentOverflowRef]);

  useEffect(() => {
    if (isActiveDropdown) {
      setDropdownActive(false);
    }
  }, [width]);

  return (
    <Layout ref={layoutRef}>
      <ViewPort
        size={size}
        variant={variant}
        disabled={disabled}
        isActiveDropdown={isActiveDropdown}
      >
        <Container onClick={disabled ? null : renderDropDown ? handleClickButton : onClick}>
          <Icon src={icon} />
        </Container>
      </ViewPort>
      {isActiveDropdown && (
        <Portal>
          <Dropdown
            ref={dropdownRef}
            width={dropDownOptions.width}
            alignment={dropDownOptions.alignment}
          >
            {renderDropDown}
          </Dropdown>
        </Portal>
      )}
    </Layout>
  );
};

export default IconButton;
