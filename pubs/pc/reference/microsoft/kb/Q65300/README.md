---
layout: page
title: "Q65300: C1001: Internal Compiler Error: '@(#)regMD.c:1.100', Line 3431"
permalink: /pubs/pc/reference/microsoft/kb/Q65300/
---

## Q65300: C1001: Internal Compiler Error: '@(#)regMD.c:1.100', Line 3431

	Article: Q65300
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 7-SEP-1990
	
	When compiled with the /Ox option, the code below generates the
	following internal compiler error:
	
	   fatal error C1001: Internal Compiler Error
	   (compiler file) '@(#)regMD.c:1.100', line 3431
	   Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	typedef struct {
	   char DispCon:1;
	   char DispMon:1;
	   char Flash:1;
	   char Tones:1;
	   char TonInt:1;
	} tTVsetup;
	
	void CopyTVsetup(tTVsetup dest[], tTVsetup src[])
	{
	   int calltype;
	
	   for (calltype = 0; calltype < 5; calltype ++)
	   {
	      dest[calltype].TonInt = src[calltype].TonInt;
	      dest[calltype].DispCon = src[calltype].DispCon;
	      dest[calltype].DispMon = src[calltype].DispMon;
	      dest[calltype].Flash = src[calltype].Flash;
	      dest[calltype].Tones = src[calltype].Tones;
	   }
	}
	
	Note that a signed bit-field makes no sense, and when changed to
	unsigned, this code compiles correctly. The "e" optimization seems to
	be causing this error. Not using it on the command line or adding an
	optimize pragma to turn off the function will work as a workaround.
	
	Microsoft has confirmed this this to be a problem with C version 6.00.
	We are researching this problem and will post new information here as
	it becomes available.
