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
  .pcjs-controls:
    display: table;
    float: right;
  .pcjs-control:
    display: table-cell;
    padding-left: 8px;
    vertical-align: middle;
  .pcjs-label:
    float: left;
    text-align: right;
  .pcjs-led:
    float: left;
    margin-top: 2px;
    width: 16px;
    height: 16px;
  .pcjs-button:
    display: block;
---

VT100 (New)
-----------

{% include machine.html id="vt100" config="json" %}

<div id="vt100">
  <div class="pcjs-controls">
    <div class="pcjs-control"><div class="pcjs-label">ON LINE</div><div class="pcjs-led" id="ledOnline"></div></div>
    <div class="pcjs-control"><div class="pcjs-label">LOCAL</div><div class="pcjs-led" id="ledLocal"></div></div>
    <div class="pcjs-control"><div class="pcjs-label">LOCKED</div><div class="pcjs-led" id="ledLocked"></div></div>
    <div class="pcjs-control"><div class="pcjs-label">L1</div><div class="pcjs-led" id="led1"></div></div>
    <div class="pcjs-control"><div class="pcjs-label">L2</div><div class="pcjs-led" id="led2"></div></div>
    <div class="pcjs-control"><div class="pcjs-label">L3</div><div class="pcjs-led" id="led3"></div></div>
    <div class="pcjs-control"><div class="pcjs-label">L4</div><div class="pcjs-led" id="led4"></div></div>
    <div class="pcjs-control"><div class="pcjs-label">CAPS</div><div class="pcjs-led" id="ledCaps"></div></div>
    <div class="pcjs-control"><button class="pcjs-button" id="zoomVT100">Full-Screen</button></div>
  </div>
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
