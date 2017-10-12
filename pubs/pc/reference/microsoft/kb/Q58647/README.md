---
layout: page
title: "Q58647: How to Successfully Debug VioPopUp() Code with CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q58647/
---

	Article: Q58647
	Product: Microsoft C
	Version(s): 2.20 2.30 2.35
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 27-FEB-1990
	
	Debugging programs that take advantage of OS/2's VioPopUp() call can
	present a potentially dangerous situation. Due to the nature of the
	VioPopUp() call, any attempts to trace into the VioPopUp call will cause
	your machine to hang. The workaround for this difficulty is to set a
	breakpoint outside of the VioPopUp() call [after the VioEndPopUp()], and
	then press F5 to instruct CodeView to execute to the next breakpoint.
	
	The VioPopUp() call brings forward a temporary pop-up text screen group
	that can be used to display text information without altering the
	context of the foreground screen. When a VioPopUp() call is executed, the
	current foreground screen group loses the keyboard focus to the pop-up
	screen. Therefore, when you trace into a VioPopUp() call, the pop-up
	text comes forward and CodeView, running in the foreground, loses the
	keyboard focus and cannot execute a trace instruction. At this time,
	CTRL+ESC or ALT+ESC will not change the deadlock situation and the
	only alternative is to reboot.
	
	To work around this problem, it is essential that you do NOT step into
	a VioPopUp call. Instead, press F5 to execute to the next breakpoint.
	Setting the breakpoint AFTER the VioEndPopUp() call is critical.
