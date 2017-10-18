---
layout: page
title: "Q47031: .Startup Not Interchangeable with ORG Instruction, Tiny Model"
permalink: /pubs/pc/reference/microsoft/kb/Q47031/
---

## Q47031: .Startup Not Interchangeable with ORG Instruction, Tiny Model

	Article: Q47031
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 26-JUL-1989
	
	Page 80 of the "QuickAssembler Programmer's Guide" implies that the
	.Startup directive in a tiny model program can be readily replaced
	with an ORG 100h instruction. This is not true. The .Startup directive
	does more than just generate an ORG 100h in the tiny memory model. If
	you try to replace .Startup with ORG 100h, you get the following error
	during the link phase:
	
	   LINK : fatal error L2051: start address not equal to 0x100 for /TINY
	
	In all memory models, the .Startup directive generates necessary
	start-up code for the given memory model and stack type. It also
	initializes DS, SS, and SP, as necessary.
	
	Be sure to use .Exit as well as .Startup to avoid other errors.
