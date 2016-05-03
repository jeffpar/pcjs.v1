---
layout: page
title: Space Invaders (1978)
permalink: /devices/pc8080/machine/invaders/
machines:
  - type: pc8080
    id: invaders
    debugger: true
---

Space Invaders (1978)
---

This is a test of [PC8080](/modules/pc8080/), a new 8080-based machine emulator recently added to the
PCjs Project.  It's a work-in-progress, so it's not playable yet.  And the goal is not to build
yet-another Space Invaders/Arcade Machine emulator -- that's been done many times over -- but to start with
a well-understood 8080-based machine architecture that doesn't need a lot of peripherals, and use it as an
early test case for another classic CPU that we can add to the PCjs toolbox.

Assorted [Space Invaders Hardware Notes](#space-invaders-hardware-notes) are collected below.

{% include machine.html id="invaders" %}

Space Invaders Hardware Notes
---

### Memory Map

	0000-1FFF  r   ROM code
	2000-23FF  rw  RAM
	2400-3FFF  rw  bitmapped screen (224x256)

### I/O Map

	00         r
	01         r   control inputs
	                bit 7
	                bit 6    right
	                bit 5    left
	                bit 4    fire
	                bit 3
	                bit 2    1 player start
	                bit 1    2 player start
	                bit 0    coin slot
	02         r   control inputs
	                bit 7    0=display coin info
	                bit 6    right 2
	                bit 5    left 2
	                bit 4    fire 2
	                bit 3    bonus (1500,1000) / preset mode
	                bit 2    1=tilt
	                bit 0-1  initial lives (3,4,5,6) / (3,4)
	02          w  shift count (0-7)
	03         r   shifted value (low then high)
	03          w  sound
	                bit 4    bonus base
	                bit 3    invader hit
	                bit 2    base hit
	                bit 1    base fire
	                bit 0    saucer
	04          w  value to shift
	05          w  sound
	                bit 5    flip video
	                bit 4    saucer hit
	                bit 3    invader movement 4
	                bit 2    invader movement 3
	                bit 1    invader movement 2
	                bit 0    invader movement 1
	06          w  watchdog timer clear

Note that, unlike most emulators, PC8080 (like PCjs) has a *[Bus](/modules/pc8080/lib/bus.js)* architecture,
allowing components to "plug in" different kinds of memory or memory-mapped devices at different addresses,
and to register specific functions for specific I/O ports.	

For example, Space Invaders has 8Kb of ROM at addresses 0x0000 through 0x1FFF, which means that if any 8080 code
attempts to write to those addresses, nothing should happen.  Unfortunately, most emulators treat the entire address
space as one contiguous array of bytes.  Which means either that the ROM is susceptible to corruption *or* that every
write operation must check the address to determine its validity, which hurts the performance of *all* writes.

In PC8080 (and PCjs), all writes are equally fast, and all ROMs are fully protected.  An exception is made for the
Debugger, which allows you to use the "e" command to modify ("patch") ROM code on the fly, but that is completely
outside and independent of the 8080 code being emulated.

### Other Online References

See [Computer Archeology](http://www.computerarcheology.com/Arcade/SpaceInvaders/) for an excellent collection
of materials on the original Space Invaders, including commented ROM disassemblies. 
