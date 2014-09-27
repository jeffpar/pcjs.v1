		.code
		.org	$200
;
; These must be kept in sync with the "opSim operation codes" in c1p.js
;
.define	OP_SIM			$02
.define	SIMOP_HLT		$00
.define	SIMOP_MSG		$01

.macro	SIM_MSG	msg
		.local	addr
		.byte	OP_SIM,SIMOP_MSG
addr:	.ASCIIZ	msg
.endmacro

.macro	SIM_HLT
		.byte	OP_SIM,SIMOP_HLT
.endmacro
