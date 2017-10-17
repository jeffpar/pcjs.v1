---
layout: page
title: "Q48871: Invalid Arg Filename Followed By F2 Causes Screen Error"
permalink: /pubs/pc/reference/microsoft/kb/Q48871/
---

## Q48871: Invalid Arg Filename Followed By F2 Causes Screen Error

	Article: Q48871
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.00
	Last Modified: 26-SEP-1989
	
	When trying to read in a file with the Arg Setfile function, an
	improper filename returns an operating system error. If the Microsoft
	editor (M) is in split-screen mode, any horizontal divider bars are
	lost in MEP. The error contains the two following lines, which cause
	the screen to scroll one position erroneously:
	
	   Next filSYS1041: The name specified is not recognized as an
	   internal or external command, operable program, or batch file.
	
	In M, screen integrity is preserved, but the following error is
	returned:
	
	   Bad command or filename.
	
	For example, invoke arg (ALT+A) to start an argument and enter about
	20 or so shifted numbers (e.g. ^&%$&^%$^%$#^%$#^%$@%(^&*(*^&&*), and
	then invoke Setfile (F2).
	
	The screen becomes corrupted and the next keystroke may crash the
	editor with an integer divide by 0 (zero).
	
	Microsoft has confirmed this to be a problem with the Microsoft Editor
	Version 1.00. We are researching this problem and will post new
	information as it becomes available.
