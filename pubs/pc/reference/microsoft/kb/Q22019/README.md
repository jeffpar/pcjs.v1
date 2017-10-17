---
layout: page
title: "Q22019: XON/XOFF Communications Protocol Not Supported in QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q22019/
---

## Q22019: XON/XOFF Communications Protocol Not Supported in QuickBASIC

	Article: Q22019
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 17-JAN-1991
	
	The XON/XOFF handshaking protocol of the ASC option of the OPEN COM
	statement is not implemented in any version of QuickBASIC (including
	versions 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50), in Microsoft BASIC
	Compiler version 6.00 or 6.00b for MS-DOS, or in Microsoft BASIC
	Professional Development System (PDS) version 7.00 or 7.10 for MS-DOS.
	
	Except for XON/XOFF protocol, the other features of the ASC option of
	the OPEN COM statement work properly. During communications, the ASC
	option expands tabs to spaces, forces carriage returns at the
	end-of-line, treats CTRL+Z (ASCII value 26) as the end-of-file flag,
	and transmits CTRL+Z when you CLOSE the communications channel.
	
	When you OPEN the COM1 or COM2 communications port and specify the ASC
	option, XON and XOFF bytes have no effect. A program will continue to
	transmit and pass all received XON and XOFF characters to the program
	without halting or resuming transmission. This behavior occurs because
	the XON/XOFF handshaking protocol of the ASC option of the OPEN COM
	statement is not implemented.
	
	The sentence saying "XON/XOFF protocol is enabled" should be deleted
	in the documentation for the ASC option of the OPEN COM statement in
	the following manuals:
	
	1. Page 375 of the "Microsoft QuickBASIC Compiler" manual for
	   QuickBASIC versions 2.x and 3.00
	
	2. Page 297 of the "Microsoft QuickBASIC 4.0: BASIC Language
	   Reference" manual for QuickBASIC versions 4.00 and 4.00b
	
	3. Page 297 of the "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" manual for versions 6.00 and 6.00b
	
	This documentation error has been corrected in the documentation for
	Microsoft QuickBASIC 4.50 and the BASIC Professional Development
	System (PDS) for MS-DOS and MS OS/2.
	
	Additional Background Information
	---------------------------------
	
	XOFF is also known as CTRL+S, which is a character with an ASCII
	value of 19. CTRL+S tells a device or program that knows XON/XOFF
	protocol to stop transmission.
	
	XON is also known as CTRL+Q, which is a character with an ASCII value
	of 17. CTRL+Q tells a device or program that knows XON/XOFF protocol
	to continue transmission.
	
	The CTRL+S (XOFF) and CTRL+Q (XON) bytes pass without special handling
	through devices or programs that do not support the XON/XOFF
	communications protocol. While it is possible to write a BASIC program
	that checks every character for XON or XOFF and then programmatically
	starts or stops communications, such a program is unlikely to be as
	reliable as the XON/XOFF handshaking that is built into dedicated
	commercial communications software or hardware packages.
