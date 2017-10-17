---
layout: page
title: "Q37418: LINK &quot;Cannot Open Response File&quot; When Make EXE File in 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q37418/
---

## Q37418: LINK &quot;Cannot Open Response File&quot; When Make EXE File in 4.50

	Article: Q37418
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50
	Last Modified: 12-JAN-1990
	
	The error "Cannot open response file" can occur if "Make EXE File..."
	in QB.EXE Version 4.50 invokes the Segmented-Executable linker (which
	does not come with QuickBASIC). QuickBASIC versions earlier than 4.50
	do not create a response file for the linker, and link successfully
	without giving this error message. (Note that QuickBASIC Versions 4.00
	and later require at least Version 3.61 of the linker to handle the
	/EX (EXEPACK) option.)
	
	To properly create an .EXE file from within the QuickBASIC Version
	4.50 environment, you must first make sure that the linker found by
	QuickBASIC (either in your search path, or in the executable file path
	specified in QuickBASIC) is the Overlay Linker Version 3.6x.
	
	If the linker found is a version earlier than 3.61, or a Segmented-
	Executable linker such as the one supplied with Microsoft BASIC
	Compiler Versions 6.00 and 6.00b or with Microsoft BASIC PDS Version
	7.00, there may be complications in using "Make EXE File..." from
	within the QuickBASIC Version 4.50 environment. BASIC PDS 7.00 comes
	with the QBX.EXE environment, which contains all of the functionality
	of the QuickBASIC 4.50 environment. Microsoft does not recommend using
	QB.EXE 4.50 or earlier with BASIC PDS 7.00.
	
	In QuickBASIC Version 4.50, the link step of the .EXE file creation is
	performed with the use of a response file. (A response file can be
	used to supply the input to the linker, such as object modules, output
	file name, extra libraries, etc.) QuickBASIC creates a temporary file
	(~QBLNK.TMP) that contains all of the information required by the four
	prompts of the linker (object files, .EXE file name, list file, and
	libraries), then tells the linker to use this file for a response
	file.
	
	This causes a problem with the Segmented-Executable linkers, because
	these linkers have a fifth input prompt (definitions file). Since the
	response file does not satisfy this prompt, the linker waits for you
	to enter a definitions file. You can press ENTER at this prompt, and
	the linker will complete its task.
	
	In addition to asking for a definitions file, the Segmented-Executable
	linker has another difference from the Overlay linker. If a response
	file is inadvertently supplied with a four-character extension (for
	example, RESPONSE.ABCD), the Segmented-Executable linker stops with a
	"Cannot open response file" error message. However, the Overlay linker
	truncates the filename to a three-character extension (for example,
	RESPONSE.ABCD becomes RESPONSE.ABC), and then looks for that file.
	
	Under some circumstances, QuickBASIC Version 4.50 generates an invalid
	file specification for the response file (specifically "~QBLNK.TMPD",
	which has an illegal fourth letter, D, on the name extension). Because
	of the differences between the two linkers, the Overlay linker ignores
	the appended "D" on the response file, and correctly produces an .EXE
	file. However, the Segmented-Executable linker gives a fatal error,
	"Cannot open response file", and aborts.
	
	Microsoft has confirmed this to be a problem in Version 4.50. We are
	researching this problem and will post new information here as it
	becomes available.
	
	The following is a summary of workarounds for this problem:
	
	1. Use the Overlay Linker Version 3.6x.
	
	2. If the response file is found, the .EXE file can be produced by
	   pressing ENTER at the "Definitions file:" prompt. If the response
	   file is NOT found, try renaming your BASIC source file, changing it
	   by a factor of 1 in length (that is, if your source file is an even
	   number of characters long, make it odd, and vice-versa).
	
	3. Compile and link your program from the DOS command line.
