---
layout: page
title: "Q46947: Type of Expression &quot;&amp;arrayname&quot; Changes under ANSI C"
permalink: /pubs/pc/reference/microsoft/kb/Q46947/
---

	Article: Q46947
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G890706-22068
	Last Modified: 26-JUL-1989
	
	Question:
	
	When I compile the following program
	
	1:  void main(void)
	2:      {
	3:      char String[10];
	4:      char *s;
	5:
	6:      s = &String;
	7:      }
	
	using Version 5.10 and the command line
	
	   cl -W3 karma.c
	
	the compiler generates the following message:
	
	   karma.c(6) : warning C4046: '&' on function/array, ignored
	
	This is consistent with historical C behavior. However, I understand
	that ANSI C considers array names to be lvalues. The July 1989 MSJ
	article "Pointers 101: Understanding and Using Pointers in the C
	Language" validates this assumption. Does this mean that the "&" in
	"&String" is no longer benign? Under ANSI C, does this give me (in
	effect) a pointer to the address of "String"? What is the type and
	value of the expression "&String"?
	
	Response:
	
	The 5.10 compiler ignores the "&", so the type of "&String" is the
	same as "String", which is "pointer to char." This represents common
	pre-ANSI behavior.
	
	ANSI requires that the type of "&String" now be "pointer to array of
	10 char." The next version of Microsoft C will conform to this
	requirement.
	
	However, aside from type warnings that may occur, this change IS
	benign because the address generated is identical in either case --
	the address of the zeroth element of the array. In other words, it
	will not somehow generate the address of the address -- especially
	since the address is a constant.
