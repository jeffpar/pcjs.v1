/* CPQPATCH 1.0 by John Elliott.
 *
 * Patches the BIOS ROM of the Compaq Portable (revision C) to support 
 * booting from a hard drive.
 *
 * This program is public domain.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

unsigned char rom[8192];

#ifdef __PACIFIC__
#define AV0 "CPQPATCH"
#define EXIT_FAILURE -1
#define EXIT_SUCCESS 0
#else
#define AV0 argv[0]
#endif

/* First patch: New INT19 vector */
static unsigned char p0[] = { 0x20, 0xf8 };	/* DW	0xF820 */

/* Second patch: Convert old INT19 into a subroutine */
static unsigned char p1[] = { 	/* Enter with DH = 0 DL = drive              */
	0xbb, 0x40, 0x00,	/* P1:	MOV	BX, 0x40 	;BIOS dseg   */
	0x8E, 0xDB,		/* 	MOV	DS, BX 			     */
	0xB9, 0x03, 0x00,	/* 	MOV	CX, 0x0003	;Try 3 times */
	0x51,			/* TRY:	PUSH	CX 		;Save count  */
	0x52,			/*	PUSH	DX 		;Save drive  */
	0xBB, 0x00, 0x00,	/*	MOV	BX, 0x0000 	;Load to     */
	0x8E, 0xC3,		/*	MOV	ES, BX 		;segment 0   */
	0xB4, 0x00,		/*	MOV	AH, 0x00 	;Reset FDC   */
	0xCD, 0x13,		/*	INT	0x13 		;BIOS disk   */
	0x5A,			/*	POP	DX 		;Get drive   */
	0x52,			/*	PUSH	DX 		;Save again  */
	0xBB, 0x00, 0x7C,	/*	MOV	BX, 0x7C00 	;Load addr   */
	0xB9, 0x01, 0x00,	/*	MOV	CX, 0x0001 	;Cyl 0 sec 1 */
	0xB8, 0x01, 0x02,	/*	MOV	AX, 0x0201 	;Read sector */
	0xCD, 0x13,		/*	INT	0x13		;BIOS disk   */
	0x5A,			/*	POP	DX 		;drive       */
	0x59,			/*	POP	CX		;count	     */
	0x73, 0x03,		/*	JNC	OK		;It worked   */
	0xE2, 0xE2,		/*	LOOP	TRY		;Retry	     */
	0xF9,			/* 	STC			;It failed   */
	0xC3,			/*	RET				     */
	0x00, 0x00, 0x00, 0x00,	/*				;Unused	     */
};

/* Third patch: New INT19 entry point. This replaces an unused area. */
static unsigned char p2[] = {
	0xfb, 			/* 	STI		 	             */
	0xBA, 0x00, 0x00,	/* TR2:	MOV	DX, 0x0000	;Floppy      */
	0xE8, 0xCB, 0xEE,	/*	CALL	P1		;Try it	     */
	0x73, 0x0B,		/*	JNC	GO		;It worked!  */
	0xB2, 0x80,		/*	MOV	DL, 0x80	;Hard drive  */
	0xE8, 0xC4, 0xEE,	/*	CALL	P1		;Try it      */
	0x73, 0x04,		/*	JNC	GO		;It worked!  */
	0xCD, 0x20,		/*	INT	0x20		;See below   */
	0xEB, 0xED,		/*	JMPS	TR2		;Loop forever*/

	0xEA, 0x00, 0x7C,	/* GO:	JMPF	0x0000:0x7C00	;Go to sector*/
	0x00, 0x00,
	0x00,			/*	DB	0		;word align  */
	0xEC, 0x7E,		/*	DW	07EECh		;checksum    */
	0x00, 0x00, 0x00, 0x00,	/*				;Unused	     */
/* Note on the INT 0x20: This is not 'program termination' at boot time. The 
 * Compaq BIOS hooks it and uses it to display the message:
 *
 * Diskette error
 * Replace and strike any key when ready
 *
 */
};


void patch()
{
	memcpy(rom + 0x0376, p0, sizeof(p0));
	memcpy(rom + 0x06f2, p1, sizeof(p1));
	memcpy(rom + 0x1820, p2, sizeof(p2));
}

unsigned short checksum()
{
	unsigned short total, cur;
	int n;

	total = 0;
	for (n = 0; n < 8192; n++)
	{
		cur = rom[n];
		++n;
		cur |= (((unsigned short)rom[n]) << 8);
		total += cur;
	}
	return total;
}

int main(int argc, char **argv)
{
	FILE *fp;
	unsigned short sum;

	if (argc < 3)
	{
		fprintf(stderr, "Syntax: %s old_rom new_rom\n\n"
			/*	 1...5...10...15...20...25...30...35...40*/
				"Patches the BIOS ROM of the Compaq\n"
			        "Portable (revision C) to support booting\n"
				"from a hard drive.\n\n"
				"This program is public domain.", AV0);
		return EXIT_SUCCESS;
	}
	fp = fopen(argv[1], "rb");
	if (!fp)
	{
		perror(argv[1]);
		return EXIT_FAILURE;
	}
	if (fread(rom, 1, sizeof(rom), fp) < (int)sizeof(rom))
	{
		fprintf(stderr, "Could not read 8k from %s\n", argv[1]);
		fclose(fp);
		return EXIT_FAILURE;
	}
	fclose(fp);
	if (memcmp(rom + 0x1FEA, "COMPAQ", 6))
	{
		fprintf(stderr, "COMPAQ signature not found in %s\n", argv[1]);
		return EXIT_FAILURE;
	}
	if (rom[0x1FE6] != 'C')
	{
		fprintf(stderr, "ROM revision is not C. This may not work.\n");
	}
	sum = checksum();
	if (sum != 0)
	{
		fprintf(stderr, "ROM checksum is 0x%04x (should be 0). This "
				"may not work.\n", sum);
	}
	patch();
	sum = checksum();
	if (sum != 0)
	{
		fprintf(stderr, "New checksum is 0x%04x (should be 0). This "
				"may not work.\n", sum);
	}
	fp = fopen(argv[2], "wb");
	if (!fp)
	{
		perror(argv[2]);
		return EXIT_FAILURE;
	}
	if (fwrite(rom, 1, sizeof(rom), fp) < (int)sizeof(rom))
	{
		fprintf(stderr, "Could not write 8k to %s\n", argv[2]);
		fclose(fp);
		return EXIT_FAILURE;
	}
	fclose(fp);
	return EXIT_SUCCESS;
}
