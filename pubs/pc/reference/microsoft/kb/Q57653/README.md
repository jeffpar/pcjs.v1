---
layout: page
title: "Q57653: U1013 Link: Error 2: Not Enough Memory for Exec in M"
permalink: /pubs/pc/reference/microsoft/kb/Q57653/
---

## Q57653: U1013 Link: Error 2: Not Enough Memory for Exec in M

	Article: Q57653
	Version(s): 1.00 1.02
	Operating System: MS-DOS
	Flags: ENDUSER | s_nmake s_make
	Last Modified: 23-JAN-1991
	
	Question:
	
	In DOS, I am spawning either MAKE or NMAKE within the Microsoft Editor
	(M), and I receive an error message from the Editor on the status line
	saying "U1013 : Link file.obj: Error 2." What does this error mean and
	how do I get around it?
	
	Response:
	
	The U1013 error means that one of the procedures called by MAKE or
	NMAKE returned a nonzero error code. In this case, the error can be
	understood as M's equivalent of a "Not enough memory for exec" error,
	meaning that there is not enough memory for the parent process to
	execute a child process. The error typically occurs when you spawn
	either MAKE or NMAKE from within the Editor, the compilation is
	complete, and the link process is beginning.
	
	If you receive this error, you may be able to free up memory by
	removing any TSRs and unnecessary device drivers. However, the best
	workaround would be to use MAKE or NMAKE to link your file outside of
	M, because M will have problems exec'ing the linker in any sizable
	application due to the size of LINK and MAKE.
