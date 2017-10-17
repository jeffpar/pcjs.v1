---
layout: page
title: "Q46720: VARPTR(#filenumber) Not Supported in QB 4.x or BC 6.00, 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q46720/
---

## Q46720: VARPTR(#filenumber) Not Supported in QB 4.x or BC 6.00, 7.00

	Article: Q46720
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 14-DEC-1989
	
	Instead of passing the file number (#n) to the VARPTR function for a
	random access file, you may use VARPTR to take the address of the
	first variable defined in the FIELD statement to return the address of
	the FIELD buffer.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS, and to Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	In QuickBASIC Versions 2.00, 2.01, and 3.00, the VARPTR function can
	be passed the file number (#n) of a previously OPENed file. For
	sequential access files, VARPTR(#n) then returns the starting address
	of the disk I/O buffer assigned to that file number. For random access
	files, VARPTR(#n) returns the address of the FIELD buffer assigned to
	that file number.
	
	In QuickBASIC Versions 4.00, 4.00b, and 4.50 (and in the BASIC
	compiler Versions 6.00 and 6.00b and BASIC PDS 7.00), you cannot use
	VARPTR with a file number (#n) as an argument. This feature has been
	eliminated. You can now use the FILEATTR function, which returns the
	BASIC access mode and the DOS file handle, which may be useful for DOS
	file interrupts.
