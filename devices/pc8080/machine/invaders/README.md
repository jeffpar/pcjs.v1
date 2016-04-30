---
layout: page
title: Space Invaders (Under Construction)
permalink: /devices/pc8080/machine/invaders/
machines:
  - type: pc8080
    id: invaders
    debugger: true
---

Space Invaders (Under Construction)
---

This is a test of [PC8080](/modules/pc8080/), a new 8080-based machine emulator recently added to the
PCjs Project.  It's a work-in-progress, so there's not much to look at yet.  And the goal is not to build
yet-another Space Invaders/Arcade Machine emulator -- that's been done many times over -- but to start with
a well-understood 8080-based machine architecture that doesn't need a lot of peripherals, and use it as an
early test case for another classic CPU that we can add to the PCjs toolbox.

Assorted [Space Invaders Hardware Notes](#space-invaders-hardware-notes) are collected below.

{% include machine.html id="invaders" %}

Space Invaders Hardware Notes
---

See [Computer Archeology](http://www.computerarcheology.com/Arcade/SpaceInvaders/) for an excellent collection
of materials on the original Space Invaders, including commented ROM disassemblies. 
