---
layout: page
title: "Q41654: QuickC 2.00 README.DOC: /Ze, /Za (Enable/Disable Extensions)"
permalink: /pubs/pc/reference/microsoft/kb/Q41654/
---

	Article: Q41654
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'" The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page 101  /Ze, /Za (Enable or Disable Language Extensions)
	
	Add the following notes to the explanation of /Ze and /Za:
	
	In extremely rare cases, you may want to cast a function pointer to a
	data pointer. QuickC uses the code segment (cs:), while Microsoft C
	5.1 uses the data segment (ds:). The program below attempts to cast a
	function pointer (pfunc) to a pointer to an int (pdata):
	
	    main()
	    {
	      int (*pfunc)();
	      int *pdata;
	
	      pdata = (int *) pfunc;
	     }
	
	The ANSI standard does not permit such casts. When you use /Za to
	enforce ANSI compatibility, this program triggers error C2068. When
	you use /Ze and /W3, this program generates a warning C4074.
	
	To maintain ANSI and C 5.1 portability, cast the function pointer to
	an int before casting it to a data pointer. The following line is
	perfectly acceptable. It generates to errors or warnings.
	
	   pdata = (int *) (int) pfunc;
	
	A second method is to declare pfunc as a union that can act as a
	function pointer or a data pointer.
