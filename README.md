## Usage
Import in you Javascript bundle:
```javascript
// Custom elements will automatically register themselves.
import 'mschreiber68/tabs';

// Can also import custom element classes
import { Tab, TabList, TabPanel, Tabs } from 'mschreiber68/tabs'; 
```

```html
<x-tabs>
    <x-tab-list>
        <x-tab>Tab 1</x-tab>
        <x-tab selected>Tab 2</x-tab>
        <x-tab>Tab 3</x-tab>
    </x-tab-list>
    <x-tab-panel hidden>Panel 1</x-tab-panel>
    <x-tab-panel>Panel 2</x-tab-panel>
    <x-tab-panel hidden>Panel 3</x-tab-panel>
</x-tabs>
```

When rendering your HTML, the currently active tab should have the `selected` attribute.
The currently inactive panels should have the `hidden` attribute.

The components will automatically add all ids and accessibility attributes. 
The above HTML will result in the below:
```html
<x-tabs>
    <x-tab-list role="tablist">
        <x-tab id="tab-nqu4wx7plu-1" role="tab" aria-selected="false" tabindex="-1" aria-controls="tab-panel-cyvtj79027h-1">Tab 1</x-tab>
        <x-tab selected="" aria-selected="true" tabindex="0" id="tab-nqu4wx7plu-2" role="tab" aria-controls="tab-panel-cyvtj79027h-2">Tab 2</x-tab>
        <x-tab id="tab-nqu4wx7plu-3" role="tab" aria-selected="false" tabindex="-1" aria-controls="tab-panel-cyvtj79027h-3">Tab 3</x-tab>
    </x-tab-list>
    <x-tab-panel hidden="" id="tab-panel-cyvtj79027h-1" role="tabpanel" tabindex="0" aria-labelledby="tab-nqu4wx7plu-1">Panel 1</x-tab-panel>
    <x-tab-panel id="tab-panel-cyvtj79027h-2" role="tabpanel" tabindex="0" aria-labelledby="tab-nqu4wx7plu-2">Panel 2</x-tab-panel>
    <x-tab-panel hidden="" id="tab-panel-cyvtj79027h-3" role="tabpanel" tabindex="0" aria-labelledby="tab-nqu4wx7plu-3">Panel 3</x-tab-panel>
</x-tabs>
```

`<x-tab>` components must be nested somewhere within a `<x-tab-list>`.

`<x-tab>` components will be automatically associated the `<x-tab-panel>` at the same numerical offset.
For example, the 2nd `<x-tab>` in the DOM will associate to the 2nd `<x-tab-panel>`.

### Orientation
You can use the Left/Right or Up/Down keys to select tabs based on the orientation.
To set the orientation, set the `aria-orientation` attribute on a `<x-tab-list>` to either `vertical` or `horizontal`:
```html
<x-tab-list aria-orientation="vertical"></x-tab-list>
```
The default orientation is horizontal.

### Features
* 100% styleable, no CSS is included. Rely on the `selected` and `hidden` attributes of tabs and panels to style different states.
* SEO-friendly
* Accessible
* Compatible with other frontend frameworks, or no framework. (See demo page below)
* Automatically supports DOM updates such as tabs being added or removed. (See demo page below)
* Supports nested tabs. (See demo page below)

### Usage in other frameworks
For frameworks like Vue, you will need to call the `init()` method when the surrounding Vue component is mounted:
```html
<template>
    <x-tabs ref="tabs">
        ...
    </x-tabs>
</template>
<script>
    mounted() {
        this.$refs.tabs.init();
    }
</script>
```

## Installation
### Install via NPM:
```shell
npm i @mschreiber68/tabs
```

### Download via CDN:
```html
<script src="https://unpkg.com/@mschreiber68/tabs@latest/dist/cdn/index.js"></script>
```

## Demo
https://mschreiber68.github.io/tabs/demo.html