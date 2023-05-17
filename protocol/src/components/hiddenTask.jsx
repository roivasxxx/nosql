import React, { useState } from "react";

export default function HiddenTask({ isHiddenText, children }) {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <div className="hidden-task">
      <p onClick={() => setIsHidden(!isHidden)}>{isHiddenText}</p>
      {isHidden ? <></> : children}
    </div>
  );
}
