---
layout: page
title: "Q59400: CHDIR &amp; SHELL &quot;CHDIR&quot; in OS/2 Protected Mode Differs from DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q59400/
---

## Q59400: CHDIR &amp; SHELL &quot;CHDIR&quot; in OS/2 Protected Mode Differs from DOS

	Article: Q59400
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# S900226-124
	Last Modified: 9-MAR-1990
	
	In OS/2 protected mode, if a BASIC program issues a CHDIR, the command
	will affect only the current BASIC process; other processes in the
	system will not be affected. However, this behavior changes when a
	SHELL statement is issued because a SHELL statement executes a copy of
	CMD.EXE. The SHELLed program is considered to be a "child process" of
	the program that issued the SHELL. If the SHELLed program executes
	OS/2's CD or CHDIR command, only the SHELLed process will be affected,
	not the currently running BASIC program that issued the SHELL. This is
	not a problem with BASIC under OS/2; it is correct behavior that is
	dictated by the design of OS/2.
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for OS/2 and to Microsoft BASIC Professional Development System
	(PDS) Version 7.00 for OS/2.
	
	The OS/2 API function, DosChDir(), has the same effect as the BASIC
	CHDIR statement. For both of these, the currently executing BASIC
	process is changed, but the parent process (which started the BASIC
	process) is unchanged. Similar to CHDIR, the ENVIRON statement (and
	other statements that modify the OS/2 protected-mode environment) has
	no effect on the parent process.
	
	This is a feature of the protected mode of OS/2; child processes
	cannot affect the parent process's environment. This represents a
	notable change from DOS. In DOS, there are "programs," but not
	"processes" as in OS/2. In DOS, you cannot have multiple programs
	running simultaneously. There is only one program running and
	therefore it is reasonable to assume that any change directory command
	will change the current DOS directory for both the parent and child in
	a program. Changing the "current directory" under DOS changes it for
	the entire operating system -- the change is global. This means the
	change also takes effect for any programs run later unless the user or
	program specifically changes the current directory. In OS/2 protected
	mode where there can be many programs running at once, having one
	global working directory that could be changed by any process at any
	moment would not be reasonable.
	
	Code Example
	------------
	
	In OS/2 protected mode, the following code example has no effect on
	the screen group that starts the EXE file, but the FILES statement
	illustrates that the directory has been changed for the current
	process:
	
	a$ = "\bc7"
	CHDIR a$            'This only affects the current BASIC process
	                    'API Function DosChDir has same effect as CHDIR
	'SHELL "cd "+a$     'This only affects the SHELLed process. After
	FILES "*.*"         'returning from the SHELL, it has no effect.
	
	In DOS, either the CHDIR statement or the commented SHELL statement in
	the above program will change the directory for the DOS command line.
