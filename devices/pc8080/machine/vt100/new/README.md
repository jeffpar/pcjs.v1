---
layout: page
title: VT100 (New)
permalink: /devices/pc8080/machine/vt100/new/
machines:
  - id: vt100
    type: vt100
    name: VT100 (New)
    commands: m addr on;m ports on;m chips on;m kbd on;m serial on;m misc on
    config: vt100.json
    connection: serialPort->ibm5170.com2
  - id: ibm5170
    type: pcx86
    debugger: true
    autoStart: true
    connection: com2->vt100.serialPort
    config: /devices/pcx86/machine/5170/ega/2048kb/rev3/debugger/vt100/machine.xml
styles:
  .pcjsVideo:
    width: 100%;
    height: auto;
    background-color: black;
    position: relative;
    clear: both;
  .pcjsMonitor:
    width: 100%;
    height: auto;
  .pcjsOverlay:
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  .pcjsDiagnostics:
    clear: both;
  .pcjsConsole:
    font-family: monospace;
    width: 100%;
  .pcjsControls:
    display: table;
    float: right;
  .pcjsControl:
    display: table-cell;
    padding-left: 8px;
    vertical-align: middle;
  .pcjsLabel:
    float: left;
    text-align: right;
  .pcjsLED:
    float: left;
    margin-top: 2px;
    width: 16px;
    height: 16px;
  .pcjsButton:
    display: block;
---

VT100 (New)
-----------

{% include machine.html id="vt100" %}

<div id="vt100">
  <div class="pcjsControls">
    <div class="pcjsControl"><div class="pcjsLabel">ON LINE</div><div class="pcjsLED" id="ledOnline"></div></div>
    <div class="pcjsControl"><div class="pcjsLabel">LOCAL</div><div class="pcjsLED" id="ledLocal"></div></div>
    <div class="pcjsControl"><div class="pcjsLabel">LOCKED</div><div class="pcjsLED" id="ledLocked"></div></div>
    <div class="pcjsControl"><div class="pcjsLabel">L1</div><div class="pcjsLED" id="led1"></div></div>
    <div class="pcjsControl"><div class="pcjsLabel">L2</div><div class="pcjsLED" id="led2"></div></div>
    <div class="pcjsControl"><div class="pcjsLabel">L3</div><div class="pcjsLED" id="led3"></div></div>
    <div class="pcjsControl"><div class="pcjsLabel">L4</div><div class="pcjsLED" id="led4"></div></div>
    <div class="pcjsControl"><div class="pcjsLabel">CAPS</div><div class="pcjsLED" id="ledCaps"></div></div>
    <div class="pcjsControl"><button class="pcjsButton" id="zoomVT100">Full-Screen</button></div>
  </div>
  <div id="videoVT100" class="pcjsVideo"></div>
</div>
<div class="pcjsDiagnostics">
  <div>
    <div>Diagnostics</div>
    <textarea id="printVT100" class="pcjsConsole" cols="128" rows="20" spellcheck="false"></textarea>
  </div>
  <button id="powerVT100">Power</button>
  <button id="resetVT100">Reset</button>
  <button id="runVT100">Run</button>
  <button id="stepVT100">Step</button>
  <button id="clearVT100">Clear</button>
  <span id="speedVT100" style="font-size:small">Stopped</span>
</div>
