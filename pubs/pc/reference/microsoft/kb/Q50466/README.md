---
layout: page
title: "Q50466: QB.EXE 4.50 May Lose SUB During SUB Move If &quot;Out of Memory&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q50466/
---

## Q50466: QB.EXE 4.50 May Lose SUB During SUB Move If &quot;Out of Memory&quot;

	Article: Q50466
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891026-32 buglist4.50 B_BasicCom
	Last Modified: 15-DEC-1989
	
	If an "OUT OF MEMORY" error message results from moving a SUBprogram
	via the Move button in the SUBS... option (F2 hotkey) from the View
	menu in the QB.EXE editor in QuickBASIC Version 4.50, the SUBprogram
	may be lost.
	
	This problem occurs only with very large, multiple-module programs
	that are running out of available memory. Any program that is large
	enough to create this problem is usually too large to effectively run
	in QB.EXE. To avoid this problem, use programs that do not approach
	the memory limitations of your machine.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Version
	4.50 for MS-DOS. This problem was corrected in QBX.EXE of Microsoft
	BASIC PDS Version 7.00 (fixlist7.00).
	
	To reproduce this problem, perform the following steps:
	
	1. Use a large multiple-module program.
	
	2. Load all the modules into QB.EXE.
	
	3. Choose the SUBS... option from the View menu (or press F2).
	
	4. Highlight a SUBprogram or FUNCTION.
	
	5. Choose the Move option.
	
	6. Pick a destination module.
	
	7. To duplicate the problem, you must receive an "OUT OF MEMORY"
	   message at this point. If you View that SUBprogram, it will have
	   lost its contents.
	
	8. If you were not able to reproduce the problem, increase the size of
	   one or more of the modules and repeat from Step 3.
