---
layout: page
title: "Q62331: Attempting to Expand a Help Dialog Box Hangs DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q62331/
---

	Article: Q62331
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.00
	Last Modified: 25-JUL-1990
	
	When one of the pull-down menus in the Programmer's WorkBench (PWB)
	version 1.00 is selected (File, Edit, View, etc.) and then F1 is
	chosen for help on that menu, a small help screen appears. If CTRL+F10
	is chosen in an attempt to expand the window to full screen, the
	machine will hang under DOS. If the machine doesn't hang, it may
	require another invocation of CTRL+F10 to cause the problem.
	
	Under OS/2, the machine may not hang, but the PWB's functionality will
	be disrupted and attempts to free oneself may cause a GP fault. It may
	be possible to exit the PWB, but at the very least, the CURRENT.STS
	file will be corrupted so that future entrances to PWB will result in
	very odd window configurations.
	
	Microsoft has confirmed this to be a problem with the PWB version
	1.00. We are researching this problem and will post new information
	here as it becomes available.
