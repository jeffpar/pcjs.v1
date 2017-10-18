---
layout: page
title: "Q68873: Warning A4057 When Using Local Variables"
permalink: /pubs/pc/reference/microsoft/kb/Q68873/
---

## Q68873: Warning A4057 When Using Local Variables

	Article: Q68873
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10 fixlist5.10a
	Last Modified: 6-FEB-1991
	
	The code below produces the following error:
	
	   Warning A4057: illegal size for operand
	
	This warning is falsely generated and does not occur with version
	5.10a of the Microsoft Macro Assembler (MASM).
	
	The variable arg1, shown in the code below, is a local variable that
	is defined as a double word. The warning occurs when arg1 is used as
	a WORD PTR. This is acceptable and should not be flagged.
	
	Microsoft has confirmed this to be a problem in MASM
	version 5.10. This problem was corrected in version 5.10a.
	
	Sample Code
	-----------
	
	    .MODEL small,c
	    .CODE
	
	    Begin proc arg1:dword
	      mov ax, word ptr arg1
	      ret
	    Begin endp
	    end Begin
