---
layout: page
title: "Q41004: &quot;UNRESOLVED EXTERNAL&quot;; Can't Call External from Quick Library"
permalink: /pubs/pc/reference/microsoft/kb/Q41004/
---

## Q41004: &quot;UNRESOLVED EXTERNAL&quot;; Can't Call External from Quick Library

	Article: Q41004
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890202-70
	Last Modified: 20-DEC-1989
	
	Routines in a Quick library are not allowed to call procedures that
	are external to that Quick library. If you manually execute LINK with
	the /QU option to make a Quick library and you get an "Unresolved
	External" error, then the CALL statement in the Quick library that
	calls that routine is skipped at run time.
	
	This information applies to the QB.EXE editor supplied with QuickBASIC
	Versions 4.00, 4.00b, 4.50, Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and OS/2, and Microsoft BASIC PDS Version 7.00 for
	MS-DOS and MS OS/2.
	
	A Quick library (which has the filename extension .QLB) is essentially
	an executable file, but it cannot be invoked directly from DOS or from
	an .EXE program compiled in BASIC. A Quick library can only be used
	within the QuickBASIC QB.EXE or BASIC PDS 7.00 QBX.EXE environments.
	
	When you manually execute LINK with the /QU option to attempt to make
	a Quick library that tries to CALL a routine that is not in the .OBJ
	list or .LIB library list, then the error message "UNRESOLVED
	EXTERNAL" is properly displayed at LINK time. Despite the "UNRESOLVED
	EXTERNAL" message, the linker still creates a Quick library (.QLB
	file). This Quick library runs properly in the QB.EXE or QBX.EXE
	environment without giving any error messages. However, the CALL
	statement in the Quick library that calls the routine that was
	reported as an "UNRESOLVED EXTERNAL" is skipped at run time.
	
	If you attempt to make a Quick library from inside QB.EXE or QBX.EXE
	(by using the Make Library command on the Run menu), the error message
	"Subprogram not defined" prevents the creation of the Quick library
	that has an "UNRESOLVED EXTERNAL."
	
	The following steps illustrate this limitation:
	
	1. Compile the subprogram TEMP5.BAS as follows:
	
	      BC TEMP5.BAS;
	
	   (Compile with the /Fs (far strings) option if you are using BASIC
	   PDS 7.00, since the QBX.EXE environment always uses far strings).
	
	2. Make the Quick library TEMP5.QLB as follows in QuickBASIC Version
	   4.50:
	
	      LINK TEMP5.OBJ,,,BQLB45.LIB/QU
	
	   (Link with BQLB40.LIB in QuickBASIC Version 4.00; BQLB41.LIB in
	   QuickBASIC Version 4.00b; or QBXQLB.LIB in BASIC PDS 7.00).
	
	3. Invoke the QB.EXE or QBX.EXE editor with the TEMP5.QLB Quick
	   library as follows:
	
	      QB MAIN/L TEMP5
	
	   (Or QBX MAIN /L TEMP5 if using BASIC PDS Version 7.00)
	
	4. When you run the MAIN.BAS program in QB.EXE, the Quick library
	   subroutine TEMP5 attempts to call INMAIN (which is a subprogram
	   in the main program), but the CALL INMAIN statement is skipped. The
	   program successfully continues.
	
	The CALL INMAIN statement runs successfully if you LINK
	MAIN.OBJ+TEMP5.OBJ outside of the editor and run MAIN.EXE from DOS.
	(You can create MAIN.OBJ as follows: BC MAIN.BAS;).
	
	The following is MAIN.BAS:
	
	DECLARE SUB temp4 ()
	PRINT "main"
	CALL temp5
	END
	SUB inmain STATIC
	PRINT "Inside inmain subprogram."
	END SUB
	
	The following is TEMP5.BAS, which is made into a Quick library:
	
	SUB temp5 STATIC
	PRINT "Inside temp5 subprogram"
	CALL inmain  ' This CALL is skipped when run within a Quick Library,
	             ' but works fine if you link the .OBJ file into a .EXE.
	PRINT "End of temp5 subprogram"
	END SUB
