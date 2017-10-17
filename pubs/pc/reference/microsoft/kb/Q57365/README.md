---
layout: page
title: "Q57365: &quot;Subprogram Not Defined&quot; GetCopyBox, AttrBox Using GENERAL.BAS"
permalink: /pubs/pc/reference/microsoft/kb/Q57365/
---

## Q57365: &quot;Subprogram Not Defined&quot; GetCopyBox, AttrBox Using GENERAL.BAS

	Article: Q57365
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891219-77 docerr
	Last Modified: 1-AUG-1990
	
	GetCopyBox, PutCopyBox, and AttrBox (which are all invoked in
	GENERAL.BAS) are assembly language procedures located in the UIASM.ASM
	assembler source file, in the UIASM.OBJ object file, and in the
	UITBEFR.QLB Quick library. This fact needs to be added on Pages 499,
	585-586, 589, and 591 of the "Microsoft BASIC 7.0: Language Reference"
	manual for Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10. You will need to know this when using
	GENERAL.BAS from the User Interface (UI) Toolbox as described below.
	
	If you are using GENERAL.BAS in QBX.EXE and get a "Subprogram not
	defined" error on a call to GetCopyBox, PutCopyBox, or AttrBox, then
	you must invoke QBX with a Quick library containing these routines,
	for example:
	
	   QBX /L UITBEFR.QLB.
	
	[Also, if you are using GENERAL.BAS in QBX.EXE and get a "Subprogram
	not defined" error on a call to MouseHide (in the Box subprogram),
	then you must Load (choose Load from the File menu) the MOUSE.BAS
	source file, which contains MouseHide and the other mouse UI Toolbox
	routines.]
	
	This information applies to the UI Toolbox in Microsoft BASIC PDS
	versions 7.00 and 7.10 for MS-DOS.
	
	If you chose to have Quick libraries created when you ran SETUP.EXE
	for BASIC 7.00 or 7.10, you already have the UITBEFR.QLB Quick library
	that contains all the UI Toolbox routines. SETUP.EXE places
	UITBEFR.QLB by default in the directory where you chose to place
	.LIB files.
	
	Pages 534 and 535 "Microsoft BASIC 7.0: Language Reference" for
	versions 7.00 and 7.10 describe how to build UITBEFR.QLB (or subsets)
	yourself. (You can use LINK /Q to build UIASM.OBJ into a Quick library
	and use LIB.EXE to build the parallel .LIB library.)
	
	The three routines in UIASM.OBJ (PutCopyBox, GetCopyBox, and AttrBox)
	must always be present when using the UI Toolbox.
	
	Page 586 correctly describes how to make calls to AttrBox SUB. Since
	the code for AttrBox is not in the GENERAL.BAS source-code file, if
	you want to alter the code for AttrBox, you must edit the UIASM.ASM
	source file and reassemble it with Microsoft Macro Assembler (MASM).
	
	Documentation Correction
	------------------------
	
	Pages 499 and 585-586 of the "Microsoft BASIC 7.0: Language Reference"
	manual incorrectly imply that AttrBox SUB is a procedure found in the
	GENERAL.BAS source-code file for the User Interface (UI) Toolbox.
	
	The AttrBox is actually an assembly language procedure located in the
	UI Toolbox object file, UIASM.OBJ (and in the UIASM.ASM source file).
	The UI Toolbox procedures require that UIASM.OBJ be included either in
	a Quick library when running inside the QBX.EXE editor or in a library
	(.LIB) that is linked to your program when running outside the
	environment (in a compiled executable .EXE form).
