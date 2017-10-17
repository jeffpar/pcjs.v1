---
layout: page
title: "Q42760: /Zg Misspells the Word &quot;Interrupt&quot; for Function Pointers"
permalink: /pubs/pc/reference/microsoft/kb/Q42760/
---

## Q42760: /Zg Misspells the Word &quot;Interrupt&quot; for Function Pointers

	Article: Q42760
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 18-MAY-1989
	
	When the following program is compiled with /Zg switch to generate
	function declarations from function definitions, an incorrect function
	declaration for function X is generated. Part of the output that /Zg
	produces is the following:
	
	extern int x(void(_interrurt far *r)());
	
	The word "interrupt" is misspelled.
	
	The correct function declaration should be the following:
	
	extern int x(void (interrupt far *r)());
	
	To work around the problem, use an editor to correct the misspelling
	in the output file.
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
	
	A program example that demonstrates this problem is the following:
	
	main()
	{
	}
	
	x(r)
	void (far interrupt *r)();
	{
	}
