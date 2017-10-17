---
layout: page
title: "Q63782: &quot;Permission Denied&quot; If SHELL to 7.00 .EXE Using ISAM from TSR"
permalink: /pubs/pc/reference/microsoft/kb/Q63782/
---

## Q63782: &quot;Permission Denied&quot; If SHELL to 7.00 .EXE Using ISAM from TSR

	Article: Q63782
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900702-42 buglist7.00 buglist7.10
	Last Modified: 2-NOV-1990
	
	If you SHELL from one program that uses ISAM to another ISAM program
	that uses the PROISAM.EXE or PROISAMD.EXE terminate-and-stay-resident
	(TSR) program, a "Permission Denied" error occurs when the OPEN
	statement is executed in the child (SHELLed) process (see Example 2
	below). This problem does not occur when ISAM support is linked into
	the .EXE programs instead of using the TSR program.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10. We are
	researching this problem and will post new information here as it
	becomes available.
	
	To work around this problem, use a CHAIN statement instead of SHELL,
	or LINK ISAM support to your .EXE instead of using the ISAM TSR
	program.
	
	In addition, SHELLing to the ISAM utilities (ISAMIO.EXE, ISAMCVT.EXE,
	ISAMREPR.EXE, or ISAMPACK.EXE) may generate unusual error messages,
	because they are not designed to be SHELLed; this is not a software
	problem but is a design limitation. For example, ISAMPACK.EXE fails
	with the message "Unknown error number." A workaround is shown below
	in Example 1.
	
	Note that the SETUP.EXE program for BASIC PDS 7.00 and 7.10 lets you
	choose one of the following four ISAM support options for compiled
	.EXE programs:
	
	1. ISAM Routines in TSR
	2. ISAM Routines in LIB, Support Database Creation and Access
	3. ISAM Routines in LIB, Support Database Access Only
	4. No ISAM support
	
	Only Option 1 creates PROISAM.EXE and PROISAMD.EXE TSR programs that
	can be used with BASIC compiled .EXE programs. The TSR program created
	in Option 1 can also be used in QBX.EXE. Options 2 and 3 create
	PROISAM.EXE and PROISAMD.EXE TSR programs that CANNOT be used in
	compiled .EXE programs, and that can only be used by QBX.EXE and the
	ISAM utilities (ISAMIO.EXE, ISAMCVT.EXE, ISAMREPR.EXE, and
	ISAMPACK.EXE). Options 2 and 3 create .LIB libraries for linking ISAM
	support into your .EXE programs. The fourth SETUP option does not copy
	any ISAM-related files onto your computer.
	
	A problem occurs whenever a SHELLed (child) process attempts to access
	the PROISAM or PROISAMD TSR program. Specifically, the problem occurs
	when you SHELL to an ISAM utility (which requires the TSR program --
	see Example 1), or SHELL to a BASIC .EXE program that requires the
	ISAM TSR (see Example 2).
	
	Example 1
	---------
	
	Because the ISAM utilities (ISAMIO.EXE, ISAMCVT.EXE, ISAMREPR.EXE, or
	ISAMPACK.EXE) require the ISAM TSR program, the best way to work
	around the SHELLing problem is to link the BASIC .EXE (the parent
	process that executes the SHELL) to the ISAM .LIB, and then SHELL to
	an MS-DOS batch (.BAT) file that loads the TSR program, executes the
	ISAM utility, and then unloads the TSR program. The following is an
	example of this type of batch file:
	
	   REM  Start PACK.BAT
	      PROISAMD
	      ISAMPACK isamfile.dat
	      PROISAMD /D
	   REM  End PACK.BAT
	
	Example 2
	---------
	
	The following program (when SHELLed to itself or any other program
	that OPENs any ISAM file) will cause a "Permission Denied" error in
	the SHELLed copy:
	
	   ' ISAMTEST.BAS
	   TYPE test
	     x AS INTEGER
	   END TYPE
	   OPEN "test" FOR ISAM test "test" as #1
	   CLOSE #1
	   INPUT "Do you want to shell?", a$
	   IF a$="Y" THEN SHELL "ISAMTEST"    ' Put the name of this .EXE here.
	   END
	
	Compile and link this program as follows:
	
	   BC ISAMTEST.BAS;   (BC compile options don't affect the problem)
	   LINK ISAMTEST;
	
	To duplicate the problem, run the PROISAM.EXE or PROISAMD.EXE TSR
	program, then run the above program. To work around the problem, link
	ISAM support to the program instead of using the ISAM TSR program, or
	use CHAIN instead of SHELL.
	
	Note that if you chose the "ISAM routines in TSR" option during
	SETUP.EXE and also retained component files during SETUP.EXE, there is
	a special way to LINK ISAM support into your stand-alone .EXE program,
	as described in a separate article, which can be found by using the
	following query in this Knowledge Base:
	
	   LINK and ISAM and component and even and SETUP and TSR
