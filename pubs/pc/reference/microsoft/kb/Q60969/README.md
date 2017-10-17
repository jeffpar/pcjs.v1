---
layout: page
title: "Q60969: NMAKE Example Using ALL, Pseudotarget and Macros"
permalink: /pubs/pc/reference/microsoft/kb/Q60969/
---

## Q60969: NMAKE Example Using ALL, Pseudotarget and Macros

	Article: Q60969
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900319-89
	Last Modified: 14-MAY-1990
	
	NMAKE works by comparing the dates and times of two sets of files,
	which are called "targets" and "dependents." A target is a file that
	you want to create, such as an executable file. A dependent is a file
	used to create a target, such as a BASIC source file. If any dependent
	has changed more recently than the target, NMAKE updates the target by
	executing the command listed in the block.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) version 7.00 for MS-DOS and MS OS/2.
	
	The pseudotarget is a name that serves as a "handle" for building a
	group of files or executing a group of commands. In the following
	example, ALL is the pseudotarget. After ALL, you would list all the
	EXE files that you want to create with this NMAKE file.
	
	Inference rules are templates that NMAKE uses to generate files with a
	given extension. When NMAKE encounters a description block with no
	commands, it looks for an inference rule that specifies how to create
	the target from the dependent files, given the two file extensions.
	Inference rules eliminate the need to put the same commands in several
	description blocks. In this example, the inference rules are to
	compile BASIC source files with no options and also to link the files
	with no linker options. If you wanted to specify compiler options (for
	example, /W, /X, etc.), you must include the command line "BC
	myprog.bas /X ;" in your description block for myprog.obj :
	myprog.bas.
	
	The OBJS statement in the description block for mymain2 is called a
	macro. Macros provide a convenient way to replace a string in the
	description file with another string. This statement is telling NMAKE
	that MYLIB.LIB is made up of these object files. The "!" on the LIB
	command is a repetition modifier that tells NMAKE to repeat the
	command as many times as it needs for dependents that are out of date
	with respect to the target. If both members of the library were
	updated, they would both be compiled and the library would be
	incrementally updated. The following commands would be executed:
	
	   lib mylib.lib -+ libsub.obj ;
	   lib mylib.lib -+ libsub2.obj ;
	
	The library could also contain modules written in assembler or C. You
	would need to add an assemble or C compile line, either as an
	inference rule or specifically to the module's description block. For
	example, the inference rules for a C compile and a MASM assemble would
	be as follows:
	
	   .c.obj:
	      cl /c $?
	
	   .asm.obj:
	      masm $? ;
	
	The following is a sample NMAKE description file, MYMAKE.MAK, which
	compiles and links two programs. The first is a main module and a
	subprogram, and the second is a main module with a library containing
	two members. To execute the description file, type the following:
	
	   NMAKE MYMAKE.MAK
	
	Code Example
	------------
	
	#----------------MYMAKE.MAK-------------------
	
	#----------pseudotarget
	
	ALL : mymain.exe mymain2.exe
	
	#----------inference rules
	
	.BAS.OBJ:
	   BC $< ;
	
	.OBJ.EXE:
	   LINK $** ;
	
	#----------mymain description block
	
	# target : dependent
	mymain.obj : mymain.bas  # (these will use inference rules
	mysub.obj : mysub.bas    #  to compile and link)
	mymain.exe : mymain.obj mysub.obj
	
	#----------mymain2 description block
	
	mymain2.obj : mymain2.bas
	    BC mymain2.bas /X ;    # (this command used for compile)
	
	libsub.obj : libsub.bas    # (these will use the inference
	libsub2.obj : libsub2.bas  #  rules for compiling)
	
	OBJS = libsub.obj libsub2.obj
	
	mylib.lib : $(OBJS)
	      !lib mylib.lib -+ $?;
	
	mymain2.exe : mymain2.obj mylib.lib   # (this uses inference
	                                      #  rule for linking)
