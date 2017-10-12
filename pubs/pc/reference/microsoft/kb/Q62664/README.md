---
layout: page
title: "Q62664: C1001: Internal Compiler Error: '../grammar.c', Line 140"
permalink: /pubs/pc/reference/microsoft/kb/Q62664/
---

	Article: Q62664
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1990
	
	The following sample code generates an internal compiler error
	in the file grammar.c on Line 140 when compiled with optimizations
	disabled (/Od), with global register optimization (/Oe), or with
	loop optimization (/Ol). It will occur only under compact or large
	model.
	
	Sample Code
	-----------
	
	// #pragma optimize ( "t", on )  // Uncomment this to fix ICE
	
	#define TOTAL_LEGS 12
	#define TOTAL_PAGES 2
	
	#include <memory.h>
	
	struct leg {
	    int fix_index;
	    char id[6];
	    double latitude, longitude;
	    } ;
	
	struct page {
	    int index;
	    double x2, x3, y2, y3 ;
	    } ;
	
	struct leg trip_legs [ TOTAL_PAGES ] [ TOTAL_PAGES + 1 ] ;
	struct page pages [ TOTAL_PAGES ] ;
	
	int current_page;         // OR Initialize this to make ICE disappear
	
	void delete_wp1 ( int index ) ;
	
	void delete_wp1 ( int index )
	{
	   current_page = 1;
	   if ( index > 0 )
	   {                      // ICE occurs on following line
	      pages[current_page].x2 =
	           trip_legs [current_page] [index -1].longitude;
	
	      pages[current_page].y2 =
	           trip_legs[current_page][index - 1].latitude;
	   }
	}
	
	Compiling the above code with
	
	   cl /c /Od /AL test.c
	
	returns the following error message:
	
	   ice.c
	   ice.c(38) : fatal error C1001: Internal Compiler Error
	                   (compiler file '../grammar.c', line 140)
	                   Contact Microsoft Product Support Services
	
	The following are valid workarounds for this internal compiler error:
	
	1. Compile with a memory model other than large or compact.
	
	2. Compile with default optimizations (/Ot).
	
	3. Uncomment the pragmas to optimize for time.
	
	4. Initialize the current_page variable.
	
	5. Compile with the /qc option to run the QuickC Compiler.
