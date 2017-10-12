---
layout: page
title: "Q68111: No Mouse with GRDEMO.EXE Sample Program May Cause M6111"
permalink: /pubs/pc/reference/microsoft/kb/Q68111/
---

	Article: Q68111
	Product: Microsoft C
	Version(s): 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.50 s_quickasm
	Last Modified: 17-JAN-1991
	
	The Microsoft QuickC versions 2.50 and 2.51 compiler includes a sample
	program called GRDEMO.EXE that is created using GRDEMO.MAK. The module
	MOUSE.C incorrectly returns from the function MouseInit() when no
	mouse is found. It will return without cleaning up the stack, which
	may cause the following error:
	
	   run-time error M6111: MATH
	   floating-point error: stack underflow
	
	To work around this problem, make the following programming changes in
	MOUSE.C, and rebuild the program:
	
	1. Change line 74 from
	
	      ret
	
	   to the following:
	
	      jmp    nomouse
	
	2. Add the label "nomouse" just prior to the end of the inline
	   assembly code:
	
	   ...
	      mov   mi.cBtn, bx      ; Save...
	   nomouse:
	   }
	
	Microsoft has confirmed this to be a problem in QuickC versions 2.50
	and 2.51. We are researching this problem and will post new
	information here as it becomes available.
