---
layout: page
title: VT100 (New)
permalink: /devices/pc8080/machine/vt100/new/
machines:
  - id: vt100
    type: vt100
    name: VT100 (New)
    config: vt100.json
styles:
  .pcjs-video:
    width: 100%;
    height: auto;
    background-color: black;
    position: relative;
    clear: both;
  .pcjs-monitor:
    width: 100%;
    height: auto;
  .pcjs-overlay:
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  .pcjs-diagnostics:
    clear: both;
  .pcjs-console:
    font-family: monospace;
    width: 100%;
---

VT100 (New)
-----------

{% include machine.html id="vt100" config="json" %}

<div id="vt100">
  <button id="zoomVT100" style="float:right">Full-Screen</button>
  <div id="videoVT100" class="pcjs-video"></div>
</div>
<div class="pcjs-diagnostics">
  <div>
    <div>Diagnostics</div>
    <textarea id="printVT100" class="pcjs-console" cols="128" rows="20" spellcheck="false"></textarea>
  </div>
  <button id="powerVT100">Power</button>
  <button id="resetVT100">Reset</button>
  <button id="runVT100">Run</button>
  <button id="stepVT100">Step</button>
  <button id="clearVT100">Clear</button>
  <span id="speedVT100" style="font-size:small">Stopped</span>
</div>
