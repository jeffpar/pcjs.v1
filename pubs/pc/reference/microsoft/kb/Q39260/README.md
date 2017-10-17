---
layout: page
title: "Q39260: &quot;Symbol Defined More Than Once&quot;; Linking BASIC and FORTRAN"
permalink: /pubs/pc/reference/microsoft/kb/Q39260/
---

## Q39260: &quot;Symbol Defined More Than Once&quot;; Linking BASIC and FORTRAN

	Article: Q39260
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00b buglist4.50 B_BasicCom H_Fortran
	Last Modified: 20-SEP-1990
	
	Mixed-language programming with BASIC and FORTRAN may produce an
	"L2025: Symbol defined more than once" linker error. The error occurs
	even if the /NOE linker switch is used. Possible reasons for this
	problem are version-dependent, as described below.
	
	The following are three known problems that make LINK.EXE give an
	"L2025: Symbol defined more than once" error when linking compiled
	BASIC and FORTRAN. Problem 1 is a software limitation (not a bug), but
	Problems 2 and 3 are software problems (bugs) that Microsoft is
	researching:
	
	1. LINKing compiled BASIC with the incorrect version of Microsoft
	   FORTRAN can cause the L2025 error.
	
	   Microsoft BASIC Professional Development System (PDS) version 7.10
	   currently cannot link with any version of FORTRAN (5.00 or earlier),
	   but Microsoft is working on a workaround for this limitation.
	   BASIC PDS version 7.00 requires Microsoft FORTRAN version 5.00.
	   QuickBASIC versions 4.00b and 4.50 and Microsoft BASIC Compiler
	   versions 6.00 and 6.00b require Microsoft FORTRAN version 4.10.
	   QuickBASIC version 4.00 requires Microsoft FORTRAN version 4.00.
	
	   The following error displays if you LINK the incorrect version of
	   Microsoft FORTRAN with compiled BASIC:
	
	      The symbol __FF_MSGBANNER is defined more than once.
	
	   The solution to this problem is to link only the correct versions
	   of FORTRAN and compiled BASIC, as listed above.
	
	2. Using math functions such as SIN, COS, and SQRT in the FORTRAN
	   subroutine can cause the L2025 linker error. The following linker
	   error occurs if a BASIC program compiled with /O is linked with a
	   FORTRAN routine that was compiled with the correct version of
	   Microsoft FORTRAN compiler:
	
	      __ctrand1 [and __ctrand2]: Symbol defined more that once.
	
	   Compile and LINK the code example farther below as follows to
	   duplicate problem #2:
	
	      BC BASIC.BAS, BASIC.OBJ /x/o;
	      FL /c FORTRAN.FOR
	      LINK BASIC.OBJ+FORTRAN.OBJ, BFTEST.EXE /NOE;
	
	   Microsoft has confirmed this to be a problem in QuickBASIC versions
	   4.00b and 4.50 and in Microsoft BASIC Compiler versions 6.00 and
	   6.00b (buglist6.00, buglist6.00b). This problem was corrected in
	   Microsoft BASIC Professional Development System (PDS) version 7.00
	   (fixlist7.00).
	
	3. Using math functions such as SIN, COS, and SQRT in a FORTRAN 5.00
	   subroutine linked into a Quick library can cause the L2025 linker
	   error in BASIC PDS 7.00 (buglist7.00). This problem does not occur
	   when linking into an .EXE program (instead of into a Quick library),
	   or when not using FORTRAN math functions in the Quick library.
	
	   Compile and LINK the code example further below as follows to
	   duplicate Problem 3 in BASIC PDS 7.00 and FORTRAN 5.00:
	
	      FL /c FORTRAN.FOR
	      LINK /Q /NOE /NOD FORTRAN.OBJ+QBX.LIB,,,QBXQLB.LIB LLIBFORE.LIB
	
	    This LINK gives about 28 L2025 errors, such as the following:
	
	       llibfore.lib(dos\crt0dat.asm) : error L2025:: __osversion :
	       symbol defined more than once
	
	Code Example for Problems 2 and 3 (Above)
	-----------------------------------------
	
	The following is a set of routines that demonstrate Problems 2 and 3
	above. Note: If the BASIC program is compiled with QuickBASIC version
	 4.50 and the BC /O option is not used, Problem 2 does not occur.
	
	=== BASIC.BAS ===:
	
	   CALL ftest
	   END
	
	=== FORTRAN.FOR ===:
	
	        subroutine ftest
	        real a,b,c,d,e,p,q,r,s,t
	        c = sin(d)
	        p = p/e**5
	        q = sqrt(r * r + s * s + t * t)
	        return
	        end
