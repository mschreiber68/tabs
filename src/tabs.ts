import { KEYCODE } from "./utils";
import Tab from "./tab";
import TabList from "./tabList";
import TabPanel from "./tabPanel";

export default class Tabs extends HTMLElement {
  private mutationObserver?: MutationObserver;
  
  public connectedCallback(): void {
    this.linkPanelsAria();

    this.mutationObserver = new MutationObserver(this.onMutation);
    this.mutationObserver.observe(this, { childList: true, subtree: true });

    this.addEventListener('tab-click', this.onTabClick);
    this.addEventListener('keydown', this.onKeyDown);
  }

  public disconnectedCallback(): void {
    this.mutationObserver?.disconnect();
  }

  private onMutation = (mutations: MutationRecord[]): void => {
    for (const mutation of mutations) {
      const movedNodes = Array.from(mutation.addedNodes).concat(Array.from(mutation.removedNodes));

      for (const node of movedNodes) {
        if (!(node instanceof Element)) continue;
        if (!['tab', 'tabpanel'].includes(node.getAttribute('role') || '')) continue;
        if (this.getAttribute('data-tabs') !== node.getAttribute('data-tabs')) continue;

        this.linkPanelsAria();
        if (!this.selectedTab) this.selectFirstTab();
        return;
      }
    }
  }

  private get dataTabsSelector(): string {
    const attrValue = this.getAttribute('data-tabs');
    return attrValue ? `[data-tabs="${attrValue}"]` : '';
  }

  private get tabs(): Tab[] {
    const tabList = this.tabList;
    if (!tabList) return [];

    return Array.from(tabList.querySelectorAll(`[role="tab"]${this.dataTabsSelector}`));
  }

  private get panels(): TabPanel[] {
    return Array.from(this.querySelectorAll(`[role="tabpanel"]${this.dataTabsSelector}`));
  }

  private get tabList(): TabList|null {
    return this.querySelector(`[role="tablist"]${this.dataTabsSelector}`);
  }

  private get selectedTab(): Tab|null {
    return this.tabs.find(tab => tab.selected) || null;
  }

  private get selectedTabPanel(): TabPanel|null {
    const tab = this.selectedTab;
    return tab ? this.getPanelForTab(tab) : null;
  }

  private get orientation(): string {
    return this.tabList?.getAttribute('aria-orientation') || 'horizontal';
  }

  private linkPanelsAria = (): void => {
    const tabs = this.tabs;
    const panels = this.panels;

    tabs.forEach((tab, i) => {
      if (i < panels.length) {
        tabs[i].setAttribute('aria-controls', panels[i].id);
        panels[i].setAttribute('aria-labelledby', tabs[i].id);
      }
    })
  }

  private selectTab(tab: Tab): void {
    if (tab.selected) return;

    this.reset();

    tab.selected = true;
    tab.focus();

    const panel = this.getPanelForTab(tab);
    if (panel) {
      panel.hidden = false;
    }

    this.dispatchEvent(new CustomEvent('tab-select', { detail: { tab } }))
  }

  private selectFirstTab(): void {
    const tabs = this.tabs;
    if (tabs.length) {
      this.selectTab(tabs[0]);
    }
  }

  private selectPreviousTab(): void {
    const tabs = this.tabs;
    if (!tabs.length) return;

    const selectedIndex = tabs.findIndex(tab => tab.selected);
    if (selectedIndex === -1) {
      this.selectFirstTab();
      return;
    }

    const previousIndex = selectedIndex - 1;
    const previousTab = tabs[(previousIndex + tabs.length) % tabs.length];
    this.selectTab(previousTab);
  }

  private selectNextTab() {
    const tabs = this.tabs;
    if (!tabs.length) return;

    const selectedIndex = tabs.findIndex(tab => tab.selected);
    if (selectedIndex === -1) {
      this.selectFirstTab();
      return;
    }

    const nextIndex = selectedIndex + 1;
    const nextTab = tabs[(nextIndex + tabs.length) % tabs.length];
    this.selectTab(nextTab);
  }

  private selectLastTab() {
    const tabs = this.tabs;
    if (tabs.length) {
      this.selectTab(tabs[tabs.length - 1]);
    }
  }

  private getPanelForTab(tab: Tab): TabPanel | null {
    const panelId = tab.getAttribute('aria-controls');
    if (!panelId) return null;

    const panel = document.getElementById(panelId);
    return panel instanceof TabPanel ? panel : null;
  }

  private reset(): void {
    const tabs = this.tabs;
    tabs.forEach(tab => tab.selected = false);

    const panels = this.panels;
    panels.forEach(panel => panel.hidden = true);
  }

  private onTabClick = (event: Event): void => {
    event.stopPropagation();
    this.selectTab(event.target as Tab);
  }

  private onKeyDown = (event: Event): void => {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.altKey) return;

    if (!(event.target instanceof Element)) return;
    if (!['tab', 'tablist'].includes(event.target.getAttribute('role') || '')) return;

    let isHandled = false;

      switch (event.keyCode) {
        case KEYCODE.TAB:
          if (!event.shiftKey) {
            this.selectedTabPanel?.focus();
            isHandled = true;
          }
          break;
        case KEYCODE.HOME:
          this.selectFirstTab();
          isHandled = true;
          break;
        case KEYCODE.LEFT:
          if (this.orientation === 'horizontal') {
            this.selectPreviousTab();
            isHandled = true;
          }
          break;
        case KEYCODE.UP:
          if (this.orientation === 'vertical') {
            this.selectPreviousTab();
            isHandled = true;
          }
          break;
        case KEYCODE.RIGHT:
          if (this.orientation === 'horizontal') {
            this.selectNextTab();
            isHandled = true;
          }
          break;
        case KEYCODE.DOWN:
          if (this.orientation === 'vertical') {
            this.selectNextTab();
            isHandled = true;
          } else if (this.orientation === 'horizontal') {
            const panel = this.selectedTabPanel;
            if (panel && this.tabList?.compareDocumentPosition(panel) === Node.DOCUMENT_POSITION_FOLLOWING) {
              panel.focus();
              isHandled = true;
            }
          }
          break;
        case KEYCODE.END:
          this.selectLastTab();
          isHandled = true;
          break;
      }

    if (isHandled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}

if (typeof window !== 'undefined' && !window.customElements.get('x-tabs')) {
  window.customElements.define('x-tabs', Tabs);
}