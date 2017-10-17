---
layout: page
title: "Q67082: String Constants May Be Interpreted as Trigraphs in C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q67082/
---

## Q67082: String Constants May Be Interpreted as Trigraphs in C 6.00

	Article: Q67082
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 15-JAN-1991
	
	To maintain compatibility with other systems, a series of
	ANSI-mandated trigraphs have been implemented beginning with Microsoft
	C version 6.00 and Microsoft QuickC version 2.50. The addition of
	these trigraphs may require that changes be made to code that was
	previously written for other versions of C that do not support these
	codes. The code example below illustrates one such instance where this
	is necessary. The trigraphs are listed on page 424 of the Microsoft C
	"Advanced Programming Techniques" manual.
	
	Trigraphs are three-character combinations that are used to represent
	certain symbols in the C language that are not available in all
	character sets. For example, some keyboards or character sets do not
	have the opening and closing brace characters, "{" and "}". These
	characters are essential to writing a C program; therefore, someone
	without these characters can use the trigraphs "??<" and "??>" in
	place of the braces.
	
	The compiler translates the three-character trigraph combinations into
	single characters at compile time. If a sequence of characters in a
	constant string matches a trigraph pattern, the compiler will replace
	the three characters with the single corresponding character that the
	trigraph represents.
	
	This situation may manifest itself when using functions, such as
	_dos_findfirst(), that may use these characters in a constant to
	represent wildcard characters when doing a file search. The workaround
	is to break up the constant with double quotation marks, as shown
	below. This procedure will cause the compiler to concatenate the two
	strings without first translating the characters.
	
	Sample Code
	-----------
	
	#include <dos.h>
	#include <errno.h>
	#include <stdio.h>
	
	void main( void)
	{
	   struct find_t fileinfo;
	
	   /* '??-' in the following line will be replaced by a '~' */
	
	   if( _dos_findfirst( "??-100.*", _A_NORMAL, &fileinfo) != 0)
	      {
	      printf( "No -100 Files Found!\n");
	      return;
	      }
	   else
	      printf( "Files Found, Program will proceed normally!\n");
	}
	
	To prevent the compiler from misinterpreting the "??-" character
	sequence as an unintended trigraph, you could replace the
	_dos_findfirst() line above with the following line:
	
	   if( _dos_findfirst( "??""-100.*", _A_NORMAL, &fileinfo) != 0)
	
	Notice that the only difference is the double quotation marks used to
	break up the string into two substrings, thus eliminating the trigraph
	pattern.
