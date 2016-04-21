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
an 8080-based machine) which can then "wired up" to other PCjs machine simulations.  

Assorted [Space Invaders Hardware Notes](#space-invaders-hardware-notes) are collected below.

{% include machine.html id="invaders" %}

Space Invaders Hardware Notes
---

From [emutalk.net](http://www.emutalk.net/threads/38177-Space-Invaders):

	Space Invaders, (C) Taito 1978, Midway 1979
	
	CPU: Intel 8080 @ 2MHz (CPU similar to the (newer) Zilog Z80)
	
	Interrupts: $cf (RST 8) at the start of vblank, $d7 (RST $10) at the end of vblank.
	
	Video: 256(x)*224(y) @ 60Hz, vertical monitor. Colours are simulated with a
	plastic transparent overlay and a background picture.
	Video hardware is very simple: 7168 bytes 1bpp bitmap (32 bytes per scanline).
	
	Sound: SN76477 and samples.
	
	Memory map:
	        ROM
	        $0000-$07ff:    invaders.h
	        $0800-$0fff:    invaders.g
	        $1000-$17ff:    invaders.f
	        $1800-$1fff:    invaders.e
	
	        RAM
	        $2000-$23ff:    work RAM
	        $2400-$3fff:    video RAM
	
	        $4000-:         RAM mirror
	
	Ports:
	        Read 1
	        BIT     0       coin (0 when active)
	                1       P2 start button
	                2       P1 start button
	                3       ?
	                4       P1 shoot button
	                5       P1 joystick left
	                6       P1 joystick right
	                7       ?
	
	        Read 2
	        BIT     0,1     dipswitch number of lives (0:3,1:4,2:5,3:6)
	                2       tilt 'button'
	                3       dipswitch bonus life at 1:1000,0:1500
	                4       P2 shoot button
	                5       P2 joystick left
	                6       P2 joystick right
	                7       dipswitch coin info 1:off,0:on
	
	        Read 3          shift register result
	
	        Write 2         shift register result offset (bits 0,1,2)
	        Write 3         sound related
	        Write 4         fill shift register
	        Write 5         sound related
	        Write 6         strange 'debug' port? eg. it writes to this port when
	                        it writes text to the screen (0=a,1=b,2=c, etc)
	
	        (write ports 3,5,6 can be left unemulated, read port 1=$01 and 2=$00
	        will make the game run, but but only in attract mode)
	
	I haven't looked into sound details.
	
	16 bit shift register:
	        f              0        bit
	        xxxxxxxxyyyyyyyy
	
	        Writing to port 4 shifts x into y, and the new value into x, eg.
	        $0000,
	        write $aa -> $aa00,
	        write $ff -> $ffaa,
	        write $12 -> $12ff, ..
	
	        Writing to port 2 (bits 0,1,2) sets the offset for the 8 bit result, eg.
	        offset 0:
	        rrrrrrrr                result=xxxxxxxx
	        xxxxxxxxyyyyyyyy
	
	        offset 2:
	          rrrrrrrr      result=xxxxxxyy
	        xxxxxxxxyyyyyyyy
	
	        offset 7:
	               rrrrrrrr result=xyyyyyyy
	        xxxxxxxxyyyyyyyy
	
	        Reading from port 3 returns said result.
	
	Overlay dimensions (screen rotated 90 degrees anti-clockwise):
	        ,_______________________________.
	        |WHITE            ^             |
	        |                32             |
	        |                 v             |
	        |-------------------------------|
	        |RED              ^             |
	        |                32             |
	        |                 v             |
	        |-------------------------------|
	        |WHITE                          |
	        |         < 224 >               |
	        |                               |
	        |                 ^             |
	        |                120            |
	        |                 v             |
	        |                               |
	        |                               |
	        |                               |
	        |-------------------------------|
	        |GREEN                          |
	        | ^                  ^          |
	        |56        ^        56          |
	        | v       72         v          |
	        |____      v      ______________|
	        |  ^  |          | ^            |
	        |<16> |  < 118 > |16   < 122 >  |
	        |  v  |          | v            |
	        |WHITE|          |         WHITE|
	        `-------------------------------'
	
	        Way of out of proportion :P
