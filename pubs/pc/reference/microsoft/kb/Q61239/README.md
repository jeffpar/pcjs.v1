---
layout: page
title: "Q61239: C 6.00 README: Notes on &quot;C Reference&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q61239/
---

	Article: Q61239
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 25-APR-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	Notes on "C Reference"
	----------------------
	
	   Page    Note
	   ----    ----
	
	   5       CL (Compiler) /Bx Options
	           -------------------------
	
	           The complete syntax of the /B1, /B2, and /B3 options is as
	           follows:
	
	              /B1 [drive:path]C1L
	              /B2 [drive:path]C2L
	              /B3 [drive:path]C3L
	
	           See online help for further information.
	
	   7       CL (Compiler) /ML Option
	           ------------------------
	
	           The third sentence should read: "The /ML option is
	           functionally equivalent to /ALw /FPa /G2 /D_MT; however,
	           you must specify /ML rather than the expanded equivalent."
	
	   8       CL (Compiler) /MT Option
	           ------------------------
	
	           The second sentence should read: "The /MT option is
	           functionally equivalent to /ALw /FPi /G2 /D_MT; however,
	           you must specify /MT rather than the expanded equivalent."
	
	   34      NAME Statement
	           --------------
	
	           The syntax for the NAME statement in a LINK module-
	           definition file is as follows:
	
	              NAME [appname] [apptype] [NEWFILES]
	
	           The optional attribute NEWFILES specifies that the
	           application supports long filenames and extended file
	           attributes under OS/2 1.2.
	
	           The linker also supports LONGNAMES as a synonym for
	           NEWFILES, although LONGNAMES is now considered obsolete.
	
	   347     The _strtold Function
	           ---------------------
	
	           The _strtold function is not an ANSI function.
