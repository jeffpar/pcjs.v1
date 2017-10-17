---
layout: page
title: "Q47491: How SUB and FUNCTION Windows Inherit DEFtype in QB.EXE Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q47491/
---

## Q47491: How SUB and FUNCTION Windows Inherit DEFtype in QB.EXE Editor

	Article: Q47491
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-SEP-1990
	
	The following information applies to the QB.EXE editor in QuickBASIC
	versions 4.00, 4.00b, and 4.50; to the QB.EXE editor in Microsoft
	BASIC Compiler versions 6.00 and 6.00b; and to the QBX.EXE editor in
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10.
	
	When creating SUB or FUNCTION procedures in the QB.EXE or QBX.EXE
	editor, the procedures inherit the DEFtype statement shown in the
	window in which they were first created. "DEFtype" refers to the
	following statements: DEFINT, DEFLNG, DEFSNG, DEFDBL, DEFSTR, and
	DEFCUR. (DEFCUR, which is a declaration for the CURRENCY data type, is
	supported only in BASIC PDS 7.00 and 7.10.)
	
	If no DEFtype statement is visible in a window, the default DEFSNG A-Z
	applies. If a certain range of letters is not covered by a DEFtype
	statement in the current window, then that range of letters is covered
	by DEFSNG (since single precision is the default data type).
	
	For more information in a related article, search for the following
	words:
	
	   DEFLNG and MISMATCH and $DYNAMIC
	
	If the module-level code for the current module contains a DEFINT A-Z
	statement, any SUB or FUNCTION created in that module automatically
	has a DEFINT A-Z statement placed just above the SUB or FUNCTION line.
	
	If a SUB or FUNCTION is created and moved to a module (source file)
	with a different DEFtype than the module it was created in, the
	SUBprogram and its new module have different default variable types,
	and SHARED or passed variables may not be recognized in the
	SUBprogram. In this case, the variables that were intended to be
	SHARED may have the same name in both the SUBprogram and the module,
	but the variables are of different types and, thus, are considered
	different variables. You may encounter this same situation if you
	create a SUBprogram (which "inherits" the module-level DEFtype) and
	then change the DEFtype at the module level.
	
	To avoid problems accessing SHARED or passed variables, you can either
	append the appropriate type-specifier character (%, &, !, #, or $) to
	the variable name, or make sure that all your SUBprograms have the
	same DEFtype as the module that calls them.
	
	Code Example
	------------
	
	Executing the following code prints the values 0 and 10, whereas you
	may have wanted 10 and 10. The reason for the difference is that while
	Y% is always an integer variable (the "%" type specifier ensures this)
	and, thus, is recognized as the COMMON SHARED variable Y% in the
	subprogram, "X" is an integer (because of the DEFINT) at the module
	level, and a double-precision variable (because of the DEFDBL before
	the SUB) in the SUBprogram. Thus, Y% is recognized as SHARED and
	changed correctly, while X is considered a local variable in the
	SUBprogram and the COMMON SHARED variable X remains unaltered.
	
	   'Module-level code:
	   DEFINT A-Z
	   COMMON SHARED X, Y%
	   CALL thesub
	   PRINT X, Y%
	   END
	
	   'SUBprogram level in same module -- different DEFtype statement:
	   DEFDBL A-Z
	   SUB thesub
	     X = 5
	     Y% = 10
	   END SUB
