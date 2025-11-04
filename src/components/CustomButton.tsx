import React from "react";
import { Button, ButtonProps } from "@mui/material";

interface CustomButtonProps {
  label: string;
  variant?: "text" | "outlined" | "contained";
  onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  variant = "contained",
  onClick,
}) => {
  const buttonProps: ButtonProps = {
    variant,
    onClick,
  };

  return <Button {...buttonProps}>{label}</Button>;
};

export default CustomButton;
