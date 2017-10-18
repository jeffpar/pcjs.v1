---
layout: page
title: "Q34470: MASM 5.10 MACRO.DOC: File Control"
permalink: /pubs/pc/reference/microsoft/kb/Q34470/
---

## Q34470: MASM 5.10 MACRO.DOC: File Control

	Article: Q34470
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information was taken from the MASM 5.10 MACRO.DOC
	file.
	
	FILE CONTROL
	
	@MakeFil (3Ch, 5Ah, 5Bh)
	
	Creates a file
	
	Syntax:         @MakeFil &path [,[attrib] [,[segment] [,#kind]]]
	
	Arguments:      path        = ASCIIZ string of file
	                attrib      = File atrribute (0 is default if none
	                              given)
	                segment     = Segment of address string (DS if not
	                              given)
	                kind        = If none given, a file is always
	                              created even if one already exists. Under
	                              DOS 3+ "tmp" can be given to create a
	                              unique file or "new" to create file only
	                              if one doesn't already exist.
	Return:         If carrry clear, file handle in AX
	Registers used: Always AX, DX, and CX; DS if segment changed
	
	@OpenFil (3Dh)
	
	Opens a file for input or output
	
	Syntax:         @OpenFil &path, #access [,segment]
	
	Arguments:      path        = ASCIIZ string of file
	                access      = File access code
	                segment     = Segment of address string (DS if not
	given)
	Return:         If carrry set, error code in AX
	Registers used: Always AX and DX; DS if segment changed
	
	@ClosFil (3Eh)
	
	Closes an open file handle
	
	Syntax:         @ClosFil handle
	
	Arguments:      handle      = Previously opened file handle
	Return:         If carrry set, error code in AX
	Registers used: AX and BX
	
	@DelFil (41h)
	
	Deletes a specified file
	
	Syntax:         @DelFil &path [,segment]
	
	Arguments:      path        = Offset of ASCIIZ filespec
	                segment     = Segment of path (DS if none given)
	Return:         If carrry set, error code in AX
	Registers used: AX and DX; DS if segment changed
	
	@MoveFil (56h)
	
	Moves or renames a file by changing its path specification.
	
	Syntax:         @MoveFil &old, &new [,[segold] [,segnew]]
	
	Arguments:      old         = Offset of file spec to be renamed
	                new         = Offset of new file spec
	                segold      = Segment of old name (DS if none given)
	                segnew      = Segment of new name (ES if none given)
	Return:         If carry set, error code in AX
	Registers used: AX, DX, and DI; DS and ES if corresponding
	segments changed
	
	@GetFirst (4Eh) and @GetNext (4Fh)
	
	Parses file specifications (optionally including wild cards)
	into file names
	
	Syntax:         @GetFirst &path [,[attribute] [,segment]]
	                @GetNext
	
	Arguments:      path        = Offset of ASCIIZ filespec (can
	                              have wild cards)
	                attribute   = File attribute to search for (0 for
	                              normal if none given)
	                segment     = Segment of path (DS if none given)
	Return:         If carrry set, error code in AX
	Registers used: @GetFirst   = AX, CX, and DX; DS if segment
	changed
	                @GetNext    = AX only
	
	@GetDTA (1Ah) and @SetDTA (2Fh)
	
	Gets or sets the Disk Transfer Address (DTA)
	
	Syntax:         @GetDTA
	                @SetDTA &buffer [,segment]
	
	Arguments:      buffer      = Offset of new DTA buffer
	                segment     = Segment of new DTA buffer (DS if none
	given)
	Return:         @GetDTA     = ES:BX points to DTA
	                @SetDTA     = None
	Registers used: AX for both; DS and DX for @SetDTA; ES and
	BX for @GetDTA
	
	@GetFilSz (42h)
	
	Gets the file size by moving the file pointer to end of the
	file. Note that the file pointer is reset to zero. Thus this macro
	should not be called during operations that move the pointer.
	
	Syntax:         @GetFilSz handle
	
	Arguments:      handle      = Previously opened file handle
	Return:         If carrry clear, file length in DX:AX
	Registers used: AX, BX, CX, and DX
	
	@MovePrtAbs and @MovePtrRel (42h)
	
	Moves the file pointer in an open file. The pointer can be
	moved to an absolute position, or relative to its current position.
	
	Syntax:         @MovePrtAbs handle [,distance]
	                @MovePrtRel handle [,distance]
	
	Arguments:      handle      = Previously opened file handle
	                distance    = Distance to move pointer - must be a
	                              16-bit constant or a 16- or 32-bit variable;
	                              or leave blank and set distance in CX:DX
	                              before macro call
	Return:         If carrry clear, file pointer position in DX:AX
	Registers used: AX, BX, CX, and DX
