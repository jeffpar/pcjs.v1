---
layout: page
title: "Q30819: MASM 5.10 OS2.DOC: OS/2 Call Summary - Keyboard Input"
permalink: /pubs/pc/reference/microsoft/kb/Q30819/
---

## Q30819: MASM 5.10 OS2.DOC: OS/2 Call Summary - Keyboard Input

	Article: Q30819
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Keyboard input constant - INCL_KBD
	
	   @KbdRegister - Registers a keyboard subsystem within a screen group
	   Parameters - ModuleName:PZ, EntryPoint:PZ, FunctionMask:D
	
	   @KbdCharIn - Returns a character/scan code from the keyboard
	   Parameters - CharData:PS, IOWait:W, KbdHandle:W
	   Structure - KBDKEYINFO
	
	   @KbdPeek - Returns a character and scan code, if available, without
	              removing it from the keystroke buffer
	   Parameters - CharData:PS, KbdHandle:W
	   Structure - KBDKEYINFO
	
	   @KbdStringIn - Reads a character string from the keyboard
	   Parameters - CharBuffer:PB, Length:PS, IOWait:W, KbdHandle:W
	   Structure - STRINGINBUF
	
	   @KbdFlushBuffer - Clears the keystroke buffer
	   Parameters - KbdHandle:W
	
	   @KbdSetStatus - Sets the characteristics of the keyboard
	   Parameters - Structure:PS, KbdHandle:W
	   Structure - KBDINFO
	
	   @KbdGetStatus - Gets status information about the keyboard
	   Parameters - Structure:PS, KbdHandle:W
	   Structure - KBDINFO
	
	   @KbdOpen - Creates a new logical keyboard
	   Parameters - KbdHandle:PW
	
	   @KbdClose - Ends a logical keyboard
	   Parameters - KbdHandle:W
	
	   @KbdSetCp - Sets the code page identifier for a logical keyboard
	   Parameters - Reserved:W, CodePageID:W, KbdHandle:W
	
	   @KbdGetCp - Retrieves the code page identifier for the logical keyboard
	   Parameters - Reserved:D, CodePageID:PW, KbdHandle:W
	
	   @KbdGetCp - Ends a logical keyboard
	   Parameters - KbdHandle:W
	
	   @KbdFreeFocus - Frees the logical-to-physical bond created by KbdGetFocus
	   Parameters - KbdHandle:W
	
	   @KbdGetFocus - Binds the logical keyboard to the physical keyboard
	   Parameters - IOWait:W, KbdHandle:W
	
	   @KbdSynch - Synchronizes access to the keyboard subsystem
	   Parameters - IOWait:W
	
	   @KbdXlate - Translates a scan code and its shift states into an ASCII code
	   Parameters - XlateRecord:PS, KbdHandle:W
	   Structure - KBDTRANSLATE
	
	   @KbdSetCustXt - Installs a custom translate table for the logical keyboard
	   Parameters - CodePage:PW, KbdHandle:W
