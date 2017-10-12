---
layout: page
title: "Q59420: In What Order Does NMAKE Build Files?"
permalink: /pubs/pc/reference/microsoft/kb/Q59420/
---

	Article: Q59420
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-MAY-1990
	
	Question:
	
	I need to have my source files built in a particular order but I can't
	get NMAKE to build them that way. NMAKE seems to build the source
	files in the order it wants. What is the order in which NMAKE builds
	files?
	
	It is definitely possible to specify the order in which NMAKE builds
	your files.
	
	The first thing NMAKE does is check the command line. You can specify
	the targets in the order you want them built and NMAKE will build them
	in that order. If NMAKE doesn't find any targets on the command line,
	it builds the first target in the description file.
	
	NMAKE will build all of the dependents in the order in which they are
	specified on the first target line. For most description files, the
	first target in the file is the ALL:FILENAME.EXE pseudotarget. In this
	case, NMAKE will build FILENAME.EXE, and then the order depends on the
	dependency for FILENAME.EXE.
	
	This can be more clearly explained in the following examples:
	
	Example 1
	---------
	
	Consider the following description file:
	
	            all:three.obj two.obj one.obj main.exe
	
	            one.obj:one.c
	                cl /c one.c
	
	            two.obj:two.c
	                cl /c two.c
	
	            three.obj:three.c
	                cl /c three.c
	
	            main.exe:three.obj one.obj two.obj
	                link one two three, main;
	
	In this example, the files are compiled in the order: THREE.C, TWO.C,
	ONE.C. After those three files are compiled, the link for MAIN.EXE is
	executed. They are executed in that order because that is the explicit
	order given in the first target in the file and NMAKE builds the first
	target in the file when nothing is specified on the command line.
	
	Example 2
	---------
	
	Now, consider the following description file that has been slightly
	modified from the one shown in Example 1 above:
	
	            all:main.exe
	
	            one.obj:one.c
	                cl /c one.c
	
	            two.obj:two.c
	                cl /c two.c
	
	            three.obj:three.c
	                cl /c three.c
	
	            main.exe:three.obj one.obj two.obj
	                link one two three, main;
	
	In this example the files are compiled in the order: THREE.C, ONE.C,
	TWO.C. After that, the link statement will then be executed because
	there is nothing specified on the command line, so NMAKE will build
	the first target in the file, which is MAIN.EXE. When NMAKE looks at
	what it needs to build MAIN.EXE, it sees the list of dependents and
	builds them in that order.
	
	In summary, NMAKE looks first on the command line. If nothing is found
	there, it builds the first target in the description file by building
	each of its dependents in the order specified. If the dependent of the
	first target specifies another target, the dependents of that target
	are built in the order they are specified and so on.
