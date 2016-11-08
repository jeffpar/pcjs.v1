---
layout: post
title: Vote For The PDP-11!
date: 2016-11-07 23:00:00
permalink: /blog/2016/11/07/
machines:
  - id: test1170
    type: pdp11
    debugger: true
    config: /devices/pdp11/machine/1170/panel/debugger/machine.xml
---

[PDPjs](/devices/pdp11/machine/) support continues to improve:

- Functional [Front Panels](/devices/pdp11/panel/1170/#front-panel-basics) (see the demo below)
- ROMs such as DEC's [M9312 ROMs](/devices/pdp11/rom/M9312/) can now be installed
- Support for DEC's [RL11 Disk Controller](/devices/pdp11/rl11/) has now been implemented

To test RL11 support below, start the machine (click "Run"), then select the "XXDP Diagnostics" disk from the
"Disk Drive Controls", click "Load", and wait for the message:

	Mounted disk "XXDP Diagnostics" in drive RL0

to appear.  Then check the output window and make sure the following prompt has been displayed:

	PDP-11 MONITOR V1.0
	
	BOOT> 

At the prompt, type "BOOT RL0".  The following text should appear:

	CHMDLD0 XXDP+ DL MONITOR
	BOOTED VIA UNIT 0
	28K UNIBUS SYSTEM
	
	ENTER DATE (DD-MMM-YY): 

	RESTART ADDR: 152010
	THIS IS XXDP+.  TYPE "H" OR "H/L" FOR HELP.
	
	.


{% include machine.html id="test1170" %}

*[@jeffpar](http://twitter.com/jeffpar)*  
*Nov 7, 2016*
