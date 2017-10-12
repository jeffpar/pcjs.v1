---
layout: page
title: "Q47234: BSEARCH Does Not Find the First Occurrence of Key in the Array"
permalink: /pubs/pc/reference/microsoft/kb/Q47234/
---

	Article: Q47234
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr S_QuickC
	Last Modified: 31-AUG-1989
	
	The run-time library function bsearch() is documented on Page 147 in
	the "Microsoft C for the MS-DOS Operating System: Run-Time Library
	Reference" as returning a pointer to the first occurrence of key in
	the array pointed to by base. This may not be true when multiple
	elements of the array match the key. In the case where multiple
	elements match the key, bsearch returns a pointer to the first element
	that it finds, not necessarily the first element of the array that
	matches the key. This is the proper action for bsearch to take. The
	documentation should read as follows:
	
	   Return Value:
	
	   The bsearch function returns a pointer to the occurrence of key in
	   the array pointed to by base. If there is more than one occurrence
	   of key, the pointer returned by bsearch may point to any of them.
	   If key is not found, the function returns NULL.
	
	The behavior occurs because of the nature of the binary search
	algorithm. If you need to find the first matching element, use the
	lfind() (linear find) function instead of bsearch(). Note: Linear
	finds are much slower than binary searches.
	
	Below is a sample program that demonstrates this behavior:
	
	#include <search.h>
	#include <string.h>
	#include <stdio.h>
	
	int qcompare();  /* declare a function for qsort's compare   */
	int bcompare();  /* declare a function for bsearch's compare */
	
	main (argc, argv)
	int argc;
	char **argv;
	{
	    char **result;
	    char *key = "Brad";
	    int i;
	
	    /* Sort using Quicksort algorithm: */
	
	    qsort((char *) argv, argc, sizeof(char *), qcompare);
	    for (i = 0; i<argc; ++i)                        /* Output sorted list */
	        printf("%s\n", argv[i]);
	
	    /* Find item that begins with "Brad" using a binary search algorithm: */
	
	    result = (char **) bsearch((char *) &key, (char *) argv, argc,
	        sizeof(char *), bcompare);
	    if (result)
	        printf("%s found\n", *result);
	    else
	        printf("PATH not found !\n");
	}
	
	int qcompare (arg1, arg2)
	char **arg1, **arg2;
	{                      /* Compare all of both strings: */
	    return (strcmp(*arg1, *arg2));
	}
	
	int bcompare (arg1, arg2)
	char **arg1, **arg2;
	{                      /* Compare to length of key: */
	    return (strncmp(*arg1, *arg2, strlen(*arg1)));
	}
	
	The program sorts the command line args and then compares them with
	the key "Brad". If you enter the command line arguments, Brad1 Brad2
	Doug, you find that the bsearch routine returns Brad2. Note: The
	number is not checked because the bcompare function checks only the
	first four characters.
	
	Since BSEARCH cuts the array section being searched in half with each
	check, it finds Brad2 before Brad1. Instead of continuing to search
	for the first occurrence of Brad (as is documented), it immediately
	returns with a pointer to Brad2 (which is the proper action).
