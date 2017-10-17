---
layout: page
title: "Q60138: Explanation and Example of the NMAKE.EXE Utility"
permalink: /pubs/pc/reference/microsoft/kb/Q60138/
---

## Q60138: Explanation and Example of the NMAKE.EXE Utility

	Article: Q60138
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900314-143
	Last Modified: 20-JUL-1990
	
	Microsoft's NMAKE.EXE is a program-maintenance utility. It saves time
	by automating the process of updating project files. NMAKE compares
	the modification dates for one set of files, the target files, to
	those of another file type, the dependent files. If any of the
	dependent files have changed more recently than the target files,
	NMAKE executes a specified series of commands.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) version 7.00 for MS-DOS and MS OS/2.
	
	The main purpose of NMAKE is to help you update applications quickly
	and simply. However, it can execute any command, so it is not limited
	to compiling and linking. NMAKE can also make backups, move files, and
	do many other project management tasks.
	
	NMAKE works by comparing the times and dates of two sets of files,
	which are called "targets" and "dependents":
	
	 - A target file is a file that you want to create, such as an
	   executable file.
	
	 - A dependent file is a file used to create a target, such as a BASIC
	   source file.
	
	When you run NMAKE, it reads a "description file" that you supply. The
	description file consists of one or more blocks. Each block lists a
	target, the target-dependents, and the command that builds the target.
	If any dependent has changed more recently than the target, NMAKE
	updates the target by executing the command listed in the block.
	
	You can invoke NMAKE with the following two options:
	
	1. Specify options, macro definitions, and the names of targets to be
	   built on the DOS or OS/2 command line.
	
	2. Specify options, macro definitions, and the names to be built in a
	   command file, and give the filename on the DOS command line.
	
	NMAKE accepts a number of command-line options, which are described in
	detail in the Microsoft programmer's guide in Chapter 20.
	
	NMAKE reads a description file (text file, saved as text only with
	line breaks) to determine what to do. The description file may contain
	any number of description blocks.
	
	For example, if you have the following three source files that are
	part of the same program
	
	   MAIN.BAS
	   FILE1.BAS
	   FILE2.BAS
	
	and if the files through the program-development process need to be
	updated, you would use NMAKE. First, you create the description file
	that will contain the description blocks, as follows:
	
	#####################COMPILE.MAK##########################
	
	    ALL: Sample.exe
	    main.obj: main.bas      #target : dependent
	       BC main.bas;         #command field: any DOS command
	    file1.obj: file1.bas        #line
	       BC file1.bas;
	    file2.obj: file2.bas
	       BC file2.bas;
	    files.lib: file1.obj file2.obj
	       LIB files.lib file1.obj + file2.obj
	
	    sample.exe: main.obj files.lib
	       LINK main.obj + files.lib, sample.exe;
	
	##########################################################
	
	Then, you invoke NMAKE. The syntax for invoking NMAKE is as follows:
	
	   NMAKE  COMPILE.MAK
	
	Code Example
	------------
	
	MAIN.BAS
	--------
	
	PRINT "We are in the Main Program"
	CALL file1
	CALL file2
	PRINT "We are DONE!!"
	
	FILE1.BAS
	---------
	
	PRINT "We are in FILE1.BAS "
	SUB file1
	  PRINT "We are in the sub of file1.bas"
	END SUB
	
	FILE2.BAS
	---------
	
	PRINT "We are in FILE2.BAS"
	
	SUB file2
	  PRINT "We are in the sub of file2.bas"
	END SUB
