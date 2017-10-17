---
layout: page
title: "Q28158: Misleading QB.EXE Message Using Reserved Word in SUB"
permalink: /pubs/pc/reference/microsoft/kb/Q28158/
---

## Q28158: Misleading QB.EXE Message Using Reserved Word in SUB

	Article: Q28158
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | B_QuickBas
	Last Modified: 2-FEB-1990
	
	Illegally using the reserved word "SEG" in a SUB statement can give
	you a misleading error message.
	
	To generate the misleading message, start up the QB.EXE environment of
	Microsoft BASIC Compiler Version 6.00 or 6.00b or Microsoft QuickBASIC
	Version 4.00, 4.00b, or 4.50, and type the following:
	
	   SUB foo(SEG x AS INTEGER)
	
	The environment highlights the SEG keyword and returns the following:
	
	   Expected: variable or BYVAL or SEG or )
	
	This is because the parser correctly detects that SEG is illegal in a
	SUB statement, but shares the error message with DECLARE, so SEG is
	misleadingly listed as "expected."
	
	This error message has been clarified in the QBX.EXE environment of
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2. This situation now produces the following error,
	indicating that the SEG keyword is not allowed in that context:
	
	   Expected: parameter or )
