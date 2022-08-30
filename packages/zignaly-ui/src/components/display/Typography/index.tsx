// Dependencies
import React from "react";

// Styles
import * as styled from "./styles";
import { componentByVariants, TypographyProps } from "./types";

const Typography = ({
  children,
  variant = "body1",
  weight,
  color,
  underline,
  component,
  className,
  style = {},
}: TypographyProps) => {
  return (
    <styled.Layout
      style={style}
      color={color}
      underline={underline}
      weight={weight}
      className={[variant, className]}
      as={component ?? componentByVariants[variant]}
    >
      {children}
    </styled.Layout>
  );
};

export default Typography;
