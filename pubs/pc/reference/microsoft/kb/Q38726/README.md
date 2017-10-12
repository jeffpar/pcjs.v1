---
layout: page
title: "Q38726: Finding Out what Video Adapters Are Installed and Active"
permalink: /pubs/pc/reference/microsoft/kb/Q38726/
---

	Article: Q38726
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | video display monitor color monochrome black white b/w mono
	Last Modified: 14-DEC-1988
	
	Question:
	
	I am writing a program that has to determine what adapter boards are
	installed in a machine. In addition, it must also determine which
	board is active. How can I use the functions supplied with C to get
	this information?
	
	Response:
	
	There is no way using the functions we supply to find out what type of
	video adapters are installed in your system. There is, however, a
	book entitled "Programmer's Guide to PC & PS/2 Video Systems,"
	published by Microsoft Press, which has an appendix that has a MASM
	example of finding out what adapters are installed. (This example
	could be translated into C.)
	
	However, even if you write code to find out what adapters are
	installed, there is no simple way to tell the graphics library to
	use an adapter other than the one it wants to use. The library will
	pick an adapter according to the following rules:
	
	1. If there is a VGA in the system, it uses it regardless of what
	   other adapters are installed and regardless of what adapter is
	   currently the default adapter. The only way to change this is to
	   hook the BIOS INT 10h interrupt as described below.
	
	2. If there is no VGA, it uses the current adapter. This can be set
	   with the MODE command in DOS before you start your program.
	
	If you hook INT 10h, you can change the behavior with the VGA to pick
	the current adapter. The _setvideomode function makes a call to INT
	10h function 1Bh to determine whether a VGA is installed or not. You
	can write code to change the return value if the VGA is not the
	current adapter, leaving it alone if the VGA is the current adapter.
	
	The _getvideoconfig function only gives information on the current
	video mode, as set by _setvideomode. It is not helpful for finding out
	what adapters are installed in your system.
	
	You can find out what adapter the library would use by making calls to
	_setvideomode. If the mode cannot be selected, _setvideomode will
	return zero. For example, if you tried to select a VGA mode and
	_setvideomode returned zero, you would know that no VGA was present in
	the system. You then could attempt to select an EGA, etc.
