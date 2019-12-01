const template = document.createElement("template");
template.innerHTML = `
  <style>
  :host {
    display: inline-grid;
    grid-template-areas: 'centered';
    align-items: center;
    justify-content: center;
    background: cornflowerblue;
    transition: background 0.2s ease-in-out;
  }

  time, #controls {
    grid-area: centered;
    font-family: Hack, mono;
    font-size: 48px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
  }

  time {
    opacity: 0;
  }

  #controls {
    opacity: 1;
  }

  input, button {
    font-size: inherit;
    background: none;
    border: none;
  }

  label {
    display: contents;
  }

  label, button {
    width: 100%;
  }

  button {
    -webkit-text-stroke:
    white 5px;
    paint-order: stroke fill;
    transition: -webkit-text-stroke-color 0.2s ease-in-out;
  }

  button:active, button:focus, button:hover {
    -webkit-text-stroke-color: hotpink;
  }

  :host([active]) {
    background: cornsilk;
  }

  :host([active]) #controls {
    opacity: 0;
  }

  :host([active]) time {
    opacity: 1;
  }
  </style>

  <form id="controls">

    <label>
      <abbr title="timer duration">⏲</abbr>
      <input id="duration"
        required
        type="time"
        name="duration"
        min="00:00:01"
        step="1" />
    </label>

    <button type="submit">Start!</button>

  </form>
  
  <time id="timer"></time>
`;

export default class TrickyTimer extends HTMLElement {
  static get observedAttributes() {
    return ["message"];
  }

  get message() {
    return this.getAttribute("message");
  }

  set message(value) {
    this.setAttribute("message", value);
  }

  get duration() {
    return this.$("#duration").valueAsNumber;
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true));
    this.onFrame = this.onFrame.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  $(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (this[attr] === newValue) return;
    else this[attr] = newValue;
  }

  connectedCallback() {
    this.$("#controls").addEventListener("submit", this.onSubmit);
  }

  onSubmit(event) {
    this.startTime = Date.now();
    this.endTime = this.startTime + this.duration;
    this.endDate = new Date(this.duration);
    this.endHours = this.endDate.getHours() || 0;
    this.endMinutes = this.endDate.getMinutes() || 0;
    this.endSeconds = this.endDate.getSeconds() || 0;
    this.endMilliseconds = this.endDate.getMilliseconds() || 0;

    event.preventDefault();
    this.setAttribute("active", "");

    requestAnimationFrame(this.onFrame);
  }

  onFrame() {
    const now = Date.now();
    const start = this.startTime;
    const end = this.endTime;
    const duration = this.duration;
    const elapsed = now - this.startTime;
    const remaining = duration - elapsed;

    if (elapsed >= this.duration) {
      this.removeAttribute("active");
      alert(this.message);
    } else {
      const remainingDate = new Date(remaining);

      const h = remainingDate.getUTCHours();
      const m = remainingDate.getUTCMinutes();
      const s = remainingDate.getUTCSeconds();
      const ms = remainingDate
        .getUTCMilliseconds()
        .toString()
        .padStart(4, "0");

      this.$("time").textContent = `${h}:${m}:${s}:${ms}`;

      requestAnimationFrame(this.onFrame);
    }
  }
}

customElements.define("tricky-timer", TrickyTimer);
