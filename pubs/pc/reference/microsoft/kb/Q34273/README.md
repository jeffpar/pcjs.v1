---
layout: page
title: "Q34273: QB.EXE Visibility, IBM PS/2 Model 50,60,80, Monochrome Monitor"
permalink: /pubs/pc/reference/microsoft/kb/Q34273/
---

## Q34273: QB.EXE Visibility, IBM PS/2 Model 50,60,80, Monochrome Monitor

	Article: Q34273
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 30-MAY-1990
	
	The problem below was reported by a customer using QuickBASIC version
	4.00b on the IBM PS/2 models 60 and 80 (which have VGA graphics) with
	a monochrome monitor. (This problem probably also applies to the IBM
	PS/2 model 50 with a monochrome monitor.) Another customer reported a
	similar problem in QB.EXE in QuickBASIC version 4.50 and in QBX.EXE in
	Microsoft BASIC Professional Development System (PDS) version 7.00.
	Microsoft is researching this problem and will post new information
	here as it becomes available.
	
	When the QB.EXE version 4.00b editor is started with the /b switch (QB
	/b) on a IBM PS/2 model 60 or 80 with a monochrome monitor, it appears
	to start correctly. However, when a file is OPENed, QuickBASIC ignores
	the /b option and switches to color mode, causing the editor to be
	hindered by visibility problems. Also, when the DOS SHELL command is
	chosen from the File menu in QB.EXE, the text in MS-DOS is highlighted
	and blinking.
	
	To work around this editor visibility problem, execute the MODE BW80
	or MODE 80 command in DOS before running QB /b or QBX /b.
	
	This problem does not occur with QB.EXE version 4.00.
	
	The customer reported the above problem on the following equipment:
	
	   IBM PS/2 models 60 and 80, both with 70-megabyte hard disks,
	   ESDI controllers, and IBM monochrome monitors (type 8503-002)
	
	On the IBM PS/2 models 60 and 80 with the standard IBM PS/2 monochrome
	monitor, programs normally give different gray scales instead of
	color.
	
	For a related article, query on the following words:
	
	   gray and scale and VGA and PS/2
	
	A customer has also reported a slightly different problem on an IBM
	PS/2 Model 70 with VGA graphics and a monochrome monitor. An executed
	program would not terminate when CTRL+BREAK was pressed and instead
	hung the computer. Executing a MODE BW80 command under DOS before
	running QB.EXE or QBX.EXE solved this problem.
