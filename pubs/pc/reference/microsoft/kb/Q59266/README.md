---
layout: page
title: "Q59266: SYS0491/SYS1107 When Running MASM Under OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q59266/
---

## Q59266: SYS0491/SYS1107 When Running MASM Under OS/2

	Article: Q59266
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 29-MAR-1990
	
	When assembling code with the Macro-Assembler in OS/2, there are
	certain files and libraries that need to be included, so that the code
	can be run under OS/2. These include the DOSCALLS.LIB library and the
	OS2.INC include file. Dosexit is called as opposed to the traditional
	int 21h that is used in DOS.
	
	The following is a template of the basics needed to have workable code
	under OS/2:
	
	------------------------------------
	includelib doscalls.lib
	include os2.inc
	dosseg
	      .MODEL [small,medium,large,etc.]
	extrn dosexit:far
	
	{BODY OF SOURCE CODE}
	
	call dosexit
	------------------------------------
	
	A "SYS1107: The system cannot complete the process" will occur if a
	MASM executable is run without the above include libraries and files.
	A "SYS0491: The specified parameter for the session type is not
	correct" error will be generated if a MASM executable file, without
	the above include libraries and files, is brought into CodeView. The
	dosexit replaces the standard DOS int 21h exit that is normal for DOS
	MASM executables. The DOSCALLS.LIB and OS2.INC include files are
	located on the MS OS/2 TOOLS disk that comes with MASM 5.10.
