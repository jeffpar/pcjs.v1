---
layout: page
title: "Q32271: Passing Element of FIELDed Array to Subprogram UnFIELDs Array"
permalink: /pubs/pc/reference/microsoft/kb/Q32271/
---

## Q32271: Passing Element of FIELDed Array to Subprogram UnFIELDs Array

	Article: Q32271
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 20-AUG-1990
	
	The following information applies to QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	Passing an element of a FIELDed array to a subprogram unFIELDs the
	array, preventing the array from accessing the random file buffer.
	
	QuickBASIC Versions 3.00 and earlier do not unFIELD the array and
	allow you to access the random file buffer.
	
	The program below works without modification in QuickBASIC Versions
	3.00 and earlier. The program needs to be modified (to pass the array
	elements by value or by a temporary variable) in QuickBASIC Versions
	4.00 and later because arrays are handled differently.
	
	For QuickBASIC Versions 4.00 and later, when an array element is
	passed to a subprogram or function, the array element is copied to a
	temporary variable and passed to the subprogram. Upon returning from
	the subprogram, the temporary variable value is assigned to the array
	element. This process is performed in case the array moves during the
	execution of the subprogram or function; it also "unFIELDs" the array.
	
	Please note that in all versions of BASIC, FIELDed variables are
	"special" and have limited use. For example, you are not allowed to
	say INPUT B$, where B$ is a FIELDed variable. You also cannot say
	B$="test" and must instead say LSET B$="test" or RSET B$="test".
	
	This change in how the arrays are handled may affect any program that
	uses FIELDed arrays, including those applications that use Btrieve (a
	file-management system developed by SoftCraft, Inc.; Btrieve was later
	taken over by Novell, Inc.).
	
	The easiest workaround is to pass a temporary variable instead of an
	array element in the CALL statement.
	
	Another workaround for this problem is to put parentheses around the
	variable being passed in the CALL statement, thus causing it to be
	passed by value rather than by reference. An array passed by value is
	not unFIELDed. For example, the Code Example farther below could be
	changed as follows:
	
	   CALL TEST((a$(i)))
	
	However, a disadvantage of passing by value is that if variables are
	large (such as a large string length), they could consume stack space
	quickly, possible leading to "Out of Stack Space" or "Out of Memory".
	
	The following code example demonstrates the unFIELDing of the array
	A$().
	
	    DIM A$(2)
	    OPEN "TEST.DAT" AS #1
	    FIELD #1, 10 AS A$(0), 10 AS A$(1), 10 AS A$(2)
	    K = 65
	    FOR J = 1 to 2
	       FOR I = 0 TO 2
	        LSET A$(I)=STRING$(10,K)
	        K = K + 1
	       NEXT I
	       PUT#1, j
	    NEXT J
	    CLOSE #1
	
	    OPEN "TEST.DAT" AS #1
	    FIELD #1, 10 AS A$(0), 10 AS A$(1), 10 AS A$(2)
	    FOR J = 1 to 2
	      GET#1, J
	      FOR I = 0 to 2
	          CALL TEST(a$(i))
	      NEXT I
	      print
	    NEXT J
	    END
	
	    SUB TEST(b$) STATIC
	      PRINT b$
	    END SUB
	
	The output is as follows:
	
	   AAAAAAAA
	   BBBBBBBB
	   CCCCCCCC
	
	   AAAAAAAA
	   BBBBBBBB
	   CCCCCCCC
	
	As a workaround, the following modification can be made to the program
	to receive the desired output:
	
	   GET#1, J
	   FOR I = 0 to 2
	       temp$=a$(i)
	       CALL TEST(temp$)
	       LSET a$(i)=temp$
	   NEXT I
	
	The correct output is as follows:
	
	   AAAAAAAA
	   BBBBBBBB
	   CCCCCCCC
	
	   DDDDDDDD
	   EEEEEEEE
	   FFFFFFFF
