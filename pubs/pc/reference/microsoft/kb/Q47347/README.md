---
layout: page
title: "Q47347: The Number of SUBprograms Per Module Affects .EXE Size"
permalink: /pubs/pc/reference/microsoft/kb/Q47347/
---

## Q47347: The Number of SUBprograms Per Module Affects .EXE Size

	Article: Q47347
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 20-DEC-1989
	
	Linking many separate object (.OBJ) modules carries a small size
	penalty per module that can be alleviated by combining SUBprograms
	into fewer modules. For the smallest executable (.EXE) program size,
	you should compile together (into one module) the SUBprograms that are
	most often called together. However, SUBprograms that are not usually
	called together (from most of your .EXE programs) should be placed
	into separate modules so that unused procedures are not linked in.
	
	You can optionally use the Microsoft Library Manager (LIB.EXE) program
	to group multiple separate .OBJ modules into a .LIB library file for
	more convenient linking. (There is no size difference if you compare
	linking to a .LIB library file versus linking to an equivalent list of
	.OBJ object modules.)
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	Example
	-------
	
	It might be inefficient to put a sorting routine into a .OBJ module
	that also contains unrelated windowing routines. In this situation,
	the linker would include all the windowing routines (even if some are
	not called) in your executable when the sort routine is called. The
	executable size could be reduced if you put the sorting routine in one
	module and the windowing routines in one or more separate modules.
	
	If your program calls most of the windowing routines, you may want to
	put the windowing routines in as few separate modules as possible. If
	your program calls only a few windowing routines, then multiple
	separate windowing modules are appropriate. Multiple modules can be
	grouped into a .LIB library file for linking convenience.
	
	Detailed Illustration
	---------------------
	
	The size overhead per module can be illustrated using two extreme
	cases:
	
	1. Compiling each SUBprogram into a separate module.
	
	2. Compiling all SUBprograms into one module.
	
	Ten SUBprograms were used in the experiment below. These SUBprograms
	were placed into libraries in accordance with the two extremes. Each
	extreme produces smaller executables depending upon whether all the
	SUBprograms were called or only one SUBprogram was called out of the
	ten found in the library.
	
	All modules were compiled with the BC /O (stand-alone executable)
	option, but a similar size impact occurs when compiling with the
	run-time library option. The .EXE size results of the experiment below
	were obtained from QuickBASIC Version 4.50.
	
	Extreme 1: Compile each SUBprogram into a separate object file,
	           combine all into one library, and link the library
	           to a main program that calls as follows:
	
	   Scenario                   | Resulting .EXE size
	   ------------------------------------------------
	   Main program calls only    |     26,424
	   1 of the 10 SUBprograms    |
	                              |
	   Main program calls all     |     29,084
	   of the 10 SUBprograms      |
	   ------------------------------------------------
	
	Extreme 2: Compile all SUBprograms into one object file, and link
	           to a main program that calls as follows:
	
	   ------------------------------------------------
	   Main program calls only    |     28,008
	   1 of the 10 SUBprograms    |
	                              |
	   Main program calls all     |     28,056
	   of the 10 SUBprograms      |
	   ------------------------------------------------
	
	Explanation of Resulting .EXE Sizes
	-----------------------------------
	
	When the linker resolves externals, it does not attempt to granulate
	the SUBprograms past the module level. In other words, the linker will
	look for a SUBprogram's module within the library and load every
	SUBprogram in that module into the final executable (.EXE) file. This
	means that you could take advantage of the linker's ability to
	discriminate against a library's unused object modules by compiling
	each SUBprogram into a different module. The separate modules can be
	placed into one library. The above results show that this helps reduce
	program size in situations where only a few of the SUBprograms are
	needed from the library. However, as you call a greater number of
	SUBprograms, this becomes inefficient due to the padding added when
	the linker incorporates several object modules into the executable.
	
	The most efficient method for building modules is to place into one
	module the SUBprograms that share variables and are most often called
	together. SUBprograms that are not often called together in the same
	program can be placed into separate modules. The separate modules can
	be placed into a library for linking convenience.
