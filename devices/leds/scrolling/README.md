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
          "rule": "C8",
          "bindings": {
            "save": "saveLS"
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
    background-color: gray;
    line-height: 0;
    margin-bottom: 8px;
    background-image: none;
    background-size: 100% 100%;
  diagsLS:
    float: left;
  printLS:
    font-family: Monaco,"Lucida Console",monospace;
---

Scrolling LEDs
--------------

{% include machine.html id="ledSquare" config="json" %}

<div id="ledSquare">
  <div id="displayLS"></div>
  <button id="saveLS">Save</button>
</div>
<div id="diagsLS">
  <div>
    <textarea id="printLS" cols="78" rows="16"></textarea>
  </div>
  <button id="runLS">Run</button>
  <button id="stepLS">Step</button>
  <button id="resetLS">Reset</button>
  <button id="clearLS">Clear</button>
  <input type="range" min="1" max="120" value="15" class="slider" id="throttleLS"><span id="speedLS">Stopped</span>
</div>
