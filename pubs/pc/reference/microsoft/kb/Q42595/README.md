---
layout: page
title: "Q42595: VARSEG Incorrect for COMMON String Array Passed Through CHAIN"
permalink: /pubs/pc/reference/microsoft/kb/Q42595/
---

## Q42595: VARSEG Incorrect for COMMON String Array Passed Through CHAIN

	Article: Q42595
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.50
	Last Modified: 7-FEB-1990
	
	The programs shown below demonstrate that VARSEG does not return the
	correct segment address of a string array passed in a COMMON block
	through a CHAIN.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Version
	4.50 for MS-DOS and in Microsoft BASIC Compiler Version 6.00b
	(buglist6.00b) for MS-DOS and MS OS/2. This problem was corrected in
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2 (fixlist7.00).
	
	The following program is TEST.BAS, which dimensions the string array
	and passes it in COMMON:
	
	   COMMON a$()
	   DIM a$(4)
	   CHAIN "test2"
	   END
	
	The following separately compiled program is TEST2.BAS, which
	dimensions another string array and passes both to the C routine. The
	second string array is used for comparison.
	
	   DECLARE SUB crot CDECL (BYVAL plo AS INTEGER, BYVAL pls AS INTEGER)
	   COMMON a$()
	   DIM b$(1)
	   a$(0) = "a0" + chr$(0)
	   b$(0) = "b0" + chr$(0)
	   print varseg(a$(0))
	   print varseg(b$(0))
	   CALL crot(VARPTR(a$(0)), VARSEG(a$(0)))
	   CALL crot(VARPTR(b$(0)), VARSEG(b$(0)))
	
	The following is the C routine CR.C, which should print out the first
	string in each array:
	
	   #include <stdio.h>
	   struct struct_string {
	       int length;
	       char *address;
	                        };
	    void crot(struct struct_string far *string)
	    {
	         printf("%s\n", string->address);
	    }
	
	To demonstrate the problem from .EXE programs, compile and link as
	follows:
	
	     BC TEST.BAS ;
	     LINK TEST.OBJ ;
	
	     BC TEST2.BAS ;
	
	     CL /AM /c CR.C ;
	
	     LINK /NOE TEST2.OBJ CR.OBJ ;
	
	When TEST.EXE is run, the first line prints garbled, while the second
	prints correctly, as shown below:
	
	   $#lkds
	   b0
	
	Note: If the C routine is changed so that near addressing is used, the
	routine works correctly, as follows:
	
	   #include <stdio.h>
	   struct struct_string {
	       int length;
	       char *address;
	                        };
	   void crot(struct struct_string *string) /* changed to near pointer */
	    {
	         printf("%s\n", string->address);
	    }
	
	Making the above change correctly displays the following:
	
	   a0
	   b0
	
	This change works because with near addressing, the C routine ignores
	the VARSEG part of the address. This only works if the array a$ lies
	within the default data segment.
