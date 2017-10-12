---
layout: page
title: "Q44928: Linker Options /PADDATA and /PADCODE"
permalink: /pubs/pc/reference/microsoft/kb/Q44928/
---

	Article: Q44928
	Product: Microsoft C
	Version(s): 4.06
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC docerr
	Last Modified: 18-SEP-1989
	
	Question:
	
	I ran the linker Version 4.06 that comes with the Microsoft QuickC
	Compiler Version 2.00 with the /help option as follows:
	
	   LINK /HELP
	
	I noticed two switches for which I couldn't find documentation:
	/PADDATA and /PADCODE. What are these options for?
	
	Response:
	
	The /PADC[ODE]:padsize option causes LINK to add filler bytes to the
	end of each code module. The option is followed by a colon and the
	number of bytes to add. (Decimal radix is assumed, but you can specify
	special octal or hexadecimal numbers by using a C-language prefix.)
	Thus, the following adds an additional 256 bytes to each code module:
	
	   /PADCODE:256
	
	The default size for code-module padding is 0 bytes.
	
	The /PADD[ATA]:padsize option performs a function similar to
	/PADCODE, except that it specifies padding for data segments (or data
	modules, if the program uses small or medium-memory models). Thus,
	the following adds an additional 32 bytes to each data module:
	
	   /PADDATA:32
	
	The default size for data-segment padding is 16 bytes. Note that if
	you specify too large a value for padsize, you may exceed the 64K
	limitation on the size of the default data segment.
	
	These two options are quite useful when used in conjunction with
	QuickC Version 2.00's incremental linking option. Using them correctly
	increases the incremental linking speed of a program.
	
	These two options are documented on Page 64 in the update section of
	the Microsoft C Optimizing Compiler Version 5.10 "CodeView and
	Utilities, Microsoft Editor, Mixed-Language Programming Guide" manual.
