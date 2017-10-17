---
layout: page
title: "Q31163: Selecting Text in QB.EXE with Dedicated Cursor Keys on Toshiba"
permalink: /pubs/pc/reference/microsoft/kb/Q31163/
---

## Q31163: Selecting Text in QB.EXE with Dedicated Cursor Keys on Toshiba

	Article: Q31163
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 8-NOV-1990
	
	The dedicated-cursor (arrow) keys on the Toshiba T1200 laptop computer
	(and probably on other Toshiba laptop computers that have
	dedicated-cursor keys) may not highlight text in the QB.EXE editor in
	Microsoft QuickBASIC version 4.00, 4.00b, or 4.50 or in Microsoft
	BASIC Compiler version 6.00 or 6.00b. Some key combinations, different
	than those normal for an IBM, may be possible to use for selecting
	text on Toshiba laptop computers.
	
	The Toshiba laptop computers are not included in the list of systems
	on which Microsoft has tested QuickBASIC, and we make no claims for
	compatibility with Toshiba laptop computers.
	
	Because the keyboard supplied with the Toshiba T1200 is not identical
	to an IBM keyboard, you must use a different sequence of keystrokes to
	highlight text in the QuickBASIC editor.
	
	Instead of using the SHIFT+<arrow key> combination, which is used to
	highlight text on an IBM machine, you must use the Toshiba special
	FUNCTION key in conjunction with the SHIFT key and the appropriate key
	from the numeric keypad. For example, to move the cursor down and
	highlight text, use the following key combination:
	
	   FUNCTION+SHIFT+Keypad 2
	
	These key combinations work correctly only for the T1200-series
	computers, which use the special Toshiba 101-key-style keyboards. In
	addition, a customer with a Toshiba T5100 Laptop 386 reported that
	pressing FUNCTION+SHIFT+K (where the K key has numeral 2 on its
	horizontal face) also highlights text. These combinations do not work
	for other Toshiba laptop computers with smaller keyboards. One
	customer reported that the combinations work for Sharp 4501 and 4503
	Portables.
	
	One customer reported that another way to select text on the Toshiba
	T1200 (or T1000) laptop is to use SHIFT+CTRL+<A, S, D, F, E, or X>.
	The A and F let you select words in the left and right direction
	respectively; the S and D let you select single characters in the left
	and right direction respectively; the E and X let you select lines up
	or down respectively. Microsoft has not confirmed or tested this
	information.
	
	It has been reported that a Toshiba T3100 had to use an add-on keypad,
	with NUM LOCK activated, to select text. The Toshiba T3100 comes
	standard with dedicated cursor keys that, the report says, will not
	select text. According to another report, SHIFT+CTRL+<A, S, D, F, E,
	or X> successfully selects text on a T3100e laptop, which has a gas
	plasma display. Microsoft has not confirmed this information.
	
	Another customer reported that on the Toshiba 1000, you can run the
	SETUP10 program, supplied by Toshiba, to configure for a 101-key
	keyboard. After this program is run, pressing FUNCTION+NUM LOCK
	toggles on or off the arrow keys' ability to highlight text. You don't
	need to hold down the SHIFT key while selecting text with the arrow
	keys when highlighting mode is on. Press FUNCTION+NUM LOCK again to
	toggle off the highlighting mode. Microsoft has not confirmed this
	information.
