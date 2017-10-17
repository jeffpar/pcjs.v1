---
layout: page
title: "Q67004: L2002 When Creating a Dynamic Link Library"
permalink: /pubs/pc/reference/microsoft/kb/Q67004/
---

## Q67004: L2002 When Creating a Dynamic Link Library

	Article: Q67004
	Version(s): 5.10 5.11
	Operating System: OS/2
	Flags: ENDUSER | buglist5.10 buglist5.11
	Last Modified: 4-DEC-1990
	
	The code sample below produces the following error when compiled and
	linked with the following switches:
	
	cl /c /Gs /Alfu /ML foo.c
	
	link foo.obj, foo.dll,,, foo.def;
	
	Error
	-----
	
	   L2002: fix-up overflow at 2 in segment FOO_TEXT
	    frm seg _DATA, tgt seg _DATA, tgt offset 0
	
	This error is produced when creating a dynamic link library and
	specifying _loadds on function entry (either with the /Au switch or
	the _loadds keyword). If each segment that comprises the default data
	segment is of zero length, the linker will return this error. In
	earlier linkers, the error wasn't generated.
	
	The following are three possible workarounds:
	
	1. If the function does not contain any static data, compile with the
	   option /Aw (DS not reloaded on function entry) and/or remove the
	   _loadds keyword from the function declaration.
	
	2. Turn on stack checking (compile without /Gs option).
	
	3. Declare data so at least one of the segments in DGROUP is not zero
	   length.
	
	   a. For _DATA, declare initialized global or static data.
	
	   b. For _CONST, declare a constant in the program.
	
	   c. For _BSS, declare uninitialized static data.
	
	Microsoft has confirmed this to be a problem in versions 5.10 and
	5.11. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	void foo(int i)
	{
	   char c;
	
	   c=i;
	}
