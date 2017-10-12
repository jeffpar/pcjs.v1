---
layout: page
title: "Q63267: PWB menukey Switch Resets to ALT When Shelling Out to DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q63267/
---

	Article: Q63267
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00
	Last Modified: 10-JUL-1990
	
	If the "menukey" switch in the DOS version of the Programmer's
	Workbench (PWB) version 1.00 is set to anything other than ALT (which
	is the default), it will be redefined to the ALT key after shelling
	out to DOS. This means the menukey switch will lose its assignment
	anytime you choose Compile, Run Program, Debug Program, or DOS Shell.
	
	The menukey switch determines which keystroke activates the PWB main
	menu bar. The ALT key is normally used for this, but menukey can be
	redefined to any keystroke. For example, menukey is automatically
	defined to F9 if you select Brief Editor emulation when installing the
	Programmer's WorkBench.
	
	Whenever you invoke any function (such as Build) that goes out to DOS
	for execution and then returns, the menukey switch is reset to ALT, so
	that both ALT AND the user-defined keystroke invoke the menu.
	
	To work around this problem, you can use the Restart command to invoke
	a macro that redefines the menukey to the desired value each time you
	return from a DOS SHELL command, which will then keep ALT from
	activating the menu. For example, to make it so that F9 is always
	reset as the only menukey, put the following line in the PWB tagged
	section of the TOOLS.INI file:
	
	   restart:= arg "menukey:F9" assign
	
	Since the Restart command, if it exists in TOOLS.INI, is invoked
	automatically when returning from a SHELL command, this guarantees
	that the key assignment will always remain consistent.
	
	Microsoft has confirmed that the automatic reactivation of ALT as the
	menukey is a problem with the Programmer's WorkBench version 1.00. We
	are researching this problem and will post new information here as it
	becomes available.
