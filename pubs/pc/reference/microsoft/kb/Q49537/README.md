---
layout: page
title: "Q49537: The CodeView Port Input Command Example Is Unclear"
permalink: /pubs/pc/reference/microsoft/kb/Q49537/
---

## Q49537: The CodeView Port Input Command Example Is Unclear

	Article: Q49537
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | H_MASM H_FORTRAN S_Pascal
	Last Modified: 27-OCT-1989
	
	The CodeView example for port input command is unclear in the
	following manuals:
	
	1. Page 150 of Microsoft C 5.10 "CodeView And Utilities, Microsoft
	   Editor, Mixed Language Programming Guide"
	
	2. Page 150 of Microsoft Macro Assembler 5.10 CodeView and Utilities
	
	3. Page 150 of Microsoft Pascal 4.00 CodeView and Utilities
	
	4. Page 127 of Microsoft FORTRAN 5.10 CodeView and Utilities
	
	The example assumes the radix is in hexadecimal. To set the radix to
	hexadecimal, type in the following command:
	
	   >n16
	
	After setting the radix to hexadecimal, the example works properly.
	
	If the radix is not in hexadecimal, a "0x" must be present for
	CodeView to recognize the value as a hex format. The following example
	shows how to use the port input command if CodeView is not in
	hexadecimal radix:
	
	   >I 0x2f8
