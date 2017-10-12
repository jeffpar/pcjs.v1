---
layout: page
title: "Q29196: SORTDEMO.C/ BIND Use and Misuse"
permalink: /pubs/pc/reference/microsoft/kb/Q29196/
---

	Article: Q29196
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-AUG-1989
	
	The following article discusses a C Compiler Version 5.10 program
	called SORTDEMO.C, which is similar to the program that comes with
	QuickBasic Version 4.00.
	
	SORTDEMO.C for C Version 5.10 is for OS/2. It has OS/2 VIO, KBD, and
	DOS calls. If it has been bound, it can run in DOS and real-mode OS/2,
	as well as protected-mode OS/2.
	
	The following information details the correct way to run SORTDEMO.C
	(for a system targeting DOS):
	
	   cl /Lp /Zp sortdemo.c
	   bind sortdemo.exe c:\c\lib\doscalls.lib c:\c\lib\api.lib apilmr.obj
	
	The following is an example of several incorrect ways, their results,
	and their problems (for a system targeting DOS):
	
	1. Command: cl /Fb /Lp sortdemo.c (/Fb means to bind the application)
	
	   Result: It links and appears to bind, but it hangs the computer
	   when it runs from DOS.
	
	   Problem: Apilmr.obj also needs to be bound. It must perform a
	   separate bind.
	
	2. Command: cl /Fb /Lp sortdemo.c apilmr.obj
	
	   Result: It links and appears to bind, but it hangs the computer
	   when it runs from DOS.
	
	   Problem: Apilmr.obj needs to be bound with the application because
	   the application makes VIO calls and it accesses the near heap.
	
	   Perform a separate bind (there is no way to bind in apilmr.obj from
	   the cl compile line).
	
	3. Command: cl /Lp sortdemo.c /link doscalls.lib api.lib
	
	   Result:  The linker gives the error: __acrtused multiply defined
	   error.
	
	   Problem: You should only link DOSCALLS.LIB. Bind it if it will be
	   used under DOS.
	
	4. Command: cl  sortdemo.c
	
	   Result:  The linker gives 13 unresolved externals, such as
	   KBDCHARIN, VIO* and DOS*.
	
	   Problem: SORTDEMO.C is an OS/2 application. The program must be
	   compiled using the /Lp switch, and then bound if it will be used
	   under DOS.
	
	5. Command: cl /Lp sortdemo.c or cl /Lp /Zp sortdemo.c
	
	   Result:  It worked correctly for running under OS/2. To run under
	   DOS, you must Bind it using the following:
	
	   bind sortdemo.exe c:\c\lib\doscalls.lib c:\c\lib\api.lib apilmr.obj
