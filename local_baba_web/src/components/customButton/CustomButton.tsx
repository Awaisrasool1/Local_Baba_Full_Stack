import React from "react";
import "./Button.css";

interface Props {
  title: string;
  onPress?: () => void;
}
function CustomButton(props: Props) {
  return (
    <button type="submit" className="btn w-100 login-btn">
      {props.title}
    </button>
  );
}

export default CustomButton;
