---
layout: page
title: "Q66507: CodeView Fails to Return Value in ES"
permalink: /pubs/pc/reference/microsoft/kb/Q66507/
---

## Q66507: CodeView Fails to Return Value in ES

	Article: Q66507
	Version(s): 3.00 3.10 3.11
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 buglist3.10 buglist3.11
	Last Modified: 9-NOV-1990
	
	When CodeView is running in extended memory and a call is made to
	interrupt 15h function C0h, the value in the ES register is not
	changed. This interrupt call should return the segment of the system
	configuration table in the ES register. If CodeView is run with the /D
	or /E option, a value is returned in the ES register as it should be.
	
	Microsoft has confirmed this to be a problem in CodeView versions
	3.00, 3.10, and 3.11. We are researching this problem and will post
	new information here as it becomes available.
	
	Sample Code
	-----------
	
	main ()
	  {
	   _asm mov ah, 0xC0
	  _asm int 0x15
	  }
