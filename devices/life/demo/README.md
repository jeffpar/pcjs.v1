---
layout: page
title: '"Game of Life" Demo'
permalink: /devices/life/demo/
machines:
  - id: lifeDemo
    type: life
    name: Game of Life Demo
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
          },
          "overrides": ["autoPower"]
        },
        "lifeChip": {
          "class": "Chip",
          "wrap": false,
          "pattern": "gliderGun",
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
            "gliderGun": "gliderGun",
            "save": "saveLife"
          },
          "overrides": ["wrap","pattern"]
        },
        "lifeClock": {
          "class": "Time",
          "cyclesPerSecond": 1,
          "cyclesMinimum": 1,
          "cyclesMaximum": 120,
          "bindings": {
            "run": "runLife",
            "speed": "speedLife",
            "step": "stepLife",
            "throttle": "throttleLife"
          },
          "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate","cyclesMinimum","cyclesMaximum"]
        },
        "lifeDisplay": {
          "class": "LED",
          "type": 1,
          "cols": 38,
          "rows": 26,
          "color": "green",
          "backgroundColor": "black",
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

"Game of Life" Demo
-------------------

Using [PCjs Devices](/modules/devices/), here's a simple demo of
[John Conway's](http://www.conwaylife.com/wiki/John_Horton_Conway)
"[Game of Life](http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life)", using an grid of simulated LEDs.

Think of it as a animated "[Lite-Brite](https://en.wikipedia.org/wiki/Lite-Brite)".  Want a different LED color?
Try [Red](?color=red&autoStart=true#game-of-life) or [Blue](?color=blue#game-of-life) or any other color, by changing the URL.

### Game of Life

{% include machine.html id="lifeDemo" config="json" %}

<div id="lifeDemo">
  <div id="lifeDisplay"></div>
  <button id="gliderGun">Glider Gun</button>
  <button id="saveLife">Save</button>
</div>
<div class="diagsLife">
  <div>
    <textarea id="printLife" cols="78" rows="16"></textarea>
  </div>
  <button id="runLife">Run</button>
  <button id="stepLife">Step</button>
  <button id="resetLife">Reset</button>
  <button id="clearLife">Clear</button>
  <input type="range" min="1" max="120" value="15" class="slider" id="throttleLife"><span id="speedLife">Stopped</span>
</div>
