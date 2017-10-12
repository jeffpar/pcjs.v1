---
layout: page
title: "Q57941: Methods for Debugging Large Programs within the 640K DOS Limit"
permalink: /pubs/pc/reference/microsoft/kb/Q57941/
---

	Article: Q57941
	Product: Microsoft C
	Version(s): 1.00 1.10 2.00 2.10 2.20 2.30
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-FEB-1990
	
	Because of the 640K limit under DOS, it is common to run out of memory
	when trying to debug large programs with CodeView. CodeView requires
	over 200K of RAM, not including the program being debugged. In
	addition, the symbolic information added by compiling with the /Zi
	switch greatly increases the executable size of the program you are
	trying to debug.
	
	The following is a list of the possible ways of getting around the
	limited memory problems for debugging:
	
	1. Include full symbolic information only in those modules that
	   contain source code that you are currently trying to debug. In
	   other words, compile only those modules with the /Zi switch. For
	   the other modules, compile with the /Zd option, to put only line
	   number information in the object files.
	
	2. Use overlays to swap parts of your code in and out, even if it is
	   just during the development process. You can always link without
	   overlays once your application is debugged.
	
	3. If you have expanded memory, use it by invoking CodeView with the
	   /E switch. To work properly with CodeView, you should have LIM EMS
	   3.2 or (preferably) 4.0. Expanded memory is used for storing the
	   symbolic information, which can be a great percentage of your .EXE
	   size.
	
	4. Use the CVPACK utility, which is documented in the Update Section
	   of the C 5.1 "Microsoft CodeView and Utilities Software Development
	   Tools for MS OS/2 and MS-DOS Operating Systems Update" manual.
	   CVPACK will compress the debug information in the file by removing
	   duplicate references. Use the /p option to achieve maximum
	   compression.
	
	In trying to obtain a workable solution, you can use any combination
	of the above methods. If adequate debugging is still impossible, then
	you might look into the following possibilities:
	
	5. Switch to the OS/2 operating system. This may be limited as far as
	   how much real mode program debugging you can do, depending on how
	   compatible your application is with protected mode requirements.
	
	6. You might look into MagicCV from Nu-Mega Technologies of New
	   Hampshire. MagicCV requires a 386-based computer because it uses
	   virtual-86 mode of the processor to run CodeView in extended
	   memory. This method reportedly allows CodeView to use only about 8K
	   of conventional DOS memory. It should be noted that Microsoft does
	   not endorse MagicCV or make any claims as to its usage. The
	   information is offered only as a potential option. Nu-Mega can be
	   reached at (603) 888-2386.
