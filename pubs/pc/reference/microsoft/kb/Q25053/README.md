---
layout: page
title: "Q25053: Unable to Activate the Mouse in Chart"
permalink: /pubs/pc/reference/microsoft/kb/Q25053/
---

## Q25053: Unable to Activate the Mouse in Chart

	Article: Q25053
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | TAR64094
	Last Modified: 19-SEP-1988
	
	You may be unable to activate the mouse in Chart; the mouse arrow may
	appear to be frozen.
	
	Chart defaults serial printer drivers to COM1:. Therefore, when using
	a serial mouse, it is necessary to start Chart and then change the
	Print Setup adapter in the Chart screen to something other than the
	COM port to which the mouse is connected. You must do the following to
	activate the mouse:
	
	1. Change the Print Setup adapter in the Chart screen from COM1: to
	   LPT1:.
	
	2. Exit.
	
	3. Restart Chart.
