import React from "react";
import HiddenTask from "./hiddenTask";
import TextArea from "./textArea";

export default function QueriesScripts({ state }) {
  return (
    <div>
      <p>
        {"V rámci každého dotazu je k dispozici .js skript"}
        <mark>{"(./scripts/queries)"}</mark>
        {", výsledky jsou společně s výstupem explain() jsou k dispozici v "}
        <mark>{"./scripts/query_results"}</mark>
      </p>

      <h4>Dotaz 1</h4>
      <HiddenTask isHiddenText="query_1.js">
        <TextArea text={state.queries.first} />
      </HiddenTask>

      <p>query_1.json</p>

      <HiddenTask isHiddenText="query_1_alt.js">
        <TextArea text={state.queries.first_alt} />
      </HiddenTask>
      <p>query_1_alt.json</p>
      <p>Porovnání dotazů dle executionStats:</p>
      <ul>
        <li>query 1: 1 millis execution time, 404 docs examined</li>
        <li>query 1 alt: 0 millis execution time, 400 docs examined</li>
      </ul>

      <h4>Dotaz 2</h4>
      <HiddenTask isHiddenText="query_2.js">
        <TextArea text={state.queries.second} />
      </HiddenTask>
      <p>query_2.json</p>

      <h4>Dotaz 3</h4>
      <HiddenTask isHiddenText="query_3.js">
        <TextArea text={state.queries.third} />
      </HiddenTask>
      <p>query_3.json</p>

      <h4>Dotaz 4</h4>
      <HiddenTask isHiddenText="query_4.js">
        <TextArea text={state.queries.fourth} />
      </HiddenTask>
      <p>query_4.json</p>

      <h4>Dotaz 5</h4>
      <HiddenTask isHiddenText="query_5.js">
        <TextArea text={state.queries.fifth} />
      </HiddenTask>
      <p>query_5.json</p>
      <HiddenTask isHiddenText="query_5_alt.js">
        <TextArea text={state.queries.fifth_alt} />
      </HiddenTask>
      <p>query_5_alt.json</p>
      <p>Porovnání dotazů dle executionStats:</p>
      <ul>
        <li>query 5: 6 millis execution time, 2000 docs examined</li>
        <li>query 5 alt: 1 millis execution time, 1000 docs examined</li>
      </ul>
    </div>
  );
}
