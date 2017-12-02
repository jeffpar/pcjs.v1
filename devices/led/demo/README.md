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
          "autoPower": false,
          "bindings": {
            "clear": "clearLife",
            "print": "printLife"
          }
        },
        "lifeChip": {
          "class": "Chip",
          "wrap": false,
          "patterns": {
            "gliderGun": [
              "#N Gosper glider gun",
              "#C This was the first gun discovered.",
              "#C As its name suggests, it was discovered by Bill Gosper.",
              "x = 36, y = 9, rule = B3/S23",
              "24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4b",
              "obo$10bo5bo7bo$11bo3bo$12b2o!"
            ]
          },
          "bindings": {
            "gliderGun": "gliderGun"
          }
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
          "width": 32,
          "height": 32,
          "cols": 38,
          "rows": 26,
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
  <button id="gliderGun">Glider Gun</button>
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
