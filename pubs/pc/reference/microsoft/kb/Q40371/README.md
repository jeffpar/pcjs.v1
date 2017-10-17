---
layout: page
title: "Q40371: Using Medium and Large Memory FORTRAN Models with BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q40371/
---

## Q40371: Using Medium and Large Memory FORTRAN Models with BASIC

	Article: Q40371
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | H_Fortran B_BasicCom SR# S890110-32
	Last Modified: 21-DEC-1989
	
	The information below applies to QuickBASIC Versions 4.00, 4.00b, and
	4.50, and Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS
	and OS/2.
	
	This information also applies to Microsoft BASIC PDS Version 7.00 for
	MS-DOS and MS OS/2, but only when using near strings. (For more
	information on using far strings in mixed-language programs, please
	refer to Chapter 13, "Mixed Language Programming with Far Strings," in
	the "Microsoft BASIC 7.0: Programmer's Guide." Note that far strings
	are only available with BASIC PDS 7.00.)
	
	Variables in a FORTRAN subroutine may be specified as being [NEAR] or
	[FAR]. Likewise, QuickBASIC can pass parameters to a subroutine by
	near or far reference. When parameters are passed as near and the
	FORTRAN subroutine is compiled under the medium memory model or the
	parameters are passed as far and the subroutine is compiled with the
	large memory model option, the variables are passed correctly.
	
	The run-time error message "F2729 I/O item illegal in namelist I/O" is
	reported if you try to use far pointers while compiling in the
	medium memory model.
	
	Example 1 below demonstrates a program that performs correctly when
	near parameters are used and the FORTRAN subroutine is compiled using
	the medium model (FL /AM) option. The parameters are passed
	incorrectly when the FORTRAN subroutine in Example 1 is compiled with
	the large model (FL /AL) option.
	
	Example 2 is the equivalent program using the far option. Example 2
	performs correctly when the FORTRAN subroutine is compiled with the
	large model option.
	
	The following is Example 1, which uses the medium memory model:
	
	   Compile in BASIC as follows:     BC basprog/o;
	   Compile in FORTRAN as follows:   fl /AM /APi /c forsub.for
	   Link as follows:                 LINK basprog forsub/noe;
	
	The following BASIC program is BASPROG.BAS:
	
	DECLARE FUNCTION MAKEIT$(S$,SIZE%)
	DECLARE SUB DUM1(BYVAL S1%, BYVAL S2%, BYVAL S3%, BYVAL S4%)
	DIM NAM%(3000)
	COMMON /NMALLOC/ NAM%()
	STR1$ = MAKEIT ("TEST OF PARAMETER VALUE PASSING" ,44)
	STR2$ = MAKEIT ( "STRING 2" ,43)
	STR3$ = MAKEIT ("STRING 3", 14)
	STR4$ = MAKEIT ("STRING 4" ,14)
	CALL DUM1(SADD(STR1$), SADD(STR2$), SADD(STR3$), SADD(STR4$))
	END
	FUNCTION MAKEIT$ (S$,SIZE%)
	   MAKEIT$ = LEFT$(S$+STRING$(80, 32),SIZE%)
	END FUNCTION
	
	The following FORTRAN program is FORSUB.FOR:
	
	      SUBROUTINE DUM1(STR1, STR2, STR3, STR4)
	      CHARACTER*14 STR3, STR4 [NEAR]
	      CHARACTER*43 STR1 [NEAR]
	      CHARACTER*44 STR2 [NEAR]
	      WRITE (*,*) STR1, STR2, STR3, STR4
	      END
	
	The following is Example 2, which uses the large memory model:
	
	Compile in BASIC as follows:    BC basprog/o;
	Compile in FORTRAN as follows:  fl /AL /FPi /c forsub.for
	Link as follows:                LINK basprog forsub/noe;
	
	The following BASIC program is BASPROG.BAS:
	
	DECLARE FUNCTION MAKEIT$(S$,SIZE%)
	DECLARE SUB DUM1(BYVAL S1%, BYVAL S2%, BYVAL S3%, BYVAL S4%,_
	                 BYVAL S5%, BYVAL S6%, BYVAL S7%, BYVAL S8%)
	DIM NAM%(3000)
	COMMON /NMALLOC/ NAM%()
	STR1$ = MAKEIT ("TEST OF PARAMETER VALUE PASSING" ,44)
	STR2$ = MAKEIT ( "STRING 2" ,43)
	STR3$ = MAKEIT ("STRING 3", 14)
	STR4$ = MAKEIT ("STRING 4", 14)
	CLS
	LOCATE 10,1
	CALL DUM1(VARSEG(STR1$),SADD(STR1$), VARSEG(STR2$),SADD(STR2$),_
	          VARSEG(STR3$), SADD(STR3$), VARSEG(STR4$), SADD(STR4$) )
	LOCATE 24,1
	END
	FUNCTION MAKEIT$ (S$,SIZE%)
	   MAKEIT$ = LEFT$(S$+STRING$(80, 32),SIZE%)
	END FUNCTION
	
	The following FORTRAN program is FORSUB.FOR:
	
	      SUBROUTINE DUM1(STR1, STR2, STR3, STR4)
	      CHARACTER*14 STR3, STR4 [FAR]
	      CHARACTER*43 STR1 [FAR]
	      CHARACTER*44 STR2  [FAR]
	      WRITE (*,*) STR1, STR2, STR3, STR4
	      END
