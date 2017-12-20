---
layout: page
title: LED Scroller
permalink: /devices/leds/scroller/
machines:
  - id: scrollLEDs
    type: leds
    name: LED Scroller
    config: |
      {
        "scrollLEDs": {
          "class": "Machine",
          "type": "leds",
          "name": "LED Scroller",
          "version": 1.11,
          "autoPower": false,
          "bindings": {
            "clear": "clearScroll",
            "print": "printScroll"
          },
          "overrides": ["autoPower"]
        },
        "scrollChip": {
          "class": "Chip",
          "rule": "L1",
          "message": "Happy New Year!$c$30b$30o$30b$30o$90s",
          "overrides": ["message"]
        },
        "scrollClock": {
          "class": "Time",
          "cyclesPerSecond": 1,
          "cyclesMinimum": 1,
          "cyclesMaximum": 120,
          "clockByFrame": true,
          "bindings": {
            "run": "runScroll",
            "speed": "speedScroll",
            "step": "stepScroll",
            "throttle": "throttleScroll"
          },
          "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate","cyclesMinimum","cyclesMaximum","requestAnimationFrame"]
        },
        "scrollDisplay": {
          "class": "LED",
          "type": 0,
          "cols": 256,
          "rows": 16,
          "colsExtra": 16,
          "color": "red",
          "backgroundColor": "black",
          "highlight": false,
          "bindings": {
            "container": "displayScroll"
          },
          "overrides": ["color","backgroundColor"]
        },
        "scrollInput": {
          "class": "Input",
          "drag": true,
          "bindings": {
            "reset": "resetScroll"
          }
        }
      }
styles:
  scrollLEDs:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  displayScroll:
    position: relative;
  .print:
    font-family: Monaco,"Lucida Console",monospace;
  .diags:
    clear: both;
    margin-bottom: 16px;
---

LED Scroller
------------

This page demonstrates the ability of the LED device to create scrolling LED displays.

You can enter new messages in the Diagnostics window using the `s` command (eg, `s Hello World!`).

{% include machine.html id="scrollLEDs" config="json" %}

<div id="scrollLEDs">
  <div id="displayScroll"></div>
</div>
<div class="diags">
  <div>
    <textarea id="printScroll" class="print" cols="78" rows="16"></textarea>
  </div>
  <button id="runScroll">Run</button>
  <button id="stepScroll">Step</button>
  <button id="resetScroll">Reset</button>
  <button id="clearScroll">Clear</button>
  <input type="range" min="1" max="120" value="120" class="slider" id="throttleScroll"><span id="speedScroll">Stopped</span>
</div>

You may have noticed that the LED message set above ("Happy New Year!") also includes some special characters
("$c$30b$30o$30b$30o$90s") that aren't displayed.  The `$` symbol is used to embed "command codes" into a message.

Current command codes include:

- `$b` (*blank* the display; turns all LEDs off)
- `$c` (*center* the current display contents; ie, continue scrolling until centered)
- `$h` (*halt* scrolling)
- `$o` (turn the display *on*; the opposite of *blank*)
- `$p` (*pause* scrolling)
- `$s` (*scroll* the display without adding more symbols)

The default operation is to scroll the display, adding new symbols to the vacated end of the display as needed.
When all symbols in the current message have been processed, processing returns to the beginning of the message.

To change the default operation at any point, insert one or more command codes into the string.  Commands may also
include a count immediately after the `$` (e.g., `$90s`), which determines how many "steps" (cycles) that command
should remain in effect before advancing to the next symbol (or command) in the message.  So, for example, `$90s`
will scroll the display 90 times (without adding new symbols) before continuing to the next symbol.  The default
count for an operation is 1.

For convenience, commands that don't need a count (e.g., `$b` and `$o`) automatically treat the count as a pause (`$p`).
In other words, `$30b` is equivalent to `$b$30p`.

Finally, if you want to embed `$` as a normal symbol, use two of them (`$$`).

More commands will be added over time.  This was just an initial set to get the ball rolling -- or rather, to get it scrolling.
