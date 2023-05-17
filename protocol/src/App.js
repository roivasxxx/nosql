import diagram from "./diag.png";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import Task from "./components/task";
import HiddenTask from "./components/hiddenTask";
import TextArea from "./components/textArea";
import CollectionSchema from "./components/collectionSchema";
import BusinessLogic from "./components/businessLogic";
import QueriesDescription from "./components/queriesDescription";
import QueriesScripts from "./components/queriesScripts";

function App() {
  const [state, setState] = useState({
    dockerCompose: "",
    collections: "",
    insertData: "",
    apilogic: "",
    queries: {
      first: "",
      first_alt: "",
      second: "",
      third: "",
      fourth: "",
      fifth: "",
      fifth_alt: ""
    },
    validation: "",
    backup: "",
    backupresult: "",
    deletedb: ""
  });

  const anchors = [
    "diagram",
    "docker",
    "schema-desc",
    "create-collections",
    "insert-data",
    "business-logic",
    "queries-description",
    "queries-scripts",
    "validation",
    "backup",
    "delete-db"
  ];

  const [sticky, setSticky] = useState(false);
  const [offset, setOffset] = useState(0);

  const navRef = useRef(null);

  const fetchAllFiles = async () => {
    console.debug("BEGINNING FILE FETCH");
    const fetchFile = async (filePath, stateProp) => {
      const file = await fetch(filePath);
      const text = await file.text();
      if (!stateProp.includes("queries")) {
        setState((state) => ({ ...state, [stateProp]: text }));
      } else {
        const queriesProp = stateProp.split("-")[1];
        setState((state) => ({
          ...state,
          queries: { ...state.queries, [queriesProp]: text }
        }));
      }
    };

    [
      ["./docker-compose.txt", "dockerCompose"],
      ["./create-collections.txt", "collections"],
      ["./insertdata.txt", "insertdata"],
      ["./api_logic.txt", "apilogic"],
      ["./query_1.txt", "queries-first"],
      ["./query_1_alt.txt", "queries-first_alt"],
      ["./query_2.txt", "queries-second"],
      ["./query_3.txt", "queries-third"],
      ["./query_4.txt", "queries-fourth"],
      ["./query_5.txt", "queries-fifth"],
      ["./query_5_alt.txt", "queries-fifth_alt"],
      ["./collection-validation.txt", "validation"],
      ["./create-backup.txt", "backup"],
      ["./backup_output.txt", "backupresult"],
      ["./delete-db.txt", "deletedb"]
    ].forEach(async (file) => {
      await fetchFile(file[0], file[1]);
    });
  };

  useEffect(() => {
    if (!navRef.current) {
      return;
    }
    setOffset(navRef.current.offsetTop);
  }, [navRef, setOffset]);

  useEffect(() => {
    fetchAllFiles();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) {
        return;
      }

      setSticky(window.scrollY > offset);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setSticky, navRef, offset]);

  return (
    <div className="App">
      <header>
        <h1>Semestrální projekt - NoSQL 2023</h1>
        <h2>Patrik Pahulák</h2>
      </header>
      <nav
        className="nav"
        ref={navRef}
        style={sticky ? { position: "fixed", top: 0 } : {}}
      >
        <div>
          {anchors.map((anchor, index) => {
            return (
              <a href={"#" + anchor} key={anchor}>
                {index + 1 + ")"}
              </a>
            );
          })}
        </div>
      </nav>
      {sticky && (
        <div
          style={{
            height: `${navRef.current?.clientHeight}px`
          }}
        />
      )}
      <div className="content">
        <div className="description">
          <p>
            Projekt slouží jako databáze pro stránku na stejném principu
            <mark>jako www.krajta.com</mark>, tedy jednoduché diskuzní fórum.
            Projekt obsahuje fakulty UHK, které mají svoje předměty. Předměty
            mají svoje vlákna. Vlákna jsou složena s příspěvků. V rámci aplikace
            vystupují uživatelé (měli by být ideálně studenti - viz krajta).
            Uživatelé mají možnost tvořit vlákna, příspěvky. Uživatelé mají dále
            možnost mezi sebou komunikovat pomocí zpráv.
          </p>
          <p>
            <mark>
              V root adresáři aplikace je README.md file, který by měl obsahovat
              všechny potřebné informace, jak pustit container, runnovat scripty
              atd..
            </mark>
          </p>
          <p>
            {
              "V rámci aplikace je dostupý i bonus, který zde v protokolu není rozepsán, bude běžet v rámci docker containeru na portu 8080 -> není nutno instalovat"
            }
          </p>
          <p>
            <mark>
              Veškerý kód pro bonus je uveden v ./backend/, konkrétní
              implementace endpointů je v ./backend/src/index.ts, ve stejném
              souboru je pro každý endpoint uveden příklad requestu
            </mark>
          </p>
        </div>
        <Task taskTitle="E-R Diagram" taskNum={1} href="diagram">
          <img src={diagram} width={600} height={400} alt="diagram" />
        </Task>
        <Task taskTitle="docker-compose" taskNum={2} href="docker">
          <p style={{ color: "red" }}>
            {
              "Pro tento projekt nebyla implementovaná replikace -> bylo řešeno jako poslední požadavek -> rozbíjelo již existující docker-compose"
            }
          </p>
          <HiddenTask isHiddenText="docker-compose.yaml">
            <TextArea text={state.dockerCompose} />
          </HiddenTask>
        </Task>
        <Task
          taskTitle="Popis validačních schémat"
          taskNum={3}
          href="schema-desc"
        >
          <CollectionSchema />
        </Task>

        <Task
          taskTitle="Vytvoření databázového schématu"
          taskNum={4}
          href="create-collections"
        >
          <p>
            {"Pro tento úkol existuje "}
            <mark>
              {
                ".js script i .sh script -> create-collections.js/create-collections.sh"
              }
            </mark>
          </p>
          <HiddenTask isHiddenText="create-collections.js">
            <TextArea text={state.collections} />
          </HiddenTask>
        </Task>

        <Task taskTitle="Vložení dat" taskNum={5} href="insert-data">
          <p>
            {"Pro tento úkol existuje "}
            <mark>
              {
                "pouze .sh script -> import-data.sh, data jsou dostupná v ./scripts/mock_data"
              }
            </mark>
            , každopádně existují i .js scripty, které funkcionalitu nabízejí v
            ./scripts/data_load
          </p>
          <HiddenTask isHiddenText="import-data.sh">
            <TextArea text={state.insertdata} />
          </HiddenTask>
        </Task>

        <Task taskTitle="Business logika" taskNum={6} href="business-logic">
          <BusinessLogic state={state} />
        </Task>

        <Task
          taskTitle="Dotazy nad schématem"
          taskNum={7}
          href="queries-description"
        >
          <QueriesDescription />
        </Task>

        <Task
          taskTitle="Skripty s navrženými dotazy nad schématem"
          taskNum={8}
          href="queries-scripts"
        >
          <QueriesScripts state={state} />
        </Task>

        <Task taskTitle="Porušení validace" taskNum={9} href="validation">
          <p>
            Výstup validace s hláškami je v níže zmiňovaném souboru v
            ./scripts/validation-output.json
          </p>
          <p style={{ color: "red" }}>
            Pro ověření funkcionality výstupů validace, je nutno se lognout přes
            mongosh do db, pustit tento command
            <mark>
              {'db.adminCommand( { setFeatureCompatibilityVersion: "5.0" } )'}
            </mark>
            , dále je nutno restartovat container, poté by se hlášky při
            porušení validace měly správně vypisovat
          </p>
          <HiddenTask isHiddenText="collection-validation.js">
            <TextArea text={state.validation} />
          </HiddenTask>
          <p>collection-validation.json</p>
        </Task>

        <Task taskTitle="Záloha databáze" taskNum={10} href="backup">
          <HiddenTask isHiddenText="create-backup.sh">
            <TextArea text={state.backup} />
          </HiddenTask>
          <HiddenTask isHiddenText="backup_output.txt">
            <TextArea text={state.backupresult} />
          </HiddenTask>
        </Task>

        <Task taskTitle="Smazání databáze" taskNum={11} href="delete-db">
          <HiddenTask isHiddenText="delete-db.sh">
            <TextArea text={state.deletedb} />
          </HiddenTask>
        </Task>
      </div>
    </div>
  );
}

export default App;
