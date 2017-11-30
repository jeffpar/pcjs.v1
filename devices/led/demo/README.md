---
layout: page
title: LED Demo
permalink: /devices/led/demo/
machines:
  - id: ledDemo
    type: ledd
    name: LED Demo
    uncompiled: true
    config: |
      {
        "ledDemo": {
          "class": "Machine",
          "type": "LEDD",
          "name": "LED Demo",
          "version": 1.03
        },
        "ledController": {
          "class": "Chip"
        },
        "ledClock": {
          "class": "Time",
          "cyclesPerSecond": 10,
          "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate"]
        },
        "ledDisplay": {
          "class": "LED",
          "type": 1,
          "cols": 32,
          "rows": 32,
          "color": "green",
          "bindings": {
            "container": "ledDisplay"
          },
          "overrides": ["color","backgroundColor"]
        }
      }
styles:
  ledDemo:
    position: relative;
    display: inline-block;
  ledDisplay:
    position: relative;
---

LED Demo
--------

{% include machine.html id="ledDemo" config="json" %}

<div id="ledDemo">
  <div id="ledDisplay"></div>
</div>
