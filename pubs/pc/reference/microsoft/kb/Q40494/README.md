---
layout: page
title: "Q40494: Watching Pointers in QuickC Debugger"
permalink: /pubs/pc/reference/microsoft/kb/Q40494/
---

## Q40494: Watching Pointers in QuickC Debugger

	Article: Q40494
	Version(s): 1.00 1.01 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 20-JAN-1989
	
	The QuickC debugger makes a distinction between pointers of type CHAR
	and all other types. The debugger will assume that any "char *"
	pointer will contain the address of a Null terminated string.
	
	The impact of this assumption can be seen when setting a WATCH VALUE
	on a specified pointer. If the pointer is declared as "char *", then
	the debugger displays the WATCH value as the string that is pointed to
	by the pointer. If the pointer is declared as any type other than
	"char *", then the WATCH value displays the address of the variable
	and not the value of the variable.
	
	The following code fragments illustrate this distinction:
	
	char *CHptr = "Faust liebt Gretchen" ;
	int  *INTptr= "Faust liebt Gretchen" ;
	
	A WATCH set on CHptr displays the following:
	
	   "Faust liebt Gretchen"
	
	A WATCH set on INTptr displays the address of the string and not the
	string itself:
	
	   'Faust liebt Gretchen'
	
	If you want to WATCH the string pointed to by INTptr, do the
	following:
	
	1. Pull down the DEBUG menu.
	
	2. Choose the WATCH VALUE selection.
	
	3. Type "(char *)INTptr".
	
	Casting INTptr to "char *" type displays the character string.
	
	If you want to WATCH the address of the string to which CHptr points,
	do the following:
	
	1. Pull down the DEBUG menu.
	
	2. Choose WATCH VALUE.
	
	3. Type "(int *)CHptr".
	
	Casting CHptr to a type other than "char *" (such as "int *")
	displays the address of the string to which CHptr points.
