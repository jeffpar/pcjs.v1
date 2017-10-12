---
layout: page
title: "Q51834: "Internal Debugger Error: 0" When Watching Structure Members"
permalink: /pubs/pc/reference/microsoft/kb/Q51834/
---

	Article: Q51834
	Product: Microsoft C
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist2.30 cv
	Last Modified: 29-DEC-1989
	
	When watching a member of a structure using the "w?" or "?" commands,
	it is possible to get the message "internal debugger error: 0". When
	this happens, the only way to view the contents of the member is to
	use the "D" or "??" commands.
	
	Code Example
	------------
	
	typedef struct {
	   char *(*instruction)[];
	   } *structype;
	
	structype mac;
	
	void main (void)
	{
	}
	
	If you set a watch on an element of the structure variable in the
	above program such as "w? mac->instruction[0]" (without the quotation
	marks) you'll get the message "internal debugger error: 0." Use the
	dump command "D" or the special "??" structure viewing command to look
	at the contents of the member.
	
	Microsoft has confirmed this to be a problem in CodeView Version 2.30.
	We are researching this problem and will post new information here as
	it becomes available.
