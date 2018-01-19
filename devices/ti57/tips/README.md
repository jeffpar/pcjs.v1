---
layout: page
title: TI-57 Tips and Tricks
permalink: /devices/ti57/tips/
machines:
  - id: ti57
    type: ti57
    name: TI-57 Programmable Calculator
    config: /devices/ti57/machine/rev0/ti57.json
styles:
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
  .key:
    border: 1px solid;
---

TI-57 Tips and Tricks
---------------------

### Powering Off The TI-57 Display

The post "[Give your TI-57 Constant Memory](https://www.rskey.org/gene/calcgene/57c.htm)"
describes a trick for powering off the calculator while preserving memory.
It's more accurately described as a means of powering off the display without powering off the entire calculator,
and since the display is (apparently) what consumes the most power, you could "pretend" that you turned your
calculator off, even though you really hadn't.

This trick was previously reported in an old [TI PPC Notes](https://www.rskey.org/CMS/index.php/the-library/14)
newsletter from the "TI Programmable Calculator Club" in Lanham, MD.  The article in
[Vol. 7, No. 6, Page 9](http://bulk.rskey.org/BULK/CALCDOCS/TI/PPC/V7N6.pdf) reported that this trick was in turn
previously reported in a French magazine, "L'Ordinateur de Poche" (No. 4 from 1982).

Rather than repeat either of those repetitions of the trick, both of which suffer from a little vagueness, I'll
repeat a better explanation from rskey.org's page on the [TI-57](http://www.rskey.org/ti57).  It involves entering
two program steps at the end of the TI-57's 50-step program memory (at step 48), where it's conveniently out of the
way of any other programs you might write, and then executing it when you're ready to power the screen off:

> Briefly, you need to enter the two steps with the following keystrokes:
<span class="key">GTO</span>
<span class="key">2nd</span>
<span class="key">4</span>
<span class="key">8</span>
<span class="key">LRN</span>
<span class="key">2nd</span>
<span class="key">Exc</span>
<span class="key">SST</span>
<span class="key">2nd</span>
<span class="key">Lbl</span>
<span class="key">1</span>.
To put the calculator in sleep mode, enter:
<span class="key">CLR</span>
<span class="key">GTO</span>
<span class="key">2nd</span>
<span class="key">4</span>
<span class="key">8</span>
<span class="key">R/S</span>
<span class="key">INV</span>
<span class="key">STO</span>
<span class="key">3</span>
<span class="key">+/-</span>
<span class="key">+/-</span>.
To exit sleep mode, enter:
<span class="key">INV</span>
<span class="key">2nd</span>
<span class="key">Fix</span>
<span class="key">CLR</span>.

Use the [PCjs TI-57 Emulator](#pcjs-ti-57-emulator) below to give it a try!

### Overriding PCjs TI-57 Settings

The [PCjs TI-57 Emulator](#pcjs-ti-57-emulator) allows you to override a variety of configuration properties
using URL parameters, including speed and color settings.  For example:
                                                   
	http://www.pcjs.org/devices/ti57/machine/?color=lime

Currently, the following properties may be overridden, within the given minimums and maximums:

- *cyclesPerSecond* (default speed is 650000; minimum is 100000 and maximum is 1600000)
- *yieldsPerSecond* (default is 60; minimum is 30 and maximum is 120)
- *yieldsPerUpdate* (default is 30; minimum is 1 and maximum is *yieldsPerSecond*)
- *color* (default LED digit color is red)
- *backgroundColor* (default LED digit background color is none, for a transparent background)
- *colorROM* (default ROM activity LED color is green)
- *backgroundColorROM* (default ROM activity background color is black)

So, if you want a [TI-57 with Bright Green LEDs](?color=lime#pcjs-ti-57-emulator), you've got it!

Note that ROM activity colors apply only to the "ROM Activity" window that appears on a
[TI-57 Diagnostics](/devices/ti57/machine/rev0/) page.

The *yieldsPerSecond* property is essentially the emulator's LED refresh rate, whereas *yieldsPerUpdate* determines
how frequently any other non-LED elements on the page should be updated (e.g., current speed, current register values,
etc.)

#### PCjs TI-57 Emulator

{% include machine.html id="ti57" config="json" %}

<div id="ti57">
  <img id="imageTI57" src="/devices/ti57/images/TI-57.png"/>
  <div id="displayTI57"></div>
  <button id="powerTI57">Power</button>
</div>
