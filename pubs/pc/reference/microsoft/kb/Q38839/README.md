---
layout: page
title: "Q38839: %TMP% in NEW_VARS.BAT Causes Fatal Error C1042"
permalink: /pubs/pc/reference/microsoft/kb/Q38839/
---

	Article: Q38839
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_pascal h_fortran
	Last Modified: 12-DEC-1988
	
	If you append new_vars.bat to your AUTOEXEC.BAT and your TMP
	environment variable is already set for specifying the drive,
	directory compiler, and linker to which temporary files should be
	written, %TMP% causes the following error message:
	
	   Fatal-Error C1042: cannot open intermediate file -- no
	                      such file or directory.
	
	This message occurs because the TMP variable should specify only one
	directory.
	
	%TMP% appends any TMP directories already defined at that location.
	Generally, it is best not to have any %<environmental variable>%
	symbols in AUTOEXEC.BAT because it should be the first place the
	environment is defined.
