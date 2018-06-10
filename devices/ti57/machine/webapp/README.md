---
layout: pwa
title: "TI-57 Programmable Calculator"
permalink: /devices/ti57/machine/webapp/
preview: /devices/ti57/images/ti57.png
iconList:
  - size: 180x180
    url: /devices/ti57/images/ti57-icon-180x180.png
iconTitle: TI-57
machines:
  - id: ti57
    type: ti57
    name: TI-57 Programmable Calculator
    config: ../rev0/ti57.json
styles:
  body:
    background-color: black;
  .page-content:
    padding: 0;
  .site-footer:
    border-top: 0;
  _ti57:
    position: relative;
    display: inline-block;
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
---

{% include machine.html id="ti57" config="json" %}

<div id="ti57">
  <img id="imageTI57" src="/devices/ti57/images/ti57.png" alt="TI-57 Calculator"/>
  <div id="displayTI57"></div>
  <div id="ind2nd" class="indTI57">2nd</div>
  <div id="indINV" class="indTI57">INV</div>
  <div id="indDeg" class="indTI57">Deg</div>
  <div id="indRad" class="indTI57">Rad</div>
  <div id="indGrad" class="indTI57">Grad</div>
  <button id="powerTI57">Power</button>
</div>
