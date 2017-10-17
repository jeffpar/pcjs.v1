---
layout: page
title: "Q42855: Fast Load Format Can Cause &quot;Binding...&quot; Hang in QB.EXE Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q42855/
---

## Q42855: Fast Load Format Can Cause &quot;Binding...&quot; Hang in QB.EXE Editor

	Article: Q42855
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890316-48 buglist4.00 buglist4.00b buglist4.50
	Last Modified: 1-JAN-1990
	
	If your machine hangs in the QB.EXE environment (often with a
	"Binding..." message displayed on the bottom of the screen) when
	trying to run your program, one possible cause is QuickBASIC's Fast
	Load and Save (i.e., Binary) file format.
	
	A workaround is to save in Text Format, reload the program, and run
	again. Other possible causes of a "Binding..." hang are described
	further below.
	
	Microsoft has confirmed this to be a problem with the Fast Load and
	Save format in QuickBASIC Versions 4.00, 4.00b, and 4.50, and with
	QB.EXE included with Microsoft BASIC Compiler Versions 6.00 and 6.00b.
	We are researching this problem and will post new information here as
	it becomes available.
	
	If QB.EXE hangs, and modules are saved in the Fast Load and Save
	format, try the following as a workaround:
	
	1. Save your source file(s) in Text format with Save As... from
	   the File menu in QB.EXE.
	
	2. Exit QuickBASIC.
	
	3. If your program uses multiple modules, delete the file with the
	   .MAK extension (which is created when you save a multiple-module
	   program in QB.EXE 4.x). (Note: This .MAK file is unrelated to the
	   .MAK files used by the Microsoft Program Maintenance Utility,
	   MAKE.EXE.)
	
	4. Run QuickBASIC again.
	
	5. Reopen (Open...) the program from disk, manually Load... any
	   separate module source files (if any), then try to run your
	   program again. The problem should disappear.
	
	Other possible causes of a "Binding..." hang are as follows:
	
	1. Memory-resident software, i.e., terminate-and-stay-resident (TSR)
	   programs
	
	2. Nonstandard device drivers
	
	To find out if your device drivers or TSRs are causing a problem,
	remove them from your AUTOEXEC.BAT and CONFIG.SYS files, reboot, and
	then run QuickBASIC with a "clean" machine. QuickBASIC is sensitive to
	and incompatible with many TSR programs. For an explanation of why,
	query on the following words:
	
	   why and QuickBASIC and TSR and incompatible
	
	The following are other problems in QuickBASIC that cause the
	"Binding..." machine hang, instead of generating an error:
	
	1. $INCLUDE with an unfindable file and line label with more than one
	   space between the line label and the REM or ' (Version 4.50 only)
	
	2. An IF THEN GOTO with an invalid line label (Version 4.00 only)
	
	3. SWAP on fixed-length string fields of user-defined types (Version
	   4.50 only)
	
	For more information, query on the following words:
	
	   binding and hang and QuickBASIC
