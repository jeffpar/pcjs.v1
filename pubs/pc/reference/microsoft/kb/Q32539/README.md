---
layout: page
title: "Q32539: fclose() on Unopened Files Causes Protection Violation"
permalink: /pubs/pc/reference/microsoft/kb/Q32539/
---

## Q32539: fclose() on Unopened Files Causes Protection Violation

	Article: Q32539
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 11-AUG-1988
	
	If you close an unopened file with the fclose() function, a
	protection violation occurs if the source is compiled in the large- or
	compact-memory model. In the small-memory model, fclose() returns an
	error as expected.
	   Closing an unopened file is a user error and it is outside the
	functional realm of the C run time to check the validity of file
	handles passed to the fclose function. It is the responsibility of the
	user to ensure that only valid file handles are passed to the fclose
	function.
	
	   The sample code below demonstrates this behavior. Compile this code
	with the CL /AL file.c. command line:
	
	#define INCL_BASE
	#include <os2.h>
	#include <stdio.h>
	FILE *myfile;
	int status;
	
	main()
	{
	 myfile = fopen("myfile.dat","r");
	 if (myfile == NULL) printf("file open error\n");
	 status = fclose(myfile);
	 printf("file close status = %d\n",status);
	}
