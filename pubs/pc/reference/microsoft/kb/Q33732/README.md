---
layout: page
title: "Q33732: COM1 and COM2: Communications Device Default Buffer Size"
permalink: /pubs/pc/reference/microsoft/kb/Q33732/
---

## Q33732: COM1 and COM2: Communications Device Default Buffer Size

	Article: Q33732
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 11-JUN-1990
	
	The receive and transmission buffer sizes for COM1 and COM2 default to
	512 bytes in Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50, and
	in Microsoft BASIC Compiler versions 6.00 and 6.00b [and in Microsoft
	BASIC Professional Development System (PDS) version 7.00, as described
	in a separate article].
	
	A sentence under the /C:buffersize option (in the section "Using BC
	Command Options") on Page 210 of the manuals listed below incorrectly
	states the following: "the default receive-buffer size is 256 bytes
	total for both ports." The default receive-buffer size is actually 512
	bytes for both the COM1 and COM2 communications ports. The affected
	manuals are as follows:
	
	1. Page 210 of "Microsoft QuickBASIC 4.0: Learning and Using
	   QuickBASIC" for QuickBASIC 4.00 and 4.00b
	
	2. Page 210 of "Microsoft BASIC Compiler 6.0: Learning and Using
	   QuickBASIC" for Microsoft BASIC Compiler versions 6.00 and 6.00b
	
	The section "Using BC Command Options" on Page 354 of the following
	manual incorrectly states that "the transmission buffer is allocated
	128 bytes for each communications port" and should be changed to say
	that 512 bytes is the default transmission buffer size:
	
	   Page 354 of "Microsoft BASIC 4.5: Programming in BASIC" manual for
	   QuickBASIC version 4.50
	
	Note that the default receive buffer size (512 bytes) is CORRECTLY
	documented in the following places:
	
	1. Page 298 in the "Microsoft QuickBASIC 4.0: BASIC Language
	   Reference" manual for versions 4.00 and 4.00b
	
	   This page correctly documents the RB[n] and TB[n] options for the
	   OPEN COM statement. RB[n] changes the receive buffer size and TB[n]
	   changes the transmission buffer size in the OPEN COM statement. The
	   RB option overrides the receive buffer size specified by the /C
	   option (if any). There is no compile-time option (including /C)
	   that affects the transmission buffer size; TB is instead used in
	   the OPEN COM statement at run time.
	
	2. Page 151 of "Microsoft QuickBASIC 4.5: Learning to Use" manual for
	   version 4.50
	
	3. Page 354 of "Microsoft QuickBASIC 4.5: Programming in BASIC" manual
	   for version 4.50
