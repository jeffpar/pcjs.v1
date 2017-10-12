---
layout: page
title: "Q51708: /Ot Generates Incorrect Code on JMP SHORT $+2"
permalink: /pubs/pc/reference/microsoft/kb/Q51708/
---

	Article: Q51708
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00 buglist2.01 s_quickasm
	Last Modified: 17-JAN-1990
	
	In the example below, with the following compile options
	
	   /AS /G2 /Ot /Zp2
	
	a reference to the "$" (current location counter) symbol from within
	the scope of an _asm directive results in an incorrect assignment.
	This problem occurs with QuickC Versions 2.00 and 2.01.
	
	With any optimization switch other than /Ot, the short jump is
	correctly resolved to $+2. With /Ot, the short jump is incorrectly
	resolved to _main+2.
	
	To work around the problem, compile and link separately. Compile with
	/Zi (embedding CodeView information, thus altering the code
	generation) and link without /CO (so that the CodeView information is
	not passed to the .EXE file).
	
	Microsoft has confirmed this to be a problem with QuickC Versions 2.00
	and 2.01. We are researching this problem and will post new
	information here as it becomes available.
	
	The following example demonstrates the problem:
	
	main()
	{
	   _asm
	   {
	      MOV DX, 0x21
	      IN  AL, DX
	      JMP SHORT $+2
	      OR  AL, 0x10
	      OUT DX, AL
	   }
	}
