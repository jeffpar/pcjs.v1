---
layout: page
title: "Q63235: L4050 Incorrectly Documented in Online Help"
permalink: /pubs/pc/reference/microsoft/kb/Q63235/
---

	Article: Q63235
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr buglist5.10 S_PWB
	Last Modified: 24-JUL-1990
	
	When linking a very small program with /EXEPACK, Microsoft LINKer
	version 5.10 sometimes gives the following error message:
	
	   LINK: warning L4050: file not suitable for /EXEPACK; relink without
	
	The online Help documentation returns the following incorrect
	information:
	
	   LINK warning L4050
	
	   too many public symbols for sorting
	
	   The linker uses the stack and all available memory in the near
	   heap to sort public symbols for the /MAP option. If the number of
	   public symbols exceeds the space available for them, this warning
	   is issued and the symbols are not sorted in the map file but are
	   listed in an arbitrary order.
	
	   Reduce the number of symbols.
	
	The correct documentation for this error (except the number) is as
	follows and can be found in the online Help under L1114:
	
	   Fatal LINK error L1114
	
	   file not suitable for /EXEPACK; relink without
	
	   For the linked program, the size of the packed load image plus
	   packing overhead was larger than that of the unpacked load image.
	
	   Relink without the /EXEPACK option.
	
	Because of its noncritical nature, this LINKer error was changed from
	its previous status of a fatal error to a simple warning in LINK
	version 5.10. The warning associated with L4050 in earlier versions of
	the LINKer will rarely appear in LINK 5.10, but if it does, it will
	have the number L4070.
