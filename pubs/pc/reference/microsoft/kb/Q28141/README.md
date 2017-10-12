---
layout: page
title: "Q28141: Beginner's Concerns for Writing Non-PM Graphic Applications"
permalink: /pubs/pc/reference/microsoft/kb/Q28141/
---

	Article: Q28141
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | TAR73919
	Last Modified: 12-OCT-1988
	
	Question:
	   I have an OS/2 application (an analog simulator with postprocessor)
	that is ready to go, with the exception of the GRAPHICS output. I have
	been having difficulties getting graphics to work under OS/2. Can you
	give me any suggestions on how to use graphics?
	
	Response:
	   The first problem is to get "addressability" to the video RAM. This
	is accomplished by using the VioGetPhysBuf API. For an EGA monitor the
	calling sequence would be as follows:
	
	struct    PhysBufData physbuf;
	char  far *base1, far *base2;
	
	     physbuf.buf_start = 0xa0000;
	     physbuf.buf_length = 0x20000;
	     rcode = VIOGETPHYSBUF (&physbuf, 0);
	     FP_SEG (base1) = physbuf.selectors[0];
	     FP_OFF (base1) = 0;
	     FP_SEG (base2) = physbuf.selectors[1];
	     FP_OFF (base2) = 0;
	
	where base1 is the first 64K of memory on the EGA card, and base2
	would be the next 64K of memory. If you wanted to access more than
	128K you would have to increase the length and allocate space for more
	physbuf.selectors. (Look up this API.)
	   Once you have valid pointers to the video memory, you still have
	more limitations. You can (should) not use these pointers unless your
	application is in the foreground. You must (should) inform the
	operating system before using the pointers. You use the API VioScrLock
	to lock your process into the foreground while you are writing to
	video memory. Once you are done writing to the video memory you must
	call VioScrUnLock, to re-enable screen switching. You should not keep
	the screen locked on any more time then absolutely necessary. (See
	this API for restrictions.) If your application attempts to write to
	the video memory when it is not in the foreground, it will gp_fault.
	   Since your application is putting the monitor into graphics mode,
	it is its responsibility to save and restore the monitor's contents
	and mode. The application will have to use the API's VioSavRedrawWait
	and VioModeWait. VioSavRedrawWait is for the notification of when you
	should save or restore your screen image. VioModeWait is notified when
	you should save and restore video modes.
	   Finally, if you plan to use I/O ports with your program you will
	have to "flag" it as needing IOPL (input/output privilege level). You
	do this by putting "CODE IOPL" in the program's definition file, and
	in config.os2 "IOPL=YES".
	
	API's to review:
	     VioGetPhysBuf
	     VioScrLock
	     VioScrUnLock
	     VioModeWait
	     VioRedrawWait
