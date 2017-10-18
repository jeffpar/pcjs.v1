---
layout: page
title: "Q30787: MASM 5.10 MIXED.DOC: Converting Old Macros of MASM 5.00"
permalink: /pubs/pc/reference/microsoft/kb/Q30787/
---

## Q30787: MASM 5.10 MIXED.DOC: Converting Old Macros of MASM 5.00

	Article: Q30787
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-JUN-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 MIXED.DOC file.
	
	Converting Mixed-Language Source Files
	   Rather than use the old macros, you may want to convert your source
	files to use the built-in mixed language features of MASM 5.10. The
	conversion is straightforward and can be done easily with a text
	editor.
	   The following changes can be made to source files that use macros
	from the 5.0 MIXED.INC. The source file POWER2.ASM on the MASM 5.10
	distribution disk is an example of a converted source file. You can
	compare it with the POWER2.ASM supplied with MASM 5.00.
	   You must define a memory model argument and a language argument
	to the .MODEL directive to use the new mixed-language features of MASM
	5.10. You can do this within the source file:
	
	   .MODEL small, c
	
	   Alternately, you can pass the arguments in from the command line
	using /D. In MASM 5.00, you had to use the setModel macro to receive a
	model argument passed on the command line. You only needed to define
	the language symbol "cLang" for C; no definition was needed for other
	languages.
	   The 5.00 source line to accept the argument would be:
	
	   setModel
	
	   For MASM 5.10, change to:
	
	   %      .MODEL model,lang
	
	   Notice that the expression operator (%) is required so that MASM
	can evaluate text arguments passed from the command line.
	   The 5.00 command line to define C small model would be:
	
	   MASM /MX /Dmodel=small /DcLang power2;
	
	   For MASM 5.1, change this to:
	
	   MASM /MX /Dmodel=small /Dlang=C power2;
	
	   Replace references to the hProc macro with the PROC directive.
	Remember, new features of the PROC directive only work when a language
	argument is given for the .MODEL directive. The 5.00 macro syntax was:
	
	   hProc  <name [NEAR|FAR]> [,<USES reglist>] [,arglist]
	
	   The 5.10 syntax is:
	
	   name PROC [NEAR|FAR] [,USES reglist] [,arglist]
	
	   The syntax for each MASM 5.00 argument in the arglist was
	
	   argument[:[NEAR|FAR] type]
	
	where the type could be BYTE, WORD, DWORD, FWORD, QWORD, TBYTE, or PTR
	(to indicate that the variable is a pointer).
	   The syntax for each MASM 5.10 argument is:
	
	   argument[:[[NEAR|FAR] PTR] type]
	
	where the type can be BYTE, WORD, DWORD, FWORD, QWORD, TBYTE, or a
	structure type. Note that structure types can now be given. Also, PTR
	is part of the syntax rather than a type. If PTR is given with a type,
	then it means that the variable is a pointer to a variable of the
	given type. This information makes no difference in what MASM
	assembles, but it can be used by the CodeView debugger.
	   For example, consider the following MASM 5.00 source line:
	
	   hProc   <doTask FAR>, <USES si di>, count:BYTE, array:PTR, number
	
	   It should be changed to the following for MASM 5.10:
	
	   doTask  PROC FAR USES si di, count:BYTE, array:PTR WORD, number
	
	   Notice that the array is now declared as pointer to a word (or an
	array of words). In the 5.00 syntax it was simply a pointer to an
	object of undefined size.
	
	   o Replace references to the hLocal macro with the LOCAL directive.
	The syntax for the 5.00 hLocal macro was:
	
	   hLocal  varlist
	
	   The MASM 5.1 syntax is:
	
	   LOCAL   varlist
	
	   The syntax for each 5.00 variable was:
	
	   variable[:[NEAR|FAR] type]
	
	   The syntax for each 5.10 variable is:
	
	   variable[[count]][:[[NEAR|FAR] PTR] type]
	
	   The difference is the same as the difference for arguments to the
	PROC directive. In addition, you can allocate local arrays by
	specifying a count (in brackets) following the variable name. For
	example:
	
	   LOCAL   work[20]:WORD, string:PTR BYTE
	
	   This allocates a local array of 20 words called "work" and a
	pointer to byte (called "string").
	
	   o Replace references to the hRet macro with the RET instruction.
	
	   o Replace references to the hEndp macro with the ENDP directive
	preceded by the procedure name. For example, change
	
	   hEndp
	
	to
	
	   procname ENDP
	
	   Under MASM 5.10, labels within a procedure are local to the
	procedure if the language argument is given for the .MODEL directive.
	For example, if you use the label "exit:" in one procedure, you can
	use it again in another procedure. A label inside a procedure can be
	made global to the source file by putting two colons after it
	(example, "glabel::"). Under MASM 5.00 all labels were global to the
	source file.
	   Note that the 5.00 macros did not automatically handle 80386
	features such as 32-bit pointers. The 5.10 features do. For example, if
	you use the .386 directive before the .MODEL directive to enable
	32-bit segments, near pointers declared with PTR will be 32 bits wide
	and far pointers will be 48 bits wide.
