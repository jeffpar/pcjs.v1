---
layout: page
title: LED Symbols
permalink: /devices/leds/symbols/
machines:
  - id: symbolLEDs
    type: leds
    name: LED Symbol
    config: |
      {
        "symbolLEDs": {
          "class": "Machine",
          "type": "leds",
          "name": "LED Symbol",
          "version": 1.11,
          "autoPower": false,
          "bindings": {
            "clear": "clearSymbol",
            "print": "printSymbol"
          },
          "overrides": ["autoPower"]
        },
        "symbolChip": {
          "class": "Chip",
          "bindings": {
            "save": "saveSymbol",
            "symbolInput": "inputSymbol",
            "symbolPreview": "previewSymbol"
          },
          "overrides": ["backgroundImage"]
        },
        "symbolDisplay": {
          "class": "LED",
          "type": 1,
          "cols": 16,
          "rows": 16,
          "color": "red",
          "highlight": false,
          "bindings": {
            "container": "displaySymbol"
          },
          "overrides": ["color","backgroundColor"]
        },
        "symbolInput": {
          "class": "Input",
          "drag": true,
          "bindings": {
            "reset": "resetSymbol"
          }
        }
      }
styles:
  symbolLEDs:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  displaySymbol:
    position: relative;
    background-color: rgba(0,0,0,0);
    background-image: none;
    background-size: 100% 100%;
  inputSymbol:
    width: 16px;
  previewSymbol:
    position: absolute;
    font-size: 32em;
    font-weight: normal;
    width: 100%;
    height: auto;
    line-height: 85%;
    text-align: center;
    vertical-align: middle;
  .print:
    font-family: Monaco,"Lucida Console",monospace;
  .diags:
    float: left;
    margin-bottom: 16px;
---

LED Symbols
-----------

This page helps you build new LED symbols by displaying characters underneath the LED grid as guides.

{% include machine.html id="symbolLEDs" config="json" %}

<div id="symbolLEDs">
  <div id="previewSymbol">A</div>
  <div id="displaySymbol"></div>
</div>
<div class="diags">
  <div>
    <textarea id="printSymbol" class="print" cols="78" rows="16"></textarea>
  </div>
  Symbol: <input id="inputSymbol" type="text" value="A"/>
  <button id="saveSymbol">Save</button>
  <button id="resetSymbol">Reset</button>
  <button id="clearSymbol">Clear</button>
</div>
