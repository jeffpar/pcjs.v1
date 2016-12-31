---
layout: page
title: Running PCx86 From The Command-Line
permalink: /modules/pcx86/bin/
---

Running PCx86 From The Command-Line
---

In this *bin* directory, run:

	node pcx86 --cmd="load ibm5150.json"

The following output should appear:

	ibm5150.cpu8088 object created
	ibm5150.chipset object created
	ibm5150.romBASIC object created
	ibm5150.romBIOS object created
	ibm5150.ramLow object created
	ibm5150.keyboard object created
	ibm5150.videoMDA object created
	ibm5150.fdcNEC object created
	ibm5150.debugger object created
	warning: Component type 'Panel' not found
	PCx86 v1.x.x
	Copyright © 2012-2017 Jeff Parsons <Jeff@pcjs.org>
	License: GPL version 3 or later <http://gnu.org/licenses/gpl.html>
	ibm5150.pc-mda-64k object created
	PCx86> bus: 8Kb ROM at 000FE000
	bus: 32Kb ROM at 000F6000
	bus: 576Kb RAM at 00000000
	bus: 4Kb VIDEO at 000B0000
	Type ? for help with PCx86 Debugger commands
	AX=0000 BX=0000 CX=0000 DX=0000 SP=0000 BP=0000 SI=0000 DI=0000 
	SS=0000 DS=0000 ES=0000 PS=F002 V0 D0 I0 T0 S0 Z0 A0 P0 C0 
	&FFFF:0000 EA5BE000F0      JMP      &F000:E05B (romBIOS+0x0000005B)

Start the machine with a `g` command:

	g
	running
	false

and after about 10 seconds, dump the machine's video buffer with `d b000:0`:

	PCx86> d b000:0
	&B000:0000  43 07 75 07 72 07 72 07-65 07 6E 07 74 07 20 07  C.u.r.r.e.n.t. .
	&B000:0010  64 07 61 07 74 07 65 07-20 07 69 07 73 07 20 07  d.a.t.e. .i.s. .
	&B000:0020  54 07 75 07 65 07 20 07-20 07 31 07 2D 07 30 07  T.u.e. . .1.-.0.
	&B000:0030  31 07 2D 07 31 07 39 07-38 07 30 07 20 07 20 07  1.-.1.9.8.0. . .
	&B000:0040  20 07 20 07 20 07 20 07-20 07 20 07 20 07 20 07   . . . . . . . .
	&B000:0050  20 07 20 07 20 07 20 07-20 07 20 07 20 07 20 07   . . . . . . . .
	&B000:0060  20 07 20 07 20 07 20 07-20 07 20 07 20 07 20 07   . . . . . . . .
	&B000:0070  20 07 20 07 20 07 20 07-20 07 20 07 20 07 20 07   . . . . . . . .
	false

To destroy the machine, type `quit` or press CTRL-C twice.
