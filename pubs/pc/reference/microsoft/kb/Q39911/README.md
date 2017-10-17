---
layout: page
title: "Q39911: C 5.10 Setup Gives U1203 Error under DOS Versions 2.x"
permalink: /pubs/pc/reference/microsoft/kb/Q39911/
---

## Q39911: C 5.10 Setup Gives U1203 Error under DOS Versions 2.x

	Article: Q39911
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 30-DEC-1988
	
	When running the setup program for C Version 5.10 under DOS Versions 2.x,
	the following error is generated:
	
	   U1203    : invalid object module
	
	This error occurs because the library manager, LIB.EXE, is bound.
	Under DOS Versions 2.x, bound programs can only be run from within the
	current working directory. Giving an fully qualified path will cause
	the error.
	
	Moving LIB.EXE into the current directory may avoid this problem.
	
	More information will be posted as it becomes available.
