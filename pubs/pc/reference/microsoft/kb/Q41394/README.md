---
layout: page
title: "Q41394: Saving Source with Error in SUB Statement Reloads Incorrectly"
permalink: /pubs/pc/reference/microsoft/kb/Q41394/
---

## Q41394: Saving Source with Error in SUB Statement Reloads Incorrectly

	Article: Q41394
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 14-DEC-1989
	
	In the QB.EXE environment of QuickBASIC Version 4.00, 4.00b, or 4.50,
	Microsoft BASIC Compiler Version 6.00 or 6.00b, or in the QBX.EXE
	environment of Microsoft BASIC PDS Version 7.00, saving a module in
	which a SUB or FUNCTION statement contains a syntactically incorrect
	parameter list may cause QuickBASIC to fail to reload the same program
	into separate windows. A SUBprogram or FUNCTION that was initially
	displayed in its own window is now displayed (incorrectly) in the
	window containing the module-level code.
	
	If the error in the SUB or FUNCTION parameter list is now corrected,
	and the cursor is moved to another line of code (using an ARROW key,
	the ENTER key, or a mouse), the SUB or FUNCTION statement is correctly
	displayed in its own window. However, any code that was contained
	within the SUBprogram or FUNCTION remains with the module-level code,
	including a copy of the END SUB or END FUNCTION statement. That code
	must be manually moved (using Cut and Paste) from the module-level
	code to the SUBprogram or FUNCTION.
	
	To prevent this problem, always correct any problems that have been
	noted by the QB.EXE or QBX.EXE environment BEFORE saving the file to
	disk.
	
	This information applies to the QB.EXE environment that comes with
	QuickBASIC Versions 4.00, 4.00b, and 4.50 and Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS, and to the QBX.EXE environment
	that comes with Microsoft BASIC PDS Version 7.00 for MS-DOS. This
	behavior is a design limitation of these environments.
