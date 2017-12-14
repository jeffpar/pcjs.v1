---
layout: page
title: Scrolling LEDs
permalink: /devices/leds/scrolling/
machines:
  - id: ledSquare
    type: leds
    name: LED Square
    config: |
      {
        "ledSquare": {
          "class": "Machine",
          "type": "leds",
          "name": "LED Square",
          "version": 1.11,
          "autoPower": false,
          "bindings": {
            "clear": "clearLS",
            "print": "printLS"
          },
          "overrides": ["autoPower"]
        },
        "ledChip": {
          "class": "Chip",
          "bindings": {
            "save": "saveLS",
            "symbolInput": "inputLS",
            "symbolPreview": "previewLS"
          },
          "overrides": ["backgroundImage"]
        },
        "ledClock": {
          "class": "Time",
          "cyclesPerSecond": 1,
          "cyclesMinimum": 1,
          "cyclesMaximum": 120,
          "bindings": {
            "run": "runLS",
            "speed": "speedLS",
            "step": "stepLS",
            "throttle": "throttleLS"
          },
          "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate","cyclesMinimum","cyclesMaximum","requestAnimationFrame"]
        },
        "ledDisplay": {
          "class": "LED",
          "type": 1,
          "cols": 16,
          "rows": 16,
          "color": "red",
          "highlight": false,
          "bindings": {
            "container": "displayLS"
          },
          "overrides": ["color","backgroundColor"]
        },
        "ledInput": {
          "class": "Input",
          "drag": true,
          "bindings": {
            "reset": "resetLS"
          }
        }
      }
styles:
  ledSquare:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  displayLS:
    position: relative;
    background-color: rgba(0,0,0,0);
    margin-bottom: 8px;
    background-image: none;
    background-size: 100% 100%;
  inputLS:
    width: 16px;
  previewLS:
    position: absolute;
    font-size: 32em;
	font-family: Helvetica;
	font-weight: normal;
    width: 100%;
    height: 100%;
    line-height: 100%;
    text-align: center;
    vertical-align: middle;
  printLS:
    font-family: Monaco,"Lucida Console",monospace;
  .diags:
    float: left;
---

Scrolling LEDs
--------------

{% include machine.html id="ledSquare" config="json" %}

<div id="ledSquare">
  <div id="previewLS">F</div>
  <div id="displayLS"></div>
</div>
<div class="diags">
  <div>
    <textarea id="printLS" cols="78" rows="16"></textarea>
  </div>
  Symbol: <input id="inputLS" type="text" value="F"/>
  <button id="saveLS">Save</button>
  <button id="resetLS">Reset</button>
  <button id="clearLS">Clear</button>
</div>
