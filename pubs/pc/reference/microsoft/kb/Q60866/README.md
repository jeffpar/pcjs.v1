---
layout: page
title: "Q60866: OS/2 1.20 Requirements for Dual-Monitor Debugging"
permalink: /pubs/pc/reference/microsoft/kb/Q60866/
---

## Q60866: OS/2 1.20 Requirements for Dual-Monitor Debugging

	Article: Q60866
	Version(s): 2.x 3.00
	Operating System: OS/2
	Flags: ENDUSER | PM
	Last Modified: 17-JUL-1990
	
	To do dual-monitor debugging under OS/2 Version 1.20 with CodeView,
	make sure that you have the correct display DLLs specified in your
	CONFIG.SYS file.
	
	For example, the following three lines in your OS/2 CONFIG.SYS file
	specify the device drivers needed to use a VGA and a monochrome
	adapter:
	
	   set video_devices=bvh_vga,bvh_mpa
	   set bvh_vga=device(bvhvga)
	   set bvh_mpa=device(bvhmpa)
	
	If you have a CGA or an EGA monitor and adapter for your primary
	(color) display, replace device(bvhvga) with device(bvhcga) or
	device(bvhega), depending on your adapter type.
	
	Next, make sure that both of the BVH*.DLL files (in the above case,
	BVHVGA.DLL and BVHMPA.DLL) specified in the device(name) section are
	in your LIBPATH. OS/2 setup places these files in your C:\OS2\DLL
	directory by default.
	
	Note: You can substitute any name for bvh_vga or bvh_mpa, as long as
	those two placeholders match up with the name tab in the set
	<name>=device... lines.
	
	Remember, the two monitors must be unique for OS/2 to determine which
	monitor is which. For instance, debugging with two VGA monitors will
	not work because OS/2 and, therefore, CodeView will be unable to
	determine which adapter/monitor is the primary adapter/monitor and
	which is the secondary adapter/monitor.
	
	This point is critical to remember when considering dual-monitor
	debugging on a microchannel machine (for example, an IBM PS/2 Model 50
	and above). Since there are currently no microchannel monochrome
	adapter cards on the market, the only alternative is to use a VGA and
	an 8514 as the two monitors. The following are the matching three
	lines for your OS/2 CONFIG.SYS file for that scenario:
	
	   set video_devices=bvh_vga,bvh_8514
	   set bvh_8514=device(bvh8514)
	   set bvh_vga=device(bvhvga)
	
	Using this setup, the 8514 monitor displays the graphics output (or
	the Presentation Manager screen) and the VGA is the debug monitor and
	displays all text output.
