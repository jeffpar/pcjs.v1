<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons (@jeffpar)" website="http://www.pcjs.org/" created="2012-05-05" modified="2014-03-28" license="http://www.gnu.org/licenses/gpl.html" -->
<!DOCTYPE xsl:stylesheet [
	<!-- XSLT understands these entities only: lt, gt, apos, quot, and amp.  Other required entities may be defined below (see entities.dtd). --> 
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
					
	<xsl:template name="componentStyles">
		<xsl:param name="component"></xsl:param>
		<link rel="stylesheet" type="text/css" href="/my_modules/ecpjs-client/templates/{$component}.css"/>
	</xsl:template>
	
	<xsl:template name="componentScripts">
		<xsl:param name="component"></xsl:param>
		<xsl:choose>
			<xsl:when test="$component = 'components'">
				<script type="text/javascript" src="/my_modules/shared/lib/component.js"></script>
				<script type="text/javascript" src="/my_modules/ecpjs-client/lib/stepper.js"></script>
			</xsl:when>
			<xsl:otherwise>
				<script type="text/javascript" src="/my_modules/ecpjs-client/lib/{$component}.js"></script>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="componentIncludes">
		<xsl:param name="component"></xsl:param>
		<xsl:call-template name="componentStyles"><xsl:with-param name="component" select="$component"/></xsl:call-template>
		<xsl:call-template name="componentScripts"><xsl:with-param name="component" select="$component"/></xsl:call-template>
	</xsl:template>
	
	<xsl:template match="component[@ref]">
		<xsl:variable name="component" select="name(.)"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)"/>
	</xsl:template>
	
	<xsl:template match="component[not(@ref)]">
		<xsl:call-template name="component">
			<xsl:with-param name="class" select="@class"/>
			<xsl:with-param name="parms" select="@parms"/>
		</xsl:call-template>
	</xsl:template>
	
	<xsl:template name="component">
		<xsl:param name="class"></xsl:param>
		<xsl:param name="parms">none:null</xsl:param>
		<xsl:variable name="id">
			<!-- Values allowed: ID of component, blank if none (default) -->
			<xsl:choose>
				<xsl:when test="@id"><xsl:value-of select="@id"/></xsl:when>
				<xsl:otherwise></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="name">
			<!-- Values allowed: name of component, blank if none (default) -->
			<xsl:choose>
				<xsl:when test="name"><xsl:value-of select="name"/></xsl:when>
				<xsl:otherwise></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="pos">
			<!-- Values allowed: left (default), center, or blank for no relative positional preference -->
			<xsl:choose>
				<xsl:when test="@pos"><xsl:value-of select="@pos"/></xsl:when>
				<xsl:otherwise>left</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="step">
			<!-- Values allowed: number of milliseconds per step, 0 for quick/quiet stepping with yields (default), -1 for no yields -->
			<xsl:choose>
				<xsl:when test="@step"><xsl:value-of select="@step"/></xsl:when>
				<xsl:otherwise>0</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="log">
			<!-- Values allowed: true to enable console logging, false to disable (default) -->
			<xsl:choose>
				<xsl:when test="@log"><xsl:value-of select="@log"/></xsl:when>
				<xsl:otherwise>false</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<div class="component {$pos}">
			<xsl:apply-templates select="name"/>
			<div class="container">
				<xsl:if test="control[@pos = 'top']">
					<div class="controls">
						<xsl:apply-templates select="control[@pos = 'top']" mode="component"/>
					</div>
					<div style="clear:both"></div>
				</xsl:if>
				<xsl:if test="control[@pos = 'left']">
					<div class="controls">
						<xsl:apply-templates select="control[@pos = 'left']" mode="component"/>
					</div>
				</xsl:if>
				<div class="{$class}" data-value="id:'{$id}',name:'{$name}',step:{$step},log:{$log},{$parms}"></div>
				<xsl:if test="control[@pos = 'right']">
					<div class="controls">
						<xsl:apply-templates select="control[@pos = 'right']" mode="component"/>
					</div>
				</xsl:if>
				<xsl:if test="control[not(@pos)]">
					<div style="clear:both"></div>
					<div class="controls">
						<xsl:apply-templates select="control[not(@pos)]" mode="component"/>
					</div>
				</xsl:if>
				<xsl:if test="control[@pos = 'bottom']">
					<div style="clear:both"></div>
					<div class="controls">
						<xsl:apply-templates select="control[@pos = 'bottom']" mode="component"/>
					</div>
				</xsl:if>
			</div>
		</div>
	</xsl:template>

	<xsl:template match="name">
		<xsl:variable name="pos">
			<xsl:choose>
				<xsl:when test="@pos"><xsl:value-of select="@pos"/></xsl:when>
				<xsl:otherwise></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<div class="label {$pos}"><xsl:apply-templates/></div>
	</xsl:template>
	
	<xsl:template match="control" mode="component">
		<xsl:choose>
			<xsl:when test="@type = 'input'">
				<input class="{@class}" type="text" value=""/>
			</xsl:when>
			<xsl:when test="@type = 'output'">
				<div class="{@class}"></div>
			</xsl:when>
			<xsl:when test="@type = 'button'">
				<button class="{@class}"><xsl:value-of select="."/></button>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>
