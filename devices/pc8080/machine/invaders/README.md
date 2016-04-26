---
layout: page
title: Space Invaders (Under Construction)
permalink: /devices/pc8080/machine/invaders/
sitemap: false
machines:
  - type: pc8080
    id: invaders
    debugger: true
---

Space Invaders (Under Construction)
---

This is the first test of [PC8080](/modules/pc8080/), a new 8080-based machine emulator being added to the
PCjs Project.  It's a work-in-progress, so there's not much to look at yet.  And the goal is not to build
yet-another Space Invaders/Arcade Machine emulator -- that's been done many times over -- but to start with
a well-understood 8080-based machine architecture that doesn't need a lot of peripherals, and use it as the
first test case for another CPU that we can add to the PCjs toolbox.

The idea is to make [PC8080](/modules/pc8080/) sufficiently configurable so that it will work with a variety of
8080-based systems, including those with memory-mapped video displays (like Space Invaders), as well as simpler
terminal-based systems, like the CP/M-based systems of old.

In fact, as soon as Space Invaders is working, my next adaptation will be a DEC VT100 terminal emulator (itself
an 8080-based machine) which can then be "wired up" to other PCjs machine simulations.  

Assorted [Space Invaders Hardware Notes](#space-invaders-hardware-notes) are collected below.

{% include machine.html id="invaders" %}

Space Invaders Hardware Notes
---

See [Computer Archeology](http://www.computerarcheology.com/Arcade/SpaceInvaders/) for an excellent collection
of materials on the original Space Invaders, including commented ROM disassemblies. 
