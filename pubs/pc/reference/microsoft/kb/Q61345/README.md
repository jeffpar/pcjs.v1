---
layout: page
title: "Q61345: Differences Between FormatX&#36; Functions &amp; PRINT USING Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q61345/
---

## Q61345: Differences Between FormatX&#36; Functions &amp; PRINT USING Statement

	Article: Q61345
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900305-84
	Last Modified: 27-JUL-1990
	
	This article demonstrates the differences between the FormatX$
	Add-On-Library (DTFMTxx.LIB) functions and the BASIC PRINT USING
	statement, specifically in the case of the "#" character.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2. FormatX$
	refers to the Add-On-Library functions FormatI$, FormatL$, FormatS$,
	FormatD$, and FormatC$ found in BASIC PDS 7.00 and 7.10.
	
	In the PRINT USING statement, the # sign is used in the string
	identifier to specify a digit placeholder. If there isn't a digit in
	that location, a space is put in its place. In the FormatX$ functions,
	the # is also a placeholder. However, if there isn't a digit, the
	location is not padded with a space.
	
	The FormatX$ functions can be invoked from within the QB.EXE
	environment by installing the DTFMTER.QLB Quick library. These
	functions can be invoked from .EXE programs by linking in the
	appropriate DTFMTxx.LIB library.
	
	The FUNCTION declarations necessary for the FormatX$ functions are
	contained in the FORMAT.BI include file, which can be included in your
	source file as follows:
	
	   REM $INCLUDE:'FORMAT.BI'
	
	The syntax for the FormatX$ function(s) is as follows
	
	   FORMATx$ (Variable, fmt$)
	
	where:
	
	1. "x" is the first letter of the data type being manipulated:
	
	      Data Type           Syntax
	      ---------           ------
	
	      Integer             FORMATI$
	      Long integer        FORMATL$
	      Single precision    FORMATS$
	      Double precision    FORMATD$
	      Currency            FORMATC$
	
	2. "Variable" is the variable to be manipulated.
	
	3. "fmt$" is a string expression defining the output format.
	
	The format for the PRINT USING statement is as follows
	
	   PRINT USING fmt$; Variable [,Variable2...][,|;]
	
	where:
	
	1. "fmt$" is a string expression defining the output format.
	
	2. "Variable" is an expression(s) to be manipulated.
	
	3. "," or ";" are optional output choices to print next output
	   immediately following. (Note that PRINT USING does not support
	   "print zones.")
	
	The following code example demonstrates the difference in the #
	operand in the fmt$ argument for FORMATX$ versus PRINT USING:
	
	   ' $INCLUDE: 'FORMAT.BI'
	   A = 123.456
	   B = 88.99
	
	   ' ------  PRINT USING STATEMENTS:
	   PRINT USING "#####.##";A
	   PRINT USING "######.###";B
	   PRINT
	
	   ' ------  FORMATX$ STATEMENTS:
	   PRINT FORMATS$(A,"#####.##")
	   PRINT FORMATS$(B,"######.###";B
	   END
	
	The output will resemble the following:
	
	     123.46
	       88.990
	
	   123.46
	   88.99
