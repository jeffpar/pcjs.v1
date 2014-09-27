<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons (@jeffpar)" website="http://www.pcjs.org/" created="2012-05-05" modified="2012-08-28" license="http://www.gnu.org/licenses/gpl.html" -->
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
	<xsl:include href="components.xsl"/>
	<xsl:include href="register.xsl"/>
					
	<xsl:template match="/">
		<html lang="en">
			<head>
				<title>jsmachines.net</title>
				<xsl:call-template name="commonStyles"/>
				<xsl:call-template name="componentIncludes"><xsl:with-param name="component" select="'components'"/></xsl:call-template>
				<xsl:if test="//register">
					<xsl:call-template name="registerIncludes"/>
				</xsl:if>
			</head>
			<body>
				<div class="page justified">
					<xsl:apply-templates/>
					<h4>Return to <a href="/outline.xml">Outline</a></h4>
				</div>
			</body>
		</html>
	</xsl:template>
	
</xsl:stylesheet>
