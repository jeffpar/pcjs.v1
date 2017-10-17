---
layout: page
title: "Q26082: QB87 Hang or Bad Numbers When &quot;Divide By Zero&quot; on PC-DOS 3.20"
permalink: /pubs/pc/reference/microsoft/kb/Q26082/
---

## Q26082: QB87 Hang or Bad Numbers When &quot;Divide By Zero&quot; on PC-DOS 3.20

	Article: Q26082
	Version(s): 3.00
	Operating System: MS-DOS
	Flags: ENDUSER | TAR63164
	Last Modified: 10-APR-1989
	
	When floating-point exception error occurs on a machine with a
	coprocessor (8087 or 80287), some programs display improper numeric
	values or hang in QB87.EXE (the coprocessor version of QuickBASIC
	Version 3.00), instead of stopping and displaying a "divide by zero."
	There is a problem in IBM PC-DOS Version 3.20 which can cause this
	problem in QuickBASIC 3.00 (but not in later versions of QuickBASIC
	running on IBM PC-DOS 3.20).
	
	The following is an excerpt from Page Update-7 of the "Microsoft
	QuickBASIC Version 3.00 Update" manual:
	
	   IBM PC-DOS Version 3.20 contains a bug that may cause errors when
	   QB87 programs are run. You can see which version DOS your computer
	   is running by using the DOS VER command.
	
	   If your computer is using IBM PC-DOS Version 3.20, you must install
	   the patch from Disk 2 of the set labeled "For Systems with a Math
	   Coprocessor." The necessary files are in the subdirectory PATCH.
	
	   To install the patch, follow the directions in the file README.DOC
	   in the PATCH subdirectory.
	
	Please note that this patch is not necessary when using QuickBASIC
	3.00 programs under MS-DOS 3.20 -- the patch is only for PC-DOS 3.20.
	
	This patch is specific to QuickBASIC 3.00 and PC-DOS 3.20, and does
	not apply to later versions of QuickBASIC (which are designed to work
	around the problem) or other versions of PC-DOS or MS-DOS.
	
	For QuickBASIC 4.00, 4.00b, or 4.50, a separate article describes a
	different patch necessary (in these versions only) to work around a
	different MS-DOS 3.20 (not PC-DOS) problem handling coprocessor
	floating point exceptions. Query in this KnowledgeBase on the
	following: COPROCESSOR AND 4.00B AND EXCEPTIONS AND PATCH.
