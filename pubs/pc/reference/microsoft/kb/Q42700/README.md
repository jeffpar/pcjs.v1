---
layout: page
title: "Q42700: BASIC User-Entry Points Cannot Be Called from Other Languages"
permalink: /pubs/pc/reference/microsoft/kb/Q42700/
---

## Q42700: BASIC User-Entry Points Cannot Be Called from Other Languages

	Article: Q42700
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | docerr B_QuickBas H_MASM S_C S_PasCal H_Fortran
	Last Modified: 8-JAN-1991
	
	The "Microsoft Mixed-Language Programming Guide" is packaged with
	Microsoft C Versions 5.00 and later, Microsoft Pascal Versions 4.00
	and later, Microsoft FORTRAN Versions 4.10 and later, and Microsoft
	Macro Assembler (MASM) Versions 5.00 and later.
	
	On the bottom of Page 39, there is a note that incorrectly states that
	QuickBASIC Version 4.00 provides a number of "user-entry points,"
	which are BASIC system-level functions that may be called directly
	from C, and that the README file provides more information. However,
	there is no information on these "user-entry points" in the README.DOC
	file provided with QuickBASIC Versions 4.00, 4.00b, or 4.50, Microsoft
	BASIC Compiler Versions 6.00 and 6.00b, or Microsoft BASIC
	Professional Development System (PDS) Version 7.00 or 7.10 for MS-DOS
	and MS OS/2. This note should be removed, since there are no such
	user-entry points available.
