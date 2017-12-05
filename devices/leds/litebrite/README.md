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
          "wrap": false,
          "bindings": {
            "colorPalette": "colorPaletteLB",
            "colorSelection": "colorSelectionLB",
            "colorSwatch": "colorSwatchLB",
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
            },
            "Special": {
              "Black":  "#000000"
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
          "color": "green",
          "backgroundColor": "black",
          "hexagonal": true,
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
  colorSwatchLB:
    display: inline-block;
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

{% include machine.html id="lbDemo" config="json" %}

<div id="lbDemo">
  <div id="displayLB"></div>
  <select id="colorPaletteLB"></select>&nbsp;<select id="colorSelectionLB"></select>&nbsp;<div id="colorSwatchLB"></div>
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
