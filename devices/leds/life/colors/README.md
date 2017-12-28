---
layout: page
title: '"Game of Life" Color Demo'
permalink: /devices/leds/life/colors/
machines:
  - id: lifeColorDemo
    type: leds
    name: Game of Life Color Demo
    config: |
      {
        "lifeColorDemo": {
          "class": "Machine",
          "type": "leds",
          "name": "Game of Life Demo",
          "version": 1.10,
          "autoStart": false,
          "bindings": {
            "clear": "clearLife",
            "print": "printLife"
          },
          "overrides": ["autoStart"]
        },
        "lifeChip": {
          "class": "Chip",
          "rule": "B3/S23",
          "pattern": "gliderGun",
          "patterns": {
            "gliderGun": [
              "#N Gosper Glider Gun",
              "#C This was the first gun discovered.",
              "#C As its name suggests, it was discovered by Bill Gosper.",
              "x = 36, y = 9, rule = B3/S23",
              "24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4b",
              "obo$10bo5bo7bo$11bo3bo$12b2o!"
            ]
          },
          "bindings": {
            "colorPalette": "colorPaletteLife",
            "colorSelection": "colorSelectionLife",
            "colorSwatchSelected": "colorSwatchLife",
            "patterns": "patternsLife",
            "saveToURL": "saveLife"
          },
          "colors": {
            "Primary": {
              "Navy":    "#000080",
              "Green":   "#008000",
              "Teal":    "#008080",
              "Maroon":  "#800000",
              "Purple":  "#800080",
              "Olive":   "#808000",
              "Gray":    "#808080",
              "Blue":    "#0000ff",
              "Lime":    "#00ff00",
              "Cyan":    "#00ffff",
              "Red":     "#ff0000",
              "Magenta": "#ff00ff",
              "Yellow":  "#ffff00",
              "White":   "#ffffff"
            },
            "Pastels": {
              "Pink":    "#ffb3ba",
              "Beige":   "#ffdfba",
              "Yellow":  "#ffffba",
              "Green":	 "#baffc9",
              "Blue":	 "#bae1ff"
            }
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
          "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate","cyclesMinimum","cyclesMaximum","requestAnimationFrame"]
        },
        "lifeDisplay": {
          "class": "LED",
          "type": 1,
          "cols": 38,
          "rows": 26,
          "color": "green",
          "backgroundColor": "black",
          "bindings": {
            "container": "displayLife"
          },
          "overrides": ["color","backgroundColor"]
        },
        "lifeInput": {
          "class": "Input",
          "drag": true,
          "bindings": {
            "reset": "resetLife"
          }
        }
      }
styles:
  _lifeColorDemo:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  _displayLife:
    position: relative;
  _colorSwatchLife:
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid;
    border-radius: 50%;
    vertical-align: middle;
    background-color: green;
  _diagsLife:
    float: left;
  _printLife:
    font-family: Monaco,"Lucida Console",monospace;
---

"Game of Life" Color Demo
-------------------------

Using [PCjs Devices](/modules/devices/), here's a simple demo of
[John Conway's](http://www.conwaylife.com/wiki/John_Horton_Conway)
"[Game of Life](http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life)", using an grid of simulated multi-colored LEDs.

### Game of Life

{% include machine.html id="lifeColorDemo" config="json" %}

<div id="lifeColorDemo">
  <div id="displayLife"></div>
  <button id="runLife">Run</button>
  <button id="stepLife">Step</button>
  <button id="resetLife">Reset</button>
  <button id="clearLife">Clear</button>
  <input type="range" min="1" max="120" value="15" class="slider" id="throttleLife"><span id="speedLife">Stopped</span>
  <select id="colorPaletteLife"></select>&nbsp;<select id="colorSelectionLife"></select>&nbsp;<div id="colorSwatchLife"></div>
  <select id="patternsLife"><option value="">None</option></select>
  <button id="saveLife">Save to URL</button>
</div>
<div id="diagsLife">
  <div>
    <textarea id="printLife" cols="78" rows="16"></textarea>
  </div>
</div>
