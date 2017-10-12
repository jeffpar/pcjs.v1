---
layout: page
title: "Q67008: Syntax Error When Watching Variables That Begin with "P""
permalink: /pubs/pc/reference/microsoft/kb/Q67008/
---

	Article: Q67008
	Product: Microsoft C
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist2.10 buglist2.20 fixlist3.00
	Last Modified: 18-NOV-1990
	
	When the following command is entered in the Command window to watch a
	variable that begins with the letter "p", the result is a syntax
	error:
	
	> W pvariable
	
	The syntax for watching a memory location is W[type] range, where the
	type and range specify the format and length of memory to be
	displayed, respectively.
	
	When no type is declared, as in the above example, the default type is
	used. The default type will be the last type used by a Dump, Enter,
	Watch Memory, or Tracepoint Memory command. If none of these commands
	has been used during the session, the default type is byte.
	
	The workaround for this problem is to explicitly declare a type in the
	watch statement, for example:
	
	> WB pvariable.
	
	Microsoft has confirmed this to be a problem in Microsoft CodeView
	versions 2.x. This problem has been corrected in Microsoft CodeView
	version 3.00.
	
	Additional keywords: buglist2.30 buglist2.35
