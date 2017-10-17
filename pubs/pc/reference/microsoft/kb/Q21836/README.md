---
layout: page
title: "Q21836: Length of Strings, String Descriptors in Compiler, Interpreter"
permalink: /pubs/pc/reference/microsoft/kb/Q21836/
---

## Q21836: Length of Strings, String Descriptors in Compiler, Interpreter

	Article: Q21836
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 1-AUG-1990
	
	String variables in QuickBASIC versions 1.00 through 4.50 and in
	Microsoft BASIC Compiler versions 6.00 and 6.00b and in Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10 can
	contain up to 32,767 characters (32K). Each variable-length string
	variable has a 4-byte string descriptor, which is composed of a 2-byte
	length followed by a 2-byte address.
	
	Fixed-length strings (which were introduced in QuickBASIC versions
	4.00 and later and in BASIC compiler 6.00 and later) do not have a
	string descriptor.
	
	For comparison, variable-length string variables in Microsoft GW-BASIC
	(versions 3.20, 3.22, 3.23) and IBM BASICA Interpreters have 3-byte
	string descriptors, with 1 byte of length followed by 2 bytes of
	address. String variables may contain up to 255 characters in GW-BASIC
	and IBM BASICA.
