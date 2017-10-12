---
layout: page
title: "Q42775: QuickC 2.00 Maximum Identifier Length Is 30 Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q42775/
---

	Article: Q42775
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00 docerr
	Last Modified: 31-MAY-1989
	
	Contrary to what is stated on Page 24 of the "Microsoft QuickC
	Language Reference" manual, QuickC Version 2.00 will truncate
	identifiers of 31 characters or more to a length of 30 characters.
	QuickC 1.01 and C 5.10 properly truncate identifiers to a length of 31
	characters. The incorrect truncation performed by QuickC 2.00 results
	in the following linker error when linking with .OBJ files or
	libraries in which referenced symbols have names of 31 characters or
	more:
	
	   L2029: Unresolved externals:
	
	This may also be the case with code compiled with other versions of
	the Microsoft C compiler. Multiple definition errors may also result
	if identifiers with the first 30 characters in common differ only from
	the 31st character onward.
	
	Microsoft has confirmed this to be a problem in QuickC Version 2.00.
	We are researching this problem and will post new information as it
	becomes available.
