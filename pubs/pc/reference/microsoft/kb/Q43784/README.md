---
layout: page
title: "Q43784: Obtaining the Local Drive Name and Network Name; INT 21 Hex"
permalink: /pubs/pc/reference/microsoft/kb/Q43784/
---

## Q43784: Obtaining the Local Drive Name and Network Name; INT 21 Hex

	Article: Q43784
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890210-109
	Last Modified: 15-DEC-1989
	
	MS-DOS Interrupt 21 Hex function 5F Hex, subfunction 02 allows you to
	return the local drive name and the network name of a device that has
	been redirected. An example of this is when you connect to a server
	and use it as the logical drive. If you wanted to obtain the drive
	name and the path to the server from within a QuickBASIC program, you
	could CALL this MS-DOS interrupt.
	
	The following requirements need to be observed when calling this
	interrupt:
	
	1. The MS-DOS network utility SHARE.EXE must be run before you can
	   successfully call this interrupt.
	
	2. It is important that the network being used is a Microsoft Network
	   configuration, such as IBM PC-NET. Otherwise, the information that
	   is returned may not be correct.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS,
	and Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	Code Example
	------------
	
	'*****************GET REDIRECTION LIST ENTRY******************
	'If you are using BASIC PDS 7.00 the INCLUDE file should be 'QBX.BI'
	'$INCLUDE: 'QB.BI'
	DIM inregs AS RegTypeX
	DIM devname%(8)
	DIM networkname%(64)
	
	    inregs.ax = &H5F02
	    inregs.bx = &H0
	    inregs.ds = VARSEG(devname%(0))
	    inregs.si = VARPTR(devname%(0))
	    inregs.es = VARSEG(networkname%(0))
	    inregs.di = VARPTR(networkname%(0))
	
	    CLS
	    CALL INTERRUPTX(&H21, inregs, inregs)
	    PRINT "REDIRECTED LOCAL DEVICE NAMES:"
	    X% = CSRLIN
	    LOCATE X% + 1, 15
	    DEF SEG = inregs.ds
	    FOR looper = 0 TO 7
	        PRINT (CHR$(PEEK(inregs.si + looper)));
	    NEXT
	    DEF SEG
	    PRINT
	    PRINT
	    PRINT "NETWORK NAME(S):"
	    X% = CSRLIN
	    LOCATE X% + 1, 15
	    DEF SEG = inregs.es
	    FOR llooper = 0 TO 63
	        PRINT (CHR$(PEEK(inregs.di + llooper)));
	    NEXT
	    DEF SEG
	END
