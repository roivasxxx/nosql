import React from "react";

export default function ListElem({ title, children }) {
  return (
    <div>
      <h4>{title}</h4>
      {children}
    </div>
  );
}
