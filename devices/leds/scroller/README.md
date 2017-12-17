---
layout: page
title: LED Scroller
permalink: /devices/leds/scroller/
machines:
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
          "autoPower": true,
          "bindings": {
            "clear": "clearScroll",
            "print": "printScroll"
          },
          "overrides": ["autoPower"]
        },
        "scrollChip": {
          "class": "Chip",
          "rule": "L1",
          "message": "Happy New Year!$c$30b$30o$30b$30o$90s$r",
          "overrides": ["backgroundImage"]
        },
        "scrollClock": {
          "class": "Time",
          "cyclesPerSecond": 1,
          "cyclesMinimum": 1,
          "cyclesMaximum": 120,
          "clockByFrame": true,
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
          "type": 0,
          "cols": 256,
          "rows": 16,
          "colsExtra": 16,
          "color": "red",
          "backgroundColor": "black",
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
  scrollLEDs:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  displayScroll:
    position: relative;
  .print:
    font-family: Monaco,"Lucida Console",monospace;
  .diags:
    float: left;
    margin-bottom: 16px;
---

LED Scroller
------------

This page demonstrates the ability of the LED device to create scrolling LED displays.

You can enter new messages in the Diagnostics window using the `s` command (eg, `s Hello World!`).

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
  <input type="range" min="1" max="120" value="60" class="slider" id="throttleScroll"><span id="speedScroll">Stopped</span>
</div>
