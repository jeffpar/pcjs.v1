---
layout: page
title: "Q62703: Use of K&amp;R Style Function Definitions May Generate Bad Code"
permalink: /pubs/pc/reference/microsoft/kb/Q62703/
---

	Article: Q62703
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 15-AUG-1990
	
	The following code should print out "ABCDEF". However, if compiled
	with default optimizations it prints out "ACEGIK" in small model and
	"  TLr" in large model. This is corrected by turning off optimizations or
	converting the program to the ANSI style.
	
	Sample Code
	-----------
	
	#define NULL ((char *) 0)
	
	int var;
	int *my_prog_var_table[] = {&var,&var,&var,&var,&var,&var,NULL};
	char my_prog_suffix_table[] = "ABCDEFGHIJKLMNOP";
	
	main()
	{
	   printf("Program should print \"ABCDEF\"\n");
	   my_prog_init_files(my_prog_var_table,my_prog_suffix_table);
	   printf("\n");
	}
	
	// #pragma optimize("tc",off) //Will Fix
	
	my_prog_init_files(vars, suffix)
	int *vars[];
	char suffix[];
	{
	   int i;
	   for (i = 0; vars[i]; i++)
	   {
	   my_prog_init_file(vars[i], suffix[i])
	   }
	}
	
	// #pragma optimize("tc",on) //Will Fix
	
	my_prog_init_file(var, suffix)
	int *var;
	char suffix;
	{
	   printf("%c", suffix);
	}
