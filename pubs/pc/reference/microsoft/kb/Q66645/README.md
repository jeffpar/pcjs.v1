---
layout: page
title: "Q66645: C4059 Warning May Be Caused by Errors in OS2DEF.H and PMWIN.H"
permalink: /pubs/pc/reference/microsoft/kb/Q66645/
---

## Q66645: C4059 Warning May Be Caused by Errors in OS2DEF.H and PMWIN.H

	Article: Q66645
	Version(s): 6.00 6.00a
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 24-JAN-1991
	
	Using the header files shipped with the OS/2 Toolkit version 1.20, and
	compiling the sample code below with /AL, the compiler will issue a
	C4059 error message on lines 8 and 9. This error is caused by the way
	these two macros are defined. If the following changes are made, the
	error will go away:
	
	1. In OS2DEF.H, change
	
	      #define LOUSHORT(l) ((USHORT)(l))
	
	   to the following:
	
	      #define LOUSHORT(l) ((USHORT)(ULONG)(l))
	
	2. In PMWIN.H, change
	
	      #define CHAR1FROMMP(mp) ((UCHAR)(mp))
	
	   to the following:
	
	      #define CHAR1FROMMP(mp) ((UCHAR)(ULONG)(mp))
	
	The first change has already been made to the include files that
	shipped with Microsoft C version 6.00; the second change has not been
	made. Microsoft has confirmed this to be a problem with C version 6.00
	and 6.00a. We are researching this problem and will post new
	information here as it becomes available.
	
	Sample Code
	-----------
	
	 1. #include <os2def.h>
	 2. #include <pmwin.h>
	 3. void test(MPARAM mp1);
	 4. void test(MPARAM mp1)
	 5. {
	 6.     USHORT i;
	 7.     UCHAR  c;
	 8.     i=LOUSHORT(mp1);
	 9.     c=CHAR1FROMMP(mp1);
	10. }
