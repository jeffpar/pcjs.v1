---
layout: page
title: "Q46919: MASM ALIGN Directive May Not Work Properly"
permalink: /pubs/pc/reference/microsoft/kb/Q46919/
---

## Q46919: MASM ALIGN Directive May Not Work Properly

	Article: Q46919
	Version(s): 
	Operating System: 5.00 5.10 5.10a | 5.00 5.10 5.10a
	Flags: MS-DOS          | OS/2
	Last Modified: 30-AUG-1989
	
	ENDUSER |
	
	The ALIGN directive for MASM may not work properly. It aligns values 2
	bytes beyond where they should be aligned, e.g. if ALIGN 4 is being
	used, values align only at the following offsets:
	
	    02h, 06h, 0Ah, 0Eh, ... etc.
	
	If ALIGN 16 (decimal) is being used, values are aligned only at the
	following offsets:
	
	    02h, 12h, 22h, 32h, ... etc.
	
	This is not a problem for word alignment. ALIGN 2 has the same effect as
	the EVEN directive.
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
