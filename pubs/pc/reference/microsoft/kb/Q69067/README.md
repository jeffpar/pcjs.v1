---
layout: page
title: "Q69067: Even and Align Directives Are Ignored in Inline Assembly"
permalink: /pubs/pc/reference/microsoft/kb/Q69067/
---

	Article: Q69067
	Product: Microsoft C
	Version(s): 2.00 2.01 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | s_c buglist2.00 buglist 2.01 buglist2.50 buglist2.51
	Last Modified: 6-FEB-1991
	
	The use of the align and even directives in inline assembly blocks in
	QuickC should generate NOP instructions so that the code that follows
	the directive will reside on the specified byte boundary. However,
	these directives never generate any NOP instructions.
	
	The quick compile (/qc) feature of C versions 6.00 and 6.00a also
	performs incorrectly. The align and even directives will work properly
	under C versions 6.00 and C 6.00a if the /qc option is not used.
	
	Sample Code
	-----------
	
	void main (void)
	  {
	  _asm
	    {
	    even
	    push ds
	    even
	    pop  ds
	    }
	  }
	
	Microsoft has confirmed this to be a problem in QuickC versions 2.00,
	2.01, 2.50, 2.51 and C versions 6.00, and 6.00a (buglist6.00 and
	buglist6.00a). We are researching this problem and will post new
	information here as it becomes available.
