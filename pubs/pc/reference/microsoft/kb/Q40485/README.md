---
layout: page
title: "Q40485: Error L2025: Symbol Defined More than Once"
permalink: /pubs/pc/reference/microsoft/kb/Q40485/
---

	Article: Q40485
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 20-JAN-1989
	
	Problem:
	
	I cannot link a function name in my object file with a library
	containing that same function name and have the resulting EXE call my
	function and not the library's.
	
	I am using /NOE; however, I receive the following error:
	
	(...): error L2025: (my function name) : symbol defined more than once
	 pos: (some number) Record type: 53E8
	
	Response:
	
	You can only perform this task if the function name is an individual
	module. The following procedure demonstrates the error:
	
	1. Create a file CALL.C that calls functions A() and B().
	
	2. Create functions A() and B() in fileA.c and fileB.c, and compile
	   them to objects.
	
	3. Do the following to create TEST.LIB:
	
	      LIB TEST +fileA +fileB, test.lst
	
	4. Change B() in fileB.c and compile the following:
	
	      cl call.c fileB.c test.lib /link /NOE /INF
	
	   You will have an EXE that calls A() from the library and B() from
	   your modified fileB.c.
	
	5. Combine fileA.c and fileB.c into one file called TEST.C.
	
	6. Compile to object code.
	
	7. Delete the old TEST.LIB, and do the following:
	
	      LIB TEST +test, test.lst
	
	   (Normally you would change fileB.c, but this is not necessary here.)
	
	      cl call.c fileB.c test.lib /link /NOE /INF
	
	You will receive the following error:
	
	TEST.LIB(test.c) : error L2025: _B : symbol defined more than once
	 pos: 13E Record type: 53E8
	There was 1 error detected
	
	When you encounter this error, it is usually because the function you
	are trying to overwrite is part of a set appearing in one module.
	
	The library listing looks as follows in the first case:
	
	_A................fileA             _B................fileB
	
	fileA             Offset: 00000010H  Code and data size: 95H
	  _A
	
	fileB             Offset: 000002a0H  Code and data size: 92H
	  _B
	
	You will be able to replace A() or B(). The listing in the
	second example looks as follows:
	
	_A................test              _B................test
	
	test              Offset: 00000010H  Code and data size: deH
	  _A                _B
	
	You will not be able to replace either A() or B() without removing the
	TEST module with the LIB utility. You may have to provide replacements
	for both functions and not just the one you want to change. For more
	information, query on the following words in this KnowledgeBase:
	
	   L2029 unresolved externals
