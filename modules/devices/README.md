---
layout: page
title: PCjs Device Classes
permalink: /modules/devices/
---

PCjs Device Classes
===================

In the spirit of [Vanilla JS](http://vanilla-js.com/), a very simple set of ES2015 (ES6) JavaScript classes are used to create
a variety of newer (late 2017) PCjs Machines:

* [Device](device.js)
* [Input](input.js)
* [LED](led.js)
* [LED Controller "Chip"](ledctrl.js)
* [ROM](rom.js)
* [Time](time.js)
* [TMS-1500 Calculator "Chip"](tms1500.js)
* [Machine](machine.js)

which, in turn, build on a simple set of library classes:

* [lib/stdio](lib/stdio.js)

Examples of those newer PCjs Machines include:

* Texas Instruments [TI-42](/devices/ti42/machine/), [TI-55](/devices/ti55/machine/), and [TI-57](/devices/ti57/machine/) Programmable Calculators
* [John Conway's](http://www.conwaylife.com/wiki/John_Horton_Conway) "[Game of Life](http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life)" Cellular Automaton built as an [LED Simulation](/devices/leds/life/)
* [Hasbro's](https://en.wikipedia.org/wiki/Hasbro) "[Lite-Brite](https://en.wikipedia.org/wiki/Lite-Brite)" reimagined as an [LED Simulation](/devices/leds/litebrite/) (eg, [Animated Christmas Tree](/devices/leds/litebrite?autoStart=true&pattern=0/0/45/39/A45o$45o$21b47R154G39B1A256CoRGBACo$21o47R154G39B1A256C2oRGBACo$20o47R154G39B1A256CoRGBACb47R154G39B1A256CoRGBACo$20o47R154G39B1A256CoRGBAC2b47R154G39B1A256CoRGBACo$19o47R154G39B1A256CoRGBAC3b47R154G39B1A256CoRGBACo$19o47R154G39B1A256CoRGBAC4b47R154G39B1A256CoRGBACo$18o47R154G39B1A256CoRGBAC4b255R255G249B1A8976Co47R154G39B256CoRGBACo$18o47R154G39B1A256CoRGBAC3b255R255G249B1A784CobRGBACb47R154G39B1A256CoRGBACo$17o47R154G39B1A256CoRGBAC2b255R255G249B1A8976Co4880CoRGBAC3b47R154G39B1A256CoRGBACo$17o47R154G39B1A256CoRGBACb255R255G249B1A784CobRGBACo4b47R154G39B1A256CoRGBACo$16o47R154G39B1A256Co255R255G249B8976Co4880CoRGBACo6b47R154G39B1A256CoRGBACo$16o47R154G39B1A256CoRGBACo8b255R255G249B1A8976Co47R154G39B256CoRGBACo$15o47R154G39B1A256CoRGBACo7b255R255G249B1A784CobRGBACo47R154G39B1A256CoRGBACo$15o47R154G39B1A256CoRGBACo6b255R255G249B1A8976Co4880CoRGBAC3b47R154G39B1A256CoRGBACo$14o47R154G39B1A256CoRGBACo5b255R255G249B1A784CobRGBAC5b47R154G39B1A256CoRGBACo$14o47R154G39B1A256CoRGBAC5b255R255G249B1A8976Co4880CoRGBAC7b47R154G39B1A256CoRGBACo$13o47R154G39B1A256CoRGBAC4b255R255G249B1A784CobRGBAC8b255R255G249B1A8976Co47R154G39B256CoRGBACo$13o47R154G39B1A256CoRGBAC3b255R255G249B1A8976Co4880CoRGBAC8b255R255G249B1A784CobRGBACo47R154G39B1A256CoRGBACo$12o47R154G39B1A256CoRGBAC2b255R255G249B1A784CobRGBAC8b255R255G249B1A8976Co4880CoRGBAC3b47R154G39B1A256CoRGBACo$12o47R154G39B1A256CoRGBACb255R255G249B1A8976Co4880CoRGBACo7b255R255G249B1A784CobRGBAC5b47R154G39B1A256CoRGBACo$11o47R154G39B1A256Co255R255G249B784CobRGBAC8b255R255G249B1A8976Co4880CoRGBAC7b47R154G39B1A256CoRGBACo$11o47R154G39B1A256CoRGBAC9b255R255G249B1A784CobRGBAC8b255R255G249B1A8976Co47R154G39B256CoRGBACo$10o47R154G39B1A256CoRGBAC8b255R255G249B1A8976Co4880CoRGBAC8b255R255G249B1A784CobRGBACb47R154G39B1A256CoRGBACo$10o47R154G39B1A256CoRGBAC7b255R255G249B1A784CobRGBAC8b255R255G249B1A8976Co4880CoRGBAC3b47R154G39B1A256CoRGBACo$9o47R154G39B1A256CoRGBAC6b255R255G249B1A8976Co4880CoRGBAC8b255R255G249B1A784CobRGBAC5b47R154G39B1A256CoRGBACo$9o47R154G39B1A256CoRGBAC5b255R255G249B1A784CobRGBAC8b255R255G249B1A8976Co4880CoRGBAC7b47R154G39B1A256CoRGBACo$8o47R154G39B1A256CoRGBAC4b255R255G249B1A8976Co4880CoRGBAC8b255R255G249B1A784CobRGBAC8b255R255G249B1A8976Co47R154G39B256CoRGBACo$8o47R154G39B1A256CoRGBAC3b255R255G249B1A784CobRGBAC8b255R255G249B1A8976Co4880CoRGBAC8b255R255G249B1A784CobRGBACb47R154G39B1A256CoRGBACo$7o47R154G39B1A256CoRGBAC2b255R255G249B1A8976Co4880CoRGBAC8b255R255G249B1A784CobRGBAC8b255R255G249B1A8976Co4880CoRGBAC3b47R154G39B1A256CoRGBACo$7o47R154G39B1A256C30oRGBACo$21o250R125G20B1A256CoRGBACo$21o250R125G20B1A256C2oRGBACo$21o250R125G20B1A256CoRGBACo$21o250R125G20B1A256C2oRGBACo$21o250R125G20B1A256CoRGBACo$21o250R125G20B1A256C2oRGBACo$45o))
* [LED Scroller](/devices/leds/scroller/) and [LED Symbol Builder](/devices/leds/symbols/)

On the PCjs website, Jekyll Front Matter and templates are used define and embed complete machines.
The [Markdown](https://raw.githubusercontent.com/jeffpar/pcjs/master/devices/ti57/machine/README.md) file
in the [TI-57](/devices/ti57/machine/) directory provides a good example.  The Front Matter at the top of the file
is where you define one or more `machines`, each with the following minimum set of properties:

	machines:
	  - id: ti57
	    type: ti57
	    name: TI-57 Programmable Calculator
        config: /devices/ti57/machine/rev0/ti57.json

The `config` property specifies the location of a JSON [configuration file](/devices/ti57/machine/rev0/ti57.json) that
describes the machine's internal devices, the IDs of any visual controls that they bind to, and any resources they require (e.g.,
ROM contents).

Alternatively, a JSON configuration blob can be embedded directly in the machine definition:

	    config: |
	      {
	        "ti57": {
	          "class": "Machine",
	          "type": "TI57",
	          "name": "TI-57 Emulator",
	          "bindings": {
	            "clear": "clearTI57",
	            "print": "printTI57"
	          }
	        },
	        "chip": {
	          "class": "Chip",
	          "type": "TMS-1500"
	        },
	        "clock": {
	          "class": "Time",
	          "cyclesPerSecond": 650000,
	          "bindings": {
	            "run": "runTI57",
	            "speed": "speedTI57",
	            "step": "stepTI57"
	          }
	        },
	        "display": {
	          "class": "LED",
	          "type": 3,
	          "cols": 12,
	          "rows": 1,
	          "color": "red",
	          "backgroundColor": "black",
	          "bindings": {
	            "container": "displayTI57"
	          }
	        },
	        "input": {
	          "class": "Input",
	          "location": [139, 325, 368, 478, 0.34, 0.5, 640, 853, 418, 180, 75, 36],
	          "map": [
	            ["2nd",  "inv",  "lnx",  "\\b",  "clr"],
	            ["lrn",  "xchg", "sq",   "sqrt", "rcp"],
	            ["sst",  "sto",  "rcl",  "sum",  "exp"],
	            ["bst",  "ee",   "(",    ")",    "/"],
	            ["gto",  "7",    "8",    "9",    "*"],
	            ["sbr",  "4",    "5",    "6",    "-"],
	            ["rst",  "1",    "2",    "3",    "+"],
	            ["r/s",  "0",    ".",    "+/-",  "=|\\r"]
	          ],
	          "bindings": {
	            "surface": "imageTI57",
	            "power": "powerTI57",
	            "reset": "resetTI57"
	          }
	        },
	        "rom": {
	          "class": "ROM",
	          "wordSize": 13,
	          "valueSize": 16,
	          "valueTotal": 2048,
	          "littleEndian": true,
	          "file": "ti57le.bin",
	          "reference": "",
	          "values": [
	            4623,4386,5106,7051,3246,6152,5813,5628,5805,7051,4386,3246,7911,5132,1822,6798,
                ...
	            8183,1313,8182,613,3343,7148,39,3188,6561,3130,3090,7165,3188,3587,0,0
	          ]
	        }
	      }

Front Matter also provides a convenient way to define styles for any of the visual controls.
The syntax is similar to basic CSS, except that identifiers with a leading underscore correspond to control
IDs *without* the underscore (in CSS, you would use `#` in front of each identifier, but that's a comment
character in Front Matter).  You can also define style classes, by using identifiers with a leading period.

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

Next, add some HTML markup at the desired page location, such as:

	<div id="ti57">
	  <img id="imageTI57" src="/devices/ti57/images/ti57.png"/>
	  <div id="displayTI57"></div>
	  <button id="powerTI57">Power</button>
	</div>
	<div style="float:left;">
	  <div style="width:100%;">
	    <p>Diagnostics</p>
	    <textarea id="printTI57" cols="78" rows="16"></textarea>
	  </div>
	  <button id="runTI57">Run</button>
	  <button id="stepTI57">Step</button><span id="speedTI57">Stopped</span>
	  <button id="resetTI57">Reset</button>
	  <button id="clearTI57">Clear</button>
	</div>

Finally, you embed the machine with a simple *include* template:

    {% include machine.html id="ti57" config="json" %}

which automatically adds all the necessary scripts, as listed in
[machines.json](https://github.com/jeffpar/pcjs/blob/master/_data/machines.json):

	<script src="/modules/devices/lib/stdio.js"></script>
	<script src="/modules/devices/device.js"></script>
	<script src="/modules/devices/input.js"></script>
	<script src="/modules/devices/led.js"></script>
	<script src="/modules/devices/rom.js"></script>
	<script src="/modules/devices/time.js"></script>
	<script src="/modules/devices/tms1500.js"></script>
	<script src="/modules/devices/machine.js"></script>

and then creates the machine with:

	new Machine('ti57','{JSON blob}');

or, if an external JSON file is used, with:

	new Machine('ti57','/devices/ti57/machine/rev0/ti57.json');

Of course, you can add any or all of those lines yourself if you don't want to use the *include* template.
