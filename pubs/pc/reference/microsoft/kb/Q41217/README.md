---
layout: page
title: "Q41217: Alleged Problems with Listing Options (/Fc, /Fl, /Fa)"
permalink: /pubs/pc/reference/microsoft/kb/Q41217/
---

	Article: Q41217
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S881208-32 errors
	Last Modified: 25-MAY-1989
	
	Microsoft has received reports that the assembly listing options (/Fc,
	/Fl, /Fa) produce listings that don't accurately reflect the code
	generated.
	
	We have determined that this problem is caused
	because different compiler options are being used when compiling to
	produce the listing, than when compiling to produce an executable. An
	especially common situation is to use /Zi for compiling the executable
	and to leave it off when compiling to produce a listing.
	
	The /Zi option DOES in fact cause slightly different code to be
	generated because optimizations that would move code are  suppressed.
	Therefore, it is perfectly normal for the CodeView listing of a
	program compiled with /Zi to differ somewhat from the listing produced
	when compiled without /Zi.
	
	If you find a case in which the listing is different from the
	generated code when both are compiled with EXACTLY the same options,
	please report the problem to Microsoft.
