---
layout: page
title: "Q61336: Explanation of Compiler Workspace and What Affects It"
permalink: /pubs/pc/reference/microsoft/kb/Q61336/
---

## Q61336: Explanation of Compiler Workspace and What Affects It

	Article: Q61336
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900415-7 B_BasicCom
	Last Modified: 15-JAN-1991
	
	The information below shows what items affect compiler workspace, and
	some practices that can be used when compiler workspace must be
	increased.
	
	The compiler workspace is displayed by the "Bytes Available" and
	"Bytes Free" lines given at the end of compilation. For more
	information on these lines, query on the following words:
	
	   BASIC and bytes available and free and symbol table and workspace
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2; and to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	The compiler workspace is made up of the line-number table, symbol
	table, and working storage for compiler code generation and
	optimization. Because of this, the compiler workspace is affected by
	such things as the length of variable, procedure, and line label
	names, and the number of lines in the program. The following
	paragraphs detail some of the things that affect the compiler
	workspace:
	
	   Variable SUB,    Because variables go into the symbol table, they
	   and FUNCTION     have a direct effect on compiler workspace.
	   names
	                    Each new variable has some initial overhead plus
	                    additional overhead for each character in the
	                    variable name. Once a variable is defined, it
	                    has no extra effect on the compiler workspace no
	                    matter how many times it is used again.
	
	   Line numbers     Every line number decreases the compiler
	                    workspace. Unlike variable and procedure names,
	                    however, it does not matter how big a line
	                    number is. The line number 10 takes just as
	                    much compiler workspace as does the line number
	                    10,000.
	
	   Program lines    Each line in the program takes up some compiler
	                    workspace. Two PRINT statements put on the same
	                    line, such as
	
	                       PRINT : PRINT
	
	                    take up less compiler workspace than when the
	                    statements are put on two separate lines, as in:
	
	                       PRINT
	                       PRINT
	
	                    Extra blank lines between code have no effect on
	                    compiler workspace. Therefore, the following
	                    three lines of code take just as much compiler
	                    workspace as do the previous two lines of code:
	
	                       PRINT
	
	                       PRINT
	
	If a program is running out of compiler workspace (bytes available
	goes to zero), you can try each of the following to increase the
	workspace:
	
	1. Break the code into multiple modules. This is the best solution
	   from a structured programming point of view. Each module has the
	   full compiler workspace available to it, and because code is taken
	   out of the original program, compiler workspace will be used
	   regained.
	
	2. Put multiple statements on each line. Although not recommended for
	   structured programming, moving multiple source lines onto a single
	   line separated by a colon (:) will decrease the amount of compiler
	   workspace being used.
	
	3. Decrease the size of SUB, FUNCTION, and variable names. This will
	   make the code less readable, but again can be used when compiler
	   workspace is at a premium.
