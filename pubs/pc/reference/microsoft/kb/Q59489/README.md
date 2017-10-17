---
layout: page
title: "Q59489: L2022, L2029 on PM Functions Not Prototyped As EXPENTRY"
permalink: /pubs/pc/reference/microsoft/kb/Q59489/
---

## Q59489: L2022, L2029 on PM Functions Not Prototyped As EXPENTRY

	Article: Q59489
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | o_os2sdk
	Last Modified: 15-MAR-1990
	
	Problem:
	
	I receive the following error messages when I link my PM (Presentation
	Manager) program:
	
	   LINK : error L2022: ClientWndProc (alias ClientWndProc) :
	          export undefined
	
	   LINK : error L2029 : 'ClientWndProc' : unresolved external
	
	Response:
	
	Most frequently, this problem is caused by having an /NOI linker
	option, which forces the linker to distinguish between uppercase and
	lowercase. For more information, search the knowledge base using the
	following query:
	
	   L2022 and L2029 and /noi
	
	These linker error messages may also occur if you forget to prototype
	your functions with the EXPENTRY keyword. The EXPENTRY keyword is
	defined in OS2DEF.H as follows:
	
	   #define EXPENTRY far pascal
	
	The "pascal" keyword instructs the compiler to use left-to-right
	calling sequences for the function it modifies. The keyword also
	causes the conversion of the function's name to uppercase letters.
	
	Not using the EXPENTRY keyword means that your function names are not
	converted to uppercase, so even though you declare a .DEF file, which
	includes the following line
	
	   EXPORTS        ClientWndProc
	
	the linker cannot resolve definitions for the function because it does
	not see ClientWndProc and CLIENTWNDPROC as being equal.
