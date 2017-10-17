---
layout: page
title: "Q61557: P70 Display Creates Problems Under CodeView and PWB"
permalink: /pubs/pc/reference/microsoft/kb/Q61557/
---

## Q61557: P70 Display Creates Problems Under CodeView and PWB

	Article: Q61557
	Version(s): 3.00
	Operating System: OS/2
	Flags: ENDUSER | buglist3.00 S_PWB S_Editor
	Last Modified: 15-AUG-1990
	
	CodeView version 3.00 and Programmer's WorkBench (PWB) version 1.00
	have problems recognizing the built-in monitor of IBM P70 portables
	under OS/2. Symptoms of this problem include the following error
	messages:
	
	   Product     Error Message
	   -------     -------------
	
	   CodeView    Internal Debugger Error 0 at load time
	   PWB         Inability to change from 43-line mode
	
	Microsoft has confirmed this to be a problem with CodeView version
	3.00. We are researching this problem and will post new information
	here as it becomes available.
	
	This problem is directly related to the video configuration of the IBM
	P70. In its documentation, IBM mentions briefly that it might be
	necessary to type MODE CO80 to make some software recognize the
	built-in plasma display. An added condition for PWB and CodeView is
	the necessity of being in 43-line mode. PWB automatically places you
	in 43-line mode no matter what you previous mode was and thus gets
	around this limitation. If you attempts to change the height switch
	while editing, PWB doesn't complain but still stays in 43-line mode.
	
	CodeView cannot make the mode change in the same way that PWB can. If
	invoked without the above considerations, CodeView will crash with an
	Internal Debugger Error 0. The following are several ways to work
	around this problem if want to use CodeView with this type of
	configuration.
	
	1. Type MODE CO80 or BW80 and invoke CodeView with the /43 switch.
	
	2. Type MODE CO80,43 or BW80,43 before invoking CodeView.
	
	3. Use an external monitor with the built-in VGA port.
	
	4. Invoke CodeView from PWB, which makes the change automatically.
