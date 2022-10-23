import { uniqueStr } from "./utils";

export default class TabPanel extends HTMLElement {
  private static count = 0;
  private static uniq = uniqueStr();

  public connectedCallback(): void {
    this.id ||= `tab-panel-${TabPanel.uniq}-${++TabPanel.count}`;

    this.setAttribute('role', 'tabpanel');
    this.setAttribute('tabindex', '0');
  }
}

if (typeof window !== 'undefined' && !window.customElements.get('x-tab-panel')) {
  window.customElements.define('x-tab-panel', TabPanel);
}