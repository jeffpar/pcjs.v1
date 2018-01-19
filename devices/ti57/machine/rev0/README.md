---
layout: page
title: "TI-57 Programmable Calculator (with Original ROM and Diagnostics)"
permalink: /devices/ti57/machine/rev0/
machines:
  - id: ti57
    type: ti57
    name: TI-57 Programmable Calculator
    config: ti57.json
styles:
  _ti57:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
  _displayTI57:
    position: absolute;
    left: 16%;
    top: 7%;
    width: 70%;
    height: 4%;
  .indTI57:
    font-size: 11px;
    font-family: Monaco,"Lucida Console",monospace;
    color: red;
  _ind2nd:
    position: absolute;
    left: 17%;
    top: 12%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indINV:
    position: absolute;
    left: 25%;
    top: 12%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indDeg:
    position: absolute;
    left: 33%;
    top: 12%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indRad:
    position: absolute;
    left: 41%;
    top: 12%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indGrad:
    position: absolute;
    left: 49%;
    top: 12%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _powerTI57:
    position: absolute;
    left: 70%;
    top: 20%;
    width: 16%;
    height: 5%;
    opacity: 0;
  .diagsTI57:
    float: left;
  _printTI57:
    font-family: Monaco,"Lucida Console",monospace;
  _romArrayTI57:
    display: inline-block;
    max-width: 512px;
  _romCellTI57:
    font-family: Monaco,"Lucida Console",monospace;
  .regRow:
    padding-left: 1em;
    font-family: Monaco,"Lucida Console",monospace;
  .regLabel:
    padding-left: 1em;
  .regDigit:
    border: 1px solid;
---

TI-57 Programmable Calculator (with Original ROM and Diagnostics)
-----------------------------------------------------------------

Our TI-57 emulator below is one of the most faithful TI-57 emulations currently available.  It should run at
roughly the same speed as an original device.  That includes calculation speed, display speed, and pause delays.

It is also using an exact copy of an original [TI-57 ROM](/devices/ti57/rom/); no instructions have been patched.
A configuration using a [Revised ROM](../rev1/) is also available.

Special attention has been made to the display as well.  The shape of the digits were taken directly from TI patent
drawings, and the digits are drawn/erased with the same frequency as a real device, so when the display goes blank for
brief periods, you know that a lengthy calculation is being performed.  A few minor display enhancements have been
enabled, since they don't affect the overall authenticity of the simulation, such as
<span class="indTI57">2nd</span>,
<span class="indTI57">INV</span>,
<span class="indTI57">Deg</span>,
<span class="indTI57">Rad</span>, and
<span class="indTI57">Grad</span> indicators.

The TI-57 emulator is also the first PCjs machine to use our newer (late 2017) [PCjs Device Classes](/modules/devices/),
so it requires a modern web browser.  We'll probably add an ES5 fall-back mechanism eventually, but for now, make sure
you're using the latest version of Chrome, Firefox, Safari, Edge, etc.

If any errors occur during operation, the Diagnostics window should display the last instruction decoded.
The window also accepts a few debugging commands.  Use '?' for help.

{% include machine.html id="ti57" config="json" %}

<div id="ti57">
  <img id="imageTI57" src="/devices/ti57/images/TI-57.png" alt="TI-57 Calculator"/>
  <div id="displayTI57"></div>
  <div id="ind2nd" class="indTI57">2nd</div>
  <div id="indINV" class="indTI57">INV</div>
  <div id="indDeg" class="indTI57">Deg</div>
  <div id="indRad" class="indTI57">Rad</div>
  <div id="indGrad" class="indTI57">Grad</div>
  <button id="powerTI57">Power</button>
</div>
<div class="diagsTI57">
  <div>
    <p>Diagnostics</p>
    <textarea id="printTI57" cols="74" rows="16"></textarea>
  </div>
  <button id="runTI57">Run</button>
  <button id="stepTI57">Step</button><span id="speedTI57">Stopped</span>
  <button id="resetTI57">Reset</button>
  <button id="clearTI57">Clear</button>
  <p>ROM Activity</p>
  <div id="romArrayTI57"></div>
  <p id="romCellTI57">[No ROM address selected]</p>
  <p>Operational Registers</p>
  <div>
  	<div class="regRow">
  	  <span class="regLabel">A</span>
  	  <span class="regDigit" id="regA-15">0</span>
  	  <span class="regDigit" id="regA-14">0</span>
  	  <span class="regDigit" id="regA-13">0</span>
  	  <span class="regDigit" id="regA-12">0</span>
  	  <span class="regDigit" id="regA-11">0</span>
  	  <span class="regDigit" id="regA-10">0</span>
  	  <span class="regDigit" id="regA-09">0</span>
  	  <span class="regDigit" id="regA-08">0</span>
  	  <span class="regDigit" id="regA-07">0</span>
  	  <span class="regDigit" id="regA-06">0</span>
  	  <span class="regDigit" id="regA-05">0</span>
  	  <span class="regDigit" id="regA-04">0</span>
  	  <span class="regDigit" id="regA-03">0</span>
  	  <span class="regDigit" id="regA-02">0</span>
  	  <span class="regDigit" id="regA-01">0</span>
  	  <span class="regDigit" id="regA-00">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">B</span>
  	  <span class="regDigit" id="regB-15">0</span>
  	  <span class="regDigit" id="regB-14">0</span>
  	  <span class="regDigit" id="regB-13">0</span>
  	  <span class="regDigit" id="regB-12">0</span>
  	  <span class="regDigit" id="regB-11">0</span>
  	  <span class="regDigit" id="regB-10">0</span>
  	  <span class="regDigit" id="regB-09">0</span>
  	  <span class="regDigit" id="regB-08">0</span>
  	  <span class="regDigit" id="regB-07">0</span>
  	  <span class="regDigit" id="regB-06">0</span>
  	  <span class="regDigit" id="regB-05">0</span>
  	  <span class="regDigit" id="regB-04">0</span>
  	  <span class="regDigit" id="regB-03">0</span>
  	  <span class="regDigit" id="regB-02">0</span>
  	  <span class="regDigit" id="regB-01">0</span>
  	  <span class="regDigit" id="regB-00">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">C</span>
  	  <span class="regDigit" id="regC-15">0</span>
  	  <span class="regDigit" id="regC-14">0</span>
  	  <span class="regDigit" id="regC-13">0</span>
  	  <span class="regDigit" id="regC-12">0</span>
  	  <span class="regDigit" id="regC-11">0</span>
  	  <span class="regDigit" id="regC-10">0</span>
  	  <span class="regDigit" id="regC-09">0</span>
  	  <span class="regDigit" id="regC-08">0</span>
  	  <span class="regDigit" id="regC-07">0</span>
  	  <span class="regDigit" id="regC-06">0</span>
  	  <span class="regDigit" id="regC-05">0</span>
  	  <span class="regDigit" id="regC-04">0</span>
  	  <span class="regDigit" id="regC-03">0</span>
  	  <span class="regDigit" id="regC-02">0</span>
  	  <span class="regDigit" id="regC-01">0</span>
  	  <span class="regDigit" id="regC-00">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">D</span>
  	  <span class="regDigit" id="regD-15">0</span>
  	  <span class="regDigit" id="regD-14">0</span>
  	  <span class="regDigit" id="regD-13">0</span>
  	  <span class="regDigit" id="regD-12">0</span>
  	  <span class="regDigit" id="regD-11">0</span>
  	  <span class="regDigit" id="regD-10">0</span>
  	  <span class="regDigit" id="regD-09">0</span>
  	  <span class="regDigit" id="regD-08">0</span>
  	  <span class="regDigit" id="regD-07">0</span>
  	  <span class="regDigit" id="regD-06">0</span>
  	  <span class="regDigit" id="regD-05">0</span>
  	  <span class="regDigit" id="regD-04">0</span>
  	  <span class="regDigit" id="regD-03">0</span>
  	  <span class="regDigit" id="regD-02">0</span>
  	  <span class="regDigit" id="regD-01">0</span>
  	  <span class="regDigit" id="regD-00">0</span>
  	</div>
  </div>
  <p>Storage Registers</p>
  <div>
  	<div class="regRow">
  	  <span class="regLabel">X0</span>
  	  <span class="regDigit" id="regX0-15" data-value="(0">0</span>
  	  <span class="regDigit" id="regX0-14" data-value="O0">0</span>
  	  <span class="regDigit" id="regX0-13" data-value="A0 N">0</span>
  	  <span class="regDigit" id="regX0-12" data-value="A0 M">0</span>
  	  <span class="regDigit" id="regX0-11" data-value="A0 M">0</span>
  	  <span class="regDigit" id="regX0-10" data-value="A0 M">0</span>
  	  <span class="regDigit" id="regX0-09" data-value="A0 M">0</span>
  	  <span class="regDigit" id="regX0-08" data-value="A0 M">0</span>
  	  <span class="regDigit" id="regX0-07" data-value="A0 M">0</span>
  	  <span class="regDigit" id="regX0-06" data-value="A0 M">0</span>
  	  <span class="regDigit" id="regX0-05" data-value="A0 M">0</span>
  	  <span class="regDigit" id="regX0-04" data-value="A0 M">0</span>
  	  <span class="regDigit" id="regX0-03" data-value="A0 M">0</span>
  	  <span class="regDigit" id="regX0-02" data-value="A0 M">0</span>
  	  <span class="regDigit" id="regX0-01" data-value="A0 E">0</span>
  	  <span class="regDigit" id="regX0-00" data-value="A0 E">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">X1</span>
  	  <span class="regDigit" id="regX1-15" data-value="(1">0</span>
  	  <span class="regDigit" id="regX1-14" data-value="O1">0</span>
  	  <span class="regDigit" id="regX1-13" data-value="A1 N">0</span>
  	  <span class="regDigit" id="regX1-12" data-value="A1 M">0</span>
  	  <span class="regDigit" id="regX1-11" data-value="A1 M">0</span>
  	  <span class="regDigit" id="regX1-10" data-value="A1 M">0</span>
  	  <span class="regDigit" id="regX1-09" data-value="A1 M">0</span>
  	  <span class="regDigit" id="regX1-08" data-value="A1 M">0</span>
  	  <span class="regDigit" id="regX1-07" data-value="A1 M">0</span>
  	  <span class="regDigit" id="regX1-06" data-value="A1 M">0</span>
  	  <span class="regDigit" id="regX1-05" data-value="A1 M">0</span>
  	  <span class="regDigit" id="regX1-04" data-value="A1 M">0</span>
  	  <span class="regDigit" id="regX1-03" data-value="A1 M">0</span>
  	  <span class="regDigit" id="regX1-02" data-value="A1 M">0</span>
  	  <span class="regDigit" id="regX1-01" data-value="A1 E">0</span>
  	  <span class="regDigit" id="regX1-00" data-value="A1 E">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">X2</span>
  	  <span class="regDigit" id="regX2-15" data-value="(2">0</span>
  	  <span class="regDigit" id="regX2-14" data-value="O2">0</span>
  	  <span class="regDigit" id="regX2-13" data-value="R6 N">0</span>
  	  <span class="regDigit" id="regX2-12" data-value="R6 M">0</span>
  	  <span class="regDigit" id="regX2-11" data-value="R6 M">0</span>
  	  <span class="regDigit" id="regX2-10" data-value="R6 M">0</span>
  	  <span class="regDigit" id="regX2-09" data-value="R6 M">0</span>
  	  <span class="regDigit" id="regX2-08" data-value="R6 M">0</span>
  	  <span class="regDigit" id="regX2-07" data-value="R6 M">0</span>
  	  <span class="regDigit" id="regX2-06" data-value="R6 M">0</span>
  	  <span class="regDigit" id="regX2-05" data-value="R6 M">0</span>
  	  <span class="regDigit" id="regX2-04" data-value="R6 M">0</span>
  	  <span class="regDigit" id="regX2-03" data-value="R6 M">0</span>
  	  <span class="regDigit" id="regX2-02" data-value="R6 M">0</span>
  	  <span class="regDigit" id="regX2-01" data-value="R6 E">0</span>
  	  <span class="regDigit" id="regX2-00" data-value="R6 E">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">X3</span>
  	  <span class="regDigit" id="regX3-15" data-value="(3">0</span>
  	  <span class="regDigit" id="regX3-14" data-value="O3">0</span>
  	  <span class="regDigit" id="regX3-13" data-value="R5 N">0</span>
  	  <span class="regDigit" id="regX3-12" data-value="R5 M">0</span>
  	  <span class="regDigit" id="regX3-11" data-value="R5 M">0</span>
  	  <span class="regDigit" id="regX3-10" data-value="R5 M">0</span>
  	  <span class="regDigit" id="regX3-09" data-value="R5 M">0</span>
  	  <span class="regDigit" id="regX3-08" data-value="R5 M">0</span>
  	  <span class="regDigit" id="regX3-07" data-value="R5 M">0</span>
  	  <span class="regDigit" id="regX3-06" data-value="R5 M">0</span>
  	  <span class="regDigit" id="regX3-05" data-value="R5 M">0</span>
  	  <span class="regDigit" id="regX3-04" data-value="R5 M">0</span>
  	  <span class="regDigit" id="regX3-03" data-value="R5 M">0</span>
  	  <span class="regDigit" id="regX3-02" data-value="R5 M">0</span>
  	  <span class="regDigit" id="regX3-01" data-value="R5 E">0</span>
  	  <span class="regDigit" id="regX3-00" data-value="R5 E">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">X4</span>
  	  <span class="regDigit" id="regX4-15" data-value="SC">0</span>
  	  <span class="regDigit" id="regX4-14" data-value="?">0</span>
  	  <span class="regDigit" id="regX4-13" data-value="R7 N">0</span>
  	  <span class="regDigit" id="regX4-12" data-value="R7 M">0</span>
  	  <span class="regDigit" id="regX4-11" data-value="R7 M">0</span>
  	  <span class="regDigit" id="regX4-10" data-value="R7 M">0</span>
  	  <span class="regDigit" id="regX4-09" data-value="R7 M">0</span>
  	  <span class="regDigit" id="regX4-08" data-value="R7 M">0</span>
  	  <span class="regDigit" id="regX4-07" data-value="R7 M">0</span>
  	  <span class="regDigit" id="regX4-06" data-value="R7 M">0</span>
  	  <span class="regDigit" id="regX4-05" data-value="R7 M">0</span>
  	  <span class="regDigit" id="regX4-04" data-value="R7 M">0</span>
  	  <span class="regDigit" id="regX4-03" data-value="R7 M">0</span>
  	  <span class="regDigit" id="regX4-02" data-value="R7 M">0</span>
  	  <span class="regDigit" id="regX4-01" data-value="R7 E">0</span>
  	  <span class="regDigit" id="regX4-00" data-value="R7 E">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">X5</span>
  	  <span class="regDigit" id="regX5-15" data-value="PC H">0</span>
  	  <span class="regDigit" id="regX5-14" data-value="PC L">0</span>
  	  <span class="regDigit" id="regX5-13" data-value="R0 N">0</span>
  	  <span class="regDigit" id="regX5-12" data-value="R0 M">0</span>
  	  <span class="regDigit" id="regX5-11" data-value="R0 M">0</span>
  	  <span class="regDigit" id="regX5-10" data-value="R0 M">0</span>
  	  <span class="regDigit" id="regX5-09" data-value="R0 M">0</span>
  	  <span class="regDigit" id="regX5-08" data-value="R0 M">0</span>
  	  <span class="regDigit" id="regX5-07" data-value="R0 M">0</span>
  	  <span class="regDigit" id="regX5-06" data-value="R0 M">0</span>
  	  <span class="regDigit" id="regX5-05" data-value="R0 M">0</span>
  	  <span class="regDigit" id="regX5-04" data-value="R0 M">0</span>
  	  <span class="regDigit" id="regX5-03" data-value="R0 M">0</span>
  	  <span class="regDigit" id="regX5-02" data-value="R0 M">0</span>
  	  <span class="regDigit" id="regX5-01" data-value="R0 E">0</span>
  	  <span class="regDigit" id="regX5-00" data-value="R0 E">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">X6</span>
  	  <span class="regDigit" id="regX6-15" data-value="S1 H">0</span>
  	  <span class="regDigit" id="regX6-14" data-value="S1 L">0</span>
  	  <span class="regDigit" id="regX6-13" data-value="R1 N">0</span>
  	  <span class="regDigit" id="regX6-12" data-value="R1 M">0</span>
  	  <span class="regDigit" id="regX6-11" data-value="R1 M">0</span>
  	  <span class="regDigit" id="regX6-10" data-value="R1 M">0</span>
  	  <span class="regDigit" id="regX6-09" data-value="R1 M">0</span>
  	  <span class="regDigit" id="regX6-08" data-value="R1 M">0</span>
  	  <span class="regDigit" id="regX6-07" data-value="R1 M">0</span>
  	  <span class="regDigit" id="regX6-06" data-value="R1 M">0</span>
  	  <span class="regDigit" id="regX6-05" data-value="R1 M">0</span>
  	  <span class="regDigit" id="regX6-04" data-value="R1 M">0</span>
  	  <span class="regDigit" id="regX6-03" data-value="R1 M">0</span>
  	  <span class="regDigit" id="regX6-02" data-value="R1 M">0</span>
  	  <span class="regDigit" id="regX6-01" data-value="R1 E">0</span>
  	  <span class="regDigit" id="regX6-00" data-value="R1 E">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">X7</span>
  	  <span class="regDigit" id="regX7-15" data-value="S2 H">0</span>
  	  <span class="regDigit" id="regX7-14" data-value="S2 L">0</span>
  	  <span class="regDigit" id="regX7-13" data-value="R2 N">0</span>
  	  <span class="regDigit" id="regX7-12" data-value="R2 M">0</span>
  	  <span class="regDigit" id="regX7-11" data-value="R2 M">0</span>
  	  <span class="regDigit" id="regX7-10" data-value="R2 M">0</span>
  	  <span class="regDigit" id="regX7-09" data-value="R2 M">0</span>
  	  <span class="regDigit" id="regX7-08" data-value="R2 M">0</span>
  	  <span class="regDigit" id="regX7-07" data-value="R2 M">0</span>
  	  <span class="regDigit" id="regX7-06" data-value="R2 M">0</span>
  	  <span class="regDigit" id="regX7-05" data-value="R2 M">0</span>
  	  <span class="regDigit" id="regX7-04" data-value="R2 M">0</span>
  	  <span class="regDigit" id="regX7-03" data-value="R2 M">0</span>
  	  <span class="regDigit" id="regX7-02" data-value="R2 M">0</span>
  	  <span class="regDigit" id="regX7-01" data-value="R2 E">0</span>
  	  <span class="regDigit" id="regX7-00" data-value="R2 E">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">Y0</span>
  	  <span class="regDigit" id="regY0-15" data-value="P00 H">0</span>
  	  <span class="regDigit" id="regY0-14" data-value="P00 L">0</span>
  	  <span class="regDigit" id="regY0-13" data-value="P01 H">0</span>
  	  <span class="regDigit" id="regY0-12" data-value="P01 L">0</span>
  	  <span class="regDigit" id="regY0-11" data-value="P02 H">0</span>
  	  <span class="regDigit" id="regY0-10" data-value="P02 L">0</span>
  	  <span class="regDigit" id="regY0-09" data-value="P03 H">0</span>
  	  <span class="regDigit" id="regY0-08" data-value="P03 L">0</span>
  	  <span class="regDigit" id="regY0-07" data-value="P04 H">0</span>
  	  <span class="regDigit" id="regY0-06" data-value="P04 L">0</span>
  	  <span class="regDigit" id="regY0-05" data-value="P05 H">0</span>
  	  <span class="regDigit" id="regY0-04" data-value="P05 L">0</span>
  	  <span class="regDigit" id="regY0-03" data-value="P06 H">0</span>
  	  <span class="regDigit" id="regY0-02" data-value="P06 L">0</span>
  	  <span class="regDigit" id="regY0-01" data-value="P07 H">0</span>
  	  <span class="regDigit" id="regY0-00" data-value="P07 L">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">Y1</span>
  	  <span class="regDigit" id="regY1-15" data-value="P08 H">0</span>
  	  <span class="regDigit" id="regY1-14" data-value="P08 L">0</span>
  	  <span class="regDigit" id="regY1-13" data-value="P09 H">0</span>
  	  <span class="regDigit" id="regY1-12" data-value="P09 L">0</span>
  	  <span class="regDigit" id="regY1-11" data-value="P10 H">0</span>
  	  <span class="regDigit" id="regY1-10" data-value="P10 L">0</span>
  	  <span class="regDigit" id="regY1-09" data-value="P11 H">0</span>
  	  <span class="regDigit" id="regY1-08" data-value="P11 L">0</span>
  	  <span class="regDigit" id="regY1-07" data-value="P12 H">0</span>
  	  <span class="regDigit" id="regY1-06" data-value="P12 L">0</span>
  	  <span class="regDigit" id="regY1-05" data-value="P13 H">0</span>
  	  <span class="regDigit" id="regY1-04" data-value="P13 L">0</span>
  	  <span class="regDigit" id="regY1-03" data-value="P14 H">0</span>
  	  <span class="regDigit" id="regY1-02" data-value="P14 L">0</span>
  	  <span class="regDigit" id="regY1-01" data-value="P15 H">0</span>
  	  <span class="regDigit" id="regY1-00" data-value="P15 L">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">Y2</span>
  	  <span class="regDigit" id="regY2-15" data-value="P16 H">0</span>
  	  <span class="regDigit" id="regY2-14" data-value="P16 L">0</span>
  	  <span class="regDigit" id="regY2-13" data-value="P17 H">0</span>
  	  <span class="regDigit" id="regY2-12" data-value="P17 L">0</span>
  	  <span class="regDigit" id="regY2-11" data-value="P18 H">0</span>
  	  <span class="regDigit" id="regY2-10" data-value="P18 L">0</span>
  	  <span class="regDigit" id="regY2-09" data-value="P19 H">0</span>
  	  <span class="regDigit" id="regY2-08" data-value="P19 L">0</span>
  	  <span class="regDigit" id="regY2-07" data-value="P20 H">0</span>
  	  <span class="regDigit" id="regY2-06" data-value="P20 L">0</span>
  	  <span class="regDigit" id="regY2-05" data-value="P21 H">0</span>
  	  <span class="regDigit" id="regY2-04" data-value="P21 L">0</span>
  	  <span class="regDigit" id="regY2-03" data-value="P22 H">0</span>
  	  <span class="regDigit" id="regY2-02" data-value="P22 L">0</span>
  	  <span class="regDigit" id="regY2-01" data-value="P23 H">0</span>
  	  <span class="regDigit" id="regY2-00" data-value="P23 L">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">Y3</span>
  	  <span class="regDigit" id="regY3-15" data-value="P24 H">0</span>
  	  <span class="regDigit" id="regY3-14" data-value="P24 L">0</span>
  	  <span class="regDigit" id="regY3-13" data-value="P25 H">0</span>
  	  <span class="regDigit" id="regY3-12" data-value="P25 L">0</span>
  	  <span class="regDigit" id="regY3-11" data-value="P26 H">0</span>
  	  <span class="regDigit" id="regY3-10" data-value="P26 L">0</span>
  	  <span class="regDigit" id="regY3-09" data-value="P27 H">0</span>
  	  <span class="regDigit" id="regY3-08" data-value="P27 L">0</span>
  	  <span class="regDigit" id="regY3-07" data-value="P28 H">0</span>
  	  <span class="regDigit" id="regY3-06" data-value="P28 L">0</span>
  	  <span class="regDigit" id="regY3-05" data-value="P29 H">0</span>
  	  <span class="regDigit" id="regY3-04" data-value="P29 L">0</span>
  	  <span class="regDigit" id="regY3-03" data-value="P30 H">0</span>
  	  <span class="regDigit" id="regY3-02" data-value="P30 L">0</span>
  	  <span class="regDigit" id="regY3-01" data-value="P31 H">0</span>
  	  <span class="regDigit" id="regY3-00" data-value="P31 L">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">Y4</span>
  	  <span class="regDigit" id="regY4-15" data-value="P32 H">0</span>
  	  <span class="regDigit" id="regY4-14" data-value="P32 L">0</span>
  	  <span class="regDigit" id="regY4-13" data-value="P33 H">0</span>
  	  <span class="regDigit" id="regY4-12" data-value="P33 L">0</span>
  	  <span class="regDigit" id="regY4-11" data-value="P34 H">0</span>
  	  <span class="regDigit" id="regY4-10" data-value="P34 L">0</span>
  	  <span class="regDigit" id="regY4-09" data-value="P35 H">0</span>
  	  <span class="regDigit" id="regY4-08" data-value="P35 L">0</span>
  	  <span class="regDigit" id="regY4-07" data-value="P36 H">0</span>
  	  <span class="regDigit" id="regY4-06" data-value="P36 L">0</span>
  	  <span class="regDigit" id="regY4-05" data-value="P37 H">0</span>
  	  <span class="regDigit" id="regY4-04" data-value="P37 L">0</span>
  	  <span class="regDigit" id="regY4-03" data-value="P38 H">0</span>
  	  <span class="regDigit" id="regY4-02" data-value="P38 L">0</span>
  	  <span class="regDigit" id="regY4-01" data-value="P39 H">0</span>
  	  <span class="regDigit" id="regY4-00" data-value="P39 L">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">Y5</span>
  	  <span class="regDigit" id="regY5-15" data-value="P40 H">0</span>
  	  <span class="regDigit" id="regY5-14" data-value="P40 L">0</span>
  	  <span class="regDigit" id="regY5-13" data-value="P41 H">0</span>
  	  <span class="regDigit" id="regY5-12" data-value="P41 L">0</span>
  	  <span class="regDigit" id="regY5-11" data-value="P42 H">0</span>
  	  <span class="regDigit" id="regY5-10" data-value="P42 L">0</span>
  	  <span class="regDigit" id="regY5-09" data-value="P43 H">0</span>
  	  <span class="regDigit" id="regY5-08" data-value="P43 L">0</span>
  	  <span class="regDigit" id="regY5-07" data-value="P44 H">0</span>
  	  <span class="regDigit" id="regY5-06" data-value="P44 L">0</span>
  	  <span class="regDigit" id="regY5-05" data-value="P45 H">0</span>
  	  <span class="regDigit" id="regY5-04" data-value="P45 L">0</span>
  	  <span class="regDigit" id="regY5-03" data-value="P46 H">0</span>
  	  <span class="regDigit" id="regY5-02" data-value="P46 L">0</span>
  	  <span class="regDigit" id="regY5-01" data-value="P47 H">0</span>
  	  <span class="regDigit" id="regY5-00" data-value="P47 L">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">Y6</span>
  	  <span class="regDigit" id="regY6-15" data-value="P48 H">0</span>
  	  <span class="regDigit" id="regY6-14" data-value="P48 L">0</span>
  	  <span class="regDigit" id="regY6-13" data-value="R3 N">0</span>
  	  <span class="regDigit" id="regY6-12" data-value="R3 M">0</span>
  	  <span class="regDigit" id="regY6-11" data-value="R3 M">0</span>
  	  <span class="regDigit" id="regY6-10" data-value="R3 M">0</span>
  	  <span class="regDigit" id="regY6-09" data-value="R3 M">0</span>
  	  <span class="regDigit" id="regY6-08" data-value="R3 M">0</span>
  	  <span class="regDigit" id="regY6-07" data-value="R3 M">0</span>
  	  <span class="regDigit" id="regY6-06" data-value="R3 M">0</span>
  	  <span class="regDigit" id="regY6-05" data-value="R3 M">0</span>
  	  <span class="regDigit" id="regY6-04" data-value="R3 M">0</span>
  	  <span class="regDigit" id="regY6-03" data-value="R3 M">0</span>
  	  <span class="regDigit" id="regY6-02" data-value="R3 M">0</span>
  	  <span class="regDigit" id="regY6-01" data-value="R3 E">0</span>
  	  <span class="regDigit" id="regY6-00" data-value="R3 E">0</span>
  	</div>
  	<div class="regRow">
  	  <span class="regLabel">Y7</span>
  	  <span class="regDigit" id="regY7-15" data-value="P49 H">0</span>
  	  <span class="regDigit" id="regY7-14" data-value="P49 L">0</span>
  	  <span class="regDigit" id="regY7-13" data-value="R4 N">0</span>
  	  <span class="regDigit" id="regY7-12" data-value="R4 M">0</span>
  	  <span class="regDigit" id="regY7-11" data-value="R4 M">0</span>
  	  <span class="regDigit" id="regY7-10" data-value="R4 M">0</span>
  	  <span class="regDigit" id="regY7-09" data-value="R4 M">0</span>
  	  <span class="regDigit" id="regY7-08" data-value="R4 M">0</span>
  	  <span class="regDigit" id="regY7-07" data-value="R4 M">0</span>
  	  <span class="regDigit" id="regY7-06" data-value="R4 M">0</span>
  	  <span class="regDigit" id="regY7-05" data-value="R4 M">0</span>
  	  <span class="regDigit" id="regY7-04" data-value="R4 M">0</span>
  	  <span class="regDigit" id="regY7-03" data-value="R4 M">0</span>
  	  <span class="regDigit" id="regY7-02" data-value="R4 M">0</span>
  	  <span class="regDigit" id="regY7-01" data-value="R4 E">0</span>
  	  <span class="regDigit" id="regY7-00" data-value="R4 E">0</span>
  	</div>
  </div>
</div>
