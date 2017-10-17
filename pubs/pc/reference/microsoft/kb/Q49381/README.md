---
layout: page
title: "Q49381: CVP 2.30 Hangs When /O Is Specified, but Child Is Not Debugged"
permalink: /pubs/pc/reference/microsoft/kb/Q49381/
---

## Q49381: CVP 2.30 Hangs When /O Is Specified, but Child Is Not Debugged

	Article: Q49381
	Version(s): 2.30
	Operating System: OS/2
	Flags: ENDUSER | buglist2.30
	Last Modified: 27-OCT-1989
	
	Beginning with protected-mode CodeView (CVP) Version 2.30, you can
	debug child processes from within a parent process's CodeView session
	by invoking CodeView with the /O switch. When the program is executed
	to the point where the child process is invoked, CodeView displays a
	prompt showing you the child's process ID (PID) and asks, "Do you wish
	to debug (y/n)?". Entering "y" brings up the child process and allows
	you to debug it. Pressing "n" should cause the child to execute
	without any debugging.
	
	Unfortunately, there is a problem in CVP 2.30 that causes CodeView to
	hang if you answer no to debugging the child. The only workaround is
	to always answer yes when prompted to debug a child process, or to
	invoke CodeView without the /O switch because this prevents the prompt
	entirely.
	
	Microsoft has confirmed this to be a problem with CodeView Version
	2.30. We are researching this problem and will post new information as
	it becomes available.
	
	If the program you are debugging is not a Presentation Manager (PM)
	application, you may be able to kill the CodeView session if it should
	hang as a result of answering "n" to the debugging child process. You
	must switch to the Task Manager and use it to close the hung CodeView
	session. If you are working on a PM application, the only workaround
	may be to reboot the computer.
