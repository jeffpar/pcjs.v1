---
layout: page
title: "Q40573: Problems with Using the Digital Output of a VGA Adapter"
permalink: /pubs/pc/reference/microsoft/kb/Q40573/
---

## Q40573: Problems with Using the Digital Output of a VGA Adapter

	Article: Q40573
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC
	Last Modified: 16-MAY-1989
	
	Problem:
	
	When I run programs, such as GRDEMO, that call the graphics function
	_setvideomode, a border is displayed around my monitor. Also, the
	functions _remappalette and _remapallpalette do not seem to work
	correctly.
	
	Response:
	
	Some VGA display adapters have analog- and digital-output
	capabilities. The above behavior occurs when the digital output of a
	VGA display adapter is connected to the monitor.
	
	When the digital output is connected to an ECD (EGA monitor), a green
	border is observed. When the digital output is connected to a
	multisync class monitor, a gray border is observed. In either case,
	remapping the palette does not function. When the analog output is
	connected to a multisync or VGA monitor, the correct behavior is
	observed.
	
	The problem is that the graphics adapter is rightfully determined to
	be VGA class -- although for practical purposes it is really EGA
	class. At this point, the C graphics library treats the display
	incorrectly as VGA. Connecting a digital monitor to the digital output
	of a VGA adapter is a non-standard hardware configuration (the digital
	output of a VGA graphics adapter is non-standard). The behavior of a
	non-standard hardware configuration is unpredictable.
