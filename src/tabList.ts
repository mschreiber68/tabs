export default class TabList extends HTMLElement {
  public connectedCallback(): void {
    this.setAttribute('role', 'tablist');
  }
}

if (typeof window !== 'undefined' && !window.customElements.get('x-tab-list')) {
  window.customElements.define('x-tab-list', TabList);
}
