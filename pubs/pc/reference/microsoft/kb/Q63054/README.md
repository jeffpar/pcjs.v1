---
layout: page
title: "Q63054: Case Lost in Complex Switch Statement in C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q63054/
---

## Q63054: Case Lost in Complex Switch Statement in C 6.00

	Article: Q63054
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 25-JUL-1990
	
	Under certain circumstances, a case may be lost in a complex switch
	statement under default optimizations with Microsoft C version 6.00.
	
	The following code demonstrates the problem by losing track of case
	30. To work around the problem, disable optimizations or add /Os via
	the command-line switches or through the use of the optimize pragma.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	int cm_lockup( void ) ;
	
	int main( void )
	{
	   int j;
	
	   switch( 30 )
	   {
	      case 7:
	      case 43:
	          j = 1;
	
	      case 8:
	          ++j;
	
	      case 35:
	          ++j;
	
	      case 137:
	          break;
	
	      case 33:
	      case 39:
	          j = 3;
	          break;
	
	      case 30:           // this case is missed
	          j = 4;
	          break;
	
	      case 12:
	          j = 5;
	          break;
	
	      case 11:
	      case 32:
	          j = 6;
	          break;
	
	      case 10:
	          j = 7;
	          break;
	
	      case 2:
	          j = 8;
	          break;
	
	      case 37:
	          j = 9;
	          break;
	
	      case 6:
	          j = 10;
	          break;
	
	      case 13:
	          break;
	
	      case 44:
	          j = 11;
	          break;
	
	      case 41:
	          j = 12;
	          break;
	
	      case 42:
	          j = 13;
	          break;
	
	      default:
	          cm_lockup();
	          break;
	   }
	   return j;
	}
	
	int cm_lockup( )
	{
	   printf( "bad" );
	   return 1;
	}
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
