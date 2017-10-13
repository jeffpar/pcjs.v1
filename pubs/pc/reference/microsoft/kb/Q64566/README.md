---
layout: page
title: "Q64566: &quot;Cannot Open File current.&#36;&quot; May Mean Incorrect INIT Variable"
permalink: /pubs/pc/reference/microsoft/kb/Q64566/
---

	Article: Q64566
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-DEC-1990
	
	When using the Programmer's Workbench (PWB), the following message may
	appear as a pop-up dialog box when selecting Compile or DOS Shell (or
	OS/2 Shell for OS/2):
	
	   +----- Cannot open file! -----+
	   |   D:\TEST\SRC\X\current.$   |
	   |  No such file or directory  |
	   |-----------------------------|
	   |      < OK >   < Help >      |
	   +-----------------------------+
	
	One cause for this error is an incorrect setting of the INIT
	environment variable. To remedy the situation, exit PWB and make sure
	that the INIT environment variable is set to a valid directory name
	(for example, a directory that exists).
	
	To reproduce this message, set your INIT environment variable to an
	invalid directory, for instance (if a directory named X does not exist
	on your drive):
	
	   SET INIT=X
	
	Then start PWB and try to compile a program. The message will appear
	in the middle of the screen.
	
	One possible reason why your INIT environment variable may be set
	incorrectly, even if your AUTOEXEC.BAT sets it correctly, is that you
	might have run out of environment space in the setting of the
	variable. You can refer to the "MS-DOS Encyclopedia," Article 2, for
	more information about increasing your environment space.
