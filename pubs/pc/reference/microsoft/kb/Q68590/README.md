---
layout: page
title: "Q68590: &quot;Symbol Defined More Than Once&quot; LINKing BASIC 7.10/FORTRAN 5.0"
permalink: /pubs/pc/reference/microsoft/kb/Q68590/
---

## Q68590: &quot;Symbol Defined More Than Once&quot; LINKing BASIC 7.10/FORTRAN 5.0

	Article: Q68590
	Version(s): 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910111-256 H_FORTRAN
	Last Modified: 29-JAN-1991
	
	Below is an example where linking BASIC PDS 7.10 with FORTRAN 5.00
	gives several "Symbol defined more than once" errors. In this specific
	case, the problem can be worked around by compiling with BC /O (the
	stand-alone .EXE option, using BCL71ENR.LIB).
	
	=======================================================================
	
	IMPORTANT NOTE: Linking Microsoft BASIC Professional Development
	System (PDS) 7.10 with Microsoft FORTRAN 5.00 requires first changing
	the FORTRAN library and including a Microsoft C 6.00 library, as
	explained in a separate application note, "How to Link BASIC PDS 7.10
	with C 5.10, FORTRAN 5.00, or Pascal 4.00." To find this application
	note in a separate article in this knowledge base, search for the
	words shown in the title of the application note, or BB0345. Despite
	using the steps in the application note, linking certain BASIC 7.10
	and FORTRAN 5.00 programs may generate the "Symbol defined more than
	once" errors described in the example below.
	
	Although the methods in the application note have been designed to
	produce compatible results, we have not put the methods through a
	standard Microsoft mixed-language testing cycle, and it is possible
	that you may still encounter compatibility problems under certain
	conditions. We cannot guarantee the complete success of mixed-
	language programming of BASIC PDS 7.10 with C 5.10, FORTRAN 5.00, or
	Pascal 4.00. Further problems or questions can be directed to
	Microsoft Language Support Services.
	
	=======================================================================
	
	To duplicate the problem, create the following code:
	
	BASIC.BAS
	---------
	
	REM *********************BASIC CODE*****************************
	DIM x%(2048)
	COMMON SHARED /nmalloc/ x%()
	DECLARE SUB Test()
	CALL Test
	END
	
	FORTRAN.FOR
	-----------
	
	C  *********************FORTRAN CODE***************************
	      SUBROUTINE Test
	      REAL frq(1)
	      WRITE(6,*)wreal
	      i=INT(frq(i))
	      RETURN
	      END
	
	Compile and link with the following commands:
	
	   (Note: To create MIXED.LIB, you must obtain the application note
	   "How to Link BASIC PDS 7.10 with C 5.10, FORTRAN 5.00, or Pascal
	   4.00.")
	
	 BC /E /FPi /Zi basic.bas;
	 fl /c /4Yb /FPi /Zi fortran.for
	 link /NOD/NOE/CO basic.obj + fortran.obj,s.exe,,brt71enr.lib+
	                   llibcer.lib+mixed.lib;
	
	LINK.EXE generates the following errors:
	
	mixed.lib(\mrt\c\87ccallf.asm) : error L2025: __flds : symbol defined
	more than once.
	mixed.lib(\mrt\c\87ccallf.asm) : error L2025: __fsts : symbol defined
	more than once.
	mixed.lib(\mrt\c\87ccallf.asm) : error L2025: __fadds: symbol defined
	more than once.
	mixed.lib(\mrt\c\87ccallf.asm) : error L2025: __fdivs: symbol defined
	more than once.
	mixed.lib(\mrt\c\87ccallf.asm) : error L2025: __fsubs: symbol defined
	more than once.
	mixed.lib(\mrt\c\87ccallf.asm) : error L2025: __fmuls: symbol defined
	more than once.
	mixed.lib(\mrt\c\87ccallf.asm) : error L2025: __fstsp: symbol defined
	more than once.
	mixed.lib(\mrt\c\87ccallf.asm) : error L2025: __fdivsr: symbol
	defined more than once.
	mixed.lib(\mrt\c\87ccallf.asm) : error L2025: __fsubsr: symbol
	defined more than once.
	
	To work around this problem, add /O to the BASIC compiler command line
	and then relink, as follows:
	
	   BC /O /E /FPi /Zi basic.bas;
	   link /NOD/NOE/CO basic.obj + fortran.obj,s.exe,,BCL71ENR.LIB+
	                   llibcer.lib+mixed.lib;
