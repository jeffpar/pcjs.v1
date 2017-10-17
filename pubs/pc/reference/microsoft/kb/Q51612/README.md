---
layout: page
title: "Q51612: QuickC 1.0x and the CL= and LINK= Environment Settings"
permalink: /pubs/pc/reference/microsoft/kb/Q51612/
---

## Q51612: QuickC 1.0x and the CL= and LINK= Environment Settings

	Article: Q51612
	Version(s): 1.00 1.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 17-JAN-1990
	
	You can add QCL command-line options to the default options that the
	QuickC Versions 1.00 and 1.01 environments use when building a program
	by setting an environment variable called CL at the DOS prompt. For
	example, if at the DOS prompt you type
	
	   set cl=/FPi87
	
	the QuickC compiler will generate floating point instructions and
	select an 8087/80287/80387 library. Similarly, you can set linker
	options by setting the LINK= variable at the DOS prompt. If you type
	
	   set link=/M
	
	each time you execute the QuickC linker, it will create a linker map
	for your source file that contains all global symbols in your source
	code. Now, if you type
	
	   link foo.obj
	
	the linker will actually add the /M flag to its list of options for
	this execution. The linker will now do the same things it would do if
	you had typed the following:
	
	   link /M foo.obj
	
	However, there are a few situations when the QuickC environment does
	not react as you might expect to setting environment variables. Three
	of these software limitations are described below:
	
	1. The CL= variable is not checked if there are multiple modules in
	   the program list.
	
	2. You will not receive an error message if you have an invalid
	   setting for the CL= variable with or without a program list.
	
	3. Settings for the LINK= environment variable are ignored entirely by
	   the environment.
	
	All of these limitations have been corrected in QuickC Versions 2.00
	and 2.01. In each of these cases, the environment variable settings
	are found correctly in QuickC Versions 2.00 and later.
	
	1. CL= not checked in multiple-module programs.
	
	   QuickC Versions 1.00 and 1.01 fail to look at the environment table
	   for a CL environment variable if there is more than one source
	   module in the program list. Even if you edit the makefile to add
	   the option to the list of QCL options, QuickC will not look at the
	   changed options, but will compile with the default options in the
	   original makefile.
	
	   The following sequence of events will demonstrate this limitation.
	   These steps will attempt to force QuickC to use the MLIBC7.LIB
	   library. If this library is in your LIB subdirectory, temporarily
	   rename it so that QuickC cannot find it. Also rename the MLIBCE.LIB
	   file so that you are prompted for it at link time.
	
	   a. At the DOS prompt, type the following:
	
	         set cl=/FPi87
	
	   b. Create one source code module as follows:
	
	         /* FOO.C */
	         #include <stdio.h>
	         void other(void);
	         void main(void)
	         {
	              printf("Executing main procedure.\n");
	              other();
	         }
	
	   c. Create another source module as follows:
	
	         /* OTHER.C */
	         #include <stdio.h>
	         void other(void)
	         {
	              printf("Executing other module.\n");
	         }
	
	   d. Set a program list for FOO.C that contains FOO.C and OTHER.C.
	
	   e. Build the program from the environment.You are prompted for the
	      MLIBCE.LIB library instead of MLIBC7.LIB, as you would expect.
	      QuickC has ignored the CL= environment variable.
	
	2. Environment ignores invalid flag.
	
	   If you set the CL= variable to an invalid option, the QuickC
	   environment ignores the flag even if you are in a single module
	   program.
	
	   a. Type the following line at the DOS prompt:
	
	         set cl=/JUNK
	
	   b. Create the following file:
	
	         /* HELLO.C */
	         #include <stdio.h>
	         void main(void)
	         {
	              printf("Hello?!\n");
	         }
	
	   c. Build the program from within the environment. The environment
	      should give you an error concerning the invalid switch, but it
	      does not.
	
	3. Environment ignores LINK= flag.
	
	   a. Type the following line at the DOS prompt:
	
	         set link=/M
	
	   b. Build HELLO.C (above) from within the environment.
	
	   c. Exit to DOS and notice that there is no HELLO.MAP file created.
	      You can also set the LINK= variable to a junk setting and notice
	      that you still receive no invalid flag errors.
	
	   Notice that these errors occur only when you build a new program in
	   the environment. If you compile and link at the DOS prompt, the
	   environment settings are found correctly.
