<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons (@jeffpar)" website="http://www.pcjs.org/" created="2012-05-05" modified="2014-02-23" license="http://www.gnu.org/licenses/gpl.html" -->
<!DOCTYPE xsl:stylesheet [
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="rootDir" select="''"/>
	<xsl:param name="generator" select="'client'"/>

	<xsl:variable name="MACHINECLASS">pc</xsl:variable>
	<xsl:variable name="APPCLASS">pcjs</xsl:variable>
	<xsl:variable name="APPVERSION">1.15.7</xsl:variable>
	<xsl:variable name="SITEHOST">www.pcjs.org</xsl:variable>

	<xsl:template name="componentStyles">
		<link rel="stylesheet" type="text/css" href="/versions/{$APPCLASS}/{$APPVERSION}/components.css"/>
	</xsl:template>

	<xsl:template name="componentScripts">
		<xsl:param name="component"/>
		<script type="text/javascript" src="/versions/{$APPCLASS}/{$APPVERSION}/{$component}.js"> </script>
	</xsl:template>

	<xsl:template name="componentIncludes">
		<xsl:param name="component"/>
		<xsl:call-template name="componentScripts"><xsl:with-param name="component" select="$component"/></xsl:call-template>
	</xsl:template>

	<xsl:template name="machine">
		<xsl:param name="href">/configs/pc/machines/5150/mda/64kb/index.xml</xsl:param>
		<xsl:param name="state" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="$href"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/machine">
			<xsl:with-param name="machineState" select="$state"/>
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="machine[@ref]">
		<xsl:param name="machineState" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/machine">
			<xsl:with-param name="machine" select="@id"/>
			<xsl:with-param name="machineState">
				<xsl:choose>
					<xsl:when test="$machineState != ''"><xsl:value-of select="$machineState"/></xsl:when>
					<xsl:otherwise><xsl:value-of select="@state"/></xsl:otherwise>
				</xsl:choose>
			</xsl:with-param>
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="machine[not(@ref)]">
		<xsl:param name="machine"><xsl:value-of select="@id"/></xsl:param>
		<xsl:param name="machineState" select="''"/>
		<xsl:variable name="machineStyle">
			<xsl:if test="@float">float:<xsl:value-of select="@float"/></xsl:if>
		</xsl:variable>
		<div id="{$machine}" class="machine {@class}js" style="{$machineStyle}">
			<xsl:call-template name="component">
				<xsl:with-param name="machine" select="$machine"/>
				<xsl:with-param name="machineState">
					<xsl:choose>
						<xsl:when test="$machineState != ''"><xsl:value-of select="$machineState"/></xsl:when>
						<xsl:otherwise><xsl:value-of select="@state"/></xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="component" select="'machine'"/>
				<xsl:with-param name="class"><xsl:value-of select="@class"/>js</xsl:with-param>
				<xsl:with-param name="parms"><xsl:if test="@parms">,<xsl:value-of select="@parms"/></xsl:if></xsl:with-param>
				<xsl:with-param name="url"><xsl:value-of select="@url"/></xsl:with-param>
			</xsl:call-template>
		</div>
	</xsl:template>

	<xsl:template match="component[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/component">
			<xsl:with-param name="machine" select="$machine"/>
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="component[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class" select="@class"/>
			<xsl:with-param name="parms"><xsl:if test="@parms">,<xsl:value-of select="@parms"/></xsl:if></xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="component">
		<xsl:param name="machine" select="''"/>
		<xsl:param name="machineState" select="''"/>
		<xsl:param name="component" select="name(.)"/>
		<xsl:param name="class" select="''"/>
		<xsl:param name="parms" select="''"/>
		<xsl:param name="url" select="''"/>
		<xsl:variable name="id">
			<xsl:choose>
				<xsl:when test="$component = 'machine'"><xsl:value-of select="$machine"/>.machine</xsl:when>
				<xsl:when test="$machine != '' and @id"><xsl:value-of select="$machine"/>.<xsl:value-of select="@id"/></xsl:when>
				<xsl:when test="$machine != ''"><xsl:value-of select="$machine"/>.<xsl:value-of select="$component"/></xsl:when>
				<xsl:when test="@id"><xsl:value-of select="@id"/></xsl:when>
				<xsl:otherwise><xsl:value-of select="$component"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="componentURL">
			<xsl:choose>
				<xsl:when test="$component = 'machine'">url:'<xsl:value-of select="$url"/>'</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="name">
			<xsl:choose>
				<xsl:when test="name"><xsl:value-of select="name"/></xsl:when>
				<xsl:when test="@name"><xsl:value-of select="@name"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="comment">
			<xsl:choose>
				<xsl:when test="@comment">,comment:'<xsl:value-of select="@comment"/>'</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="border">
			<xsl:choose>
				<xsl:when test="@border = '1'">border:1px solid black;border-radius:15px;</xsl:when>
				<xsl:when test="@border">border:<xsl:value-of select="@border"/>;</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="left">
			<xsl:choose>
				<xsl:when test="@left">left:<xsl:value-of select="@left"/>;</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="top">
			<xsl:choose>
				<xsl:when test="@top">top:<xsl:value-of select="@top"/>;</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="width">
			<xsl:choose>
				<xsl:when test="@width">
					<xsl:choose>
						<xsl:when test="$left != '' or $top != ''">width:<xsl:value-of select="@width"/>;</xsl:when>
						<xsl:otherwise>width:auto;max-width:<xsl:value-of select="@width"/>;</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="height">
			<xsl:choose>
				<xsl:when test="@height">height:<xsl:value-of select="@height"/>;</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="padding">
			<xsl:choose>
				<xsl:when test="@padding">padding:<xsl:value-of select="@padding"/>;</xsl:when>
				<xsl:otherwise>
					<xsl:if test="@padtop">padding-top:<xsl:value-of select="@padtop"/>;</xsl:if>
					<xsl:if test="@padright">padding-right:<xsl:value-of select="@padright"/>;</xsl:if>
					<xsl:if test="@padbottom">padding-bottom:<xsl:value-of select="@padbottom"/>;</xsl:if>
					<xsl:if test="@padleft">padding-left:<xsl:value-of select="@padleft"/>;</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="pos">
			<xsl:choose>
				<xsl:when test="@pos = 'left'">float:left;</xsl:when>
				<xsl:when test="@pos = 'right'">float:right;</xsl:when>
				<xsl:when test="@pos = 'center'">margin:0 auto;</xsl:when>
				<xsl:when test="@pos">position:<xsl:value-of select="@pos"/>;</xsl:when>
				<xsl:when test="$left != '' or $top != ''">position:relative;</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="style">
			<xsl:if test="$component = 'machine'">overflow:auto;width:100%;</xsl:if>
			<xsl:if test="@style"><xsl:value-of select="@style"/></xsl:if>
		</xsl:variable>
		<xsl:variable name="componentClass">
			<xsl:value-of select="$APPCLASS"/><xsl:text>-</xsl:text><xsl:value-of select="$component"/><xsl:text> </xsl:text><xsl:value-of select="$APPCLASS"/><xsl:text>-component</xsl:text>
		</xsl:variable>
		<div id="{$id}" class="{$componentClass}" style="{$width}{$height}{$pos}{$left}{$top}{$padding}" data-value="{$componentURL}">
			<xsl:if test="$component = 'machine'">
				<xsl:apply-templates select="name" mode="machine"/>
			</xsl:if>
			<xsl:if test="$component != 'machine'">
				<xsl:apply-templates select="name" mode="component"/>
			</xsl:if>
			<div class="{$APPCLASS}-container" style="{$border}{$style}">
				<xsl:if test="$class != '' and $component != 'machine'">
					<div class="{$APPCLASS}-{$class}-object" data-value="id:'{$id}',name:'{$name}'{$comment}{$parms}"> </div>
				</xsl:if>
				<xsl:if test="control">
					<div class="{$APPCLASS}-controls">
						<xsl:apply-templates select="control" mode="component"/>
					</div>
				</xsl:if>
				<xsl:apply-templates>
					<xsl:with-param name="machine" select="$machine"/>
					<xsl:with-param name="machineState" select="$machineState"/>
				</xsl:apply-templates>
			</div>
			<xsl:if test="$component = 'machine'">
				<xsl:choose>
					<xsl:when test="$url != ''"><div class="{$APPCLASS}-reference">[<a href="{$url}">XML</a>]</div></xsl:when>
					<xsl:otherwise/>
				</xsl:choose>
				<div class="{$APPCLASS}-copyright">
					<a href="http://{$SITEHOST}" target="_blank">PCjs</a> v<xsl:value-of select="$APPVERSION"/> © 2012-2014 by <a href="http://twitter.com/jeffpar" target="_blank">@jeffpar</a>
				</div>
				<div style="clear:both"> </div>
			</xsl:if>
		</div>
	</xsl:template>

	<xsl:template match="name" mode="machine">
		<xsl:variable name="pos">
			<xsl:choose>
				<xsl:when test="@pos = 'center'">text-align:center;</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<h2 style="{$pos}"><xsl:apply-templates/></h2>
	</xsl:template>

	<xsl:template match="name" mode="component">
		<div class="{$APPCLASS}-name"><xsl:apply-templates/></div>
	</xsl:template>

	<xsl:template match="control" mode="component">
		<xsl:variable name="type">
			<xsl:text>type:'</xsl:text><xsl:value-of select="@type"/><xsl:text>'</xsl:text>
		</xsl:variable>
		<xsl:variable name="binding">
			<xsl:text>binding:'</xsl:text><xsl:value-of select="@binding"/><xsl:text>'</xsl:text>
		</xsl:variable>
		<xsl:variable name="border">
			<xsl:choose>
				<xsl:when test="@border = '1'">border:1px solid black;</xsl:when>
				<xsl:when test="@border">border:<xsl:value-of select="@border"/>;</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="width">
			<xsl:choose>
				<xsl:when test="@width">width:<xsl:value-of select="@width"/>;</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="height">
			<xsl:choose>
				<xsl:when test="@height">height:<xsl:value-of select="@height"/>;</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="left">
			<xsl:choose>
				<xsl:when test="@left">left:<xsl:value-of select="@left"/>;</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="top">
			<xsl:choose>
				<xsl:when test="@top">top:<xsl:value-of select="@top"/>;</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="padding">
			<xsl:choose>
				<xsl:when test="@padding">padding:<xsl:value-of select="@padding"/>;</xsl:when>
				<xsl:otherwise>
					<xsl:if test="@padtop">padding-top:<xsl:value-of select="@padtop"/>;</xsl:if>
					<xsl:if test="@padright">padding-right:<xsl:value-of select="@padright"/>;</xsl:if>
					<xsl:if test="@padbottom">padding-bottom:<xsl:value-of select="@padbottom"/>;</xsl:if>
					<xsl:if test="@padleft">padding-left:<xsl:value-of select="@padleft"/>;</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="pos">
			<xsl:choose>
				<xsl:when test="@pos = 'left'">float:left;</xsl:when>
				<xsl:when test="@pos = 'right'">float:right;</xsl:when>
				<xsl:when test="@pos = 'center'">margin:0 auto;</xsl:when>
				<xsl:when test="@pos">position:<xsl:value-of select="@pos"/>;</xsl:when>
				<xsl:when test="$left != '' or $top != ''">position:relative;</xsl:when>
				<xsl:otherwise><xsl:if test="$left = ''">float:left;</xsl:if></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="style">
			<xsl:choose>
				<xsl:when test="@style"><xsl:value-of select="@style"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="containerClass">
			<xsl:if test="@type = 'container' and @class"><xsl:text> </xsl:text><xsl:value-of select="@class"/></xsl:if>
		</xsl:variable>
		<xsl:variable name="containerStyle">
			<xsl:value-of select="$pos"/><xsl:value-of select="$left"/><xsl:value-of select="$top"/><xsl:value-of select="$padding"/>
			<xsl:choose>
				<xsl:when test="@type = 'container'"><xsl:value-of select="$border"/><xsl:value-of select="$width"/><xsl:value-of select="$height"/><xsl:value-of select="$style"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<div class="{$APPCLASS}-control{$containerClass}" style="{$containerStyle}">
			<xsl:variable name="fontsize">
				<xsl:choose>
					<xsl:when test="@size = 'large' or @size = 'small'">font-size:<xsl:value-of select="@size"/>;</xsl:when>
					<xsl:otherwise/>
				</xsl:choose>
			</xsl:variable>
			<xsl:variable name="subClass">
				<xsl:if test="@label"><xsl:text> </xsl:text><xsl:value-of select="$APPCLASS"/><xsl:text>-label</xsl:text></xsl:if>
			</xsl:variable>
			<xsl:variable name="labelWidth">
				<xsl:if test="@labelwidth">width:<xsl:value-of select="@labelwidth"/>;</xsl:if>
			</xsl:variable>
			<xsl:variable name="labelStyle">
				<xsl:choose>
					<xsl:when test="@labelstyle"><xsl:value-of select="@labelstyle"/></xsl:when>
					<xsl:otherwise>text-align:right;</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:if test="@label">
				<xsl:if test="not(@labelpos) or @labelpos = 'left'">
					<div class="{$APPCLASS}-label" style="{$labelWidth}{$labelStyle}"><xsl:value-of select="@label"/></div>
				</xsl:if>
			</xsl:if>
			<xsl:choose>
				<xsl:when test="@type = 'button'">
					<button class="{$APPCLASS}-{@class}" style="-webkit-user-select:none;{$border}{$width}{$height}{$fontsize}{$style}" data-value="{$type},{$binding}"><xsl:apply-templates/></button>
				</xsl:when>
				<xsl:when test="@type = 'list'">
					<select class="{$APPCLASS}-{@class}" style="{$border}{$width}{$height}{$fontsize}{$style}" data-value="{$type},{$binding}">
						<xsl:apply-templates select="disk|app|manifest" mode="component"/>
					</select>
				</xsl:when>
				<xsl:when test="@type = 'text'">
					<input class="{$APPCLASS}-{@class}" type="text" style="{$border}{$width}{$height}{$style}" data-value="{$type},{$binding}" value="{.}" autocapitalize="off" autocorrect="off"/>
				</xsl:when>
				<xsl:when test="@type = 'submit'">
					<input class="{$APPCLASS}-{@class}" type="submit" style="{$border}{$fontsize}{$style}" data-value="{$type},{$binding}" value="{.}"/>
				</xsl:when>
				<xsl:when test="@type = 'textarea'">
					<textarea class="{$APPCLASS}-{@class}" style="{$border}{$width}{$height}{$style}" data-value="{$type},{$binding}" readonly="readonly"> </textarea>
				</xsl:when>
				<xsl:when test="@type = 'heading'">
					<div><xsl:value-of select="."/></div>
				</xsl:when>
				<xsl:when test="@type = 'separator'">
					<hr/>
				</xsl:when>
				<xsl:when test="@type = 'container'">
					<xsl:apply-templates mode="component"/>
				</xsl:when>
				<xsl:when test="not(@type)">
					<div style="clear:both"> </div>
				</xsl:when>
				<xsl:otherwise>
					<div class="{$APPCLASS}-{@class}{$subClass} {$APPCLASS}-{@type}" style="-webkit-user-select:none;{$border}{$width}{$height}{$fontsize}{$style}" data-value="{$type},{$binding}"><xsl:apply-templates/></div>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:if test="@label">
				<xsl:if test="@labelpos = 'right'">
					<div class="{$APPCLASS}-label" style="{$labelWidth}{$labelStyle}"><xsl:value-of select="@label"/></div>
				</xsl:if>
				<div style="clear:both"> </div>
			</xsl:if>
		</div>
	</xsl:template>

	<xsl:template match="disk[@ref]" mode="component">
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/disk" mode="component"/>
	</xsl:template>

	<xsl:template match="disk[not(@ref)]" mode="component">
		<xsl:variable name="desc">
			<xsl:if test="@desc">
				<xsl:text>desc:'</xsl:text><xsl:value-of select="@desc"/><xsl:text>'</xsl:text>
				<xsl:if test="@href">
					<xsl:text>,href:'</xsl:text><xsl:value-of select="@href"/><xsl:text>'</xsl:text>
				</xsl:if>
			</xsl:if>
		</xsl:variable>
		<option value="{@path}" data-value="{$desc}"><xsl:if test="name"><xsl:value-of select="name"/></xsl:if><xsl:if test="not(name)"><xsl:value-of select="."/></xsl:if></option>
	</xsl:template>

	<xsl:template match="app[@ref]" mode="component">
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/app" mode="component"/>
	</xsl:template>

	<xsl:template match="app[not(@ref)]" mode="component">
		<xsl:variable name="desc">
			<xsl:if test="@desc">
				<xsl:text>desc:'</xsl:text><xsl:value-of select="@desc"/><xsl:text>'</xsl:text>
				<xsl:if test="@href">
					<xsl:text>,href:'</xsl:text><xsl:value-of select="@href"/><xsl:text>'</xsl:text>
				</xsl:if>
			</xsl:if>
		</xsl:variable>
		<xsl:variable name="path">
			<xsl:if test="@path"><xsl:value-of select="@path"/></xsl:if>
		</xsl:variable>
		<xsl:variable name="files">
			<xsl:for-each select="file"><xsl:if test="position() = 1"><xsl:value-of select="$path"/></xsl:if><xsl:value-of select="@name"/><xsl:if test="position() != last()">;</xsl:if></xsl:for-each>
		</xsl:variable>
		<option value="{$files}" data-value="{$desc}"><xsl:value-of select="@name"/></option>
	</xsl:template>

	<xsl:template match="manifest[@ref]" mode="component">
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/manifest" mode="component">
			<xsl:with-param name="disk"><xsl:value-of select="@disk"/></xsl:with-param>
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="manifest[not(@ref)]" mode="component">
		<xsl:param name="disk"><xsl:value-of select="@disk"/></xsl:param>
		<xsl:if test="$disk != ''">
			<xsl:variable name="prefix">
				<xsl:if test="title[@prefix]"><xsl:value-of select="title"/><xsl:text>: </xsl:text></xsl:if>
			</xsl:variable>
			<xsl:for-each select="disk">
				<xsl:if test="$disk = @id or $disk = '*'">
					<xsl:variable name="name">
						<xsl:choose>
							<xsl:when test="name"><xsl:value-of select="$prefix"/><xsl:value-of select="name"/></xsl:when>
							<xsl:when test="normalize-space(./text()) != ''">
								<xsl:value-of select="$prefix"/><xsl:value-of select="normalize-space(./text())"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="../title"/><xsl:if test="../version != ''"><xsl:text> </xsl:text><xsl:value-of select="../version"/></xsl:if>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:variable name="link">
						<xsl:if test="link">
							<xsl:text>desc:'</xsl:text><xsl:value-of select="link"/><xsl:text>'</xsl:text>
							<xsl:if test="link/@href">
								<xsl:text>,href:'</xsl:text><xsl:value-of select="link/@href"/><xsl:text>'</xsl:text>
							</xsl:if>
						</xsl:if>
					</xsl:variable>
					<xsl:if test="@href">
						<option value="{@href}" data-value="{$link}"><xsl:value-of select="$name"/></option>
					</xsl:if>
					<xsl:if test="not(@href)">
						<xsl:variable name="dir">
							<xsl:if test="@dir"><xsl:value-of select="@dir"/></xsl:if>
						</xsl:variable>
						<xsl:variable name="files">
							<xsl:for-each select="file"><xsl:if test="position() = 1"><xsl:value-of select="$dir"/></xsl:if><xsl:value-of select="@dir"/><xsl:value-of select="."/><xsl:if test="position() != last()">;</xsl:if></xsl:for-each>
						</xsl:variable>
						<option value="{$files}" data-value="{$link}"><xsl:value-of select="$name"/></option>
					</xsl:if>
				</xsl:if>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>

	<xsl:template match="name">
	</xsl:template>

	<xsl:template match="control">
	</xsl:template>

	<xsl:template match="cpu[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/cpu"><xsl:with-param name="machine" select="$machine"/></xsl:apply-templates>
	</xsl:template>

	<xsl:template match="cpu[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="model">
			<xsl:choose>
				<xsl:when test="@model"><xsl:value-of select="@model"/></xsl:when>
				<xsl:otherwise>8088</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="cycles">
			<xsl:choose>
				<xsl:when test="@cycles"><xsl:value-of select="@cycles"/></xsl:when>
				<xsl:otherwise>0</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="multiplier">
			<xsl:choose>
				<xsl:when test="@multiplier"><xsl:value-of select="@multiplier"/></xsl:when>
				<xsl:otherwise>1</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="autoStart">
			<xsl:choose>
				<xsl:when test="@autostart"><xsl:value-of select="@autostart"/></xsl:when>
				<xsl:otherwise>null</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="csStart">
			<xsl:choose>
				<xsl:when test="@csstart"><xsl:value-of select="@csstart"/></xsl:when>
				<xsl:otherwise>-1</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="csInterval">
			<xsl:choose>
				<xsl:when test="@csinterval"><xsl:value-of select="@csinterval"/></xsl:when>
				<xsl:otherwise>-1</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="csStop">
			<xsl:choose>
				<xsl:when test="@csstop"><xsl:value-of select="@csstop"/></xsl:when>
				<xsl:otherwise>-1</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class" select="'cpu'"/>
			<xsl:with-param name="parms">,model:<xsl:value-of select="$model"/>,cycles:<xsl:value-of select="$cycles"/>,multiplier:<xsl:value-of select="$multiplier"/>,autoStart:<xsl:value-of select="$autoStart"/>,csStart:<xsl:value-of select="$csStart"/>,csInterval:<xsl:value-of select="$csInterval"/>,csStop:<xsl:value-of select="$csStop"/></xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="chipset[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/chipset"><xsl:with-param name="machine" select="$machine"/></xsl:apply-templates>
	</xsl:template>

	<xsl:template match="chipset[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="model">
			<xsl:choose>
				<xsl:when test="@model"><xsl:value-of select="@model"/></xsl:when>
				<xsl:otherwise>5150</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="sw1">
			<xsl:choose>
				<xsl:when test="@sw1"><xsl:value-of select="@sw1"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="sw2">
			<xsl:choose>
				<xsl:when test="@sw2"><xsl:value-of select="@sw2"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="sound">
			<xsl:choose>
				<xsl:when test="@sound"><xsl:value-of select="@sound"/></xsl:when>
				<xsl:otherwise>true</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="scaletimers">
			<xsl:choose>
				<xsl:when test="@scaletimers"><xsl:value-of select="@scaletimers"/></xsl:when>
				<xsl:otherwise>false</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="floppies">
			<xsl:choose>
				<xsl:when test="@floppies"><xsl:value-of select="@floppies"/></xsl:when>
				<xsl:otherwise>{}</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="monitor">
			<xsl:choose>
				<xsl:when test="@monitor"><xsl:value-of select="@monitor"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="rtcdate">
			<xsl:choose>
				<xsl:when test="@rtcdate"><xsl:value-of select="@rtcdate"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">chipset</xsl:with-param>
			<xsl:with-param name="parms">,model:'<xsl:value-of select="$model"/>',scaleTimers:<xsl:value-of select="$scaletimers"/>,sw1:'<xsl:value-of select="$sw1"/>',sw2:'<xsl:value-of select="$sw2"/>',sound:<xsl:value-of select="$sound"/>,floppies:<xsl:value-of select="$floppies"/>,monitor:'<xsl:value-of select="$monitor"/>',rtcDate:'<xsl:value-of select="$rtcdate"/>'</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="keyboard[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/keyboard"><xsl:with-param name="machine" select="$machine"/></xsl:apply-templates>
	</xsl:template>

	<xsl:template match="keyboard[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="model">
			<xsl:choose>
				<xsl:when test="@model"><xsl:value-of select="@model"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">keyboard</xsl:with-param>
			<xsl:with-param name="parms">,model:'<xsl:value-of select="$model"/>'</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="serial[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/serial"><xsl:with-param name="machine" select="$machine"/></xsl:apply-templates>
	</xsl:template>

	<xsl:template match="serial[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="adapter">
			<xsl:choose>
				<xsl:when test="@adapter"><xsl:value-of select="@adapter"/></xsl:when>
				<xsl:otherwise>0</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="binding">
			<xsl:choose>
				<xsl:when test="@binding"><xsl:value-of select="@binding"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">serial</xsl:with-param>
			<xsl:with-param name="parms">,adapter:<xsl:value-of select="$adapter"/>,binding:'<xsl:value-of select="$binding"/>'</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="mouse[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/mouse"><xsl:with-param name="machine" select="$machine"/></xsl:apply-templates>
	</xsl:template>

	<xsl:template match="mouse[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="serial">
			<xsl:choose>
				<xsl:when test="@serial"><xsl:value-of select="@serial"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">mouse</xsl:with-param>
			<xsl:with-param name="parms">,serial:'<xsl:value-of select="$serial"/>'</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="fdc[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/fdc">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="mount" select="@automount"/>
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="fdc[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:param name="mount" select="''"/>
		<xsl:variable name="automount">
			<xsl:choose>
				<xsl:when test="$mount != ''"><xsl:value-of select="$mount"/></xsl:when>
				<xsl:otherwise><xsl:value-of select="@automount"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">fdc</xsl:with-param>
			<xsl:with-param name="parms">,autoMount:'<xsl:value-of select="$automount"/>'</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="hdc[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/hdc"><xsl:with-param name="machine" select="$machine"/></xsl:apply-templates>
	</xsl:template>

	<xsl:template match="hdc[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="drives">
			<xsl:choose>
				<xsl:when test="@drives"><xsl:value-of select="@drives"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="type">
			<xsl:choose>
				<xsl:when test="@type"><xsl:value-of select="@type"/></xsl:when>
				<xsl:otherwise>xt</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">hdc</xsl:with-param>
			<xsl:with-param name="parms">,drives:'<xsl:value-of select="$drives"/>',type:'<xsl:value-of select="$type"/>'</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="rom[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/rom"><xsl:with-param name="machine" select="$machine"/></xsl:apply-templates>
	</xsl:template>

	<xsl:template match="rom[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="addr">
			<xsl:choose>
				<xsl:when test="@addr"><xsl:value-of select="@addr"/></xsl:when>
				<xsl:otherwise>0</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="size">
			<xsl:choose>
				<xsl:when test="@size"><xsl:value-of select="@size"/></xsl:when>
				<xsl:otherwise>0</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="alias">
			<xsl:choose>
				<xsl:when test="@alias"><xsl:value-of select="@alias"/></xsl:when>
				<xsl:otherwise>null</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="file">
			<xsl:choose>
				<xsl:when test="@file"><xsl:value-of select="@file"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="notify">
			<xsl:choose>
				<xsl:when test="@notify"><xsl:value-of select="@notify"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">rom</xsl:with-param>
			<xsl:with-param name="parms">,addr:<xsl:value-of select="$addr"/>,size:<xsl:value-of select="$size"/>,alias:<xsl:value-of select="$alias"/>,file:'<xsl:value-of select="$file"/>',notify:'<xsl:value-of select="$notify"/>'</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="ram[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/ram"><xsl:with-param name="machine" select="$machine"/></xsl:apply-templates>
	</xsl:template>

	<xsl:template match="ram[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="addr">
			<xsl:choose>
				<xsl:when test="@addr"><xsl:value-of select="@addr"/></xsl:when>
				<xsl:otherwise>0</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="size">
			<xsl:choose>
				<xsl:when test="@size"><xsl:value-of select="@size"/></xsl:when>
				<xsl:otherwise>0</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:choose>
				<xsl:when test="@test"><xsl:value-of select="@test"/></xsl:when>
				<xsl:otherwise>true</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">ram</xsl:with-param>
			<xsl:with-param name="parms">,addr:<xsl:value-of select="$addr"/>,size:<xsl:value-of select="$size"/>,test:<xsl:value-of select="$test"/></xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="video[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/video"><xsl:with-param name="machine" select="$machine"/></xsl:apply-templates>
	</xsl:template>

	<xsl:template match="video[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="model">
			<xsl:choose>
				<xsl:when test="@model"><xsl:value-of select="@model"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="mode">
			<xsl:choose>
				<xsl:when test="@mode"><xsl:value-of select="@mode"/></xsl:when>
				<xsl:otherwise>7</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="screenWidth">
			<xsl:choose>
				<xsl:when test="@screenwidth"><xsl:value-of select="@screenwidth"/></xsl:when>
				<xsl:otherwise>256</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="screenHeight">
			<xsl:choose>
				<xsl:when test="@screenheight"><xsl:value-of select="@screenheight"/></xsl:when>
				<xsl:otherwise>224</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="memory">
			<xsl:choose>
				<xsl:when test="@memory"><xsl:value-of select="@memory"/></xsl:when>
				<xsl:otherwise>0</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="switches">
			<xsl:choose>
				<xsl:when test="@switches"><xsl:value-of select="@switches"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="scale">
			<xsl:choose>
				<xsl:when test="@scale"><xsl:value-of select="@scale"/></xsl:when>
				<xsl:otherwise>false</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="charCols">
			<xsl:choose>
				<xsl:when test="@cols"><xsl:value-of select="@cols"/></xsl:when>
				<xsl:otherwise>80</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="charRows">
			<xsl:choose>
				<xsl:when test="@rows"><xsl:value-of select="@rows"/></xsl:when>
				<xsl:otherwise>25</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="fontROM">
			<xsl:choose>
				<xsl:when test="@charset"><xsl:value-of select="@charset"/></xsl:when>
				<xsl:when test="@fontrom"><xsl:value-of select="@fontrom"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="screenColor">
			<xsl:choose>
				<xsl:when test="@screencolor"><xsl:value-of select="@screencolor"/></xsl:when>
				<xsl:otherwise>black</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="touchScreen">
			<xsl:choose>
				<xsl:when test="@touchscreen"><xsl:value-of select="@touchscreen"/></xsl:when>
				<xsl:otherwise>false</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">video</xsl:with-param>
			<xsl:with-param name="parms">,model:'<xsl:value-of select="$model"/>',mode:<xsl:value-of select="$mode"/>,screenWidth:<xsl:value-of select="$screenWidth"/>,screenHeight:<xsl:value-of select="$screenHeight"/>,memory:<xsl:value-of select="$memory"/>,switches:'<xsl:value-of select="$switches"/>',scale:<xsl:value-of select="$scale"/>,charCols:<xsl:value-of select="$charCols"/>,charRows:<xsl:value-of select="$charRows"/>,fontROM:'<xsl:value-of select="$fontROM"/>',screenColor:'<xsl:value-of select="$screenColor"/>',touchScreen:<xsl:value-of select="$touchScreen"/></xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="debugger[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/debugger"><xsl:with-param name="machine" select="$machine"/></xsl:apply-templates>
	</xsl:template>

	<xsl:template match="debugger[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="commands">
			<xsl:choose>
				<xsl:when test="@commands"><xsl:value-of select="@commands"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="messages">
			<xsl:choose>
				<xsl:when test="@messages"><xsl:value-of select="@messages"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">debugger</xsl:with-param>
			<xsl:with-param name="parms">,commands:'<xsl:value-of select="$commands"/>',messages:'<xsl:value-of select="$messages"/>'</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="panel[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/panel"><xsl:with-param name="machine" select="$machine"/></xsl:apply-templates>
	</xsl:template>

	<xsl:template match="panel[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">panel</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="computer[@ref]">
		<xsl:param name="machine" select="''"/>
		<xsl:param name="machineState" select="''"/>
		<xsl:variable name="componentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($componentFile)/computer">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="machineState" select="$machineState"/>
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="computer[not(@ref)]">
		<xsl:param name="machine" select="''"/>
		<xsl:param name="machineState" select="''"/>
		<xsl:variable name="buswidth">
			<xsl:choose>
				<xsl:when test="@buswidth"><xsl:value-of select="@buswidth"/></xsl:when>
				<xsl:otherwise>20</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="resume">
			<xsl:choose>
				<xsl:when test="@resume and $machineState = ''"><xsl:value-of select="@resume"/></xsl:when>
				<xsl:otherwise>0</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="state">
			<xsl:choose>
				<xsl:when test="$machineState != ''"><xsl:value-of select="$machineState"/></xsl:when>
				<xsl:when test="@state"><xsl:value-of select="@state"/></xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="component">
			<xsl:with-param name="machine" select="$machine"/>
			<xsl:with-param name="class">computer</xsl:with-param>
			<xsl:with-param name="parms">,buswidth:'<xsl:value-of select="$buswidth"/>',resume:'<xsl:value-of select="$resume"/>',state:'<xsl:value-of select="$state"/>'</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

</xsl:stylesheet>
