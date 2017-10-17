---
layout: page
title: "Q57645: Setting COMSPEC &amp; SHELL in OS/2; SHELL &quot;Illegal Function Call&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q57645/
---

## Q57645: Setting COMSPEC &amp; SHELL in OS/2; SHELL &quot;Illegal Function Call&quot;

	Article: Q57645
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | SR# S891218-2  B_QuickBas
	Last Modified: 14-JAN-1990
	
	The following two situations might cause an "Illegal function call"
	error when attempting to SHELL under OS/2:
	
	1. In the OS/2 DOS 3.x compatibility box, a program can generate an
	   "Illegal function call" if the COMSPEC environment variable is
	   placed in the AUTOEXEC.BAT. Under OS/2, COMSPEC should be defined
	   only in the CONFIG.SYS file.
	
	2. In an OS/2 protected mode session, "Illegal function call" on a
	   SHELL can be generated if the parameter /E:xxxx is used to attempt
	   to set the environment size on the CMD.EXE command interpreter. The
	   CMD.EXE command interpreter will accept this parameter, but it will
	   then prevent you from SHELLing another copy of CMD.EXE. To correct
	   this problem, remove the COMSPEC from the AUTOEXEC.BAT file and make
	   sure it is in the CONFIG.SYS. Also delete the parameter /E:xxxx
	   after CMD.EXE in the CONFIG.SYS.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 under MS OS/2 real mode, to Microsoft BASIC Compiler Versions
	6.00 and 6.00b under MS OS/2 real and protected modes, and to
	Microsoft BASIC Professional Development System (PDS) 7.00 under MS
	OS/2 real and protected modes.
	
	To reproduce the problem, do the following:
	
	1. Place the following lines in the CONFIG.SYS file for OS/2:
	
	      SET COMSPEC=C:\OS2\CMD.EXE /P /E:1024
	      SET SHELL=C:\OS2\COMMAND.COM /P /E:1024
	
	2. Place the following statement in the OS/2 AUTOEXEC.BAT file:
	
	      SET COMSPEC=C:\OS2\COMMAND.COM /P /E:1024
	
	   Note: The path names to CMD.EXE and COMMAND.COM may be different on
	   your system, depending on how you installed OS/2.
	
	3. Reboot your computer with the new settings.
	
	4. Do one of the following, depending on whether you are in real
	   (MS-DOS) or protected mode:
	
	   a. Load QB.EXE or QBX.EXE in real mode (DOS 3.x box) and either
	      choose DOS Shell from the File menu, execute the word "SHELL"
	      in the immediate window, or execute a program that contains only
	      the word "SHELL." Each of these will produce the "illegal
	      function  call" error in QB and QBX.EXE.
	
	   b. Under OS/2 protected mode, execute a BASIC 6.00, 6.00b,or 7.00
	      compiled program whose only statement is SHELL to show the
	      problem.
	
	To eliminate the problem, remove the COMSPEC statement from the
	AUTOEXEC.BAT file, delete the /P /E:1024 after CMD.EXE, and reboot.
	
	The Command Interpreter (COMMAND.COM) Under DOS
	-----------------------------------------------
	
	Under DOS 3.x, 4.00, and 4.01, the COMSPEC environment variable is
	defined in the AUTOEXEC.BAT file. The SET COMSPEC= statement gives DOS
	a path for where the DOS command interpreter COMMAND.COM is located on
	the disk.
	
	Under DOS, a SHELL= command defined in the CONFIG.SYS file tells DOS
	the name of your command interpreter. This at first may not seem
	useful, but this feature was provided so that you can write your own
	command interpreter. You can place the name of your command
	interpreter in the SHELL= statement for DOS to load that command
	interpreter at boot time. However, most people use COMMAND.COM as
	their command interpreter in both the SET COMSPEC= and SHELL= commands
	under DOS.
	
	If you want to set the environment size, you can use the /E:xxx
	parameter on COMMAND.COM to increase or decrease the size available
	for environment variables and the PATH.
	
	The Command Interpreters (CMD.EXE and COMMAND.COM) Under OS/2
	-------------------------------------------------------------
	
	Under OS/2, there are two command interpreters (CMD.EXE and
	COMMAND.COM) and two parameters to SET in the CONFIG.SYS file:
	
	1. First, the SET COMSPEC= statement tells OS/2 where to find the OS/2
	   protected mode command interpreter, which is called CMD.EXE. Unlike
	   COMMAND.COM, CMD.EXE does not take the parameter /E:xxxx to set the
	   environment size. OS/2 does not limit the environment size as DOS
	   does with COMMAND.COM. If you use /E: on CMD.EXE, it will not cause
	   an error message at boot time, but it will prevent you from
	   SHELLing when in an OS/2 session.
	
	2. Second, the SHELL= statement tells OS/2 where to find the DOS
	   compatibility box command interpreter, which is called COMMAND.COM.
	   Just as in DOS, COMMAND.COM will take the parameter /E:xxxx, which
	   allows you to set the environment size for the DOS box command
	   interpreter. Note, however, that when you go into the DOS box, OS/2
	   takes the value of the SHELL in the CONFIG.SYS and SETs the DOS box
	   COMSPEC equal to that value so that normal DOS programs that need
	   that information will function normally. This can be shown by
	   typing the word SET at the DOS box command line. This will show
	   that the COMSPEC is actually set, even though it is not in the
	   AUTOEXEC.BAT file.
	
	Note again that both COMSPEC and SHELL are set in the CONFIG.SYS file
	under OS/2. Nothing is done in the AUTOEXEC.BAT file to specify
	information about command interpreters under OS/2.
