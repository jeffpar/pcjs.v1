<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons (@jeffpar)" website="http://www.pcjs.org/" created="2012-05-05" modified="2014-03-28" license="http://www.gnu.org/licenses/gpl.html" -->
<!DOCTYPE xsl:stylesheet [
	<!-- XSLT understands these entities only: lt, gt, apos, quot, and amp.  Other required entities may be defined below (see entities.dtd). --> 
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
					
	<xsl:template name="registerIncludes">
		<link rel="stylesheet" type="text/css" href="/my_modules/ecpjs-client/templates/register.css"/>
		<script type="text/javascript" src="/my_modules/ecpjs-client/lib/register.js"></script>
	</xsl:template>
	
	<xsl:template match="register[@ref]">
		<xsl:variable name="component" select="name(.)"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)"/>
	</xsl:template>
	
	<xsl:template match="register[not(@ref)]">
		<xsl:variable name="nBits">
			<!-- Values allowed: positive integer defining number of bits, default of 40 (ECP default) -->
			<xsl:choose>
				<xsl:when test="nBits"><xsl:value-of select="nBits"/></xsl:when>
				<xsl:when test="@nBits"><xsl:value-of select="@nBits"/></xsl:when>
				<xsl:otherwise>40</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="signed">
			<!-- Values allowed: true if left-most bit is sign bit (ECP default), false if not -->
			<xsl:choose>
				<xsl:when test="signed"><xsl:value-of select="signed"/></xsl:when>
				<xsl:when test="@signed"><xsl:value-of select="@signed"/></xsl:when>
				<xsl:otherwise>true</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="bit0Exp">
			<!-- Values allowed: integer power of two corresponding to right-most bit, default of -39 (ECP default) -->
			<xsl:choose>
				<xsl:when test="bit0Exp"><xsl:value-of select="bit0Exp"/></xsl:when>
				<xsl:when test="@bit0Exp"><xsl:value-of select="@bit0Exp"/></xsl:when>
				<xsl:otherwise>-39</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="labels">
			<!-- Values allowed: true if bits should be labeled, false if not (default)-->
			<xsl:choose>
				<xsl:when test="labels"><xsl:value-of select="labels"/></xsl:when>
				<xsl:when test="@labels"><xsl:value-of select="@labels"/></xsl:when>
				<xsl:otherwise>false</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="class">register</xsl:with-param>
			<xsl:with-param name="parms">nBits:<xsl:value-of select="$nBits"/>,signed:<xsl:value-of select="$signed"/>,bit0Exp:<xsl:value-of select="$bit0Exp"/>,labels:<xsl:value-of select="$labels"/></xsl:with-param>
		</xsl:call-template>
	</xsl:template>
	
</xsl:stylesheet>
