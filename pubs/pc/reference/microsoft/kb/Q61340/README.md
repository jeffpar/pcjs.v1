---
layout: page
title: "Q61340: Watchpoints Set at Module Level Won't Break in a SUBprogram"
permalink: /pubs/pc/reference/microsoft/kb/Q61340/
---

## Q61340: Watchpoints Set at Module Level Won't Break in a SUBprogram

	Article: Q61340
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900415-5 B_BasicCom
	Last Modified: 2-MAY-1990
	
	Watchpoints put on variables (which are set in QuickBASIC's Debug
	menu) have a local scope. That is, you must reset the watchpoint on a
	variable in each SUBprogram or FUNCTION, even if the variable is in a
	SHARED or COMMON SHARED statement. This is by design.
	
	If you add a watchpoint in the module-level code of a shared variable,
	and a SUBprogram or FUNCTION changes the variable so the watchpoint
	should break, the program will not break until the SUBprogram or
	FUNCTION returns to the module-level code.
	
	This information applies to the QB.EXE environment in QuickBASIC
	versions 4.00, 4.00b, and 4.50, and to the QBX.EXE environment of
	Microsoft BASIC Professional Development System (PDS) version 7.00.
	
	The following program, when run in the QuickBASIC or QuickBASIC
	Extended environment, demonstrates that watchpoints are local:
	
	   DECLARE SUB test ()
	   COMMON SHARED a
	   a = 0
	   CALL test
	   PRINT "After call"
	   END
	
	   SUB test
	      a = 3
	      PRINT "in sub - does not break"
	   END SUB
	
	To demonstrate this, set a watchpoint on "a<>0" (to break when the
	variable "a" changes from being zero). When the program is run, the
	watchpoint will not activate until control is returned to the
	module-level code. The program will break on the line "PRINT 'After
	call'," even though the value of variable "a," was changed in the
	SUBprogram.
