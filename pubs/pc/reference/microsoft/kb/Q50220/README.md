---
layout: page
title: "Q50220: QB.EXE 4.50 &quot;String Space Corrupt&quot; Passing Function to .QLB"
permalink: /pubs/pc/reference/microsoft/kb/Q50220/
---

## Q50220: QB.EXE 4.50 &quot;String Space Corrupt&quot; Passing Function to .QLB

	Article: Q50220
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891006-116 buglist4.50 B_BasicCom
	Last Modified: 26-FEB-1990
	
	There is a problem in the QuickBASIC Version 4.50 environment with
	passing a FUNCTION procedure as a parameter to a user-defined function
	that calls a SUBprogram when the FUNCTION and SUBprogram procedures
	are located in a Quick library. A "String space corrupt" error
	displays, and the program returns to DOS. This problem occurs only
	when running the program a second time [using any combination of the
	ALT+R+R (Restart), F8, F5 (ALT+R+N), or SHIFT+F5 (ALT+R+S) (Start)
	keys]. The problem doesn't occur in compiled .EXE programs.
	
	Microsoft has confirmed this to be a problem in the QuickBASIC
	environment (QB.EXE) in Version 4.50. This problem was corrected in
	the QBX.EXE environment of Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00).
	
	You can work around this problem by assigning the value returned by
	the BN$ FUNCTION to a temporary value and passing this temporary value
	when you invoke the FNOPEN% user-defined function (as demonstrated in
	MAIN.BAS below).
	
	The "String space corrupt" error is not generated in any of the
	following cases:
	
	1. If QLIB.BAS (shown below) is loaded as a secondary module instead
	   of as a .QLB (Quick library)
	
	2. When the two modules (shown below) are compiled into an .EXE (using
	   QLIB.LIB or QLIB.OBJ) and run as an .EXE
	
	3. When QuickBASIC Version 4.00 or 4.00b is used
	
	The following programs, MAIN.BAS and QLIB.BAS, demonstrate the
	problem. MAIN.BAS is the module loaded into the environment, and
	QLIB.BAS is the Quick library, which is loaded in with the /L
	invocation switch (for example, QB MAIN /L QLIB).
	
	MAIN.BAS
	--------
	
	DECLARE FUNCTION BN$ (X$)
	DECLARE SUB SOPEN (KAN%, K$, BEST$, RECL%)
	
	DEF FNOPEN% (KAN%, K$, BEST$, RECL%)
	     CALL SOPEN(KAN%, K$, BEST$, RECL%)
	END DEF
	
	CLS : LOCATE 21, 1
	
	'Statement that causes the "String space corrupt" error:
	FS% = FNOPEN%(2, "S", BN$("XXXXACTR"), 256)
	
	'Workaround to eliminate the "String space corrupt" error:
	'TEMP$ = BN$("XXXXACTR")
	'FS% = FNOPEN%(2, "S", TEMP$, 256)
	
	QLIB.BAS
	--------
	
	DECLARE FUNCTION BN$ (X$)
	DECLARE SUB SOPEN (KAN%, K$, BEST$, RECL%)
	FUNCTION BN$ (X$)
	     BN$ = "C:0001" + MID$(X$, 5)
	END FUNCTION
	SUB SOPEN (KAN%, K$, BEST$, RECL%)
	     PRINT BEST$
	END SUB
