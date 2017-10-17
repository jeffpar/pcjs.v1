---
layout: page
title: "Q50229: BASIC Can't Use Microsoft Windows SDK to Make Applications"
permalink: /pubs/pc/reference/microsoft/kb/Q50229/
---

## Q50229: BASIC Can't Use Microsoft Windows SDK to Make Applications

	Article: Q50229
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | H_MASM B_BasicCom P_WinSDK P_WinSDK1 S_Pascal S_C
	Last Modified: 18-OCT-1990
	
	You cannot create Microsoft Windows programs using Microsoft BASIC.
	The Microsoft Windows Software Development Kit (SDK) for MS-DOS is
	compatible with Microsoft C and Microsoft Macro Assembler (MASM), but
	it is not compatible with Microsoft QuickBASIC versions 4.00, 4.00b,
	or 4.50 (or earlier versions) for MS-DOS, Microsoft BASIC Compiler
	versions 6.00 and 6.00b (or earlier) for MS-DOS, or Microsoft BASIC
	Professional Development System (PDS) version 7.00 or 7.10 for MS-DOS.
	
	The programs created by the above BASIC versions can run in Microsoft
	Windows only by taking complete control of the screen and computer.
	When the BASIC program terminates, control is released back to
	Windows.
	
	In programs written for Microsoft Windows, the usual start-up code for
	a language is not called. Instead, special start-up code for Microsoft
	Windows is called. This start-up code in turn calls the function
	"WinMain" in the program. There is no main-line code in a Microsoft
	Windows program, such as the "main module level code" in BASIC or the
	main() function in C. Instead the Windows start-up code takes the
	place of the main-line code and in turn directly calls WinMain.
	
	The Microsoft Windows start-up code is compatible with the C start-up
	code, but compiled BASIC must be the initial program and must be run
	through its own start-up code to initialize its memory management
	routines. Because there is no way to run the Windows start-up code and
	then call the BASIC start-up code, you can't create Microsoft Windows
	programs using Microsoft BASIC.
	
	Note that Microsoft Pascal 4.00 can use the Microsoft Windows Software
	Development Kit (SDK) for MS-DOS to develop programs for Microsoft
	Windows versions 2.x, but CANNOT develop programs for Microsoft
	Windows version 3.00. Microsoft recommends using C or assembler
	instead of Pascal for Windows programming for MS-DOS.
	
	Although you can't program under Microsoft Windows for MS-DOS using
	Microsoft BASIC, you can program MS OS/2 Presentation Manager (PM)
	applications using Microsoft BASIC Compiler versions 6.00 and 6.00b
	and Microsoft BASIC PDS versions 7.00 and 7.10. This is detailed in a
	separate article, which can be found by querying in this Knowledge
	Base using the following words:
	
	   OS/2 and presentation and manager and BASIC and 6.00b
