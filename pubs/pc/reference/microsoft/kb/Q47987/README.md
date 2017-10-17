---
layout: page
title: "Q47987: _bios_serialcom Sends and Receives Single Character Data"
permalink: /pubs/pc/reference/microsoft/kb/Q47987/
---

## Q47987: _bios_serialcom Sends and Receives Single Character Data

	Article: Q47987
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr S_QuickC S_QuickASM
	Last Modified: 7-DEC-1989
	
	Question:
	
	In the "Microsoft C for the MS-DOS Operating System: Run-Time Library
	Reference" manual, _bios_serialcom() is documented as taking an
	unsigned integer as the data byte. Since this is 16 bits (large enough
	for two characters), can I pass two characters (or receive two
	characters) with each call to _bios_serialcom()?
	
	Response:
	
	No, _bios_serialcom() sends (and receives) character data. Two
	characters cannot be sent (or received) with one call because the
	function call is a simple interface to the BIOS interrupt 0x14. This
	interrupt expects the data to be sent (or received) to be in the AL
	register (an 8-bit register). Therefore, the data is limited to 8
	bits, even though the function requires an unsigned integer as the
	data parameter.
	
	The parameter is an unsigned integer because the _bios_serialcom()
	function also uses the data parameter in initialization and status
	checks. In the send (and read) functions of the interrupt, however,
	only a single byte in the low-order 8 bits of the unsigned integer
	passed as the data parameter are sent. For more information, see
	interrupt 0x14 in "IBM ROM BIOS" by Ray Duncan. This book clarifies the
	interrupt calls that are being made, and what is actually passed to
	the machine.
	
	This lack of clarification for _bios_serialcom() occurs in the
	documentation for C Versions 5.00 and 5.10; in Microsoft QuickC
	Versions 1.00, 1.01, 2.00, and 2.01; and the QuickC with
	QuickAssembler on-line help Version 2.10.
