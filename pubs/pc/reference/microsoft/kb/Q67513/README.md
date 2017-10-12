---
layout: page
title: "Q67513: Comments in .COD Listing Are Wrong When Using _fastcall"
permalink: /pubs/pc/reference/microsoft/kb/Q67513/
---

	Article: Q67513
	Product: Microsoft C
	Version(s): 6.00a  | 6.00a
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00a fastcall
	Last Modified: 30-JAN-1991
	
	When using the code below with the _fastcall keyword, and compiling
	with the /Fc option for a code listing, the listing generates correct
	code but incorrectly comments the values that are being pushed.
	
	Using the /Gs (recommended for using _fastcall) and /Fc compile-line
	options will generate a code listing that produces wrong comments for
	the following statements:
	
	   mov ch, byte ptr top
	   mov cl, byte ptr left
	   mov dh, byte ptr bot
	
	The code listing below shows the incorrect comments that are
	generated:
	
	;|***                   mov al, byte ptr lines
	; Line 13
	        *** 000018   8a 46 06   mov     al,BYTE PTR [bp+6] ;lines
	;|***                   mov bh, byte ptr attr
	; Line 14
	        *** 00001b   8a 7e fe   mov     bh,BYTE PTR [bp-2] ;attr
	;|***                   mov ch, byte ptr top
	; Line 15
	        *** 00001e   8a 6e fe   mov     ch,BYTE PTR [bp-8]
	;|***                   mov cl, byte ptr left
	; Line 16
	        *** 000021   8a 4e fa   mov     cl,BYTE PTR [bp-6] ;top
	;|***                   mov dh, byte ptr bot
	; Line 17
	        *** 000024   8a 76 fc   mov     dh,BYTE PTR [bp-4] ;left
	;|***                   mov dl, byte ptr right
	; Line 18
	        *** 000027   8a 56 08   mov     dl,BYTE PTR [bp+8] ;right
	
	Notice that the comments after the ch, cl, dh mov statements are not
	the same variable names that were actually moved into these registers.
	For instance, the statement
	
	    mov ch, byte ptr top
	
	has no comment after it stating what variable was used. However, the
	statement
	
	    mov cl, byte ptr left
	
	has a comment of ";top" stating that top was moved in. Obviously,
	"top" was moved into the ch register in the previous statement.
	
	Note: The generated code in this listing, as well as in the OBJ, is
	correct.
	
	Sample Code
	-----------
	
	static void _fastcall scr_scroll
	          (int top, int left, int bot, int right, int lines, int dir)
	{
	        char attr = 7;
	
	        _asm
	                {
	                        mov ah, byte ptr dir
	                        or  ah, ah
	                        mov ah, 7
	                        jnz around
	                        dec ah
	                around:
	                        mov al, byte ptr lines
	                        mov bh, byte ptr attr
	                        mov ch, byte ptr top
	                        mov cl, byte ptr left
	                        mov dh, byte ptr bot
	                        mov dl, byte ptr right
	                        int 0x10
	                }
	}
	
	void main(void)
	{
	        int t=0,l=0,b=0,r=0,li=0,d=0;
	        scr_scroll(t,l,b,r,li,d);
	}
	
	Microsoft has confirmed this to be a problem in the C version 6.00a.
	We are researching this problem and will post new information here as
	it becomes available.
