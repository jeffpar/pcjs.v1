---
layout: page
title: "Q28442: OS/2 Protected Mode Restrictions for BASIC Compiler 6.00/6.00b"
permalink: /pubs/pc/reference/microsoft/kb/Q28442/
---

## Q28442: OS/2 Protected Mode Restrictions for BASIC Compiler 6.00/6.00b

	Article: Q28442
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	The following is a list of restrictions under MS OS/2 protected mode
	for Microsoft BASIC Compiler Versions 6.00 and 6.00b and Microsoft
	BASIC Professional Development System (PDS) Version 7.00:
	
	 1. Programs using statements that refer directly to addresses in the
	    machine's physical memory may need modification when run in
	    protected mode, for example, CALL ABSOLUTE, DEF SEG, PEEK, POKE,
	    BLOAD, BSAVE, VARPTR, and VARSEG.
	
	 2. Graphics are limited to screens 1 and 2. EGA and VGA graphics are
	    not supported in protected mode.
	
	 3. Except for BEEP, no sound is supported. SOUND or PLAY statements
	    are not allowed in protected mode. As a workaround, you can make
	    an OS/2 CALL to create a sound with a specified frequency and
	    duration.
	
	 4. Light pens and joysticks are not allowed in protected mode.
	
	 5. CALL INT86, INT86OLD, INT86X, INTERRUPT, and INTERRUPTX are not
	    available in protected mode.
	
	 6. COLOR is ignored in Screen 1 in protected mode.
	
	 7. INP and OUT are not available in protected mode.
	
	 8. IOCTL and IOCTL$ are not available in protected mode.
	
	 9. PALETTE [USING] is not available in protected mode.
	
	10. WAIT is not available in protected mode.
	
	11. If a program in real mode is using the serial communications port
	    (COM1 or COM2), then you cannot use that port in protected mode at
	    the same time. This is an OS/2 restriction. The reverse is also
	    true: if a program in protected mode is using the communications
	    port (COM1 or COM2), then you cannot use that port in real mode at
	    the same time.
