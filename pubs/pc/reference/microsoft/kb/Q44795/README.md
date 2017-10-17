---
layout: page
title: "Q44795: CLEAR Causes &quot;Illegal Function Call&quot; after RETURN &lt;linelabel&gt;"
permalink: /pubs/pc/reference/microsoft/kb/Q44795/
---

## Q44795: CLEAR Causes &quot;Illegal Function Call&quot; after RETURN &lt;linelabel&gt;

	Article: Q44795
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890517-108 B_BasicCom
	Last Modified: 13-DEC-1989
	
	A CLEAR statement causes an "Illegal function call" error message
	after the following steps are performed:
	
	1. CALL a SUBprogram.
	
	2. Trap a key with ON KEY(n) GOSUB.
	
	3. RETURN to a label.
	
	4. Execute a CLEAR statement.
	
	This information applies to QuickBASIC Version 4.50 and to Microsoft
	BASIC Compiler Versions 6.00, and 6.00b for MS-DOS and MS OS/2 and to
	Microsoft BASIC PDS 7.00 for MS OS/2 and MS-DOS.
	
	The reason this condition causes an "Illegal function call" is that
	the SUBprogram was not exited with END SUB or EXIT SUB. Even though
	execution is not physically in the SUBprogram when the CLEAR statement
	is executed, BASIC assumes that control is still within the SUBprogram
	because the information pushed onto the stack during the CALL to the
	SUBprogram is still on the STACK. The CLEAR statement is not allowed
	in SUBprograms or FUNCTIONs; therefore, the "Illegal function call"
	error message is generated.
	
	The fact that the CLEAR statement is not allowed in SUBprograms or
	FUNCTIONS is documented in the BASIC language reference manuals for
	QuickBASIC Version 4.50 and the BASIC compiler Versions 6.00, and 6.00b,
	and the Microsoft BASIC PDS Version 7.00, as well as in the on-line
	help in QuickBASIC 4.50 and Microsoft Basic PDS 7.00.
	
	Code Example
	------------
	
	The following code sample causes an "Illegal function call" error at
	the CLEAR statement after you press F1:
	
	   ON KEY(1) GOSUB KeyHand
	   KEY(1) ON
	   CALL test
	   END
	
	   ErrorHere: CLEAR    'This statement causes "Illegal function call"
	   END
	
	   KeyHand:
	   RETURN ErrorHere
	
	   SUB test
	   DO : LOOP          'Wait for F1 to be pressed
	   END SUB
