---
layout: page
title: "Q40236: LINK4 Is Not Included in C 5.10 or MASM 5.10 Packages"
permalink: /pubs/pc/reference/microsoft/kb/Q40236/
---

	Article: Q40236
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | h_masm PMWIN
	Last Modified: 13-JAN-1989
	
	LINK.EXE, the incremental linker provided with the Windows Software
	Development Kit for DOS, is not included with C Version 5.10 or MASM
	Version 5.10, contrary to the statement on Page 82 of the January 1989
	issue of the "Microsoft Systems Journal."
	
	A bound linker, LINK.EXE Version 5.01.20, which may be used under DOS
	or OS/2, comes with MASM Version 5.10 as well as the real-mode linker
	Version 3.64 for DOS only. The C Version 5.10 retail package comes with
	the bound linker Version 5.01.21 and the real-mode linker Version
	3.65.
	
	To link under OS/2, use the bound linker with the latest version
	number you have available. To prepare for incremental linking with the
	ILINK.EXE utility under OS/2, use LINK.EXE with the option /INC. See
	the C Version 5.10 "Update (CodeView and Utility)" section of the
	"Microsoft C 5.1 Optimizing Compiler CodeView and Utilities" manual,
	or the "Microsoft Macro Assembler 5.1 Updates and Microsoft Editor"
	manual for more information on incremental linkage and the ILINK.EXE
	utility.
	
	LINK with /INC and ILINK have failed to work correctly for Windows
	program development under DOS, contrary to our documentation. DOS
	Windows developers should use LINK4, which comes with the Windows SDK.
	
	The ILINK utility should only be used under OS/2 for creating OS/2
	programs.
