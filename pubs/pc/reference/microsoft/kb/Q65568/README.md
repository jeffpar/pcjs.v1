---
layout: page
title: "Q65568: How to Add Other Language Compilers to PWB's Build Options"
permalink: /pubs/pc/reference/microsoft/kb/Q65568/
---

## Q65568: How to Add Other Language Compilers to PWB's Build Options

	Article: Q65568
	Version(s): 1.00 1.10 | 1.00 1.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_pascal b_basiccom s_c h_masm h_fortran b_cobol
	Last Modified: 24-OCT-1990
	
	The Programmer's WorkBench (PWB) is an environment capable of
	utilizing different compilers for mixed-language programming. When
	installed during BASIC version 7.10 setup, PWB version 1.10 shows
	build options for the BASIC language only. However, it is possible to
	include other language compilers to utilize the full features of the
	PWB utility.
	
	The following information applies to the Programmer's WorkBench
	version 1.10 utility supplied with Microsoft BASIC Professional
	Development System (PDS) version 7.10 for MS-DOS and MS OS/2.
	
	Note that the 1.00 version of PWB is shipped with Microsoft C
	Professional Development System (PDS) version 6.00. The steps below
	should also apply to PWB version 1.00.
	
	The Programmer's WorkBench (PWB.EXE) is an advanced development
	environment capable of integrating several language compilers,
	NMAKE.EXE, LINK.EXE, and the CodeView debugger. It offers the ability
	to accomplish tasks, such as program development under protected mode
	and mixed-language programming. This ability is not available in the
	QuickBASIC extended development environment (QBX.EXE).
	
	Two special files, PWBC.PX$ (for protected mode OS/2) and PWBC.MX$
	(for DOS mode), reside on the BASIC PDS 7.10 disks and support the
	option of using the C compiler in PWB. Since SETUP.EXE (in BASIC PDS
	7.10) does not copy PWBC.PX$ and PWBC.MX$ during installation, these
	files must be unpacked and transferred to your machine, for example to
	the \BINP subdirectory located in the \BC7 directory. (Note: The
	UNPACK.EXE utility is found on disk 1 of the BASIC PDS package.) After
	unpacking, the files will have the names PWBC.PXT and PWBC.MXT.
	
	Next, the following command lines must be added to the TOOLS.INI file
	to make the C compiler available to PWB:
	
	   [pwb - .BAS .BI]
	      LOAD: LogicalDrive:\[Path]\PWBC.PXT
	
	For further information about installing PWBC.PXT and PWBC.MXT, see
	Page 54 of the "Microsoft BASIC 7.1: Getting Started" manual.
	
	If you want to program in languages other than BASIC or C [such as
	Microsoft Macro Assembler (MASM), Microsoft Pascal, Microsoft FORTRAN,
	or Microsoft COBOL 3.00/3.00a], the following steps will insert the
	initial build options to include other languages to PWB's build
	options menu. In the example below, options to include the MASM.EXE
	assembler are specified. If some other language's compiler is desired,
	substitute appropriate changes for that compiler, where noted in the
	specified areas:
	
	 1. In PWB, go to the Options menu and select Build Options.
	
	 2. Choose Save Current Build Options.
	
	 3. Enter a meaningful message, such as "Options to Include MASM" in
	    the window's edit field (if some other language is desired, change
	    MASM to the appropriate name). Select the OK button from the "Save
	    Current Build Options" and "Build Options" windows.
	
	 4. Open the "TOOLS.INI" file in the PWB utility and go down to the
	    bottom of the file. Somewhere near the bottom should be the tag
	    "[PWB-Build Options: Options to Include MASM]" (or the language
	    that was specified).
	
	 5. In this section, add the following NMAKE instructions:
	
	       build: inference .asm.obj masm_asm_obj
	       build: command masm_asm_obj "masm $<;"
	
	    Note: For languages other than MASM, distinguish a variable name
	    in the inference rule to be used in the commands line (such as
	    masm_asm_obj has been used above) and then specify the appropriate
	    compiler in the commands line within the quotation marks. The
	    special filename macro specified in the quotation marks, "$<",
	    applies the command to any object that has an out-of-date
	    executable file.
	
	 6. Press SHIFT+F8 to reinitialize the file and then close it.
	
	 7. Go to the File menu and select New (it is a good idea to close any
	    files that are currently open before this step).
	
	 8. Go to the Options menu and select Build Options.
	
	 9. Choose Initial Build Options.
	
	10. Select the "Options to Include MASM" option (it should be near the
	    bottom of the list).
	
	After completing these instructions, the PWB utility will now be ready
	to compile assembler along with BASIC source code, provided that paths
	to the necessary compilers are furnished.
