---
layout: page
title: "Q44109: How to Continue Long FIELD Statements; 255-Character Limit"
permalink: /pubs/pc/reference/microsoft/kb/Q44109/
---

## Q44109: How to Continue Long FIELD Statements; 255-Character Limit

	Article: Q44109
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 6-AUG-1990
	
	This article describes four different methods to make long FIELD
	statements easier to work with when writing programs that use random
	access files. Microsoft highly recommends the first technique. The
	four methods are the following:
	
	1. Instead of defining your file's record structure with the FIELD
	   statement, use a user-defined TYPE variable (defined with the
	   TYPE...END TYPE statement). This record variable can be
	   conveniently used as the third argument of the random file PUT and
	   GET statements.
	
	2. You can use consecutive FIELD statements with dummy string
	   placeholders to redefine further into the same file buffer, as
	   shown in Method 2 below. You can use this method to make long FIELD
	   statements readable without having to scroll to the right in the
	   QB.EXE editor. You can also put long string arrays in FIELD
	   statements by incremental definition in a FOR ... NEXT loop.
	
	3. You can FIELD the entire buffer as one string and extract pieces of
	   the string using the MID$ function. However, MID$ slows down the
	   program compared to Methods 1 and 2.
	
	4. A less desirable alternative is to use an editor other than
	   QB.EXE version 4.00, 4.00b, or 4.50 to avoid QuickBASIC's automatic
	   concatenation of lines that are continued with the underscore (_)
	   character, which your program may have used from QuickBASIC
	   versions earlier than 4.00.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	The maximum length for any statement in QB.EXE or BC.EXE is 255
	characters, including the text in lines concatenated with the
	underscore character. You can use Method 1, 2, or 3 to break up the
	FIELD statement if it physically exceeds 255 characters. (The RANDOM
	buffer size itself can be defined up to 32,767 bytes.)
	
	Method 1
	--------
	
	The easiest method is to do away with the FIELD statement altogether
	and use a TYPE/END TYPE variable as your record buffer:
	
	TYPE RecType
	       xname AS STRING * 30
	       xaddress AS STRING * 30
	       xcity AS STRING * 40
	       xstate AS STRING * 2
	       xzip AS STRING * 9
	       xmore AS STRING * 17
	END TYPE
	OPEN "File.DAT" FOR RANDOM AS #1 LEN = 128   ' OPEN existing file.
	Max = LOF(1) / 128   ' Max=Number of records in existing file.
	DIM label(Max) AS RecType
	FOR i = 1 TO Max
	   GET #1, i, label(i)
	   PRINT label(i).xname
	NEXT i
	
	Method 2
	--------
	
	You can break up the FIELD statement into more than one FIELD
	statement for the same file number, using a dummy placeholder string
	to account for the data previously fielded in that same file buffer:
	
	   FIELD #1, 30 AS xname$, 30 AS xaddress$, 40 AS xcity$
	   FIELD #1, 100 AS dummy1$, 2 AS xstate$, 9 AS xzip$
	   FIELD #1, 111 AS dummy2$, 17 as xmore$
	
	In this example, dummy1$ and dummy2$ are equivalenced (overlapped)
	with the total buffer defined to that point, allowing subsequent
	variables to be defined further into the buffer.
	
	Here is a trickier example, this time using a temporary placeholder
	string temp$ and FIELDing a string array within a FOR ... NEXT loop:
	
	OPEN "test.dat" FOR RANDOM AS #1 LEN = 300
	DIM F$(30)   ' This array will delimit the buffer in the FIELD statement.
	i = 1
	FOR j = 1 TO 10
	FIELD #1, (j - 1) * 30 AS temp$, 10 AS F$(i), 10 AS F$(i + 1), 10 AS F$(i + 2
	i = i + 3
	NEXT
	LSET F$(30) = "1234567890"
	LSET F$(15) = "ABCDEFGHIJ"
	PUT #1, 1
	CLOSE
	OPEN "test.dat" FOR RANDOM AS #1 LEN = 300
	i = 1
	FOR j = 1 TO 10
	FIELD #1, (j - 1) * 30 AS temp$, 10 AS F$(i), 10 AS F$(i + 1), 10 AS F$(i + 2
	i = i + 3
	NEXT
	GET #1, 1
	PRINT F$(30), F$(15)
	
	Method 3
	--------
	
	You can FIELD the entire buffer as one string and extract pieces of
	the string using the MID$ function:
	
	   OPEN "TEST" AS #1  'Assume data file TEST already has data in it.
	   FIELD #1, 512 AS buffer$   'fields entire buffer in one string
	   GET#1,2   ' Get record number 2 (written by some other program).
	   'Extract the 8-byte double precision number beginning at byte 500:
	   component1# = CVD(MID$(buffer$,500,8))
	   'Extract a long integer (4 bytes) beginning at byte 508:
	   component2& = CVL(MID$(buffer$,508,4))
	
	You could also write a function to extract the fields:
	
	   ' Below is a function to extract a long integer from buffer$.
	   ' FieldOffset% is the byte offset where the data starts.
	   ' Note that buffer$ doesn't have to be a fielded string, it
	   ' just has to be a minimum of FieldOffset% + 4 bytes long:
	   DEF FNL&(FieldOffset%) = CVL( MID$( buffer$, FieldOffset%, 4 ))
	   ' Example of using the function:
	   component2& = FNL&(508)
	
	Method 4
	--------
	
	The QB.EXE environment in QuickBASIC versions 4.00, 4.00b, and 4.50,
	and the QBX.EXE environment in Microsoft BASIC PDS versions 7.00 and
	7.10 strip out the underscore (_) line-continuation character, forcing
	you to scroll long lines horizontally to view and edit.
	
	If you want to preserve the underscore characters in your source code,
	you must use an editor other than QB.EXE 4.00, 4.00b, 4.50, or QBX.EXE
	7.00 or 7.10. For example, you can edit with the Microsoft Editor or
	Microsoft Word, and then compile the source code using BC.EXE from the
	DOS prompt (or from within the Microsoft Editor, M.EXE).
