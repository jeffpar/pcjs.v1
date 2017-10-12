---
layout: page
title: "Q38806: Error L2002 Fixup Overflow Near Number..."
permalink: /pubs/pc/reference/microsoft/kb/Q38806/
---

	Article: Q38806
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_pascal h_fortran h_masm s_quickc s_link s_error
	Last Modified: 7-DEC-1988
	
	The L2002 error below is from "Linker Error Messages" in the manual
	"CodeView and Utilities," Section C.2, Page 366, and in the "Microsoft
	QuickC Compiler Programmer's Guide," Section D.4, Page 372.
	
	The following is the error:
	
	L2002       fixup overflow near number in frame seg segname target seg
	            segname target offset number
	
	            The following conditions can cause this error:
	
	            A small-model program is compiled with the /NT option.
	
	            A group is larger than 64K.
	
	            The program contains an intersegment short jump or
	            intersegment short call.
	
	            The name of a data item in the program conflicts with
	            that of a subroutine in a library included in the
	            link.
	
	            An EXTRN declaration in an assembly-language source
	            file appeared inside the body of a segment, as in the
	            following example:
	
	                code   SEGMENT public 'CODE'
	                       EXTRN   main:far
	                start  PROC    far
	                       call    main
	                       ret
	                start  ENDP
	                code   ENDS
	
	                The following construction is preferred:
	
	                       EXTRN   main:far
	                code   SEGMENT public 'CODE'
	                start  PROC    far
	                       call    main
	                       ret
	                start  ENDP
	                code   ENDS
	
	            Revise the source file and recreate the object file. (For
	            information about frame and target segments, refer to the
	            "Microsoft MS-DOS Programmer's Reference.")
	
	Nonfatal errors indicate problems in the executable file. LINK
	produces the executable file. Nonfatal error messages have the
	following format:
	
	   location : error L2xxx: messagetext
	
	In these messages, location is the input file associated with the
	error, or LINK if there is no input file. If the input file is an OBJ
	or LIB file and has a module name, the module name is enclosed in
	parentheses.
	
	Force data outside of DGROUP by using the /Gt compiler switch along
	with a large data model (compact, large, or huge).
	
	Using the linker switch /CO twice can cause this. For example, when
	LINK is invoked with /CO when a LINK environment variable is also set
	to /CO, then this situation results.
