---
layout: page
title: "Q66743: GAMESHOP.EXE &quot;Error 05&quot;, Using SET COMSPEC=COMMAND.COM /E:n"
permalink: /pubs/pc/reference/microsoft/kb/Q66743/
---

## Q66743: GAMESHOP.EXE &quot;Error 05&quot;, Using SET COMSPEC=COMMAND.COM /E:n

	Article: Q66743
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901101-34
	Last Modified: 5-DEC-1990
	
	GAMESHOP.EXE blanks the screen or gives "Error 5" if you mistakenly
	use the COMMAND.COM /E:n option in the COMSPEC environment variable in
	MS-DOS (such as in your AUTOEXEC.BAT file). The following is an
	example:
	
	   SET COMSPEC=C:\DOS\COMMAND.COM /E:256
	
	This is not considered a problem with Microsoft Game Shop because you
	should normally use only COMMAND.COM /E:n on your SHELL= command in
	your MS-DOS CONFIG.SYS file.
	
	This information applies to Microsoft Game Shop (released October 15,
	1990) for MS-DOS. (Microsoft Game Shop contains the QuickBASIC QBI.EXE
	interpreter version 1.00, which supports the BASIC language defined by
	Microsoft QuickBASIC version 4.50. The QuickBASIC Interpreter QBI.EXE
	1.00 environment is a subset of the QuickBASIC QB.EXE 4.50
	environment, which is a separate product.)
	
	The problem comes up after you select a game from the GAMESHOP.EXE
	menu. After selecting a game to play, the screen blanks out and the
	machine is apparently frozen. You can type CTRL+BREAK to break out of
	the program and return to the DOS command line, but you still cannot
	see anything on the screen. By typing CLS or another screen command,
	your screen will return.
	
	On some machines, you will see the following error statement:
	
	   "ERROR 05 IN MODULE GAMESHOP"
	   (Error 5 means "Illegal function call".)
	
	Remove the /E:n option from the COMSPEC environment variable within
	your AUTOEXEC.BAT file, and instead, set your environment size in your
	CONFIG.SYS file. For example, use the following in your CONFIG.SYS
	file:
	
	   SHELL=C:\DOS\COMMAND.COM /E:256
	
	The COMSPEC environment variable is used to set the drive, directory
	path, and filename for COMMAND.COM, which is MS-DOS's command
	interpreter. COMMAND.COM switches are not allowed in the COMSPEC
	environment variable and may cause problems. The COMMAND.COM switches
	should be set in the SHELL command in your CONFIG.SYS file as stated
	above.
	
	This is a limitation only when you are going through the menu in
	GAMESHOP.EXE. You can still run QBI.EXE and run any game you want with
	no problem. Because GAMESHOP.EXE uses a SHELL to run the games, the
	invalid COMSPEC variable causes problems.
