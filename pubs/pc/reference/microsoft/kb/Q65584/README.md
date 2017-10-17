---
layout: page
title: "Q65584: Mismatched DEFtypes in Main and SUBs Can Zero SHARED Variables"
permalink: /pubs/pc/reference/microsoft/kb/Q65584/
---

## Q65584: Mismatched DEFtypes in Main and SUBs Can Zero SHARED Variables

	Article: Q65584
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900823-150 B_BASICCOM
	Last Modified: 20-SEP-1990
	
	If DEFtype statements (DEFINT, DEFLNG, DEFSNG, DEFDBL, DEFSTR, or
	DEFCUR) make passed variables differ in type between a calling routine
	and the SUB or FUNCTION procedure that the calling routine invokes,
	then a "Parameter Type Mismatch" error displays in QB.EXE or QBX.EXE.
	However, if the DEFtype usage makes SHARED or COMMON SHARED variables
	differ in type between procedures, then those variables will be
	unexpectedly 0 (zero) or null at run time.
	
	Programmers must be very careful to use DEFtype statements
	consistently between procedures that use SHARED or COMMON SHARED
	statements because the compiler or environment cannot catch this case
	of type mismatch.
	
	This information applies to Microsoft QuickBASIC versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b and 4.50 for MS-DOS; to Microsoft
	BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS OS/2; and to
	Microsoft Professional Development System (PDS) versions 7.00 and 7.10
	for MS-DOS and MS OS/2. (Note: The CURRENCY data type, declared with
	DEFCUR or the "@" suffix, is only available in BASIC PDS versions 7.00
	and 7.10. Also, LONG integers, declared with DEFLNG or the suffix "&",
	are not supported in QuickBASIC 1.x, 2.x, or 3.00.)
	
	For more information, query in this Knowledge Base on the following
	words:
	
	   DEFTYPE AND SHARED AND SUB
	
	The types of variables that are passed (INTEGER, LONG integer, SINGLE
	precision, DOUBLE precision, STRING, or CURRENCY) must match between
	the CALL statement (or FUNCTION procedure invocation) and the formal
	parameter list in the SUB (or FUNCTION) statement.
	
	Undeclared local variables are allowed in SUBprograms and FUNCTIONs,
	and they are considered to be different from variables declared in the
	main level of code with the same name. Undeclared nonshared, nonpassed
	variables are initialized to a value of zero (for numerics) or null
	(for strings).
	
	For any SUB or FUNCTION procedure that administers the DEFtype
	statement exactly as in the main level of code, the expected values of
	SHARED variables will pass correctly to that procedure.
	
	However, if DEFtype affects the SHARED or COMMON SHARED variables in
	the SUB or FUNCTION code differently than in the main code, the values
	of SHARED or COMMON SHARED variables in the offending SUB or FUNCTION
	will be initialized to zero or null. The BC.EXE compiler or
	QB.EXE/QBX.EXE environment cannot trap this kind of type mismatch for
	COMMON SHARED variables, because variables of different types are
	allowed to use the same name. The linker cannot trap this type
	mismatch because BASIC's variables are not public symbols, and thus
	are not known to the linker by name.
	
	Since neither the environment, the compiler, nor the linker can trap
	the type mismatches for SHARED or COMMON SHARED variables, you must
	exercise care to use DEFtype statements consistently; otherwise,
	variables may be unexpectedly zero or null.
	
	Code Example
	------------
	
	The code example below illustrates improper use of DEFtype statements,
	which inconsistently affects the type of the variable TRUE1 in COMMON
	SHARED. TRUE1 is SINGLE precision and correctly passed in COMMON
	SHARED in the main level, FUN2, and SUB2, but is a local INTEGER
	variable and not passed through COMMON SHARED in FUN1 and SUB1.
	
	If you type the program below into QB.EXE or QBX.EXE line by line in
	source code order, you will need to change the automatic DEFtype in
	each procedure's window to the DEFINT or DEFSNG statements shown. This
	is because in QB.EXE or QBX.EXE, a procedure automatically inherits
	the DEFtype statement of the window in which the SUB or FUNCTION
	statement was first typed.
	
	This code can be loaded as is into QB.EXE/QBX.EXE to show the type
	mismatch problem, but note that the QB.EXE/QBX.EXE environment will
	redisplay the DEFtype statements according to the following rules:
	
	   By default, the QB.EXE/QBX.EXE environment makes the DEFSNG
	   statements invisible, since SINGLE precision is the default data
	   type. Also, if a letter range is not covered by a DEFtype statement
	   visible in a procedure's window in QB.EXE/QBX.EXE, then you can
	   assume DEFSNG applies to variables with first letters in that
	   range. Also, the current DEFtype assignments are determined in
	   source code order. The DEFtype for a given range of first letters
	   is carried to all subsequent code until changed by any subsequent
	   DEFtype statement, and the QB.EXE/QBX.EXE environment displays this
	   effect by automatically displaying the correct DEFtype statements
	   in each procedure window (remember DEFSNG is invisible).
	
	Editors other than QB.EXE/QBX.EXE do not change the display of
	DEFtype; thus, you can only figure out the DEFtype for a given range
	of first letters by looking at all DEFtype statements in source code
	order and remember where they are changed by any subsequent DEFtype
	statement(s). (See comments in code below for an example.)
	
	(Note that the QB.EXE editor in QuickBASIC versions 2.x and 3.00 does
	not change the visibility of any DEFtype statements -- what you see is
	what you get, in source code order. QuickBASIC 1.x does not come with
	an editor. Also, you need to remove the DECLARE statements and
	FUNCTION ... END FUNCTION blocks in the program below to demonstrate
	the type mismatch problem in QuickBASIC 1.x, 2.x, or 3.00.)
	
	DECLARE FUNCTION fun1% ()
	DECLARE FUNCTION fun2% ()
	DECLARE SUB sub1 ()
	DECLARE SUB sub2 ()
	
	DEFINT D-O
	' Note that variables beginning with D through O are now integer. The
	' variable TRUE1 is not covered by this, thus TRUE1 is a SINGLE
	' precision variable in COMMON SHARED.
	COMMON SHARED TRUE1
	COMMON SHARED false
	CLS
	false = 0
	TRUE1 = NOT false   ' TRUE1 is assigned a value of -1 (or nonzero)
	                    ' since the NOT operator applied to 0 equals -1.
	PRINT "TRUE1 = "; TRUE1
	PRINT "Function #1 returns:  TRUE1 = "; fun1%
	PRINT "Function #2 returns:  TRUE1 = "; fun2%
	CALL sub1
	CALL sub2
	SLEEP 2
	
	DEFINT A-C, P-Z
	' If this source is loaded into QB.EXE/QBX.EXE, this displays
	' DEFINT A-Z, since DEFINT D-O is still in affect from further above;
	' and putting DEFINT A-C, D-O, and P-Z together makes DEFINT A-Z.
	' Thus the variable TRUE1 is now a local integer variable and
	' is not in COMMON SHARED.
	FUNCTION fun1%
	 d = TRUE1
	 fun1% = d
	END FUNCTION
	
	DEFSNG A-C, P-Z
	' If loaded into QB.EXE/QBX.EXE, this displays DEFINT D-O, since
	' the DEFSNG is automatically made invisible, and D-O are still
	' defined as integer from further above. TRUE1 is a SINGLE
	' precision variable in COMMON SHARED.
	FUNCTION fun2%
	 d = TRUE1
	 fun2% = d
	END FUNCTION
	
	DEFINT A-C, P-Z
	' If this source is loaded into QB.EXE/QBX.EXE, this displays
	' DEFINT A-Z, since DEFINT D-O is still in affect from further above;
	' and putting DEFINT A-C, D-O, and P-Z together makes DEFINT A-Z.
	' Thus the variable TRUE1 is now a local integer variable and
	' is not in COMMON SHARED.
	SUB sub1
	  PRINT "In sub #1, TRUE1 = "; TRUE1
	END SUB
	
	DEFSNG A-C, P-Z
	' If loaded into QB.EXE/QBX.EXE, this displays DEFINT D-O, since
	' the DEFSNG is automatically made invisible, and D-O are still
	' defined as integer from further above. TRUE1 is a SINGLE
	' precision variable in COMMON SHARED.
	SUB sub2
	  PRINT "In sub #2, TRUE1 = "; TRUE1
	END SUB
	
	Sample Output
	-------------
	
	TRUE1 is a SINGLE precision variable equal to -1 and correctly passed
	in COMMON SHARED in the main level, FUN2, and SUB2, but is a local
	INTEGER variable equal to zero (0) and not passed through COMMON
	SHARED in FUN1 and SUB1:
	
	   TRUE1 = -1
	   Function #1 returns:  TRUE1 =  0
	   Function #2 returns:  TRUE1 = -1
	   In sub #1, TRUE1 =  0
	   In sub #2, TRUE1 = -1
