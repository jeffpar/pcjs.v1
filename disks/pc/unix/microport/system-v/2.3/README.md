Debugging Notes
---

The boot sector contains the following code:

0000:7C3E B003            MOV      AL,03
0000:7C40 B200            MOV      DL,00
0000:7C42 B417            MOV      AH,17
0000:7C44 CD13            INT      13
0000:7C46 72B8            JC       7C00

For BIOSes that don't support INT 0x13, AH function 0x17, patch the JC with two NOPs; eg:

	e 0:7c46 90 90

After booting, the following code is executed:

12E8:01D3 52              PUSH     DX                   ;history=5
12E8:01D4 51              PUSH     CX                   ;history=4
12E8:01D5 2BC9            SUB      CX,CX                ;history=3
12E8:01D7 BA6400          MOV      DX,0064              ;history=2
12E8:01DA ED              IN       AX,DX                ;history=1

For virtual machines that don't support word I/O to port 0x64, patch IN AX,DX with IN AL,DX; eg:

	e 12e8:1da ec

Here's where the first task switch (far jump using a TSS selector) occurs:

	AX=02F0 BX=0008 CX=0000 DX=0000 SP=037E BP=037E SI=1852 DI=0000 
    SS=0044[001800,07FF] DS=0228[009E00,851B] ES=0220[001000,8DFB] A20=ON 
    CS=0200[012320,FFFD] LD=02E0[002000,01FF] GD=[001006,072F] ID=[0053E2,07FF] 
    TR=02D0 MS=FFF5 PS=0016 V0 D0 I0 T0 S0 Z0 A1 P1 C0 
    0200:016D FF6E06          JMP      FAR [BP+06]

The far address at [BP+6] is 02F0:0000.
