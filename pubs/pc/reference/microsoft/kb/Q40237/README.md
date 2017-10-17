---
layout: page
title: "Q40237: Elaboration of Debug History in QuickC Version 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q40237/
---

## Q40237: Elaboration of Debug History in QuickC Version 2.00

	Article: Q40237
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: enduser |
	Last Modified: 20-JAN-1989
	
	Debug history allows you to record and play back debugging session
	commands and program input that were used within the QuickC Version
	2.00 environment. This history is useful in the following situations:
	
	1. Recreating circumstances that led to an error
	
	2. Saving work from one edit/debug session to another
	
	3. Tracking hardware-related problems
	
	This history consists of the following:
	
	1. All commands that affect the flow of control of your program.
	
	2. Location programs where execution was paused and control was
	   returned to you. These "history points" include breakpoints,
	   watchpoints, and single steps.
	
	Note: Do not use a custom editor if you plan to use debug history. The
	history file denotes debugging events by source-line numbers. The
	QuickC editor can update the line numbers if you change the source
	code. Custom editors cannot. As a result, these editors may cause
	synchronization problems.
	
	Debug history is like a tape recorder. It controls two "tapes":
	a debug command tape and a user-input tape.
	
	To turn on the tape recorder, pull down the Debug menu and choose the
	History On selection.
	
	Debug Command Tape
	
	The simplest form of history allows you to browse the flow of your
	program during a debug session.
	
	You can also re-execute some or all of the commands on the history
	tape. The Undo selection in the Debug menu replays the tape from the
	beginning to one before the last command on the tape. You might want
	to do this if you have gone one too far in a debugging session, or
	have modified a value and regret it.
	
	A more general form of Undo also is available. The Replay selection
	under the Debug menu re-executes the tape from the beginning to the
	current browse point on the tape. Undo is a shorthcut method for doing
	a bunch of SHIFT+F10's to get to the end of the tape, then a SHIFT+F8
	to back up one, and then a "Replay" to replay up to that point. For
	example, you can use SHIFT+F8 to browse back eight steps, then do
	"Replay" to re-execute all but these last eight steps. You can then
	use SHIFT+F10 to browse forward two more steps, and then "Replay" to
	re-execute those two steps, etc.
	
	In this way, you can re-execute your debugging session as slowly or as
	quickly as you like. At each point you can perform additional
	debugging commands (watch values, view the output window, etc.) to
	find out more about your program. If you decide you don't want to
	replay the remainder of the tape, you can type new debug commands (F7,
	F10, etc.). The commands will overwrite the remainder of the tape
	(after warning you).
	
	If you browse to the end of the tape, the Replay selection replays the
	entire session. You might want to do this to redo all of your
	debugging commands, but use different program input, as discussed
	next.
	
	User-Input Tape
	
	The user-input tape records keyboard input to your program. When you
	type input to your program, it is recorded to the user-input tape.
	When you choose the Replay selection under the Debug menu, this
	user-input tape is used as the source of input (so you don't have
	to retype it from the keyboard). If the user-input tape runs out of
	input, it automatically reverts to the keyboard, and records the new
	input onto the end of the tape.
	
	The user-input tape is not affected by the browse commands
	SHIFT+F8/F10. Instead, it tracks the actual execution of your program.
	At a given point, the tape head is at the point in the user-input tape
	that will be read next by your program.
	
	You can truncate the user-input tape from this point to the end by
	choosing the Truncate selection under the Debug menu. If you want
	to use identical input, choose Replay. If you want to use
	entirely new input, choose Restart and then Truncate. If you
	want to use some of the input, choose Replay to the point of interest
	and then Truncate (to truncate at that point), then continue.
	
	Options
	
	Under the Options menu there is a Run/Debug selection that allows you
	to specify which tape (debug command and/or user input) you want to
	use. Turning on history turns on those tapes you have specified.
	
	Hints
	
	Use SHIFT+F8/F10 to review your debugging session results.
	
	Choose Undo under the Debug menu when you've run your program one step
	too far.
	
	If you wonder why you reached a breakpoint, turn on history, turn on
	animate, set a breakpoint, and go to the breakpoint. The tape contains
	a complete single-step record of how you got there. You can use
	SHIFT+F8/F10 to browse that record.
	
	To rerun your program with the same user input, but different debug
	commands, enable the user-input tape and disable the debug command
	tape.
	
	To rerun your program with the same debug commands, but different
	user input, enable the debug command tape and disable the
	user-input tape.
