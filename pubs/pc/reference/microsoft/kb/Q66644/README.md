---
layout: page
title: "Q66644: NMAKE /N Doesn't Work Across Multiple Dependency Blocks"
permalink: /pubs/pc/reference/microsoft/kb/Q66644/
---

## Q66644: NMAKE /N Doesn't Work Across Multiple Dependency Blocks

	Article: Q66644
	Version(s): 1.11 1.12 | 1.11 1.12
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist1.11 buglist1.12
	Last Modified: 7-NOV-1990
	
	Given the sample makefile below and the fact that mod2.c has been
	changed, invoking NMAKE /N displays the following commands:
	
	   cl /c -c mod2.c
	   lib sub.lib -+ mod2.obj;
	
	However, if NMAKE is run without the /N parameter, the following
	commands will be executed:
	
	   cl /c -c mod2.c
	   lib sub.lib -+ mod2.obj;
	   link boss.obj,,,sub.lib;
	
	The /N switch is used to debug the logic of makefiles without actually
	processing them. In this case, the commands that /N indicates will be
	executed are not the same as those that actually are executed. This is
	caused by the multiple dependencies for sub.lib. If the makefile is
	changed to eliminate the multiple dependency blocks, the /N switch
	will function correctly.
	
	Microsoft has confirmed this to be a problem in NMAKE versions 1.11
	and 1.12. We are researching this problem and will post new
	information here as it becomes available.
	
	Sample Code
	-----------
	
	CFLAGS=/c
	
	.obj.exe:
	        link $<,,,sub.lib;
	
	all:boss.exe
	
	boss.exe:boss.obj  sub.lib
	
	boss.obj:
	
	sub.lib:: mod1.obj
	        lib $@ -+ mod1.obj;
	
	sub.lib:: mod2.obj
	        lib $@ -+ mod2.obj;
