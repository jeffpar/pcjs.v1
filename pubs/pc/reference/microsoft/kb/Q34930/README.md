---
layout: page
title: "Q34930: MASM Generates Stack Overflow on Code with Redefinition"
permalink: /pubs/pc/reference/microsoft/kb/Q34930/
---

## Q34930: MASM Generates Stack Overflow on Code with Redefinition

	Article: Q34930
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 12-JAN-1989
	
	The following example causes MASM to generate the error message,
	"run-time error R6000 - stack overflow":
	
	            .model   small
	            .code
	
	      xx    equ      <nop>
	
	      xx    macro
	            nop
	            endm
	
	            xx
	
	            end
	
	The workaround is to remove the redefinition "xx".
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
