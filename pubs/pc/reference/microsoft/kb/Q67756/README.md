---
layout: page
title: "Q67756: Use /Ln When Creating .COM Files from Command Line"
permalink: /pubs/pc/reference/microsoft/kb/Q67756/
---

## Q67756: Use /Ln When Creating .COM Files from Command Line

	Article: Q67756
	Version(s): 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc docerr
	Last Modified: 6-FEB-1991
	
	When using the command line version of QuickC with QuickAssembler
	version 2.51 to create a .COM file from a .ASM file, it is necessary
	to specify the /Ln switch to stop the C run time from being linked in.
	If the /Ln switch is not used, the run-time library CRTCOM.LIB is
	added to the link line and the following unresolved external error
	messages will be generated:
	
	   _main
	   __setargv
	   __setenvp
	   __nullcheck
	   __fptrap
	   __acrtmsg
	
	Page 383 of the "Programmer's Guide" for QuickC with QuickAssembler
	doesn't mention this in the example command line.
