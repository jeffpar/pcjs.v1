---
layout: page
title: "Q28568: Example of TSR Program"
permalink: /pubs/pc/reference/microsoft/kb/Q28568/
---

	Article: Q28568
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | APPNOTE
	Last Modified: 20-MAY-1988
	
	The following article shows how to use Microsoft C to write a
	terminate-and-stay-resident (TSR) program. The article also
	illustrates the use of the following C run-time functions:
	
	   _dos_setvect
	   _dos_getvect
	   _dos_keep
	   _chain_intr
	   spawnXXX
	
	   The following example shows how to use Microsoft C to write a TSR
	program:
	
	/**************************************************************/
	/*                                                            */
	/*                            DirZap.h                        */
	/*                                                            */
	/*       This header file defines global variables, macros,   */
	/*       function pointers, and function prototypes           */
	/*       necessary for the DirZap.c program.                  */
	/*                                                            */
	/**************************************************************/
	
	/* Global Variable For Macro SHIFTL(x, n)*/
	long _ADDRESS;
	
	/* Macro Definitions */
	#define INT5  0x5
	#define INT21 0x21
	#define SHIFTL(x, n) (_ADDRESS = 0L, _ADDRESS = (long) x, _ADDRESS << n)
	#define HIBYTE(x) (((unsigned) (x) >> 8) & 0xff)
	#define REGPAK unsigned es, unsigned ds, unsigned di, unsigned si,\
	               unsigned bp, unsigned sp, unsigned bx, unsigned dx,\
	               unsigned cx, unsigned ax, unsigned ip,unsigned  cs,\
	               unsigned flags
	
	/* Function Pointers */
	void (interrupt far *save_dir_adr)();
	   /* Saves address of the original interrupt service routine */
	
	void (interrupt far *set_dir_adr)();
	  /* This function pointer gets set to the address of the new
	   interrupt service routine 'set_dir' */
	
	void (interrupt far *reset_dir_adr)();
	   /* This function pointer gets set to the address of the new
	   interrupt service routine 'reset_dir' */
	
	/* Function Declarations */
	void cdecl interrupt far set_dir(REGPAK);
	   /* This is the new service routine whichs zaps the directory
	   interrupt routines. */
	
	void interrupt far reset_dir(void);
	   /* This routine toggles between setting and disabling the
	   directory interrupt routines */
	
	unsigned _get_memsize(void);
	   /* This function gets the number of bytes to keep resident */
	
	short _set_shell(void);
	   /* Sets a DOS shell. */
	
	/**************************************************************/
	/*                                                            */
	/*                       DirZap.c                             */
	/*                                                            */
	/*        This is an illustration of a TSR program.           */
	/*     It traps and zaps the directory interrupts for         */
	/*     MkDir, RmDir, and ChDir. It also illustates how        */
	/*     to set a DOS shell by executing a new version of       */
	/*     COMMAND.COM.                                           */
	/*                                                            */
	/*     Copyright (c) Microsoft Corp 1988. All rights          */
	/*     reserved.                                              */
	/*                                                            */
	/*        To run, do the following:                           */
	/*                                                            */
	/*        1. EXEPACK DirZap to save memory.                   */
	/*        2. Type DirZap at DOS prompt. DirZap sets a         */
	/*        DOS shell and is not yet active.                    */
	/*        3. When "exit" is typed, DirZap is invoked.         */
	/*                                                            */
	/*        The PRINT SCREEN key now toggles                    */
	/*        DirZap on and off, but no memory has been           */
	/*        freed.                                              */
	/*                                                            */
	/**************************************************************/
	/*                                                            */
	/* NOTE:                                                      */
	/*                                                            */
	/* THIS PROGRAM, ITS USE, OPERATION, AND SUPPORT ARE PROVIDED */
	/* "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR  */
	/* IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED        */
	/* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR */
	/* PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE */
	/* OF THIS PROGRAM IS WITH THE USER. IN NO EVENT SHALL        */
	/* MICROSOFT BE LIABLE FOR ANY DAMAGES INCLUDING, WITHOUT     */
	/* LIMITATION, ANY LOST PROFITS, LOST SAVINGS OR OTHER        */
	/* INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING FROM THE USE   */
	/* OR INABILITY TO USE SUCH PROGRAM, EVEN IF MICROSOFT HAS    */
	/* BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES OR FOR ANY */
	/* CLAIM BY ANY OTHER PARTY.                                  */
	/*                                                            */
	/**************************************************************/
	#include <dos.h>
	#include <stdio.h>
	#include <stdlib.h>
	#include <process.h>
	#include <dirzap.h>
	
	extern unsigned _psp;
	   /* Pre-defined varible, _psp = segment address of PSP */
	unsigned far *psp_pointer;
	   /* Used to retrieve the memsize to stay resident */
	short hot_key=1;
	   /* Flag to toggle DirZap on and off once it is invoked */
	
	void main(void);
	void main()
	{
	   if (_set_shell())
	   {
	      /* Set trap for directory interrupts */
	      save_dir_adr = _dos_getvect(INT21);
	         /* Save original routine address */
	      set_dir_adr = set_dir;
	         /* Get address of new (user defined) routine  */
	      _dos_setvect(INT21, set_dir_adr);
	         /* Revector to new service routine */
	
	      /* Set trap for PRINT SCREEN interrupt */
	      reset_dir_adr = reset_dir;
	         /* Get address of new routine */
	      _dos_setvect(INT5, reset_dir_adr);
	         /* Revector to new routine */
	
	      /* Blast off into memory and reside until
	      power down or CTRL-ALT-DEL */
	
	      _dos_keep(0, _get_memsize());
	   }
	   else
	      puts("problems running DirZap.exe, COMSPEC not found!");
	}
	
	void cdecl interrupt far set_dir(REGPAK)
	{
	
	/*
	   Trap directory interrupts MkDir, RmDir, and ChDir and zap the
	string entered by the user. DS:DX points to the string, so change it
	to a string of length 0. WARNING: When compiled at high warning
	levels, several warnings are generated. This is because several
	elements of REGPAK are not referenced. These warnings should be
	ignored.
	*/
	   if (HIBYTE(ax) == 0x39 || HIBYTE(ax) == 0x3A || HIBYTE(ax) == 0x3B)
	      dx=0;
	   _chain_intr(save_dir_adr);
	}
	
	void interrupt far reset_dir()
	{
	   if (hot_key)
	   {
	      hot_key=0;
	      _dos_setvect(INT21, save_dir_adr); /* Reset initial vector */
	
	      }
	   else
	   {
	      hot_key=1;
	      _dos_setvect(INT21, set_dir_adr); /* Install DirZap again */
	      _chain_intr(set_dir_adr); /* Chain to the Zapper function */
	   }
	}
	
	unsigned _get_memsize()
	{
	   psp_pointer = (int far *) SHIFTL(_psp, 16); /* Get segment of the PSP*/
	   return(psp_pointer[1] - _psp); /* Amount of memory to stay resident */
	}
	
	short _set_shell()
	{
	   char *_COMSPEC_;
	
	   _COMSPEC_ = getenv("COMSPEC"); /* Get value of COMSPEC */
	   if (_COMSPEC_) /* If not equal to NULL */
	   {
	      puts("type 'EXIT' to invoke DirZapper...");
	      spawnlp(P_WAIT, _COMSPEC_, NULL); /* Invoke Command.com */
	      return(1);
	   }
	   return(0);
	}
