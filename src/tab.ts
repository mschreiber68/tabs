import { uniqueStr } from "./utils";

export default class Tab extends HTMLElement {
  private static count = 0;
  private static uniq = uniqueStr();

  public static get observedAttributes() {
    return ['selected'];
  }

  public get selected(): boolean {
    return this.hasAttribute('selected');
  }

  public set selected(value: boolean) {
    if (value)
      this.setAttribute('selected', '');
    else
      this.removeAttribute('selected');
  }

  public attributeChangedCallback(): void {
    this.updateAriaAttrs();
  }

  public connectedCallback() {
    this.id ||= `tab-${Tab.uniq}-${++Tab.count}`;

    this.setAttribute('role', 'tab');
    this.updateAriaAttrs();

    this.upgradeProperty('selected');

    this.addEventListener('click', this.onClick);
  }

  private updateAriaAttrs() {
    this.setAttribute('aria-selected', this.selected.toString());
    this.setAttribute('tabindex', this.selected ? '0' : '-1');
  }

  private onClick = (): void => {
    this.dispatchEvent(new CustomEvent('tab-click', { bubbles: true}));
  }

  private upgradeProperty(prop: string): void {
    if (this.hasOwnProperty(prop)) {
      // @ts-ignore
      let value = this[prop];
      // @ts-ignore
      delete this[prop];
      // @ts-ignore
      this[prop] = value;
    }
  }
}

if (typeof window !== 'undefined' && !window.customElements.get('x-tab')) {
  window.customElements.define('x-tab', Tab);
}