---
layout: page
title: "Q40235: M Hangs if the textarg Given to ArgCompile Is Incomplete"
permalink: /pubs/pc/reference/microsoft/kb/Q40235/
---

## Q40235: M Hangs if the textarg Given to ArgCompile Is Incomplete

	Article: Q40235
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	If you want to compile a program inside the M editor using the
	following command, textarg should contain the full compile line as
	typed at the DOS prompt:
	
	   Arg Arg textarg ArgCompile
	
	The following is an example:
	
	   cl /Zi /Od demo.for
	
	If textarg contains just the name of the program (demo), the hard disk
	light will come on and the message "compilation complete" will appear
	on the bottom of the screen even though demo.for was not compiled.
	
	If textarg contains the full program name (demo.for), your computer
	hangs if you press SHIFT+F3. Sometimes, there will be lost clusters
	and allocation errors as reported by chkdsk.
	
	This problem was not encountered under OS/2.
