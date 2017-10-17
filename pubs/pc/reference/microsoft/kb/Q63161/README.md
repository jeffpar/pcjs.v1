---
layout: page
title: "Q63161: Overlaid Modules Loaded into EM Only When 1st Overlay Called"
permalink: /pubs/pc/reference/microsoft/kb/Q63161/
---

## Q63161: Overlaid Modules Loaded into EM Only When 1st Overlay Called

	Article: Q63161
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900608-158
	Last Modified: 5-SEP-1990
	
	When using expanded memory with an overlaid program, the overlaid
	modules are not loaded when the EXE file is invoked. They remain on
	disk until the first overlay is called. When this occurs, all the
	overlaid modules are loaded from disk into expanded memory. From then
	on, the overlays are swapped to and from expanded memory and the disk
	is no longer needed for that purpose.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10.
	
	For more information about using linker overlays in BASIC PDS 7.00 and
	7.10, search for a separate article in this Knowledge Base with the
	following words:
	
	   LINK and overlays and expanded and memory and BASIC
	
	To demonstrate this characteristic of BASIC overlays, boot up with an
	Lotus/Intel/Microsoft (LIM) version 4.0 Expanded Memory Specification
	(EMS) device driver and compile and link the three modules below as
	follows:
	
	   bc main;
	   bc overlay1;
	   bc overlay2;
	
	   link main+(overlay1)+(overlay2);
	
	MAIN.BAS
	--------
	
	   '* Note: The disk activity will be most obvious if this test
	   '        is run on a floppy drive.
	   PRINT "MAIN"
	   PRINT "HIT ANY KEY TO LOAD OVERLAYS INTO EMS"
	   SLEEP
	   CALL ovl1
	   PRINT "OVERLAYS LOADED"
	   PRINT "HIT ANY KEY TO CALL SECOND OVERLAY"
	   PRINT "THERE SHOULD BE NO DISK ACTIVITY IF YOU HAVE EMS"
	   SLEEP
	   CALL ovl2
	   PRINT "HIT ANY KEY TO END THE PROGRAM"
	   SLEEP
	   END
	
	OVERLAY1.BAS
	------------
	
	   SUB ovl1
	      PRINT "OVERLAY1"
	   END SUB
	
	OVERLAY2.BAS
	------------
	
	   SUB ovl2
	      PRINT "OVERLAY2"
	   END SUB
	
	When run, the resulting EXE file (MAIN.EXE) produces the following
	output:
	
	   MAIN
	   OVERLAY1
	   OVERLAY2
	
	However, before "OVERLAY1" is displayed, there will be disk activity
	while the code for overlay1 is loaded into the overlay area of
	conventional memory (for execution) and overlay2 is loaded into
	expanded memory. To see this clearly, run MAIN.EXE from a floppy
	drive. When overlay2 is called, there will be no disk activity because
	it will be swapped in from expanded memory.
	
	Note that this is not a problem with BASIC PDS 7.00 or 7.10, but a
	feature of the overlay manager. However, it can present a speed
	problem for applications that rely on the quickness of swapping from
	expanded memory for the first-called overlay. To work around this,
	make the first executable statement in your program a CALL to an
	additional overlay with no code in it. When it is called, all the
	other overlays will be loaded into expanded memory. The functionality
	and speed of the application will remain intact while the difference
	in EXE size and load time will be minimal.
	
	For example, the module MAIN.BAS above would be modified as follows:
	
	   CALL loadovls
	   PRINT "MAIN"
	   CALL ovl1
	   CALL ovl2
	   END
	
	The subprogram "loadovls" (meaning "load overlays") would be coded as
	the following:
	
	   SUB loadovls
	   END SUB
	
	When loadovls is called, the code for overlay1 and overlay2 will be
	loaded into expanded memory. This eliminates the disk activity between
	the display of "MAIN" and "OVERLAY1".
