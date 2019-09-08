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
  .resizeable:
    width: 100%
    height: auto
    background-color: black
  .diagnostics:
    clear: both
  .console:
    font-family: monospace
    width: 100%
---

Space Invaders (New)
--------------------

{% include machine.html id="invaders" config="json" %}

<div id="invaders">
    <div id="invadersScreen" class="resizeable">
    </div>
</div>
<div class="diagnostics">
  <div>
    <p>Diagnostics</p>
    <textarea id="printInvaders" cols="74" rows="16" spellcheck="false"></textarea>
  </div>
  <button id="clearInvaders">Clear</button>
  <button id="resetInvaders">Reset</button>
  <button id="runInvaders">Run</button>
  <button id="stepInvaders">Step</button>
  <span id="speedInvaders">Stopped</span>
</div>
