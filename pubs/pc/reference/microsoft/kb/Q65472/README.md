---
layout: page
title: "Q65472: Predefined Identifiers in Microsoft C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q65472/
---

## Q65472: Predefined Identifiers in Microsoft C 6.00

	Article: Q65472
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickhelp s_c s_utils
	Last Modified: 24-OCT-1990
	
	The following information is contained in the online help for the
	Microsoft C Compiler version 6.00.
	
	This information below can be accessed by using the following steps:
	
	1. Obtain help on the text "cl" using either the F1 key from the
	   Programmer's WorkBench, or by using "qh cl" from the DOS or OS/2
	   command lines.
	
	2. Select Preprocessor Options, then Predefined Identifiers.
	The compiler automatically defines identifiers useful in writing
	portable programs. You can use these identifiers to compile code
	sections conditionally. These identifiers are always defined unless
	otherwise stated.
	
	   Identifier       Target Identified
	   ----------       -----------------
	
	   MSDOS            MS-DOS operating system
	   M_I86            Member of the I86 processor family
	   M_I86mM          Memory model type
	                    <m> = T    Tiny
	                          S    Small (default)
	                          C    Compact model
	                          M    Medium model
	                          L    Large model
	                          H    Huge model
	   M_I8086          8088 or 8086 processor; default or with /G0
	                       option
	   M_I286           80286 processor; defined with /G1 or /G2 option
	   _MSC_VER         Identifies the version of Microsoft C
	   NO_EXT_KEYS      Disables Microsoft-specific language extensions
	                       and extended keywords; defined only with /Za
	                       option
	   _CHAR_UNSIGNED   Changes default char type to unsigned; defined
	                       only with /J option
	
	The _MSC_VER identifier has a value of 600 for the Microsoft C Compiler
	version 6.00. This identifier is not defined in Microsoft C versions
	5.10 and earlier.
