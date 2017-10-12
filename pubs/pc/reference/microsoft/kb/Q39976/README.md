---
layout: page
title: "Q39976: Dynamic Allocation for Two Dimensional Arrays"
permalink: /pubs/pc/reference/microsoft/kb/Q39976/
---

	Article: Q39976
	Product: Microsoft C
	Version(s): 4.00 5.x | 5.10
	Operating System: MS-DOS   | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 4-JAN-1989
	
	Question:
	
	How can I dynamically allocate memory for a two dimensional array?
	
	Response:
	
	The best method depends on the flexibility needed and the amount of
	information concerning the array known at coding time. The examples
	below set up two dimensional arrays of characters. Any element can be
	accessed with double sub-scripts, such as array[i][j]. Symbols in
	uppercase are constants, while those in lowercase are variables.
	
	If one of the dimensions of the array is known, either of the
	following two methods can be used. The first example creates more
	overhead due to the number of malloc calls, but it is more flexible
	because each malloc can be of a different size.
	
	The following is the first example:
	
	    char *array[DIM_ONE];
	    int   i;
	
	    for (i = 0; i < DIM_ONE; i++) {
	        array[i] = (char *)malloc(sizeof(char) * dim_two);
	        if (array[i] == NULL) {
	            printf("Not enough memory for columns in row %d!\n", i);
	            exit(1);
	        }
	    }
	
	The following is the second example:
	
	    char *array[DIM_ONE];
	    int   i;
	
	    array[0] = (char *)malloc(sizeof(char) * DIM_ONE * dim_two);
	    if (array[0] == NULL) {
	        printf("Not enough memory for columns!\n");
	        exit(1);
	    }
	    for (i = 1; i < DIM_ONE; i++) {
	        array[i] = (array[0] + (i * dim_two));
	    }
	
	If neither of the dimensions is known at coding time, one of the
	following two methods can be used. The pros and cons of each example
	are the same as those for the previous examples.
	
	The following is the third example:
	
	    char **array;
	    int    i;
	
	    array = (char **)malloc(sizeof(char *) * dim_one);
	    if (array == NULL) {
	        printf("Not enough memory for rows!\n");
	        exit(1);
	    }
	    for (i = 0; i < dim_one; i++) {
	        array[i] = (char *)malloc(sizeof(char) * dim_two);
	        if (array[i] == NULL) {
	            printf("Not enough memory for columns in row %d!\n", i);
	            exit(1);
	        }
	    }
	
	The following is the fourth example:
	
	    char **array;
	    int    i;
	
	    array = (char **)malloc(sizeof(char *) * dim_one);
	    if (array == NULL) {
	        printf("Not enough memory for rows!\n");
	        exit(1);
	    }
	    array[0] = (char *)malloc(sizeof(char) * dim_one * dim_two);
	    if (array[0] == NULL) {
	        printf("Not enough memory for columns!\n");
	        exit(1);
	    }
	    for (i = 1; i < dim_one; i++) {
	        array[i] = (array[0] + (i * dim_two));
	    }
