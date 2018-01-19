---
layout: page
title: '"Game of Life" Color Demo'
permalink: /devices/leds/life/colors/
machines:
  - id: lifeColorDemo
    type: leds
    name: Game of Life Color Demo
    config: life.json
styles:
  _lifeColorDemo:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  _displayLife:
    position: relative;
  _colorSwatchLife:
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid;
    border-radius: 50%;
    vertical-align: middle;
    background-color: green;
  _diagsLife:
    float: left;
  _printLife:
    font-family: Monaco,"Lucida Console",monospace;
---

"Game of Life" Color Demo
-------------------------

Using [PCjs Devices](/modules/devices/), here's a simple demo of
[John Conway's](http://www.conwaylife.com/wiki/John_Horton_Conway)
"[Game of Life](http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life)", using an grid of simulated multi-colored LEDs.

### Game of Life

{% include machine.html id="lifeColorDemo" config="json" %}

<div id="lifeColorDemo">
  <div id="displayLife"></div>
  <button id="runLife">Run</button>
  <button id="stepLife">Step</button>
  <button id="resetLife">Reset</button>
  <button id="clearLife">Clear</button>
  <input type="range" min="1" max="120" value="15" class="slider" id="throttleLife"><span id="speedLife">Stopped</span>
  <select id="colorPaletteLife"></select>&nbsp;<select id="colorSelectionLife"></select>&nbsp;<div id="colorSwatchLife"></div>
  <select id="patternsLife"><option value="">None</option></select>
  <button id="saveLife">Save to URL</button>
</div>
<div id="diagsLife">
  <div>
    <textarea id="printLife" cols="78" rows="16"></textarea>
  </div>
</div>
