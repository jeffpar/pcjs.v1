---
layout: page
title: "Q67147: BASIC Files Limited to 32 MB Without DOS 4.00/4.01 Patch"
permalink: /pubs/pc/reference/microsoft/kb/Q67147/
---

## Q67147: BASIC Files Limited to 32 MB Without DOS 4.00/4.01 Patch

	Article: Q67147
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901107-113 B_BASICCOM
	Last Modified: 5-DEC-1990
	
	QuickBASIC or other programs that use file I/O (Input/Output) may give
	incorrect results when accessing files larger than 32 megabytes (MB)
	under MS-DOS versions 4.00 and 4.01. (MS-DOS 4.00 and later introduce
	the capability for file sizes larger than 32 MB.) This is a problem
	with MS-DOS 4.00 and 4.01, and can be corrected with a program called
	PATCH32M available in the Software/Data Library and as an application
	note from Microsoft.
	
	This information applies to Microsoft QuickBASIC versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50; to Microsoft BASIC Compiler versions 6.00
	and 6.00b for MS-DOS; and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	Under DOS 4.00 and 4.01, when you append to files larger than 32
	megabytes in length, BASIC's LOF function returns incorrect values for
	the file length. Specifically, if you write to a random-access file,
	and the size moves past the 33,554,432 byte (32 MB) boundary, the file
	size given by MS-DOS's DIR command and BASIC's LOF function may remain
	at the last even record boundary below 33,554,432 bytes. However, the
	file will be written properly, and a CHKDSK /F followed by a DIR will
	return the correct size.
	
	This is a problem in MS-DOS versions 4.00 and 4.01, and can be
	corrected by running the patch program PATCH32M.EXE available in the
	Software/Data Library. For information on how to obtain PATCH32M.EXE,
	search in the Software/Data Library for the word PATCH32M.
	
	Additional information may be found by querying in the Microsoft
	Knowledge Base on the following words:
	
	   DOS and 4.01 and 32 and MB
