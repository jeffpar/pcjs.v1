---
layout: page
title: "Q48204: Linker Can Indiscriminately Bind Different Types"
permalink: /pubs/pc/reference/microsoft/kb/Q48204/
---

## Q48204: Linker Can Indiscriminately Bind Different Types

	Article: Q48204
	Version(s): 1.x 2.x 3.x 4.x 5.01 5.02 5.03 | 5.01
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER | S_C S_QuickC S_QuickASM S_Pascal S_QuickPas
	Last Modified: 2-AUG-1990
	
	The object module format used by the Microsoft languages contains a
	record type that is used to bind symbol definitions to symbol
	references in other modules. This record is known as a "fixup." As
	defined by Intel, the fixup record type contains no information as to
	the type of data that is to be fixed up. Under certain circumstances,
	this can cause unexpected and undesired binding at link time. The code
	below demonstrates such an instance:
	
	    /*----- FILE1.C -----*/
	
	    void bar( void );
	
	    void main( void )
	    {
	        bar();
	    }
	
	    /*----- FILE2.C -----*/
	
	    int bar;
	
	These files both compile without error. When compiled for a model with
	a single code segment, linker error L2003 is produced saying that an
	intersegment self-relative fixup was attempted. If a multiple code
	segment model is used, no link errors are produced. Although a clean
	link can be obtained, the resultant EXE does not perform as expected
	due to the fact that the function reference of bar in FILE1.C has been
	bound to the integer definition of bar in FILE2.C.
	
	The linker has no way of determining the types of the reference to,
	and definition of, bar. This is a limitation of the object file
	format. If an include file was used to prototype bar and was then
	included in both files, the compiler could have detected the
	redefinition of bar.
	
	This information applies to all 1.x, 2.x, and 3.x versions of LINK
	including 3.60, 3.61, 3.64, and 3.65, as well as LINK Versions 4.06,
	4.07, 5.01, 5.02, and 5.03.
