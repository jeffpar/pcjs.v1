---
layout: page
title: "Q50514: Flip/Swap Setting Crucial to Debugging PM Apps with Children"
permalink: /pubs/pc/reference/microsoft/kb/Q50514/
---

	Article: Q50514
	Product: Microsoft C
	Version(s): 2.30
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 10-NOV-1989
	
	Using protected mode CodeView (CVP) to debug Presentation Manager (PM)
	programs that spawn one or more child processes can be rather
	difficult. CVP works correctly for debugging just the parent PM
	process, but once you begin CodeView with the /O option to specify
	that you also want to debug child processes, you may find that you
	hang the computer quite regularly during your debugging session.
	
	CodeView itself does not have a problem with PM programs even if they
	do invoke child processes. It is only when you use the /O switch to
	debug the children at the same time that you run into difficulty. This
	is because of problems with CodeView conflicting with the OS/2 kernel
	as you bring a process to the foreground for debugging, while a
	system-dependent process like the PM parent is relegated to the
	background where it can become blocked.
	
	For example, if the parent gets to a point where it is waiting on a
	message, but it is not in the foreground, there is no way to get the
	focus back to this waiting process and you are essentially hung. The
	parent cannot process the message because it must be in the foreground
	to do so, and CodeView cannot continue until the message is processed,
	so it just waits.
	
	The key to debugging the parent and child processes of a PM program at
	the same time is the setting of Flip/Swap on the Options menu. Under
	CodeView, Flip/Swap ON forces messaging, Flip/Swap OFF does not.
	Therefore, you must turn Flip/Swap on and off as you go, depending on
	which particular part of the program you are currently debugging. The
	Flip/Swap setting is crucial in determining whether you hang the
	system or not.
	
	The ability to debug child processes from the parent's CodeView
	session became an available option beginning with CVP Version 2.30. By
	specifying the /O switch on the command line, CVP allows you to trace
	into child processes. (See the CVP 2.30 Note below if you are using
	that particular version of CodeView.)
	
	As far as actually debugging child processes in PM programs, you must
	proceed in an exacting manner. Unfortunately, the specifics are
	different for every program, so an all-encompassing set of debugging
	procedures cannot be devised. Nevertheless, the following general
	guidelines can be used for debugging most PM applications with their
	accompanying child processes:
	
	 1. It is only with the /O option that any of this becomes critical.
	
	 2. You need to debug in a full screen and not a PM window.
	
	 3. Remember, Flip/Swap ON forces messaging, Flip/Swap OFF does not.
	    Therefore, while you begin debugging in the parent program, you
	    should have Flip/Swap ON, since you need messaging whenever you
	    are doing any of the window initialization routines.
	
	 4. Set a breakpoint in the parent somewhere after the window
	    initialization code, but before the call to start the child
	    process. It varies, but it usually works to put the breakpoint at
	    the "while get message - dispatch message" loop or in the
	    ClientWndProc procedure at the main switch statement.
	
	 5. You must make sure that the breakpoint is placed in a position
	    where you will stop at it before the prompt appears to ask you if
	    you want to debug the child, but after ALL the window
	    initialization has been completed. You will also probably need to
	    set another breakpoint at the point where the parent program is
	    going to begin executing again after you have finished working
	    with the child.
	
	 6. Do a GO, and when the breakpoint is reached, turn Flip/Swap OFF.
	    Make sure that the prompt to debug the child is not already
	    visible or you will lock up.
	
	 7. Do a GO (or some traces) and you should get the prompt to debug
	    the child. Answer "Y" and you should be able to debug the child
	    process at this point.
	
	 8. Use the Process command (the "|") to gain access to the child.
	    Never use CTRL+ESC or ALT+ESC to switch to the other processes
	    because these will almost assuredly cause you to hang.
	
	 9. Go ahead and set breakpoints, watches, etc. in the child and do
	    your debugging.
	
	10. After the child process is completed, use the Quit command to exit
	    the child process's CodeView screen or use the Process command to
	    reselect the parent process.
	
	11. Once you have returned to the parent process, and before you do a
	    Restart (or load), or before you do ANY other window
	    initialization, you MUST turn Flip/Swap ON again.
	
	12. Remember to always be aware of where you are in the program and
	    what the current state of Flip/Swap is, since turning Flip/Swap on
	    or off at the wrong time will almost always cause you to hang.
	
	Again, this is only the general outline of steps to follow and each
	application requires different specific steps. Don't be too surprised
	if you still run into occasional lock-ups.
	
	CVP 2.30 Note: When using the /O switch with CVP Version 2.30, there
	is a bug that may also cause you to hang. The problem involves using
	/O on the command line and then saying "No" when asked if you want to
	debug the child. So, with this version of CodeView, you should always
	answer "Yes" when asked if you wish to debug the child.
	
	For more information on this problem, use the following query:
	
	   CodeView 2.30 hangs debugging child processes
