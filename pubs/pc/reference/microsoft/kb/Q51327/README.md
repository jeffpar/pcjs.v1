---
layout: page
title: "Q51327: strtok(): C Function -- Documentation Supplement"
permalink: /pubs/pc/reference/microsoft/kb/Q51327/
---

	Article: Q51327
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC docsup
	Last Modified: 30-NOV-1989
	
	The strtok() function takes two strings as arguments. The first is a
	series of zero or more tokens separated by delimiters defined by the
	second string. The first call to strtok() returns a pointer to the
	first token in the first argument. To get the next token in the
	original string, a call to strtok() must be made with NULL as the
	first argument that tells strtok() to search for the next token in
	the previous token string.
	
	Keep the following information in mind when using strtok():
	
	1. strtok() will replace a delimiter in the original string with a
	   NULL each time the function is called using the same string, so the
	   original string is modified by the use of strtok().
	
	2. The second argument to strtok() can be changed at any time to a
	   different delimiter.
	
	3. Only single characters are considered to be delimiters.
	
	On the first call to strtok(), the function searches the string
	argument given as the first parameter for any token delimiter defined
	in the second string argument. Any further call to strtok() with NULL
	as the first argument will return a pointer to the next token in the
	original string. The following sample program from Page 603 of the
	"Microsoft C Run-Time Library Reference" manual for Version 5.10 shows
	how strtok() searches a token string:
	
	#include <string.h>
	#include <stdio.h>
	
	char *string = "a string,of ,,tokens";
	char *token;
	
	void main(void)
	{
	        token = strtok(string," ,"); /*there are two delimiters here*/
	        while (token != NULL){
	                printf("The token is:  %s\n", token);
	                token = strtok(NULL," ,");
	        }
	}
	
	The output of this program is as follows:
	
	   The token is: a
	   The token is: string
	   The token is: of
	   The token is: tokens
	
	The following is a sample representation of the area in memory around
	the token pointer during execution of the above program. Note the
	replacement of the delimiter with a NULL character each time a token
	is found:
	
	   -------------------------------------------------------------
	   |a |  |s |t |r |i |n |g |, |o |f |  |, |, |t |o |k |e |n |s |
	   -------------------------------------------------------------
	   This is the original string before the first call to strtok()
	
	   -------------------------------------------------------------
	   |a |\0|s |t |r |i |n |g |, |o |f |  |, |, |t |o |k |e |n |s |
	   -------------------------------------------------------------
	    ^----- token will point here on the first call
	
	   -------------------------------------------------------------
	   |a |\0|s |t |r |i |n |g |\0|o |f |  |, |, |t |o |k |e |n |s |
	   -------------------------------------------------------------
	          ^------ token will point here on the second call
	
	   -------------------------------------------------------------
	   |a |\0|s |t |r |i |n |g |\0|o |f |\0|, |, |t |o |k |e |n |s |
	   -------------------------------------------------------------
	                               ^----- token will point here on
	                                      the third call
	
	                                (etc.)
