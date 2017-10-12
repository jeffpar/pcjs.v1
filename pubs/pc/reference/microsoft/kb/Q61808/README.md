---
layout: page
title: "Q61808: Using &quot;!&quot; and &quot;$?&quot; Do Not Work as Expected with NMAKE 1.11"
permalink: /pubs/pc/reference/microsoft/kb/Q61808/
---

	Article: Q61808
	Product: Microsoft C
	Version(s): 1.11   | 1.11
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.11
	Last Modified: 6-FEB-1991
	
	Applying the "!" (exclamation point) operator to the beginning of a
	command line using the macro "$?" should cause the command to be
	executed once for every out-of-date dependent file. (This is
	documented on Page 108 of the "Advanced Programming Techniques" manual
	included with the Microsoft C Optimizing Compiler version 6.00.)
	
	This feature works correctly in NMAKE version 1.00, but does not work
	as expected in version 1.11. NMAKE version 1.11 is included with the
	Microsoft C Compiler version 6.00.
	
	In version 1.11 of NMAKE, the $? macro evaluates to the list of every
	dependent, regardless of whether it is out of date or not. This is not
	the correct behavior.
	
	To re-create this problem, save the following lines to a file called
	MAKEFILE:
	
	   new.lib: a.obj b.obj c.obj
	       !lib $@-+$?;
	
	Assuming that only a.obj is out-of-date with respect to new.lib, the
	following will be produced upon running NMAKE:
	
	1. NMAKE 1.00:
	
	      lib new.lib-+a.obj;
	
	2. NMAKE 1.11:
	
	      lib new.lib-+a.obj
	      lib new.lib-+b.obj
	      lib new.lib-+c.obj
	
	Example 1 above shows the correct function of the $? macro.
	
	Fortunately, the problem above is easy to fix.  NMAKE performs
	correctly if two colons (::) are placed after the target new.lib on
	the dependency line.  The NMAKE file has been re-written below so that
	the $? macro will work with NMAKE 1.11.
	
	MODIFIED NMAKE FILE
	-------------------
	new.lib::a.obj b.obj c.obj
	   !lib $@-+$?;
	
	The use of the two colons on the dependency line is described on page
	109 of the Advanced Programming Techniques manual included with the
	Microsoft C compiler version 6.00.
	
	Microsoft has confirmed this to be a problem with NMAKE version 1.11.
	The problem has been resolved with later versions of NMAKE.
