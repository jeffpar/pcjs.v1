---
layout: page
title: "Q45724: Link Error L1005: /PACKCODE: Packing Limit Exceeds 65,536"
permalink: /pubs/pc/reference/microsoft/kb/Q45724/
---

## Q45724: Link Error L1005: /PACKCODE: Packing Limit Exceeds 65,536

	Article: Q45724
	Version(s): 3.65
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 21-JUN-1989
	
	The Microsoft Overlay Linker Version 3.65 presents the following error
	message when the /PACKCODE: switch is used with a value greater than
	65,536 (64K):
	
	   Link Fatal Error L1005:
	
	No error message text is supplied, and the error cannot be referenced
	in the Microsoft C 5.10 "CodeView and Utilities, Microsoft Editor,
	Mixed-Language Programming Guide." The error message should read as
	follows:
	
	   Link Fatal Error L1005: /PACKCODE: Packing Limit Exceeds 65,536
	
	The error is reported correctly by the Microsoft QuickC Linker Version
	4.06 and all 5.0x versions of the Microsoft Segmented-Executable
	Linker. It is correctly documented in the Version 2.00 "Microsoft
	QuickC Tool Kit," on Page 278, and on Page 373 of the Version 5.00
	"Microsoft FORTRAN, Microsoft CodeView and Utilities User's Guide"
	manual, as follows:
	
	   The value supplied with the /PACKCODE option exceeds the limit of
	   65,536 bytes.
