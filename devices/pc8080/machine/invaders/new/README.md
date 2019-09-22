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
---

Space Invaders (New)
--------------------

{% include machine.html id="invaders" config="json" %}

<div id="invaders">
    <button id="zoomInvaders" style="float:left">Full-Screen</button>
    <div id="videoInvaders" class="pcjs-video">
    </div>
</div>
<div class="pcjs-diagnostics">
  <div>
    <p>Diagnostics</p>
    <textarea id="printInvaders" class="pcjs-console" cols="128" rows="20" spellcheck="false"></textarea>
  </div>
  <button id="clearInvaders">Clear</button>
  <button id="resetInvaders">Reset</button>
  <button id="runInvaders">Run</button>
  <button id="stepInvaders">Step</button>
  <span id="speedInvaders">Stopped</span>
</div>
