---
layout: page
title: "Q37304: LIB Errors During SETUP.EXE If Directory Has &quot;-&quot; in Its Name"
permalink: /pubs/pc/reference/microsoft/kb/Q37304/
---

## Q37304: LIB Errors During SETUP.EXE If Directory Has &quot;-&quot; in Its Name

	Article: Q37304
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 7-FEB-1990
	
	If you specify a library directory name that contains a minus sign
	(such as LIB-BAS) during the SETUP.EXE program for Microsoft BASIC
	Compiler Version 6.00 or 6.00b, or Microsoft BASIC Professional
	Development System (PDS) Version 7.00, the LIB.EXE manager may have
	problems creating the BASIC stand-alone and run-time libraries.
	
	This problem occurs because when the Library Manager (LIB) is run from
	the SETUP program, it uses the pathname to your library directory in
	its "Operations:+" step and is confused by an operator (such as "-")
	in the directory name.
	
	For example, if you specified the directory name C:\LIB-BAS for your
	BASIC libraries, a library build would look like the following:
	
	   Microsoft (R) Library Manager  Version 3.11
	   Copyright (C) Microsoft Corp 1983-1988.  All rights reserved.
	
	   Library name:BRUN60ER.LIB
	   Library does not exist.  Create? (y/n) Y
	   Operations:+ C:\LIB-BAS\BRUN60R.LIB
	   LIB : error V2155: BAS\BRUN60ER.LIB : module not in library; ignored
	   &
	   Operations:+ .\B4 ;
	   LIB : error V2157: C:\LIB.obj : cannot access file
	
	The LIB thinks the "-" character in the LIB-BAS directory is an extra
	operation trying to subtract BAS\BRUN60ER.LIB. It then tries to add a
	file called C:\LIB.obj, which does not exist.
	
	Then, when trying to compile a BASIC program and link it with the
	BRUN60ER.LIB library, the compile will seem to work correctly, but the
	link can return errors, such as the following:
	
	   LINK : warning L4021: no stack segment
	   LINK : error L2029: Unresolved externals:
	     < here would be a list of the unresolved library references >
	
	If you avoid the following operators in the directory name for BASIC
	libraries, the LIB shouldn't have any problems initially creating the
	libraries:
	
	   +  -  -+  *  -*
