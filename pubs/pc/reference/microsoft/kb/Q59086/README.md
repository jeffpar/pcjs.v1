---
layout: page
title: "Q59086: Error C2094: Label &quot;xxx&quot; Was Undefined"
permalink: /pubs/pc/reference/microsoft/kb/Q59086/
---

	Article: Q59086
	Product: Microsoft C
	Version(s): 2.00 2.01 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm S_C
	Last Modified: 18-NOV-1990
	
	The following error occurs with inline assembly if one of the operands
	is a hexadecimal value that starts with an alphanumeric character
	(A-F, a-f):
	
	   error C2094 : label 'xxx' was undefined
	
	Sample Code
	-----------
	
	void main(void)
	{
	   _asm mov ah, f0h
	}
	
	This is expected behavior in inline assembly since "f0h" is a valid C
	variable and it is also a valid label name. In the sample code, since
	"f0h" was not declared as a variable and there is no label defined as
	"f0h", the compiler returns with an error C2094.
	
	To use a hexadecimal value that starts with an alphanumeric character
	into a register, there are two options as follows:
	
	1. Assign the value to a variable, then move the contents of the
	   variable into the register, as follows:
	
	      unsigned char hex_value = 0xf0;
	      void main (void)
	      {
	         _asm mov ah, hex_value
	      }
	
	2. Instead of using Assembler notation (F0h), use C notation for
	   the hex value, as follows:
	
	      void main(void)
	      {
	         _asm mov ah, 0xf0
	      }
	
	3. Use a leading 0 (zero) [or multiple leading 0s (zeros)] on the
	   MASM-style hex constant. This procedure sets the value for the high
	   and low portion of the register, as follows:
	
	      void main(void)
	      {
	         _asm mov ax, 000f0h
	      }
