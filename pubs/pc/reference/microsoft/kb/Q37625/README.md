---
layout: page
title: "Q37625: MKTEMP() Function Example Clarification"
permalink: /pubs/pc/reference/microsoft/kb/Q37625/
---

## Q37625: MKTEMP() Function Example Clarification

	Article: Q37625
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 14-NOV-1988
	
	The mktemp() function example in the "Microsoft C Optimizing Compiler
	Run-Time Library Reference" manual is correct. However, it is not
	clear that the following code statements are required:
	
	   strcpy (names[i], template) ;
	   result = mktemp(names[i]) ;
	
	These statements ensure that mktemp() is given the original template
	for each successive call. In the example, the template is defined
	as "fnXXXXXX". The first call to mktemp() will produce a file
	name of "fn000001". If you submit such a filename instead of
	the template, "fnXXXXXX", mktemp() will fail because it is unable
	to generate another unique name.
	
	The following example demonstrates this behavior:
	
	/*****************************************************************/
	/* This is the mktemp example in the "Microsoft QuickC Run-Time  */
	/* Library Reference" manual on Page 433. The example copies the */
	/* template to temporary storage so as not to destroy the        */
	/* original template.                                            */
	/*****************************************************************/
	
	#include <io.h>
	#include <stdio.h>
	
	char *template = "fnXXXXXX";
	char *result;
	char names[5][9];
	
	main()
	{
	    int i;
	
	    for (i=0;i<5;i++) {
	        strcpy(names[i], template);      /* Save the template...   */
	        result = mktemp(template);       /* Get another file name. */
	        if (result == NULL)
	            printf("Problem creating the tempfile");
	        else{
	            printf("the unique file name is %s\n",result);
	            fopen(result, "w");
	            }
	                       }
	)
	
	Without the two commented lines in this example, this code fragment
	generates one unique name, then terminates as the pointer "result"
	becomes NULL because mktemp() cannot generate another unique name with
	the template given.
