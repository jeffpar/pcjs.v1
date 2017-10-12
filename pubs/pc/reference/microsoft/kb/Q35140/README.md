---
layout: page
title: "Q35140: Error C1015 &quot;Can't Open Include File&quot; with MEP"
permalink: /pubs/pc/reference/microsoft/kb/Q35140/
---

	Article: Q35140
	Product: Microsoft C
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | S_C buglist1.00
	Last Modified: 2-NOV-1988
	
	The example program below generates the following error:
	
	Error C1015 "Can't open include file"
	
	The program must be compiled with one of the output-file switches
	(such as /Fc) or through a make file to generate this error.
	
	The include file os2.h opens two other include files: os2def.h and
	bse.h. The bse.h include file, in turn, opens three other include
	files: bsedos.h, bsesub.h, and bseerr.h.
	
	Microsoft has confirmed this to be a problem in Version 1.00. We are
	researching this problem and will post new information as it becomes
	available.
	
	The compiler attempts to open the last include file and generates the
	C1015 error. The total file count at this point is 15, as follows:
	
	 1. stdin
	 2. stdout
	 3. stdprn
	 4. stderror
	 5. stdaux
	 6. MEP
	 7. source
	 8. listing file
	 9. os2.h
	10. os2 def.h
	11. bse.h
	12. bsedos.h
	13. bsesub.h
	14. bseerr.h
	15. tmp file
	
	The following sample code demonstrates the problem:
	
	#define INCL_BASE
	#include <os2.h>
	
	void main (void)
	void main (void)
	{
	}
