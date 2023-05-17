import React from "react";
import ListElem from "./listElem";

export default function ListWrapper({ dataArray }) {
  return (
    <div className="list-wrapper">
      {dataArray.map((element) => {
        return (
          <ListElem title={element.title} key={element.title}>
            {element.listElements.map((listElement) => {
              return (
                <div
                  className="list-elem"
                  key={element.title + listElement.listTitle}
                >
                  <p>{listElement.listTitle}</p>
                  <ul>
                    {listElement.listElements.map((liText) => {
                      return <li key={element.title + liText}>{liText}</li>;
                    })}
                  </ul>
                </div>
              );
            })}
          </ListElem>
        );
      })}
    </div>
  );
}
