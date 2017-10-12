---
layout: page
title: "Q44793: Using Third-Party Libraries Produced for C Version 4.00"
permalink: /pubs/pc/reference/microsoft/kb/Q44793/
---

	Article: Q44793
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 31-MAY-1989
	
	Third-party libraries made for C Version 4.00 can be used with C
	Versions 5.00 and C 5.10. An attempt was made to make third-party
	libraries as compatible as possible. However, a few functions were
	changed to conform to the ANSI C draft and may cause problems.
	Functions such as rename() and memcpy() had their arguments reversed
	from the C 4.00 to C 5.00 libraries; thus, calls to these functions
	from C 4.00 libraries do not work properly. This also applies when
	using third-party libraries with QuickC 1.x and QuickC 2.00.
	
	To use libraries made for C 4.00 under C 5.00 or above, you must link
	with /NOD and specify the C 5.00 combined library to use, as follows
	(the /NOD tells the linker not to use the default libraries for C 4.00):
	
	   LINK /NOD file.c ,,, oldlib slibce.lib
	
	In QuickC, this can be done as follows by setting the environment
	variable LINK to /NOD and specifying the QuickC combined library to
	use in a program list:
	
	   set LINK=/NOD
	
	If there are still linker errors, you must request library updates
	from the third-party vendor.
