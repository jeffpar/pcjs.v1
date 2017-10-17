---
layout: page
title: "Q59409: Trouble with Filenames Containing a Dollar Sign (&#36;)"
permalink: /pubs/pc/reference/microsoft/kb/Q59409/
---

## Q59409: Trouble with Filenames Containing a Dollar Sign (&#36;)

	Article: Q59409
	Version(s): 1.01    | 1.01
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | buglist1.01
	Last Modified: 14-MAR-1990
	
	If you use a filename that contains a dollar sign ($) in a NMAKE
	description file, you can use the escape character (^) to tell NMAKE
	that the dollar sign is part of your filename, not a macro character.
	However, using the escape character within an inline response file
	does not work and you must use the double dollar sign ($$).
	
	Consider the following NMAKE description file:
	
	    all:test^$.exe;
	
	    test^$.obj: test^$.c
	       cl /c test^$.c
	
	    test^$.exe: test^$.obj
	       link @<<
	             test^$.obj,
	             test^$.exe,
	             NUL,;
	    <<
	
	In this file, the escape character (^) is used to tell NMAKE that the
	$ is part of the filename TEST$.* and is not denoting the use of a
	macro. When TEST$.C is compiled, everything works correctly until you
	get to the inline response file for LINK. NMAKE does not interpret the
	^ character, but instead passes it on to LINK.EXE. LINK then tries to
	link TEST^$.OBJ instead of TEST$.OBJ and fails. If you eliminate the ^
	to pass TEST$.OBJ to link, NMAKE fails with an error about an invalid
	macro.
	
	NMAKE is in error here. NMAKE should do one of two things when parsing
	the inline response file.
	
	1. NMAKE should interpret the ^ to leave the $ as part of the filename.
	
	2. NMAKE should ignore the $ so that you can just list TEST$.OBJ
	   because it doesn't make sense to have macros in external response
	   files when parsing an inline response file.
	
	Microsoft has confirmed this to be a problem with NMAKE Version 1.01.
	We are researching this problem and will post new information here as
	it becomes available.
	
	The following are two suggested workarounds:
	
	1. Use an external response file. Then your link line would appear
	   similar to link @FILE.RES and you could put TEST$.OBJ directly in
	   the response file.
	
	2. Use $$ as the escape sequence instead of ^$ in the inline response
	   file. For example, change
	
	      link @<<
	          test^$.obj,
	          test^$.exe,
	          NUL,;
	      <<
	
	   to the following
	
	      link @<<
	          test$$.obj,
	          test$$.exe,
	          NUL,;
	      <<
	
	   and NMAKE will correctly pass TEST$.OBJ to the linker.
