---
layout: page
title: "Q43271: C: Cannot Bind Programs with Increased File Handles"
permalink: /pubs/pc/reference/microsoft/kb/Q43271/
---

## Q43271: C: Cannot Bind Programs with Increased File Handles

	Article: Q43271
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-MAY-1989
	
	Microsoft C defaults to making 20 file handles available to an
	application. This is the case for both OS/2 and DOS. This number can
	be increased by modifying the start-up source code provided with
	Optimizing C Version 5.10 and linking in the resulting OBJs. This is
	documented in the README.DOC (search for _NFILE_).
	
	However, it is not possible to bind a program that is linked to these
	modified OBJs. This is because the protect-mode start up makes a call
	to DOSSETMAXFH after being modified. This function is not FAPI (dual
	mode) and is not bindable.
	
	To give a program more than 20 file handles under both OS/2 and DOS,
	you must create separate EXEs for each environment.
	
	An attempt to bind a program that is linked with modified start up will
	produce the following error:
	
	   LINK : error L2029: Unresolved externals:
	
	   DOSSETMAXFH in file(s):
	   BV3.OBJ(bindv3)
	
	The start-up files that must be modified to increase the number of
	available file handles are CRT0DAT.ASM and _FILE.C.
