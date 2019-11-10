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
  _lifeDemo:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  _displayLife:
    position: relative;
---

"Game of Life" Demo
-------------------

Using [PCjs Devices](/modules/devices/), here's a simple demo of
[John Conway's](http://www.conwaylife.com/wiki/John_Horton_Conway)
"[Game of Life](http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life)", using a grid of simulated LEDs.
[Red](?color=red&pattern=gliderGun#lifeDemo),
[Blue](?color=blue&pattern=gliderGun#lifeDemo), or any other LED color can be specified in the URL.

There is also a ["Game of Life" Color Demo](colors/) that allows you to change LED colors.

{% include machine.html id="lifeDemo" %}

<div id="lifeDemo" class="pcjsContainer">
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
    <div class="pcjsControl"><select id="patternsLife"><option value="">None</option></select></div>
    <div class="pcjsControl"><button id="saveLife">Save to URL</button></div>
  </div>
</div>
<div class="pcjsDiagnostics">
  <div>
    <div>Diagnostics</div>
    <textarea id="printLife" class="pcjsConsole" cols="128" rows="20" spellcheck="false"></textarea>
  </div>
  <button id="clearLife">Clear</button>
</div>
