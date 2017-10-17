---
layout: page
title: "Q28857: Zero Passed or &quot;Type Mismatch&quot; in SUB; DEFtype Usage in QB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q28857/
---

## Q28857: Zero Passed or &quot;Type Mismatch&quot; in SUB; DEFtype Usage in QB.EXE

	Article: Q28857
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 10-JAN-1991
	
	Below are several general rules about using DEFtype statements
	(DEFINT, DEFLNG, DEFDBL, DEFSNG, and DEFSTR) in separate windows in
	the QB.EXE editor for QuickBASIC versions 4.00, 4.00b, and 4.50, in
	the QB.EXE editor in Microsoft BASIC Compiler versions 6.00 and 6.00b
	for MS-DOS, and in the QBX.EXE editor for Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	This programming information is very important for avoiding parameter
	type mismatches that the compiler cannot warn you about. These
	mismatches can result in zeroed or garbled variables or a computer
	hang.
	
	For a related article, query in this Knowledge Base on the following
	words:
	
	   DEFtype and SHARED and SUB
	
	1. A general rule is whenever you view a subprogram or FUNCTION
	   procedure in a window in the QuickBASIC editor, if you see no DEFtype
	   statement (DEFINT, DEFLNG, DEFDBL, DEFSNG, or DEFSTR), you can
	   always assume that DEFSNG A-Z applies to all code in the procedure
	   in that window.
	
	   A similar rule holds for using the REM $DYNAMIC metacommand. If you
	   don't see REM $DYNAMIC displayed in a procedure's window in the
	   QB.EXE or QBX.EXE editor, you can assume that the default
	   for that procedure is REM $STATIC for locally dimensioned
	   arrays. However, note that arrays are always dynamic in non-STATIC
	   SUB or FUNCTION procedures, regardless of metacommand usage. In SUB
	   STATIC or FUNCTION STATIC procedures, locally dimensioned arrays
	   can be either dynamic or static.
	
	2. If the DEFtype usage makes shared or passed variables differ in
	   type between a calling routine and the SUB or FUNCTION procedures
	   that it invokes, a "Type Mismatch" error may display, or zeroed or
	   garbled variables may be passed at run time. The types of variables
	   that are passed (integer, long integer, double precision, single
	   precision, or string) must match between the CALL statement (or
	   FUNCTION procedure invocation) and the formal parameter list in the
	   SUB (or FUNCTION) statement.
	
	3. As you write or edit a program in the QB.EXE or QBX.EXE editor, the
	   DEFtype statements (DEFINT, DEFLNG, DEFDBL, DEFSNG, and DEFSTR) should
	   be added to the main program before adding any subprograms. If this is
	   not done, the subprograms will default to DEFSNG A-Z (and you must
	   explicitly add a different DEFtype, if needed).
	
	   The DEFSNG A-Z default is not readily apparent, since the automatic
	   DEFSNG A-Z above each subprogram is invisible in the QB.EXE or
	   QBX.EXE editor. (The DEFSNG A-Z above each subprogram is visible only
	   if you save the program in Text format and look at it in another text
	   editor. An example is shown below, after Rule 5.)
	
	4. If you want to change the DEF type in a subprogram or FUNCTION
	   procedure in the QB.EXE or QBX.EXE editor, add the desired DEFtype
	   statement to the very first line in that window. Putting DEFtype
	   statements in the middle of a program is not a good programming
	   practice.
	
	   Default variable types are defined in source code order. In other
	   words, if the variable xxx is used both above and below a DEFtype x
	   statement, you have created two different, mismatched xxx variables.
	   To avoid this problem, place all DEFtype statements at the top of
	   each procedure, before any variables are defined.
	
	5. Note that %, &, !, #, or $ appended to a variable name changes the
	   type so that DEFtype statements have no effect on the type of that
	   variable.
	
	The following steps illustrate the rules 1, 2, and 3 above (including
	the invisible default DEFSNG A-Z):
	
	1. Enter the following program into the QB.EXE or QBX.EXE editor:
	
	      COMMON SHARED X
	      X=3
	      CLS
	      PRINT X
	      CALL SUB1
	      SUB SUB1
	        PRINT X
	      END SUB
	
	   Note: If you save the program at this point, the statement
	   DECLARE SUB SUB1() is automatically added above the COMMON SHARED
	   statement, but saving at this point is not necessary.
	
	2. Add the statement DEFINT A-Z before the COMMON statement but after
	   the DECLARE statement (if any). [Note that if you add DEFINT A-Z
	   before the DECLARE statement, running the program gives a "Type
	   Mismatch" error because the procedure named SUB1 is declared with
	   mismatched types in the DECLARE and SUB statements. Putting DEFINT
	   A-Z after the DECLARE statement makes SUB1 default to single
	   precision, thus matching the DEFSNG A-Z default in the SUB
	   statement.]
	
	4. View the subprogram. Note: There is no DEFtype statement of any
	   kind. We can assume it is DEFSNG A-Z, since QuickBASIC has not told
	   us otherwise, according to rule 1 above.
	
	5. Run the program. The program prints 3 and 0, whereas 3 and 3 are
	   expected if the type of the COMMON SHARED variable "x" is matched
	   properly.
	
	6. When you use the TYPE command to display the program source file in
	   DOS, the DEFSNG A-Z statement is visible above the SUB statement,
	   even though it is invisible in the QB.EXE or QBX.EXE editor:
	
	      DECLARE SUB SUB1 ()
	      DEFINT A-Z
	      COMMON SHARED X
	      X=3
	      CLS
	      PRINT X
	      CALL SUB1
	
	      DEFSNG A-Z
	      SUB SUB1
	        PRINT X
	      END SUB
	
	7. Note that if you load the program back into QuickBASIC and add a
	   DEFINT A-Z statement above the SUB statement, DEFINT A-Z will
	   always be visible in the QB.EXE or QBX.EXE editor (thus following
	   rule 1 above). However, it will not be there when you use TYPE to
	   display the source file in DOS (since DEFINT A-Z already appears in
	   the main-level code, and the extra DEFINT A-Z would be redundant
	   within that source file).
	
	All of the above behavior is consistent with QuickBASIC's design
	logic.
