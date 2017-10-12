---
layout: page
title: "Q45617: Mouse Disabled When Single-Stepping over Video Mode Change"
permalink: /pubs/pc/reference/microsoft/kb/Q45617/
---

	Article: Q45617
	Product: Microsoft C
	Version(s): 2.20 2.30
	Operating System: OS/2
	Flags: ENDUSER | buglist2.20 buglist2.30
	Last Modified: 21-JUN-1989
	
	When CodeView is run in the OS/2 compatibility box with screen
	swapping enabled (started with either /s or /43), single-stepping (F8)
	over a _setvideomode() call or an INT 10 call to change the video mode
	to a graphics mode causes the mouse cursor to disappear. Exiting
	CodeView and running another mouse-driven program reveals that the
	mouse has been completely disabled in the compatibility box. The only
	way to regain the mouse is to reboot the computer. Attempting to
	reload the mouse by typing "mouse" at a prompt results in the
	following message:
	
	   Session Title: DOS Command Prompt
	
	This error occurs because a DOS mode program changes an interrupt
	vector that is owned by the system causing the program to end.
	
	The behavior described above applies to tracing in SOURCE mode.
	Attempting to trace in assembly language or mixed mode through the
	code that changes the video mode produces erratic results, which range
	from hanging the DOS box to halting the entire system with an
	"internal processing error."
	
	Microsoft has confirmed this to be a problem in CodeView Versions 2.20
	and 2.30. We are researching this problem and will post new information
	as it becomes available.
	
	The following program illustrates the problem:
	
	#include <graph.h>
	
	void main(void)
	{
	  _setvideomode(_ERESCOLOR);    /* when this line is executed, the  */
	                                /* mouse cursor will disappear.     */
	  _setvideomode(_DEFAULTMODE);
	
	}
