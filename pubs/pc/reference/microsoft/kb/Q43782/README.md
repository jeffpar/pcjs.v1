---
layout: page
title: "Q43782: QB Versus C, Benchmark Time Comparison for Recursive Program"
permalink: /pubs/pc/reference/microsoft/kb/Q43782/
---

## Q43782: QB Versus C, Benchmark Time Comparison for Recursive Program

	Article: Q43782
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890210-55
	Last Modified: 14-DEC-1989
	
	The Towers of Hanoi is a problem that can be programmatically solved
	through the use of recursion. Listed below are the recursive
	implementations in QuickBASIC Version 4.50 and Microsoft C Version
	5.10. When compiled with the compiler option giving the greatest speed
	(BC /O stand-alone option), the QuickBASIC .EXE routine was roughly
	40 percent slower than the C routine. No coprocessor was used, since
	the program uses all integers and no floating-point calculations.
	
	This benchmark comparison for QuickBASIC 4.50 is similar for Microsoft
	QuickBASIC Versions 4.00 and 4.00b, for Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and for Microsoft
	BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	The table below shows the execution speeds (in seconds) of the
	recursive routine in both QuickBASIC Version 4.50 and Microsoft C
	Version 5.10. The benchmark was performed on a Wyse 286, running
	MS-DOS 3.30, operating at 10 megahertz. As you can see in the
	following timings (based on the number of disks on the Hanoi Towers),
	the QuickBASIC routine was roughly 40 percent slower than the C
	routine:
	
	   Number of Disks       QuickBASIC 4.50      C 5.10
	
	          1                  0.0000           0.0000
	          2                  0.0000           0.0000
	          3                  0.0000           0.0000
	          4                  0.0000           0.0000
	          5                  0.0000           0.0000
	          6                  0.0000           0.0000
	          7                  0.0000           0.0000
	          8                  0.0125           0.0000
	          9                  0.0368           0.0000
	         10                  0.0624           0.0000
	         11                  0.1093           0.0000
	         12                  0.1601           0.0802
	         13                  0.3789           0.1739
	         14                  0.8203           0.3674
	         15                  1.5898           0.7812
	         16                  3.1911           1.7310
	         17                  6.4296           3.8761
	         18                  12.796           7.2687
	         19                  25.539           15.234
	         20                  51.132           31.021
	
	Code Example
	
	REM ** QuickBASIC program:
	REM Compile as follows:  BC HANOI.BAS/O;
	REM Link as follows:     LINK HANOI.OBJ;
	DEFINT A-Z
	DECLARE SUB HANOI(DISKS,TOWERA(),TOWERB(),TOWERC())
	CLEAR ,, 4096
	DIM TOWERA(2)
	DIM TOWERB(2)
	DIM TOWERC(2)
	PRINT
	PRINT"                   RECURSIVE TOWERS OF HANOI"
	DO
	INPUT "NUMBER OF DISKS? ", DISKS
	PRINT
	     IF DISKS<>0 THEN
	          TOWERA(0)=1
	          TOWERB(0)=2
	          TOWERC(0)=3
	          PRINT
	          CALL HANOI(DISKS,TOWERA(),TOWERB(),TOWERC())
	     END IF
	LOOP UNTIL DISKS=0
	END
	
	FUNCTION WHICHTOWER$(TOWER%)
	  SELECT CASE TOWER%
	     CASE 1:     WHICHTOWER$=" A "
	     CASE 2:     WHICHTOWER$=" B "
	     CASE 3:     WHICHTOWER$=" C "
	  END SELECT
	END FUNCTION
	
	SUB HANOI (DISKS,TOWERA(),TOWERB(),TOWERC())
	     IF DISKS=1 THEN
	          DESTINATION$=WHICHTOWER$(BYVAL TOWERC(0))
	          SOURCE$=WHICHTOWER$(BYVAL TOWERA(0))
	          PRINT "MOVED DISK FROM"; SOURCE$;"TO";DESTINATION$
	     ELSE
	           CALL HANOI(DISKS-1,TOWERA(),TOWERC(),TOWERB())
	          DESTINATION$=WHICHTOWER$(BYVAL TOWERC(0))
	          SOURCE$=WHICHTOWER$(BYVAL TOWERA(0))
	          PRINT "MOVED DISK FROM"; SOURCE$;"TO";DESTINATION$
	          CALL HANOI(DISKS-1,TOWERB(),TOWERA(),TOWERC())
	     END IF
	END SUB
	
	#include <time.h>
	#include <stdio.h>
	char *source=" Z  ",*destination=" Z  ";
	
	void hanoi(disks,TowerA,TowerB,TowerC)
	int disks;
	int TowerA,TowerB,TowerC;
	{
	    extern char *source,*destination;
	
	    if (disks == 1)
	     {
	       switch (TowerA)
	        {
	         case 1 :
	             source=" A \0";
	             break;
	      case 2 :
	             source=" B \0";
	             break;
	      case 3 :
	             source=" C \0";
	             break;
	        }
	       switch (TowerC)
	     {
	      case 1 :
	             destination=" A \0";
	             break;
	      case 2 :
	             destination=" B \0";
	             break;
	      case 3 :
	             destination=" C \0";
	             break;
	        }
	      /*printf("\nMOVED DISK FROM %s to %s",source,destination);*/
	     }
	   else
	     {
	      hanoi(disks-1,TowerA,TowerC,TowerB);
	       switch (TowerA)
	        {
	         case 1 :
	             source=" A \0";
	             break;
	      case 2 :
	             source=" B \0";
	             break;
	      case 3 :
	             source=" C \0";
	             break;
	        }
	       switch (TowerC)
	     {
	      case 1 :
	             destination=" A \0";
	             break;
	      case 2 :
	             destination=" B \0";
	             break;
	      case 3 :
	             destination=" C \0";
	             break;
	        }
	       /*printf("\nMOVED DISK FROM %s to %s",source,destination);*/
	    hanoi(disks-1,TowerB,TowerA,TowerC);
	    }
	}
	
	main ()
	{
	   int           TowerA=1,TowerB=2,TowerC=3,disks,thatone;
	   long       start=01,finish=01;
	   clock_t     clock(void);
	   float       amnttime;
	
	   printf("number of disks? ");
	   scanf("%d",&disks);
	   while (disks!=0)
	   {
	     start=(long)clock();
	     hanoi(disks,TowerA,TowerB,TowerC);
	     finish=(long)clock();
	     amnttime=(float)((finish-start)/(float)CLK_TCK);
	     printf("\nPROGRAM TOOK %04.04f", amnttime);
	     printf(" SECONDS WITH %d DISKS",disks);
	     printf("\nnumber of disks? ");
	     scanf("%d",&disks);
	   }
	  fcloseall();
	
	}
