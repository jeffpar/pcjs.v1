---
layout: page
title: "Q60750: C Compiler and Linker Send Errors to Stdout Not Stderr"
permalink: /pubs/pc/reference/microsoft/kb/Q60750/
---

## Q60750: C Compiler and Linker Send Errors to Stdout Not Stderr

	Article: Q60750
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_util s_pascal h_fortran h_masm docsup docerr
	Last Modified: 19-APR-1990
	
	Current versions of the C compiler and linker send error messages to
	stdout instead of stderr. Use of the ERROUT utility shipped with
	Microsoft C Version 5.10 does not redirect these error messages to a
	file as is suggested in the documentation.
	
	The following example from the Microsoft C Version 5.10 "CodeView and
	Utilities Software Development Tools for the MS-DOS Operating System"
	manual, Page 329, is misleading:
	
	   ERROUT /f C_ERRORS.DOC CL /AL /Zi /Od demo.c
	
	In the above example, the only thing printed in C_ERRORS.DOC is the C
	compiler copyright and version message. Neither the compiler or the
	linker errors appear there. This is not an error in the ERROUT
	utility, nor is it an error in C Version 5.10; it is just a change in
	the way error messages are output from the newer compilers.
	
	This new method of sending error output to stdout allows our products
	to function more easily with third-party editors that check only
	stdout for compiler and linker messages.
	
	Note: The ERROUT utility is designed for use only with executable
	programs and batch files. Attempting to use it on DOS commands, such
	as DIR, usually only results in the failure of the command.
