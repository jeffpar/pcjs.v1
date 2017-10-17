---
layout: page
title: "Q30313: BC.EXE &quot;Syntax Error&quot; Instead of CONST &quot;Duplicate Definition&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q30313/
---

## Q30313: BC.EXE &quot;Syntax Error&quot; Instead of CONST &quot;Duplicate Definition&quot;

	Article: Q30313
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 20-SEP-1990
	
	You will receive the message "Syntax Error" instead of "Duplicate
	Definition" if you use the same name for a CONST and a variable when
	using BC.EXE.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	4.00, 4.00b, and 4.50; in Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b); and in
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 (buglist7.00, buglist7.10). We are
	researching this problem and will post new information here as it
	becomes available.
	
	When the following sample program is run inside the QB.EXE or QBX.EXE
	editor, you receive the expected "Duplicate Definition" error on the
	CONST statement. The same line produces a "Syntax Error" message when
	compiled using BC.EXE.
	
	QuickBASIC version 3.00 produces the error message "Constant
	assignment illegal" when compiled inside the QB.EXE editor or from the
	DOS command line.
	
	The following sample program demonstrates the inconsistent error
	message:
	
	   'If this is compiled in the editor you get a "Duplicate Definition"
	   'If this is compiled with BC.EXE you get a "Syntax Error"
	   a = 5
	   CONST a = 6
