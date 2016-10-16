---
layout: page
title: PDP-11 Loaders
permalink: /devices/pdp11/loader/
---

PDP-11 Loaders
--------------

The blog post "[PDP-11 Paper Tape BASIC](http://avitech.com.au/?page_id=709)" describes the *Bootstrap Loader*,
a small program used to load the *Absolute Loader*, which in turn loads the *PDP-11 BASIC Paper Tape*. 
 
Here's what the *Bootstrap Loader* looks like:

	Location  Instruction
	 037744     016701
	 037746     000026
	 037750     012702
	 037752     000352
	 037754     005211
	 037756     105711
	 037760     100376
	 037762     116162
	 037764     000002
	 037766     037400
	 037770     005267
	 037772     177756
	 037774     000765
	 037776     177550

Using a [PDPjs](/modules/pdpjs/) machine such as the [PDP-11/20 Test Machine with Debugger](/devices/pdp11/machine/1120/test/debugger/),
the *Bootstrap Loader* is easily entered with a single Debugger "edit" command:

	e 037744 016701 000026 012702 000352 005211 105711 100376 116162 000002 037400 005267 177756 000765 177550

You can immediately disassemble the code using `u 037744 040000`:

	037744: 016701 000026          MOV   26(PC),R1              ; @037776
	037750: 012702 000352          MOV   #352,R2
	037754: 005211                 INC   @R1
	037756: 105711                 TSTB  @R1
	037760: 100376                 BPL   037756
	037762: 116162 000002 037400   MOVB  2(R1),37400(R2)
	037770: 005267 177756          INC   177756(PC)             ; @037752
	037774: 000765                 BR    037750
	037776: 177550                 .WORD 177550

I also pasted the disassembled code into a listing file, [bootstrap.lst](bootstrap.lst), and ran [FileDump](/modules/filedump)
to produce a [bootstrap.json](bootstrap.json) that can be pre-loaded into any machine:

	filedump --file=bootstrap.lst --format=octal --output=bootstrap.json

To run the *Bootstrap Loader*, set the PC to 037744 and start the machine: 

	r pc=037744
	g

