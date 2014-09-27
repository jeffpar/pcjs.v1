<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons" creator="http://www.pcjs.org/" created="2012-05-05T19:53:00" modified="2012-05-05T19:53:00" license="http://creativecommons.org/licenses/by-nc-sa/3.0/us/" -->
<!DOCTYPE xsl:stylesheet [
	<!-- XSLT understands these entities only: lt, gt, apos, quot, and amp.  Other useful entities are defined below (see entities.dtd). --> 
	<!ENTITY nbsp "&#160;"> <!ENTITY sect "&#167;"> <!ENTITY copy "&#169;"> <!ENTITY para "&#182;"> <!ENTITY ndash "&#8211;"> <!ENTITY mdash "&#8212;">
	<!ENTITY lsquo "&#8216;"> <!ENTITY rsquo "&#8217;"> <!ENTITY ldquo "&#8220;"> <!ENTITY rdquo "&#8221;"> <!ENTITY dagger "&#8224;"> <!ENTITY Dagger "&#8225;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="rootDir" select="''"/>
	<xsl:param name="generator" select="'client'"/>
	<xsl:output doctype-system="about:legacy-compat"/>

    <xsl:include href="../../../my_modules/shared/templates/common.xsl"/>
	<!-- The next two lines were added to support embedding components in documents -->
	<xsl:include href="components.xsl"/>
	<xsl:include href="register.xsl"/>
					
	<xsl:template match="/document">
		<html lang="en">
			<head>
				<title><xsl:value-of select="title"/><xsl:text> | jsmachines.net</xsl:text></title>
				<xsl:call-template name="commonStyles"/>
				<!-- The next two lines were added to support embedding components in documents -->
				<xsl:call-template name="componentIncludes"><xsl:with-param name="component" select="'components'"/></xsl:call-template>
				<xsl:call-template name="registerIncludes"/>
			</head>
			<body>
				<div class="page justified">
					<h4 style="float:right">Return to <a href="/manuals/ecp/outline.xml">Outline</a></h4>
					<xsl:call-template name="document"><xsl:with-param name="parent" select="'true'"/></xsl:call-template>
					<h4>Return to <a href="/manuals/ecp/outline.xml">Outline</a></h4>
				</div>
			</body>
		</html>
	</xsl:template>
	
	<xsl:template name="document">
		<xsl:param name="parent">false</xsl:param>
		<xsl:param name="ref"></xsl:param>
		<xsl:if test="not(parent)">
			<h1><xsl:value-of select="title"/><xsl:apply-templates select="title/footlink"/></h1>
			<xsl:if test="author"><p><xsl:text>By </xsl:text><xsl:call-template name="authors"/></p></xsl:if>
			<xsl:apply-templates select="date"/>
			<xsl:apply-templates select="synopsis"/>
		</xsl:if>
		<xsl:if test="parent">
			<xsl:choose>
				<xsl:when test="$parent = 'true'">
					<h2><xsl:apply-templates select="parent"/></h2>
					<h3><xsl:apply-templates select="title"/></h3>
				</xsl:when>
				<xsl:otherwise>
					<h2>
						<xsl:choose>
							<xsl:when test="$ref = ''"><xsl:apply-templates select="title"/></xsl:when>
							<xsl:otherwise><a href="{$ref}"><xsl:apply-templates select="title"/></a></xsl:otherwise>
						</xsl:choose>
					</h2>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
		<xsl:if test="excerpt">
			<h4><xsl:apply-templates select="excerpt"/></h4>
		</xsl:if>
		<xsl:if test="@ref">
			<xsl:choose>
				<xsl:when test="contains(@ref,'.pdf')">
					<a href="{@ref}"><img src="/my_modules/shared/images/pdf-192.jpg"/></a>
				</xsl:when>
				<xsl:otherwise>
					<p>[<a href="{@ref}">Link</a>]</p>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
		<xsl:if test="content">
			<xsl:if test="content/p[@name]">
				<h4><xsl:text>Discusses: </xsl:text> 
					<xsl:for-each select="content/p[@name]">
						<xsl:if test="position() != 1"><xsl:text>, </xsl:text></xsl:if>
						<a href="#{@id}"><xsl:value-of select="@name"/></a>
					</xsl:for-each>
				</h4>
			</xsl:if>
			<xsl:apply-templates select="content"/>
		</xsl:if>
		<xsl:apply-templates select="include"/>
		<xsl:apply-templates select="video"/>
	</xsl:template>
	
	<xsl:template match="date">
		<p><xsl:call-template name="formatDate"><xsl:with-param name="date" select="."/></xsl:call-template></p>
	</xsl:template>
	
	<xsl:template match="author">
		<p><xsl:text>By </xsl:text><xsl:value-of select="."/></p>
	</xsl:template>
	
	<xsl:template match="synopsis">
		<p><xsl:text>Synopsis: </xsl:text><em><xsl:value-of select="."/></em></p>
	</xsl:template>
	
	<xsl:template match="content">
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="video">
		<xsl:variable name="controls"><xsl:if test="@controls">controls</xsl:if></xsl:variable>
		<div class="center">
			<video width="{@width}" height="{@height}" controls="{$controls}">
				<xsl:apply-templates select="source"/>
				Your browser does not support HTML5 video play-back.
			</video>
		</div>
	</xsl:template>
	
	<xsl:template match="source">
		<source src="{@src}" type="{@type}"/>
	</xsl:template>
	
	<xsl:template match="include">
		<xsl:if test="@ref">
			<xsl:variable name="documentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
			<xsl:apply-templates select="document($documentFile)/document" mode="include">
				<xsl:with-param name="parent" select="@parent"/>
				<xsl:with-param name="link" select="@link"/>
				<xsl:with-param name="ref" select="@ref"/>
			</xsl:apply-templates>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="document" mode="include">
		<xsl:param name="parent">false</xsl:param>
		<xsl:param name="link">false</xsl:param>
		<xsl:param name="ref"></xsl:param>
		<xsl:choose>
			<xsl:when test="$link = 'true'">
				<xsl:if test="$parent = 'true'">
					<h2><xsl:apply-templates select="parent"/></h2>
				</xsl:if>
				<h3><a href="{$ref}"><xsl:value-of select="title"/></a></h3>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="document"><xsl:with-param name="parent" select="$parent"/><xsl:with-param name="ref" select="$ref"/></xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
		<hr/>
	</xsl:template>
	
</xsl:stylesheet>
