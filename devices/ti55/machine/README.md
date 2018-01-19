---
layout: page
title: "TI-55 Programmable Calculator (with Original ROM)"
permalink: /devices/ti55/machine/
machines:
  - id: ti55
    type: ti55
    name: TI-55 Programmable Calculator
    config: diags/ti55.json
styles:
  _ti55:
    position: relative;
    display: inline-block;
  _displayTI55:
    position: absolute;
    left: 15%;
    top: 8%;
    width: 70%;
    height: 4%;
  .indTI55:
    font-size: 11px;
    font-family: Monaco,"Lucida Console",monospace;
    color: red;
  _ind2nd:
    position: absolute;
    left: 15%;
    top: 13%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indINV:
    position: absolute;
    left: 23%;
    top: 13%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indDeg:
    position: absolute;
    left: 31%;
    top: 13%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indRad:
    position: absolute;
    left: 39%;
    top: 13%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indGrad:
    position: absolute;
    left: 47%;
    top: 13%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _powerTI55:
    position: absolute;
    left: 69%;
    top: 22%;
    width: 16%;
    height: 4%;
    opacity: 0;
---

TI-55 Programmable Calculator (with Original ROM)
-------------------------------------------------

This is a demonstration of the PCjs [TI-55 Emulator](../) in its simplest form.  It is also available with
[Diagnostics](diags/) enabled.

{% include machine.html id="ti55" config="json" %}

<div id="ti55">
  <img id="imageTI55" src="/devices/ti55/images/TI-55.png" alt="TI-55 Calculator"/>
  <div id="displayTI55"></div>
  <div id="ind2nd" class="indTI55">2nd</div>
  <div id="indINV" class="indTI55">INV</div>
  <div id="indDeg" class="indTI55">Deg</div>
  <div id="indRad" class="indTI55">Rad</div>
  <div id="indGrad" class="indTI55">Grad</div>
  <button id="powerTI55">Power</button>
</div>
