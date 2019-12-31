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
  .pcjsContainer:
    background-color: slategray;
    border: 1px solid black;
    border-radius: 15px;
    overflow: auto;
    padding: 8px;
  .pcjsTitle:
    font-weight: bold;
  .pcjsControls:
    display: table;
  .pcjsControl:
    display: table-cell;
    padding-right: 8px;
    vertical-align: middle;
  .pcjsDiagnostics:
    clear: both;
  .pcjsConsole:
    font-family: Monaco,"Lucida Console",monospace;
    width: 100%;
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
---

"Game of Life" Color Demo
-------------------------

Using [PCjs Devices](/modules/devices/), here's a simple demo of
[John Conway's](http://www.conwaylife.com/wiki/John_Horton_Conway)
"[Game of Life](http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life)", using a grid of simulated multi-colored LEDs.

{% include machine.html id="lifeColorDemo" %}

<div id="lifeColorDemo" class="pcjsContainer">
  <div id="game-of-life" class="pcjsTitle">Game of Life</div>
  <div id="displayLife"></div>
  <div class="pcjsControls">
    <div class="pcjsControl"><button id="runLife">Run</button></div>
    <div class="pcjsControl"><button id="stepLife">Step</button></div>
    <div class="pcjsControl"><button id="resetLife">Reset</button></div>
    <div class="pcjsControl"><input type="range" min="1" max="120" value="15" class="slider" id="throttleLife"></div>
    <div class="pcjsControl"><span id="speedLife" style="font-size:small">Stopped</span></div>
  </div>
  <div class="pcjsControls">
    <div class="pcjsControl"><select id="colorPaletteLife"></select></div>
    <div class="pcjsControl"><select id="colorSelectionLife"></select></div>
    <div class="pcjsControl"><div id="colorSwatchLife"></div></div>
    <div class="pcjsControl"><select id="patternsLife"><option value="">None</option></select></div>
    <div class="pcjsControl"><button id="saveLife">Save to URL</button></div>
  </div>
</div>
<div class="pcjsDiagnostics">
  <div>
    <div>Diagnostics</div>
    <textarea id="printLife" class="pcjsConsole" cols="128" rows="20"></textarea>
  </div>
  <button id="clearLife">Clear</button>
</div>
