---
layout: page
title: "Q65884: How to Pass a BASIC COMMON Block to a FORTRAN 5.00 Subroutine"
permalink: /pubs/pc/reference/microsoft/kb/Q65884/
---

## Q65884: How to Pass a BASIC COMMON Block to a FORTRAN 5.00 Subroutine

	Article: Q65884
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900810-80 H_Fortran B_QuickBas
	Last Modified: 22-OCT-1990
	
	This article explains how to pass a BASIC COMMON block to a FORTRAN
	version 5.00 subroutine.
	
	This information applies to Microsoft QuickBASIC version 4.50, to
	Microsoft BASIC Professional Development System (PDS) version 7.00 for
	MS-DOS and MS OS/2, and to Microsoft FORTRAN Compiler version 5.00.
	This information does not apply to earlier versions of these products
	(due to incompatibilities).
	
	To program interlanguage calling between FORTRAN 5.00 and BASIC PDS
	version 7.10, you must obtain the following application note from
	Microsoft Product Support:
	
	   "How to Link BASIC PDS 7.10 with C 5.10, FORTRAN 5.00, or Pascal
	    4.00." (application note number BB0345)
	
	(The FORTRAN 5.00 run-time libraries must be rebuilt as shown in this
	application note to be compatible with the BASIC PDS 7.10 run-time
	libraries.)
	
	The technique illustrated below shows how to pass a named BASIC COMMON
	block to a FORTRAN subroutine. This technique will not work with
	unnamed BASIC COMMON blocks. This technique will work only with
	FORTRAN version 5.00 because you must use a FORTRAN STRUCTURE...END
	STRUCTURE data type, which is not supported in earlier versions of
	FORTRAN.
	
	The strategy is to pass the segment and offset of the first variable
	in the named BASIC COMMON block as a parameter in the call to the
	FORTRAN subroutine. The FORTRAN subroutine should set up a
	STRUCTURE...END STRUCTURE type variable with the same format as the
	BASIC COMMON block. The FORTRAN subroutine must receive this STRUCTURE
	type variable as a formal parameter.
	
	Code Example
	------------
	
	Below is the BASIC program BASCOMMN.BAS that sets up the named COMMON
	block, initializes the values, and calls the FORTRAN subroutine:
	
	   'BASCOMMN.BAS **********************************************
	   DECLARE SUB FORSUB (BYVAL segment%, BYVAL offset%)
	   COMMON SHARED /Example/ a%, b&, c!, d#
	   CLS
	   a% = 10
	   b& = 2000
	   c! = 30.3
	   d# = 40.125
	   PRINT
	   PRINT "Hit any key to call the FORTRAN subroutine"
	   SLEEP
	   CALL FORSUB(VARSEG(a%), VARPTR(a%))
	   LOCATE 8, 1: PRINT "back in basic"
	   END
	
	Below is the FORTRAN program FORCOMMN.FOR, which contains the
	subroutine Forub(). It sets up a STRUCTURE type variable similar to
	the corresponding named BASIC COMMON block, and prints out the values:
	
	C FORCOMMN.FOR   **********************************************
	      SUBROUTINE FORSUB( VAR )
	      STRUCTURE /BASCOMMON/
	          INTEGER*2 A
	          INTEGER*4 B
	          REAL*4    C
	          DOUBLE PRECISION D
	      END STRUCTURE
	      RECORD /BASCOMMON/ VAR
	      PRINT *, VAR.A
	      PRINT *, VAR.B
	      PRINT *, VAR.C
	      PRINT *, VAR.D
	      END
	
	Below is the BASIC code for NEARHEAP.BAS, which allocates near heap
	space for the FORTRAN subroutine. If you are working inside the
	QuickBASIC QB.EXE or QBX.EXE environment, compile this routine and put
	it into a Quick library along with the FORTRAN program. If you are
	compiling and linking into an .EXE program, put these lines in the
	source code of the BASIC program or in a separate BASIC .OBJ module in
	a .LIB library.
	
	   ' NEARHEAP.BAS **********************************************
	   DIM Heap%(2048)
	   COMMON SHARED /NMALLOC/ Heap%()
	
	Compile the FORTRAN program as follows:
	
	   FL /c /AM FORCOMMN.FOR
	
	To work inside the QuickBASIC 4.50 QB.EXE environment, build the
	libraries as follows:
	
	   BC NEARHEAP.BAS;
	   LIB FORCOMMN.LIB+NEARHEAP+FORCOMMN;
	   LINK /Q FORCOMMN.LIB, FORCOMMN.QLB,,BQLB45.LIB MLIBFER.LIB;
	
	To compile and link from DOS, build the libraries the same way and
	compile and link BASCOMMN.BAS as follows:
	
	   BC BASCOMMN;
	   LINK /NOE BASCOMMN+FORCOMMN.LIB,,,BRUN45.LIB+MLIBFER.LIB ;
	
	To work inside the BASIC PDS 7.00 QBX.EXE environment, build the
	libraries as follows
	
	   BC /Fs/FPi NEARHEAP;
	   LIB FORCOMMN.LIB+NEARHEAP+FORCOMMN;
	   LINK /Q FORCOMMN.LIB, FORCOMMN.QLB,,QBXQLB.LIB MLIBFER.LIB ;
	
	and compile and link from DOS as follows:
	
	   BC /Fs/FPi BASCOMMN;
	   LINK /NOE BASCOMMN+FORCOMMN.LIB,,,BRT70EFR+MLIBFER.LIB ;
	
	The output from the program is as follows:
	
	   Hit any key to call the Fortran subroutine
	                10
	              2000
	             30.300000
	             40.125000000000000
	
	   Back in BASIC
