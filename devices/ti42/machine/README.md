---
layout: page
title: "TI-42 Programmable Calculator (with Original ROM)"
permalink: /devices/ti42/machine/
machines:
  - id: ti42
    type: ti42
    name: TI-42 Programmable Calculator
    config: diags/ti42.json
styles:
  _ti42:
    position: relative;
    display: inline-block;
  _displayTI42:
    position: absolute;
    left: 15%;
    top: 9%;
    width: 70%;
    height: 4%;
  .indTI42:
    font-size: 11px;
    font-family: Monaco,"Lucida Console",monospace;
    color: red;
  _ind2ndTI42:
    position: absolute;
    left: 15%;
    top: 13%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _powerTI42:
    position: absolute;
    left: 69%;
    top: 22%;
    width: 16%;
    height: 4%;
    opacity: 0;
---

TI-42 "MBA" Programmable Calculator (with Original ROM)
-------------------------------------------------------

This is a demonstration of the PCjs [TI-42 Emulator](../) in its simplest form.  It is also available with
[Diagnostics](diags/) enabled.

{% include machine.html id="ti42" config="json" %}

<div id="ti42">
  <img id="imageTI42" src="/devices/ti42/images/TI-42.png" alt="TI-42 Calculator"/>
  <div id="displayTI42"></div>
  <div id="ind2ndTI42" class="indTI42">2nd</div>
  <button id="powerTI42">Power</button>
</div>
