---
layout: page
title: Space Invaders (New)
permalink: /devices/pc8080/machine/invaders/new/
machines:
  - id: invaders
    type: invaders
    name: Space Invaders (NEW)
    config: invaders.json
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
  .pcjsDIP:
    float: left;
    margin-top: 8px;
    margin-bottom: 8px;
  .pcjsDIPSwitch:
    float: left;
    width: 19px;
    height: 19px;
    margin-right: -1px;
    margin-bottom: -1px;
    border: 1px solid black;
    text-align: center;
    line-height: 19px;
    border-color: gray;
  .pcjsDIPSwitchOff:
    color: black;
    background-color: white;
  .pcjsDIPSwitchOn:
    color: white;
    background-color: gray;
---

Space Invaders (New)
--------------------

{% include machine.html id="invaders" config="json" %}

<div id="invaders">
  <button id="zoomInvaders" style="float:right">Full-Screen</button>
  <div id="videoInvaders" class="pcjsVideo"></div>
  <div class="pcjsDIP">
    <div>DIP Switches</div>
    <div id="sw1" class="pcjsDIPSwitch pcjsDIPSwitchOff">1</div>
    <div id="sw2" class="pcjsDIPSwitch pcjsDIPSwitchOff">2</div>
    <div id="sw3" class="pcjsDIPSwitch pcjsDIPSwitchOff">3</div>
    <div id="sw4" class="pcjsDIPSwitch pcjsDIPSwitchOff">4</div>
    <div id="sw5" class="pcjsDIPSwitch pcjsDIPSwitchOff">5</div>
    <div id="sw6" class="pcjsDIPSwitch pcjsDIPSwitchOff">6</div>
    <div id="sw7" class="pcjsDIPSwitch pcjsDIPSwitchOff">7</div>
    <div id="sw8" class="pcjsDIPSwitch pcjsDIPSwitchOff">8</div>
  </div>
</div>
<div class="pcjsDiagnostics">
  <div>
    <div>Diagnostics</div>
    <textarea id="printInvaders" class="pcjsConsole" cols="128" rows="20" spellcheck="false"></textarea>
  </div>
  <button id="powerInvaders">Power</button>
  <button id="resetInvaders">Reset</button>
  <button id="runInvaders">Run</button>
  <button id="stepInvaders">Step</button>
  <button id="clearInvaders">Clear</button>
  <span id="speedInvaders" style="font-size:small">Stopped</span>
</div>
