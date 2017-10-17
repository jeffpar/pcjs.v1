---
layout: page
title: "Q37900: Do Not LINK Multiple Modules with /PACKCODE"
permalink: /pubs/pc/reference/microsoft/kb/Q37900/
---

## Q37900: Do Not LINK Multiple Modules with /PACKCODE

	Article: Q37900
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER  | B_BasicCom
	Last Modified: 16-NOV-1988
	
	When developing large programs in QuickBASIC that require multiple
	modules, do not LINK with the /PACKCODE option. This can stop the
	program with the following run-time error on a RESUME NEXT statement
	(when ON ERROR GOTO is used):
	
	   No line number in module <name> at address: <address:offset>
	   Hit any key to return to system
	
	Linking with /PACKCODE may not produce any run-time errors in a
	single-module program.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, and the Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2.
	
	For more information about the /PACKCODE switch, please see the
	section on "Linking object files with LINK" in the "Microsoft CodeView
	and Utilities" manual provided with the BASIC Compiler Versions 6.00
	and 6.00b (or with the Microsoft Macro Assembler Versions 5.x).
	
	The following is a code example:
	
	'<====== Main Module ======>
	DECLARE SUB testsub ()
	CALL testsub
	END
	
	'<====== SUB Module, Separately compiled  ======>
	ErrTrap:
	   PRINT " Error : ", ERR, " trapped in SUB module"
	   PRINT
	   RESUME NEXT
	   END
	SUB testsub STATIC
	    ON ERROR GOTO ErrTrap
	    ERROR 61
	    PRINT "Returned from error routine"
	END SUB
