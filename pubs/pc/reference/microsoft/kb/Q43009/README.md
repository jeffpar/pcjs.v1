---
layout: page
title: "Q43009: How /NOE (No Extended Dictionary) Is Used by the Linker"
permalink: /pubs/pc/reference/microsoft/kb/Q43009/
---

## Q43009: How /NOE (No Extended Dictionary) Is Used by the Linker

	Article: Q43009
	Version(s): 3.65 4.06 5.01 | 5.01
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | S_C H_FORTRAN S_QUICKC
	Last Modified: 6-APR-1989
	
	This article contains information about the LINK option /NOE and how
	it relates to the three following topics:
	
	1. The Extended Dictionary and how LINK uses it
	
	2. The definition of genuine redefinition
	
	3. Why redefinitions are not detected in some situations
	
	The LINK option /NOE stands for No Extended Dictionary.
	
	What is the extended dictionary and how does LINK use it? How does
	LINK use the extended dictionary?
	
	LINK uses the extended dictionary to speed up library searching. For
	example, if the library module A calls functions in module B and
	module C, the extended dictionary tells LINK that, if your program
	requires module A from library, it will also require modules B and C.
	According to this information, LINK pulls in the three modules A, B,
	and C all at once. This way, LINK doesn't have to search the library a
	second time to resolve references from module A to modules B and C.
	
	What is a genuine redefinition?
	
	The ERRMSG.DOC file states that when linker error L2044 occurs, the
	/NOE switch should be used. When linker error L2025 occurs, the
	program has a genuine redefinition problem.
	
	A genuine redefinition is any redefinition that has nothing to do with
	the extended dictionary. A redefinition error that occurs when you
	specify the /NOE switch indicates a genuine redefinition, as in the
	following example:
	
	    FOO.OBJ:
	        defines "_foo"
	        calls "_libfunc"
	
	    Module A: (in XYZ.LIB):
	        defines "_libfunc"
	        defines "_foo"
	
	If you run "LINK foo /NOE,,,xyz.lib", the L2025 error will be produced
	because module A is pulled in and redefines the symbol "_foo".
	
	When LINK encounters the redefinition while processing a library
	module, it assumes that the error might go away if you were to add the
	/NOE switch. This would be true if the symbols were defined like this
	as follows:
	
	    FOO.OBJ:
	        defines "_foo"
	        calls "_libfunc"
	
	    Module A (in XYZ.LIB):
	        defines "_libfunc"
	        calls "_foo"
	
	    Module B ( in XYZ.LIB ):
	        defines "_foo"
	
	The extended dictionary tells LINK to link modules A and B, even
	though module B should not be linked because "_foo" is already
	defined. In this case, the /NOE switch will eliminate the error.
	
	LINK cannot figure out when the error is due to the extended
	dictionary and when it is not; therefore, it assumes that the extended
	dictionary will cause a redefinition error when processing a library
	module.
	
	Please note that redefinitions not detected in some situations. For
	example, when the function 'printf' is redefined in a program module
	and the module is linked with SLIBCER.LIB without using the /NOE
	switch, LINK does not complain about the redefinition at all. LINK
	does not detect a redefinition because the module that defines printf
	in the library is not pulled in; thus, there is no redefinition.
	
	If your program module redefines a library function that is also
	called by other library functions used by your program, you will get a
	redefinition error. The extended dictionary specifies which library
	modules call routines in other library modules. Consider a
	"second-level" function to be any library function called by a library
	function in another module. For example, spawnve and _setargv are
	second-level functions because they are called by other library
	functions; printf is not. You can get a redefinition error only if you
	redefine a second-level library function called by some first-level
	routine being linked into your program.
