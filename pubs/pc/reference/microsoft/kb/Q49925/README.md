---
layout: page
title: "Q49925: CHAIN or RUN from Quick Library Can Hang QuickBASIC Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q49925/
---

## Q49925: CHAIN or RUN from Quick Library Can Hang QuickBASIC Editor

	Article: Q49925
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 20-SEP-1990
	
	When executing a program within the QB.EXE or QBX.EXE (QuickBASIC
	Extended) environment that CALLs a Quick library routine that executes
	a RUN or CHAIN command, the system can hang under either of the
	following two specific conditions:
	
	1. If the program to be CHAINed or RUN does not exist in the current
	   directory, the QuickBASIC editor will hang.
	
	2. If the first program has been changed since being loaded, the
	   QuickBASIC environment will ask if you want to save the current
	   program before loading the program named in the CHAIN or RUN
	   statement. An "OK" or "No" response allows QuickBASIC to load and
	   execute the CHAIN or RUN program correctly. A "Cancel" response
	   causes QuickBASIC to drop to DOS. Attempting to rerun QuickBASIC
	   after the drop to DOS will hang the machine.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	of Microsoft QuickBASIC versions 4.00b and 4.50 and in the QBX.EXE
	environment of Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 (buglist7.00, buglist7.10). We are researching
	this problem and will post new information here as it becomes
	available.
	
	These errors occur with the CHAIN or RUN statement only if it is
	invoked from a Quick library routine. CHAIN and RUN work normally from
	a source program in the QuickBASIC editor or from a compiled EXE
	program.
	
	For information about a separate hanging problem specific only to
	QuickBASIC version 4.00 when executing ANY CHAIN or RUN from a Quick
	library, query in this Knowledge Base on the following words:
	
	   4.00 and CHAIN and Quick and library and hangs
	
	The following set of programs reproduce the problem. QLBERR.BAS should
	be compiled and made into a Quick library, while PROG1.BAS and
	PROG2.BAS should be left as uncompiled source.
	
	To reproduce the first error detailed above, do not create PROG2.BAS
	at all. Instead, create and load the QLBERR.QLB Quick library and
	create and save PROG1.BAS. Executing PROG1.BAS at this point will hang
	QuickBASIC.
	
	To reproduce the second error, start QuickBASIC using the QLBERR.QLB
	Quick library, then load, modify, and execute PROG1. When the dialog
	box asks if you want to save PROG1 before loading and running PROG2,
	select Cancel. QuickBASIC will then drop to DOS.
	
	Code Examples
	-------------
	
	   '               *** QLBERR.BAS ***
	   '       ** Make this into a Quick library **
	   SUB QLBErrSub
	     RUN "PROG2"     'Can also be CHAIN "PROG2"
	   END SUB
	
	   '               *** PROG1.BAS ***
	   '       ** Leave this as source code **
	   PRINT "In program1"
	   CALL QLBErrSub
	   END
	
	   '               *** PROG2.BAS ***
	   '       ** Leave this as source code **
	   PRINT "In Program 2"
	   END
