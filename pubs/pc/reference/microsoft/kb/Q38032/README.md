---
layout: page
title: "Q38032: Differences among QuickC Versions 2.00, 1.00, and 1.01"
permalink: /pubs/pc/reference/microsoft/kb/Q38032/
---

	Article: Q38032
	Product: Microsoft C
	Version(s): 1.00 1.01 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 23-JAN-1991
	
	QuickC version 2.00 is a window-like programming environment that
	integrates a text editor, a compiler, a debugger, and a make utility.
	Major differences between version 2.00 and the previous releases of
	QuickC are listed below. After each listing there is a source
	reference where you can find more detailed information in the
	documentation that accompanies QuickC version 2.00.
	
	The following listing shows features that are exclusive to QuickC
	version 2.00:
	
	 1. 512K memory available required for QC.EXE.
	
	 2. Online Help. QuickC version 2.00 offers instant Online information
	    on all important C topics. The following lists some of the topics
	    for which help is available:
	
	    a. C-keywords, operators, library functions, prototypes,
	       definitions
	
	    b. Environment Help (help on menu choices, dialog boxes, etc.)
	
	    c. C Run-time Errors
	
	    d. Help (on Help)
	
	    You can also add information to the OnLine Help database yourself,
	    using the HELPMAKE utility. (See Chapter 4 "Getting Help" in the
	    "Up and Running" documentation.)
	
	 3. Customize the QuickC Editor:
	
	    It is possible to use another set of editing command keystrokes
	    using the .KEY files QC.KEY, ME.KEY, BRIEF.KEY, and EPSILON.KEY.
	    These files can be used to remap the keystrokes of the QuickC
	    editor so that it emulates the Microsoft Editor, Brief, and Epsilon
	    editors. You also can create your own .KEY file with the MKKEY
	    utility.
	
	    You can use your own choice of editor or word processor instead of
	    the QuickC Editor. However, use of other editors will not support
	    the symbolic information necessary to the debugger.
	
	    (See "Customizing the Editor" in "Up and Running," Pages 26-28.)
	
	 4. Incremental Compiling/Linking. If you choose the incremental
	    compilation option, then only those functions that have changed
	    since the last compilation will be recompiled. (See section 4.3.15
	    of "QuickC Toolkit.")
	
	 5. Presentation Graphics. In addition to the existing graphics
	    functions, version 2.00 offers Presentation Graphics, which is the
	    name given to the library of chart-generating functions. With
	    this package, you can display data as a variety of graphs such as
	    pie charts, bar and column charts, line graphs, and scatter graphs.
	    Fonts and font sizes are also manipulated through these routines.
	    (See Chapter 13 "Presentation Graphics' in "C For Yourself.")
	
	 6. Support for the "Olivetti Color Board" graphics card.
	
	 7. InLine Assembly Code. QuickC has the ability to handle
	    assembly-language instructions right in your C program. This
	    ability is built in and does not require a separate assembler
	    program. (See Chapter 15 "InLine Assembly" in "C For Yourself.")
	
	 8. "C For Yourself" (an introduction to the C language). This book
	    assumes that you have programmed before, but are not familiar with
	    the C language. Topics covered are as follows:
	
	    a. Functions and data types.
	
	    b. Input/output and graphics.
	
	    c. QuickC implementation of the C Language.
	
	    d. Summaries of common run-time functions. (Details of all run-time
	       functions are available in the OnLine Help facility.) (See the
	       "C For Yourself" manual.)
	
	 9. NMAKE (program maintenance utility). NMAKE is similar to the MAKE
	    utility and helps automate software development and maintenance.
	    NMAKE is typically used in the following situations:
	
	    a. Updating an executable file whenever any of the source or object
	       files has changed
	
	    b. Managing libraries, to rebuild a library whenever any of the
	       modules in the library has changed
	
	    c. In a networking environment, to update the local copy of a
	       file that is stored on the network whenever the master copy
	       has changed
