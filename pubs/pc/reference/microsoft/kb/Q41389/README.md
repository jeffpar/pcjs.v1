---
layout: page
title: "Q41389: SIGNAL Is BASIC Reserved Word; SIGNAL ON Usable Only in OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q41389/
---

## Q41389: SIGNAL Is BASIC Reserved Word; SIGNAL ON Usable Only in OS/2

	Article: Q41389
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890125-25
	Last Modified: 15-DEC-1989
	
	The ON SIGNAL(n) GOSUB and SIGNAL ON statements are implemented only
	in OS/2 protected mode for programs compiled with BC.EXE in Microsoft
	BASIC Compiler Versions 6.00 and 6.00b or Microsoft BASIC PDS Version
	7.00.
	
	SIGNAL is a reserved word in QuickBASIC Versions 4.00, 4.00b, and
	4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b, and Microsoft
	BASIC PDS Version 7.00. However, the SIGNAL statements will be
	accepted only by BASIC compiler 6.00 and 6.00b and BASIC PDS 7.00 when
	compiling in protected mode under OS/2. In all other situations, a
	SIGNAL statement results in an "Advanced feature unavailable" error
	message.
	
	The BC.EXE compiler that comes with BASIC compiler 6.00 and 6.00b and
	BASIC PDS 7.00 supports the ON SIGNAL(n) GOSUB and SIGNAL ON
	statements, as documented in Section 5 (Pages 27-29) of "Microsoft
	BASIC Compiler 6.0: User's Guide" for Versions 6.00 and 6.00b for MS
	OS/2 and MS-DOS and the "Microsoft BASIC 7.0: Language Reference"
	manual on Pages 341-342.
	
	Below is an example of the correct use of the ON SIGNAL(n) GOSUB and
	SIGNAL ON statements. This program is supported only if you compile in
	OS/2 protected mode with BC.EXE from Microsoft BASIC Compiler Version
	6.00 or 6.00b, or Microsoft BASIC PDS Version 7.00, and run the
	resulting executable in protected mode:
	
	   PRINT "This program traps CTRL+BREAK in OS/2. Try it."
	   ON SIGNAL(4) GOSUB trap
	   SIGNAL(4) ON
	   10 a$ = INKEY$
	   IF a$ = "" THEN GOTO 10
	   END
	   trap:
	     PRINT "CTRL+BREAK trapped. Press any key to quit"
	     RETURN
	
	The above program always reports "Advanced feature unavailable" when
	run in real mode (DOS) as a compiled executable or when run inside the
	QuickBASIC QB.EXE or the BASIC PDS 7.00 QBX.EXE environments.
