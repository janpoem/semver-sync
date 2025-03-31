(()=>{"use strict";var e={7706:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.UseOnigurumaFindOptions=t.DebugFlags=void 0,t.DebugFlags={InDebugMode:"undefined"!=typeof process&&!!process.env.VSCODE_TEXTMATE_DEBUG},t.UseOnigurumaFindOptions=!1},8802:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.applyStateStackDiff=t.diffStateStacksRefEq=void 0;let o=r(4620);t.diffStateStacksRefEq=function(e,t){let r=0,o=[],n=e,a=t;for(;n!==a;)n&&(!a||n.depth>=a.depth)?(r++,n=n.parent):(o.push(a.toStateStackFrame()),a=a.parent);return{pops:r,newFrames:o.reverse()}},t.applyStateStackDiff=function(e,t){let r=e;for(let e=0;e<t.pops;e++)r=r.parent;for(let e of t.newFrames)r=o.StateStackImpl.pushFrame(r,e);return r}},8681:function(e,t){var r;Object.defineProperty(t,"__esModule",{value:!0}),t.toOptionalTokenType=t.EncodedTokenAttributes=void 0,(r=t.EncodedTokenAttributes||(t.EncodedTokenAttributes={})).toBinaryStr=function(e){return e.toString(2).padStart(32,"0")},r.print=function(e){let t=r.getLanguageId(e),o=r.getTokenType(e),n=r.getFontStyle(e);console.log({languageId:t,tokenType:o,fontStyle:n,foreground:r.getForeground(e),background:r.getBackground(e)})},r.getLanguageId=function(e){return(255&e)>>>0},r.getTokenType=function(e){return(768&e)>>>8},r.containsBalancedBrackets=function(e){return(1024&e)!=0},r.getFontStyle=function(e){return(30720&e)>>>11},r.getForeground=function(e){return(0xff8000&e)>>>15},r.getBackground=function(e){return(0xff000000&e)>>>24},r.set=function(e,t,o,n,a,i,s){let d=r.getLanguageId(e),u=r.getTokenType(e),c=+!!r.containsBalancedBrackets(e),l=r.getFontStyle(e),g=r.getForeground(e),f=r.getBackground(e);return 0!==t&&(d=t),8!==o&&(u=o),null!==n&&(c=+!!n),-1!==a&&(l=a),0!==i&&(g=i),0!==s&&(f=s),(d<<0|u<<8|c<<10|l<<11|g<<15|f<<24)>>>0},t.toOptionalTokenType=function(e){return e}},8139:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.BasicScopeAttributesProvider=t.BasicScopeAttributes=void 0;let o=r(9784);class n{constructor(e,t){this.languageId=e,this.tokenType=t}}t.BasicScopeAttributes=n;class a{constructor(e,t){this._getBasicScopeAttributes=new o.CachedFn(e=>new n(this._scopeToLanguage(e),this._toStandardTokenType(e))),this._defaultAttributes=new n(e,8),this._embeddedLanguagesMatcher=new i(Object.entries(t||{}))}getDefaultAttributes(){return this._defaultAttributes}getBasicScopeAttributes(e){return null===e?a._NULL_SCOPE_METADATA:this._getBasicScopeAttributes.get(e)}_scopeToLanguage(e){return this._embeddedLanguagesMatcher.match(e)||0}_toStandardTokenType(e){let t=e.match(a.STANDARD_TOKEN_TYPE_REGEXP);if(!t)return 8;switch(t[1]){case"comment":return 1;case"string":return 2;case"regex":return 3;case"meta.embedded":return 0}throw Error("Unexpected match for standard token type!")}}t.BasicScopeAttributesProvider=a,a._NULL_SCOPE_METADATA=new n(0,0),a.STANDARD_TOKEN_TYPE_REGEXP=/\b(comment|string|regex|meta\.embedded)\b/;class i{constructor(e){if(0===e.length)this.values=null,this.scopesRegExp=null;else{this.values=new Map(e);let t=e.map(([e,t])=>o.escapeRegExpCharacters(e));t.sort(),t.reverse(),this.scopesRegExp=RegExp(`^((${t.join(")|(")}))($|\\.)`,"")}}match(e){if(!this.scopesRegExp)return;let t=e.match(this.scopesRegExp);if(t)return this.values.get(t[1])}}},5154:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.LineTokens=t.BalancedBracketSelectors=t.StateStackImpl=t.AttributedScopeStack=t.Grammar=t.createGrammar=void 0;let o=r(7706),n=r(8681),a=r(6785),i=r(338),s=r(5134),d=r(6242),u=r(9784),c=r(8139),l=r(5259);function g(e,t,r,o,n){let i=a.createMatchers(t,f),d=s.RuleFactory.getCompiledRuleId(r,o,n.repository);for(let r of i)e.push({debugSelector:t,matcher:r.matcher,ruleId:d,grammar:n,priority:r.priority})}function f(e,t){if(t.length<e.length)return!1;let r=0;return e.every(e=>{for(let o=r;o<t.length;o++)if(function(e,t){if(!e)return!1;if(e===t)return!0;let r=t.length;return e.length>r&&e.substr(0,r)===t&&"."===e[r]}(t[o],e))return r=o+1,!0;return!1})}t.createGrammar=function(e,t,r,o,n,a,i,s){return new p(e,t,r,o,n,a,i,s)};class p{constructor(e,t,r,o,n,i,s,d){if(this._rootScopeName=e,this.balancedBracketSelectors=i,this._onigLib=d,this._basicScopeAttributesProvider=new c.BasicScopeAttributesProvider(r,o),this._rootId=-1,this._lastRuleId=0,this._ruleId2desc=[null],this._includedGrammars={},this._grammarRepository=s,this._grammar=h(t,null),this._injections=null,this._tokenTypeMatchers=[],n)for(let e of Object.keys(n))for(let t of a.createMatchers(e,f))this._tokenTypeMatchers.push({matcher:t.matcher,type:n[e]})}get themeProvider(){return this._grammarRepository}dispose(){for(let e of this._ruleId2desc)e&&e.dispose()}createOnigScanner(e){return this._onigLib.createOnigScanner(e)}createOnigString(e){return this._onigLib.createOnigString(e)}getMetadataForScope(e){return this._basicScopeAttributesProvider.getBasicScopeAttributes(e)}_collectInjections(){let e=[],t=this._rootScopeName,r=({lookup:e=>e===this._rootScopeName?this._grammar:this.getExternalGrammar(e),injections:e=>this._grammarRepository.injections(e)}).lookup(t);if(r){let o=r.injections;if(o)for(let t in o)g(e,t,o[t],this,r);let n=this._grammarRepository.injections(t);n&&n.forEach(t=>{let r=this.getExternalGrammar(t);if(r){let t=r.injectionSelector;t&&g(e,t,r,this,r)}})}return e.sort((e,t)=>e.priority-t.priority),e}getInjections(){if(null===this._injections&&(this._injections=this._collectInjections(),o.DebugFlags.InDebugMode&&this._injections.length>0))for(let e of(console.log(`Grammar ${this._rootScopeName} contains the following injections:`),this._injections))console.log(`  - ${e.debugSelector}`);return this._injections}registerRule(e){let t=++this._lastRuleId,r=e(s.ruleIdFromNumber(t));return this._ruleId2desc[t]=r,r}getRule(e){return this._ruleId2desc[s.ruleIdToNumber(e)]}getExternalGrammar(e,t){if(this._includedGrammars[e])return this._includedGrammars[e];if(this._grammarRepository){let r=this._grammarRepository.lookup(e);if(r)return this._includedGrammars[e]=h(r,t&&t.$base),this._includedGrammars[e]}}tokenizeLine(e,t,r=0){let o=this._tokenize(e,t,!1,r);return{tokens:o.lineTokens.getResult(o.ruleStack,o.lineLength),ruleStack:o.ruleStack,stoppedEarly:o.stoppedEarly}}tokenizeLine2(e,t,r=0){let o=this._tokenize(e,t,!0,r);return{tokens:o.lineTokens.getBinaryResult(o.ruleStack,o.lineLength),ruleStack:o.ruleStack,stoppedEarly:o.stoppedEarly}}_tokenize(e,t,r,o){let a;if(-1===this._rootId&&(this._rootId=s.RuleFactory.getCompiledRuleId(this._grammar.repository.$self,this,this._grammar.repository),this.getInjections()),t&&t!==k.NULL)a=!1,t.reset();else{let e;a=!0;let r=this._basicScopeAttributesProvider.getDefaultAttributes(),o=this.themeProvider.getDefaults(),i=n.EncodedTokenAttributes.set(0,r.languageId,r.tokenType,null,o.fontStyle,o.foregroundId,o.backgroundId),s=this.getRule(this._rootId).getName(null,null);e=s?m.createRootAndLookUpScopeName(s,i,this):m.createRoot("unknown",i),t=new k(null,this._rootId,-1,-1,!1,null,e,e)}e+="\n";let d=this.createOnigString(e),u=d.content.length,c=new b(r,e,this._tokenTypeMatchers,this.balancedBracketSelectors),g=l._tokenizeString(this,d,a,0,t,c,!0,o);return i.disposeOnigString(d),{lineLength:u,lineTokens:c,ruleStack:g.stack,stoppedEarly:g.stoppedEarly}}}function h(e,t){return(e=u.clone(e)).repository=e.repository||{},e.repository.$self={$vscodeTextmateLocation:e.$vscodeTextmateLocation,patterns:e.patterns,name:e.scopeName},e.repository.$base=t||e.repository.$self,e}t.Grammar=p;class m{constructor(e,t,r){this.parent=e,this.scopePath=t,this.tokenAttributes=r}static fromExtension(e,t){let r=e,o=e?.scopePath??null;for(let e of t)r=new m(r,o=d.ScopeStack.push(o,e.scopeNames),e.encodedTokenAttributes);return r}static createRoot(e,t){return new m(null,new d.ScopeStack(null,e),t)}static createRootAndLookUpScopeName(e,t,r){let o=r.getMetadataForScope(e),n=new d.ScopeStack(null,e),a=r.themeProvider.themeMatch(n),i=m.mergeAttributes(t,o,a);return new m(null,n,i)}get scopeName(){return this.scopePath.scopeName}toString(){return this.getScopeNames().join(" ")}equals(e){return m.equals(this,e)}static equals(e,t){for(;;){if(e===t||!e&&!t)return!0;if(!e||!t||e.scopeName!==t.scopeName||e.tokenAttributes!==t.tokenAttributes)return!1;e=e.parent,t=t.parent}}static mergeAttributes(e,t,r){let o=-1,a=0,i=0;return null!==r&&(o=r.fontStyle,a=r.foregroundId,i=r.backgroundId),n.EncodedTokenAttributes.set(e,t.languageId,t.tokenType,null,o,a,i)}pushAttributed(e,t){if(null===e)return this;if(-1===e.indexOf(" "))return m._pushAttributed(this,e,t);let r=e.split(/ /g),o=this;for(let e of r)o=m._pushAttributed(o,e,t);return o}static _pushAttributed(e,t,r){let o=r.getMetadataForScope(t),n=e.scopePath.push(t),a=r.themeProvider.themeMatch(n),i=m.mergeAttributes(e.tokenAttributes,o,a);return new m(e,n,i)}getScopeNames(){return this.scopePath.getSegments()}getExtensionIfDefined(e){let t=[],r=this;for(;r&&r!==e;)t.push({encodedTokenAttributes:r.tokenAttributes,scopeNames:r.scopePath.getExtensionIfDefined(r.parent?.scopePath??null)}),r=r.parent;return r===e?t.reverse():void 0}}t.AttributedScopeStack=m;class k{constructor(e,t,r,o,n,a,i,s){this.parent=e,this.ruleId=t,this.beginRuleCapturedEOL=n,this.endRule=a,this.nameScopesList=i,this.contentNameScopesList=s,this._stackElementBrand=void 0,this.depth=this.parent?this.parent.depth+1:1,this._enterPos=r,this._anchorPos=o}equals(e){return null!==e&&k._equals(this,e)}static _equals(e,t){return e===t||!!this._structuralEquals(e,t)&&m.equals(e.contentNameScopesList,t.contentNameScopesList)}static _structuralEquals(e,t){for(;;){if(e===t||!e&&!t)return!0;if(!e||!t||e.depth!==t.depth||e.ruleId!==t.ruleId||e.endRule!==t.endRule)return!1;e=e.parent,t=t.parent}}clone(){return this}static _reset(e){for(;e;)e._enterPos=-1,e._anchorPos=-1,e=e.parent}reset(){k._reset(this)}pop(){return this.parent}safePop(){return this.parent?this.parent:this}push(e,t,r,o,n,a,i){return new k(this,e,t,r,o,n,a,i)}getEnterPos(){return this._enterPos}getAnchorPos(){return this._anchorPos}getRule(e){return e.getRule(this.ruleId)}toString(){let e=[];return this._writeString(e,0),"["+e.join(",")+"]"}_writeString(e,t){return this.parent&&(t=this.parent._writeString(e,t)),e[t++]=`(${this.ruleId}, ${this.nameScopesList?.toString()}, ${this.contentNameScopesList?.toString()})`,t}withContentNameScopesList(e){return this.contentNameScopesList===e?this:this.parent.push(this.ruleId,this._enterPos,this._anchorPos,this.beginRuleCapturedEOL,this.endRule,this.nameScopesList,e)}withEndRule(e){return this.endRule===e?this:new k(this.parent,this.ruleId,this._enterPos,this._anchorPos,this.beginRuleCapturedEOL,e,this.nameScopesList,this.contentNameScopesList)}hasSameRuleAs(e){let t=this;for(;t&&t._enterPos===e._enterPos;){if(t.ruleId===e.ruleId)return!0;t=t.parent}return!1}toStateStackFrame(){return{ruleId:s.ruleIdToNumber(this.ruleId),beginRuleCapturedEOL:this.beginRuleCapturedEOL,endRule:this.endRule,nameScopesList:this.nameScopesList?.getExtensionIfDefined(this.parent?.nameScopesList??null)??[],contentNameScopesList:this.contentNameScopesList?.getExtensionIfDefined(this.nameScopesList)??[]}}static pushFrame(e,t){let r=m.fromExtension(e?.nameScopesList??null,t.nameScopesList);return new k(e,s.ruleIdFromNumber(t.ruleId),t.enterPos??-1,t.anchorPos??-1,t.beginRuleCapturedEOL,t.endRule,r,m.fromExtension(r,t.contentNameScopesList))}}t.StateStackImpl=k,k.NULL=new k(null,0,0,0,!1,null,null,null),t.BalancedBracketSelectors=class{constructor(e,t){this.allowAny=!1,this.balancedBracketScopes=e.flatMap(e=>"*"===e?(this.allowAny=!0,[]):a.createMatchers(e,f).map(e=>e.matcher)),this.unbalancedBracketScopes=t.flatMap(e=>a.createMatchers(e,f).map(e=>e.matcher))}get matchesAlways(){return this.allowAny&&0===this.unbalancedBracketScopes.length}get matchesNever(){return 0===this.balancedBracketScopes.length&&!this.allowAny}match(e){for(let t of this.unbalancedBracketScopes)if(t(e))return!1;for(let t of this.balancedBracketScopes)if(t(e))return!0;return this.allowAny}};class b{constructor(e,t,r,n){this.balancedBracketSelectors=n,this._emitBinaryTokens=e,this._tokenTypeOverrides=r,o.DebugFlags.InDebugMode?this._lineText=t:this._lineText=null,this._tokens=[],this._binaryTokens=[],this._lastTokenEndIndex=0}produce(e,t){this.produceFromScopes(e.contentNameScopesList,t)}produceFromScopes(e,t){if(this._lastTokenEndIndex>=t)return;if(this._emitBinaryTokens){let r=e?.tokenAttributes??0,a=!1;if(this.balancedBracketSelectors?.matchesAlways&&(a=!0),this._tokenTypeOverrides.length>0||this.balancedBracketSelectors&&!this.balancedBracketSelectors.matchesAlways&&!this.balancedBracketSelectors.matchesNever){let t=e?.getScopeNames()??[];for(let e of this._tokenTypeOverrides)e.matcher(t)&&(r=n.EncodedTokenAttributes.set(r,0,n.toOptionalTokenType(e.type),null,-1,0,0));this.balancedBracketSelectors&&(a=this.balancedBracketSelectors.match(t))}if(a&&(r=n.EncodedTokenAttributes.set(r,0,8,a,-1,0,0)),this._binaryTokens.length>0&&this._binaryTokens[this._binaryTokens.length-1]===r){this._lastTokenEndIndex=t;return}if(o.DebugFlags.InDebugMode){let r=e?.getScopeNames()??[];console.log("  token: |"+this._lineText.substring(this._lastTokenEndIndex,t).replace(/\n$/,"\\n")+"|");for(let e=0;e<r.length;e++)console.log("      * "+r[e])}this._binaryTokens.push(this._lastTokenEndIndex),this._binaryTokens.push(r),this._lastTokenEndIndex=t;return}let r=e?.getScopeNames()??[];if(o.DebugFlags.InDebugMode){console.log("  token: |"+this._lineText.substring(this._lastTokenEndIndex,t).replace(/\n$/,"\\n")+"|");for(let e=0;e<r.length;e++)console.log("      * "+r[e])}this._tokens.push({startIndex:this._lastTokenEndIndex,endIndex:t,scopes:r}),this._lastTokenEndIndex=t}getResult(e,t){return this._tokens.length>0&&this._tokens[this._tokens.length-1].startIndex===t-1&&this._tokens.pop(),0===this._tokens.length&&(this._lastTokenEndIndex=-1,this.produce(e,t),this._tokens[this._tokens.length-1].startIndex=0),this._tokens}getBinaryResult(e,t){this._binaryTokens.length>0&&this._binaryTokens[this._binaryTokens.length-2]===t-1&&(this._binaryTokens.pop(),this._binaryTokens.pop()),0===this._binaryTokens.length&&(this._lastTokenEndIndex=-1,this.produce(e,t),this._binaryTokens[this._binaryTokens.length-2]=0);let r=new Uint32Array(this._binaryTokens.length);for(let e=0,t=this._binaryTokens.length;e<t;e++)r[e]=this._binaryTokens[e];return r}}t.LineTokens=b},938:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.parseInclude=t.TopLevelRepositoryReference=t.TopLevelReference=t.RelativeReference=t.SelfReference=t.BaseReference=t.ScopeDependencyProcessor=t.ExternalReferenceCollector=t.TopLevelRepositoryRuleReference=t.TopLevelRuleReference=void 0;let o=r(9784);class n{constructor(e){this.scopeName=e}toKey(){return this.scopeName}}t.TopLevelRuleReference=n;class a{constructor(e,t){this.scopeName=e,this.ruleName=t}toKey(){return`${this.scopeName}#${this.ruleName}`}}t.TopLevelRepositoryRuleReference=a;class i{constructor(){this._references=[],this._seenReferenceKeys=new Set,this.visitedRule=new Set}get references(){return this._references}add(e){let t=e.toKey();!this._seenReferenceKeys.has(t)&&(this._seenReferenceKeys.add(t),this._references.push(e))}}function s(e,t,r){t.repository&&t.repository[e]&&u([t.repository[e]],t,r)}function d(e,t){e.selfGrammar.patterns&&Array.isArray(e.selfGrammar.patterns)&&u(e.selfGrammar.patterns,{...e,repository:e.selfGrammar.repository},t),e.selfGrammar.injections&&u(Object.values(e.selfGrammar.injections),{...e,repository:e.selfGrammar.repository},t)}function u(e,t,r){for(let i of e){if(r.visitedRule.has(i))continue;r.visitedRule.add(i);let e=i.repository?o.mergeObjects({},t.repository,i.repository):t.repository;Array.isArray(i.patterns)&&u(i.patterns,{...t,repository:e},r);let c=i.include;if(!c)continue;let l=h(c);switch(l.kind){case 0:d({...t,selfGrammar:t.baseGrammar},r);break;case 1:d(t,r);break;case 2:s(l.ruleName,{...t,repository:e},r);break;case 3:case 4:let g=l.scopeName===t.selfGrammar.scopeName?t.selfGrammar:l.scopeName===t.baseGrammar.scopeName?t.baseGrammar:void 0;if(g){let o={baseGrammar:t.baseGrammar,selfGrammar:g,repository:e};4===l.kind?s(l.ruleName,o,r):d(o,r)}else 4===l.kind?r.add(new a(l.scopeName,l.ruleName)):r.add(new n(l.scopeName))}}}t.ExternalReferenceCollector=i,t.ScopeDependencyProcessor=class{constructor(e,t){this.repo=e,this.initialScopeName=t,this.seenFullScopeRequests=new Set,this.seenPartialScopeRequests=new Set,this.seenFullScopeRequests.add(this.initialScopeName),this.Q=[new n(this.initialScopeName)]}processQueue(){let e=this.Q;this.Q=[];let t=new i;for(let r of e)!function(e,t,r,o){let a=r.lookup(e.scopeName);if(!a){if(e.scopeName===t)throw Error(`No grammar provided for <${t}>`);return}let i=r.lookup(t);e instanceof n?d({baseGrammar:i,selfGrammar:a},o):s(e.ruleName,{baseGrammar:i,selfGrammar:a,repository:a.repository},o);let u=r.injections(e.scopeName);if(u)for(let e of u)o.add(new n(e))}(r,this.initialScopeName,this.repo,t);for(let e of t.references)if(e instanceof n){if(this.seenFullScopeRequests.has(e.scopeName))continue;this.seenFullScopeRequests.add(e.scopeName),this.Q.push(e)}else{if(this.seenFullScopeRequests.has(e.scopeName)||this.seenPartialScopeRequests.has(e.toKey()))continue;this.seenPartialScopeRequests.add(e.toKey()),this.Q.push(e)}}};class c{constructor(){this.kind=0}}t.BaseReference=c;class l{constructor(){this.kind=1}}t.SelfReference=l;class g{constructor(e){this.ruleName=e,this.kind=2}}t.RelativeReference=g;class f{constructor(e){this.scopeName=e,this.kind=3}}t.TopLevelReference=f;class p{constructor(e,t){this.scopeName=e,this.ruleName=t,this.kind=4}}function h(e){if("$base"===e)return new c;if("$self"===e)return new l;let t=e.indexOf("#");return -1===t?new f(e):0===t?new g(e.substring(1)):new p(e.substring(0,t),e.substring(t+1))}t.TopLevelRepositoryReference=p,t.parseInclude=h},4620:function(e,t,r){var o=this&&this.__createBinding||(Object.create?function(e,t,r,o){void 0===o&&(o=r),Object.defineProperty(e,o,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,o){void 0===o&&(o=r),e[o]=t[r]}),n=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||o(t,e,r)};Object.defineProperty(t,"__esModule",{value:!0}),n(r(5154),t)},5259:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.LocalStackElement=t._tokenizeString=void 0;let o=r(7706),n=r(338),a=r(5134),i=r(9784);class s{constructor(e,t){this.stack=e,this.stoppedEarly=t}}function d(e,t,r,n,d,g,f,p){let h=t.content.length,m=!1,k=-1;if(f){let i=function(e,t,r,n,i,s){let d=i.beginRuleCapturedEOL?0:-1,u=[];for(let t=i;t;t=t.pop()){let r=t.getRule(e);r instanceof a.BeginWhileRule&&u.push({rule:r,stack:t})}for(let k=u.pop();k;k=u.pop()){var g,f,p,h,m;let{ruleScanner:u,findOptions:b}=(g=k.rule,f=e,p=k.stack.endRule,h=r,m=n===d,o.UseOnigurumaFindOptions?{ruleScanner:g.compileWhile(f,p),findOptions:c(h,m)}:{ruleScanner:g.compileWhileAG(f,p,h,m),findOptions:0}),y=u.findNextMatchSync(t,n,b);if(o.DebugFlags.InDebugMode&&(console.log("  scanning for while rule"),console.log(u.toString())),y){if(y.ruleId!==a.whileRuleId){i=k.stack.pop();break}y.captureIndices&&y.captureIndices.length&&(s.produce(k.stack,y.captureIndices[0].start),l(e,t,r,k.stack,s,k.rule.whileCaptures,y.captureIndices),s.produce(k.stack,y.captureIndices[0].end),d=y.captureIndices[0].end,y.captureIndices[0].end>n&&(n=y.captureIndices[0].end,r=!1))}else{o.DebugFlags.InDebugMode&&console.log("  popping "+k.rule.debugName+" - "+k.rule.debugWhileRegExp),i=k.stack.pop();break}}return{stack:i,linePos:n,anchorPosition:d,isFirstLine:r}}(e,t,r,n,d,g);d=i.stack,n=i.linePos,r=i.isFirstLine,k=i.anchorPosition}let b=Date.now();for(;!m;){if(0!==p&&Date.now()-b>p)return new s(d,!0);!function(){o.DebugFlags.InDebugMode&&(console.log(""),console.log(`@@scanNext ${n}: |${t.content.substr(n).replace(/\n$/,"\\n")}|`));let s=function(e,t,r,n,a,s){let d=function(e,t,r,n,a,s){let d=a.getRule(e),{ruleScanner:c,findOptions:l}=u(d,e,a.endRule,r,n===s),g=0;o.DebugFlags.InDebugMode&&(g=i.performanceNow());let f=c.findNextMatchSync(t,n,l);if(o.DebugFlags.InDebugMode){let e=i.performanceNow()-g;e>5&&console.warn(`Rule ${d.debugName} (${d.id}) matching took ${e} against '${t}'`),console.log(`  scanning for (linePos: ${n}, anchorPosition: ${s})`),console.log(c.toString()),f&&console.log(`matched rule id: ${f.ruleId} from ${f.captureIndices[0].start} to ${f.captureIndices[0].end}`)}return f?{captureIndices:f.captureIndices,matchedRuleId:f.ruleId}:null}(e,t,r,n,a,s),c=e.getInjections();if(0===c.length)return d;let l=function(e,t,r,n,a,i,s){let d,c=Number.MAX_VALUE,l=null,g=0,f=i.contentNameScopesList.getScopeNames();for(let i=0,p=e.length;i<p;i++){let p=e[i];if(!p.matcher(f))continue;let{ruleScanner:h,findOptions:m}=u(t.getRule(p.ruleId),t,null,n,a===s),k=h.findNextMatchSync(r,a,m);if(!k)continue;o.DebugFlags.InDebugMode&&(console.log(`  matched injection: ${p.debugSelector}`),console.log(h.toString()));let b=k.captureIndices[0].start;if(!(b>=c)&&(c=b,l=k.captureIndices,d=k.ruleId,g=p.priority,c===a))break}return l?{priorityMatch:-1===g,captureIndices:l,matchedRuleId:d}:null}(c,e,t,r,n,a,s);if(!l)return d;if(!d)return l;let g=d.captureIndices[0].start,f=l.captureIndices[0].start;return f<g||l.priorityMatch&&f===g?l:d}(e,t,r,n,d,k);if(!s){o.DebugFlags.InDebugMode&&console.log("  no more matches."),g.produce(d,h),m=!0;return}let c=s.captureIndices,f=s.matchedRuleId,p=!!c&&c.length>0&&c[0].end>n;if(f===a.endRuleId){let a=d.getRule(e);o.DebugFlags.InDebugMode&&console.log("  popping "+a.debugName+" - "+a.debugEndRegExp),g.produce(d,c[0].start),d=d.withContentNameScopesList(d.nameScopesList),l(e,t,r,d,g,a.endCaptures,c),g.produce(d,c[0].end);let i=d;if(d=d.parent,k=i.getAnchorPos(),!p&&i.getEnterPos()===n){o.DebugFlags.InDebugMode&&console.error("[1] - Grammar is in an endless loop - Grammar pushed & popped a rule without advancing"),d=i,g.produce(d,h),m=!0;return}}else{let i=e.getRule(f);g.produce(d,c[0].start);let s=d,u=i.getName(t.content,c),b=d.contentNameScopesList.pushAttributed(u,e);if(d=d.push(f,n,k,c[0].end===h,null,b,b),i instanceof a.BeginEndRule){o.DebugFlags.InDebugMode&&console.log("  pushing "+i.debugName+" - "+i.debugBeginRegExp),l(e,t,r,d,g,i.beginCaptures,c),g.produce(d,c[0].end),k=c[0].end;let n=i.getContentName(t.content,c),a=b.pushAttributed(n,e);if(d=d.withContentNameScopesList(a),i.endHasBackReferences&&(d=d.withEndRule(i.getEndWithResolvedBackReferences(t.content,c))),!p&&s.hasSameRuleAs(d)){o.DebugFlags.InDebugMode&&console.error("[2] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"),d=d.pop(),g.produce(d,h),m=!0;return}}else if(i instanceof a.BeginWhileRule){o.DebugFlags.InDebugMode&&console.log("  pushing "+i.debugName),l(e,t,r,d,g,i.beginCaptures,c),g.produce(d,c[0].end),k=c[0].end;let n=i.getContentName(t.content,c),a=b.pushAttributed(n,e);if(d=d.withContentNameScopesList(a),i.whileHasBackReferences&&(d=d.withEndRule(i.getWhileWithResolvedBackReferences(t.content,c))),!p&&s.hasSameRuleAs(d)){o.DebugFlags.InDebugMode&&console.error("[3] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"),d=d.pop(),g.produce(d,h),m=!0;return}}else if(o.DebugFlags.InDebugMode&&console.log("  matched "+i.debugName+" - "+i.debugMatchRegExp),l(e,t,r,d,g,i.captures,c),g.produce(d,c[0].end),d=d.pop(),!p){o.DebugFlags.InDebugMode&&console.error("[4] - Grammar is in an endless loop - Grammar is not advancing, nor is it pushing/popping"),d=d.safePop(),g.produce(d,h),m=!0;return}}c[0].end>n&&(n=c[0].end,r=!1)}()}return new s(d,!1)}function u(e,t,r,n,a){return o.UseOnigurumaFindOptions?{ruleScanner:e.compile(t,r),findOptions:c(n,a)}:{ruleScanner:e.compileAG(t,r,n,a),findOptions:0}}function c(e,t){let r=0;return e||(r|=1),t||(r|=4),r}function l(e,t,r,o,a,i,s){if(0===i.length)return;let u=t.content,c=Math.min(i.length,s.length),l=[],f=s[0].end;for(let t=0;t<c;t++){let c=i[t];if(null===c)continue;let p=s[t];if(0===p.length)continue;if(p.start>f)break;for(;l.length>0&&l[l.length-1].endPos<=p.start;)a.produceFromScopes(l[l.length-1].scopes,l[l.length-1].endPos),l.pop();if(l.length>0?a.produceFromScopes(l[l.length-1].scopes,p.start):a.produce(o,p.start),c.retokenizeCapturedWithRuleId){let t=c.getName(u,s),i=o.contentNameScopesList.pushAttributed(t,e),l=c.getContentName(u,s),g=i.pushAttributed(l,e),f=o.push(c.retokenizeCapturedWithRuleId,p.start,-1,!1,null,i,g),h=e.createOnigString(u.substring(0,p.end));d(e,h,r&&0===p.start,p.start,f,a,!1,0),n.disposeOnigString(h);continue}let h=c.getName(u,s);if(null!==h){let t=(l.length>0?l[l.length-1].scopes:o.contentNameScopesList).pushAttributed(h,e);l.push(new g(t,p.end))}}for(;l.length>0;)a.produceFromScopes(l[l.length-1].scopes,l[l.length-1].endPos),l.pop()}t._tokenizeString=d;class g{constructor(e,t){this.scopes=e,this.endPos=t}}t.LocalStackElement=g},2952:function(e,t){function r(e,t){throw Error("Near offset "+e.pos+": "+t+" ~~~"+e.source.substr(e.pos,50)+"~~~")}Object.defineProperty(t,"__esModule",{value:!0}),t.parseJSON=void 0,t.parseJSON=function(e,t,i){let s=new o(e),d=new n,u=0,c=null,l=[],g=[];function f(){l.push(u),g.push(c)}function p(){u=l.pop(),c=g.pop()}function h(e){r(s,e)}for(;a(s,d);){if(0===u){if(null!==c&&h("too many constructs in root"),3===d.type){c={},i&&(c.$vscodeTextmateLocation=d.toLocation(t)),f(),u=1;continue}if(2===d.type){c=[],f(),u=4;continue}h("unexpected token in root")}if(2===u){if(5===d.type){p();continue}if(7===d.type){u=3;continue}h("expected , or }")}if(1===u||3===u){if(1===u&&5===d.type){p();continue}if(1===d.type){let e=d.value;if(a(s,d)&&6===d.type||h("expected colon"),a(s,d)||h("expected value"),u=2,1===d.type){c[e]=d.value;continue}if(8===d.type){c[e]=null;continue}if(9===d.type){c[e]=!0;continue}if(10===d.type){c[e]=!1;continue}if(11===d.type){c[e]=parseFloat(d.value);continue}if(2===d.type){let t=[];c[e]=t,f(),u=4,c=t;continue}if(3===d.type){let r={};i&&(r.$vscodeTextmateLocation=d.toLocation(t)),c[e]=r,f(),u=1,c=r;continue}}h("unexpected token in dict")}if(5===u){if(4===d.type){p();continue}if(7===d.type){u=6;continue}h("expected , or ]")}if(4===u||6===u){if(4===u&&4===d.type){p();continue}if(u=5,1===d.type){c.push(d.value);continue}if(8===d.type){c.push(null);continue}if(9===d.type){c.push(!0);continue}if(10===d.type){c.push(!1);continue}if(11===d.type){c.push(parseFloat(d.value));continue}if(2===d.type){let e=[];c.push(e),f(),u=4,c=e;continue}if(3===d.type){let e={};i&&(e.$vscodeTextmateLocation=d.toLocation(t)),c.push(e),f(),u=1,c=e;continue}h("unexpected token in array")}h("unknown state")}return 0!==g.length&&h("unclosed constructs"),c};class o{constructor(e){this.source=e,this.pos=0,this.len=e.length,this.line=1,this.char=0}}class n{constructor(){this.value=null,this.type=0,this.offset=-1,this.len=-1,this.line=-1,this.char=-1}toLocation(e){return{filename:e,line:this.line,char:this.char}}}function a(e,t){let o;t.value=null,t.type=0,t.offset=-1,t.len=-1,t.line=-1,t.char=-1;let n=e.source,a=e.pos,i=e.len,s=e.line,d=e.char;for(;;){if(a>=i)return!1;if(32===(o=n.charCodeAt(a))||9===o||13===o){a++,d++;continue}if(10===o){a++,s++,d=0;continue}break}if(t.offset=a,t.line=s,t.char=d,34===o){for(t.type=1,a++,d++;;){if(a>=i)return!1;if(o=n.charCodeAt(a),a++,d++,92===o){a++,d++;continue}if(34===o)break}t.value=n.substring(t.offset+1,a-1).replace(/\\u([0-9A-Fa-f]{4})/g,(e,t)=>String.fromCodePoint(parseInt(t,16))).replace(/\\(.)/g,(t,o)=>{switch(o){case'"':return'"';case"\\":return"\\";case"/":return"/";case"b":return"\b";case"f":return"\f";case"n":return"\n";case"r":return"\r";case"t":return"	";default:r(e,"invalid escape sequence")}throw Error("unreachable")})}else if(91===o)t.type=2,a++,d++;else if(123===o)t.type=3,a++,d++;else if(93===o)t.type=4,a++,d++;else if(125===o)t.type=5,a++,d++;else if(58===o)t.type=6,a++,d++;else if(44===o)t.type=7,a++,d++;else if(110===o){if(t.type=8,a++,d++,117!==(o=n.charCodeAt(a))||(a++,d++,108!==(o=n.charCodeAt(a)))||(a++,d++,108!==(o=n.charCodeAt(a))))return!1;a++,d++}else if(116===o){if(t.type=9,a++,d++,114!==(o=n.charCodeAt(a))||(a++,d++,117!==(o=n.charCodeAt(a)))||(a++,d++,101!==(o=n.charCodeAt(a))))return!1;a++,d++}else if(102===o){if(t.type=10,a++,d++,97!==(o=n.charCodeAt(a))||(a++,d++,108!==(o=n.charCodeAt(a)))||(a++,d++,115!==(o=n.charCodeAt(a)))||(a++,d++,101!==(o=n.charCodeAt(a))))return!1;a++,d++}else for(t.type=11;;){if(a>=i)return!1;if(46===(o=n.charCodeAt(a))||o>=48&&o<=57||101===o||69===o||45===o||43===o){a++,d++;continue}break}return t.len=a-t.offset,null===t.value&&(t.value=n.substr(t.offset,t.len)),e.pos=a,e.line=s,e.char=d,!0}},3092:function(e,t,r){var o=this&&this.__createBinding||(Object.create?function(e,t,r,o){void 0===o&&(o=r),Object.defineProperty(e,o,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,o){void 0===o&&(o=r),e[o]=t[r]}),n=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||o(t,e,r)};Object.defineProperty(t,"__esModule",{value:!0}),t.applyStateStackDiff=t.diffStateStacksRefEq=t.parseRawGrammar=t.INITIAL=t.Registry=void 0;let a=r(4620),i=r(9778),s=r(3378),d=r(6242),u=r(938),c=r(8802);Object.defineProperty(t,"applyStateStackDiff",{enumerable:!0,get:function(){return c.applyStateStackDiff}}),Object.defineProperty(t,"diffStateStacksRefEq",{enumerable:!0,get:function(){return c.diffStateStacksRefEq}}),n(r(338),t),t.Registry=class{constructor(e){this._options=e,this._syncRegistry=new s.SyncRegistry(d.Theme.createFromRawTheme(e.theme,e.colorMap),e.onigLib),this._ensureGrammarCache=new Map}dispose(){this._syncRegistry.dispose()}setTheme(e,t){this._syncRegistry.setTheme(d.Theme.createFromRawTheme(e,t))}getColorMap(){return this._syncRegistry.getColorMap()}loadGrammarWithEmbeddedLanguages(e,t,r){return this.loadGrammarWithConfiguration(e,t,{embeddedLanguages:r})}loadGrammarWithConfiguration(e,t,r){return this._loadGrammar(e,t,r.embeddedLanguages,r.tokenTypes,new a.BalancedBracketSelectors(r.balancedBracketSelectors||[],r.unbalancedBracketSelectors||[]))}loadGrammar(e){return this._loadGrammar(e,0,null,null,null)}async _loadGrammar(e,t,r,o,n){let a=new u.ScopeDependencyProcessor(this._syncRegistry,e);for(;a.Q.length>0;)await Promise.all(a.Q.map(e=>this._loadSingleGrammar(e.scopeName))),a.processQueue();return this._grammarForScopeName(e,t,r,o,n)}async _loadSingleGrammar(e){return this._ensureGrammarCache.has(e)||this._ensureGrammarCache.set(e,this._doLoadSingleGrammar(e)),this._ensureGrammarCache.get(e)}async _doLoadSingleGrammar(e){let t=await this._options.loadGrammar(e);if(t){let r="function"==typeof this._options.getInjections?this._options.getInjections(e):void 0;this._syncRegistry.addGrammar(t,r)}}async addGrammar(e,t=[],r=0,o=null){return this._syncRegistry.addGrammar(e,t),await this._grammarForScopeName(e.scopeName,r,o)}_grammarForScopeName(e,t=0,r=null,o=null,n=null){return this._syncRegistry.grammarForScopeName(e,t,r,o,n)}},t.INITIAL=a.StateStackImpl.NULL,t.parseRawGrammar=i.parseRawGrammar},6785:function(e,t){function r(e){return!!e&&!!e.match(/[\w\.:]+/)}Object.defineProperty(t,"__esModule",{value:!0}),t.createMatchers=void 0,t.createMatchers=function(e,t){var o;let n,a;let i=[],s=(o=e,a=(n=/([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g).exec(o),{next:()=>{if(!a)return null;let e=a[0];return a=n.exec(o),e}}),d=s.next();for(;null!==d;){let e=0;if(2===d.length&&":"===d.charAt(1)){switch(d.charAt(0)){case"R":e=1;break;case"L":e=-1;break;default:console.log(`Unknown priority ${d} in scope selector`)}d=s.next()}let t=c();if(i.push({matcher:t,priority:e}),","!==d)break;d=s.next()}return i;function u(){if("-"===d){d=s.next();let e=u();return t=>!!e&&!e(t)}if("("===d){d=s.next();let e=function(){let e=[],t=c();for(;t&&(e.push(t),"|"===d||","===d);){do d=s.next();while("|"===d||","===d);t=c()}return t=>e.some(e=>e(t))}();return")"===d&&(d=s.next()),e}if(r(d)){let e=[];do e.push(d),d=s.next();while(r(d));return r=>t(e,r)}return null}function c(){let e=[],t=u();for(;t;)e.push(t),t=u();return t=>e.every(e=>e(t))}}},338:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.disposeOnigString=void 0,t.disposeOnigString=function(e){"function"==typeof e.dispose&&e.dispose()}},9778:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.parseRawGrammar=void 0;let o=r(2689),n=r(7706),a=r(2952);t.parseRawGrammar=function(e,t=null){var r,i,s,d;return null!==t&&/\.json$/.test(t)?(r=e,i=t,n.DebugFlags.InDebugMode?a.parseJSON(r,i,!0):JSON.parse(r)):(s=e,d=t,n.DebugFlags.InDebugMode?o.parseWithLocation(s,d,"$vscodeTextmateLocation"):o.parsePLIST(s))}},2689:function(e,t){function r(e,t,r){let o=e.length,n=0,a=1,i=0;function s(t){if(null===r)n+=t;else for(;t>0;)10===e.charCodeAt(n)?(n++,a++,i=0):(n++,i++),t--}function d(e){null===r?n=e:s(e-n)}function u(){for(;n<o;){let t=e.charCodeAt(n);if(32!==t&&9!==t&&13!==t&&10!==t)break;s(1)}}function c(t){return e.substr(n,t.length)===t&&(s(t.length),!0)}function l(t){let r=e.indexOf(t,n);-1!==r?d(r+t.length):d(o)}function g(t){let r=e.indexOf(t,n);if(-1!==r){let o=e.substring(n,r);return d(r+t.length),o}{let t=e.substr(n);return d(o),t}}o>0&&65279===e.charCodeAt(0)&&(n=1);let f=0,p=null,h=[],m=[],k=null;function b(e,t){h.push(f),m.push(p),f=e,p=t}function y(){if(0===h.length)return v("illegal state stack");f=h.pop(),p=m.pop()}function v(t){throw Error("Near offset "+n+": "+t+" ~~~"+e.substr(n,50)+"~~~")}let w={enterDict:function(){if(null===k)return v("missing <key>");let e={};null!==r&&(e[r]={filename:t,line:a,char:i}),p[k]=e,k=null,b(1,e)},enterArray:function(){if(null===k)return v("missing <key>");let e=[];p[k]=e,k=null,b(2,e)}},F={enterDict:function(){let e={};null!==r&&(e[r]={filename:t,line:a,char:i}),p.push(e),b(1,e)},enterArray:function(){let e=[];p.push(e),b(2,e)}};function C(){if(1===f)y();else if(2===f)return v("unexpected </dict>");else return v("unexpected </dict>")}function B(){return 1===f?v("unexpected </array>"):2!==f?v("unexpected </array>"):void y()}function x(e){if(1===f){if(null===k)return v("missing <key>");p[k]=e,k=null}else 2===f?p.push(e):p=e}function A(e){if(e.isClosed)return"";let t=g("</");return l(">"),t.replace(/&#([0-9]+);/g,function(e,t){return String.fromCodePoint(parseInt(t,10))}).replace(/&#x([0-9a-f]+);/g,function(e,t){return String.fromCodePoint(parseInt(t,16))}).replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g,function(e){switch(e){case"&amp;":return"&";case"&lt;":return"<";case"&gt;":return">";case"&quot;":return'"';case"&apos;":return"'"}return e})}for(;n<o&&(u(),!(n>=o));){let d=e.charCodeAt(n);if(s(1),60!==d)return v("expected <");if(n>=o)return v("unexpected end of input");let h=e.charCodeAt(n);if(63===h){s(1),l("?>");continue}if(33===h){if(s(1),c("--")){l("--\x3e");continue}l(">");continue}if(47===h){if(s(1),u(),c("plist")){l(">");continue}if(c("dict")){l(">"),C();continue}if(c("array")){l(">"),B();continue}return v("unexpected closed tag")}let m=function(){let e=g(">"),t=!1;return 47===e.charCodeAt(e.length-1)&&(t=!0,e=e.substring(0,e.length-1)),{name:e.trim(),isClosed:t}}();switch(m.name){case"dict":1===f?w.enterDict():2===f?F.enterDict():(p={},null!==r&&(p[r]={filename:t,line:a,char:i}),b(1,p)),m.isClosed&&C();continue;case"array":1===f?w.enterArray():2===f?F.enterArray():b(2,p=[]),m.isClosed&&B();continue;case"key":!function(e){if(1===f){if(null!==k)return v("too many <key>");k=e}else v("unexpected <key>")}(A(m));continue;case"string":!function(e){if(1===f){if(null===k)return v("missing <key>");p[k]=e,k=null}else 2===f?p.push(e):p=e}(A(m));continue;case"real":!function(e){if(isNaN(e))return v("cannot parse float");if(1===f){if(null===k)return v("missing <key>");p[k]=e,k=null}else 2===f?p.push(e):p=e}(parseFloat(A(m)));continue;case"integer":!function(e){if(isNaN(e))return v("cannot parse integer");if(1===f){if(null===k)return v("missing <key>");p[k]=e,k=null}else 2===f?p.push(e):p=e}(parseInt(A(m),10));continue;case"date":!function(e){if(1===f){if(null===k)return v("missing <key>");p[k]=e,k=null}else 2===f?p.push(e):p=e}(new Date(A(m)));continue;case"data":!function(e){if(1===f){if(null===k)return v("missing <key>");p[k]=e,k=null}else 2===f?p.push(e):p=e}(A(m));continue;case"true":A(m),x(!0);continue;case"false":A(m),x(!1);continue}if(!/^plist/.test(m.name))return v("unexpected opened tag "+m.name)}return p}Object.defineProperty(t,"__esModule",{value:!0}),t.parsePLIST=t.parseWithLocation=void 0,t.parseWithLocation=function(e,t,o){return r(e,t,o)},t.parsePLIST=function(e){return r(e,null,null)}},3378:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.SyncRegistry=void 0;let o=r(4620);t.SyncRegistry=class{constructor(e,t){this._onigLibPromise=t,this._grammars=new Map,this._rawGrammars=new Map,this._injectionGrammars=new Map,this._theme=e}dispose(){for(let e of this._grammars.values())e.dispose()}setTheme(e){this._theme=e}getColorMap(){return this._theme.getColorMap()}addGrammar(e,t){this._rawGrammars.set(e.scopeName,e),t&&this._injectionGrammars.set(e.scopeName,t)}lookup(e){return this._rawGrammars.get(e)}injections(e){return this._injectionGrammars.get(e)}getDefaults(){return this._theme.getDefaults()}themeMatch(e){return this._theme.match(e)}async grammarForScopeName(e,t,r,n,a){if(!this._grammars.has(e)){let i=this._rawGrammars.get(e);if(!i)return null;this._grammars.set(e,o.createGrammar(e,i,t,r,n,a,this,await this._onigLibPromise))}return this._grammars.get(e)}}},5134:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.CompiledRule=t.RegExpSourceList=t.RegExpSource=t.RuleFactory=t.BeginWhileRule=t.BeginEndRule=t.IncludeOnlyRule=t.MatchRule=t.CaptureRule=t.Rule=t.ruleIdToNumber=t.ruleIdFromNumber=t.whileRuleId=t.endRuleId=void 0;let o=r(9784),n=r(938),a=/\\(\d+)/,i=/\\(\d+)/g;Symbol("RuleId"),t.endRuleId=-1,t.whileRuleId=-2,t.ruleIdFromNumber=function(e){return e},t.ruleIdToNumber=function(e){return e};class s{constructor(e,t,r,n){this.$location=e,this.id=t,this._name=r||null,this._nameIsCapturing=o.RegexSource.hasCaptures(this._name),this._contentName=n||null,this._contentNameIsCapturing=o.RegexSource.hasCaptures(this._contentName)}get debugName(){let e=this.$location?`${o.basename(this.$location.filename)}:${this.$location.line}`:"unknown";return`${this.constructor.name}#${this.id} @ ${e}`}getName(e,t){return this._nameIsCapturing&&null!==this._name&&null!==e&&null!==t?o.RegexSource.replaceCaptures(this._name,e,t):this._name}getContentName(e,t){return this._contentNameIsCapturing&&null!==this._contentName?o.RegexSource.replaceCaptures(this._contentName,e,t):this._contentName}}t.Rule=s;class d extends s{constructor(e,t,r,o,n){super(e,t,r,o),this.retokenizeCapturedWithRuleId=n}dispose(){}collectPatterns(e,t){throw Error("Not supported!")}compile(e,t){throw Error("Not supported!")}compileAG(e,t,r,o){throw Error("Not supported!")}}t.CaptureRule=d;class u extends s{constructor(e,t,r,o,n){super(e,t,r,null),this._match=new p(o,this.id),this.captures=n,this._cachedCompiledPatterns=null}dispose(){this._cachedCompiledPatterns&&(this._cachedCompiledPatterns.dispose(),this._cachedCompiledPatterns=null)}get debugMatchRegExp(){return`${this._match.source}`}collectPatterns(e,t){t.push(this._match)}compile(e,t){return this._getCachedCompiledPatterns(e).compile(e)}compileAG(e,t,r,o){return this._getCachedCompiledPatterns(e).compileAG(e,r,o)}_getCachedCompiledPatterns(e){return this._cachedCompiledPatterns||(this._cachedCompiledPatterns=new h,this.collectPatterns(e,this._cachedCompiledPatterns)),this._cachedCompiledPatterns}}t.MatchRule=u;class c extends s{constructor(e,t,r,o,n){super(e,t,r,o),this.patterns=n.patterns,this.hasMissingPatterns=n.hasMissingPatterns,this._cachedCompiledPatterns=null}dispose(){this._cachedCompiledPatterns&&(this._cachedCompiledPatterns.dispose(),this._cachedCompiledPatterns=null)}collectPatterns(e,t){for(let r of this.patterns)e.getRule(r).collectPatterns(e,t)}compile(e,t){return this._getCachedCompiledPatterns(e).compile(e)}compileAG(e,t,r,o){return this._getCachedCompiledPatterns(e).compileAG(e,r,o)}_getCachedCompiledPatterns(e){return this._cachedCompiledPatterns||(this._cachedCompiledPatterns=new h,this.collectPatterns(e,this._cachedCompiledPatterns)),this._cachedCompiledPatterns}}t.IncludeOnlyRule=c;class l extends s{constructor(e,t,r,o,n,a,i,s,d,u){super(e,t,r,o),this._begin=new p(n,this.id),this.beginCaptures=a,this._end=new p(i||"￿",-1),this.endHasBackReferences=this._end.hasBackReferences,this.endCaptures=s,this.applyEndPatternLast=d||!1,this.patterns=u.patterns,this.hasMissingPatterns=u.hasMissingPatterns,this._cachedCompiledPatterns=null}dispose(){this._cachedCompiledPatterns&&(this._cachedCompiledPatterns.dispose(),this._cachedCompiledPatterns=null)}get debugBeginRegExp(){return`${this._begin.source}`}get debugEndRegExp(){return`${this._end.source}`}getEndWithResolvedBackReferences(e,t){return this._end.resolveBackReferences(e,t)}collectPatterns(e,t){t.push(this._begin)}compile(e,t){return this._getCachedCompiledPatterns(e,t).compile(e)}compileAG(e,t,r,o){return this._getCachedCompiledPatterns(e,t).compileAG(e,r,o)}_getCachedCompiledPatterns(e,t){if(!this._cachedCompiledPatterns){for(let t of(this._cachedCompiledPatterns=new h,this.patterns))e.getRule(t).collectPatterns(e,this._cachedCompiledPatterns);this.applyEndPatternLast?this._cachedCompiledPatterns.push(this._end.hasBackReferences?this._end.clone():this._end):this._cachedCompiledPatterns.unshift(this._end.hasBackReferences?this._end.clone():this._end)}return this._end.hasBackReferences&&(this.applyEndPatternLast?this._cachedCompiledPatterns.setSource(this._cachedCompiledPatterns.length()-1,t):this._cachedCompiledPatterns.setSource(0,t)),this._cachedCompiledPatterns}}t.BeginEndRule=l;class g extends s{constructor(e,r,o,n,a,i,s,d,u){super(e,r,o,n),this._begin=new p(a,this.id),this.beginCaptures=i,this.whileCaptures=d,this._while=new p(s,t.whileRuleId),this.whileHasBackReferences=this._while.hasBackReferences,this.patterns=u.patterns,this.hasMissingPatterns=u.hasMissingPatterns,this._cachedCompiledPatterns=null,this._cachedCompiledWhilePatterns=null}dispose(){this._cachedCompiledPatterns&&(this._cachedCompiledPatterns.dispose(),this._cachedCompiledPatterns=null),this._cachedCompiledWhilePatterns&&(this._cachedCompiledWhilePatterns.dispose(),this._cachedCompiledWhilePatterns=null)}get debugBeginRegExp(){return`${this._begin.source}`}get debugWhileRegExp(){return`${this._while.source}`}getWhileWithResolvedBackReferences(e,t){return this._while.resolveBackReferences(e,t)}collectPatterns(e,t){t.push(this._begin)}compile(e,t){return this._getCachedCompiledPatterns(e).compile(e)}compileAG(e,t,r,o){return this._getCachedCompiledPatterns(e).compileAG(e,r,o)}_getCachedCompiledPatterns(e){if(!this._cachedCompiledPatterns)for(let t of(this._cachedCompiledPatterns=new h,this.patterns))e.getRule(t).collectPatterns(e,this._cachedCompiledPatterns);return this._cachedCompiledPatterns}compileWhile(e,t){return this._getCachedCompiledWhilePatterns(e,t).compile(e)}compileWhileAG(e,t,r,o){return this._getCachedCompiledWhilePatterns(e,t).compileAG(e,r,o)}_getCachedCompiledWhilePatterns(e,t){return this._cachedCompiledWhilePatterns||(this._cachedCompiledWhilePatterns=new h,this._cachedCompiledWhilePatterns.push(this._while.hasBackReferences?this._while.clone():this._while)),this._while.hasBackReferences&&this._cachedCompiledWhilePatterns.setSource(0,t||"￿"),this._cachedCompiledWhilePatterns}}t.BeginWhileRule=g;class f{static createCaptureRule(e,t,r,o,n){return e.registerRule(e=>new d(t,e,r,o,n))}static getCompiledRuleId(e,t,r){return e.id||t.registerRule(n=>{if(e.id=n,e.match)return new u(e.$vscodeTextmateLocation,e.id,e.name,e.match,f._compileCaptures(e.captures,t,r));if(void 0===e.begin){e.repository&&(r=o.mergeObjects({},r,e.repository));let n=e.patterns;return void 0===n&&e.include&&(n=[{include:e.include}]),new c(e.$vscodeTextmateLocation,e.id,e.name,e.contentName,f._compilePatterns(n,t,r))}return e.while?new g(e.$vscodeTextmateLocation,e.id,e.name,e.contentName,e.begin,f._compileCaptures(e.beginCaptures||e.captures,t,r),e.while,f._compileCaptures(e.whileCaptures||e.captures,t,r),f._compilePatterns(e.patterns,t,r)):new l(e.$vscodeTextmateLocation,e.id,e.name,e.contentName,e.begin,f._compileCaptures(e.beginCaptures||e.captures,t,r),e.end,f._compileCaptures(e.endCaptures||e.captures,t,r),e.applyEndPatternLast,f._compilePatterns(e.patterns,t,r))}),e.id}static _compileCaptures(e,t,r){let o=[];if(e){let n=0;for(let t in e){if("$vscodeTextmateLocation"===t)continue;let e=parseInt(t,10);e>n&&(n=e)}for(let e=0;e<=n;e++)o[e]=null;for(let n in e){if("$vscodeTextmateLocation"===n)continue;let a=parseInt(n,10),i=0;e[n].patterns&&(i=f.getCompiledRuleId(e[n],t,r)),o[a]=f.createCaptureRule(t,e[n].$vscodeTextmateLocation,e[n].name,e[n].contentName,i)}}return o}static _compilePatterns(e,t,r){let o=[];if(e)for(let a=0,i=e.length;a<i;a++){let i=e[a],s=-1;if(i.include){let e=n.parseInclude(i.include);switch(e.kind){case 0:case 1:s=f.getCompiledRuleId(r[i.include],t,r);break;case 2:let o=r[e.ruleName];o&&(s=f.getCompiledRuleId(o,t,r));break;case 3:case 4:let a=e.scopeName,d=4===e.kind?e.ruleName:null,u=t.getExternalGrammar(a,r);if(u){if(d){let e=u.repository[d];e&&(s=f.getCompiledRuleId(e,t,u.repository))}else s=f.getCompiledRuleId(u.repository.$self,t,u.repository)}}}else s=f.getCompiledRuleId(i,t,r);if(-1!==s){let e=t.getRule(s),r=!1;if((e instanceof c||e instanceof l||e instanceof g)&&e.hasMissingPatterns&&0===e.patterns.length&&(r=!0),r)continue;o.push(s)}}return{patterns:o,hasMissingPatterns:(e?e.length:0)!==o.length}}}t.RuleFactory=f;class p{constructor(e,t){if(e){let t=e.length,r=0,o=[],n=!1;for(let a=0;a<t;a++)if("\\"===e.charAt(a)&&a+1<t){let t=e.charAt(a+1);"z"===t?(o.push(e.substring(r,a)),o.push("$(?!\\n)(?<!\\n)"),r=a+2):("A"===t||"G"===t)&&(n=!0),a++}this.hasAnchor=n,0===r?this.source=e:(o.push(e.substring(r,t)),this.source=o.join(""))}else this.hasAnchor=!1,this.source=e;this.hasAnchor?this._anchorCache=this._buildAnchorCache():this._anchorCache=null,this.ruleId=t,this.hasBackReferences=a.test(this.source)}clone(){return new p(this.source,this.ruleId)}setSource(e){this.source!==e&&(this.source=e,this.hasAnchor&&(this._anchorCache=this._buildAnchorCache()))}resolveBackReferences(e,t){let r=t.map(t=>e.substring(t.start,t.end));return i.lastIndex=0,this.source.replace(i,(e,t)=>o.escapeRegExpCharacters(r[parseInt(t,10)]||""))}_buildAnchorCache(){let e,t,r,o,n=[],a=[],i=[],s=[];for(e=0,t=this.source.length;e<t;e++)r=this.source.charAt(e),n[e]=r,a[e]=r,i[e]=r,s[e]=r,"\\"===r&&e+1<t&&("A"===(o=this.source.charAt(e+1))?(n[e+1]="￿",a[e+1]="￿",i[e+1]="A",s[e+1]="A"):"G"===o?(n[e+1]="￿",a[e+1]="G",i[e+1]="￿",s[e+1]="G"):(n[e+1]=o,a[e+1]=o,i[e+1]=o,s[e+1]=o),e++);return{A0_G0:n.join(""),A0_G1:a.join(""),A1_G0:i.join(""),A1_G1:s.join("")}}resolveAnchors(e,t){return this.hasAnchor&&this._anchorCache?e?t?this._anchorCache.A1_G1:this._anchorCache.A1_G0:t?this._anchorCache.A0_G1:this._anchorCache.A0_G0:this.source}}t.RegExpSource=p;class h{constructor(){this._items=[],this._hasAnchors=!1,this._cached=null,this._anchorCache={A0_G0:null,A0_G1:null,A1_G0:null,A1_G1:null}}dispose(){this._disposeCaches()}_disposeCaches(){this._cached&&(this._cached.dispose(),this._cached=null),this._anchorCache.A0_G0&&(this._anchorCache.A0_G0.dispose(),this._anchorCache.A0_G0=null),this._anchorCache.A0_G1&&(this._anchorCache.A0_G1.dispose(),this._anchorCache.A0_G1=null),this._anchorCache.A1_G0&&(this._anchorCache.A1_G0.dispose(),this._anchorCache.A1_G0=null),this._anchorCache.A1_G1&&(this._anchorCache.A1_G1.dispose(),this._anchorCache.A1_G1=null)}push(e){this._items.push(e),this._hasAnchors=this._hasAnchors||e.hasAnchor}unshift(e){this._items.unshift(e),this._hasAnchors=this._hasAnchors||e.hasAnchor}length(){return this._items.length}setSource(e,t){this._items[e].source!==t&&(this._disposeCaches(),this._items[e].setSource(t))}compile(e){if(!this._cached){let t=this._items.map(e=>e.source);this._cached=new m(e,t,this._items.map(e=>e.ruleId))}return this._cached}compileAG(e,t,r){return this._hasAnchors?t?r?(this._anchorCache.A1_G1||(this._anchorCache.A1_G1=this._resolveAnchors(e,t,r)),this._anchorCache.A1_G1):(this._anchorCache.A1_G0||(this._anchorCache.A1_G0=this._resolveAnchors(e,t,r)),this._anchorCache.A1_G0):r?(this._anchorCache.A0_G1||(this._anchorCache.A0_G1=this._resolveAnchors(e,t,r)),this._anchorCache.A0_G1):(this._anchorCache.A0_G0||(this._anchorCache.A0_G0=this._resolveAnchors(e,t,r)),this._anchorCache.A0_G0):this.compile(e)}_resolveAnchors(e,t,r){return new m(e,this._items.map(e=>e.resolveAnchors(t,r)),this._items.map(e=>e.ruleId))}}t.RegExpSourceList=h;class m{constructor(e,t,r){this.regExps=t,this.rules=r,this.scanner=e.createOnigScanner(t)}dispose(){"function"==typeof this.scanner.dispose&&this.scanner.dispose()}toString(){let e=[];for(let t=0,r=this.rules.length;t<r;t++)e.push("   - "+this.rules[t]+": "+this.regExps[t]);return e.join("\n")}findNextMatchSync(e,t,r){let o=this.scanner.findNextMatchSync(e,t,r);return o?{ruleId:this.rules[o.index],captureIndices:o.captureIndices}:null}}t.CompiledRule=m},6242:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.ThemeTrieElement=t.ThemeTrieElementRule=t.ColorMap=t.fontStyleToString=t.ParsedThemeRule=t.parseTheme=t.StyleAttributes=t.ScopeStack=t.Theme=void 0;let o=r(9784);class n{constructor(e,t,r){this._colorMap=e,this._defaults=t,this._root=r,this._cachedMatchRoot=new o.CachedFn(e=>this._root.match(e))}static createFromRawTheme(e,t){return this.createFromParsedTheme(s(e),t)}static createFromParsedTheme(e,t){return function(e,t){e.sort((e,t)=>{let r=o.strcmp(e.scope,t.scope);return 0!==r||0!==(r=o.strArrCmp(e.parentScopes,t.parentScopes))?r:e.index-t.index});let r=0,a="#000000",s="#ffffff";for(;e.length>=1&&""===e[0].scope;){let t=e.shift();-1!==t.fontStyle&&(r=t.fontStyle),null!==t.foreground&&(a=t.foreground),null!==t.background&&(s=t.background)}let d=new u(t),c=new i(r,d.getId(a),d.getId(s)),f=new g(new l(0,null,-1,0,0),[]);for(let t=0,r=e.length;t<r;t++){let r=e[t];f.insert(0,r.scope,r.parentScopes,r.fontStyle,d.getId(r.foreground),d.getId(r.background))}return new n(d,c,f)}(e,t)}getColorMap(){return this._colorMap.getColorMap()}getDefaults(){return this._defaults}match(e){if(null===e)return this._defaults;let t=e.scopeName,r=this._cachedMatchRoot.get(t).find(t=>(function(e,t){if(0===t.length)return!0;for(let n=0;n<t.length;n++){var r,o;let a=t[n],i=!1;if(">"===a){if(n===t.length-1)return!1;a=t[++n],i=!0}for(;e&&(r=e.scopeName,!((o=a)===r||r.startsWith(o)&&"."===r[o.length]));){if(i)return!1;e=e.parent}if(!e)return!1;e=e.parent}return!0})(e.parent,t.parentScopes));return r?new i(r.fontStyle,r.foreground,r.background):null}}t.Theme=n;class a{constructor(e,t){this.parent=e,this.scopeName=t}static push(e,t){for(let r of t)e=new a(e,r);return e}static from(...e){let t=null;for(let r=0;r<e.length;r++)t=new a(t,e[r]);return t}push(e){return new a(this,e)}getSegments(){let e=this,t=[];for(;e;)t.push(e.scopeName),e=e.parent;return t.reverse(),t}toString(){return this.getSegments().join(" ")}extends(e){return this===e||null!==this.parent&&this.parent.extends(e)}getExtensionIfDefined(e){let t=[],r=this;for(;r&&r!==e;)t.push(r.scopeName),r=r.parent;return r===e?t.reverse():void 0}}t.ScopeStack=a;class i{constructor(e,t,r){this.fontStyle=e,this.foregroundId=t,this.backgroundId=r}}function s(e){if(!e||!e.settings||!Array.isArray(e.settings))return[];let t=e.settings,r=[],n=0;for(let e=0,a=t.length;e<a;e++){let a,i=t[e];if(!i.settings)continue;if("string"==typeof i.scope){let e=i.scope;a=(e=(e=e.replace(/^[,]+/,"")).replace(/[,]+$/,"")).split(",")}else a=Array.isArray(i.scope)?i.scope:[""];let s=-1;if("string"==typeof i.settings.fontStyle){s=0;let e=i.settings.fontStyle.split(" ");for(let t=0,r=e.length;t<r;t++)switch(e[t]){case"italic":s|=1;break;case"bold":s|=2;break;case"underline":s|=4;break;case"strikethrough":s|=8}}let u=null;"string"==typeof i.settings.foreground&&o.isValidHexColor(i.settings.foreground)&&(u=i.settings.foreground);let c=null;"string"==typeof i.settings.background&&o.isValidHexColor(i.settings.background)&&(c=i.settings.background);for(let t=0,o=a.length;t<o;t++){let o=a[t].trim().split(" "),i=o[o.length-1],l=null;o.length>1&&(l=o.slice(0,o.length-1)).reverse(),r[n++]=new d(i,l,e,s,u,c)}}return r}t.StyleAttributes=i,t.parseTheme=s;class d{constructor(e,t,r,o,n,a){this.scope=e,this.parentScopes=t,this.index=r,this.fontStyle=o,this.foreground=n,this.background=a}}t.ParsedThemeRule=d,t.fontStyleToString=function(e){if(-1===e)return"not set";let t="";return 1&e&&(t+="italic "),2&e&&(t+="bold "),4&e&&(t+="underline "),8&e&&(t+="strikethrough "),""===t&&(t="none"),t.trim()};class u{constructor(e){if(this._lastColorId=0,this._id2color=[],this._color2id=Object.create(null),Array.isArray(e)){this._isFrozen=!0;for(let t=0,r=e.length;t<r;t++)this._color2id[e[t]]=t,this._id2color[t]=e[t]}else this._isFrozen=!1}getId(e){if(null===e)return 0;e=e.toUpperCase();let t=this._color2id[e];if(t)return t;if(this._isFrozen)throw Error(`Missing color in color map - ${e}`);return t=++this._lastColorId,this._color2id[e]=t,this._id2color[t]=e,t}getColorMap(){return this._id2color.slice(0)}}t.ColorMap=u;let c=Object.freeze([]);class l{constructor(e,t,r,o,n){this.scopeDepth=e,this.parentScopes=t||c,this.fontStyle=r,this.foreground=o,this.background=n}clone(){return new l(this.scopeDepth,this.parentScopes,this.fontStyle,this.foreground,this.background)}static cloneArr(e){let t=[];for(let r=0,o=e.length;r<o;r++)t[r]=e[r].clone();return t}acceptOverwrite(e,t,r,o){this.scopeDepth>e?console.log("how did this happen?"):this.scopeDepth=e,-1!==t&&(this.fontStyle=t),0!==r&&(this.foreground=r),0!==o&&(this.background=o)}}t.ThemeTrieElementRule=l;class g{constructor(e,t=[],r={}){this._mainRule=e,this._children=r,this._rulesWithParentScopes=t}static _cmpBySpecificity(e,t){if(e.scopeDepth!==t.scopeDepth)return t.scopeDepth-e.scopeDepth;let r=0,o=0;for(;">"===e.parentScopes[r]&&r++,">"===t.parentScopes[o]&&o++,!(r>=e.parentScopes.length)&&!(o>=t.parentScopes.length);){let n=t.parentScopes[o].length-e.parentScopes[r].length;if(0!==n)return n;r++,o++}return t.parentScopes.length-e.parentScopes.length}match(e){if(""!==e){let t,r,o=e.indexOf(".");if(-1===o?(t=e,r=""):(t=e.substring(0,o),r=e.substring(o+1)),this._children.hasOwnProperty(t))return this._children[t].match(r)}let t=this._rulesWithParentScopes.concat(this._mainRule);return t.sort(g._cmpBySpecificity),t}insert(e,t,r,o,n,a){let i,s,d;if(""===t){this._doInsertHere(e,r,o,n,a);return}let u=t.indexOf(".");-1===u?(i=t,s=""):(i=t.substring(0,u),s=t.substring(u+1)),this._children.hasOwnProperty(i)?d=this._children[i]:(d=new g(this._mainRule.clone(),l.cloneArr(this._rulesWithParentScopes)),this._children[i]=d),d.insert(e+1,s,r,o,n,a)}_doInsertHere(e,t,r,n,a){if(null===t){this._mainRule.acceptOverwrite(e,r,n,a);return}for(let i=0,s=this._rulesWithParentScopes.length;i<s;i++){let s=this._rulesWithParentScopes[i];if(0===o.strArrCmp(s.parentScopes,t)){s.acceptOverwrite(e,r,n,a);return}}-1===r&&(r=this._mainRule.fontStyle),0===n&&(n=this._mainRule.foreground),0===a&&(a=this._mainRule.background),this._rulesWithParentScopes.push(new l(e,t,r,n,a))}}t.ThemeTrieElement=g},9784:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.performanceNow=t.CachedFn=t.escapeRegExpCharacters=t.isValidHexColor=t.strArrCmp=t.strcmp=t.RegexSource=t.basename=t.mergeObjects=t.clone=void 0;t.clone=function(e){return function e(t){return Array.isArray(t)?function(t){let r=[];for(let o=0,n=t.length;o<n;o++)r[o]=e(t[o]);return r}(t):"object"==typeof t?function(t){let r={};for(let o in t)r[o]=e(t[o]);return r}(t):t}(e)},t.mergeObjects=function(e,...t){return t.forEach(t=>{for(let r in t)e[r]=t[r]}),e},t.basename=function e(t){let r=~t.lastIndexOf("/")||~t.lastIndexOf("\\");return 0===r?t:~r==t.length-1?e(t.substring(0,t.length-1)):t.substr(~r+1)};let r=/\$(\d+)|\${(\d+):\/(downcase|upcase)}/g;function o(e,t){return e<t?-1:+(e>t)}t.RegexSource=class{static hasCaptures(e){return null!==e&&(r.lastIndex=0,r.test(e))}static replaceCaptures(e,t,o){return e.replace(r,(e,r,n,a)=>{let i=o[parseInt(r||n,10)];if(!i)return e;{let e=t.substring(i.start,i.end);for(;"."===e[0];)e=e.substring(1);switch(a){case"downcase":return e.toLowerCase();case"upcase":return e.toUpperCase();default:return e}}})}},t.strcmp=o,t.strArrCmp=function(e,t){if(null===e&&null===t)return 0;if(!e)return -1;if(!t)return 1;let r=e.length,n=t.length;if(r===n){for(let n=0;n<r;n++){let r=o(e[n],t[n]);if(0!==r)return r}return 0}return r-n},t.isValidHexColor=function(e){return!!(/^#[0-9a-f]{6}$/i.test(e)||/^#[0-9a-f]{8}$/i.test(e)||/^#[0-9a-f]{3}$/i.test(e)||/^#[0-9a-f]{4}$/i.test(e))},t.escapeRegExpCharacters=function(e){return e.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g,"\\$&")},t.CachedFn=class{constructor(e){this.fn=e,this.cache=new Map}get(e){if(this.cache.has(e))return this.cache.get(e);let t=this.fn(e);return this.cache.set(e,t),t}},t.performanceNow="undefined"==typeof performance?function(){return Date.now()}:function(){return performance.now()}},246:function(e,t,r){var o,n,a,i,s=r(2322),d=r(7029),u=r(7745),c=r(8256),l=r(764),g=r(891),f=r(1985),p=r(2120),h=r(5231),m=r(365),k=r(5423),b=r(3826),y=r(8340),v=r(2784);let w=({initComponents:e,initTexts:t,components:r={},texts:o={}})=>{let n=(0,v.useRef)("function"==typeof e?e():e),a=(0,v.useRef)("function"==typeof t?t():t),i=(0,v.useCallback)(e=>null!=r[e]?r[e]:null!=n.current[e]?n.current[e]:void 0,[r]),s=(0,v.useCallback)((e,t)=>{let r=i(e);return null==r?null:(0,v.createElement)(r,t)},[i]),d=(0,v.useCallback)((e,t={})=>{let r=o[e]||a.current[e];return null==r?`${e}`:"function"==typeof r?r(t):r},[o]),u=(0,v.useCallback)((e,t,r={})=>(0,b.HC)(e)?e:d(t,r),[d]);return{getComponent:i,makeChildren:s,getText:d,selectText:u}},F=(0,v.createContext)({getComponent:()=>void 0,makeChildren:()=>null,getText:()=>"",selectText:()=>""}),C=({preset:e,children:t})=>(0,s.jsx)(F.Provider,{value:e,children:t});var B=r(5082),x=r(1107),A=r(3900);let E="undefined"!=typeof window?v.useLayoutEffect:v.useEffect;var S=((o={}).Loading="loading",o.Pending="pending",o.Completed="completed",o),_=((n={}).Prepare="prepare",n.Preload="preload",n.Loaded="loaded",n);let j={RESP_CHUNKS_NULL:"Response chunks null",PRELOAD_ASSETS_NULL:"Preload assets null",TEXT_DECODE:"Text decode error",JSON_PARSE:"JSON parse error",BLOB_URL:"Create blob url error"};class I extends Error{asset;error;constructor(e,t,r){super(e),this.asset=t,this.error=r}}let R=new Map,T=new Map,L={js:"text/javascript; charset=utf-8",css:"text/css",json:"text/json",wasm:"application/wasm",default:"text/plain"},D=e=>{Object.freeze(e);let{key:t}=e,r=Date.now();return T.has(e.key)?{key:t,state:"pending",percent:0,props:e,timestamp:r}:(T.set(e.key,e),{key:t,state:"loading",process:"prepare",percent:0,preloadAssets:null,props:e,timestamp:r})},P=(e,t)=>(e.priority??0)-(t.priority??0),N=({key:e="",baseUrl:t,query:r,assets:o,isCompressed:n=!1,isFetchDownload:a=!0,makeId:i,onPrepare:s,shouldPreload:d,shouldReload:u,handlePreload:c,onDownloadAsset:l,onPreload:g,willMount:f,onMount:p,onUnmount:h,onLoad:m,onError:k},{emitter:y}={})=>{let w=(0,v.useRef)(e),F={key:w.current,baseUrl:t,query:r,assets:o,isCompressed:n,isFetchDownload:a},C=(0,v.useRef)(F),S=(0,v.useRef)(null),[_,N]=(0,v.useState)(()=>D(F)),O=(0,v.useRef)([]),M=(0,v.useRef)(void 0);return E(()=>()=>{M.current?.abort("RemoteLoader unmount"),q()},[]),E(()=>{(0,B.Z)(C.current,F)||(C.current=F,("loading"!==_.state||"preload"!==_.process)&&N(D(C.current)))},[F,_]),E(()=>{if("loading"===_.state){if(null!=_.error){S.current=null,q();return}H(_).then(G).catch($)}},[_]),!function(e,t){let r=(0,v.useRef)(e);E(()=>{r.current=e},[e]),(0,v.useEffect)(()=>{if(null===t)return;let e=setInterval(()=>{r.current()},t);return()=>{clearInterval(e)}},[t])}(()=>{T.has(w.current)||N(D(C.current))},"pending"===_.state?50:null),_;function G(e){if(Object.keys(e).length){let t=Date.now();N(r=>({...r,...e,timestamp:t}))}}function $(e){null!=e&&k?.(e),G({error:e})}function q(){T.has(w.current)&&T.delete(w.current)}async function H(e){var t;return(t=e.process,S.current===({prepare:null,preload:"prepare",loaded:"preload"})[t])?(S.current=e.process,({prepare:U,preload:W,loaded:z})[e.process]?.(e)):{}}async function U({props:e}){let t=[],r={props:e,preloadAssets:t};for await(let r of e.assets){let o=function(e,t){if(e instanceof URL)return e;try{if(null!=t)return new URL(e,t);return new URL(e)}catch(t){return e}}(r.url,r.baseUrl||e.baseUrl),n={...r,url:o};(!R.has(o.toString())||u?.({props:e,asset:n}))&&(!d||d({props:e,asset:n}))&&t.push(n)}return await s?.(r),await y?.emit("prepareAssets",r),t.length&&(t=t.sort(P)),{process:"preload",preloadAssets:t}}async function W(e){let{preloadAssets:t}=e,r="loaded";if(null==t)throw Error(j.PRELOAD_ASSETS_NULL);if(!t.length)return{process:r,percent:100};let o=0;M.current=new AbortController;let a=new x.J$(t.map(e=>new x.v8({url:e.url,cache:"force-cache",signal:M.current?.signal}).setCompressed(n)));await a.read({onQueueError:$,onError:$,onProgress:e=>{e.percent>o&&G({percent:o=e.percent})},onComplete:async(e,r)=>{let o=t[e.tasks.findIndex(e=>e.id===r.id)];if(null!=o){var n,a;n=0,null!=(a=o)&&R.set(a.url.toString(),Date.now());let i={props:F,preloadAssets:t,queue:e,task:r,asset:o};await l?.(i),await y?.emit("downloadAsset",i)}}}),M.current=void 0;let s={props:F,preloadAssets:t,queue:a};await g?.(s),await y?.emit("preloadAssets",s);let d=await (c??Z)({props:F,queue:a,preloadAssets:t});await f?.({...s,resultSet:d}),await y?.emit("willMountAssets",{...s,resultSet:d});let u=[];return d.mount.length&&(O.current.length&&O.current.forEach(e=>(0,A.Ep)(e,h)),u=await Promise.all(d.mount.map(e=>(0,A.q3)({id:function(e){let t=`${w.current||"remote"}_${e.key}_${Date.now()}`;return i?i({asset:e,id:t}):t}(e),url:e.url.toString(),type:e.type??"js"}))),O.current=u.map(e=>e.id)),await p?.({...s,resultSet:d,mounted:u}),await y?.emit?.("mountAssets",{...s,resultSet:d,mounted:u}),{process:r}}async function z(e){let{props:t,preloadAssets:r}=e;return(S.current=null,(0,B.Z)(C.current,t))?(await m?.({props:t,preloadAssets:r}),await y?.emit?.("loadAssets",{props:t,preloadAssets:r}),q(),{state:"completed",percent:100}):{state:"loading",process:"prepare",percent:0,preloadAssets:null,props:C.current}}async function Z({props:e,queue:t,preloadAssets:r}){let o=[],n={},a={},i={},s={},d={},u={mount:o,wasm:n,blobUrls:a,json:i,text:s,errors:d};for await(let[c,l]of r.entries()){let g=(0,b.HC)(l.type)?l.type:"js",{key:f,mimeType:p}=l,h=t.tasks[c];if(null==h||null==h.chunks){d[f]=new I(j.RESP_CHUNKS_NULL,l);continue}if(null!=y){let o=!1,n={props:e,preloadAssets:r,queue:t,key:f,index:c,asset:l,task:h,resultSet:u,handle:()=>{o=!0}};if(await y.emit("asset",n),o||await y.emit(`asset:${f}`,n),o)continue}if(l.blobUrl){try{let e=p||(L[g]??L.default),t=new Blob([h.chunks],{type:e});a[l.key]=URL.createObjectURL(t)}catch(e){d[f]=new I(j.BLOB_URL,l,e)}continue}if("js"===g||"css"===g){o.push(l);continue}if("wasm"===g){n[l.key]=h.chunks;continue}try{let e=new TextDecoder().decode(h.chunks);if("json"===g)try{i[f]=JSON.parse(e)}catch(e){d[f]=new I(j.JSON_PARSE,l,e)}else s[f]=e}catch(e){d[f]=new I(j.TEXT_DECODE,l,e)}}return u}};var O=r(9214);let M=(e,t)=>(r,o)=>(0,b.d8)(o)?r===`${e}/${o}`:!!t&&r===e||r.startsWith(`${e}/`),G=M("worker"),$=M("main",!0),q=e=>G(e.key)&&null!=e.labels&&Array.isArray(e.labels),H=e=>(0,b.Ti)(e,e=>"function"==typeof e.inject&&"function"==typeof e.eject),U=e=>(0,b.Ti)(e,e=>"function"==typeof e.emit&&"function"==typeof e.on&&"function"==typeof e.off),W=()=>new y.Z,z=(e,t=W)=>null==e?t():U(e)?e:Z(t(),e),Z=(e,t,r="on")=>{if(H(t))return"on"===r?t.inject(e):t.eject(e),e;let o=t=>o=>{"on"===r?e.on(t,o):e.off(t,o)};for(let[e,r]of Object.entries(t)){if(!e||null==r)continue;let t=o(e);Array.isArray(r)?r.forEach(t):t(r)}return e},K=e=>{let t=(0,v.useRef)(void 0);return null==t.current&&(t.current=z(e)),t},V=e=>{let t=/.([^.]+)$/.exec(e);return t?`.${t[1]}`:void 0},Q=e=>(0,b.Ti)(e,e=>(0,b.HC)(e.filename)),J=e=>{(0,b.Ti)(window.MonacoEnvironment)?Object.assign(window.MonacoEnvironment,e):window.MonacoEnvironment=e},Y=(e,...t)=>{let r,o;(0,b.HC)(e)?r=e:Array.isArray(e)&&([r,o]=e),r?console.log(`%c[%c${r}%c]`,"color: gray",o||"color: cyan","color: gray",...t):console.log(...t)},X=["registerEvent","inject","eject","toString","setOptions","debug"];class ee{scopeName;options={debug:!1};#e={};#t;constructor(e){null!=e&&this.setOptions(e)}get isDebug(){return!!this.options.debug}get isDebugBase(){return(0,b.hj)(this.options.debug)&&(2&this.options.debug)==2}debug(...e){return this.isDebug&&Y(this.scopeName,...e),this}setOptions=e=>(Object.assign(this.options,e),this);register(e,t){if((0,b.Ti)(e)){for(let[t,r]of Object.entries(e))this.register(t,r);return this}if(Array.isArray(e))return e.forEach(e=>this.register(e)),this;let r=e.toString();if(!(0,b.HC)(r)||X.includes(r)||!(r in this))return this;let o=this[r];return"function"!=typeof o||(this.#e[t||r]=o.bind(this)),this}inject=e=>{if(!e){this.isDebug&&console.warn(`EventsDelegator ${this.constructor.name} inject failed, emitter is null!`);return}this.isDebugBase&&this.debug("inject events",this.#e),Z(e,this.#e,"on"),this.#t=()=>Z(e,this.#e,"off")};eject=e=>{if(null!=this.#t){this.isDebugBase&&this.debug("eject events by ejection"),this.#t(),this.#t=void 0;return}if(!e){this.isDebug&&console.warn(`EventsDelegator ${this.constructor.name} eject failed, emitter is null!`);return}this.isDebugBase&&this.debug("eject events",this.#e),Z(e,this.#e,"off")}}let et=e=>{let t={};return[e=>{Object.assign(t,e)},r=>t[r]??e[r]]},[er,eo]=et({jsdelivr:"https://cdn.jsdelivr.net/npm/",unpkg:"https://unpkg.com/",jsdmirror:"https://cdn.jsdmirror.com/npm/"}),en=(e,t)=>{let r=eo(e);if(!r)throw Error(`Invalid repository '${e}'. No valid url was specified.`);return new URL(t??"",r)},[ea,ei]=et({version:"0.52.2",repo:"jsdelivr",assetsOf:e=>{let t=ei("assetsBaseUrl");return t?new URL(e??"",t):en(ei("repo"),`@react-monaco/assets/assets/${e?`${e}`:""}`)}}),es=ei("assetsOf"),ed=(e=ei("version"))=>es(`monaco/${(0,b.HC)(e)?`${e}/`:""}`),eu=[],ec=["typescript","javascript"],el=["html","handlebars","razor"],eg=["json"],ef=["css","scss","less"];var ep=((a={}).Initializing="Initializing",a.Loading="Loading",a.Preparing="Preparing",a.Completed="Completed",a),eh=((i={})[i.Prepare=0]="Prepare",i[i.Mounting=1]="Mounting",i[i.Mounted=2]="Mounted",i);let em=(e,t)=>({debug:(0,v.useCallback)((...r)=>{t&&Y(e,...r)},[e,t])}),ek=()=>(0,v.useContext)(F),eb=(e,t={})=>{let r=ek().getText;return(0,v.useMemo)(()=>r(e,t),[r,e,t])},ey=(e,t,r={})=>{let o=ek().selectText;return(0,v.useMemo)(()=>o(e,t,r),[o,e,t,r])},ev=(e,t)=>{let r=ek().makeChildren;return(0,v.useMemo)(()=>r(e,t),[r,e,t])},ew=({defaultText:e,process:t,isFetchDownload:r,percent:o})=>{let n=ek().getText;return(0,v.useMemo)(()=>t===ep.Initializing&&(0,b.HC)(e)?e:n(t,ep.Loading?{isFetchDownload:r,percent:o}:{}),[n,t,r,o,e])},eF=()=>({imaging:function({editor:e,model:t}){return{position:e?.getPosition(),scroll:e?{scrollLeft:e.getScrollLeft(),scrollTop:e.getScrollTop()}:void 0,source:t?.getValue()}}}),eC=()=>({ERR_WORKERS_EMPTY:"Monaco workers cannot be empty",ERR_NO_EDITOR_WORKER:"Editor worker URL not specified",ERR_NO_CONTAINER:"Missing editor mount container",ERR_INVALID_PRELOAD_PROCESS:"Invalid preload process state",ERR_INVALID_CODE_INPUT:"Invalid code input",ERR_MONACO_UNDEFINED:"Global monaco undefined",ERR_UNKNOWN:"Unknown error",[ep.Initializing]:"Initializing...",[ep.Loading]:({isFetchDownload:e,percent:t})=>`Downloading${e?` ${t}%`:""}...`,[ep.Preparing]:"Preparing...",[ep.Completed]:"Completed"}),eB=e=>({"--rmBackdropBg":"rgba(255, 255, 255)","--rmBackdropZIndex":1e3,"--rmGap":"0.5em","--rmBorderColor":"rgba(0, 0, 0, 0.16)","--rmTextColor":"currentColor",...e}),ex={container:"MonacoContainer",errContainer:"MonacoErr",errDisplay:"MonacoErrDisplay",errScope:"MonacoErrScope",errMsg:"MonacoErrMsg",loaderContainer:"MonacoLoader",loaderBox:"MonacoLoaderBox",loaderText:"MonacoLoaderText",progressBar:"MonacoProgressBar",codeEditor:"MonacoCodeEditor"},eA=(e={})=>(0,u.iv)({...e,display:"flex",flexDirection:"column",flex:"1 1 auto"});(0,u.iv)`
  height: 0;
  overflow: hidden;
`;let eE={justifyContent:"center",alignItems:"center"},eS=(0,u.iv)`
  max-width: 480px;
  min-width: 320px;
  flex: 0 0 auto;
  gap: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5em;
  border: 1px solid var(--rmBorderColor);
  padding: 1em;
  color: var(--rmTextColor);
`,e_=(0,u.iv)`
  font-weight: 600;
  opacity: 0.65;
  &:after {
    content: '';
    border-right: 1px solid var(--rmBorderColor);
    padding-left: 1em;
  }
`,ej=(0,u.iv)`
  font-size: 0.95em;
  word-wrap: break-word;
  min-width: 0px;
`,eI={...eE,position:"absolute",top:0,bottom:0,left:0,right:0,backgroundColor:"var(--rmBackdropBg, #fff)",zIndex:"var(--rmBackdropZIndex, 1000)"},eR=e=>(0,u.iv)({...eE,display:"flex",flexDirection:e,gap:"var(--rmGap)",color:"var(--rmTextColor)"}),eT=({scope:e,error:t,withContainer:r,defaultText:o,style:n,className:a})=>{let i=(0,v.useRef)(void 0),d=ey(o,"ERR_UNKNOWN"),[u,c]=(0,v.useMemo)(()=>[r?"div":v.Fragment,r?{className:`${ex.errContainer} ${eA(eE)}`}:null],[r]);return(0,v.useEffect)(()=>{(0,B.Z)(i.current,t)||(i.current=t,console.error(t))},[t]),(0,s.jsx)(u,{...c,children:(0,s.jsxs)("div",{className:`${ex.errDisplay} ${eS}${a?` ${a}`:""}`,style:n,children:[e&&(0,s.jsx)("div",{className:`${ex.errScope} ${e_}`,children:e}),(0,s.jsx)("div",{className:`${ex.errMsg} ${ej}`,children:(0,b.Os)(t)||d})]})})},eL=({process:e,isFetchDownload:t,percent:r,withContainer:o,showText:n=!0,progressBar:a=!0,width:i,defaultText:d,dir:u="column",style:c,className:l})=>{let[g,f]=(0,v.useMemo)(()=>[o?"div":v.Fragment,o?{className:`${ex.loaderContainer} ${eA(eI)}`}:null],[o]),p=(0,v.useMemo)(()=>eR(u),[u]),h=e!==ep.Loading;return(0,s.jsx)(g,{...f,children:(0,s.jsxs)("div",{className:`${ex.loaderBox} ${p}${l?` ${l}`:""}`,style:c,children:[n&&(0,s.jsx)("div",{className:ex.loaderText,children:ew({defaultText:d,process:e,isFetchDownload:t,percent:r})}),ev("ProgressBar",{mode:a,indeterminate:h,percent:r,width:i})]})})},eD=({mode:e,percent:t,indeterminate:r,width:o=320})=>{let n=null==t||r;return e?(0,s.jsx)("progress",{max:100,className:ex.progressBar,value:n?void 0:t,style:{width:o}}):null},eP=()=>({ErrorDisplay:eT,Loader:eL,ProgressBar:eD}),eN={vs:{name:"vs",displayName:"Light (Visual Studio)",isDark:!1,colors:{primary:"#005FB8",secondary:"#ADD6FF80",success:"#369432",error:"#C72E0F",background:"#FFFFFF",text:"#3B3B3B",borderColor:"#CECECE"},data:{inherit:!1,base:"vs",colors:{"checkbox.border":"#CECECE","editor.background":"#FFFFFF","editor.foreground":"#3B3B3B","editor.inactiveSelectionBackground":"#E5EBF1","editorIndentGuide.background1":"#D3D3D3","editorIndentGuide.activeBackground1":"#939393","editor.selectionHighlightBackground":"#ADD6FF80","editorSuggestWidget.background":"#F8F8F8","activityBarBadge.background":"#005FB8","sideBarTitle.foreground":"#3B3B3B","list.hoverBackground":"#F2F2F2","menu.border":"#CECECE","input.placeholderForeground":"#767676","searchEditor.textInputBorder":"#CECECE","settings.textInputBorder":"#CECECE","settings.numberInputBorder":"#CECECE","statusBarItem.remoteForeground":"#FFFFFF","statusBarItem.remoteBackground":"#005FB8","ports.iconRunningProcessForeground":"#369432","sideBarSectionHeader.background":"#F8F8F8","sideBarSectionHeader.border":"#E5E5E5","tab.selectedForeground":"#333333b3","tab.selectedBackground":"#ffffffa5","tab.lastPinnedBorder":"#D4D4D4","notebook.cellBorderColor":"#E5E5E5","notebook.selectedCellBackground":"#C8DDF150","statusBarItem.errorBackground":"#C72E0F","list.activeSelectionIconForeground":"#000000","list.focusAndSelectionOutline":"#005FB8","terminal.inactiveSelectionBackground":"#E5EBF1","widget.border":"#E5E5E5","actionBar.toggledBackground":"#dddddd","diffEditor.unchangedRegionBackground":"#f8f8f8","activityBar.activeBorder":"#005FB8","activityBar.background":"#F8F8F8","activityBar.border":"#E5E5E5","activityBar.foreground":"#1F1F1F","activityBar.inactiveForeground":"#616161","activityBarBadge.foreground":"#FFFFFF","badge.background":"#CCCCCC","badge.foreground":"#3B3B3B","button.background":"#005FB8","button.border":"#0000001a","button.foreground":"#FFFFFF","button.hoverBackground":"#0258A8","button.secondaryBackground":"#E5E5E5","button.secondaryForeground":"#3B3B3B","button.secondaryHoverBackground":"#CCCCCC","chat.slashCommandBackground":"#D2ECFF","chat.slashCommandForeground":"#306CA2","chat.editedFileForeground":"#895503","checkbox.background":"#F8F8F8",descriptionForeground:"#3B3B3B","dropdown.background":"#FFFFFF","dropdown.border":"#CECECE","dropdown.foreground":"#3B3B3B","dropdown.listBackground":"#FFFFFF","editorGroup.border":"#E5E5E5","editorGroupHeader.tabsBackground":"#F8F8F8","editorGroupHeader.tabsBorder":"#E5E5E5","editorGutter.addedBackground":"#2EA043","editorGutter.deletedBackground":"#F85149","editorGutter.modifiedBackground":"#005FB8","editorLineNumber.activeForeground":"#171184","editorLineNumber.foreground":"#6E7681","editorOverviewRuler.border":"#E5E5E5","editorWidget.background":"#F8F8F8",errorForeground:"#F85149",focusBorder:"#005FB8",foreground:"#3B3B3B","icon.foreground":"#3B3B3B","input.background":"#FFFFFF","input.border":"#CECECE","input.foreground":"#3B3B3B","inputOption.activeBackground":"#BED6ED","inputOption.activeBorder":"#005FB8","inputOption.activeForeground":"#000000","keybindingLabel.foreground":"#3B3B3B","list.activeSelectionBackground":"#E8E8E8","list.activeSelectionForeground":"#000000","menu.selectionBackground":"#005FB8","menu.selectionForeground":"#ffffff","notificationCenterHeader.background":"#FFFFFF","notificationCenterHeader.foreground":"#3B3B3B","notifications.background":"#FFFFFF","notifications.border":"#E5E5E5","notifications.foreground":"#3B3B3B","panel.background":"#F8F8F8","panel.border":"#E5E5E5","panelInput.border":"#E5E5E5","panelTitle.activeBorder":"#005FB8","panelTitle.activeForeground":"#3B3B3B","panelTitle.inactiveForeground":"#3B3B3B","peekViewEditor.matchHighlightBackground":"#BB800966","peekViewResult.background":"#FFFFFF","peekViewResult.matchHighlightBackground":"#BB800966","pickerGroup.border":"#E5E5E5","pickerGroup.foreground":"#8B949E","progressBar.background":"#005FB8","quickInput.background":"#F8F8F8","quickInput.foreground":"#3B3B3B","settings.dropdownBackground":"#FFFFFF","settings.dropdownBorder":"#CECECE","settings.headerForeground":"#1F1F1F","settings.modifiedItemIndicator":"#BB800966","sideBar.background":"#F8F8F8","sideBar.border":"#E5E5E5","sideBar.foreground":"#3B3B3B","sideBarSectionHeader.foreground":"#3B3B3B","statusBar.background":"#F8F8F8","statusBar.foreground":"#3B3B3B","statusBar.border":"#E5E5E5","statusBarItem.hoverBackground":"#B8B8B850","statusBarItem.compactHoverBackground":"#CCCCCC","statusBar.debuggingBackground":"#FD716C","statusBar.debuggingForeground":"#000000","statusBar.focusBorder":"#005FB8","statusBar.noFolderBackground":"#F8F8F8","statusBarItem.focusBorder":"#005FB8","statusBarItem.prominentBackground":"#6E768166","tab.activeBackground":"#FFFFFF","tab.activeBorder":"#F8F8F8","tab.activeBorderTop":"#005FB8","tab.activeForeground":"#3B3B3B","tab.selectedBorderTop":"#68a3da","tab.border":"#E5E5E5","tab.hoverBackground":"#FFFFFF","tab.inactiveBackground":"#F8F8F8","tab.inactiveForeground":"#868686","tab.unfocusedActiveBorder":"#F8F8F8","tab.unfocusedActiveBorderTop":"#E5E5E5","tab.unfocusedHoverBackground":"#F8F8F8","terminalCursor.foreground":"#005FB8","terminal.foreground":"#3B3B3B","terminal.tab.activeBorder":"#005FB8","textBlockQuote.background":"#F8F8F8","textBlockQuote.border":"#E5E5E5","textCodeBlock.background":"#F8F8F8","textLink.activeForeground":"#005FB8","textLink.foreground":"#005FB8","textPreformat.foreground":"#3B3B3B","textPreformat.background":"#0000001F","textSeparator.foreground":"#21262D","titleBar.activeBackground":"#F8F8F8","titleBar.activeForeground":"#1E1E1E","titleBar.border":"#E5E5E5","titleBar.inactiveBackground":"#F8F8F8","titleBar.inactiveForeground":"#8B949E","welcomePage.tileBackground":"#F3F3F3"},rules:[{foreground:"#000000",token:"meta.embedded"},{foreground:"#000000",token:"source.groovy.embedded"},{foreground:"#000000",token:"string meta.image.inline.markdown"},{foreground:"#000000",token:"variable.legacy.builtin.python"},{fontStyle:"italic",token:"emphasis"},{fontStyle:"bold",token:"strong"},{foreground:"#000080",token:"meta.diff.header"},{foreground:"#008000",token:"comment"},{foreground:"#0000ff",token:"constant.language"},{foreground:"#098658",token:"constant.numeric"},{foreground:"#098658",token:"variable.other.enummember"},{foreground:"#098658",token:"keyword.operator.plus.exponent"},{foreground:"#098658",token:"keyword.operator.minus.exponent"},{foreground:"#811f3f",token:"constant.regexp"},{foreground:"#800000",token:"entity.name.tag"},{foreground:"#800000",token:"entity.name.selector"},{foreground:"#e50000",token:"entity.other.attribute-name"},{foreground:"#800000",token:"entity.other.attribute-name.class.css"},{foreground:"#800000",token:"source.css entity.other.attribute-name.class"},{foreground:"#800000",token:"entity.other.attribute-name.id.css"},{foreground:"#800000",token:"entity.other.attribute-name.parent-selector.css"},{foreground:"#800000",token:"entity.other.attribute-name.parent.less"},{foreground:"#800000",token:"source.css entity.other.attribute-name.pseudo-class"},{foreground:"#800000",token:"entity.other.attribute-name.pseudo-element.css"},{foreground:"#800000",token:"source.css.less entity.other.attribute-name.id"},{foreground:"#800000",token:"entity.other.attribute-name.scss"},{foreground:"#cd3131",token:"invalid"},{fontStyle:"underline",token:"markup.underline"},{fontStyle:"bold",foreground:"#000080",token:"markup.bold"},{fontStyle:"bold",foreground:"#800000",token:"markup.heading"},{fontStyle:"italic",token:"markup.italic"},{fontStyle:"strikethrough",token:"markup.strikethrough"},{foreground:"#098658",token:"markup.inserted"},{foreground:"#a31515",token:"markup.deleted"},{foreground:"#0451a5",token:"markup.changed"},{foreground:"#0451a5",token:"punctuation.definition.quote.begin.markdown"},{foreground:"#0451a5",token:"punctuation.definition.list.begin.markdown"},{foreground:"#800000",token:"markup.inline.raw"},{foreground:"#800000",token:"punctuation.definition.tag"},{foreground:"#0000ff",token:"meta.preprocessor"},{foreground:"#0000ff",token:"entity.name.function.preprocessor"},{foreground:"#a31515",token:"meta.preprocessor.string"},{foreground:"#098658",token:"meta.preprocessor.numeric"},{foreground:"#0451a5",token:"meta.structure.dictionary.key.python"},{foreground:"#0000ff",token:"storage"},{foreground:"#0000ff",token:"storage.type"},{foreground:"#0000ff",token:"storage.modifier"},{foreground:"#0000ff",token:"keyword.operator.noexcept"},{foreground:"#a31515",token:"string"},{foreground:"#a31515",token:"meta.embedded.assembly"},{foreground:"#0000ff",token:"string.comment.buffered.block.pug"},{foreground:"#0000ff",token:"string.quoted.pug"},{foreground:"#0000ff",token:"string.interpolated.pug"},{foreground:"#0000ff",token:"string.unquoted.plain.in.yaml"},{foreground:"#0000ff",token:"string.unquoted.plain.out.yaml"},{foreground:"#0000ff",token:"string.unquoted.block.yaml"},{foreground:"#0000ff",token:"string.quoted.single.yaml"},{foreground:"#0000ff",token:"string.quoted.double.xml"},{foreground:"#0000ff",token:"string.quoted.single.xml"},{foreground:"#0000ff",token:"string.unquoted.cdata.xml"},{foreground:"#0000ff",token:"string.quoted.double.html"},{foreground:"#0000ff",token:"string.quoted.single.html"},{foreground:"#0000ff",token:"string.unquoted.html"},{foreground:"#0000ff",token:"string.quoted.single.handlebars"},{foreground:"#0000ff",token:"string.quoted.double.handlebars"},{foreground:"#811f3f",token:"string.regexp"},{foreground:"#0000ff",token:"punctuation.definition.template-expression.begin"},{foreground:"#0000ff",token:"punctuation.definition.template-expression.end"},{foreground:"#0000ff",token:"punctuation.section.embedded"},{foreground:"#000000",token:"meta.template.expression"},{foreground:"#0451a5",token:"support.constant.property-value"},{foreground:"#0451a5",token:"support.constant.font-name"},{foreground:"#0451a5",token:"support.constant.media-type"},{foreground:"#0451a5",token:"support.constant.media"},{foreground:"#0451a5",token:"constant.other.color.rgb-value"},{foreground:"#0451a5",token:"constant.other.rgb-value"},{foreground:"#0451a5",token:"support.constant.color"},{foreground:"#e50000",token:"support.type.vendored.property-name"},{foreground:"#e50000",token:"support.type.property-name"},{foreground:"#e50000",token:"source.css variable"},{foreground:"#e50000",token:"source.coffee.embedded"},{foreground:"#0451a5",token:"support.type.property-name.json"},{foreground:"#0000ff",token:"keyword"},{foreground:"#0000ff",token:"keyword.control"},{foreground:"#000000",token:"keyword.operator"},{foreground:"#0000ff",token:"keyword.operator.new"},{foreground:"#0000ff",token:"keyword.operator.expression"},{foreground:"#0000ff",token:"keyword.operator.cast"},{foreground:"#0000ff",token:"keyword.operator.sizeof"},{foreground:"#0000ff",token:"keyword.operator.alignof"},{foreground:"#0000ff",token:"keyword.operator.typeid"},{foreground:"#0000ff",token:"keyword.operator.alignas"},{foreground:"#0000ff",token:"keyword.operator.instanceof"},{foreground:"#0000ff",token:"keyword.operator.logical.python"},{foreground:"#0000ff",token:"keyword.operator.wordlike"},{foreground:"#098658",token:"keyword.other.unit"},{foreground:"#800000",token:"punctuation.section.embedded.begin.php"},{foreground:"#800000",token:"punctuation.section.embedded.end.php"},{foreground:"#0451a5",token:"support.function.git-rebase"},{foreground:"#098658",token:"constant.sha.git-rebase"},{foreground:"#000000",token:"storage.modifier.import.java"},{foreground:"#000000",token:"variable.language.wildcard.java"},{foreground:"#000000",token:"storage.modifier.package.java"},{foreground:"#0000ff",token:"variable.language"},{foreground:"#795E26",token:"entity.name.function"},{foreground:"#795E26",token:"support.function"},{foreground:"#795E26",token:"support.constant.handlebars"},{foreground:"#795E26",token:"source.powershell variable.other.member"},{foreground:"#795E26",token:"entity.name.operator.custom-literal"},{foreground:"#267f99",token:"support.class"},{foreground:"#267f99",token:"support.type"},{foreground:"#267f99",token:"entity.name.type"},{foreground:"#267f99",token:"entity.name.namespace"},{foreground:"#267f99",token:"entity.other.attribute"},{foreground:"#267f99",token:"entity.name.scope-resolution"},{foreground:"#267f99",token:"entity.name.class"},{foreground:"#267f99",token:"storage.type.numeric.go"},{foreground:"#267f99",token:"storage.type.byte.go"},{foreground:"#267f99",token:"storage.type.boolean.go"},{foreground:"#267f99",token:"storage.type.string.go"},{foreground:"#267f99",token:"storage.type.uintptr.go"},{foreground:"#267f99",token:"storage.type.error.go"},{foreground:"#267f99",token:"storage.type.rune.go"},{foreground:"#267f99",token:"storage.type.cs"},{foreground:"#267f99",token:"storage.type.generic.cs"},{foreground:"#267f99",token:"storage.type.modifier.cs"},{foreground:"#267f99",token:"storage.type.variable.cs"},{foreground:"#267f99",token:"storage.type.annotation.java"},{foreground:"#267f99",token:"storage.type.generic.java"},{foreground:"#267f99",token:"storage.type.java"},{foreground:"#267f99",token:"storage.type.object.array.java"},{foreground:"#267f99",token:"storage.type.primitive.array.java"},{foreground:"#267f99",token:"storage.type.primitive.java"},{foreground:"#267f99",token:"storage.type.token.java"},{foreground:"#267f99",token:"storage.type.groovy"},{foreground:"#267f99",token:"storage.type.annotation.groovy"},{foreground:"#267f99",token:"storage.type.parameters.groovy"},{foreground:"#267f99",token:"storage.type.generic.groovy"},{foreground:"#267f99",token:"storage.type.object.array.groovy"},{foreground:"#267f99",token:"storage.type.primitive.array.groovy"},{foreground:"#267f99",token:"storage.type.primitive.groovy"},{foreground:"#267f99",token:"meta.type.cast.expr"},{foreground:"#267f99",token:"meta.type.new.expr"},{foreground:"#267f99",token:"support.constant.math"},{foreground:"#267f99",token:"support.constant.dom"},{foreground:"#267f99",token:"support.constant.json"},{foreground:"#267f99",token:"entity.other.inherited-class"},{foreground:"#267f99",token:"punctuation.separator.namespace.ruby"},{foreground:"#AF00DB",token:"keyword.control"},{foreground:"#AF00DB",token:"source.cpp keyword.operator.new"},{foreground:"#AF00DB",token:"source.cpp keyword.operator.delete"},{foreground:"#AF00DB",token:"keyword.other.using"},{foreground:"#AF00DB",token:"keyword.other.directive.using"},{foreground:"#AF00DB",token:"keyword.other.operator"},{foreground:"#AF00DB",token:"entity.name.operator"},{foreground:"#001080",token:"variable"},{foreground:"#001080",token:"meta.definition.variable.name"},{foreground:"#001080",token:"support.variable"},{foreground:"#001080",token:"entity.name.variable"},{foreground:"#001080",token:"constant.other.placeholder"},{foreground:"#0070C1",token:"variable.other.constant"},{foreground:"#0070C1",token:"variable.other.enummember"},{foreground:"#001080",token:"meta.object-literal.key"},{foreground:"#0451a5",token:"support.constant.property-value"},{foreground:"#0451a5",token:"support.constant.font-name"},{foreground:"#0451a5",token:"support.constant.media-type"},{foreground:"#0451a5",token:"support.constant.media"},{foreground:"#0451a5",token:"constant.other.color.rgb-value"},{foreground:"#0451a5",token:"constant.other.rgb-value"},{foreground:"#0451a5",token:"support.constant.color"},{foreground:"#d16969",token:"punctuation.definition.group.regexp"},{foreground:"#d16969",token:"punctuation.definition.group.assertion.regexp"},{foreground:"#d16969",token:"punctuation.definition.character-class.regexp"},{foreground:"#d16969",token:"punctuation.character.set.begin.regexp"},{foreground:"#d16969",token:"punctuation.character.set.end.regexp"},{foreground:"#d16969",token:"keyword.operator.negation.regexp"},{foreground:"#d16969",token:"support.other.parenthesis.regexp"},{foreground:"#811f3f",token:"constant.character.character-class.regexp"},{foreground:"#811f3f",token:"constant.other.character-class.set.regexp"},{foreground:"#811f3f",token:"constant.other.character-class.regexp"},{foreground:"#811f3f",token:"constant.character.set.regexp"},{foreground:"#000000",token:"keyword.operator.quantifier.regexp"},{foreground:"#EE0000",token:"keyword.operator.or.regexp"},{foreground:"#EE0000",token:"keyword.control.anchor.regexp"},{foreground:"#0000ff",token:"constant.character"},{foreground:"#0000ff",token:"constant.other.option"},{foreground:"#EE0000",token:"constant.character.escape"},{foreground:"#000000",token:"entity.name.label"}],encodedTokensColors:[]}},"vs-dark":{name:"vs-dark",displayName:"Dark (Visual Studio)",isDark:!0,colors:{primary:"#007ACC",secondary:"#ADD6FF26",success:"#369432",error:"#f44747",background:"#1E1E1E",text:"#D4D4D4",borderColor:"#6B6B6B"},data:{inherit:!1,base:"vs-dark",colors:{"checkbox.border":"#6B6B6B","editor.background":"#1E1E1E","editor.foreground":"#D4D4D4","editor.inactiveSelectionBackground":"#3A3D41","editorIndentGuide.background1":"#404040","editorIndentGuide.activeBackground1":"#707070","editor.selectionHighlightBackground":"#ADD6FF26","list.dropBackground":"#383B3D","activityBarBadge.background":"#007ACC","sideBarTitle.foreground":"#BBBBBB","input.placeholderForeground":"#A6A6A6","menu.background":"#252526","menu.foreground":"#CCCCCC","menu.separatorBackground":"#454545","menu.border":"#454545","menu.selectionBackground":"#0078d4","statusBarItem.remoteForeground":"#FFFFFF","statusBarItem.remoteBackground":"#16825D","ports.iconRunningProcessForeground":"#369432","sideBarSectionHeader.background":"","sideBarSectionHeader.border":"","tab.selectedBackground":"#222222","tab.selectedForeground":"#ffffffa0","tab.lastPinnedBorder":"","list.activeSelectionIconForeground":"#FFFFFF","terminal.inactiveSelectionBackground":"#3A3D41","widget.border":"#303031","actionBar.toggledBackground":"#383a49"},rules:[{foreground:"#D4D4D4",token:"meta.embedded"},{foreground:"#D4D4D4",token:"source.groovy.embedded"},{foreground:"#D4D4D4",token:"string meta.image.inline.markdown"},{foreground:"#D4D4D4",token:"variable.legacy.builtin.python"},{fontStyle:"italic",token:"emphasis"},{fontStyle:"bold",token:"strong"},{foreground:"#000080",token:"header"},{foreground:"#6A9955",token:"comment"},{foreground:"#569cd6",token:"constant.language"},{foreground:"#b5cea8",token:"constant.numeric"},{foreground:"#b5cea8",token:"variable.other.enummember"},{foreground:"#b5cea8",token:"keyword.operator.plus.exponent"},{foreground:"#b5cea8",token:"keyword.operator.minus.exponent"},{foreground:"#646695",token:"constant.regexp"},{foreground:"#569cd6",token:"entity.name.tag"},{foreground:"#d7ba7d",token:"entity.name.tag.css"},{foreground:"#d7ba7d",token:"entity.name.tag.less"},{foreground:"#9cdcfe",token:"entity.other.attribute-name"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.class.css"},{foreground:"#d7ba7d",token:"source.css entity.other.attribute-name.class"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.id.css"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.parent-selector.css"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.parent.less"},{foreground:"#d7ba7d",token:"source.css entity.other.attribute-name.pseudo-class"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.pseudo-element.css"},{foreground:"#d7ba7d",token:"source.css.less entity.other.attribute-name.id"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.scss"},{foreground:"#f44747",token:"invalid"},{fontStyle:"underline",token:"markup.underline"},{fontStyle:"bold",foreground:"#569cd6",token:"markup.bold"},{fontStyle:"bold",foreground:"#569cd6",token:"markup.heading"},{fontStyle:"italic",token:"markup.italic"},{fontStyle:"strikethrough",token:"markup.strikethrough"},{foreground:"#b5cea8",token:"markup.inserted"},{foreground:"#ce9178",token:"markup.deleted"},{foreground:"#569cd6",token:"markup.changed"},{foreground:"#6A9955",token:"punctuation.definition.quote.begin.markdown"},{foreground:"#6796e6",token:"punctuation.definition.list.begin.markdown"},{foreground:"#ce9178",token:"markup.inline.raw"},{foreground:"#808080",token:"punctuation.definition.tag"},{foreground:"#569cd6",token:"meta.preprocessor"},{foreground:"#569cd6",token:"entity.name.function.preprocessor"},{foreground:"#ce9178",token:"meta.preprocessor.string"},{foreground:"#b5cea8",token:"meta.preprocessor.numeric"},{foreground:"#9cdcfe",token:"meta.structure.dictionary.key.python"},{foreground:"#569cd6",token:"meta.diff.header"},{foreground:"#569cd6",token:"storage"},{foreground:"#569cd6",token:"storage.type"},{foreground:"#569cd6",token:"storage.modifier"},{foreground:"#569cd6",token:"keyword.operator.noexcept"},{foreground:"#ce9178",token:"string"},{foreground:"#ce9178",token:"meta.embedded.assembly"},{foreground:"#ce9178",token:"string.tag"},{foreground:"#ce9178",token:"string.value"},{foreground:"#d16969",token:"string.regexp"},{foreground:"#569cd6",token:"punctuation.definition.template-expression.begin"},{foreground:"#569cd6",token:"punctuation.definition.template-expression.end"},{foreground:"#569cd6",token:"punctuation.section.embedded"},{foreground:"#d4d4d4",token:"meta.template.expression"},{foreground:"#9cdcfe",token:"support.type.vendored.property-name"},{foreground:"#9cdcfe",token:"support.type.property-name"},{foreground:"#9cdcfe",token:"source.css variable"},{foreground:"#9cdcfe",token:"source.coffee.embedded"},{foreground:"#569cd6",token:"keyword"},{foreground:"#569cd6",token:"keyword.control"},{foreground:"#d4d4d4",token:"keyword.operator"},{foreground:"#569cd6",token:"keyword.operator.new"},{foreground:"#569cd6",token:"keyword.operator.expression"},{foreground:"#569cd6",token:"keyword.operator.cast"},{foreground:"#569cd6",token:"keyword.operator.sizeof"},{foreground:"#569cd6",token:"keyword.operator.alignof"},{foreground:"#569cd6",token:"keyword.operator.typeid"},{foreground:"#569cd6",token:"keyword.operator.alignas"},{foreground:"#569cd6",token:"keyword.operator.instanceof"},{foreground:"#569cd6",token:"keyword.operator.logical.python"},{foreground:"#569cd6",token:"keyword.operator.wordlike"},{foreground:"#b5cea8",token:"keyword.other.unit"},{foreground:"#569cd6",token:"punctuation.section.embedded.begin.php"},{foreground:"#569cd6",token:"punctuation.section.embedded.end.php"},{foreground:"#9cdcfe",token:"support.function.git-rebase"},{foreground:"#b5cea8",token:"constant.sha.git-rebase"},{foreground:"#D5D4D4",token:"storage.modifier.import.java"},{foreground:"#D5D4D4",token:"variable.language.wildcard.java"},{foreground:"#D5D4D4",token:"storage.modifier.package.java"},{foreground:"#569cd6",token:"variable.language"},{foreground:"#DCDCAA",token:"entity.name.function"},{foreground:"#DCDCAA",token:"support.function"},{foreground:"#DCDCAA",token:"support.constant.handlebars"},{foreground:"#DCDCAA",token:"source.powershell variable.other.member"},{foreground:"#DCDCAA",token:"entity.name.operator.custom-literal"},{foreground:"#4EC9B0",token:"support.class"},{foreground:"#4EC9B0",token:"support.type"},{foreground:"#4EC9B0",token:"entity.name.type"},{foreground:"#4EC9B0",token:"entity.name.namespace"},{foreground:"#4EC9B0",token:"entity.other.attribute"},{foreground:"#4EC9B0",token:"entity.name.scope-resolution"},{foreground:"#4EC9B0",token:"entity.name.class"},{foreground:"#4EC9B0",token:"storage.type.numeric.go"},{foreground:"#4EC9B0",token:"storage.type.byte.go"},{foreground:"#4EC9B0",token:"storage.type.boolean.go"},{foreground:"#4EC9B0",token:"storage.type.string.go"},{foreground:"#4EC9B0",token:"storage.type.uintptr.go"},{foreground:"#4EC9B0",token:"storage.type.error.go"},{foreground:"#4EC9B0",token:"storage.type.rune.go"},{foreground:"#4EC9B0",token:"storage.type.cs"},{foreground:"#4EC9B0",token:"storage.type.generic.cs"},{foreground:"#4EC9B0",token:"storage.type.modifier.cs"},{foreground:"#4EC9B0",token:"storage.type.variable.cs"},{foreground:"#4EC9B0",token:"storage.type.annotation.java"},{foreground:"#4EC9B0",token:"storage.type.generic.java"},{foreground:"#4EC9B0",token:"storage.type.java"},{foreground:"#4EC9B0",token:"storage.type.object.array.java"},{foreground:"#4EC9B0",token:"storage.type.primitive.array.java"},{foreground:"#4EC9B0",token:"storage.type.primitive.java"},{foreground:"#4EC9B0",token:"storage.type.token.java"},{foreground:"#4EC9B0",token:"storage.type.groovy"},{foreground:"#4EC9B0",token:"storage.type.annotation.groovy"},{foreground:"#4EC9B0",token:"storage.type.parameters.groovy"},{foreground:"#4EC9B0",token:"storage.type.generic.groovy"},{foreground:"#4EC9B0",token:"storage.type.object.array.groovy"},{foreground:"#4EC9B0",token:"storage.type.primitive.array.groovy"},{foreground:"#4EC9B0",token:"storage.type.primitive.groovy"},{foreground:"#4EC9B0",token:"meta.type.cast.expr"},{foreground:"#4EC9B0",token:"meta.type.new.expr"},{foreground:"#4EC9B0",token:"support.constant.math"},{foreground:"#4EC9B0",token:"support.constant.dom"},{foreground:"#4EC9B0",token:"support.constant.json"},{foreground:"#4EC9B0",token:"entity.other.inherited-class"},{foreground:"#4EC9B0",token:"punctuation.separator.namespace.ruby"},{foreground:"#C586C0",token:"keyword.control"},{foreground:"#C586C0",token:"source.cpp keyword.operator.new"},{foreground:"#C586C0",token:"keyword.operator.delete"},{foreground:"#C586C0",token:"keyword.other.using"},{foreground:"#C586C0",token:"keyword.other.directive.using"},{foreground:"#C586C0",token:"keyword.other.operator"},{foreground:"#C586C0",token:"entity.name.operator"},{foreground:"#9CDCFE",token:"variable"},{foreground:"#9CDCFE",token:"meta.definition.variable.name"},{foreground:"#9CDCFE",token:"support.variable"},{foreground:"#9CDCFE",token:"entity.name.variable"},{foreground:"#9CDCFE",token:"constant.other.placeholder"},{foreground:"#4FC1FF",token:"variable.other.constant"},{foreground:"#4FC1FF",token:"variable.other.enummember"},{foreground:"#9CDCFE",token:"meta.object-literal.key"},{foreground:"#CE9178",token:"support.constant.property-value"},{foreground:"#CE9178",token:"support.constant.font-name"},{foreground:"#CE9178",token:"support.constant.media-type"},{foreground:"#CE9178",token:"support.constant.media"},{foreground:"#CE9178",token:"constant.other.color.rgb-value"},{foreground:"#CE9178",token:"constant.other.rgb-value"},{foreground:"#CE9178",token:"support.constant.color"},{foreground:"#CE9178",token:"punctuation.definition.group.regexp"},{foreground:"#CE9178",token:"punctuation.definition.group.assertion.regexp"},{foreground:"#CE9178",token:"punctuation.definition.character-class.regexp"},{foreground:"#CE9178",token:"punctuation.character.set.begin.regexp"},{foreground:"#CE9178",token:"punctuation.character.set.end.regexp"},{foreground:"#CE9178",token:"keyword.operator.negation.regexp"},{foreground:"#CE9178",token:"support.other.parenthesis.regexp"},{foreground:"#d16969",token:"constant.character.character-class.regexp"},{foreground:"#d16969",token:"constant.other.character-class.set.regexp"},{foreground:"#d16969",token:"constant.other.character-class.regexp"},{foreground:"#d16969",token:"constant.character.set.regexp"},{foreground:"#DCDCAA",token:"keyword.operator.or.regexp"},{foreground:"#DCDCAA",token:"keyword.control.anchor.regexp"},{foreground:"#d7ba7d",token:"keyword.operator.quantifier.regexp"},{foreground:"#569cd6",token:"constant.character"},{foreground:"#569cd6",token:"constant.other.option"},{foreground:"#d7ba7d",token:"constant.character.escape"},{foreground:"#C8C8C8",token:"entity.name.label"}],encodedTokensColors:[]}},"hc-light":{name:"hc-light",displayName:"Light High Contrast",isDark:!1,colors:{},data:{inherit:!1,base:"hc-light",colors:{"actionBar.toggledBackground":"#dddddd","statusBarItem.remoteBackground":"#FFFFFF","statusBarItem.remoteForeground":"#000000"},rules:[{foreground:"#292929",token:"meta.embedded"},{foreground:"#292929",token:"source.groovy.embedded"},{foreground:"#292929",token:"variable.legacy.builtin.python"},{fontStyle:"italic",token:"emphasis"},{fontStyle:"bold",token:"strong"},{foreground:"#062F4A",token:"meta.diff.header"},{foreground:"#515151",token:"comment"},{foreground:"#0F4A85",token:"constant.language"},{foreground:"#096d48",token:"constant.numeric"},{foreground:"#096d48",token:"variable.other.enummember"},{foreground:"#096d48",token:"keyword.operator.plus.exponent"},{foreground:"#096d48",token:"keyword.operator.minus.exponent"},{foreground:"#811F3F",token:"constant.regexp"},{foreground:"#0F4A85",token:"entity.name.tag"},{foreground:"#0F4A85",token:"entity.name.selector"},{foreground:"#264F78",token:"entity.other.attribute-name"},{foreground:"#0F4A85",token:"entity.other.attribute-name.class.css"},{foreground:"#0F4A85",token:"source.css entity.other.attribute-name.class"},{foreground:"#0F4A85",token:"entity.other.attribute-name.id.css"},{foreground:"#0F4A85",token:"entity.other.attribute-name.parent-selector.css"},{foreground:"#0F4A85",token:"entity.other.attribute-name.parent.less"},{foreground:"#0F4A85",token:"source.css entity.other.attribute-name.pseudo-class"},{foreground:"#0F4A85",token:"entity.other.attribute-name.pseudo-element.css"},{foreground:"#0F4A85",token:"source.css.less entity.other.attribute-name.id"},{foreground:"#0F4A85",token:"entity.other.attribute-name.scss"},{foreground:"#B5200D",token:"invalid"},{fontStyle:"underline",token:"markup.underline"},{foreground:"#000080",fontStyle:"bold",token:"markup.bold"},{foreground:"#0F4A85",fontStyle:"bold",token:"markup.heading"},{fontStyle:"italic",token:"markup.italic"},{fontStyle:"strikethrough",token:"markup.strikethrough"},{foreground:"#096d48",token:"markup.inserted"},{foreground:"#5A5A5A",token:"markup.deleted"},{foreground:"#0451A5",token:"markup.changed"},{foreground:"#0451A5",token:"punctuation.definition.quote.begin.markdown"},{foreground:"#0451A5",token:"punctuation.definition.list.begin.markdown"},{foreground:"#0F4A85",token:"markup.inline.raw"},{foreground:"#0F4A85",token:"punctuation.definition.tag"},{foreground:"#0F4A85",token:"meta.preprocessor"},{foreground:"#0F4A85",token:"entity.name.function.preprocessor"},{foreground:"#b5200d",token:"meta.preprocessor.string"},{foreground:"#096d48",token:"meta.preprocessor.numeric"},{foreground:"#0451A5",token:"meta.structure.dictionary.key.python"},{foreground:"#0F4A85",token:"storage"},{foreground:"#0F4A85",token:"storage.type"},{foreground:"#0F4A85",token:"storage.modifier"},{foreground:"#0F4A85",token:"keyword.operator.noexcept"},{foreground:"#0F4A85",token:"string"},{foreground:"#0F4A85",token:"meta.embedded.assembly"},{foreground:"#0F4A85",token:"string.comment.buffered.block.pug"},{foreground:"#0F4A85",token:"string.quoted.pug"},{foreground:"#0F4A85",token:"string.interpolated.pug"},{foreground:"#0F4A85",token:"string.unquoted.plain.in.yaml"},{foreground:"#0F4A85",token:"string.unquoted.plain.out.yaml"},{foreground:"#0F4A85",token:"string.unquoted.block.yaml"},{foreground:"#0F4A85",token:"string.quoted.single.yaml"},{foreground:"#0F4A85",token:"string.quoted.double.xml"},{foreground:"#0F4A85",token:"string.quoted.single.xml"},{foreground:"#0F4A85",token:"string.unquoted.cdata.xml"},{foreground:"#0F4A85",token:"string.quoted.double.html"},{foreground:"#0F4A85",token:"string.quoted.single.html"},{foreground:"#0F4A85",token:"string.unquoted.html"},{foreground:"#0F4A85",token:"string.quoted.single.handlebars"},{foreground:"#0F4A85",token:"string.quoted.double.handlebars"},{foreground:"#811F3F",token:"string.regexp"},{foreground:"#0F4A85",token:"punctuation.definition.template-expression.begin"},{foreground:"#0F4A85",token:"punctuation.definition.template-expression.end"},{foreground:"#0F4A85",token:"punctuation.section.embedded"},{foreground:"#000000",token:"meta.template.expression"},{foreground:"#0451A5",token:"support.constant.property-value"},{foreground:"#0451A5",token:"support.constant.font-name"},{foreground:"#0451A5",token:"support.constant.media-type"},{foreground:"#0451A5",token:"support.constant.media"},{foreground:"#0451A5",token:"constant.other.color.rgb-value"},{foreground:"#0451A5",token:"constant.other.rgb-value"},{foreground:"#0451A5",token:"support.constant.color"},{foreground:"#264F78",token:"support.type.vendored.property-name"},{foreground:"#264F78",token:"support.type.property-name"},{foreground:"#264F78",token:"source.css variable"},{foreground:"#264F78",token:"source.coffee.embedded"},{foreground:"#0451A5",token:"support.type.property-name.json"},{foreground:"#0F4A85",token:"keyword"},{foreground:"#0F4A85",token:"keyword.control"},{foreground:"#000000",token:"keyword.operator"},{foreground:"#0F4A85",token:"keyword.operator.new"},{foreground:"#0F4A85",token:"keyword.operator.expression"},{foreground:"#0F4A85",token:"keyword.operator.cast"},{foreground:"#0F4A85",token:"keyword.operator.sizeof"},{foreground:"#0F4A85",token:"keyword.operator.alignof"},{foreground:"#0F4A85",token:"keyword.operator.typeid"},{foreground:"#0F4A85",token:"keyword.operator.alignas"},{foreground:"#0F4A85",token:"keyword.operator.instanceof"},{foreground:"#0F4A85",token:"keyword.operator.logical.python"},{foreground:"#0F4A85",token:"keyword.operator.wordlike"},{foreground:"#096d48",token:"keyword.other.unit"},{foreground:"#0F4A85",token:"punctuation.section.embedded.begin.php"},{foreground:"#0F4A85",token:"punctuation.section.embedded.end.php"},{foreground:"#0451A5",token:"support.function.git-rebase"},{foreground:"#096d48",token:"constant.sha.git-rebase"},{foreground:"#000000",token:"storage.modifier.import.java"},{foreground:"#000000",token:"variable.language.wildcard.java"},{foreground:"#000000",token:"storage.modifier.package.java"},{foreground:"#0F4A85",token:"variable.language"},{foreground:"#5e2cbc",token:"entity.name.function"},{foreground:"#5e2cbc",token:"support.function"},{foreground:"#5e2cbc",token:"support.constant.handlebars"},{foreground:"#5e2cbc",token:"source.powershell variable.other.member"},{foreground:"#5e2cbc",token:"entity.name.operator.custom-literal"},{foreground:"#185E73",token:"support.class"},{foreground:"#185E73",token:"support.type"},{foreground:"#185E73",token:"entity.name.type"},{foreground:"#185E73",token:"entity.name.namespace"},{foreground:"#185E73",token:"entity.other.attribute"},{foreground:"#185E73",token:"entity.name.scope-resolution"},{foreground:"#185E73",token:"entity.name.class"},{foreground:"#185E73",token:"storage.type.numeric.go"},{foreground:"#185E73",token:"storage.type.byte.go"},{foreground:"#185E73",token:"storage.type.boolean.go"},{foreground:"#185E73",token:"storage.type.string.go"},{foreground:"#185E73",token:"storage.type.uintptr.go"},{foreground:"#185E73",token:"storage.type.error.go"},{foreground:"#185E73",token:"storage.type.rune.go"},{foreground:"#185E73",token:"storage.type.cs"},{foreground:"#185E73",token:"storage.type.generic.cs"},{foreground:"#185E73",token:"storage.type.modifier.cs"},{foreground:"#185E73",token:"storage.type.variable.cs"},{foreground:"#185E73",token:"storage.type.annotation.java"},{foreground:"#185E73",token:"storage.type.generic.java"},{foreground:"#185E73",token:"storage.type.java"},{foreground:"#185E73",token:"storage.type.object.array.java"},{foreground:"#185E73",token:"storage.type.primitive.array.java"},{foreground:"#185E73",token:"storage.type.primitive.java"},{foreground:"#185E73",token:"storage.type.token.java"},{foreground:"#185E73",token:"storage.type.groovy"},{foreground:"#185E73",token:"storage.type.annotation.groovy"},{foreground:"#185E73",token:"storage.type.parameters.groovy"},{foreground:"#185E73",token:"storage.type.generic.groovy"},{foreground:"#185E73",token:"storage.type.object.array.groovy"},{foreground:"#185E73",token:"storage.type.primitive.array.groovy"},{foreground:"#185E73",token:"storage.type.primitive.groovy"},{foreground:"#185E73",token:"meta.type.cast.expr"},{foreground:"#185E73",token:"meta.type.new.expr"},{foreground:"#185E73",token:"support.constant.math"},{foreground:"#185E73",token:"support.constant.dom"},{foreground:"#185E73",token:"support.constant.json"},{foreground:"#185E73",token:"entity.other.inherited-class"},{foreground:"#185E73",token:"punctuation.separator.namespace.ruby"},{foreground:"#b5200d",token:"keyword.control"},{foreground:"#b5200d",token:"source.cpp keyword.operator.new"},{foreground:"#b5200d",token:"source.cpp keyword.operator.delete"},{foreground:"#b5200d",token:"keyword.other.using"},{foreground:"#b5200d",token:"keyword.other.directive.using"},{foreground:"#b5200d",token:"keyword.other.operator"},{foreground:"#b5200d",token:"entity.name.operator"},{foreground:"#001080",token:"variable"},{foreground:"#001080",token:"meta.definition.variable.name"},{foreground:"#001080",token:"support.variable"},{foreground:"#001080",token:"entity.name.variable"},{foreground:"#001080",token:"constant.other.placeholder"},{foreground:"#02715D",token:"variable.other.constant"},{foreground:"#02715D",token:"variable.other.enummember"},{foreground:"#001080",token:"meta.object-literal.key"},{foreground:"#0451A5",token:"support.constant.property-value"},{foreground:"#0451A5",token:"support.constant.font-name"},{foreground:"#0451A5",token:"support.constant.media-type"},{foreground:"#0451A5",token:"support.constant.media"},{foreground:"#0451A5",token:"constant.other.color.rgb-value"},{foreground:"#0451A5",token:"constant.other.rgb-value"},{foreground:"#0451A5",token:"support.constant.color"},{foreground:"#D16969",token:"punctuation.definition.group.regexp"},{foreground:"#D16969",token:"punctuation.definition.group.assertion.regexp"},{foreground:"#D16969",token:"punctuation.definition.character-class.regexp"},{foreground:"#D16969",token:"punctuation.character.set.begin.regexp"},{foreground:"#D16969",token:"punctuation.character.set.end.regexp"},{foreground:"#D16969",token:"keyword.operator.negation.regexp"},{foreground:"#D16969",token:"support.other.parenthesis.regexp"},{foreground:"#811F3F",token:"constant.character.character-class.regexp"},{foreground:"#811F3F",token:"constant.other.character-class.set.regexp"},{foreground:"#811F3F",token:"constant.other.character-class.regexp"},{foreground:"#811F3F",token:"constant.character.set.regexp"},{foreground:"#000000",token:"keyword.operator.quantifier.regexp"},{foreground:"#EE0000",token:"keyword.operator.or.regexp"},{foreground:"#EE0000",token:"keyword.control.anchor.regexp"},{foreground:"#0F4A85",token:"constant.character"},{foreground:"#EE0000",token:"constant.character.escape"},{foreground:"#000000",token:"entity.name.label"},{foreground:"#316BCD",token:"token.info-token"},{foreground:"#CD9731",token:"token.warn-token"},{foreground:"#CD3131",token:"token.error-token"},{foreground:"#800080",token:"token.debug-token"}],encodedTokensColors:[]}},"hc-black":{name:"hc-black",displayName:"Dark High Contrast",isDark:!0,colors:{success:"#FFFFFF",background:"#000000",text:"#FFFFFF"},data:{inherit:!1,base:"hc-black",colors:{"editor.background":"#000000","editor.foreground":"#FFFFFF","editorIndentGuide.background1":"#FFFFFF","editorIndentGuide.activeBackground1":"#FFFFFF","sideBarTitle.foreground":"#FFFFFF","selection.background":"#008000","editor.selectionBackground":"#FFFFFF","statusBarItem.remoteBackground":"#00000000","ports.iconRunningProcessForeground":"#FFFFFF","editorWhitespace.foreground":"#7c7c7c","actionBar.toggledBackground":"#383a49"},rules:[{foreground:"#FFFFFF",token:"meta.embedded"},{foreground:"#FFFFFF",token:"source.groovy.embedded"},{foreground:"#FFFFFF",token:"string meta.image.inline.markdown"},{foreground:"#FFFFFF",token:"variable.legacy.builtin.python"},{fontStyle:"italic",token:"emphasis"},{fontStyle:"bold",token:"strong"},{foreground:"#000080",token:"meta.diff.header"},{foreground:"#7ca668",token:"comment"},{foreground:"#569cd6",token:"constant.language"},{foreground:"#b5cea8",token:"constant.numeric"},{foreground:"#b5cea8",token:"constant.other.color.rgb-value"},{foreground:"#b5cea8",token:"constant.other.rgb-value"},{foreground:"#b5cea8",token:"support.constant.color"},{foreground:"#b46695",token:"constant.regexp"},{foreground:"#569cd6",token:"constant.character"},{foreground:"#569cd6",token:"entity.name.tag"},{foreground:"#d7ba7d",token:"entity.name.tag.css"},{foreground:"#d7ba7d",token:"entity.name.tag.less"},{foreground:"#9cdcfe",token:"entity.other.attribute-name"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.class.css"},{foreground:"#d7ba7d",token:"source.css entity.other.attribute-name.class"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.id.css"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.parent-selector.css"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.parent.less"},{foreground:"#d7ba7d",token:"source.css entity.other.attribute-name.pseudo-class"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.pseudo-element.css"},{foreground:"#d7ba7d",token:"source.css.less entity.other.attribute-name.id"},{foreground:"#d7ba7d",token:"entity.other.attribute-name.scss"},{foreground:"#f44747",token:"invalid"},{fontStyle:"underline",token:"markup.underline"},{fontStyle:"bold",token:"markup.bold"},{fontStyle:"bold",foreground:"#6796e6",token:"markup.heading"},{fontStyle:"italic",token:"markup.italic"},{fontStyle:"strikethrough",token:"markup.strikethrough"},{foreground:"#b5cea8",token:"markup.inserted"},{foreground:"#ce9178",token:"markup.deleted"},{foreground:"#569cd6",token:"markup.changed"},{foreground:"#808080",token:"punctuation.definition.tag"},{foreground:"#569cd6",token:"meta.preprocessor"},{foreground:"#ce9178",token:"meta.preprocessor.string"},{foreground:"#b5cea8",token:"meta.preprocessor.numeric"},{foreground:"#9cdcfe",token:"meta.structure.dictionary.key.python"},{foreground:"#569cd6",token:"storage"},{foreground:"#569cd6",token:"storage.type"},{foreground:"#569cd6",token:"storage.modifier"},{foreground:"#ce9178",token:"string"},{foreground:"#ce9178",token:"string.tag"},{foreground:"#ce9178",token:"string.value"},{foreground:"#d16969",token:"string.regexp"},{foreground:"#569cd6",token:"punctuation.definition.template-expression.begin"},{foreground:"#569cd6",token:"punctuation.definition.template-expression.end"},{foreground:"#569cd6",token:"punctuation.section.embedded"},{foreground:"#ffffff",token:"meta.template.expression"},{foreground:"#d4d4d4",token:"support.type.vendored.property-name"},{foreground:"#d4d4d4",token:"support.type.property-name"},{foreground:"#d4d4d4",token:"source.css variable"},{foreground:"#d4d4d4",token:"source.coffee.embedded"},{foreground:"#569cd6",token:"keyword"},{foreground:"#569cd6",token:"keyword.control"},{foreground:"#d4d4d4",token:"keyword.operator"},{foreground:"#569cd6",token:"keyword.operator.new"},{foreground:"#569cd6",token:"keyword.operator.expression"},{foreground:"#569cd6",token:"keyword.operator.cast"},{foreground:"#569cd6",token:"keyword.operator.sizeof"},{foreground:"#569cd6",token:"keyword.operator.logical.python"},{foreground:"#b5cea8",token:"keyword.other.unit"},{foreground:"#d4d4d4",token:"support.function.git-rebase"},{foreground:"#b5cea8",token:"constant.sha.git-rebase"},{foreground:"#d4d4d4",token:"storage.modifier.import.java"},{foreground:"#d4d4d4",token:"variable.language.wildcard.java"},{foreground:"#d4d4d4",token:"storage.modifier.package.java"},{foreground:"#569cd6",token:"variable.language.this"},{foreground:"#DCDCAA",token:"entity.name.function"},{foreground:"#DCDCAA",token:"support.function"},{foreground:"#DCDCAA",token:"support.constant.handlebars"},{foreground:"#DCDCAA",token:"source.powershell variable.other.member"},{foreground:"#4EC9B0",token:"support.class"},{foreground:"#4EC9B0",token:"support.type"},{foreground:"#4EC9B0",token:"entity.name.type"},{foreground:"#4EC9B0",token:"entity.name.namespace"},{foreground:"#4EC9B0",token:"entity.name.scope-resolution"},{foreground:"#4EC9B0",token:"entity.name.class"},{foreground:"#4EC9B0",token:"storage.type.cs"},{foreground:"#4EC9B0",token:"storage.type.generic.cs"},{foreground:"#4EC9B0",token:"storage.type.modifier.cs"},{foreground:"#4EC9B0",token:"storage.type.variable.cs"},{foreground:"#4EC9B0",token:"storage.type.annotation.java"},{foreground:"#4EC9B0",token:"storage.type.generic.java"},{foreground:"#4EC9B0",token:"storage.type.java"},{foreground:"#4EC9B0",token:"storage.type.object.array.java"},{foreground:"#4EC9B0",token:"storage.type.primitive.array.java"},{foreground:"#4EC9B0",token:"storage.type.primitive.java"},{foreground:"#4EC9B0",token:"storage.type.token.java"},{foreground:"#4EC9B0",token:"storage.type.groovy"},{foreground:"#4EC9B0",token:"storage.type.annotation.groovy"},{foreground:"#4EC9B0",token:"storage.type.parameters.groovy"},{foreground:"#4EC9B0",token:"storage.type.generic.groovy"},{foreground:"#4EC9B0",token:"storage.type.object.array.groovy"},{foreground:"#4EC9B0",token:"storage.type.primitive.array.groovy"},{foreground:"#4EC9B0",token:"storage.type.primitive.groovy"},{foreground:"#4EC9B0",token:"meta.type.cast.expr"},{foreground:"#4EC9B0",token:"meta.type.new.expr"},{foreground:"#4EC9B0",token:"support.constant.math"},{foreground:"#4EC9B0",token:"support.constant.dom"},{foreground:"#4EC9B0",token:"support.constant.json"},{foreground:"#4EC9B0",token:"entity.other.inherited-class"},{foreground:"#4EC9B0",token:"punctuation.separator.namespace.ruby"},{foreground:"#C586C0",token:"keyword.control"},{foreground:"#C586C0",token:"source.cpp keyword.operator.new"},{foreground:"#C586C0",token:"source.cpp keyword.operator.delete"},{foreground:"#C586C0",token:"keyword.other.using"},{foreground:"#C586C0",token:"keyword.other.directive.using"},{foreground:"#C586C0",token:"keyword.other.operator"},{foreground:"#9CDCFE",token:"variable"},{foreground:"#9CDCFE",token:"meta.definition.variable.name"},{foreground:"#9CDCFE",token:"support.variable"},{foreground:"#9CDCFE",token:"meta.object-literal.key"},{foreground:"#CE9178",token:"support.constant.property-value"},{foreground:"#CE9178",token:"support.constant.font-name"},{foreground:"#CE9178",token:"support.constant.media-type"},{foreground:"#CE9178",token:"support.constant.media"},{foreground:"#CE9178",token:"constant.other.color.rgb-value"},{foreground:"#CE9178",token:"constant.other.rgb-value"},{foreground:"#CE9178",token:"support.constant.color"},{foreground:"#CBEDCB",token:"meta.resultLinePrefix.contextLinePrefix.search"}],encodedTokensColors:[]}}},eO=e=>e in eN,eM=()=>"matchMedia"in window&&window.matchMedia("(prefers-color-scheme: dark)").matches,eG=(e,t)=>({...eN[e?"vs-dark":"vs"].colors,...t??{}}),e$=e=>{let t="function"==typeof e?e():e;if(null==t)return e$({});if("string"==typeof t)return e$({name:t.trim()});if("boolean"==typeof t)return e$({isDark:t});let{name:r,isDark:o,colors:n}=t;return(0,b.HC)(r)&&eO(r)&&(o=eN[r].isDark,n=n?{...eN[r].colors,...n}:eN[r].colors),null==o&&(o=eM()),r||(r=o?"vs-dark":"vs"),{name:r,isDark:o,colors:eG(o,n)}},eq=e=>(0,b.Ti)(e,e=>(0,b.HC)(e.name)&&"isDark"in e&&"boolean"==typeof e.isDark&&eH(e.data)),eH=e=>(0,b.Ti)(e,e=>(0,b.HC)(e.base)&&Array.isArray(e.rules)&&e.rules.length>0&&(0,b.Ti)(e.colors)),eU=({children:e,...t})=>null!=t.error?ev("ErrorDisplay",t):(0,s.jsx)(s.Fragment,{children:e}),eW=({children:e,...t})=>t.process!==ep.Completed?ev("Loader",t):(0,s.jsx)(s.Fragment,{children:e}),ez=({baseUrl:e,assets:t,query:r,isFetchDownload:o=!0,isCompressed:n=!0,isBlobWorker:a,showText:i,progressBar:d,dir:u,width:c,withContainer:l,defaultText:g,children:f,emitter:p,className:h,style:m,shouldPreload:k,...b})=>{let y=(0,v.useMemo)(()=>{let t=ed();if(!e)return t;try{return new URL(e||"",location.origin)}catch(e){return t}},[e]),w=(0,v.useMemo)(()=>(function(e){let t=[{key:"main",url:"editor.main.umd.js",priority:-50,type:"js"},{key:"worker/editor",url:"editor.worker.umd.js",labels:eu},{key:"worker/ts",url:"ts.worker.umd.js",labels:ec},{key:"worker/html",url:"html.worker.umd.js",labels:el},{key:"worker/json",url:"json.worker.umd.js",labels:eg},{key:"worker/css",url:"css.worker.umd.js",labels:ef}];if(e?.length){let r=[];for(let o of t){let t=e.find(e=>e.key===o.key);null!=t?r.push(t):Object.assign(o,t)}return t.concat(r)}return t})(t),[t]),F=(0,v.useRef)(k);F.current=k;let C=(0,v.useCallback)(e=>{let{asset:t}=e,{key:r,url:o}=t;if($(r))return!0;if(G(r)){let e=new URL(o,y);if(a||e.origin!==location.origin)return t.blobUrl=!0,!0}return!!F.current&&F.current(e)},[y,a]),B=N({...b,key:"monaco",baseUrl:y,assets:w,query:r,isFetchDownload:o,isCompressed:n,shouldPreload:C},{emitter:p}),x=(0,v.useMemo)(()=>B.state===S.Pending?ep.Initializing:B.state===S.Loading?B.process===_.Prepare?ep.Initializing:B.process===_.Loaded?ep.Preparing:ep.Loading:ep.Completed,[B]);return(0,s.jsx)(eW,{showText:i,progressBar:d,dir:u,width:c,withContainer:l,defaultText:g,className:h,style:m,process:x,percent:B.percent,isFetchDownload:o,state:B,children:f})},eZ=(0,v.createContext)({monacoRef:{current:void 0},emitterRef:{current:void 0},error:void 0,setError:()=>void 0,readyState:eh.Prepare,setReadyState:()=>void 0,lifecycleId:0,findLanguage:()=>void 0,refMonaco:()=>{throw Error("Invalid runtime")},extendThemes:()=>void 0}),eK=()=>"undefined"==typeof monaco?eh.Prepare:eh.Mounting,eV=()=>globalThis.monaco,eQ=({texts:e,components:t,loader:r,events:o,style:n,className:a,children:i,...d})=>{let u=(0,v.useRef)(r?.query),c=(0,v.useRef)(eV()),l=K(o),[g,f]=(0,v.useState)(void 0),[p,h]=(0,v.useState)(eK),[m,k]=(0,v.useState)(0),b=(0,v.useRef)(m),y=(0,v.useMemo)(()=>eA({...eB(n),position:"relative"}),[n]),F=w({initTexts:eC,initComponents:eP,texts:e,components:t});(0,O.LI)(()=>{(0,B.Z)(u.current,r?.query)||(u.current=r?.query,k(e=>e+1))},[r?.query]);let x=(0,v.useCallback)(()=>m!==b.current,[m]);return(0,s.jsx)(C,{preset:F,children:(0,s.jsx)(eZ.Provider,{value:{monacoRef:c,emitterRef:l,error:g,setError:f,readyState:p,setReadyState:h,lifecycleId:m,findLanguage:function(e){if(null==c.current||!e)return;let t=e;return t.startsWith(".")||(t=`.${t}`),c.current.languages.getLanguages().find(e=>e.extensions?.includes(t))},refMonaco:E,extendThemes:function(){if(null!=c.current)for(let[e,t]of Object.entries(eN))c.current.editor.defineTheme(t.name,t.data)}},children:(0,s.jsx)("div",{className:`${ex.container} ${y}${a?` ${a}`:""}`,children:(0,s.jsxs)(eU,{scope:"MonacoProvider",error:g,withContainer:!0,children:[(0,s.jsx)(ez,{...r,withContainer:!0,emitter:l.current,onError:f,onMount:A,shouldReload:x,onLoad:()=>{b.current=m,h(eh.Mounting)}}),i]})})})});async function A(e){try{if("undefined"==typeof monaco)throw Error(F.getText("ERR_MONACO_UNDEFINED"));c.current=E(),function({props:{assets:e,baseUrl:t},resultSet:{blobUrls:r},preloadAssets:o}){let n;let a=[];for(let i of e){if(!q(i))continue;let{key:e,labels:s}=i,d=o.find(e=>e.key===i.key),u=(d?d.blobUrl?r[e]??d.url:d.url:new URL(i.url,t)).toString();G(e,"editor")?n={url:u,labels:s}:a.push({url:u,labels:s})}if(null==n)throw Error(F.getText("ERR_NO_EDITOR_WORKER"));if(!a.length)throw Error(F.getText("ERR_WORKERS_EMPTY"));J({getWorkerUrl:(e,t)=>{for(let e of a)if(e.labels.length&&e.labels.includes(t))return e.url;return n.url}})}(e),l.current?.emit("mounting",{monaco:monaco})}catch(e){f(e)}}function E(){let e=eV();if(null==e)throw Error(F.getText("ERR_MONACO_UNDEFINED"));return e}},eJ=()=>(0,v.useContext)(eZ),eY=(0,v.forwardRef)(({input:e,debug:t,options:r,className:o,style:n,onPrepareModel:a,onCreateModel:i,onChangeModel:d,onDisposeModel:u,onChangeInput:c,onPrepareEditor:l,onMountEditor:g,onDisposeEditor:f,onFocus:p,onBlur:h},m)=>{let k=(0,v.useRef)(null),b=(0,v.useRef)(e),y=(0,v.useRef)(void 0),w=(0,v.useRef)(void 0),F=(0,v.useRef)(!1),C=(0,v.useRef)(r),{debug:x}=em(["CodeEditor","color: yellow"],t),A=(0,O.$0)(a),E=(0,O.$0)(i),S=(0,O.$0)(d),_=(0,O.$0)(u),j=(0,O.$0)(c),I=(0,O.$0)(l),R=(0,O.$0)(g),T=(0,O.$0)(f),L=(0,O.$0)(p),D=(0,O.$0)(h),{imaging:P}=eF(),{getText:N}=ek(),M=eJ(),{emitterRef:G,readyState:$,setReadyState:q,setError:H,refMonaco:U,findLanguage:W}=M;(0,v.useImperativeHandle)(m,()=>({...M,containerRef:k,inputRef:b,modelRef:y,editorRef:w}),[M]);let z=(0,v.useMemo)(()=>["monaco-editor",ex.codeEditor,eA({...n,height:0,overflow:"hidden"}),o].filter(Boolean).join(" "),[n,o]);if((0,O.LI)(()=>{if($===eh.Mounting)try{(function(){let e=U();if(null==k.current)throw Error(N("ERR_NO_CONTAINER"));let t=P({editor:w.current,model:y.current}),{source:o,scroll:n,position:a}=t,i={mode:"code",monaco:e,editor:w.current,model:y.current,image:t};I?.(i),G.current?.emit("prepareEditor",i),y.current=Z(o?{...b.current,source:o}:b.current),null!=w.current&&(T?.(i),G.current?.emit("disposeEditor",i),w.current.dispose(),x("dispose editor"));let s={model:y.current,automaticLayout:!0,scrollBeyondLastLine:!1,autoIndent:"full",formatOnPaste:!0,formatOnType:!0,fontLigatures:"common-ligatures, slashed-zero",...r},d=e.editor.create(k.current,s);x("create editor",s);let u={mode:"code",monaco:e,editor:d,model:y.current};R?.({...u,image:t}),G.current?.emit("mountEditor",{...u,image:t}),n&&d.setScrollPosition(n),a&&(d.focus(),d.setPosition(a)),d.onDidFocusEditorText(()=>{F.current=!0,L?.(u)}),d.onDidBlurEditorText(()=>{F.current=!1,D?.(u)}),w.current=d})(),q(eh.Mounted)}catch(e){H(e)}},[$]),(0,O.LI)(()=>{null==w.current||(0,B.Z)(C.current,r)||(C.current=r,x("update editor options",r),w.current.updateOptions(r))},[r]),(0,O.LI)(()=>{if(null!=w.current&&(x("input changed"),j?.({input:e,monaco}),G.current?.emit("changeInput",{input:e,monaco}),Q(e)))try{y.current=Z(e),w.current.setModel(y.current)}catch(e){H(e)}},[e]),$!==eh.Prepare)return(0,s.jsx)("div",{ref:k,className:z});function Z(e){let t=U();if(!Q(e))throw Error(N("ERR_INVALID_CODE_INPUT"));if(e.model)return x(`reuse '${e.model.getLanguageId()}' model`,{model:e.model}),e.model;let{filename:r,source:o,uri:n}=e,a=n?t.Uri.parse(n):void 0,i=V(r),s=W(i),d=s?.id;if(d||(d=i?.replace(".","").toLowerCase()),null!=a){let r=t.editor.getModel(a);if(null!=r){let o={input:e,language:s,extname:i,uri:a,monaco:t,editor:w.current,model:r};_?.(o),G.current?.emit("disposeModel",o),r.dispose(),x(`dispose model by uri ${a.toString()}`)}}let u={input:e,language:s,extname:i,uri:a,monaco:t,editor:w.current};A?.(u),G.current?.emit("prepareModel",u);let c=t.editor.createModel(o||"",d,a);return x(`create '${d}' model`,e),c.onDidChangeContent(e=>{S?.({...u,model:c,event:e}),G.current?.emit("changeModel",{...u,model:c,event:e})}),E?.({...u,model:c}),G.current?.emit("createModel",{...u,model:c}),c}}),[eX,e0]=et({baseUrl:"https://cdn.jsdelivr.net/npm/@react-monaco/assets/assets/locales/"}),e1=[{key:"cs",name:"Czech"},{key:"de",name:"German"},{key:"es",name:"Spanish"},{key:"fr",name:"French"},{key:"it",name:"Italian"},{key:"ja",name:"Japanese"},{key:"ko",name:"Korean"},{key:"pl",name:"Polish"},{key:"pt-br",name:"Portuguese"},{key:"ru",name:"Russian"},{key:"zh-hans",name:"简体中文"},{key:"zh-hant",name:"繁體中文"}];class e5 extends ee{props;scopeName;locale;assetKey;constructor(e,t){super(t),this.props=e,this.scopeName="Locale",this.assetKey="",this.prepareAssets=({preloadAssets:e})=>{let t=e1.find(e=>e.key===this.locale);if(null==t){this.debug(`unknown locale '${this.locale}'`);return}if(window.MonacoLocales?.[t.key]!=null){J({locale:t.key}),this.debug(`'${this.locale}' is loaded`);return}this.assetKey=`locale/${t.key}`,e.push({key:this.assetKey,url:new URL(`${t.key}.json`,this.baseUrl),priority:-1e3,type:"json"}),this.debug(`add asset '${this.assetKey}'`)},this.asset=({key:e,handle:t,task:r})=>{if((0,b.HC)(this.locale)&&this.assetKey===e){try{let e=JSON.parse(new TextDecoder().decode(r.chunks));(0,b.Ti)(e)&&this.injectLocale(this.locale,e)}catch(e){console.error(`Locale: parse '${this.assetKey}' JSON error`,e)}t()}},this.injectLocale=(e,t)=>{null==window.MonacoLocales&&(window.MonacoLocales={}),window.MonacoLocales[e]=t,J({locale:e}),this.debug(`inject locale '${e}' into MonacoEnvironment`)},this.switchLocale=async e=>{"undefined"!=typeof monaco&&(this.debug(`switch locale to '${e}'`),this.locale=e,delete window.MonacoEnvironment)},this.locale=e.locale,this.register("prepareAssets").register("asset"),this.debug(`constructor with locale '${this.locale}'`)}get baseUrl(){return this.props.baseUrl||e0("baseUrl")}prepareAssets;asset;injectLocale;switchLocale}let e8=e=>{let{locale:t,debug:r}=e,o=(0,v.useRef)(t),{emitterRef:n,setError:a}=eJ(),i=(0,v.useRef)(null);if(null==i.current)try{i.current=new e5(e,{debug:r}),i.current.inject(n.current)}catch(e){a(e)}return(0,v.useLayoutEffect)(()=>()=>{i.current?.eject(n.current),i.current=null},[]),(0,v.useEffect)(()=>{o.current!==t&&(o.current=t,i.current?.switchLocale(t))},[t]),null};var e9=r(8873),e2=r(3092);let[e6,e3]=et({onigurumaWasmUrl:en(ei("repo"),"vscode-oniguruma/release/onig.wasm"),baseUrl:es("tm/"),languages:";yaml;yaml-embedded;yaml-1.3;yaml-1.2;yaml-1.1;yaml-1.0;xsl;xml;asp-vb-net;typescriptreact;typescript;jsdoc.ts.injection;jsdoc.js.injection;sql;swift;shell-unix-bash;shaderlab;searchresult;scss;sassdoc;ruby;rust;cshtml;pug;rst;magicregexp;magicpython;r;powershell;php;html;md-math;md-math-inline;md-math-fence;md-math-block;make;log;objective-c;objective-c++;less;lua;perl6;perl;tex;markdown-latex-combined;latex;cpp-grammar-bailout;bibtex;markdown;html;html-derivative;ini;java;javascriptreact;javascript;handlebars;hlsl;snippets;jsonl;jsonc;json;fsharp;ignore;git-rebase;git-commit;go;diff;docker;groovy;julia;dart;csharp;css;batchfile;coffeescript;clojure;platform;cuda-cpp;cpp;cpp.embedded.macro;c;dbml;kotlin;"}),e4=e=>e3("languages").includes(`;${e};`),e7=(e,t)=>{let r="";if(!t[0])return"";for(let e=t[0].length-1;e>=0;e-=1){let o=t[0][e];if("."===o)break;r=o+r}for(let o=t.length-1;o>=0;o-=1){let n=t[o];if(null!=n){for(let t=n.length-1;t>=0;t-=1)if("."===n[t]){let o=n.slice(0,t);if(e._themeService._theme._tokenTheme._match(`${o}.${r}`)._foreground>1)return`${o}.${r}`;if(e._themeService._theme._tokenTheme._match(o)._foreground>1)return o}}}return""};class te{_ruleStack;constructor(e){this._ruleStack=e}get ruleStack(){return this._ruleStack}clone(){return new te(this._ruleStack)}equals(e){return!!e&&e instanceof te&&e===this&&e._ruleStack===this._ruleStack}}class tt extends ee{props;scopeName;wasmKey;wireGrammars;providers;code;vsRegistry;vsOnigurumaLib;constructor(e,t){super(t),this.props=e,this.scopeName=["Textmate","color: orange"],this.wasmKey="wasm/onigasm",this.wireGrammars={},this.providers={},this.prepareAssets=({preloadAssets:e})=>{e.push(this.wasmAsset),this.debug(`add asset '${this.wasmKey}'`)},this.onAssetVSCodeWasm=async({task:e,handle:t})=>{if(null!=e.chunks)try{await (0,e9.loadWASM)(e.chunks.buffer),this.vsOnigurumaLib=Promise.resolve({createOnigScanner:e=>new e9.OnigScanner(e),createOnigString:e=>new e9.OnigString(e)}),this.debug("vscode-oniguruma wasm loaded")}catch(e){this.debug("load vscode-oniguruma wasm error",e)}null==this.vsOnigurumaLib?this.debug("vscode-oniguruma lib instance is null"):(this.vsRegistry=this.newVsCodeRegistry(this.vsOnigurumaLib),this.debug("create grammar registry")),t()},this.mounting=()=>{"function"==typeof this.options.mounting&&this.options.mounting()},this.prepareModel=e=>{let t,r;let{provider:o,onChange:n}=this.props,{language:a,extname:i}=e;if(null!=o&&(r=o(e)),null!=r)t=r.languageId,this.providers[t]=r;else if(null!=a)t=a.id;else if(null!=i){let e=(i||"").replace(/^./gm,"").toLowerCase();e4(e)&&(t=e)}this.code=this.createCodeSet(t,e,r),this.debug("create code set",this.code)},this.createCodeSet=(e,t,r)=>{let{onChange:o,filter:n}=this.props,a=Date.now(),{monaco:i,language:s}=t,d=!1,u=(t.extname||"").toLowerCase();if(!e){o?.({isActive:d,languageId:"plaintext",extname:u,timestamp:a});return}d=!0,null==s&&i.languages.register({id:e,extensions:[u??""]}),o?.({isActive:d,languageId:e,extname:u,timestamp:a});let c={...this.selectTextmateScope(e,u,s,r),isWired:!1,language:s,extname:u,languageId:e,provider:this.providers[e]};return n?n(c):c},this.selectTextmateScope=(e,t,r,o)=>{let n=e,a=`source${t}`;switch(t){case".tsx":n="typescriptreact";break;case".jsx":n="javascriptreact"}switch(r?.id){case"python":n="magicpython",a="source.python";break;case"scss":a="source.css.scss";break;case"rust":a="source.rust"}return o?.scopeName&&(a=o.scopeName),{scopeName:a,tmName:n}},this.createModel=({monaco:e,editor:t})=>this.wireVsCodeState(e,t),this.mountEditor=({monaco:e,editor:t})=>this.wireVsCodeState(e,t),this.wireVsCodeState=(e,t)=>{if(null==e||null==t||null==this.code||null==this.vsRegistry)return;let{isWired:r,languageId:o,scopeName:n,tmName:a,language:i}=this.code;if(!r&&(e4(a)||this.providers[o])&&(this.debug("wire grammar",{languageId:o,scopeName:n,tmName:a}),!this.wireGrammars[a])){var s;this.wireGrammars[a]=!0;let r=new Map;r.set(o,n),(s=this.vsRegistry,Promise.all(Array.from(r.keys()).map(async o=>{let n=r.get(o);if(null==n)return;let a=await s.loadGrammar(n);null!=a&&e.languages.setTokensProvider(o,{getInitialState:()=>new te(e2.INITIAL),tokenize:(e,r)=>{let o=a.tokenizeLine(e,r.ruleStack);return{endState:new te(o.ruleStack),tokens:o.tokens.map(e=>({...e,scopes:t?e7(t,e.scopes):e.scopes[e.scopes.length-1]}))}}})}))).then(()=>{this.debug("wire grammar done")})}},this.newVsCodeRegistry=e=>new e2.Registry({onigLib:e,loadGrammar:async e=>{if(null==this.code)return null;try{let t=this.baseUrl,r=new URL(`${this.code.tmName}.tmLanguage.json`,t);null!=this.code.provider&&(r=new URL(this.code.provider.url,t)),this.debug(`load '${e}' grammar from ${r}`);let o=await fetch(r,{cache:"force-cache"}),n=await o.text();return this.debug(`load '${e}' grammar success, size:`,n.length),(0,e2.parseRawGrammar)(n,r.toString())}catch(t){console.log(`load ${e} grammar error`,t)}return null}}),this.register("prepareAssets").register("onAssetVSCodeWasm",`asset:${this.wasmKey}`).register("mounting").register("prepareModel").register("createModel").register("mountEditor")}get baseUrl(){return this.props.baseUrl||e3("baseUrl")}get onigurumaWasmUrl(){return this.props.onigurumaWasmUrl||e3("onigurumaWasmUrl")}get wasmAsset(){return{key:this.wasmKey,url:new URL(this.onigurumaWasmUrl,this.baseUrl),priority:100,type:"wasm"}}prepareAssets;onAssetVSCodeWasm;mounting;prepareModel;createCodeSet;selectTextmateScope;createModel;mountEditor;wireVsCodeState;newVsCodeRegistry}let tr=e=>{let{emitterRef:t,setError:r,extendThemes:o,lifecycleId:n}=eJ(),a=(0,v.useRef)(null);return(0,v.useLayoutEffect)(()=>{try{a.current=new tt(e,{mounting:o,debug:e.debug}),a.current.inject(t.current)}catch(e){r(e)}return()=>{a.current?.eject(t.current),a.current=null}},[n]),null},[to,tn]=et({baseUrl:es("themes/")});class ta extends ee{settings;props;scopeName;assetKey;themeName;loadedThemes;definedThemes;loading;constructor(e,t,r){super(r),this.settings=e,this.props=t,this.scopeName=["Themes","color: lightgreen"],this.loadedThemes={},this.definedThemes={},this.pickTheme=(e,t=!0)=>{if(t&&e&&eO(e))throw Error(`'${e}' is a monaco builtin theme`);let r=this.settings.themes.find(t=>t.key===e);if(null==r)throw Error(`unknown theme '${this.themeName}'`);return r},this.makeThemeUrl=e=>new URL(e.url||`${e.key}.json`,this.baseUrl),this.prepareAssets=({preloadAssets:e})=>{try{let t=this.pickTheme(this.themeName),r=t.theme??this.loadedThemes[t.key];if(null!=r){this.debug(`theme '${t.key}' is defined`);return}this.assetKey=`theme/${t.key}`,e.push({key:this.assetKey,url:this.makeThemeUrl(t),priority:-500,type:"json"}),this.debug(`add asset '${this.assetKey}'`)}catch(e){this.debug((0,b.Os)(e))}},this.asset=({key:e,handle:t,task:r})=>{if((0,b.HC)(this.themeName)&&this.assetKey===e){try{let e=JSON.parse(new TextDecoder().decode(r.chunks));if(!eq(e))throw Error(`'${this.assetKey}' not a valid monaco theme data`);this.loadedThemes[this.themeName]=e,this.props.onLoad?.({isSuccess:!0,theme:e})}catch(e){this.debug(`parse '${this.assetKey}' JSON error`,e),this.props.onLoad?.({isSuccess:!1})}t()}},this.mounting=({monaco:e})=>{if((0,b.HC)(this.themeName)&&!eO(this.themeName)){let e=this.settings.themes.find(e=>e.key===this.themeName),t=e?.theme??this.loadedThemes[this.themeName];t&&(this.defineTheme(t),this.props.onLoad?.({isSuccess:!0,theme:t}))}},this.preloadTheme=async e=>{this.debug(`preloadTheme ${e}`);try{if("undefined"==typeof monaco)throw Error("Global monaco undefined");if(this.loading)throw Error(`loading theme '${this.loading}'`);if(e&&eO(e)){this.debug(`'${e}' is monaco builtin theme`),this.props.onLoad?.({isSuccess:!0,theme:eN[e],isPreload:!0});return}let t=this.pickTheme(e),r=t.theme??this.loadedThemes[t.key];if(null!=r){this.debug(`'${e}' is loaded`),this.defineTheme(r),this.props.onLoad?.({isSuccess:!0,theme:r,isPreload:!0});return}this.loading=t.key;let o=await fetch(this.makeThemeUrl(t),{cache:"force-cache"}),n=await o.json();if(!eq(n))throw Error(`'${this.assetKey}' not a valid monaco theme data`);this.loadedThemes[t.key]=n,this.defineTheme(n),this.props.onLoad?.({isSuccess:!0,theme:n,isPreload:!0})}catch(e){this.debug("preload theme error:",(0,b.Os)(e)),this.props.onLoad?.({isSuccess:!1,isPreload:!0})}finally{this.loading=void 0}},this.defineTheme=e=>(null==e||("undefined"==typeof monaco?this.debug("Global monaco undefined"):this.definedThemes[e.name]||(this.definedThemes[e.name]=!0,monaco.editor.defineTheme(e.name,e.data),this.debug(`define theme '${e.name}' to monaco`))),this),this.setTheme(t.theme),this.register("prepareAssets").register("asset").register("mounting"),this.debug(`constructor with theme '${t.theme}'`)}get baseUrl(){return this.settings.baseUrl||tn("baseUrl")}setTheme(e){return this.themeName=e||void 0,this}pickTheme;makeThemeUrl;prepareAssets;asset;mounting;preloadTheme;defineTheme}var ti=r(756),ts=r(7195),td=r(8436),tu=r(7117),tc=r(7865),tl=r(5952),tg=r(5830),tf=r(3160),tp=r(9918),th=r(9360),tm=r(3016),tk=r(1477),tb=r(2728);let ty=[{key:"main",url:new URL("https://cdn.jsdelivr.net/npm/jsoneditor@10.1.3/dist/jsoneditor.min.js"),type:"js",priority:-10},{key:"css",url:new URL("https://cdn.jsdelivr.net/npm/jsoneditor@10.1.3/dist/jsoneditor.min.css"),type:"css",priority:0}],tv=(0,v.forwardRef)((e,t)=>{let{className:r,value:o,syncValue:n,onMount:a,fontSize:i,...d}=e,u=(0,v.useRef)(null),[c,l]=(0,v.useState)(!1),[g,f]=(0,v.useState)(),[p,m]=(0,v.useState)(null),b=(0,v.useRef)(o);(0,v.useImperativeHandle)(t,()=>p,[p]),(0,O.LI)(()=>{n&&null!=p&&!(0,B.Z)(b.current,o)&&p.set(o)},[n,p,o]);let y=N({key:"jsoneditor",assets:ty,onLoad:async()=>{try{if(null==window.JSONEditor)throw Error("JSONEditor undefined");let e=new window.JSONEditor(u.current,{mode:"code",...d});e.set(o),l(!0),m(e),await (null==a?void 0:a(e))}catch(e){f(e)}},onError:f});return(0,s.jsx)(tw,{ref:u,display:"flex",flexDirection:"column",flex:"1 1 auto",alignItems:"center",justifyContent:"center",gap:"0.5em",className:r,children:null!=g?(0,s.jsxs)(h.Z,{sx:{maxWidth:420},children:["JSONEditor loader error:"," ",(0,s.jsx)("div",{children:(0,tk.O)(g)||"unknown error"})]}):c?null:(0,s.jsxs)(s.Fragment,{children:["Loading ",y.percent,"%",(0,s.jsx)(k.Z,{variant:"determinate",value:y.percent,sx:{minWidth:250}})]})})}),tw=(0,tu.ZP)(h.Z)`
  --jeFontSizeInput: ${e=>{let{fontSize:t}=e;return(0,tb.He)(t,14)}};
  --jeLineHeightInput: 1.5;
  
  --jeFontWeight: var(--font-mono-weight);
  --jeFontSize: calc(var(--jeFontSizeInput) * 1px);
  --jeLineHeight: calc(var(--jeFontSizeInput) * var(--jeLineHeightInput) * 1px);

  ${e=>{let{theme:{palette:t,shape:r}}=e;return{"--jeText":t.text.primary,"--jeTextSecondary":t.text.secondary,"--jeBorderColor":t.divider,"--jeBg":t.background.default,"--jeBgPaper":t.background.paper,"--jeActiveColor":t.action.active,"--jeFocusColor":t.action.focus,"--jeHoverColor":t.action.hover,"--jePrimary":t.primary.main,"--jePrimaryDark":t.primary.dark,"--jePrimaryLight":t.primary.light,"--jeSuccess":t.success.main,"--jeWarning":t.warning.main,"--jeInfo":t.info.main,"--jeError":t.error.main,"--jeCursor":"dark"===t.mode?t.grey[400]:t.primary.main,"--jeScrollBarThumbColor":"dark"===t.mode?"rgba(255, 255, 255, 0.2)":"rgba(0, 0, 0, 0.3)","--jeScrollBarThumbHoverColor":"dark"===t.mode?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.45)","--jeBorderRadius":`${r.borderRadius}px`,"--jeStatusBarColor":"rgba(255, 255, 255, 0.7)","--jeSelectedColor":"dark"===t.mode?t.primary.dark:t.primary.light}}}

  overflow: hidden;
  height: 0px;

  //////////////////////////////////////////////////////////////////////////////
  // jsoneditor common
  //////////////////////////////////////////////////////////////////////////////

  .jsoneditor {
    font-size: calc(var(--jeFontSize) * 0.8) !important;
    font-family: var(--font-sans) !important;
    color: var(--jeTextColor);
    border-color: var(--jePrimary);
    //border-width: 0px;
    border-radius: var(--jeBorderRadius);
    overflow: hidden;

    * {
      -webkit-font-smoothing: subpixel-antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-feature-settings: "liga", "clig", "zero";
      font-optical-sizing: auto;
      font-stretch: normal;
      font-variant-east-asian: simplified;
      font-variant-ligatures: common-ligatures;
      font-variant-numeric: slashed-zero;
      font-weight: 400;
      hyphenate-character: auto;
    }
  }

  .jsoneditor-popover,
  .jsoneditor-schema-error,
  div.jsoneditor td,
  div.jsoneditor textarea,
  div.jsoneditor th,
  div.jsoneditor-field,
  div.jsoneditor-value,
  pre.jsoneditor-preview {
    font-size: calc(var(--jeFontSize) * 0.9) !important;
    font-family: var(--font-mono) !important;
    font-weight: var(--jeFontWeight) !important;
    color: var(--jeText);
    line-height: calc(var(--jeLineHeight) * 0.9) !important;
  }

  .jsoneditor-navigation-bar, .jsoneditor-treepath-element {
    font-size: calc(var(--jeFontSize) * 0.8) !important;
    font-family: var(--font-mono) !important;
  }

  .jsoneditor-navigation-bar {
    background: var(--jePrimaryDark);
    color: var(--jeStatusBarColor);
    border-color: var(--jePrimaryDark);
  }

  .jsoneditor-menu {
    * {
      font-family: var(--font-sans) !important;
      font-size: calc(var(--jeFontSize) * 0.8) !important;
    }

    border-color: var(--jePrimary);
    background-color: var(--jePrimary);
  }

  .jsoneditor-statusbar {
    font-size: 12px;
    padding-left: 0.5em;
    line-height: 24px;
    font-family: var(--font-sans) !important;
    background: var(--jePrimary);
    color: var(--jeStatusBarColor);
    border-color: var(--jePrimary);
  }

  .jsoneditor .jsoneditor-validation-errors-container {
    background-color: var(--jePrimary);
    text-decoration: red;
  }

  .jsoneditor .jsoneditor-text-errors {
    border-top: 0px;
  }

  //////////////////////////////////////////////////////////////////////////////
  // code mode about ace_editor
  //////////////////////////////////////////////////////////////////////////////

  .ace-jsoneditor.ace_editor,
  textarea.jsoneditor-text.ace_editor {
    font-size: var(--jeFontSize) !important;
    font-family: var(--font-mono) !important;
    font-weight: var(--jeFontWeight) !important;
    line-height: var(--jeLineHeight) !important;
  }

  .ace-jsoneditor .ace_variable {
    color: var(--jeText);
  }

  .ace-jsoneditor .ace_gutter {
    background: var(--jeBgPaper);
    color: var(--jeText);
  }

  .ace-jsoneditor .ace_cursor {
    border-left: 2px solid var(--jeCursor);
  }

  .ace-jsoneditor .ace_overwrite-cursors .ace_cursor {
    border-left: 0px;
    border-bottom: 1px solid var(--jeCursor);
  }

  .ace-jsoneditor.ace_editor {
    background: var(--jeBg);
  }

  .ace-jsoneditor .ace_scroller {
    background-color: var(--jeBg);
  }

  .ace-jsoneditor .ace_marker-layer .ace_active-line {
    background: var(--jeFocusColor);
  }

  .ace-jsoneditor .ace_gutter-active-line {
    background-color: var(--jeHoverColor);
  }

  .ace-jsoneditor .ace_marker-layer .ace_selection {
    background: var(--jeSelectedColor);
  }

  .ace-jsoneditor.ace_multiselect .ace_selection.ace_start {
    box-shadow: 0 0 3px 0px var(--jePrimary);
    border-radius: 2px;
  }

  // types

  .ace-jsoneditor .ace_string {
    color: var(--jeSuccess);
  }

  .ace-jsoneditor .ace_constant.ace_numeric {
    color: var(--jeError);
  }

  .ace-jsoneditor .ace_constant.ace_language {
    color: var(--jeWarning);
  }

  .ace-jsoneditor .ace_entity.ace_name.ace_tag,
  .ace-jsoneditor .ace_entity.ace_other.ace_attribute-name {
    color: var(--jeTextSecondary);
  }

  .ace-jsoneditor.ace_multiselect .ace_selection.ace_start {
    box-shadow: 0 0 3px 0px red;
    border-radius: 2px;
  }

  .ace-jsoneditor .ace_indent-guide {
    position: relative;
    background-image: none;

    &:after {
      content: '';
      border-left: 1px dotted var(--jeBorderColor);
      display: inline-block;
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      height: calc(var(--jeLineHeight) - 1px);
    }
  }

  .ace_scrollbar, div.jsoneditor-tree, textarea.jsoneditor-text, pre.jsoneditor-preview {
    &::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }
  }

  .ace_scrollbar, div.jsoneditor-tree, textarea.jsoneditor-text, pre.jsoneditor-preview {
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }

  .ace_scrollbar, div.jsoneditor-tree, textarea.jsoneditor-text, pre.jsoneditor-preview {
    &::-webkit-scrollbar-thumb {
      background-color: var(--jeScrollBarThumbColor);
      border-radius: 6px;
      border: 2px solid rgba(0, 0, 0, 0);
      background-clip: padding-box;
      transition: background-color 250ms;

      &:hover {
        background-color: var(--jeScrollBarThumbHoverColor);
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // json editor context menu
  //////////////////////////////////////////////////////////////////////////////

  div.jsoneditor-tree {
    background-color: var(--jeBg);
  }

  tr.jsoneditor-highlight,
  tr.jsoneditor-selected {
    background-color: var(--jePrimaryDark);
  }

  .jsoneditor-mode-tree {
    .jsoneditor-outer > .jsoneditor-tree > .jsoneditor-tree-inner > table {
      > tbody {
        & > tr > td:nth-of-type(-n + 2) {
          background-color: var(--jeBgPaper);
        }
      }
    }
  }

  div.jsoneditor td.jsoneditor-separator {
    vertical-align: middle;
  }

  div.jsoneditor td.jsoneditor-tree {
    vertical-align: middle;
  }

  .jsoneditor-mode-view {
    div.jsoneditor-tree {
      background-color: var(--jeBg);
    }

    div.jsoneditor-tree button.jsoneditor-button:focus {
      background-color: var(--jePrimaryLight);
      outline: var(--jePrimaryLight) solid 1px;
      border-radius: var(--jeBorderRadius);
    }
  }

  .jsoneditor-mode-text {
    textarea.jsoneditor-text {
      background-color: var(--jeBg);
    }
  }

  .jsoneditor-modal #query,
  .jsoneditor-modal .jsoneditor-transform-preview {
    font-family: var(--font-mono) !important;
  }

  .jsoneditor-contextmenu .jsoneditor-menu {
    background: var(--jeBgPaper);
    border: 0px solid transparent;
    box-shadow: none;
    border-radius: var(--jeBorderRadius);
    overflow: hidden;

    button {
      color: var(--jeText);

      &:focus, &:hover {
        color: var(--jeStatusBarColor);
        background-color: var(--jePrimaryDark);
      }
    }
  }

  .jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected,
  .jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected:focus,
  .jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected:hover {
    color: var(--jeStatusBarColor);
    background-color: var(--jePrimary);
  }

  .jsoneditor-contextmenu .jsoneditor-text {
    padding: 0;
    height: 26px;
    line-height: 26px;
    padding-left: 2.25em;
  }

  .jsoneditor-contextmenu .jsoneditor-type-modes .jsoneditor-text {
    padding-left: 0.5em;
  }

  div.jsoneditor-value.jsoneditor-string {
    color: var(--jeSuccess);
  }

  div.jsoneditor-value.jsoneditor-number {
    color: var(--jeError);
  }

  div.jsoneditor-value.jsoneditor-boolean {
    color: var(--jeWarning);
  }

  div.jsoneditor-value.jsoneditor-null {
    color: var(--jeInfo);
  }

  div.jsoneditor-value.jsoneditor-color-value {
    color: var(--jeText);
  }

  div.jsoneditor-value.jsoneditor-invalid {
    color: var(--jeText);
  }

  div.jsoneditor-value.jsoneditor-array, div.jsoneditor-value.jsoneditor-object {
    color: var(--jeBorderColor);
  }

  div.jsoneditor-busy span {
    background-color: var(--jePrimary);
    border: 1px solid var(--jePrimary);
  }

  div.jsoneditor-field.jsoneditor-highlight,
  div.jsoneditor-field[contenteditable="true"]:focus,
  div.jsoneditor-field[contenteditable="true"]:hover,
  div.jsoneditor-value.jsoneditor-highlight,
  div.jsoneditor-value[contenteditable="true"]:focus,
  div.jsoneditor-value[contenteditable="true"]:hover {
    background-color: var(--jeHoverColor);
    border: 1px solid var(--jeHoverColor);
  }

  .jsoneditor-popover {
    background-color: var(--jePrimaryDark);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
    color: var(--jeStatusBarColor);

    //&.jsoneditor-above:before, &.jsoneditor-below:before, &.jsoneditor-left:before, &.jsoneditor-right:before {
    //  border-top-color: var(--jeBg);
    //}
  }

  .jsoneditor-popover.jsoneditor-above:before {
    border-top: 7px solid var(--jePrimaryDark);
  }

  .jsoneditor-popover.jsoneditor-below:before {
    border-bottom: 7px solid var(--jePrimaryDark);
  }

  .jsoneditor-popover.jsoneditor-left:before {
    border-left: 7px solid var(--jePrimaryDark);
  }

  .jsoneditor-popover.jsoneditor-right:before {
    border-right: 7px solid var(--jePrimaryDark);
  }
`,tF=e=>(0,tp.T)(e,e=>(0,tp.T)(e.colors)&&Array.isArray(e.tokenColors)&&(0,th.H)(e.type)),tC=(e,t)=>((0,tp.T)(e)?((0,th.H)(e.name)||t.push({path:["name"],message:"the key of 'name' is required and it should be an string."}),(0,th.H)(e.type)||t.push({path:["type"],message:"the key of 'type' is required and it should be an string."}),(0,tp.T)(e.colors)||t.push({path:["colors"],message:"the key of 'colors' is required and it should be an object."}),Array.isArray(e.tokenColors)||t.push({path:["tokenColors"],message:"the key of 'tokenColors' is required and it should be an array."})):t.push({path:[""],message:"VSCode theme should be an object."}),t.length<=0),tB=()=>{let[e,t]=(0,O._)("ThemeConverterLastInput",{}),r=(0,v.useRef)(null),o=(0,v.useRef)(e),[n,a]=(0,v.useState)();return(0,O.LI)(()=>{tF(e)&&a(function(e){let t=null!=e.type&&"dark"===e.type,r=e.name??"",o=tm.GL(e.name??""),n=(0,ti.convertTheme)(e),a={primary:n.colors["activityBarBadge.background"],secondary:n.colors["editor.selectionHighlightBackground"],success:n.colors["ports.iconRunningProcessForeground"],error:n.colors["statusBarItem.errorBackground"],background:n.colors["editor.background"],text:n.colors["editor.foreground"],borderColor:n.colors["checkbox.border"]};return null==a.error&&n.rules.forEach(e=>{"invalid"===e.token&&null!=e.foreground&&(a.error=e.foreground)}),n.base=t?"vs-dark":"vs",{name:o,displayName:r,isDark:t,colors:a,data:n}}(e))},[e]),(0,s.jsxs)(h.Z,{position:"relative",display:"flex",flexDirection:"row",flex:"1 1 auto",sx:{overflow:"hidden",height:0},children:[(0,s.jsx)(tx,{children:(0,s.jsx)(tv,{value:e,colorPicker:!0,modes:["tree","view","code","text","preview"],onValidate:function(e){if(!(0,B.Z)(o.current,e)){o.current=e,(0,tp.T)(e)&&null==e.type&&(0,th.H)(e.name)&&(e.type=e.name.toLowerCase().includes("light")?"light":e.name.toLowerCase().includes("dark")?"dark":"light");let r=[];if(!tC(e,r))return r.forEach(e=>console.log(e.message)),[];console.log("VSCode theme is valid!"),t(e)}return[]}})}),(0,s.jsx)(ts.Z,{orientation:"vertical",variant:"middle",flexItem:!0,sx:{mx:"0.5em"}}),(0,s.jsxs)(tx,{children:[(0,s.jsx)(td.Z,{name:"monaco-theme-name",variant:"filled",size:"small",label:"Theme Name",value:(null==n?void 0:n.name)??"",onChange:e=>{a(t=>null==t?void 0:{...t,name:e.target.value})}}),(0,s.jsx)(td.Z,{name:"monaco-theme-display-name",variant:"filled",size:"small",label:"Display Name",value:(null==n?void 0:n.displayName)??"",onChange:e=>{a(t=>null==t?void 0:{...t,displayName:e.target.value})}}),(0,s.jsx)(tv,{ref:r,mode:"code",value:n,syncValue:!0,colorPicker:!0})]})]})},tx=(0,tu.ZP)(h.Z)`
  display: flex;
  flex-direction: column;
  flex: 1 1 50%;
  overflow: hidden;
  gap: 0.5em;
`;tB.Dialog=e=>{let{open:t,onClose:r}=e,[o,n]=(0,v.useState)(!1);return((0,O.LI)(()=>{t&&!o&&n(!0)},[t,o]),o)?(0,s.jsxs)(tc.Z,{open:!!t,onClose:r,fullScreen:!0,children:[(0,s.jsx)(tl.Z,{children:"VSCode Theme Converter"}),(0,s.jsx)(tg.Z,{sx:{display:"flex",flexDirection:"column",flex:"1 1 auto"},children:(0,s.jsx)(tB,{})}),(0,s.jsx)(tf.Z,{children:(0,s.jsx)(m.Z,{color:"error",onClick:()=>null==r?void 0:r(),children:"Close"})})]}):null};var tA=r(3407);let[tE,tS]=et({dtsBaseUrl:"https://dts.kephp.com/pkg/",mounting:e=>{let{monaco:t}=e;t.languages.typescript.typescriptDefaults.setCompilerOptions({jsx:t.languages.typescript.JsxEmit.ReactJSX,target:t.languages.typescript.ScriptTarget.ESNext,allowNonTsExtensions:!0,moduleResolution:t.languages.typescript.ModuleResolutionKind.NodeJs,module:t.languages.typescript.ModuleKind.ESNext,esModuleInterop:!0,noEmit:!0})}}),t_=e=>{let{emitterRef:t,setError:r,lifecycleId:o}=eJ(),n=(0,v.useRef)(null);return(0,v.useLayoutEffect)(()=>{try{n.current=new tj(e),n.current.setOptions({debug:e.debug}),n.current.inject(t.current)}catch(e){r(e)}return()=>{var e;null===(e=n.current)||void 0===e||e.eject(t.current),n.current=null}},[o]),null};class tj extends ee{get dtsBaseUrl(){return this.props.dtsBaseUrl||tS("dtsBaseUrl")}constructor(e){super(),(0,tA._)(this,"props",void 0),(0,tA._)(this,"loadedLibs",void 0),(0,tA._)(this,"mounting",void 0),(0,tA._)(this,"prepareModel",void 0),(0,tA._)(this,"fetchDts",void 0),this.props=e,this.loadedLibs={},this.mounting=e=>{(this.props.mounting||tS("mounting"))(e),this.isDebug&&console.log("Typescript: mounting")},this.prepareModel=e=>{let{language:t,extname:r,input:o}=e,n=null==t?void 0:t.id;if("typescript"!==n&&"javascript"!==n)return;let a=new Set;(".tsx"===r||".jsx"===r)&&(a.add("react"),a.add("react/jsx-runtime"),a.add("react-dom")),a=tR(o.source??"",a),this.fetchDts(Array.from(a))},this.fetchDts=e=>{if("undefined"!=typeof monaco)for(let t of e)null==this.loadedLibs[t]&&fetch(new URL(`${t}`,this.dtsBaseUrl),{cache:"force-cache"}).then(e=>e.json().then(e=>{this.loadedLibs[t]=Date.now(),monaco.languages.typescript.typescriptDefaults.addExtraLib(`declare module '${t}' {
${e.source}
}`,`file:///${t}.d.ts`)})).catch(console.error)},this.register("prepareAssets").register("mounting").register("prepareModel")}}let tI=()=>/^(?:(import|export) .*|\})? from [\'\"]([^\"\']+)[\'\"];?$/gm,tR=(e,t)=>{for(let r of e.matchAll(tI()))r[2]&&!r[2].startsWith(".")&&t.add(r[2]);return t};var tT=r(746);location.origin;let tL="https://cdn.jsdelivr.net/npm/@react-monaco/assets/assets/";var tD=r(5210);let tP=(e,t)=>{let{primary:r,secondary:o,success:n,error:a,background:i,text:s,borderColor:d}=t;return(0,tD.Z)({palette:{mode:e?"dark":"light",primary:{main:r},secondary:{main:o},text:{primary:s},success:{main:n},error:{main:a},divider:d,background:{default:i}},spacing:2,shape:{borderRadius:4},components:{MuiButton:{defaultProps:{variant:"contained",size:"small"}},MuiSelect:{defaultProps:{size:"small",MenuProps:{anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"}}}}},typography:{fontSize:14,htmlFontSize:16,fontFamily:"var(--font-sans)",button:{textTransform:"none"}}})};var tN=r(9708);let tO=e=>{let{children:t}=e,{palette:r}=(0,tN.Z)();return(0,s.jsx)(h.Z,{display:"flex",gap:"4px",alignItems:"center",sx:{p:"4px",borderBottom:`1px solid ${r.divider}`},children:t})},tM=e=>{let{children:t}=e;return(0,s.jsx)(h.Z,{display:"flex",alignItems:"center",sx:{px:"0.5em",py:"4px",fontSize:"0.85em",flex:"0 0 22px",lineHeight:"22px"},gap:"0.5em",children:t})},tG="default",t$=e=>{let{value:t,onChange:r}=e,o=(0,v.useMemo)(()=>{let e=e1.find(e=>e.key===t);return(null==e?void 0:e.key)??tG},[t]);return(0,s.jsxs)(f.Z,{value:o,onChange:e=>{null==r||r(e.target.value===tG?void 0:e.target.value)},children:[(0,s.jsx)(p.Z,{value:tG,children:"Default"}),e1.map(e=>(0,s.jsx)(p.Z,{value:e.key,children:e.name},e.key))]})},tq={filename:"App.tsx",uri:"App.tsx",source:`
import { css } from '@emotion/css';
import Settings from '@mui/icons-material/Settings';
import {
  Box,
  Button,
  CssBaseline,
  LinearProgress,
  ThemeProvider,
} from '@mui/material';
import {
  MonacoCodeEditor,
  type MonacoCodeEditorProps,
  type MonacoCodeEditorRef,
  type MonacoPresetProgressBarProps,
  MonacoProvider,
  revertMonacoThemeSkeleton,
} from '@react-monaco/core';
import { LocaleInjection } from '@react-monaco/plugin-locale';
import {
  type TextmateCodeSet,
  type TextmateFilterCodeSetCallback,
  TextmateInjection,
  type TextmateProviderCallback,
  tmConfig,
} from '@react-monaco/plugin-textmate';
import { createThemesPlugin } from '@react-monaco/plugin-themes';
import { useMemo, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import type { TextmateActiveLanguage } from '../../../src/plugins/textmate';
import ThemeConverter from './experimental/theme-converter';
import { TypescriptInjection } from './experimental/typescript';
import { assetsOf } from './presets';
import { createTheme } from './theme';
import githubLight from './thtmes/github-light';
import {
  FileSelect,
  FileSelectOptions,
  FootBar,
  LanguageDisplay,
  LocaleSelect,
  ThemeSelect,
  TopBar,
} from './toolbar';
import EditOptions from './toolbar/EditOptions';
import type { NextTheme, SampleStorageData } from './types';

const editorOptions: MonacoCodeEditorProps['options'] = {
  // seems the better in windows
  lineHeight: 1.65,
  tabSize: 2,
  fontSize: 14.5,
  fontWeight: '300',
  fontFamily: 'var(--font-mono)',
  fontLigatures: 'no-common-ligatures, slashed-zero',
  letterSpacing: 0.025,
  minimap: { enabled: false },
  scrollbar: {
    verticalHasArrows: false,
    horizontalHasArrows: false,
    vertical: 'visible',
    horizontal: 'visible',
    verticalScrollbarSize: 13,
    horizontalScrollbarSize: 13,
    verticalSliderSize: 8,
    horizontalSliderSize: 8,
  },
};

const cssScrollBar = css\`
  .scrollbar .slider {
    border-radius: 10px;
  }
  .scrollbar.vertical {
    padding-top: 2px;
    .slider {
      margin-left: 1px;
    }
  }
\`;

const { themes, ThemesInjection } = createThemesPlugin({
  themes: [
    { key: 'atom-material-theme', name: 'Atom Material Theme' },
    { key: 'atom-one-light', name: 'Atom One Light' },
    { key: 'atomize', name: 'Atomize(Atom One Dark)' },
    { key: 'csb-default', name: 'CSB Default' },
    { key: 'github-light', name: 'GitHub Light', theme: githubLight },
    {
      key: 'webstorm-darcula',
      name: 'Webstorm Darcula',
      url: new URL('webstorm-darcula.json', assetsOf('themes')),
    },
    { key: 'webstorm-dark', name: 'Webstorm Dark' },
  ],
  // baseUrl: assetsOf('themes'),
});

const App = () => {
  const ref = useRef<MonacoCodeEditorRef | null>(null);

  const [sampleData, storeSample] = useLocalStorage<SampleStorageData>(
    'monaco-sample-data',
    {},
  );
  const { locale, theme, filename, customOptions } = sampleData;

  const [nextTheme, setNextTheme] = useState<NextTheme>({ loading: false });

  const input = useMemo(
    () =>
      FileSelectOptions.find((it) => it.filename === filename) ??
      FileSelectOptions[0],
    [filename],
  );

  const [options, muiTheme, themeColors] = useMemo(() => {
    const { name, colors, isDark } = revertMonacoThemeSkeleton(theme);
    return [
      { ...editorOptions, ...(customOptions ?? {}), theme: name },
      createTheme(isDark, colors),
      colors,
    ];
  }, [theme, customOptions]);

  const [activeLanguage, setActiveLanguage] = useState<
    TextmateActiveLanguage | undefined
  >();

  const [openThemeConverter, setOpenThemeConverter] = useState(false);
  const [openEditOptions, setOpenEditOptions] = useState(false);

  const update = (frag: Partial<SampleStorageData>) =>
    storeSample((prev) => ({ ...prev, ...frag }));

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ThemeConverter.Dialog
        open={openThemeConverter}
        onClose={() => setOpenThemeConverter(false)}
      />
      <EditOptions
        open={openEditOptions}
        onClose={() => setOpenEditOptions(false)}
        onSubmit={(nextOptions) => {
          update({ customOptions: nextOptions });
        }}
        options={customOptions ?? editorOptions}
      />
      <MonacoProvider
        loader={{ query: { locale } }}
        style={{
          '--rmBackdropBg': themeColors.background,
          '--rmBorderColor': themeColors.borderColor,
          '--rmTextColor': themeColors.text,
        }}
        components={{ ProgressBar }}
        texts={{
          tmStatus: ({ active }) =>
            \`Textmate \${active ? 'active' : 'inactive'}\`,
        }}
      >
        <TextmateInjection
          debug
          onChange={setActiveLanguage}
          provider={tmProvider}
          filter={tmFilter}
        />
        <LocaleInjection debug locale={locale} />
        <ThemesInjection
          debug
          theme={options.theme}
          loadTheme={nextTheme.name}
          onLoad={(res) => {
            if (res.isSuccess) {
              const { name, isDark, colors } = res.theme;
              update({ theme: { name, isDark, colors } });
            }
            setNextTheme((prev) => ({ ...prev, loading: false }));
          }}
        />
        <TypescriptInjection />
        <TopBar>
          <LocaleSelect
            value={locale}
            onChange={(locale) => update({ locale })}
          />
          <FileSelect
            value={input}
            onChange={(it) => update({ filename: it.filename })}
          />
          <ThemeSelect
            value={options.theme}
            themes={themes}
            disabled={nextTheme.loading}
            onChange={(name) => setNextTheme({ name, loading: true })}
          />
          <Box display={'flex'} sx={{ ml: 'auto' }} gap={'4px'}>
            <Button size={'medium'} onClick={() => setOpenThemeConverter(true)}>
              Theme Converter
            </Button>
            <Button
              sx={{ minWidth: 'auto' }}
              onClick={() => setOpenEditOptions(true)}
            >
              <Settings />
            </Button>
          </Box>
        </TopBar>
        <MonacoCodeEditor
          ref={ref}
          input={input}
          className={cssScrollBar}
          options={options}
        />
        <FootBar>
          <LanguageDisplay
            value={activeLanguage?.languageId ?? 'plaintext'}
            tmActive={activeLanguage?.isActive}
          />
        </FootBar>
      </MonacoProvider>
    </ThemeProvider>
  );
};

const ProgressBar = ({
  mode,
  percent,
  indeterminate,
}: MonacoPresetProgressBarProps) => {
  const isIndeterminate = percent == null || indeterminate;
  if (!mode) return null;
  return (
    <LinearProgress
      key={isIndeterminate ? 'indeterminate' : 'determinate'}
      variant={isIndeterminate ? 'indeterminate' : 'determinate'}
      value={percent}
      sx={{ minWidth: 320 }}
    />
  );
};

const tmProvider: TextmateProviderCallback = ({ language, extname }) => {
  if (extname === '.prisma') {
    return {
      url: new URL('prisma.tmLanguage.json', tmConfig('baseUrl')),
      format: 'json',
      languageId: 'prisma',
    };
  }
  if (language?.id === 'kotlin') {
    return {
      url: new URL('kotlin.tmLanguage.json', tmConfig('baseUrl')),
      format: 'json',
      languageId: language.id,
      scopeName: 'source.gradle-kotlin-dsl',
    };
  }
};

const tmFilter: TextmateFilterCodeSetCallback = (code: TextmateCodeSet) => {
  return code;
};

export default App;
`.trim()},tH={filename:"backend.py",source:`
# ref: https://github.com/geekcomputers/Python/blob/master/AutoComplete_App/backend.py
import sqlite3
import json

class AutoComplete:
    """
    It works by building a \`WordMap\` that stores words to word-follower-count
    ----------------------------
    e.g. To train the following statement:

    It is not enough to just know how tools work and what they worth,
    we have got to learn how to use them and to use them well.
    And with all these new weapons in your arsenal, we would better
    get those profits fired up

    we create the following:
    {   It: {is:1}
        is: {not:1}
        not: {enough:1}
        enough: {to:1}
        to: {just:1, learn:1, use:2}
        just: {know:1}
        .
        .
        profits: {fired:1}
        fired: {up:1}
    }
    so the word completion for "to" will be "use".
    For optimization, we use another store \`WordPrediction\` to save the
    predictions for each word
    """

    def __init__(self):
        """
        Returns - None
        Input - None
        ----------
        - Initialize database. we use sqlite3
        - Check if the tables exist, if not create them
        - maintain a class level access to the database
          connection object
        """
        self.conn = sqlite3.connect("autocompleteDB.sqlite3", autocommit=True)
        cur = self.conn.cursor()
        res = cur.execute("SELECT name FROM sqlite_master WHERE name='WordMap'")
        tables_exist = res.fetchone()

        if not tables_exist:
            self.conn.execute("CREATE TABLE WordMap(name TEXT, value TEXT)")
            self.conn.execute('CREATE TABLE WordPrediction (name TEXT, value TEXT)')
            cur.execute("INSERT INTO WordMap VALUES (?, ?)", ("wordsmap", "{}",))
            cur.execute("INSERT INTO WordPrediction VALUES (?, ?)", ("predictions", "{}",))

    def train(self, sentence):
        """
        Returns - string
        Input - str: a string of words called sentence
        ----------
        Trains the sentence. It does this by creating a map of
        current words to next words and their counts for each
        time the next word appears after the current word
        - takes in the sentence and splits it into a list of words
        - retrieves the word map and predictions map
        - creates the word map and predictions map together
        - saves word map and predictions map to the database
        """
        cur = self.conn.cursor()
        words_list = sentence.split(" ")

        words_map = cur.execute("SELECT value FROM WordMap WHERE name='wordsmap'").fetchone()[0]
        words_map = json.loads(words_map)

        predictions = cur.execute("SELECT value FROM WordPrediction WHERE name='predictions'").fetchone()[0]
        predictions = json.loads(predictions)

        for idx in range(len(words_list)-1):
            curr_word, next_word = words_list[idx], words_list[idx+1]
            if curr_word not in words_map:
                words_map[curr_word] = {}
            if next_word not in words_map[curr_word]:
                words_map[curr_word][next_word] = 1
            else:
                words_map[curr_word][next_word] += 1

            # checking the completion word against the next word
            if curr_word not in predictions:
                predictions[curr_word] = {
                    'completion_word': next_word,
                    'completion_count': 1
                }
            else:
                if words_map[curr_word][next_word] > predictions[curr_word]['completion_count']:
                    predictions[curr_word]['completion_word'] = next_word
                    predictions[curr_word]['completion_count'] = words_map[curr_word][next_word]

        words_map = json.dumps(words_map)
        predictions = json.dumps(predictions)

        cur.execute("UPDATE WordMap SET value = (?) WHERE name='wordsmap'", (words_map,))
        cur.execute("UPDATE WordPrediction SET value = (?) WHERE name='predictions'", (predictions,))
        return("training complete")

    def predict(self, word):
        """
        Returns - string
        Input - string
        ----------
        Returns the completion word of the input word
        - takes in a word
        - retrieves the predictions map
        - returns the completion word of the input word
        """
        cur = self.conn.cursor()
        predictions = cur.execute("SELECT value FROM WordPrediction WHERE name='predictions'").fetchone()[0]
        predictions = json.loads(predictions)
        completion_word = predictions[word.lower()]['completion_word']
        return completion_word



if __name__ == "__main__":
    input_ = "It is not enough to just know how tools work and what they worth,\\
              we have got to learn how to use them and to use them well. And with\\
              all these new weapons in your arsenal, we would better get those profits fired up"
    ac = AutoComplete()
    ac.train(input_)
    print(ac.predict("to"))
`.trim()},tU={filename:"badge.scss",source:`
$badge-background: #111;
$badge-color: #fff;
$badge-min-size: 11px;
$badge-max-size: 25px;

body {
	font-family: 'Allerta Stencil', sans-serif;
	padding: 0;
	margin: 70px 10px;
	background: #efefef;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: calc(99vh - 140px);
}

.badge {
  position: relative;
	letter-spacing: 0.08em;
  color: $badge-color;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  transition: transform 0.3s ease;
  transform: rotate(-14deg);
  text-align: center;
  filter: drop-shadow(0.25em 0.7em 0.95em rgba(0,0,0, 0.8));
	/* min-size + (max-size - min-size) * ( (100vw - min-width) / ( max-width - min-width) ) */
	font-size: calc(#{$badge-min-size} + #{($badge-max-size - $badge-min-size) / 1px} * ( (100vw - 420px) / ( 860) ));
	
	@media screen and (max-width: 420px) {
			font-size: $badge-min-size;
	}
	
	@media screen and (min-width: 1280px) {
			font-size: $badge-max-size;
	}
	
	
	&::before {
    content: "";
    position: absolute;
		top: 50%;
    left: 50%;
		transform: translate(-50%, -50%);
    display: block;
    width: 10em;
		height: 10em;
    border-radius: 100%;
    background: $badge-background;
    opacity: 0.8;
    transition: opacity 0.3s linear;
  }

  &:hover {
    color: $badge-color;
    text-decoration: none;
    transform: rotate(-10deg) scale(1.05);

    &::before {
      opacity: 0.9;
    }
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    z-index: 0;
    width: 10em;
    height: 10em;
  }

  span {
    display: block;
    background: $badge-background;
    border-radius: 0.4em;
    padding: 0.4em 1em;
    z-index: 1;
    min-width: 11em;
    border: 1px solid;
    text-transform: uppercase;
  }
}
`.trim()},tW={filename:"Decidable.scala",source:`
// ref: https://github.com/scalaz/scalaz/blob/master/core/src/main/scala/scalaz/Decidable.scala
package scalaz

////
// Copyright: 2017 Sam Halliday
// License: https://opensource.org/licenses/BSD-3-Clause

/**
 * Coproduct analogue of Divide
 *
 * https://hackage.haskell.org/package/contravariant-1.4.1/docs/Data-Functor-Contravariant-Divisible.html#t:Decidable
 */
////
trait Decidable[F[_]] extends Divisible[F] with InvariantAlt[F] { self =>
  ////

  final def choose[Z, A1, A2](a1: =>F[A1], a2: =>F[A2])(f: Z => A1 \\/ A2): F[Z] = choose2(a1, a2)(f)

  def choose1[Z, A1](a1: =>F[A1])(f: Z => A1): F[Z] = contramap(a1)(f)
  def choose2[Z, A1, A2](a1: =>F[A1], a2: =>F[A2])(f: Z => A1 \\/ A2): F[Z]
  def choose3[Z, A1, A2, A3](a1: =>F[A1], a2: =>F[A2], a3: =>F[A3])(
    f: Z => A1 \\/ (A2 \\/ A3)
  ): F[Z] = {
    val a23: F[A2 \\/ A3] = choose2(a2, a3)(identity)
    choose2(a1, a23)(f)
  }
  def choose4[Z, A1, A2, A3, A4](a1: =>F[A1], a2: =>F[A2], a3: =>F[A3], a4: =>F[A4])(
    f: Z => A1 \\/ (A2 \\/ (A3 \\/ A4))
  ): F[Z] = {
    val a234: F[A2 \\/ (A3 \\/ A4)] = choose3(a2, a3, a4)(identity)
    choose2(a1, a234)(f)
  }
  // ... chooseN

  final def choosing2[Z, A1, A2](
    f: Z => A1 \\/ A2
  )(implicit fa1: F[A1], fa2: F[A2]): F[Z] =
    choose2(fa1, fa2)(f)
  final def choosing3[Z, A1, A2, A3](
    f: Z => A1 \\/ (A2 \\/ A3)
  )(implicit fa1: F[A1], fa2: F[A2], fa3: F[A3]): F[Z] =
    choose3(fa1, fa2, fa3)(f)
  final def choosing4[Z, A1, A2, A3, A4](
    f: Z => A1 \\/ (A2 \\/ (A3 \\/ A4))
  )(implicit fa1: F[A1], fa2: F[A2], fa3: F[A3], fa4: F[A4]): F[Z] =
    choose4(fa1, fa2, fa3, fa4)(f)
  // ... choosingX

  override def xcoproduct1[Z, A1](a1: =>F[A1])(
    f: A1 => Z,
    g: Z => A1
  ): F[Z] = choose1(a1)(g)
  override def xcoproduct2[Z, A1, A2](a1: =>F[A1], a2: =>F[A2])(
    f: (A1 \\/ A2) => Z,
    g: Z => (A1 \\/ A2)
  ): F[Z] = choose2(a1, a2)(g)
  override def xcoproduct3[Z, A1, A2, A3](a1: =>F[A1], a2: =>F[A2], a3: =>F[A3])(
    f: (A1 \\/ (A2 \\/ A3)) => Z,
    g: Z => (A1 \\/ (A2 \\/ A3))
  ): F[Z] = choose3(a1, a2, a3)(g)
  override def xcoproduct4[Z, A1, A2, A3, A4](a1: =>F[A1], a2: =>F[A2], a3: =>F[A3], a4: =>F[A4])(
    f: (A1 \\/ (A2 \\/ (A3 \\/ A4))) => Z,
    g: Z => (A1 \\/ (A2 \\/ (A3 \\/ A4)))
  ): F[Z] = choose4(a1, a2, a3, a4)(g)


  trait DecidableLaw extends DivisibleLaw {
    // distribution law blocked on https://github.com/ekmett/contravariant/issues/53

    // TODO: translate this
    // choose f (choose g m n) o = divide f' m (divide id n o) where
    //   f' bcd = either (either id (Right . Left) . g) (Right . Right) . f
  }
  def decidableLaw: DecidableLaw = new DecidableLaw {}

  ////
  val decidableSyntax: scalaz.syntax.DecidableSyntax[F] =
    new scalaz.syntax.DecidableSyntax[F] { def F = Decidable.this }
}

object Decidable {
  @inline def apply[F[_]](implicit F: Decidable[F]): Decidable[F] = F

  import Isomorphism._

  def fromIso[F[_], G[_]](D: F <~> G)(implicit E: Decidable[G]): Decidable[F] =
    new IsomorphismDecidable[F, G] {
      override def G: Decidable[G] = E
      override def iso: F <~> G = D
    }

  ////

  ////
}

trait IsomorphismDecidable[F[_], G[_]] extends Decidable[F] with IsomorphismDivisible[F, G] with IsomorphismInvariantAlt[F, G]{
  implicit def G: Decidable[G]
  ////

  def choose2[Z, A1, A2](a1: => F[A1], a2: => F[A2])(f: Z => A1 \\/ A2): F[Z] =
    iso.from(G.choose2(iso.to(a1), iso.to(a2))(f))

  override def xcoproduct1[Z, A1](a1: => F[A1])(f: A1 => Z, g: Z => A1): F[Z] =
    super[Decidable].xcoproduct1(a1)(f, g)
  override def xcoproduct2[Z, A1, A2](a1: => F[A1], a2: => F[A2])(f: A1 \\/ A2 => Z, g: Z => A1 \\/ A2): F[Z] =
    super[Decidable].xcoproduct2(a1, a2)(f, g)
  override def xcoproduct3[Z, A1, A2, A3](a1: => F[A1], a2: => F[A2], a3: => F[A3])(f: A1 \\/ (A2 \\/ A3) => Z, g: Z => A1 \\/ (A2 \\/ A3)): F[Z] =
    super[Decidable].xcoproduct3(a1, a2, a3)(f, g)
  override def xcoproduct4[Z, A1, A2, A3, A4](a1: => F[A1], a2: => F[A2], a3: => F[A3], a4: => F[A4])(f: A1 \\/ (A2 \\/ (A3 \\/ A4)) => Z, g: Z => A1 \\/ (A2 \\/ (A3 \\/ A4))): F[Z] =
    super[Decidable].xcoproduct4(a1, a2, a3, a4)(f, g)

  ////
}
`.trim()},tz={filename:"FreqTableExampleOriginal.java",source:`
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;


public class FreqTableExampleOriginal {

    public static final int NUM_ASCII_CHAR = 128;

    // program to create a frequency table.
    // Example of simple try catch blocks to deal with checked exceptions
    public static void main(String[] args)
        {

        int[] freqs = createFreqTableURL("http://www.utexas.edu/");

        if( freqs.length == 0)
            System.out.println("No frequency table created due to problems when reading from file");
        else{
            for(int i = 0; i < NUM_ASCII_CHAR; i++){
                System.out.println("charcater code: " + i + " ,character: " + (char)i + " ,frequency: " + freqs[i]);
            }
            System.out.println("Total characters in file: " + sum(freqs));
        }


        freqs = new int[]{};
        try{
            freqs = createTable("ciaFactBook2008.txt");
        }
        catch(FileNotFoundException e){
            System.out.println("File not found. Unable to create freq table" + e);
        }
        catch(IOException e){
            System.out.println("Problem while reading from file. Unable to create freq table" + e);
        }
        if( freqs.length == 0)
            System.out.println("No frequency table created due to problems when reading from file");
        else{
            for(int i = 0; i < freqs.length; i++){
                System.out.println("charcater code: " + i + " ,character: " + (char)i + " ,frequency: " + freqs[i]);
            }
            System.out.println("Total characters in file: " + sum(freqs));
        }

    }


    // return sum of ints in list
    // list may not be null
    private static int sum(int[] list) {
        assert list != null : "Failed precondition, sum: parameter list" +
            " may not be null.";
        int total = 0;
        for(int x : list){
            total += x;
        }
        return total;
    }


    // pre: url != null
    // Connect to the URL specified by the String url.
    // Map characters to index in array.
    // All non ASCII character dumped into one element of array
    // If IOException occurs message printed and array of
    // length 0 returned.
    public static int[] createFreqTableURL (String url){
        if(url == null)
            throw new IllegalArgumentException("Violation of precondition. parameter url must not be null.");

        int[] freqs = new int[NUM_ASCII_CHAR];
        try {
        URL inputURL = new URL(url);
        InputStreamReader in
            = new InputStreamReader(inputURL.openStream());

        while(in.ready()){
            int c = in.read();
            if(0 <= c && c < freqs.length)
                freqs[c]++;
            else
                System.out.println("Non ASCII char: " + c + " " + (char) c);
        }
        in.close();
        }
        catch(MalformedURLException e){
            System.out.println("Bad URL.");
            freqs = new int[0];
        }
        catch(IOException e){
            System.out.println("Unable to read from resource." + e);
            freqs = new int[0];
        }
        return freqs;
    }



    // Connect to the file specified by the String fileName.
    // Assumes it is in same directory as compiled code.
    // Map characters to index in array.
    public static int[] createTable(String fileName) throws FileNotFoundException, IOException{
        int[] freqs = new int[NUM_ASCII_CHAR];
        File f = new File(fileName);
        FileReader r = new FileReader(f);
        while( r.ready() ){
            int ch = r.read();
//            if( 0 <= ch && ch <= NUM_ASCII_CHAR)
//                freqs[ch]++;
//            else
//                freqs[INDEX_NON_ASCII]++;
            if(0 <= ch && ch < freqs.length)
                freqs[ch]++;
            else
                System.out.println((char) ch);
                
        }
        r.close();
        return freqs;
    }
}
`.trim()},tZ={filename:"ImageClientFragment.kt",source:`
/*
 * ref: https://github.com/android/storage-samples/blob/main/ContentProviderPagingKotlin/app/src/main/kotlin/com.example.android.contentproviderpaging/ImageClientFragment.kt
 * 
 * Copyright (C) 2017 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.android.contentproviderpaging

import android.app.LoaderManager
import android.content.ContentResolver
import android.content.CursorLoader
import android.content.Loader
import android.database.Cursor
import android.os.Bundle
import android.support.v4.app.Fragment
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Toast
import java.util.concurrent.atomic.AtomicInteger

/**
 * Fragment that works as a client for accessing the DocumentsProvider
 * ([ImageProvider].
 */
class ImageClientFragment : Fragment() {

    private var mAdapter: ImageAdapter? = null

    private var mLayoutManager: LinearLayoutManager? = null

    private val mLoaderCallback = LoaderCallback()

    /**
     * The offset position for the ContentProvider to be used as a starting position to fetch
     * the images from.
     */
    private val mOffset = AtomicInteger(0)

    override fun onCreateView(inflater: LayoutInflater?, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater?.inflate(R.layout.fragment_image_client, container, false)
    }

    override fun onViewCreated(rootView: View?, savedInstanceState: Bundle?) {
        super.onViewCreated(rootView, savedInstanceState)

        val activity = activity
        val recyclerView = activity.findViewById<RecyclerView>(R.id.recyclerview)
        if (mLayoutManager == null) {
            mLayoutManager = LinearLayoutManager(activity)
        }
        recyclerView.layoutManager = mLayoutManager
        if (mAdapter == null) {
            mAdapter = ImageAdapter(activity)
        }
        recyclerView.adapter = mAdapter
        recyclerView.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrolled(recyclerView: RecyclerView?, dx: Int, dy: Int) {
                val lastVisiblePosition = mLayoutManager!!.findLastVisibleItemPosition()
                if (lastVisiblePosition >= mAdapter!!.fetchedItemCount) {
                    Log.d(TAG,
                            "Fetch new images. LastVisiblePosition: " + lastVisiblePosition
                                    + ", NonEmptyItemCount: " + mAdapter!!.fetchedItemCount)

                    val pageId = lastVisiblePosition / LIMIT
                    // Fetch new images once the last fetched item becomes visible
                    activity.loaderManager
                            .restartLoader(pageId, null, mLoaderCallback)
                }
            }
        })

        val showButton = rootView!!.findViewById<Button>(R.id.button_show)
        showButton.setOnClickListener {
            activity.loaderManager.restartLoader(0, null, mLoaderCallback)
            showButton.visibility = View.GONE
        }
    }

    private inner class LoaderCallback : LoaderManager.LoaderCallbacks<Cursor> {

        override fun onCreateLoader(id: Int, args: Bundle?): Loader<Cursor> {
            val activity = this@ImageClientFragment.activity
            return object : CursorLoader(activity) {
                override fun loadInBackground(): Cursor {
                    val bundle = Bundle()
                    bundle.putInt(ContentResolver.QUERY_ARG_OFFSET, mOffset.toInt())
                    bundle.putInt(ContentResolver.QUERY_ARG_LIMIT, LIMIT)
                    return activity.contentResolver
                            .query(ImageContract.CONTENT_URI, null, bundle, null)
                }
            }
        }

        override fun onLoadFinished(loader: Loader<Cursor>, cursor: Cursor) {
            val extras = cursor.extras
            val totalSize = extras.getInt(ContentResolver.EXTRA_TOTAL_COUNT)
            mAdapter!!.setTotalSize(totalSize)
            val beforeCount = mAdapter!!.fetchedItemCount
            while (cursor.moveToNext()) {
                val displayName = cursor.getString(cursor.getColumnIndex(
                        ImageContract.Columns.DISPLAY_NAME))
                val absolutePath = cursor.getString(cursor.getColumnIndex(
                        ImageContract.Columns.ABSOLUTE_PATH))

                val imageDocument = ImageAdapter.ImageDocument(absolutePath, displayName)
                mAdapter!!.add(imageDocument)
            }
            val cursorCount = cursor.count
            if (cursorCount == 0) {
                return
            }
            val activity = this@ImageClientFragment.activity
            mAdapter!!.notifyItemRangeChanged(beforeCount, cursorCount)
            val offsetSnapShot = mOffset.get()
            val message = activity.resources
                    .getString(R.string.fetched_images_out_of, offsetSnapShot + 1,
                            offsetSnapShot + cursorCount, totalSize)
            mOffset.addAndGet(cursorCount)
            Toast.makeText(activity, message, Toast.LENGTH_LONG).show()
        }

        override fun onLoaderReset(loader: Loader<Cursor>) {

        }
    }

    companion object {

        private val TAG = "ImageClientFragment"

        /** The number of fetched images in a single query to the DocumentsProvider.  */
        private val LIMIT = 10

        fun newInstance(): ImageClientFragment {

            val args = Bundle()

            val fragment = ImageClientFragment()
            fragment.arguments = args
            return fragment
        }
    }
}
`.trim()},tK={filename:"indent_handler.go",source:`
//go:build go1.21
// ref: https://github.com/golang/example/blob/master/slog-handler-guide/indenthandler4/indent_handler.go

package indenthandler

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"runtime"
	"slices"
	"strconv"
	"sync"
	"time"
)

// !+IndentHandler
type IndentHandler struct {
	opts           Options
	preformatted   []byte   // data from WithGroup and WithAttrs
	unopenedGroups []string // groups from WithGroup that haven't been opened
	indentLevel    int      // same as number of opened groups so far
	mu             *sync.Mutex
	out            io.Writer
}

//!-IndentHandler

type Options struct {
	// Level reports the minimum level to log.
	// Levels with lower levels are discarded.
	// If nil, the Handler uses [slog.LevelInfo].
	Level slog.Leveler
}

func New(out io.Writer, opts *Options) *IndentHandler {
	h := &IndentHandler{out: out, mu: &sync.Mutex{}}
	if opts != nil {
		h.opts = *opts
	}
	if h.opts.Level == nil {
		h.opts.Level = slog.LevelInfo
	}
	return h
}

func (h *IndentHandler) Enabled(ctx context.Context, level slog.Level) bool {
	return level >= h.opts.Level.Level()
}

// !+WithGroup
func (h *IndentHandler) WithGroup(name string) slog.Handler {
	if name == "" {
		return h
	}
	h2 := *h
	// Add an unopened group to h2 without modifying h.
	h2.unopenedGroups = make([]string, len(h.unopenedGroups)+1)
	copy(h2.unopenedGroups, h.unopenedGroups)
	h2.unopenedGroups[len(h2.unopenedGroups)-1] = name
	return &h2
}

//!-WithGroup

// !+WithAttrs
func (h *IndentHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	if len(attrs) == 0 {
		return h
	}
	h2 := *h
	// Force an append to copy the underlying array.
	pre := slices.Clip(h.preformatted)
	// Add all groups from WithGroup that haven't already been added.
	h2.preformatted = h2.appendUnopenedGroups(pre, h2.indentLevel)
	// Each of those groups increased the indent level by 1.
	h2.indentLevel += len(h2.unopenedGroups)
	// Now all groups have been opened.
	h2.unopenedGroups = nil
	// Pre-format the attributes.
	for _, a := range attrs {
		h2.preformatted = h2.appendAttr(h2.preformatted, a, h2.indentLevel)
	}
	return &h2
}

func (h *IndentHandler) appendUnopenedGroups(buf []byte, indentLevel int) []byte {
	for _, g := range h.unopenedGroups {
		buf = fmt.Appendf(buf, "%*s%s:\\n", indentLevel*4, "", g)
		indentLevel++
	}
	return buf
}

//!-WithAttrs

// !+Handle
func (h *IndentHandler) Handle(ctx context.Context, r slog.Record) error {
	bufp := allocBuf()
	buf := *bufp
	defer func() {
		*bufp = buf
		freeBuf(bufp)
	}()
	if !r.Time.IsZero() {
		buf = h.appendAttr(buf, slog.Time(slog.TimeKey, r.Time), 0)
	}
	buf = h.appendAttr(buf, slog.Any(slog.LevelKey, r.Level), 0)
	if r.PC != 0 {
		fs := runtime.CallersFrames([]uintptr{r.PC})
		f, _ := fs.Next()
		// Optimize to minimize allocation.
		srcbufp := allocBuf()
		defer freeBuf(srcbufp)
		*srcbufp = append(*srcbufp, f.File...)
		*srcbufp = append(*srcbufp, ':')
		*srcbufp = strconv.AppendInt(*srcbufp, int64(f.Line), 10)
		buf = h.appendAttr(buf, slog.String(slog.SourceKey, string(*srcbufp)), 0)
	}

	buf = h.appendAttr(buf, slog.String(slog.MessageKey, r.Message), 0)
	// Insert preformatted attributes just after built-in ones.
	buf = append(buf, h.preformatted...)
	if r.NumAttrs() > 0 {
		buf = h.appendUnopenedGroups(buf, h.indentLevel)
		r.Attrs(func(a slog.Attr) bool {
			buf = h.appendAttr(buf, a, h.indentLevel+len(h.unopenedGroups))
			return true
		})
	}
	buf = append(buf, "---\\n"...)
	h.mu.Lock()
	defer h.mu.Unlock()
	_, err := h.out.Write(buf)
	return err
}

//!-Handle

func (h *IndentHandler) appendAttr(buf []byte, a slog.Attr, indentLevel int) []byte {
	// Resolve the Attr's value before doing anything else.
	a.Value = a.Value.Resolve()
	// Ignore empty Attrs.
	if a.Equal(slog.Attr{}) {
		return buf
	}
	// Indent 4 spaces per level.
	buf = fmt.Appendf(buf, "%*s", indentLevel*4, "")
	switch a.Value.Kind() {
	case slog.KindString:
		// Quote string values, to make them easy to parse.
		buf = append(buf, a.Key...)
		buf = append(buf, ": "...)
		buf = strconv.AppendQuote(buf, a.Value.String())
		buf = append(buf, '\\n')
	case slog.KindTime:
		// Write times in a standard way, without the monotonic time.
		buf = append(buf, a.Key...)
		buf = append(buf, ": "...)
		buf = a.Value.Time().AppendFormat(buf, time.RFC3339Nano)
		buf = append(buf, '\\n')
	case slog.KindGroup:
		attrs := a.Value.Group()
		// Ignore empty groups.
		if len(attrs) == 0 {
			return buf
		}
		// If the key is non-empty, write it out and indent the rest of the attrs.
		// Otherwise, inline the attrs.
		if a.Key != "" {
			buf = fmt.Appendf(buf, "%s:\\n", a.Key)
			indentLevel++
		}
		for _, ga := range attrs {
			buf = h.appendAttr(buf, ga, indentLevel)
		}

	default:
		buf = append(buf, a.Key...)
		buf = append(buf, ": "...)
		buf = append(buf, a.Value.String()...)
		buf = append(buf, '\\n')
	}
	return buf
}

// !+pool
var bufPool = sync.Pool{
	New: func() any {
		b := make([]byte, 0, 1024)
		return &b
	},
}

func allocBuf() *[]byte {
	return bufPool.Get().(*[]byte)
}

func freeBuf(b *[]byte) {
	// To reduce peak allocation, return only smaller buffers to the pool.
	const maxBufferSize = 16 << 10
	if cap(*b) <= maxBufferSize {
		*b = (*b)[:0]
		bufPool.Put(b)
	}
}

//!-pool
`.trim()},tV={filename:"playgroud.ts",source:`
// ref: https://www.typescriptlang.org/play/?&q=68#code/PTAEBUE8AcFNQK4DsCWB7JBnUBDATvDqAO46ShoBmoAJrAMYA2+KSA5qAC4AWOnuSCgCMAVg04AoEKHpoEjGqCHwAtmgJdegjPE4xYAOgkS9cUAGVOeVmwDyeAHIIVyvKAC8oTFZugAPqBIzq4A3Cb6oAAKeGj0sJiYlnzxHqAARGhwSGn+6UxomLA0aWGm8LY0NE4usHiYAKpIdHjgsIKeAIy5AMy5AKy5AOy5AJylEQCCALLxmJCN6O3p3LCMjGg5AR19AGy5AN6gtTF4AFxceAjwAL5hUmAAktQ88AiFFNQZWTk4TXnrhWKoAAbthvNZ2KAUJh7oFYMQuGhQJA5AAaGQregAawoCE451gAA8cCpoIxYKdGChOLUcIwYbCAOrwei-UAqFCE2goSiUWptfhlbCsThIojIRbo340WHEXj8YiwADkGkwZF80M0fE08GBdKuUOwOg+mgKun0mCMsKgcHM9Gs0AVKDWOsE5JwwPgKIQiNAlBQbAQGjk-G4aARothdBpeA5SHgcpQ9G4IP18GpMjkCiUhH4lyQnBQKkMxmkCww2FZgkwaGLheL2GUiCatTjRSU5DKJBQdFQ7FRsMo6iOxNJ5NOxi7jNYNHDSRp2E8Xzam3+ZqBATScaLKAAXkVV+CbHdpE9kXJQGHPW4cEI0J70d6ZGzCrp5aBp0055xkjDpMpZAbXAvB8SEAFpAjQQUVmbRYDAgbhNU1WRr3bVhYSJEkyQpMowOIHs2hsMDpTApB8BifD2FLR5qHFVAMENARQFsAAldEXkENkRVqQp6ELBjNTZCYHAAESMU8Cx48RFi4C1cA0OU2i4YgkSFKFJLqcRfXtWBklhIh4wjfR4PARDsDpdZiGwIc3C7QDoAKak4OMbi8EoHA4lAABRPATgACWlKlIX2CRQC8BB6DiBJzjvNB3SQMIwuOdQAH5zkOBs1TYCkQIhDhbgka4XI09zPImPBOBUvAsUwES+CIEKwvwSr1Bq9KuGpcdct8a4AG0AF0wiKiRXNK+BysLbxavq0BGvkybOEwdqyOLc4j0hPrBsK6iEPidMSo8lIqxzTNSXXdTQAITAHKwFJE2TS8PVgWE7x4TMsGhGkCyOXzhy0GggrYKU-heFA3HDQQaHqq0uwmqqapY+IbveTw4da6af1AAAybzfrwAKmkB8YzAmz7MER66K3gVGKrJurMZxnz-MC48doAMWHTCxwpYxZCwUNAtgUmpop5HqdAAAKK6xfOYXFtFqmAEoPAAPlm0KoWoKWkapgxkrwZW5rCvma3JPW8e1ynbvNk4DEynBssVxKwsu2BOCDBKNeG42Kziwx1jYS2xYMZqyadwqTzACZ2U5E0Hg03j+M4v5y0ENSANrFICAsyBYTeWBKHkEgVkEJ9eE9Z9CmwRSNDZNBRC03hsEjaRWCYBA6AoeMTRa1NGCuJbipjMbQAAYWzmk5YAIXQKecHeObQ+8B4RLW0C2GdngwZoSJmsgNKlDQP3fiGycInH3TJ9p7wZ7QRGAEcB-4TwL+SafZ-n+AcYlw5uE4FRGBrzyqAa4Bx2T4CxLOYgSAgE9XDrCBw4Zzw+mOhgRg5AdLJGAgQR+8QFQl2QepdudB9LX04CvAQihYDUhWG4P+ACKBuBUBAqBSBeYVgVK1GwD8n7nFflfBat8eF4NSIvMhK9zhpCEL8GqkA0gDjCsw6qrDJFzyQLIxibJfgYEgGoN43l2DMCaGBaRgJQBsDwDgXkTl5qfQMPY+REd2H8yUDgGgwjvB8InkLMhQjYC4O8KIjWS9yGr3SNI9RcxHEFSAA
// Type unions are a way of declaring that an object
// could be more than one type.

type StringOrNumber = string | number;
type ProcessStates = "open" | "closed";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
type AMessyUnion = "hello" | 156 | { error: true };

// If the use of "open" and "closed" vs string is
// new to you, check out: example:literals

// We can mix different types into a union, and
// what we're saying is that the value is one of those types.

// TypeScript will then leave you to figure out how to
// determine which value it could be at runtime.

// Unions can sometimes be undermined by type widening,
// for example:

type WindowStates = "open" | "closed" | "minimized" | string;

// If you hover above, you can see that WindowStates
// becomes a string - not the union. This is covered in
// example:type-widening-and-narrowing

// If a union is an OR, then an intersection is an AND.
// Intersection types are when two types intersect to create
// a new type. This allows for type composition.

interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// These interfaces can be composed in responses which have
// both consistent error handling, and their own data.

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

// For example:

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};

// A mix of Intersection and Union types becomes really
// useful when you have cases where an object has to
// include one of two values:

interface CreateArtistBioBase {
  artistID: string;
  thirdParty?: boolean;
}

type CreateArtistBioRequest = CreateArtistBioBase & ({ html: string } | { markdown: string });

// Now you can only create a request when you include
// artistID and either html or markdown

const workingRequest: CreateArtistBioRequest = {
  artistID: "banksy",
  markdown: "Banksy is an anonymous England-based graffiti artist...",
};

const badRequest: CreateArtistBioRequest = {
  artistID: "banksy",
};

`.trim()},tQ={filename:"schema.prisma",source:`
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
`.trim()},tJ={filename:"Test.dbml",source:`
// Use DBML to define your database structure

Table follows {
  following_user_id integer
  followed_user_id integer
  created_at timestamp 
}

Table users {
  id integer [primary key]
  username varchar
  role varchar
  created_at timestamp
}

Table posts {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer
  status varchar
  created_at timestamp
}

Ref: posts.user_id > users.id // many-to-one

Ref: users.id < follows.following_user_id

Ref: users.id < follows.followed_user_id

`.trim()},tY=[tq,tV,tU,{filename:"trait.rs",source:`
// ref: https://rustwiki.org/zh-CN/rust-by-example/trait.html
struct Sheep { naked: bool, name: &'static str }

trait Animal {
    // 静态方法签名；\`Self\` 表示实现者类型（implementor type）。
    fn new(name: &'static str) -> Self;

    // 实例方法签名；这些方法将返回一个字符串。
    fn name(&self) -> &'static str;
    fn noise(&self) -> &'static str;

    // trait 可以提供默认的方法定义。
    fn talk(&self) {
        println!("{} says {}", self.name(), self.noise());
    }
}

impl Sheep {
    fn is_naked(&self) -> bool {
        self.naked
    }

    fn shear(&mut self) {
        if self.is_naked() {
            // 实现者可以使用它的 trait 方法。
            println!("{} is already naked...", self.name());
        } else {
            println!("{} gets a haircut!", self.name);

            self.naked = true;
        }
    }
}

// 对 \`Sheep\` 实现 \`Animal\` trait。
impl Animal for Sheep {
    // \`Self\` 是实现者类型：\`Sheep\`。
    fn new(name: &'static str) -> Sheep {
        Sheep { name: name, naked: false }
    }

    fn name(&self) -> &'static str {
        self.name
    }

    fn noise(&self) -> &'static str {
        if self.is_naked() {
            "baaaaah?"
        } else {
            "baaaaah!"
        }
    }
    
    // 默认 trait 方法可以重载。
    fn talk(&self) {
        // 例如我们可以增加一些安静的沉思。
        println!("{} pauses briefly... {}", self.name, self.noise());
    }
}

fn main() {
    // 这种情况需要类型标注。
    let mut dolly: Sheep = Animal::new("Dolly");
    // 试一试 ^ 移除类型标注。

    dolly.talk();
    dolly.shear();
    dolly.talk();
}
`.trim()},tH,tK,tz,tZ,tW,tJ,tQ,{filename:"vs.json",source:`
{
  "name": "vs",
  "displayName": "Light (Visual Studio)",
  "isDark": false,
  "colors": {
    "primary": "#005FB8",
    "secondary": "#ADD6FF80",
    "success": "#369432",
    "error": "#C72E0F",
    "background": "#FFFFFF",
    "text": "#3B3B3B",
    "borderColor": "#CECECE"
  },
  "data": {
    "inherit": false,
    "base": "vs",
    "colors": {
      "checkbox.border": "#CECECE",
      "editor.background": "#FFFFFF",
      "editor.foreground": "#3B3B3B",
      "editor.inactiveSelectionBackground": "#E5EBF1",
      "editorIndentGuide.background1": "#D3D3D3",
      "editorIndentGuide.activeBackground1": "#939393",
      "editor.selectionHighlightBackground": "#ADD6FF80",
      "editorSuggestWidget.background": "#F8F8F8",
      "activityBarBadge.background": "#005FB8",
      "sideBarTitle.foreground": "#3B3B3B",
      "list.hoverBackground": "#F2F2F2",
      "menu.border": "#CECECE",
      "input.placeholderForeground": "#767676",
      "searchEditor.textInputBorder": "#CECECE",
      "settings.textInputBorder": "#CECECE",
      "settings.numberInputBorder": "#CECECE",
      "statusBarItem.remoteForeground": "#FFFFFF",
      "statusBarItem.remoteBackground": "#005FB8",
      "ports.iconRunningProcessForeground": "#369432",
      "sideBarSectionHeader.background": "#F8F8F8",
      "sideBarSectionHeader.border": "#E5E5E5",
      "tab.selectedForeground": "#333333b3",
      "tab.selectedBackground": "#ffffffa5",
      "tab.lastPinnedBorder": "#D4D4D4",
      "notebook.cellBorderColor": "#E5E5E5",
      "notebook.selectedCellBackground": "#C8DDF150",
      "statusBarItem.errorBackground": "#C72E0F",
      "list.activeSelectionIconForeground": "#000000",
      "list.focusAndSelectionOutline": "#005FB8",
      "terminal.inactiveSelectionBackground": "#E5EBF1",
      "widget.border": "#E5E5E5",
      "actionBar.toggledBackground": "#dddddd",
      "diffEditor.unchangedRegionBackground": "#f8f8f8",
      "activityBar.activeBorder": "#005FB8",
      "activityBar.background": "#F8F8F8",
      "activityBar.border": "#E5E5E5",
      "activityBar.foreground": "#1F1F1F",
      "activityBar.inactiveForeground": "#616161",
      "activityBarBadge.foreground": "#FFFFFF",
      "badge.background": "#CCCCCC",
      "badge.foreground": "#3B3B3B",
      "button.background": "#005FB8",
      "button.border": "#0000001a",
      "button.foreground": "#FFFFFF",
      "button.hoverBackground": "#0258A8",
      "button.secondaryBackground": "#E5E5E5",
      "button.secondaryForeground": "#3B3B3B",
      "button.secondaryHoverBackground": "#CCCCCC",
      "chat.slashCommandBackground": "#D2ECFF",
      "chat.slashCommandForeground": "#306CA2",
      "chat.editedFileForeground": "#895503",
      "checkbox.background": "#F8F8F8",
      "descriptionForeground": "#3B3B3B",
      "dropdown.background": "#FFFFFF",
      "dropdown.border": "#CECECE",
      "dropdown.foreground": "#3B3B3B",
      "dropdown.listBackground": "#FFFFFF",
      "editorGroup.border": "#E5E5E5",
      "editorGroupHeader.tabsBackground": "#F8F8F8",
      "editorGroupHeader.tabsBorder": "#E5E5E5",
      "editorGutter.addedBackground": "#2EA043",
      "editorGutter.deletedBackground": "#F85149",
      "editorGutter.modifiedBackground": "#005FB8",
      "editorLineNumber.activeForeground": "#171184",
      "editorLineNumber.foreground": "#6E7681",
      "editorOverviewRuler.border": "#E5E5E5",
      "editorWidget.background": "#F8F8F8",
      "errorForeground": "#F85149",
      "focusBorder": "#005FB8",
      "foreground": "#3B3B3B",
      "icon.foreground": "#3B3B3B",
      "input.background": "#FFFFFF",
      "input.border": "#CECECE",
      "input.foreground": "#3B3B3B",
      "inputOption.activeBackground": "#BED6ED",
      "inputOption.activeBorder": "#005FB8",
      "inputOption.activeForeground": "#000000",
      "keybindingLabel.foreground": "#3B3B3B",
      "list.activeSelectionBackground": "#E8E8E8",
      "list.activeSelectionForeground": "#000000",
      "menu.selectionBackground": "#005FB8",
      "menu.selectionForeground": "#ffffff",
      "notificationCenterHeader.background": "#FFFFFF",
      "notificationCenterHeader.foreground": "#3B3B3B",
      "notifications.background": "#FFFFFF",
      "notifications.border": "#E5E5E5",
      "notifications.foreground": "#3B3B3B",
      "panel.background": "#F8F8F8",
      "panel.border": "#E5E5E5",
      "panelInput.border": "#E5E5E5",
      "panelTitle.activeBorder": "#005FB8",
      "panelTitle.activeForeground": "#3B3B3B",
      "panelTitle.inactiveForeground": "#3B3B3B",
      "peekViewEditor.matchHighlightBackground": "#BB800966",
      "peekViewResult.background": "#FFFFFF",
      "peekViewResult.matchHighlightBackground": "#BB800966",
      "pickerGroup.border": "#E5E5E5",
      "pickerGroup.foreground": "#8B949E",
      "progressBar.background": "#005FB8",
      "quickInput.background": "#F8F8F8",
      "quickInput.foreground": "#3B3B3B",
      "settings.dropdownBackground": "#FFFFFF",
      "settings.dropdownBorder": "#CECECE",
      "settings.headerForeground": "#1F1F1F",
      "settings.modifiedItemIndicator": "#BB800966",
      "sideBar.background": "#F8F8F8",
      "sideBar.border": "#E5E5E5",
      "sideBar.foreground": "#3B3B3B",
      "sideBarSectionHeader.foreground": "#3B3B3B",
      "statusBar.background": "#F8F8F8",
      "statusBar.foreground": "#3B3B3B",
      "statusBar.border": "#E5E5E5",
      "statusBarItem.hoverBackground": "#B8B8B850",
      "statusBarItem.compactHoverBackground": "#CCCCCC",
      "statusBar.debuggingBackground": "#FD716C",
      "statusBar.debuggingForeground": "#000000",
      "statusBar.focusBorder": "#005FB8",
      "statusBar.noFolderBackground": "#F8F8F8",
      "statusBarItem.focusBorder": "#005FB8",
      "statusBarItem.prominentBackground": "#6E768166",
      "tab.activeBackground": "#FFFFFF",
      "tab.activeBorder": "#F8F8F8",
      "tab.activeBorderTop": "#005FB8",
      "tab.activeForeground": "#3B3B3B",
      "tab.selectedBorderTop": "#68a3da",
      "tab.border": "#E5E5E5",
      "tab.hoverBackground": "#FFFFFF",
      "tab.inactiveBackground": "#F8F8F8",
      "tab.inactiveForeground": "#868686",
      "tab.unfocusedActiveBorder": "#F8F8F8",
      "tab.unfocusedActiveBorderTop": "#E5E5E5",
      "tab.unfocusedHoverBackground": "#F8F8F8",
      "terminalCursor.foreground": "#005FB8",
      "terminal.foreground": "#3B3B3B",
      "terminal.tab.activeBorder": "#005FB8",
      "textBlockQuote.background": "#F8F8F8",
      "textBlockQuote.border": "#E5E5E5",
      "textCodeBlock.background": "#F8F8F8",
      "textLink.activeForeground": "#005FB8",
      "textLink.foreground": "#005FB8",
      "textPreformat.foreground": "#3B3B3B",
      "textPreformat.background": "#0000001F",
      "textSeparator.foreground": "#21262D",
      "titleBar.activeBackground": "#F8F8F8",
      "titleBar.activeForeground": "#1E1E1E",
      "titleBar.border": "#E5E5E5",
      "titleBar.inactiveBackground": "#F8F8F8",
      "titleBar.inactiveForeground": "#8B949E",
      "welcomePage.tileBackground": "#F3F3F3"
    },
    "rules": [
      {
        "foreground": "#000000ff",
        "token": "meta.embedded"
      },
      {
        "foreground": "#000000ff",
        "token": "source.groovy.embedded"
      },
      {
        "foreground": "#000000ff",
        "token": "string meta.image.inline.markdown"
      },
      {
        "foreground": "#000000ff",
        "token": "variable.legacy.builtin.python"
      },
      {
        "fontStyle": "italic",
        "token": "emphasis"
      },
      {
        "fontStyle": "bold",
        "token": "strong"
      },
      {
        "foreground": "#000080",
        "token": "meta.diff.header"
      },
      {
        "foreground": "#008000",
        "token": "comment"
      },
      {
        "foreground": "#0000ff",
        "token": "constant.language"
      },
      {
        "foreground": "#098658",
        "token": "constant.numeric"
      },
      {
        "foreground": "#098658",
        "token": "variable.other.enummember"
      },
      {
        "foreground": "#098658",
        "token": "keyword.operator.plus.exponent"
      },
      {
        "foreground": "#098658",
        "token": "keyword.operator.minus.exponent"
      },
      {
        "foreground": "#811f3f",
        "token": "constant.regexp"
      },
      {
        "foreground": "#800000",
        "token": "entity.name.tag"
      },
      {
        "foreground": "#800000",
        "token": "entity.name.selector"
      },
      {
        "foreground": "#e50000",
        "token": "entity.other.attribute-name"
      },
      {
        "foreground": "#800000",
        "token": "entity.other.attribute-name.class.css"
      },
      {
        "foreground": "#800000",
        "token": "source.css entity.other.attribute-name.class"
      },
      {
        "foreground": "#800000",
        "token": "entity.other.attribute-name.id.css"
      },
      {
        "foreground": "#800000",
        "token": "entity.other.attribute-name.parent-selector.css"
      },
      {
        "foreground": "#800000",
        "token": "entity.other.attribute-name.parent.less"
      },
      {
        "foreground": "#800000",
        "token": "source.css entity.other.attribute-name.pseudo-class"
      },
      {
        "foreground": "#800000",
        "token": "entity.other.attribute-name.pseudo-element.css"
      },
      {
        "foreground": "#800000",
        "token": "source.css.less entity.other.attribute-name.id"
      },
      {
        "foreground": "#800000",
        "token": "entity.other.attribute-name.scss"
      },
      {
        "foreground": "#cd3131",
        "token": "invalid"
      },
      {
        "fontStyle": "underline",
        "token": "markup.underline"
      },
      {
        "fontStyle": "bold",
        "foreground": "#000080",
        "token": "markup.bold"
      },
      {
        "fontStyle": "bold",
        "foreground": "#800000",
        "token": "markup.heading"
      },
      {
        "fontStyle": "italic",
        "token": "markup.italic"
      },
      {
        "fontStyle": "strikethrough",
        "token": "markup.strikethrough"
      },
      {
        "foreground": "#098658",
        "token": "markup.inserted"
      },
      {
        "foreground": "#a31515",
        "token": "markup.deleted"
      },
      {
        "foreground": "#0451a5",
        "token": "markup.changed"
      },
      {
        "foreground": "#0451a5",
        "token": "punctuation.definition.quote.begin.markdown"
      },
      {
        "foreground": "#0451a5",
        "token": "punctuation.definition.list.begin.markdown"
      },
      {
        "foreground": "#800000",
        "token": "markup.inline.raw"
      },
      {
        "foreground": "#800000",
        "token": "punctuation.definition.tag"
      },
      {
        "foreground": "#0000ff",
        "token": "meta.preprocessor"
      },
      {
        "foreground": "#0000ff",
        "token": "entity.name.function.preprocessor"
      },
      {
        "foreground": "#a31515",
        "token": "meta.preprocessor.string"
      },
      {
        "foreground": "#098658",
        "token": "meta.preprocessor.numeric"
      },
      {
        "foreground": "#0451a5",
        "token": "meta.structure.dictionary.key.python"
      },
      {
        "foreground": "#0000ff",
        "token": "storage"
      },
      {
        "foreground": "#0000ff",
        "token": "storage.type"
      },
      {
        "foreground": "#0000ff",
        "token": "storage.modifier"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.operator.noexcept"
      },
      {
        "foreground": "#a31515",
        "token": "string"
      },
      {
        "foreground": "#a31515",
        "token": "meta.embedded.assembly"
      },
      {
        "foreground": "#0000ff",
        "token": "string.comment.buffered.block.pug"
      },
      {
        "foreground": "#0000ff",
        "token": "string.quoted.pug"
      },
      {
        "foreground": "#0000ff",
        "token": "string.interpolated.pug"
      },
      {
        "foreground": "#0000ff",
        "token": "string.unquoted.plain.in.yaml"
      },
      {
        "foreground": "#0000ff",
        "token": "string.unquoted.plain.out.yaml"
      },
      {
        "foreground": "#0000ff",
        "token": "string.unquoted.block.yaml"
      },
      {
        "foreground": "#0000ff",
        "token": "string.quoted.single.yaml"
      },
      {
        "foreground": "#0000ff",
        "token": "string.quoted.double.xml"
      },
      {
        "foreground": "#0000ff",
        "token": "string.quoted.single.xml"
      },
      {
        "foreground": "#0000ff",
        "token": "string.unquoted.cdata.xml"
      },
      {
        "foreground": "#0000ff",
        "token": "string.quoted.double.html"
      },
      {
        "foreground": "#0000ff",
        "token": "string.quoted.single.html"
      },
      {
        "foreground": "#0000ff",
        "token": "string.unquoted.html"
      },
      {
        "foreground": "#0000ff",
        "token": "string.quoted.single.handlebars"
      },
      {
        "foreground": "#0000ff",
        "token": "string.quoted.double.handlebars"
      },
      {
        "foreground": "#811f3f",
        "token": "string.regexp"
      },
      {
        "foreground": "#0000ff",
        "token": "punctuation.definition.template-expression.begin"
      },
      {
        "foreground": "#0000ff",
        "token": "punctuation.definition.template-expression.end"
      },
      {
        "foreground": "#0000ff",
        "token": "punctuation.section.embedded"
      },
      {
        "foreground": "#000000",
        "token": "meta.template.expression"
      },
      {
        "foreground": "#0451a5",
        "token": "support.constant.property-value"
      },
      {
        "foreground": "#0451a5",
        "token": "support.constant.font-name"
      },
      {
        "foreground": "#0451a5",
        "token": "support.constant.media-type"
      },
      {
        "foreground": "#0451a5",
        "token": "support.constant.media"
      },
      {
        "foreground": "#0451a5",
        "token": "constant.other.color.rgb-value"
      },
      {
        "foreground": "#0451a5",
        "token": "constant.other.rgb-value"
      },
      {
        "foreground": "#0451a5",
        "token": "support.constant.color"
      },
      {
        "foreground": "#e50000",
        "token": "support.type.vendored.property-name"
      },
      {
        "foreground": "#e50000",
        "token": "support.type.property-name"
      },
      {
        "foreground": "#e50000",
        "token": "source.css variable"
      },
      {
        "foreground": "#e50000",
        "token": "source.coffee.embedded"
      },
      {
        "foreground": "#0451a5",
        "token": "support.type.property-name.json"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.control"
      },
      {
        "foreground": "#000000",
        "token": "keyword.operator"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.operator.new"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.operator.expression"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.operator.cast"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.operator.sizeof"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.operator.alignof"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.operator.typeid"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.operator.alignas"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.operator.instanceof"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.operator.logical.python"
      },
      {
        "foreground": "#0000ff",
        "token": "keyword.operator.wordlike"
      },
      {
        "foreground": "#098658",
        "token": "keyword.other.unit"
      },
      {
        "foreground": "#800000",
        "token": "punctuation.section.embedded.begin.php"
      },
      {
        "foreground": "#800000",
        "token": "punctuation.section.embedded.end.php"
      },
      {
        "foreground": "#0451a5",
        "token": "support.function.git-rebase"
      },
      {
        "foreground": "#098658",
        "token": "constant.sha.git-rebase"
      },
      {
        "foreground": "#000000",
        "token": "storage.modifier.import.java"
      },
      {
        "foreground": "#000000",
        "token": "variable.language.wildcard.java"
      },
      {
        "foreground": "#000000",
        "token": "storage.modifier.package.java"
      },
      {
        "foreground": "#0000ff",
        "token": "variable.language"
      },
      {
        "foreground": "#795E26",
        "token": "entity.name.function"
      },
      {
        "foreground": "#795E26",
        "token": "support.function"
      },
      {
        "foreground": "#795E26",
        "token": "support.constant.handlebars"
      },
      {
        "foreground": "#795E26",
        "token": "source.powershell variable.other.member"
      },
      {
        "foreground": "#795E26",
        "token": "entity.name.operator.custom-literal"
      },
      {
        "foreground": "#267f99",
        "token": "support.class"
      },
      {
        "foreground": "#267f99",
        "token": "support.type"
      },
      {
        "foreground": "#267f99",
        "token": "entity.name.type"
      },
      {
        "foreground": "#267f99",
        "token": "entity.name.namespace"
      },
      {
        "foreground": "#267f99",
        "token": "entity.other.attribute"
      },
      {
        "foreground": "#267f99",
        "token": "entity.name.scope-resolution"
      },
      {
        "foreground": "#267f99",
        "token": "entity.name.class"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.numeric.go"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.byte.go"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.boolean.go"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.string.go"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.uintptr.go"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.error.go"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.rune.go"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.cs"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.generic.cs"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.modifier.cs"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.variable.cs"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.annotation.java"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.generic.java"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.java"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.object.array.java"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.primitive.array.java"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.primitive.java"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.token.java"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.groovy"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.annotation.groovy"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.parameters.groovy"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.generic.groovy"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.object.array.groovy"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.primitive.array.groovy"
      },
      {
        "foreground": "#267f99",
        "token": "storage.type.primitive.groovy"
      },
      {
        "foreground": "#267f99",
        "token": "meta.type.cast.expr"
      },
      {
        "foreground": "#267f99",
        "token": "meta.type.new.expr"
      },
      {
        "foreground": "#267f99",
        "token": "support.constant.math"
      },
      {
        "foreground": "#267f99",
        "token": "support.constant.dom"
      },
      {
        "foreground": "#267f99",
        "token": "support.constant.json"
      },
      {
        "foreground": "#267f99",
        "token": "entity.other.inherited-class"
      },
      {
        "foreground": "#267f99",
        "token": "punctuation.separator.namespace.ruby"
      },
      {
        "foreground": "#AF00DB",
        "token": "keyword.control"
      },
      {
        "foreground": "#AF00DB",
        "token": "source.cpp keyword.operator.new"
      },
      {
        "foreground": "#AF00DB",
        "token": "source.cpp keyword.operator.delete"
      },
      {
        "foreground": "#AF00DB",
        "token": "keyword.other.using"
      },
      {
        "foreground": "#AF00DB",
        "token": "keyword.other.directive.using"
      },
      {
        "foreground": "#AF00DB",
        "token": "keyword.other.operator"
      },
      {
        "foreground": "#AF00DB",
        "token": "entity.name.operator"
      },
      {
        "foreground": "#001080",
        "token": "variable"
      },
      {
        "foreground": "#001080",
        "token": "meta.definition.variable.name"
      },
      {
        "foreground": "#001080",
        "token": "support.variable"
      },
      {
        "foreground": "#001080",
        "token": "entity.name.variable"
      },
      {
        "foreground": "#001080",
        "token": "constant.other.placeholder"
      },
      {
        "foreground": "#0070C1",
        "token": "variable.other.constant"
      },
      {
        "foreground": "#0070C1",
        "token": "variable.other.enummember"
      },
      {
        "foreground": "#001080",
        "token": "meta.object-literal.key"
      },
      {
        "foreground": "#0451a5",
        "token": "support.constant.property-value"
      },
      {
        "foreground": "#0451a5",
        "token": "support.constant.font-name"
      },
      {
        "foreground": "#0451a5",
        "token": "support.constant.media-type"
      },
      {
        "foreground": "#0451a5",
        "token": "support.constant.media"
      },
      {
        "foreground": "#0451a5",
        "token": "constant.other.color.rgb-value"
      },
      {
        "foreground": "#0451a5",
        "token": "constant.other.rgb-value"
      },
      {
        "foreground": "#0451a5",
        "token": "support.constant.color"
      },
      {
        "foreground": "#d16969",
        "token": "punctuation.definition.group.regexp"
      },
      {
        "foreground": "#d16969",
        "token": "punctuation.definition.group.assertion.regexp"
      },
      {
        "foreground": "#d16969",
        "token": "punctuation.definition.character-class.regexp"
      },
      {
        "foreground": "#d16969",
        "token": "punctuation.character.set.begin.regexp"
      },
      {
        "foreground": "#d16969",
        "token": "punctuation.character.set.end.regexp"
      },
      {
        "foreground": "#d16969",
        "token": "keyword.operator.negation.regexp"
      },
      {
        "foreground": "#d16969",
        "token": "support.other.parenthesis.regexp"
      },
      {
        "foreground": "#811f3f",
        "token": "constant.character.character-class.regexp"
      },
      {
        "foreground": "#811f3f",
        "token": "constant.other.character-class.set.regexp"
      },
      {
        "foreground": "#811f3f",
        "token": "constant.other.character-class.regexp"
      },
      {
        "foreground": "#811f3f",
        "token": "constant.character.set.regexp"
      },
      {
        "foreground": "#000000",
        "token": "keyword.operator.quantifier.regexp"
      },
      {
        "foreground": "#EE0000",
        "token": "keyword.operator.or.regexp"
      },
      {
        "foreground": "#EE0000",
        "token": "keyword.control.anchor.regexp"
      },
      {
        "foreground": "#0000ff",
        "token": "constant.character"
      },
      {
        "foreground": "#0000ff",
        "token": "constant.other.option"
      },
      {
        "foreground": "#EE0000",
        "token": "constant.character.escape"
      },
      {
        "foreground": "#000000",
        "token": "entity.name.label"
      }
    ],
    "encodedTokensColors": []
  }
}
`.trim()}];var tX=r(2441);let t0=e=>{let{value:t,tmActive:r}=e,{palette:o}=(0,tN.Z)(),n=eb("tmStatus",{active:r});return(0,s.jsxs)(h.Z,{display:"flex",flexDirection:"row",alignItems:"center",gap:"0.5em",children:[(0,s.jsx)(h.Z,{sx:{color:o.primary[o.mode],fontFamily:"var(--font-mono)",userSelect:"none",textTransform:"capitalize",letterSpacing:"-0.035em"},children:t}),null!=r&&(0,s.jsx)(tX.Z,{title:(0,s.jsx)(t8,{}),arrow:!0,children:(0,s.jsx)(h.Z,{sx:{userSelect:"none",color:r?o.text.primary:o.text.disabled},children:(0,s.jsx)("small",{children:n})})})]})},t1=(0,tu.ZP)(h.Z)`
  color: #ddd;
  a {
    color: #fff;
  }
`;function t5(e){let{href:t,children:r}=e;return(0,s.jsx)("a",{href:t,title:r,target:"_blank",rel:"noreferrer",children:r})}function t8(){return(0,s.jsxs)(t1,{children:["Formatter base on"," ",(0,s.jsx)(t5,{href:"https://www.npmjs.com/package/vscode-oniguruma",children:"vscode-oniguruma"})," ","&"," ",(0,s.jsx)(t5,{href:"https://www.npmjs.com/package/vscode-textmate",children:"vscode-textmate"})," ","&"," ",(0,s.jsx)(t5,{href:"https://www.npmjs.com/package/monaco-editor-textmate",children:"monaco-editor-textmate"}),". tmLanguages are from"," ",(0,s.jsx)(t5,{href:"https://github.com/microsoft/vscode",children:"vscode"})," project. And also can check from"," ",(0,s.jsx)(t5,{href:"https://github.com/textmate/textmate",children:"textmate"})," ","project."]})}let t9=e=>{let{disabled:t,themes:r,value:o,onChange:n}=e,a=(0,v.useMemo)(()=>{let e=[];for(let[,t]of Object.entries(eN))e.push({key:t.name,name:t.displayName});return e.concat(r)},[r]);return(0,s.jsx)(f.Z,{value:o,onChange:e=>{null==n||n(e.target.value)},disabled:t,children:a.map(e=>(0,s.jsx)(p.Z,{value:e.key,children:e.name},e.key))})};var t2=r(943),t6=r(5716);let t3=e=>{let{open:t,onClose:r,onSubmit:o,options:n}=e,a=(0,v.useRef)(null),[i,d]=(0,v.useState)(!1),[u,c]=(0,v.useState)(void 0),l=(0,v.useRef)(n),[g,f]=(0,v.useState)(!1),[p,k]=(0,v.useState)(!1);return(0,O.LI)(()=>{t&&!i&&d(!0)},[t,i]),(0,O.LI)(()=>{if(t)return()=>{k(!1)}},[t]),(0,O.KS)(()=>{c(void 0)},u?3e3:null),(0,s.jsx)(t2.ZP,{open:!!t,onClose:p?void 0:b,anchor:"right",slotProps:{paper:{sx:{width:"50%"}}},children:(0,s.jsxs)(h.Z,{display:"flex",flexDirection:"column",flex:"1 1 auto",sx:{p:"0.5em",gap:"0.5em"},children:[(0,s.jsx)("strong",{children:"Editor Monaco Options"}),(0,s.jsxs)("div",{children:["Some options require to refresh the browser. Submit will save the options in ",(0,s.jsx)("code",{children:"localStorage"}),"."]}),(0,s.jsxs)(h.Z,{display:"flex",gap:"0.5em",children:[(0,s.jsx)("strong",{children:"Reference"}),(0,s.jsx)(t6.Z,{href:"https://microsoft.github.io/monaco-editor/typedoc/variables/editor.EditorOptions.html",target:"monaco-docs:EditorOptionsConst",children:"EditorOptionsConst"})]}),i&&(0,s.jsx)(tv,{ref:a,mode:"code",modes:["code","tree"],value:n,onChange:()=>{f(!1)},onValidate:e=>((0,tp.T)(e)&&f(!0),[])}),(0,s.jsxs)(h.Z,{display:"flex",gap:"0.5em",alignItems:"center",children:[(0,s.jsx)(tX.Z,{title:"Click submit will update current monaco editor options!!",arrow:!0,children:(0,s.jsx)("div",{children:(0,s.jsx)(m.Z,{disabled:!g,size:"medium",onClick:function(){if(null==a.current)return;let e=a.current.get();if((0,B.Z)(l.current,e)){null==r||r(),k(!1);return}l.current=e,null==o||o(e),k(!1),null==r||r()},children:"Submit"})})}),(0,s.jsx)(tX.Z,{open:p,title:p?(0,s.jsxs)(h.Z,{display:"flex",flexDirection:"column",flex:"1 1 auto",sx:{p:"0.5em",gap:"0.5em"},children:["There are something changed. Are you sure to dropped them?",(0,s.jsxs)(h.Z,{display:"flex",gap:"0.5em",alignItems:"center",children:[(0,s.jsx)(m.Z,{onClick:()=>{null==r||r()},children:"Sure, drop them!"}),(0,s.jsx)(m.Z,{color:"info",onClick:()=>k(!1),children:"Let me think..."})]})]}):"Current modify will be dropped!",arrow:!0,children:(0,s.jsx)("div",{children:(0,s.jsx)(m.Z,{color:"error",size:"medium",onClick:b,children:"Close"})})}),(0,s.jsx)("span",{children:u||"Please make sure you know what you are doing!!!"})]})]})});function b(){if((0,B.Z)(l.current,a.current.get())){null==r||r();return}k(!0)}},t4={lineHeight:1.65,tabSize:2,fontSize:14.5,fontWeight:"300",fontFamily:"var(--font-mono)",fontLigatures:"no-common-ligatures, slashed-zero",letterSpacing:.025,minimap:{enabled:!1},scrollbar:{verticalHasArrows:!1,horizontalHasArrows:!1,vertical:"visible",horizontal:"visible",verticalScrollbarSize:13,horizontalScrollbarSize:13,verticalSliderSize:8,horizontalSliderSize:8}},t7=(0,u.iv)`
  .scrollbar .slider {
    border-radius: 10px;
  }
  .scrollbar.vertical {
    padding-top: 2px;
    .slider {
      margin-left: 1px;
    }
  }
`,{themes:re,ThemesInjection:rt}=(e=>{let{themes:t}=e;if(!t.length)throw Error("Creating a theme plugin requires at least a theme declaration");return{ThemesInjection:t=>{let{loadTheme:r}=t,o=(0,v.useRef)(r),{emitterRef:n,setError:a,lifecycleId:i}=eJ(),s=(0,v.useRef)(null);return(0,v.useLayoutEffect)(()=>{try{s.current=new ta(e,t,{debug:t.debug}),s.current.inject(n.current)}catch(e){a(e)}return()=>{s.current?.eject(n.current),s.current=null}},[i]),(0,v.useLayoutEffect)(()=>{null!=s.current&&o.current!==r&&(o.current=r,s.current.preloadTheme(r))},[r]),null},themes:t.map(e=>({...e}))}})({themes:[{key:"atom-material-theme",name:"Atom Material Theme"},{key:"atom-one-light",name:"Atom One Light"},{key:"atomize",name:"Atomize(Atom One Dark)"},{key:"csb-default",name:"CSB Default"},{key:"github-light",name:"GitHub Light",theme:{name:"github-light",displayName:"GitHub Light",isDark:!1,colors:{primary:"#2188ff",secondary:"#34d05840",background:"#ffffff",text:"#24292e",borderColor:"#d1d5da"},data:{inherit:!1,base:"vs",colors:{focusBorder:"#2188ff",foreground:"#444d56",descriptionForeground:"#6a737d",errorForeground:"#cb2431","textLink.foreground":"#0366d6","textLink.activeForeground":"#005cc5","textBlockQuote.background":"#fafbfc","textBlockQuote.border":"#e1e4e8","textCodeBlock.background":"#f6f8fa","textPreformat.foreground":"#586069","textSeparator.foreground":"#d1d5da","button.background":"#159739","button.foreground":"#ffffff","button.hoverBackground":"#138934","button.secondaryBackground":"#e1e4e8","button.secondaryForeground":"#1b1f23","button.secondaryHoverBackground":"#d1d5da","checkbox.background":"#fafbfc","checkbox.border":"#d1d5da","dropdown.background":"#fafbfc","dropdown.border":"#e1e4e8","dropdown.foreground":"#2f363d","dropdown.listBackground":"#ffffff","input.background":"#fafbfc","input.border":"#e1e4e8","input.foreground":"#2f363d","input.placeholderForeground":"#959da5","badge.foreground":"#005cc5","badge.background":"#dbedff","progressBar.background":"#2188ff","titleBar.activeForeground":"#2f363d","titleBar.activeBackground":"#ffffff","titleBar.inactiveForeground":"#6a737d","titleBar.inactiveBackground":"#f6f8fa","titleBar.border":"#e1e4e8","activityBar.foreground":"#2f363d","activityBar.inactiveForeground":"#959da5","activityBar.background":"#ffffff","activityBarBadge.foreground":"#ffffff","activityBarBadge.background":"#2188ff","activityBar.activeBorder":"#f9826c","activityBar.border":"#e1e4e8","sideBar.foreground":"#586069","sideBar.background":"#f6f8fa","sideBar.border":"#e1e4e8","sideBarTitle.foreground":"#2f363d","sideBarSectionHeader.foreground":"#2f363d","sideBarSectionHeader.background":"#f6f8fa","sideBarSectionHeader.border":"#e1e4e8","list.hoverForeground":"#2f363d","list.inactiveSelectionForeground":"#2f363d","list.activeSelectionForeground":"#2f363d","list.hoverBackground":"#ebf0f4","list.inactiveSelectionBackground":"#e8eaed","list.activeSelectionBackground":"#e2e5e9","list.inactiveFocusBackground":"#dbedff","list.focusBackground":"#cce5ff","tree.indentGuidesStroke":"#e1e4e8","notificationCenterHeader.foreground":"#6a737d","notificationCenterHeader.background":"#e1e4e8","notifications.foreground":"#2f363d","notifications.background":"#fafbfc","notifications.border":"#e1e4e8","notificationsErrorIcon.foreground":"#d73a49","notificationsWarningIcon.foreground":"#e36209","notificationsInfoIcon.foreground":"#005cc5","pickerGroup.border":"#e1e4e8","pickerGroup.foreground":"#2f363d","quickInput.background":"#fafbfc","quickInput.foreground":"#2f363d","statusBar.foreground":"#586069","statusBar.background":"#ffffff","statusBar.border":"#e1e4e8","statusBar.noFolderBackground":"#ffffff","statusBar.debuggingBackground":"#f9826c","statusBar.debuggingForeground":"#ffffff","statusBarItem.prominentBackground":"#e8eaed","statusBarItem.remoteForeground":"#586069","statusBarItem.remoteBackground":"#ffffff","editorGroupHeader.tabsBackground":"#f6f8fa","editorGroupHeader.tabsBorder":"#e1e4e8","editorGroup.border":"#e1e4e8","tab.activeForeground":"#2f363d","tab.inactiveForeground":"#6a737d","tab.inactiveBackground":"#f6f8fa","tab.activeBackground":"#ffffff","tab.hoverBackground":"#ffffff","tab.unfocusedHoverBackground":"#ffffff","tab.border":"#e1e4e8","tab.unfocusedActiveBorderTop":"#e1e4e8","tab.activeBorder":"#ffffff","tab.unfocusedActiveBorder":"#ffffff","tab.activeBorderTop":"#f9826c","breadcrumb.foreground":"#6a737d","breadcrumb.focusForeground":"#2f363d","breadcrumb.activeSelectionForeground":"#586069","breadcrumbPicker.background":"#fafbfc","editor.foreground":"#24292e","editor.background":"#ffffff","editorWidget.background":"#f6f8fa","editor.foldBackground":"#d1d5da11","editor.lineHighlightBackground":"#f6f8fa","editorLineNumber.foreground":"#1b1f234d","editorLineNumber.activeForeground":"#24292e","editorIndentGuide.background":"#eff2f6","editorIndentGuide.activeBackground":"#d7dbe0","editorWhitespace.foreground":"#d1d5da","editorCursor.foreground":"#044289","editorError.foreground":"#cb2431","editorWarning.foreground":"#f9c513","editor.findMatchBackground":"#ffdf5d","editor.findMatchHighlightBackground":"#ffdf5d66","editor.linkedEditingBackground":"#0366d611","editor.inactiveSelectionBackground":"#0366d611","editor.selectionBackground":"#0366d625","editor.selectionHighlightBackground":"#34d05840","editor.selectionHighlightBorder":"#34d05800","editor.wordHighlightBackground":"#34d05800","editor.wordHighlightStrongBackground":"#34d05800","editor.wordHighlightBorder":"#24943e99","editor.wordHighlightStrongBorder":"#24943e50","editorBracketMatch.background":"#34d05840","editorBracketMatch.border":"#34d05800","editorGutter.modifiedBackground":"#2188ff","editorGutter.addedBackground":"#28a745","editorGutter.deletedBackground":"#d73a49","diffEditor.insertedTextBackground":"#34d05822","diffEditor.removedTextBackground":"#d73a4922","scrollbar.shadow":"#6a737d33","scrollbarSlider.background":"#959da533","scrollbarSlider.hoverBackground":"#959da544","scrollbarSlider.activeBackground":"#959da588","editorOverviewRuler.border":"#ffffff","panel.background":"#f6f8fa","panel.border":"#e1e4e8","panelTitle.activeBorder":"#f9826c","panelTitle.activeForeground":"#2f363d","panelTitle.inactiveForeground":"#6a737d","panelInput.border":"#e1e4e8","terminal.foreground":"#586069","terminal.tab.activeBorder":"#f9826c","terminalCursor.background":"#d1d5da","terminalCursor.foreground":"#005cc5","terminal.ansiBrightWhite":"#d1d5da","terminal.ansiWhite":"#6a737d","terminal.ansiBrightBlack":"#959da5","terminal.ansiBlack":"#24292e","terminal.ansiBlue":"#0366d6","terminal.ansiBrightBlue":"#005cc5","terminal.ansiGreen":"#28a745","terminal.ansiBrightGreen":"#22863a","terminal.ansiCyan":"#1b7c83","terminal.ansiBrightCyan":"#3192aa","terminal.ansiRed":"#d73a49","terminal.ansiBrightRed":"#cb2431","terminal.ansiMagenta":"#5a32a3","terminal.ansiBrightMagenta":"#5a32a3","terminal.ansiYellow":"#dbab09","terminal.ansiBrightYellow":"#b08800","editorBracketHighlight.foreground1":"#005cc5","editorBracketHighlight.foreground2":"#e36209","editorBracketHighlight.foreground3":"#5a32a3","editorBracketHighlight.foreground4":"#005cc5","editorBracketHighlight.foreground5":"#e36209","editorBracketHighlight.foreground6":"#5a32a3","gitDecoration.addedResourceForeground":"#28a745","gitDecoration.modifiedResourceForeground":"#005cc5","gitDecoration.deletedResourceForeground":"#d73a49","gitDecoration.untrackedResourceForeground":"#28a745","gitDecoration.ignoredResourceForeground":"#959da5","gitDecoration.conflictingResourceForeground":"#e36209","gitDecoration.submoduleResourceForeground":"#959da5","debugToolBar.background":"#ffffff","editor.stackFrameHighlightBackground":"#ffd33d33","editor.focusedStackFrameHighlightBackground":"#28a74525","settings.headerForeground":"#2f363d","settings.modifiedItemIndicator":"#2188ff","welcomePage.buttonBackground":"#f6f8fa","welcomePage.buttonHoverBackground":"#e1e4e8"},rules:[{foreground:"#6a737d",token:"comment"},{foreground:"#6a737d",token:"punctuation.definition.comment"},{foreground:"#6a737d",token:"string.comment"},{foreground:"#005cc5",token:"constant"},{foreground:"#005cc5",token:"entity.name.constant"},{foreground:"#005cc5",token:"variable.other.constant"},{foreground:"#005cc5",token:"variable.other.enummember"},{foreground:"#005cc5",token:"variable.language"},{foreground:"#6f42c1",token:"entity"},{foreground:"#6f42c1",token:"entity.name"},{foreground:"#25292e",token:"variable.parameter.function"},{foreground:"#22863a",token:"entity.name.tag"},{foreground:"#d73a49",token:"keyword"},{foreground:"#d73a49",token:"storage"},{foreground:"#d73a49",token:"storage.type"},{foreground:"#25292e",token:"storage.modifier.package"},{foreground:"#25292e",token:"storage.modifier.import"},{foreground:"#25292e",token:"storage.type.java"},{foreground:"#032f62",token:"string"},{foreground:"#032f62",token:"punctuation.definition.string"},{foreground:"#032f62",token:"string punctuation.section.embedded source"},{foreground:"#005cc5",token:"support"},{foreground:"#005cc5",token:"meta.property-name"},{foreground:"#e36209",token:"variable"},{foreground:"#25292e",token:"variable.other"},{fontStyle:"italic",foreground:"#b31d28",token:"invalid.broken"},{fontStyle:"italic",foreground:"#b31d28",token:"invalid.deprecated"},{fontStyle:"italic",foreground:"#b31d28",token:"invalid.illegal"},{fontStyle:"italic",foreground:"#b31d28",token:"invalid.unimplemented"},{fontStyle:"italic underline",background:"#d73a49",foreground:"#fafbfc",content:"^M",token:"carriage-return"},{foreground:"#b31d28",token:"message.error"},{foreground:"#005cc5",token:"string variable"},{foreground:"#032f62",token:"source.regexp"},{foreground:"#032f62",token:"string.regexp"},{foreground:"#032f62",token:"string.regexp.character-class"},{foreground:"#032f62",token:"string.regexp constant.character.escape"},{foreground:"#032f62",token:"string.regexp source.ruby.embedded"},{foreground:"#032f62",token:"string.regexp string.regexp.arbitrary-repitition"},{fontStyle:"bold",foreground:"#22863a",token:"string.regexp constant.character.escape"},{foreground:"#005cc5",token:"support.constant"},{foreground:"#005cc5",token:"support.variable"},{foreground:"#005cc5",token:"meta.module-reference"},{foreground:"#e36209",token:"punctuation.definition.list.begin.markdown"},{fontStyle:"bold",foreground:"#005cc5",token:"markup.heading"},{fontStyle:"bold",foreground:"#005cc5",token:"markup.heading entity.name"},{foreground:"#22863a",token:"markup.quote"},{fontStyle:"italic",foreground:"#25292e",token:"markup.italic"},{fontStyle:"bold",foreground:"#25292e",token:"markup.bold"},{fontStyle:"underline",token:"markup.underline"},{fontStyle:"strikethrough",token:"markup.strikethrough"},{foreground:"#005cc5",token:"markup.inline.raw"},{background:"#ffeef0",foreground:"#b31d28",token:"markup.deleted"},{background:"#ffeef0",foreground:"#b31d28",token:"meta.diff.header.from-file"},{background:"#ffeef0",foreground:"#b31d28",token:"punctuation.definition.deleted"},{background:"#f0fff4",foreground:"#22863a",token:"markup.inserted"},{background:"#f0fff4",foreground:"#22863a",token:"meta.diff.header.to-file"},{background:"#f0fff4",foreground:"#22863a",token:"punctuation.definition.inserted"},{background:"#ffebda",foreground:"#e36209",token:"markup.changed"},{background:"#ffebda",foreground:"#e36209",token:"punctuation.definition.changed"},{foreground:"#f6f8fa",background:"#005cc5",token:"markup.ignored"},{foreground:"#f6f8fa",background:"#005cc5",token:"markup.untracked"},{foreground:"#6f42c1",fontStyle:"bold",token:"meta.diff.range"},{foreground:"#005cc5",token:"meta.diff.header"},{fontStyle:"bold",foreground:"#005cc5",token:"meta.separator"},{foreground:"#005cc5",token:"meta.output"},{foreground:"#586069",token:"brackethighlighter.tag"},{foreground:"#586069",token:"brackethighlighter.curly"},{foreground:"#586069",token:"brackethighlighter.round"},{foreground:"#586069",token:"brackethighlighter.square"},{foreground:"#586069",token:"brackethighlighter.angle"},{foreground:"#586069",token:"brackethighlighter.quote"},{foreground:"#b31d28",token:"brackethighlighter.unmatched"},{foreground:"#032f62",fontStyle:"underline",token:"constant.other.reference.link"},{foreground:"#032f62",fontStyle:"underline",token:"string.other.link"}],encodedTokensColors:[]}}},{key:"webstorm-darcula",name:"Webstorm Darcula",url:new URL("webstorm-darcula.json",(e=>{let t=(0,tT.Z4)(e);return t?`${tL}${t}/`:tL})("themes"))},{key:"webstorm-dark",name:"Webstorm Dark"}]}),rr=e=>{let{mode:t,percent:r,indeterminate:o}=e,n=null==r||o;return t?(0,s.jsx)(k.Z,{variant:n?"indeterminate":"determinate",value:r,sx:{minWidth:320}},n?"indeterminate":"determinate"):null},ro=e=>{let{language:t,extname:r}=e;return".prisma"===r?{url:new URL("prisma.tmLanguage.json",e3("baseUrl")),format:"json",languageId:"prisma"}:(null==t?void 0:t.id)==="kotlin"?{url:new URL("kotlin.tmLanguage.json",e3("baseUrl")),format:"json",languageId:t.id,scopeName:"source.gradle-kotlin-dsl"}:void 0},rn=e=>e,ra=document.getElementById("root");ra&&(0,d.createRoot)(ra).render((0,s.jsx)(()=>{let e=(0,v.useRef)(null),t=(0,v.useRef)(tY),[r,o]=(0,O._)("monaco-sample-data",{}),{locale:n,theme:a,filename:i,customOptions:d}=r,[u,k]=(0,v.useState)({loading:!1}),[b,y,w]=(0,v.useMemo)(()=>{let{name:e,colors:t,isDark:r}=e$(a);return[{...t4,...d??{},theme:e},tP(r,t),t]},[a,d]),[F,C]=(0,v.useState)(),[B,x]=(0,v.useState)(!1),[A,E]=(0,v.useState)(!1),S=e=>o(t=>({...t,...e})),_=(0,v.useMemo)(()=>{let e=t.current.find(e=>e.filename===i);return null==e&&(e=t.current[0]),e},[i]);return(0,s.jsxs)(l.Z,{theme:y,children:[(0,s.jsx)(g.ZP,{}),(0,s.jsx)(tB.Dialog,{open:B,onClose:()=>x(!1)}),(0,s.jsx)(t3,{open:A,onClose:()=>E(!1),onSubmit:e=>{S({customOptions:e})},options:d??t4}),(0,s.jsxs)(eQ,{loader:{query:{locale:n}},style:{"--rmBackdropBg":w.background,"--rmBorderColor":w.borderColor,"--rmTextColor":w.text},components:{ProgressBar:rr},texts:{tmStatus:e=>{let{active:t}=e;return`Textmate ${t?"active":"inactive"}`}},children:[(0,s.jsx)(tr,{debug:!0,onChange:C,provider:ro,filter:rn}),(0,s.jsx)(e8,{debug:!0,locale:n}),(0,s.jsx)(rt,{debug:!0,theme:b.theme,loadTheme:u.name,onLoad:e=>{if(e.isSuccess){let{name:t,isDark:r,colors:o}=e.theme;S({theme:{name:t,isDark:r,colors:o}})}k(e=>({...e,loading:!1}))}}),(0,s.jsx)(t_,{}),(0,s.jsxs)(tO,{children:[(0,s.jsx)(t$,{value:n,onChange:e=>S({locale:e})}),(0,s.jsx)(f.Z,{value:_.filename,onChange:e=>{S({filename:e.target.value})},children:t.current.map(e=>(0,s.jsx)(p.Z,{value:e.filename,children:e.filename},e.filename))}),(0,s.jsx)(t9,{value:b.theme,themes:re,disabled:u.loading,onChange:e=>k({name:e,loading:!0})}),(0,s.jsxs)(h.Z,{display:"flex",sx:{ml:"auto"},gap:"4px",children:[(0,s.jsx)(m.Z,{size:"medium",onClick:()=>x(!0),children:"Theme Converter"}),(0,s.jsx)(m.Z,{sx:{minWidth:"auto"},onClick:()=>E(!0),children:(0,s.jsx)(c.Z,{})})]})]}),(0,s.jsx)(eY,{ref:e,debug:!0,input:_,className:t7,options:b,onCreateModel:e=>{let{input:r,model:o}=e,n=t.current.find(e=>e.filename===r.filename);n&&(n.model=o)}}),(0,s.jsx)(tM,{children:(0,s.jsx)(t0,{value:(null==F?void 0:F.languageId)??"plaintext",tmActive:null==F?void 0:F.isActive})})]})]})},{}))}},t={};function r(o){var n=t[o];if(void 0!==n)return n.exports;var a=t[o]={exports:{}};return e[o].call(a.exports,a,a.exports,r),a.exports}r.m=e,r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},(()=>{var e,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;r.t=function(o,n){if(1&n&&(o=this(o)),8&n||"object"==typeof o&&o&&(4&n&&o.__esModule||16&n&&"function"==typeof o.then))return o;var a=Object.create(null);r.r(a);var i={};e=e||[null,t({}),t([]),t(t)];for(var s=2&n&&o;"object"==typeof s&&!~e.indexOf(s);s=t(s))Object.getOwnPropertyNames(s).forEach(e=>{i[e]=()=>o[e]});return i.default=()=>o,r.d(a,i),a}})(),r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},(()=>{r.g=(()=>{if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}})()})(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e=[];r.O=(t,o,n,a)=>{if(o){a=a||0;for(var i=e.length;i>0&&e[i-1][2]>a;i--)e[i]=e[i-1];e[i]=[o,n,a];return}for(var s=1/0,i=0;i<e.length;i++){for(var[o,n,a]=e[i],d=!0,u=0;u<o.length;u++)(!1&a||s>=a)&&Object.keys(r.O).every(e=>r.O[e](o[u]))?o.splice(u--,1):(d=!1,a<s&&(s=a));if(d){e.splice(i--,1);var c=n();void 0!==c&&(t=c)}}return t}})(),r.rv=()=>"1.2.8",(()=>{var e={909:0};r.O.j=t=>0===e[t];var t=(t,o)=>{var n,a,[i,s,d]=o,u=0;if(i.some(t=>0!==e[t])){for(n in s)r.o(s,n)&&(r.m[n]=s[n]);if(d)var c=d(r)}for(t&&t(o);u<i.length;u++)a=i[u],r.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return r.O(c)},o=self.webpackChunk_react_monaco_demo=self.webpackChunk_react_monaco_demo||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))})(),r.ruid="bundler=rspack@1.2.8";var o=r.O(void 0,["698"],function(){return r(246)});o=r.O(o)})();