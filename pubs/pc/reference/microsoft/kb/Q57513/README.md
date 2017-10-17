---
layout: page
title: "Q57513: Misspelling &quot;mov&quot; in _asm Creates C4405 and C2400"
permalink: /pubs/pc/reference/microsoft/kb/Q57513/
---

## Q57513: Misspelling &quot;mov&quot; in _asm Creates C4405 and C2400

	Article: Q57513
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm buglist2.00 buglist2.01
	Last Modified: 17-JAN-1990
	
	When using the inline assembly features of QuickC Versions 2.00 and 2.01,
	incorrectly typing "mov" as "move" will create C4405 and C2400.
	
	The following code demonstrates the problem:
	
	Sample Code
	-----------
	
	void main(void)
	{
	     _asm move al, 0
	}
	
	Compiling this file returns the following two messages:
	
	   C4405: 'al': identifier is reserved word
	   C2400: inline syntax error opcode, found 'al'
	
	Microsoft has confirmed this to be a problem in Versions 2.00 and
	2.01. We are researching this problem and will post new information
	here as it becomes available.
