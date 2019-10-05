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
  .pcjs-dip:
    float: left;
    margin-top: 8px;
    margin-bottom: 8px;
  .pcjs-dipswitch:
    float: left;
    width: 19px;
    height: 19px;
    margin-right: -1px;
    margin-bottom: -1px;
    border: 1px solid black;
    text-align: center;
    line-height: 19px;
  .pcjs-dipswitch-off:
    color: black;
    background-color: white;
  .pcjs-dipswitch-on:
    color: white;
    background-color: black;
---

Space Invaders (New)
--------------------

{% include machine.html id="invaders" config="json" %}

<div id="invaders">
  <button id="zoomInvaders" style="float:right">Full-Screen</button>
  <div id="videoInvaders" class="pcjs-video"></div>
  <div class="pcjs-dip">
    <div>DIP Switches</div>
    <div id="sw1" class="pcjs-dipswitch pcjs-dipswitch-off">1</div>
    <div id="sw2" class="pcjs-dipswitch pcjs-dipswitch-off">2</div>
    <div id="sw3" class="pcjs-dipswitch pcjs-dipswitch-off">3</div>
    <div id="sw4" class="pcjs-dipswitch pcjs-dipswitch-off">4</div>
    <div id="sw5" class="pcjs-dipswitch pcjs-dipswitch-off">5</div>
    <div id="sw6" class="pcjs-dipswitch pcjs-dipswitch-off">6</div>
    <div id="sw7" class="pcjs-dipswitch pcjs-dipswitch-off">7</div>
    <div id="sw8" class="pcjs-dipswitch pcjs-dipswitch-off">8</div>
  </div>
</div>
<div class="pcjs-diagnostics">
  <div>
    <div>Diagnostics</div>
    <textarea id="printInvaders" class="pcjs-console" cols="128" rows="20" spellcheck="false"></textarea>
  </div>
  <button id="powerInvaders">Power</button>
  <button id="resetInvaders">Reset</button>
  <button id="runInvaders">Run</button>
  <button id="stepInvaders">Step</button>
  <button id="clearInvaders">Clear</button>
  <span id="speedInvaders" style="font-size:small">Stopped</span>
</div>
