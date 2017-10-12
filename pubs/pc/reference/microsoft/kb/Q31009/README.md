---
layout: page
title: "Q31009: Protected-Mode C Extensions Fail with "Protection Fault""
permalink: /pubs/pc/reference/microsoft/kb/Q31009/
---

	Article: Q31009
	Product: Microsoft C
	Version(s): 1.00 | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 29-AUG-1988
	
	Problem:
	   I am writing C extensions for the protected mode of OS/2. All my
	extensions fail with a general-protection fault. The sample program on
	Page 85 of the "Microsoft Editor for MS OS/2 and MS-DOS: User's Guide"
	also fails.
	
	Response:
	   Page 78 of the "Microsoft Editor for MS OS/2 and MS-DOS: User's
	Guide" incorrectly states that the second argument is a NULL pointer.
	   The programs are crashing because the incorrect value is being
	passed to the FileNameToHandle routine. This routine requires a
	pointer to a null string, not a null pointer.
	   For example, the following statement
	
	   cfile=FileNameTohandle("",NULL);
	
	should read as follows:
	
	   cfile=FileNameTohandle("","");
