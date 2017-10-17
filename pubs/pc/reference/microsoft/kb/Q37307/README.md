---
layout: page
title: "Q37307: Conditionally Loading QBHERC Hercules Support from QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q37307/
---

## Q37307: Conditionally Loading QBHERC Hercules Support from QuickBASIC

	Article: Q37307
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	You will encounter some limitations if you wish to conditionally load
	QBHERC.COM or MSHERC.COM from within a QuickBASIC program.
	
	The only way to invoke QBHERC.COM or MSHERC.COM from within a
	QuickBASIC program is with the SHELL statement. QBHERC.COM and
	MSHERC.COM are terminate-and-stay resident (TSR) graphics drivers. TSR
	programs will fragment MS-DOS memory when loaded with the SHELL
	statement. You can only unfragment the memory by rebooting the
	computer. Fragmentation can drastically reduce the memory available to
	subsequent programs run in MS-DOS. This fragmentation problem can be
	serious, and it is best to avoid SHELLing to QBHERC.COM or MSHERC.COM
	or any TSR program.
	
	Note that the BASIC run-time routines must know at initialization time
	(that is, when the program is started) whether or not QBHERC.COM or
	MSHERC.COM has been loaded. This means a program (or batch file) that
	loads QBHERC.COM or MSHERC.COM must RUN or CHAIN (or invoke) the .EXE
	program that will use Hercules graphics.
	
	This information applies to Microsoft QuickBASIC 4.00, 4.00b, and
	4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to
	Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	The following is a possible scenario for conditionally executing
	QBHERC.COM or MSHERC.COM:
	
	1. Run a batch file that starts an assembler program that tests if a
	   Hercules card is installed.
	
	2. Test to see if a Hercules graphics card is installed, and pass this
	   information back to the batch file by using batch ERRORLEVEL (or
	   information written in a text file). (Note that a QuickBASIC
	   program does not let you return ERRORLEVELs to batch files, because
	   it always resets the ERRORLEVEL to zero for normal termination.)
	
	3. If necessary, invoke QBHERC.COM from the batch file.
	
	4. Invoke the QuickBASIC QB.EXE program. The compiler's run-time
	   system now reinitializes to take advantage of QBHERC.COM or
	   MSHERC.COM, which is now resident in memory.
	
	Normally you would run QBHERC.COM or MSHERC.COM manually or from a
	batch file before invoking a graphics program that takes advantage of
	SCREEN 3 on a computer with a Hercules graphics adapter installed.
	
	Hercules support was introduced in QuickBASIC Version 4.00. For more
	information, please see the README.DOC file for QuickBASIC Versions
	4.00 and 4.00b.
