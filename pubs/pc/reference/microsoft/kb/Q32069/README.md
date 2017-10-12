---
layout: page
title: "Q32069: No Error Message Text"
permalink: /pubs/pc/reference/microsoft/kb/Q32069/
---

	Article: Q32069
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-SEP-1988
	
	You can receive compiler errors with numbers but without text when
	compiling if the error message's file is not present.
	
	To see the error-message text, the files C1.ERR and C23.ERR must be in
	your path. Generally, these two files are placed in the same directory
	as the compiler driver and compiler passes, CL.EXE, C1.EXE, C2.EXE, and
	C3.EXE.
