---
layout: page
title: "Q61968: Enabling of Source Browser Menu Related to .BSC and .MAK Files"
permalink: /pubs/pc/reference/microsoft/kb/Q61968/
---

## Q61968: Enabling of Source Browser Menu Related to .BSC and .MAK Files

	Article: Q61968
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 29-MAY-1990
	
	The Source Browser feature of the Programmer's WorkBench (PWB) is
	enabled or disabled depending upon the existence of a database file
	(.BSC file) AND a program list (.MAK file). The existence of a .BSC
	database file alone does not guarantee that the Browse menu will be
	enabled for all modules in a project, even if the .BSC file was built
	from .SBR files for every module. The setting of a program list is
	also required.
	
	Thus, if a .BSC file is built outside of the PWB with PWBRMAKE, then
	upon entering the PWB, the Browser will be enabled for only one module
	at most (see below). The easiest method to enable the Browse menu for
	ALL modules is to select "Set program list" on the Make menu, then
	type in the base name of the .BSC file (with the .MAK or no extension)
	when it prompts you for the filename. If the .MAK file you enter does
	not exist, then the dialog box appears for adding files to the program
	list, whereas you can just select "Save List" without actually adding
	any files. At this point, the Browser menu will be enabled for all
	files you bring up into the PWB editor.
	
	The existence of a Source Browser database file means that the Browse
	menu will be enabled for a source file with a matching base name of
	the .BSC file.
	
	For example, assume a project consists of several modules, with the
	main source module called PROJECT.C. In addition, assume a Browser
	database file called PROJECT.BSC is built from the .SBR Browser
	information files produced by the compiler for every module in this
	project. If the file PROJECT.C is brought up in the PWB, the Browse
	menu will be enabled because the base name (PROJECT) is the same as
	the base name of the database file PROJECT.BSC.
	
	On the other hand, if any of the other source files in the project are
	opened in the PWB, the Browse menu will be disabled because the base
	names do not match the base name of the database file. Also, if
	PROJECT.C is made the current file (which enables the Browse menu) and
	an option is selected on the browse Menu, such as "Goto Reference"
	(which causes a jump to a different module), the Browse menu will
	become disabled. The only way to re-enable the Browse menu in this
	case is to make PROJECT.C the current file again.
	
	The way to enable the Browse menu for all modules is to set a program
	list to a file with the .MAK extension and the same base name as the
	.BSC file. Thus, in the example above, setting the program list to
	PROJECT.MAK will enable the Browse menu for all modules. In fact, this
	connection between the .BSC file and the .MAK file enables the Browse
	menu for the modules in the current project, and for ANY file opened
	under the PWB.
	
	The result is that if you bring up a file in the editor that is
	completely unrelated to the current project (and may not even have a
	related .BSC file), you can still use the Browse menu options.
	However, in this situation, the information available from the Browser
	still only pertains to the original project.
	
	In summary, the .MAK file and .BSC file relationship is based solely
	on the file existence, NOT the file contents. The program list does
	NOT need to contain the names of the modules in the current project
	(or even be an actual makefile) for the Browser to function.
