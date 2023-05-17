import React from "react";
import ListWrapper from "./listWrapper";
import HiddenTask from "./hiddenTask";
import TextArea from "./textArea";

export default function BusinessLogic({ state }) {
  const process1 = [
    {
      title: "Přidání nového vlákna",
      listElements: [
        {
          listTitle: "Popis",
          listElements: ["Tvorba nového vlákna"]
        },
        {
          listTitle: "Vstupy",
          listElements: [
            "_threadData - info o vláknu (title,autor)",
            "_courseId - ObjectId dokumentu z kolekce courses (ObjectId kurzu)",
            "postData - info o příspěvku (autor, datum vytvoření, text příspěvku)"
          ]
        },
        {
          listTitle: "Výstup",
          listElements: [
            "Výpis v konzoli o úspěšném přidání / Chybová hláška v konzoli"
          ]
        },
        {
          listTitle: "Business logika",
          listElements: [
            "Ověření existence kurzu na základě vstupu - _courseId",
            "V případě, že kurz neexistuje vyhazuje chybu a ukončuje",
            "V případě, že je kurz nalezen proces pokračuje",
            "Vytvoření vlákna - uložení ObjectId vlákna",
            "Vytvoření příspěvku - využito ObjectId z předchozího kroku",
            "Výpis o ukončení -> Konec procesu"
          ]
        },
        {
          listTitle: "Skript",
          listElements: ["api_logic.js -> funkce addNewThread"]
        }
      ]
    },
    {
      title: "Smazání uživatele",
      listElements: [
        {
          listTitle: "Popis",
          listElements: ["Smazání uživatele"]
        },
        {
          listTitle: "Vstupy",
          listElements: ["userId - ObjectId uživatele z kolekce users"]
        },
        {
          listTitle: "Výstup",
          listElements: [
            "Výpis v konzoli o úspěšném smazání / Chybová hláška v konzoli"
          ]
        },
        {
          listTitle: "Business logika",
          listElements: [
            "Ověření existence uživatele na základě vstupu - userId",
            "V případě, že uživatel neexistuje vyhazuje chybu a ukončuje",
            "V případě, že je uživatel nalezen proces pokračuje",
            "Smazání uživatele",
            "Update dokumentů v kolekci threads - smazání userId z notifications arraye u všech dokumentů",
            "Výpis o ukončení -> Konec procesu"
          ]
        },
        {
          listTitle: "Skript",
          listElements: ["api_logic.js -> funkce deleteUser"]
        }
      ]
    },
    {
      title: "Odeslání zprávy",
      listElements: [
        {
          listTitle: "Popis",
          listElements: ["Odeslání zprávy uživateli"]
        },
        {
          listTitle: "Vstupy",
          listElements: [
            "authorId (odesílatel zprávy) - ObjectId uživatele z kolekce users",
            "recipientId (příjemce zprávy) - ObjectId uživatele z kolekce users",
            "message - text zprávy"
          ]
        },
        {
          listTitle: "Výstup",
          listElements: [
            "Výpis v konzoli o úspěšném smazání / Chybová hláška v konzoli"
          ]
        },
        {
          listTitle: "Business logika",
          listElements: [
            "Ověření existence uživatelů na základě vstupů - authorId, recipientId",
            "V případě, že jeden jeden nebo oba uživatelé neexistují vyhazuje chybu a ukončuje",
            "V případě, že jsou uživatelé nalezeni proces pokračuje",
            "Ověření existence konverzace mezi uživateli",
            "Jestli konverzace neexistuje -> vytváří novou a pokračuje, jinak pouze pokračuje ",
            "Přidání nové zprávy",
            "Výpis o ukončení -> Konec procesu"
          ]
        },
        {
          listTitle: "Skript",
          listElements: ["api_logic.js -> funkce sendMessage"]
        }
      ]
    }
  ];

  return (
    <div>
      <p>
        V rámci tohoto bodu je pro každý proces uveden popis, na konci sekce je
        k dispozici <mark>{"1 .js skript, v kterém jsou všechny procesy"}</mark>
      </p>
      <ListWrapper dataArray={process1} />
      <h4>Skript</h4>
      <HiddenTask isHiddenText={"api_logic.js"}>
        <TextArea text={state.apilogic} />
      </HiddenTask>
    </div>
  );
}
