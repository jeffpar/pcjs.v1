---
layout: page
title: "Q28613: Object Module Format Extensions"
permalink: /pubs/pc/reference/microsoft/kb/Q28613/
---

## Q28613: Object Module Format Extensions

	Article: Q28613
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 17-NOV-1988
	
	The following are Microsoft extensions to the Intel object module
	format that were incorporated in Versions 5.00 and 5.10 of the C
	compiler. For a complete description of the object module format, you
	can contact Microsoft System Languages Technical Support at (206)
	454-2030 and request the Object Module Format Application Note.
	
	Microsoft OMF Extensions
	
	Local Symbols (C 5.00) -- B4h, B6h, B7h, B8h
	
	There will be three new record types to handle local symbols:
	
	1. LEXTDEF = 0xb4 (180)
	   Format is identical to EXTDEF.
	
	2. LPUBDEF = 0xb6 (182) or 0xb7 (183)
	   Format is identical to PUBDEF.
	
	3. LCOMDEF = 0xb8 (184)
	   Format is identical to COMDEF.
	
	LEXTDEF, LPUBDEF, and LCOMDEF are to be used exactly as EXTDEF,
	PUBDEF, and COMDEF, except that the symbols are not visible outside
	the module where they are defined--for example, C statics.
	
	New OMF Comment -- Class A1h
	
	A comment record with class A1h indicates that the obsolete method of
	communal representation through TYPDEF and EXTDEF pairs is not used,
	and that COMDEF records can be interpreted. The meaning of this record
	is undergoing revision.
	
	IMPDEF (OS2, Windows) -- Comment Class A0h, Subtype 1
	
	The IMPort DEFinition (IMPDEF) record takes the form of a COMENT
	record with class 0xa0:
	
	    DB      88h         ; COMENT
	    DW      reclen      ; record length
	    DB      00h         ; for Intel compatibility
	    DB      A0h         ; class: OMF extension
	    DB      01h         ; subtype: IMPDEF
	    DB      fOrd        ; nonzero value means import by ordinal
	    ; Internal Name
	    DB      n           ; length of name
	    DB      n dup(?)    ; ASCII text of name
	    ; Module Name
	    DB      n           ; length of name
	    DB      n dup(?)    ; ASCII text of name
	IF import by name (fOrd == 0)
	    ;   Imported Name:  if length byte is 0 then imported name is
	    ;   identical to internal name.
	    ;
	    DB      n           ; length of name
	    DB      n dup(?)    ; ASCII text of name
	ELSE
	    DW      ordno       ; ordinal number
	ENDIF
	
	    DB      checksum
	
	EXPDEF (C 5.10) -- Comment Class A0h, Subtype 2
	
	The EXPort DEFinition record takes the form of a COMENT record with
	class 0xa0:
	
	    DB      88h         ; COMENT
	    DW      reclen      ; record length
	    DB      00h         ; for Intel compatibility
	    DB      A0h         ; class: OMF extension
	    DB      02h         ; extension type:  EXPDEF
	    DB      flags
	        ;   80h = set if ordinal number specified
	        ;   40h = set if RESIDENTNAME
	        ;   20h = set if NODATA
	        ;   1Fh = # of parameter words
	
	    ; Exported name:
	    DB      n           ; length of name
	    DB      n dup(?)    ; ASCII text of name
	
	    ; IF internal name different from exported name:
	    DB      n           ; length of name
	    DB      n dup(?)    ; ASCII text of name
	    ; ELSE internal name same as exported name:
	    DB      00h
	
	    ; IF ordinal number specified
	    DW      ordno       ; ordinal number
	
	    DB      checksum
	
	LIBMOD Comment Record -- Class A3h (LIB 3.07 in MASM 5.00)
	
	    DB      88h             ; COMENT
	    DW      reclen          ; record length
	    DB      00h             ; for Intel compatibility
	    DB      A3h             ; class: LIBrary MODule name
	    DB      N               ; length of module name
	    DB      N dup(?)        ; ASCII text of module name
	    DB      checksum
	
	The LIBMOD comment record identifies the name of a library module.
	This record allows LIB to preserve the source file name in the THEADR
	record and still identify the module name. Since the module name is
	the base name of the .OBJ file, the two names may be completely
	different.
	
	LIB adds a LIBMOD record when an .OBJ file is added to a library and
	strips the LIBMOD record when an .OBJ file is removed from a library,
	so this record usually only exists in .LIB files.
