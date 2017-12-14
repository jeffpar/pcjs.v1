---
layout: page
title: Scrolling LEDs
permalink: /devices/leds/scrolling/
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
  - id: scrollLEDs
    type: leds
    name: LED Scroller
    config: |
      {
        "scrollLEDs": {
          "class": "Machine",
          "type": "leds",
          "name": "LED Scroller",
          "version": 1.11,
          "autoPower": false,
          "bindings": {
            "clear": "clearScroll",
            "print": "printScroll"
          },
          "overrides": ["autoPower"]
        },
        "scrollChip": {
          "class": "Chip",
          "rule": "L1",
          "symbols": "ABCABCABCABCABCABCABCABC",
          "overrides": ["backgroundImage"]
        },
        "scrollClock": {
          "class": "Time",
          "cyclesPerSecond": 1,
          "cyclesMinimum": 1,
          "cyclesMaximum": 120,
          "bindings": {
            "run": "runScroll",
            "speed": "speedScroll",
            "step": "stepScroll",
            "throttle": "throttleScroll"
          },
          "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate","cyclesMinimum","cyclesMaximum","requestAnimationFrame"]
        },
        "scrollDisplay": {
          "class": "LED",
          "type": 1,
          "cols": 256,
          "rows": 16,
          "colsExtra": 16,
          "color": "red",
          "highlight": false,
          "bindings": {
            "container": "displayScroll"
          },
          "overrides": ["color","backgroundColor"]
        },
        "scrollInput": {
          "class": "Input",
          "drag": true,
          "bindings": {
            "reset": "resetScroll"
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
    font-size: 48em;
	font-family: 'Bungee Hairline';
	font-weight: normal;
    width: 100%;
    height: auto;
    line-height: 68%;
    text-align: center;
    vertical-align: middle;
    margin-left: -10px;
  scrollLEDs:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  displayScroll:
    position: relative;
    line-height: 0;
    background-color: black;
    background-image: none;
    background-size: 100% 100%;
	-webkit-tap-highlight-color: transparent;
  .print:
    font-family: Monaco,"Lucida Console",monospace;
  .diags:
    float: left;
    margin-bottom: 16px;
---

Scrolling LEDs
--------------

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

{% include machine.html id="scrollLEDs" config="json" %}

<div id="scrollLEDs">
  <div id="displayScroll"></div>
</div>
<div class="diags">
  <div>
    <textarea id="printScroll" class="print" cols="78" rows="16"></textarea>
  </div>
  <button id="runScroll">Run</button>
  <button id="stepScroll">Step</button>
  <button id="resetScroll">Reset</button>
  <button id="clearScroll">Clear</button>
  <input type="range" min="1" max="120" value="15" class="slider" id="throttleScroll"><span id="speedScroll">Stopped</span>
</div>
