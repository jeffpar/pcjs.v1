---
layout: page
title: "Q41578: &quot;st&quot; Is the Floating Point Stack Register in In-Line Assembly"
permalink: /pubs/pc/reference/microsoft/kb/Q41578/
---

	Article: Q41578
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	Question:
	
	Why can't I use the variable "st" in a block of in-line assembly code?
	
	Response:
	
	The "st" variable is the floating point stack register and as such is
	a reserved name. If you attempt to use this name in an LES or LDS
	instruction, you will receive the following error:
	
	   error C2415 : improper operand type
	
	You should not use "st" as a variable name. Choose another name
	instead.
	
	The following code generates error C2415 when compiled under any
	memory model, at any warning level, and with MS EXTENSIONS enabled:
	
	char * st;           /* st is the floating point stack register */
	main() {
	  _asm  {
	      les  di, st    /* generates the error */
	      lds  si, st    /* generates the error */
	  }
	}
	
	Changing "st" to any other nonreserved name will resolve this
	situation.
