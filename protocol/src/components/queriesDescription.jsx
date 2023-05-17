import React from "react";
import ListWrapper from "./listWrapper";

export default function QueriesDescription() {
  const dataArray = [
    {
      title: "",
      listElements: [
        {
          listTitle: "Dotaz 1",
          listElements: ["Seznam fakult a jejich přidružených kurzů"]
        },
        {
          listTitle: "Dotaz 2",
          listElements: [
            "Seznam uživatelů s vlákny, u kterých mají zapnuté notifikace"
          ]
        },
        {
          listTitle: "Dotaz 3",
          listElements: ["Seznam konverzací uživatelů"]
        },
        {
          listTitle: "Dotaz 4",
          listElements: ["Seznam zpráv pro konverzace"]
        },
        {
          listTitle: "Dotaz 5",
          listElements: ["Seznam uživatelů s jejich notifikacemi"]
        }
      ]
    }
  ];
  return <ListWrapper dataArray={dataArray} />;
}
