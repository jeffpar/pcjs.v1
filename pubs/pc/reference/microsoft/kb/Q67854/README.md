---
layout: page
title: "Q67854: Mouse Menu Key Sequences: Corrections and Additions"
permalink: /pubs/pc/reference/microsoft/kb/Q67854/
---

## Q67854: Mouse Menu Key Sequences: Corrections and Additions

	Article: Q67854
	Version(s): 1.x 2.x 3.x 4.x 5.x 6.x 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | key sequence mouse menu docerr
	Last Modified: 10-FEB-1991
	
	Page 71 of the "Microsoft Mouse Programmer's Reference Guide" lists
	"Key Sequences That Can't Be Simulated" using the menu programming
	TYPE statement. These keys cannot be simulated in a mouse menu because
	the key or key sequence is suppressed in the ROM BIOS. The list that
	is presented in the guide is incomplete, and in certain instances it
	is in need of revision.
	
	Each suppressed key mentioned is the lowercase character on the key.
	It is understood, but not explicitly stated, that the uppercase
	character on these keys will also be suppressed. A number of keys and
	key combinations that are suppressed and cannot be emulated are not
	mentioned in the guide. Some of the additions and corrections that can
	be made to the published list are given below.
	
	KEY COMBINATIONS FOR 83-KEY KEYBOARD
	------------------------------------
	
	For the IBM PC and compatibles with a standard 83-key keyboard,
	the following keys and key combinations are suppressed.
	
	NOTE: Where applicable the uppercase character is given in
	parentheses.
	
	In Combination With the ALT Key
	-------------------------------
	
	RIGHT TAB
	` (~)
	\ (|)
	ALT
	HOME
	PG UP
	NUMPAD 5
	NUMPAD
	+
	END
	PG DN
	INS
	DEL
	
	In Combination with the CTRL Key
	--------------------------------
	
	CTRL
	` (~)
	NUMPAD 5
	NUMPAD
	+
	
	KEY COMBINATIONS FOR 84-KEY KEYBOARD
	------------------------------------
	
	For the IBM AT and compatibles with a 84-key keyboard, the following
	keys and key combinations are suppressed:
	
	In Combination with the ALT Key
	-------------------------------
	
	` (~)
	\ (|)
	TAB (right and left)
	ALT
	
	With ALT and on the Numeric Keypad
	----------------------------------
	
	7 (HOME)
	1 (END)
	5
	0 (INS)
	9 (PG UP)
	3 (PG DN)
	- (SYS RQ)
	+
	
	In combination with the CTRL Key
	--------------------------------
	
	ENTER
	CTRL
	
	With CTRL and on the Numeric Keypad
	-----------------------------------
	
	5
	- (SYS RQ)
	+
	
	For the IBM PS/2 and compatibles with a 101- and 102-key keyboard, the
	following keys and key combinations are suppressed:
	
	In combination with the ALT key and on the Numeric Keypad
	---------------------------------------------------------
	
	7 (HOME)
	1 (END)
	5
	0 (INS)
	9 (PG UP)
	3 (PG DN)
	- (SYS RQ)
	+
	
	In combination with the CTRL Key
	--------------------------------
	
	` (~)
	CTRL
	ALT
	SCROLL LOCK
	
	With CTRL and on the Numeric Keypad
	-----------------------------------
	+
	
	EXCEPTIONS AND CORRECTIONS
	--------------------------
	
	The exceptions and corrections to the list of suppressed key and key
	combinations given on pages 71-72 of the "Microsoft Mouse Programmer's
	Reference" (Copyright 1989) are noted below.
	
	The followings key combinations can be represented using
	extended-keyboard-scan codes with the IBM PS/2 and compatibles with a
	101- and 102-key keyboard:
	
	   ALT+BACKSPACE
	   ALT+ESC
	   CTRL+INS
	   CTRL+TAB
	
	The ALT key used in combination with any one of the following keys can
	also be represented using extended-keyboard-scan codes for the IBM
	PS/2 and compatibles with a 101- and 102-key keyboard:
	
	   [    ]
	   ;
	   '
	   -
	   ,
	   .
	   /
	   *
	
	The CTRL key used in combination with the RIGHT ARROW and LEFT ARROW
	key can be represented on the PC, AT, and PS/2 keyboards.
	
	For more information about this topic, see "The Programmer's PC
	Sourcebook," pages 400-406; the "IBM PC/AT Technical Reference," pages
	4-21 and 5-14 to 5-23; and the "IBM PS/2 Hardware Technical
	Reference," pages 41-49.
