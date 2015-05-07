;
; X86.DESC defines (see x86.js)
;
ACC_TYPE_SEG		equ	0x1000
ACC_PRESENT		equ	0x8000
ACC_TYPE_CODE		equ	0x0800
ACC_TYPE_READABLE	equ	0x0200
ACC_TYPE_WRITABLE	equ	0x0200
ACC_TYPE_CODE_READABLE	equ	0x1a00
ACC_TYPE_DATA_WRITABLE	equ	0x1200

EXT_NONE		equ	0x0000
EXT_BIG			equ	0x0040

CR0_MSW_PE		equ	0x0001
CR0_PG			equ	0x80000000	; set if paging enabled

PTE_FRAME		equ	0xfffff000
PTE_DIRTY		equ	0x00000040	; page has been modified
PTE_ACCESSED		equ	0x00000020      ; page has been accessed
PTE_USER		equ	0x00000004	; set for user level (CPL 3), clear for supervisor level (CPL 0-2)
PTE_READWRITE		equ	0x00000002	; set for read/write, clear for read-only (affects CPL 3 only)
PTE_PRESENT		equ	0x00000001   	; set for present page, clear for not-present page
