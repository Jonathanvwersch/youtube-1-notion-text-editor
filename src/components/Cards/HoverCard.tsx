import React, {
  ReactNode,
  SyntheticEvent,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import styled from "styled-components";

type HoverCardProps = {
  children?: ReactNode;
  width?: string;
  height?: string;
  className?: string;
  borderRadius?: string;
  backgroundColor?: string;
  handleClick?: (args?: any) => any;
  handleMouseDown?: (args?: any) => any;
  padding?: string;
  activeIndex?: number;
  index?: number;
  ariaLabel?: string;
  fakeFocus?: boolean;
  turnOffHover?: boolean;
  isDisabled?: boolean;
};

const HoverCard: React.FC<HoverCardProps> = ({ children, ...props }) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const shouldFocus =
    cardRef && !(props.index == null) && props.index === props.activeIndex;

  // Used to allow up and down movement using your arrows keys on hover cards, such as those found in a modal
  // To use, two variables are needed. Firstly, the index of the hover card (obtained from the array map prototype).
  // And secondly the active index of the arrow keys. See ScrollerModal to see implementation. Fakefocus prop triggers,
  // active state of block (so it looks like it is being hovered over) but it doesn't actually have focus. This is useful for the notetaking
  // block modal, as we want to maintain focus on your notes, but also have a 'fake focus' on the modal
  useEffect(() => {
    if (shouldFocus) {
      if (props.fakeFocus) {
        cardRef.current?.scrollIntoView();
      } else if (!props.fakeFocus) {
        cardRef.current?.focus();
      }
    }
  }, [shouldFocus, props.fakeFocus]);

  useLayoutEffect(() => {
    const handleFakeFocusClick = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        props.handleClick && props.handleClick();
        props.handleMouseDown && props.handleMouseDown();
      }
    };

    if (props.fakeFocus && shouldFocus) {
      document.addEventListener("keydown", handleFakeFocusClick);
    }
    return () => document.removeEventListener("keydown", handleFakeFocusClick);
  }, [props.index, props.activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledHoverCard
      ref={cardRef}
      disabled={props.isDisabled}
      aria-label={props.ariaLabel}
      tabIndex={0}
      contentEditable={false}
      onMouseDown={(e: SyntheticEvent) => {
        e.preventDefault();
        props.handleMouseDown && props.handleMouseDown();
      }}
      onClick={(e: SyntheticEvent) => {
        if (props.handleClick) {
          e.preventDefault();
          props.handleClick();
        }
      }}
      turnOffHover={false}
      {...props}
      active={
        props.fakeFocus &&
        props.index === props.activeIndex &&
        props.index != null
      }
      className={props.className}
    >
      {children}
    </StyledHoverCard>
  );
};

const StyledHoverCard = styled.button<HoverCardProps & { active?: boolean }>`
  width: ${({ width }) => (width ? width : "100%")};
  height: ${({ height }) => height && height};
  outline: none;
  border: none;
  padding: ${({ padding }) => padding};
  background-color: ${({ backgroundColor, theme }) =>
    backgroundColor ? backgroundColor : theme.colors.secondary};
  border-radius: ${({ borderRadius }) => borderRadius};
  user-select: none;
  &:focus-visible,
  &:hover {
    filter: ${({ theme, turnOffHover }) =>
      !turnOffHover && theme.colors.hover.filter};
  }
  &:active {
    background-color: ${({ turnOffHover }) => !turnOffHover && "transparent"};
  }
  &.active {
    filter: ${({ theme, turnOffHover }) =>
      !turnOffHover && theme.colors.hover.filter};
  }
  filter: ${({ theme, turnOffHover, active }) =>
    !turnOffHover && active && theme.colors.hover.filter};
  cursor: ${({ turnOffHover }) => (turnOffHover ? "default" : "pointer")};
`;

export default React.memo(HoverCard);
