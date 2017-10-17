---
layout: page
title: "Q41154: Towers of Hanoi: QuickBASIC 4.50 Recursive SUBprogram Example"
permalink: /pubs/pc/reference/microsoft/kb/Q41154/
---

## Q41154: Towers of Hanoi: QuickBASIC 4.50 Recursive SUBprogram Example

	Article: Q41154
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890210-54
	Last Modified: 14-DEC-1989
	
	The Towers of Hanoi is a classic computer problem that has been used
	to demonstrate the usefulness and ease of use of recursion. The
	following example program shows how this problem can be solved with
	recursion in QuickBASIC Versions 4.00, 4.00b, and 4.50 for MS-DOS,
	Microsoft BASIC Compiler Versions 6.00 or 6.00b for MS-DOS and MS
	OS/2, or  Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	QuickBASIC versions earlier than Version 4.00 do not support
	recursion.
	
	The information below demonstrates the Towers of Hanoi problem.
	
	If you have three towers (labeled A, B, and C, respectively) of equal
	height, and you have "n" number of disks on Tower A, move the "n"
	disks from Tower A to Tower C in the shortest number of moves.
	
	Additional rules are as follows:
	
	1. A larger disk cannot be placed on top of a smaller disk.
	
	2. Only one disk can be moved at a time.
	
	3. For each move, a disk must have one of the towers as a destination.
	
	You will find through inductive proof that the shortest number of
	moves required will be 2 raised to the n-1 power. The order of this
	algorithm (best case) is O(2^n).
	
	You will also notice that the only thing being kept track of on the
	three towers is what is on top of each tower. The recursion of the
	program handles the pushing and popping of the stack. Some
	implementations of the Towers of Hanoi use a stack to keep track of
	what is on each tower.
	
	The following is a code example:
	
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
	        CASE 1: WHICHTOWER$=" A "
	        CASE 2: WHICHTOWER$=" B "
	        CASE 3: WHICHTOWER$=" C "
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
