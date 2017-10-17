---
layout: page
title: "Q68663: Passing BASIC Numeric Arrays from BASIC to C and Back to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q68663/
---

## Q68663: Passing BASIC Numeric Arrays from BASIC to C and Back to BASIC

	Article: Q68663
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910114-113 B_BasicCom
	Last Modified: 29-JAN-1991
	
	The following example demonstrates how to pass numeric arrays from
	compiled BASIC to Microsoft C then back to BASIC using BASIC's "by
	reference" calling convention.
	
	This information applies to Microsoft QuickBASIC 4.00, 4.00b, and 4.50
	for MS-DOS, to Microsoft BASIC Compiler 6.00 and 6.00b for MS-DOS and
	MS OS/2, and to Microsoft Professional Development System 7.00 and
	7.10 for MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and C, and a list of which BASIC and C versions are compatible
	with each other, query in the Software/Data Library for the following
	word:
	
	    BAS2C
	
	The example below differs from the other BAS2C array-passing examples
	in that the example below lets you pass array data from BASIC to C
	then back to BASIC. The other BAS2C examples pass array data from
	BASIC to C but not back to BASIC.
	
	Code Example
	============
	
	Compile and link the sample programs below as follows:
	
	   BC /O ByRefB.BAS ;
	   CL /c /W3 /AM ByRefC.C
	   LINK /NOE ByRefB ByRefC ;
	
	ByRefB.BAS
	----------
	
	' Declare the BASIC and C routines to use the same calling
	' convention. In this case we want the BASIC "BY REFERENCE"
	' calling convention.
	
	DECLARE SUB BTest (Array1%(), Array2!(), Array3#(), Array4&())
	DECLARE SUB CTest (Array1%(), Array2!(), Array3#(), Array4&())
	' $STATIC
	DIM A%(10), B!(10) ' Define some STATIC data in "DGROUP"
	' $DYNAMIC
	DIM C#(10), D&(10) ' And, some DYNAMIC data
	CLS
	FOR i% = 0 TO 10   ' Initialize the arrays
	    A%(i%) = i%
	    B!(i%) = .5 * i%
	    C#(i%) = 1.5 * i%
	    D&(i%) = i% * i%
	NEXT i%
	CTest A%(), B!(), C#(), D&()
	PRINT A%(10), B!(10), C#(10), D&(10)
	END
	SUB BTest (Array1%(), Array2!(), Array3#(), Array4&())
	    PRINT
	    FOR i% = 0 TO 10
	        PRINT Array1%(i%), Array2!(i%), Array3#(i%), Array4&(i%)
	    NEXT i%
	END SUB
	
	ByRefC.C
	--------
	
	#include <stdio.h>
	
	/**
	 ** Use "typedef" to reduce complexity/readability of code.
	 **
	 ** BASIC's BY REFERENCE is a near handle to a far pointer for the
	 ** actual data of numeric arrays.
	 **/
	typedef int    far * near * HInt ;
	typedef long   far * near * HLng ;
	typedef float  far * near * HSng ;
	typedef double far * near * HDbl ;
	
	/**
	 ** Define the BASIC routine as a "standard BASIC" call so the
	 ** parameters will be the same.
	 **/
	extern void pascal BTest ( HInt, HSng, HDbl, HLng ) ;
	
	/**
	 ** Define our C routine as a "standard BASIC" routine so we look
	 ** like BASIC. This simplifies the parameter passing since we
	 ** all look the same on the stack.
	 **/
	void pascal CTest (HInt IntArray, HSng SngArray,
	                   HDbl DblArray, HLng LngArray)
	    {
	        int j, i;
	        printf ("\nOriginal Array Values\n") ;
	        BTest ( IntArray, SngArray, DblArray, LngArray ) ;
	        for (i = 0, j = 10; i < 6; i++, j--)
	            {
	                (*IntArray)[i] = (*IntArray)[j] ;
	                (*LngArray)[i] = (*LngArray)[j] ;
	                (*SngArray)[i] = (*SngArray)[j] ;
	                (*DblArray)[i] = (*DblArray)[j] ;
	            }
	     printf ("\nModified Array Values\n") ;
	        BTest ( IntArray, SngArray, DblArray, LngArray ) ;
	        printf ("\nModified Last Array Elements\n") ;
	        (*IntArray) [10] = (int)    3 ;
	        (*SngArray) [10] = (float)  4.45 ;
	        (*DblArray) [10] = (double) 30.303 ;
	        (*LngArray) [10] = (long)   445 ;
	    }
	
	Program Output
	==============
	
	 Original Array Values
	
	  0             0             0             0
	  1             .5            1.5           1
	  2             1             3             4
	  3             1.5           4.5           9
	  4             2             6             16
	  5             2.5           7.5           25
	  6             3             9             36
	  7             3.5           10.5          49
	  8             4             12            64
	  9             4.5           13.5          81
	  10            5             15            100
	
	 Modified Array Values
	
	  10            5             15            100
	  9             4.5           13.5          81
	  8             4             12            64
	  7             3.5           10.5          49
	  6             3             9             36
	  5             2.5           7.5           25
	  6             3             9             36
	  7             3.5           10.5          49
	  8             4             12            64
	  9             4.5           13.5          81
	  10            5             15            100
	
	 Modified Last Array Elements
	
	  3             4.45          30.303        445
