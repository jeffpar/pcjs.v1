---
layout: page
title: "Q66571: Problem in NMAKE 1.11 with Multiple Dependency Blocks"
permalink: /pubs/pc/reference/microsoft/kb/Q66571/
---

	Article: Q66571
	Product: Microsoft C
	Version(s): 1.11   | 1.11
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.11 fixlist1.12 s_c
	Last Modified: 9-NOV-1990
	
	The sample makefile below will be correctly executed in all cases
	except if the target is missing. In that case, both sets of commands
	will be executed even though the second set is not necessary.
	
	Microsoft has confirmed this to be a problem in NMAKE version 1.11.
	This problem has been corrected in version 1.12, which shipped with
	Microsoft COBOL version 4.00.
	
	Multiple Dependency blocks are supposed to be evaluated one at a time.
	In the sample makefile, because the target is missing when NMAKE is
	invoked, it assumes that both sets of commands will need to be
	invoked. This is incorrect behavior.
	
	Sample Makefile
	---------------
	
	test.exe :: test.obj test.def
	    link /nod test,,,slibcew libw, test.def
	    rc test.res
	
	test.exe :: test.res
	    rc test.res
