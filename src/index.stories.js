import { html } from "lit-html";

export const story1 = () => html`
  <style>
    html,
    body {
      height: 100vh;
      min-height: 100vh;
    }

    body {
      margin: 0;
    }

    main {
      height: 100vh;
    }

    tricky-timer {
      height: 100%;
      width: 100%;
    }
  </style>

  <main>
    <tricky-timer message="All done!"></tricky-timer>
  </main>
`;
