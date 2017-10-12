---
layout: page
title: "Q51746: Locals Can Be Viewed Only When Compiling with CodeView Info"
permalink: /pubs/pc/reference/microsoft/kb/Q51746/
---

	Article: Q51746
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm
	Last Modified: 14-MAR-1990
	
	For debugging purposes, Microsoft QuickC Versions 2.00 and 2.01 allow
	you to open a watch window that displays all the local variables
	currently in scope by selecting the View.Windows.Locals menu options.
	The information in this window is generated from CodeView debugging
	information. Therefore, you must compile and link with the CodeView
	flag set in the "Debug Flags" sections of both the
	Options.Make.Compiler Flags menu and the Options.Make.Linker Flags
	menu to be able to see the local variable information.
	
	The locals window is accessible only if you have set the Full Menus
	option on the Options menu. To see how CodeView information affects
	the locals window, compile the following program after turning
	CodeView information off in the Options.Make.Compiler Flags menu. Open
	the locals window, then press F8 to begin tracing into the main
	procedure and note that no locals are viewable. Recompile after
	turning CodeView information on, and locals will then be available.
	This is expected behavior for Microsoft QuickC.
	
	Code Example
	------------
	
	#include<stdio.h>
	
	void main( void )
	{
	   int   test1=5;
	   float test2=3.6;
	
	   printf( "This is a test...\n" );
	}
