---
layout: page
title: "Q44462: Using ILINK in the Development Process in C"
permalink: /pubs/pc/reference/microsoft/kb/Q44462/
---

## Q44462: Using ILINK in the Development Process in C

	Article: Q44462
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr S_QuickC
	Last Modified: 19-SEP-1989
	
	The incremental linker is available with the Microsoft C Optimizing
	Compiler Version 5.10 and QuickC Version 2.00. The information below
	is excerpted from the "Microsoft CodeView and Utilities Software
	Development Tools for MS OS/2 and MS-DOS Operating Systems Update" for
	Version C 5.10, Section 9, "The ILINK Utility."
	
	Note: The incremental linker supplied with C Version 5.10 CANNOT be
	used to develop DOS applications other than Windows applications. It
	can be used for Windows applications and OS/2 applications. This
	limitation is documented at the beginning of "The ILINK Utility"
	section in the Version 5.10 utilities update.
	
	To develop a software project with ILINK when compiling and linking
	from the command line, do the following:
	
	1. Use the full linker, LINK.EXE, during early development stages
	   until you have a number of different code and data segments.
	
	2. Prepare for incremental linking by using the /INC (incremental)
	   option, for example:
	
	      link /INC file1 file2 ... filen;
	
	3. Use the incremental linker, ILINK.EXE, after any small changes
	   are made, for example:
	
	      ilink /i file1 file2 ... filen
	
	   To view ILINK options, type ILINK at the DOS prompt and press
	   ENTER.
	
	4. Relink with LINK after any major changes are made. Often, a
	   major change causes ILINK to fail and then calls a full LINK.
	   Relinking with LINK alleviates this unnecessary step.
	
	5. Repeat Steps 3 and 4 as necessary.
	
	To use the same development process with the QuickC Version 2.00
	environment, you can toggle on and off the incremental compile and
	incremental link switches. You can find these switches under the
	Options menu, Make option, in the Compiler Flag selection and Linker
	Flag selection, respectively.
	
	Linking with the /INC option may take longer than without the option
	because of additional overhead involved in preparing for incremental
	linking.
	
	The /INC linker option is not compatible with the /EXEPACK option.
	
	If you compile and link at the command line with QCL using the /Gi
	(incremental compile) option, then incremental link is automatically
	invoked. If you do not want an incremental compile you can still
	request incremental link with the /Li compiler option.
