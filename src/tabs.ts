import { KEYCODE } from "./utils";
import Tab from "./tab";
import TabList from "./tabList";
import TabPanel from "./tabPanel";

export default class Tabs extends HTMLElement {
  public connectedCallback(): void {
    this.linkPanelsAria();
    this.addEventListener('tab-click', this.onTabClick);
    this.addEventListener('keydown', this.onKeyDown);
  }

  private get tabsIdSelector(): string {
    const tabsId = this.getAttribute('tabs-id');
    return tabsId ? `[tabs-id="${tabsId}]` : '';
  }

  private get tabs(): Tab[] {
    const tabList = this.tabList;
    if (!tabList) return [];

    return Array.from(tabList.querySelectorAll(`[role="tab"]${this.tabsIdSelector}`));
  }

  private get panels(): TabPanel[] {
    return Array.from(this.querySelectorAll(`[role="tabpanel"]${this.tabsIdSelector}`));
  }

  private get tabList(): TabList|null {
    return this.querySelector(`[role="tablist"]${this.tabsIdSelector}`);
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

  private linkPanelsAria(): void {
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
    }
  }
}

if (typeof window !== 'undefined' && !window.customElements.get('x-tabs')) {
  window.customElements.define('x-tabs', Tabs);
}