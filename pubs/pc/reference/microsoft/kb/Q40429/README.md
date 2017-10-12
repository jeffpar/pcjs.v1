---
layout: page
title: "Q40429: Example of Using a Response File with LINK"
permalink: /pubs/pc/reference/microsoft/kb/Q40429/
---

	Article: Q40429
	Product: Microsoft C
	Version(s): 3.65   | 5.01.20
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 20-JAN-1989
	
	The following is a small example of using a response file with LINK.
	
	A response file contains responses to the LINK prompts. The responses
	must be in the same order as the LINK prompts.
	
	LINK treats the input from the response file just as if you had
	entered it in response to prompts or in a command line. It treats any
	carriage-return-linefeed combination in the response file the same as
	if you had pressed the ENTER key in response to a prompt or included a
	comma in a command line.
	
	Note: You cannot put comments in response files.
	
	The following is an example of a file named RESPONSE.ONE:
	
	file1 file2 file3 file4
	/pause /map
	filelist
	graphics.lib
	
	Type the following at the command line:
	
	   LINK @response.one
