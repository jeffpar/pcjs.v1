---
layout: page
title: "Q58042: QCARDS Demo Program Incorrectly Searches for Zip Code"
permalink: /pubs/pc/reference/microsoft/kb/Q58042/
---

## Q58042: QCARDS Demo Program Incorrectly Searches for Zip Code

	Article: Q58042
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900118-77 buglist4.50
	Last Modified: 31-JAN-1990
	
	The QCARDS.BAS demo program shipped with Microsoft QuickBASIC Version
	4.50 does not search correctly for zip codes. When searching for only
	a zip code, all cards will match; when searching for zip code and some
	other field, no cards are found.
	
	To correct this problem, change the following lines from near the end
	of the FindCard FUNCTION in QCARDS.BAS as indicated:
	
	        ' Test zip code.
	        SELECT CASE TmpCard.Zip   '**** change to RTRIM$(UCASE$(...))
	            CASE "", RTRIM$(UCASE$(Index(Card).Zip))
	                Found = Found + 1
	            CASE ELSE
	        END SELECT
	
	     ' If match is found, set function value and quit, else next card.
	        IF Found = NFIELDS - 1 THEN  '**** remove "- 1" after NFIELDS
	            FindCard% = Card
	            EXIT FUNCTION
	        END IF
	
	The altered code is as follows:
	
	        ' Test zip code.
	        SELECT CASE RTRIM$(UCASE$(TmpCard.Zip))      '****
	            CASE "", RTRIM$(UCASE$(Index(Card).Zip))
	                Found = Found + 1
	            CASE ELSE
	        END SELECT
	
	     ' If match is found, set function value and quit, else next card.
	        IF Found = NFIELDS THEN                      '****
	            FindCard% = Card
	            EXIT FUNCTION
	        END IF
