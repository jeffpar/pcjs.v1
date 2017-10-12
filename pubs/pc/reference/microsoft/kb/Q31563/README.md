---
layout: page
title: "Q31563: Linking FORTRAN and C, &quot;L2044 _FF_MsgBanner Multiply Defined&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q31563/
---

	Article: Q31563
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | h_fortran 4.00 4.01
	Last Modified: 16-JUN-1988
	
	Problem:
	   When linking FORTRAN and C modules, I receive the error "L2044
	_FF_MsgBanner Symbol Multiply Defined." I have set up FORTRAN for C
	compatibility, and I am linking with the /NOE switch.
	
	Response:
	   When using FORTRAN Versions 4.00 or 4.01 with C, you need to run
	the F4COMPAT file to make your FORTRAN libraries C compatible because
	FORTRAN Versions 4.00 and 4.01 were written in C Version 4.00.
	   If the /NOD switch is used, altering the order of the libraries may
	change the error message received. When the FORTRAN library is first,
	the error may be "Floating Point Not Loaded." When the C library is
	first, the error will be "Symbol Multiply Defined."
