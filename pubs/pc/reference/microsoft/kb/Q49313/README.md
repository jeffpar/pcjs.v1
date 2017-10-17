---
layout: page
title: "Q49313: Files, Environment Inaccessible Only While Running under CVP"
permalink: /pubs/pc/reference/microsoft/kb/Q49313/
---

## Q49313: Files, Environment Inaccessible Only While Running under CVP

	Article: Q49313
	Version(s): 2.20
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 30-NOV-1989
	
	Due to combined problems in both protected-mode CodeView (CVP) Version
	2.20 and OS/2 Version 1.00 or 1.10, programs that correctly access
	data files and/or system environment information could fail when
	attempting this same access while running under CVP 2.20. This is
	strictly a protected-mode problem and is unrelated to the use of
	CodeView under MS-DOS. The sample program at the end of this article
	can be used to demonstrate this problem.
	
	The system environment information includes such items as the path and
	other environment variables, as well as the current working directory
	for each disk drive. This information is normally available to an
	executing program, but for a program being debugged with CVP 2.20
	running under OS/2 1.00 or 1.10, most of this environment information
	is inaccessible.
	
	This inaccessibility is a result of environment handling problems in
	both CVP 2.20 and OS/2 Version 1.00. Since CodeView is run from the
	command prompt, all the current environment information is available
	to CodeView itself, but the program being debugged is given its own
	new screen group in which to run. It is in this new screen group that
	the current environment information is lost because it is not carried
	over by either OS/2 or CodeView.
	
	Although the OS/2 problem has been corrected in Version 1.10, the
	CodeView problem still prevents access to the environment. Therefore,
	upgrading either CodeView or OS/2 alone does not solve the problem.
	Only with CodeView Version 2.30 running under OS/2 Version 1.10 is the
	problem eliminated.
	
	There may be some environment information available to the program
	being debugged, but only if it was set in the CONFIG.SYS file at start
	up. Since each new screen group is begun with a copy of the original
	start-up system environment, any SET commands carried out in the
	CONFIG.SYS file will then be duplicated for all subsequent screen
	groups.
	
	Otherwise, if a program needs access to environment variables that
	were set in the current screen group where CodeView will be invoked,
	then the only way to make the information available while debugging is
	to temporarily hard code the information into the program. After
	debugging, the program can be changed back to using the actual
	environment strings.
	
	The only other alternative to temporarily hard code the environment
	information into the program is to set the environment variables in the
	CONFIG.SYS file at boot time, rather than setting them in the current
	screen group.
	
	The only reason a file access will fail only while the program is
	running under CodeView is if the program is assuming the file is in
	the current working directory on the current or another drive.
	
	If this is the case, then one of the following workarounds may be used
	to gain access to files while debugging:
	
	1. Use full pathnames for all file accesses, since this alleviates any
	   dependency on knowing the current working directory for the drive
	   that is being accessed. If it is not feasible to have hard-coded
	   pathnames in the completed program, at least adding the full paths
	   temporarily will allow debugging.
	
	2. Put the files to be accessed in the root directory of the boot
	   drive. This allows them to be found even under CodeView because
	   with no environment information, the current working directory
	   defaults to the root of the boot drive.
	
	3. Use a two-monitor debugging setup and start CodeView with the /2
	   option. In this situation, CVP does not need to start a new screen
	   group for the program being debugged because it can run it on the
	   second monitor. Thus, the current environment information is
	   available to both programs because they are both running in the
	   current screen group.
	
	   For more information about debugging with a two-monitor setup, query
	   on the following:
	
	      CodeView two monitor debugging
	
	The following C program can be used to demonstrate this environment
	problem:
	
	Program Example:
	---------------
	
	    /* TEST.C - shows inaccessible files under CodeView
	
	       Compile with : CL /Zi /Od test.c
	       Run with : test <filename>      where <filename> is any file
	                       in the current directory.  The file will be
	                       opened properly.
	       Begin CVP with : CVP test <filename>     where <filename> is
	                       the same as before. The file will not be
	                       found when the program is run or traced.
	    */
	
	    #include <stdio.h>
	    void main(int, char *[]);
	
	    void main(int argc, char *argv[])
	    {
	        FILE *dfile ;
	
	        if ((dfile = fopen(argv[1], "rb")) == NULL) {
	            perror ("") ;
	            printf ("Cannot open file '%s'.\n\n", argv[1]) ;
	        }
	        else {
	            printf("File %s opened OK.\n\n", argv[1]) ;
	            fclose (dfile) ;
	        }
	    }
