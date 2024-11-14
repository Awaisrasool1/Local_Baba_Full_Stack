import React from "react";
import "./Button.css";

interface Props {
  title: string;
  bgStyle?:any
  onPress?: () => void;
}
function CustomButton(props: Props) {
  return (
    <button type="submit" style={props.bgStyle}  className="btn w-100 login-btn" onClick={props.onPress}>
      {props.title}
    </button>
  );
}

export default CustomButton;
