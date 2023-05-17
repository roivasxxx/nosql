import React from "react";

export default function Task({ taskTitle, taskNum, children, href }) {
  return (
    <div className="task" id={href}>
      <h3>{taskNum + ") " + taskTitle || ""}</h3>
      <span />
      <div className="content">{children}</div>
    </div>
  );
}
