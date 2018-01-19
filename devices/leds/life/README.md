---
layout: page
title: '"Game of Life" Demo'
permalink: /devices/leds/life/
redirect_from:
  - /devices/life/demo/
machines:
  - id: lifeDemo
    type: leds
    name: Game of Life Demo
    config: life.json
styles:
  _lifeDemo:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  _displayLife:
    position: relative;
  _diagsLife:
    float: left;
  _printLife:
    font-family: Monaco,"Lucida Console",monospace;
---

"Game of Life" Demo
-------------------

Using [PCjs Devices](/modules/devices/), here's a simple demo of
[John Conway's](http://www.conwaylife.com/wiki/John_Horton_Conway)
"[Game of Life](http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life)", using an grid of simulated LEDs.
[Red](?color=red&pattern=gliderGun#game-of-life),
[Blue](?color=blue&pattern=gliderGun#game-of-life), or any other LED color can be specified in the URL.

There is also a ["Game of Life" Color Demo](colors/) that allows you to change LED colors.

### Game of Life

{% include machine.html id="lifeDemo" config="json" %}

<div id="lifeDemo">
  <div id="displayLife"></div>
  <button id="runLife">Run</button>
  <button id="stepLife">Step</button>
  <button id="resetLife">Reset</button>
  <button id="clearLife">Clear</button>
  <input type="range" min="1" max="120" value="15" class="slider" id="throttleLife"><span id="speedLife">Stopped</span>
  <select id="patternsLife"><option value="">None</option></select>
  <button id="saveLife">Save to URL</button>
</div>
<div id="diagsLife">
  <div>
    <textarea id="printLife" cols="78" rows="16"></textarea>
  </div>
</div>
