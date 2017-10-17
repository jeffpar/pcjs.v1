---
layout: page
title: "Q66828: Unexpected Behavior with the /Gt Switch and the PWB"
permalink: /pubs/pc/reference/microsoft/kb/Q66828/
---

## Q66828: Unexpected Behavior with the /Gt Switch and the PWB

	Article: Q66828
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_C
	Last Modified: 15-JAN-1991
	
	Adding the /Gt compiler switch with an argument to the Additional
	Options section of the C Compiler Options on the Programmer's
	WorkBench (PWB) Options menu can cause the value of the argument to be
	changed or dropped.
	
	Microsoft has confirmed this to be a problem in the Programmer's
	WorkBench version 1.00. We are researching this problem and will post
	new information here as it becomes available.
	
	When you add the /Gt switch with an argument (for example, /Gt30) and
	click OK, then immediately go back into the Compiler Options dialog
	box; you will see that the /Gt30 switch you just set is now /Gt3.
	
	If you set a /Gt switch and specify a value, it will compile with that
	correct value because it was written to the file on disk that is used
	to build the program.
	
	If you go back in and look at the compiler options and see that the
	value is incorrect and Cancel the options dialog, you will still
	compile with your initial correct /Gt value.
	
	You will compile with the incorrect /Gt value only if you make another
	change in that dialog and select OK. This is because you changed the
	options, so PWB rewrites the options to the file on disk. In the case
	of /Gt, that option is written incorrectly and from that point on, you
	will compile with the incorrect /Gt value.
	
	Not all values of /Gt are incorrect. The most common incorrect values
	end in zero. The following are examples where the problem occurs:
	
	   /Gt40 will turn into /Gt4
	   /Gt0  will turn into /Gt
	   /Gt20 will turn into /Gt
	
	Some other values that get changed are the following:
	
	   /Gt113 will turn into /Gt3
	   /Gt305 will turn into /Gt35
	   /Gt14  will turn into /Gt4
	   /Gt22  will turn into /Gt
	
	As a possible work around, do not set /Gt in the PWB, and set the
	environment variable CL to the desired threshold, as in the following
	example:
	
	   set cl=/Gt40
	
	This value will be read by the compiler when it is called from the
	PWB.
	
	Also, you can set the /Gt switch on the Additional Options line in
	either Set Debug Options or Set Release Options, rather than the
	global Additional Options.
