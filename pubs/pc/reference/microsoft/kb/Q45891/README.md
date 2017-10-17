---
layout: page
title: "Q45891: QuickBASIC Can Corrupt COMSPEC under PC-DOS 3.30, Maybe Hang"
permalink: /pubs/pc/reference/microsoft/kb/Q45891/
---

## Q45891: QuickBASIC Can Corrupt COMSPEC under PC-DOS 3.30, Maybe Hang

	Article: Q45891
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50
	Last Modified: 26-JUN-1989
	
	Under certain circumstances, it is possible for the DOS COMSPEC
	variable to become corrupted, and consequently, the system may hang.
	The circumstances vary among different versions of DOS. For example,
	it has been reported and confirmed to be a problem with PC-DOS Version
	3.30. That is, the problem does not occur (under these circumstances)
	in other versions of PC-DOS or even MS-DOS.
	
	Microsoft has confirmed this to be a problem with Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50 and Microsoft BASIC Compiler Versions
	6.00 and 6.00b. We are researching this problem and will post new
	information as it becomes available.
	
	The steps required to make the program below corrupt the COMSPEC
	variable are as follows:
	
	1. Compile and LINK the example into an .EXE using QuickBASIC Version
	   4.50.
	
	2. Reboot with PC-DOS Version 3.30.
	
	3. Execute the .EXE version of program.
	
	4. Set an environment variable at the DOS prompt (e.g. SET FOO=A:NEWCOM).
	
	5. Enter the QuickBASIC editor.
	
	6. Immediately exit the editor, and the following message will appear:
	
	      "Insert disk with newcom in drive A
	       and strike any key when ready"
	
	This error can also be achieved by POKEing a 7 into 9F86:0008, the
	address assigned in the offending statement.
	
	Code Example
	------------
	
	CALL TEST
	
	' MakeSound IS NOT CALLED; ONLY REQUIRED TO FORCE StringArr
	' IN SUB Test TO BE ALLOCATED AT THE PROPER ADDRESS (9F86:0000).
	SUB MakeSound
	   SOUND 880, 10
	END SUB
	
	SUB Test
	      ' IntArr IS ONLY DECLARED TO INSURE THAT StringArr IS
	      ' ALLOCATED
	      ' AT THE PROPER ADDRESS
	   DIM IntArr(0 TO 794) AS INTEGER
	   DIM StringArr(0 TO 4) AS STRING * 13  'Address 9F86:0000
	
	      ' THIS IS THE OFFENDING STATEMENT -- can be any character
	   MID$(StringArr(0), 9, 1) = CHR$(7)    'Address 9F86:0008
	
	      ' StringArr ADDRESS IS PRINTED OUT FOR DIAGNOSTIC PURPOSES.
	   PRINT "StringArr ADDRESS = " HEX$(VARSEG(StringArr(0))) ":" _
	                                HEX$(VARPTR(StringArr(0)))
	END SUB
	
	Additional reference words: SR# S890511-152 B_BasicCom
