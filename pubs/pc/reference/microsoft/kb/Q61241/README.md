---
layout: page
title: "Q61241: C 6.00 README: &quot;Advanced Programming Techniques&quot; Notes"
permalink: /pubs/pc/reference/microsoft/kb/Q61241/
---

## Q61241: C 6.00 README: &quot;Advanced Programming Techniques&quot; Notes

	Article: Q61241
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr fastcall
	Last Modified: 24-JAN-1991
	
	The following information is taken from the C version 6.00 README.DOC
	file.
	
	"Advanced Programming Techniques" Notes
	---------------------------------------
	
	   Page    Note
	   ----    ----
	
	   36      The Tiny Memory Model
	           ---------------------
	
	           In the third paragraph, the reference to CRTCOM.OBJ should
	           be to CRTCOM.LIB.
	
	   38      Specifying a Memory Model
	           -------------------------
	
	           At the bottom of the page, the reference to CRTCOM.OBJ
	           should be to CRTCOM.LIB.
	
	   99      Preparing for Incremental Linking: The /INCREMENTAL Option
	           ----------------------------------------------------------
	
	           The first sentence of the second paragraph in this section
	           should read: "The /INCREMENTAL (/INC) option prepares a
	           .EXE file for incremental linking."
	
	   124     PWB's extmake Syntax
	           --------------------
	
	           The Programmer's WorkBench extmake switch referred to in
	           this section is now called the build switch. However, the
	           syntax for getting information about fully qualified
	           filenames is still valid.
	
	           For further information, see the help topic "build."
	
	   348     Calling the OS/2 API
	           --------------------
	
	           The second paragraph on Page 349 should read: "Most OS/2
	           API functions return 0 if the operation is successful. They
	           return an error code if the operation fails. The exception
	           to this is Presentation Manager APIs, which return 0 if the
	           operation fails. If you are programming under the
	           Presentation Manager, use the WinGetLastError function to
	           determine the nature of an API function call error."
	
	   352     Family API Functions
	           --------------------
	
	           The functions VioGetBuf and VioShowBuf should not be
	           included in the list of OS/2 1.10 Family API functions.
	
	   430     The _fastcall Attribute (/Gr Option)
	           ------------------------------------
	
	           The list of argument types and their potential register
	           assignments should note that far pointers are passed on the
	           stack.
	
	   456     Default Date and Time
	           ---------------------
	
	           References in this section to the predefined date and time
	           macros should be to __DATE__ and __TIME__, rather than
	           _DATE_ and _TIME_.
