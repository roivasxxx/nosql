import React from "react";

export default function TextArea({ text }) {
  return <pre className="code-textarea">{text}</pre>;
  // return <textarea className="code-textarea" value={text} readOnly />;
}
