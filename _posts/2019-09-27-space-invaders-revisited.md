---
layout: post
title: Space Invaders Revisited
date: 2019-09-27 10:00:00
permalink: /blog/2019/09/27/
preview: /blog/images/space-invaders-1978.png
machines:
  - id: invaders
    type: invaders
    name: Space Invaders
    config: /devices/pc8080/machine/invaders/new/invaders.json
styles:
  .pcjs-video:
    width: 100%;
    height: auto;
    background-color: black;
    position: relative;
    clear: both;
  .pcjs-monitor:
    width: 100%;
    height: auto;
  .pcjs-overlay:
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  .pcjs-diagnostics:
    clear: both;
  .pcjs-console:
    font-family: monospace;
    width: 100%;
---

When I first started working on PCjs, JavaScript features like [Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
and [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) weren't widely
available.  Over the next 8 or so years, things changed a lot, I learned a lot, and PCjs slowly grew to support more machines.

Unfortunately, that growth resulted in a lot of duplicated code, along with some out-dated and kludgy code.  While
I did try to factor out common chunks of logic into a set of [shared](/modules/shared/) modules, those efforts were
limited, partly to save time, but also to minimize the risk of breaking old machines while creating new ones.
Getting a new emulator up and running is time-consuming enough without constantly testing and fixing all the others.

I decided to make a break with that code base a couple years ago, when I wrote a web-based emulation of
the [TI-57 Calculator](/devices/ti57/machine/rev0/).  I created a new [Device class](/modules/devices/) hierarchy,
along with a new time management class to "clock" all the internal devices, which could be driven either by *setTimeout()*
or *requestAnimationFrame()*, and I used simple JSON and HTML markup to define the machine configuration and layout,
instead of the older XML-based PCjs configuration scheme, which had become increasingly clunky and difficult to maintain.

## A New 8080 Emulator and Debugger

A few months ago, I decided to continue the evolution of those new classes, starting with a fairly simple machine
that I had previously emulated: the 8080-based arcade machine Space Invaders.

First, since I always like to start with an operational debugger, I took the most useful features common to
all the PCjs debuggers and packed them into a new [Debugger](/modules/devices/dbgio.js) base class, which provided most
of the commands that the new [8080 Debugger](/modules/devices/dbg8080.js) needs.

Similarly, I separated management of the browser display elements into a new [Monitor](/modules/devices/monitor.js)
base class, so that the Space Invaders [Video](/modules/devices/invaders/video.js) device can focus on the graphics
hardware.  And the handful of the machine's I/O ports are implemented by a [Chip](/modules/devices/invaders/chip.js)
device that extends a standard [Port](/modules/devices/ports.js) class, which plugs into the new [Bus](/modules/devices/bus.js)
class, which implements as many buses as a machine needs (eg, memory and I/O).

And of course, beating at the heart of every machine is the CPU, and for Space Invaders, the
[8080 CPU](/modules/devices/cpu8080.js) was a straight-forward port of the [original](/modules/pc8080/lib/cpuops.js)
PCjs emulation.

One significant change in this new architecture is that every internal device is an instance of the [Device](/modules/devices/device.js)
class, which in turn builds upon a simple inheritance chain that includes all the functionality that any device might need.
If a device wants to call *printf()*, for example, it can do so by simply invoking *this.printf()*, rather than having
to first "include" (ie, *import* or *require*) the class that contains *printf()*.

I've also done away with specialized PCjs printing functions like *printMessage()* and *printMessageIO()*.  Instead,
if a device wants to assign certain print operations to certain message groups (ie, sets of messages that can be turned
on or off through the debugger), it simply includes the **MESSAGE** id as the first parameter to *printf()*.

Debugger input and output controls have been unified into a single textarea "window", there's improved breakpoint
management for setting read and write breakpoints on any valid memory or I/O address, an execution history buffer can
be enabled and dumped with the built-in dump ("d") command, and all the debugger's commands can be accessed from any
browser debug console window via a global *window.command()* function.

## Time to Kill

The new emulation should be running below.  Keys are defined by the [Input](/modules/devices/input.js) device's
keyboard mappings in the machine's [configuration file](/devices/pc8080/machine/invaders/new/invaders.json).  Here's
a summary:

- **1**: One Player
- **2**: Two Players
- **3**: Insert Coin
- **A** or **Left**: Move Left
- **D** or **Right**: Move Right
- **L** or **Space**: Fire

If it's not running, or it's not running well, then there's obviously more work to do.  An emulator is never really done,
because the emulation can always be made just a little bit better.  But I feel like this is a nice fresh start.

{% include machine.html id="invaders" config="json" %}

<div id="invaders">
  <button id="zoomInvaders" style="float:right">Full-Screen</button>
  <div id="videoInvaders" class="pcjs-video">
  </div>
</div>
<div class="pcjs-diagnostics">
  <div>
    <p>Diagnostics</p>
    <textarea id="printInvaders" class="pcjs-console" cols="128" rows="20" spellcheck="false"></textarea>
  </div>
  <button id="powerInvaders">Power</button>
  <button id="resetInvaders">Reset</button>
  <button id="runInvaders">Run</button>
  <button id="stepInvaders">Step</button>
  <button id="clearInvaders">Clear</button>
  <span id="speedInvaders">Stopped</span>
</div>

*[@jeffpar](https://jeffpar.com)*  
*September 27, 2019*
