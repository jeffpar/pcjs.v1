---
layout: page
title: Animated Lite-Brite Demo
permalink: /devices/leds/litebrite/
machines:
  - id: lbDemo
    type: leds
    name: Lite-Brite Demo
    uncompiled: true
    config: |
      {
        "lbDemo": {
          "class": "Machine",
          "type": "leds",
          "name": "Lite-Brite Demo",
          "version": 1.10,
          "autoPower": false,
          "bindings": {
            "clear": "clearLB",
            "print": "printLB"
          },
          "overrides": ["autoPower"]
        },
        "lbChip": {
          "class": "Chip",
          "toggle": false,
          "bindings": {
            "colorPalette": "colorPaletteLB",
            "colorSelection": "colorSelectionLB",
            "colorSwatch1": "colorSwatchLB1",
            "colorSwatch2": "colorSwatchLB2",
            "colorSwatch3": "colorSwatchLB3",
            "colorSwatch4": "colorSwatchLB4",
            "colorSwatch5": "colorSwatchLB5",
            "colorSwatch6": "colorSwatchLB6",
            "colorSwatch7": "colorSwatchLB7",
            "colorSwatch8": "colorSwatchLB8",
            "saveToURL": "saveLB"
          },
          "colors": {
            "Original": {
              "Blue":   "#0000ff",
              "Green":  "#008000",
              "Purple": "#800080",
              "Red":    "#ff0000",
              "Orange": "#ffa500",
              "Pink":   "#ffc0cb",
              "Yellow": "#ffff00",
              "White":  "#ffffff"
            }
          },
          "overrides": ["wrap","pattern"]
        },
        "lbClock": {
          "class": "Time",
          "cyclesPerSecond": 1,
          "cyclesMinimum": 1,
          "cyclesMaximum": 120,
          "bindings": {
            "run": "runLB",
            "speed": "speedLB",
            "step": "stepLB",
            "throttle": "throttleLB"
          },
          "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate","cyclesMinimum","cyclesMaximum","requestAnimationFrame"]
        },
        "lbDisplay": {
          "class": "LED",
          "type": 1,
          "cols": 45,
          "rows": 39,
          "color": "black",
          "backgroundColor": "black",
          "hexagonal": true,
          "highlight": false,
          "bindings": {
            "container": "displayLB"
          },
          "overrides": ["color","backgroundColor"]
        },
        "lbInput": {
          "class": "Input",
          "bindings": {
            "reset": "resetLB"
          }
        }
      }
styles:
  lbDemo:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  displayLB:
    position: relative;
  .colorSwatchLB:
    display: none;
    width: 16px;
    height: 16px;
    border: 1px solid;
    border-radius: 50%;
    vertical-align: middle;
    background-color: green;
  diagsLB:
    float: left;
  printLB:
    font-family: Monaco,"Lucida Console",monospace;
---

Animated "Lite-Brite" Demo
--------------------------

The "[Lite-Brite](https://en.wikipedia.org/wiki/Lite-Brite)" concept was invented by Joseph M. Burck at
[Marvin Glass & Associates](https://en.wikipedia.org/wiki/Marvin_Glass_and_Associates) and first marketed as a toy
in 1967 by [Hasbro](https://en.wikipedia.org/wiki/Hasbro).

The original Lite-Brite design used a pair of matching black panels punctured with a series of evenly spaced holes
arranged in a grid of 39 rows, which alternated between 44 and 45 holes per row, resulting in a hexagonal ("honeycomb")
layout consisting of 1735 holes.  A piece of black paper containing a pre-printed pattern would be sandwiched between
the panels, and then your job was to insert any of the (blue, green, purple, red, orange, pink, yellow, or white)
colored pegs into the appropriately marked holes.

One of the goals of this demo is to take the "Lite-Brite" concept a bit farther, allowing you to associate
sequence numbers with each of the colored LEDs, making it possible to create a variety of "blinking" and "color-cycling"
animations.  Stay tuned.

{% include machine.html id="lbDemo" config="json" %}

<div id="lbDemo">
  <div id="displayLB"></div>
  <select id="colorPaletteLB"></select>&nbsp;<select id="colorSelectionLB"></select>
  <div id="colorSwatchLB1" class="colorSwatchLB"></div>
  <div id="colorSwatchLB2" class="colorSwatchLB"></div>
  <div id="colorSwatchLB3" class="colorSwatchLB"></div>
  <div id="colorSwatchLB4" class="colorSwatchLB"></div>
  <div id="colorSwatchLB5" class="colorSwatchLB"></div>
  <div id="colorSwatchLB6" class="colorSwatchLB"></div>
  <div id="colorSwatchLB7" class="colorSwatchLB"></div>
  <div id="colorSwatchLB8" class="colorSwatchLB"></div>
  <button id="saveLB">Save to URL</button>
</div>
<div id="diagsLB">
  <div>
    <textarea id="printLB" cols="78" rows="16"></textarea>
  </div>
  <button id="runLB">Run</button>
  <button id="stepLB">Step</button>
  <button id="resetLB">Reset</button>
  <button id="clearLB">Clear</button>
  <input type="range" min="1" max="120" value="15" class="slider" id="throttleLB"><span id="speedLB">Stopped</span>
</div>
