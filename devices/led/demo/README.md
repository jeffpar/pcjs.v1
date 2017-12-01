---
layout: page
title: Life Demo
permalink: /devices/led/demo/
machines:
  - id: lifeDemo
    type: life
    name: Life Demo
    uncompiled: true
    config: |
      {
        "lifeDemo": {
          "class": "Machine",
          "type": "Life",
          "name": "Life Demo",
          "version": 1.10,
          "bindings": {
            "clear": "clearLife",
            "print": "printLife"
          }
        },
        "lifeChip": {
          "class": "Chip"
        },
        "lifeClock": {
          "class": "Time",
          "cyclesPerSecond": 1,
          "cyclesMinimum": 1,
          "cyclesMaximum": 1000,
          "bindings": {
            "run": "runLife",
            "speed": "speedLife",
            "step": "stepLife",
            "throttle": "throttleLife"
          },
          "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate"]
        },
        "lifeDisplay": {
          "class": "LED",
          "type": 1,
          "cols": 32,
          "rows": 32,
          "color": "green",
          "bindings": {
            "container": "lifeDisplay"
          },
          "overrides": ["color","backgroundColor"]
        },
        "lifeInput": {
          "class": "Input",
          "bindings": {
            "reset": "resetLife"
          }
        }
      }
styles:
  lifeDemo:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  lifeDisplay:
    position: relative;
  .diagsLife:
    float: left;
  printLife:
    font-family: Monaco,"Lucida Console",monospace;
---

Life Demo
---------

{% include machine.html id="lifeDemo" config="json" %}

<div id="lifeDemo">
  <div id="lifeDisplay"></div>
</div>
<div class="diagsLife">
  <div>
    <textarea id="printLife" cols="78" rows="16"></textarea>
  </div>
  <button id="runLife">Run</button>
  <button id="stepLife">Step</button>
  <button id="resetLife">Reset</button>
  <button id="clearLife">Clear</button>
  <input type="range" min="1" max="1000" value="1" class="slider" id="throttleLife"><span id="speedLife">Stopped</span>
</div>
