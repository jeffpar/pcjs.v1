---
layout: page
title: "Q37342: LINK &quot;Symbol Defined More Than Once&quot; Mixing Math Packages"
permalink: /pubs/pc/reference/microsoft/kb/Q37342/
---

## Q37342: LINK &quot;Symbol Defined More Than Once&quot; Mixing Math Packages

	Article: Q37342
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 and to Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	You can pass variables between BASIC and other languages that have the
	alternate math package if each of the modules is compiled using that
	option. The error message L2025, "symbol defined more than once",
	results from any attempt to link modules that were compiled using
	different math package options.
	
	The code example below, which shows a BASIC program calling a C
	function, should be compiled and linked using the following syntax:
	
	   bc cf.bas /FPa [other optional switches are OK];
	   cl /AM /Gs /FPa /c cfunc.c
	   link cf+cfunc /noe;
	
	The alternate math package is not available in QuickBASIC, or in
	versions of the BASIC compiler earlier than Version 6.00.
	
	The following is sample code:
	
	' BASIC PROGRAM CF.BAS:
	DECLARE function cfunc# CDECL (byval x AS double)
	input "enter a floating point number ";x#
	print x#;" * 2 = ";cfunc(x#)
	
	/*   C FUNCTION CFUNC.C:   */
	   double  cfunc(double value)
	   {
	      return  (value * 2);
	   }
