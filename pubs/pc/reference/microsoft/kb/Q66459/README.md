---
layout: page
title: "Q66459: In-line File in Inference Rule Causes Bad Macro Substitution"
permalink: /pubs/pc/reference/microsoft/kb/Q66459/
---

## Q66459: In-line File in Inference Rule Causes Bad Macro Substitution

	Article: Q66459
	Version(s): 1.11   | 1.11
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.11
	Last Modified: 11-NOV-1990
	
	Using an in-line file inside of an inference rule can cause improper
	results in macro substitutions following the in-line file. The example
	below demonstrates the problem.
	
	Make File Example
	-----------------
	
	EXENAME=test.exe
	SAMPLEDIR=\test
	
	.obj.exe:
	  link @<<lrf     <--- In-line file with $(EXENAME) macro
	$<                     causes the problem.
	$(EXENAME);
	<<KEEP
	  cd $(SAMPLEDIR)
	
	test.exe:test.obj
	
	test.obj:test.c
	
	The above NMAKE description file produces the following output:
	
	   cl -c test.c
	   link @lrf
	   cd test.exe    <---- This is wrong.  It should be "cd \test"
	NMAKE: fatal error U1077: 'cd' return code 1
	Stop.
	
	The third line of the output is incorrect. The macro $(SAMPLEDIR) is
	replaced with the value of $(EXENAME).
	
	Microsoft has confirmed this to be a problem in version 1.11. We are
	researching this problem and will post new information here as it
	becomes available.
