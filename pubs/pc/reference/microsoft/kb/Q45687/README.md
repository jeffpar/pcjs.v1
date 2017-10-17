---
layout: page
title: "Q45687: &quot;Out of String Space&quot; Concatenating Variable-Length String"
permalink: /pubs/pc/reference/microsoft/kb/Q45687/
---

## Q45687: &quot;Out of String Space&quot; Concatenating Variable-Length String

	Article: Q45687
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890606-8 B_BasicCom
	Last Modified: 28-DEC-1989
	
	For variable-length string concatenation to execute successfully, even
	if only 1 byte is to be added, there must be enough available memory
	[reported by FRE("")] for the length of a copy of the existing string,
	plus the length of the string being added, plus its new 4-byte string
	descriptor. Otherwise, you will get an "Out of String Space" error,
	caused by the temporary old string remaining in memory during the
	string concatenation. The old string is deallocated only after a
	successful concatenation.
	
	This information applies to QuickBASIC Versions 1.00, 1.01, 1.02,
	2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50, and to BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and OS/2.
	
	This information also applies to Microsoft BASIC PDS Version 7.00 when
	using BC.EXE without the /Fs compiler switch. Inside the QBX.EXE
	environment and when using /Fs compiler switch, BASIC 7.00 uses a 64K
	segment for temporary string storage and procedure-level strings (that
	is, strings declared inside subroutines). To see how much temporary
	string space you have when using far strings, use FRE("StringLiteral"),
	where StringLiteral is any constant string (for example, "Hello"). For
	more information about far strings, read Chapter 11 in the "Microsoft
	BASIC 7.0: Programmer's Guide" for BASIC PDS Version 7.00.
	
	When you concatenate a variable-length string with another string in
	BASIC, a new 4-byte string descriptor is created. A copy of the
	original string is moved to a new location in string space and the
	string to be concatenated is appended to it. The length field in the
	new string descriptor is updated to reflect the length of the
	concatenated string. Only then is the memory used by the original
	string and its descriptor released (deallocated).
	
	New strings are allocated above existing strings and deallocated
	strings in DGROUP. When deallocated strings fragment string space to
	the point where a new string fills the last space at the top of
	DGROUP, BASIC automatically performs string space compaction (garbage
	collection) to make free string space contiguous again. Passing a
	string argument (such as "", the null string) to the FRE("") function
	always forces string space compaction before reporting the amount of
	string space available in DGROUP.
	
	For example, assume FRE("") returns 20,004. An attempt to add a single
	byte to an existing string of 20,000 bytes would fail because 20,005
	bytes are needed for the concatenation to be successful:
	
	   Existing string   = 20,000 bytes
	   String to add     =      1 byte longer
	   String descriptor =      4 bytes
	                    -----------
	   Memory needed       20,005 bytes
	
	Because only 20,004 bytes of memory are available, an "Out of String
	Space" message will be generated.
