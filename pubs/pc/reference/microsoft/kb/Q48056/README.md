---
layout: page
title: "Q48056: L2029: &quot;Unresolved Externals&quot;; FORTRAN Variable Name Limit"
permalink: /pubs/pc/reference/microsoft/kb/Q48056/
---

## Q48056: L2029: &quot;Unresolved Externals&quot;; FORTRAN Variable Name Limit

	Article: Q48056
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890811-30 B_BasicCom H_Fortran
	Last Modified: 21-DEC-1989
	
	When LINKing inter-language object modules between QuickBASIC and
	FORTRAN, the error message L2029 "Unresolved Externals" may be
	displayed because of lengthy variable names. QuickBASIC allows
	variable names to extend to 40 characters, all of which are
	significant; however, depending on the version of FORTRAN, either 6 or
	31 characters are significant.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS,
	and to Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	When linking QuickBASIC and FORTRAN object files, be careful of which
	version of FORTRAN is being used and with what directives. When long
	SUBroutine or FUNCTION names are used, FORTRAN may truncate the name
	depending on the version and therefore cause the linker error message
	L2029 "Unresolved Externals."
	
	Microsoft FORTRAN Version 4.10 allows for variable names to be up to
	31 characters, all of which are considered significant. However, the
	default option for Version 4.10 is to truncate at the standard six (6)
	characters. This can cause problems when BASIC is calling a SUB or
	FUNCTION name that is greater than six characters in length.
	
	Microsoft FORTRAN Version 5.00 also allows variable names to be up to
	31 characters, all of which are considered significant. This is the
	default option, unlike FORTRAN Version 4.10. No variables are
	truncated unless they extend beyond the 31-character limit.
	
	FORTRAN offers the following three methods for alleviating this
	variable truncation and allows the programmer to easily change the way
	the FORTRAN compiler interprets the variable names.
	
	1. The compiler directive /4{Y|N}t allows you to change the
	   translation method on the command line. /4Yt causes the FORTRAN 77
	   defaults to be in effect. Variable names are truncated at 6
	   characters in length. This is the default for FORTRAN Version 4.10.
	   /4Nt allows the compiler to use Microsoft's 31 significant character
	   variable names. This is the default for FORTRAN Version 5.00.
	
	2. The metacommand $STRICT can be placed directly into the FORTRAN
	   code to allow different interpretations of the variable names. When
	   the $STRICT metacommand is applied, FORTRAN 77 standards will be
	   assumed. For FORTRAN Version 4.10 this is the default, but for
	   FORTRAN Version 5.00, $NOSTRICT is the default.
	
	3. The metacommand $TRUNCATE can be placed directly in the FORTRAN
	   code to force whether variable names are truncated at the 6
	   character limit or $NOTRUNCATE can be used to force 31 character
	   variable names. $TRUNCATE is the default for FORTRAN Version 4.10,
	   and $NOTRUNCATE is the default for FORTRAN Version 5.00.
