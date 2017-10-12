---
layout: page
title: "Q47225: .DEF File Optional Internal Names Not Supported by Implib"
permalink: /pubs/pc/reference/microsoft/kb/Q47225/
---

	Article: Q47225
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | OPSYS PMWIN BUSLANG
	Last Modified: 17-AUG-1989
	
	The implib utility does not put the optional internal name of a
	dynamically linked function into the import library it creates. Implib
	puts only the entry name of the function (the function name that
	external modules call) into the import library.
	
	The use of optional internal names is supported only by linking with
	the module definition file (.DEF) that specifies the internal function
	names (the actual function names in the source file) within a Dynamic
	Link Library (DLL) for OS/2 or DOS Windows.
	
	In a .DEF file, you can optionally specify aliases for the entry
	points into your DLL as in the following .DEF file statement:
	
	EXPORTS
	    ENTRYNAME=INTERNALNAME
	
	ENTRYNAME is the name of a DLL routine called by other modules, and
	the optional INTERNALNAME is the actual name of the function or
	procedure in the DLL. By default, the INTERNALNAME is the same as the
	ENTRYNAME, but you may want to provide more meaningful entry names to
	the users of your DLL in addition to the actual internal function
	names.
	
	The names of dynamically linked functions in a DLL must be specified
	in either a .DEF file or in an import library, which has a .LIB
	extension, so that the linker can resolve all references (calls) to
	the DLL functions. Attempting to link an application that calls DLL
	functions without an import library or .DEF file results in LINK :
	error L2029: Unresolved externals: for the DLL function names.
	
	Import libraries, consisting of little more than the names of the
	modules in the DLL and the externally callable functions within the
	DLL, are created by the implib utility from an existing .DEF file with
	a command such as the following, which creates the import library
	"myimport.lib" from the existing module definition file "myfile.def":
	
	   implib myimport.lib myfile.def
	
	Commonly used import libraries for OS/2 are DOSCALLS.LIB for the OS/2
	1.00 API (Application Program Interface) DLL routines, OS2.LIB for
	OS/2 1.10, or CRTLIB.LIB for the multi-thread C 5.10 run-time
	CRTLIB.DLL. The Windows Software Development Kit for creating DOS
	Windows applications comes with memory model-specific import libraries
	such as SLIBW.LIB.
