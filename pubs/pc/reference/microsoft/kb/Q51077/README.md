---
layout: page
title: "Q51077: &quot;Argument Count Mismatch&quot; If CALL ABSOLUTE DECLARE Not Changed"
permalink: /pubs/pc/reference/microsoft/kb/Q51077/
---

## Q51077: &quot;Argument Count Mismatch&quot; If CALL ABSOLUTE DECLARE Not Changed

	Article: Q51077
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891113-110 B_BasicCom
	Last Modified: 12-DEC-1989
	
	When using CALL ABSOLUTE in a Microsoft BASIC program, the error
	message "Argument Count Mismatch" occurs if parameters are passed to
	the CALLed routine and the DECLARE for CALL ABSOLUTE in QB.BI is not
	changed.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS, and to Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	The following lines appear in the include file QB.BI shipped with
	QuickBASIC Versions 4.00, 4.00b, and 4.50 and Microsoft BASIC Compiler
	Versions 6.00 and 6.00b, and in QBX.BI shipped with Microsoft BASIC
	PDS Version 7.00:
	
	   'Call a routine at an absolute address.
	   'NOTE: If the routine called takes parameters, then they will have to
	   '      be added to this declare statement before the parameter given.
	   DECLARE SUB ABSOLUTE (address AS INTEGER)
	
	This DECLARE statement must be changed if any parameters are passed to
	the CALLed routine. For example, if the CALLed routine was passed two
	parameters as follows
	
	   CALL ABSOLUTE(FirstNumber!, SecondNumber%, VARPTR(AsmProg(1)))
	
	then the DECLARE statement in QB.BI or QBX.BI should be changed to the
	following:
	
	   DECLARE SUB ABSOLUTE(A AS SINGLE, B AS INTEGER, address AS INTEGER)
