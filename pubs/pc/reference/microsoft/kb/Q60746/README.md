---
layout: page
title: "Q60746: NMAKE May Invoke MASM Instead of the C Compiler"
permalink: /pubs/pc/reference/microsoft/kb/Q60746/
---

## Q60746: NMAKE May Invoke MASM Instead of the C Compiler

	Article: Q60746
	Version(s): 1.00 1.01 1.11 | 1.01 1.11
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | docsup s_pwb h_fortran
	Last Modified: 17-JUL-1990
	
	When using an NMAKE file in combination with adding /Fa to the
	compiler options within Programmer's WorkBench (PWB), NMAKE will
	invoke the Macro Assembler, if it is in the current search path.
	
	This does not occur the first time you build your application, but it
	does occur the second time, and thereafter, because of the generation
	of the .ASM created by the compiler.
	
	Files with the .ASM extension have a predefined inference rule within
	NMAKE to invoke MASM. However, the inference rule for .ASM files takes
	place before the rule for files with the .C or .OBJ extension.
	Therefore, if you have a filename with the same base name, but one has
	an .ASM extension and the other has a .C extension (as is the case
	with the /FA switch), the .ASM file will be assembled before the .C
	file will be compiled. Since the assembly step generates an .OBJ file
	that is newer than the .C file, the .C file is never compiled.
	
	Use the following procedures to work around this behavior:
	
	1. The best workaround is to use /Fa [LSTFILE.EXT] with a filename
	   included as a compiler option, instead of allowing the /Fa option
	   to default to its <filename>.ASM.
	
	   Example: /Fa <filename>.ASC
	
	   In using this method, the .C file will be compiled, instead of the
	   .ASM version being assembled.
	
	2. Use the /Fc compiler option in place of the /Fa option (if you just
	   want to look at an assembly source listing). This produces a .COD
	   file (combined assembly and C source listing).
	
	3. Use the /R switch for the NMAKE invocation to ignore inference
	   rules and macros that are predefined or defined in the TOOLS.INI
	   file.
	
	For a more in-depth discussion on the /R switch and its effects, see
	the following references:
	
	1. The "Microsoft C Advanced Programming Techniques" reference manual
	
	   Page(s) 112-114 Predefined macros
	           118-119 Predefined inference rules
	           125     /R Switch
	
	2. The "Microsoft FORTRAN, CodeView and Utilities User's Guide"
	
	   Page(s) 288     /R Switch
	           295-297 Predefined macros
	           299-230 Predefined inference rules
	
	3. The "Microsoft QuickC Toolkit" reference manual
	
	   Page(s) 158     /R Switch
	           165-197 Predefined macros
	           169     Predefined inference rules
