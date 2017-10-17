---
layout: page
title: "Q66051: C 6.00 Optimization Pops Too Much Off Stack in Some Situations"
permalink: /pubs/pc/reference/microsoft/kb/Q66051/
---

## Q66051: C 6.00 Optimization Pops Too Much Off Stack in Some Situations

	Article: Q66051
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 24-OCT-1990
	
	In certain situations involving the passing of structures to a
	function, Microsoft C version 6.00's optimizations can cause too many
	bytes to be popped off the stack in preparation for the function call.
	In addition, the actual structure can be placed on the stack
	incorrectly. Currently, the only workaround is to compile without any
	optimizations.
	
	The following code demonstrates the problem. When compiled in Large or
	Compact model (/AL or /AC) with even default optimizations enabled,
	too many bytes are popped off the stack as is demonstrated by the
	extracts from the .COD files reproduced below.
	
	Microsoft has confirmed this to be a problem in Microsoft C version
	6.00. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	#include<stdio.h>
	
	#define EDGE 1
	typedef struct _point_
	   {
	      double x;
	      double y;
	   } _point;
	
	typedef struct _window_
	   {
	      _point min_scale;
	      _point max_scale;
	      struct _window_ *data_windows_list;
	      struct _window_ *current_data_window;
	      struct _window_ *next_window;
	   } _window;
	
	typedef struct _display_
	   {
	      _point min_scale;
	      _point max_scale;
	      _window *current_window;
	      _window *windows_list;
	   } _display;
	
	int d_edge_window (_display *display);
	int d_edge_window_1(_display *display);
	int d_rectangle(_display *display, _point corner_1,
	                _point corner_2,int fill);
	
	int d_rectangle(_display *display,_point corner_1,
	                       _point corner_2,int fill)
	{
	  printf("%lf %lf %lf %lf %lf %lf %d \n",
	             display->min_scale.x,display->min_scale,
	             corner_1.x,corner_1.y,corner_2.x,corner_2.y,fill);
	}
	
	void main(void)
	{
	   _window moo;
	   _display goo;
	
	   goo.min_scale.x=1.1;
	   goo.min_scale.y=2.2;
	   goo.max_scale.x=3.3;
	   goo.max_scale.y=4.4;
	   goo.current_window=&moo;
	   goo.windows_list=&moo;
	
	   moo.data_windows_list=&moo;
	   moo.current_data_window=&moo;
	   moo.next_window=&moo;
	   moo.min_scale.x=5.5;
	   moo.min_scale.y=6.6;
	   moo.max_scale.x=7.7;
	   moo.max_scale.y=8.8;
	
	   d_edge_window(&goo);
	   d_edge_window_1(&goo);
	}
	
	int d_edge_window(_display *display)
	{
	   d_rectangle(display,display->current_window->min_scale,
	                        display->current_window->max_scale,EDGE);
	   return 0;
	}
	
	int d_edge_window_1 (_display *display)
	{
	   d_rectangle(display,display->min_scale,display->max_scale,EDGE);
	   return 0;
	}
	
	Partial .COD Listing
	--------------------
	
	;   display = 6
	;|***   d_rectangle(display,display->current_window->min_scale,
	;|***               display->current_window->max_scale,EDGE);
	; Line 64
	    *** 000005  6a 01        push 1         ; push EDGE on stack
	    *** 000007  c4 5e 06     les  bx,DWORD PTR [bp+6]    ;display
	    *** 00000a  26 8b 47 20  mov  ax,WORD PTR es:[bx+32]
	    *** 00000e  26 8b 57 22  mov  dx,WORD PTR es:[bx+34]
	    *** 000012  8b c8        mov  cx,ax
	    *** 000014  8b f2        mov  si,dx
	    *** 000016  05 10 00     add  ax,16
	    *** 000019  8b f9        mov  di,cx
	    *** 00001b  83 ec 10     sub  sp,16 ; make room for max_scale
	    *** 00001e  57           push di
	    *** 00001f  56           push si
	    *** 000020  1e           push ds
	    *** 000021  8b f0        mov  si,ax
	    *** 000023  8b fc        mov  di,sp
	    *** 000025  83 c7 0c     add  di,12 ; should be add di,6
	    *** 000028  16           push ss
	    *** 000029  07           pop  es
	    *** 00002a  8e da        mov  ds,dx
	    ASSUME DS: NOTHING
	    *** 00002c  b9 08 00     mov  cx,8
	    *** 00002f  f3           rep
	    *** 000030  a5           movsw      ; copy max_scale to stack
	    *** 000031  1f           pop  ds
	    ASSUME DS: DGROUP
	    *** 000032  07           pop  es    ; es shouldn't be popped
	    *** 000033  5e           pop  si
	    *** 000034  5f           pop  di
	    *** 000035  83 ec 10     sub  sp,16 ; make room for min_scale
	    *** 000038  06           push es    ; rest has been thrown off
	    *** 000039  1e           push ds
	    *** 00003a  56           push si
	    *** 00003b  8b f7        mov  si,di
	    *** 00003d  8b fc        mov  di,sp
	    *** 00003f  83 c7 08     add  di,8
	    *** 000042  16           push ss
	    *** 000043  07           pop  es
	    *** 000044  1f           pop  ds
	    ASSUME DS: DGROUP
	    *** 000045  b9 08 00     mov  cx,8
	    *** 000048  f3           rep
	    *** 000049  a5           movsw
	    *** 00004a  1f           pop  ds
	    ASSUME DS: DGROUP
	    *** 00004b  07           pop  es
	    *** 00004c  06           push es
	    *** 00004d  53           push bx
	    *** 00004e  9a 00 00 00 00  call  FAR PTR _d_rectangle
	    *** 000053  83 c4 26     add  sp,38
	;|***   return 0;
