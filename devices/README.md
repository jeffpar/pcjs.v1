---
layout: page
title: Device Configurations
menu_title: Devices
menu_order: 3
permalink: /devices/
redirect_from:
  - /configs/
---

Device Configurations
---------------------

PCjs machines can be built with the following CPUs:
 
* [6502](c1p/) ([Challenger 1P](c1p/machine/))
* [8080](pc8080/) ([Space Invaders](pc8080/machine/invaders/) and the [VT100 Terminal](pc8080/machine/vt100/))
* [8086-80386](pcx86/) ([IBM PC and compatibles](pcx86/machine/))
* [PDP-10](pdp10/) ([Model KA10](pdp10/machine/ka10/))
* [PDP-11](pdp11/) ([PDP-11/20](pdp11/machine/1120/), [PDP-11/45](pdp11/machine/1145/), and [PDP-11/70](pdp11/machine/1170/))

More recently, PCjs has added a new set of [Device Classes](/modules/devices/) that can be used to create simpler
machines, such as:

* Texas Instruments [TI-42](ti42/), [TI-55](ti55/), and [TI-57](ti57/) Calculators
* [John Conway's](http://www.conwaylife.com/wiki/John_Horton_Conway) "[Game of Life](http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life)" Cellular Automaton [Simulation](leds/life/)
* [Hasbro's](https://en.wikipedia.org/wiki/Hasbro) "[Lite-Brite](https://en.wikipedia.org/wiki/Lite-Brite)" reimagined as an animated [LED Simulation](leds/litebrite/)

The goal is to make it easy to construct a variety of machines from a common set of devices (i.e., keyboards,
displays, disk and tape drive controllers, etc).
