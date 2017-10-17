---
layout: page
title: "Q31881: LINK /PAC and /F Options Are Not Supported by BASIC Compiler"
permalink: /pubs/pc/reference/microsoft/kb/Q31881/
---

## Q31881: LINK /PAC and /F Options Are Not Supported by BASIC Compiler

	Article: Q31881
	Version(s): 6.00 6.00b 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | B_QuickBas
	Last Modified: 2-FEB-1990
	
	The /F (far call translation) and /PAC (packcode) options of LINK.EXE
	Version 5.01.20 should not be used with BASIC programs.
	
	The LINK section on Pages 276-278 of the "Microsoft CodeView and
	Utilities: Software Development Tools for MS-DOS" manual states that
	if the /F and /PAC options are used together, slightly faster code and
	smaller executable file size are generated.
	
	This process is performed by directing the linker to group together
	neighboring code segments and by optimizing far CALLs.
	
	However, this information does not apply to BASIC. When you link
	compiled BASIC routines with LINK /F/PAC, the executable .EXE file
	size remains the same as the .EXE file size when linked without these
	options, and speed is not increased.
	
	This information applies to the BC.EXE that comes with QuickBASIC
	Versions 4.00, 4.00b, and 4.50, to Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2.
