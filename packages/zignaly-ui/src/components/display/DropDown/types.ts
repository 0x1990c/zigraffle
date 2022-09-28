import { PopoverOrigin, PopoverPosition } from "@mui/material/Popover/Popover";

type Option = {
  label?: string | JSX.Element;
  onClick?: () => void;
  href?: string;
  active?: boolean;
};

export type DropDownOption = Option & {
  children?: Option[];
  element?: JSX.Element;
  separator?: boolean;
};

export type DropDownProps = {
  options: DropDownOption[];
  component: ({ open }: { open: boolean }) => JSX.Element;
  anchorOrigin?: PopoverOrigin;
  anchorPosition?: PopoverPosition;
  transformOrigin?: PopoverOrigin;
};

export type DropDownHandle = {
  closeDropDown?: () => void;
};