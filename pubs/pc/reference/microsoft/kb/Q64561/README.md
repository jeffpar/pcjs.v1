---
layout: page
title: "Q64561: _outtext() Corrupts String in C 6.00 Large and Compact Models"
permalink: /pubs/pc/reference/microsoft/kb/Q64561/
---

	Article: Q64561
	Product: Microsoft C
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00 s_quickc
	Last Modified: 31-AUG-1990
	
	In Microsoft C version 6.00 large and compact memory models,
	_outtext() can corrupt the string of characters passed to it in
	certain circumstances. It does this by inserting a NULL character into
	the string.
	
	The following program demonstrates the problem. Before the second
	_outtext() call, the buffer is a full 2999 bytes; after the call, it
	is considerably smaller, signifying that the NULL has been inserted
	into the buffer.
	
	Sample Program
	--------------
	
	#include<stdio.h>
	#include<graph.h>
	#include<memory.h>
	#include<string.h>
	#include<conio.h>
	#include<process.h>
	
	char buffer[3000];
	
	void main(void)
	{
	   memset(buffer,'A',3000);
	   buffer[2999]='\0';
	   printf("%d",strlen(buffer));
	   _settextrows(_MAXTEXTROWS);
	   _outtext((char far *)buffer);  // Looks good so far.
	
	   getch();
	   printf("%d",strlen(buffer));   // String still not corrupted.
	
	   getch();
	   _outtext((char far *)buffer);  // NULL inserted in buffer!
	   printf("%d",strlen(buffer));   // Notice smaller string length.
	}
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
