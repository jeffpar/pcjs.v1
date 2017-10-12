---
layout: page
title: "Q68386: A Workaround for the MGREP Problem in M/MEP Version 1.02"
permalink: /pubs/pc/reference/microsoft/kb/Q68386/
---

	Article: Q68386
	Product: Microsoft C
	Version(s): 1.02   | 1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 29-JAN-1991
	
	In the M/MEP Editor version 1.02, there is a problem in the MGREP
	function; it will fail to find some matches to the query in the file.
	(This is due to certain regular-expression matches failing when they
	shouldn't.) Below is a macro that will use the MEGREP.EXE utility to
	search for a string, and return the results in the compile window. The
	benefits are:
	
	1. It should be faster, especially under OS/2.
	
	2. If run under OS/2, it will be a background process enabling you
	   to continue working.
	
	Macro Code
	----------
	
	Add the following to your TOOLS.INI file. You can then assign it to a
	keystroke, if desired:
	
	megreplist:="*.c *.h"
	mg1:=copy arg "<megrep>" setfile mark emacsnewl mark paste begline
	mg2:="arg arg \"megrep \\\"" endline "\\\" " megreplist
	mg3:=" \" compile" begline arg endline execute setfile
	megrep:= mg1 mg2 mg3
	
	The following is another option, which avoids using an extra
	pseudo-file:
	
	megreplist:="*.c *.h"
	mg:= copy arg "<clipboard>" setfile            \
	     begfile "megrep \"" endline "\" " megreplist  \
	     begline arg arg endline compile setfile
	
	Notes
	-----
	
	1. The first macro is in three parts due to line-length limits of the
	   knowledge base; the macro could be just one line. The second macro
	   uses line continuation characters to achieve the same result as
	   breaking up the first macro.
	
	2. The macro assumes that all files on disk are up to date.
