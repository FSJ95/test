/****

Copyright (c) 2015-2018 Yggdrasil Gaming LTD. All rights reserved.

****/

(function() {
    _d("@@*", ["^#", "!", "%&", "#", "^!"], function(t, i, o, s, e) {
        "use strict";
        function r(t, e, n) {
            this.audio = o.getOrCreate(t), this.file = t, this._volume = 1, this._loop = e, this.music = n, this.refreshVolume(), i.bindAll(this), o.on("globalVolume/changed", this.refreshVolume), o.on("soundsEnabled/changed", this.refreshVolume), o.on("musicEnabled/changed", this.refreshVolume), o.on("musicVolume/changed", this.refreshVolume), a() && s.once("context/resumed", function() {
                this.audio.paused = !0, this.normalizeAudioPosition(), this.audio.paused = !1
            }.bind(this))
        }
        r.play = function(t, e, n) {
            var i = new r(t, e, n);
            return i.play(), i
        }, r.prototype.play = function() {
            this.normalizeAudioPosition(), this.audio.paused = !1, this.audio.play({
                loop: this.loop ? -1 : 0
            }), this.audio.on("complete", this.stop), s.emit("audio/play", this.file)
        }, r.prototype.normalizeAudioPosition = function() {
            this.audio._position < 0 && (this.audio._position = 0)
        }, r.prototype.stop = function() {
            this.audio && (this.audio.off("complete", this.stop), s.emit("audio/stop", this.file), this.audio.playbackResource && (TweenMax.killTweensOf(this.audio), this.audio.destroy()), this.audio = null, o.off("globalVolume/changed", this.refreshVolume), o.off("soundsEnabled/changed", this.refreshVolume), o.off("musicEnabled/changed", this.refreshVolume), o.off("musicVolume/changed", this.refreshVolume))
        }, r.prototype.fadeOutAndStop = function(t) {
            if (this.audio) {
                var e = t || .3;
                TweenMax.to(this.audio, e, {
                    volume: 0,
                    ease: Linear.easeNone,
                    onComplete: this.stop
                })
            }
        }, r.prototype.pause = function() {
            this.audio.paused = !0
        }, r.prototype.load = function() {
            this.audio.load()
        }, r.prototype.clone = function() {
            return new r(this.file)
        }, r.prototype.refreshVolume = function() {
            this.audio && (this.audio.volume = this.volume * o.globalVolume, this.music && (this.audio.volume *= o.musicVolume), this.music && !o.musicEnabled && (this.audio.volume = 0), this.music || o.soundsEnabled || (this.audio.volume = 0))
        }, Object.defineProperty(r.prototype, "loop", {
            get: function() {
                return this._loop
            },
            set: function(t) {
                this._loop = t
            }
        }), Object.defineProperty(r.prototype, "volume", {
            get: function() {
                return this._volume
            },
            set: function(t) {
                this._volume = t, this.refreshVolume()
            }
        }), Object.defineProperty(r.prototype, "currentTime", {
            get: function() {
                return this.audio.currentTime
            },
            set: function(t) {
                this.audio.currentTime = t
            }
        }), Object.defineProperty(r.prototype, "position", {
            get: function() {
                return this.audio.position
            },
            set: function(t) {
                this.audio.position = t
            }
        }), Object.defineProperty(r.prototype, "pan", {
            get: function() {
                return this.audio.pan
            },
            set: function(t) {
                this.audio.pan = t
            }
        }), Object.defineProperty(r.prototype, "duration", {
            get: function() {
                return this.audio.duration
            },
            set: function(t) {
                this.audio.duration = t
            }
        });
        var a = function() {
            return createjs.WebAudioPlugin && createjs.WebAudioPlugin.context && "suspended" === createjs.WebAudioPlugin.context.state
        };
        return r.hasSuspendedContext = function() {
            return createjs.WebAudioPlugin && createjs.WebAudioPlugin.context && "suspended" === createjs.WebAudioPlugin.context.state
        }, r.resumeContext = function() {
            document.removeEventListener("click", r.resumeContext), r.hasSuspendedContext() && (createjs.WebAudioPlugin.context.resume(), s.emit("context/resumed"))
        }, document.addEventListener("click", r.resumeContext), r
    }), _d("@@(", ["^!"], function(o) {
        "use strict";
        function t() {}
        return t.detect = function(t, e, n) {
            return t || (t = 800), e || (e = 600), function() {
                try {
                    var t = document.createElement("canvas"),
                        e = !!window.WebGLRenderingContext,
                        n = t.getContext(o.isEdge() ? "experimental-webgl" : "webgl"),
                        i = !1;
                    return n && (i = 4096 <= n.getParameter(n.MAX_TEXTURE_SIZE)), e && n && i
                } catch (t) {
                    return !1
                }
            }() ? new PIXI.WebGLRenderer(t, e, n) : new PIXI.CanvasRenderer(t, e, n)
        }, t
    }), _d("@@)", ["^#"], function(t) {
        "use strict";
        function e(t, e) {
            PIXI.Container.call(this), this.maxBounds = new PIXI.Point(Number.MAX_VALUE, Number.MAX_VALUE), this.parseStyle(e), this._label = this.createLabel(t, e), this.anchor = new PIXI.ObservablePoint(this.onAnchorChanged, this, 0, 0), this.refresh()
        }
        return t.extend(e, PIXI.Container), e.prototype.createLabel = function(t, e) {
            return this.addChild(new PIXI.extras.BitmapText(t, e))
        }, e.prototype.onAnchorChanged = function() {
            this.refresh()
        }, Object.defineProperty(e.prototype, "style", {
            set: function(t) {
                this._label.style = t, this.parseStyle(style)
            }
        }), Object.defineProperty(e.prototype, "text", {
            get: function() {
                return this._label.text
            },
            set: function(t) {
                this._label.text = t, this.refresh()
            }
        }), e.prototype.parseStyle = function(t) {
            t.maxBounds && (this.maxBounds.x = t.maxBounds.width || this.maxBounds.x, this.maxBounds.y = t.maxBounds.height || this.maxBounds.y), this.fixedWidth = t.fixedWidth, this.fixedHeight = t.fixedHeight
        }, e.prototype.refresh = function() {
            var t = Math.min(1, this.maxBounds.x / this._label.textWidth),
                e = Math.min(1, this.maxBounds.y / this._label.textHeight);
            this._label.scale.x = this._label.scale.y = Math.min(t, e), this.fixedWidth ? this._label.x = -this.text.length * this.fixedWidth * this.anchor.x : this._label.x = -this._label.width * this.anchor.x, this._label.y = -(this.fixedHeight || this.height) * this.anchor.y
        }, e
    }), _d("@#!", ["@@", "*", "^", "&&"], function(i, o, e, s) {
        "use strict";
        var r = null;
        function t() {
            this.VERSION = {
                major: 1,
                minor: 0,
                patch: 0
            }, this.BET_SIZE_CHANGED_EVENT_NAME = "BOOST.BET_SIZE_CHANGED", this.CASHRACE_TOP_BAR_CHANGED = "BOOST.CASHRACE_TOP_BAR_CHANGED", this.isVersionSupported = !1, this.isLoaded = !1, this.participatesInCampaign = !1
        }
        return t.prototype.getUrl = function() {
            return i.boostURL
        }, t.prototype.tryCreateInstance = function() {
            window.BoostUI && (r = new window.BoostUI, this.isVersionSupported = r.isVersionSupported(this.VERSION))
        }, t.prototype.hasInstance = function() {
            return !!r
        }, t.prototype.isInited = function() {
            return this.hasInstance() && this.isLoaded
        }, t.prototype.getActiveCampaignId = function() {
            return this.isInited() ? r.getActiveCampaignId() : ""
        }, t.prototype.hasActiveCampaign = function() {
            return this.isInited() && !!this.getActiveCampaignId()
        }, t.prototype.tryLoad = function(t, e) {
            if (this.hasInstance())
                if (this.isVersionSupported) {
                    var n = {
                        gameid: i.getGameId(),
                        gamename: i.getFormatedGameName(),
                        appsrv: i.baseURL,
                        betsize: o.totalBet,
                        clientSessionId: s.CLIENT_SESSION_ID,
                        scale: 1 / i.getMetaInitialScale()
                    };
                    r.load(n, i.authData).then(function() {
                        this.isLoaded = !0, t && t()
                    }.bind(this)).catch(function(t) {
                        e && e(t)
                    }.bind(this))
                } else
                    e("Boost version is not supported");
            else
                e("Boost instance is not created")
        }, t.prototype.tryShowUi = function(t) {
            this.isInited() ? r.showUI().then(function(t) {
                this.participatesInCampaign = t.campaign && t.participate
            }.bind(this)).catch(console.error).finally(t) : t()
        }, t.prototype.tryCalendar = function() {
            try {
                r.showCalendar()
            } catch (t) {}
        }, t.prototype.tryAfterPlay = function(t) {
            this.hasActiveCampaign() ? r.afterPlay(e.data).catch(console.error).finally(t) : t()
        }, t.prototype.emitBetSizeChangedEvent = function(t) {
            if (this.isInited()) {
                var e = new Event(this.BET_SIZE_CHANGED_EVENT_NAME);
                e.detail = {
                    bet: t
                }, window.dispatchEvent(e)
            }
        }, t
    }), _d("@#@", ["#"], function(e) {
        "use strict";
        return function(t) {
            e.off("game/update", t)
        }
    }), _d("@##", [], function() {
        "use strict";
        return function(t) {
            TweenMax.ticker.removeEventListener("tick", t)
        }
    }), _d("@%", [], function() {
        "use strict";
        return function(t) {
            t && t.kill && (t.kill(), t = null)
        }
    }), _d("@#%", ["@#$"], function(o) {
        "use strict";
        function t(t, e) {
            this.name = t, this.exdays = e || 35600
        }
        return t.prototype.set = function(t) {
            var e = new Date;
            e.setTime(e.getTime() + 24 * this.exdays * 60 * 60 * 1e3), o.cookie = this.name + "=" + t + "; expires=" + e.toUTCString()
        }, t.prototype.get = function() {
            for (var t = this.name + "=", e = o.cookie.split(";"), n = 0; n < e.length; n++) {
                for (var i = e[n]; " " === i.charAt(0);)
                    i = i.substring(1);
                if (-1 !== i.indexOf(t))
                    return i.substring(t.length, i.length)
            }
            return null
        }, t
    }), _d("@#^", [], function() {
        "use strict";
        function o() {
            this.handlers = {}, this.onceHandlers = {}, this.PRIORITY_LOWEST = -1e3, this.PRIORITY_LOW = -100, this.PRIORITY_NORMAL = 0, this.PRIORITY_HIGH = 100, this.PRIORITY_HIGHEST = 1e3
        }
        return o.EMIT_WARNING_WHEN_HANDLERS_COUNTER_EXCEED = 25, o.prototype.generateDone = function(t, e) {
            return function() {
                this.runHandlers(t, e)
            }.bind(this)
        }, o.prototype.runHandlers = function(t, e) {
            for (; 0 < t.length;) {
                var n = t.shift();
                if (n.async)
                    return void n.handler.apply(this, e.concat(this.generateDone(t, e)));
                n.handler.apply(this, e)
            }
        }, o.prototype.emit = function(t) {
            if (this.handlers.hasOwnProperty(t)) {
                var e = Array.prototype.slice.call(arguments, 1);
                this.runHandlers(this.handlers[t].concat(), e)
            }
        }, o.prototype.on = function(t, e, n, i) {
            if (!e)
                throw new Error("empty handler");
            n = void 0 !== n ? n : this.PRIORITY_NORMAL, this.handlers[t] = this.handlers[t] || [], this.handlers[t].push({
                handler: e,
                priority: n,
                async: i
            }), this.handlers[t].sort(function(t, e) {
                return e.priority - t.priority
            }), 0 <= o.EMIT_WARNING_WHEN_HANDLERS_COUNTER_EXCEED && this.handlers[t].length
        }, o.prototype.off = function(t, e) {
            this.removeHandler(t, e), this.removeOnceHandler(t, e)
        }, o.prototype.removeHandler = function(t, e) {
            for (var n = this.handlers[t] ? this.handlers[t].length - 1 : -1; 0 <= n; n--)
                if (this.handlers[t][n].handler === e) {
                    this.handlers[t].splice(n, 1);
                    break
                }
        }, o.prototype.removeOnceHandler = function(t, e) {
            var n = this.onceHandlers[t];
            if (n)
                for (var i = n.length, o = 0; o < i; ++o)
                    if (n[o].handler === e) {
                        this.removeHandler(t, n[o].onceHandler), n.splice(o, 1);
                        break
                    }
        }, o.prototype.once = function(t, e, n, i) {
            var o = function() {
                this.off(t, e)
            };
            this.on(t, o, n), this.on(t, e, n, i), this.onceHandlers[t] = this.onceHandlers[t] || [], this.onceHandlers[t].push({
                handler: e,
                onceHandler: o
            })
        }, o
    }), _d("@$%", ["#", "@#&", "!", "@#*", "@#$", "@@", "@#(", "^!", "@#)", "@$!", ")", "$#", "@@(", "@$@", "@$#", "@$$", "(#", "@@*"], function(e, n, i, t, o, s, r, a, h, p, u, c, l, d, f, g, y, m) {
        "use strict";
        function S() {
            i.bindAll(this), this.createMetaTag(), this.applyCSSScaleClass(), this.applyLanguageClass(), this.requestFrame = new r(this.update), this._prevWindowSize = {
                innerWidth: 0,
                innerHeight: 0
            };
            var t = this.getCanvasSize();
            s.renderer = this.renderer = l.detect(t.width, t.height, {
                antialias: s.isDesktop
            }), this.addCustomBlendModes(s.renderer), s.stage = this.stage = new PIXI.Container, e.once("preloader/show", this.createPreloader), e.once("splashScreen/show", this.createSplashScreen), e.once("game/show", this.showGame), e.once("game/show", this.resize, e.PRIORITY_LOWEST), e.on("game/destroy", this.destroy), e.on("game/update", this.checkResize)
        }
        return S.prototype.addCustomBlendModes = function(t) {
            t.state ? t.state.blendModes[20] = [t.gl.SRC_ALPHA, t.gl.DST_ALPHA] : t.blendModes && (t.blendModes[20] = "lighter"), PIXI.BLEND_MODES.ADD_PIXI_V3 = 20
        }, S.prototype.createMetaTag = function() {
            if (!a.isIEMobile()) {
                var t = o.createElement("meta");
                t.setAttribute("name", "viewport");
                var e = s.getMetaInitialScale();
                t.setAttribute("content", "minimal-ui,width=device-width,height=device-height,initial-scale=" + e + ",maximum-scale=" + e + ",user-scalable=0"), o.getElementsByTagName("head")[0].appendChild(t)
            }
        }, S.prototype.applyCSSScaleClass = function() {
            (a.isAndroid() && a.isTopFrame() || !a.isTopFrame() && !s.isReplayMode() || s.isReplayFromIframeGame()) && u.addClass(o.body, "cssScale")
        }, S.prototype.applyLanguageClass = function() {
            u.addClass(o.body, "lang_" + s.language)
        }, S.prototype.createPreloader = function() {
            this.stage.removeChildren();
            var t = new n;
            return this.stage.addChild(t)
        }, S.prototype.createSplashScreen = function() {
            if (this.addGameName(), g.isSplashScreenAvailable() && g.showSplashScreen) {
                this.stage.removeChildren();
                var t = new f;
                return this.stage.addChild(t)
            }
            e.emit("game/show")
        }, S.prototype.showGame = function() {
            this.stage.removeChildren(), this.root = this.createGame(), this.root.onResize(), a.isTopFrame() || m.resumeContext(), this.resize()
        }, S.prototype.addGameName = function() {
            t.getLicense().hasComplianceBar() && o.body.insertBefore(u.toHTML(y.get("gameName.html", {
                gameName: s.getFormatedGameName()
            })), o.body.firstChild)
        }, S.prototype.createGame = function() {
            var t = s.showMobileUI ? new p : new h;
            return this.stage.addChildAt(t, 0)
        }, S.prototype.update = function(t) {
            e.emit("game/update", t / 1e3), o.hidden ? this.root && this.root.updateTransform() : this.renderer.render(this.stage)
        }, S.prototype.getView = function() {
            return this.renderer.view
        }, S.prototype.checkResize = function() {
            this._prevWindowSize.innerWidth === c.innerWidth && this._prevWindowSize.innerHeight === c.innerHeight || (this.resize(), this._prevWindowSize.innerWidth = c.innerWidth, this._prevWindowSize.innerHeight = c.innerHeight)
        }, S.prototype.resize = function() {
            var t = this.getCanvasSize();
            t.width === this.renderer.width && t.height === this.renderer.height || (this.renderer.resize(t.width, t.height), e.emit("game/resize")), this.addMarginForGameName()
        }, S.prototype.addMarginForGameName = function() {
            var t = u.byId("game");
            t && (t.style.marginTop = this.getGameNameOffset() + "px")
        }, S.prototype.getCanvasSize = function() {
            var t = s.getScaleFactor();
            return {
                width: c.innerWidth * t,
                height: (c.innerHeight - this.getGameNameOffset()) * t
            }
        }, S.prototype.getGameNameOffset = function() {
            var t = u.byId("gameNameContainer"),
                e = 0;
            return t && (e = t.clientHeight), e
        }, S.prototype.destroy = function() {
            e.off("game/update", this.checkResize), this.root = null, this.stage.removeChildren(), this.renderer && (this.renderer.destroy(!0), this.renderer = null), this.requestFrame.disable()
        }, S
    }), _d("@$&", ["@$%", "@#$", "@@", ")", "^!", "#", ")*", "@$^", "@#*", "^"], function(e, n, i, o, s, r, a, h, t, p) {
        function u() {}
        return u.prototype.init = function() {
            i.errorLogEnabled && Raven && this.setUpSentry();
            var t = new h,
                e = t.isNotSupportedMobileBrowser() ? "messageWindowNotSupportedAlert.html" : null;
            this.createGame(), t.isSupported ? r.emit("preloader/start") : new a({
                message: t.reason,
                template: e
            })
        }, u.prototype.setUpSentry = function() {
            Raven.config("https://d705493f39e34a828a00452d362348eb@sentry.io/231912").install(), Raven.setUserContext({
                id: i.getUserName()
            }), Raven.setExtraContext({
                appsrv: i.baseURL,
                staticURL: i.baseStaticURL,
                sessionId: i.sessionId,
                currency: i.currency,
                language: i.language,
                organization: i.organization,
                gameId: i.gameId,
                gameName: i.getFormatedGameName(),
                showMobileUI: i.showMobileUI,
                license: t.getLicense().name
            }), r.on("spin/dataLoaded", function() {
                Raven.setExtraContext({
                    wagerID: p.hasData() ? p.getWagerId() : null
                })
            })
        }, u.prototype.createGame = function() {
            PIXI.settings.PRECISION_FRAGMENT = s.isIOS() ? PIXI.PRECISION.HIGH : PIXI.PRECISION.MEDIUM, PIXI.settings.MIPMAP_TEXTURES = !1;
            var t = new e;
            t.getView().id = "game", i.game = t, i.showMobileUI ? o.addClass(n.body, "mobile") : s.isTablet() && o.addClass(n.body, "tablet"), n.body.appendChild(t.getView())
        }, u.prototype.dispose = function() {
            n.body.removeChild(n.getElementById("game"))
        }, u
    }), _d("@$*", ["@$@"], function(e) {
        var n = PIXI.glCore.GLTexture.prototype.upload;
        PIXI.glCore.GLTexture.prototype.upload = function(t) {
            e.isUnsigned565 && e.isUnsigned565(t.src || "") ? (this.format = this.gl.RGB, this.type = this.gl.UNSIGNED_SHORT_5_6_5) : e.isUnsigned5551 && e.isUnsigned5551(t.src || "") && (this.type = this.gl.UNSIGNED_SHORT_5_5_5_1), n.call(this, t)
        }
    }), _d("*^", ["$$", "!"], function(e, t) {
        "use strict";
        function n() {
            t.bindAll(this)
        }
        return n.prototype.onReadyStateChange = function(t) {
            if (t) {
                var e = t.target;
                4 === e.readyState && (200 === e.status ? this.callback(null, e.responseText, e) : this.callback(!0, e.responseText, e), this.callback = null)
            }
        }, n.prototype.parseData = function(t) {
            return e.parseParams(t)
        }, n.prototype.get = function(t, e, n, i) {
            this.callback = i;
            var o = new XMLHttpRequest;
            o.onreadystatechange = this.onReadyStateChange, o.open("GET", t + "?" + this.parseData(e), !0), this.addHeaders(o, n), o.send()
        }, n.prototype.post = function(t, e, n, i) {
            this.callback = i;
            var o = new XMLHttpRequest;
            o.onreadystatechange = this.onReadyStateChange, o.open("POST", t, !0), this.addHeaders(o, n), o.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), o.send(this.parseData(e))
        }, n.prototype.addHeaders = function(t, e) {
            for (var n in e)
                t.setRequestHeader(n, e[n])
        }, n
    }), _d("%(", [")", "!", "#", "(@", "$", "(#", "$#"], function(n, e, t, i, o, s, r) {
        "use strict";
        function a(t) {
            e.bindAll(this), this.options = t, this.popup = this.createPopup(), this.closeButton = this.popup.getElementsByClassName("close")[0], t.hideClose || i.onClick(this.closeButton, this.closePopup)
        }
        return a.prototype.createPopup = function() {
            var t = s.get("iFrame.html", this.options),
                e = n.toHTML(t);
            return document.body.appendChild(e), this.options.customLoadHandler ? r.onIframeLoaded = this.hideLoading : document.body.getElementsByTagName("iframe")[0].onload = this.hideLoading, e
        }, a.prototype.closePopup = function() {
            document.body.removeChild(this.popup), this.options.onClose && this.options.onClose()
        }, a.prototype.hideLoading = function() {
            this.options.onLoad ? this.options.onLoad() : (n.byClass("loadingTextWrapper")[0].style.display = "none", document.body.getElementsByTagName("iframe")[0].style.visibility = "visible")
        }, a
    }), _d("@$(", ["#@"], function(t) {
        "use strict";
        return function() {
            this.title = "", this.content = "", this.channel = "BOTH", this.buttons = [{
                label: t.get("operator_message_button_close"),
                action: function() {},
                hideWindow: !0
            }]
        }
    }), _d("@$)", ["#@", "@$(", "^#"], function(e, n, t) {
        "use strict";
        function i(t) {
            n.call(this), "bede.show-message" === t.type && this.isValidData(t) && (this.content = t.message[0].text, this.channel = "MOBILE", this.addRedirectButton(t))
        }
        return t.extend(i, n), i.prototype.isValidData = function(t) {
            return !!t.message && !!t.message[0].text
        }, i.prototype.addRedirectButton = function(t) {
            t.message[1] && t.message[1].url && this.buttons.unshift({
                label: e.get("operator_message_button_terms"),
                actionType: "REDIRECT",
                url: t.message[1].url
            })
        }, i
    }), _d("@%!", ["#", "#@", "%*", "@$)"], function(i, t, e, n) {
        "use strict";
        function o(t) {
            this.operatorOrigin = this.getOperatorOrigin(t.url), this.operator = t.operator, this.iframe = this.initComponent(t.url), this.converters = {
                bede: n
            }
        }
        return o.prototype.getOperatorOrigin = function(t) {
            var e = t.indexOf("//") + "//".length,
                n = t.slice(e).indexOf("/");
            return t.slice(0, e + n)
        }, o.prototype.initComponent = function(t) {
            var e = document.createElement("iframe");
            return e.src = t, e.height = 0, e.style.display = "none", window.addEventListener("message", this.onIframeEvent.bind(this)), document.body.appendChild(e)
        }, o.prototype.onIframeEvent = function(t) {
            if (this.isValidEvent(t)) {
                var e = JSON.parse(t.data),
                    n = new this.converters[this.operator](e);
                i.emit("iframe/parseOperatorMessage", "iframe", n)
            }
        }, o.prototype.isValidEvent = function(t) {
            return t.origin === this.operatorOrigin && e.isJsonString(t.data)
        }, o
    }), _d("@%@", ["^#"], function(t) {
        "use strict";
        function e(t, e) {
            PIXI.Container.call(this), this.container = new PIXI.Container, this.addChild(this.container), this.prefix = t, this.params = e || {}, this.params.offset = this.params.offset || 0, this.params.spaceOffset = this.params.spaceOffset || 10, this._text = "", this.anchor = new PIXI.ObservablePoint(this.onAnchorChanged, this, 0, 0), this.textWidth = 0, this._blendMode = PIXI.BLEND_MODES.NORMAL
        }
        return t.extend(e, PIXI.Container), e.prototype.removeUnusedChildren = function(t) {
            for (; this.container.children.length > t;)
                this.container.removeChildAt(0)
        }, e.prototype.updateText = function(t) {
            for (var e = 0, n = 0, i = 0; i < t.length; i++) {
                var o = t.charAt(i);
                if (" " !== o) {
                    i >= this.container.children.length ? this.container.addChild(new PIXI.Sprite(this.getTextureForChar(o))) : this.container.getChildAt(n).texture = this.getTextureForChar(o);
                    var s = this.container.getChildAt(n);
                    if (this.params.charsWidth && this.params.charsWidth.hasOwnProperty(o)) {
                        var r = this.params.charsWidth[o];
                        s.x = e + r / 2 - s.width / 2, e += r + this.params.offset
                    } else
                        this.params.fixedWidth ? (s.x = e + this.params.fixedWidth / 2 - s.width / 2, e += this.params.fixedWidth) : (s.x = e, e += s.width + this.params.offset);
                    s.blendMode = this.blendMode, n++
                } else
                    e += this.params.spaceOffset
            }
            this.textWidth = e
        }, e.prototype.getTextureForChar = function(t) {
            return PIXI.Texture.fromFrame(this.prefix + t + ".png")
        }, Object.defineProperty(e.prototype, "text", {
            get: function() {
                return this._text
            },
            set: function(t) {
                this._text = t.toString(), this.removeUnusedChildren(this._text.replace(/ /g, "").length), this.updateText(this._text.replace(/ /g, "")), this.updateContainer()
            }
        }), e.prototype.updateContainer = function() {
            this.container.x = -this.textWidth * this.anchor.x, this.container.y = -this.container.height * this.anchor.y
        }, e.prototype.onAnchorChanged = function() {
            this.updateContainer()
        }, Object.defineProperty(e.prototype, "blendMode", {
            get: function() {
                return this._blendMode
            },
            set: function(t) {
                if (t !== this._blendMode) {
                    this._blendMode = t;
                    for (var e = 0, n = this.container.children.length; e < n; ++e)
                        this.container.children[e].blendMode = t
                }
            }
        }), e
    }), _d("@%%", ["^#", "@%#", "!", "@%$", "#"], function(t, n, i, e, o) {
        "use strict";
        function s(t, e) {
            PIXI.Container.apply(this, arguments), i.bindAll(this), this.clipFrame = e, this.clip = null, this.image = this.createImage(t), o.on("texture/loadedToTextureCache", this.onTextureLoaded, o.PRIORITY_LOWEST), this.onTextureLoaded()
        }
        return t.extend(s, PIXI.Container), s.fromFrames = function(t, e) {
            return new s(t, e)
        }, s.prototype.createImage = function(t) {
            return this.addChild(PIXI.Sprite.fromFrame(t))
        }, s.prototype.createClip = function(t) {
            var e = n.fromFrames(t);
            return e.anchor = this.image.anchor, this.addChild(e)
        }, s.prototype.onTextureLoaded = function() {
            e.hasTexture(this.clipFrame) && (this.clip = this.getOrCreateClip(this.clipFrame), this.removeChild(this.image), o.off("texture/loadedToTextureCache", this.onTextureLoaded), this.emit("clip/loaded"))
        }, s.prototype.getOrCreateClip = function(t) {
            return this.clip || this.createClip(t)
        }, Object.defineProperty(s.prototype, "anchor", {
            get: function() {
                return this.clip ? this.clip.anchor : this.image.anchor
            },
            set: function(t) {
                this.image.anchor = t, this.clip && (this.clip.anchor = t)
            }
        }), s.prototype.play = function(t) {
            this.clip && this.clip.play(t || {})
        }, s.prototype.stop = function() {
            this.clip && this.clip.stop()
        }, s
    }), _d("@%&", ["@$@", "@%^"], function(h, p) {
        "use strict";
        return function(n, i) {
            if (!n.data || n.type !== PIXI.loaders.Resource.TYPE.JSON || !n.data.frames)
                return i();
            var t = h.getFileWithoutVersion(n.url),
                o = h.getAnimationsAsMap()[t];
            if (!o)
                return i();
            var s = new PIXI.spine.core.TextureAtlas;
            for (var e in n.textures)
                if (n.textures.hasOwnProperty(e)) {
                    var r = e.substring(e.lastIndexOf("/") + 1, e.lastIndexOf(".png"));
                    s.addTexture(r, n.textures[e])
                }
            var a = function(e) {
                var t = h.getFile(o[e]);
                this.add(t, {
                    parentResource: n
                }, function(t) {
                    p.SPINE_DATA[o[e]] = t.spineData, ++e === o.length ? i() : a(e)
                }.bind(this)), this.resources[t].metadata = {
                    spineAtlas: s
                }
            }.bind(this);
            a(0)
        }
    }), _d("@%*", ["@$@"], function(h) {
        "use strict";
        return function(t, e) {
            if (!t.data || t.type !== PIXI.loaders.Resource.TYPE.JSON || !t.data.frames)
                return e();
            for (var n = h.getBitmapFonts(), i = 0, o = function(t) {
                    0 == --i && e()
                }, s = 0; s < n.length; s++)
                if (n[s]) {
                    var r = n[s].spritesheet;
                    if (t.data.frames[r]) {
                        i++;
                        var a = h.getFile(n[s].font);
                        this.add(a, {
                            xhrType: "document",
                            parentResource: t
                        }, o)
                    }
                }
            return 0 === i ? e() : void 0
        }
    }), _d("@%(", ["#", "@$@", "@%$", "@@"], function(d, f, g, t) {
        "use strict";
        return function(c, t) {
            if (c.type !== PIXI.loaders.Resource.TYPE.IMAGE || "png" !== c.extension || l())
                return t();
            function l() {
                var t,
                    e,
                    n,
                    i,
                    o,
                    s,
                    r,
                    a,
                    h = (n = c.url, i = n.indexOf("."), o = n.lastIndexOf("."), s = n.substring(o), r = n.indexOf("@0.5x"), a = n.substring(0, i), -1 !== n.indexOf("@0.5x") && (a = n.substring(0, r + "@0.5x".length)), a + s),
                    p = f.spritesheetFramesCollection[h],
                    u = (e = !1, (t = p) && t.length && (e = t.every(function(t) {
                        return g.hasTexture(t)
                    })), e);
                return u && (d.off("game/update", l), d.emit("texture/loadedToTextureCache", h), delete f.spritesheetFramesCollection[h], p = null), u
            }
            d.on("game/update", l), t()
        }
    }), _d("@^!", ["^#", "@%)", "#"], function(t, e, n) {
        "use strict";
        function i() {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.addLazy = function(t) {
            this.asset = t, this.events = this.getEvents(this.asset.event), this.addHandler(), this.onComplete.once(this.onCompleted, this), this.add(t.file)
        }, i.prototype.getEvents = function(t) {
            return "string" == typeof t ? [{
                name: t
            }] : t
        }, i.prototype.addHandler = function() {
            this.events.forEach(function(t) {
                var e = void 0 === t.priority ? 10 * n.PRIORITY_HIGHEST : t.priority;
                n.on(t.name, this.onEvent, e, !0)
            }.bind(this))
        }, i.prototype.removeHandler = function() {
            this.events.forEach(function(t) {
                n.off(t.name, this.onEvent)
            }.bind(this))
        }, i.prototype.onEvent = function(t) {
            this.asset && this.asset.condition() ? this.done = t : t()
        }, i.prototype.onCompleted = function() {
            this.removeAllListeners(), this.removeHandler(), this.done && (this.done(), this.done = null), this.asset = null
        }, i
    }), _d("@%)", ["!", "^#", "@^@", "@%(", "@^#", "@$@", "@%*", "@^$", "@^%", "@%&"], function(t, e, n, i, o, s, r, a, h, p) {
        "use strict";
        function u() {
            t.bindAll(this), PIXI.loaders.Loader.apply(this, arguments), this.pre(h), this.use(r), this.use(o), this.use(a), this.use(p), this.use(i), this.useFirst(n)
        }
        return e.extend(u, PIXI.loaders.Loader), u.prototype.useFirst = function(t) {
            return this._afterMiddleware.unshift(t), this
        }, u.prototype.add = function() {
            for (var t = 0; t < arguments.length; t++)
                "string" == typeof arguments[t] && (arguments[t] = s.getResolutionFile(arguments[t]));
            PIXI.loaders.Loader.prototype.add.apply(this, arguments)
        }, u
    }), _d("@^%", ["$#", "@@"], function(t, e) {
        "use strict";
        var i = {};
        t.ASSETS_CACHE = i;
        var o = {};
        return e.isInnerClient() && (o = t.parent.ASSETS_CACHE), function(e, t) {
            if (o[e.url]) {
                var n = o[e.url];
                e.isJson = n.isJson, e.isImage = n.isImage, e.isXml = n.isXml, e.data = n.data, e.load = function(t) {
                    t(e)
                }
            } else
                e.onComplete.once(function() {
                    e.data && e.data.skeleton || (i[this.url] = this)
                }, this);
            t()
        }
    }), _d("@^$", ["@$@"], function(i) {
        "use strict";
        return function(t, e) {
            if (t.data && (t.data.meta && t.data.meta.jupiter || t.data.isParticleConfig)) {
                var n = i.getFileWithoutVersion(t.name).substring(t.name.lastIndexOf("/") + 1);
                jupiter.cache.add(n, t.data)
            }
            e()
        }
    }), _d("@^#", ["@@", "@^^", "#", "@$@"], function(t, e, i, o) {
        "use strict";
        return function(t, e) {
            if (!t.texture)
                return e();
            delete PIXI.utils.TextureCache[t.url];
            var n = o.getFileWithoutVersion(t.url);
            PIXI.utils.TextureCache[n] = t.texture, i.emit("texture/loaded", n), e()
        }
    }), _d("@^@", ["@$@"], function(n) {
        "use strict";
        return function(t, e) {
            if (!t.data || t.type !== PIXI.loaders.Resource.TYPE.JSON || !t.data.frames)
                return e();
            t.data.meta.image = n.getResolutionFile(t.data.meta.image), t.data.meta.scale = parseFloat(t.data.meta.scale), n.spritesheetFramesCollection["images/" + t.data.meta.image] = Object.keys(t.data.frames), e()
        }
    }), _d("@^&", ["^&", "@@"], function(e, t) {
        "use strict";
        function n() {
            this.translations = {}
        }
        return n.prototype.get = function(t) {
            return this.has(t) ? (arguments[0] = this.translations[t].replace(/\\n/g, "\n"), e.substitute.apply(null, arguments)) : null
        }, n.prototype.has = function(t) {
            return this.translations.hasOwnProperty(t)
        }, n.prototype.set = function(t, e) {
            this.leaveHTMLTags(t) ? this.translations[t] = e : this.translations[t] = e.replace(/<\/?[^>]+(>|$)/g, "")
        }, n.prototype.leaveHTMLTags = function(t) {
            return 0 <= t.indexOf("_html") || 0 === t.indexOf("gameRules") || 0 === t.indexOf("infoPages_")
        }, n
    }), _d("@^*", [], function() {
        "use strict";
        function t() {
            this.MAX_BET_CLICKED = "MBtnClk", this.PROGRESS_CHANGED = "PrChd", this.ARROW_CLICKED = "ArClk", this.MODEL_SET_DEFAULT_BET = "DefB", this.MODEL_SET_LAST_SELECTED_BET = "LSelB", this.MODEL_SET_MAX_BET = "SetMB", this.BET_CHANGED = "BetChd", this.BET_PANEL_SET_SELECTED_INDEX = "BPanl", this.SET_MIN_TOTAL_BET = "MinTB", this.SET_TOTAL_BET = "TB", this.GET_REPLAY_REQUEST = "ReplReq", this.GET_RESTORE_REQUEST = "RestReq", this.REPLAY_SET_NEXT_WAGER = "ReplNexWgr", this.SWIPE_MENU_ON_BET_SELECTED = "SwMenuSet", this.SWIPE_MENU_TOOGLE = "SwMenuTgl", this.SWIPE_MENU_BUTTON = "SwMenuBtnClk", this.SHOW_CURRENCY = "CurrChd", this.MAX_BET_WINDOW = "MBetWnd", this.MAX_BET_WINDOW_CONFIRMATION = "MBetWndCfrm", this.log = ""
        }
        return t.prototype.add = function() {
            this.log += Array.prototype.slice.call(arguments).join(",") + "/"
        }, t.prototype.getLog = function() {
            return 200 < this.log.length ? "$$" + this.log.substr(this.log.length - 200) : this.log
        }, t.prototype.clear = function() {
            this.log = ""
        }, t
    }), _d("^$", ["^#", "!", "@#^"], function(t, e, n) {
        "use strict";
        function i() {
            n.call(this), e.bindAll(this)
        }
        return t.extend(i, n), i.prototype.property = function(n, t) {
            var i;
            Object.defineProperty(this, n, {
                get: function() {
                    return i
                },
                set: function(t) {
                    if (i !== t) {
                        var e = i;
                        i = t, this.emit(n + "/changed", e)
                    }
                }
            }), void 0 !== t && (this[n] = t)
        }, i
    }), _d("@%#", ["^#", "@%$"], function(t, e) {
        "use strict";
        function n() {
            PIXI.extras.AnimatedSprite.apply(this, arguments)
        }
        return t.extend(n, PIXI.extras.AnimatedSprite), n.fromFrames = function(t) {
            return new n(e.getTextures(t))
        }, n.prototype.play = function(t) {
            this.steps = Array.prototype.slice.call(arguments);
            for (var e = 0; e < this.steps.length; e++)
                this.steps[e].iteration = 1, void 0 === this.steps[e].times && (this.steps[e].times = 1), !0 === this.steps[e].loop && (this.steps[e].times = 1 / 0), this.steps[e].from < 0 && (this.steps[e].from = this.totalFrames + this.steps[e].from), void 0 === this.steps[e].to && (this.steps[e].to = -1), this.steps[e].to < 0 && (this.steps[e].to = this.totalFrames + this.steps[e].to);
            this.playing = !0
        }, n.prototype.stop = function() {
            this.playing = !1
        }, n.prototype.update = function(t) {
            this.playing && this.getNextFrame(t) && PIXI.extras.AnimatedSprite.prototype.update.call(this, t)
        }, n.prototype.updateTransform = function() {
            this.playing && this.update(1), PIXI.extras.AnimatedSprite.prototype.updateTransform.call(this)
        }, n.prototype.getNextFrame = function(t) {
            if (!this.steps || 0 === this.steps.length)
                return !0;
            var e = this.steps[0];
            if (void 0 === e.from || e.begin) {
                void 0 === e.from && (e.from = this.currentFrame, e.begin = !0);
                var n = (e.reverse ? e.from : e.to) - this.currentFrame < 0 ? -1 : 1;
                this._currentTime += this.animationSpeed * t * n
            } else
                this._currentTime = e.from, e.begin = !0;
            var i = this.currentFrame;
            if (i === e.to || i === e.from && e.reverse)
                if (e.yoyo && !e.reverse)
                    e.reverse = !0;
                else if (e.iteration++, e.iteration > e.times) {
                    if (e.onComplete && e.onCompleteParams ? setTimeout(function() {
                        e.onComplete.apply(null, e.onCompleteParams)
                    }, 0) : e.onComplete && setTimeout(e.onComplete, 0), e.removeOnComplete && setTimeout(this.removeFromParent.bind(this), 0), this.steps.shift(), 0 === this.steps.length)
                        return this.gotoAndStop(this.currentFrame), !1
                } else
                    e.reverse ? e.reverse = !1 : e.begin = !1;
            return this.playing && (this._currentTime -= this.animationSpeed * t), !0
        }, n.prototype.removeFromParent = function() {
            this.parent && this.parent.removeChild(this)
        }, n.prototype.gotoAndStop = function(t) {
            this.stop(), this._currentTime = t, this.updateTexture()
        }, n
    }), _d("@^(", [], function() {
        "use strict";
        function t(t, e, n) {
            this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), this.currentBlendMode = PIXI.BLEND_MODES.NORMAL, this.resolution = n, this.resize(t * n, e * n), this.initPlugins()
        }
        return PIXI.utils.pluginTarget.mixin(t), t.registerPlugin("sprite", PIXI.CanvasSpriteRenderer), t.prototype.resize = function(t, e) {
            this.canvas.width = 0 | t, this.canvas.height = 0 | e
        }, t.prototype.render = function(t) {
            t._renderCanvas(this)
        }, t.prototype.setBlendMode = function(t) {}, t.prototype.getAlphaAt = function(t, e) {
            var n = this.getPixelDataAt(t, e);
            return n ? this.extractAlpha(n) : 0
        }, t.prototype.getPixelDataAt = function(t, e) {
            return this.isInside(t, e) ? this.context.getImageData(0 | t, 0 | e, 1, 1).data : null
        }, t.prototype.isInside = function(t, e) {
            return 0 <= t && t < this.getWidth() && 0 <= e && e < this.getHeight()
        }, t.prototype.getWidth = function() {
            return this.canvas.width
        }, t.prototype.getHeight = function() {
            return this.canvas.height
        }, t.prototype.extractAlpha = function(t) {
            if (t)
                return t[3]
        }, t.prototype.getPixels = function() {
            return this.context.getImageData(0, 0, this.getWidth(), this.getHeight()).data
        }, t.prototype.getAlphaBuffer = function() {
            for (var t = this.getPixels(), e = this.getWidth(), n = this.getHeight(), i = new Array(e), o = 0; o < e; ++o)
                for (var s = i[o] = new Array(n), r = 0; r < n; ++r)
                    s[r] = t[4 * (o + r * this.getWidth()) + 3];
            return i
        }, t
    }), _d("@&#", ["!", "#", "(", ")", "@@", "^", "%&", "@^)", "@&!", "#)", "$&", "@&@", "$!"], function(e, t, n, i, o, s, r, a, h, p, u, c, l) {
        "use strict";
        function d(t) {
            e.bindAll(this), this.emit = t, this.operatorListenersMap = this.addOperatorListeners()
        }
        return d.prototype.addOperatorListeners = function() {
            return {
                "splashScreen/skip": this.onOperatorSplashScreenSkip,
                "intro/skip": this.onOperatorIntroVideoSkip,
                "bet/setMinBet": this.onOperatorSetMinBet,
                "spin/init": this.onOperatorSpinInit,
                "restore/skip": this.onOperatorSkipRestore,
                "game/pause": this.onOperatorPauseGame,
                "game/resume": this.onOperatorResumeGame,
                "game/close": this.onOperatorCloseGame,
                "balance/update": this.onOperatorUpdateBalance,
                "audio/unmute": this.onOperatorEnableAudio,
                "audio/mute": this.onOperatorDisableAudio,
                "realityCheck/resume": this.onOperatorRealityCheckResume,
                "autospin/stop": this.onOperatorAutoSpinStop,
                "gameRules/open": this.onOperatorHelpPage,
                "get/events/input": this.onOperatorGetInputEvents,
                "get/rewatchLink": this.onOperatorGetRewatchLink,
                "game/sessionClose": this.onOperatorGameSessionClose
            }
        }, d.prototype.getGameEvents = function() {
            return {
                "splashScreen/show": this.getGameEvent("splashScreen/ready"),
                "videoIntroController/videoStarted": this.getGameEvent("intro/ready"),
                "game/show": this.getGameEvent("game/ready"),
                "restore/popupShown": this.getGameEvent("restore/ready"),
                "spin/start": this.getGameEvent(null, this.onGameSpinStart),
                "spin/end": this.getGameEvent("spin/end"),
                "spin/definiteEnd": this.getGameEvent("gameRound/end"),
                "request/onLowBalance": this.getGameEvent("spin/lowBalance"),
                "spin/error": this.getGameEvent("spin/error"),
                "load/error": this.getGameEvent("game/loadingError"),
                "request/error": this.getGameEvent("request/error"),
                "realityCheck/showMessage": this.getGameEvent("realityCheck/show"),
                "preloader/show": this.getGameEvent("preloader/show"),
                "deposit/show": this.getGameEvent("deposit/show"),
                "home/press": this.getGameEvent("home/press"),
                "game/lastSessionClose": this.getGameEvent("game/sessionClosed")
            }
        }, d.prototype.getGameEvent = function(t, e) {
            return {
                name: t,
                callback: e
            }
        }, d.prototype.getOperatorListener = function(t) {
            return this.operatorListenersMap[t]
        }, d.prototype.onGameSpinStart = function() {
            var t = ["gameRound/start", "spin/start"];
            return this.isFirstSpinOfTheWager() && this.emit(t[0]), this.emit(t[1]), t
        }, d.prototype.onOperatorGetInputEvents = function() {
            this.emit({
                event: "input/events",
                data: Object.keys(this.operatorListenersMap)
            })
        }, d.prototype.onOperatorSplashScreenSkip = function() {
            t.emit("splashScreen/destroy"), t.emit("game/show")
        }, d.prototype.onOperatorIntroVideoSkip = function() {
            t.emit("slotsIframeMessenger/skipIntro")
        }, d.prototype.onOperatorSetMinBet = function() {
            p.bet = p.getMinBet()
        }, d.prototype.onOperatorSpinInit = function() {
            this.canSpin() ? n.hud.spinButton ? n.hud.spinButton.simulateClick() : n.root.spinPanel && n.root.spinPanel.spinButton && n.root.spinPanel.spinButton.simulateClick() : this.emit({
                event: "spin/init",
                status: "rejected",
                purpose: "Game is not idle"
            })
        }, d.prototype.onOperatorSkipRestore = function() {
            t.emit("restore/forceSkip")
        }, d.prototype.onOperatorPauseGame = function() {
            o.stage.interactive = !1, o.stage.interactiveChildren = !1, o.game.requestFrame.disable()
        }, d.prototype.onOperatorResumeGame = function() {
            o.stage.interactive = !0, o.stage.interactiveChildren = !0, o.game.requestFrame.enable()
        }, d.prototype.onOperatorCloseGame = function() {
            window.location.href = "/"
        }, d.prototype.onOperatorUpdateBalance = function() {
            (new a).run()
        }, d.prototype.onOperatorEnableAudio = function() {
            r.enabled = !0
        }, d.prototype.onOperatorDisableAudio = function() {
            r.enabled = !1
        }, d.prototype.onOperatorRealityCheckResume = function() {
            t.emit("realityCheck/resume")
        }, d.prototype.onOperatorAutoSpinStop = function() {
            l.isDuringAutoSpins && t.emit("autospin/stop")
        }, d.prototype.onOperatorHelpPage = function() {
            t.emit("popup/open", {
                content: h
            })
        }, d.prototype.onOperatorGetRewatchLink = function(t) {
            this.emit({
                event: "rewatch/link",
                data: u.getOperatorLink(t.data.wagerId, t.data.gameId)
            })
        }, d.prototype.onOperatorGameSessionClose = function() {
            new c(this.onLastSessionCloseConfirmed).run()
        }, d.prototype.onLastSessionCloseConfirmed = function() {
            this.emit("game/sessionClosed")
        }, d.prototype.canSpin = function() {
            return !(7324 === o.gameId || 7312 === o.gameId || !n.machine.visible || n.machine.alpha < 1 || !n.hud.visible || n.hud.alpha < 1 || null !== i.byId("messageWindow"))
        }, d.prototype.isFirstSpinOfTheWager = function() {
            return !s.hasData() || !!((o.isReplayMode() || o.isRewatch()) && s.currentBet < 0)
        }, d
    }), _d("@&$", ["@&#", "^#"], function(e, t) {
        "use strict";
        function n(t) {
            e.call(this, t)
        }
        return t.extend(n, e), n.prototype.getGameEvents = function() {
            var t = e.prototype.getGameEvents.call(this);
            return t["request/onLowBalance"] = this.getGameEvent("balanceTooLow"), t["preloader/show"] = this.getGameEvent("gameLoadingStarted"), t["splashScreen/show"] = this.getGameEvent("gameLoadingEnded"), t["deposit/show"] = this.getGameEvent("showQuickDeposit"), t["spin/error"] = this.getGameEvent("notifyCloseContainer"), t["load/error"] = this.getGameEvent("notifyCloseContainer"), t["spin/definiteEnd"] = this.getGameEvent("gameRoundEnded"), t["realityCheck/showMessage"] = this.getGameEvent("realityCheck"), t["home/press"] = this.getGameEvent("notifyCloseContainer"), t
        }, n.prototype.addOperatorListeners = function() {
            var t = e.prototype.addOperatorListeners.call(this);
            return delete t["game/pause"], t.pauseGame = this.onOperatorPauseGame, delete t["game/resume"], t.resumeGame = this.onOperatorResumeGame, delete t["game/close"], t.closeGame = this.onOperatorCloseGame, delete t["balance/update"], t.updateBalance = this.onOperatorUpdateBalance, delete t["audio/unmute"], t.enableAudio = this.onOperatorEnableAudio, delete t["audio/mute"], t.disableAudio = this.onOperatorDisableAudio, t
        }, n.prototype.onGameSpinStart = function() {
            var t = ["gameRoundStarted", "spin/start"];
            return this.isFirstSpinOfTheWager() && this.emit(t[0]), this.emit(t[1]), t
        }, n
    }), _d("@&%", ["@&#", "^#"], function(e, t) {
        "use strict";
        function n(t) {
            e.call(this, t)
        }
        return t.extend(n, e), n
    }), _d("@#(", ["!", "@$", "$#"], function(e, n, i) {
        "use strict";
        function o(t) {
            e.bindAll(this), this.func = t, this.FPS = o.getDefaultFPS(), this.INTERVAL = 1e3 / this.FPS, this.then = Date.now(), this.enabled = !0, this.useRAF(!0)
        }
        return o.getDefaultFPS = function() {
            return 30
        }, o.prototype.useRAF = function(t) {
            this.request = t ? function(t) {
                return i.requestAnimationFrame(t)
            } : function(t) {
                n(t, 1 / this.FPS)
            }, this.update()
        }, o.prototype.update = function() {
            if (this.enabled) {
                this.request(this.update);
                var t = Date.now(),
                    e = t - this.then;
                e >= this.INTERVAL && (this.then = t - e % this.INTERVAL, this.func(e))
            }
        }, o.prototype.disable = function() {
            this.enabled = !1
        }, o.prototype.enable = function() {
            this.enabled = !0, this.update()
        }, o
    }), _d("@&^", [], function() {
        "use strict";
        function t(t) {
            this.pool = [], this.borrowed = [], this.creator = t
        }
        return t.prototype.restoreAll = function() {
            this.borrowed.forEach(this.reset), this.pool = this.pool.concat(this.borrowed), this.borrowed.length = 0
        }, t.prototype.restore = function(t) {
            this.pool.indexOf(t) < 0 && 0 <= this.borrowed.indexOf(t) && (this.reset(t), this.pool.push(t), this.borrowed.splice(this.borrowed.indexOf(t), 1))
        }, t.prototype.reset = function(t) {
            t instanceof PIXI.DisplayObject && (t.position.detach(), t.scale.detach())
        }, t.prototype.get = function() {
            var t;
            return t = this.pool.length ? this.pool.pop() : this.create(), this.borrowed.push(t), t
        }, t.prototype.create = function() {
            return this.creator.create(this)
        }, t
    }), _d("@&&", ["!", "@&^"], function(e, n) {
        "use strict";
        function t(t) {
            e.bindAll(this), this.pools = {}, this.typeCreator = t
        }
        return t.prototype.restoreAll = function() {
            for (var t in this.pools)
                this.pools.hasOwnProperty(t) && this.pools[t].restoreAll()
        }, t.prototype.restore = function(t) {
            this.pools[t.type].restore(t)
        }, t.prototype.getByType = function(t) {
            var e = this.pools[t];
            return e || (e = new n(this.typeCreator.create.apply(this.typeCreator, arguments)), this.pools[t] = e), e.get()
        }, t
    }), _d("@&*", ["@@"], function(n) {
        "use strict";
        return function(t) {
            if (n.sendYggdrasilMetrics) {
                t.org = n.organization, t.origin = window.location.origin, t.gameId = n.gameId, t.sessionId = n.sessionId;
                var e = new XMLHttpRequest;
                e.open("POST", "https://gamestat.yggdrasilgaming.com/api/v1/", !0), e.setRequestHeader("Content-type", "application/json"), e.send(JSON.stringify(t))
            }
        }
    }), _d("@&(", ["#"], function(r) {
        "use strict";
        return function(e, n) {
            var i = TweenMax.ticker.time,
                o = Array.prototype.slice.call(arguments, 2),
                t = 0,
                s = function() {
                    var t = [TweenMax.ticker.time - i].concat(o);
                    e.apply(null, t) && (r.off("game/update", s), n.apply(null, t))
                };
            return s.pause = function() {
                r.off("game/update", s), t = TweenMax.ticker.time
            }, s.resume = function() {
                i += TweenMax.ticker.time - t, r.on("game/update", s)
            }, r.on("game/update", s), s
        }
    }), _d("@&)", [], function() {
        "use strict";
        return function(t, e) {
            var n = 0,
                i = TweenMax.ticker.time,
                o = Array.prototype.slice.call(arguments, 2),
                s = function() {
                    n += TweenMax.ticker.time - i, i = TweenMax.ticker.time, e <= n && (n -= e, t.apply(null, o))
                };
            return TweenMax.ticker.addEventListener("tick", s), s
        }
    }), _d("@$", [], function() {
        "use strict";
        return function(t, e) {
            return TweenMax.delayedCall(e, t, Array.prototype.slice.call(arguments, 2))
        }
    }), _d("@%^", ["^#"], function(t) {
        "use strict";
        function e(t) {
            this._onCompleteListener = null, this._onEventListener = null, this._onStartListener = null, this._onEndListener = null, PIXI.spine.Spine.call(this, e.SPINE_DATA[t])
        }
        return t.extend(e, PIXI.spine.Spine), e.SPINE_DATA = {}, e.prototype.play = function(t, e) {
            this.state.setAnimation(0, t, !1), this.speed = 1, e && (this.onComplete = e)
        }, e.prototype.loop = function(t, e) {
            this.state.setAnimation(0, t, !0), e && (this.onComplete = e)
        }, e.prototype.pause = function() {
            this.speed = 0
        }, e.prototype.resume = function() {
            this.speed = 1
        }, e.prototype.setProgress = function(t) {
            1 !== (t = Math.abs(t)) && (t %= 1), this.time = this.duration * t, this.update(0)
        }, e.prototype.setSlotAlpha = function(t, e) {
            var n = this.skeleton.findSlot(t);
            n && (n.color.a = e)
        }, e.prototype.gotoAndPause = function(t, e) {
            this.play(t), 0 < e && this.setProgress(e), this.pause()
        }, e.prototype.reverseImmediate = function(t) {
            this.reverse(t, this.time)
        }, e.prototype.playBackwards = function(t, e) {
            var n;
            t && (n = this.state.setAnimation(0, t, !1).animation.duration), n = n || this.duration, this.reverse(e, n)
        }, e.prototype.reverse = function(t, e) {
            e === Number.MAX_VALUE && (e %= this.duration), t && (this.onComplete = t), this.time = e - .001, this.update(0), this.speed = -1
        }, e.prototype.update = function() {
            PIXI.spine.Spine.prototype.update.apply(this, arguments), this.time < 0 && (this.time = 0, this.update(0), this.speed = 0, this.onComplete && this.onComplete.complete && this.onComplete.complete())
        }, Object.defineProperty(e.prototype, "onComplete", {
            get: function() {
                return this._onCompleteListener
            },
            set: function(t) {
                this._onCompleteListener && this.state.removeListener(this._onCompleteListener), t && (this._onCompleteListener = {
                    complete: t
                }, this.state.addListener(this._onCompleteListener))
            }
        }), Object.defineProperty(e.prototype, "onEvent", {
            get: function() {
                return this._onEventListener
            },
            set: function(t) {
                this._onEventListener && this.state.removeListener(this._onEventListener), t && (this._onEventListener = {
                    event: t
                }, this.state.addListener(this._onEventListener))
            }
        }), Object.defineProperty(e.prototype, "onStart", {
            get: function() {
                return this._onStartListener
            },
            set: function(t) {
                this._onStartListener && this.state.removeListener(this._onStartListener), t && (this._onStartListener = {
                    start: t
                }, this.state.addListener(this._onStartListener))
            }
        }), Object.defineProperty(e.prototype, "onEnd", {
            get: function() {
                return this._onEndListener
            },
            set: function(t) {
                this._onEndListener && this.state.removeListener(this._onEndListener), t && (this._onEndListener = {
                    end: t
                }, this.state.addListener(this._onEndListener))
            }
        }), Object.defineProperty(e.prototype, "time", {
            get: function() {
                return this.track.trackTime
            },
            set: function(t) {
                this.track.trackTime = t
            }
        }), Object.defineProperty(e.prototype, "speed", {
            get: function() {
                return this.state.timeScale
            },
            set: function(t) {
                this.state.timeScale = t
            }
        }), Object.defineProperty(e.prototype, "duration", {
            get: function() {
                return this.track.animation.duration
            },
            set: function(t) {
                this.track.animation.duration = t
            }
        }), Object.defineProperty(e.prototype, "track", {
            get: function() {
                return this.state.tracks[0] || {}
            }
        }), e
    }), _d("@*!", ["%*", "@^(", "&%"], function(n, i, o) {
        "use strict";
        var s = new PIXI.Point;
        function t(t, e) {
            this.visible = !1, this.scale = new PIXI.Point, this.initialize(t, e)
        }
        return t.prototype.initialize = function(t, e) {
            this.parentSprite = t, this.options = this.mergeWithDefaultOptions(e), this.alphaBuffer = this.createAlphaBuffer()
        }, t.prototype.createAlphaBuffer = function() {
            var t = this.createSprite(this.getTexture()),
                e = this.createOffScreenBuffer(t.width, t.height);
            return e.render(t), e.getAlphaBuffer()
        }, t.prototype.update = function(t, e) {
            t = t || this.parentSprite, this.initialize(t, e)
        }, t.prototype.mergeWithDefaultOptions = function(t) {
            var e = this.getDefaultOptions();
            return t && n.mixin(e, t), e
        }, t.prototype.getDefaultOptions = function() {
            return {
                minimalAlpha: 128,
                resolution: .5,
                texture: null
            }
        }, t.prototype.getTexture = function() {
            return this.options.texture || this.parentSprite.texture
        }, t.prototype.createSprite = function(t) {
            return new PIXI.Sprite(t)
        }, t.prototype.createOffScreenBuffer = function(t, e) {
            return new i(t, e, this.options.resolution)
        }, t.prototype.getTextureWidth = function() {
            return this.getTextureFrame().width
        }, t.prototype.getTextureHeight = function() {
            return this.getTextureFrame().height
        }, t.prototype.getTextureFrame = function() {
            return this.getTexture().frame
        }, t.prototype.contains = function(t, e) {
            return !!this.containsPointInSprite(this.parentSprite, t, e) && this.containsPointInNonTransparentArea(t, e)
        }, t.prototype.containsPointInSprite = function(t, e, n) {
            return s.set(e, n), t.worldTransform.apply(s, s), t.containsPoint(s)
        }, t.prototype.containsPointInNonTransparentArea = function(t, e) {
            return s.set(t, e), this.applyAnchorFromSprite(this.parentSprite, s), this.getAlphaAtPosition(s) > this.options.minimalAlpha
        }, t.prototype.getAlphaAtPosition = function(t) {
            var e = o.clamp(t.x * this.options.resolution | 0, 0, this.alphaBuffer.length - 1),
                n = o.clamp(t.y * this.options.resolution | 0, 0, this.alphaBuffer[e].length - 1);
            return this.alphaBuffer[e][n]
        }, t.prototype.applyAnchorFromSprite = function(t, e) {
            return e.x += t.width * t.anchor.x, e.y += t.height * t.anchor.y, e
        }, t
    }), _d("@*@", ["*^", "^#"], function(t, e) {
        "use strict";
        function n() {
            t.apply(this, arguments)
        }
        return e.extend(n, t), n.prototype.get = function(t, e, n, i) {
            this.callback = i;
            var o = new XMLHttpRequest;
            o.onreadystatechange = this.onReadyStateChange, o.open("GET", t + "?" + this.parseData(e), !1), this.addHeaders(o, n), o.send()
        }, n.prototype.post = function(t, e, n, i) {
            this.callback = i;
            var o = new XMLHttpRequest;
            o.onreadystatechange = this.onReadyStateChange, o.open("POST", t, !1), this.addHeaders(o, n), o.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), o.send(this.parseData(e))
        }, n
    }), _d("@*#", [], function() {
        "use strict";
        function t() {
            this.templates = window.TEMPLATES
        }
        return t.prototype.get = function(t, e) {
            var n = this.templates[t];
            if (!n)
                throw new Error("Template '" + t + "' not found.");
            return Mustache.render(decodeURIComponent(n), e)
        }, t
    }), _d("@*&", ["@*$", "@*%", "@*^"], function(i, t, e) {
        "use strict";
        function n(t, e, n) {
            this.cachedElements = {}, this.layout = new i(t), this.screenSize = {
                x: 0,
                y: 0
            }, this.nearestLayouts = null, this.calculateForScreenSize(e, n)
        }
        return n.prototype.forceRecalculation = function() {
            if (this.nearestLayouts = this.layout.createNearestAspectRatioTemplatesForScreenSize(this.screenSize.x, this.screenSize.y), this.nearestLayouts.hasBothTemplates())
                this.calculator = new t(this.nearestLayouts, this.screenSize);
            else {
                if (!this.nearestLayouts.hasLeftTemplate())
                    throw new Error("Couldn't find any template");
                this.calculator = new e(this.nearestLayouts, this.screenSize)
            }
            this.recalculateCachedElements()
        }, n.prototype.calculateForScreenSize = function(t, e) {
            var n = this.screenSize.x !== t || this.screenSize.y !== e || !this.calculator;
            this.screenSize.x = t, this.screenSize.y = e, n && this.forceRecalculation()
        }, n.prototype.recalculateCachedElements = function() {
            for (var t in this.cachedElements)
                this.cachedElements.hasOwnProperty(t) && this.calculateCachedElement(t)
        }, n.prototype.calculateCachedElement = function(t) {
            if (this.nearestLayouts.hasElement(t)) {
                var e = this.cachedElements[t];
                return this.calculateElement(e), e
            }
            throw new Error("Element <" + t + "> is not available in the current layout")
        }, n.prototype.calculateElement = function(t) {
            this.calculator.calculate(t)
        }, n.prototype.get = function(t) {
            if (this.isElementInCache(t))
                return this.getElementFromCache(t);
            if (this.nearestLayouts.hasElement(t)) {
                var e = this.createCachedElement(t);
                return this.calculateElement(e), e
            }
            throw new Error("Element <" + t + "> is not available in the current layout")
        }, n.prototype.isElementInCache = function(t) {
            return !!this.cachedElements[t]
        }, n.prototype.createCachedElement = function(t) {
            var e = this.cachedElements[t];
            return e || (e = this.cachedElements[t] = {
                position: {
                    x: 0,
                    y: 0
                },
                size: {
                    x: 0,
                    y: 0
                },
                name: t
            }), e
        }, n.prototype.getElementFromCache = function(t) {
            return this.cachedElements[t]
        }, n
    }), _d("@*^", [], function() {
        "use strict";
        function t(t, e) {
            this.nearestLayouts = t, this.screenSize = e, this.aspectRatio = this.screenSize.x / this.screenSize.y
        }
        return t.prototype.calculate = function(t) {
            var e = this.nearestLayouts.getLeftTemplate(),
                n = t.name,
                i = e.elements[n],
                o = e.screen.size.x / e.screen.size.y,
                s = this.aspectRatio / o;
            t.position.x = i.position.x * s, t.position.y = i.position.y * s, t.size.x = i.size.x * s, t.size.y = i.size.y * s, this.applyScale(t, e)
        }, t.prototype.applyScale = function(t, e) {
            var n;
            n = 1 < this.aspectRatio ? this.screenSize.y / e.screen.size.y : this.screenSize.x / e.screen.size.x, t.position.x *= n, t.position.y *= n, t.size.x *= n, t.size.y *= n
        }, t
    }), _d("@*%", [], function() {
        "use strict";
        function t(t, e) {
            this.nearestLayouts = t, this.screenSize = e, this.aspectRatio = this.screenSize.x / this.screenSize.y
        }
        return t.prototype.calculate = function(t) {
            var e = t.name,
                n = this.nearestLayouts.getLeftTemplate(),
                i = this.nearestLayouts.getRightTemplate(),
                o = n.elements[e],
                s = i.elements[e];
            if (n.screen.size.x !== i.screen.size.x && n.screen.size.y !== i.screen.size.y)
                throw new Error("At least size.x or size.y of the template dimensions in both templates has to be equal!");
            var r = n.screen.size.x / n.screen.size.y,
                a = i.screen.size.x / i.screen.size.y,
                h = (this.aspectRatio - r) / (a - r);
            t.position.x = this.lerp(o.position.x, s.position.x, h), t.position.y = this.lerp(o.position.y, s.position.y, h), t.size.x = this.lerp(o.size.x, s.size.x, h), t.size.y = this.lerp(o.size.y, s.size.y, h), this.applyScale(t, n)
        }, t.prototype.applyScale = function(t, e) {
            var n;
            n = 1 < this.aspectRatio ? this.screenSize.y / e.screen.size.y : this.screenSize.x / e.screen.size.x, t.position.x *= n, t.position.y *= n, t.size.x *= n, t.size.y *= n
        }, t.prototype.lerp = function(t, e, n) {
            return (e - t) * n + t
        }, t
    }), _d("@**", [], function() {
        "use strict";
        function t(t, e) {
            this.left = t, this.right = e
        }
        return ((t.prototype = Object.create(null)).constructor = t).prototype.set = function(t, e) {
            this.left = t, this.right = e
        }, t.prototype.getLeftTemplate = function() {
            return this.left
        }, t.prototype.getRightTemplate = function() {
            return this.right
        }, t.prototype.hasBothTemplates = function() {
            return this.left && this.right
        }, t.prototype.hasLeftTemplate = function() {
            return !!this.left
        }, t.prototype.hasRightTemplate = function() {
            return !!this.right
        }, t.prototype.hasElement = function(t) {
            if (this.hasBothTemplates())
                return this.left.elements.hasOwnProperty(t) && this.right.elements.hasOwnProperty(t);
            if (this.hasLeftTemplate())
                return this.left.elements.hasOwnProperty(t);
            throw new Error("There is no template!")
        }, t
    }), _d("@*$", ["@**", "^!"], function(s, e) {
        "use strict";
        function n(t) {
            this.layoutTemplates = t, this.screenSize = {
                x: 0,
                y: 0
            }, this.aspectRatio = 0
        }
        return n.LANDSCAPE = "landscape", n.PORTRAIT = "portrait", n.prototype.createNearestAspectRatioTemplatesForScreenSize = function(t, e) {
            return this.setScreenSize(t, e), this.createNearestAspectRatioTemplates()
        }, n.prototype.setScreenSize = function(t, e) {
            this.screenSize.x = t, this.screenSize.y = e, this.aspectRatio = t / e
        }, n.prototype.createNearestAspectRatioTemplates = function() {
            var t = this.getOrientation(),
                e = this.layoutTemplates[t],
                n = this.createAndSortAspectRatioTable(e);
            return this.createNearestAspectRatioTemplatesUsingSortedTemplates(n)
        }, n.prototype.getOrientation = function() {
            var t = n.PORTRAIT;
            return e.isLandscapeMode() && (t = n.LANDSCAPE), this.isOrientationAvailableInLayoutTemplates(t) ? t : this.switchOrientation(t)
        }, n.prototype.isOrientationAvailableInLayoutTemplates = function(t) {
            return this.layoutTemplates.hasOwnProperty(t)
        }, n.prototype.switchOrientation = function(t) {
            return t === n.LANDSCAPE ? n.PORTRAIT : n.LANDSCAPE
        }, n.prototype.createAndSortAspectRatioTable = function(t) {
            var e = this.createAspectRatioTable(t);
            return this.sortAspectRatioTable(e), e
        }, n.prototype.createAspectRatioTable = function(t) {
            var e = [];
            for (var n in t)
                if (t.hasOwnProperty(n)) {
                    var i = t[n],
                        o = i.screen.size.x / i.screen.size.y;
                    e.push({
                        aspectRatio: o,
                        template: i
                    })
                }
            if (0 === e.length)
                throw new Error("At least one template has to be defined!");
            return e
        }, n.prototype.sortAspectRatioTable = function(t) {
            return t.sort(function(t, e) {
                var n = t.aspectRatio - e.aspectRatio;
                if (0 === n)
                    throw new Error("At least two templates have the same aspect ratio!");
                return n
            })
        }, n.prototype.createNearestAspectRatioTemplatesUsingSortedTemplates = function(t) {
            var e = null,
                n = null;
            if (this.hasJustOneTemplate(t))
                e = t[0].template;
            else if (this.isScreenAspectRatioLowerThanAspectRatioInAllTemplates(t))
                e = t[0].template, n = t[1].template;
            else if (this.isScreenAspectRatioHigherThanAspectRatioInAllTemplates(t))
                e = t[t.length - 2].template, n = t[t.length - 1].template;
            else
                for (var i = 0; i < t.length; ++i) {
                    var o = t[i];
                    if (!(this.aspectRatio > o.aspectRatio)) {
                        n = o.template;
                        break
                    }
                    e = o.template
                }
            return new s(e, n)
        }, n.prototype.hasJustOneTemplate = function(t) {
            return t.length < 2
        }, n.prototype.isScreenAspectRatioLowerThanAspectRatioInAllTemplates = function(t) {
            return this.aspectRatio <= t[0].aspectRatio
        }, n.prototype.isScreenAspectRatioHigherThanAspectRatioInAllTemplates = function(t) {
            return this.aspectRatio >= t[t.length - 1].aspectRatio
        }, n
    }), _d("@*(", ["@*&"], function(o) {
        "use strict";
        function t(t, e, n, i) {
            this.elements = t, this.calculator = new o(e, n, i), this.applyLayoutToElements()
        }
        return t.prototype.forceRecalculation = function() {
            this.calculator.forceRecalculation(), this.applyLayoutToElements()
        }, t.prototype.resize = function(t, e) {
            this.calculator.calculateForScreenSize(t, e), this.applyLayoutToElements()
        }, t.prototype.applyLayoutToElements = function() {
            for (var t in this.elements)
                if (this.elements.hasOwnProperty(t)) {
                    var e = this.calculator.get(t),
                        n = this.elements[t];
                    this.applyLayoutToElement(e, n)
                }
        }, t.prototype.applyLayoutToElement = function(t, e) {
            e.applyLayout(t)
        }, t.prototype.getLayoutElement = function(t) {
            return this.elements[t]
        }, t
    }), _d("@*)", [], function() {
        "use strict";
        function t(t) {
            this.setPixiElement(t)
        }
        return t.prototype.setPixiElement = function(t) {
            this._element = t, this._width = t.width, this._height = t.height
        }, t.prototype.applyLayout = function(t) {
            this._element.position.x = t.position.x, this._element.position.y = t.position.y, this._element.width = this._width * t.size.y / this._height, this._element.height = t.size.y
        }, t
    }), _d("@(!", [], function() {
        "use strict";
        function t(t, e) {
            this.fitInHeight = !!e, this.setPixiElement(t)
        }
        return t.prototype.setPixiElement = function(t) {
            this._element = t, this._width = t.width, this._height = t.height, this._wordWrapWidth = t.style.wordWrapWidth
        }, t.prototype.applyLayout = function(t) {
            this._element.position.x = t.position.x, this._element.position.y = t.position.y;
            var e = t.size.x / this._wordWrapWidth;
            this._element.width = this._width * e, this._element.height = this._height * e, this.fitInHeight && this._element.height > t.size.y && (e = t.size.y / this._element.height, this._element.width = this._element.width * e, this._element.height = this._element.height * e)
        }, t
    }), _d("@(#", ["^#", "!", "@@", "@%$", "@$@", "@(@", "^!"], function(t, i, e, o, s, n, r) {
        "use strict";
        function a(t, e, n) {
            i.bindAll(this), this.displayVideo() ? (PIXI.Sprite.call(this, o.getTexture(n)), this.videoTexture = this.getTexture(t), this.spinner = this.createSpinner()) : PIXI.Sprite.call(this, o.getTexture(e))
        }
        return t.extend(a, PIXI.Sprite), a.prototype.displayVideo = function() {
            return e.isDesktop && a.canPlayVideo()
        }, a.prototype.getTexture = function(t) {
            return PIXI.Texture.fromVideo(a.createVideoElement(t, this.onStartPlaying))
        }, a.canPlayVideo = function() {
            return !(r.isOpera() && r.isWindows()) && document.createElement("video").canPlayType("video/mp4")
        }, a.createVideoElement = function(t, e) {
            var n = document.createElement("video");
            return n.oncanplay = e, n.preload = "auto", n.loop = !0, n.autoplay = !0, n.src = s.getFile(t), n
        }, a.prototype.onStartPlaying = function() {
            this.removeChild(this.spinner), this.texture = this.videoTexture
        }, a.prototype.createSpinner = function() {
            var t = new n("images/splash_screen/spinner.png");
            return t.scale.set(.5, .5), this.addChild(t)
        }, a
    }), _d("@(^", ["!", "$#", "@($", "#", "^!", "@(%", "@$", "@%"], function(t, e, i, n, o, s, r, a) {
        "use strict";
        function h() {
            t.bindAll(this), n.once("game/show", this.onGameShow, n.PRIORITY_HIGHEST)
        }
        return h.prototype.autoAlign = function() {
            i.startRotationX && (i.startRotationX = i.rotationX + .99 * (i.startRotationX - i.rotationX)), i.startRotationY && (i.startRotationY = i.rotationY + .99 * (i.startRotationY - i.rotationY))
        }, h.prototype.onGameShow = function() {
            this.parallaxEffect = new s, this.reset(), n.on("game/update", this.autoAlign), n.on("game/update", this.updateParallaxLayers, n.PRIORITY_HIGHEST), n.on("game/resize", this.reset, n.PRIORITY_HIGHEST), n.on("orientation/changed", this.reset, n.PRIORITY_HIGHEST), e.ondevicemotion = this.onDeviceMotion
        }, h.prototype.reset = function() {
            this.pauseParallax(), i.rotationX = 0, i.rotationY = 0, i.startRotationX = void 0, i.startRotationY = void 0, this.parallaxEffect.resetLayers(), a(this.resetTimeout), this.resetTimeout = r(this.resetParallaxLayers, .3)
        }, h.prototype.resetParallaxLayers = function() {
            this.parallaxEffect.setParallaxLayers(), this.parallaxEffect.hasLayers() && this.resumeParallax()
        }, h.prototype.onDeviceMotion = function(t) {
            this.defineInitRotation(t);
            var e = this.getTiltXFromOrientation(t),
                n = this.getTiltYFromOrientation(t);
            i.rotationX = e * i.getDeviceDirection(!0), i.rotationY = n * i.getDeviceDirection()
        }, h.prototype.defineInitRotation = function(t) {
            void 0 === i.startRotationX && (i.startRotationX = this.getTiltXFromOrientation(t) * i.getDeviceDirection(!0)), void 0 === i.startRotationY && (i.startRotationY = this.getTiltYFromOrientation(t) * i.getDeviceDirection())
        }, h.prototype.getTiltXFromOrientation = function(t) {
            var e = o.isLandscapeMode() ? t.accelerationIncludingGravity.y : t.accelerationIncludingGravity.x;
            return -(e *= i.getOrientationFactor()) / 9.82 * Math.PI / 2
        }, h.prototype.getTiltYFromOrientation = function(t) {
            var e = o.isLandscapeMode() ? t.accelerationIncludingGravity.x : t.accelerationIncludingGravity.y;
            return -(e *= i.getOrientationFactor()) / 9.82 * Math.PI / 2
        }, h.prototype.updateParallaxLayers = function() {
            i.update && this.parallaxEffect.updateParallaxLayers()
        }, h.prototype.pauseParallax = function() {
            i.update = !1
        }, h.prototype.resumeParallax = function() {
            i.update = !0
        }, h
    }), _d("@((", ["#", "!", "@(&", "$!", "$^", "@(*", "*"], function(t, e, i, n, o, s, r) {
        "use strict";
        function a() {
            e.bindAll(this), n.on("isDuringAutoSpins/changed", this.refresh)
        }
        return a.prototype.refresh = function() {
            n.isDuringAutoSpins ? this.turnOn() : this.turnOff()
        }, a.prototype.turnOn = function() {
            t.on("spin/definiteEnd", this.onSpinDefiniteEnd, t.PRIORITY_HIGH), t.on("freespins/enter", this.onEnterFreespinsMode), i.updateCashTresholds(), i.onStopLossDiffrenceChanged()
        }, a.prototype.turnOff = function() {
            t.off("spin/definiteEnd", this.onSpinDefiniteEnd), t.off("freespins/enter", this.onEnterFreespinsMode)
        }, a.prototype.onEnterFreespinsMode = function() {
            i.stopIfFreespinsMode && this.stopAutoSpins()
        }, a.prototype.onSpinDefiniteEnd = function() {
            this.stopAfterWin() ? this.stopAutoSpins() : this.stopAfterCashChanged() && (i.updateCashTresholds(), this.stopAutoSpins())
        }, a.prototype.stopAutoSpins = function() {
            t.emit("autospin/stop")
        }, a.prototype.stopAfterWin = function() {
            var t = this.getLastWin(),
                e = 0 === i.stopThresholdIfWin && 0 < t,
                n = 0 < i.stopThresholdIfWin && t >= i.stopThresholdIfWin;
            return i.stopAfterWin && (e || n)
        }, a.prototype.getLastWin = function() {
            return s.lastWin
        }, a.prototype.stopAfterCashChanged = function() {
            return this.stopBecauseCashDecrease() || this.stopBecauseCashIncrease() || this.stopBecauseOfStopLoss()
        }, a.prototype.stopBecauseCashDecrease = function() {
            return i.stopIfCashDecrease && s.balance <= i.stopThresholdIfDecrease
        }, a.prototype.stopBecauseOfStopLoss = function() {
            return i.stopLoss && s.balance < i.stopLossThreshold + r.totalBet
        }, a.prototype.stopBecauseCashIncrease = function() {
            return i.stopIfCashIncrease && s.balance >= i.stopThresholdIfIncrease
        }, a
    }), _d("@)!", ["!", "#", "@^^", "$!", "@@", "@()"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            t.bindAll(this), e.on("autospin/init", this.onAutoSpinInit), e.on("autospin/start", this.onAutoSpinStart), e.on("autospin/stop", this.onStop)
        }
        return r.prototype.onAutoSpinInit = function(t) {
            o.isLossLimitEnabled() && !o.showNewMobileUI ? this.displayAutoSpinWindow(t) : this.dispatchAutoSpinStart(t)
        }, r.prototype.displayAutoSpinWindow = function(t) {
            new s(t, function() {
                this.dispatchAutoSpinStart(t)
            }.bind(this))
        }, r.prototype.dispatchAutoSpinStart = function(t) {
            e.emit("autospin/start", t)
        }, r.prototype.onAutoSpinStart = function(t) {
            i.previousAutoSpinsIndex = i.getIndexOfSpins(t), i.autoSpinsLeft = t, n.isIdle() && this.runAutoSpin(), e.on("spin/definiteEnd", this.runAutoSpin, e.PRIORITY_LOWEST)
        }, r.prototype.runAutoSpin = function() {
            n.isIdle() && (0 < i.autoSpinsLeft ? (i.autoSpinsLeft--, e.emit("spin/begin")) : (e.emit("autospin/end"), e.off("spin/definiteEnd", this.runAutoSpin)))
        }, r.prototype.onStop = function() {
            i.autoSpinsLeft = 0
        }, r
    }), _d("@)#", ["!", "#", "@(*", "^", "$!", "$^", "@$", "@@", "@", "@)@"], function(t, e, n, i, o, s, r, a, h, p) {
        "use strict";
        function u() {
            t.bindAll(this), this.UPDATE_BALANCE_DELAY = .5, this.CLEAR_WIN_TIMEOUT = .5, e.on("restore/skip", this.onWinPresentationEnd), e.on("balance/update", this.onWinPresentationEnd), e.on("winPresentation/end", this.onWinPresentationEnd), e.on("spin/dataLoaded", this.onDataLoaded, e.PRIORITY_LOWEST)
        }
        return u.prototype.onWinPresentationEnd = function() {
            i.isLastSmallSpin() && (this.updateBalanceAfterWinPresentation(), e.once("spin/start", this.clearWin))
        }, u.prototype.onDataLoaded = function() {
            s.showAccumulatedWin() || n.setLastWin(0, !1, 0), 0 < s.getLastWin() && (s.isSmallWin() ? e.once("winPopup/countUpFinished", this.updateWinAfterWinPresentation) : e.once("winPopup/finished", this.updateWinAfterWinPresentation))
        }, u.prototype.updateWinAfterWinPresentation = function() {
            n.setLastWin(s.getLastWin(), !0)
        }, u.prototype.shouldShowFlyingBalance = function() {
            var t = h.hasPromoSpin() || p.isPromoSpin();
            return i.isLastSmallSpin() && (!a.campaignPayout || !t)
        }, u.prototype.updateBalanceAfterWinPresentation = function() {
            var t = 10000;
            0 < t && this.shouldShowFlyingBalance() && (n.setLastWin(t, !1), e.emit("flyingBalance/show")), n.setBalance(this.getBalance(), !0, this.UPDATE_BALANCE_DELAY)
        }, u.prototype.getBalance = function() {
            return a.isReplayMode() && !p.hasReplayWager() ? p.getFinalBalance() : i.getBalance()
        }, u.prototype.clearWin = function() {
            e.off("winPopup/countUpFinished", this.updateWinAfterWinPresentation), e.off("winPopup/finished", this.updateWinAfterWinPresentation), n.setLastWin(0, !1, this.CLEAR_WIN_TIMEOUT)
        }, u
    }), _d("@)$", ["^!", "!", "#", ")*", "#@", "@@"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            e.bindAll(this), t.isIE() && !s.isReplayMode() && n.on("game/show", this.onGameShow, -1)
        }
        return r.prototype.onGameShow = function() {
            new i({
                template: "messageWindowIEAlert.html",
                message: o.get("use_different_browser_message"),
                browserIcons: [{
                    iconClass: "chrome",
                    link: "https://www.google.com/chrome/browser/"
                }, {
                    iconClass: "firefox",
                    link: "https://www.mozilla.org/en-US/firefox/"
                }],
                buttons: [{
                    label: o.get("use_different_browser_button"),
                    hideWindow: !0
                }]
            })
        }, r
    }), _d("@)(", ["^#", "#", "$#", "@)%", "^", "#@", "@)^", "@)&", "(", "@)*", "@@"], function(t, e, n, r, a, i, o, s, h, p, u) {
        "use strict";
        function c() {
            e.on("spin/end", this.onSpinEnd.bind(this), e.PRIORITY_HIGHEST + 1e3), this.uuid = Math.round(1e4 * Math.random())
        }
        return c.prototype.onSpinEnd = function() {
            if (0 < a.bets.length)
                for (var t = h.machine.symbolsContainer, e = a.getCurrentEventData(), n = 0; n < r.columns; n++)
                    for (var i = 0; i < r.rows; i++) {
                        var o = t.getSymbol(n, i),
                            s = this.getFinalReels(e);
                        if (o.type !== s[n][i])
                            return void this.displayError({
                                uuid: this.uuid,
                                ver: 10
                            })
                    }
        }, c.prototype.getFinalReels = function(t) {
            return t.reels0 || t.reels
        }, c.prototype.displayError = function(t) {
            s("send", "event", u.getGameName() + "/bug", JSON.stringify(t)), e.emit("spin/error"), p.error(), e.emit("autospin/stop"), new o(this.getErrorMessageWindowOptions())
        }, c.prototype.getErrorMessageWindowOptions = function() {
            return {
                title: i.get("connection_error_title") || "Connection Problem",
                message: i.get("connection_error_message") || "Check your internet connection and try again",
                allowContinue: !1
            }
        }, c
    }), _d("@$^", ["@@", "^!"], function(t, n) {
        "use strict";
        function e() {
            this.isSupported = !0, this.reason = "", this.check()
        }
        return e.OLD_BROWSER = "Your browser version is out of date.<br/>Please update your browser for best user experience.", e.SYSTEM_OUT_OF_DATE = "Your operation system is out of date.<br/>Please update your system for best user experience.", e.SYSTEM_NOT_SUPPORTED = "Your operation system is not supported.<br/>Please use different operating system for best user experience.", e.BROWSER_NOT_SUPPORTED = "Your browser is not supported.<br/>Please use different browser for best user experience.", e.DEVICE_NOT_SUPPORTED = "Your device is not supported.", e.prototype.setNotSupported = function(t) {
            this.isSupported = !1, this.reason = t
        }, e.prototype.check = function() {
            t.isMobile ? this.checkMobile() : this.checkDesktop()
        }, e.prototype.checkMobile = function() {
            this.isOutdatedMobileOS() && this.setNotSupported(e.SYSTEM_OUT_OF_DATE), this.isNotSupportedMobileOS() && this.setNotSupported(e.SYSTEM_NOT_SUPPORTED), this.isNotSupportedMobileBrowser() && this.setNotSupported(e.BROWSER_NOT_SUPPORTED), this.isNotSupportedDevice() && this.setNotSupported(e.DEVICE_NOT_SUPPORTED)
        }, e.prototype.isNotSupportedMobileBrowser = function() {
            return !(!n.isAndroid() || "firefox" !== n.getBrowserData().name)
        }, e.prototype.isOutdatedMobileOS = function() {
            return !!(n.isAndroid() && n.getMobileOSVersion() < 4) || !!(n.isIOS() && n.getMobileOSVersion() < 7)
        }, e.prototype.isNotSupportedMobileOS = function() {
            return !!n.isWindowsPhone()
        }, e.prototype.isNotSupportedDevice = function() {
            return !!IPhoneModelInfo.isModel(IPhoneModelInfo.iPhoneModels.IPHONE_6_PLUS)
        }, e.prototype.checkDesktop = function() {
            this.isNotSupportedDesktopBrowser() && this.setNotSupported(e.OLD_BROWSER)
        }, e.prototype.isNotSupportedDesktopBrowser = function() {
            var t = {
                    chrome: 32,
                    firefox: 33,
                    msie: 11,
                    safari: 537,
                    opera: 26
                },
                e = n.getBrowserData();
            return !t[e.name] || t[e.name] > e.version
        }, e
    }), _d("#!@", ["^!", "!", "#", "@#$", "@))", "@@", "@#*", "#!!"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {
            e.bindAll(this), n.once("game/show", this.onGameShow, n.PRIORITY_LOWEST)
        }
        return h.prototype.onGameShow = function() {
            this.shouldParseSessionIdForReplay() && this.parseSessionIdForReplay(), o.on("gameDetails/changed", this.updateGameDetails), this.updateGameDetails()
        }, h.prototype.updateGameDetails = function() {
            if (o.hasGameDetails()) {
                var t = a.getGameDetails();
                t.hasText() && (i.getElementsByClassName("gameDetails")[0].innerText = t.getText())
            }
        }, h.prototype.shouldParseSessionIdForReplay = function() {
            return r.getLicense().hasSessionAndTicketId() && s.isReplayMode()
        }, h.prototype.parseSessionIdForReplay = function() {
            s.params.gameHistorySessionId && o.parse({
                sessionId: s.params.gameHistorySessionId,
                ticketId: s.params.gameHistoryTicketId
            })
        }, h
    }), _d("#!#", ["!", "#", "%)", "@@", "#@", "%(", "@^)"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a() {
            t.bindAll(this), e.on("deposit/click", this.onDepositClick)
        }
        return a.prototype.onDepositClick = function() {
            "event" === i.depositType ? e.emit("deposit/show") : "self" === i.depositType ? this.showInGameDeposit() : n.goToURL(i.depositURL)
        }, a.prototype.showInGameDeposit = function() {
            var t = {
                src: i.depositURL,
                loadingText: o.get("gameHistory_loadingText"),
                onClose: this.onDepositIFrameClose
            };
            this.iframe = new s(t), window.addEventListener("message", this.onMessage)
        }, a.prototype.onMessage = function(t) {
            switch (t.data.id) {
            case "deposit/close":
                this.iframe.closePopup();
                break;
            case "deposit/redirect":
                n.goToURL(t.data.url);
                break;
            case "deposit/refreshBalance":
                this.refreshBalance()
            }
        }, a.prototype.onDepositIFrameClose = function() {
            this.iframe = null, window.removeEventListener("message", this.onMessage), this.refreshBalance()
        }, a.prototype.refreshBalance = function() {
            (new r).run()
        }, a
    }), _d("#!$", ["@@", ")", "^!", "#", "!", "@$"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            o.bindAll(this), this.LANDSCAPE = 0, this.PORTRAIT = 1, this.orientation = this.getCurrentOrientation(), (t.showMobileUI || n.isIOS() && n.isTablet()) && i.on("splashScreen/show", this.onGameShow)
        }
        return r.prototype.onGameShow = function() {
            this.checkOrientation(), this.addListeners()
        }, r.prototype.getCurrentOrientation = function() {
            return n.isPortraitMode() ? this.PORTRAIT : this.LANDSCAPE
        }, r.prototype.checkOrientation = function(t) {
            this.orientation !== this.getCurrentOrientation() && (this.orientation = this.getCurrentOrientation(), s(function() {
                window.scrollTo(0, 0)
            }, .5), i.emit("orientation/changed"))
        }, r.prototype.addListeners = function() {
            i.on("game/resize", this.checkOrientation)
        }, r
    }), _d("#!*", ["!", "#", "#!%", "#!^", "#!&", "$^", "@@", "^", "@(&", "@)%", "@$", "$!"], function(t, n, i, o, s, e, r, a, h, p, u, c) {
        "use strict";
        function l() {
            t.bindAll(this), n.on("winPresentation/end", this.onWinPresentationEnd, n.PRIORITY_HIGHEST, !0), n.on("spin/stop", this.onSpinStop, 1), n.on("freespins/outroFinished", this.restoreSymbolsFromFirstBet)
        }
        return l.prototype.onWinPresentationEnd = function(t) {
            i.isFirstSpin() ? this.enterFreeSpins(t) : a.isLastSmallSpin() && i.isDuringFreeSpins ? this.exitFreeSpins(t) : t()
        }, l.prototype.enterFreeSpins = function(t) {
            this.showFreeSpinsIntro(t), n.emit("freespins/enter"), i.isDuringFreeSpins = !0
        }, l.prototype.showFreeSpinsIntro = function(t) {
            var e = new o;
            e.play(), n.once("freespins/introFinished", t), r.game.root.machine.addChild(e)
        }, l.prototype.exitFreeSpins = function(t) {
            var e = new s;
            n.once("freespins/outroFinished", function() {
                n.emit("freespins/exit"), i.clear(), t()
            }), r.game.root.machine.addChild(e), this.delayNextSpinDuringAutospin()
        }, l.prototype.delayNextSpinDuringAutospin = function() {
            n.once("spin/definiteEnd", function(t) {
                var e = c.isDuringAutoSpins ? 4 : 0;
                u(t, e)
            }, n.PRIORITY_HIGH, !0)
        }, l.prototype.onSpinStop = function() {
            i.isDuringFreeSpins && this.setMaxSpinSpeed()
        }, l.prototype.restoreSymbolsFromFirstBet = function() {
            e.clear(), p.updateReels(a.getFirstBet()), a.updateFinalReelPositions(a.getFirstBet()), p.forEach(function(t, e, n, i) {
                i.setType(n)
            })
        }, l.prototype.setMaxSpinSpeed = function() {
            for (var t = 0; t < p.columns; t++)
                h.spinSpeed >= this.getMaxSpinSpeed() && (a.columnStopTimes[t] = this.getMaxSpinSpeed())
        }, l.prototype.getMaxSpinSpeed = function() {
            return .5
        }, l
    }), _d("#!)", ["!", "#", "@@", "#!(", "^!"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.bindAll(this), e.on("fullscreen/toggle", this.toggleFullscreen), document.addEventListener("webkitfullscreenchange", this.onFullscreenChange), document.addEventListener("mozfullscreenchange", this.onFullscreenChange), document.addEventListener("fullscreenchange", this.onFullscreenChange), this.autoFullscreenEnter() && (e.once("splashScreen/show", this.enterFullscreenIfDisabled), e.on("spin/begin", this.enterFullscreenIfDisabled))
        }
        return s.prototype.autoFullscreenEnter = function() {
            return !(!n.isMobile || !i.isFullscreenModeAvailable() || o.isIEMobile() || !o.isTopFrame())
        }, s.prototype.onFullscreenChange = function() {
            e.emit("fullscreen/changed")
        }, s.prototype.enterFullscreenIfDisabled = function() {
            i.isFullscreenModeEntered() || i.requestFullscreen()
        }, s.prototype.toggleFullscreen = function() {
            i.isFullscreenModeEntered() ? i.exitFullscreen() : i.requestFullscreen()
        }, s
    }), _d("#@!", ["!", "@@", "@&#", "@&$", "@&%", "^!", "#"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a() {
            t.bindAll(this), this.apiListener = this.getAPIMessenger(), this.addGameListeners(), window.addEventListener("message", this.onMessage)
        }
        return a.prototype.getAPIMessenger = function() {
            var t = {
                BWINSE: i,
                PARTYSE: i,
                Lottomatica: o
            };
            return new (t.hasOwnProperty(e.organization) ? t[e.organization] : n)(this.emitIFrameEvent)
        }, a.prototype.addGameListeners = function() {
            var t = this.apiListener.getGameEvents();
            for (var e in t)
                t.hasOwnProperty(e) && r.on(e, this.onGameEvent.bind(this, t[e]))
        }, a.prototype.onGameEvent = function(t) {
            t.callback ? t.callback() : t.name && this.emitIFrameEvent(t.name)
        }, a.prototype.emitIFrameEvent = function(t) {
            window.parent.postMessage(t, "*")
        }, a.prototype.onMessage = function(t) {
            var e = "string" == typeof t.data ? t.data : t.data.event,
                n = this.apiListener.getOperatorListener(e);
            n ? n(t) : t.source !== window.self && this.emitIFrameEvent({
                event: e,
                status: "rejected",
                purpose: "not supported event"
            })
        }, a
    }), _d("#@@", ["!", "@#$", "$#", "@@", "#", "%&"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            t.bindAll(this), i.isDesktop ? e.addEventListener("visibilitychange", this.onVisibilityChange) : e.addEventListener("visibilitychange", this.onMobileVisibilityChange), i.isInnerClient() && (o.once("game/show", this.onVisibilityChange, o.PRIORITY_LOW), o.once("preloader/show", this.startFakeTimer))
        }
        return r.prototype.onVisibilityChange = function() {
            i.game && (e.hidden ? this.startFakeTimer() : this.stopFakeTimer())
        }, r.prototype.onMobileVisibilityChange = function() {
            i.game && (e.hidden ? s.onGameHidden() : s.onGameShown())
        }, r.prototype.startFakeTimer = function() {
            TweenMax.ticker.useRAF(!1), TweenMax.lagSmoothing(0), i.game.requestFrame.useRAF(!1), n.removeEventListener("message", this.receiveMessage, !1), n.addEventListener("message", this.receiveMessage, !1), this.receiveMessage()
        }, r.prototype.stopFakeTimer = function() {
            TweenMax.ticker.useRAF(!0), TweenMax.lagSmoothing(1e3, 16), i.game.requestFrame.useRAF(!0), n.removeEventListener("message", this.receiveMessage, !1)
        }, r.prototype.receiveMessage = function() {
            TweenMax.ticker.tick(), n.postMessage(JSON.stringify({
                emitter: "InactiveTabController",
                message: ""
            }), "*")
        }, r
    }), _d("#@#", ["!", "@@", "#", "*^", "@&)"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.bindAll(this), n.on("game/show", this.onGameShow)
        }
        return s.prototype.onGameShow = function() {
            this.isKeepAliveEnabled() && this.startKeepAliveInterval()
        }, s.prototype.isKeepAliveEnabled = function() {
            return e.keepAliveInterval && e.keepAliveURL
        }, s.prototype.startKeepAliveInterval = function() {
            o(this.sendKeepAliveRequest, 60 * e.keepAliveInterval)
        }, s.prototype.sendKeepAliveRequest = function() {
            (new i).get(e.keepAliveURL, {}, {}, this.onResult)
        }, s.prototype.onResult = function(t) {}, s
    }), _d("#@$", ["!", "#", "$#", "^!"], function(t, e, n, i) {
        "use strict";
        function o() {
            t.bindAll(this), this.isStoppingAllRequests = !1, this.activeRequests = 0, n.PREVENT_SCREENSAVER = this.preventScreenSaver, this.noSleep = new NoSleep, e.on("autospin/start", this.enableNoSleep), e.on("autospin/stop", this.onAutoSpinStop), e.on("request/start", this.onRequestStart, e.PRIORITY_HIGH, !0), e.on("request/end", this.onRequestEnd), i.isTopFrame() || (e.once("game/show", this.enableNoSleep), e.once("nosleep/enable", this.enableNoSleep))
        }
        return o.prototype.enableNoSleep = function() {
            this.noSleep.enable(4e3)
        }, o.prototype.onAutoSpinStop = function() {
            this.noSleep.disable()
        }, o.prototype.onRequestStart = function(t) {
            this.activeRequests++, this.isStoppingAllRequests ? n.setTimeout(t, 0) : t()
        }, o.prototype.onRequestEnd = function() {
            this.activeRequests--
        }, o.prototype.preventScreenSaver = function() {
            0 !== this.activeRequests || document.hidden || (this.isStoppingAllRequests = !0, n.location.href = "/", n.setTimeout(this.stopAllRequests, 0))
        }, o.prototype.stopAllRequests = function() {
            n.stop(), this.isStoppingAllRequests = !1
        }, o
    }), _d("#@^", ["!", "#", "^", "@^^", "#@%", "@@"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            t.bindAll(this), e.on("machine/click", this.onMachineClick), e.on("spin/dataLoaded", this.onSpinDataLoaded), e.on("spin/end", this.onSpinEnd)
        }
        return r.prototype.onMachineClick = function() {
            e.emit("swipeMenu/hide"), o.allowSkip && e.emit("initialAnimation/skip")
        }, r.prototype.onSpinDataLoaded = function() {
            e.once("machine/click", this.forceStop)
        }, r.prototype.forceStop = function() {
            this.forceStopIsAvailable() && e.emit("spin/forceStop")
        }, r.prototype.onSpinEnd = function() {
            e.off("machine/click", this.forceStop)
        }, r.prototype.forceStopIsAvailable = function() {
            return s.canStopSpin() && !i.isIdle() && !i.isForceStopping()
        }, r
    }), _d("#@*", ["!", "#)", ")*", "#@", "*", "$%", "@@", "#@&", "@", "%@", "#"], function(t, e, n, i, o, s, r, a, h, p, u) {
        "use strict";
        function c() {
            t.bindAll(this), r.isReplayMode() || u.on("game/show", this.onGameShow, u.PRIORITY_HIGH), this.isOpenWindow = !1
        }
        return c.prototype.onGameShow = function() {
            p.hasPendingSpinToRestore() || this.onBetChanged(), e.on("bet/changed", this.onBetChanged)
        }, c.prototype.onBetChanged = function() {
            this.canShowWarningWindow() && this.showWarningWindow()
        }, c.prototype.canShowWarningWindow = function() {
            return e.isMaxBetSelected() && r.isDesktop && !h.hasPromoSpin()
        }, c.prototype.showWarningWindow = function() {
            if (!this.isOpenWindow) {
                var t = {
                    title: "",
                    caption: "",
                    message: i.get("maxBetWarningWindow_text", s.format(o.totalBet)),
                    buttons: [{
                        label: i.get("maxBetWarningWindow_button"),
                        hideWindow: !0,
                        action: function() {
                            a.add(a.MAX_BET_WINDOW_CONFIRMATION)
                        }
                    }],
                    autoclose: !1,
                    onHideComplete: this.onHideWarningWindow
                };
                a.add(a.MAX_BET_WINDOW), new n(t), this.isOpenWindow = !0
            }
        }, c.prototype.onHideWarningWindow = function() {
            this.isOpenWindow = !1
        }, c
    }), _d("#@)", ["!", "#", "@@", "^", "#@("], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.bindAll(this), this.SPINS_AMOUNT_TO_SEND = 10, e.on("spin/begin", this.onSpinBegin), e.on("orientation/changed", this.onOrientationChanged), this.onOrientationChanged()
        }
        return s.prototype.onOrientationChanged = function() {
            o.setOrientation()
        }, s.prototype.onSpinBegin = function() {
            i.hasNextSpin() || n.isReplayMode() || (o.changeMobileSpinsAmount(), o.getTotalMobileSpinsAmount() % this.SPINS_AMOUNT_TO_SEND == 0 && (ga("send", "timing", "orientation/" + o.PORTRAIT, n.getGameId(), o.getPortraitSpinsAmount()), o.clear()))
        }, s
    }), _d("##!", ["!", "@@", "@$@", "%&", "#", "@@*"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            t.bindAll(this), this.loadMusic(), o.once("splashScreen/show", this.onPreloaderComplete)
        }
        return r.prototype.loadMusic = function() {
            i.loadAll(n.getMusic(), this.onExtraSoundsLoaded)
        }, r.prototype.onPreloaderComplete = function() {
            this.preloaderComplete = !0, this.onGameShow()
        }, r.prototype.onExtraSoundsLoaded = function() {
            this.musicLoaded = !0, this.onGameShow()
        }, r.prototype.startMusic = function() {
            s.play("sounds/music.mp3", !0, !0)
        }, r.prototype.onGameShow = function() {
            this.musicLoaded && this.preloaderComplete && (e.isAudioDisabledAtStart() ? i.once("globalVolume/changed", this.startMusic) : this.startMusic())
        }, r.prototype.fadeIn = function(t, e) {
            var n = e || 1;
            t && TweenMax.to(t, n, {
                volume: 1,
                ease: Linear.easeNone
            })
        }, r.prototype.fadeOut = function(t, e) {
            var n = e || 1;
            t && TweenMax.to(t, n, {
                volume: 0,
                ease: Linear.easeNone
            })
        }, r.prototype.playMusic = function(t, e) {
            if (this.currentMusic !== t) {
                var n = e || 1;
                this.currentMusic && TweenMax.to(this.currentMusic, n, {
                    volume: 0,
                    onComplete: this.currentMusic.pause
                }), t.volume = 0, t.play(), TweenMax.to(t, n, {
                    volume: 1
                }), this.currentMusic = t
            }
        }, r
    }), _d("###", ["!", "#", "##@"], function(t, e, n) {
        "use strict";
        function i() {
            t.bindAll(this), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("unload", this.onUnload)
        }
        return i.prototype.onBeforeUnload = function() {
            this.emitDestroy()
        }, i.prototype.onUnload = function() {
            this.emitDestroy()
        }, i.prototype.emitDestroy = function() {
            n.shouldDestroyOnUnload() && e.emit("game/destroy")
        }, i
    }), _d("##$", ["#", "!", "@@", ")", "@$", "@%"], function(n, t, i, o, e, s) {
        "use strict";
        function r() {
            t.bindAll(this), this.currentPopup = null, this.scaleOnMobile = !1, this.pagination = !1, n.on("popup/open", this.showPopup), n.on("popup/close", this.hidePopup), n.on("game/resize", this._onResize)
        }
        return r.prototype.hidePopup = function() {
            this.removeHTML(), n.emit("popup/hide"), this.currentPopup && this.currentPopup.instance.dispose && this.currentPopup.instance.dispose(), this.currentPopup = null
        }, r.prototype.createSwiper = function() {
            var t = new Swiper(".swiper-container", {
                direction: "horizontal",
                loop: !0,
                pagination: this.pagination ? ".swiper-pagination" : "",
                paginationClickable: !0,
                simulateTouch: !1
            });
            return n.on("orientation/changed", this.resizeSwiper), t
        }, r.prototype.showPopup = function(t) {
            var e = !this.currentPopup || this.currentPopup.content !== t.content;
            this.currentPopup && !t.keepOpen && this.hidePopup(), e && ((this.currentPopup = t).instance = new t.content, this.pagination = t.pagination, this.scaleOnMobile = t.scaleOnMobile, this.removeHTML(), this.addHTML(t.instance), t.instance.swiper = this.swiper, n.emit("popup/show", t), this.onResize())
        }, r.prototype._onResize = function() {
            this.onResize(), s(this.resizeTimeout), this.resizeTimeout = e(this.onResize, .2)
        }, r.prototype.onResize = function() {
            if (this.currentHTML) {
                var t = i.game.root.machine.scale.x,
                    e = this.currentHTML.style;
                e.transform = e.webkitTransform = "scale(" + t + "," + t + ") perspective(1px)", e.left = i.game.root.machine.x - this.currentHTML.clientWidth / 2 * t + "px", e.top = i.game.root.machine.y - this.currentHTML.clientHeight / 2 * t + this.getGameNameOffset() + "px", e.visibility = "visible"
            }
        }, r.prototype.addHTML = function(t) {
            var e = o.toHTML("<div id='popup'>" + t.getContent() + "</div>");
            e.style.visibility = "hidden", this.currentHTML = document.body.insertBefore(e, document.body.firstChild), t.onAdded && t.onAdded(), this.swiper = this.createSwiper()
        }, r.prototype.removeHTML = function() {
            this.currentHTML && (document.body.removeChild(this.currentHTML), this.currentHTML = null), n.off("orientation/changed", this.resizeSwiper)
        }, r.prototype.resizeSwiper = function() {
            this.swiper && this.swiper.onResize && e(this.swiper.onResize, 0, null, !0)
        }, r.prototype.getGameNameOffset = function() {
            var t = o.byId("gameNameContainer");
            return t ? t.clientHeight : 0
        }, r
    }), _d("##%", ["^#", "##$"], function(t, e) {
        "use strict";
        function n() {
            e.call(this)
        }
        return t.extend(n, e), n.prototype.addHTML = function() {
            e.prototype.addHTML.apply(this, arguments)
        }, n
    }), _d("##&", ["^#", "##$", ")", "(@", "@@", "##^", "#", "!", "^!", "$!"], function(t, e, n, i, o, s, r, a, h, p) {
        "use strict";
        function u() {
            e.call(this)
        }
        return t.extend(u, e), u.prototype.addHTML = function() {
            this.overlay = this.createOverlay(), e.prototype.addHTML.apply(this, arguments);
            var t = n.toHTML("<div id='popupCloseButton' class='toolbar_button'><div class='mobile_close_icon'></div></div></div>");
            this.popupCloseButton = document.body.insertBefore(t, document.body.firstChild), n.preventMove(this.popupCloseButton), i.onClick(this.popupCloseButton, this.onClose), this.swapVisibility(!1)
        }, u.prototype.createOverlay = function() {
            return new s(null, 0, .75)
        }, u.prototype.swapVisibility = function(t) {
            var e = n.byId("gameNameContainer");
            e && (e.style.opacity = t ? "inherit" : "0.25")
        }, u.prototype.fullscreenAplaAdded = function() {
            this.currentHTML && (this.swiper.wrapper && this.swiper.destroy.call(this), document.body.getElementsByClassName("scrollable")[0] && (document.body.getElementsByClassName("scrollable")[0].style.webkitOverflowScrolling = "auto"))
        }, u.prototype.fullscreenAplaRemoved = function() {
            this.swiper = this.createSwiper(), document.body.getElementsByClassName("scrollable")[0] && (document.body.getElementsByClassName("scrollable")[0].style.webkitOverflowScrolling = "touch")
        }, u.prototype.onClose = function() {
            r.emit("popup/close")
        }, u.prototype.removeHTML = function() {
            this.overlay && (this.overlay.hide(), this.overlay = null), this.popupCloseButton && (document.body.removeChild(this.popupCloseButton), this.popupCloseButton = null), e.prototype.removeHTML.apply(this, arguments), this.swapVisibility(!0)
        }, u.prototype.onResize = function() {
            if (this.currentHTML && (this.currentHTML.style.visibility = "visible"), this.currentHTML && this.scaleOnMobile) {
                var t = Math.min(window.innerWidth / this.currentHTML.clientWidth, window.innerHeight / this.currentHTML.clientHeight),
                    e = this.currentHTML.style;
                e.transform = e.webkitTransform = "scale(" + t + "," + t + ") perspective(1px)", e.left = window.innerWidth / 2 - this.currentHTML.clientWidth / 2 * t + "px", e.top = window.innerHeight / 2 - this.currentHTML.clientHeight / 2 * t + "px"
            }
        }, u.prototype.showPopup = function(t) {
            e.prototype.showPopup.call(this, t), p.isDuringAutoSpins && r.emit("autospin/stop")
        }, u
    }), _d("##(", ["!", "##*", ")*", "#", "$!", "(", "@@", "@%!", "^!", "@^^"], function(t, n, e, i, o, s, r, a, h, p) {
        "use strict";
        function u() {
            t.bindAll(this), i.on("request/parseOperatorMessage", this.onParseOperatorMessage), i.on("iframe/parseOperatorMessage", this.onIframeOperatorMessage), i.on("spin/definiteEnd", this.onSpinDefiniteEnd), i.once("game/show", this.showMessageWindow), i.once("initRequestSequence/allStepsCompleted", this.onAllStepsCompleted)
        }
        return u.prototype.onParseOperatorMessage = function(t, e) {
            this.isValidRequestType(t) && this.hasOperatorMessage(e) && n.parse(e)
        }, u.prototype.onIframeOperatorMessage = function(t, e) {
            this.onParseOperatorMessage(t, e), p.isIdle() && this.onSpinDefiniteEnd()
        }, u.prototype.isValidRequestType = function(t) {
            return "authenticate" === t || "play" === t || "iframe" === t
        }, u.prototype.onSpinDefiniteEnd = function() {
            o.isDuringAutoSpins && n.canShowPopup() && i.emit("autospin/stop", n.canShowPopup()), this.showMessageWindow()
        }, u.prototype.showMessageWindow = function() {
            n.canShowPopup() && (new e(n.popupConfig).html.style.zIndex = "20000", n.clear())
        }, u.prototype.hasOperatorMessage = function(t) {
            return !(!t.auxiliaryData || !t.auxiliaryData.popupMessage) || !!(t.wager && t.wager.auxiliaryData && t.wager.auxiliaryData.popupMessage) || !(!t.content || "string" != typeof t.content)
        }, u.prototype.onAllStepsCompleted = function() {
            r.iframeMessageParams && this.isOnCorrectChannel(r.iframeMessageParams.channel) && new a(r.iframeMessageParams)
        }, u.prototype.isOnCorrectChannel = function(t) {
            var e = h.isMobile(),
                n = t.toLowerCase();
            return "both" === n || ("mobile" === n ? e : !e)
        }, u
    }), _d("#$#", ["!", "@@", "##)", "%@", "##^", "%)", "#$!", "#$@", "@&@", "#@", "#", "$#", "@^^"], function(t, e, n, i, o, s, r, a, h, p, u, c, l) {
        "use strict";
        function d() {
            t.bindAll(this), this.window = null, u.once("game/show", this.onGameShow, u.PRIORITY_NORMAL - 10, !0)
        }
        return d.prototype.onGameShow = function(t) {
            e.shouldSendPotRequest() ? (u.once("potRequest/confirm", t), c.addEventListener("message", this.receiveMessage), c.addEventListener("unload", this.onWindowUnload), this.displayPotPopup()) : t()
        }, d.prototype.displayPotPopup = function() {
            i.hasData() && i.hasStatusPending() ? (u.once("restore/skip", this.onRestoreCompleted, u.PRIORITY_LOWEST), u.once("spin/definiteEnd", this.onRestoreCompleted, u.PRIORITY_LOWEST - 1)) : this.showWindow()
        }, d.prototype.onRestoreCompleted = function() {
            u.off("restore/skip", this.onRestoreCompleted), u.off("spin/definiteEnd", this.onRestoreCompleted), this.showWindow()
        }, d.prototype.showWindow = function() {
            this.window = new r({
                onConfirm: this.onConfirm,
                onCancel: this.onCancel
            }), new h(this.onLastSessionCloseConfirmed, this.hideWindow).run()
        }, d.prototype.onLastSessionCloseConfirmed = function() {
            this.window.showOnCloseConfirm(), this.onCloseGameSessionSuccess()
        }, d.prototype.onConfirm = function(t) {
            n.pot = t, this.sendPotRequest(t, this.hideWindow, this.displayError)
        }, d.prototype.sendPotRequest = function(t, e, n) {
            new a(e, n).run(t)
        }, d.prototype.onWindowUnload = function() {
            l.isIdle() && new h(this.onCloseGameSessionSuccess).synchronousRun(!0)
        }, d.prototype.onCloseGameSessionSuccess = function() {
            u.emit("game/lastSessionClose")
        }, d.prototype.onCancel = function() {
            new o, this.hideWindow(), c.parent && c.parent.postMessage({
                id: "potRequest/sessionClosed"
            }, "*"), "" !== e.backURL ? s.goToBackURL() : s.goBack()
        }, d.prototype.hideWindow = function() {
            this.window && (this.window.hide(), this.window = null), u.emit("potRequest/confirm")
        }, d.prototype.displayError = function(t) {
            this.window.showError(t.message), this.window.enabled()
        }, d.prototype.receiveMessage = function(t) {
            switch (t.data.id) {
            case "potRequest/closeSession":
                t.source.postMessage({
                    id: "potRequest/sessionClosed",
                    msg: "session will be closed on game close"
                }, t.origin)
            }
        }, d
    }), _d("#$$", ["#", "@)^", "#@", "!", "@)&", "@&*", "@@"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a() {
            i.bindAll(this), this.startTime = (new Date).getTime(), this.loadCount = 0
        }
        return a.prototype.run = function() {}, a.prototype.getCallback = function() {
            return this.loadCount++, this.completeCallback
        }, a.prototype.completeCallback = function() {
            this.loadCount--, 0 === this.loadCount && this.onComplete()
        }, a.prototype.onComplete = function() {
            o("send", "timing", "loading", this.getName(), (new Date).getTime() - this.startTime), this.sendMetrics(), this.completeHandler()
        }, a.prototype.sendMetrics = function() {
            var t = {
                backend: r.baseURL
            };
            t[this.getName()] = (new Date).getTime() - this.startTime, s(t)
        }, a.prototype.getName = function() {
            throw new Error("Abstract method")
        }, a.prototype.onError = function() {
            this.loadCount = -1, new e({
                title: n.get("connection_error_title") || "Connection Problem",
                message: n.get("connection_error_message") || "Check your internet connection and try again",
                allowContinue: !1
            }), t.emit("load/error")
        }, a
    }), _d("#$%", ["^#", "@$@", "&(", "#$$", "@^!"], function(t, o, e, n, s) {
        "use strict";
        function i() {
            n.call(this)
        }
        return t.extend(i, n), i.prototype.run = function() {
            n.prototype.run.call(this), this.loadAssets()
        }, i.prototype.loadAssets = function() {
            for (var t = o.addLangPrefix(o.getLazyGameAssets()), e = 0; e < t.length; e++) {
                var n = t[e],
                    i = new s;
                i.addLazy(n), i.once("complete", this.getCallback()), i.load()
            }
        }, i.prototype.onComplete = function() {
            n.prototype.onComplete.call(this)
        }, i.prototype.getName = function() {
            return "lazyLoad"
        }, i
    }), _d("#$^", ["^#", "@$@", "&(", "#$$", "#"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            i.call(this), o.once("preloader/animationComplete", this.onComplete)
        }
        return t.extend(s, i), s.prototype.getName = function() {
            return "preloaderAnimation"
        }, s
    }), _d("#$(", ["!", "#$&", "#$*", "#$%", "#$^", "#", "@@", "$#"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {
            t.bindAll(this), this.phases = [new e, new o, new n, new i], s.once("preloader/start", this.run), s.once("game/show", this.callParentClient, s.PRIORITY_LOWEST)
        }
        return h.prototype.run = function() {
            if (0 !== this.phases.length) {
                var t = this.phases.shift();
                t.completeHandler = this.run, t.run()
            }
        }, h.prototype.callParentClient = function() {
            r.isInnerClient() && a.parent.onIframeLoaded && a.parent.onIframeLoaded()
        }, h
    }), _d("#$&", ["^#", "@$@", "&(", "#$$", "@%)", "#"], function(t, n, e, i, o, s) {
        "use strict";
        function r() {
            i.call(this)
        }
        return t.extend(r, i), r.prototype.run = function() {
            i.prototype.run.call(this), this.loadTranslations(), this.loadAssets(), this.loadCss()
        }, r.prototype.loadTranslations = function() {
            new e(this.getCallback(), this.onError).run()
        }, r.prototype.loadAssets = function() {
            var t = new o,
                e = n.addLangPrefix(n.getPreloaderAssets());
            t.add(e), t.once("error", this.onError), t.once("complete", this.getCallback()), t.load()
        }, r.prototype.loadCss = function() {
            var t = document.createElement("link");
            t.href = n.getFile(n.getTranslatedFile("images/spritesheet.css")), t.type = "text/css", t.rel = "stylesheet", t.media = "screen,print", document.getElementsByTagName("head")[0].appendChild(t)
        }, r.prototype.onComplete = function() {
            i.prototype.onComplete.call(this), s.emit("preloader/show")
        }, r.prototype.getName = function() {
            return "preloader"
        }, r
    }), _d("#$*", ["^#", "@$@", "&(", "#$$", "@#*", "#$)", "#", ")", "%&", "$*", "@$", "@%)"], function(t, o, e, n, i, s, r, a, h, p, u, c) {
        "use strict";
        function l() {
            n.call(this), this.assetsProgress = 0, this.serviceProgress = 0, this.runTime = null, r.once("preloader/progress", this.startDelayTimer, r.PRIORITY_LOWEST)
        }
        return t.extend(l, n), l.prototype.startDelayTimer = function() {
            this.runTime = (new Date).getTime()
        }, l.prototype.stopDelayTimer = function(t) {
            u(t, this.getTimeDelay())
        }, l.prototype.getTimeDelay = function() {
            var t = ((new Date).getTime() - this.runTime) / 1e3,
                e = i.getLicense().getPreloaderDelay();
            return t < e ? e - t + this.getHumanMeasurementError() : 0
        }, l.prototype.run = function() {
            n.prototype.run.call(this), this.loadAssets(), this.loadService(), this.loadCssSpritesheets(), this.loadFonts(), this.loadSounds()
        }, l.prototype.loadCssSpritesheets = function() {
            for (var t = a.toHTML("<div id='preloadedSpritesheet'></div>"), e = 0; e < document.styleSheets.length; e++) {
                var n = document.styleSheets[e];
                if (n.href && 0 <= n.href.indexOf("images/spritesheet")) {
                    for (var i = 0; i < n.cssRules.length; i++) {
                        var o = n.cssRules[i].selectorText,
                            s = 0 <= o.indexOf(":") ? o.indexOf(":") : o.length,
                            r = o.substring(1, s);
                        t.appendChild(a.toHTML("<div class='" + r + "' style='display: none'></div>"))
                    }
                    break
                }
            }
            document.body.appendChild(t)
        }, l.prototype.removedPreloadedCSSSpritesheets = function() {
            document.body.removeChild(a.byId("preloadedSpritesheet"))
        }, l.prototype.loadService = function() {
            new s(this.getCallback(), null, this.onServiceProgress).run()
        }, l.prototype.loadFonts = function() {
            for (var t = o.getFonts(), e = document.body, n = 0; n < t.length; n++) {
                var i = a.toHTML("<span style='font-family: " + t[n] + ";'></span>");
                e.appendChild(i)
            }
        }, l.prototype.loadAssets = function() {
            var t = o.addLangPrefix(o.getSplashScreenAssets());
            t = (t = t.concat(o.addLangPrefix(o.getNotLazyGameAssets()))).concat(o.getParticleConfigs());
            var e = new c;
            e.add(t), e.once("error", this.onError), e.on("progress", this.onAssetsProgress), e.once("complete", this.getCallback()), e.load()
        }, l.prototype.loadSounds = function() {
            var t = o.getSounds().map(function(t) {
                return "string" == typeof t ? t : t.file
            });
            h.loadAll(t)
        }, l.prototype.onServiceProgress = function(t, e) {
            this.serviceProgress = t / e, this.updateProgress()
        }, l.prototype.onAssetsProgress = function(t) {
            this.assetsProgress = t.progress / 100, this.updateProgress()
        }, l.prototype.updateProgress = function() {
            r.emit("preloader/progress", (this.serviceProgress + this.assetsProgress) / 2)
        }, l.prototype.onComplete = function() {
            n.prototype.onComplete.call(this), p.init(), this.removedPreloadedCSSSpritesheets(), i.getLicense().hasPreloaderDelay() ? this.stopDelayTimer(this.emitSplashScreenShow) : this.emitSplashScreenShow()
        }, l.prototype.emitSplashScreenShow = function() {
            r.emit("splashScreen/show")
        }, l.prototype.getName = function() {
            return "splashScreen"
        }, l.prototype.getHumanMeasurementError = function() {
            return .2
        }, l
    }), _d("$@", ["!", "#", "@", "#(", "*", "#)", "$!", "@*"], function(t, n, i, o, e, s, r, a) {
        "use strict";
        function h() {
            t.bindAll(this), n.on("game/show", this.onGameShow, n.PRIORITY_LOW), n.on("restore/skip", this.onRestoreSkip), n.on("spin/definiteEnd", this.onDefiniteEnd)
        }
        return h.prototype.onGameShow = function() {
            this.forceNewOnSkip = !i.hasPromoSpin(), this.checkBegin()
        }, h.prototype.onRestoreSkip = function() {
            this.checkEnd(this.forceNewOnSkip)
        }, h.prototype.onDefiniteEnd = function() {
            this.checkEnd(this.forceNewOnSkip)
        }, h.prototype.checkBegin = function() {
            i.hasPromoSpin() && (this.showBeginWindow(), e.setTotalBet(i.totalBet), n.emit("promo/show"), n.emit("boost/showButton", a.PROMO), n.emit("boost/showTopPanel", a.PROMO))
        }, h.prototype.checkEnd = function(t) {
            i.isLastPromoSpin() ? (this.stopAutoSpin(), this.showFinishWindow(this.checkBegin), this.selectDefaultBet()) : t && this.checkBegin(), this.resetForceNewOnSkip()
        }, h.prototype.resetForceNewOnSkip = function() {
            this.forceNewOnSkip = !1
        }, h.prototype.selectDefaultBet = function() {
            s.selectDefault()
        }, h.prototype.showBeginWindow = function() {
            new o(i.getBeginWindowOptions())
        }, h.prototype.showFinishWindow = function(t) {
            var e = i.getFinishWindowOptions();
            e.onHideComplete = function() {
                i.clearFinalBalance(), n.emit("boost/hideButton"), n.emit("boost/hideTopPanel"), n.emit("boost/toolEnd"), t()
            }, new o(e)
        }, h.prototype.stopAutoSpin = function() {
            r.isDuringAutoSpins && n.emit("autospin/stop")
        }, h
    }), _d("#%%", ["!", "#", "^", "#%!", "@^^", "$!", "#%@", "##^", "@$", "@%", "%)", "@@", "#%#", "@#*", "#%$"], function(t, e, n, o, i, s, r, a, h, p, u, c, l, d, f) {
        "use strict";
        function g() {
            t.bindAll(this), this.REQUEST_NAMES = {
                CONTINUE: "CONTINUE",
                STOP: "STOP"
            }, this.timeout = null, e.once("game/show", this.onGameShow), e.on("realityCheck/show", this.onTimeout), e.on("realityCheck/resume", this.onContinue)
        }
        return g.prototype.onGameShow = function() {
            o.start(), o.isActive() && (this.timeout = h(this.onTimeout, o.getFirstInterval()))
        }, g.prototype.onTimeout = function() {
            p(this.timeout), this.timeout = null, o.errorType = "REMINDER", i.isIdle() ? this.showWindow() : e.once("spin/definiteEnd", this.showWindow, e.PRIORITY_HIGH)
        }, g.prototype.showWindow = function() {
            s.isDuringAutoSpins && e.emit("autospin/stop"), e.emit("messageWindow/close"), c.isRealityCheckWindowDisabled() ? e.emit("realityCheck/showMessage") : (d.isESLicense() ? new f(this.makeRequest(this.REQUEST_NAMES.CONTINUE, this.onContinue), this.makeRequest(this.REQUEST_NAMES.STOP, this.onStop)) : new r(this.makeRequest(this.REQUEST_NAMES.CONTINUE, this.onContinue), this.makeRequest(this.REQUEST_NAMES.STOP, this.onStop)), o.gamingWinLoss = null, o.sportsWinLoss = null)
        }, g.prototype.makeRequest = function(n, i) {
            return function(t) {
                var e = function() {
                    t(), i(), o.serverTimeElapsed = null
                };
                c.serverRealityCheckEnabled ? new l(e, e).run(n) : e()
            }
        }, g.prototype.onStop = function() {
            new a, "" !== c.realityCheckBackURL ? u.goToRealityCheckBackURL() : "" !== c.backURL && u.goToBackURL()
        }, g.prototype.onContinue = function() {
            o.isActive() && !this.timeout && (this.timeout = h(this.onTimeout, o.getInterval()))
        }, g
    }), _d("#%^", ["!", "#", "@@", "@)@", "@*", ")", "(", "^!"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {
            t.bindAll(this), n.isReplayMode() && (e.on("spin/definiteEnd", this.onDefiniteEnd, e.PRIORITY_LOWEST), e.once("game/show", this.onGameShow, e.PRIORITY_LOWEST), n.isInGameHistoryEnabled() || this.showBackButton())
        }
        return h.prototype.showBackButton = function() {
            var t = a.isIPhone() ? s.toHTML("<div class='genericCloseIphone'>+</div>") : s.toHTML("<div class='genericClose'>+</div>");
            s.preventMove(t), t.onclick = function() {
                window.history.back()
            }, document.body.appendChild(t)
        }, h.prototype.onGameShow = function() {
            e.emit("boost/showTopPanel", o.SHARE), r.root && r.root.optionsMenu && (r.root.optionsMenu.visible = !1)
        }, h.prototype.onDefiniteEnd = function() {
            n.isShareEnabled() && e.emit("boost/showButton", o.SHARE), i.hasReplayWager() ? e.emit("spin/begin") : e.emit("replay/end")
        }, h
    }), _d("#%*", ["!", "@)*", "#", "#@", "##^", ")*", "%@", "@@", "^", "$*", "#%&"], function(t, e, n, i, o, s, r, a, h, p, u) {
        "use strict";
        function c() {
            t.bindAll(this), this._messageWindow = null, n.on("game/show", this.onPreloaderHideComplete)
        }
        return c.prototype.onPreloaderHideComplete = function() {
            r.hasPendingSpinToRestore() && (r.setNextWager(), this.showMessageWindow())
        }, c.prototype.showMessageWindow = function() {
            var t = {
                message: this.getMessage(),
                buttons: this.getButtons()
            };
            this._messageWindow = new s(t), n.emit("restore/popupShown"), n.once("restore/forceSkip", this.onRestoreForceSkip, n.PRIORITY_NORMAL, !0)
        }, c.prototype.onRestoreForceSkip = function(t) {
            this.onSkip(t), this._messageWindow.hide(), this._messageWindow = null
        }, c.prototype.getButtons = function() {
            return [{
                label: i.get("freeSpins_restore_replay_button"),
                action: this.onReplay,
                hideWindow: !0
            }, {
                label: i.get("freeSpins_restore_skip_button"),
                action: this.onSkip,
                hideAsyncWindow: !0
            }]
        }, c.prototype.getMessage = function() {
            return i.get("freeSpins_restore_message")
        }, c.prototype.onReplay = function() {
            n.emit("restore/replay"), n.emit("spin/begin")
        }, c.prototype.onSkip = function(t) {
            h.skipToLastBet(), h.shouldSendCollect() ? new u(function() {
                this.skipComplete(t)
            }.bind(this)).run() : this.skipComplete(t)
        }, c.prototype.skipComplete = function(t) {
            t(), n.emit("restore/skip"), e.parseSpinDefiniteEnd(), r.clear(), e.clear()
        }, c
    }), _d("#%(", ["#", "!", "#@%", "$!", "^", "@", "@@"], function(e, t, n, i, o, s, r) {
        "use strict";
        function a() {
            t.bindAll(this), e.on("skipPresentation/allowSkip", this.allowSkip), e.on("initialAnimation/end", this.onInitialAnimationEnd, e.PRIORITY_NORMAL + 1), e.on("spin/begin", this.turnOffSkip, e.PRIORITY_HIGHEST), e.on("initialAnimation/skip", this.onSkip, e.PRIORITY_HIGHEST)
        }
        return a.prototype.onInitialAnimationEnd = function() {
            this.turnOffSkip(), n.skipPresentation = !1
        }, a.prototype.turnOffSkip = function() {
            n.allowSkip = !1, e.off("spin/definiteEnd", this.runSpinAfterSkip)
        }, a.prototype.allowSkip = function() {
            n.allowSkip = this.canSkip()
        }, a.prototype.canSkip = function() {
            return !s.hasPromoSpin() && !s.isLastPromoSpin() && !o.hasNextSpin() && !i.isDuringAutoSpins && !r.isReplayMode() && r.canSkip()
        }, a.prototype.onSkip = function(t) {
            this.turnOffSkip(), n.skipPresentation = !0, t && e.once("spin/definiteEnd", this.runSpinAfterSkip, e.PRIORITY_LOWEST)
        }, a.prototype.runSpinAfterSkip = function() {
            s.isLastPromoSpin() || e.emit("spin/begin")
        }, a
    }), _d("#%)", ["!", "%&", "@$@", "#"], function(t, e, n, i) {
        "use strict";
        function o() {
            t.bindAll(this), this.counter = 0, i.on("audio/play", this.onSoundPlay), i.on("audio/stop", this.onSoundComplete)
        }
        return o.prototype.onSoundPlay = function(t) {
            this.shouldLowerMusic(t) && (0 === this.counter && this.setMusicVolume(this.getNewMusicVolume()), this.counter++)
        }, o.prototype.getNewMusicVolume = function() {
            return .2
        }, o.prototype.shouldLowerMusic = function(t) {
            return 0 <= n.getSoundsToTriggerDucking().indexOf(t) && e.soundsEnabled
        }, o.prototype.onSoundComplete = function(t) {
            this.shouldLowerMusic(t) && (this.counter--, 0 === this.counter && this.setMusicVolume(1))
        }, o.prototype.setMusicVolume = function(t) {
            TweenMax.to(e, .3, {
                musicVolume: t
            })
        }, o
    }), _d("#^!", ["!", "#", "$#", "(", "@(&", ")"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            t.bindAll(this), this.SPACE_KEY_CODE = 32, this.onPressToSpinChanged(), o.on("pressSpaceToSpin/changed", this.onPressToSpinChanged)
        }
        return r.prototype.onPressToSpinChanged = function() {
            o.pressSpaceToSpin ? n.addEventListener("keypress", this.onKeyClicked) : n.removeEventListener("keypress", this.onKeyClicked)
        }, r.prototype.onKeyClicked = function(t) {
            (null !== (t = t || n.event).charCode ? t.charCode : t.keyCode) === this.SPACE_KEY_CODE && this.canSimulate() && i.hud.spinButton.simulateClick()
        }, r.prototype.canSimulate = function() {
            return !(!i.root || !i.machine.visible || i.machine.alpha < 1 || !i.hud.visible || i.hud.alpha < 1 || null !== s.byId("messageWindow"))
        }, r
    }), _d("#^$", ["!", "@@*", "#", "$!", "#^@", "@$", "@%", "@^^", "^", "@)*", "@@", "@)@", "#^#", "#%&", "@(*", "*", "@", "@#*"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d, f, g, y, m) {
        "use strict";
        function S() {
            t.bindAll(this), n.on("spin/begin", this.onSpinBegin, 10 * n.PRIORITY_HIGHEST), n.on("spin/start", this.onSpinStart, n.PRIORITY_HIGH), n.on("spin/end", this.onSpinEnd, n.PRIORITY_HIGH), n.on("spin/dataLoaded", this.onSpinDataLoaded, n.PRIORITY_HIGH), n.on("spin/forceStop", this.onForceStop, n.PRIORITY_HIGH), n.on("winPresentation/end", this.onSendCollect, n.PRIORITY_HIGH, !0), n.on("winPresentation/end", this.onWinPresentationEnd, n.PRIORITY_LOW), n.on("column/allSymbolsReady", this.onFinalSymbolsReady, n.PRIORITY_LOW)
        }
        return S.prototype.onSpinBegin = function() {
            a.setSpinningState()
        }, S.prototype.onSpinStart = function() {
            this.playSpinSound(), h.resetTimes(), h.saveStartTime(), h.hasNextSpin() ? s(this.onSpinData, 0, !1) : (p.clear(), u.isReplayMode() ? (c.prepareReplay(), s(this.onSpinData, 0, !0)) : new o(function() {
                this.onSpinData(!0)
            }.bind(this), this.onError).run())
        }, S.prototype.shouldSubtractTotalBet = function() {
            return !y.hasPromoSpin() && !y.isLastPromoSpin() && !c.isPromoSpin()
        }, S.prototype.subtractTotalBet = function() {
            f.setBalance(f.balance - g.totalBet)
        }, S.prototype.playSpinSound = function() {
            this.spinSound = e.play("sounds/spin.mp3", !0)
        }, S.prototype.onError = function() {
            n.emit("spin/error"), p.error(), i.isDuringAutoSpins && n.emit("autospin/stop"), s(this.stopSpinning, h.getTimeToStopMachine())
        }, S.prototype.onSpinData = function(t) {
            p.parseNextSmallSpin(), t && this.shouldSubtractTotalBet() && this.subtractTotalBet(), n.emit("spin/dataLoaded")
        }, S.prototype.onSpinDataLoaded = function() {
            this.stopTimout = s(this.stopSpinning, h.getTimeToStopMachine())
        }, S.prototype.stopSpinning = function() {
            a.setStoppingState(), n.emit("spin/stop")
        }, S.prototype.onSpinEnd = function() {
            this.stopSpinSound(), p.parseSpinEnd()
        }, S.prototype.stopSpinSound = function() {
            this.spinSound.stop()
        }, S.prototype.onWinPresentationEnd = function() {
            h.hasNextSpin() ? n.emit("spin/begin") : this.waitForSpinDefiniteEnd() ? s(this.definiteEndSpin, m.getLicense().getMinSpinTime() - h.getTimeFromStart()) : this.definiteEndSpin()
        }, S.prototype.waitForSpinDefiniteEnd = function() {
            return m.getLicense().hasMinSpinTime() && h.getTimeFromStart() < m.getLicense().getMinSpinTime()
        }, S.prototype.definiteEndSpin = function() {
            p.parseSpinDefiniteEnd(), a.setIdleState(), n.emit("spin/definiteEnd")
        }, S.prototype.onFinalSymbolsReady = function(t) {
            l.getLastSpinningColumn() === t && n.emit("spin/symbolsLanded")
        }, S.prototype.onForceStop = function() {
            r(this.stopTimout), a.isSpinning() && this.stopSpinning(), a.setForceStoppingState(), l.forceStop()
        }, S.prototype.onSendCollect = function(t) {
            u.isReplayMode() ? this.checkCollectInReplays(t) : this.checkCollect(t)
        }, S.prototype.checkCollectInReplays = function(t) {
            h.isLastSmallSpin() && c.hasCollectCommandInNextBet() && (c.prepareReplay(), h.skipToLastBet(), p.parseSpinEnd()), t()
        }, S.prototype.checkCollect = function(t) {
            h.isLastSmallSpin() && h.shouldSendCollect() ? new d(t, this.onError).run() : t()
        }, S
    }), _d("#^)", ["!", "#^#", "@)%", "#^%", "@@", "#", "^", "#^^", "#^&", "#^*", "@$", "@%", "@^^", "#^("], function(t, n, e, i, o, s, r, a, h, p, u, c, l, d) {
        "use strict";
        function f() {
            t.bindAll(this), this.numberOfFrames = 0, s.on("spin/stop", this.onSpinStop), s.on("column/allSymbolsReady", this.onColumnStopped)
        }
        return f.prototype.onSpinStop = function() {
            for (var t = this.numberOfFrames = 0; t < e.columns; t++)
                d.isSpinificationColumn(t) && (r.columnStopTimes[t] = d.getSpinificationTime(t))
        }, f.prototype.onColumnStopped = function(t) {
            if (d.hasSpinificationAfterColumn(t) && !l.isForceStopping()) {
                var e = n.getNextSpinningColumn(t);
                this.showFrame(e)
            }
        }, f.prototype.showFrame = function(t) {
            this.numberOfFrames++, this.createFrameForColumn(t), r.setSpeedFactorForColumn(t, d.getColumnSpeed(t))
        }, f.prototype.createFrameForColumn = function(t) {
            var e = new h;
            return e.x = a.getSymbolCoordinates(t).x, this.setAutoRemove(e, t), o.game.root.machine.addChild(e)
        }, f.prototype.setAutoRemove = function(t, e) {
            var n = function() {
                    s.off("spin/forceStop", n), c(i), this.removeFrame(t)
                }.bind(this),
                i = u(n, d.getSpinificationTime(e));
            s.once("spin/forceStop", n)
        }, f.prototype.removeFrame = function(t) {
            TweenMax.to(t, .4, {
                alpha: 0,
                onComplete: this.onRemoveFrameComplete,
                onCompleteParams: [t]
            })
        }, f.prototype.onRemoveFrameComplete = function(t) {
            t.parent && t.parent.removeChild(t)
        }, f
    }), _d("#&!", ["!", "#", "@$", "@@", "^", "@%", "@$@"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a() {
            t.bindAll(this), this.LONG_SPIN_TIMEOUT = 5, this.LAZY_ASSET_TIMEOUT = .5, e.on("spin/start", this.onSpinStart), e.on("spin/error", this.onRemoveSpinner), e.on("spin/dataLoaded", this.onRemoveSpinner, e.PRIORITY_LOWEST), r.getLazyAssetsEvents().forEach(function(t) {
                e.on(t, this.onLazyAssetRequest, 100 * e.PRIORITY_HIGHEST), e.on(t, this.onRemoveSpinner, 100 * e.PRIORITY_LOWEST)
            }.bind(this))
        }
        return a.prototype.onSpinStart = function() {
            this.addSpinner(this.LONG_SPIN_TIMEOUT)
        }, a.prototype.onLazyAssetRequest = function() {
            this.addSpinner(this.LAZY_ASSET_TIMEOUT)
        }, a.prototype.addSpinner = function(t) {
            this.timeout || (this.timeout = n(this.show, t))
        }, a.prototype.show = function() {
            e.emit("spinner/show")
        }, a.prototype.onRemoveSpinner = function() {
            this.timeout && (s(this.timeout), e.emit("spinner/hide"), this.timeout = null)
        }, a
    }), _d("#&#", ["!", "#", "#&@", "@@", "^"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.bindAll(this), e.on("spin/end", this.onSpinEnd, e.PRIORITY_HIGH), e.on("spin/definiteEnd", this.hideSymbols), e.on("column/symbolReady", this.onFinalSymbol)
        }
        return s.prototype.onFinalSymbol = function(t) {
            n.hasStickySymbol(t.column, t.row, !0) && (t.image.visible = !1)
        }, s.prototype.onSpinEnd = function() {
            for (var t = n.getNewSymbolsPosition(), e = 0; e < t.length; e++)
                this.setAsStickyOnPosition(t[e])
        }, s.prototype.setAsStickyOnPosition = function(t) {
            i.game.root.machine.symbolsContainer.setAsSticky(t.column, t.row)
        }, s.prototype.hideSymbols = function() {
            i.game.root.machine.symbolsContainer.stickySymbols.clear()
        }, s
    }), _d("#&%", ["#", "!", "@@", "(", "#&$", "#@&"], function(e, t, n, i, o, s) {
        "use strict";
        function r() {
            t.bindAll(this), e.once("game/show", this.init, e.PRIORITY_LOWEST)
        }
        return r.prototype.init = function() {
            n.showMobileUI && (e.on("spin/start", this.onHide), e.on("swipeMenu/hide", this.onHide), e.on("orientation/changed", this.onHide), e.on("autospin/init", this.onHide), e.on("swipeMenu/toggle", this.onToggle), e.on("autospin/prepareSpins", this.onPrepareAutoSpins)), this.currentPicker = null
        }, r.prototype.onHide = function() {
            this.swipeMenu.isOpen && (this.hide(), e.emit("swipeMenu/willToggle", this.currentPicker))
        }, r.prototype.onToggle = function(t) {
            this.swipeMenu.showPicker(t), this.swipeMenu.isOpen && this.currentPicker === t ? (s.add(s.SWIPE_MENU_TOOGLE, "hide", t), this.hide()) : (s.add(s.SWIPE_MENU_TOOGLE, "show", t), this.show(t)), e.emit("swipeMenu/willToggle", this.currentPicker)
        }, r.prototype.show = function(t) {
            this.swipeMenu.visible = !0, this.currentPicker = t, this.swipeMenu.isOpen || (n.game.root.showSwipeMenu(this.onShowComplete), this.swipeMenu.isOpen = !0)
        }, r.prototype.onShowComplete = function() {
            i.stage.on("tap", this.onStageClicked)
        }, r.prototype.hide = function() {
            this.swipeMenu.isOpen = !1, this.currentPicker = null, i.stage.off("tap", this.onStageClicked), n.game.root.hideSwipeMenu(this.onHideComplete)
        }, r.prototype.onStageClicked = function(t) {
            this.currentPicker && this.isClickedOutsideMenu(t.data.global) && this.onHide()
        }, r.prototype.isClickedOutsideMenu = function(t) {
            return !o.containsPoint(this.swipeMenu, t) && !o.containsPoint(i.root.spinPanel, t)
        }, r.prototype.onHideComplete = function() {
            this.swipeMenu.visible = !1, this.swipeMenu.isOpen = !1
        }, r.prototype.onPrepareAutoSpins = function() {
            e.emit("autospin/init", this.swipeMenu.getSelectedAutoSpinsNumber())
        }, Object.defineProperty(r.prototype, "swipeMenu", {
            get: function() {
                return n.game.root.swipeMenu
            }
        }), r
    }), _d("#&(", ["!", "#", "$#", "@@", "@#$", "^!", "#&^", ")", "#&&", "@$", "#&*"], function(t, e, n, i, o, s, r, a, h, p, u) {
        "use strict";
        function c() {
            t.bindAll(this), this.Z_INDEX = 999999999999, s.isIPhone() && e.once("splashScreen/show", this.init)
        }
        return c.prototype.init = function() {
            this.apla = this.createApla(), this.aplaVisible = !1, e.on("orientation/changed", this.orientationChanged), e.once("game/update", this.onResize, e.PRIORITY_LOW), e.on("swipeToFullScreen/enabled", this.enableSwipeToFullScreen), e.on("swipeToFullScreen/disabled", this.disableSwipeToFullScreen), e.on("game/resize", this.onResize, e.PRIORITY_LOWEST), o.body.appendChild(this.apla), this.setAplaVisibility(!1)
        }, c.prototype.onResize = function() {
            p(this.manageApla, .1)
        }, c.prototype.manageApla = function() {
            n.innerHeight < o.documentElement.clientHeight && !s.isPortraitMode() && u.enabled ? this.addApla() : this.removeApla()
        }, c.prototype.addApla = function() {
            this.aplaVisible || (h.fullscreenAplaAdded(), this.aplaVisible = !0, this.overlay = new r, this.overlay.overlay.style.zIndex = this.Z_INDEX, this.setAplaVisibility(!0), this.moveAplaToTop(), this.handAnimation = this.createHandAnimation(), this.handAnimation.restart(), this.blockBackgroundScrolling(), n.scrollTo(0, 0))
        }, c.prototype.setAplaVisibility = function(t) {
            s.isIPhone6OrBigger() || !s.isTopFrame() ? this.apla.style.display = t ? "block" : "none" : this.apla.style.visibility = t ? "visible" : "hidden"
        }, c.prototype.moveAplaToTop = function() {
            this.apla.parentNode.appendChild(this.apla)
        }, c.prototype.removeApla = function() {
            this.aplaVisible && (this.overlay.hide(), TweenMax.killTweensOf(".fullscreen"), this.setAplaVisibility(!1), this.handAnimation.kill(), this.aplaVisible = !1, h.fullscreenAplaRemoved(), this.restoreBlockedScroll())
        }, c.prototype.blockBackgroundScrolling = function() {
            o.getElementById("tournamentPagesWrapper") && (o.getElementById("tournamentPagesWrapper").style.webkitOverflowScrolling = "auto"), this.setOverflowScrolling("scrollable", "auto"), this.setOverflowScrolling("pausableScroll", "auto")
        }, c.prototype.restoreBlockedScroll = function() {
            o.getElementById("tournamentPagesWrapper") && (o.getElementById("tournamentPagesWrapper").style.webkitOverflowScrolling = "touch"), this.setOverflowScrolling("scrollable", "touch"), this.setOverflowScrolling("pausableScroll", "touch")
        }, c.prototype.setOverflowScrolling = function(t, e) {
            for (var n = o.getElementsByClassName(t), i = 0; i < n.length; i++)
                n[i].style.webkitOverflowScrolling = e
        }, c.prototype.createApla = function() {
            var t = a.toHTML("<div class='aplaContainer'></div>"),
                e = a.toHTML("<div class='aplaBg'></div>"),
                n = a.toHTML("<div class='fullscreen'></div>");
            return t.appendChild(e), t.appendChild(n), n.style.zIndex = 2 * this.Z_INDEX, t
        }, c.prototype.orientationChanged = function() {
            this.removeApla()
        }, c.prototype.createHandAnimation = function() {
            var t = new TimelineMax({
                repeat: -1,
                repeatDelay: .5,
                delay: .5
            });
            return t.append(TweenMax.fromTo(".fullscreen", .7, {
                css: {
                    bottom: 0
                }
            }, {
                css: {
                    bottom: 100
                },
                ease: Sine.easeInOut
            })), t.append(TweenMax.to(".fullscreen", .1, {
                css: {
                    bottom: 0
                }
            })), t
        }, c.prototype.enableSwipeToFullScreen = function() {
            u.enabled = !0
        }, c.prototype.disableSwipeToFullScreen = function() {
            u.enabled = !1
        }, c
    }), _d("#&)", ["!", "#", "@%$", "@$@", "@^^"], function(t, e, i, n, o) {
        "use strict";
        function s() {
            t.bindAll(this), this.MAX_TEXTURES_TO_LOAD_AFTER_SPIN = 2, this.preloaderAnimationComplete = !1, this.texturesToUpdateAfterPreloader = [], this.texturesToUpdateAfterSpin = [], e.on("texture/loaded", this.onTextureLoaded), e.once("preloader/animationComplete", this.onPreloaderAnimationComplete, e.PRIORITY_LOW), e.once("splashScreen/show", this.onSplashScreenShow, e.PRIORITY_LOW), e.once("game/show", this.onGameShow, e.PRIORITY_LOW), e.on("spin/definiteEnd", this.onSpinDefiniteEnd, e.PRIORITY_HIGH), e.on("game/destroy", this.onGameDestroy)
        }
        return s.prototype.onPreloaderAnimationComplete = function() {
            for (this.preloaderAnimationComplete = !0; 0 < this.texturesToUpdateAfterPreloader.length;) {
                var t = this.texturesToUpdateAfterPreloader.shift();
                this.uploadTexture(t)
            }
        }, s.prototype.onTextureLoaded = function(t) {
            n.shouldUploadTextureOnStartup(t) && (this.preloaderAnimationComplete ? o.isIdle() ? this.uploadTexture(t) : this.texturesToUpdateAfterSpin.push(t) : this.texturesToUpdateAfterPreloader.push(t))
        }, s.prototype.onSpinDefiniteEnd = function() {
            for (var t = Math.min(this.texturesToUpdateAfterSpin.length, this.MAX_TEXTURES_TO_LOAD_AFTER_SPIN); 0 < t;) {
                var e = this.texturesToUpdateAfterSpin.shift();
                this.uploadTexture(e), t--
            }
        }, s.prototype.uploadTexture = function(t) {
            i.uploadTexture(t)
        }, s.prototype.onSplashScreenShow = function() {
            this.unloadSpritesheets(n.getPreloaderAssets())
        }, s.prototype.onGameShow = function() {
            this.unloadSpritesheets(n.getSplashScreenAssets())
        }, s.prototype.unloadSpritesheets = function(t) {
            for (var e = 0; e < t.length; e++) {
                var n = t[e].replace(".json", ".png");
                i.getTexture(n).destroy(!0)
            }
        }, s.prototype.onGameDestroy = function() {
            i.destroyAllTextures()
        }, s
    }), _d("#*@", ["!", "(#", ")", "(@", "#", "@$@", "#@", "#*!", "@@"], function(t, n, i, o, s, r, a, h, e) {
        "use strict";
        function p() {
            t.bindAll(this), h.isVideoAvailable() && h.showVideoIntro && (s.once("preloader/show", this.showVideo), s.once("splashScreen/show", this.playVideo, s.PRIORITY_HIGHEST, !0), s.once("slotsIframeMessenger/skipIntro", this.hideVideo))
        }
        return p.prototype.showVideo = function() {
            var t = n.get("videoIntro.html", {
                    source: r.getFile("videos/intro.mp4"),
                    skip: a.get("videoIntro_skip")
                }),
                e = i.toHTML(t);
            document.body.appendChild(e), this.video = i.byId("video"), this.container = i.byId("videoContainer"), this.overlay = i.byId("videoOverlay"), this.unmuteButton = i.byClass("unmute")[0], this.video.muted = !0, this.overlay.style.display = "none", i.byClass("skip")[0].style.bottom = h.getSkipBottomStyle()
        }, p.prototype.playVideo = function(t) {
            this.overlay.style.display = "", s.on("game/resize", this.onResize), this.onResize(), o.onClick(this.overlay, this.onClick), this.video.onended = this.hideVideo, this.video.oncanplay = this.onResize, this.video.onloadstart = this.onResize, this.video.onloadedmetadata = this.onResize, this.done = t;
            var e = this.video.play();
            void 0 !== e && e.catch(this.hideVideo), s.emit("videoIntroController/videoStarted")
        }, p.prototype.onClick = function(t) {
            i.hasClass(t.target, "unmute") ? this.unmuteVideo() : this.hideVideo()
        }, p.prototype.hideVideo = function() {
            s.off("game/resize", this.onResize), this.video.pause(), this.sendVideoStatistic(), document.body.removeChild(this.overlay), this.video.src = "", this.video.innerHTML = "", this.video.load(), this.done(), this.done = null
        }, p.prototype.sendVideoStatistic = function() {
            var t = Math.floor(1e3 * this.video.currentTime);
            ga("send", "timing", "intro", e.getGameId(), t, e.getUserName())
        }, p.prototype.unmuteVideo = function() {
            this.video.muted = !1, this.container.removeChild(this.unmuteButton)
        }, p.prototype.onResize = function() {
            var t = Math.min(document.body.clientHeight / this.video.clientHeight / h.getScale(), document.body.clientWidth / this.video.clientWidth / h.getScale()),
                e = this.container.style;
            e.transform = e.webkitTransform = "scale(" + t + "," + t + ") perspective(1px)", e.left = (document.body.clientWidth - this.video.clientWidth) / 2 + "px", e.top = (document.body.clientHeight - this.video.clientHeight) / 2 + "px";
            var n = this.unmuteButton.style;
            n.left = this.video.clientWidth - this.unmuteButton.clientWidth + "px", n.top = this.video.clientHeight - this.unmuteButton.clientHeight + "px"
        }, p
    }), _d("#*#", ["!", "#", "@$", "@%", "$^", "$!", "^", "@)@", "#@%"], function(t, e, n, i, o, s, r, a, h) {
        "use strict";
        function p() {
            t.bindAll(this), this.currentTimeout = -1, e.on("spin/begin", this.onSpinStart), e.on("spin/end", this.onSpinEnd, e.PRIORITY_LOW), e.on("initialAnimation/end", this.initialPresentationFinished), e.on("winPresentation/clearImmediately", this.clearWinPresentation), e.on("winPresentation/end", this.showSlowPresentation)
        }
        return p.prototype.clearWinPresentation = function() {
            0 !== o.getNumberOfWinningLines() && (i(this.currentTimeout), e.emit("winPresentation/clear"))
        }, p.prototype.onSpinStart = function() {
            0 === o.getNumberOfWinningLines() ? this.startSpin() : (this.clearWinPresentation(), n(this.startSpin, o.CLEAR_IMMEDIATELY_TIME))
        }, p.prototype.startSpin = function() {
            e.emit("spin/start")
        }, p.prototype.onSpinEnd = function() {
            0 === o.getNumberOfWinningLines() ? e.emit("winPresentation/end") : e.emit("initialAnimation/start")
        }, p.prototype.initialPresentationFinished = function() {
            e.emit("winPresentation/end")
        }, p.prototype.showSlowPresentation = function() {
            o.compactWins(), this.canShowLine() && o.hasWinningLines() && this.showLine()
        }, p.prototype.canShowLine = function() {
            return !s.isDuringAutoSpins && !a.hasReplayWager() && !h.skipPresentation && r.isLastSmallSpin()
        }, p.prototype.showAllLines = function() {
            e.emit("winPresentation/show"), this.currentTimeout = n(this.hideLines, o.ALL_LINES_TIME)
        }, p.prototype.hideLines = function() {
            e.emit("winPresentation/hide"), o.nextLine(), this.currentTimeout = n(this.showLine, o.DELAY)
        }, p.prototype.showLine = function() {
            e.emit("winPresentation/show"), this.currentTimeout = n(this.hideLines, o.SINGLE_LINE_TIME)
        }, p
    }), _d("@#$", [], function() {
        return document
    }), _d("$#", [], function() {
        return window
    }), _d("#*$", ["@$&"], function(t) {
        return new t
    }), _d("#", ["@#^"], function(t) {
        return new t
    }), _d("@@", ["#*%"], function(t) {
        return new t
    }), _d("@(*", ["#*^"], function(t) {
        return new t
    }), _d("%&", ["#*&"], function(t) {
        return new t
    }), _d("#@", ["@^&"], function(t) {
        return new t
    }), _d("#**", ["#$("], function(t) {
        return new t
    }), _d("#*(", ["#&)"], function(t) {
        return new t
    }), _d("#%!", ["#*)"], function(t) {
        return new t
    }), _d("#(!", ["#!$"], function(t) {
        return new t
    }), _d("#(@", ["#&("], function(t) {
        return new t
    }), _d("#(#", ["#@#"], function(t) {
        return new t
    }), _d("@$@", ["#($"], function(t) {
        return new t
    }), _d("@)%", ["#(%"], function(t) {
        return new t
    }), _d("#@(", ["#(^"], function(t) {
        return new t
    }), _d("#(*", ["#(&"], function(t) {
        return new t
    }), _d("@^^", ["#(("], function(t) {
        return new t
    }), _d("@", ["^("], function(t) {
        return new t
    }), _d("#)", ["#()"], function(t) {
        return new t
    }), _d("#)@", ["#)!"], function(t) {
        return new t
    }), _d("*", ["#)#"], function(t) {
        return new t
    }), _d("^", ["#)$"], function(t) {
        return new t
    }), _d("@)*", ["#)%"], function(t) {
        return new t
    }), _d("$!", ["#)^"], function(t) {
        return new t
    }), _d("#^%", ["#)&"], function(t) {
        return new t
    }), _d("$*", ["#)*"], function(t) {
        return new t
    }), _d("#))", ["#)("], function(t) {
        return new t
    }), _d("$^", ["$!!"], function(t) {
        return new t
    }), _d("$!#", ["$!@"], function(t) {
        return new t
    }), _d("$!$", ["@)!"], function(t) {
        return new t
    }), _d("$!%", ["#^$"], function(t) {
        return new t
    }), _d("$!^", ["#*#"], function(t) {
        return new t
    }), _d("$!&", ["#!)", "@@"], function(t, e) {
        if (!e.isInnerClient())
            return new t
    }), _d("#&@", ["$!*"], function(t) {
        return new t
    }), _d("#^#", ["$!("], function(t) {
        return new t
    }), _d("$!)", ["#%%"], function(t) {
        return new t
    }), _d("@)@", ["$@!"], function(t) {
        return new t
    }), _d("$@@", ["#%^"], function(t) {
        return new t
    }), _d("$@#", ["@)#"], function(t) {
        return new t
    }), _d("@(&", ["$@$"], function(t) {
        return new t
    }), _d("$@%", ["@(("], function(t) {
        return new t
    }), _d("$@&", ["$@^"], function(t) {
        return new t
    }), _d("$@(", ["$@*"], function(t) {
        return new t
    }), _d("$@)", ["##!"], function(t) {
        return new t
    }), _d("#&&", ["##&", "##%", "@@"], function(t, e, n) {
        return n.showMobileUI ? new t : new e
    }), _d("$#!", ["@(^", "@@"], function(t, e) {
        if (e.showMobileUI || e.isTablet)
            return new t
    }), _d("@($", ["$#@"], function(t) {
        return new t
    }), _d("(#", ["@*#"], function(t) {
        return new t
    }), _d("$##", ["#&%"], function(t) {
        return new t
    }), _d("#!%", ["$#$"], function(t) {
        return new t
    }), _d("$#%", ["#@^"], function(t) {
        return new t
    }), _d("$#^", ["#&!", "@@"], function(t, e) {
        if (!e.isReplayMode())
            return new t
    }), _d("%@", ["$#&"], function(t) {
        return new t
    }), _d("$#*", ["#%("], function(t) {
        return new t
    }), _d("#@%", ["$#("], function(t) {
        return new t
    }), _d("#^(", ["$#)"], function(t) {
        return new t
    }), _d("(", ["$$!"], function(t) {
        return new t
    }), _d("$$@", ["#@@"], function(t) {
        return new t
    }), _d("$$#", ["#%)"], function(t) {
        return new t
    }), _d("##@", ["$$$"], function(t) {
        return new t
    }), _d("$$%", ["###"], function(t) {
        return new t
    }), _d("$$&", ["$$^"], function(t) {
        return (new t).generateLayout()
    }), _d("$$*", ["$@"], function(t) {
        return new t
    }), _d("$$(", ["#@$", "@@"], function(t, e) {
        if (!e.isDesktop && e.keepAwake)
            return new t
    }), _d("%", ["^*"], function(t) {
        return new t
    }), _d("$", ["&^"], function(t) {
        return new t
    }), _d("#^", ["&!"], function(t) {
        return new t
    }), _d("$%!", ["$$)"], function(t) {
        return new t
    }), _d("$%@", ["%^"], function(t) {
        return new t
    }), _d("$%#", ["@&"], function(t) {
        return new t
    }), _d("#*!", ["$%$"], function(t) {
        return new t
    }), _d("@$$", ["$%%"], function(t) {
        return new t
    }), _d("$%^", ["#*"], function(t) {
        return new t
    }), _d("$%&", ["@!"], function(t) {
        return new t
    }), _d("$%*", ["#^!"], function(t) {
        return new t
    }), _d("$%(", ["#@*"], function(t) {
        return new t
    }), _d("$%)", ["#@)", "@@"], function(t, e) {
        if (!e.isDesktop)
            return new t
    }), _d("#@&", ["@^*"], function(t) {
        return new t
    }), _d("$^!", ["^@"], function(t) {
        return new t
    }), _d("$&", ["&#"], function(t) {
        return new t
    }), _d("$^@", ["$("], function(t) {
        return new t
    }), _d("$^#", ["#!#"], function(t) {
        return new t
    }), _d("$^$", ["@)$"], function(t) {
        return new t
    }), _d("@))", ["$^%"], function(t) {
        return new t
    }), _d("$^^", ["#!@", "@#*"], function(t, e) {
        if (e.getLicense().hasComplianceBar())
            return new t
    }), _d("##)", ["$^&"], function(t) {
        return new t
    }), _d("$^*", ["#$#"], function(t) {
        return new t
    }), _d("#&*", ["$^("], function(t) {
        return new t
    }), _d("@#*", ["$^)"], function(t) {
        return new t
    }), _d("##*", ["$&!"], function(t) {
        return new t
    }), _d("$&@", ["##("], function(t) {
        return new t
    }), _d("&", ["@#!"], function(t) {
        return new t
    }), _d("$&$", ["$&#"], function(t) {
        return new t
    }), _d("$&%", ["#@!"], function(t) {
        return new t
    }), _d("$&#", ["!", "#", "@)^", "@@", "^!"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.bindAll(this), e.on("initRequestSequence/allStepsCompleted", this.onGameConfigLoaded, e.PRIORITY_HIGHEST, !0)
        }
        return s.prototype.onGameConfigLoaded = function(t) {
            this.isMaintenanceCarriedOn() ? this.displayMaintenancePopup() : t()
        }, s.prototype.isMaintenanceCarriedOn = function() {
            return "yes" === i.params.isDuringMaintenance
        }, s.prototype.displayMaintenancePopup = function() {
            new n({
                title: "Maintenance works ahead",
                message: "Apologies for any inconvenience caused",
                allowContinue: !1
            })
        }, s
    }), _d("$#@", ["^#", "^$", "^!"], function(t, e, n) {
        "use strict";
        function i() {
            e.call(this), this.update = !1, this.startRotationX = void 0, this.startRotationY = void 0, this.property("rotationX", 0), this.property("rotationY", 0)
        }
        return t.extend(i, e), i.prototype.getDeviceDirection = function(t) {
            var e = 0 <= window.orientation && 180 !== window.orientation ? -1 : 1;
            return e = n.isAndroid() ? -e : e, t && n.isPortraitMode() ? -e : e
        }, i.prototype.getRotationDiff = function() {
            return {
                x: this.rotationX - this.startRotationX || 0,
                y: this.rotationY - this.startRotationY || 0
            }
        }, i.prototype.getOrientationFactor = function() {
            return n.isPortraitMode() ? .5 : 1
        }, i
    }), _d("#($", ["^!", "@@", "$#", "!"], function(n, i, e, t) {
        "use strict";
        function o() {
            t.cache(this, "getNotLazyGameAssets"), t.cache(this, "getLazyGameAssets"), t.cache(this, "getSoundsToTriggerDucking"), t.cache(this, "getAllImageAssets"), t.cache(this, "getAnimationsAsMap"), t.cache(this, "getHighQualityIPadAssets"), this.spritesheetFramesCollection = {}
        }
        return o.prototype.getAssetsResolution = function(t) {
            var e = i.renderer instanceof PIXI.WebGLRenderer;
            return i.isDesktop && !n.isIE() ? 1 : i.isTablet && e && this.useHighQualityOnIPad(t) ? 1 : .5
        }, o.prototype.useHighQualityOnIPad = function(t) {
            if (!t)
                return !1;
            var e = this.getFileWithoutVersion(t);
            return 0 <= this.getHighQualityIPadAssets().indexOf("images/" + e) || 0 <= this.getHighQualityIPadAssets().indexOf(e)
        }, o.prototype.getHighQualityIPadAssets = function() {
            return ["images/preloader.png", "images/old_preloader.png", "images/splash_screen.png", "images/hud_mobile.png", "images/hud_desktop.png", "images/promo.png"]
        }, o.prototype.getResolutionFile = function(t) {
            var e = this.getAssetsResolution(t);
            return -1 === t.indexOf("@") && (t = t.replace(".png", e < 1 ? "@" + e + "x.png" : ".png"), this.isImageFileFromSpritesheet(t) && (t = t.replace(".jpg", e < 1 ? "@" + e + "x.jpg" : ".jpg"))), this.getFile(t)
        }, o.prototype.isImageFileFromSpritesheet = function(t) {
            return this.getAllImageAssets().indexOf(t) < 0
        }, o.prototype.getAllImageAssets = function() {
            return this.getGameAssets().concat(this.getSplashScreenAssets()).concat(this.getPreloaderAssets)
        }, o.prototype.getTranslatedFile = function(t) {
            return 0 <= t.indexOf(".png") || 0 <= t.indexOf(".json") || 0 <= t.indexOf(".css") ? t.substr(0, t.lastIndexOf(".")) + "_" + this.getTranslatedLangForFile(t) + t.substr(t.lastIndexOf(".")) : t
        }, o.prototype.getTranslatedLangForFile = function(t) {
            return i.localizeAssets() && e.FILELANG && e.FILELANG[t] && e.FILELANG[t][i.language] ? i.language : "en"
        }, o.prototype.getFile = function(t) {
            return e.FILEREV && e.FILEREV[t] ? e.FILEREV[t] : t
        }, o.prototype.getFileWithoutVersion = function(t) {
            return (t = (t = (t = t.replace(/(.*)\/([^\.]+)(.*)\.(.+)/, "$1/$2.$4")).replace("@0", "")).replace("_en.", ".")).replace("_" + i.language + ".", ".")
        }, o.prototype.getFonts = function() {
            return "ka" === i.language ? ["mediatornarrowbold"] : []
        }, o.prototype.getPreloaderAssets = function() {
            return ["images/preloader.json"]
        }, o.prototype.getSplashScreenAssets = function() {
            return ["images/splash_screen.json", "images/splash_screen_background.jpg"]
        }, o.prototype.getGameAssets = function() {
            return [i.showMobileUI ? "images/hud_mobile.json" : "images/hud_desktop.json", "images/symbols.json", "images/machine.json", "images/promo.json"]
        }, o.prototype.getMusic = function() {
            return ["sounds/music.mp3"]
        }, o.prototype.getSounds = function() {
            return ["sounds/spin.mp3", "sounds/reel_stop.mp3"]
        }, o.prototype.getBitmapFonts = function() {
            return [{
                spritesheet: "images/hud/ui.png",
                font: "images/ui.fnt"
            }]
        }, o.prototype.getAnimations = function() {
            return []
        }, o.prototype.getAnimationsAsMap = function() {
            for (var t = this.getAnimations(), e = {}, n = 0; n < t.length; n++) {
                var i = t[n].spritesheet;
                e[i] || (e[i] = []), e[i].push(t[n].animation)
            }
            return e
        }, o.prototype.isSpritesheetLazy = function(t) {
            return 0 <= this.getLazyGameAssets().indexOf(t)
        }, o.prototype.addLangPrefix = function(t) {
            return t.map(function(t) {
                return "string" == typeof t ? this.getTranslatedFile(t) : (t.file = this.getTranslatedFile(t.file), t)
            }.bind(this))
        }, o.prototype.getNotLazyGameAssets = function() {
            return this.getGameAssets().filter(function(t) {
                return t && "string" == typeof t
            })
        }, o.prototype.getLazyAssetsEvents = function() {
            return []
        }, o.prototype.getSoundsToTriggerDucking = function() {
            return this.getSounds().filter(function(t) {
                return "string" != typeof t && !0 === t.ducking
            }).map(function(t) {
                return t.file
            })
        }, o.prototype.getLazyGameAssets = function() {
            return this.getGameAssets().filter(function(t) {
                return t && "string" != typeof t && void 0 !== typeof t.condition
            })
        }, o.prototype.getParticleConfigs = function() {
            return []
        }, o.prototype.shouldUploadTextureOnStartup = function(t) {
            for (var e = this.getGameAssets(), n = 0; n < e.length; n++)
                if (null !== e[n] && "string" != typeof e[n] && e[n].file === t.replace(".png", ".json") && !0 === e[n].dontUpload)
                    return !1;
            return !0
        }, o
    }), _d("$@$", ["@(*", "&%", "$&^", "^$", "^#", "@@", "@#*"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a() {
            i.call(this), this.init(), n.readObject("autoplaySettingsModel", this), this.addListeners(), this.onSpinSpeedChanged()
        }
        return o.extend(a, i), a.prototype.getDefaultSpinSpeed = function() {
            return r.getLicense().hasMinSpinTime() ? 1 : .75
        }, a.prototype.init = function() {
            this.property("spinSpeed", this.getDefaultSpinSpeed()), this.property("stopAfterWin", !1), this.property("stopIfCashDecrease", !1), this.property("stopIfCashIncrease", !1), this.property("stopLoss", s.isLossLimitEnabled()), this.property("stopLossDifference", 0), this.property("stopLossThreshold", 0), this.property("cashDiffrenceIfDecrease", 0), this.property("cashDiffrenceIfIncrease", 0), this.property("stopThresholdIfDecrease", 0), this.property("stopThresholdIfIncrease", 0), this.property("stopThresholdIfWin", 0), this.property("stopIfFreespinsMode", !1), this.property("pressSpaceToSpin", !1)
        }, a.prototype.addListeners = function() {
            this.on("spinSpeed/changed", this.onSpinSpeedChanged), this.on("stopIfCashDecrease/changed", this.onCashDiffrenceChanged), this.on("stopIfCashIncrease/changed", this.onCashDiffrenceChanged), this.on("cashDiffrenceIfDecrease/changed", this.onCashDiffrenceChanged), this.on("cashDiffrenceIfIncrease/changed", this.onCashDiffrenceChanged), this.on("stopLossDifference/changed", this.onStopLossDiffrenceChanged), this.on("stopAfterWin/changed", this.save), this.on("stopIfCashIncrease/changed", this.save), this.on("stopThresholdIfWin/changed", this.save), this.on("stopIfFreespinsMode/changed", this.save), this.on("pressSpaceToSpin/changed", this.save)
        }, a.prototype.onStopLossDiffrenceChanged = function() {
            this.stopLoss && (this.stopLossThreshold = Number(t.balance) - Number(this.stopLossDifference))
        }, a.prototype.onCashDiffrenceChanged = function() {
            this.updateCashTresholds()
        }, a.prototype.updateCashTresholds = function() {
            this.stopIfCashDecrease && this.updateTresholdIfDecrease(), this.stopIfCashIncrease && this.updateTresholdIfIncrease(), this.save()
        }, a.prototype.updateTresholdIfDecrease = function() {
            this.stopThresholdIfDecrease = Number(t.balance) - Number(this.cashDiffrenceIfDecrease)
        }, a.prototype.updateTresholdIfIncrease = function() {
            this.stopThresholdIfIncrease = Number(t.balance) + Number(this.cashDiffrenceIfIncrease)
        }, a.prototype.onSpinSpeedChanged = function() {
            var t = e.clamp(this.spinSpeed, 0, 1);
            this.spinTimeFactor = .5 * (1 - t) + .5, this.minSpinningTime = 1 - t, this.save()
        }, a.prototype.save = function() {
            n.saveObject("autoplaySettingsModel", this.getDataToSave())
        }, a.prototype.getDataToSave = function() {
            return {
                spinSpeed: this.spinSpeed,
                stopAfterWin: this.stopAfterWin,
                stopIfCashDecrease: this.stopIfCashDecrease,
                stopIfCashIncrease: this.stopIfCashIncrease,
                cashDiffrenceIfDecrease: this.cashDiffrenceIfDecrease,
                cashDiffrenceIfIncrease: this.cashDiffrenceIfIncrease,
                stopThresholdIfDecrease: this.stopThresholdIfDecrease,
                stopThresholdIfIncrease: this.stopThresholdIfIncrease,
                stopThresholdIfWin: this.stopThresholdIfWin,
                stopIfFreespinsMode: this.stopIfFreespinsMode,
                pressSpaceToSpin: this.pressSpaceToSpin
            }
        }, a.prototype.showStopAutoSpinOnFreeSpins = function() {
            return !1
        }, a
    }), _d("#)^", ["^#", "^$", "@@"], function(t, e, n) {
        "use strict";
        function i() {
            e.call(this), this.property("autoSpinsLeft"), this.property("isDuringAutoSpins"), this.property("previousAutoSpinsIndex", 0), this.autoSpinsLeft = 0, this.isDuringAutoSpins = !1, this.on("autoSpinsLeft/changed", this.autoSpinsLeftChanged), n.isLossLimitEnabled() ? this.autoSpins = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] : this.autoSpins = [10, 25, 50, 75, 100, 250, 500, 750, 1e3, 1 / 0]
        }
        return t.extend(i, e), i.prototype.autoSpinsLeftChanged = function() {
            this.isDuringAutoSpins = 0 < this.autoSpinsLeft
        }, i.prototype.format = function(t) {
            var e = this.formatWithoutPostFix(t);
            return t === 1 / 0 ? e : e + this.getPostFix()
        }, i.prototype.formatWithoutPostFix = function(t) {
            return t === 1 / 0 ? "∞" : t.toString()
        }, i.prototype.getPostFix = function() {
            return n.isDesktop ? "" : "x"
        }, i.prototype.getMaximumAutoSpins = function() {
            return this.autoSpins[this.autoSpins.length - 1]
        }, i.prototype.getIndexOfSpins = function(t) {
            return this.autoSpins.indexOf(parseInt(t))
        }, i
    }), _d("#*^", ["^$", "^#", "@#%", "#"], function(t, e, n, i) {
        "use strict";
        function o() {
            t.call(this), this.property("balance", 0), this.property("lastWin", 0)
        }
        return e.extend(o, t), o.prototype.setBalance = function(t, e, n) {
            isNaN(t) || (this.balance = t, i.emit("balance/changed", t, e, n))
        }, o.prototype.setLastWin = function(t, e, n) {
            isNaN(t) || (this.lastWin = t, i.emit("lastWin/changed", t, e, n))
        }, o
    }), _d("#()", ["^#", "^$", "#@&"], function(t, e, n) {
        "use strict";
        function i() {
            e.call(this), this.property("bet"), this.defaultBet = null, this.availableBets = [], this.lastSelectedBet = null, this.on("bet/changed", this.onBetChanged)
        }
        return t.extend(i, e), i.prototype.setMaxBet = function() {
            this.isMaxBetSelected() ? this.selectLastSelected() : (n.add(n.MODEL_SET_MAX_BET), this.bet = this.getMaxBet())
        }, i.prototype.isMaxBetSelected = function() {
            return this.bet === this.getMaxBet()
        }, i.prototype.getMinBet = function() {
            return this.availableBets[0]
        }, i.prototype.getMaxBet = function() {
            return this.availableBets[this.availableBets.length - 1]
        }, i.prototype.selectLastSelected = function() {
            n.add(n.MODEL_SET_LAST_SELECTED_BET, this.lastSelectedBet, this.defaultBet), this.bet = this.lastSelectedBet || this.defaultBet
        }, i.prototype.selectDefault = function() {
            n.add(n.MODEL_SET_DEFAULT_BET, this.defaultBet), this.bet = this.defaultBet
        }, i.prototype.onBetChanged = function() {
            n.add(n.BET_CHANGED, this.bet), this.bet !== this.getMaxBet() && (this.lastSelectedBet = this.bet)
        }, i
    }), _d("$!(", ["!", "@)%", "#&@", "@$", "^", "@%"], function(e, o, n, i, s, r) {
        "use strict";
        function t() {
            e.bindAll(this), this.STATES = {
                STOPPED: 1,
                SPINNING: 2,
                STOPPING: 3
            }, this.columns = [];
            for (var t = 0; t < o.columns; t++)
                this.columns.push(this.STATES.STOPPED)
        }
        return t.prototype.canSpin = function(t) {
            return !n.isStickyColumn(t)
        }, t.prototype.isValid = function(t) {
            return 0 <= t && t < o.columns
        }, t.prototype.getNextSpinningColumn = function(t) {
            for (var e = s.getStoppingReelsOrder(), n = e.indexOf(t) + 1; n < o.columns; n++) {
                var i = e[n];
                if (this.isSpinning(i))
                    return i
            }
            return null
        }, t.prototype.isPreviousNotSpinning = function(t) {
            var e = s.getStoppingReelsOrder(),
                n = e.indexOf(t) - 1;
            return !(n <= 0) || this.isSpinning(e[n])
        }, t.prototype.forceStop = function() {
            r(this.stopTimeout);
            for (var t = s.getStoppingReelsOrder(), e = 0; e < this.columns.length; e++)
                s.setSpeedFactorForColumn(t[e], 1), this.columns[t[e]] === this.STATES.SPINNING && this.stopColumn(t[e])
        }, t.prototype.isSpinning = function(t) {
            return this.columns[t] === this.STATES.SPINNING
        }, t.prototype.startSpinning = function(t) {
            this.columns[t] = this.STATES.SPINNING
        }, t.prototype.stopColumn = function(t) {
            this.columns[t] = this.STATES.STOPPING
        }, t.prototype.shouldStop = function(t) {
            return this.columns[t] === this.STATES.STOPPING
        }, t.prototype.stopped = function(t) {
            this.columns[t] = this.STATES.STOPPED
        }, t.prototype.markNextToStop = function(t) {
            var e = this.getNextSpinningColumn(t);
            null !== e && this.columns[e] === this.STATES.SPINNING && (this.stopTimeout = i(this.stopColumn, s.getStopTimeForColumn(e), e))
        }, t.prototype.getLastSpinningColumn = function() {
            for (var t = s.getStoppingReelsOrder(), e = t.length - 1; 0 <= e; e--)
                if (this.isSpinning(t[e]))
                    return t[e];
            return null
        }, t.prototype.allStopped = function() {
            for (var t = 0; t < this.columns.length; t++)
                if (this.columns[t] !== this.STATES.STOPPED)
                    return !1;
            return !0
        }, t.prototype.isLastColumn = function(t) {
            return t === s.STOPPING_REELS_ORDER[o.columns - 1]
        }, t
    }), _d("$^%", ["^#", "^$"], function(t, e) {
        "use strict";
        function n() {
            e.call(this), this.property("gameDetails", null)
        }
        return t.extend(n, e), n.prototype.parse = function(t) {
            t && (this.gameDetails = t)
        }, n.prototype.hasGameDetails = function() {
            return !!this.gameDetails
        }, n.prototype.getGameDetails = function() {
            return this.gameDetails
        }, n
    }), _d("#)*", ["^$", "^#", "#)", "*", "#)@", "$%", "#@&", "@@"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {
            t.call(this), this.property("showCurrency"), this.property("displayedTotalBet"), this.on("showCurrency/changed", function() {
                r.add(r.SHOW_CURRENCY, this.showCurrency)
            }.bind(this))
        }
        return e.extend(h, t), h.prototype.init = function() {
            this.showCurrency = !a.isRewatch()
        }, h.prototype.toggle = function() {
            a.isRewatch() || a.hasCurrencyCoinsOption() && (this.showCurrency = !this.showCurrency)
        }, Object.defineProperty(h.prototype, "showCoins", {
            get: function() {
                return !this.showCurrency
            },
            set: function(t) {
                this.showCurrency = !t
            }
        }), h.prototype.formatTotalBet = function() {
            return this.showCurrency ? s.format(i.totalBet) : o.lines
        }, h.prototype.formatMoney = function(t) {
            return this.showCurrency ? s.format(Math.max(0, t)) : s.formatNumber(Math.max(0, this.getAmountInCoins(t)))
        }, h.prototype.getAmountInCoins = function(t) {
            return a.isRewatch() ? Math.round(t) : Math.round(t / n.bet)
        }, h
    }), _d("$#$", ["^#", "^$"], function(t, e) {
        "use strict";
        function n() {
            e.call(this), this.property("freeSpinsLeft"), this.property("isDuringFreeSpins"), this.clear()
        }
        return t.extend(n, e), n.prototype.parseNextSmallSpin = function(t) {
            (t.eventdata.hasOwnProperty("freeSpins") || this.isDuringFreeSpins) && (this.firstSpin = 1 === t.step, this.freeSpinsLeft = t.eventdata.freeSpins, this.freeSpinsAwarded = t.eventdata.freeSpinsAwarded)
        }, n.prototype.clear = function() {
            this.freeSpinsLeft = null, this.freeSpinsAwarded = null, this.firstSpin = null, this.isDuringFreeSpins = !1
        }, n.prototype.hasFreeSpins = function() {
            return this.freeSpinsLeft && 0 < this.freeSpinsLeft
        }, n.prototype.isFirstSpin = function() {
            return this.firstSpin
        }, n
    }), _d("$$)", ["$%", "&$"], function(e, n) {
        "use strict";
        function t() {}
        return t.prototype.parse = function(t) {
            t.forEach(function(t) {
                t.time = n.format(t.timestamp), t.betAmount = e.format(t.betAmount), t.wonAmount = e.format(t.wonAmount), t.initialBalance = e.format(t.initialBalance), t.finalBalance = e.format(t.finalBalance), t.type = "NORMAL" === t.type ? "N" : "P"
            }), this.rounds = t
        }, t
    }), _d("#*%", ["!", "$&&", "^!", "#!(", "%*", "@#*", ")"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a() {
            t.bindAll(this), this.params = e.parse(), this.gameId = this.getGameId(), this.gameName = this.getGameName(), this.authData = null, this.key = this.params.key || "", this.sessionId = this.params.sessid, this.clientInfoId = "", this.currency = this.params.currency || "", this.language = this.params.lang || "en", this.organization = this.params.org || "", this.baseURL = this.params.appsrv || "", this.baseStaticURL = window.location.protocol + "//" + window.location.host, this.wagerId = this.params.wagerid || "", this.userName = this.params.uid || "", this.password = this.params.pwd || "", this.channel = this.params.channel || "", this.channelID = this.params.channelID || "", this.channelSuffix = this.params.channelSuffix || "", this.backURL = this.params.home || "", this.depositURL = this.params.depositURL || "", this.depositType = this.params.depositType || "", this.clientHistoryURL = this.params.clientHistoryURL || "", this.realityCheckBackURL = this.params.realityCheckBackURL || "", this.topOrg = this.params.topOrg || "", this.rewatch = this.params.rewatch || "", this.shareOrg = this.params.shareOrg || "", this.enableLossLimit = this.params.enableLossLimit || "", this.clockAlwaysVisible = this.params.clockAlwaysVisible || "", this.boostIconsURL = this.params.boostIconsURL || "https://icons-boost.yggdrasilgaming.com", this.sendYggdrasilMetrics = "no" !== this.sendYggdrasilMetrics, this.keepAwake = "no" !== this.params.nosleep, this.keepAliveInterval = this.params.keepAliveInterval || "", this.keepAliveURL = this.params.keepAliveURL || "", this.reloadURL = this.params.reloadURL || "", this.boostURL = this.params.boostUrl || "", this.isMobile = n.isMobile(), this.isTablet = n.isTablet(), this.isDesktop = !this.isMobile && !this.isTablet, this.showMobileUI = this.isMobile && !this.isTablet || "true" === this.params.showMobileUI, this.showNewMobileUI = this.showMobileUI && this.hasNewMobileUI(), this.timeDiff = 0, this.MAX_IDLE_TIME = 3e5, this.errorLogEnabled = "true" === this.params.errorLogEnabled, this.disableCurrencyCoins = this.params.disableCurrencyCoins, this.potRequest = !1, s.setLicenseByName(this.params.license)
        }
        return a.prototype.getGameId = function() {
            return 0
        }, a.prototype.getGameName = function() {
            return ""
        }, a.prototype.getFormatedGameName = function() {
            return this.getGameName()
        }, a.prototype.getTranslationCategories = function() {
            return ["Slot/Shared"]
        }, a.prototype.isFullscreenOnDesktopEnabled = function() {
            return !(!this.params.fullscreen || "yes" !== this.params.fullscreen.toLowerCase()) && !this.showMobileUI && i.isFullscreenModeAvailable() && n.isTopFrame()
        }, a.prototype.isWebGL = function() {
            return this.renderer instanceof PIXI.WebGLRenderer
        }, a.prototype.isReplayMode = function() {
            return "" !== this.wagerId
        }, a.prototype.isCollectEnabled = function() {
            return !this.isReplayMode()
        }, a.prototype.parse = function(t, e, n) {
            this.campaignPayout = e.campaignPayout, this.gameHistoryEnabled = e.gameHistory, this.serverRealityCheckEnabled = e.serverRealityCheck, this.potRequest = this.potRequest || e.potRequest, this.iframeMessageParams = this.parseIframeMessageParams(n.iframeMessageParams), o.mixin(this.params, n)
        }, a.prototype.parseIframeMessageParams = function(t) {
            if (t && o.isJsonString(t))
                return JSON.parse(t)
        }, a.prototype.getScaleFactor = function() {
            return n.isTopFrame() && n.isAndroid() || !n.isTopFrame() && this.showMobileUI && r.hasClass(document.body, "cssScale") ? 2 : 1
        }, a.prototype.getMetaInitialScale = function() {
            return !n.isTopFrame() && !n.isAndroid() || n.isIPhone() ? .5 : 1
        }, a.prototype.isITLicense = function() {
            return "it" === this.params.license
        }, a.prototype.isLossLimitEnabled = function() {
            return "yes" === this.enableLossLimit.toLowerCase() || s.getLicense().hasLossLimit()
        }, a.prototype.isInnerClient = function() {
            return "yes" === this.params.innerClient
        }, a.prototype.isRewatch = function() {
            return "yes" === this.params.rewatch
        }, a.prototype.useOGG = function() {
            return !1
        }, a.prototype.showGameHistory = function() {
            return this.gameHistoryEnabled && !this.isReplayMode()
        }, a.prototype.setServerTime = function(t) {
            this.timeDiff = t - (new Date).getTime()
        }, a.prototype.getServerTime = function() {
            return (new Date).getTime() + this.timeDiff
        }, a.prototype.localizeAssets = function() {
            return "yes" === this.params.localiseAsset
        }, a.prototype.updateLastActivityTime = function() {
            this.lastActivityTime = this.getServerTime()
        }, a.prototype.exceedMaxIdleTime = function() {
            return this.getServerTime() - this.lastActivityTime > this.MAX_IDLE_TIME
        }, a.prototype.isTournamentRewatchAvailable = function() {
            return !1
        }, a.prototype.isTournamentRewatchEnabled = function() {
            return "no" !== this.params.leaderboardRewatch && this.isTournamentRewatchAvailable()
        }, a.prototype.isShareAvailable = function() {
            return !1
        }, a.prototype.isShareEnabled = function() {
            return "no" !== this.params.share && this.isShareAvailable() && !n.isNativeApp()
        }, a.prototype.useGameHistoryRedirectOnIOS = function() {
            return !1
        }, a.prototype.isInGameHistoryEnabled = function() {
            return !(this.isReplayFromIframeGame() && !this.isDesktop || this.useGameHistoryRedirectOnIOS() && n.isIOS())
        }, a.prototype.isAudioDisabledAtStart = function() {
            return this.isMobile
        }, a.prototype.getUserName = function() {
            return this.userName
        }, a.prototype.hasNewMobileUI = function() {
            return !1
        }, a.prototype.shouldClockBeAlwaysVisible = function() {
            return this.isDesktop && "yes" === this.clockAlwaysVisible || s.getLicense().hasClock()
        }, a.prototype.isAutoSpinsEnable = function() {
            return "yes" !== this.params.isAutoSpinsDisabled
        }, a.prototype.canStopSpin = function() {
            return !s.getLicense().hasMinSpinTime() && this.canSkip()
        }, a.prototype.shouldSendPotRequest = function() {
            return !this.isReplayMode() && !this.isRewatch() && !!this.potRequest
        }, a.prototype.hasCurrencyCoinsOption = function() {
            return "yes" !== this.disableCurrencyCoins
        }, a.prototype.getOperatorBurgerPages = function() {
            return this.params.burgerAddOns
        }, a.prototype.isRealityCheckWindowDisabled = function() {
            return "yes" === this.params.realityCheckDisabled
        }, a.prototype.canSkip = function() {
            return "yes" !== this.params.disableSkip
        }, a.prototype.isReplayFromIframeGame = function() {
            return "yes" === this.params.replayFromIframeGame
        }, a.prototype.showGameRules = function() {
            return "yes" !== this.disableGameRules
        }, a
    }), _d("$!@", ["!", "@@", "#@"], function(t, e, n) {
        "use strict";
        function i() {
            t.bindAll(this)
        }
        return i.prototype.getContent = function() {
            return this.filterAutoplay(this.getTranslation())
        }, i.prototype.getTranslation = function() {
            return n.has("gameRules_" + e.organization) ? n.get("gameRules_" + e.organization) : n.get("gameRules")
        }, i.prototype.filterAutoplay = function(t) {
            return t.replace(/\{autoplay\}/gi, e.isAutoSpinsEnable() ? this.getAutoplayRules() : "")
        }, i.prototype.getAutoplayRules = function() {
            var t = "gameRules_autoplay";
            return n.has(t) ? n.get(t) : ""
        }, i
    }), _d("$&(", ["^#", "$&*"], function(t, e) {
        "use strict";
        function n() {
            e.apply(this, arguments)
        }
        return t.extend(n, e), n.prototype.hasClock = function() {
            return !0
        }, n.prototype.hasLossLimit = function() {
            return !0
        }, n.prototype.hasGameName = function() {
            return !0
        }, n.prototype.hasPreloaderMessage = function() {
            return !0
        }, n.prototype.getPreloaderDelay = function() {
            return 5
        }, n
    }), _d("$&)", ["^#", "$&*"], function(t, e) {
        "use strict";
        function n() {
            e.apply(this, arguments)
        }
        return t.extend(n, e), n.prototype.getMinSpinTime = function() {
            return 2
        }, n
    }), _d("$&*", [], function() {
        "use strict";
        function t(t) {
            this._name = t
        }
        return Object.defineProperty(t.prototype, "name", {
            get: function() {
                return this._name
            }
        }), t.prototype.hasClock = function() {
            return !1
        }, t.prototype.hasLossLimit = function() {
            return !1
        }, t.prototype.hasGameName = function() {
            return !1
        }, t.prototype.hasPreloaderMessage = function() {
            return !1
        }, t.prototype.hasSessionAndTicketId = function() {
            return !1
        }, t.prototype.hasHiddenRealityCheckAmount = function() {
            return !1
        }, t.prototype.getMinSpinTime = function() {
            return 0
        }, t.prototype.hasMinSpinTime = function() {
            return 0 < this.getMinSpinTime()
        }, t.prototype.hasComplianceBar = function() {
            return !1
        }, t.prototype.hasPreloaderDelay = function() {
            return 0 < this.getPreloaderDelay()
        }, t.prototype.getPreloaderDelay = function() {
            return 0
        }, t
    }), _d("$*!", ["^#", "$&*"], function(t, e) {
        "use strict";
        function n() {
            e.apply(this, arguments)
        }
        return t.extend(n, e), n.prototype.hasClock = function() {
            return !0
        }, n.prototype.hasLossLimit = function() {
            return !0
        }, n.prototype.hasGameName = function() {
            return !0
        }, n.prototype.hasHiddenRealityCheckAmount = function() {
            return !0
        }, n.prototype.getMinSpinTime = function() {
            return 3
        }, n
    }), _d("$*@", ["^#", "$&*"], function(t, e) {
        "use strict";
        function n() {
            e.apply(this, arguments)
        }
        return t.extend(n, e), n.prototype.hasLossLimit = function() {
            return !0
        }, n.prototype.hasGameName = function() {
            return !0
        }, n.prototype.getMinSpinTime = function() {
            return 3
        }, n.prototype.hasComplianceBar = function() {
            return !0
        }, n
    }), _d("$*#", ["^#", "$&*"], function(t, e) {
        "use strict";
        function n() {
            e.apply(this, arguments)
        }
        return t.extend(n, e), n.prototype.hasSessionAndTicketId = function() {
            return !0
        }, n.prototype.hasComplianceBar = function() {
            return !0
        }, n
    }), _d("$*$", ["^#", "$&*"], function(t, e) {
        "use strict";
        function n() {
            e.apply(this, arguments)
        }
        return t.extend(n, e), n.prototype.hasClock = function() {
            return !0
        }, n.prototype.hasLossLimit = function() {
            return !0
        }, n.prototype.hasGameName = function() {
            return !0
        }, n.prototype.hasHiddenRealityCheckAmount = function() {
            return !1
        }, n.prototype.getMinSpinTime = function() {
            return 5
        }, n
    }), _d("$*%", ["^#", "$&*"], function(t, e) {
        "use strict";
        function n() {
            e.apply(this, arguments)
        }
        return t.extend(n, e), n.prototype.hasGameName = function() {
            return !0
        }, n.prototype.getMinSpinTime = function() {
            return 3
        }, n.prototype.hasLossLimit = function() {
            return !0
        }, n
    }), _d("$*^", ["^#", "$&*"], function(t, e) {
        "use strict";
        function n() {
            e.apply(this, arguments)
        }
        return t.extend(n, e), n.prototype.hasClock = function() {
            return !0
        }, n.prototype.hasLossLimit = function() {
            return !0
        }, n.prototype.hasGameName = function() {
            return !0
        }, n.prototype.hasHiddenRealityCheckAmount = function() {
            return !0
        }, n
    }), _d("$^)", ["$&*", "$*^", "$&(", "$*#", "$*!", "$*$", "$&)", "$*@", "$*%"], function(n, i, o, s, r, a, h, p, u) {
        "use strict";
        function t() {
            this.current = null
        }
        return t.prototype.setLicenseByName = function(t) {
            var e = {
                uk: i,
                it: s,
                dk: r,
                schhol: a,
                agcc: o,
                cz: h,
                es: p,
                se: u
            }[t] || n;
            this._current = new e(t)
        }, t.prototype.getLicense = function() {
            return this._current
        }, t.prototype.isUKLicense = function() {
            return "uk" === this.getLicense().name
        }, t.prototype.isITLicense = function() {
            return "it" === this.getLicense().name
        }, t.prototype.isESLicense = function() {
            return "es" === this.getLicense().name
        }, t
    }), _d("#)!", ["^#", "^$", "#))"], function(t, e, n) {
        "use strict";
        function i() {
            e.call(this), this.property("lines"), this.availableLines = null
        }
        return t.extend(i, e), i.prototype.getSelectedLinesAsString = function() {
            for (var t = "", e = 0; e < n.getNumberOfPaylines(); e++)
                t += e < this.lines ? "1" : "0";
            return t
        }, i
    }), _d("#(%", ["^#", "^$", "^", "$@&", "#(*", "@@"], function(t, e, i, n, o, s) {
        "use strict";
        function r() {
            e.call(this), this.columns = o.getColumns(), this.rows = o.getRows(), this.reels = [], this.currentReelsPositions = []
        }
        return t.extend(r, e), r.prototype.getCurrentSymbolAt = function(t, e) {
            var n = this.transformRow(t, this.currentReelsPositions[t] + e);
            return this.currentReels[t][n]
        }, r.prototype.getFinalSymbolAt = function(t, e) {
            return this.getFinalSymbolWithoutStickyAt(t, e)
        }, r.prototype.getFinalSymbolWithoutStickyAt = function(t, e) {
            var n = this.transformRow(t, i.finalReelsPosition[t] + e);
            return this.currentReels[t][n]
        }, r.prototype.getFinalSymbolWithStickyAt = function(t, e) {
            return i.getCurrentBet() ? i.getCurrentEventData().reels[t][e] : this.getFinalSymbolWithoutStickyAt(t, e)
        }, r.prototype.getNextSymbolAt = function(t) {
            return this.currentReelsPositions[t] = this.transformRow(t, this.currentReelsPositions[t] - 1), this.currentReels[t][this.currentReelsPositions[t]]
        }, r.prototype.transformRow = function(t, e) {
            for (; e < 0;)
                e += this.currentReels[t].length;
            for (; e > this.currentReels[t].length - 1;)
                e -= this.currentReels[t].length;
            return e
        }, r.prototype.isCurrentPositionFinal = function(t) {
            return i.finalReelsPosition && this.currentReelsPositions[t] === this.transformRow(t, i.finalReelsPosition[t] - 1)
        }, r.prototype.setFinalPositionAt = function(t) {
            this.currentReelsPositions[t] = i.finalReelsPosition[t] + this.rows
        }, Object.defineProperty(r.prototype, "currentReels", {
            get: function() {
                return this._currentReels
            },
            set: function(t) {
                this._currentReels !== t && (this._currentReels = t, this.currentReelsPositions = i.STARTING_REELS_POSITIONS.concat())
            }
        }), r.prototype.forEach = function(t) {
            for (var e = s.game.root.machine.symbolsContainer, n = 0; n < this.columns; n++)
                for (var i = 0; i < this.rows; i++)
                    t(n, i, this.getFinalSymbolAt(n, i), e.getSymbol(n, i))
        }, r.prototype.forEachInColumn = function(t, e) {
            for (var n = s.game.root.machine.symbolsContainer, i = 0; i < this.rows; i++)
                t(e, i, this.getFinalSymbolAt(e, i), n.getSymbol(e, i))
        }, r.prototype.addReels = function(t, e) {
            this.reels[t] = e
        }, r.prototype.setReels = function(t) {
            this.currentReels = this.reels[t]
        }, r.prototype.updateReels = function(t) {
            var e = t ? n.determineReelsFromRestore(t) : n.determineReels();
            if (!e)
                throw new Error("Could not determine reels");
            this.setReels(e)
        }, r
    }), _d("#(&", [], function() {
        "use strict";
        function t() {}
        return t.prototype.getColumns = function() {
            return 5
        }, t.prototype.getRows = function() {
            return 3
        }, t
    }), _d("#((", ["^#", "^$"], function(t, e) {
        "use strict";
        function n() {
            e.call(this), this.STATES = {
                IDLE: 1,
                SPINNING: 2,
                STOPPING: 3,
                FORCE_STOPPING: 4
            }, this.property("currentState", this.STATES.IDLE)
        }
        return t.extend(n, e), n.prototype.setSpinningState = function() {
            this.currentState = this.STATES.SPINNING
        }, n.prototype.setIdleState = function() {
            this.currentState = this.STATES.IDLE
        }, n.prototype.setStoppingState = function() {
            this.currentState = this.isForceStopping() ? this.currentState : this.STATES.STOPPING
        }, n.prototype.setForceStoppingState = function() {
            this.currentState = this.STATES.FORCE_STOPPING
        }, n.prototype.isIdle = function() {
            return this.currentState === this.STATES.IDLE
        }, n.prototype.isSpinning = function() {
            return this.currentState === this.STATES.SPINNING
        }, n.prototype.isStopping = function() {
            return this.isForceStopping() || this.currentState === this.STATES.STOPPING
        }, n.prototype.isForceStopping = function() {
            return this.currentState === this.STATES.FORCE_STOPPING
        }, n
    }), _d("#(^", ["!", "^!"], function(t, e) {
        "use strict";
        function n() {
            t.bindAll(this), this.orientation = "", this.PORTRAIT = "portrait", this.LANDSCAPE = "landscape", this.initMobileSpinsAmount()
        }
        return n.prototype.setOrientation = function() {
            this.orientation = e.isPortraitMode() ? this.PORTRAIT : this.LANDSCAPE
        }, n.prototype.initMobileSpinsAmount = function() {
            this.mobileSpinsAmount = {}, this.mobileSpinsAmount[this.PORTRAIT] = 0, this.mobileSpinsAmount[this.LANDSCAPE] = 0
        }, n.prototype.changeMobileSpinsAmount = function() {
            this.mobileSpinsAmount[this.orientation]++
        }, n.prototype.getPortraitSpinsAmount = function() {
            return this.mobileSpinsAmount[this.PORTRAIT]
        }, n.prototype.getTotalMobileSpinsAmount = function() {
            return this.mobileSpinsAmount[this.PORTRAIT] + this.mobileSpinsAmount[this.LANDSCAPE]
        }, n.prototype.clear = function() {
            this.initMobileSpinsAmount()
        }, n
    }), _d("$@*", ["#))", "#)(", "@)%", "^"], function(r, t, n, e) {
        "use strict";
        function i() {
            this.nearWinPaylines = [], this.nearWinColumns = {}
        }
        return i.prototype.parseNextSmallSpin = function() {
            e.hasFinalReels() && (this.nearWinPaylines = [], this.nearWinColumns = {}, this.checkNearWins(r.getLeftPaylinesIds(), [0, 1], 3), this.checkNearWins(r.getRightPaylinesIds(), [3, 4], 1))
        }, i.prototype.checkNearWins = function(t, e, n) {
            for (var i = 0; i < t.length; ++i) {
                var o = t[i];
                this.hasNearWin(o, e) && (this.nearWinPaylines.push(o), this.nearWinColumns[o] = e.concat(), this.checkOptionlColumn(o, n) && this.nearWinColumns[o].push(n))
            }
        }, i.prototype.hasNearWin = function(t, e) {
            for (var n = r.getPayline(t), i = this.getSymbolAt(e[0], n[e[0]]), o = 1; o < e.length; o++) {
                var s = e[o];
                if (i !== this.getSymbolAt(s, n[s]))
                    return !1
            }
            return !0
        }, i.prototype.checkOptionlColumn = function(t, e) {
            var n = r.getPayline(t),
                i = this.nearWinColumns[t][0];
            return this.getSymbolAt(i, n[i]) === this.getSymbolAt(e, n[e])
        }, i.prototype.getSymbolAt = function(t, e) {
            return n.getFinalSymbolAt(t, e)
        }, i.prototype.hasNearWins = function() {
            return 0 < this.nearWinPaylines.length
        }, i.prototype.hasLeftNearWins = function() {
            return 0 < this.getLeftNearWins().length
        }, i.prototype.hasRightNearWins = function() {
            return 0 < this.getRightNearWins().length
        }, i.prototype.isNearWinOnPayline = function(t) {
            return -1 < this.nearWinPaylines.indexOf(t)
        }, i.prototype.isNearWinOnColumnPayline = function(t, e) {
            return !!this.isNearWinOnPayline(t) && -1 < this.nearWinColumns[t].indexOf(e)
        }, i.prototype.getAllNearWins = function() {
            return this.nearWinPaylines
        }, i.prototype.getLeftNearWins = function() {
            return this.nearWinPaylines.filter(function(t) {
                return r.isPaylineFromLeft(t)
            })
        }, i.prototype.getRightNearWins = function() {
            return this.nearWinPaylines.filter(function(t) {
                return r.isPaylineFromRight(t)
            })
        }, i.prototype.getNearWinSymbols = function(t) {
            for (var e = r.getPayline(t), n = this.nearWinColumns[t], i = [], o = 0; o < n.length; o++)
                i.push({
                    column: n[o],
                    row: e[n[o]]
                });
            return i
        }, i.prototype.clear = function() {
            this.nearWinPaylines = [], this.nearWinColumns = {}
        }, i
    }), _d("$&!", ["%)", "^!", "#@"], function(e, n, t) {
        "use strict";
        function i() {
            this._config = {}, this._channel = "pc", this._parsed = !1
        }
        return i.prototype.parse = function(t) {
            var e = t;
            this._config = this._getBasicConfig(), t.auxiliaryData ? e = t.auxiliaryData.popupMessage : t.wager && (e = t.wager.auxiliaryData.popupMessage), this._config.title = e.title, this._config.message = e.content, e.buttons.length && (this._config.buttons = e.buttons, this._config.buttons.forEach(this._prepareButtonAction)), this.channel = e.channel.toLowerCase(), this._parsed = !!this._config.title || !!this._config.message
        }, i.prototype.canShowPopup = function() {
            var t = n.isMobile();
            return !(!this._parsed || !this.channel) && ("both" === this.channel || ("mobile" === this.channel ? t : !t))
        }, i.prototype.clear = function() {
            this._config = this._getBasicConfig(), this.channel = null, this._parsed = !1
        }, i.prototype._getBasicConfig = function() {
            return {
                title: "",
                message: "",
                buttons: [{
                    label: t.get("operator_message_button_close"),
                    action: function() {},
                    hideWindow: !0
                }]
            }
        }, i.prototype._prepareButtonAction = function(t) {
            t.hideWindow = !0, "REDIRECT" === t.actionType && (t.action = function() {
                e.openNewTab(t.url)
            })
        }, Object.defineProperty(i.prototype, "popupConfig", {
            get: function() {
                return this._config
            }
        }), Object.defineProperty(i.prototype, "channel", {
            get: function() {
                return this._channel
            },
            set: function(t) {
                this._channel = "pc" !== t && "mobile" !== t && "both" !== t ? null : t
            }
        }), i
    }), _d("$$$", ["^!"], function(t) {
        "use strict";
        function e() {}
        return e.prototype.shouldDestroyOnUnload = function() {
            return t.isFirefox()
        }, e
    }), _d("#)(", [], function() {
        "use strict";
        function n() {
            this.paylines = [], this.paylinesOrientations = []
        }
        return n.ORIENTATION_RIGHT = "RL", n.ORIENTATION_LEFT = "LR", n.ORIENTATION_ANY = "Any", n.prototype.getNumberOfPaylines = function() {
            return this.paylines.length
        }, n.prototype.getPayline = function(t) {
            return this.paylines[t]
        }, n.prototype.isPaylineFromRight = function(t) {
            return this.paylinesOrientations[t] === n.ORIENTATION_RIGHT || this.paylinesOrientations[t] === n.ORIENTATION_ANY
        }, n.prototype.isPaylineFromLeft = function(t) {
            return this.paylinesOrientations[t] === n.ORIENTATION_LEFT || this.paylinesOrientations[t] === n.ORIENTATION_ANY
        }, n.prototype.getPaylineOrientation = function(t) {
            return this.paylinesOrientations[t]
        }, n.prototype.isValidOrientation = function(t, e) {
            return this.paylinesOrientations[t] === e || this.paylinesOrientations[t] === n.ORIENTATION_ANY
        }, n.prototype.getRightPaylinesIds = function() {
            return this.getPaylinesIdsByOrientation(n.ORIENTATION_RIGHT)
        }, n.prototype.getLeftPaylinesIds = function() {
            return this.getPaylinesIdsByOrientation(n.ORIENTATION_LEFT)
        }, n.prototype.getPaylinesIdsByOrientation = function(t) {
            for (var e = [], n = 0; n < this.paylines.length; ++n)
                this.isValidOrientation(n, t) && e.push(n);
            return e
        }, n.prototype.isValidPayline = function(t) {
            return 0 <= t && t < this.paylines.length
        }, n
    }), _d("$^&", ["!"], function(t) {
        "use strict";
        function e() {
            t.bindAll(this), this.minPot = .01, this.maxPot = 1e3, this.pot = 0, this.startBalance = 0
        }
        return e.prototype.setStartBalance = function(t) {
            this.startBalance = t, this.setPot(t)
        }, e.prototype.getMinPot = function() {
            return this.minPot
        }, e.prototype.getMaxPot = function() {
            return Math.min(this.startBalance, this.maxPot)
        }, e.prototype.setPot = function(t) {
            var e = Math.floor(100 * t) / 100;
            return this.pot = Math.min(Math.max(e, this.getMinPot()), this.getMaxPot()), this.pot
        }, e.prototype.increasePot = function(t) {
            var e = this.pot + t * this.getMaxPot();
            return this.setPot(e)
        }, e.prototype.decreasePot = function(t) {
            var e = this.pot - t * this.getMaxPot();
            return this.setPot(e)
        }, e
    }), _d("#*)", ["@(*", "@@", "!"], function(e, n, t) {
        "use strict";
        function i() {
            t.bindAll(this), this.initialBalance = null, this.initialTime = null, this.serverTimeElapsed = null, this.gamingWinLoss = null, this.sportsWinLoss = null
        }
        return i.prototype.getElapsed = function() {
            var t = n.params.reminderElapsed;
            return void 0 !== t ? 60 * parseInt(t, 10) % this.getInterval() : 0
        }, i.prototype.getInterval = function() {
            var t = n.params.reminderInterval;
            return void 0 !== t ? 60 * parseInt(t, 10) : 3600
        }, i.prototype.getFirstInterval = function() {
            return this.getInterval() - this.getElapsed()
        }, i.prototype.isActive = function() {
            return !n.isReplayMode() && 0 < this.getInterval()
        }, i.prototype.start = function() {
            this.initialBalance = e.balance, this.initialTime = (new Date).getTime()
        }, i.prototype.getBalanceDifference = function() {
            var t = e.balance - this.initialBalance;
            return this.serverBalanceDifference && (t = this.serverBalanceDifference), t
        }, i.prototype.getMinutesPassed = function() {
            if (this.serverTimeElapsed)
                return this.serverTimeElapsed;
            var t = Math.round(((new Date).getTime() - this.initialTime) / 1e3 / 60);
            return Math.max(1, t)
        }, i
    }), _d("$@^", ["^"], function(e) {
        "use strict";
        function t() {
            this.reels = this.getReels()
        }
        return t.prototype.getReels = function() {
            return ["Reels"]
        }, t.prototype.determineReels = function(t) {
            return (t = t || e.getCurrentBet()) && t.eventdata.reelSet ? t.eventdata.reelSet : this.getDefaultReelsName()
        }, t.prototype.determineReelsFromRestore = function(t) {
            return this.determineReels(t)
        }, t.prototype.getDefaultReelsName = function() {
            return "Reels"
        }, t
    }), _d("$@!", ["^", "@(*", "@)%", "#)", "%*", "#@&"], function(e, n, t, i, o, s) {
        "use strict";
        function r() {
            this.rawData = null, this.wagers = [], this.currentWager = -1
        }
        return r.prototype.getBets = function() {
            return this.rawData.data[0].bets
        }, r.prototype.getLastBet = function() {
            var t = this.getBets();
            return t[t.length - 1]
        }, r.prototype.getFirstBet = function() {
            return this.getBets()[0]
        }, r.prototype.parse = function(t) {
            this.reset(), this.rawData = o.clone(t);
            var e = this.parseWagersData(this.getBets());
            this.parseBalance(), this.populateWagers(e)
        }, r.prototype.parseBalance = function() {
            if (this.getInitialBalance() && (n.setBalance(this.getInitialBalance(), !1, 0), !this.isPromoSpin())) {
                var t = parseFloat(this.getFirstBet().betamount);
                this.rawData.resultBal = {
                    cash: this.getInitialBalance() - t
                }
            }
        }, r.prototype.populateWagers = function(t) {
            return this.populateWagersWhichAreNotFreespins(t)
        }, r.prototype.populateWagersWhichAreNotFreespins = function(t) {
            for (var e = [], n = 0; n < t.length; n++)
                e.push(t[n]), t[n].eventdata.freeSpins || (this.wagers.push(e), e = [])
        }, r.prototype.populateAllWagers = function(t) {
            if (0 < t.length) {
                var e = t[t.length - 1];
                "C" === e.betdata.cmd ? this.wagers = [t.slice(0, t.length - 1), [e]] : this.wagers = [t]
            }
        }, r.prototype.parseWagersData = function(t) {
            for (var e = [], n = 0; n < t.length; ++n)
                (t[n].eventdata.rpos || "C" === t[n].betdata.cmd) && e.push(t[n]);
            return e
        }, r.prototype.hasReplayWager = function() {
            return this.currentWager < this.wagers.length - 1
        }, r.prototype.getCurrentWager = function() {
            return this.wagers[this.currentWager]
        }, r.prototype.prepareReplay = function() {
            this.setNextWager()
        }, r.prototype.setNextWager = function() {
            this.currentWager++;
            var t = this.getCurrentWager();
            this.rawData.wager.bets = t, e.parse(this.rawData), s.add(s.REPLAY_SET_NEXT_WAGER), i.bet = Number(t[0].betdata.coin)
        }, r.prototype.reset = function() {
            this.currentWager = -1
        }, r.prototype.clear = function() {
            this.rawData = null, this.wagers = [], this.currentWager = -1
        }, r.prototype.hasCollectCommandInNextBet = function() {
            return !!this.hasReplayWager() && "C" === this.wagers[this.currentWager + 1][0].betdata.cmd
        }, r.prototype.hasCollectCommand = function() {
            return 0 < this.wagers.length && "C" === this.wagers[this.currentWager][0].betdata.cmd
        }, r.prototype.getTime = function() {
            return this.rawData.data[0].timestamp
        }, r.prototype.getInitialBalance = function() {
            if (this.getFirstBet().eventdata.initialBalance)
                return parseFloat(this.getFirstBet().eventdata.initialBalance)
        }, r.prototype.getFinalBalance = function() {
            if (this.getFirstBet().eventdata.resultBalance)
                return parseFloat(this.getFirstBet().eventdata.resultBalance)
        }, r.prototype.isPromoSpin = function() {
            return this.rawData && !!this.rawData.wager.promotion.promotionType
        }, r.prototype.getWagerStatus = function() {
            return this.rawData.wager.status
        }, r.prototype.hasStatusFinished = function() {
            return "Finished" === this.getWagerStatus()
        }, r.prototype.getTotalWonAmount = function() {
            return this.getLastBet().wonamount
        }, r.prototype.hasData = function() {
            return null !== this.rawData
        }, r
    }), _d("$#&", ["^#", "$@!"], function(t, e) {
        "use strict";
        function n() {
            e.call(this)
        }
        return t.extend(n, e), n.prototype.hasPendingSpinToRestore = function() {
            return this.hasReplayWager() && this.hasStatusPending()
        }, n.prototype.getWagerStatus = function() {
            return this.rawData.wager.status
        }, n.prototype.hasStatusPending = function() {
            return "Pending" === this.getWagerStatus()
        }, n
    }), _d("$#(", ["^#", "^$"], function(t, e) {
        "use strict";
        function n() {
            e.call(this), this.property("allowSkip", !1), this.skipPresentation = !1
        }
        return t.extend(n, e), n
    }), _d("#*&", ["^#", "!", "$&^", "@#$", "@@", "#", "^$", "@$@", "^)", "^!"], function(t, e, n, i, o, s, r, a, h, p) {
        "use strict";
        function u() {
            r.call(this), this.saveEnabled = !0, this.property("globalVolume", o.isAudioDisabledAtStart() ? 0 : 1), this.property("soundsEnabled", !0), this.property("musicEnabled", !0), this.property("musicVolume", 1), n.readObject("audio", this), this.lastGlobalVolume = 0 < this.globalVolume ? this.globalVolume : 1, this.on("globalVolume/changed", this.onGlobalVolumeChanged), this.on("soundsEnabled/changed", this.save), this.on("musicEnabled/changed", this.save), this.primaryExtension = null, createjs.Sound.initializeDefaultPlugins(), o.useOGG() && this.useOGG(), this.loadedSounds = []
        }
        return t.extend(u, r), u.prototype.save = function() {
            this.saveEnabled && n.saveObject("audio", {
                globalVolume: o.isAudioDisabledAtStart() ? 0 : this.globalVolume,
                soundsEnabled: this.soundsEnabled,
                musicEnabled: this.musicEnabled
            })
        }, u.prototype.onGlobalVolumeChanged = function() {
            0 !== this.globalVolume && (this.lastGlobalVolume = this.globalVolume), this.save()
        }, u.prototype.loadAll = function(t, n) {
            for (var i = h.clone(t), o = this.loadedSounds, s = function(t) {
                    var e = i.indexOf(t.id);
                    0 <= e && (i.splice(e, 1), h.pushUnique(o, t.id), 0 === i.length && (createjs.Sound.off("fileload", s), n && n()))
                }, e = 0; e < t.length; e++)
                createjs.Sound.registerSound(a.getFile(this.updateExtension(t[e])), t[e]);
            createjs.Sound.on("fileload", s)
        }, u.prototype.updateExtension = function(t) {
            return this.primaryExtension ? t.replace(/\.[\w]*$/, "." + this.primaryExtension) : t
        }, u.prototype.getOrCreate = function(t) {
            return createjs.Sound.createInstance(t)
        }, u.prototype.onGameHidden = function() {
            this.wasEnabledBeforeHidden = this.enabled, this.enabled = !1
        }, u.prototype.onGameShown = function() {
            this.enabled = this.wasEnabledBeforeHidden
        }, u.prototype.toggle = function() {
            this.enabled = !this.enabled
        }, Object.defineProperty(u.prototype, "enabled", {
            get: function() {
                return 0 !== this.globalVolume
            },
            set: function(t) {
                this.globalVolume = t ? this.lastGlobalVolume : 0
            }
        }), u.prototype.setAlternateExtensions = function(t) {
            createjs.Sound.alternateExtensions = t
        }, u.prototype.setPrimaryExtension = function(t) {
            this.primaryExtension = t
        }, u.prototype.useOGG = function() {
            this.isOGGSupported() && (this.setAlternateExtensions(["mp3"]), this.setPrimaryExtension("ogg"))
        }, u.prototype.isOGGSupported = function() {
            return !(!createjs.Sound.capabilities || p.isEdge() || !createjs.Sound.capabilities.ogg)
        }, u.prototype.getLoadedSounds = function() {
            return this.loadedSounds
        }, u.prototype.isSoundLoaded = function(t) {
            return 0 <= this.getLoadedSounds().indexOf(t)
        }, u.prototype.removeSound = function(t) {
            createjs.Sound.removeSound(t), this.loadedSounds.splice(this.loadedSounds.indexOf(t), 1)
        }, u
    }), _d("$#)", ["#^%", "#^#", "@)%", "^"], function(i, n, o, t) {
        "use strict";
        function e() {}
        return e.prototype.getNumberOfScatters = function(t) {
            t = void 0 !== t ? t : o.columns - 1;
            for (var e = 0, n = 0; n <= t; n++)
                i.hasSymbolOnColumn(this.getScatterName(), n) && e++;
            return e
        }, e.prototype.getLastColumnWithScatter = function() {
            for (var t = o.columns - 1; 0 <= t; t--)
                if (i.hasSymbolOnColumn(this.getScatterName(), t))
                    return t;
            return null
        }, e.prototype.getColumnSpeed = function() {
            return .7
        }, e.prototype.getSpinificationTime = function() {
            return 1.6
        }, e.prototype.isSpinificationColumn = function(t, e) {
            return !!n.isValid(t) && this.hasMinNumberOfScatters(t - 1, e)
        }, e.prototype.hasSpinificationAfterColumn = function(t, e) {
            return !!n.isValid(t) && !!n.getNextSpinningColumn(t) && this.hasMinNumberOfScatters(t, e)
        }, e.prototype.hasMinNumberOfScatters = function(t, e) {
            return e = void 0 !== e ? e : this.getMinNumberOfSymbols(), this.getNumberOfScatters(t) >= e
        }, e.prototype.getNumberOfSpinificationColumns = function(t) {
            var e = 0;
            t = t || this.getMinNumberOfSymbols();
            for (var n = 0; n < o.columns; n++) {
                var i = this.getNumberOfScatters(n - 1);
                1 < i && i <= t && e++
            }
            return e
        }, e.prototype.getMinNumberOfSymbols = function() {
            return 2
        }, e.prototype.getScatterName = function() {
            return "SYM0"
        }, e
    }), _d("#)$", ["!", "@(&", "@@", "^)", "@))", "#(*", "@#*"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a() {
            t.bindAll(this), this.STARTING_REELS_POSITIONS = [0, 0, 0, 0, 0], this.STOPPING_REELS_ORDER = [0, 1, 2, 3, 4], this.finalReelsPosition = this.STARTING_REELS_POSITIONS.concat(), this.columnSpeedFactors = [1, 1, 1, 1, 1], this.clear()
        }
        return a.prototype.clear = function() {
            this.bets = [], this.currentBet = 0, this.data = null
        }, a.prototype.error = function() {
            this.finalReelsPosition = this.STARTING_REELS_POSITIONS.concat()
        }, a.prototype.parse = function(t) {
            this.data = t, this.bets = t.wager.bets, this.currentBet = -1, o.parse(t.wager.auxiliaryData)
        }, a.prototype.appendBetsAndParse = function(t) {
            this.data = t, this.bets = this.bets.concat(t.wager.bets)
        }, a.prototype.getTimeToStopMachine = function() {
            var t = (new Date).getTime() - this.startTime;
            return Math.max(0, this.minSpinningTime - t / 1e3)
        }, a.prototype.resetTimes = function() {
            this.minSpinningTime = e.minSpinningTime;
            var t = this.getStopTime();
            this.columnStopTimes = [.05, t, t, t, t], this.columnSpeedFactors = [1, 1, 1, 1, 1]
        }, a.prototype.getStopTime = function() {
            return 1 - e.spinSpeed
        }, a.prototype.hasNextSpin = function() {
            return this.currentBet + 1 < this.bets.length
        }, a.prototype.hasManySmallSpins = function() {
            return 1 < this.bets.length
        }, a.prototype.getCurrentBet = function() {
            return this.bets[this.currentBet]
        }, a.prototype.getFirstBet = function() {
            return this.bets[0]
        }, a.prototype.getLastBet = function() {
            return this.bets[this.bets.length - 1]
        }, a.prototype.getCurrentEventData = function() {
            return this.bets[this.currentBet].eventdata
        }, a.prototype.isFirstSmallSpin = function() {
            return 0 === this.currentBet
        }, a.prototype.isLastSmallSpin = function() {
            return this.currentBet + 1 === this.bets.length
        }, a.prototype.getStoppingReelsOrder = function() {
            return this.STOPPING_REELS_ORDER
        }, a.prototype.getStopTimeForColumn = function(t) {
            return Math.max(this.getMinStopTimeForColumn(), this.columnStopTimes[t])
        }, a.prototype.getMinStopTimeForColumn = function() {
            if (r.getLicense().hasMinSpinTime()) {
                var t = r.getLicense().getMinSpinTime() / (s.getColumns() + 1);
                return e.spinSpeed * t
            }
            return 0
        }, a.prototype.getWagerId = function() {
            return this.data.wager.wagerid
        }, a.prototype.shouldSendCollect = function() {
            return n.isCollectEnabled() && "C" === this.getLastBet().eventdata.nextCmds
        }, a.prototype.skipToLastBet = function() {
            this.currentBet = this.bets.length - 1
        }, a.prototype.skipToNextBet = function() {
            this.currentBet++
        }, a.prototype.updateFinalReelPositions = function(t) {
            var e = (t = t || this.getCurrentBet()).eventdata.rpos;
            e && (this.finalReelsPosition = i.clone(e))
        }, a.prototype.getSpeedFactorForColumn = function(t) {
            return this.columnSpeedFactors[t]
        }, a.prototype.setSpeedFactorForColumn = function(t, e) {
            this.columnSpeedFactors[t] = e
        }, a.prototype.getData = function() {
            return this.data
        }, a.prototype.hasData = function() {
            return null !== this.data
        }, a.prototype.hasFinalReels = function() {
            return !!this.finalReelsPosition
        }, a.prototype.getBalance = function() {
            if (this.data && this.data.resultBal)
                return parseFloat(this.data.resultBal.cash)
        }, a.prototype.getCurrentStep = function() {
            return this.getCurrentBet().step
        }, a.prototype.getNextBet = function() {
            return this.bets[this.currentBet + 1]
        }, a.prototype.saveStartTime = function() {
            this.startTime = (new Date).getTime()
        }, a.prototype.getTimeFromStart = function() {
            return ((new Date).getTime() - this.startTime) / 1e3
        }, a
    }), _d("#)%", ["$^", "#!%", "@)%", "^", "$@(", "#&@", "@@", "%"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {}
        return h.prototype.parseNextSmallSpin = function() {
            i.skipToNextBet(), i.updateFinalReelPositions(), n.updateReels(), t.parseNextSmallSpin(i.getCurrentEventData().wtw, void 0 !== i.getCurrentEventData().accWa ? i.getCurrentEventData().accWa : i.getCurrentBet().woncoins, i.getCurrentEventData()), e.parseNextSmallSpin(i.getCurrentBet()), o.parseNextSmallSpin(), s.parseNextSmallSpin(i.getCurrentEventData().stickyB, i.getCurrentEventData().stickyA, i.getCurrentEventData().stickyN)
        }, h.prototype.parseSpinEnd = function() {
            i.hasData() && (t.parseSpinEnd(), a.parseState(i.getData().missionState))
        }, h.prototype.parseSpinDefiniteEnd = function() {
            r.updateLastActivityTime(), s.clear()
        }, h.prototype.error = function() {
            i.error(), t.clear()
        }, h.prototype.clear = function() {
            i.clear(), e.clear()
        }, h
    }), _d("$%%", ["^$", "^#", "$&^", "@@", "@$@"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.call(this), this.property("showSplashScreen", !0), n.readObject("splashScreen", this), this.on("showSplashScreen/changed", this.save)
        }
        return e.extend(s, t), s.prototype.save = function() {
            n.saveObject("splashScreen", {
                showSplashScreen: this.showSplashScreen
            })
        }, s.prototype.isSplashScreenAvailable = function() {
            return 0 < o.getSplashScreenAssets().length && !i.isReplayMode()
        }, s
    }), _d("$!*", ["@)%"], function(r) {
        "use strict";
        function t() {
            this.clear()
        }
        return t.prototype.parseNextSmallSpin = function(t, e, n) {
            this.newStickyPositions = [], this.stickyAfter = [];
            for (var i = 0; i < r.columns; i++) {
                this.stickyAfter[i] = this.stickyAfter[i] || [], this.stickyBefore[i] = this.stickyBefore[i] || [];
                for (var o = 0; o < r.rows; o++) {
                    var s = i * r.rows + o;
                    e && "1" === e.charAt(s) && (this.stickyAfter[i][o] || (this.stickyAfter[i][o] = !0)), t && "1" === t.charAt(s) && (this.stickyBefore[i][o] = !0), n && "1" === n.charAt(s) && this.newStickyPositions.push({
                        column: i,
                        row: o
                    })
                }
            }
        }, t.prototype.hasStickySymbol = function(t, e, n) {
            var i = n ? this.stickyBefore : this.stickyAfter;
            return !(!i || !i[t] || !i[t][e])
        }, t.prototype.getNewSymbolsPosition = function() {
            return this.newStickyPositions
        }, t.prototype.isStickyColumn = function(t, e) {
            for (var n = 0; n < r.rows; n++)
                if (!this.hasStickySymbol(t, n, e))
                    return !1;
            return !0
        }, t.prototype.getStickyColumns = function(t) {
            var e = [];
            if (!this.stickyAfter)
                return e;
            for (var n = 0; n < r.columns; n++)
                this.isStickyColumn(n, t) && e.push(n);
            return e
        }, t.prototype.hasStickyColumns = function() {
            return 0 < this.getStickyColumns().length
        }, t.prototype.clear = function() {
            this.stickyAfter = [], this.stickyBefore = [], this.newStickyPositions = []
        }, t.prototype.getNumberOfStickySymbols = function(n) {
            var i = 0;
            return r.forEach(function(t, e) {
                this.hasStickySymbol(t, e, n) && i++
            }.bind(this)), i
        }, t
    }), _d("$^(", ["^$", "^#"], function(t, e) {
        "use strict";
        function n() {
            t.call(this), this.property("enabled", !0)
        }
        return e.extend(n, t), n
    }), _d("#)&", ["@)%"], function(s) {
        "use strict";
        function t() {
            this.symbols = {}, this.TYPE_NORMAL = "N", this.TYPE_SCATTER = "S", this.TYPE_WILD = "W"
        }
        return t.prototype.isNormal = function(t) {
            return this.symbols[t].type === this.TYPE_NORMAL
        }, t.prototype.isScatter = function(t) {
            return this.symbols[t].type === this.TYPE_SCATTER
        }, t.prototype.isWild = function(t) {
            return this.symbols[t].type === this.TYPE_WILD
        }, t.prototype.getSymbolPrizes = function(t) {
            return this.symbols[t].prizes
        }, t.prototype.getNumberOfColumnsWithSymbol = function(t, e, n) {
            var i = 0;
            e = void 0 !== e ? e : 0, n = void 0 !== n ? n : s.columns - 1;
            for (var o = e; o <= n; o++)
                this.hasSymbolOnColumn(t, o) && i++;
            return i
        }, t.prototype.hasSymbolOnColumn = function(t, e) {
            for (var n = 0; n < s.rows; n++)
                if (s.getFinalSymbolAt(e, n) === t)
                    return !0;
            return !1
        }, t.prototype.hasSymbolOnEveryColumn = function(t) {
            for (var e = 0; e < s.columns; e++)
                if (!this.hasSymbolOnColumn(t, e))
                    return !1;
            return !0
        }, t.prototype.hasSymbol = function(t) {
            for (var e = 0; e < s.columns; e++)
                if (this.hasSymbolOnColumn(t, e))
                    return !0;
            return !1
        }, t.prototype.getRowOf = function(t, e, n) {
            for (var i = n = n || 0; i < s.rows; i++)
                if (s.getFinalSymbolAt(e, i) === t)
                    return i;
            return null
        }, t.prototype.indexToPosition = function(t) {
            var e = Math.floor(t / s.rows);
            return {
                column: e,
                row: t - e * s.rows
            }
        }, t.prototype.positionToIndex = function(t, e) {
            return t * s.rows + e
        }, t
    }), _d("#)#", ["^#", "^$", "#)", "#)@", "#@&"], function(t, e, i, o, s) {
        "use strict";
        function n() {
            e.call(this), this.property("totalBet"), this.property("displayedTotalBet"), i.on("bet/changed", this.updateTotalBet), o.on("lines/changed", this.updateTotalBet), this.updateTotalBet()
        }
        return t.extend(n, e), n.prototype.updateTotalBet = function() {
            this.totalBet = Number(i.bet) * o.lines
        }, n.prototype.setTotalBet = function(t) {
            s.add(s.SET_TOTAL_BET), i.bet = Number((Number(t) / o.lines).toPrecision(3))
        }, n.prototype.setMinTotalBet = function(t) {
            for (var e = 0; e < i.availableBets.length; e++) {
                var n = i.availableBets[e];
                if (n * o.lines >= t) {
                    s.add(s.SET_MIN_TOTAL_BET), i.bet = n;
                    break
                }
            }
        }, n
    }), _d("$%$", ["^$", "^#", "$&^", "@@", "^!"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.call(this), this.property("showVideoIntro", !0), n.readObject("videoIntro", this), this.on("showVideoIntro/changed", this.save)
        }
        return e.extend(s, t), s.prototype.save = function() {
            n.saveObject("videoIntro", {
                showVideoIntro: this.showVideoIntro
            })
        }, s.prototype.hasVideoIntro = function() {
            return !1
        }, s.prototype.getSkipBottomStyle = function() {
            return "17%"
        }, s.prototype.isVideoAvailable = function() {
            return this.hasVideoIntro() && i.isDesktop && !i.isReplayMode() && !o.isSafari()
        }, s.prototype.getScale = function() {
            return 2
        }, s
    }), _d("$!!", ["#))", "#)", "#(*", "^", "@@"], function(i, t, s, o, r) {
        "use strict";
        function e() {
            this.ALL_LINES_TIME = 1.2, this.DELAY = .1, this.SINGLE_LINE_TIME = 1.5, this.CLEAR_IMMEDIATELY_TIME = .2, this.wonCoins = 0, this.accCoins = 0, this.clear()
        }
        return e.prototype.clear = function() {
            this.wins = [], this.specialWins = []
        }, e.prototype.parseNextSmallSpin = function(t, e, n) {
            t && (t = t.map(function(t) {
                return {
                    line: t[0] - 1,
                    prize: t[1],
                    symbols: t[2]
                }
            }), this.wins = t.filter(function(t) {
                return i.isValidPayline(t.line)
            }), this.specialWins = t.filter(function(t) {
                return !i.isValidPayline(t.line)
            }), this.totalWin = parseFloat(e), this.currentLineToHighlight = 0, n && (this.wonCoins = n.wonCoins || 0, this.accCoins = n.accC || 0))
        }, e.prototype.parseSpinEnd = function() {
            var t = o.getCurrentBet().wonamount || 0;
            this.wonAmount = Math.round(t / o.getCurrentBet().betdata.coin)
        }, e.prototype.sortWins = function() {
            this.wins = this.wins.sort(function(t, e) {
                return t.line - e.line
            })
        }, e.prototype.compactWins = function() {
            for (var t = this.wins, e = 0; e < t.length; e++)
                for (var n = 0; n < t.length; n++)
                    if (t[n].lines = t[n].lines || [t[n].line], e !== n && t[e].symbols === t[n].symbols) {
                        t[n].line = Math.min(t[e].line, t[n].line), t[n].lines.push(t[e].line), t[n].prize += t[e].prize, t.splice(e, 1), e--;
                        break
                    }
            this.sortWins()
        }, e.prototype.getCurrentLineToHighlight = function() {
            return this.wins[this.currentLineToHighlight]
        }, e.prototype.participateInCurrentWin = function(t, e) {
            return this.participateInWin(t, e, this.currentLineToHighlight)
        }, e.prototype.participateInWin = function(t, e, n) {
            var i = t * s.getRows() + e;
            return "1" === this.wins[n].symbols.charAt(i)
        }, e.prototype.participateInAnyWin = function(t, e) {
            for (var n = !1, i = 0; i < this.wins.length && !n; i++)
                n = this.participateInWin(t, e, i);
            return n
        }, e.prototype.participateInAnyWinOnColumn = function(t) {
            for (var e = s.getRows(), n = 0; n < e; n++)
                if (this.participateInAnyWin(t, n))
                    return !0;
            return !1
        }, e.prototype.participateInNextWins = function(t, e, n) {
            for (var i = !1, o = n + 1; o < this.wins.length && !i; o++)
                i = this.participateInWin(t, e, o);
            return i
        }, e.prototype.participateInPreviousWins = function(t, e, n) {
            for (var i = 0; i < n; i++)
                if (this.participateInWin(t, e, i))
                    return !0;
            return !1
        }, e.prototype.getAccumulatedWinInCoins = function() {
            return Math.round(this.totalWin / t.bet)
        }, e.prototype.getAccumulatedWin = function() {
            return this.totalWin
        }, e.prototype.getWonAmount = function() {
            return this.wonAmount
        }, e.prototype.getGrandTotal = function() {
            return o.getCurrentEventData().grandTotal
        }, e.prototype.getTotalSpecialWin = function() {
            for (var t = 0, e = 0; e < this.specialWins.length; e++)
                t += this.specialWins[e].prize;
            return t
        }, e.prototype.getTotalLineWin = function() {
            for (var t = 0, e = 0; e < this.wins.length; e++)
                t += this.wins[e].prize;
            return t
        }, e.prototype.getNumberOfWinningLines = function() {
            return this.wins.length
        }, e.prototype.hasWinningLines = function() {
            return 0 < this.getNumberOfWinningLines()
        }, e.prototype.getAllLinesToHighlight = function() {
            return this.wins
        }, e.prototype.nextLine = function() {
            this.currentLineToHighlight++, this.currentLineToHighlight >= this.wins.length && (this.currentLineToHighlight = 0)
        }, e.prototype.getWinningSymbolsInWin = function(t) {
            for (var e = this.wins[t], n = [], i = s.getRows(), o = 0; o < e.symbols.length; o++)
                "1" === e.symbols.charAt(o) && n.push({
                    column: Math.floor(o / i),
                    row: o % i
                });
            return n
        }, e.prototype.getWinPaylines = function() {
            return this.wins.map(function(t) {
                return t.line
            })
        }, e.prototype.getDoubleAmount = function() {
            return o.getCurrentEventData().doubleAmount
        }, e.prototype.getSpinPrize = function() {
            return this.showAccumulatedWin() ? this.getAccumulatedWinInCoins() : this.getTotalWin()
        }, e.prototype.showAccumulatedWin = function() {
            return !1
        }, e.prototype.getLastWin = function() {
            return this.getSpinPrize() * t.bet
        }, e.prototype.getTotalPrize = function() {
            if (r.isRewatch())
                return parseInt(o.getLastBet().woncoins);
            for (var t = 0, e = 0; e < o.bets.length; e++) {
                var n = o.bets[e].prizes || [];
                n = n.filter(function(t) {
                    return "BOOST" !== t.type
                });
                for (var i = 0; i < n.length; i++)
                    t += parseFloat(n[i].wonamount || n[i].woncoins)
            }
            return t
        }, e.prototype.getTotalWin = function() {
            return this.getTotalLineWin() + this.getTotalSpecialWin()
        }, e.prototype.isSmallWin = function() {
            return !0
        }, e
    }), _d("$**", ["!", "^#", "$*&"], function(t, e, n) {
        "use strict";
        var i = {};
        e.extend(i, PIXI.ObservablePoint), PIXI.ObservablePoint.prototype = i.prototype, i.prototype._subConstructor = function() {
            this._updateAll = this._updateAll.bind(this), this.set = this.set.bind(this), this._listeners = [], this._imUpdating = [], this._theyUpdateMe = [], this._extended = !0
        }, Object.defineProperty(i.prototype, "cb", {
            get: function() {
                return this._extended || this._subConstructor(), this._updateAll
            },
            set: function(t) {
                this._extended || this._subConstructor(), this._cb = t
            }
        }), i.prototype._updateAll = function() {
            this._cb.call(this.scope);
            for (var t = 0, e = this._listeners.length; t < e; t++)
                this._listeners[t](this._x, this._y)
        }, i.prototype.linkTo = function(t) {
            t instanceof PIXI.ObservablePoint && 0 < t.on("change", this.set) && (this._theyUpdateMe.indexOf(t) < 0 && this._theyUpdateMe.push(t), t._imUpdating.push(this)), this.copy(t)
        }, i.prototype.unlink = function(t) {
            t.off("change", this.set);
            var e = this._theyUpdateMe.indexOf(t);
            -1 < e && this._theyUpdateMe.splice(e, 1), -1 < (e = t._imUpdating.indexOf(this)) && t._imUpdating.splice(e, 1)
        }, i.prototype.unlinkReverse = function(t) {
            t.unlink(this)
        }, i.prototype.unlinkAllReverse = function() {
            for (; this._imUpdating.length;)
                this.unlinkReverse(this._imUpdating.pop());
            return this
        }, i.prototype.unlinkAll = function() {
            for (; this._theyUpdateMe.length;)
                this.unlink(this._theyUpdateMe.pop());
            return this
        }, i.prototype.removeAllListeners = function() {
            return this._listeners = [], this
        }, i.prototype.on = function(t, e) {
            if (this._listeners.indexOf(e) < 0)
                return this._listeners.length, this._listeners.push(e)
        }, i.prototype.off = function(t, e) {
            var n = this._listeners.indexOf(e);
            if (-1 < n)
                return this._listeners.splice(n, 1), this._listeners.length
        }, i.prototype.detach = function() {
            return this.removeAllListeners(), this.unlinkAll(), this.unlinkAllReverse(), this
        }, i.prototype.clone = function() {
            return {
                x: this.x,
                y: this.y
            }
        };
        var o = {};
        return e.extend(o, PIXI.TextStyle), PIXI.TextStyle.prototype = o.prototype, o.addFallbackFonts = function() {
            Array.isArray(this.fontFamily) ? this.fontFamily = n.addFontsToArray(this.fontFamily) : this.fontFamily = n.addFontsToString(this.fontFamily)
        }, t.override(PIXI.TextStyle.prototype, "toFontString", o.addFallbackFonts), {}
    }), _d("&&", ["@@", "*^", "!", "@)^", "#", "#@", "$*(", "%)"], function(o, e, n, i, s, r, a, h) {
        "use strict";
        function p(t, e) {
            n.bindAll(this), this.onSuccess = t, this.onError = e
        }
        return p.CLIENT_SESSION_ID = a.generate(), p.ERROR = {
            REALITY_CHECK_PENDING: "REALITY_CHECK_PENDING",
            NO_SUFFICIENT_FUNDS: "NO_SUFFICIENT_FUNDS"
        }, p.FORCE_RELOAD_TYPE = {
            REQUIRED: "R",
            OPTIONAL: "O"
        }, p.prototype.getParams = function(t) {}, p.prototype.parse = function(t) {
            throw new Error("Abstract method")
        }, p.prototype.run = function() {
            s.once("request/start", this.onRequestStart), s.emit("request/start")
        }, p.prototype.onRequestStart = function() {
            var t = {};
            this.getParams(t), t.crid = a.generate(), t.csid = p.CLIENT_SESSION_ID, (new e).get(o.baseURL + "/" + this.getPath(), t, this.getHeaders(), this.onResults)
        }, p.prototype.onResults = function(t, e) {
            if (s.emit("request/end"), t)
                this.error({
                    title: r.get("connection_error_title") || "Connection Problem",
                    msg: r.get("connection_error_message") || "Check your internet connection and try again"
                });
            else {
                var n = JSON.parse(e);
                n.utcts && o.setServerTime(n.utcts);
                var i = void 0 === n.code ? n : n.data;
                s.emit("request/parseOperatorMessage", n.fn, i), i ? (this.parse(i), this.onSuccess && this.onSuccess()) : this.error(n)
            }
        }, p.prototype.error = function(t) {
            t.relaunchUrl && h.goToURL(t.relaunchUrl), this.displayError(t), this.onError && this.onError(), s.emit("request/error"), t.errorCode === p.ERROR.NO_SUFFICIENT_FUNDS && s.emit("request/onLowBalance")
        }, p.prototype.displayError = function(t) {
            new i(this.getErrorMessageWindowOptions(t))
        }, p.prototype.getErrorMessageWindowOptions = function(t) {
            return {
                title: t.title || r.get("server_parse_error_title"),
                message: t.msg || r.get("server_parse_error_message"),
                allowContinue: t.type === p.FORCE_RELOAD_TYPE.OPTIONAL
            }
        }, p.prototype.getName = function() {
            return "Unknown"
        }, p.prototype.getPath = function() {
            return "game.web/service"
        }, p.prototype.getHeaders = function() {
            return {}
        }, p
    }), _d("$*)", ["^#", "&&", "@@", "@(*", "@))", "##)"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            e.apply(this, arguments)
        }
        return t.extend(r, e), r.prototype.getParams = function(t) {
            t.fn = "authenticate", t.org = n.organization, t.lang = n.language, t.gameid = n.gameId, t.channel = n.channel, t.currency = n.currency, t.userName = n.userName, n.channel && (t.channel = n.channel), n.channelID && (t.channelID = n.channelID), n.channelSuffix && (t.channelSuffix = n.channelSuffix), n.key ? t.key = n.key : n.userName && n.password && (t.uid = n.userName, t.pwd = n.password)
        }, r.prototype.parse = function(t) {
            n.authData = t, n.sessionId = t.sessid, n.key = n.key || t.nativeSessid, i.setBalance(Number(t.balance.cash)), s.setStartBalance(i.balance), n.updateLastActivityTime(), o.parse(t.auxiliaryData)
        }, r.prototype.getName = function() {
            return "AuthenticationRequest"
        }, r
    }), _d("@&@", ["&&", "^#", "$*(", "@@", "@(*", "##)", "@*@"], function(n, t, i, o, e, s, r) {
        "use strict";
        function a(t, e) {
            n.call(this, t, e || t), this.ignoreErrors = !1
        }
        return t.extend(a, n), a.prototype.getParams = function(t) {
            t.fn = "closegamesession", t.sessid = o.sessionId, t.gameid = o.gameId
        }, a.prototype.parse = function(t) {
            t.cash && (e.setBalance(Number(t.cash)), s.setStartBalance(e.balance))
        }, a.prototype.displayError = function(t) {
            this.ignoreErrors || n.prototype.displayError.call(this, t)
        }, a.prototype.getName = function() {
            return "CloseGameSessionRequest"
        }, a.prototype.synchronousRun = function(t) {
            this.ignoreErrors = !0;
            var e = {};
            this.getParams(e), e.crid = i.generate(), e.csid = n.CLIENT_SESSION_ID, (new r).get(o.baseURL + "/" + this.getPath(), e, this.getHeaders(), this.onResults)
        }, a
    }), _d("$(@", ["^#", "$(!", "@@", "*", "#)@", "#)", "^", "@", "$", "%"], function(t, e, n, i, o, s, r, a, h, p) {
        "use strict";
        function u() {
            e.apply(this, arguments)
        }
        return t.extend(u, e), u.prototype.getParams = function(t) {
            e.prototype.getParams.call(this, t), t.amount = i.totalBet, t.wagerid = r.getWagerId(), t.betid = 1, t.amount = 0, t.step = r.getCurrentStep() + 1, t.cmd = "C", t.channelID = n.channelID
        }, u.prototype.parse = function(t) {
            r.parse(t), r.skipToLastBet(), a.parse(t.promotion, t.prepaidBalance || t.superSpinBalance), p.parseState(t.missionState)
        }, u.prototype.getName = function() {
            return "CollectRequest"
        }, u
    }), _d("@^)", ["^#", "&&", "@@", "@(*"], function(t, e, n, i) {
        "use strict";
        function o() {
            e.apply(this, arguments)
        }
        return t.extend(o, e), o.prototype.getParams = function(t) {
            t.fn = "balance", t.gameid = n.gameId, t.sessid = n.sessionId, t.channelSuffix = n.channelSuffix
        }, o.prototype.parse = function(t) {
            t.cash && i.setBalance(Number(t.cash))
        }, o.prototype.getName = function() {
            return "GetBalanceRequest"
        }, o.prototype.displayError = function(t) {}, o
    }), _d("$($", ["&&", "^#", "$(#", "@@", "#))", "#^%", "@)%", "#)", "#)@", "$@&"], function(t, e, n, i, o, s, r, a, h, p) {
        "use strict";
        function u() {
            t.apply(this, arguments)
        }
        return e.extend(u, t), u.prototype.getParams = function(t) {
            t.fn = "game", t.currency = i.currency, t.gameid = i.gameId, t.org = i.organization
        }, u.prototype.parse = function(t) {
            this.transformData(t.cfg.props), this.parseSymbols(t.cfg.props), this.parseSymbolPrizes(t.cfg.props), this.parsePaylines(t.cfg.props), this.parseMachine(t.cfg.props), this.parseBets(t), this.parseLines(), i.parse(t.cfg.props, t, t.launcherSettings)
        }, u.prototype.transformData = function(t) {
            for (var e in t)
                t[t[e].prop] = t[e].value, delete t[e]
        }, u.prototype.parseSymbols = function(t) {
            for (var e = 0; e < t.Icons.length; e++)
                s.symbols[t.Icons[e]] = {
                    name: t.Icons[e],
                    type: t.IconTypes[e]
                }
        }, u.prototype.parseSymbolPrizes = function(t) {
            for (var e = 0; e < t.Prizes.length; e++) {
                var n = t.Prizes[e][0],
                    i = t.Prizes[e].splice(1).reverse();
                s.symbols[n].prizes = i
            }
        }, u.prototype.parsePaylines = function(t) {
            o.paylines = t.Paylines, o.paylinesOrientations = t.NormalOri
        }, u.prototype.parseMachine = function(t) {
            for (var e in p.reels) {
                var n = p.reels[e];
                r.addReels(n, t[n])
            }
            r.setReels(p.getDefaultReelsName())
        }, u.prototype.parseBets = function(t) {
            a.availableBets = n.parse(t.orgSettings.Denoms)[i.currency];
            var e = n.parse(t.orgSettings.DefaultDenom)[i.currency][0];
            a.defaultBet = 0 <= a.availableBets.indexOf(e) ? e : a.availableBets[0], a.selectDefault()
        }, u.prototype.parseLines = function() {
            h.availableLines = [o.getNumberOfPaylines()], h.lines = o.getNumberOfPaylines()
        }, u.prototype.getName = function() {
            return "GetGameConfigRequest"
        }, u
    }), _d("$(%", ["^#", "&&", "@@", "$%!"], function(t, e, n, i) {
        "use strict";
        function o() {
            e.apply(this, arguments)
        }
        return t.extend(o, e), o.prototype.getParams = function(t) {
            t.sessionId = n.sessionId, t.gameId = n.gameId
        }, o.prototype.parse = function(t) {
            i.parse(t)
        }, o.prototype.getPath = function() {
            return "game.web/services/history/list"
        }, o.prototype.getName = function() {
            return "GetGameHistoryRequest"
        }, o
    }), _d("$(^", ["&&", "^#", "@@", "^", "$^", "#)", "@)@", "#@&"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {
            t.apply(this, arguments)
        }
        return e.extend(h, t), h.prototype.getParams = function(t) {
            n.isRewatch() ? this.getRewatchParams(t) : this.getReplayParams(t)
        }, h.prototype.getReplayParams = function(t) {
            t.fn = "wagers", t.status = "Pending,Finished", t.limit = 1, t.gameid = n.gameId, t.from = n.wagerId, t.to = n.wagerId, n.sessionId && (t.sessid = n.sessionId), !n.userName || n.isInnerClient() || n.isReplayFromIframeGame() || (t.userid = n.userName)
        }, h.prototype.getRewatchParams = function(t) {
            t.fn = "rewatch", t.wagerId = n.wagerId
        }, h.prototype.parse = function(t) {
            t.wager = t.data[0], n.isRewatch() && (t.wager = this.prepareWager(t.wager)), r.parse(t), a.add(a.GET_REPLAY_REQUEST), s.bet = Number(t.data[0].bets[0].betdata.coin)
        }, h.prototype.prepareWager = function(t) {
            var e = 0,
                n = !1;
            return t.bets.forEach(function(t) {
                t.eventdata && void 0 !== t.eventdata.accC ? (e = t.eventdata.accC, n = !0) : t.woncoins && !n && (e = parseInt(t.woncoins)), t.woncoins = e + ""
            }), t
        }, h.prototype.getName = function() {
            return "GetReplayDataRequest"
        }, h
    }), _d("$(&", ["^#", "&&", "@@", "#)", "$^", "%@", "@", "#@&"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {
            e.apply(this, arguments)
        }
        return t.extend(h, e), h.prototype.getParams = function(t) {
            t.fn = "wagers", t.status = "Pending", t.limit = 1, t.sessid = n.sessionId, t.gameid = n.gameId
        }, h.prototype.parse = function(t) {
            if (0 !== t.size) {
                var e = t.data[0].bets,
                    n = e[e.length - 1];
                n.eventdata = n.eventdata || {}, t.wager = t.data[0], "Pending" === t.wager.status && this.restoreBet(n), s.parse(t), r.parse(t.wager.promotion)
            }
        }, h.prototype.getName = function() {
            return "GetRestoreDataRequest"
        }, h.prototype.restoreBet = function(t) {
            var e = Number(t.betdata.coin);
            0 <= i.availableBets.indexOf(e) && (a.add(a.GET_RESTORE_REQUEST), i.bet = e)
        }, h
    }), _d("&(", ["&&", "^#", "@@", "#@", "@#*"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.apply(this, arguments)
        }
        return e.extend(s, t), s.prototype.getParams = function(t) {
            t.fn = "translations", t.lang = n.language, t.org = n.organization, t.category = n.getTranslationCategories(), t.country = "*", t.dialect = "*", t.type = o.getLicense().name
        }, s.prototype.parse = function(t) {
            for (var e in t) {
                var n = e.substring(e.lastIndexOf(":") + 1);
                i.set(n, t[e])
            }
        }, s.prototype.getName = function() {
            return "GetTranslationsRequest"
        }, s
    }), _d("$(!", ["^#", "&&", "@@", "*", "#)@", "#)", "^", "@", "$", "%", "#@&", "@))", "&"], function(t, e, n, i, o, s, r, a, h, p, u, c, l) {
        "use strict";
        function d() {
            e.apply(this, arguments)
        }
        return t.extend(d, e), d.prototype.getParams = function(t) {
            t.fn = "play", t.currency = n.currency, t.gameid = n.gameId, t.sessid = n.sessionId, t.log = u.getLog(), t.channel = n.channel, t.channelID = n.channelID, t.channelSuffix = n.channelSuffix, u.clear(), l.hasActiveCampaign() && (t.cashraceid = l.getActiveCampaignId()), h.isActive() && (t.tournamentid = h.tournamentId), (p.isActive() || p.isRaffle()) && (t.missionid = p.missionId), c.gameDetails && c.gameDetails.sessionId && (t.gameHistorySessionId = c.gameDetails.sessionId, t.gameHistoryTicketId = c.gameDetails.ticketId)
        }, d.prototype.getName = function() {
            return "PlayRequest"
        }, d
    }), _d("#$@", ["^#", "&&", "@@", "@))", "@(*"], function(t, e, n, i, o) {
        "use strict";
        function s(t) {
            e.apply(this, arguments), this.decision = null
        }
        return t.extend(s, e), s.prototype.run = function(t) {
            this.decision = t, e.prototype.run.call(this)
        }, s.prototype.getParams = function(t) {
            t.fn = "potrequest", t.sessid = n.sessionId, t.gameid = n.gameId, t.potrequested = this.decision
        }, s.prototype.parse = function(t) {
            o.setBalance(Number(t.balance.cash)), i.parse(t.auxiliaryData)
        }, s.prototype.error = function(t) {
            this.onError && this.onError(this.getErrorMessageWindowOptions(t))
        }, s.prototype.getName = function() {
            return "PotRequest"
        }, s
    }), _d("#%#", ["^#", "&&", "@@"], function(t, e, n) {
        "use strict";
        function i() {
            e.apply(this, arguments), this.decision = null
        }
        return t.extend(i, e), i.prototype.run = function(t) {
            this.decision = t, e.prototype.run.call(this)
        }, i.prototype.getParams = function(t) {
            t.fn = "realitycheck", t.sessid = n.sessionId, t.decision = this.decision
        }, i.prototype.parse = function(t) {}, i.prototype.displayError = function(t) {}, i.prototype.getName = function() {
            return "RealityCheckRequest"
        }, i
    }), _d("$(*", ["^#", "&&", "@@"], function(t, e, n) {
        "use strict";
        function i() {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.getParams = function(t) {
            t.fn = "clientinfo", t.org = n.organization, t.gameid = n.gameId, t.type = "Html", t.width = 800, t.height = 600, t.appsrv = n.baseURL, t.root = n.baseStaticURL, t.file = "init/launchClient.html"
        }, i.prototype.parse = function(t) {
            n.clientInfoId = t.id
        }, i.prototype.getName = function() {
            return "RegisterReplayModeRequest"
        }, i
    }), _d("$((", ["^#", "$(!", "@@", "#", "@(*", "*", "#)", "#)@", "@", "^", "&&", "(", "$*", "#%!", "$%", "^&"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d, f, g) {
        "use strict";
        function y() {
            e.apply(this, arguments)
        }
        return t.extend(y, e), y.prototype.getParams = function(t) {
            e.prototype.getParams.call(this, t), this.validate() ? (t.amount = s.totalBet, t.lines = a.getSelectedLinesAsString(), t.coin = r.bet, t.clientinfo = n.clientInfoId, t.channelID = n.channelID, h.hasPromoSpin() && (t.prepaid = h.prepaidId)) : t = {}
        }, y.prototype.parse = function(t) {
            p.parse(t), h.parse(t.promotion, t.prepaidBalance || t.superSpinBalance)
        }, y.prototype.displayError = function(t) {
            t.errorCode === u.ERROR.REALITY_CHECK_PENDING ? this.displayRealityCheckError(t) : u.prototype.displayError.apply(this, arguments)
        }, y.prototype.displayRealityCheckError = function(t) {
            t.msg && (n.clientHistoryURL = t.msg), t.timeElapsed && (d.serverTimeElapsed = t.timeElapsed), t.balanceDifference && (d.serverBalanceDifference = t.balanceDifference), t.errorType && (d.errorType = t.errorType), t.gamingWinLoss && (d.gamingWinLoss = t.gamingWinLoss), t.sportsWinLoss && (d.sportsWinLoss = t.sportsWinLoss), i.emit("realityCheck/show")
        }, y.prototype.getName = function() {
            return "SpinRequest"
        }, y.prototype.validate = function() {
            if (c.hud.betLabel.label.text !== l.formatTotalBet().toString())
                return !1;
            if (!n.showMobileUI && c.hud.betPanel.label.text !== g.formatStringFloatPrecision(r.bet))
                return !1;
            return !0
        }, y.prototype.getErrorMessageWindowOptions = function(t) {
            var e = u.prototype.getErrorMessageWindowOptions.call(this, t);
            return e.showDepositButton = t.errorCode === u.ERROR.NO_SUFFICIENT_FUNDS, e
        }, y
    }), _d("*)", ["!", "@)&"], function(i, t) {
        "use strict";
        function e(t, e, n) {
            i.bindAll(this), this.onSuccess = t, this.onError = e, this.onProgress = n, this.steps = [], this.currentStep = 0
        }
        return e.prototype.add = function(t, e) {
            this.steps.push({
                stepClass: t,
                condition: e
            })
        }, e.prototype.addFirst = function(t, e) {
            this.steps.unshift({
                stepClass: t,
                condition: e
            })
        }, e.prototype.run = function() {
            this.runNextStep()
        }, e.prototype.runNextStep = function() {
            var t = this.steps[this.currentStep];
            t.condition && !t.condition() ? this.onStepSuccess() : new t.stepClass(this.onStepSuccess, this.onStepError).run()
        }, e.prototype.onStepSuccess = function() {
            this.currentStep++, this.onProgress && this.onProgress(this.currentStep, this.steps.length), this.currentStep === this.steps.length ? (this.onAllStepsCompleted(), this.onSuccess && this.onSuccess()) : this.runNextStep()
        }, e.prototype.onAllStepsCompleted = function() {}, e.prototype.onStepError = function() {
            this.onError && this.onError()
        }, e.prototype.getName = function() {
            return "Unknown"
        }, e
    }), _d("#%&", ["^#", "*)", "$(@"], function(t, e, n) {
        "use strict";
        function i() {
            e.apply(this, arguments), this.add(n)
        }
        return t.extend(i, e), i.prototype.getName = function() {
            return "CollectRequestSequence"
        }, i
    }), _d("#$)", ["$(*", "$*)", "$($", "$(^", "**", "@@", "^#", "*)", "$(&", "%@", "%$", "(!", "$", "#", "&*", "&", "^!"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d, f, g, y) {
        "use strict";
        function m() {
            a.apply(this, arguments), this.add(t, this.isNotInReplayMode), !y.isTopFrame() && s.sessionId || this.add(e, this.isNotInReplayMode), this.add(n), this.add(i, this.isInReplayMode), this.add(h, this.shouldRestorePreviousSpin), this.add(o, this.hasNoSpinsToRestore), y.isIE() || this.add(f, this.isNotInReplayMode), this.add(u, this.shouldGetTournament), this.add(c, this.shouldGetMissions)
        }
        return r.extend(m, a), m.prototype.isNotInReplayMode = function() {
            return !s.isReplayMode()
        }, m.prototype.isInReplayMode = function() {
            return !!s.isReplayMode()
        }, m.prototype.shouldRestorePreviousSpin = function() {
            return !s.isReplayMode()
        }, m.prototype.hasNoSpinsToRestore = function() {
            return !p.hasPendingSpinToRestore() && !s.isReplayMode()
        }, m.prototype.shouldGetTournament = function() {
            return !g.hasActiveCampaign() && this.isNotInReplayMode()
        }, m.prototype.shouldGetMissions = function() {
            return !g.hasActiveCampaign() && !l.hasTournament() && this.isNotInReplayMode()
        }, m.prototype.getName = function() {
            return "InitRequestSequence"
        }, m.prototype.onAllStepsCompleted = function() {
            d.emit("initRequestSequence/allStepsCompleted")
        }, m
    }), _d("#^@", ["$((", "*)", "^#"], function(t, e, n) {
        "use strict";
        function i() {
            e.apply(this, arguments), this.add(t)
        }
        return n.extend(i, e), i.prototype.getName = function() {
            return "SpinSequence"
        }, i
    }), _d("@)&", ["@@", "#"], function(t, e) {
        return t.isReplayMode() ? function() {} : (ga("send", "pageview", {
            page: "/game/" + t.gameName + "/",
            title: t.gameName,
            userId: t.organization + "-" + t.userName
        }), e.on("preloader/show", function() {
            ga("send", "event", "renderer", t.renderer instanceof PIXI.WebGLRenderer ? "WebGL" : "Canvas")
        }), ga)
    }), _d("$()", ["#*$"], function(t) {
        t.init()
    }), _d("^)", [], function() {
        "use strict";
        var i = {
            clone: function(t) {
                return t.slice(0)
            },
            shuffle: function(t) {
                for (var e, n, i = t.length; i; e = Math.floor(Math.random() * i), n = t[--i], t[i] = t[e], t[e] = n)
                    ;
                return t
            },
            insertAt: function(t, e, n) {
                t.splice(e, 0, n)
            },
            swap: function(t, e, n) {
                var i = t[e];
                t[e] = t[n], t[n] = i
            },
            clear: function(t) {
                for (; t.length;)
                    t.pop()
            },
            append: function(t, e) {
                for (var n = 0, i = e.length; n < i; ++n)
                    t.push(e[n]);
                return t
            },
            removeDuplicates: function(t) {
                for (var e = [], n = 0; n < t.length; n++)
                    e.indexOf(t[n]) < 0 && e.push(t[n]);
                return e
            },
            pushUnique: function(t, e) {
                t.indexOf(e) < 0 && t.push(e)
            },
            getRandomElement: function(t) {
                return t[i.getRandomIndex(t)]
            },
            getRandomIndex: function(t) {
                return Math.round(Math.random() * (t.length - 1))
            },
            removeRandomElement: function(t) {
                var e = i.getRandomIndex(t);
                return i.removeElementAt(t, e)
            },
            removeElement: function(t, e) {
                var n = t.indexOf(e);
                return 0 <= n ? i.removeElementAt(t, n) : null
            },
            removeElementAt: function(t, e) {
                return t.splice(e, 1)[0]
            },
            filterEmptyElements: function(t) {
                return t.filter(i.isElementEmpty)
            },
            isElementEmpty: function(t) {
                return !!t
            },
            deepEqual: function(t, e) {
                var n = t.length;
                if (n !== e.length)
                    return !1;
                for (; n--;)
                    if (t[n] !== e[n])
                        return !1;
                return !0
            },
            fill: function(t, e) {
                for (var n = 0; n < t.length; n++)
                    t[n] = e;
                return t
            }
        };
        return i
    }), _d("&@", [], function() {
        "use strict";
        function t() {}
        return t.encode = function(t) {
            return window.btoa(t)
        }, t.decode = function(t) {
            return window.atob(t)
        }, t
    }), _d("^%", ["$%", "&$", "#@"], function(n, e, i) {
        "use strict";
        var o = {
            PAYOUT_TYPE: {
                CASH: "CASH",
                BONUS: "BONUS",
                CASH_AND_BONUS: "CASH_AND_BONUS",
                CUSTOM: "CUSTOM"
            },
            formatPrize: function(t, e) {
                return e = e || o.getDefaultCurrency(), n.formatWithCurrency(t, 0, e)
            },
            formatReward: function(t, e) {
                return t.payoutType === o.PAYOUT_TYPE.CUSTOM ? i.get(t.customPrize.translationKey) : o.formatPrize(t.prize, e)
            },
            getDefaultCurrency: function() {
                return "EUR"
            },
            formatPrizePool: function(t) {
                return t.map(function(t, e) {
                    return t.number = e + 1, t.formattedPrize = o.formatAnyReward(t), t.isCustom = t.payoutType === o.PAYOUT_TYPE.CUSTOM, t
                })
            },
            formatAnyReward: function(t) {
                return t.payoutType === o.PAYOUT_TYPE.CUSTOM ? i.get(t.customPrize.translationKey) : isNaN(t.prize) ? t.prize : o.formatPrize(t.prize, t.currency)
            },
            formatRaffleResult: function(t) {
                return t && t.customPrizeId && (t.payoutType = o.PAYOUT_TYPE.CUSTOM, t.customPrize = {
                    translationKey: t.customPrizeTranslationKey
                }, t.isCustom = !0), t
            },
            groupPrizesByValue: function(t) {
                for (var e = [], n = 1, i = t[0], o = 0; o < t.length; o++)
                    o + 1 < t.length && t[o + 1].prize === t[o].prize ? n++ : (i.number = n, e.push(i), i = t[o + 1], n = 1);
                return e
            },
            formatDate: function(t) {
                return {
                    days: e.formatDays(t),
                    time: e.formatTime(t)
                }
            },
            formatDateWithTime: function(t) {
                var e = o.formatDate(t);
                return e.days + " " + e.time
            },
            getPrizesOfType: function(e, t) {
                var n = null;
                return t.filter(function(t) {
                    return (n = t.payoutType) && n === e || !n && e === o.PAYOUT_TYPE.CASH
                })
            }
        };
        return o
    }), _d("^#", [], function() {
        "use strict";
        return {
            extend: function(t, e) {
                for (var n in t.prototype = Object.create(e.prototype), t.prototype.constructor = t, e)
                    t[n] = e[n]
            }
        }
    }), _d("(@", ["@#$", "@@"], function(t, e) {
        "use strict";
        var i = {
            init: function() {
                "ontouchstart" in t.documentElement && !e.isDesktop ? (i.onClick = i.onClickMobile, t.addEventListener("touchstart", function(t) {
                    i.touchedStartElement = t.target, i.moved = !1
                }), t.addEventListener("touchmove", function(t) {
                    i.moved = !0
                }), t.addEventListener("touchend", function(t) {
                    i.touchedEndElement = t.target
                }, !0)) : i.onClick = i.onClickDesktop
            },
            onClickDesktop: function(t, e) {
                t.onclick = e
            },
            onClickMobile: function(e, n) {
                e.ontouchend = function(t) {
                    e.contains(i.touchedStartElement) && e.contains(i.touchedEndElement) && !i.moved && (t.preventDefault(), n(t))
                }
            },
            removeOnClick: function(t) {
                t.onclick = null, t.ontouchend = null
            }
        };
        return i.init(), i
    }), _d("$&^", ["@#%", "^!"], function(s, t) {
        "use strict";
        var r = {
            saveObject: function(t, e) {
                var n = JSON.stringify(e);
                r.useLocalStorage ? window.localStorage.setItem(t, n) : new s(t).set(n)
            },
            readObject: function(t, e) {
                var n;
                if (n = r.useLocalStorage ? localStorage.getItem(t) : new s(t).get())
                    try {
                        var i = JSON.parse(n);
                        for (var o in i)
                            e[o] = i[o]
                    } catch (t) {
                        throw Error("Invalid JSON data")
                    }
            },
            isLocalStorageAvailable: function() {
                try {
                    return window.localStorage.setItem("_ygg_", "_ygg_"), window.localStorage.removeItem("_ygg_"), !0
                } catch (t) {
                    return !1
                }
            }
        };
        return r.useLocalStorage = r.isLocalStorageAvailable() && !t.isTopFrame() && (t.isSafari() || t.isMobileSafari()), r
    }), _d("$%", ["@@"], function(a) {
        "use strict";
        var h = {
            SIGNS: {
                EUR: "€",
                USD: "$",
                AUD: "$",
                BGN: "лв",
                BRL: "R$",
                CAD: "$",
                CHF: "CHF",
                CNY: "¥",
                CZK: "Kč",
                DKK: "kr",
                GBP: "£",
                HKD: "$",
                HRK: "kn",
                HUF: "Ft",
                ILS: "₪",
                INR: "₹",
                JPY: "¥",
                LTL: "Lt",
                NOK: "kr",
                PLN: "zł",
                RON: "lei",
                SEK: "kr",
                SGD: "$",
                THB: "บาท",
                TRY: "₺",
                PEN: "S/.",
                IDR: "Rp",
                NZD: "$",
                XSG: " "
            },
            FORMAT: {
                en: {
                    string: "%s%n",
                    group: ",",
                    decimal: "."
                },
                pl: {
                    string: "%n %s",
                    group: ".",
                    decimal: ","
                },
                hu: {
                    string: "%n %s",
                    group: " ",
                    decimal: ","
                },
                es: {
                    string: "%n %s",
                    group: " ",
                    decimal: ","
                },
                fi: {
                    string: "%n %s",
                    group: " ",
                    decimal: ","
                },
                fr: {
                    string: "%n %s",
                    group: " ",
                    decimal: ","
                },
                sv: {
                    string: "%n %s",
                    group: " ",
                    decimal: ","
                },
                sk: {
                    string: "%n %s",
                    group: " ",
                    decimal: ","
                },
                bg: {
                    string: "%n %s",
                    group: " ",
                    decimal: ","
                },
                cz: {
                    string: "%s%n",
                    group: " ",
                    decimal: ","
                },
                zh_hans: {
                    string: "%s %n",
                    group: ",",
                    decimal: "."
                },
                zh_hant: {
                    string: "%s %n",
                    group: ",",
                    decimal: "."
                },
                ja: {
                    string: "%s%n",
                    group: ",",
                    decimal: "."
                },
                nl: {
                    string: "%s %n",
                    group: ".",
                    decimal: ","
                },
                no: {
                    string: "%n %s",
                    group: ",",
                    decimal: "."
                },
                th: {
                    string: "%n%s",
                    group: ",",
                    decimal: "."
                },
                pt: {
                    string: "%s%n",
                    group: ".",
                    decimal: ","
                },
                "pt-br": {
                    string: "%s%n",
                    group: ".",
                    decimal: ","
                },
                ru: {
                    string: "%n %s",
                    group: " ",
                    decimal: ","
                },
                si: {
                    string: "%s%n",
                    group: ".",
                    decimal: ","
                },
                sl: {
                    string: "%s%n",
                    group: ".",
                    decimal: ","
                },
                da: {
                    string: "%n %s",
                    group: ".",
                    decimal: ","
                },
                de: {
                    string: "%n %s",
                    group: ".",
                    decimal: ","
                },
                el: {
                    string: "%n %s",
                    group: ".",
                    decimal: ","
                },
                ro: {
                    string: "%n %s",
                    group: " ",
                    decimal: ","
                },
                hr: {
                    string: "%n %s",
                    group: ".",
                    decimal: ","
                },
                it: {
                    string: "%n %s",
                    group: ".",
                    decimal: ","
                },
                sr: {
                    string: "%n %s",
                    group: ".",
                    decimal: ","
                },
                tr: {
                    string: "%n %s",
                    group: ".",
                    decimal: ","
                },
                vi: {
                    string: "%n %s",
                    group: ".",
                    decimal: ","
                },
                kr: {
                    string: "%n %s",
                    group: ",",
                    decimal: "."
                },
                DEFAULT: {
                    string: "%n %s",
                    group: " ",
                    decimal: ","
                }
            },
            format: function(t) {
                var e = h.formatDecimal(t);
                return h.formatString(e, !1)
            },
            formatWithCurrency: function(t, e, n) {
                var i = h.formatDecimal(t, e);
                return h.formatStringWithCurrency(i, !1, n)
            },
            formatString: function(t, e) {
                return h.formatStringWithCurrency(t, e, a.currency)
            },
            formatStringWithCurrency: function(t, e, n) {
                var i = a.language.toLowerCase(),
                    o = h.FORMAT[i] || h.FORMAT.DEFAULT,
                    s = h.SIGNS[n] || n,
                    r = o.string;
                return e && (r = r.replace(/ /g, "")), r.replace("%s", s).replace("%n", t)
            },
            isSignOnTheLeft: function() {
                var t = a.language.toLowerCase(),
                    e = h.FORMAT[t] || h.FORMAT.DEFAULT;
                return e.string.indexOf("%s") < e.string.indexOf("%n")
            },
            formatNumber: function(t) {
                var e = a.language.toLowerCase(),
                    n = h.FORMAT[e] || h.FORMAT.DEFAULT;
                return h.addSeparator(t.toFixed(0), n.group)
            },
            formatDecimal: function(t, e) {
                var n = a.language.toLowerCase(),
                    i = h.FORMAT[n] || h.FORMAT.DEFAULT;
                if (0 < (e = void 0 !== e ? e : 2)) {
                    var o = t.toFixed(e).split(".");
                    return h.addSeparator(o[0], i.group) + i.decimal + o[1]
                }
                return h.addSeparator(t.toFixed(e), i.group)
            },
            addSeparator: function(t, e) {
                var n = t.toString().split("").reverse().join("").replace(/([0-9]{3})/g, "$1" + e).split("").reverse().join("");
                return n.charAt(0) === e && (n = n.substring(1)), n
            }
        };
        return h
    }), _d("&$", ["^&"], function(t) {
        "use strict";
        var n = {
            format: function(t) {
                var e = n.formatDays(t);
                return n.formatTime(t) + " " + e
            },
            formatTime: function(t) {
                var e = new Date;
                return e.setTime(t), [this.formatNumber(e.getHours()), this.formatNumber(e.getMinutes()), this.formatNumber(e.getSeconds())].join(":")
            },
            formatDays: function(t) {
                var e = new Date;
                return e.setTime(t), [this.formatNumber(e.getDate()), this.formatNumber(e.getMonth() + 1), e.getFullYear()].join(".")
            },
            showFormattedTime: function(t) {
                var e = Math.floor(t / 1e3 % 60),
                    n = Math.floor(t / 6e4 % 60),
                    i = Math.floor(t / 36e5 % 24),
                    o = Math.floor(t / 864e5),
                    s = ["d ", "h ", "m ", "s"],
                    r = "",
                    a = !1;
                return [o, i, n, e].forEach(function(t, e) {
                    (a = a || 0 < t) && (r += t + s[e])
                }), r
            },
            formatNumber: function(t) {
                return 10 <= t ? t : "0" + t.toString()
            }
        };
        return n
    }), _d("$(#", [], function() {
        "use strict";
        return {
            parse: function(t) {
                for (var e = {}, n = t.split(";"), i = 0; i < n.length; i++)
                    for (var o = n[i].split(":"), s = o[0].split(","), r = o[1].split(","), a = 0; a < s.length; a++)
                        e[s[a]] = r.map(Number);
                return e
            }
        }
    }), _d(")", [], function() {
        "use strict";
        var o = {
            isDuringTouch: !1,
            toHTML: function(t) {
                var e = document.createElement("div");
                return e.innerHTML = t, 1 === e.children.length ? e.children[0] : e.children
            },
            addClass: function(t, e) {
                o.hasClass(t, e) || (t.className += " " + e)
            },
            removeClass: function(t, e) {
                if (o.hasClass(t, e)) {
                    var n = new RegExp("(\\s|^)" + e + "(\\s|$)");
                    t.className = t.className.replace(n, " ")
                }
            },
            hasClass: function(t, e) {
                return -1 < (" " + t.className + " ").indexOf(" " + e + " ")
            },
            byId: function(t) {
                return document.getElementById(t)
            },
            byClass: function(t) {
                return document.getElementsByClassName(t)
            },
            forEachWithClass: function(t, e) {
                for (var n = o.byClass(t), i = 0; i < n.length; i++)
                    e(n[i])
            },
            toggleClass: function(t, e) {
                o.hasClass(t, e) ? o.removeClass(t, e) : o.addClass(t, e)
            },
            bind: function(t, e, n) {
                t.value = e[n], t.change = function() {
                    e[n] = t.value
                }
            },
            onRangeChange: function(t, e) {
                var n = !0,
                    i = {
                        current: void 0,
                        mostRecent: void 0
                    };
                t.addEventListener("input", function(t) {
                    n = !1, i.current = t.target.value, i.current !== i.mostRecent && e(t), i.mostRecent = i.current
                }), t.addEventListener("change", function(t) {
                    n && e(t)
                })
            },
            preventZoomHandler: function(t) {
                var e = +t.timeStamp,
                    n = e - +(t.currentTarget.dataset.lastTouch || e),
                    i = t.touches.length;
                t.currentTarget.dataset.lastTouch = "" + e, !n || 500 < n || 1 < i || (t.preventDefault(), t.target.click())
            },
            preventZoom: function(t) {
                t.addEventListener("touchstart", o.preventZoomHandler)
            },
            preventPinchHandler: function(t) {
                1 < t.touches.length && t.preventDefault()
            },
            preventPinchHandlerEnd: function() {
                o.isDuringTouch = !1
            },
            preventPinchHandlerStart: function(t) {
                o.isDuringTouch && t.preventDefault(), o.isDuringTouch = !0
            },
            preventPinch: function(t) {
                t.addEventListener("touchmove", o.preventPinchHandler), t.addEventListener("touchend", o.preventPinchHandlerEnd), t.addEventListener("touchstart", o.preventPinchHandlerStart)
            },
            preventMoveHandler: function(t) {
                t.preventDefault()
            },
            preventMove: function(t) {
                t.addEventListener("touchmove", o.preventMoveHandler)
            }
        };
        return o
    }), _d("$*&", ["^)"], function(n) {
        "use strict";
        function i() {}
        return i.addFontsToArray = function(e) {
            return i.getFonts().forEach(function(t) {
                n.pushUnique(e, t)
            }), e
        }, i.addFontsToString = function(t) {
            return i.addFontsToArray(t.split(",")).join(",")
        }, i.getFonts = function() {
            return ["mediatornarrowbold"]
        }, i
    }), _d("#!(", ["@#$", "$#"], function(t, e) {
        "use strict";
        return {
            requestFullscreen: function() {
                t.documentElement.requestFullscreen ? t.documentElement.requestFullscreen() : t.documentElement.msRequestFullscreen ? t.documentElement.msRequestFullscreen() : t.documentElement.mozRequestFullScreen ? t.documentElement.mozRequestFullScreen() : t.documentElement.webkitRequestFullscreen && t.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
            },
            exitFullscreen: function() {
                t.exitFullscreen ? t.exitFullscreen() : t.msExitFullscreen ? t.msExitFullscreen() : t.mozCancelFullScreen ? t.mozCancelFullScreen() : t.webkitExitFullscreen && t.webkitExitFullscreen()
            },
            cancelFullScreen: function() {
                t.cancelFullscreen ? t.cancelFullscreen() : t.msCancelFullscreen ? t.msCancelFullscreen() : t.mozCancelFullScreen ? t.mozCancelFullScreen() : t.webkitCancelFullScreen && t.webkitCancelFullScreen()
            },
            isFullscreenModeEntered: function() {
                return t.fullscreenElement || t.mozFullScreenElement || t.webkitFullscreenElement || t.msFullscreenElement
            },
            isBrowserOccupyingScreenWidth: function() {
                return e.innerWidth === screen.width
            },
            isFullscreenModeAvailable: function() {
                return !!(t.documentElement.requestFullscreen || t.documentElement.webkitRequestFullscreen || t.documentElement.mozRequestFullScreen || t.documentElement.msRequestFullscreen)
            }
        }
    }), _d("!", [], function() {
        "use strict";
        return {
            override: function(t, e, n) {
                var i = t[e];
                t[e] = function() {
                    return n.apply(this, arguments), i.apply(this, arguments)
                }
            },
            bindAll: function(t) {
                if (!t.__bind)
                    for (var e in t.__bind = !0, t)
                        "function" == typeof t[e] && (t[e] = t[e].bind(t))
            },
            cache: function(e, n) {
                var i = e[n];
                e[n] = function() {
                    var t = i.call(e);
                    return e[n] = function() {
                        return t
                    }, t
                }
            },
            once: function(t, e) {
                return function() {
                    t.call(null, e), t = function() {}
                }
            }
        }
    }), _d("$$", [], function() {
        "use strict";
        var i = {
            parseParams: function(t) {
                var e = "";
                for (var n in t)
                    e += (0 === e.length ? "" : "&") + i.parseKeyValue(n, t[n]);
                return e
            },
            parseKeyValue: function(t, e) {
                var n = "";
                if (e instanceof Array)
                    for (var i = 0; i < e.length; i++) {
                        var o = i === e.length - 1 ? "" : "&";
                        n += t + "=" + encodeURIComponent(e[i]) + o
                    }
                else
                    n += t + "=" + encodeURIComponent(e);
                return n
            }
        };
        return i
    }), _d("@@&", [], function() {
        "use strict";
        return {
            setChildrenEnabled: function(t, e, n) {
                for (var i = 0; i < t.children.length; i++)
                    -1 === e.indexOf(t.children[i]) && void 0 !== typeof t.children[i].enabled && (t.children[i].enabled = n)
            }
        }
    }), _d("&%", [], function() {
        "use strict";
        var i = {
            EPSILON: 1e-6,
            clamp: function(t, e, n) {
                return Math.max(e, Math.min(t, n))
            },
            radiansToDegrees: function(t) {
                return 180 * t / Math.PI
            },
            degreesToRadians: function(t) {
                return t * Math.PI / 180
            },
            getRandomInt: function(t, e) {
                return Math.floor(Math.random() * (e - t + 1) + t)
            },
            getRandomFloat: function(t, e) {
                return Math.random() * (e - t) + t
            },
            getRandomElement: function(t) {
                return t[i.getRandomInt(0, t.length - 1)]
            },
            getMidPoint: function(t, e) {
                return new PIXI.Point((t.x + e.x) / 2, (t.y + e.y) / 2)
            },
            isEqual: function(t, e, n) {
                return n = n || i.EPSILON, Math.abs(t - e) < n
            }
        };
        return i
    }), _d("$)!", [], function() {
        "use strict";
        var o = {
            layout: function() {
                this.icon.x = 10, this.icon.y = 0, this.label.scale.set(.9, .9), this.autoScale(.9), this.label.x = this.background.width - .5 * (this.background.width - this.icon.width) - this.label.width / 2 - 5, this.label.y = o.calculateVerticalPosition(this.label), this.layoutExtraElements()
            },
            calculateVerticalPosition: function(t) {
                return .5 * -t.textHeight * t.scale.y
            },
            autoScale: function(t) {
                this.label.scale.x = t;
                var e = this.icon ? 5 + this.icon.width : 10,
                    n = this.background.width - e - 10;
                if (this.label.width > n) {
                    var i = n / this.label.width * t;
                    this.label.scale.set(i, i), this.label.y = o.calculateVerticalPosition(this.label)
                }
            }
        };
        return o
    }), _d("%*", [], function() {
        "use strict";
        return {
            mixin: function(t, e) {
                for (var n in e)
                    t[n] = e[n]
            },
            mixinOnlyNew: function(t, e) {
                for (var n in e)
                    t.hasOwnProperty(n) || (t[n] = e[n])
            },
            toArray: function(t) {
                var e = [];
                for (var n in t)
                    e.push(t[n]);
                return e
            },
            clone: function(t) {
                return JSON.parse(JSON.stringify(t))
            },
            isJsonString: function(t) {
                try {
                    JSON.parse(t)
                } catch (t) {
                    return !1
                }
                return !0
            }
        }
    }), _d("#&$", ["@@"], function(e) {
        "use strict";
        var t = {};
        function p() {
            if (this.worldAlpha = this.alpha * this.parent.worldAlpha, this.children)
                for (var t = 0, e = this.children.length; t < e; ++t)
                    this.children[t].updateTransform()
        }
        return t.containsPoint = function(t, e, n) {
            var i = t.toLocal(e, n);
            return t.getLocalBounds().contains(i.x, i.y)
        }, t.bringToFront = function(t) {
            t.parent && t.parent.setChildIndex(t, t.parent.children.length - 1)
        }, t.link = function(t, e, n) {
            var i,
                o,
                s,
                r,
                a,
                h;
            (h = e).linkData || (h.linkData = {
                position: h.position,
                scale: h.scale,
                pivot: h.pivot,
                rotation: h.rotation,
                updateTransform: h.updateTransform,
                worldAlpha: h.worldAlpha
            }), i = t, o = e, (s = void 0 !== (s = n) && s) && (r = i, a = o, Object.defineProperty(a, "worldAlpha", {
                get: function() {
                    return r.worldAlpha
                },
                set: function() {}
            })), o.position = i.position, o.scale = i.scale, o.pivot = i.pivot, o.rotation = i.rotation, o.updateTransform = p
        }, t.unlink = function(t) {
            var e;
            (e = t).linkData && (e.position = e.linkData.position, e.scale = e.linkData.scale, e.pivot = e.linkData.pivot, e.rotation = e.linkData.rotation, e.updateTransform = e.linkData.updateTransform, e.worldAlpha = e.linkData.worldAlpha, delete e.linkData)
        }, t.frameToTime = function(t) {
            return t / e.game.requestFrame.FPS
        }, t
    }), _d("^!", ["$#"], function(e) {
        "use strict";
        var s = {
            isTopFrame: function() {
                return e.top === e.self
            },
            getUserAgent: function() {
                return navigator.userAgent
            },
            isMobile: function() {
                var t = s.getUserAgent();
                return !!(t.match(/Android/i) || t.match(/webOS/i) || t.match(/iPhone/i) || t.match(/iPad/i) || t.match(/iPod/i) || t.match(/BlackBerry/i) || t.match(/Windows Phone/i))
            },
            isTablet: function() {
                return !!s.getUserAgent().match(/iPad/i) && !s.isIEMobile()
            },
            isMobileSafari: function() {
                return s.isIOS() && s.getUserAgent().match(/AppleWebKit/) && s.getUserAgent().match(/Version/)
            },
            isIEMobile: function() {
                return 0 <= s.getUserAgent().indexOf("IEMobile")
            },
            isIE: function() {
                return 0 <= s.getUserAgent().toLowerCase().indexOf("msie") || s.isIE11()
            },
            isIE11: function() {
                return s.getUserAgent().match(/Trident.*rv[ :]*(\d+\.\d+)/)
            },
            isEdge: function() {
                return 0 <= s.getUserAgent().toLowerCase().indexOf("edge")
            },
            isFirefox: function() {
                var t = s.getUserAgent().toLowerCase();
                return /mozilla/.test(t) && /firefox/.test(t)
            },
            isOpera: function() {
                var t = s.getUserAgent();
                return /opera/i.test(t) || /opr\//i.test(t)
            },
            isIOS: function() {
                return s.getUserAgent().match(/iPhone|iPad|iPod/i) && !s.isIEMobile()
            },
            isAndroid: function() {
                return s.getUserAgent().match(/Android/i) && !s.isIEMobile()
            },
            isWindows: function() {
                return s.getUserAgent().match(/Windows/i)
            },
            isNativeApp: function() {
                return e.navigator.standalone
            },
            isWindowsPhone: function() {
                return s.isIEMobile() || s.getUserAgent().match(/Windows Phone/i)
            },
            isAndroidTablet: function() {
                return s.getUserAgent().match(/Tablet/i) && s.getUserAgent().match(/Android/i) && !s.isIEMobile()
            },
            getMobileOSVersion: function() {
                var t = 0;
                return s.isIOS() ? (t = s.getUserAgent().indexOf("OS "), parseFloat(s.getUserAgent().substr(t + 3, 3).replace("_", "."))) : s.isAndroid() ? (t = s.getUserAgent().indexOf("Android "), parseFloat(s.getUserAgent().substr(t + 8, 3))) : 0
            },
            isIOS7orLater: function() {
                if (s.isIOS()) {
                    var t = s.getMobileOSVersion();
                    return 7 <= Number(t.charAt(0))
                }
                return !1
            },
            isIPhone: function() {
                return s.getUserAgent().match(/iPhone/i) && !s.isIEMobile()
            },
            isLowEndDevice: function() {
                return s.isIPhone4() || s.isIEMobile()
            },
            isIPhone4: function() {
                var t = Math.max(e.screen.width, e.screen.height);
                return s.isIPhone() && t <= 480
            },
            isIPhone5OrLater: function() {
                var t = Math.max(e.screen.width, e.screen.height);
                return s.isIPhone() && 568 <= t
            },
            isIPhone6OrBigger: function() {
                var t = Math.max(e.screen.width, e.screen.height);
                return s.isIPhone() && 667 <= t
            },
            isIPhone5: function() {
                return s.isIPhone() && !s.isIPhone6OrBigger()
            },
            isIPhone6Plus: function() {
                var t = Math.max(e.screen.width, e.screen.height);
                return s.isIPhone() && 736 === t
            },
            isPortraitMode: function() {
                return s.isAndroid() ? e.screen.availHeight > e.screen.availWidth : document.body.clientWidth < document.body.clientHeight
            },
            isSmallScreenSize: function() {
                return Math.max(e.screen.width, e.screen.height) <= 500
            },
            isLandscapeMode: function() {
                return !s.isPortraitMode()
            },
            isSafari: function() {
                var t = s.getUserAgent().toLowerCase();
                return /safari/.test(t) && /applewebkit/.test(t) && !/chrome/.test(t)
            },
            isSamsungBrowser: function() {
                var t = s.getUserAgent().toLowerCase();
                return /samsungbrowser/.test(t)
            },
            getBrowserData: function() {
                var t = s.getUserAgent().toLowerCase(),
                    e = "",
                    n = {};
                n.chrome = /webkit/.test(t) && /chrome/.test(t), n.firefox = /mozilla/.test(t) && /firefox/.test(t), n.msie = /msie/.test(t) || /trident/.test(t) || /trident.*rv[ :]*(\d+\.\d+)/.test(t), n.safari = /safari/.test(t) && /applewebkit/.test(t) && !/chrome/.test(t), n.opera = /mozilla/.test(t) && /applewebkit/.test(t) && /chrome/.test(t) && /safari/.test(t) && /opr/.test(t);
                var i = {
                    name: n.version = "",
                    version: 0
                };
                for (var o in n)
                    if (n[o]) {
                        i.name = o, (e = t.match(new RegExp("(" + o + ")( |/)([0-9]+)"))) ? i.version = Number(e[3]) : (e = t.match(new RegExp("rv:([0-9]+)"))) && (i.version = Number(e[1]));
                        break
                    }
                return i
            }
        };
        return s
    }), _d("%)", ["@@", "$#"], function(e, i) {
        "use strict";
        function t() {}
        return t.openNewWindow = function(t) {
            var e = parseInt(.75 * screen.width, 10),
                n = parseInt(.75 * screen.height, 10);
            i.open(t, "new_window", "scrollbars=1,resizable=1,toolbar=0,location=0,menubar=0,width=" + e + ",height=" + n + ",top = " + (screen.height - n) / 4 + ",left=" + (screen.width - e) / 2)
        }, t.openNewTab = function(t) {
            i.open(t, "_blank")
        }, t.goToRealityCheckBackURL = function() {
            t.goToURL(e.realityCheckBackURL)
        }, t.goToBackURL = function() {
            t.goToURL(e.backURL)
        }, t.goToURL = function(t) {
            i.setTimeout(function() {
                "top" === e.params.redirectType ? i.top.location.href = t : i.location.href = t
            }, 500)
        }, t.goBack = function() {
            i.history.back()
        }, t
    }), _d("^&", ["$%"], function(r) {
        "use strict";
        return {
            substitute: function(t) {
                for (var e = 1; e < arguments.length; e++)
                    t = t.replace(new RegExp("\\{" + Number(e - 1) + "\\}", "g"), arguments[e]);
                return t
            },
            addLeadingZeros: function(t, e) {
                for (var n = t.toString(); n.length < e;)
                    n = "0" + n;
                return n
            },
            formatStringFloatPrecision: function(t, e, n) {
                n = void 0 !== n ? Math.min(5, n) : 5;
                var i = e = void 0 !== e ? Math.max(2, e) : 2,
                    o = t.toString().indexOf(".");
                if (0 < o) {
                    var s = t.toString().substring(o + 1).length;
                    i = Math.max(i, Math.min(n, s))
                }
                return r.formatDecimal(t, i)
            },
            shortenLongString: function(t, e) {
                if (e >= t.length)
                    return t;
                for (var n = e; 0 <= n; n--) {
                    if (" " === t.charAt(n - 1))
                        return t.substr(0, n - 1) + "...";
                    if (" " === t.charAt(n))
                        return t.substr(0, n) + "..."
                }
                return t.substr(0, e) + "..."
            }
        }
    }), _d("@%$", ["@@", "^&"], function(n, p) {
        "use strict";
        return {
            getTexture: function(t) {
                return PIXI.utils.TextureCache[t]
            },
            getTextures: function(t) {
                if (!this.hasTexture(t))
                    throw new Error('The frame "' + t + '" does not exist in the texture cache');
                for (var e = t.lastIndexOf("_"), n = t.lastIndexOf("."), i = t.substring(0, e + 1), o = t.substring(e + 1, n), s = t.substring(n), r = parseInt(o, 10), a = [];;) {
                    var h = i + p.addLeadingZeros(r, o.length) + s;
                    if (!PIXI.utils.TextureCache[h])
                        break;
                    a.push(PIXI.utils.TextureCache[h]), r++
                }
                return a
            },
            hasTexture: function(t) {
                return !!PIXI.utils.TextureCache[t]
            },
            uploadTexture: function(t) {
                var e = PIXI.utils.TextureCache[t];
                n.renderer.textureManager && e && n.renderer.textureManager.updateTexture(e.baseTexture || e)
            },
            destroyTexture: function(t) {
                PIXI.utils.TextureCache[t] && PIXI.utils.TextureCache[t].baseTexture.dispose()
            },
            destroyText: function(t) {
                t && t.destroy()
            },
            destroyAllTextures: function() {
                for (var t in PIXI.utils.TextureCache) {
                    var e = PIXI.utils.TextureCache[t];
                    e && e.destroy && e.destroy(!0)
                }
            }
        }
    }), _d("$)@", ["^#", "!", "@#^", "@$", "@%"], function(t, i, o, e, n) {
        "use strict";
        function s(t, e, n) {
            o.call(this), i.bindAll(this), this.id = t, this.delay = e, this.countNumber = void 0 === n ? -1 : n, this.totalTime = this.delay * this.countNumber, this.currentTick = 1
        }
        return t.extend(s, o), s.prototype.start = function(t, e) {
            this.payload = e, t ? this.updateTick() : this.setNextTick()
        }, s.prototype.stop = function() {
            this.emit("completed", this.id, this.payload), this.cleanUp()
        }, s.prototype.setNewDelay = function(t) {
            this.delay = t, this.timeout && this.timeout.totalTime(this.delay)
        }, s.prototype.setNextTick = function() {
            this.timeout = e(this.updateTick, this.delay)
        }, s.prototype.updateTick = function() {
            this.emit("tick", this.id, this.currentTick, this.payload), -1 === this.countNumber || this.currentTick < this.countNumber ? (this.currentTick++, this.setNextTick()) : this.currentTick >= this.countNumber && this.stop()
        }, s.prototype.cleanUp = function() {
            n(this.timeout), this.timeout = null
        }, s
    }), _d("$&&", ["$#"], function(s) {
        "use strict";
        var r = {
            parse: function() {
                if (s._POST_PARAMS_)
                    return s._POST_PARAMS_;
                var t = {},
                    e = r.getWindowSearch();
                if (e && 1 < e.length)
                    for (var n = e.substring(1).split("&"), i = 0; i < n.length; i++) {
                        var o = n[i].split("=");
                        t[o[0]] = decodeURIComponent(o[1])
                    }
                return t
            },
            getWindowSearch: function() {
                return s.location.search
            }
        };
        return r
    }), _d("$*(", [], function() {
        "use strict";
        function t() {}
        return t.generate = function() {
            var n = (new Date).getTime();
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
                var e = (n + 16 * Math.random()) % 16 | 0;
                return n = Math.floor(n / 16), ("x" === t ? e : 3 & e | 8).toString(16)
            })
        }, t
    }), _d("$)#", ["@@", "^#"], function(t, e) {
        "use strict";
        function n() {
            PIXI.Container.call(this), this.lastWidth = 0, this.lastHeight = 0, this.onResize()
        }
        return e.extend(n, PIXI.Container), n.prototype.onResize = function() {}, n
    }), _d("$)$", ["^#", "!", "$#", "@@"], function(t, e, n, i) {
        "use strict";
        function o() {
            PIXI.Container.call(this), e.bindAll(this), this.label = new PIXI.extras.BitmapText("00:00", {
                font: "ui"
            }), this.label.scale.set(.8, .8), this.addChild(this.label), n.setInterval(this.updateClock, 1e4), this.updateClock()
        }
        return t.extend(o, PIXI.Container), o.prototype.updateClock = function() {
            var t = new Date(i.getServerTime()),
                e = (t.getHours() < 10 ? "0" : "") + t.getHours(),
                n = (t.getMinutes() < 10 ? "0" : "") + t.getMinutes();
            this.label.text = e + ":" + n
        }, o
    }), _d("$)%", [], function() {
        "use strict";
        function t() {
            this.text = this.createText()
        }
        return t.prototype.createText = function() {
            return ""
        }, t.prototype.hasText = function() {
            return "" !== this.text
        }, t.prototype.getText = function() {
            return this.text
        }, t
    }), _d("$)^", ["^#", "$)%", "@))", "$%", "#@"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            e.apply(this, arguments)
        }
        return t.extend(s, e), s.prototype.createText = function() {
            return this.checkData(n.getGameDetails()) ? this.createList([{
                title: o.get("complianceBar_session"),
                description: n.gameDetails.sessionBalance
            }, {
                title: o.get("complianceBar_participation"),
                description: n.gameDetails.participation
            }, {
                title: o.get("complianceBar_prize"),
                description: n.gameDetails.prizes
            }]) : e.prototype.createText.call(this)
        }, s.prototype.createList = function(t) {
            for (var e = "", n = 0; n < t.length; n++)
                0 < n && (e += " / "), e += t[n].title + " " + i.format(Number(t[n].description));
            return e
        }, s.prototype.checkData = function(t) {
            return t.sessionBalance && t.participation && t.prizes
        }, s
    }), _d("#!!", ["@#*", "$)%", "$)&", "$)^"], function(t, e, n, i) {
        "use strict";
        function o() {}
        return o.getGameDetails = function() {
            return new ({
                it: n,
                es: i
            }[t.getLicense().name] || e)
        }, o
    }), _d("$)&", ["^#", "$)%", "@))"], function(t, e, n) {
        "use strict";
        function i() {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.createText = function() {
            return this.checkData(n.getGameDetails()) ? n.gameDetails.sessionId + "/" + n.gameDetails.ticketId : e.prototype.createText.call(this)
        }, i.prototype.checkData = function(t) {
            return t.sessionId && t.ticketId
        }, i
    }), _d("@()", ["^#", ")*", "$%", "*", "(#", "@@", "#@", "@(&", "$)*", "$)(", ")", "#", "$))", "(@", "@(*"], function(t, i, o, s, r, e, a, h, n, p, u, c, l, d, f) {
        "use strict";
        function g(t, e) {
            this.numberOfAutoSpins = t, this.startHandler = e;
            var n = {
                spinsLabel: a.get("autospin_message_window_spins"),
                totalBetLabel: a.get("autospin_message_window_total_bet"),
                moreSettings: a.get("autospin_message_window_more_settings"),
                stopLoss: a.get("stop_loss"),
                totalBet: o.format(s.totalBet),
                spins: t
            };
            i.call(this, {
                title: a.get("autospin_message_window_title"),
                message: r.get("autoSpinMessageWindow.html", n),
                buttons: [{
                    label: a.get("autospin_message_window_cancel"),
                    hideWindow: !0,
                    priority: "secondary"
                }, {
                    label: a.get("autospin_message_window_start"),
                    action: e,
                    hideWindow: !0
                }]
            })
        }
        return t.extend(g, i), g.prototype.show = function(t) {
            var e = i.prototype.show.call(this, t);
            h.stopLossDifference = parseInt(s.totalBet * this.numberOfAutoSpins, 10), u.bind(new p("stopLossInput"), h, "stopLossDifference");
            var n = u.byId("moreLink");
            return d.onClick(n, this.onMoreLinkClicked), h.on("stopLossDifference/changed", this.onStopLossDiffrenceChanged), e
        }, g.prototype.hide = function() {
            i.prototype.hide.call(this), h.off("stopLossDifference/changed", this.onStopLossDiffrenceChanged)
        }, g.prototype.onStopLossDiffrenceChanged = function() {
            var t = u.byClass("primary")[0];
            h.stopLossDifference > s.totalBet ? (u.addClass(t, "enabled"), u.removeClass(t, "disabled")) : (u.addClass(t, "disabled"), u.removeClass(t, "enabled"))
        }, g.prototype.onMoreLinkClicked = function() {
            this.hide(), c.emit("popup/open", {
                content: l
            });
            var t = function() {
                new g(this.numberOfAutoSpins, this.startHandler)
            }.bind(this);
            c.once("popup/close", t), c.once("popup/open", function() {
                c.off("popup/close", t)
            })
        }, g
    }), _d("$)*", ["!", ")", "(@"], function(e, n, i) {
        "use strict";
        function t(t) {
            e.bindAll(this), this._value = !1, this.element = n.byId(t), i.onClick(this.element, this.onClick)
        }
        return t.prototype.onClick = function() {
            this.value = !this.value, this.change()
        }, Object.defineProperty(t.prototype, "value", {
            get: function() {
                return this._value
            },
            set: function(t) {
                this._value !== t && ((this._value = t) ? this.addSelectedClass() : this.removeSelectedClass(), this.change && this.change())
            }
        }), t.prototype.addSelectedClass = function() {
            n.addClass(this.element, "selected")
        }, t.prototype.removeSelectedClass = function() {
            n.removeClass(this.element, "selected")
        }, t
    }), _d("%!!", ["!", ")", "#", "@&)", "@##", "^&"], function(i, o, t, e, n, s) {
        "use strict";
        function r(t, e) {
            i.bindAll(this);
            var n = this.parseFrameName(t);
            this.numberFormat = n.numberFormat, this.id = n.prefix, this.startFrame = n.firstIndex, this.endFrame = n.firstIndex + e - 1, this.currentFrame = this.startFrame, this.image = o.byId(t)
        }
        return r.prototype.parseFrameName = function(t) {
            var e = t.lastIndexOf("_"),
                n = t.substring(0, e + 1),
                i = t.substring(e + 1, t.length);
            return {
                prefix: n,
                numberFormat: i.length,
                firstIndex: parseInt(i)
            }
        }, r.prototype.play = function(t) {
            this.startTicker(), this.options = this.parseOptions(t), this.reverse = this.options.reverse
        }, r.prototype.stop = function() {
            this.stopTicker()
        }, r.prototype.startTicker = function() {
            t.on("game/update", this.tick)
        }, r.prototype.stopTicker = function() {
            t.off("game/update", this.tick)
        }, r.prototype.tick = function() {
            o.byId(this.getFormattedFrame(this.startFrame)) ? (o.removeClass(this.image, this.getFormattedFrame(this.currentFrame)), this.currentFrame = this.getNextFrame(), this.checkProgress(), o.addClass(this.image, this.getFormattedFrame(this.currentFrame))) : this.stop()
        }, r.prototype.getFormattedFrame = function(t) {
            return this.id + s.addLeadingZeros(t, this.numberFormat)
        }, r.prototype.checkProgress = function() {
            var t = this.getNextFrame();
            (t > this.endFrame || t < this.startFrame) && this.boundingFrameReached()
        }, r.prototype.getNextFrame = function() {
            return this.currentFrame + this.getDirection()
        }, r.prototype.boundingFrameReached = function() {
            !1 === this.options.loop ? this.stop() : (!0 === this.options.yoyo ? this.toggleReverse() : this.currentFrame = this.reverse ? this.endFrame : this.startFrame, 0 < this.options.repeatDelay && (this.stopTicker(), n(this.pauseInterval), this.pauseInterval = e(this.startTicker, this.options.repeatDelay)))
        }, r.prototype.getDirection = function() {
            return this.reverse ? -1 : 1
        }, r.prototype.parseOptions = function(t) {
            return {
                yoyo: void 0 !== t.yoyo && t.yoyo,
                reverse: void 0 !== t.reverse && t.reverse,
                loop: void 0 !== t.loop && t.loop,
                repeatDelay: void 0 !== t.repeatDelay ? t.repeatDelay : 0
            }
        }, r.prototype.toggleReverse = function() {
            this.reverse = !this.reverse
        }, r
    }), _d("$)(", ["!", ")", "$%", "^!"], function(n, i, o, s) {
        "use strict";
        function t(t, e) {
            n.bindAll(this), e = void 0 === e || e, this.element = i.byId(t), this.element.innerHTML = e ? this.createInputWithCurrency() : this.createInput(), this.input = this.element.children[0], s.isSamsungBrowser() ? this.input.onkeydown = this.onKeyPress : this.input.onkeypress = this.onKeyPress, this.input.onkeyup = this.onChange, this.input.onclick = function(t) {
                t.stopImmediatePropagation()
            }
        }
        return t.prototype.createInputWithCurrency = function() {
            var t = o.isSignOnTheLeft() ? "left" : "right",
                e = o.formatString("<input type='tel' value='0' style='text-align: " + t + "'/>");
            return o.isSignOnTheLeft && (e = " " + e), e
        }, t.prototype.createInput = function() {
            return "<input type='tel' value='0'/>"
        }, t.prototype.blurInput = function(t) {
            var e = 13;
            s.isSamsungBrowser() && (e = 9), t.keyCode === e && this.input.blur()
        }, t.prototype.onKeyPress = function(t) {
            if (!(0 <= [37, 38, 39, 40, 46, 8].indexOf(t.keyCode))) {
                this.blurInput(t);
                var e = t.keyCode || t.which;
                e = String.fromCharCode(e), /[0-9]|\./.test(e) || (t.returnValue = !1, t.preventDefault && t.preventDefault())
            }
        }, t.prototype.onChange = function() {
            var t = parseFloat(this.input.value);
            isNaN(t) && (t = 0), this.input.value = t, this.change()
        }, Object.defineProperty(t.prototype, "value", {
            get: function() {
                return parseFloat(this.input.value)
            },
            set: function(t) {
                this.input.value !== parseFloat(t) && (this.input.value = parseFloat(t))
            }
        }), t
    }), _d("%!@", ["$)(", "^#", ")", "@$", "@@"], function(i, t, e, o, n) {
        "use strict";
        function s(t, e, n) {
            i.apply(this, arguments), this.linkedCheckbox = n, this.hideLinkedCheckbox(), o(this.updateValue, 0)
        }
        return t.extend(s, i), s.prototype.onChange = function() {
            this.updateValue(), this.change()
        }, s.prototype.updateValue = function() {
            var t = parseFloat(this.input.value);
            isNaN(t) && (t = 0), n.showMobileUI ? (this.input.value = t || "", this.setLinkedCheckboxValue(!!t)) : this.input.value = t
        }, s.prototype.setLinkedCheckboxValue = function(t) {
            this.linkedCheckbox && (this.linkedCheckbox.value = t)
        }, s.prototype.hideLinkedCheckbox = function() {
            this.linkedCheckbox && (this.linkedCheckbox.element.style.display = "none")
        }, s
    }), _d("%!#", ["!", ")"], function(e, n) {
        "use strict";
        function t(t) {
            e.bindAll(this), this.element = n.byId(t), this.element.onchange = this.onChange
        }
        return t.prototype.onChange = function() {
            this.change();
            var t = n.byId(this.element.id + "Output");
            n.removeClass(t, "show")
        }, Object.defineProperty(t.prototype, "value", {
            get: function() {
                return parseFloat(this.element.value)
            },
            set: function(t) {
                this.element.value = t
            }
        }), t
    }), _d("%!^", [")", "!", "@$", "(#", "@%", "%!$", "%!%", "&%"], function(i, e, t, n, o, s, r, a) {
        "use strict";
        function h(t) {
            e.bindAll(this), this._scrollOffset = 0, this._initialIndex = 0, this.html = "", this.index = 0, this.swiperContentHeight = 0, this.openingIndex = 0, this.createHTMLSpinner(t), this.elementsWrapper = this.html.getElementsByClassName("options")[0], this.elements = this.elementsWrapper.children, this.gridChildren = this.html.getElementsByClassName("grid")[0].children, this.swiperContent = this.html.getElementsByClassName("swiperContent")[0], this.elementsHeight = this.elements[0].clientHeight, this.movementTracker = this.createMovementTracker(), this.scroller = this.createScroller(), this.scaleSpinnerElements()
        }
        return h.prototype.createHTMLSpinner = function(t) {
            var e = n.get("swiperPicker.html", {
                data: t
            });
            this.html = i.toHTML(e)
        }, h.prototype.scaleSpinnerElements = function() {
            for (var t = 0; t < this.elements.length; t++) {
                var e = this.elements[t].children[0],
                    n = (this.scrollOffset + t * this.elementsHeight + .5 * this.elementsHeight) / this.swiperContentHeight;
                n = Math.max(0, Math.min(n, 1));
                var i = Math.PI * (1 + n),
                    o = -Math.sin(i),
                    s = 50 * (1 - o) * (.5 < n ? -1 : 1);
                TweenMax.set(e, {
                    opacity: a.clamp(Math.max(.15, Math.pow(o, 5)), 0, 1),
                    y: s,
                    scaleY: a.clamp(Math.pow(o, 1), 0, 1),
                    scaleX: .55 + o / 2
                })
            }
        }, h.prototype.resetElements = function() {
            this.swiperContent.style.height = "100%";
            for (var t = 0; t < this.elements.length; t++) {
                var e = this.elements[t].children[0];
                TweenMax.set(e, {
                    opacity: 1,
                    y: 0,
                    scaleX: 1,
                    scaleY: 1
                })
            }
            for (var n = 0; n < this.gridChildren.length; n++)
                i.removeClass(this.gridChildren[n], "showBorder")
        }, h.prototype.refresh = function() {
            this.forceStopOnSlowSpeed(), this.scroller.stopScrolling(), this.resetElements(), this.scrollOffset = 0, this.elementsHeight = this.elements[0].clientHeight;
            var t = this.getTotalIndexes(Math.floor(this.swiperContent.clientHeight / this.elementsHeight));
            this.initialIndex = (t - 1) / 2, this.gridChildren[this.initialIndex] && i.addClass(this.gridChildren[this.initialIndex], "showBorder"), this.resizeElements(t), this.scaleSpinnerElements(), this.scrollToIndex(this.index)
        }, h.prototype.scrollToIndex = function(t) {
            this.index = t, this.scrollOffset = -(this.index - this.initialIndex) * this.elementsHeight, this.openingIndex = this.index, this.scaleSpinnerElements(), this.moveBy(0)
        }, h.prototype.resizeElements = function(t) {
            this.scroller.snapToGridWithSize(this.elementsHeight), this.swiperContent.style.height = t * this.elementsHeight - 20 + "px", this.swiperContentHeight = this.swiperContent.clientHeight, this.swiperContent.style.marginTop = -(this.swiperContent.clientHeight - this.swiperContent.parentNode.clientHeight) / 2 - this.elementsHeight / 2 + "px"
        }, h.prototype.getTotalIndexes = function(t) {
            return t % 2 ? t : t + 1
        }, h.prototype.getValue = function() {
            return this.forceStopOnSlowSpeed(), (this.elements[this.index] || this.elements[this.openingIndex]).children[0].attributes.rel.value
        }, h.prototype.forceStopOnSlowSpeed = function() {
            Math.abs(this.scroller.velocity) < 1.7 && (this.scroller.stopScrolling(), this.onMouseMoveComplete(0, 1))
        }, h.prototype.createMovementTracker = function() {
            return new s(this.elementsWrapper, {
                onStart: this.onMouseStart,
                onMove: this.onMouseMove,
                onComplete: this.onMouseMoveComplete
            })
        }, h.prototype.onMouseStart = function() {
            this.scroller.stopScrolling()
        }, h.prototype.onMouseMove = function(t, e) {
            this.moveBy(e)
        }, h.prototype.moveBy = function(t) {
            this.velocity = t, this.scrollOffset += t, -(this.scrollOffset - this.swiperContentHeight) > this.elementsWrapper.clientHeight && (this.scrollOffset += this.elementsWrapper.clientHeight / 2), 0 < this.scrollOffset && (this.scrollOffset -= this.elementsWrapper.clientHeight / 2), this.scaleSpinnerElements()
        }, h.prototype.createScroller = function() {
            return new r(this, {
                onScroll: this.onScroll,
                onComplete: this.onScrollComplete
            })
        }, h.prototype.onMouseMoveComplete = function(t, e) {
            var n = a.clamp(e, -700, 700);
            Math.abs(n) < 5 && (this.index = this.getIndex(), n = -((this.index - this.initialIndex) * this.elementsHeight + this.scrollOffset)), this.scroller.run(this.scrollOffset, n)
        }, h.prototype.onScroll = function(t) {
            this.moveBy(t)
        }, h.prototype.onScrollComplete = function() {
            this.index = this.getIndex(), this.elements[this.index].children[0].style.opacity = 1
        }, h.prototype.getIndex = function() {
            return Math.round((this.elementsHeight * this.initialIndex - this.scrollOffset) / this.elementsHeight)
        }, Object.defineProperty(h.prototype, "initialIndex", {
            get: function() {
                return this._initialIndex
            },
            set: function(t) {
                this._initialIndex = t
            }
        }), Object.defineProperty(h.prototype, "scrollOffset", {
            get: function() {
                return this._scrollOffset
            },
            set: function(t) {
                this._scrollOffset = t, TweenMax.set(this.elementsWrapper, {
                    y: t
                })
            }
        }), h
    }), _d("%!&", ["!", ")", "@(#", "@@"], function(o, s, r, a) {
        "use strict";
        function t(t, e, n, i) {
            o.bindAll(this), this.element = s.byId(t), a.isDesktop && r.canPlayVideo() && (this.element.style.background = "initial", this.addVideo(e, n, i))
        }
        return t.prototype.addVideo = function(t, e, n) {
            var i = r.createVideoElement(t);
            this.element.appendChild(i), void 0 !== e && (i.style.width = e + "px"), void 0 !== n && (i.style.height = n + "px")
        }, t
    }), _d("@)^", [")*", "^#", "#@", "%)", "@@", "#"], function(n, t, i, o, s, e) {
        "use strict";
        function r(t) {
            var e = [];
            t.allowContinue ? e = [{
                label: i.get("continue_button") || "OK",
                hideWindow: !0
            }] : s.reloadURL ? e = [{
                label: i.get("error_reload") || "Reload",
                action: function() {
                    o.goToURL(s.reloadURL)
                }
            }] : s.backURL && !s.isDesktop && (e = [{
                label: i.get("error_close") || "Close",
                action: function() {
                    o.goToBackURL()
                }
            }]), t.showDepositButton && s.depositURL && e.push({
                label: i.get("deposit_button"),
                action: this.onDeposit.bind(this)
            }), n.call(this, {
                title: t.title,
                message: t.message,
                buttons: e
            })
        }
        return t.extend(r, n), r.prototype.onDeposit = function() {
            e.emit("deposit/click"), this.hide()
        }, r
    }), _d("%!*", ["!", "#@", "(#", ")", "^!", "#", "@@", "$%!", "(@", "$(%"], function(t, e, n, i, o, s, r, a, h, p) {
        "use strict";
        function u() {
            t.bindAll(this), s.on("game/resize", this.onResize), s.on("popup/close", this.onClose), s.on("popup/hide", this.onClose), s.emit("symbol/hideMiniPaytable")
        }
        return u.prototype.getContent = function() {
            return "<div id='gameHistory' class='scrollable'>"
        }, u.prototype.onAdded = function() {
            new p(this.onSuccess).run()
        }, u.prototype.addContent = function() {
            i.byId("gameHistory").innerHTML += n.get("gameHistory.html", {
                rounds: a.rounds,
                watchButtonLabel: e.get("game_history_watch"),
                timeLabel: e.get("game_history_time_label"),
                betLabel: e.get("game_history_bet_label"),
                winLabel: e.get("game_history_win_label"),
                initialBalanceLabel: e.get("game_history_initial_balance_label"),
                finalBalanceLabel: e.get("game_history_final_balance_label")
            })
        }, u.prototype.onSuccess = function() {
            this.addContent();
            var t = document.getElementById("popup");
            r.showMobileUI ? (t.style.pointerEvents = "auto", i.preventPinch(t)) : t.style.pointerEvents = "none", i.addClass(t, "gameHistoryPopup"), this.onResize();
            for (var e = i.byClass("gameHistoryWatchLink"), n = 0; n < e.length; n++)
                h.onClick(e[n], this.onWatchReplay)
        }, u.prototype.onWatchReplay = function(t) {
            s.emit("watch/run", {
                wagerid: t.target.getAttribute("wagerId"),
                sessid: r.sessionId,
                gameHistorySessionId: t.target.getAttribute("gameHistorySessionId"),
                gameHistoryTicketId: t.target.getAttribute("gameHistoryTicketId")
            })
        }, u.prototype.onResize = function() {
            r.isMobile && !r.isTablet && (document.getElementById("popup").style.height = window.innerHeight + "px")
        }, u.prototype.onClose = function() {
            s.off("game/resize", this.onResize), s.off("popup/close", this.onClose), s.off("popup/hide", this.onClose)
        }, u
    }), _d("@&!", ["!", "(#", ")", "#", "@@", "$!#"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            t.bindAll(this), i.on("game/resize", this.onResize), i.on("popup/close", this.onClose), i.on("popup/hide", this.onClose)
        }
        return r.prototype.getContent = function() {
            return e.get("gameRules.html", {
                content: s.getContent()
            })
        }, r.prototype.onAdded = function() {
            var t = document.getElementById("popup");
            o.showMobileUI ? (t.style.pointerEvents = "auto", n.preventPinch(t)) : t.style.pointerEvents = "none", n.addClass(t, "gameRulesPopup"), this.onResize()
        }, r.prototype.onResize = function() {
            o.isMobile && !o.isTablet && (document.getElementById("popup").style.height = window.innerHeight + "px")
        }, r.prototype.onClose = function() {
            i.off("game/resize", this.onResize), i.off("popup/close", this.onClose), i.off("popup/hide", this.onClose)
        }, r
    }), _d("#&^", ["@#$", "##^"], function(t, e) {
        "use strict";
        function n(t) {
            this.overlay = this.createOverlay(), this.animationTime = void 0 === t ? .2 : t, this.show(), n.Z_INDEX++
        }
        return n.Z_INDEX = 1e4, n.prototype.show = function() {
            this.mouseOverlay = new e(null, 0, 0), t.body.appendChild(this.overlay), TweenMax.to(this.overlay, this.animationTime, {
                css: {
                    opacity: .75
                }
            })
        }, n.prototype.createOverlay = function() {
            return this.overlay = t.createElement("div"), this.overlay.className = "overlay", this.overlay.style.zIndex = n.Z_INDEX, this.overlay
        }, n.prototype.hide = function() {
            TweenMax.to(this.overlay, this.animationTime, {
                css: {
                    opacity: 0
                },
                onComplete: this.onHideComplete.bind(this)
            })
        }, n.prototype.onHideComplete = function() {
            t.body.removeChild(this.overlay), this.mouseOverlay.hide()
        }, n
    }), _d(")*", ["!", "#&^", ")", "(@", "@@", "#", "(#", "$!", "@$", "@%"], function(e, s, r, a, n, h, p, i, o, t) {
        "use strict";
        function u(t) {
            e.bindAll(this), this.AUTOCLOSE_DELAY = 20, this.options = t, this.overlay = this.createOverlay(), this.html = this.show(t), this.initAutoclose(t), h.on("game/resize", this.onResize), this.onResize(), this.preventPinch()
        }
        return u.prototype.preventPinch = function() {
            r.preventPinch(this.html), r.preventMove(this.overlay.overlay)
        }, u.prototype.initAutoclose = function(t) {
            !0 === t.autoclose && i.isDuringAutoSpins && (1 < t.buttons.length || (this.autoCloseTimeout = o(this.getAutocloseHandler(t), this.AUTOCLOSE_DELAY)))
        }, u.prototype.getAutocloseHandler = function(t) {
            return t.buttons ? 1 !== t.buttons.length ? this.hide : "function" != typeof t.buttons[0].handler ? this.hide : t.buttons[0].handler : this.hide
        }, u.prototype.createOverlay = function() {
            return new s
        }, u.prototype.show = function(t) {
            t.toUpperCase = function() {
                return function(t, e) {
                    return e(t).toUpperCase()
                }
            };
            var e = p.get(t.template || "messageWindow.html", t),
                n = r.toHTML(e);
            n.style.zIndex = ++s.Z_INDEX, document.body.insertBefore(n, document.body.firstChild);
            for (var i = n.getElementsByClassName("buttons")[0] ? n.getElementsByClassName("buttons")[0].children : [], o = 0; o < i.length; o++)
                this.addPriorityClass(i[o], t.buttons[o].priority), t.buttons[o].handler = this.makeHandler(t.buttons[o]), a.onClick(i[o], t.buttons[o].handler);
            return !1 === t.modal && (a.onClick(n, this.hide), a.onClick(this.overlay.overlay, this.hide)), t.addHideEvent && h.once("messageWindow/close", this.hide), n
        }, u.prototype.makeHandler = function(t) {
            return function() {
                t.hideAsyncWindow && this.disabled(), t.action && t.action(this.hide.bind(this)), t.hideWindow && this.hide()
            }.bind(this)
        }, u.prototype.hide = function() {
            this.html && (a.removeOnClick(this.overlay.overlay), h.off("game/resize", this.onResize), h.off("messageWindow/close", this.hide), window.removeEventListener("resize", this.onResize), document.body.removeChild(this.html), this.overlay.hide(), t(this.autoCloseTimeout), this.options.onHideComplete && o(this.options.onHideComplete, this.overlay.animationTime))
        }, u.prototype.setVisibleFalse = function() {
            this.html && (this.html.style.visibility = "hidden", this.overlay.hide())
        }, u.prototype.setVisibleTrue = function() {
            this.html && (this.html.style.visibility = "visible", this.overlay.show())
        }, u.prototype.onResize = function() {
            if (this.html) {
                var t = Math.min(n.renderer.width / this.getWidth(), n.renderer.height / this.getHeight());
                n.showMobileUI && (t *= this.getMobileScaleFactor()), n.renderer.width < n.renderer.height && (t *= this.getPortraitScaleFactor());
                var e = n.getScaleFactor();
                t /= e, this.html.style.transform = this.html.style.webkitTransform = "scale(" + t + "," + t + ")", this.html.style.left = n.renderer.width / 2 / e - this.html.clientWidth / 2 * t + "px", this.html.style.top = n.renderer.height / 2 / e - this.html.clientHeight / 2 * t + "px"
            }
        }, u.prototype.getWidth = function() {
            return 1680
        }, u.prototype.getHeight = function() {
            return 1200
        }, u.prototype.getMobileScaleFactor = function() {
            return 1.3
        }, u.prototype.getPortraitScaleFactor = function() {
            return 1.35
        }, u.prototype.disabled = function() {
            this.html.style.pointerEvents = "none"
        }, u.prototype.enabled = function() {
            this.html.style.pointerEvents = ""
        }, u.prototype.addPriorityClass = function(t, e) {
            r.addClass(t, this.getButtonPriorityClass(e))
        }, u.prototype.getButtonPriorityClass = function(t) {
            return "secondary" === t ? this.getSecondaryButtonClass() : this.getPrimaryButtonClass()
        }, u.prototype.getPrimaryButtonClass = function() {
            return "message_window_button primary"
        }, u.prototype.getSecondaryButtonClass = function() {
            return "message_window_button secondary"
        }, u
    }), _d("%!(", ["#@", "(#", "#", "!", "^!", ")", "#))", "%*", "#^%", "#(*", "@@"], function(r, t, e, n, i, o, a, h, p, u, s) {
        "use strict";
        function c() {
            n.bindAll(this), e.on("popup/nextPage", this.nextPage), e.on("popup/prevPage", this.prevPage), e.on("popup/showPage", this.showPage)
        }
        return c.prototype.dispose = function() {
            e.off("popup/nextPage", this.nextPage), e.off("popup/prevPage", this.prevPage), e.off("popup/showPage", this.showPage)
        }, c.prototype.nextPage = function() {
            this.swiper.slideNext()
        }, c.prototype.prevPage = function() {
            this.swiper.slidePrev()
        }, c.prototype.showPage = function(t, e) {
            e ? this.swiper.slideTo(t + 1) : this.swiper.slideTo(t + 1, 0)
        }, c.prototype.getPages = function() {
            return []
        }, c.prototype.getContent = function() {
            return "<div id='paytable'></div>"
        }, c.prototype.onAdded = function() {
            var t = document.getElementById("paytable");
            this.pages = this.getPages(), this.createSwiperWrapper(), s.showMobileUI ? (t.style.pointerEvents = "auto", o.preventPinch(t)) : t.style.pointerEvents = "none", t.style.width = window.innerWidth
        }, c.prototype.createSwiperWrapper = function() {
            var t = document.getElementById("paytable"),
                e = o.toHTML("<div class='swiper-container'></div>"),
                n = o.toHTML("<div class='swiper-wrapper'></div>"),
                i = o.toHTML("<div class='swiper-pagination swiper-no-swiping'></div>");
            t.appendChild(e), e.appendChild(n), e.appendChild(i), this.addAllPages(n)
        }, c.prototype.addAllPages = function(i) {
            this.pages.forEach(function(t, e) {
                var n = o.toHTML("<div class='popupPage swiper-slide'></div>");
                n.innerHTML = t, n.id = "popupPage" + e, document.getElementById("popup").style.left = 0, document.getElementById("popup").style.top = 0, i.appendChild(n)
            }.bind(this))
        }, c.prototype.getSymbolsData = function(t, e) {
            var n = h.clone(p.symbols),
                i = h.toArray(n).splice(t, e),
                o = this.nameToLowerCase(i),
                s = this.filterByType(o, p.TYPE_NORMAL);
            return this.symbolsAddedRewardNumbers = this.addRewardNumbers(s), {
                symbols: this.symbolsAddedRewardNumbers,
                malfunction: r.get("infoPages_malfunctionInfo")
            }
        }, c.prototype.nameToLowerCase = function(t) {
            return h.toArray(t).map(function(t) {
                return t.name = t.name.toLowerCase(), t
            })
        }, c.prototype.filterByType = function(t, e) {
            return h.toArray(t).filter(function(t) {
                return t.type === e
            })
        }, c.prototype.addRewardNumbers = function(t) {
            return t.map(function(t) {
                return t.prizes = t.prizes.map(function(t, e) {
                    return this.getPrizeWithRewardNumbers(t, e)
                }.bind(this)), t
            }.bind(this))
        }, c.prototype.getPrizeWithRewardNumbers = function(t, e) {
            if (t.reward)
                return t;
            var n = {};
            return n.reward = 5 - e, n.coins = t, n
        }, c.prototype.getPaylinesData = function() {
            var t = this.paylinesData || {};
            t.paylines = [];
            for (var e = 0; e < a.paylines.length; e++) {
                for (var n = {
                        data: []
                    }, i = 0; i < u.getRows(); i++)
                    for (var o = 0; o < a.paylines[e].length; o++) {
                        var s = {};
                        s.selected = a.paylines[e][o] === i, n.data.push(s)
                    }
                t.paylines.push(n)
            }
            return t.description = r.get("infoPages_paylinesDescription"), t.malfunction = r.get("infoPages_malfunctionInfo"), this.paylinesData = t
        }, c
    }), _d("#$!", ["!", "^#", ")*", "$%", ")", "##)", "@@", "(#", "#@"], function(t, e, n, o, i, s, r, a, h) {
        "use strict";
        function p(t) {
            this.actionOnConfirm = t.onConfirm, this.actionOnCancel = t.onCancel, this.amountRegExp = /^\d+([,\.]\d{1,2})?$/, this.potValueChanged = !1, this.potInput = null, this.potRange = null, this.potDecButton = null, this.potIncButton = null, this.potIncDecRatio = .1, t.template = t.template || "genericMessageWindow.html", n.call(this, t)
        }
        return e.extend(p, n), p.prototype.getButtons = function() {
            return [{
                label: h.get("pot_message_window_cancel"),
                action: this.onCancel.bind(this),
                priority: "secondary"
            }, {
                label: h.get("pot_message_window_ok"),
                action: this.onConfirm.bind(this)
            }]
        }, p.prototype.getMessage = function() {
            var t = s.getMaxPot(),
                e = o.isSignOnTheLeft(),
                n = o.SIGNS[r.currency] || r.currency,
                i = '<span class="highlight">' + o.format(s.startBalance) + "</span>";
            return a.get("potRequestMessage.html", {
                defaultPot: t,
                minPot: s.minPot,
                maxPot: s.maxPot,
                msgBalance: h.get("pot_message_window_balance", i),
                msgToTransfer: h.get("pot_message_window_to_transfer"),
                msgMaxPot: h.get("pot_message_window_max", o.format(t)),
                currencyOnTheLeft: e ? n : "",
                currencyOnTheRight: e ? "" : n
            })
        }, p.prototype.onConfirm = function() {
            this.disabled(), this.clearError();
            var t = this.getValue(this.potInput);
            t && this.validate(t) ? (t = s.setPot(t), this.updateValue(s.setPot(t)), this.actionOnConfirm(t)) : (this.showError(h.get("pot_message_window_error_format")), this.enabled())
        }, p.prototype.onCancel = function() {
            this.disabled(), this.actionOnCancel()
        }, p.prototype.show = function(t) {
            return t.message = '<div class="potRequest"><p>' + h.get("pot_message_window_loading") + "</p></div>", t.buttons = [], n.prototype.show.call(this, t)
        }, p.prototype.showOnCloseConfirm = function() {
            this.options.message = this.getMessage(), this.options.buttons = this.getButtons(), document.body.removeChild(this.html);
            var t = n.prototype.show.call(this, this.options);
            i.preventZoom(t), this.potValueChanged = !1, this.potInput = t.querySelector(".potRequest #potInput"), this.potRange = t.querySelector(".potRequest #potRange"), this.potIncButton = t.querySelector(".potRequest #potIncrease"), this.potDecButton = t.querySelector(".potRequest #potDecrease"), this.potInput.addEventListener("keypress", this.filterInputChars), this.potInput.addEventListener("focus", this.clearValue), this.potInput.addEventListener("input", this.onInputChange), i.onRangeChange(this.potRange, this.onInputChange), this.potIncButton.addEventListener("click", this.potValueIncrease), this.potDecButton.addEventListener("click", this.potValueDecrease), this.html = t, this.onResize()
        }, p.prototype.filterInputChars = function(t) {
            var e = t.key || String.fromCharCode(t.charCode);
            "0123456789.,".indexOf(e) < 0 && (t.preventDefault(), "Enter" !== e && 13 !== t.charCode || this.onConfirm())
        }, p.prototype.clearValue = function(t) {
            this.potValueChanged || (t.target.value = "", this.potValueChanged = !0)
        }, p.prototype.onInputChange = function(t) {
            this.potValueChanged = !0;
            var e = this.getValue(t.target);
            e && (e = s.setPot(e), this.updateValue(e), this.clearError())
        }, p.prototype.updateValue = function(t) {
            this.potInput.value = t, this.potRange.value = t
        }, p.prototype.potValueIncrease = function(t) {
            this.updateValue(s.increasePot(this.potIncDecRatio))
        }, p.prototype.potValueDecrease = function(t) {
            this.updateValue(s.decreasePot(this.potIncDecRatio))
        }, p.prototype.getValue = function(t) {
            if (t.valueAsNumber && t.valueAsNumber)
                return t.valueAsNumber;
            var e = t.value.trim().replace(",", ".");
            return this.amountRegExp.test(e) ? +e : null
        }, p.prototype.validate = function(t) {
            var e = s.getMinPot(),
                n = s.getMaxPot();
            if (t < e)
                this.showError(h.get("pot_message_window_error_min", o.format(e)));
            else {
                if (!(n < t))
                    return !0;
                this.showError(h.get("pot_message_window_error_max", o.format(n)))
            }
        }, p.prototype.showError = function(t) {
            var e = this.html.querySelector(".potRequest");
            e.querySelector(".inputError").innerHTML = t, i.addClass(e, "showError")
        }, p.prototype.clearError = function() {
            i.removeClass(this.html.querySelector(".potRequest"), "showError")
        }, p.prototype.getPrimaryButtonClass = function() {
            return "primary"
        }, p.prototype.getSecondaryButtonClass = function() {
            return "secondary"
        }, p.prototype.getWidth = function() {
            return 1600
        }, p.prototype.getHeight = function() {
            return 1200
        }, p
    }), _d("#%@", ["^#", ")*", "@#*", "%!*", ")", "#", "(@", "#@", "#%!", "^&", "$%", "@@", "(#", "%)", "("], function(t, i, n, o, s, r, a, h, p, u, c, l, d, f, g) {
        "use strict";
        function y(t, e) {
            this.onContinue = t, this.onStop = e;
            var n = this.configurePopup();
            i.call(this, {
                title: n.title,
                message: n.message,
                buttons: n.buttons
            })
        }
        return t.extend(y, i), y.prototype.configurePopup = function() {
            var t = p.getBalanceDifference(),
                e = h.get(t < 0 ? "time_reminder_money_lost_text" : "time_reminder_money_won_text"),
                n = this.assembleMessageSecondLine(e, t);
            return {
                message: d.get("realityCheckMessageWindow.html", {
                    firstLine: u.substitute(h.get("time_reminder_time_text_minutes"), p.getMinutesPassed()),
                    secondLine: n,
                    showGameHistoryLink: l.showGameHistory() || l.clientHistoryURL,
                    gameHistoryLabel: h.get("game_history")
                }),
                buttons: [{
                    label: h.get("time_reminder_stop"),
                    action: this.onStop,
                    hideAsyncWindow: !0
                }, {
                    label: h.get("time_reminder_continue"),
                    action: this.onContinue,
                    hideAsyncWindow: !0
                }]
            }
        }, y.prototype.assembleMessageSecondLine = function(t, e) {
            return p.gamingWinLoss || p.sportsWinLoss ? h.get("bet365_reality_check_win_loss", p.sportsWinLoss, l.currency, p.gamingWinLoss) : n.getLicense().hasHiddenRealityCheckAmount() ? "" : u.substitute(t, c.format(Math.abs(e), l.currency))
        }, y.prototype.show = function(t) {
            var e = i.prototype.show.call(this, t),
                n = s.byId("moreLink");
            return n && a.onClick(n, this.onGameHistoryLinkClicked), e
        }, y.prototype.onGameHistoryLinkClicked = function() {
            if (l.clientHistoryURL)
                f.openNewWindow(l.clientHistoryURL);
            else {
                this.hide();
                var t = function() {
                    new y(this.onContinue, this.onStop)
                }.bind(this);
                if (l.showNewMobileUI) {
                    var e = g.root.burgerMenu;
                    e.sideMenuView.openPage(e.getPageById("burgerMenu_gameHistory"), t)
                } else
                    r.emit("popup/open", {
                        content: o,
                        keepOpen: !0
                    }), r.once("popup/close", t), r.once("popup/open", function() {
                        r.off("popup/close", t)
                    })
            }
        }, y
    }), _d("#%$", ["^#", "#%@", "#%!", "#@", "@#*", "^&", "@@", "$%", "(#"], function(t, n, o, s, r, a, h, p, e) {
        "use strict";
        function i(t, e) {
            n.call(this, t, e)
        }
        return t.extend(i, n), i.prototype.configurePopup = function() {
            var t = {
                    MAX_TIME: this.configureForMaxTime.bind(this),
                    MAX_LOSS: this.configureForMaxLoss.bind(this),
                    REMINDER: this.configureForReminder.bind(this)
                },
                e = o.getBalanceDifference(),
                n = s.get(e < 0 ? "time_reminder_money_lost_text" : "time_reminder_money_won_text"),
                i = r.getLicense().hasHiddenRealityCheckAmount() ? "" : a.substitute(n, p.format(Math.abs(e), h.currency));
            return t[o.errorType](i)
        }, i.prototype.configureForMaxTime = function(t) {
            return {
                title: s.get("realityCheck_max_time_title"),
                message: e.get("realityCheckMessageWindowSpain.html", {
                    firstLine: a.substitute(s.get("time_reminder_time_text_minutes"), o.getMinutesPassed()),
                    secondLine: t,
                    thirdLine: s.get("realityCheck_start_new_session")
                }),
                buttons: [{
                    label: s.get("time_reminder_stop"),
                    action: this.onStop,
                    hideAsyncWindow: !0
                }]
            }
        }, i.prototype.configureForMaxLoss = function(t) {
            return {
                title: s.get("realityCheck_max_loss_title"),
                message: e.get("realityCheckMessageWindowSpain.html", {
                    firstLine: a.substitute(s.get("time_reminder_time_text_minutes"), o.getMinutesPassed()),
                    secondLine: t,
                    thirdLine: s.get("realityCheck_start_new_session")
                }),
                buttons: [{
                    label: s.get("time_reminder_stop"),
                    action: this.onStop,
                    hideAsyncWindow: !0
                }]
            }
        }, i.prototype.configureForReminder = function(t) {
            return {
                title: s.get("realityCheck_reminder_title"),
                message: e.get("realityCheckMessageWindowSpain.html", {
                    firstLine: a.substitute(s.get("time_reminder_time_text_minutes"), o.getMinutesPassed()),
                    secondLine: t
                }),
                buttons: [{
                    label: s.get("time_reminder_continue"),
                    action: this.onContinue,
                    hideAsyncWindow: !0
                }]
            }
        }, i
    }), _d("$))", ["!", "#@", "(#", ")", "@@", "%&", "@(&", "$*", "%!#", "$)*", "$)(", "^!", "#", "#*!", "@$$"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d, f) {
        "use strict";
        function g() {
            t.bindAll(this), l.on("game/resize", this.onResize), l.on("popup/close", this.onClose), l.on("popup/hide", this.onClose)
        }
        return g.prototype.getContent = function() {
            return n.get("settings.html", {
                sections: this.getSections()
            })
        }, g.prototype.getSections = function() {
            var t = this.getData();
            return (o.showMobileUI ? [t.audio, t.visual, t.options, t.autoplay] : [t.audio, t.options, t.autoplay, t.visual]).filter(function(t) {
                return t && t.components && 0 < t.components.length
            })
        }, g.prototype.getData = function() {
            var t = {};
            return t.audio = {
                label: e.get("settingsAudio"),
                components: [{
                    slider: !0,
                    id: "volumeSlider",
                    label: e.get("settingsVolume")
                }, {
                    checkbox: !0,
                    id: "soundsEnabledCheckbox",
                    label: e.get("settingsSfx")
                }, {
                    checkbox: !0,
                    id: "musicEnabledCheckbox",
                    label: e.get("settingsSnd")
                }]
            }, t.visual = {
                label: e.get("settingsVisual"),
                components: [{
                    slider: !0,
                    id: "spinSpeedSlider",
                    label: e.get("settingsSpeed")
                }]
            }, f.isSplashScreenAvailable() && t.visual.components.push({
                checkbox: !0,
                id: "splashScreenEnabledCheckbox",
                label: e.get("settings_showSplashScreen")
            }), d.isVideoAvailable() && t.visual.components.push({
                checkbox: !0,
                id: "videoIntroEnabledCheckbox",
                label: e.get("settings_showVideoIntro")
            }), t.options = {
                label: e.get("settings_options"),
                components: []
            }, o.hasCurrencyCoinsOption() && t.options.components.push({
                checkbox: !0,
                id: "showCurrencyCheckbox",
                label: e.get("settingsShowCurrency")
            }), o.isDesktop && t.options.components.push({
                checkbox: !0,
                id: "pressSpaceToSpinCheckbox",
                label: e.get("settings_spaceToSpin")
            }), o.isAutoSpinsEnable() && (t.autoplay = {
                label: e.get("settingsStop"),
                components: [{
                    checkbox: !0,
                    id: "stopAutoplayAnyWinCheckbox",
                    label: e.get("stopAutoplayAnyWinAtLeast") + " " + this.createInput("stopAutoplayAnyWinAtLeastInput")
                }, {
                    checkbox: !0,
                    id: "stopAutoplayCashIncreasesCheckbox",
                    label: e.get("settingsAuto3") + " " + this.createInput("stopAutoplayCashIncreasesInput")
                }]
            }, o.isLossLimitEnabled() || t.autoplay.components.push({
                checkbox: !0,
                id: "stopAutoplayCashDecreasesCheckbox",
                label: e.get("settingsAuto4") + " " + this.createInput("stopAutoplayCashDecreasesInput")
            }), r.showStopAutoSpinOnFreeSpins() && t.autoplay.components.push({
                checkbox: !0,
                id: "stopAutoplayFreespinsModeCheckbox",
                label: e.get("settings_stopOnFreespins")
            })), t
        }, g.prototype.createInput = function(t) {
            return "<p id='" + t + "' class='settings-input'></p>"
        }, g.prototype.onVolumeChanged = function() {
            i.byId("volumeSlider").value = s.globalVolume
        }, g.prototype.onAdded = function() {
            i.bind(new h("volumeSlider"), s, "globalVolume"), s.on("globalVolume/changed", this.onVolumeChanged), i.bind(new h("spinSpeedSlider"), r, "spinSpeed"), i.bind(new p("soundsEnabledCheckbox"), s, "soundsEnabled"), i.bind(new p("musicEnabledCheckbox"), s, "musicEnabled"), o.isAutoSpinsEnable() && (i.bind(new p("stopAutoplayAnyWinCheckbox"), r, "stopAfterWin"), i.bind(new u("stopAutoplayAnyWinAtLeastInput"), r, "stopThresholdIfWin"), o.isLossLimitEnabled() || (i.bind(new p("stopAutoplayCashDecreasesCheckbox"), r, "stopIfCashDecrease"), i.bind(new u("stopAutoplayCashDecreasesInput"), r, "cashDiffrenceIfDecrease")), i.bind(new p("stopAutoplayCashIncreasesCheckbox"), r, "stopIfCashIncrease"), i.bind(new u("stopAutoplayCashIncreasesInput"), r, "cashDiffrenceIfIncrease"), r.showStopAutoSpinOnFreeSpins() && i.bind(new p("stopAutoplayFreespinsModeCheckbox"), r, "stopIfFreespinsMode")), o.hasCurrencyCoinsOption() && i.bind(new p("showCurrencyCheckbox"), a, "showCoins"), d.isVideoAvailable() && i.bind(new p("videoIntroEnabledCheckbox"), d, "showVideoIntro"), f.isSplashScreenAvailable() && i.bind(new p("splashScreenEnabledCheckbox"), f, "showSplashScreen"), o.isDesktop && i.bind(new p("pressSpaceToSpinCheckbox"), r, "pressSpaceToSpin"), this.onResize(), o.showMobileUI ? (document.getElementById("popup").style.pointerEvents = "auto", i.preventPinch(document.getElementById("popup"))) : document.getElementById("popup").style.pointerEvents = "none", i.addClass(document.getElementById("popup"), "gameSettingsPopup")
        }, g.prototype.onResize = function() {
            o.isMobile && !o.isTablet && (document.getElementById("popup").style.height = window.innerHeight + "px")
        }, g.prototype.onClose = function() {
            l.off("game/resize", this.onResize), l.off("popup/close", this.onClose), l.off("popup/hide", this.onClose), s.off("globalVolume/changed", this.onVolumeChanged)
        }, g
    }), _d("%!)", ["^#", "$*", "!", "@$"], function(t, e, n, r) {
        "use strict";
        function i(t) {
            n.bindAll(this), this.config = t
        }
        return t.extend(i, PIXI.Container), i.prototype.runWithLabel = function(t, e) {
            var n = t.children;
            this.config.reverse && (n = n.reverse());
            for (var i = 0, o = n.length - 1; 0 <= o; o--) {
                var s = n[o];
                s.alpha = .7, TweenMax.to([s], .8, {
                    bezier: {
                        values: this.getBezierPoints(s)
                    },
                    delay: i
                }), TweenMax.to(s, .1, {
                    alpha: 0,
                    delay: i + .4
                }), TweenMax.to(s.scale, .2, {
                    x: 2,
                    y: 2,
                    yoyo: !0,
                    repeat: 1,
                    delay: i
                }), i += .05
            }
            r(e, i + .8)
        }, i.prototype.getBezierPoints = function(t) {
            return [{
                x: t.x,
                y: t.y
            }, {
                x: t.x + .5 * this.config.x,
                y: t.y - 90
            }, {
                x: t.x + this.config.x,
                y: t.y + this.config.y
            }]
        }, i
    }), _d("@(%", ["!", "#", "@($", "@@"], function(t, e, n, i) {
        "use strict";
        function o() {
            t.bindAll(this), this.tiltXSpeedFadingFactor = .985, this.rotationFadingFactor = .2, this.rotationBoost = this.getRotationBoost(), this.parallaxLayers = []
        }
        return o.prototype.getRotationBoost = function() {
            return i.isTablet ? 2e3 : 5e3
        }, o.prototype.setParallaxLayers = function() {
            this.parallaxLayers = []
        }, o.prototype.hasLayers = function() {
            return 0 < this.parallaxLayers.length
        }, o.prototype.resetLayers = function() {
            for (var t = 0; t < this.parallaxLayers.length; t++)
                this.parallaxLayers[t].reset();
            this.parallaxLayers = []
        }, o.prototype.updateParallaxLayers = function() {
            for (var t = 0; t < this.parallaxLayers.length; t++) {
                var e = this.parallaxLayers[t];
                this.setXShift(e), this.setYShift(e), this.setXRotation(e)
            }
        }, o.prototype.setXShift = function(t) {
            if (0 < t.factorX) {
                var e = t.startX - Math.sin(-n.getRotationDiff().x) * this.rotationBoost * t.factorX - t.layer.x;
                t.layer.x = t.layer.x + e * this.rotationFadingFactor
            }
        }, o.prototype.setYShift = function(t) {
            if (0 < t.factorY) {
                var e = t.startY - Math.sin(-n.getRotationDiff().y) * this.rotationBoost * t.factorY - t.layer.y;
                t.layer.y = t.layer.y + e * this.rotationFadingFactor
            }
        }, o.prototype.setXRotation = function(t) {
            0 < t.tiltXInertia ? (t.tiltXSpeed += this.getTiltXStep(t), t.layer.rotation = t.layer.rotation + t.tiltXSpeed, t.tiltXSpeed *= this.tiltXSpeedFadingFactor) : 0 < t.tiltXRange && (t.layer.rotation = t.layer.rotation + this.getTiltXStep(t))
        }, o.prototype.getTiltXStep = function(t) {
            var e = t.tiltXInertia || 1;
            return (Math.max(t.minTiltX, Math.min(t.maxTiltX, n.rotationX)) - t.layer.rotation) * (1 / e)
        }, o
    }), _d("%@!", ["^#", "^$", "@@", "@($"], function(t, n, i, o) {
        "use strict";
        function e(t, e) {
            n.call(this), this.RESOLUTION_FACTOR = 1600 / i.renderer.width, this.tiltXRange = e.tiltXRange || 0, this.layer = t, this.factorX = e.factorX * this.RESOLUTION_FACTOR, this.factorY = e.factorY * this.RESOLUTION_FACTOR, this.tiltXInertia = e.tiltXInertia * this.RESOLUTION_FACTOR, this.tiltXRange = e.tiltXRange, this.minTiltX = t.rotation - e.tiltXRange / 2 * this.RESOLUTION_FACTOR, this.maxTiltX = t.rotation + e.tiltXRange / 2 * this.RESOLUTION_FACTOR, this.startX = t.x, this.startY = t.y, this.startRotation = t.rotation, (this.tiltXSpeed = 0) < this.tiltXRange && (this.layer.rotation = this.startRotation + o.rotationX)
        }
        return t.extend(e, n), e.prototype.reset = function() {
            this.layer.x = this.startX, this.layer.y = this.startY, this.layer.rotation = this.startRotation + o.rotationX
        }, e
    }), _d("%@@", ["^#", "!", "#", "@$"], function(t, e, n, i) {
        "use strict";
        function o() {
            PIXI.particles.ParticleContainer.call(this), e.bindAll(this), this.setProperties({
                scale: !0,
                position: !0,
                rotation: !0,
                uvs: !0,
                alpha: !0
            }), this.config = jupiter.cache.get(this.getParticleConfig()), this.emitter = new PIXI.particles.Emitter(this, this.getImages(), this.config)
        }
        return t.extend(o, PIXI.particles.ParticleContainer), o.prototype.play = function() {
            this.startTime = Date.now(), n.on("game/update", this.onUpdate)
        }, o.prototype.stop = function() {
            this.emitter.emit = !1, i(this.destroy, this.config.lifetime.max)
        }, o.prototype.updatePosition = function(t, e) {
            var n = this.toLocal(new PIXI.Point(t, e), this.parent);
            this.emitter.updateOwnerPos(n.x, n.y)
        }, o.prototype.onUpdate = function() {
            var t = Date.now(),
                e = .001 * (t - this.startTime);
            this.emitter.update(e), this.startTime = t
        }, o.prototype.destroy = function() {
            n.off("game/update", this.onUpdate), this.emitter.destroy(), this.parent && this.parent.removeChild(this)
        }, o.prototype.getImages = function() {
            return PIXI.Texture.fromImage(this.getParticleImage())
        }, o.prototype.getParticleConfig = function() {}, o.prototype.getParticleImage = function() {}, o
    }), _d("%@#", ["!", "@$", "#"], function(n, t, i) {
        "use strict";
        function e(t, e) {
            this.symbolsContainer = t, this.machine = e, n.bindAll(this), i.on("initialAnimation/skip", this.onSkip), i.on("spin/begin", this.onSkip)
        }
        return e.prototype.play = function() {
            this.emitEnd()
        }, e.prototype.onSkip = function() {}, e.prototype.emitEnd = function() {
            i.emit("initialAnimation/clearAllPaylines"), i.emit("initialAnimation/end"), i.off("initialAnimation/skip", this.onSkip), i.off("spin/begin", this.onSkip), this.onSkip()
        }, e
    }), _d("%@$", ["^#", "!"], function(t, e) {
        "use strict";
        function n() {
            PIXI.Container.call(this), e.bindAll(this)
        }
        return t.extend(n, PIXI.Container), n
    }), _d("#!^", ["^#", "!", "#!%", "@@", "#", "%@%"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            PIXI.Container.call(this), e.bindAll(this), this.popup = this.createPopup()
        }
        return t.extend(r, PIXI.Container), r.prototype.createPopup = function() {
            return new s(this.onContinue)
        }, r.prototype.play = function() {
            this.showPopup()
        }, r.prototype.showPopup = function() {
            this.popup.show()
        }, r.prototype.onContinue = function() {
            this.parent.removeChild(this), o.emit("freespins/introFinished")
        }, r
    }), _d("%@%", ["^#", ")*", "!", "%@^", "#@", "#!%"], function(t, e, n, i, o, s) {
        "use strict";
        function r(t) {
            n.bindAll(this), this.onContinue = t
        }
        return r.prototype.show = function() {
            var t = {
                title: o.get("freespins_congratulations"),
                message: this.getMessage(),
                buttons: [{
                    label: o.get("freespins_info_continue"),
                    action: this.onContinue,
                    hideWindow: !0
                }],
                autoclose: !0
            };
            new e(t)
        }, r.prototype.getMessage = function() {
            var t = o.get("freespins_number_of_spins_info").split("{0}");
            return "<div>" + t[0].trim() + "</div>" + this.getHTMLNumbers(s.freeSpinsAwarded) + "<div>" + t[1].trim() + "</div>"
        }, r.prototype.getHTMLNumbers = function(t) {
            var e = "<div class='winNumberWrapper'>";
            return (e += this.getWindowNumbers(t)) + "</div>"
        }, r.prototype.getWindowNumbersClassAndName = function() {
            return "windowNumber window_num"
        }, r.prototype.getWindowNumbers = function(t) {
            for (var e = "", n = t.toString(), i = t.toString().length, o = 0; o < i; o++)
                e += "<div class='" + this.getWindowNumbersClassAndName() + n.charAt(o) + "'></div>";
            return e
        }, r
    }), _d("%@&", ["^#", "!", "@@)", "#!%", "@@", "#", "#@", "@$"], function(t, n, i, e, o, s, r, a) {
        "use strict";
        function h(t, e) {
            PIXI.Container.call(this), n.bindAll(this), this.title = this.createTitle(t), this.counter = this.createCounter(e), s.on("spin/begin", this.onSpinBegin), s.on("freespins/introFinished", this.onSpinBegin), s.once("freespins/exit", this.onFreespinsExit), this.refreshSpinsLeft()
        }
        return t.extend(h, PIXI.Container), h.prototype.onFreespinsExit = function() {
            this.title.destroy(), this.clearListeners()
        }, h.prototype.clearListeners = function() {
            s.off("spin/begin", this.onSpinBegin), s.off("freespins/introFinished", this.onSpinBegin)
        }, h.prototype.createCounter = function(t) {
            var e = new i("0", t);
            return e.anchor.set(.5, .5), e.y = t.offset || 50, this.addChild(e)
        }, h.prototype.createTitle = function(t) {
            var e = new PIXI.Text(r.get("freespins_panel_freespins"), t),
                n = t.maxWidth || Number.MAX_VALUE;
            return e.anchor.set(.5, .5), e.y = e.height / 2, e.width > n && !o.showMobileUI && (e.scale.x = e.scale.y = n / e.width), this.addChild(e)
        }, h.prototype.onSpinBegin = function() {
            e.freeSpinsLeft && a(this.setSpinsLeft, .5, e.freeSpinsLeft - 1)
        }, h.prototype.setSpinsLeft = function(t) {
            this.counter.text = t
        }, h.prototype.refreshSpinsLeft = function() {
            this.setSpinsLeft(e.freeSpinsLeft || 0)
        }, h
    }), _d("#!&", ["^#", "!", "#!%", "@@", "#", "%@*", "##^", "@$"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {
            PIXI.Container.call(this), e.bindAll(this), this.popup = this.createPopup(), this.play()
        }
        return t.extend(h, PIXI.Container), h.prototype.createPopup = function() {
            return new s(this.onContinue)
        }, h.prototype.onContinue = function() {
            var t = new r(null, 1, 1);
            a(this.onOverlayFadeOut, 1), a(t.hide, 1.1)
        }, h.prototype.onOverlayFadeOut = function() {
            this.parent.removeChild(this), o.emit("freespins/outroFinished")
        }, h.prototype.play = function() {
            this.popup.show()
        }, h
    }), _d("%@*", ["^#", "!", ")*", "#@", "$^", "$*"], function(t, e, n, i, o, s) {
        "use strict";
        function r(t) {
            e.bindAll(this), this.onContinue = t
        }
        return r.prototype.show = function() {
            var t = {
                message: this.getMessage(),
                buttons: [{
                    label: i.get("freespins_info_close"),
                    action: this.onContinue,
                    hideWindow: !0
                }],
                autoclose: !0
            };
            0 < this.getWin() && (t.title = i.get("freespins_congratulations")), new n(t)
        }, r.prototype.getMessage = function() {
            var t = i.get("freespins_win_info").split("{0}");
            return "<div>" + t[0].trim() + "</div>" + this.getHTMLNumbers(this.getWin()) + "<div>" + t[1].trim() + "</div>"
        }, r.prototype.getWin = function() {
            return s.getAmountInCoins(o.getAccumulatedWin())
        }, r.prototype.getHTMLNumbers = function(t) {
            var e = "<div class='winNumberWrapper'>";
            return (e += this.getWindowNumbers(t)) + "</div>"
        }, r.prototype.getWindowNumbersClassAndName = function() {
            return "windowNumber window_num"
        }, r.prototype.getWindowNumbers = function(t) {
            for (var e = "", n = t.toString(), i = t.toString().length, o = 0; o < i; o++)
                e += "<div class='" + this.getWindowNumbersClassAndName() + n.charAt(o) + "'></div>";
            return e
        }, r
    }), _d("%@)", ["!", "^#", "%@(", "$*"], function(t, e, n, i) {
        "use strict";
        function o() {
            PIXI.Container.call(this), t.bindAll(this), this.interactive = !0, this.click = this.tap = this.onClick, this.background = this.createBackground()
        }
        return e.extend(o, PIXI.Container), o.prototype.onClick = function() {
            i.toggle()
        }, o.prototype.createBackground = function() {
            return new PIXI.Container
        }, o.prototype.getTitleStyle = function() {
            return {
                font: "24px Verdana",
                fill: "white"
            }
        }, o.prototype.getCounterStyle = function() {
            return {
                font: "ui",
                size: 60
            }
        }, o
    }), _d("%@(", ["^#", "!", "@@)", "#@", "$^", "#", "$*"], function(t, n, i, o, s, r, a) {
        "use strict";
        function e(t, e) {
            PIXI.Container.call(this), n.bindAll(this), this.maxCounterWidth = Number.MAX_VALUE, this.currentValue = 0, this.title = this.createTitle(t), this.label = this.createLabel(e), r.on("winPresentation/end", this.onWinPresentationEnd, r.PRIORITY_HIGHEST + 1), a.on("showCurrency/changed", this.showCurrencyChanged), r.once("freespins/exit", this.onFreeSpinsExit), this.currentValue = s.getAccumulatedWin(), this.onUpdate()
        }
        return t.extend(e, PIXI.Container), e.prototype.onFreeSpinsExit = function() {
            this.title.destroy(), this.clearListeners()
        }, e.prototype.clearListeners = function() {
            r.off("winPresentation/end", this.onWinPresentationEnd), a.off("showCurrency/changed", this.showCurrencyChanged)
        }, e.prototype.createLabel = function(t) {
            var e = new i("0", t);
            return e.anchor.set(.5, .5), e.y = t.offset || 50, this.addChild(e)
        }, e.prototype.createTitle = function(t) {
            var e = new PIXI.Text(o.get("freespins_panel_total_win"), t),
                n = t.maxWidth || Number.MAX_VALUE;
            return e.anchor.set(.5, .5), e.y = e.height / 2, e.width > n && (e.scale.x = e.scale.y = n / e.width), this.addChild(e)
        }, e.prototype.onWinPresentationEnd = function() {
            s.getAccumulatedWin() > this.currentValue && this.update()
        }, e.prototype.update = function() {
            var t = s.getAccumulatedWin();
            TweenMax.to(this, this.getAnimationTime(t), {
                currentValue: t,
                onUpdate: this.onUpdate,
                onComplete: this.onComplete,
                ease: Linear.easeNone
            })
        }, e.prototype.getAnimationTime = function(t) {
            return .5
        }, e.prototype.onUpdate = function() {
            this.setTotalWin(this.currentValue)
        }, e.prototype.onComplete = function() {}, e.prototype.showCurrencyChanged = function() {
            this.setTotalWin(this.currentValue)
        }, e.prototype.setTotalWin = function(t) {
            this.label.text = a.formatMoney(t)
        }, e
    }), _d("%#!", ["!", "#", "^#", "%@^"], function(t, e, n, i) {
        "use strict";
        function o() {
            i.call(this, "hud/burger_menu_button", this.onOpenBurgerMenu), this.createIcon(), this.anchor.set(.5, .5), e.on("spin/begin", this.onSpinBegin), e.on("spin/definiteEnd", this.onSpinDefiniteEnd)
        }
        return n.extend(o, i), o.prototype.onOpenBurgerMenu = function() {
            e.emit("burgerMenu/click")
        }, o.prototype.onSpinBegin = function() {
            this.enabled = this.visible = !1
        }, o.prototype.onSpinDefiniteEnd = function() {
            this.enabled = this.visible = !0
        }, o
    }), _d("%#@", ["^#", "%@&"], function(t, n) {
        "use strict";
        function e(t, e) {
            n.call(this, t, e)
        }
        return t.extend(e, n), e.prototype.createTitle = function(t) {
            var e = n.prototype.createTitle.call(this, t);
            return e.anchor.set(.5, 1), e.x = 0, e.y = 0, e
        }, e.prototype.createCounter = function(t) {
            var e = n.prototype.createCounter.call(this, t);
            return e.anchor.set(.5, 0), e.x = 0, e.y = 0, e
        }, e
    }), _d("%#$", ["%@)", "^#", "%##", "%#@"], function(t, e, n, i) {
        "use strict";
        function o() {
            this.indicatorPositions = -15, t.call(this), this.totalWinCounter = this.createTotalWin(), this.freeSpinsLeft = this.createFreeSpinsLeft()
        }
        return e.extend(o, t), o.prototype.createTotalWin = function() {
            var t = new n(this.getTitleStyle(), this.getCounterStyle());
            return t.height = this.height, t.scale.y = t.scale.x, t.y = this.indicatorPositions, t.x = .25 * this.background.width, this.addChild(t)
        }, o.prototype.createFreeSpinsLeft = function() {
            var t = new i(this.getTitleStyle(), this.getCounterStyle());
            return t.height = this.height, t.scale.y = t.scale.x, t.y = this.indicatorPositions, t.x = .25 * -this.background.width, this.addChild(t)
        }, o.prototype.layoutLandscape = function() {}, o.prototype.layoutPortrait = function() {}, o
    }), _d("%##", ["^#", "%@("], function(t, n) {
        "use strict";
        function e(t, e) {
            n.call(this, t, e)
        }
        return t.extend(e, n), e.prototype.createTitle = function(t) {
            var e = n.prototype.createTitle.call(this, t);
            return e.anchor.set(.5, 1), e.x = 0, e.y = 0, e
        }, e.prototype.createLabel = function(t) {
            var e = n.prototype.createLabel.call(this, t);
            return e.anchor.set(.5, 0), e.x = 0, e.y = 0, e
        }, e
    }), _d("%#%", ["%@)", "^#", "$*", "%@&", "%@("], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.call(this), this.freeSpinsLeft = this.createFreeSpinsLeft(), this.totalWinCounter = this.createTotalWin()
        }
        return e.extend(s, t), s.prototype.updateFreeSpins = function() {
            t.prototype.updateFreeSpins.call(this), this.freeSpinsLeftLabel.x = -145 - this.freeSpinsLeftLabel.width / 2
        }, s.prototype.createTotalWin = function() {
            var t = new o(this.getTitleStyle(), this.getCounterStyle());
            return t.x = .5 * t.width, t.y = .5 * -t.height, this.addChild(t)
        }, s.prototype.createFreeSpinsLeft = function() {
            var t = new i(this.getTitleStyle(), this.getCounterStyle());
            return t.x = .5 * -t.width, t.y = .5 * -t.height, this.addChild(t)
        }, s.prototype.onClick = function() {
            n.toggle()
        }, s
    }), _d("%#(", ["#@", "@@", "^#", "%#^", "%#&", "%@^", "@$", "%#*", "#", "@(*", "$*", "*", "@"], function(e, n, t, i, o, s, r, a, h, p, u, c, l) {
        "use strict";
        function d() {
            var t = n.showMobileUI ? "balance" : e.get("balance");
            i.call(this, t, "panel_value"), this.interactive = !0, this.tap = this.click = u.toggle, this.labelContainer = this.createLabelContainer(), this.value = p.balance, this.timeline = new TimelineMax, this.label.visible = !n.isRewatch(), u.on("showCurrency/changed", this.refreshValue), c.on("totalBet/changed", this.refreshValue), h.on("balance/changed", this.onBalanceChanged), this.refreshValue(), this.hideLabel()
        }
        return t.extend(d, n.showMobileUI ? a : o), d.prototype.hideLabel = function() {
            n.isReplayMode() && !n.gameHistoryEnabled && (this.label.visible = !1)
        }, d.prototype.createLabelContainer = function() {
            this.label.parent.removeChild(this.label);
            var t = new PIXI.Container;
            return t.addChild(this.label), this.addChild(t)
        }, d.prototype.showDepositButton = function() {
            this.depositButton || (this.depositButton = this.createDepositButton()), this.layoutExtraElements()
        }, d.prototype.createDepositButton = function() {
            var t = new s("hud/deposit_button", function() {
                h.emit("deposit/click")
            });
            return t.createIcon(), t.anchor.set(.5, .5), this.addChild(t)
        }, d.prototype.layoutExtraElements = function() {
            this.depositButton && (this.depositButton.x = this.background.width - .5 * this.depositButton.width)
        }, d.prototype.onBalanceChanged = function(t, e, n) {
            this.timeline.to(this, e ? .25 : 0, {
                value: t,
                delay: n,
                onUpdate: this.refreshValue
            })
        }, d.prototype.refreshValue = function() {
            this.setText(u.formatMoney(this.value))
        }, d.prototype.refreshLabelPosition = function() {
            var t = 1.5 * (this.labelContainer.scale.x - 1);
            this.labelContainer.y = -t * this.label.height
        }, d.prototype.getFixedPrecision = function() {
            return u.showCurrency ? 2 : 0
        }, d.prototype.getWidth = function() {
            return n.showMobileUI ? 425 : 225
        }, d
    }), _d("%#)", ["%#(", "^#", "@@", "$)!"], function(t, e, n, i) {
        "use strict";
        function o() {
            t.call(this)
        }
        return e.extend(o, t), o.prototype.layout = function() {
            i.layout.call(this)
        }, o.prototype.autoScale = function(t) {
            i.autoScale.call(this, t)
        }, o
    }), _d("%#^", ["!", "^#", "@@!"], function(n, t, e) {
        "use strict";
        function i(t, e) {
            PIXI.Container.call(this), n.bindAll(this), this.backgroundName = e || "panel_value", this.title = this.createTitle(t), this.icon = this.createIcon(t), this.label = this.createLabel(), this.background = this.createBackground()
        }
        return t.extend(i, PIXI.Container), i.prototype.createTitle = function(t) {}, i.prototype.createIcon = function(t) {}, i.prototype.getWidth = function() {
            return 150
        }, i.prototype.createLabel = function() {
            var t = new PIXI.extras.BitmapText("000", {
                font: "ui",
                align: "center"
            });
            return this.addChild(t)
        }, i.prototype.getLabelStyle = function() {
            return {
                fontFamily: "Verdana",
                fontSize: "14pt",
                fill: "black"
            }
        }, i.prototype.setValue = function(t) {
            this.setText(t)
        }, i.prototype.setTitleText = function(t) {
            this.title && (this.title.text = t)
        }, i.prototype.formatText = function(t) {
            return "string" == typeof t ? t : t.toFixed(this.getFixedPrecision())
        }, i.prototype.setText = function(t) {
            this.label.text = this.formatText(t), this.label.updateText(), this.layout()
        }, i.prototype.autoScale = function(t) {
            this.label.scale.x = t;
            var e = this.icon ? 25 + this.icon.width : 15,
                n = this.background.width - e - 15;
            this.label.width > n && (this.label.scale.x = n / this.label.width * t)
        }, i.prototype.layout = function() {
            var t = this.getLabelScale();
            this.label.scale.set(t, t), this.autoScale(t), this.label.x = -this.label.width / 2 + 2, this.icon && (this.icon.x = .5 * -this.getWidth() + 20, this.icon.y = .5 * this.label.height + this.label.y, this.label.x += 20)
        }, i.prototype.getLabelScale = function() {
            return .8
        }, i.prototype.getFixedPrecision = function() {
            return 0
        }, i.prototype.createBackground = function() {
            var t = new e("images/hud/" + this.backgroundName + "_background.png", new PIXI.Rectangle(.5, .5, .5, .5));
            return t.width = this.getWidth(), t.anchor.set(.5, .5), t.y = this.getBackgroundOffset(), this.addChildAt(t, 0)
        }, i.prototype.getBackgroundOffset = function() {
            return 50
        }, i
    }), _d("%$@", ["%$!", "^#", "!", "#@", "#", "#!("], function(e, t, n, i, o, s) {
        function r(t) {
            e.call(this, t || "hud/toolbar_button", this.onClick), this.anchor.set(.5, .5), this.createIcon("hud/fullscreen_button"), this.tooltipSelected = i.get("tooltip_fullscreen_button_on"), this.tooltipDeselected = i.get("tooltip_fullscreen_button_off"), o.on("fullscreen/changed", this.refreshState)
        }
        return t.extend(r, e), r.prototype.onClick = function() {
            o.emit("fullscreen/toggle")
        }, r.prototype.refreshState = function() {
            this.selected = s.isFullscreenModeEntered()
        }, r
    }), _d("%$#", ["%@^", "^#", "!", "@@", ")*", "#@", "%)", "#"], function(e, t, n, i, o, s, r, a) {
        function h(t) {
            e.call(this, t || "hud/toolbar_button", this.onClick), this.anchor.set(.5, .5), this.createIcon("hud/home_button")
        }
        return t.extend(h, e), h.prototype.onClick = function() {
            new o({
                message: s.get("backMessage"),
                buttons: [{
                    label: s.get("backMessage_yes"),
                    action: this.backButtonClicked
                }, {
                    label: s.get("backMessage_no"),
                    hideWindow: !0
                }]
            })
        }, h.prototype.backButtonClicked = function() {
            a.emit("home/press"), "" !== i.backURL ? r.goToBackURL() : r.goBack()
        }, h
    }), _d("%$$", ["%$!", "^#", "%&", "#@"], function(e, t, n, i) {
        function o(t) {
            e.call(this, t || "hud/toolbar_button", this.onClick), this.anchor.set(.5, .5), this.createIcon("hud/sounds_button"), this.tooltipSelected = i.get("tooltip_sounds_button_on"), this.tooltipDeselected = i.get("tooltip_sounds_button_off"), n.on("globalVolume/changed", this.refreshSoundsButton), this.refreshSoundsButton()
        }
        return t.extend(o, e), o.prototype.onClick = function() {
            n.toggle()
        }, o.prototype.refreshSoundsButton = function() {
            this.selected = n.enabled
        }, o
    }), _d("%$%", ["^#", "@@"], function(t, e) {
        "use strict";
        function n() {
            PIXI.Container.call(this), this.label = this.createLabel()
        }
        return t.extend(n, PIXI.Container), n.prototype.createLabel = function() {
            var t = new PIXI.Text(e.getFormatedGameName().toUpperCase(), this.getStyle());
            return t.anchor.set(.5, .5), this.addChild(t)
        }, n.prototype.getStyle = function() {
            return {
                fontFamily: "Verdana",
                fontSize: "14pt",
                fontWeight: "bold",
                fill: "white",
                dropShadow: !0,
                dropShadowColor: "black",
                dropShadowDistance: 3
            }
        }, n
    }), _d("%$^", ["!", "^#", "#", "$!", "^!"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            PIXI.Container.call(this), t.bindAll(this), this.anchor = new PIXI.Point(0, 0), this.label = this.createLabel(), i.on("autoSpinsLeft/changed", this.setAutoSpinsLeft)
        }
        return e.extend(s, PIXI.Container), s.prototype.setAutoSpinsLeft = function() {
            if (i.isDuringAutoSpins) {
                var t = i.format(i.autoSpinsLeft);
                this.label.text = t, this.label.updateText()
            }
        }, s.prototype.createLabel = function() {
            var t = new PIXI.extras.BitmapText("000", {
                font: "ui"
            });
            return this.addChild(t)
        }, s.prototype.updateTransform = function() {
            var t = this.getLabelOffset();
            this.label.x = -this.anchor.x * this.label.width + t.x, this.label.y = -this.anchor.y * this.label.height + t.y, PIXI.Container.prototype.updateTransform.call(this)
        }, s.prototype.getLabelOffset = function() {
            return o.isPortraitMode(), {
                x: 0,
                y: 0
            }
        }, s
    }), _d("%$(", ["^#", "(@", "!", "#", "(#", "%$&", ")", "#@", "$!", "%$*", "@@", "^&", "(", "^!", "@(&", "*", "%!@", "$)*"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d, f, g, y, m) {
        "use strict";
        function S() {
            s.apply(this, arguments), n.bindAll(this), f.stopLossDifference = parseInt(g.totalBet * h.getMaximumAutoSpins(), 10), this.moreExpanded = !1, this.buildExtraTitle(), this.settingsPanel = this.buildSettings(), u.isLossLimitEnabled() ? f.on("stopLossDifference/changed", this.onStopLossDiffrenceChanged) : (this.toggleButton = this.buildToggleButton(), this.configToggleButton()), i.on("autospin/openList", this.onOpenList)
        }
        return t.extend(S, s), S.prototype.buildExtraTitle = function() {
            var t = r.toHTML("<h1>" + a.get("autospin") + "</h1>");
            this.contentDom.appendChild(t), this.contentDom.insertBefore(t, this.spinner.html)
        }, S.prototype.buildSettings = function() {
            this.settingsPage = new p;
            var t = this.settingsPage.getContent(),
                e = r.toHTML(t);
            return this.contentDom.appendChild(e), this.settingsPage.didAddedToDOM(), e
        }, S.prototype.buildToggleButton = function() {
            var t = r.toHTML(this.getToggleButtonLabel());
            return this.contentDom.appendChild(t), t
        }, S.prototype.configToggleButton = function() {
            this.toggleButton && e.onClick(this.toggleButton, this.onToggleButtonClick)
        }, S.prototype.onToggleButtonClick = function() {
            this.moreExpanded = !this.moreExpanded, this.invalidateExpandedState()
        }, S.prototype.getToggleButtonLabel = function() {
            var t = this.moreExpanded ? a.get("autospin_htmlSwiper_hide") : a.get("autospin_htmlSwiper_more"),
                e = this.moreExpanded ? "rotateTop" : "rotateBottom";
            return c.substitute("<div class='toggleButton'><span>{0}</span><span class='arrow {1}'>></span></div>", t, e)
        }, S.prototype.invalidateExpandedState = function() {
            u.isLossLimitEnabled() ? this.moreExpanded = !0 : this.toggleButton.innerHTML = this.getToggleButtonLabel(), this.expanded && (this.expandMoreOrShrink(), TweenMax.to(this.contentDom, this.config.expandingTime, {
                y: -l.root.currentShift,
                onComplete: this.onExpandedStateInvalidated
            }))
        }, S.prototype.expandMoreOrShrink = function() {
            this.moreExpanded ? (r.addClass(this.contentDom, "moreExpanded"), this.config.onPanelMoreExpanded(), this.adjustElementsHeight()) : (this.hideToggleButton(), this.config.onPanelLessExpanded())
        }, S.prototype.onExpandedStateInvalidated = function() {
            this.moreExpanded || (this.adjustElementsHeight(), this.unFocusAllInputs(), r.removeClass(this.contentDom, "moreExpanded"), this.showToggleButton())
        }, S.prototype.showToggleButton = function() {
            u.isLossLimitEnabled() || TweenMax.to(this.toggleButton, this.config.expandingTime, {
                y: 0
            })
        }, S.prototype.hideToggleButton = function() {
            u.isLossLimitEnabled() || TweenMax.to(this.toggleButton, this.config.expandingTime, {
                y: 100
            })
        }, S.prototype.getPopupId = function() {
            return "autoplayPopup"
        }, S.prototype.getSpinnerConfig = function() {
            return {
                title: a.get("autospin"),
                options: h.autoSpins.map(function(t) {
                    return {
                        value: t,
                        label: h.format(t)
                    }
                })
            }
        }, S.prototype.getBarConfig = function() {
            return {
                buttons: [{
                    label: a.get("autospin_message_window_cancel"),
                    className: "swiperCancelButton",
                    handler: this.onCancelButtonClicked.bind(this)
                }, {
                    label: a.get("autospin_message_window_start"),
                    className: "swiperStartButton",
                    handler: this.onStartButtonClicked.bind(this)
                }]
            }
        }, S.prototype.getTargetSpinnerHeight = function() {
            var t = u.isLossLimitEnabled() ? 0 : this.toggleButton.clientHeight,
                e = l.root.currentShift - this.controlBar.clientHeight - t;
            return u.isLossLimitEnabled() ? d.isPortraitMode() ? e / 2 : e : this.moreExpanded ? e / 2 : e
        }, S.prototype.onOpenList = function() {
            u.isLossLimitEnabled() && u.showNewMobileUI && this.onStopLossDiffrenceChanged(), this.expanded = !0
        }, S.prototype.onCancelButtonClicked = function() {
            this.expanded = !1
        }, S.prototype.onStartButtonClicked = function() {
            this.expanded = !1, i.emit("autospin/init", this.spinner.getValue())
        }, S.prototype.close = function() {
            s.prototype.close.call(this), this.unFocusAllInputs()
        }, S.prototype.onClose = function() {
            s.prototype.onClose.call(this), this.moreExpanded = !1, this.invalidateExpandedState(), this.unFocusAllInputs()
        }, S.prototype.unFocusAllInputs = function() {
            this.settingsPage.unFocusAllInputs(this.onBlur)
        }, S.prototype.adjustElementsHeight = function() {
            s.prototype.adjustElementsHeight.call(this), this.settingsPanel.style.height = this.moreExpanded || !d.isPortraitMode() ? this.getTargetSpinnerHeight() + "px" : 0
        }, S.prototype.refresh = function() {
            l.root.enableResize(), s.prototype.refresh.call(this), this.moreExpanded = !1, this.invalidateExpandedState(), this.unFocusAllInputs()
        }, S.prototype.open = function() {
            s.prototype.open.call(this), this.settingsPage.configOnFocus(this.onFocus, this.onBlur), this.spinner.scrollToIndex(h.previousAutoSpinsIndex)
        }, S.prototype.onBlur = function() {
            this.configToggleButton(), i.emit("swipeToFullScreen/enabled")
        }, S.prototype.onFocus = function() {
            l.root.disableResize(), i.emit("swipeToFullScreen/disabled"), this.toggleButton && e.removeOnClick(this.toggleButton, this.onToggleButtonClick)
        }, Object.defineProperty(s.prototype, "startButton", {
            get: function() {
                return this.controlBar.getElementsByClassName("swiperStartButton")[0]
            }
        }), S.prototype.onStopLossDiffrenceChanged = function() {
            f.stopLossDifference > g.totalBet ? r.removeClass(this.startButton, "disabled") : r.addClass(this.startButton, "disabled")
        }, S
    }), _d("%$)", ["^#", "(@", "(#", "#", "!", "%$&", "#@&", ")", "#@", "$!", "#)"], function(t, e, n, i, o, s, r, a, h, p, u) {
        "use strict";
        function c() {
            s.apply(this, arguments), o.bindAll(this), i.on("bet/openList", this.onBetOpenList)
        }
        return t.extend(c, s), c.prototype.getPopupId = function() {
            return "betChangePopup"
        }, c.prototype.getSpinnerConfig = function() {
            return {
                title: h.get("coinValue"),
                options: this.getAvailableBets().map(function(t) {
                    return {
                        value: t,
                        label: t
                    }
                })
            }
        }, c.prototype.getAvailableBets = function() {
            return u.availableBets.length <= 7 ? u.availableBets.concat(u.availableBets) : u.availableBets
        }, c.prototype.getBarConfig = function() {
            return {
                buttons: [{
                    label: h.get("betchange_message_window_cancel"),
                    className: "swiperCancelButton",
                    handler: this.onCancelButtonClicked.bind(this)
                }, {
                    label: h.get("betchange_message_window_ok"),
                    className: "swiperStartButton",
                    handler: this.onStartButtonClicked.bind(this)
                }]
            }
        }, c.prototype.onBetOpenList = function() {
            this.expanded = !0, this.spinner.scrollToIndex(this.getAvailableBets().indexOf(parseFloat(u.bet)))
        }, c.prototype.onCancelButtonClicked = function() {
            this.expanded = !1
        }, c.prototype.onStartButtonClicked = function() {
            this.expanded = !1, r.add(r.SWIPE_MENU_ON_BET_SELECTED, this.spinner.getValue()), u.bet = this.spinner.getValue()
        }, c
    }), _d("%%)", ["%%!", "%%@", "^#", "!", "#", "%%#", "%%$", "%%%", "%%^", "%%&", "%%*", "@@", "%%(", "(@", ")", "%)"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d, f, g) {
        "use strict";
        function y() {
            t.call(this, {
                expandingTime: .3,
                expandingWidth: 500,
                pages: this.getPages(),
                buttons: [new h, new p]
            }, this.onElementClicked), i.bindAll(this), this.sideMenuView = this.createSideView()
        }
        return n.extend(y, t), y.prototype.createSideView = function() {
            return new e({}, this.onBurgerClicked)
        }, y.prototype.getPages = function() {
            var t = [new u, new s];
            return c.showGameRules() && t.push(new a), c.showGameHistory() && t.push(new r), t.concat(this.getOperatorPages()).sort(function(t, e) {
                return t.getOrder() - e.getOrder()
            })
        }, y.prototype.getOperatorPages = function() {
            try {
                return JSON.parse(c.getOperatorBurgerPages()).map(function(t) {
                    return new l(t)
                })
            } catch (t) {
                return []
            }
        }, y.prototype.onElementClicked = function(t) {
            var e = this.getPageById(t);
            e.getUrl ? g.openNewTab(e.getUrl()) : this.sideMenuView.openPage(e)
        }, y.prototype.onBurgerClicked = function() {
            this.toggle()
        }, y.prototype.hide = function() {
            this.expanded = !1, this.sideMenuView.closePageAndWrapper()
        }, y
    }), _d("%^!", ["(@", ")"], function(t, e) {
        "use strict";
        function n() {}
        return n.prototype.getId = function() {
            throw new Error("Abstract method")
        }, n.prototype.getIconNormal = function() {
            return ""
        }, n.prototype.getIconSelected = function() {
            return ""
        }, n.prototype.didAddedToDOM = function() {
            t.onClick(e.byId(this.getId()), this.onClick.bind(this))
        }, n.prototype.onClick = function() {}, n
    }), _d("%%&", ["%^!", "^#", "(@", ")", "%)", ")*", "@@", "#@", "(", "#"], function(t, e, n, i, o, s, r, a, h, p) {
        "use strict";
        function u() {
            t.call(this), this.actionButton = !0
        }
        return e.extend(u, t), u.prototype.getId = function() {
            return "infoPages_homeButton"
        }, u.prototype.getIconNormal = function() {
            return "menu_home_icon"
        }, u.prototype.onClick = function() {
            new s({
                message: a.get("backMessage"),
                buttons: [{
                    label: a.get("backMessage_yes"),
                    action: this.backButtonClicked
                }, {
                    label: a.get("backMessage_no"),
                    hideWindow: !0
                }]
            }), h.root.burgerMenu.expanded = !1
        }, u.prototype.backButtonClicked = function() {
            p.emit("home/press"), "" !== r.backURL ? o.goToBackURL() : o.goBack()
        }, u.prototype.didAddedToDOM = function() {
            n.onClick(i.byId(this.getId()), this.onClick.bind(this))
        }, u
    }), _d("%%^", ["%^!", "^#", ")", "$)*", "%&"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.call(this), this._selected = !1, this.checkbox = !0
        }
        return e.extend(s, t), s.prototype.getId = function() {
            return "infoPages_muteSounds"
        }, s.prototype.getIconNormal = function() {
            return "menu_mute_icon_selected"
        }, s.prototype.getIconSelected = function() {
            return "menu_mute_icon"
        }, s.prototype.didAddedToDOM = function() {
            t.prototype.didAddedToDOM.call(this), o.on("globalVolume/changed", this.refreshSoundsButton.bind(this)), this.refreshSoundsButton()
        }, s.prototype.refreshSoundsButton = function() {
            this.selected = o.enabled
        }, s.prototype.onClick = function() {
            o.toggle()
        }, Object.defineProperty(s.prototype, "selected", {
            get: function() {
                return this._selected
            },
            set: function(t) {
                this._selected !== t && ((this._selected = t) ? n.addClass(n.byId(this.getId()), "selected") : n.removeClass(n.byId(this.getId()), "selected"))
            }
        }), s
    }), _d("%^@", ["(#", ")", "(@", "%*", "(", "^!"], function(n, i, o, s, t, e) {
        "use strict";
        function r(t) {
            this._expanded = !1, this.config = this.parseConfig(t), this.build(), this.preventScrollingOnElement(this.apla), i.preventPinch(this.wrapper)
        }
        return r.emptyHandler = function() {}, r.prototype.getDefaultConfig = function() {
            return {
                expandingTime: .3,
                onPanelOpen: r.emptyHandler,
                onPanelClose: r.emptyHandler,
                onPanelMoreExpanded: r.emptyHandler
            }
        }, r.prototype.parseConfig = function(t) {
            var e = this.getDefaultConfig();
            return s.mixin(e, t), e
        }, r.prototype.build = function() {
            var t = n.get("panel.html", {
                    extraClassName: this.getExtraClassName()
                }),
                e = i.toHTML(t);
            e.id = this.getPopupId(), document.body.appendChild(e), o.onClick(this.apla, this.onAplaClicked.bind(this))
        }, r.prototype.preventScrollingOnElement = function(t) {
            t.addEventListener("touchmove", function(t) {
                t.preventDefault()
            })
        }, r.prototype.toggle = function() {
            this.expanded = !this.expanded
        }, r.prototype.open = function() {
            i.addClass(this.wrapper, "show"), this.setDisplay(!0), this.showApla(), this.scrollContentToTop(), this.config.onPanelOpen()
        }, r.prototype.close = function() {
            i.removeClass(this.wrapper, "show"), this.hideApla(), this.config.onPanelClose()
        }, r.prototype.scrollContentToTop = function() {
            this.contentDom.firstChild && (this.contentDom.firstChild.scrollTop = 0)
        }, r.prototype.showApla = function() {
            e.isTopFrame() && TweenMax.to(this.apla, .5, {
                opacity: 1
            })
        }, r.prototype.hideApla = function() {
            e.isTopFrame() && TweenMax.to(this.apla, .5, {
                opacity: 0
            })
        }, r.prototype.onClose = function() {
            this.resetTransformation(), this.setDisplay(!1), t.root.enableResize()
        }, r.prototype.resetTransformation = function() {
            this.contentDom.style.transform = "none"
        }, r.prototype.onAplaClicked = function() {
            this.expanded = !1
        }, r.prototype.updateState = function() {
            this.expanded ? this.open() : this.close()
        }, r.prototype.clearContent = function() {
            this.contentDom.innerHTML = ""
        }, r.prototype.getPopupId = function() {
            throw new Error("Abstract method!")
        }, r.prototype.setDisplay = function(t) {
            this.wrapper.style.display = t ? "block" : "none"
        }, r.prototype.getExtraClassName = function() {
            return ""
        }, Object.defineProperty(r.prototype, "expanded", {
            get: function() {
                return this._expanded
            },
            set: function(t) {
                this._expanded = t, this.updateState()
            }
        }), Object.defineProperty(r.prototype, "contentDom", {
            get: function() {
                return this.wrapper.getElementsByClassName("content")[0]
            }
        }), Object.defineProperty(r.prototype, "wrapper", {
            get: function() {
                return document.getElementById(this.getPopupId())
            }
        }), Object.defineProperty(r.prototype, "apla", {
            get: function() {
                return this.wrapper.getElementsByClassName("apla")[0]
            }
        }), r
    }), _d("%%!", ["^#", "%^@", ")", "(@", "%*", "(#"], function(t, n, i, o, e, s) {
        "use strict";
        function r(t, e) {
            n.call(this, t), this.onMenuElementCallback = e, this.contentDom.style.width = this.config.expandingWidth + "px", this.addContent(), this.initContent()
        }
        return t.extend(r, n), r.prototype.addContent = function() {
            var t = s.get("sideMenu.html", {
                    data: this.getMappedConfig()
                }),
                e = i.toHTML(t);
            this.contentDom.appendChild(e)
        }, r.prototype.getMappedConfig = function() {
            var t = e.clone(this.config);
            return t.logo = {
                title: "Yggdrasil logo"
            }, t.pages = this.config.pages.map(function(t) {
                return t.getConfig()
            }), t.buttons = this.config.buttons.map(function(t) {
                return {
                    id: t.getId(),
                    iconNormal: t.getIconNormal(),
                    iconSelected: t.getIconSelected(),
                    checkbox: t.checkbox,
                    actionButton: t.actionButton
                }
            }), t
        }, r.prototype.initContent = function() {
            this.initPages(), this.initButtons()
        }, r.prototype.initPages = function() {
            for (var t = 0; t < this.config.pages.length; t++) {
                var e = i.byId(this.config.pages[t].getId());
                o.onClick(e, this.onMenuElementClicked.bind(this))
            }
        }, r.prototype.initButtons = function() {
            for (var t = 0; t < this.config.buttons.length; t++)
                this.config.buttons[t].didAddedToDOM()
        }, r.prototype.onMenuElementClicked = function(t) {
            this.expanded = !1, this.onMenuElementCallback(t.currentTarget.attributes.rel.value)
        }, r.prototype.open = function() {
            n.prototype.open.call(this), TweenMax.to(this.contentDom, this.config.expandingTime, {
                x: -this.config.expandingWidth,
                ease: Sine.easeInOut
            })
        }, r.prototype.close = function() {
            n.prototype.close.call(this), TweenMax.to(this.contentDom, this.config.expandingTime, {
                x: 0,
                ease: Sine.easeInOut,
                onComplete: this.onClose,
                onCompleteScope: this
            })
        }, r.prototype.getPopupId = function() {
            return "burgerMenu"
        }, r.prototype.getPageById = function(t) {
            for (var e = 0; e < this.config.pages.length; e++) {
                var n = this.config.pages[e];
                if (n.getId() === t)
                    return n
            }
            return ""
        }, r
    }), _d("%%@", ["^#", "%^@", ")", "(#", "(@", "("], function(t, n, i, o, e, s) {
        "use strict";
        function r(t, e) {
            n.call(this, t), this.onClicked = e, this.onClosePageCallback = null, this.currentPage = null, this.addMenuBar(), this.configMenuBar()
        }
        return t.extend(r, n), r.prototype.openPage = function(t, e) {
            this.clearContent(), this.updateMenuBar(t.getTitle()), this.buildPage(t), this.expanded = !0, s.root.disableResize(), this.onClosePageCallback = e
        }, r.prototype.updateMenuBar = function(t) {
            this.pageBar.getElementsByClassName("pageBarTitle")[0].innerHTML = t
        }, r.prototype.configMenuBar = function() {
            e.onClick(i.byClass("pageBarClose")[0], this.onCloseClicked.bind(this)), e.onClick(i.byClass("pageBarOpenMenu")[0], this.onBurgerClicked.bind(this))
        }, r.prototype.addMenuBar = function() {
            var t = o.get("pageNavigationBar.html"),
                e = i.toHTML(t);
            this.wrapper.appendChild(e)
        }, r.prototype.onCloseClicked = function() {
            s.root.enableResize(), this.closePageAndWrapper()
        }, r.prototype.onBurgerClicked = function() {
            s.root.enableResize(), this.closePageAndWrapper(), this.onClicked()
        }, r.prototype.closePageAndWrapper = function() {
            this.expanded = !1, this.currentPage && this.currentPage.didClose(), this.onClosePageCallback && this.onClosePageCallback()
        }, r.prototype.buildPage = function(t) {
            this.currentPage = t;
            var e = this.currentPage.getContent(),
                n = i.toHTML(e);
            this.contentDom.appendChild(n), this.currentPage.didAddedToDOM()
        }, r.prototype.getPopupId = function() {
            return "burgerPageContent"
        }, r.prototype.open = function() {
            n.prototype.open.call(this), TweenMax.to(this.contentDom, this.config.expandingTime, {
                opacity: 1
            }), TweenMax.to(this.pageBar, this.config.expandingTime, {
                y: -parseInt(this.pageBar.clientHeight)
            })
        }, r.prototype.close = function() {
            n.prototype.close.call(this), TweenMax.to(this.contentDom, this.config.expandingTime, {
                opacity: 0
            }), TweenMax.to(this.pageBar, this.config.expandingTime, {
                y: 0,
                onComplete: this.onClose,
                onCompleteScope: this
            })
        }, Object.defineProperty(r.prototype, "pageBar", {
            get: function() {
                return this.wrapper.getElementsByClassName("pageBar")[0]
            }
        }), r
    }), _d("%$&", ["^#", "(@", "(#", "%^@", ")", "#@", "%!^", "@@", "^!", "("], function(t, i, o, e, s, n, r, a, h, p) {
        "use strict";
        function u(t) {
            e.call(this, t), this.addSwipeMenuBar(), this.configBarButtons(), this.spinner = this.addSwiper()
        }
        return t.extend(u, e), u.prototype.getOffset = function() {
            return .5 * a.renderer.height
        }, u.prototype.addSwipeMenuBar = function() {
            var t = this.getBarConfig(),
                e = o.get("swipeMenuNavigationBar.html", {
                    config: t
                }),
                n = s.toHTML(e);
            return this.contentDom.appendChild(n)
        }, u.prototype.addSwiper = function() {
            var t = new r(this.getSpinnerConfig());
            return this.contentDom.appendChild(t.html), t
        }, u.prototype.configBarButtons = function() {
            for (var t = this.getBarConfig(), e = this.controlBar.getElementsByClassName("buttons")[0] ? this.controlBar.getElementsByClassName("buttons")[0].children : [], n = 0; n < e.length; n++)
                i.onClick(e[n], t.buttons[n].handler)
        }, u.prototype.open = function() {
            e.prototype.open.call(this), this.adjustElementsHeight(), TweenMax.to(this.contentDom, this.config.expandingTime, {
                y: -parseInt(this.contentDom.clientHeight)
            }), this.spinner.refresh(), this.spinner.html.addEventListener("touchstart", this.preventingDefaultScroll, !1), this.spinner.html.addEventListener("touchmove", this.preventingDefaultScroll, !1)
        }, u.prototype.adjustElementsHeight = function() {
            this.contentDom.style.height = p.root.currentShift + "px";
            var t = this.getTargetSpinnerHeight();
            0 < t && (this.spinner.html.style.height = t + "px", this.spinner.refresh())
        }, u.prototype.getTargetSpinnerHeight = function() {
            return p.root.currentShift - this.controlBar.clientHeight + p.root.EXTRA_SHIFT_OFFSET
        }, u.prototype.preventingDefaultScroll = function(t) {
            t.preventDefault()
        }, u.prototype.close = function() {
            e.prototype.close.call(this), TweenMax.to(this.contentDom, this.config.expandingTime, {
                y: 0,
                onComplete: this.onClose,
                onCompleteScope: this
            }), this.spinner.html.removeEventListener("touchstart", this.preventingDefaultScroll), this.spinner.html.removeEventListener("touchmove", this.preventingDefaultScroll)
        }, u.prototype.onClose = function() {
            e.prototype.onClose.call(this), TweenMax.set(this.contentDom, {
                x: 0,
                y: 0
            })
        }, u.prototype.refresh = function() {
            this.expanded && (this.config.onPanelOpen(), this.adjustElementsHeight(), TweenMax.to(this.contentDom, this.config.expandingTime, {
                y: -parseInt(this.contentDom.clientHeight)
            }), this.spinner.refresh())
        }, u.prototype.getPopupId = function() {
            throw new Error("Abstract method")
        }, u.prototype.getSpinnerConfig = function() {
            throw new Error("Abstract method")
        }, u.prototype.getBarConfig = function() {
            throw new Error("Abstract method")
        }, u.prototype.getExtraClassName = function() {
            return "swiperPickerWrapper"
        }, Object.defineProperty(u.prototype, "controlBar", {
            get: function() {
                return this.wrapper.getElementsByClassName("swipeMenuNavigationBar")[0]
            }
        }), u
    }), _d("%$*", ["^#", "%^#", "(#", "#@", ")", "$)*", "%!@", "@@", "@(&", "%%#"], function(t, e, n, i, o, s, r, a, h, p) {
        "use strict";
        function u() {
            p.call(this)
        }
        return t.extend(u, p), u.prototype.getContent = function() {
            var t = [this.getData().autoplay];
            return n.get("settings.html", {
                sections: t
            })
        }, u.prototype.getData = function() {
            var t = {};
            return t.autoplay = {
                components: [{
                    checkbox: !0,
                    id: "stopAutoplayAnyWinCheckbox",
                    label: "<p>" + i.get("stopAutoplayAnyWinAtLeast") + "</p>" + this.createInput("stopAutoplayAnyWinAtLeastInput"),
                    hasInputClass: "hasInput"
                }, {
                    checkbox: !0,
                    id: "stopAutoplayCashIncreasesCheckbox",
                    label: "<p>" + i.get("settingsAuto3") + "</p>" + this.createInput("stopAutoplayCashIncreasesInput"),
                    hasInputClass: "hasInput"
                }]
            }, a.isLossLimitEnabled() ? a.showNewMobileUI && t.autoplay.components.push({
                checkbox: !0,
                id: "stopLossCheckbox",
                label: "<p>" + i.get("stop_loss") + "</p>" + this.createInput("stopLossInput"),
                hasInputClass: "hasInput"
            }) : t.autoplay.components.push({
                checkbox: !0,
                id: "stopAutoplayCashDecreasesCheckbox",
                label: "<p>" + i.get("settingsAuto4") + "</p>" + this.createInput("stopAutoplayCashDecreasesInput"),
                hasInputClass: "hasInput"
            }), h.showStopAutoSpinOnFreeSpins() && t.autoplay.components.push({
                checkbox: !0,
                id: "stopAutoplayFreespinsModeCheckbox",
                label: i.get("settings_stopOnFreespins")
            }), t
        }, u.prototype.bindWithModels = function() {
            var t = new s("stopAutoplayAnyWinCheckbox"),
                e = new s("stopAutoplayCashIncreasesCheckbox");
            if (o.bind(t, h, "stopAfterWin"), o.bind(new r("stopAutoplayAnyWinAtLeastInput", void 0, t), h, "stopThresholdIfWin"), a.isLossLimitEnabled()) {
                if (a.showNewMobileUI) {
                    var n = new s("stopLossCheckbox");
                    o.bind(new r("stopLossInput", void 0, n), h, "stopLossDifference")
                }
            } else {
                var i = new s("stopAutoplayCashDecreasesCheckbox");
                o.bind(i, h, "stopIfCashDecrease"), o.bind(new r("stopAutoplayCashDecreasesInput", void 0, i), h, "cashDiffrenceIfDecrease")
            }
            o.bind(e, h, "stopIfCashIncrease"), o.bind(new r("stopAutoplayCashIncreasesInput", void 0, e), h, "cashDiffrenceIfIncrease"), h.showStopAutoSpinOnFreeSpins() && o.bind(new s("stopAutoplayFreespinsModeCheckbox"), h, "stopIfFreespinsMode")
        }, u
    }), _d("%%$", ["^#", "%^#", "(#", ")", "!", "$(%", "$%!", "#@", "@@", "#", "(@"], function(t, e, n, i, o, s, r, a, h, p, u) {
        "use strict";
        function c() {
            o.bindAll(this), e.call(this)
        }
        return t.extend(c, e), c.prototype.getId = function() {
            return "burgerMenu_gameHistory"
        }, c.prototype.getTitle = function() {
            return a.get("gameHistoryTitle")
        }, c.prototype.getIconName = function() {
            return "history_icon"
        }, c.prototype.getContent = function() {
            return "<div id='gameHistory' class='scrollable'>"
        }, c.prototype.didAddedToDOM = function() {
            new s(this.onSuccess).run()
        }, c.prototype.addContent = function() {
            i.byId("gameHistory").innerHTML += n.get("gameHistoryMobile.html", {
                rounds: r.rounds,
                watchButtonLabel: a.get("game_history_watch"),
                timeLabel: a.get("game_history_time_label"),
                betLabel: a.get("game_history_bet_label"),
                winLabel: a.get("game_history_win_label"),
                initialBalanceLabel: a.get("game_history_initial_balance_label"),
                finalBalanceLabel: a.get("game_history_final_balance_label")
            })
        }, c.prototype.onSuccess = function() {
            this.addContent();
            for (var t = i.byClass("gameHistoryWatchLink"), e = 0; e < t.length; e++)
                u.onClick(t[e], this.onWatchReplay)
        }, c.prototype.onWatchReplay = function(t) {
            p.emit("watch/run", {
                wagerid: t.target.getAttribute("wagerId"),
                sessid: h.sessionId,
                gameHistorySessionId: t.target.getAttribute("gameHistorySessionId"),
                gameHistoryTicketId: t.target.getAttribute("gameHistoryTicketId")
            })
        }, c.prototype.getOrder = function() {
            return 2
        }, c
    }), _d("%%%", ["^#", "%^#", "(#", "@@", "$!#", "#@"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            e.call(this)
        }
        return t.extend(r, e), r.prototype.getId = function() {
            return "burgerMenu_gameRules"
        }, r.prototype.getTitle = function() {
            return s.get("gameRulesTitle")
        }, r.prototype.getIconName = function() {
            return "menu_rules_icon"
        }, r.prototype.getContent = function() {
            return n.get("gameRules.html", {
                content: o.getContent()
            })
        }, r.prototype.getOrder = function() {
            return 3
        }, r
    }), _d("%^#", [], function() {
        "use strict";
        function t() {}
        return t.prototype.getContent = function() {}, t.prototype.didAddedToDOM = function() {}, t.prototype.didClose = function() {}, t.prototype.getId = function() {
            throw new Error("Abstract method")
        }, t.prototype.getTitle = function() {
            throw new Error("Abstract method")
        }, t.prototype.getIconName = function() {
            throw new Error("Abstract method")
        }, t.prototype.getOrder = function() {
            throw new Error("Abstract method")
        }, t.prototype.getConfig = function() {
            return {
                id: this.getId(),
                title: this.getTitle(),
                icon: this.getIconName()
            }
        }, t
    }), _d("%%*", ["%^#", "^#", "(#", "%*", "#^%", "#))", "#(*", "#@"], function(t, e, n, r, a, h, p, u) {
        "use strict";
        function i() {
            t.call(this)
        }
        return e.extend(i, t), i.prototype.getId = function() {
            return "burgerMenu_paytable"
        }, i.prototype.getTitle = function() {
            return u.get("paytableTitle")
        }, i.prototype.getIconName = function() {
            return "menu_paytable_icon"
        }, i.prototype.getContent = function() {
            var t = {};
            return t.pages = this.processSubPages(), t.malfunction = u.get("infoPages_malfunctionInfo"), n.get("paytable.html", {
                content: t
            })
        }, i.prototype.processSubPages = function() {
            var t = this.getSubPages();
            return t.map(function(t) {
                return {
                    pageContent: t
                }
            })
        }, i.prototype.getSubPages = function() {
            return []
        }, i.prototype.getSymbolsData = function(t, e) {
            var n = r.clone(a.symbols),
                i = r.toArray(n).splice(t, e),
                o = this.nameToLowerCase(i),
                s = this.filterByType(o, a.TYPE_NORMAL);
            return this.symbolsAddedRewardNumbers = this.addRewardNumbers(s), {
                symbols: this.symbolsAddedRewardNumbers,
                malfunction: u.get("infoPages_malfunctionInfo")
            }
        }, i.prototype.nameToLowerCase = function(t) {
            return r.toArray(t).map(function(t) {
                return t.name = t.name.toLowerCase(), t
            })
        }, i.prototype.filterByType = function(t, e) {
            return r.toArray(t).filter(function(t) {
                return t.type === e
            })
        }, i.prototype.addRewardNumbers = function(t) {
            return t.map(this.addRewardNumbersToPrize.bind(this))
        }, i.prototype.addRewardNumbersToPrize = function(t) {
            return t.prizes = t.prizes.map(this.getPrizeWithRewardNumbers.bind(this)), t
        }, i.prototype.getPrizeWithRewardNumbers = function(t, e) {
            if (t.reward)
                return t;
            var n = {};
            return n.reward = 5 - e, n.coins = t, n
        }, i.prototype.getPaylinesData = function() {
            var t = this.paylinesData || {};
            t.paylines = [];
            for (var e = 0; e < h.paylines.length; e++) {
                var n = {};
                n.data = this.getDotsForPayline(n, e), t.paylines.push(n)
            }
            return t.description = u.get("infoPages_paylinesDescription"), t.malfunction = u.get("infoPages_malfunctionInfo"), this.paylinesData = t
        }, i.prototype.getDotsForPayline = function(t, e) {
            for (var n = [], i = 0; i < p.getRows(); i++)
                for (var o = 0; o < h.paylines[e].length; o++) {
                    var s = {};
                    s.selected = h.paylines[e][o] === i, n.push(s)
                }
            return n
        }, i.prototype.getOrder = function() {
            return 0
        }, i
    }), _d("%%#", ["^#", "%^#", "(#", "#@", ")", "%!#", "$)*", "%!@", "$*", "#*!", "@@", "@(&", "%&", "@$$"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d) {
        "use strict";
        function f() {
            e.call(this)
        }
        return t.extend(f, e), f.prototype.getId = function() {
            return "burgerMenu_settings"
        }, f.prototype.getTitle = function() {
            return i.get("settingsTitle")
        }, f.prototype.getIconName = function() {
            return "menu_settings_icon"
        }, f.prototype.getContent = function() {
            var t = this.getData(),
                e = [t.audio, t.visual, t.options];
            return e = e.filter(function(t) {
                return t && t.components && 0 < t.components.length
            }), n.get("settings.html", {
                sections: e
            })
        }, f.prototype.getData = function() {
            var t = {};
            return t.audio = {
                label: i.get("settingsAudio"),
                components: [{
                    slider: !0,
                    id: "volumeSlider",
                    label: i.get("settingsVolume")
                }, {
                    checkbox: !0,
                    id: "soundsEnabledCheckbox",
                    label: i.get("settingsSfx")
                }, {
                    checkbox: !0,
                    id: "musicEnabledCheckbox",
                    label: i.get("settingsSnd")
                }]
            }, t.visual = {
                label: i.get("settingsVisual"),
                components: [{
                    slider: !0,
                    id: "spinSpeedSlider",
                    label: i.get("settingsSpeed")
                }]
            }, d.isSplashScreenAvailable() && t.visual.components.push({
                checkbox: !0,
                id: "splashScreenEnabledCheckbox",
                label: i.get("settings_showSplashScreen")
            }), p.isVideoAvailable() && t.visual.components.push({
                checkbox: !0,
                id: "videoIntroEnabledCheckbox",
                label: i.get("settings_showVideoIntro")
            }), t.options = {
                label: i.get("settings_options"),
                components: []
            }, u.hasCurrencyCoinsOption() && t.options.components.push({
                checkbox: !0,
                id: "showCurrencyCheckbox",
                label: i.get("settingsShowCurrency")
            }), t
        }, f.prototype.createInput = function(t) {
            return "<p id='" + t + "' class='settings-input'></p>"
        }, f.prototype.onVolumeChanged = function() {
            o.byId("volumeSlider") && (o.byId("volumeSlider").value = l.globalVolume)
        }, f.prototype.didAddedToDOM = function() {
            l.on("globalVolume/changed", this.onVolumeChanged), this.bindWithModels()
        }, f.prototype.bindWithModels = function() {
            o.bind(new s("volumeSlider", !0), l, "globalVolume"), o.bind(new s("spinSpeedSlider", !0), c, "spinSpeed"), o.bind(new r("soundsEnabledCheckbox"), l, "soundsEnabled"), o.bind(new r("musicEnabledCheckbox"), l, "musicEnabled"), u.hasCurrencyCoinsOption() && o.bind(new r("showCurrencyCheckbox"), h, "showCoins"), p.isVideoAvailable() && o.bind(new r("videoIntroEnabledCheckbox"), p, "showVideoIntro"), d.isSplashScreenAvailable() && o.bind(new r("splashScreenEnabledCheckbox"), d, "showSplashScreen")
        }, f.prototype.didClose = function() {
            l.off("globalVolume/changed", this.onVolumeChanged), this.unFocusAllInputs()
        }, f.prototype.configOnFocus = function(t, e) {
            for (var n = document.getElementsByClassName("scrollable")[0].getElementsByTagName("input"), i = 0; i < n.length; i++)
                n[i].onfocus = t, n[i].onblur = e
        }, f.prototype.unFocusAllInputs = function(t) {
            for (var e = document.getElementsByClassName("scrollable")[0].getElementsByTagName("input"), n = 0; n < e.length; n++)
                e[n].blur();
            t && t()
        }, f.prototype.getOrder = function() {
            return 1
        }, f
    }), _d("%^*", ["%#(", "%^$", "%^%", "@@", "^#", "%^^", "%^&", "@%$"], function(e, n, i, t, o, s, r, a) {
        "use strict";
        function h() {
            PIXI.Container.call(this), this.container = new PIXI.Container, this.addChild(this.container), this.background = this.createBackground(), this.balanceLabel = this.createBalanceLabel(), this.betLabel = this.createBetLabel(), this.winLabel = this.createWinLabel(), this.createLayouts()
        }
        return o.extend(h, PIXI.Container), h.prototype.createLayouts = function() {
            this.landscape = new s(this), this.portrait = new r(this)
        }, h.prototype.createBackground = function() {
            if (a.hasTexture("images/hud/background.png")) {
                var t = PIXI.Sprite.fromFrame("images/hud/background.png");
                return t.y = -t.height, this.addChildAt(t, 0)
            }
            return new PIXI.Container
        }, h.prototype.getWidth = function() {
            return 1610
        }, h.prototype.getHeight = function() {
            return 110
        }, h.prototype.createBalanceLabel = function() {
            var t = new e;
            return this.container.addChild(t)
        }, h.prototype.createBetLabel = function() {
            var t = new n;
            return this.container.addChild(t)
        }, h.prototype.createWinLabel = function() {
            var t = new i;
            return this.container.addChild(t)
        }, h.prototype.layoutLandscape = function() {
            this.landscape.refresh()
        }, h.prototype.layoutPortrait = function() {
            this.portrait.refresh()
        }, h.prototype.getLabelsBottom = function() {
            var t = this.container.getLocalBounds();
            return t.y + t.height
        }, h
    }), _d("%&#", ["%^*", "^#", "@@", "%^(", "%^)", "%&!", "%&@", "%#)"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {
            t.call(this), n.depositURL && this.balanceLabel.showDepositButton()
        }
        return e.extend(h, t), h.prototype.createLayouts = function() {
            this.landscape = new i(this), this.portrait = new o(this)
        }, h.prototype.createBalanceLabel = function() {
            var t = new a;
            return this.container.addChild(t)
        }, h.prototype.createBetLabel = function() {
            var t = new r;
            return this.container.addChild(t)
        }, h.prototype.createWinLabel = function() {
            var t = new s;
            return this.container.addChild(t)
        }, h
    }), _d("%&^", ["%&$", "^#", "#", "$!", "%&%"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.call(this, "hud/autospin", o.AUTOSPIN_PICKER)
        }
        return e.extend(s, t), s.prototype.createIcon = function() {
            t.prototype.createIcon.call(this, "hud/autospin")
        }, s
    }), _d("%&&", ["%@^", "^#", "#"], function(t, e, n) {
        "use strict";
        function i() {
            t.call(this, "hud/autospin_button", this.onClickHandler), this.createIcon("hud/autospin")
        }
        return e.extend(i, t), i.prototype.onClickHandler = function() {
            n.emit("autospin/openList")
        }, i.prototype.layoutLandscape = function() {
            this.normalImage.rotation = Math.PI / 2
        }, i.prototype.layoutPortrait = function() {
            this.normalImage.rotation = 0
        }, i
    }), _d("%&*", ["%&$", "^#", "#", "%&%", "@"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.call(this, "hud/open_bet", i.BET_PICKER), this.refreshEnabled()
        }
        return e.extend(s, t), s.prototype.refreshEnabled = function() {
            this.enabled = this.enabled && !o.hasPromoSpin()
        }, s.prototype.createIcon = function() {
            t.prototype.createIcon.call(this, "hud/open_bet")
        }, s
    }), _d("%&(", ["%@^", "^#", "#)", "#", "^!", "@"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            t.call(this, "hud/open_bet_button", this.onClickHandler), this.createIcon("hud/open_bet"), this.refreshEnabled()
        }
        return e.extend(r, t), r.prototype.onClickHandler = function() {
            i.emit("bet/openList")
        }, r.prototype.refreshEnabled = function() {
            this.enabled = this.enabled && !s.hasPromoSpin()
        }, r
    }), _d("%#*", ["%#^", "^#"], function(e, t) {
        "use strict";
        function n() {
            e.call(this), this.layout()
        }
        return t.extend(n, e), n.prototype.createIcon = function(t) {
            var e = PIXI.Sprite.fromFrame(this.getIconPath(t));
            return e.anchor.set(0, .5), this.addChild(e)
        }, n.prototype.getIconPath = function(t) {
            return "images/hud/" + t + "_icon.png"
        }, n.prototype.layout = function() {
            this.icon.x = 20, this.icon.y = 0, this.label.scale.set(1, 1), this.autoScale(1), this.label.x = this.background.width - .5 * (this.background.width - this.icon.width) - this.label.width / 2 + 5, this.label.y = .5 * -this.label.height, this.layoutExtraElements()
        }, n.prototype.layoutExtraElements = function() {}, n.prototype.createBackground = function() {
            var t = e.prototype.createBackground.call(this);
            return t.anchor.set(0, .5), t.position.set(0, 0), t
        }, n
    }), _d("%*!", ["%&)", "^#", "#", "!", "%&%", "^!", "$!", "%$^"], function(e, t, n, i, o, s, r, a) {
        "use strict";
        function h(t) {
            e.call(this, t), this.singleSpin = !0, this.autospinCounter = this.createAutospinCounter(), n.on("swipeMenu/willToggle", this.toggleSpinsMode), n.on("autospin/start", this.swapIcon), n.on("autospin/end", this.swapIcon), n.on("orientation/changed", this.refreshCounterVisibility), n.on("autospin/start", this.refreshCounterVisibility), r.on("isDuringAutoSpins/changed", this.refreshCounterVisibility), this.refreshCounterVisibility()
        }
        return t.extend(h, e), h.prototype.dispatchEvents = function() {
            s.isPortraitMode() && r.isDuringAutoSpins ? (n.emit("autospin/stop"), this.setNormalIcon()) : e.prototype.dispatchEvents.call(this)
        }, h.prototype.setNormalIcon = function() {
            this.setIconTexture(this.iconTexture)
        }, h.prototype.dispatchSpinBegin = function() {
            this.singleSpin ? e.prototype.dispatchSpinBegin.call(this) : (n.emit("autospin/prepareSpins"), this.singleSpin = !0, this.swapIcon())
        }, h.prototype.createAutospinCounter = function() {
            var t = new a;
            return t.anchor.set(.5, .5), t.y = 1 * this.height / 4, this.addChild(t)
        }, h.prototype.toggleSpinsMode = function(t) {
            this.singleSpin = t !== o.AUTOSPIN_PICKER, this.swapIcon()
        }, h.prototype.swapIcon = function() {
            this.setIconTexture(this.iconTexture)
        }, h.prototype.setIconTexture = function(t) {
            r.isDuringAutoSpins ? this.setAutospinStopIcon() : this.singleSpin ? this.icon.texture = t : this.setAutospinStartIcon()
        }, h.prototype.setAutospinStopIcon = function() {
            this.icon.texture = this.getTexture("images/hud/autospin_stop_icon.png")
        }, h.prototype.setAutospinStartIcon = function() {
            this.icon.texture = this.getTexture("images/hud/autospin_start_icon.png")
        }, h.prototype.refreshCounterVisibility = function() {
            this.autospinCounter.visible = s.isPortraitMode() && r.isDuringAutoSpins
        }, h
    }), _d("%&$", ["%@^", "^#", "#", "#@&"], function(n, t, i, e) {
        "use strict";
        function o(t, e) {
            n.call(this, t + "_button", this.onClickHandler), this.createIcon(), this.type = t, this.pickerType = e, i.on("swipeMenu/willToggle", this.onSwipeMenuToggle)
        }
        return t.extend(o, n), o.prototype.onClickHandler = function() {
            this.setCloseIcon(), e.add(e.SWIPE_MENU_BUTTON, this.pickerType), i.emit("swipeMenu/toggle", this.pickerType)
        }, o.prototype.changeIcon = function(t) {
            this.icon.texture = PIXI.utils.TextureCache["images/" + t + ".png"]
        }, o.prototype.setNormalIcon = function() {
            this.changeIcon(this.type + "_icon")
        }, o.prototype.setCloseIcon = function() {
            this.changeIcon("hud/close_picker_icon")
        }, o.prototype.onSwipeMenuToggle = function(t) {
            t !== this.pickerType && this.setNormalIcon()
        }, o
    }), _d("%*@", ["^#", "!", "#", "%*!", "%&*", "%&^", "^!", "@@&", "$!", "#!%", "#@%", "@", "@@", "@$"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d) {
        "use strict";
        function f() {
            PIXI.Container.call(this), e.bindAll(this), this.LANDSCAPE_ALPHA = .8, this.PORTRAIT_ALPHA = 1, this.container = this.createContainer(), this.spinButton = this.createSpinButton(), this.autoSpinButton = this.createAutoSpinButton(), this.betButton = this.createBetButton(), n.on("spin/begin", this.onSpinStart, n.PRIORITY_HIGHEST), n.on("spin/forceStop", this.onSpinStart, n.PRIORITY_HIGHEST), n.on("spin/end", this.onSpinStart, n.PRIORITY_HIGHEST), n.on("autospin/stop", this.onAutoSpinStop), n.on("spin/definiteEnd", this.onSpinEnd), n.on("spin/dataLoaded", this.onSpinDataLoaded), u.on("allowSkip/changed", this.onAllowSkipChanged), d(this.disableButtonsOnReplay, 0), n.on("orientation/changed", this.refreshButtonsAlpha)
        }
        return t.extend(f, PIXI.Container), f.prototype.disableButtonsOnReplay = function() {
            l.isReplayMode() && a.setChildrenEnabled(this.container, [this.spinButton], !1)
        }, f.prototype.refreshButtonsAlpha = function() {
            var t = this.getButtonAlpha();
            this.spinButton.normalImage.alpha = t, this.autoSpinButton.normalImage.alpha = t, this.betButton.normalImage.alpha = t
        }, f.prototype.getButtonAlpha = function() {
            return r.isPortraitMode() ? this.PORTRAIT_ALPHA : this.LANDSCAPE_ALPHA
        }, f.prototype.onSpinDataLoaded = function() {
            r.isPortraitMode() && l.canStopSpin() && (this.spinButton.enabled = !0)
        }, f.prototype.onSpinStart = function() {
            this.visible = r.isPortraitMode() && !p.isDuringFreeSpins;
            var t = h.isDuringAutoSpins ? [this.spinButton] : [];
            a.setChildrenEnabled(this.container, t, !1)
        }, f.prototype.onSpinEnd = function() {
            h.isDuringAutoSpins || p.isDuringFreeSpins || l.isReplayMode() || (this.visible = !0, this.setEnabled(!0))
        }, f.prototype.onAutoSpinStop = function(t) {
            this.setEnabled(t || !1)
        }, f.prototype.setEnabled = function(t, e) {
            e = e || [], c.hasPromoSpin() && e.push(this.betButton), a.setChildrenEnabled(this.container, e, t)
        }, f.prototype.createContainer = function() {
            var t = new PIXI.Container;
            return this.addChild(t)
        }, f.prototype.createSpinButton = function() {
            var t = new i;
            return t.anchor.set(.5, .5), this.container.addChild(t)
        }, f.prototype.createBetButton = function() {
            var t = new o;
            return t.anchor.set(.5, .5), this.container.addChildAt(t, 0)
        }, f.prototype.createAutoSpinButton = function() {
            var t = new s;
            return t.anchor.set(.5, .5), l.isAutoSpinsEnable() ? this.container.addChildAt(t, 0) : t
        }, f.prototype.layoutLandscape = function() {
            this.betButton.x = 0, this.autoSpinButton.x = 0, this.betButton.y = this.getGap(), this.autoSpinButton.y = -this.getGap()
        }, f.prototype.layoutPortrait = function() {
            this.betButton.x = -this.getGap(), this.autoSpinButton.x = this.getGap(), this.betButton.y = 0, this.autoSpinButton.y = 0
        }, f.prototype.rotateButtons = function(t) {
            this.betButton.rotation = -t, this.autoSpinButton.rotation = -t, this.betButton.icon.rotation = t, this.autoSpinButton.icon.rotation = t
        }, f.prototype.getGap = function() {
            return 225
        }, f.prototype.onAllowSkipChanged = function() {
            this.spinButton.enabled = u.allowSkip && l.canSkip()
        }, f
    }), _d("%*#", ["^#", "%*@", "%&)", "$!", "%&(", "%&&", "@@"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a() {
            e.call(this), this.LANDSCAPE_ALPHA = 1
        }
        return t.extend(a, e), a.prototype.getGap = function() {
            return 170
        }, a.prototype.createSpinButton = function() {
            var t = new n;
            return t.anchor.set(.5, .5), this.container.addChild(t)
        }, a.prototype.createBetButton = function() {
            var t = new o;
            return t.anchor.set(.5, .5), this.container.addChildAt(t, 0)
        }, a.prototype.createAutoSpinButton = function() {
            var t = new s;
            return t.anchor.set(.5, .5), r.isAutoSpinsEnable() ? this.container.addChildAt(t, 0) : t
        }, a.prototype.onSpinStart = function() {
            e.prototype.onSpinStart.call(this), this.visible = this.visible && !i.isDuringAutoSpins
        }, a.prototype.layoutLandscape = function() {
            this.rotateButtons(0), e.prototype.layoutLandscape.call(this)
        }, a.prototype.layoutPortrait = function() {
            this.rotateButtons(-Math.PI / 2), e.prototype.layoutPortrait.call(this)
        }, a
    }), _d("%*$", ["!", "^#", "#", "%@^", "@@", "$!", "^!", "%$^"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h(t) {
            i.call(this, t || "hud/stopautospin_button", this.onClick), this.anchor.set(.5, .5), this.initialize(), n.on("autospin/start", this.onAutoSpinStart), s.on("isDuringAutoSpins/changed", this.onAutoSpinStop)
        }
        return e.extend(h, i), h.prototype.initialize = function() {
            this.createIcon("hud/autospin_button_stop"), this.label = this.createLabel(), this.layout(), this.visible = !1
        }, h.prototype.onClick = function() {
            o.showMobileUI && s.isDuringAutoSpins && (n.emit("autospin/stop"), this.onAutoSpinStop())
        }, h.prototype.createLabel = function() {
            var t = new a;
            return t.anchor.set(.5, .5), this.addChild(t)
        }, h.prototype.layout = function() {
            this.icon.x = -10, this.label.x = -10, this.icon.y = -(this.normalImage.height - this.icon.height) / 4, this.label.y = .2 * this.height
        }, h.prototype.onAutoSpinStart = function() {
            this.show()
        }, h.prototype.show = function() {
            this.visible = r.isLandscapeMode(), this.alpha = 0, TweenMax.to(this, .4, {
                alpha: 1,
                delay: .25
            })
        }, h.prototype.onAutoSpinStop = function() {
            s.isDuringAutoSpins || TweenMax.to(this, .4, {
                alpha: 0,
                onComplete: this.onHideComplete
            })
        }, h.prototype.onHideComplete = function() {
            this.visible = !1
        }, h
    }), _d("%*%", ["!", "^#", "#", "%@^", "@@", "$!", "^!", "%$^"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h(t) {
            i.call(this, t || "hud/stop_autospin_button", this.onClick), this.createIcon("hud/stop_autospin_button"), this.counterLabel = this.createLabel("", this.getCounterLabelStyle()), this.stopLabel = this.createLabel("STOP", this.getStopLabelStyle()), n.on("autospin/start", this.onAutoSpinStart), s.on("isDuringAutoSpins/changed", this.onAutoSpinStop), s.on("autoSpinsLeft/changed", this.setAutoSpinsLeft), this.anchor.set(.5, .5), this.visible = !1, this.refreshLayout()
        }
        return e.extend(h, i), h.prototype.onClick = function() {
            o.showMobileUI && s.isDuringAutoSpins && (n.emit("autospin/stop"), this.onAutoSpinStop())
        }, h.prototype.createLabel = function(t, e) {
            var n = new PIXI.Text(t, e);
            return n.anchor.set(.5, .5), this.addChild(n)
        }, h.prototype.refreshLayout = function() {
            this.icon.y = this.counterLabel.y = 1 * -this.normalImage.height / 6, this.stopLabel.y = 1 * this.normalImage.height / 6
        }, h.prototype.getCounterLabelStyle = function() {
            return {
                fontFamily: "Verdana",
                fill: "white",
                fontSize: "24px",
                fontWeight: "bold"
            }
        }, h.prototype.getStopLabelStyle = function() {
            return {
                fontFamily: "Verdana",
                fill: "white",
                fontSize: "28px",
                fontWeight: "bold"
            }
        }, h.prototype.onAutoSpinStart = function() {
            this.show()
        }, h.prototype.show = function() {
            this.alpha = 0, TweenMax.to(this, .4, {
                alpha: 1,
                delay: .25
            })
        }, h.prototype.onAutoSpinStop = function() {
            s.isDuringAutoSpins || TweenMax.to(this, .4, {
                alpha: 0,
                onComplete: this.onHideComplete
            })
        }, h.prototype.setAutoSpinsLeft = function() {
            s.isDuringAutoSpins && (this.counterLabel.text = s.formatWithoutPostFix(s.autoSpinsLeft))
        }, h.prototype.onHideComplete = function() {
            this.visible = !1
        }, h
    }), _d("%*&", ["!", "#", "^#", "%*^", "%@^", "%$$", "@@", "^)"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {
            i.call(this), this.portraitList = this.createPortraitList()
        }
        return n.extend(h, i), h.prototype.getToolbarOptions = function() {
            return {
                buttons: this.getButtons(),
                buttonsGap: 31,
                padding: 20,
                animationAlpha: 0
            }
        }, h.prototype.getButtons = function() {
            var t = [this.createPaytableButton(), this.createSettingsButton(), this.createSoundsButton(), this.createHomeButton()];
            return r.showGameRules() && a.insertAt(t, 2, this.createRulesButton()), r.showGameHistory() && a.insertAt(t, 2, this.createGameHistoryButton()), t
        }, h.prototype.getTextureName = function(t) {
            var e = "images/" + t + "_normal.png";
            return PIXI.utils.TextureCache[e] ? t : "hud/toolbar_button"
        }, h.prototype.createPortraitList = function() {
            for (var t = this.getButtons(), e = new PIXI.Container, n = 0; n < t.length; n++)
                e.addChild(t[n]);
            return e.visible = !1, this.addChild(e)
        }, h.prototype.layoutPortrait = function() {
            this.toolbar.visible = !1, this.toolbar.y = 0, this.portraitList.visible = !0, this.portraitList.y = 30;
            var t = this.portraitList.children,
                e = t.length * t[0].width,
                n = (r.renderer.width - e) / (t.length + 1);
            n = Math.max(n, 40);
            for (var i = t[0].width / 2, o = 0; o < t.length; o++)
                t[o].x = i, i += t[o].width + n
        }, h.prototype.layoutLandscape = function() {
            this.toolbar.visible = !0, this.portraitList.visible = !1, this.portraitList.y = 0
        }, h
    }), _d("%*^", ["!", "^#", "#", "@@", "%**", "%@^", "%$$", "%$#", "%$@", "%!(", "@&!", "$))", "$!", "#@", "%!*"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d, f) {
        "use strict";
        function g() {
            PIXI.Container.call(this), t.bindAll(this), this.buttonsToDisable = [], this.toolbar = new o(this.getToolbarOptions()), this.addChild(this.toolbar), this.setButtonsEnabled(!0), n.on("spin/begin", this.onSpinBegin), n.on("spin/definiteEnd", this.onSpinDefiniteEnd), n.on("autospin/start", this.onAutoSpinStart), n.on("spin/start", this.onSpinStart), this.visible = !i.isInnerClient()
        }
        return e.extend(g, PIXI.Container), g.prototype.onAutoSpinStart = function() {
            this.toolbar.isOpen && this.toolbar.toggleList()
        }, g.prototype.onSpinStart = function() {
            this.toolbar.isOpen && !l.isDuringAutoSpins && this.toolbar.toggleList()
        }, g.prototype.onSpinBegin = function() {
            this.setButtonsEnabled(!1)
        }, g.prototype.onSpinDefiniteEnd = function() {
            this.setButtonsEnabled(!0)
        }, g.prototype.setButtonsEnabled = function(t) {
            for (var e = 0; e < this.buttonsToDisable.length; e++)
                this.buttonsToDisable[e].enabled = t
        }, g.prototype.getToolbarOptions = function() {
            return {
                buttons: this.getButtons(),
                buttonsGap: 5,
                padding: 10,
                animationAlpha: 1
            }
        }, g.prototype.getButtons = function() {
            var t = [];
            return t.push(this.createPaytableButton()), i.isReplayMode() || t.push(this.createSettingsButton()), i.showGameHistory() && t.push(this.createGameHistoryButton()), i.showGameRules() && t.push(this.createRulesButton()), t.push(this.createSoundsButton()), i.isFullscreenOnDesktopEnabled() && t.push(this.createFullscreenButton()), i.isTablet && t.push(this.createHomeButton()), t
        }, g.prototype.createSettingsButton = function() {
            return this.createButton("hud/settings_button", function() {
                n.emit("popup/open", {
                    content: c
                })
            }, !0)
        }, g.prototype.createFullscreenButton = function() {
            return new h(this.getTextureName("hud/fullscreen_button"))
        }, g.prototype.createSoundsButton = function() {
            return new r(this.getTextureName("hud/sound_button"))
        }, g.prototype.createRulesButton = function() {
            return this.createButton("hud/game_rules_button", function() {
                n.emit("popup/open", {
                    content: u
                })
            }, !0)
        }, g.prototype.createGameHistoryButton = function() {
            return this.createButton("hud/game_history_button", function() {
                n.emit("popup/open", {
                    content: f
                })
            }, !0)
        }, g.prototype.createHomeButton = function() {
            return new a(this.getTextureName("hud/home_button"))
        }, g.prototype.createPaytableButton = function() {
            return this.createButton("hud/paytable_button", function() {
                n.emit("popup/open", {
                    content: p,
                    pagination: !0,
                    scaleOnMobile: !0
                })
            }, !0)
        }, g.prototype.getTextureName = function(t) {
            var e = "images/" + t + "_normal.png";
            return PIXI.utils.TextureCache[e] ? t : "hud/toolbar_button"
        }, g.prototype.createButton = function(t, e) {
            var n = new s(this.getTextureName(t), e);
            return n.tooltip = d.get("tooltip_" + t.substring("hud/".length)), n.anchor.set(.5, .5), n.createIcon(t), this.buttonsToDisable.push(n), n
        }, g
    }), _d("%**", ["^#", "%*(", "!", "%*)", "@@!", "@@"], function(t, i, e, n, o, s) {
        function r(t) {
            PIXI.Container.call(this), e.bindAll(this), this.openButton = this.createOpenButton(t.padding), this.background = this.createBackground(t), this.list = this.createList(t), this.isOpen = !1, this.openButton.click()
        }
        return t.extend(r, PIXI.Container), r.prototype.createBackground = function(t) {
            var e = (t.buttons.length + 1) * this.openButton.width,
                n = t.buttons.length * t.buttonsGap,
                i = new o("images/hud/toolbar_background.png", new PIXI.Rectangle(.2, 0, .6, 1));
            return i.anchor.set(0, .5), i.alpha = 0, i.width = e + n + 2 * t.padding, i.y = .5 * this.openButton.height, this.addChildAt(i, 0)
        }, r.prototype.createOpenButton = function(t) {
            var e = new n(this.toggleList);
            return e.anchor.set(.5, .5), e.x = .5 * e.width + t, e.y = .5 * e.height, e.createIcon("hud/plus"), this.addChild(e)
        }, r.prototype.createList = function(t) {
            var e = t.buttons,
                n = new i(e, t);
            return n.x = .5 * this.openButton.width + t.buttonsGap + t.padding, n.y = .5 * this.openButton.height, this.addChildAt(n, this.getChildIndex(this.openButton))
        }, r.prototype.toggleList = function(t) {
            var e = t ? .2 : 0;
            this.isOpen ? (this.list.hideButtons(e), this.openButton.close(), this.isOpen = !1, TweenMax.to(this.background, .5 * e, {
                alpha: 0,
                ease: Sine.easeOut
            })) : (this.list.showButtons(e), this.isOpen = !0, TweenMax.to(this.background, .5 * e, {
                alpha: 1,
                ease: Sine.easeOut
            }))
        }, r
    }), _d("%*(", ["!", "^#", "@^^", "#"], function(n, t, e, i) {
        function o(t, e) {
            PIXI.Container.call(this), n.bindAll(this), this.options = e, this.buttonsLayer = this.createButtonsLayer(), this.addButtons(t), this.mask = this.createMask(), this.visible = !1
        }
        return t.extend(o, PIXI.Container), o.prototype.createButtonsLayer = function() {
            var t = new PIXI.Container;
            return this.addChild(t)
        }, o.prototype.createMask = function() {
            var t = new PIXI.Graphics;
            return t.beginFill(16777215), t.drawRect(-this.options.buttonsGap, .5 * -this.buttonsLayer.height - 10, 2 * this.buttonsLayer.width, 2 * this.buttonsLayer.height), t.endFill(), this.addChild(t)
        }, o.prototype.addButtons = function(t) {
            for (var e = 0; e < t.length; ++e)
                t[e].on("mouseover", this.onMouseOver), t[e].on("mouseout", this.onMouseOut), this.buttonsLayer.addChild(t[e]);
            this.layoutChildren(), this.buttonsLayer.x = this.initialButtonsPosition
        }, o.prototype.layoutChildren = function() {
            for (var t = 0, e = this.buttonsLayer.children, n = 0; n < e.length; n++) {
                var i = e[n];
                i.x = t + i.width, t += i.width + this.options.buttonsGap
            }
        }, Object.defineProperty(o.prototype, "initialButtonsPosition", {
            get: function() {
                return -this.buttonsLayer.width - this.options.buttonsGap
            }
        }), o.prototype.showButtons = function(t) {
            TweenMax.killTweensOf(this.buttonsLayer), this.visible = !0, this.buttonsLayer.alpha = this.options.animationAlpha, TweenMax.to(this.buttonsLayer, t, {
                x: 0,
                alpha: 1,
                ease: Sine.easeOut
            })
        }, o.prototype.hideButtons = function(t) {
            TweenMax.killTweensOf(this.buttonsLayer), TweenMax.to(this.buttonsLayer, t, {
                x: this.initialButtonsPosition,
                ease: Sine.easeOut,
                alpha: this.options.animationAlpha,
                onComplete: this.onComplete
            })
        }, o.prototype.onComplete = function() {
            this.visible = !1
        }, o
    }), _d("%*)", ["^#", "%$!", "#@", "#"], function(t, e, n, i) {
        "use strict";
        function o(t) {
            e.call(this, "hud/toolbar_button", t), this.tooltipSelected = n.get("tooltip_open_toolbar_button_on"), this.tooltipDeselected = n.get("tooltip_open_toolbar_button_off")
        }
        return t.extend(o, e), o.prototype.onClick = function(t) {
            e.prototype.onClick.call(this, t), this.animateIcon()
        }, o.prototype.animateIcon = function() {
            var t = this.selected ? .25 * Math.PI : 0;
            TweenMax.to(this.icon, .15, {
                rotation: t
            })
        }, o.prototype.close = function() {
            this.selected = !1, this.animateIcon()
        }, o
    }), _d("%%(", [], function() {
        "use strict";
        function t(t) {
            this.id = t.name, this.title = t.name, this.icon = t.icon, this.url = t.url, this.order = t.order
        }
        return t.prototype.getId = function() {
            return this.id
        }, t.prototype.getTitle = function() {
            return this.title
        }, t.prototype.getIconName = function() {
            return this.icon
        }, t.prototype.getUrl = function() {
            return this.url
        }, t.prototype.getOrder = function() {
            return this.order
        }, t.prototype.getConfig = function() {
            return {
                id: this.getId(),
                title: this.getTitle(),
                iconURL: this.getIconName()
            }
        }, t
    }), _d("%^$", ["@@", "^#", "#@", "%#*", "%#&", "$*", "*"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a() {
            o.call(this, "bet", "panel_value"), this.interactive = !0, this.tap = this.click = s.toggle, r.on("totalBet/changed", this.refreshValue), s.on("showCurrency/changed", this.refreshValue), this.refreshValue()
        }
        return e.extend(a, t.showMobileUI ? i : o), a.prototype.refreshValue = function() {
            this.setTitleText(n.get(s.showCurrency ? "cashBet" : "coinBet")), this.setText(s.formatTotalBet()), this.layout()
        }, a.prototype.getFixedPrecision = function() {
            return s.showCurrency ? 2 : 0
        }, a.prototype.getWidth = function() {
            return t.showMobileUI ? 300 : 155
        }, a
    }), _d("%&@", ["%^$", "^#", "@@", "$)!"], function(t, e, n, i) {
        "use strict";
        function o() {
            t.call(this)
        }
        return e.extend(o, t), o.prototype.layout = function() {
            i.layout.call(this)
        }, o.prototype.autoScale = function(t) {
            i.autoScale.call(this, t)
        }, o
    }), _d("%(@", ["@@", "#", "%$!", "^#", "%(!", "$!", "#@"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a(t) {
            n.call(this, t || "hud/autospin_button", this.onClicked), this.autoSpinsLeftLabel = this.createAutoSpinsLeft(), this.tooltip = r.get("tooltip_autospin_button"), this.createIcon(), s.on("isDuringAutoSpins/changed", this.refresh), s.on("autoSpinsLeft/changed", this.setAutoSpinsLeft), this.refresh(), e.on("autospin/stop", this.onStopAutospin, e.PRIORITY_HIGH), this.switchToAlphaHit()
        }
        return i.extend(a, n), a.prototype.onStopAutospin = function(t) {
            s.isDuringAutoSpins && (this.enabled = t || !1)
        }, a.prototype.refresh = function() {
            var t = s.isDuringAutoSpins ? "images/" + this.iconName + "_active_icon.png" : "images/" + this.iconName + "_icon.png";
            this.normalIconTexture = PIXI.Texture.fromFrame(t), this.setIconTexture(this.normalIconTexture), this.autoSpinsLeftLabel.visible = s.isDuringAutoSpins, this.selected = s.isDuringAutoSpins, this.refreshAutoScale()
        }, a.prototype.refreshAutoScale = function() {
            if (this.isAutoScale()) {
                if (s.isDuringAutoSpins) {
                    TweenMax.to(this.icon.scale, .2, {
                        x: .8,
                        y: .8
                    });
                    var t = this.getIconOffset();
                    TweenMax.to(this.icon, .2, {
                        x: t.x,
                        y: t.y
                    }), this.autoSpinsLeftLabel.alpha = 0, TweenMax.to(this.autoSpinsLeftLabel, .2, {
                        alpha: 1
                    })
                } else
                    TweenMax.to(this.icon.scale, .2, {
                        x: 1,
                        y: 1
                    }), TweenMax.to(this.icon, .2, {
                        x: 0,
                        y: 0
                    }), this.autoSpinsLeftLabel.alpha = 1, TweenMax.to(this.autoSpinsLeftLabel, .2, {
                        alpha: 0
                    });
                this.autoSpinsLeftLabel.scale.set(.75, .75);
                var e = this.getCounterOffset();
                this.autoSpinsLeftLabel.x = e.x, this.autoSpinsLeftLabel.y = e.y
            }
        }, a.prototype.getIconOffset = function() {
            return {
                x: 20,
                y: -5
            }
        }, a.prototype.getCounterOffset = function() {
            return {
                x: -25,
                y: 20
            }
        }, a.prototype.isAutoScale = function() {
            return !1
        }, a.prototype.setAutoSpinsLeft = function() {
            var t = s.format(s.autoSpinsLeft);
            this.autoSpinsLeftLabel.text = t
        }, a.prototype.createList = function() {
            var t = new o(this.updateState);
            return t.x = this.x - 27, t.y = this.y - this.normalImage.height / 2 - 10, this.parent.addChildAt(t, this.parent.getChildIndex(this))
        }, a.prototype.onClicked = function() {
            this.list = this.list || this.createList(), s.isDuringAutoSpins ? (e.emit("autospin/stop"), this.selected = !1) : this.list.toggle()
        }, a.prototype.createAutoSpinsLeft = function(t) {
            var e = new PIXI.extras.BitmapText(t || "", {
                font: "ui",
                align: "center"
            });
            return e.scale.set(.7, .7), e.x = -25, e.y = 12, this.addChild(e)
        }, a.prototype.updateState = function() {
            this.selected = this.list.isOpen, s.isDuringAutoSpins && (this.selected = !0)
        }, a.prototype.enterFreeSpinsMode = function() {
            this.selected = !1
        }, a.prototype.exitFreeSpinsMode = function() {
            this.refresh()
        }, a
    }), _d("%(!", ["^#", "!", "$!", "#"], function(t, e, s, n) {
        "use strict";
        function i(t) {
            PIXI.Container.call(this), e.bindAll(this), this.onClose = t, this.visible = !1, this.isOpen = !1, this.interactive = !0, this.autoSpinListBackground = this.createBackground(), this.createList(s.autoSpins), n.on("spin/start", this.close), n.on("autospin/init", this.close)
        }
        return t.extend(i, PIXI.Container), i.prototype.createBackground = function() {
            var t = PIXI.Sprite.fromFrame("images/hud/autospin_background.png");
            return this.addChild(t)
        }, i.prototype.createList = function(t) {
            this.labels = [];
            for (var e = 10, n = 0; n < t.length; n++) {
                var i = s.format(t[n]),
                    o = this.getLabel(i);
                o.value = t[n], this.addChild(o), o.updateText(), o.x = this.width / 2 - o.width / 2, o.y = e, o.hitArea = new PIXI.Rectangle(-o.x, -5, this.width, o.height + 10), e += o.height + 3, o.interactive = !0, o.buttonMode = !0, o.click = o.tap = this.onSelected, o.mouseover = this.onLabelOver, o.mouseout = this.onLabelOut, this.labels.push(o)
            }
        }, i.prototype.onLabelOver = function(t) {
            var e = PIXI.Sprite.fromFrame("images/hud/autospin_list_selected.png");
            e.x = -e.width / 2 + t.currentTarget.width / 2, e.y = -e.height / 2 + t.currentTarget.height / 2, t.currentTarget.background = t.currentTarget.addChildAt(e, 0)
        }, i.prototype.onLabelOut = function(t) {
            var e = t.currentTarget.background;
            e && e.parent.removeChild(e), t.currentTarget.background = null
        }, i.prototype.getLabel = function(t) {
            return new PIXI.Text(t, {
                fontFamily: "Verdana",
                fontSize: "20px",
                fontWeight: "normal",
                fill: "white"
            })
        }, i.prototype.onSelected = function(t) {
            this.setSelectedItem(t.currentTarget.value)
        }, i.prototype.setSelectedItem = function(t) {
            n.emit("autospin/init", t)
        }, i.prototype.open = function() {
            for (var t = 0; t < this.labels.length; t++)
                this.labels[t].interactive = !0;
            this.isOpen = !0, this.visible = !0, this.startY = this.startY || this.y, TweenMax.to(this, .2, {
                y: this.startY - this.height + 10
            }), this.mask = this.createMask()
        }, i.prototype.createMask = function() {
            var t = new PIXI.Graphics;
            return t.beginFill(), t.drawRect(0, -this.height, this.width, this.height), t.endFill(), t.x = this.x, t.y = this.y, this.parent.addChild(t)
        }, i.prototype.close = function() {
            for (var t = 0; t < this.labels.length; t++)
                this.labels[t].interactive = !1;
            TweenMax.to(this, .2, {
                y: this.startY,
                onComplete: function() {
                    this.isOpen = !1, this.visible = !1, this.parent.removeChild(this.mask), this.mask = null, this.onClose()
                }.bind(this)
            })
        }, i.prototype.toggle = function() {
            this.isOpen ? this.close() : this.open()
        }, i
    }), _d("%(#", ["%@^", "^#", "#", "@^^", "#@%"], function(e, t, n, i, o) {
        "use strict";
        function s(t) {
            e.call(this, t, this.onClick), this.createIcon(), this.switchToAlphaHit()
        }
        return t.extend(s, e), s.prototype.onClick = function() {
            o.allowSkip ? n.emit("initialAnimation/skip", !0) : this.dispatchEvents()
        }, s.prototype.dispatchEvents = function() {
            i.isIdle() && this.dispatchSpinBegin()
        }, s.prototype.dispatchSpinBegin = function() {
            n.emit("spin/begin")
        }, s.prototype.setIconTexture = function(t) {
            this.icon.texture = t
        }, s
    }), _d("%(%", ["^#", "#@", "%($", "#)", "$%", "@", "#@&", "@@", "^&"], function(t, e, n, i, o, s, r, a, h) {
        "use strict";
        function p() {
            n.call(this, e.get("coinValue")), this.setData(i.availableBets), i.on("bet/changed", this.updateBet), this.label.visible = !a.isRewatch(), this.progress.bar.visible = !a.isRewatch(), this.refreshEnabled(), this.updateBet()
        }
        return t.extend(p, n), p.prototype.updateBet = function() {
            this.setSelectedItem(i.bet)
        }, p.prototype.setSelectedIndex = function(t) {
            n.prototype.setSelectedIndex.call(this, t), r.add(r.BET_PANEL_SET_SELECTED_INDEX, this.getSelectedItem()), i.bet = this.getSelectedItem()
        }, p.prototype.refreshEnabled = function() {
            this.setEnabled(this.enabled)
        }, p.prototype.setEnabled = function(t) {
            n.prototype.setEnabled.call(this, t && !s.hasPromoSpin())
        }, p.prototype.getFixedPrecision = function() {
            return 2
        }, p.prototype.getWidth = function() {
            return 115
        }, p.prototype.formatText = function(t) {
            return h.formatStringFloatPrecision(t)
        }, p
    }), _d("%()", ["%(^", "$!", "%&)", "%(&", "%(*", "%(@", "%(%", "%#(", "%^$", "%((", "^#", "@$", "@@", "#", "@^^", "%#%", "#@%", "%^%"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d, f, g, y, m) {
        "use strict";
        function S() {
            t.call(this), this.PADDING = 10, this.textContainer = this.createTextContainer(), this.maxBetButton = this.createMaxBetButton(), this.autoSpinButton = this.createAutoSpinButton(), this.spinButton = this.createSpinButton(), this.linesPanel = this.createLinesPanel(), this.betPanel = this.createBetPanel(), this.betLabel = this.createBetLabel(), this.balanceLabel = this.createBalanceLabel(), this.winLabel = this.createWinLabel(), this.setChildIndex(this.textContainer, this.children.length - 1), d.on("spin/begin", this.onSpinStart, d.PRIORITY_HIGHEST), d.on("spin/forceStop", this.onSpinStart, d.PRIORITY_HIGHEST), d.on("spin/end", this.onSpinStart, d.PRIORITY_HIGHEST), d.on("spin/dataLoaded", this.onSpinDataLoaded), d.on("spin/definiteEnd", this.onSpinEnd), d.on("restore/skip", this.onSpinEnd), d.on("replay/end", this.onReplayEnd), y.on("allowSkip/changed", this.onAllowSkipChanged), c(this.disableButtonsOnReplay, 0)
        }
        return u.extend(S, t), S.prototype.disableButtonsOnReplay = function() {
            l.isReplayMode() && this.setChildrenEnabled([this.spinButton], !1)
        }, S.prototype.setChildrenEnabled = function(t, e) {
            for (var n = 0; n < this.children.length; n++)
                -1 === t.indexOf(this.children[n]) && void 0 !== typeof this.children[n].enabled && (this.children[n].enabled = e)
        }, S.prototype.onSpinStart = function() {
            var t = e.isDuringAutoSpins ? [this.autoSpinButton] : [];
            this.setChildrenEnabled(t, !1)
        }, S.prototype.onAllowSkipChanged = function() {
            y.allowSkip && l.canSkip() && (this.spinButton.enabled = !0)
        }, S.prototype.onSpinDataLoaded = function() {
            l.canStopSpin() && (this.spinButton.enabled = !l.isReplayMode())
        }, S.prototype.onSpinEnd = function() {
            this.setChildrenEnabled([], !0)
        }, S.prototype.onReplayEnd = function() {
            this.setChildrenEnabled([], !1)
        }, S.prototype.createSpinButton = function() {
            var t = new n;
            return t.anchor.set(.5), t.y = -this.getBackgroundVerticalOffset(), this.addChild(t)
        }, S.prototype.createMaxBetButton = function() {
            var t = new i;
            return t.anchor.set(.5), t.x = -180, t.y = -this.getBackgroundVerticalOffset(), this.addChild(t)
        }, S.prototype.createAutoSpinButton = function() {
            var t = new s;
            return t.anchor.set(.5), t.x = 180, t.y = -this.getBackgroundVerticalOffset(), l.isAutoSpinsEnable() && this.addChild(t), t
        }, S.prototype.createBetPanel = function() {
            var t = new r;
            return t.y = -t.getHeight() - this.getPanelsOffset().y, t.x = -545 + this.getPanelsOffset().x, this.textContainer.addLabel(t.title), this.addChild(t)
        }, S.prototype.createLinesPanel = function() {
            var t = new o;
            return t.y = -t.getHeight() - this.getPanelsOffset().y, t.x = -720 + this.getPanelsOffset().x, this.textContainer.addLabel(t.title), this.addChild(t)
        }, S.prototype.createTextContainer = function() {
            var t = new p;
            return this.addChild(t)
        }, S.prototype.createBetLabel = function() {
            var t = new h;
            return t.y = -t.getHeight() - this.getPanelsOffset().y, t.x = -350 + this.getPanelsOffset().x, this.textContainer.addLabel(t.title), this.addChild(t)
        }, S.prototype.createWinLabel = function() {
            var t = new m;
            return t.y = -t.getHeight() - this.getPanelsOffset().y, t.x = 350 - this.getPanelsOffset().x, this.textContainer.addLabel(t.title), this.addChild(t)
        }, S.prototype.createBalanceLabel = function() {
            var t = new a;
            return t.y = -t.getHeight() - this.getPanelsOffset().y, t.x = 570 - this.getPanelsOffset().x, this.textContainer.addLabel(t.title), this.addChild(t)
        }, S.prototype.createFreeSpinsPanel = function() {
            var t = new g;
            t.y = .5 * -t.height, this.freeSpinsPanel = this.addChild(t)
        }, S.prototype.removeFreeSpinsPanel = function() {
            this.removeChild(this.freeSpinsPanel)
        }, S.prototype.getPanelsOffset = function() {
            return {
                x: 0,
                y: 0
            }
        }, S
    }), _d("%(^", ["!", "^#"], function(t, e) {
        "use strict";
        function n() {
            PIXI.Container.call(this), t.bindAll(this), this.backgroundMiddle = this.createBackgroundMiddle(), this.logo = this.createLogo()
        }
        return e.extend(n, PIXI.Container), n.prototype.getBackgroundVerticalOffset = function() {
            return 70
        }, n.prototype.createBackgroundMiddle = function() {
            var t = PIXI.Sprite.fromFrame("images/hud/background.png");
            return t.x = -t.width / 2, t.y = -t.height, this.addChild(t)
        }, n.prototype.createLogo = function() {
            var t = new PIXI.Sprite.fromFrame("images/hud/logo.png");
            return t.anchor.set(.5), t.x = 750, t.y = -this.getBackgroundVerticalOffset(), this.addChild(t)
        }, n.prototype.getWidth = function() {
            return 1610
        }, n.prototype.getHeight = function() {
            return 115
        }, n
    }), _d("%)!", ["%(^", "$!", "%&)", "%(&", "%(*", "%(@", "%(%", "%#(", "%^$", "%((", "^#", "@@", "#", "%@^", "#@"], function(n, t, e, i, o, s, r, a, h, p, u, c, l, d, f) {
        "use strict";
        function g(t, e) {
            n.call(this), e && (this.nextPageButton = this.createNextPageButton(t), this.prevPageButton = this.createPrevPageButton(t)), this.backButton = this.createBackButton(t)
        }
        return u.extend(g, n), g.prototype.createBackButton = function(t) {
            var e = new d("hud/spin_button", this.onBackToGame);
            return e.x = t.spinButton.x, e.y = t.spinButton.y, e.anchor.set(.5, .5), e.createIcon("hud/back_button"), e.tooltip = f.get("tooltip_return_to_game"), this.addChild(e)
        }, g.prototype.onBackToGame = function() {
            l.emit("popup/close")
        }, g.prototype.createNextPageButton = function(t) {
            var e = new d("hud/autospin_button", this.onNextPage);
            return e.x = t.autoSpinButton.x, e.y = t.autoSpinButton.y, e.anchor.set(.5, .5), e.createIcon("hud/next_page_button"), this.addChild(e)
        }, g.prototype.onNextPage = function() {
            l.emit("popup/nextPage")
        }, g.prototype.createPrevPageButton = function(t) {
            var e = new d("hud/max_bet_button", this.onPrevPage);
            return e.x = t.maxBetButton.x, e.y = t.maxBetButton.y, e.anchor.set(.5, .5), e.createIcon("hud/prev_page_button"), this.addChild(e)
        }, g.prototype.onPrevPage = function() {
            l.emit("popup/prevPage")
        }, g
    }), _d("%#&", ["%#^", "^#"], function(n, t) {
        "use strict";
        function e(t, e) {
            n.call(this, t, e)
        }
        return t.extend(e, n), e.prototype.createTitle = function(t) {
            var e = new PIXI.Text(t, this.getLabelStyle());
            return e.anchor.set(.5), this.addChild(e)
        }, e.prototype.createLabel = function() {
            var t = n.prototype.createLabel.apply(this, arguments);
            return t.y = this.getBackgroundOffset() - .5 * t.height, t
        }, e.prototype.getHeight = function() {
            return 100
        }, e
    }), _d("%(*", ["#)@", "%#&", "^#", "#@"], function(t, e, n, i) {
        "use strict";
        function o() {
            e.call(this, i.get("lines"), "panel_value"), this.updateLines()
        }
        return n.extend(o, e), o.prototype.updateLines = function() {
            this.setText(t.lines)
        }, o.prototype.getWidth = function() {
            return 115
        }, o
    }), _d("%(&", ["^#", "%$!", "#)", "#", "@", "#@&", "@*!"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a() {
            e.call(this, "hud/max_bet_button", this.onClickHandler), n.on("bet/changed", this.updateState), i.on("spin/definiteEnd", this.onRefreshEnable, i.PRIORITY_LOW), i.on("restore/skip", this.onRefreshEnable, i.PRIORITY_LOW), this.updateState(), this.createIcon(), this.switchToAlphaHit(), this.onRefreshEnable()
        }
        return t.extend(a, e), a.prototype.createFreeSpinsLeft = function(t) {
            var e = new PIXI.extras.BitmapText(t || "", {
                font: "ui",
                align: "center"
            });
            return e.visible = !1, e.y = -30, this.addChild(e)
        }, a.prototype.onClickHandler = function() {
            s.add(s.MAX_BET_CLICKED), n.setMaxBet()
        }, a.prototype.onRefreshEnable = function() {
            this.enabled = this.enabled && !o.hasPromoSpin()
        }, a.prototype.updateState = function() {
            this.selected = n.isMaxBetSelected()
        }, a
    }), _d("%($", ["!", "^#", "%#&", "%@^", "%)@", "%)#", "#@&"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a(t) {
            n.call(this, t, "panel_value"), this._enabled = !0, this.leftArrow = this.createArrow("value_picker_minus_button", -1), this.rightArrow = this.createArrow("value_picker_plus_button", 1), this.progress = this.createProgress()
        }
        return e.extend(a, n), a.prototype.setData = function(t) {
            this.data = t
        }, a.prototype.getProgressGap = function() {
            return 5
        }, a.prototype.getArrowGap = function() {
            return 3
        }, a.prototype.setSelectedItem = function(t) {
            var e = this.data.indexOf(t);
            0 <= e ? this.setSelectedIndex(e) : this.setText(t)
        }, a.prototype.createArrow = function(t, e) {
            var n = new s("hud/" + t, function() {
                r.add(r.ARROW_CLICKED, e), this.setSelectedIndex(this.selectedIndex + e)
            }.bind(this));
            return (n.disabledElement = n).anchor.set(.5, .5), n.x = e * (.5 * (this.background.width + n.width) + this.getArrowGap()), n.y = this.background.y, this.addChild(n)
        }, a.prototype.setSelectedIndex = function(t) {
            t = Math.max(0, t), t = Math.min(t, this.data.length - 1), this.selectedIndex = t, this.setText(this.getSelectedItem()), this.updateArrows(), this.progress.setProgress(1 < this.data.length ? this.selectedIndex / (this.data.length - 1) : 1)
        }, a.prototype.onProgressChange = function(t) {
            r.add(r.PROGRESS_CHANGED), this.setSelectedIndex(Math.round(t * this.data.length))
        }, a.prototype.getSelectedIndex = function() {
            return this.selectedIndex
        }, a.prototype.getSelectedItem = function() {
            return this.data[this.selectedIndex]
        }, a.prototype.updateArrows = function() {
            this.leftArrow.enabled = 0 < this.selectedIndex && this.enabled, this.rightArrow.enabled = this.selectedIndex < this.data.length - 1 && this.enabled
        }, a.prototype.createProgress = function() {
            var t = new o(this.onProgressChange);
            return t.y = this.background.y + this.getBackgroundOffset() - .5 * t.height + this.getProgressGap(), this.addChild(t)
        }, Object.defineProperty(a.prototype, "enabled", {
            get: function() {
                return this._enabled
            },
            set: function(t) {
                this.setEnabled(t)
            }
        }), a.prototype.setEnabled = function(t) {
            this._enabled = t, this.updateArrows(), this.progress.hitObject.interactive = t
        }, a
    }), _d("%)#", ["%@^", "^#"], function(t, e) {
        "use strict";
        function n() {
            t.apply(this, arguments), this.switchToAlphaHit()
        }
        return e.extend(n, t), n
    }), _d("%)@", ["^#", "!", "@@", "&%", "@@!", "#", "@*!", "#)"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h(t) {
            PIXI.Container.call(this), e.bindAll(this), this.onChange = t, this.MIN_PROGRESS_OFFSET = .2, this.PROGRESS_IMAGE_SCALE_FACTOR = 5, this.MAX_PROGRESS_WIDTH = 165, this.progress = 0, this.drawBar = this.drawBar.bind(this), this.background = this.createBackground(), this.bar = this.createBar(), this.drawBar(), this.hitObject = this.createAlphaHitObject(), s.on("spin/begin", this.onMouseUp)
        }
        return t.extend(h, PIXI.Container), h.prototype.onMouseDown = function(t) {
            n.stage.interactive = !0, n.stage.mousemove = this.onMouseMove, n.stage.mouseup = this.onMouseUp, this.onMouseMove(t)
        }, h.prototype.createAlphaHitObject = function() {
            var t = new PIXI.Container;
            return t.alpha = 0, t.hitArea = new r(this.background, this.getAlphaHitOptions()), t.interactive = !0, t.mousedown = this.onMouseDown, this.addChild(t)
        }, h.prototype.getAlphaHitOptions = function() {
            return {}
        }, h.prototype.onMouseMove = function(t) {
            var e = t.data.getLocalPosition(this, t.global).x + this.background.width / 2 - this.MIN_PROGRESS_OFFSET / 5 * this.background.width,
                n = i.clamp(e / this.background.width, 0, 1);
            this.onChange(n), (1 === n || a.isMaxBetSelected()) && this.onMouseUp()
        }, h.prototype.onMouseUp = function() {
            n.stage.interactive = !1, n.stage.mousemove = null, n.stage.mouseup = null
        }, h.prototype.createBackground = function() {
            var t = PIXI.Sprite.fromFrame("images/hud/progress_bar_background.png");
            return t.anchor.set(.5, .5), this.addChild(t)
        }, h.prototype.createBar = function() {
            var t = new o("images/hud/progress_bar.png", new PIXI.Rectangle(.2, .2, .2, .2));
            return t.anchor.set(0, .5), t.x = -this.MAX_PROGRESS_WIDTH / 2, this.addChild(t)
        }, h.prototype.setProgress = function(t) {
            TweenMax.to(this, .15, {
                progress: t,
                onUpdate: this.drawBar
            })
        }, h.prototype.drawBar = function() {
            var t = (this.MIN_PROGRESS_OFFSET + (1 - this.MIN_PROGRESS_OFFSET) * this.progress) * this.PROGRESS_IMAGE_SCALE_FACTOR;
            this.bar.width = t / 5 * this.MAX_PROGRESS_WIDTH
        }, h
    }), _d("%&)", ["%(#", "^#", "#", "@^^", "$!", "#@", "@@"], function(e, t, n, i, o, s, r) {
        "use strict";
        function a(t) {
            e.call(this, t || "hud/spin_button"), this.resetTooltipText(), this.iconTexture = PIXI.Texture.fromFrame("images/hud/spin_button_icon.png"), this.stopIconTexture = r.canSkip() ? PIXI.Texture.fromFrame("images/hud/stop_spin_icon.png") : this.iconTexture, n.on("spin/dataLoaded", this.onSpinDataLoaded, n.PRIORITY_LOW), n.on("spin/end", this.onSpinEnd, -1), n.on("spin/definiteEnd", this.onSpinEnd, -1)
        }
        return t.extend(a, e), a.prototype.dispatchEvents = function() {
            i.isIdle() ? this.dispatchSpinBegin() : this.dispatchForceStop()
        }, a.prototype.dispatchForceStop = function() {
            i.isForceStopping() || n.emit("spin/forceStop")
        }, a.prototype.onSpinDataLoaded = function() {
            r.canStopSpin() && this.setStopIcon()
        }, a.prototype.setStopIcon = function() {
            this.tooltip = s.get("tooltip_spin_button_stop"), this.setIconTexture(this.stopIconTexture)
        }, a.prototype.onSpinEnd = function() {
            o.isDuringAutoSpins || (this.resetTooltipText(), this.setIconTexture(this.iconTexture))
        }, a.prototype.resetTooltipText = function() {
            this.tooltip = r.isReplayMode() ? s.get("game_history_watch") : s.get("tooltip_spin_button")
        }, a.prototype.simulateClick = function() {
            this.enabled && this.visible && this.onClick()
        }, a
    }), _d("%((", ["^#", "!", "#", "$*"], function(t, e, n, i) {
        "use strict";
        function o() {
            PIXI.Container.call(this), e.bindAll(this), this.labels = [], n.once("game/update", this.swapAll), i.on("showCurrency/changed", this.refresh)
        }
        return t.extend(o, PIXI.Container), o.prototype.refresh = function() {
            this.cacheAsBitmap = !1, this.cacheAsBitmap = !0
        }, o.prototype.swapAll = function() {
            for (var t = 0; t < this.labels.length; t++)
                this.swapLabel(this.labels[t]);
            this.refresh()
        }, o.prototype.addLabel = function(t) {
            this.labels.push(t), t.visible = !1
        }, o.prototype.swapLabel = function(t) {
            t.visible = !0;
            for (var e = t.parent; e !== this.parent;)
                t.x += e.x, t.y += e.y, e = e.parent;
            t.parent.removeChild(t), this.addChild(t)
        }, o
    }), _d("%^%", ["#@", "@@", "^#", "%#^", "%#&", "%#*", "#", "@(*", "$*", "%!)", "^!", "*"], function(e, n, t, i, o, s, r, a, h, p, u, c) {
        "use strict";
        function l() {
            var t = n.showMobileUI ? "win" : e.get("win");
            i.call(this, t, "panel_value"), this.label.alpha = 0, this.interactive = !0, this.tap = this.click = h.toggle, this.value = 0, this.timeline = new TimelineMax, h.on("showCurrency/changed", this.refreshValue), c.on("totalBet/changed", this.onTotalBetChanged), r.on("lastWin/changed", this.onLastWinChanged), this.refreshValue(), r.on("flyingBalance/show", this.showFlyingBalance), r.on("orientation/changed", this.removeFlyingBalance, r.PRIORITY_HIGHEST)
        }
        return t.extend(l, n.showMobileUI ? s : o), l.prototype.onTotalBetChanged = function() {
            this.value = 0, this.refreshValue()
        }, l.prototype.refreshValue = function() {
            this.labelTween && (this.labelTween.kill(), this.labelTween = null), 0 < this.value ? (this.setText(h.formatMoney(this.value)), this.label.alpha = 1) : this.labelTween = TweenMax.to(this.label, .2, {
                alpha: 0
            })
        }, l.prototype.onLastWinChanged = function(t, e, n) {
            this.timeline.to(this, e ? .25 : 0, {
                value: t,
                delay: n,
                onUpdate: this.refreshValue
            })
        }, l.prototype.getWidth = function() {
            return n.showMobileUI ? 350 : 150
        }, l.prototype.showFlyingBalance = function() {
            var t = new p(this.getFlyingBalanceOptions()),
                e = new PIXI.extras.BitmapText(h.formatMoney(a.lastWin), {
                    font: "ui"
                });
            this.flyingBalance = this.addChild(e), this.flyingBalance.interactiveChildren = !1, this.flyingBalance.position = this.label.position, this.flyingBalance.scale = this.label.scale, t.runWithLabel(this.flyingBalance, this.removeFlyingBalance)
        }, l.prototype.removeFlyingBalance = function() {
            this.flyingBalance && (this.removeChild(this.flyingBalance), this.flyingBalance = null)
        }, l.prototype.getFlyingBalanceOptions = function() {
            return n.showMobileUI ? u.isPortraitMode() ? {
                x: -200,
                y: -80,
                reverse: !0
            } : {
                x: 500,
                y: 10
            } : {
                x: 230,
                y: 10
            }
        }, l
    }), _d("%&!", ["%^%", "^#", "@@", "$)!", "^!", "#"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            t.call(this)
        }
        return e.extend(r, t), r.prototype.getFlyingBalanceOptions = function() {
            return n.showMobileUI ? {
                x: 350,
                y: 10
            } : {
                x: 230,
                y: 10
            }
        }, r.prototype.layout = function() {
            i.layout.call(this)
        }, r.prototype.autoScale = function(t) {
            i.autoScale.call(this, t)
        }, r.prototype.removeFlyingBalance = function() {
            s.emit("flyingBalance/removed"), t.prototype.removeFlyingBalance.call(this)
        }, r
    }), _d("%^^", ["@@", "#!%"], function(o, t) {
        function e(t) {
            this.hud = t
        }
        return e.prototype.refresh = function() {
            this.resizeLabels(this.hud), this.updateLabels(this.hud), this.updateBackground(this.hud)
        }, e.prototype.resizeLabels = function(t) {
            t.balanceLabel.background.width = t.balanceLabel.getWidth(), t.betLabel.background.width = t.betLabel.getWidth(), t.winLabel.background.width = t.winLabel.getWidth(), this.hasFeatureLayout() && (t.balanceLabel.background.width = t.betLabel.background.width), t.balanceLabel.layout(), t.betLabel.layout(), t.winLabel.layout()
        }, e.prototype.updateLabels = function(t) {
            for (var e = [t.betLabel, t.winLabel, t.balanceLabel], n = 0, i = 0; i < e.length; ++i)
                e[i].visible = !0, e[i].x = n, e[i].y = 0, n += e[i].background.width + this.getGap();
            t.container.x = .5 * -t.container.width, t.container.y = -t.getHeight() / 2 * .88, o.game.root && this.hasFeatureLayout() && (t.winLabel.visible = !1)
        }, e.prototype.hasFeatureLayout = function() {
            return o.game.root.freeSpinsPanel
        }, e.prototype.getGap = function() {
            return t.hasFreeSpins() ? 250 : 130
        }, e.prototype.updateBackground = function(t) {
            t.background.width = Math.ceil(o.renderer.width / t.scale.x + 1), t.background.x = -t.background.width / 2, t.background.y = -t.background.height
        }, e
    }), _d("%^(", ["@@", "#!%", "^!", "%)$", "("], function(o, t, e, s, n) {
        function i(t) {
            this.hud = t
        }
        return i.prototype.refresh = function() {
            this.updateLabels(this.hud)
        }, i.prototype.updateLabels = function(t) {
            for (var e = [t.betLabel, t.winLabel, t.balanceLabel], n = this.getLabelsSizes(), i = this.getAvailableWidth(), o = 0, s = 0; s < e.length; ++s) {
                var r = e[s];
                r.background.width = i * n[s], r.layout(), r.visible = !0, r.x = o, r.y = 0, o += i * n[s] + this.getGap()
            }
            t.container.x = .5 * -t.container.width, t.container.y = .5 * -t.getHeight(), this.hasFeatureLayout() && this.applyFeatureLayout(t)
        }, i.prototype.getLabelsSizes = function() {
            return this.hasFeatureLayout() ? [.25, .25, .4] : [.35, .35, .5]
        }, i.prototype.getAvailableWidth = function() {
            var t = 4 * this.getGap(),
                e = s.PORTRAIT_DEFAULT_WIDTH - t,
                n = this.getLabelsOffset(),
                i = o.renderer.width - t - n;
            return Math.min(i, e)
        }, i.prototype.getLabelsOffset = function() {
            return 2 * n.root.burgerMenuButton.width + 30
        }, i.prototype.applyFeatureLayout = function(t) {
            var e = -220 * this.hud.scale.x,
                n = 140 * this.hud.scale.x;
            t.betLabel.x += e, t.winLabel.x += e, t.balanceLabel.x += n
        }, i.prototype.hasFeatureLayout = function() {
            return o.game.root && !!o.game.root.freeSpinsPanel
        }, i.prototype.getGap = function() {
            return this.hasFeatureLayout() ? 5 : 10
        }, i
    }), _d("%^&", ["%^^", "^#", "@@", "("], function(e, t, n, i) {
        function o(t) {
            e.call(this, t), this.BUTTONS_VERTICAL_GAP = 5, this.BUTTONS_HORIZONTAL_GAP = 10
        }
        return t.extend(o, e), o.prototype.refresh = function() {
            this.resizeLabels(this.hud), this.updateBalanceLabel(this.hud), this.updateBackground(this.hud), this.updateHUDContainer(this.hud)
        }, o.prototype.updateHUDContainer = function(t) {
            t.container.x = .5 * -t.container.width, t.container.y = 5
        }, o.prototype.updateBalanceLabel = function(t) {
            t.balanceLabel.x = 0, t.balanceLabel.y = 0, i.root.promoPanel && (t.balanceLabel.scale.y = t.betLabel.scale.y = t.winLabel.scale.y = .9, t.balanceLabel.scale.x = t.betLabel.scale.x = t.winLabel.scale.x = .9, t.balanceLabel.y = 20), t.betLabel.x = 0, t.betLabel.y = t.balanceLabel.y + t.betLabel.height + this.BUTTONS_VERTICAL_GAP, t.winLabel.x = t.balanceLabel.width - t.winLabel.width, t.winLabel.y = t.balanceLabel.y + t.betLabel.height + this.BUTTONS_VERTICAL_GAP
        }, o.prototype.updateBackground = function(t) {
            t.background.width = Math.ceil(n.renderer.width / t.scale.x + 1), t.background.x = -t.background.width / 2, t.background.y = 0
        }, o.prototype.resizeLabels = function(t) {
            var e = .9 * n.renderer.width;
            t.balanceLabel.background.width = e, t.betLabel.background.width = (e - this.BUTTONS_HORIZONTAL_GAP) / 2, t.winLabel.background.width = t.betLabel.background.width, t.balanceLabel.layout(), t.betLabel.layout(), t.winLabel.layout(), t.winLabel.visible = !0
        }, o
    }), _d("%^)", ["%^(", "^#", "@@", "%)$"], function(e, t, n, r) {
        function i(t) {
            e.call(this, t)
        }
        return t.extend(i, e), i.prototype.updateLabels = function(t) {
            for (var e = [t.betLabel, t.winLabel, t.balanceLabel], n = [.25, .25, .5], i = r.PORTRAIT_DEFAULT_WIDTH - 4 * this.getGap(), o = 0, s = 0; s < e.length; ++s)
                e[s].background.width = i * n[s], e[s].layout(), e[s].visible = !0, e[s].x = o, e[s].y = 0, o += i * n[s] + this.getGap();
            t.container.x = .5 * -t.container.width, t.container.y = .5 * -t.getHeight()
        }, i.prototype.getGap = function() {
            return 5
        }, i
    }), _d("%)$", [], function() {
        "use strict";
        return {
            LANDSCAPE_DEFAULT_WIDTH: 1335,
            LANDSCAPE_DEFAULT_HEIGHT: 750,
            PORTRAIT_DEFAULT_HEIGHT: 1335,
            PORTRAIT_DEFAULT_WIDTH: 750,
            PORTRAIT_MACHINE_OFFSET: 0,
            PORTRAIT_HUD_OFFSET: 0,
            PORTRAIT_SPIN_PANEL_OFFSET: 0
        }
    }), _d("%)^", ["@@", "%)%", "^#", "#!(", "@$"], function(o, s, t, e, n) {
        "use strict";
        function i(t) {
            s.call(this, t)
        }
        return t.extend(i, s), i.prototype.updateHUDPosition = function(t) {
            s.prototype.updateHUDPosition.call(this, t);
            var e = t.hud.getHeight() * this.getHudScale(t, !1),
                n = t.promoPanel ? t.promoPanel.getHeight(!0) * t.hud.scale.y * this.getPromoScaleFactor() : 0,
                i = e + this.getHUDVerticalPadding() + n / 2;
            t.hud.y = .5 * (o.renderer.height - e) + t.machine.getHeight() * this.getHudScale(t, !0) * .5 + i
        }, i.prototype.getHUDVerticalPadding = function() {
            return 0
        }, i.prototype.updateClock = function(t) {
            t.clock.scale.set(.5, .5), s.prototype.updateClock.call(this, t), t.clock.visible = !1, n(this.updateClockVisibility, .5, t)
        }, i.prototype.updateClockVisibility = function(t) {
            t.clock.visible = e.isFullscreenModeEntered() || e.isBrowserOccupyingScreenWidth() || o.shouldClockBeAlwaysVisible()
        }, i.prototype.updateGameName = function(t) {
            t.gameName.scale.set(.5, .5), s.prototype.updateGameName.call(this, t)
        }, i
    }), _d("%)&", ["^#", "%)%", "@@", "@^^", "$!", "#!%", ")"], function(t, n, i, e, o, s, r) {
        "use strict";
        function a(t) {
            n.call(this, t)
        }
        return t.extend(a, n), a.prototype.refresh = function() {
            n.prototype.refresh.call(this), this.setBodyOrientationClass(), this.updateSpinPanelPosition(this.root), this.updateStopAutoSpinPanelPosition(this.root), this.updateSwipeMenuPosition(this.root), this.updateOptionsMenuPosition(this.root), this.updateFreeSpinsPanel(this.root)
        }, a.prototype.updateHUDLayout = function(t) {
            t.hud.layoutLandscape()
        }, a.prototype.updateSpinPanelPosition = function(t) {
            t.spinPanel.layoutLandscape(), t.spinPanel.scale.x = Math.min(this.getSpinPanelScale(t), 1), t.spinPanel.scale.y = Math.min(this.getSpinPanelScale(t), 1), t.spinPanel.x = i.renderer.width - t.spinPanel.scale.x * t.spinPanel.spinButton.width / 2 - 0, t.spinPanel.y = t.machine.y, t.spinPanel.visible = e.isIdle()
        }, a.prototype.getSpinPanelScale = function(t) {
            return t.machine.scale.x
        }, a.prototype.updateStopAutoSpinPanelPosition = function(t) {
            t.stopAutoSpinPanel && (t.stopAutoSpinPanel.scale.x = 1.2 * t.machine.scale.x, t.stopAutoSpinPanel.scale.y = 1.2 * t.machine.scale.y, t.stopAutoSpinPanel.x = i.renderer.width - .2 * t.stopAutoSpinPanel.width, t.stopAutoSpinPanel.y = t.machine.y, t.stopAutoSpinPanel.visible = o.isDuringAutoSpins && !s.isDuringFreeSpins)
        }, a.prototype.updateSwipeMenuPosition = function(t) {
            t.swipeMenu.layoutLandscape(), t.swipeMenu.isOpen ? t.swipeMenu.position.x = i.renderer.width : (t.swipeMenu.position.x = i.renderer.width, t.swipeMenu.position.y = 0)
        }, a.prototype.updateOptionsMenuPosition = function(t) {
            t.optionsMenu.layoutLandscape(), n.prototype.updateOptionsMenuPosition.call(this, t)
        }, a.prototype.showSwipeMenu = function(t) {
            TweenMax.to(this.root, .3, {
                x: -this.root.swipeMenu.getLandscapeWidth(),
                onComplete: t
            })
        }, a.prototype.hideSwipeMenu = function(t) {
            TweenMax.to(this.root, .3, {
                x: 0,
                onComplete: t
            })
        }, a.prototype.updateClock = function(t) {
            n.prototype.updateClock.call(this, t), t.clock.visible = !0
        }, a.prototype.updateFreeSpinsPanel = function(t) {
            if (t.freeSpinsPanel) {
                var e = t.hud.scale;
                t.freeSpinsPanel.layoutLandscape(), t.freeSpinsPanel.scale.set(.8 * e.x, .8 * e.y), t.freeSpinsPanel.x = .5 * i.renderer.width, t.freeSpinsPanel.y = i.renderer.height - .5 * t.freeSpinsPanel.height
            }
        }, a.prototype.updatePromoPanel = function(t) {
            if (n.prototype.updatePromoPanel.call(this, t), t.promoPanel) {
                var e = this.getHudScale(t, !1) * this.getPromoScaleFactor();
                t.promoPanel.scale.set(e, e)
            }
        }, a.prototype.getPromoScaleFactor = function() {
            return this.root.promoButton ? 1 : 1.25
        }, a.prototype.setBodyOrientationClass = function() {
            r.removeClass(document.body, "portrait")
        }, a
    }), _d("%)*", ["^#", "%)%", "@@", "%)$", "$!", "#!%", ")", "@^^", "^!", "#", "@$"], function(t, n, i, e, o, s, r, a, h, p, u) {
        "use strict";
        function c(t) {
            n.call(this, t)
        }
        return t.extend(c, n), c.prototype.refresh = function() {
            TweenMax.killTweensOf(this.root), this.refreshRoot(), n.prototype.refresh.call(this), this.setBodyOrientationClass(), this.updateSpinPanelPosition(this.root), this.updateBurgerMenuButton(this.root), this.updateStopAutoSpinPanelPosition(this.root), this.updateFreeSpinsPanel(this.root), this.updateSideMenus(this.root), this.updateHUDPosition(this.root)
        }, c.prototype.setBodyOrientationClass = function() {
            r.removeClass(document.body, "portrait")
        }, c.prototype.updateHUDLayout = function(t) {
            t.hud.scale.set(1, 1), t.hud.layoutLandscape()
        }, c.prototype.updateClock = function(t) {
            n.prototype.updateClock.call(this, t), t.clock.visible = !0
        }, c.prototype.updatePromoPanel = function(t) {
            if (n.prototype.updatePromoPanel.call(this, t), t.promoPanel) {
                var e = this.getHudScale(t, !1) * this.getPromoScaleFactor();
                t.promoPanel.scale.set(e, e)
            }
        }, c.prototype.getPromoScaleFactor = function() {
            return 1.25
        }, c.prototype.updateSpinPanelPosition = function(t) {
            t.spinPanel.layoutLandscape(), t.spinPanel.scale.x = Math.min(this.getSpinPanelScale(t), 1), t.spinPanel.scale.y = Math.min(this.getSpinPanelScale(t), 1), t.spinPanel.x = i.renderer.width - t.spinPanel.scale.x * t.spinPanel.spinButton.width * .5, t.spinPanel.y = t.machine.y, t.spinPanel.visible = a.isIdle()
        }, c.prototype.getSpinPanelScale = function() {
            return i.renderer.height / e.LANDSCAPE_DEFAULT_HEIGHT
        }, c.prototype.updateStopAutoSpinPanelPosition = function(t) {
            t.stopAutoSpinPanel.scale = t.spinPanel.scale, t.stopAutoSpinPanel.position = t.spinPanel.position, t.stopAutoSpinPanel.visible = o.isDuringAutoSpins && !s.isDuringFreeSpins
        }, c.prototype.updateBurgerMenuButton = function(t) {
            t.burgerMenuButton.scale = t.spinPanel.scale, t.burgerMenuButton.x = i.renderer.width - .8 * t.burgerMenuButton.width, t.burgerMenuButton.y = i.renderer.height - .8 * t.burgerMenuButton.height, h.isIPhone5() && (t.burgerMenuButton.y = i.renderer.height - 1.7 * t.burgerMenuButton.height)
        }, c.prototype.updateSideMenus = function(t) {
            t.autoSpinMenu.refresh(), t.betMenu.refresh()
        }, c.prototype.onSwipeMenuOpened = function(t) {
            TweenMax.killTweensOf(this.root);
            var e = i.renderer.height - this.root.hud.y + .5 * this.root.EXTRA_SHIFT_OFFSET,
                n = i.renderer.height - (t + e);
            this.root.currentShift = Math.max(0, i.renderer.height - t), TweenMax.to(this.root, .3, {
                y: -n
            })
        }, c.prototype.onSwipeMenuClosed = function() {
            TweenMax.killTweensOf(this.root), this.root.currentShift = 0, TweenMax.to(this.root, .3, {
                y: 0
            })
        }, c.prototype.refreshRoot = function() {
            0 === this.root.currentShift && (this.root.y = this.root.currentShift)
        }, c.prototype.updateFreeSpinsPanel = function(t) {
            if (t.freeSpinsPanel) {
                var e = t.hud.scale;
                t.freeSpinsPanel.layoutLandscape(), t.freeSpinsPanel.scale.set(.8 * e.x, .8 * e.y), t.freeSpinsPanel.x = .5 * i.renderer.width, t.freeSpinsPanel.y = i.renderer.height - .5 * t.freeSpinsPanel.height
            }
        }, c
    }), _d("%)%", ["@@", "&"], function(i, o) {
        "use strict";
        function t(t) {
            this.root = t
        }
        return t.prototype.refresh = function() {
            this.updatePromoPanel(this.root), this.updateHUDPosition(this.root), this.updateOptionsMenuPosition(this.root), this.updateMachinePosition(this.root), this.updateReplaySummary(this.root), this.updateBonusGameLayer(this.root), this.updateWinEffectLayerPositionAndScale(this.root), this.updateClock(this.root), this.updateSpinner(this.root), this.updateForeground(this.root), this.updateGameName(this.root), this.updatePromoButton(this.root)
        }, t.prototype.updateHUDLayout = function(t) {}, t.prototype.getHudScale = function(t, e) {
            var n = t.machine.getHeight();
            return e && t.promoPanel && (n += t.promoPanel.getHeight() * this.getPromoScaleFactor()), Math.min(i.renderer.height / (n + t.hud.getHeight()), i.renderer.width / t.hud.getWidth())
        }, t.prototype.updateHUDPosition = function(t) {
            var e = this.getHudScale(t, !1);
            t.hud.scale.set(e, e), this.updateHUDLayout(t), t.hud.x = Math.round(i.renderer.width / 2), t.hud.y = Math.ceil(i.renderer.height)
        }, t.prototype.updateOptionsMenuPosition = function(t) {
            t.optionsMenu && (t.optionsMenu.scale.x = Math.min(t.hud.scale.x, 1), t.optionsMenu.scale.y = Math.min(t.hud.scale.y, 1), t.optionsMenu.y = t.hud.y - t.hud.getHeight() * t.hud.scale.y - .9 * t.optionsMenu.height, t.optionsMenu.x = t.hud.x - i.renderer.width / 2 + 10)
        }, t.prototype.updateClock = function(t) {
            t.clock.visible = !0, t.clock.x = i.renderer.width - t.clock.width - 5, t.clock.y = 5
        }, t.prototype.updateMachinePosition = function(t) {
            var e = this.getHudScale(t, !0) * t.hud.getWidth() / t.machine.getWidth(),
                n = t.promoPanel ? t.promoPanel.getHeight(!0) * t.hud.scale.y * this.getPromoScaleFactor() : 0;
            t.machine.scale.set(e, e), t.machine.x = i.renderer.width / 2 | 0, t.machine.y = (i.renderer.height - t.hud.getHeight() * t.hud.scale.y + n) / 2 | 0
        }, t.prototype.updateReplaySummary = function(t) {
            t.replaySummary && (t.replaySummary.scale.x = t.machine.scale.x, t.replaySummary.scale.y = t.machine.scale.y, t.replaySummary.x = t.machine.x, t.replaySummary.y = t.machine.y)
        }, t.prototype.updateBonusGameLayer = function(t) {
            t.bonusGameLayer.position = t.machine.position, t.bonusGameLayer.scale = t.machine.scale
        }, t.prototype.updateSpinner = function(t) {
            t.spinner && (t.spinner.x = i.renderer.width / 2, t.spinner.y = i.renderer.height / 2, t.spinner.scale = t.hud.scale)
        }, t.prototype.updateWinEffectLayerPositionAndScale = function(t) {
            t.winEffectLayer && (t.winEffectLayer.x = t.machine.x, t.winEffectLayer.y = t.machine.y, t.winEffectLayer.scale.x = t.machine.scale.x, t.winEffectLayer.scale.y = t.machine.scale.y)
        }, t.prototype.updateForeground = function(t) {
            t.foreground.scale = t.machine.scale, t.foreground.x = t.machine.position.x, t.foreground.y = t.machine.position.y
        }, t.prototype.updatePromoPanel = function(t) {
            if (t.promoPanel) {
                var e = this.getHudScale(t, !1);
                t.promoPanel.scale.set(e, e), t.promoPanel.x = i.renderer.width / 2 | 0, t.promoPanel.y = 0
            }
        }, t.prototype.updatePromoButton = function(t) {
            if (t.promoButton) {
                var e = o.hasActiveCampaign() ? -90 : 0,
                    n = this.getHudScale(t, !1) * this.getPromoScaleFactor();
                t.promoButton.scale.set(n, n), t.promoButton.rotation = .5 * Math.PI, t.promoButton.x = .5 * t.promoButton.height, t.promoButton.y = t.machine.y + e
            }
        }, t.prototype.getPromoScaleFactor = function() {
            return 1
        }, t.prototype.updateGameName = function(t) {
            t.gameName.x = .5 * t.gameName.width + 5, t.gameName.y = .5 * t.gameName.height + 5
        }, t
    }), _d("%)(", ["%)&", "^#", "@@", "#!%", ")", "#!(", "^!"], function(e, t, n, i, o, s, r) {
        "use strict";
        function a(t) {
            e.call(this, t)
        }
        return t.extend(a, e), a.prototype.refresh = function() {
            TweenMax.killTweensOf(this.root), this.root.x = 0, this.root.y = 0, e.prototype.refresh.call(this)
        }, a.prototype.updateHUDPosition = function(t) {
            var e = Math.min(this.getScale(), .85);
            t.hud.scale.set(e, e), t.hud.layoutPortrait(), t.hud.x = .5 * n.renderer.width, t.hud.y = t.promoPanel && t.promoPanel.isNewBoostTopPanel ? t.promoPanel.getHeight() : .3 * t.hud.height
        }, a.prototype.updateStopAutoSpinPanelPosition = function(t) {
            t.stopAutoSpinPanel && (t.stopAutoSpinPanel.visible = !1)
        }, a.prototype.updateMachinePosition = function(t) {
            var e = n.renderer.width / t.machine.getMobileWidth();
            t.machine.scale.set(e, e), t.machine.x = n.renderer.width / 2 | 0, t.machine.y = Math.max(.43 * n.renderer.height, 190 / this.getScale())
        }, a.prototype.getScale = function() {
            return r.isTopFrame() ? Math.min(n.renderer.height / 1200, 1) : Math.min(n.renderer.height / 1600, 1)
        }, a.prototype.updateSpinPanelPosition = function(t) {
            TweenMax.killTweensOf(t.spinPanel), t.spinPanel.layoutPortrait();
            var e = .95 * Math.min(this.getScale(), .95);
            t.spinPanel.scale.x = e, t.spinPanel.scale.y = e, t.spinPanel.x = .5 * n.renderer.width, t.spinPanel.y = this.getSpinPanelYPosition(t), t.spinPanel.visible = !i.isDuringFreeSpins
        }, a.prototype.getSpinPanelYPosition = function(t) {
            var e = t.swipeMenu.isOpen ? this.getSwipeMenuOffset() : 0;
            return .75 * n.renderer.height + e
        }, a.prototype.updateOptionsMenuPosition = function(t) {
            t.optionsMenu.layoutPortrait();
            var e = .9 * Math.min(this.getScale(), 1);
            t.optionsMenu.scale.set(e, e), t.optionsMenu.width > n.renderer.width && (t.optionsMenu.width = n.renderer.width, t.optionsMenu.scale.y = t.optionsMenu.scale.x), t.optionsMenu.x = .5 * (n.renderer.width - t.optionsMenu.width), t.optionsMenu.y = n.renderer.height - t.optionsMenu.height
        }, a.prototype.updateSwipeMenuPosition = function(t) {
            t.swipeMenu.layoutPortrait(), t.swipeMenu.isOpen ? t.swipeMenu.position.y = n.renderer.height - t.swipeMenu.getPortraitHeight() : (t.swipeMenu.position.x = 0, t.swipeMenu.position.y = n.renderer.height)
        }, a.prototype.showSwipeMenu = function(t) {
            var e = this.getSwipeMenuPosition();
            TweenMax.to(this.root.spinPanel, .3, {
                y: e
            }), TweenMax.to(this.root.swipeMenu, .3, {
                y: n.renderer.height - this.root.swipeMenu.getPortraitHeight(),
                onComplete: t
            })
        }, a.prototype.getSwipeMenuPosition = function() {
            return this.root.spinPanel.y + this.getSwipeMenuOffset()
        }, a.prototype.getSwipeMenuOffset = function() {
            return -this.root.swipeMenu.getPortraitHeight() + 160 * this.getScale()
        }, a.prototype.hideSwipeMenu = function(t, e) {
            TweenMax.to(this.root.spinPanel, .3, {
                y: this.getSpinPanelYPosition(e)
            }), TweenMax.to(this.root.swipeMenu, .3, {
                y: n.renderer.height,
                onComplete: t
            })
        }, a.prototype.updateClock = function(t) {
            e.prototype.updateClock.call(this, t), t.clock.visible = s.isFullscreenModeEntered() || n.shouldClockBeAlwaysVisible()
        }, a.prototype.updateFreeSpinsPanel = function(t) {
            if (t.freeSpinsPanel) {
                var e = n.renderer.width / (t.freeSpinsPanel.width / t.freeSpinsPanel.scale.x);
                t.freeSpinsPanel.scale.set(e), t.freeSpinsPanel.layoutPortrait(), t.freeSpinsPanel.x = .5 * n.renderer.width, t.freeSpinsPanel.y = this.getSpinPanelYPosition(t)
            }
        }, a.prototype.updatePromoPanel = function(t) {
            e.prototype.updatePromoPanel.call(this, t), t.promoPanel && t.promoPanel.scale.set(.75, .75)
        }, a.prototype.updatePromoButton = function(t) {
            e.prototype.updatePromoButton.call(this, t), t.promoButton && (t.promoButton.y = t.machine.y, t.promoButton.scale.set(.5, .5))
        }, a.prototype.setBodyOrientationClass = function() {
            o.addClass(document.body, "portrait")
        }, a.prototype.updateGameName = function(t) {
            t.gameName.x = .5 * n.renderer.width, t.gameName.y = .5 * t.gameName.height
        }, a
    }), _d("%))", ["%)*", "%)$", "#!(", ")", "^#", "@@", "#!%", "$!", "@^^"], function(e, n, i, t, o, s, r, a, h) {
        "use strict";
        function p(t) {
            e.call(this, t)
        }
        return o.extend(p, e), p.prototype.refresh = function() {
            TweenMax.killTweensOf(this.root), this.updatePortraitMachinePosition(this.root), e.prototype.refresh.call(this)
        }, p.prototype.updatePortraitMachinePosition = function(t) {
            var e = s.renderer.width / t.machine.getMobileWidth();
            t.machine.scale.set(e, e), t.machine.x = s.renderer.width / 2 | 0, t.machine.y = .5 * s.renderer.height + this.getMachineOffset()
        }, p.prototype.getMachineOffset = function() {
            return n.PORTRAIT_MACHINE_OFFSET * s.renderer.height / n.LANDSCAPE_DEFAULT_HEIGHT
        }, p.prototype.updateHUDPosition = function(t) {
            t.hud.layoutPortrait();
            var e = s.renderer.width / n.PORTRAIT_DEFAULT_WIDTH;
            t.hud.scale.set(e, e), t.hud.x = .5 * s.renderer.width, t.hud.y = t.machine.y + .5 * t.machine.getHeight() + this.getHudOffset()
        }, p.prototype.getHudOffset = function() {
            return n.PORTRAIT_HUD_OFFSET * s.renderer.height / n.LANDSCAPE_DEFAULT_HEIGHT
        }, p.prototype.updateMachinePosition = function(t) {}, p.prototype.updateSpinPanelPosition = function(t) {
            t.spinPanel.layoutPortrait();
            var e = this.getSpinPanelScale();
            t.spinPanel.scale.set(e, e), t.spinPanel.x = .5 * s.renderer.width, t.spinPanel.y = t.hud.y + .5 * (s.renderer.height - t.hud.y) + this.getSpinPanelOffset(), t.spinPanel.visible = h.isIdle()
        }, p.prototype.getSpinPanelOffset = function() {
            return n.PORTRAIT_SPIN_PANEL_OFFSET * s.renderer.height / n.LANDSCAPE_DEFAULT_HEIGHT
        }, p.prototype.getSpinPanelScale = function() {
            return s.renderer.width / n.PORTRAIT_DEFAULT_WIDTH * .9
        }, p.prototype.updateClock = function(t) {
            e.prototype.updateClock.call(this, t), t.clock.visible = i.isFullscreenModeEntered() || s.shouldClockBeAlwaysVisible()
        }, p.prototype.updatePromoPanel = function(t) {
            e.prototype.updatePromoPanel.call(this, t), t.promoPanel && t.promoPanel.scale.set(.75, .75)
        }, p.prototype.setBodyOrientationClass = function() {
            t.addClass(document.body, "portrait")
        }, p.prototype.updateGameName = function(t) {
            t.gameName.x = .5 * s.renderer.width, t.gameName.y = .5 * t.gameName.height
        }, p.prototype.updateFreeSpinsPanel = function(t) {
            t.freeSpinsPanel && (t.freeSpinsPanel.scale.set(t.hud.scale.x), t.freeSpinsPanel.layoutPortrait(), t.freeSpinsPanel.x = .5 * s.renderer.width, t.freeSpinsPanel.y = t.spinPanel.y)
        }, p.prototype.updateBurgerMenuButton = function(t) {
            t.burgerMenuButton.scale = t.spinPanel.scale, t.burgerMenuButton.x = s.renderer.width - .8 * t.burgerMenuButton.width, t.burgerMenuButton.y = s.renderer.height - 1.2 * t.burgerMenuButton.height
        }, p
    }), _d("$$^", [], function() {
        "use strict";
        function t() {}
        return t.prototype.getLandscapeElementsSize = function() {
            return {
                baseScreen: {
                    width: 1680,
                    height: 945
                },
                gameLogo: {
                    width: 544,
                    height: 182.75
                },
                screen1: {
                    width: 740,
                    height: 416
                },
                screen2: {
                    width: 740,
                    height: 416
                },
                middleText: {
                    width: 1612.8,
                    height: 80
                },
                screenText1: {
                    width: 590,
                    height: 580
                },
                screenText2: {
                    width: 590,
                    height: 580
                },
                continueAnimation: {
                    width: 620,
                    height: 115
                }
            }
        }, t.prototype.getPortraitElementsSize = function() {
            return {
                baseScreen: {
                    width: 945,
                    height: 1680
                },
                background: {
                    width: 1680,
                    height: 945
                },
                gameLogo: {
                    width: 544,
                    height: 182.75
                },
                middleText: {
                    width: 945 * .96,
                    height: 80
                },
                screen1: {
                    width: 840,
                    height: 472
                },
                screenText1: {
                    width: 840,
                    height: 145
                },
                screen2: {
                    width: 840,
                    height: 472
                },
                screenText2: {
                    width: 840,
                    height: 145
                },
                continueAnimation: {
                    width: 620,
                    height: 115
                }
            }
        }, t.prototype.generateLayout = function() {
            var t = this.getLandscapeElementsSize(),
                e = this.getPortraitElementsSize();
            return {
                landscape: {
                    base: {
                        screen: {
                            size: {
                                x: t.baseScreen.width,
                                y: t.baseScreen.height
                            }
                        },
                        elements: {
                            background: {
                                position: {
                                    x: t.baseScreen.width / 2,
                                    y: t.baseScreen.height / 2
                                },
                                size: {
                                    x: t.baseScreen.width,
                                    y: t.baseScreen.height
                                }
                            },
                            gameLogo: {
                                position: {
                                    x: t.baseScreen.width / 2,
                                    y: 0
                                },
                                size: {
                                    x: t.gameLogo.width,
                                    y: t.gameLogo.height
                                }
                            },
                            middleText: {
                                position: {
                                    x: t.baseScreen.width / 2,
                                    y: (52 * t.baseScreen.height / 100 - t.screen1.height / 2 + t.gameLogo.height) / 2
                                },
                                size: {
                                    x: t.middleText.width,
                                    y: t.middleText.height
                                }
                            },
                            screen1: {
                                position: {
                                    x: t.baseScreen.width / 4,
                                    y: 52 * t.baseScreen.height / 100
                                },
                                size: {
                                    x: t.screen1.width,
                                    y: t.screen1.height
                                }
                            },
                            screenText1: {
                                position: {
                                    x: t.baseScreen.width / 4,
                                    y: 52 * t.baseScreen.height / 100 + t.screen1.height / 2
                                },
                                size: {
                                    x: t.screenText1.width,
                                    y: t.screenText1.height
                                }
                            },
                            screen2: {
                                position: {
                                    x: 3 * t.baseScreen.width / 4,
                                    y: 52 * t.baseScreen.height / 100
                                },
                                size: {
                                    x: t.screen2.width,
                                    y: t.screen2.height
                                }
                            },
                            screenText2: {
                                position: {
                                    x: 3 * t.baseScreen.width / 4,
                                    y: 52 * t.baseScreen.height / 100 + t.screen2.height / 2
                                },
                                size: {
                                    x: t.screenText2.width,
                                    y: t.screenText2.height
                                }
                            },
                            continueAnimation: {
                                position: {
                                    x: t.baseScreen.width / 2,
                                    y: t.baseScreen.height - t.continueAnimation.height / 2
                                },
                                size: {
                                    x: t.continueAnimation.width,
                                    y: t.continueAnimation.height
                                }
                            }
                        }
                    },
                    narrow: {
                        screen: {
                            size: {
                                x: t.baseScreen.width / 2,
                                y: t.baseScreen.height
                            }
                        },
                        elements: {
                            background: {
                                position: {
                                    x: t.baseScreen.width / 4,
                                    y: t.baseScreen.height / 2
                                },
                                size: {
                                    x: t.baseScreen.width,
                                    y: t.baseScreen.height
                                }
                            },
                            gameLogo: {
                                position: {
                                    x: t.baseScreen.width / 4,
                                    y: 0
                                },
                                size: {
                                    x: 1.8 * t.gameLogo.width,
                                    y: 1.8 * t.gameLogo.height
                                }
                            },
                            middleText: {
                                position: {
                                    x: t.baseScreen.width / 4,
                                    y: (65 * t.baseScreen.height / 100 - t.screen1.height / 4 + 1.8 * t.gameLogo.height) / 2
                                },
                                size: {
                                    x: t.middleText.width / 2,
                                    y: t.middleText.height / 2
                                }
                            },
                            screen1: {
                                position: {
                                    x: t.baseScreen.width / 2 / 4,
                                    y: 65 * t.baseScreen.height / 100
                                },
                                size: {
                                    x: t.screen1.width / 2,
                                    y: t.screen1.height / 2
                                }
                            },
                            screenText1: {
                                position: {
                                    x: t.baseScreen.width / 2 / 4,
                                    y: 65 * t.baseScreen.height / 100 + t.screen1.height / 4
                                },
                                size: {
                                    x: t.screenText1.width / 2,
                                    y: t.screenText1.height / 2
                                }
                            },
                            screen2: {
                                position: {
                                    x: t.baseScreen.width / 2 * 3 / 4,
                                    y: 65 * t.baseScreen.height / 100
                                },
                                size: {
                                    x: t.screen2.width / 2,
                                    y: t.screen2.height / 2
                                }
                            },
                            screenText2: {
                                position: {
                                    x: t.baseScreen.width / 2 * 3 / 4,
                                    y: 65 * t.baseScreen.height / 100 + t.screen2.height / 4
                                },
                                size: {
                                    x: t.screenText2.width / 2,
                                    y: t.screenText2.height / 2
                                }
                            },
                            continueAnimation: {
                                position: {
                                    x: t.baseScreen.width / 4,
                                    y: t.baseScreen.height - t.continueAnimation.height / 2
                                },
                                size: {
                                    x: t.continueAnimation.width,
                                    y: t.continueAnimation.height
                                }
                            }
                        }
                    },
                    wide: {
                        screen: {
                            size: {
                                x: 2 * t.baseScreen.width,
                                y: t.baseScreen.height
                            }
                        },
                        elements: {
                            background: {
                                position: {
                                    x: t.baseScreen.width,
                                    y: t.baseScreen.height / 2
                                },
                                size: {
                                    x: 2 * t.baseScreen.width,
                                    y: 2 * t.baseScreen.height
                                }
                            },
                            gameLogo: {
                                position: {
                                    x: t.baseScreen.width,
                                    y: 0
                                },
                                size: {
                                    x: t.gameLogo.width,
                                    y: t.gameLogo.height
                                }
                            },
                            middleText: {
                                position: {
                                    x: t.baseScreen.width,
                                    y: (52 * t.baseScreen.height / 100 - t.screen1.height / 2 + t.gameLogo.height) / 2
                                },
                                size: {
                                    x: t.middleText.width,
                                    y: t.middleText.height
                                }
                            },
                            screen1: {
                                position: {
                                    x: 2 * t.baseScreen.width / 4,
                                    y: 52 * t.baseScreen.height / 100
                                },
                                size: {
                                    x: t.screen1.width,
                                    y: t.screen1.height
                                }
                            },
                            screenText1: {
                                position: {
                                    x: 2 * t.baseScreen.width / 4,
                                    y: 52 * t.baseScreen.height / 100 + t.screen1.height / 2
                                },
                                size: {
                                    x: t.screenText1.width,
                                    y: t.screenText1.height
                                }
                            },
                            screen2: {
                                position: {
                                    x: 2 * t.baseScreen.width * 3 / 4,
                                    y: 52 * t.baseScreen.height / 100
                                },
                                size: {
                                    x: t.screen2.width,
                                    y: t.screen2.height
                                }
                            },
                            screenText2: {
                                position: {
                                    x: 2 * t.baseScreen.width * 3 / 4,
                                    y: 52 * t.baseScreen.height / 100 + t.screen2.height / 2
                                },
                                size: {
                                    x: t.screenText2.width,
                                    y: t.screenText2.height
                                }
                            },
                            continueAnimation: {
                                position: {
                                    x: 2 * t.baseScreen.width / 2,
                                    y: t.baseScreen.height - t.continueAnimation.height / 2
                                },
                                size: {
                                    x: t.continueAnimation.width,
                                    y: t.continueAnimation.height
                                }
                            }
                        }
                    }
                },
                portrait: {
                    base: {
                        screen: {
                            size: {
                                x: e.baseScreen.width,
                                y: e.baseScreen.height
                            }
                        },
                        elements: {
                            background: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: e.baseScreen.height / 2
                                },
                                size: {
                                    x: e.background.width * e.baseScreen.height / e.background.height,
                                    y: e.baseScreen.height
                                }
                            },
                            gameLogo: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: e.baseScreen.height / 6
                                },
                                size: {
                                    x: e.gameLogo.width,
                                    y: e.gameLogo.height
                                }
                            },
                            middleText: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: (2 * e.baseScreen.height / 3 - e.screen1.height / 2 + e.gameLogo.height + e.baseScreen.height / 6) / 2
                                },
                                size: {
                                    x: e.middleText.width,
                                    y: e.middleText.height
                                }
                            },
                            screen1: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: 2 * e.baseScreen.height / 3
                                },
                                size: {
                                    x: e.screen1.width,
                                    y: e.screen1.height
                                }
                            },
                            screenText1: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: 2 * e.baseScreen.height / 3 + e.screen1.height / 2
                                },
                                size: {
                                    x: e.screenText1.width,
                                    y: e.screenText1.height
                                }
                            },
                            screen2: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: 2 * e.baseScreen.height / 3
                                },
                                size: {
                                    x: e.screen2.width,
                                    y: e.screen2.height
                                }
                            },
                            screenText2: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: 2 * e.baseScreen.height / 3 + e.screen2.height / 2
                                },
                                size: {
                                    x: e.screenText2.width,
                                    y: e.screenText2.height
                                }
                            },
                            continueAnimation: {
                                position: {
                                    x: e.baseScreen.width - e.continueAnimation.width / 2 * .8,
                                    y: e.continueAnimation.height / 2
                                },
                                size: {
                                    x: e.continueAnimation.width,
                                    y: e.continueAnimation.height
                                }
                            }
                        }
                    },
                    narrow: {
                        screen: {
                            size: {
                                x: e.baseScreen.width,
                                y: e.baseScreen.width
                            }
                        },
                        elements: {
                            background: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: e.baseScreen.width / 2
                                },
                                size: {
                                    x: e.background.width * e.baseScreen.width / e.background.height,
                                    y: e.baseScreen.width
                                }
                            },
                            gameLogo: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: e.continueAnimation.height
                                },
                                size: {
                                    x: e.gameLogo.width,
                                    y: e.gameLogo.height
                                }
                            },
                            middleText: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: e.continueAnimation.height + e.gameLogo.height + e.middleText.height / 2
                                },
                                size: {
                                    x: e.middleText.width,
                                    y: e.middleText.height
                                }
                            },
                            screen1: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: e.continueAnimation.height + e.gameLogo.height + e.middleText.height + 4 * e.screen1.height / 10
                                },
                                size: {
                                    x: 8 * e.screen1.width / 10,
                                    y: 8 * e.screen1.height / 10
                                }
                            },
                            screenText1: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: e.continueAnimation.height + e.gameLogo.height + e.middleText.height + 8 * e.screen1.height / 10
                                },
                                size: {
                                    x: e.screenText1.width,
                                    y: e.screenText1.height
                                }
                            },
                            screen2: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: e.continueAnimation.height + e.gameLogo.height + e.middleText.height + 4 * e.screen2.height / 10
                                },
                                size: {
                                    x: 8 * e.screen2.width / 10,
                                    y: 8 * e.screen2.height / 10
                                }
                            },
                            screenText2: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: e.continueAnimation.height + e.gameLogo.height + e.middleText.height + 8 * e.screen2.height / 10
                                },
                                size: {
                                    x: e.screenText2.width,
                                    y: e.screenText2.height
                                }
                            },
                            continueAnimation: {
                                position: {
                                    x: e.baseScreen.width - e.continueAnimation.width / 2 * .8,
                                    y: e.continueAnimation.height / 2
                                },
                                size: {
                                    x: e.continueAnimation.width,
                                    y: e.continueAnimation.height
                                }
                            }
                        }
                    },
                    wide: {
                        screen: {
                            size: {
                                x: e.baseScreen.width,
                                y: 2 * e.baseScreen.height
                            }
                        },
                        elements: {
                            background: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: 2 * e.baseScreen.height / 2
                                },
                                size: {
                                    x: 2 * e.background.width * e.baseScreen.height / e.background.height,
                                    y: 2 * e.baseScreen.height
                                }
                            },
                            gameLogo: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: 2 * e.baseScreen.height / 6
                                },
                                size: {
                                    x: 2.5 * e.gameLogo.width,
                                    y: 2.5 * e.gameLogo.height
                                }
                            },
                            middleText: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: (2 * e.baseScreen.height * 2 / 3 - e.screen1.height / 2 + 5 * e.gameLogo.height + e.baseScreen.height / 6) / 2
                                },
                                size: {
                                    x: e.middleText.width,
                                    y: e.middleText.height
                                }
                            },
                            screen1: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: 2 * e.baseScreen.height * 2 / 3
                                },
                                size: {
                                    x: e.screen1.width,
                                    y: e.screen1.height
                                }
                            },
                            screenText1: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: 2 * e.baseScreen.height * 2 / 3 + e.screen1.height / 2
                                },
                                size: {
                                    x: e.screenText1.width,
                                    y: 2 * e.screenText1.height
                                }
                            },
                            screen2: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: 2 * e.baseScreen.height * 2 / 3
                                },
                                size: {
                                    x: e.screen2.width,
                                    y: e.screen2.height
                                }
                            },
                            screenText2: {
                                position: {
                                    x: e.baseScreen.width / 2,
                                    y: 2 * e.baseScreen.height * 2 / 3 + e.screen2.height / 2
                                },
                                size: {
                                    x: e.screenText2.width,
                                    y: 2 * e.screenText2.height
                                }
                            },
                            continueAnimation: {
                                position: {
                                    x: e.baseScreen.width - e.continueAnimation.width / 2 * .8,
                                    y: e.continueAnimation.height / 2
                                },
                                size: {
                                    x: e.continueAnimation.width,
                                    y: e.continueAnimation.height
                                }
                            }
                        }
                    }
                }
            }
        }, t
    }), _d("^!@", ["^#", "^!!"], function(t, e) {
        "use strict";
        function n() {
            e.call(this)
        }
        return t.extend(n, e), n
    }), _d("^!!", ["^#"], function(t) {
        "use strict";
        function e() {
            PIXI.Container.call(this), this.background = this.createBackground()
        }
        return t.extend(e, PIXI.Container), e.prototype.createBackground = function() {
            var t = PIXI.Sprite.fromFrame("images/machine/frame.png");
            return t.anchor.set(.5, .5), this.addChild(t)
        }, e
    }), _d("^!)", ["^!#", "^#", "^!@", "#", "^!$", "^!%", "^!^", "^!&", "#^*", "^!*", "^!(", "@^^"], function(t, e, n, i, o, s, r, a, h, p, u, c) {
        "use strict";
        function l() {
            t.call(this), this.winPaylines = this.createWinPaylines(), this.symbolsContainer = this.createSymbolsContainer(), this.previewPayline = this.createPreviewPayline(), this.winPaylinePrize = this.createWinPaylinePrize(), this.winExplosion = this.createWinExplosion(), this.movingWinLine = this.createMovingWinLine(), this.setChildIndex(this.frame, this.children.length - 1), this.paylines = this.createPaylines(this.previewPayline), this.click = this.tap = this.onClick, c.on("currentState/changed", this.onMachineStateChanged), this.onMachineStateChanged()
        }
        return e.extend(l, t), l.prototype.onMachineStateChanged = function() {
            this.interactive = !c.isIdle()
        }, l.prototype.onClick = function() {
            i.emit("machine/click")
        }, l.prototype.createWinPaylines = function() {
            var t = new o;
            return this.addChild(t)
        }, l.prototype.createFrame = function() {
            var t = new n;
            return this.addChild(t)
        }, l.prototype.createPreviewPayline = function() {
            var t = new s;
            return this.addChild(t)
        }, l.prototype.createPaylines = function(t) {
            var e = new r(this, t);
            return this.addChild(e)
        }, l.prototype.createSymbolsContainer = function() {
            var t = new h;
            return this.addChild(t)
        }, l.prototype.getWidth = function() {
            return this.frame.width
        }, l.prototype.getHeight = function() {
            return this.frame.height
        }, l.prototype.createWinPaylinePrize = function() {
            var t = new p;
            return this.addChild(t)
        }, l.prototype.createWinExplosion = function() {
            var t = new u;
            return this.addChild(t)
        }, l.prototype.createMovingWinLine = function() {
            var t = new a;
            return this.addChild(t)
        }, l
    }), _d("^!#", ["!", "^#", "^!!", "@%$"], function(t, e, n, i) {
        "use strict";
        function o() {
            PIXI.Container.call(this), t.bindAll(this), this.background = this.createBackground(), this.frame = this.createFrame()
        }
        return e.extend(o, PIXI.Container), o.prototype.createFrame = function() {
            var t = new n;
            return this.addChild(t)
        }, o.prototype.createBackground = function() {
            if (i.hasTexture("images/machine/background.png")) {
                var t = PIXI.Sprite.fromFrame("images/machine/background.png");
                return t.anchor.set(.5), this.addChildAt(t, 0)
            }
            return new PIXI.Container
        }, o.prototype.getWidth = function() {
            return this.frame.width
        }, o.prototype.getHeight = function() {
            return this.frame.height
        }, o.prototype.getMobileWidth = function() {
            return this.symbolsContainer.width
        }, o
    }), _d("^@!", ["^#", "^!#", "^!!"], function(t, e, n) {
        "use strict";
        function i() {
            e.call(this), this.overlay = this.createOverlay()
        }
        return t.extend(i, e), i.prototype.createOverlay = function() {
            var t = new PIXI.Graphics;
            return t.beginFill(0, .6), t.drawRect(-this.background.width / 2, -this.background.height / 2, this.background.width, this.background.height), t.endFill(), this.addChildAt(t, this.getChildIndex(this.background) + 1)
        }, i
    }), _d("^!&", ["^#", "#^*", "%@#", "!", "#^^"], function(t, e, c, n, l) {
        "use strict";
        function i() {
            PIXI.Container.call(this), n.bindAll(this)
        }
        return t.extend(i, PIXI.Container), i.prototype.play = function(t, e) {
            t[0].row === t[1].row || t.length <= 3 ? this.drawLine(e, t[0], t[t.length - 1], 0) : (this.drawLine(e, t[0], t[2], 0), this.drawBend(e, t[2], .1), this.drawLine(e, t[2], t[t.length - 1], .15))
        }, i.prototype.drawLine = function(t, e, n, i) {
            var o = PIXI.Sprite.fromFrame("images/win_presentation/" + c.getAnimationPrefix(t) + "_straight_line.png");
            o.anchor.set(.5);
            var s = l.getSymbolCoordinates(e.column, e.row),
                r = l.getSymbolCoordinates(n.column, n.row);
            o.x = s.x, o.y = s.y, o.scale.set(.2, .2), o.alpha = 0;
            var a = Math.atan2(r.y - s.y, s.x - r.x);
            o.rotation = -a;
            var h = Math.abs(n.column - e.column),
                p = .05 * h + .1,
                u = h / 5;
            TweenMax.to(o, p, {
                x: r.x,
                y: r.y,
                delay: i
            }), TweenMax.to(o.scale, p / 2, {
                x: u,
                y: u
            }), TweenMax.to(o.scale, p / 2, {
                delay: p / 2 + i,
                x: .2,
                y: .2
            }), TweenMax.to(o, p / 4, {
                alpha: 1,
                delay: i
            }), TweenMax.to(o, p / 4, {
                delay: 3 * p / 4 + i,
                alpha: 0
            }), this.addChild(o)
        }, i.prototype.drawBend = function(t, e, n) {
            var i = PIXI.Sprite.fromFrame("images/win_presentation/" + c.getAnimationPrefix(t) + "_bend_line.png");
            i.anchor.set(.5, .1), i.rotation = 2 === e.row ? Math.PI : 0;
            var o = l.getSymbolCoordinates(e.column, e.row);
            i.x = o.x, i.y = o.y, i.alpha = 0, TweenMax.to(i, .1, {
                delay: n,
                alpha: 1
            }), TweenMax.to(i, .1, {
                delay: n + .1,
                alpha: 0
            }), this.addChild(i)
        }, i
    }), _d("^@@", ["^#", "!", "@@"], function(t, o, s) {
        "use strict";
        function e(t, e, n, i) {
            PIXI.Container.call(this), o.bindAll(this), this.previewPayline = t, this.i = e, this.nr = n, this.data = i, this.image = this.createImage(), this.label = this.createLabel(), this.interactive = !0, s.showMobileUI || (this.mouseover = this.onMouseOver, this.mouseout = this.onMouseOut)
        }
        return t.extend(e, PIXI.Container), e.prototype.createImage = function() {
            var t = new PIXI.Sprite.fromFrame("images/machine/payline_button.png");
            return t.anchor.set(.5), this.addChild(t)
        }, e.prototype.createLabel = function() {
            var t = new PIXI.Sprite.fromFrame("images/machine/payline_" + this.nr + ".png");
            return t.anchor.set(.5), this.addChild(t)
        }, e.prototype.onMouseOver = function() {
            this.previewPayline.createPaylinePreview(this.i, this.data), this.image.alpha = 1, this.highlight()
        }, e.prototype.onMouseOut = function() {
            this.previewPayline.clear(), this.image.alpha = 0, this.clearHighlight()
        }, e.prototype.highlight = function() {
            this.filters = [new PIXI.filters.InvertFilter], TweenMax.to(this.image.scale, .2, {
                x: 1.3,
                y: 1.3
            })
        }, e.prototype.clearHighlight = function() {
            this.filters = null, TweenMax.to(this.image.scale, .2, {
                x: 1,
                y: 1
            })
        }, e
    }), _d("^!%", ["^#", "#^^"], function(t, s) {
        "use strict";
        function e() {
            PIXI.Container.call(this), this.cached = [], this.preview = null, this.clear()
        }
        return t.extend(e, PIXI.Container), e.prototype.createPaylinePreview = function(t, e) {
            this.cached[t] ? this.preview = this.cached[t] : this.preview = this.cached[t] = this.create(e), this.addChild(this.preview)
        }, e.prototype.create = function(t) {
            var e = this.getStyle(),
                n = new PIXI.Graphics;
            n.lineStyle(e.lineWidth, e.color, e.alpha);
            for (var i = 0; i < t.length; i++) {
                var o = s.getSymbolCoordinates(i, t[i]);
                0 === i ? n.moveTo(o.x, o.y) : n.lineTo(o.x, o.y)
            }
            return n
        }, e.prototype.getStyle = function() {
            return {
                lineWidth: 10,
                color: 0,
                alpha: 1
            }
        }, e.prototype.clear = function() {
            this.removeChildren()
        }, e
    }), _d("^!^", ["!", "^#", "#", "#))", "^@@", "$^"], function(n, t, i, o, s, r) {
        "use strict";
        function e(t, e) {
            PIXI.Container.call(this), this.machine = t, n.bindAll(this), this.createButtons(e), i.on("initialAnimation/highlightAllPaylines", this.showAll), i.on("initialAnimation/clearAllPaylines", this.hideAll), i.on("winPresentation/show", this.show), i.on("winPresentation/hide", this.hide), i.on("winPresentation/clear", this.hide)
        }
        return t.extend(e, PIXI.Container), e.prototype.createButtons = function(t) {
            this.paylines = [];
            for (var e = 0; e < o.paylines.length; e++) {
                var n = new s(t, e, this.getDisplayNumber(e), o.paylines[e]);
                n.x = this.getHorizontalPosition(e), n.y = this.getVerticalPosition(e), this.addChild(n), this.paylines.push(n)
            }
        }, e.prototype.getDisplayNumber = function(t) {
            return Math.floor(t % (o.paylines.length / 2)) + 1
        }, e.prototype.getVerticalPosition = function(t) {
            return 127 * ([2, 0, 4, 1, 3][Math.floor(t % (o.paylines.length / 2))] - Math.floor(o.paylines.length / 4)) + 96
        }, e.prototype.getHorizontalPosition = function(t) {
            return (t < o.paylines.length / 2 ? -1 : 1) * (this.machine.getWidth() / 2 - 80)
        }, e.prototype.showAll = function() {
            for (var t = r.getAllLinesToHighlight(), e = 0; e < t.length; e++)
                this.paylines[t[e].line].highlight()
        }, e.prototype.hideAll = function() {
            for (var t = r.getAllLinesToHighlight(), e = 0; e < t.length; e++)
                this.paylines[t[e].line].clearHighlight()
        }, e.prototype.show = function() {
            for (var t = r.getCurrentLineToHighlight(), e = 0; e < t.lines.length; e++) {
                var n = t.lines[e];
                this.paylines[n].highlight()
            }
        }, e.prototype.hide = function() {
            var t = r.getCurrentLineToHighlight();
            if (t && t.lines)
                for (var e = 0; e < t.lines.length; e++) {
                    var n = t.lines[e];
                    this.paylines[n].clearHighlight()
                }
        }, e
    }), _d("^@$", ["@$", "#", "#^#", "!", "@)%", "^@#", "@(&", "@@*", "^", "@^^"], function(e, a, n, i, s, o, h, r, p, u) {
        "use strict";
        function t(t, e) {
            this.column = t, this.container = e, this.BORDER_Y = (s.rows / 2 + .5) * o.HEIGHT, this.TOTAL_HEIGHT = (s.rows + 1) * o.HEIGHT, this.MIN_FULL_ROTATION_PROGRESS = s.rows * o.HEIGHT / this.TOTAL_HEIGHT, this.MAX_FULL_ROTATION_PROGRESS = 1, this.OVERSPIN_PROGRESS = .04, this.DEFAULT_SPEED = .12, this.DEFAULT_DECELERATION_FACTOR = 3.5, this._progress = 0, this.symbols = [], this.first = 0, this.updatePriority = s.columns - p.getStoppingReelsOrder().indexOf(t), i.bindAll(this)
        }
        return t.prototype.addSymbol = function(t) {
            this.symbols.push(t)
        }, t.prototype.setSymbolAt = function(t, e) {
            this.symbols[this.getSymbolPosition(t)] = e
        }, t.prototype.getSymbolPosition = function(t) {
            return (t + this.first + 1) % (s.rows + 1)
        }, t.prototype.getSymbol = function(t) {
            return this.symbols[this.getSymbolPosition(t)]
        }, t.prototype.startSpinning = function() {
            this.stop = !1, this.unsetRows = s.rows - 1, this._progress = 0, this.speed = .02, a.on("game/update", this.spin, this.updatePriority)
        }, t.prototype.spin = function() {
            n.shouldStop(this.column) && 1 < this.progress ? (a.off("game/update", this.spin), this.decelerate(Math.ceil(this.progress) - this.progress)) : (this.progress += this.speed, this.speed = Math.min(this.speed + .02, this.DEFAULT_SPEED * this.speedFactor))
        }, Object.defineProperty(t.prototype, "speedFactor", {
            get: function() {
                return p.getSpeedFactorForColumn(this.column)
            }
        }), t.prototype.decelerate = function(t) {
            var e = t + this.MAX_FULL_ROTATION_PROGRESS,
                n = this.OVERSPIN_PROGRESS * h.spinTimeFactor,
                i = .3,
                o = e + this.progress,
                s = this.calculateTimeConstant(),
                r = function() {
                    !this.stop && e <= this.MAX_FULL_ROTATION_PROGRESS && (this.startStopping(e), this.playStopSound(e));
                    var t = e / (u.isForceStopping() ? this.DEFAULT_DECELERATION_FACTOR : s);
                    t = Math.max(t, .04), e -= t, this.progress += t, this.enableSpinQuicker() && (i = n = 0), this.progress >= o + n && (a.off("game/update", r), TweenMax.to(this, i, {
                        progress: o,
                        onComplete: this.spinningStopped
                    }))
                }.bind(this);
            a.on("game/update", r, this.updatePriority), r()
        }, t.prototype.playStopSound = function(t) {
            e(function() {
                r.play("sounds/reel_stop.mp3")
            }, .3 * t)
        }, t.prototype.enableSpinQuicker = function() {
            return !1
        }, t.prototype.calculateTimeConstant = function() {
            return 1 === this.speedFactor ? this.DEFAULT_DECELERATION_FACTOR : 64 * Math.pow(Math.E, -2.9 * this.speedFactor)
        }, t.prototype.startStopping = function(t) {
            this.finalSymbolsReady = !1, this.stop = !0, e(this.markNextToStop, 1 - this.speedFactor), s.setFinalPositionAt(this.column), t >= this.MIN_FULL_ROTATION_PROGRESS + .002 || this.first !== s.rows || (this.getSymbol(this.first).setType(s.getNextSymbolAt(this.column)), this.finalSymbol(this.getSymbol(this.first))), a.emit("column/stoppingStarted", this.column), this.resetSymbolsBeforeFirst(2)
        }, t.prototype.resetSymbolsBeforeFirst = function(t) {
            for (var e = 0; e < t; e++) {
                var n = this.first + s.rows + e;
                n > s.rows && (n = e);
                var i = e + s.rows;
                this.getSymbol(n).setType(s.getFinalSymbolWithoutStickyAt(this.column, i))
            }
        }, t.prototype.markNextToStop = function() {
            n.markNextToStop(this.column)
        }, t.prototype.setSpinningState = function(t) {
            for (var e = 0; e < this.symbols.length; e++)
                this.getSymbol(e).isSpinning = t
        }, t.prototype.spinningStopped = function() {
            n.stopped(this.column);
            for (var t = 0; t < this.symbols.length; t++)
                this.getSymbol(t).row = t;
            a.emit("column/stopped", this.column), n.allStopped() && a.emit("spin/end")
        }, Object.defineProperty(t.prototype, "progress", {
            get: function() {
                return this._progress
            },
            set: function(t) {
                var e = (t - this._progress) * this.TOTAL_HEIGHT;
                this._progress = t;
                for (var n = this.first, i = this.symbols.length - 1; 0 <= i; i--) {
                    var o = this.getSymbol(i - 1);
                    o.y += e, o.y >= this.BORDER_Y - 1 && (o.y -= this.TOTAL_HEIGHT, this.updateSymbol(o), --n < 0 && (n = s.rows), this.stop && this.finalSymbol(o)), this.setSymbolOpacity(o)
                }
                this.first = n, this.finalSymbolsAssigned() && (this.finalSymbolsReady = !0, a.emit("column/allSymbolsReady", this.column))
            }
        }), t.prototype.updateSymbol = function(t) {
            t.setType(s.getNextSymbolAt(this.column)), t.isSpinning = this.hasFullSpeed()
        }, t.prototype.finalSymbol = function(t) {
            0 <= this.unsetRows && (t.setType(s.getFinalSymbolAt(this.column, this.unsetRows)), a.emit("column/symbolReady", t, this.column, this.unsetRows)), this.unsetRows--
        }, t.prototype.hasFullSpeed = function() {
            return !n.shouldStop(this.column) && 1 <= this.speedFactor
        }, t.prototype.finalSymbolsAssigned = function() {
            return !this.finalSymbolsReady && n.shouldStop(this.column) && s.isCurrentPositionFinal(this.column)
        }, t.prototype.setSymbolOpacity = function(t) {}, t
    }), _d("^@^", ["^#", "@))", "@#*", "^@%", "!", "#@", "@@", "$%", "*", "#", "@)@", "&$"], function(t, e, h, n, i, o, s, r, a, p, u, c) {
        "use strict";
        function l() {
            this.WIDTH = 1100, this.HEIGHT = 700, n.call(this), p.on("replay/end", this.onReplayEnd, p.PRIORITY_LOWEST), this.createTitle(), u.getTime() && this.createLabel(o.get("game_history_time_label"), c.format(u.getTime()), 0, 0), u.getInitialBalance() && this.createLabel(o.get("game_history_initial_balance_label"), r.format(u.getInitialBalance()), 3, 0), u.getFinalBalance() && this.createLabel(o.get("game_history_final_balance_label"), r.format(u.getFinalBalance()), 3, 1), this.createLabel("ID", s.wagerId, 1, 0), this.createLabel(o.get("game_history_type_label"), u.isPromoSpin() ? "P" : "N", 1, 1), this.createLabel(o.get("game_history_bet_label"), r.format(a.totalBet), 2, 0), this.createLabel(o.get("game_history_win_label"), r.format(parseFloat(u.getTotalWonAmount())), 2, 1), h.getLicense().hasSessionAndTicketId() && (this.sessionId = this.createLabel(o.get("game_history_session_id_italy"), s.params.gameHistorySessionId || "-", 4, 0), this.ticketId = this.createLabel(o.get("game_history_ticket_id_italy"), s.params.gameHistoryTicketId || "-", 4, 1))
        }
        return t.extend(l, n), l.prototype.createTitle = function() {
            var t = new PIXI.Text(o.get("replay_title").toUpperCase(), {
                fontFamily: "Verdana",
                fontSize: "50px",
                fontWeight: "bold",
                dropShadow: !0,
                dropShadowDistance: 1,
                fill: "white"
            });
            t.updateText(), t.x = -t.width / 2, t.y = -this.HEIGHT / 2 + 30, this.addChild(t)
        }, l.prototype.createLabel = function(t, e, n, i) {
            var o = 130,
                s = 150;
            h.getLicense().hasSessionAndTicketId() && (o = 120, s = 85);
            var r = new PIXI.Text(t, {
                    fontFamily: "Verdana",
                    fontSize: "30px",
                    fontWeight: "bold",
                    dropShadow: !0,
                    dropShadowDistance: 1,
                    fill: "grey"
                }),
                a = new PIXI.Text(e, {
                    fontFamily: "Verdana",
                    fontSize: "40px",
                    dropShadow: !0,
                    dropShadowDistance: 2,
                    fill: "white"
                });
            return r.y = n * o - this.HEIGHT / 2 + s, a.y = r.y + 50, r.x = i * this.WIDTH / 2 - this.WIDTH / 2 + 50, a.x = r.x, this.addChild(r), this.addChild(a)
        }, l.prototype.onReplayEnd = function() {
            n.prototype.onReplayEnd.call(this), h.getLicense().hasSessionAndTicketId() && (this.cacheAsBitmap = !1, this.sessionId.text = e.gameDetails.sessionId, this.ticketId.text = e.gameDetails.ticketId, this.cacheAsBitmap = !0)
        }, l
    }), _d("^@%", ["^#", "!", "#", "@$"], function(t, e, n, i) {
        "use strict";
        function o() {
            e.bindAll(this), PIXI.Container.call(this), i(function() {
                this.createBackground(), this.cacheAsBitmap = !0
            }.bind(this), 0), n.on("spin/start", this.onSpinBegin)
        }
        return t.extend(o, PIXI.Container), o.prototype.onSpinBegin = function() {
            this.visible = !1
        }, o.prototype.onReplayEnd = function() {
            this.visible = !0, this.parent.setChildIndex(this, this.parent.children.length - 1)
        }, o.prototype.createBackground = function() {
            var t = new PIXI.Graphics;
            return t.beginFill(0, .75), t.drawRoundedRect(-this.WIDTH / 2, -this.HEIGHT / 2, this.WIDTH, this.HEIGHT, 40), t.endFill(), this.addChildAt(t, 0)
        }, o
    }), _d("^@&", ["^#", "^@%", "!", "#@", "#", "@@@", "@@"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a() {
            this.WIDTH = 1e3, this.HEIGHT = 200, e.call(this), this.createTitle(), this.interactive = !0
        }
        return t.extend(a, e), a.prototype.createTitle = function() {
            var t = new PIXI.Text(i.get("rewatch_title").toUpperCase(), {
                fontFamily: "Verdana",
                fontSize: "40px",
                dropShadow: !0,
                dropShadowDistance: 1,
                fill: "white",
                wordWrap: !0,
                wordWrapWidth: this.WIDTH - 50,
                align: "center"
            });
            t.updateText(), t.x = -t.width / 2, t.y = -t.height / 2, this.HEIGHT = t.height + 50, this.addChild(t)
        }, a
    }), _d("^@*", ["^#", "@@"], function(t, n) {
        "use strict";
        function e() {
            PIXI.Container.call(this), this.symbols = []
        }
        return t.extend(e, PIXI.Container), e.prototype.addSymbol = function(t, e, n) {
            this.symbols[t] = this.symbols[t] || [], this.symbols[t][e] = n, this.addChild(n)
        }, e.prototype.getSymbol = function(t, e) {
            return this.symbols[t][e]
        }, e.prototype.hasSymbol = function(t, e) {
            return this.symbols[t] && this.symbols[t][e]
        }, e.prototype.clear = function() {
            for (var t = 0; t < this.symbols.length; t++)
                if (this.symbols[t])
                    for (var e = 0; e < this.symbols[t].length; e++)
                        this.hasSymbol(t, e) && n.game.root.machine.symbolsContainer.setStickyAsNormal(t, e);
            this.symbols = []
        }, e
    }), _d("^@#", ["^@(", "@$", "@@", "$!", "^#", "!", "^@)", "$^", "@^^", "@)%", "$#", "#"], function(t, e, o, n, i, s, r, a, h, p, u, c) {
        "use strict";
        function l(t, e, n, i) {
            PIXI.Container.call(this), this.type = t, this.column = e, this.row = n, this.container = i, this.image = this.createImage(t), this.hitArea = new PIXI.Rectangle(-l.WIDTH / 2, -l.HEIGHT / 2, l.WIDTH, l.HEIGHT), s.bindAll(this), this.interactive = !0, o.showMobileUI ? this.supportForceTouch() && (this.touchstart = this.onMouseDown) : this.click = this.tap = this.onClick, this._isSpinning = !1, this.hasNearWinState = !1
        }
        return i.extend(l, PIXI.Container), l.HEIGHT = 240, l.WIDTH = 285, l.prototype.createImage = function(t) {
            var e = new PIXI.Sprite(this.getTextureForSymbol(t));
            return e.anchor.set(.5, .5), this.addChild(e)
        }, l.prototype.getTextureForSymbol = function(t) {
            return PIXI.Texture.fromFrame("images/symbols/" + t.toLowerCase() + ".png")
        }, l.prototype.setType = function(t) {
            this.type = t, this.refreshTexture(), this.removeAnimation(), this.removeNearWinState()
        }, l.prototype.refreshTexture = function() {
            this.image.texture = this.getTextureForCurrentState(this.type)
        }, l.prototype.getTextureForCurrentState = function(t) {
            return this.isSpinning ? PIXI.Texture.fromFrame("images/symbols/" + t.toLowerCase() + "_blurred.png") : this.getTextureForSymbol(t)
        }, l.prototype.canShowMiniPaytable = function() {
            return !!h.isIdle() && !n.isDuringAutoSpins && !(this.row < 0 || this.row >= p.rows)
        }, l.prototype.onClick = function() {
            this.canShowMiniPaytable() && this.openMiniPaytable()
        }, l.prototype.supportForceTouch = function() {
            return !1
        }, l.prototype.onMouseDown = function() {
            u.document.body.addEventListener("touchforcechange", this.onForceTouch), this.touchend = this.onMouseUp
        }, l.prototype.onMouseUp = function() {
            u.document.body.removeEventListener("touchforcechange", this.onForceTouch), this.touchend = null
        }, l.prototype.onForceTouch = function(t) {
            if (this.canShowMiniPaytable()) {
                if (t.touches.length) {
                    var e = t.touches[0].force,
                        n = MouseEvent.WEBKIT_FORCE_AT_MOUSE_DOWN;
                    MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN, n <= e && (this.onMouseUp(), this.onClick())
                }
            } else
                this.onMouseUp()
        }, l.prototype.openMiniPaytable = function() {
            c.emit("symbol/hideMiniPaytable"), new t(this)
        }, l.prototype.highlight = function() {
            var t = a.SINGLE_LINE_TIME / 4;
            TweenMax.to(this, .1, {
                alpha: 1
            }), TweenMax.to(this.scale, t, {
                x: 1.2,
                y: 1.2
            }), TweenMax.to(this.scale, t, {
                x: 1,
                y: 1,
                delay: t
            }), TweenMax.to(this.scale, t, {
                x: 1.2,
                y: 1.2,
                delay: 2 * t
            }), TweenMax.to(this.scale, t, {
                x: 1,
                y: 1,
                delay: 3 * t
            })
        }, l.prototype.clearImmediately = function() {
            TweenMax.killTweensOf(this), TweenMax.killTweensOf(this.scale), TweenMax.to(this.scale, .1, {
                x: 1,
                y: 1
            }), TweenMax.to(this, .1, {
                alpha: 1
            })
        }, l.prototype.obscure = function() {
            TweenMax.to(this, .1, {
                alpha: .7
            })
        }, l.prototype.playWinAnimation = function(t) {
            TweenMax.to(this.scale, .15, {
                x: 1.6,
                y: 1.6
            }), TweenMax.to(this.scale, .15, {
                x: 1,
                y: 1,
                delay: .15
            }), this.winPrize = this.createWinPrize(t), e(this.winPrize.hide, .3)
        }, l.prototype.createWinPrize = function(t) {
            var e = new r(!0);
            return e.createPrize(t), this.addChild(e)
        }, l.prototype.playAnimation = function(t, e) {
            return this.removeAnimation(), this.parent.setChildIndex(this, 0), this.animation = t, this.animationOptions = this.parseAnimationOptions(t, e), this.image.visible = this.animationOptions.staticVisible, this.animationOptions.asChild && this.addChild(t), this.animation
        }, l.prototype.parseAnimationOptions = function(t, e) {
            (e = e || {}).asChild = void 0 === e.asChild || e.asChild, e.staticVisible = void 0 === e.staticVisible || e.staticVisible, e.onCompleteParams = e.onCompleteParams || [];
            var n = e.onComplete || function() {};
            return e.onComplete = function() {
                n.apply(null, e.onCompleteParams), e.asChild && t.parent && t.parent.removeChild(t)
            }, e
        }, l.prototype.removeAnimation = function() {
            this.animation && this.animationOptions.onComplete(), this.animation = null, this.onCompleteParams = null, this.image.visible = !0
        }, Object.defineProperty(l.prototype, "isSpinning", {
            get: function() {
                return this._isSpinning
            },
            set: function(t) {
                this._isSpinning !== t && (this._isSpinning = t, this.refreshTexture())
            }
        }), l.prototype.setNearWinState = function() {
            this.hasNearWinState = !0
        }, l.prototype.removeNearWinState = function() {
            this.hasNearWinState = !1
        }, l.prototype.bringToFront = function() {
            this.parent.setChildIndex(this, this.parent.children.length - 1)
        }, l.prototype.pushToBack = function() {
            this.parent.setChildIndex(this, 0)
        }, l.prototype.hideStaticImage = function() {
            this.image.visible = !1
        }, l.prototype.showStaticImage = function() {
            this.image.visible = !0
        }, l
    }), _d("#^^", ["#(*", "^@#"], function(n, i) {
        "use strict";
        function t() {}
        return t.getSymbolCoordinates = function(t, e) {
            return {
                x: (t - n.getColumns() / 2 + .5) * i.WIDTH,
                y: (e - n.getRows() / 2 + .5) * i.HEIGHT
            }
        }, t
    }), _d("#^*", ["!", "#", "^#", "#^#", "^", "@)%", "@@*", "^@$", "^@#", "$^", "#^^", "^@*", "%@#"], function(t, e, n, i, o, s, r, a, h, p, u, c, l) {
        "use strict";
        function d() {
            PIXI.Container.call(this), t.bindAll(this), this.reels = [], e.on("spin/start", this.startSpinning), e.on("spin/stop", this.stopSpinning), e.on("spin/end", this.spinningStopped, 2 * e.PRIORITY_HIGHEST), e.on("initialAnimation/start", this.playWinAnimations), e.on("winPresentation/show", this.show), e.on("winPresentation/clear", this.clearImmediately), this.createReels(), this.mask = this.createMask(), this.stickySymbols = this.createStickySymbols()
        }
        return n.extend(d, PIXI.Container), d.prototype.createReels = function() {
            for (var t = 0; t < s.columns; t++) {
                var e = new a(t, this);
                this.reels.push(e);
                for (var n = -1; n < s.rows; n++) {
                    var i = this.createSymbol(t, n);
                    e.addSymbol(i)
                }
            }
        }, d.prototype.createSymbol = function(t, e) {
            var n = new h(s.getCurrentSymbolAt(t, e), t, e, this),
                i = u.getSymbolCoordinates(t, e);
            return n.position.set(i.x, i.y), this.addChild(n)
        }, d.prototype.createMask = function() {
            var t = new PIXI.Graphics;
            return t.beginFill(16777215), t.drawRect(-s.columns / 2 * h.WIDTH, -s.rows / 2 * h.HEIGHT, s.columns * h.WIDTH, s.rows * h.HEIGHT), t.endFill(), this.addChild(t)
        }, d.prototype.stopSpinning = function() {
            i.markNextToStop(-1)
        }, d.prototype.spinningStopped = function() {}, d.prototype.startSpinning = function() {
            for (var t = 0; t < this.reels.length; t++)
                i.canSpin(t) && (i.startSpinning(t), this.reels[t].startSpinning())
        }, d.prototype.show = function() {
            for (var t = 0; t < s.columns; t++)
                for (var e = 0; e < s.rows; e++) {
                    var n = this.getSymbol(t, e);
                    p.participateInCurrentWin(t, e) ? n.highlight() : n.obscure()
                }
        }, d.prototype.clearImmediately = function() {
            for (var t = 0; t < s.columns; t++)
                for (var e = 0; e < s.rows; e++)
                    this.getSymbol(t, e).clearImmediately()
        }, d.prototype.playWinAnimations = function() {
            new l(this, this.parent).play()
        }, d.prototype.createStickySymbols = function() {
            return this.addChild(new c)
        }, d.prototype.setAsSticky = function(t, e) {
            var n = this.getSymbol(t, e, !0),
                i = this.getChildIndex(n);
            this.removeChild(n), this.stickySymbols.addSymbol(t, e, n);
            var o = new h(n.type, t, e, this),
                s = u.getSymbolCoordinates(t, e);
            o.position.set(s.x, s.y), this.addChildAt(o, i), this.reels[t].setSymbolAt(e, o)
        }, d.prototype.setStickyAsNormal = function(t, e) {
            var n = this.getSymbol(t, e, !0),
                i = this.getChildIndex(n);
            this.removeChild(n);
            var o = this.stickySymbols.getSymbol(t, e);
            this.stickySymbols.removeChild(o), this.addChildAt(o, i), this.reels[t].setSymbolAt(e, o)
        }, d.prototype.getSymbol = function(t, e, n) {
            return !n && this.stickySymbols.hasSymbol(t, e) ? this.stickySymbols.getSymbol(t, e) : this.reels[t].getSymbol(e)
        }, d.prototype.getWidth = function() {
            return h.WIDTH * s.columns
        }, d
    }), _d("^!(", ["^#", "!"], function(t, e) {
        "use strict";
        function n() {
            PIXI.Container.call(this), e.bindAll(this)
        }
        return t.extend(n, PIXI.Container), n.prototype.play = function(t, e) {}, n
    }), _d("^!*", ["^@)", "^#", "!", "#", "$^", "#))", "#^*", "#^^"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {
            t.call(this), i.on("winPresentation/show", this.show), i.on("winPresentation/hide", this.hide), i.on("winPresentation/clear", this.clearImmediately)
        }
        return e.extend(h, t), h.prototype.show = function() {
            var t = this.getPrize(),
                e = this.getPrizePosition(),
                n = a.getSymbolCoordinates(e.column, e.row);
            this.x = n.x, this.y = n.y, this.createPrize(t)
        }, h.prototype.getPrizePosition = function() {
            var t = o.getCurrentLineToHighlight().line;
            return {
                column: 2,
                row: s.getPayline(t)[2]
            }
        }, h.prototype.getPrize = function() {
            return o.getCurrentLineToHighlight().prize
        }, h.prototype.clearImmediately = function() {
            this.hide()
        }, h
    }), _d("^!$", ["!", "^#", "#", "$^", "#))", "^!%"], function(t, e, n, i, o, s) {
        "use strict";
        function r() {
            s.call(this), t.bindAll(this), n.on("winPresentation/show", this.show), n.on("winPresentation/hide", this.hide), n.on("winPresentation/clear", this.clearImmediately)
        }
        return e.extend(r, s), r.prototype.show = function() {
            if (i.hasWinningLines()) {
                var t = i.getCurrentLineToHighlight().line,
                    e = o.getPayline(t);
                this.createPaylinePreview(t, e)
            }
        }, r.prototype.hide = function() {
            this.clear()
        }, r.prototype.clearImmediately = function() {
            this.clear()
        }, r
    }), _d("^@)", ["!", "^#"], function(e, t) {
        "use strict";
        function n(t) {
            this.removeAfterHide = t, PIXI.Container.call(this), e.bindAll(this)
        }
        return t.extend(n, PIXI.Container), n.prototype.createPrize = function(t) {
            var e = new PIXI.Text(t, this.getTextStyle());
            e.y = 5, e.anchor.set(.5), this.alpha = 0, TweenMax.to(this, .15, {
                alpha: 1
            }), this.text = this.addChild(e)
        }, n.prototype.getTextStyle = function() {
            return {
                fontFamily: "Verdana",
                fontWeight: "bold",
                fontSize: "80px",
                fill: "white"
            }
        }, n.prototype.hide = function() {
            this.onHideComplete()
        }, n.prototype.onHideComplete = function() {
            this.removeAfterHide ? this.parent.removeChild(this) : this.text && (this.removeChild(this.text), this.text = null)
        }, n
    }), _d("^@(", ["##^", "#^%", "^#", "(", "#"], function(n, o, t, i, s) {
        "use strict";
        function e(t, e) {
            this.symbol = t, this.type = e || t.type, this.direction = t.column < 3 ? 1 : -1, this.NUMBER_FONT = this.getNumberFont(), this.REWARD_FONT = this.getRewardFont(), this.PRIZE_OFFSET = this.getPrizeOffset(), this.NUMBER_OFFSET = this.getNumberOffset(), this.LEADING_OFFSET = this.getLeadingOffset(), n.call(this), this.click = this.tap = this.onClick, s.on("spin/begin", this.onClick), s.on("symbol/hideMiniPaytable", this.onClick)
        }
        return t.extend(e, n), e.prototype.getNumberFont = function() {
            return {
                fontWeight: "bold",
                fontSize: "41px",
                fontFamily: "Verdana",
                fill: "white"
            }
        }, e.prototype.getRewardFont = function() {
            return {
                fontWeight: "bold",
                fontSize: "41px",
                fontFamily: "Verdana",
                fill: "grey"
            }
        }, e.prototype.getPrizeOffset = function() {
            return {
                x: 105,
                y: 0
            }
        }, e.prototype.getNumberOffset = function() {
            return {
                x: 0,
                y: 0
            }
        }, e.prototype.getLeadingOffset = function() {
            return 130
        }, e.prototype.onClick = function() {
            this.click = this.tap = null, this.hide()
        }, e.prototype.show = function() {
            this.container = this.createContainer(), this.background = this.createBackground(), this.icon = this.createIcon(), this.createRewards(), n.prototype.show.call(this)
        }, e.prototype.createContainer = function() {
            var t = new PIXI.Container;
            return this.addChild(t)
        }, e.prototype.createBackground = function() {
            var t = PIXI.Sprite.fromFrame("images/machine/mini_paytable.png");
            return t.anchor.set(.5, .5), t.scale.x = this.direction, t.x = 60 * this.direction, this.container.addChild(t)
        }, e.prototype.createReward = function(t) {
            return new PIXI.Text(t, this.REWARD_FONT)
        }, e.prototype.createNumber = function(t) {
            return new PIXI.Text(t, this.NUMBER_FONT)
        }, e.prototype.createIcon = function() {
            var t = PIXI.Sprite.fromFrame("images/symbols/" + this.type.toLowerCase() + ".png");
            return t.anchor.set(.5, .5), this.container.addChild(t)
        }, e.prototype.createRewards = function() {
            for (var t = o.getSymbolPrizes(this.type), e = 0; e < t.length; e++) {
                var n = this.createNumber(t.length - e + 2);
                n.y = (e - t.length + .5) / 2 * this.LEADING_OFFSET + 85 + this.NUMBER_OFFSET.y, 1 === this.direction ? n.x = 60 + this.NUMBER_OFFSET.x : n.x = -(250 + this.NUMBER_OFFSET.x);
                var i = this.createReward(t[e]);
                i.x = n.x + this.PRIZE_OFFSET.x, i.y = n.y + this.PRIZE_OFFSET.y, this.container.addChild(i), this.container.addChild(n)
            }
        }, e.prototype.onResize = function() {
            n.prototype.onResize.call(this);
            var t = i.machine;
            this.container.scale.set(t.scale.x, t.scale.y);
            var e = 80 * this.direction;
            this.container.x = (this.symbol.x + t.symbolsContainer.x) * t.scale.x + t.x + e * this.container.scale.x, this.container.y = (this.symbol.y + t.symbolsContainer.y) * t.scale.y + t.y, this.icon.x = -e
        }, e.prototype.hide = function() {
            s.off("spin/begin", this.onClick), s.off("symbol/hideMiniPaytable", this.onClick), n.prototype.hide.call(this)
        }, e
    }), _d("^#!", ["^#", "!", "#"], function(t, e, n) {
        "use strict";
        function i() {
            PIXI.Container.call(this), e.bindAll(this), this.interactive = !0, n.on("game/resize", this.onResize), n.on("preloader/progress", this.setProgress), n.once("game/show", this.onHideComplete), n.emit("preloader/animationComplete")
        }
        return t.extend(i, PIXI.Container), i.prototype.onHideComplete = function() {
            n.off("game/resize", this.onResize), n.on("preloader/off", this.setProgress)
        }, i.prototype.onResize = function() {}, i.prototype.setProgress = function(t) {}, i
    }), _d("##^", ["^#", "@@", "!", "#"], function(t, i, o, s) {
        "use strict";
        function e(t, e, n) {
            PIXI.Container.call(this), o.bindAll(this), this.parentContainer = t || i.stage, this.animationTime = void 0 === e ? .2 : e, this.backgroundAlpha = void 0 === n ? .75 : n, this.interactive = !0, this.click = function() {}, this.onHideComplete = this.onHideComplete, this.onResize = this.onResize, this.overlay = this.createOverlay(), this.show(), s.on("game/resize", this.onResize), this.onResize()
        }
        return t.extend(e, PIXI.Container), e.prototype.createOverlay = function() {
            var t = new PIXI.Graphics;
            return t.drawRect(0, 0, 0, 0), this.addChild(t), t
        }, e.prototype.show = function() {
            this.parentContainer.addChild(this), this.alpha = 0, this.overlay.alpha = 0, TweenMax.to(this.overlay, this.animationTime, {
                alpha: this.backgroundAlpha
            }), TweenMax.to(this, this.animationTime, {
                alpha: 1,
                onComplete: this.onShowComplete
            })
        }, e.prototype.hide = function() {
            TweenMax.to(this, this.animationTime, {
                alpha: 0,
                onComplete: this.onHideComplete
            })
        }, e.prototype.onHideComplete = function() {
            s.off("game/resize", this.onResize), this.parent && this.parent.removeChild(this)
        }, e.prototype.onResize = function() {
            this.overlay.clear(), this.overlay.beginFill(0), this.overlay.drawRect(0, 0, i.renderer.width, i.renderer.height), this.overlay.endFill(), this.hitArea = new PIXI.Rectangle(0, 0, i.renderer.width, i.renderer.height)
        }, e
    }), _d("@#&", ["^#", "!", "#", "@%#", "@@", "@#*", "^#@", "@@!"], function(t, e, n, i, o, s, r, a) {
        "use strict";
        function h() {
            PIXI.Container.call(this), e.bindAll(this), this.PROGRESS_BAR_MAX_WIDTH = 350, this.PROGRESS_BAR_MARGIN = 10, this.animationComplete = !1, this.background = this.createBackground(), this.progressBar = this.createProgressBar(), this.logo = this.createLogoAnimation(), s.getLicense().hasPreloaderMessage() && this.createLoadingMessage(), n.on("game/resize", this.onResize), n.on("orientation/changed", this.onResize), n.on("preloader/progress", this.onProgress), o.isInnerClient() || n.once("splashScreen/show", this.onHide, n.PRIORITY_HIGH, !0), n.once("preloader/animationComplete", this.showProgressBar), this.onProgress(0), this.onResize()
        }
        return t.extend(h, PIXI.Container), h.prototype.onHide = function(t) {
            this.animationComplete ? t() : n.once("preloader/animationComplete", t)
        }, h.prototype.onAnimationComplete = function() {
            this.animationComplete = !0, n.emit("preloader/animationComplete")
        }, h.prototype.remove = function() {
            n.off("game/progress", this.onProgress), n.off("game/resize", this.onResize), n.off("orientation/changed", this.onResize)
        }, h.prototype.onResize = function() {
            this.logo.x = Math.round(o.game.renderer.width / 2), this.logo.y = Math.round(o.game.renderer.height / 2 - this.progressBar.height / 2), this.progressBar.x = Math.floor(o.game.renderer.width / 2), this.progressBar.y = this.logo.y + this.progressBar.height, this.background.clear(), this.background.beginFill(0), this.background.drawRect(0, 0, o.game.renderer.width, o.game.renderer.height), this.background.endFill(), this.resizeLoadingMessage()
        }, h.prototype.resizeLoadingMessage = function() {
            this.loadingMessage && (this.loadingMessage.setLoadingMessageStyle(), this.loadingMessage.x = o.game.renderer.width / 2, this.loadingMessage.y = o.renderer.height - this.loadingMessage.height / 2, this.checkLoadingMessageOverlap())
        }, h.prototype.checkLoadingMessageOverlap = function() {
            this.progressBar.y + this.progressBar.height / 2 > this.loadingMessage.y - this.loadingMessage.height / 2 && (this.progressBar.y = this.loadingMessage.y - this.progressBar.height / 2 - this.loadingMessage.height / 2, this.logo.y + this.logo.height / 2 > this.progressBar.y && (this.logo.y = this.progressBar.y - this.logo.height / 2))
        }, h.prototype.onProgress = function(t) {
            var e = this.progress.texture.width,
                n = t * this.PROGRESS_BAR_MAX_WIDTH;
            this.progress.width = Math.max(e, n)
        }, h.prototype.createProgressBar = function() {
            var t = new PIXI.Container;
            t.visible = !1;
            var e = PIXI.Sprite.fromFrame("images/preloader/loader_panel.png");
            e.anchor.set(.5, .5), t.addChild(e);
            var n = new a("images/preloader/progress_bar_filling.png", new PIXI.Rectangle(.5, .5, .5, .5));
            return n.anchor.set(0, .5), n.x = Math.floor(-this.PROGRESS_BAR_MAX_WIDTH / 2), n.blendMode = PIXI.BLEND_MODES.ADD_PIXI_V3, this.progress = t.addChild(n), this.addChild(t)
        }, h.prototype.createLoadingMessage = function() {
            this.loadingMessage = this.addChild(new r("images/preloader/info_background.png"))
        }, h.prototype.createLogoAnimation = function() {
            var t = i.fromFrames("images/preloader/yggdrasil_logo_seq_00000.png");
            return t.anchor.set(.5), t.play({
                loop: !1,
                onComplete: this.onAnimationComplete
            }), this.addChild(t)
        }, h.prototype.createBackground = function() {
            var t = new PIXI.Graphics;
            return this.addChild(t)
        }, h.prototype.showProgressBar = function() {
            this.progressBar.visible = !0
        }, h
    }), _d("^#@", ["^#", "!", "@@", "#@", "^!", "@@!", "@%$", "@#*"], function(t, n, r, e, a, i, o, s) {
        "use strict";
        function h(t, e) {
            PIXI.Container.call(this), n.bindAll(this), this.offset = e || {
                x: 20,
                y: 20
            }, this.loaderMessage = this.createLoadingMessageText(), this.loaderMessageBackground = this.createLoadingMessageBackground(t), this.licenseLogo = this.createLicenseLogo()
        }
        return t.extend(h, PIXI.Container), h.prototype.createLoadingMessageBackground = function(t) {
            var e = new i(t, new PIXI.Rectangle(.4, .4, .4, .4));
            return e.anchor.set(.5), this.addChildAt(e, 0)
        }, h.prototype.createLoadingMessageText = function() {
            var t = new PIXI.Text(e.get("preloaderMessage_" + s.getLicense().name), this.getLoadingMessageStyle());
            return t.anchor.set(.5), this.addChild(t)
        }, h.prototype.getLoadingMessageStyle = function() {
            var t = a.isPortraitMode() && r.showMobileUI;
            return {
                fontFamily: "Trebuchet MS, Helvetica, sans-serif",
                fontSize: (t ? 23 : 15) + "px",
                fill: "white",
                align: "center",
                wordWrap: !0,
                wordWrapWidth: t ? 750 : 500,
                wordWrapMin: 300
            }
        }, h.prototype.createLicenseLogo = function() {
            if (o.hasTexture(this.getLicenseLogoTextureId())) {
                var t = PIXI.Sprite.fromImage(this.getLicenseLogoTextureId());
                return t.anchor.set(.5, .5), this.addChild(t)
            }
        }, h.prototype.getLicenseLogoTextureId = function() {
            return o.hasTexture("images/old_preloader/logo_" + s.getLicense().name + ".png") ? "images/old_preloader/logo_" + s.getLicense().name + ".png" : o.hasTexture("images/preloader_custom/logo_" + s.getLicense().name + ".png") ? "images/preloader_custom/logo_" + s.getLicense().name + ".png" : "images/preloader/logo_" + s.getLicense().name + ".png"
        }, h.prototype.setLoadingMessageStyle = function(t, e) {
            var n = this.getLoadingMessageStyle();
            this.loaderMessage.style = t || n, this.calculateWrapping(), this.loaderMessage.dirty = !0, this.resizeLicenseLogo(e), this.resizeBackground()
        }, h.prototype.calculateWrapping = function() {
            this.canChangeWrapping() ? this.loaderMessage.style.wordWrapWidth = r.renderer.width - 50 : r.renderer.width < this.loaderMessage.style.wordWrapMin && (this.loaderMessage.style.wordWrapWidth = this.loaderMessage.style.wordWrapMin)
        }, h.prototype.resizeLicenseLogo = function(t) {
            if (this.licenseLogo) {
                var e = t || 1,
                    n = a.isPortraitMode() && r.showMobileUI,
                    i = n ? 60 : 40 / e,
                    o = n ? 30 : 60;
                this.licenseLogo.scale.set(1, 1);
                var s = i / this.licenseLogo.height;
                this.licenseLogo.scale.set(s, s), this.licenseLogo.x = n ? 0 : (this.licenseLogo.width - r.game.renderer.width / e) / 2 + o / 2, this.licenseLogo.y = n ? -(this.loaderMessageBackground.height + o) / 2 : 0, this.loaderMessage.y = n ? this.licenseLogo.y + (this.licenseLogo.height + this.loaderMessage.height + o) / 2 : 0, this.loaderMessageBackground.y = this.loaderMessage.y
            }
        }, h.prototype.resizeBackground = function() {
            this.loaderMessageBackground.width = this.loaderMessage.width + this.offset.x, this.loaderMessageBackground.height = this.loaderMessage.height + this.offset.y
        }, h.prototype.canChangeWrapping = function() {
            return r.renderer.width < this.loaderMessage.style.wordWrapWidth && r.renderer.width > this.loaderMessage.style.wordWrapMin
        }, h
    }), _d("^##", ["^#", "!", "@@", "^!", "%*@", "^!)", "@#*", "^@!", "%*^", "%*&", "@(@", "%^*", "%()", "##^", "#", "%)!", "%&%", "$)$", "%)%", "%@$", "$)#", "%$%", "@*", "^@^", "^@&", ")("], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d, f, g, y, m, S, b, w, I, v, C, T, x) {
        "use strict";
        function P() {
            PIXI.Container.call(this), e.bindAll(this), f.on("game/resize", this.onResize), f.on("popup/show", this.showPopup), f.on("popup/hide", this.hidePopup), f.on("spinner/show", this.showSpinner), f.on("spinner/hide", this.hideSpinner), f.on("freespins/introFinished", this.onFreeSpinsIntroEnd), f.on("freespins/outroFinished", this.onFreeSpinsOutroEnd, f.PRIORITY_LOW), f.on("boost/showButton", this.onBoostShowButton), f.on("boost/hideButton", this.onBoostHideButton), f.on("boost/showTopPanel", this.onBoostShowTopPanel), f.on("boost/hideTopPanel", this.onBoostHideTopPanel), f.on("boost/topBarStateChanged", this.onNewBoostTopBarStateChanged), this.background = this.createBackground(), this.machine = this.createMachine(), this.bonusGameLayer = this.createBonusGameLayer(), this.hud = this.createHUD(), this.foreground = this.createForeground(), this.optionsMenu = this.createOptionsMenu(), this.winEffectLayer = this.createWinEffectLayer(), this.clock = this.createClock(), this.gameName = this.createGameName(), this.replaySummary = this.createReplaySummary()
        }
        return t.extend(P, PIXI.Container), P.prototype.createMachine = function() {
            var t = new s;
            return this.addChild(t)
        }, P.prototype.createReplaySummary = function() {
            if (n.isReplayMode()) {
                var t;
                return t = n.isRewatch() ? new T : new C, this.addChild(t)
            }
        }, P.prototype.createHUD = function() {
            throw new Error("Abstract method")
        }, P.prototype.createBackground = function() {
            var t = new w;
            return this.addChildAt(t, 0)
        }, P.prototype.createWinEffectLayer = function() {
            return this.addChild(new PIXI.Container)
        }, P.prototype.createBonusGameLayer = function() {
            return this.addChild(new PIXI.Container)
        }, P.prototype.createClock = function() {
            var t = new m;
            return t.x = 10, t.y = 10, this.addChild(t)
        }, P.prototype.onResize = function() {
            this.getLayout().refresh()
        }, P.prototype.showPopup = function() {
            throw new Error("Abstract method")
        }, P.prototype.hidePopup = function() {
            throw new Error("Abstract method")
        }, P.prototype.showSpinner = function() {
            this.spinner = this.createSpinner(), this.getLayout().updateSpinner(this)
        }, P.prototype.createSpinner = function() {
            var t = new u;
            return this.addChild(t)
        }, P.prototype.hideSpinner = function() {
            this.spinner && (this.spinner.parent.removeChild(this.spinner), this.spinner = null)
        }, P.prototype.getLayout = function() {
            return this.layout = this.layout || new S(this), this.layout
        }, P.prototype.createOptionsMenu = function() {
            throw new Error("Abstract method")
        }, P.prototype.toggleAdditionalElements = function(t) {
            for (var e = this.getElementsToHide(), n = 0; n < e.length; n++)
                e[n] && (e[n].visible = t)
        }, P.prototype.getElementsToHide = function() {
            return [this.winEffectLayer]
        }, P.prototype.onFreeSpinsIntroEnd = function() {
            throw new Error("abstract method")
        }, P.prototype.onFreeSpinsOutroEnd = function() {
            throw new Error("abstract method")
        }, P.prototype.createForeground = function() {
            var t = new b;
            return this.addChild(t)
        }, P.prototype.createGameName = function() {
            var t = new I;
            return t.visible = r.getLicense().hasGameName(), this.addChild(t)
        }, P.prototype.setBoostVisibility = function(t) {
            this.promoButton && (this.promoButton.visible = t), this.promoBoostInfoButton && (this.promoBoostInfoButton.visible = t), this.promoPanel && (this.promoPanel.visible = t)
        }, P.prototype.onBoostShowButton = function(t) {
            this.removeBootButton(), this.promoButton = this.addChild(v.createButton(t)), this.getLayout().refresh()
        }, P.prototype.onBoostHideButton = function() {
            this.removeBootButton(), this.getLayout().refresh()
        }, P.prototype.onBoostShowTopPanel = function(t) {
            this.removeBoostPanel(), this.promoPanel = this.addChild(v.createTopPanel(t)), this.getLayout().refresh()
        }, P.prototype.onBoostHideTopPanel = function() {
            this.removeBoostPanel(), this.getLayout().refresh()
        }, P.prototype.removeBoostPanel = function() {
            this.promoPanel && (this.removeChild(this.promoPanel), this.promoPanel.removeListeners(), this.promoPanel = null)
        }, P.prototype.removeBootButton = function() {
            this.promoButton && (this.removeChild(this.promoButton), this.promoButton = null)
        }, P.prototype.onNewBoostTopBarStateChanged = function(t) {
            if (!t.visible && this.promoPanel)
                return this.removeBoostPanel(), void this.getLayout().refresh();
            var e = t.height * n.getScaleFactor() * n.getMetaInitialScale();
            t.visible && (!this.promoPanel || this.promoPanel.height !== e) && (this.removeBoostPanel(), this.promoPanel = new x(e), this.getLayout().refresh())
        }, P
    }), _d("@#)", ["^#", "^##", "@@", "^!", "%*@", "^!)", "^@!", "%*^", "%*&", "$)#", "%^*", "%()", "##^", "#", "%)!", "%)^", "%#%"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d, f, g, y) {
        "use strict";
        function m() {
            e.call(this)
        }
        return t.extend(m, e), m.prototype.createPopupMachine = function() {
            var t = new r;
            return t.scale.linkTo(this.machine.scale), t.position.linkTo(this.machine.position), this.addChildAt(t, this.getChildIndex(this.machine))
        }, m.prototype.createHUD = function() {
            var t = new c;
            return this.addChild(t)
        }, m.prototype.createPopupHUD = function(t) {
            var e = new f(this.hud, t);
            return e.position.linkTo(this.hud.position), e.scale.linkTo(this.hud.scale), this.addChildAt(e, this.getChildIndex(this.hud))
        }, m.prototype.onResize = function() {
            this.background.onResize(), e.prototype.onResize.call(this)
        }, m.prototype.createOptionsMenu = function() {
            var t = new a;
            return this.addChild(t)
        }, m.prototype.showPopup = function(t) {
            this.hud.visible = !1, this.machine.visible = !1, this.removePopupHud(), this.popupMachine = this.popupMachine || this.createPopupMachine(), this.popupMachine.visible = !0, this.popupHud = this.createPopupHUD(t.pagination), this.toggleAdditionalElements(!1), this.hideReplaySummary()
        }, m.prototype.hidePopup = function() {
            this.hud.visible = !0, this.machine.visible = !0, this.popupMachine.visible = !1, this.removePopupHud(), this.toggleAdditionalElements(!0), this.showReplaySummary()
        }, m.prototype.showReplaySummary = function() {
            this.replaySummary && (this.replaySummary.visible = !0)
        }, m.prototype.hideReplaySummary = function() {
            this.replaySummary && (this.replaySummary.visible = !1)
        }, m.prototype.removePopup = function() {
            this.popupMachine && (this.removeChild(this.popupMachine), this.popupMachine.position.unlinkAll(), this.popupMachine.scale.unlinkAll(), this.popupMachine = null)
        }, m.prototype.removePopupHud = function() {
            this.popupHud && (this.removeChild(this.popupHud), this.popupHud.position.unlinkAll(), this.popupHud.scale.unlinkAll(), this.popupHud = null)
        }, m.prototype.getLayout = function() {
            return this.layout = this.layout || new g(this), this.layout
        }, m.prototype.onFreeSpinsIntroEnd = function() {
            this.hud.createFreeSpinsPanel()
        }, m.prototype.onFreeSpinsOutroEnd = function() {
            this.hud.removeFreeSpinsPanel()
        }, m
    }), _d("@$!", ["^#", "^##", "@@", "^!", "%*$", "%*@", "^!)", "^@!", "%*^", "%*&", "$)#", "%^*", "%()", "##^", "#", "%)!", "%&%", "$)$", "%)&", "%)(", "%#$"], function(t, e, i, o, n, s, r, a, h, p, u, c, l, d, f, g, y, m, S, b, w) {
        "use strict";
        function I() {
            e.call(this), this.spinPanel = this.createSpinPanel(), this.stopAutoSpinPanel = this.createStopAutoSpinPanel(), this.swipeMenu = this.createSwipeMenu(), this.setChildIndex(this.winEffectLayer, this.children.length - 1), f.on("orientation/changed", this.onOrientationChanged, f.PRIORITY_LOWEST)
        }
        return t.extend(I, e), I.prototype.getLayout = function() {
            return this.landscape = this.landscape || new S(this), this.portrait = this.portrait || new b(this), o.isPortraitMode() ? this.portrait : this.landscape
        }, I.prototype.showPopup = function() {
            this.hidePopup(), this.blurLayer = this.createBlurLayer(), f.on("game/resize", this.showPopupOnNextTick)
        }, I.prototype.showPopupOnNextTick = function() {
            f.once("game/update", this.showPopup)
        }, I.prototype.hidePopup = function() {
            f.off("game/resize", this.showPopupOnNextTick), this.removeChild(this.blurLayer), this.blurLayer = null
        }, I.prototype.createBlurLayer = function() {
            if (o.isIEMobile() || o.isAndroid())
                return new PIXI.Container;
            var t = PIXI.RenderTexture.create(i.renderer.width, i.renderer.height, PIXI.SCALE_MODES.LINEAR, .5),
                e = new PIXI.filters.BlurFilter;
            e.blur = 4, this.filters = [e], i.renderer.render(this, t), this.filters = null;
            var n = new PIXI.Sprite(t);
            return this.addChild(n)
        }, I.prototype.createHUD = function() {
            var t = new c;
            return this.addChild(t)
        }, I.prototype.onResize = function() {
            this.background.onResize(), e.prototype.onResize.call(this)
        }, I.prototype.onOrientationChanged = function() {
            this.getLayout().refresh()
        }, I.prototype.createSpinPanel = function() {
            var t = new s;
            return t.refreshButtonsAlpha(), this.addChild(t)
        }, I.prototype.createStopAutoSpinPanel = function() {
            var t = new n;
            return t.normalImage.alpha = this.spinPanel.LANDSCAPE_ALPHA, this.addChild(t)
        }, I.prototype.createSwipeMenu = function() {
            var t = new y;
            return t.visible = !1, this.addChild(t)
        }, I.prototype.showSwipeMenu = function(t) {
            this.getLayout().showSwipeMenu(t)
        }, I.prototype.hideSwipeMenu = function(t) {
            this.getLayout().hideSwipeMenu(t, this)
        }, I.prototype.createOptionsMenu = function() {
            var t = new p;
            return this.addChild(t)
        }, I.prototype.createFreeSpinsPanel = function() {
            var t = new w,
                e = this.getChildIndex(this.hud);
            this.freeSpinsPanel = this.addChildAt(t, e + 1)
        }, I.prototype.onFreeSpinsIntroEnd = function() {
            this.createFreeSpinsPanel(), this.getLayout().refresh()
        }, I.prototype.onFreeSpinsOutroEnd = function() {
            this.removeChild(this.freeSpinsPanel), this.freeSpinsPanel = null, this.getLayout().refresh()
        }, I
    }), _d("^#$", ["^#", "@$!", "@@", "%#!", "%%)", "#", "%*%", "%$(", "^!", "%&#", "%*#", "%)*", "%))", "%$)"], function(t, e, n, i, o, s, r, a, h, p, u, c, l, d) {
        "use strict";
        function f() {
            e.call(this), this.EXTRA_SHIFT_OFFSET = 30, this.burgerMenuButton = this.createBurgerMenuButton(), this.autoSpinMenu = this.createAutoSpinMenu(), this.betMenu = this.createBetPanelMenu(), this.burgerMenu = this.createBurgerMenu(), s.on("autospin/start", this.onAutoSpinStart), s.on("burgerMenu/click", this.onBurgerClicked), (n.isRewatch() || n.isReplayMode()) && (this.burgerMenuButton.visible = !1), this.currentShift = 0
        }
        return t.extend(f, e), f.prototype.createHUD = function() {
            var t = new p;
            return this.addChild(t)
        }, f.prototype.createSpinPanel = function() {
            var t = new u;
            return t.refreshButtonsAlpha(), this.addChild(t)
        }, f.prototype.onResize = function() {
            this.background.onResize(), e.prototype.onResize.call(this)
        }, f.prototype.disableResize = function() {
            this.resizeDisabled = !0, s.off("game/resize", this.onResize)
        }, f.prototype.enableResize = function() {
            this.resizeDisabled && (this.resizeDisabled = !1, s.on("game/resize", this.onResize))
        }, f.prototype.onOrientationChanged = function() {
            this.background.onResize(), this.getLayout().refresh()
        }, f.prototype.createOptionsMenu = function() {
            return new PIXI.Container
        }, f.prototype.createBurgerMenuButton = function() {
            return this.addChild(new i)
        }, f.prototype.createStopAutoSpinPanel = function() {
            var t = new r;
            return t.normalImage.alpha = this.spinPanel.LANDSCAPE_ALPHA, this.addChild(t)
        }, f.prototype.getLayout = function() {
            return this.landscape = this.landscape || new c(this), this.portrait = this.portrait || new l(this), h.isPortraitMode() ? this.portrait : this.landscape
        }, f.prototype.onAutoSpinStart = function() {
            this.getLayout().updateStopAutoSpinPanelPosition(this)
        }, f.prototype.createBurgerMenu = function() {
            return new o
        }, f.prototype.createAutoSpinMenu = function() {
            return new a({
                onPanelOpen: n.isLossLimitEnabled() ? this.onPanelMoreExpanded : this.onPanelOpen,
                onPanelClose: this.onPanelClose,
                onPanelMoreExpanded: this.onPanelMoreExpanded,
                onPanelLessExpanded: this.onPanelOpen
            })
        }, f.prototype.createBetPanelMenu = function() {
            return new d({
                onPanelOpen: this.onPanelOpen,
                onPanelClose: this.onPanelClose
            })
        }, f.prototype.onPanelOpen = function() {
            var t = h.isPortraitMode() ? .45 : .25;
            this.getLayout().onSwipeMenuOpened(Math.round(n.renderer.height * t))
        }, f.prototype.onPanelMoreExpanded = function() {
            var t = h.isPortraitMode() ? .15 : .25;
            this.getLayout().onSwipeMenuOpened(Math.round(n.renderer.height * t))
        }, f.prototype.onPanelClose = function() {
            this.resizeDisabled && this.enableResize(), this.getLayout().onSwipeMenuClosed()
        }, f.prototype.onBurgerClicked = function() {
            this.burgerMenu.toggle()
        }, f
    }), _d("@@!", ["^#"], function(t) {
        function e(t, e) {
            var n = this.getNormalizedTexture(t),
                i = this.getCornerSizes(n, e);
            this.anchor = new PIXI.Point(0, 0), PIXI.mesh.NineSlicePlane.call(this, n, i[0], i[1], i[2], i[3])
        }
        return t.extend(e, PIXI.mesh.NineSlicePlane), e.prototype.getNormalizedTexture = function(t) {
            var e = PIXI.Texture.fromFrame(t),
                n = new PIXI.Texture(e);
            return n.frame = e.frame.clone(), n
        }, e.prototype.getCornerSizes = function(t, e) {
            if (!e || !t)
                return [10, 10, 10, 10];
            var n = [];
            return n.push(e.x * t.width), n.push(e.y * t.height), n.push(e.width * t.width), n.push(e.height * t.height), n
        }, e.prototype.refreshEmulatedAnchor = function() {
            this.pivot.set(this.width * this.anchor.x, this.height * this.anchor.y)
        }, e.prototype.updateTransform = function() {
            this.refreshEmulatedAnchor(), PIXI.Container.prototype.updateTransform.call(this)
        }, e
    }), _d("#^&", ["^#", "@%#"], function(t, n) {
        "use strict";
        function e() {
            PIXI.Container.call(this), this.spinificationFrame = this.createFrame()
        }
        return t.extend(e, PIXI.Container), e.prototype.createFrame = function(t) {
            var e = n.fromFrames(t || "images/spinification/spinification_seq_00000.png");
            return e.anchor.set(.5), e.play({
                loop: !0
            }), this.addChild(e)
        }, e
    }), _d("@(@", ["^#"], function(t) {
        "use strict";
        function e(t) {
            PIXI.Container.call(this), this.background = this.createBackground(), this.spinner = this.createSpinner(t), this.rotationStepCounter = 0, this.ROTATION_STEP = Math.PI / 6
        }
        return t.extend(e, PIXI.Container), e.prototype.createBackground = function() {
            var t = new PIXI.Graphics;
            return t.beginFill(0, .75), t.drawRoundedRect(-100, -100, 200, 200, 20), t.endFill(), this.addChild(t)
        }, e.prototype.createSpinner = function(t) {
            var e = PIXI.Sprite.fromFrame(t || "images/hud/spinner.png");
            return e.anchor.set(.5, .5), this.addChild(e)
        }, e.prototype.updateTransform = function() {
            this.rotationStepCounter++, this.rotationStepCounter % 2 == 0 && (this.spinner.rotation += this.ROTATION_STEP), PIXI.Container.prototype.updateTransform.call(this)
        }, e
    }), _d("@$#", ["^#", "!", "#", "@@", "@$", "@%", "@*(", "@*)", "@(!", "^!", "@%$", "$$&", "#@"], function(t, e, n, r, i, o, s, a, h, p, u, c, l) {
        "use strict";
        function d() {
            e.bindAll(this), PIXI.Container.call(this), n.on("game/resize", this.onResize), n.once("splashScreen/destroy", this.onDestroy), this.isInPortrait = null, this.baseScreenSize = {
                portrait: {
                    width: 945,
                    height: 1680
                },
                landscape: {
                    width: 1680,
                    height: 945
                }
            }, this.background = this.createBackground(), this.gameLogo = this.createGameLogo(), this.screen1 = this.createScreen1(), this.screenText1 = this.createScreenText1(this.screen1), this.screen2 = this.createScreen2(), this.screenText2 = this.createScreenText2(this.screen2), this.middleText = this.createMiddleText(), this.continueAnimation = this.createContinueAnimation(), this.interactive = !0, this.buttonMode = !0, this.click = this.tap = this.onClick, this.layoutCalculator = this.createLayoutCalculator(c), this.onResize(), this.animateContinue(), this.animateScreens()
        }
        return t.extend(d, PIXI.Container), d.prototype.onClick = function() {
            n.emit("game/show"), this.onDestroy()
        }, d.prototype.onDestroy = function() {
            n.off("game/resize", this.onResize), u.destroyText(this.middleText), u.destroyText(this.screenText1), u.destroyText(this.screenText2), u.destroyText(this.continueAnimation.continueText), this.stopAnimatingContinue()
        }, d.prototype.getBaseScreenSize = function() {
            return p.isPortraitMode() ? this.baseScreenSize.portrait : this.baseScreenSize.landscape
        }, d.prototype.createLayoutCalculator = function(t) {
            var e = {
                background: new a(this.background),
                gameLogo: new a(this.gameLogo),
                screen1: new a(this.screen1),
                screenText1: new h(this.screenText1, !0),
                screen2: new a(this.screen2),
                screenText2: new h(this.screenText2, !0),
                middleText: new h(this.middleText),
                continueAnimation: new a(this.continueAnimation)
            };
            return new s(e, t, r.renderer.width, r.renderer.height)
        }, d.prototype.createBackground = function() {
            var t = PIXI.Sprite.fromFrame("images/splash_screen_background.jpg");
            return t.anchor.set(.5, .5), this.addChild(t)
        }, d.prototype.createText = function(t, e) {
            var n = new PIXI.Text(t, e);
            if ((!e.wordWrap || e.fitInWrapWidth) && n.width > e.wordWrapWidth) {
                var i = Number(isNaN(e.fontSize) ? e.fontSize.match(/\d+/).pop() : e.fontSize),
                    o = isNaN(e.fontSize) ? e.fontSize.match(/\D+/).pop() : null;
                e.fontSize = Math.round(i * (e.wordWrapWidth / n.width)), o && (e.fontSize += o), n.style = e
            }
            return n
        }, d.prototype.getTitleStyle = function(t) {
            return {
                fontFamily: "Verdana",
                fontSize: "35px",
                fontWeight: "bold",
                fill: "#ffffff",
                stroke: "black",
                strokeThickness: 3,
                wordWrap: p.isPortraitMode(),
                wordWrapWidth: t,
                align: "center"
            }
        }, d.prototype.getDescriptionStyle = function(t) {
            return {
                fontFamily: "Verdana",
                fontSize: "25px",
                fontWeight: "bold",
                fill: "#ffffff",
                wordWrap: !0,
                wordWrapWidth: t,
                align: "center"
            }
        }, d.prototype.getContinueDescriptionStyle = function(t) {
            return {
                fontFamily: "Verdana",
                fontSize: "25px",
                fontWeight: "bold",
                fill: "#ffffff",
                wordWrap: !0,
                fitInWrapWidth: !0,
                wordWrapWidth: t,
                align: "center",
                padding: 1
            }
        }, d.prototype.recreateMiddleText = function() {
            this.middleText && this.removeChild(this.middleText), this.middleText = this.createMiddleText()
        }, d.prototype.createMiddleText = function() {
            var t = this.createText(l.get("splashScreen_title"), this.getTitleStyle(.96 * this.getBaseScreenSize().width));
            return t.anchor.set(.5, .5), this.addChild(t)
        }, d.prototype.createScreen1 = function() {
            var t = PIXI.Sprite.fromFrame("images/splash_screen/splash_screen_left.png");
            return t.anchor.set(.5, .5), this.addChild(t)
        }, d.prototype.createScreenText1 = function(t) {
            var e = this.createText(l.get("splashScreen_screen1Description"), this.getDescriptionStyle(t.width - 150));
            return e.anchor.set(.5, 0), this.addChild(e)
        }, d.prototype.createScreen2 = function() {
            var t = PIXI.Sprite.fromFrame("images/splash_screen/splash_screen_right.png");
            return t.anchor.set(.5, .5), this.addChild(t)
        }, d.prototype.createScreenText2 = function(t) {
            var e = this.createText(l.get("splashScreen_screen2Description"), this.getDescriptionStyle(t.width - 150));
            return e.anchor.set(.5, 0), this.addChild(e)
        }, d.prototype.createContinueAnimation = function() {
            var t = new PIXI.Container,
                e = this.createContinueAnimationBackground(t);
            e.anchor.set(.5, .5), t.addChild(e);
            var n,
                i,
                o = this.createContinueComponent("splash_continue_ripple_smaller", t),
                s = this.createContinueComponent("splash_continue_ripple_larger", t);
            return r.showMobileUI ? (n = this.createText(l.get("splashScreen_tapToStart"), this.getContinueDescriptionStyle(.75 * e.width)), (i = this.createContinueComponent("splash_continue_icon_hand", t)).scale.set(.7, .7)) : (n = this.createText(l.get("splashScreen_clickToStart"), this.getContinueDescriptionStyle(.8 * e.width)), (i = this.createContinueComponent("splash_continue_icon_arrow", t)).scale.set(.7, .7)), n.anchor.set(.5, .5), t.addChild(n), t.background = e, t.smallCircle = o, t.bigCircle = s, t.continueText = n, t.icon = i, this.addChild(t)
        }, d.prototype.createContinueAnimationBackground = function(t) {
            var e;
            return (r.showMobileUI, e = this.createContinueComponent("splash_continue_bg", t)).alpha = 1, e
        }, d.prototype.updateContinueAnimation = function() {
            p.isPortraitMode() ? this.continueAnimation.background.scale.set(1, 1) : this.continueAnimation.background.scale.set(1, -1)
        }, d.prototype.animateContinue = function() {
            r.showMobileUI ? this.animateContinueMobile() : this.animateContinueDesktop()
        }, d.prototype.animateContinueMobile = function() {
            this.continueAnimation.icon.x = 180, this.continueAnimation.icon.scale.set(.7, .7), this.continueAnimation.smallCircle.x = -40, this.continueAnimation.smallCircle.alpha = 0, this.continueAnimation.smallCircle.scale.set(.5, .5), this.continueAnimation.bigCircle.x = -40, this.continueAnimation.bigCircle.alpha = 0, this.continueAnimation.bigCircle.scale.set(.5, .5), TweenMax.to(this.continueAnimation.continueText, .4, {
                alpha: 0
            }), TweenMax.to(this.continueAnimation.icon, 1.2, {
                x: -20,
                delay: .4,
                ease: Sine.easeIn
            }), TweenMax.to(this.continueAnimation.icon, .4, {
                alpha: 1,
                delay: .4
            }), TweenMax.to(this.continueAnimation.smallCircle.scale, .3, {
                x: 1,
                y: 1,
                yoyo: !0,
                repeat: 3,
                delay: 1.3
            }), TweenMax.to(this.continueAnimation.smallCircle, .3, {
                alpha: 1,
                yoyo: !0,
                repeat: 3,
                delay: 1.3
            }), TweenMax.to(this.continueAnimation.bigCircle.scale, .3, {
                x: 1,
                y: 1,
                yoyo: !0,
                repeat: 3,
                delay: 1.45
            }), TweenMax.to(this.continueAnimation.bigCircle, .3, {
                alpha: 1,
                yoyo: !0,
                repeat: 3,
                delay: 1.45
            }), TweenMax.to(this.continueAnimation.icon, .4, {
                alpha: 0,
                delay: 2.4
            }), TweenMax.to(this.continueAnimation.icon, .3, {
                x: 60,
                yoyo: !0,
                repeat: 2,
                delay: 1.4
            }), TweenMax.to(this.continueAnimation.continueText, .4, {
                alpha: 1,
                delay: 2.8
            }), this.continueAnimationTimeout = i(this.animateContinue, 5)
        }, d.prototype.animateContinueDesktop = function() {
            this.continueAnimation.icon.x = 120, this.continueAnimation.icon.y = 120, this.continueAnimation.smallCircle.x = 0, this.continueAnimation.smallCircle.alpha = 0, this.continueAnimation.smallCircle.scale.set(.5, .5), this.continueAnimation.bigCircle.x = 0, this.continueAnimation.bigCircle.alpha = 0, this.continueAnimation.bigCircle.scale.set(.5, .5), TweenMax.to(this.continueAnimation.continueText, .4, {
                alpha: 0
            }), TweenMax.to(this.continueAnimation.icon, .6, {
                x: 20,
                y: 30,
                delay: .4,
                ease: Sine.easeIn
            }), TweenMax.to(this.continueAnimation.icon, .4, {
                alpha: 1,
                delay: .4
            }), TweenMax.to(this.continueAnimation.smallCircle.scale, .3, {
                x: 1.2,
                y: 1.2,
                yoyo: !0,
                repeat: 1,
                delay: 1.05
            }), TweenMax.to(this.continueAnimation.smallCircle, .3, {
                alpha: 1,
                yoyo: !0,
                repeat: 1,
                delay: 1.05
            }), TweenMax.to(this.continueAnimation.bigCircle.scale, .3, {
                x: 1.2,
                y: 1.2,
                yoyo: !0,
                repeat: 1,
                delay: 1.1
            }), TweenMax.to(this.continueAnimation.bigCircle, .3, {
                alpha: 1,
                yoyo: !0,
                repeat: 1,
                delay: 1.1
            }), TweenMax.to(this.continueAnimation.icon, .4, {
                alpha: 0,
                delay: 1.5
            }), TweenMax.to(this.continueAnimation.icon, .3, {
                x: 40,
                y: 60,
                yoyo: !0,
                repeat: 0,
                delay: 1.1
            }), TweenMax.to(this.continueAnimation.continueText, .4, {
                alpha: 1,
                delay: 2
            }), this.continueAnimationTimeout = i(this.animateContinue, 4)
        }, d.prototype.createContinueComponent = function(t, e) {
            var n = PIXI.Sprite.fromFrame("images/splash_screen/" + t + ".png");
            return n.anchor.set(.5, .5), n.alpha = 0, e.addChild(n), n
        }, d.prototype.createGameLogo = function() {
            var t = PIXI.Sprite.fromFrame("images/splash_screen/splash_logo_game.png");
            return t.anchor.set(.5, 0), this.addChild(t)
        }, d.prototype.onResize = function() {
            var t = this.isInPortrait;
            this.isInPortrait = p.isPortraitMode(), t !== this.isInPortrait && this.onOrientationChanged(), this.resetContinueAnimation(), this.layoutCalculator.resize(r.renderer.width, r.renderer.height), this.revertContinueAnimation()
        }, d.prototype.onOrientationChanged = function() {
            this.updateMiddleText(), this.updateContinueAnimation(), this.animateScreens()
        }, d.prototype.updateMiddleText = function() {
            this.recreateMiddleText(), this.layoutCalculator.getLayoutElement("middleText").setPixiElement(this.middleText)
        }, d.prototype.animateScreens = function() {
            this.stopScreensAnimations(), p.isPortraitMode() ? this.animateScreensPortrait() : this.animateScreensLandscape()
        }, d.prototype.stopScreensAnimations = function() {
            TweenMax.killTweensOf(this.screen1), TweenMax.killTweensOf(this.screen2), TweenMax.killTweensOf(this.screenText1), TweenMax.killTweensOf(this.screenText2)
        }, d.prototype.animateScreensPortrait = function() {
            this.screen1.alpha = 0, TweenMax.to(this.screen1, .5, {
                alpha: 0,
                repeat: -1,
                repeatDelay: 5.5,
                delay: 2.5,
                overwrite: "none"
            }), TweenMax.to(this.screen1, .5, {
                alpha: 1,
                repeat: -1,
                repeatDelay: 5.5,
                delay: 0,
                overwrite: "none"
            }), this.screenText1.alpha = 1, TweenMax.to(this.screenText1, .5, {
                alpha: 0,
                repeat: -1,
                repeatDelay: 5.5,
                delay: 2.5,
                overwrite: "none"
            }), TweenMax.to(this.screenText1, .5, {
                alpha: 1,
                repeat: -1,
                repeatDelay: 5.5,
                delay: 0,
                overwrite: "none"
            }), this.screen2.alpha = 0, TweenMax.to(this.screen2, .5, {
                alpha: 0,
                repeat: -1,
                repeatDelay: 5.5,
                delay: 5.5,
                overwrite: "none"
            }), TweenMax.to(this.screen2, .5, {
                alpha: 1,
                repeat: -1,
                repeatDelay: 5.5,
                delay: 3,
                overwrite: "none"
            }), this.screenText2.alpha = 0, TweenMax.to(this.screenText2, .5, {
                alpha: 0,
                repeat: -1,
                repeatDelay: 5.5,
                delay: 5.5,
                overwrite: "none"
            }), TweenMax.to(this.screenText2, .5, {
                alpha: 1,
                repeat: -1,
                repeatDelay: 5.5,
                delay: 3,
                overwrite: "none"
            })
        }, d.prototype.animateScreensLandscape = function() {
            this.screenText1.alpha = 1, this.screenText2.alpha = 1, this.screen1.alpha = 1, this.screen2.alpha = 1
        }, d.prototype.resetContinueAnimation = function() {
            r.showMobileUI || (this.continueAnimation.icon.backX = this.continueAnimation.icon.x, this.continueAnimation.icon.backY = this.continueAnimation.icon.y, this.continueAnimation.icon.x = 0, this.continueAnimation.icon.y = 0, this.continueAnimation.smallCircle.scale.set(.5, .5), this.continueAnimation.bigCircle.scale.set(.5, .5))
        }, d.prototype.revertContinueAnimation = function() {
            r.showMobileUI || (this.continueAnimation.icon.x = this.continueAnimation.icon.backX, this.continueAnimation.icon.y = this.continueAnimation.icon.backY)
        }, d.prototype.stopAnimatingContinue = function() {
            o(this.continueAnimationTimeout)
        }, d.prototype.killContinueAnimationTweens = function() {
            for (var t = 0; t < this.continueAnimation.children.length; ++t)
                TweenMax.killTweensOf(this.continueAnimation.children[t])
        }, d
    }), _d("%@^", ["^#", "!", "^#%", "@$", "@%", "@@", "@#$", "@*!"], function(t, n, o, i, e, s, r, a) {
        "use strict";
        function h(t, e) {
            PIXI.Container.call(this), this.name = t, this.clickHandler = e, this.disabledAlpha = .7, n.bindAll(this), this._enabled = !0, this.anchor = new PIXI.ObservablePoint(this.onAnchorChanged, 0, 0), this.isMouseOver = !1, this.addListeners(this), this.updateTextures(t), this.normalImage = this.createNormalImage()
        }
        return t.extend(h, PIXI.Container), h.prototype.addListeners = function(t) {
            this.hitObject = t, this.hitObject.buttonMode = !0, this.hitObject.interactive = !0, this.hitObject.mouseover = this.onMouseOver, this.hitObject.mouseout = this.onMouseOut, this.hitObject.touchstart = this.hitObject.mousedown = this.onMouseDown, this.hitObject.mouseup = this.onMouseUp, this.hitObject.touchend = this.hitObject.touchendoutside = this.hitObject.mouseupoutside = this.onMouseOut, this.hitObject.click = this.hitObject.tap = this.onClick
        }, h.prototype.removeListeners = function() {
            this.hitObject.buttonMode = !1, this.hitObject.interactive = !1, this.hitObject.mouseover = null, this.hitObject.mouseout = null, this.hitObject.touchstart = this.hitObject.mousedown = null, this.hitObject.mouseup = null, this.hitObject.touchend = this.hitObject.touchendoutside = this.hitObject.mouseupoutside = null, this.hitObject.click = this.hitObject.tap = null, this.hitObject = null
        }, h.prototype.updateTextures = function(t) {
            this.normalTexture = this.getTexture("images/" + t + "_normal.png"), this.overTexture = this.getTexture("images/" + t + "_over.png"), this.downTexture = this.getTexture("images/" + t + "_down.png") || this.getTexture("images/" + t + "_selected.png") || this.overTexture
        }, h.prototype.createNormalImage = function() {
            return this.normalImage = new PIXI.Sprite(this.normalTexture), this.normalImage.anchor.set(this.anchor.x, this.anchor.y), this.addChild(this.normalImage)
        }, h.prototype.setTexture = function(t) {
            this.normalImage.texture = t
        }, h.prototype.getTexture = function(t) {
            return PIXI.utils.TextureCache[t] ? PIXI.Texture.fromFrame(t) : null
        }, h.prototype.onClick = function(t) {
            this.clickHandler && this.clickHandler(t)
        }, h.prototype.onMouseOver = function(t) {
            this.isMouseOver = !0, this.normalImage.texture = this.overTexture || this.normalTexture, this.showTooltip(t)
        }, h.prototype.onMouseOut = function() {
            this.isMouseOver = !1, this.hitObject.mouseout = this.onMouseOut, this.normalImage.texture = this.normalTexture, this.removeTooltip()
        }, h.prototype.onMouseDown = function() {
            this.hitObject.mouseout = null, this.normalImage.texture = this.downTexture || this.normalTexture, this.removeTooltip()
        }, h.prototype.onMouseUp = function() {
            this.hitObject.mouseout = this.onMouseOut, this.normalImage.texture = this.overTexture || this.normalTexture
        }, h.prototype.createIcon = function(t) {
            var e = t || this.name,
                n = PIXI.Sprite.fromFrame("images/" + e + "_icon.png");
            n.anchor.set(.5, .5), this.icon = this.addChild(n)
        }, h.prototype.showTooltip = function(t) {
            if (s.isDesktop) {
                var e = this.getTooltipText();
                e && (this.tooltipTimeout = i(function() {
                    this.tooltipElement = this.createTooltip(e, t), r.addEventListener("mousemove", this.removeTooltip)
                }.bind(this), 1))
            }
        }, h.prototype.createTooltip = function(t, e) {
            var n = new o(t),
                i = e.data.global;
            return n.x = i.x, n.y = i.y - n.height, s.stage.addChild(n)
        }, h.prototype.removeTooltip = function() {
            e(this.tooltipTimeout), this.tooltipElement && (this.tooltipElement.destroy(!!this.tooltipElement._texture), this.tooltipElement.parent && this.tooltipElement.parent.removeChild(this.tooltipElement)), this.tooltipElement = null, r.removeEventListener("mousemove", this.removeTooltip)
        }, h.prototype.getTooltipText = function() {
            return this.tooltip
        }, h.prototype.setLabel = function(t, e) {
            var n = new PIXI.Text(t, e);
            n.anchor.set(this.anchor.x, this.anchor.y), this.label = this.addChild(n)
        }, h.prototype.setEnabled = function(t) {
            this._enabled = t, this.hitObject.buttonMode = t, this.hitObject.interactive = t;
            var e = this.disabledElement || this.icon;
            e && (e.alpha = t ? 1 : this.disabledAlpha * this.normalImage.alpha), t || (this.onMouseOut(), this._over = !1)
        }, h.prototype.switchToAlphaHit = function() {
            var t = new PIXI.Container;
            t.alpha = 0, t.hitArea = new a(this.normalImage, this.getAlphaHitOptions()), this.addChild(t), this.removeListeners(), this.addListeners(t)
        }, h.prototype.getAlphaHitOptions = function() {
            return {}
        }, h.prototype.onAnchorChanged = function() {
            this.normalImage.anchor = this.anchor
        }, Object.defineProperty(h.prototype, "enabled", {
            get: function() {
                return this._enabled
            },
            set: function(t) {
                this.setEnabled(t)
            }
        }), h
    }), _d("))", ["^#", "!", "@@!"], function(t, o, i) {
        "use strict";
        function e(t, e, n, i) {
            PIXI.Container.call(this), o.bindAll(this), this.clickHandler = i, this.labelPadding = 40, this._backgroundIdle = null, this._backgroundHover = null, this._backgroundDown = null, this._hitObject = null, this._label = null, this.updateImages(n), this.createLabel(t, e), this.refreshView(), this.addListeners(this), this._backgroundIdle.visible = !0
        }
        return t.extend(e, PIXI.Container), e.prototype.getImage = function(t, e) {
            var n = new i("images/" + t + "_" + e + ".png", new PIXI.Rectangle(.45, 0, .15, .5));
            return n.anchor.set(.5, .5), n
        }, e.prototype.updateImages = function(t) {
            this.removeBackground(this._backgroundIdle), this.removeBackground(this._backgroundHover), this.removeBackground(this._backgroundDown), this._backgroundIdle = null, this._backgroundHover = null, this._backgroundDown = null, this.registerHover(this.getImage(t, "over")), this.registerDown(this.getImage(t, "down")), this.registerIdle(this.getImage(t, "normal")), this._backgroundIdle.visible = !0
        }, e.prototype.removeBackground = function(t) {
            t && this.removeChild(t)
        }, e.prototype.addListeners = function(t) {
            this._hitObject && this.removeListeners(), this._hitObject = t, this._hitObject.buttonMode = !0, this._hitObject.interactive = !0, this._hitObject.mouseover = this.onMouseOver, this._hitObject.mouseout = this.onMouseOut, this._hitObject.touchstart = this._hitObject.mousedown = this.onMouseDown, this._hitObject.mouseup = this.onMouseUp, this._hitObject.touchend = this._hitObject.touchendoutside = this._hitObject.mouseupoutside = this.onMouseOut, this._hitObject.click = this._hitObject.tap = this.onClick
        }, e.prototype.removeListeners = function() {
            this._hitObject.buttonMode = !1, this._hitObject.interactive = !1, this._hitObject.mouseover = null, this._hitObject.mouseout = null, this._hitObject.touchstart = this.hitObject.mousedown = null, this._hitObject.mouseup = null, this._hitObject.touchend = this.hitObject.touchendoutside = this.hitObject.mouseupoutside = null, this._hitObject.click = this.hitObject.tap = null, this._hitObject = null
        }, e.prototype.createLabel = function(t, e) {
            this._label = new PIXI.Text(t, e), this._label.anchor.set(.5, .5), this.addChild(this._label)
        }, e.prototype.registerIdle = function(t) {
            this._backgroundIdle = t, this.initBkg(this._backgroundIdle)
        }, e.prototype.registerHover = function(t) {
            this._backgroundHover = t, this.initBkg(this._backgroundHover)
        }, e.prototype.registerDown = function(t) {
            this._backgroundDown = t, this.initBkg(this._backgroundDown)
        }, e.prototype.initBkg = function(t) {
            t.visible = !1, this.addChildAt(t, 0)
        }, e.prototype.onMouseOver = function() {
            this._backgroundHover && (this._backgroundHover.visible = !0, this._backgroundIdle.visible = !1)
        }, e.prototype.onMouseOut = function() {
            this._backgroundHover && (this._backgroundHover.visible = !1), this._backgroundIdle.visible = !0
        }, e.prototype.onMouseDown = function() {
            this._backgroundDown && (this._backgroundDown.visible = !0, this._backgroundIdle.visible = !1)
        }, e.prototype.onMouseUp = function() {
            this._backgroundDown && (this._backgroundDown.visible = !1), this._backgroundIdle.visible = !0
        }, e.prototype.onClick = function(t) {
            this.clickHandler && this.clickHandler(t), this.onMouseUp()
        }, e.prototype.refreshView = function() {
            this._backgroundIdle.width = this.labelPadding + this._label.width + this.labelPadding, this._backgroundHover && (this._backgroundHover.width = this._backgroundIdle.width), this._backgroundDown && (this._backgroundDown.width = this._backgroundIdle.width)
        }, e
    }), _d("%!$", ["!", "#"], function(n, e) {
        "use strict";
        function t(t, e) {
            n.bindAll(this), this.target = t, this.callbacks = e, this.position = new PIXI.Point, this.last = new PIXI.Point, this.velocity = new PIXI.Point, this.time = 0, this.onDown = this.onMouseDown, this.onUp = this.onMouseUp
        }
        return t.prototype.onMouseDown = function(t) {
            this.position = new PIXI.Point(t.targetTouches[0].clientX, t.targetTouches[0].clientY), this.velocity.set(0, 0), this.onMove = this.onMouseMove, this.last.copy(this.position), e.on("game/update", this.onUpdate), this.callbacks.onStart()
        }, t.prototype.onMouseUp = function() {
            this.onMove = null, this.callbacks.onComplete(this.velocity.x, this.velocity.y), e.off("game/update", this.onUpdate)
        }, t.prototype.onUpdate = function(t) {
            var e = this.position.y - this.last.y;
            this.velocity.set(0, e / t), this.last.copy(this.position)
        }, t.prototype.onMouseMove = function(t) {
            var e = new PIXI.Point(t.targetTouches[0].clientX, t.targetTouches[0].clientY),
                n = e.x - this.position.x,
                i = e.y - this.position.y;
            this.callbacks.onMove(n, i), this.position = e
        }, Object.defineProperty(t.prototype, "onDown", {
            set: function(t) {
                this.target.mousedown = this.target.touchstart = t, this.target.addEventListener("touchstart", t)
            }
        }), Object.defineProperty(t.prototype, "onMove", {
            set: function(t) {
                this.target.mousemove = this.target.touchmove = t, this.target.addEventListener("touchmove", t)
            }
        }), Object.defineProperty(t.prototype, "onUp", {
            set: function(t) {
                this.target.mouseup = this.target.mouseupoutside = t, this.target.touchend = this.target.touchendoutside = t, this.target.addEventListener("touchend", t)
            }
        }), t
    }), _d("^#^", ["!", "#"], function(n, e) {
        "use strict";
        function t(t, e) {
            n.bindAll(this), this.target = t, this.callbacks = e, this.position = new PIXI.Point, this.last = new PIXI.Point, this.velocity = new PIXI.Point, this.time = 0, this.onDown = this.onMouseDown, this.onUp = this.onMouseUp
        }
        return t.prototype.onMouseDown = function(t) {
            this.position = this.target.toLocal(t.data.global), this.velocity.set(0, 0), this.onMove = this.onMouseMove, this.last.copy(this.position), e.on("game/update", this.onUpdate), this.callbacks.onStart()
        }, t.prototype.onMouseUp = function() {
            this.onMove = null, this.callbacks.onComplete(this.velocity.x, this.velocity.y), e.off("game/update", this.onUpdate)
        }, t.prototype.onUpdate = function(t) {
            var e = this.position.y - this.last.y;
            this.velocity.set(0, e / t), this.last.copy(this.position)
        }, t.prototype.onMouseMove = function(t) {
            var e = this.target.toLocal(t.data.global),
                n = e.x - this.position.x,
                i = e.y - this.position.y;
            this.callbacks.onMove(n, i), this.position = e
        }, Object.defineProperty(t.prototype, "onDown", {
            set: function(t) {
                this.target.mousedown = this.target.touchstart = t
            }
        }), Object.defineProperty(t.prototype, "onMove", {
            set: function(t) {
                this.target.mousemove = this.target.touchmove = t
            }
        }), Object.defineProperty(t.prototype, "onUp", {
            set: function(t) {
                this.target.mouseup = this.target.mouseupoutside = t, this.target.touchend = this.target.touchendoutside = t
            }
        }), t
    }), _d("^#&", ["^#", "#^^", "^@#"], function(t, a, h) {
        "use strict";
        function e(t, e, n) {
            PIXI.Container.call(this), this.drawLine(t, e, n)
        }
        return t.extend(e, PIXI.Container), e.prototype.drawLine = function(t, e, n) {
            for (var i = [], o = 0; o < e.length; o++) {
                var s = a.getSymbolCoordinates(o, e[o]);
                i.push(s)
            }
            this.removeUnusedPoints(i), n && (i.unshift(this.extendsEnd(i, 0, 1)), i.push(this.extendsEnd(i, i.length - 1, i.length - 2)));
            var r = this.createLine(t, i);
            this.addChild(r)
        }, e.prototype.extendsEnd = function(t, e, n) {
            var i = t[e].x - t[n].x,
                o = t[e].y - t[n].y,
                s = Math.sqrt(i * i + o * o);
            i /= s;
            var r = 0 == (o /= s) ? h.WIDTH : h.WIDTH * Math.sqrt(2) - 5;
            return {
                x: t[e].x + i * r * .5,
                y: t[e].y + o * r * .5
            }
        }, e.prototype.createLine = function(t, e) {
            var n = new PIXI.mesh.Rope(PIXI.Texture.fromFrame(t), e);
            return n.canvasPadding = 1.5, n
        }, e.prototype.removeUnusedPoints = function(t) {
            this.removeIfCollinear(t, 0), this.removeIfCollinear(t, 1), this.removeIfCollinear(t, t.length - 3)
        }, e.prototype.removeIfCollinear = function(t, e) {
            this.collinear(t[e], t[e + 1], t[e + 2]) && t.splice(e + 1, 1)
        }, e.prototype.collinear = function(t, e, n) {
            return (e.x - t.x) * (n.y - t.y) == (n.x - t.x) * (e.y - t.y)
        }, e
    }), _d("%!%", ["!", "#"], function(n, a) {
        "use strict";
        function t(t, e) {
            n.bindAll(this), this.target = t, this.callbacks = e, this.snapToGrid = !1, this.gridSize = 0, this.velocity = 0
        }
        return t.prototype.onClick = function() {
            this.stopScrolling()
        }, t.prototype.stopScrolling = function() {
            this.scroll && (a.off("game/update", this.scroll), this.scroll = null)
        }, t.prototype.snapToGridWithSize = function(t) {
            this.snapToGrid = !0, this.gridSize = t
        }, t.prototype.run = function(t, e) {
            this.stopScrolling();
            var n = e,
                i = this.calculateTargetPosition(t, n),
                o = 0,
                s = t,
                r = 0;
            this.scroll = function(t) {
                o += t;
                var e = (r = i - n * Math.exp(-o / .4)) - s;
                this.scrollBy(e), s = r, Math.abs(e) <= .05 && (this.scrollBy(i - s), this.callbacks.onComplete(), this.stopScrolling())
            }.bind(this), a.on("game/update", this.scroll)
        }, t.prototype.scrollBy = function(t) {
            this.velocity = t, this.callbacks.onScroll(t)
        }, t.prototype.calculateTargetPosition = function(t, e) {
            var n = t + e;
            return this.snapToGrid && (n = Math.round(n / this.gridSize) * this.gridSize), n
        }, t
    }), _d("%&%", ["^#", "!", "#", "@@", "#)", "$!", "^#*", "^#(", "^#)", "#@", "#@&"], function(t, e, n, i, o, s, r, a, h, p, u) {
        "use strict";
        function c() {
            PIXI.Container.call(this), e.bindAll(this), this.background = this.createBackground(), this.isOpen = !1, this.betPicker = this.createBetPicker(), this.autoSpinPicker = this.createAutoSpinPicker(), this.autoSpinPicker.visible = !1, o.on("bet/changed", this.onBetChanged), this.onBetChanged()
        }
        return c.BET_PICKER = "betPicker", c.AUTOSPIN_PICKER = "autospinPicker", t.extend(c, PIXI.Container), c.prototype.createBackground = function() {
            var t = new PIXI.Graphics;
            return t.beginFill(0), t.drawRect(0, 0, 300, i.renderer.height), t.endFill(), this.addChild(t)
        }, c.prototype.createBetPicker = function() {
            var t = new r({
                data: this.getAvailableBets(),
                cellRenderer: a,
                snapToGrid: !0,
                onStopping: this.onBetSelected,
                onSelected: this.onBetSelected,
                onSelectedClick: this.onBetSelectedClick,
                title: "coinValue"
            });
            return this.addChild(t)
        }, c.prototype.getAvailableBets = function() {
            return o.availableBets.length <= 7 ? o.availableBets.concat(o.availableBets) : o.availableBets
        }, c.prototype.createAutoSpinPicker = function() {
            var t = new r({
                data: s.autoSpins,
                cellRenderer: h,
                snapToGrid: !0,
                onSelectedClick: this.onAutoSpinSelectedClick,
                title: "autospin"
            });
            return t.setSelectedIndex(s.autoSpins.length - 1), this.addChild(t)
        }, c.prototype.showPicker = function(t) {
            this.betPicker.visible = t === c.BET_PICKER, this.autoSpinPicker.visible = t === c.AUTOSPIN_PICKER, this.onBetChanged()
        }, c.prototype.onBetChanged = function() {
            this.betPicker.setSelectedValue(o.bet)
        }, c.prototype.onBetSelected = function(t) {
            this.isOpen && this.betPicker.visible && (u.add(u.SWIPE_MENU_ON_BET_SELECTED, t), o.bet = t)
        }, c.prototype.onBetSelectedClick = function(t) {
            this.onBetSelected(t), n.emit("swipeMenu/hide")
        }, c.prototype.onAutoSpinSelectedClick = function(t) {
            n.emit("autospin/prepareSpins")
        }, c.prototype.getSelectedAutoSpinsNumber = function() {
            return this.autoSpinPicker.stopScrolling(), this.autoSpinPicker.getSelectedValue()
        }, c.prototype.layoutLandscape = function() {
            this.background.clear(), this.background.beginFill(0), this.background.drawRect(0, 0, 300, i.renderer.height), this.background.endFill(), this.betPicker.x = this.autoSpinPicker.x = 0, this.isOpen || (this.reloadPicker(this.betPicker, !0), this.reloadPicker(this.autoSpinPicker, !0))
        }, c.prototype.reloadPicker = function(t, e) {
            t.options.size = this.background.height, t.setSize(this.background.width, this.background.height), t.reload(), t.hitArea = new PIXI.Rectangle(0, 0, this.background.width, this.background.height);
            var n = t.title.style;
            n.wordWrap = e, t.title.style = n, t.title.y = 1.2 * t.title.height
        }, c.prototype.layoutPortrait = function() {
            var t = i.renderer.width;
            this.background.clear(), this.background.beginFill(0), this.background.drawRect(0, 0, t, 350), this.background.endFill();
            var e = .5 * (t - this.betPicker.marker.width);
            this.betPicker.x = this.autoSpinPicker.x = e, this.isOpen || (this.reloadPicker(this.betPicker), this.reloadPicker(this.autoSpinPicker)), this.betPicker.hitArea.x = this.autoSpinPicker.hitArea.x = -e
        }, c.prototype.getPortraitHeight = function() {
            return 350
        }, c.prototype.getLandscapeWidth = function() {
            return 300
        }, c
    }), _d("%$!", ["^#", "%@^"], function(t, n) {
        "use strict";
        function e(t, e) {
            n.call(this, t, e), this.canUnselect = !0, this.selectedImage = this.createSelectedImage(), this.selected = !1
        }
        return t.extend(e, n), e.prototype.onClick = function(t) {
            !this.canUnselect && this.selected || (this.selected = !this.selected, n.prototype.onClick.call(this, t))
        }, e.prototype.updateTextures = function() {
            n.prototype.updateTextures.call(this, this.name), this.overSelectedTexture = this.getTexture("images/" + this.name + "_over_selected.png"), this.selectedTexture = this.getTexture("images/" + this.name + "_selected.png")
        }, e.prototype.createSelectedImage = function() {
            var t = new PIXI.Sprite(this.selectedTexture);
            return t.anchor.linkTo(this.anchor), this.addChild(t)
        }, e.prototype.onMouseOver = function() {
            n.prototype.onMouseOver.apply(this, arguments), this.selected && (this.selectedImage.texture = this.overSelectedTexture || this.selectedTexture)
        }, e.prototype.onMouseOut = function() {
            n.prototype.onMouseOut.apply(this, arguments), this.selected && (this.selectedImage.texture = this.selectedTexture || this.normalTexture)
        }, e.prototype.onMouseDown = function() {
            n.prototype.onMouseDown.apply(this, arguments), this.selected ? this.selectedImage.texture = this.overTexture || this.normalTexture : this.normalImage.texture = this.overSelectedTexture || this.selectedTexture
        }, e.prototype.onMouseUp = function() {
            n.prototype.onMouseUp.apply(this, arguments), this.selected ? this.selectedImage.texture = this.overSelectedTexture || this.selectedTexture : this.normalImage.texture = this.overTexture || this.normalTexture
        }, e.prototype.setTexture = function(t) {
            this.normalImage.texture = t, this.selectedImage.texture = t
        }, e.prototype.setTextures = function() {
            this.isMouseOver ? (this.normalImage.texture = this.overTexture || this.normalTexture, this.selectedImage.texture = this.overSelectedTexture || this.selectedTexture) : (this.normalImage.texture = this.normalTexture, this.selectedImage.texture = this.selectedTexture || this.normalTexture)
        }, e.prototype.createIcon = function(t) {
            this.iconName = t || this.name, this.normalIconTexture = this.getTexture("images/" + this.iconName + "_icon.png"), this.selectedIconTexture = this.getTexture("images/" + this.iconName + "_icon_selected.png");
            var e = new PIXI.Sprite(this.normalIconTexture);
            e.anchor.set(.5, .5), this.icon = this.addChild(e)
        }, e.prototype.setIconTexture = function(t) {
            this.icon && t && (this.icon.texture = t)
        }, e.prototype.getTooltipText = function() {
            return this.selected ? this.tooltipSelected || this.tooltip : this.tooltipDeselected || this.tooltip
        }, e.prototype.onAnchorChanged = function() {
            n.prototype.onAnchorChanged.call(this), this.selectedImage.anchor = this.anchor
        }, Object.defineProperty(e.prototype, "selected", {
            get: function() {
                return this._selected
            },
            set: function(t) {
                this._selected = t, this.setTexturesVisibility(t), this.setTextures(), this.setIconTexture(t ? this.selectedIconTexture : this.normalIconTexture)
            }
        }), e.prototype.setTexturesVisibility = function(t) {
            this.selectedImage.visible = t, this.normalImage.visible = !t
        }, e
    }), _d("^#%", ["^#", "@@"], function(t, s) {
        "use strict";
        function r(t) {
            PIXI.Container.call(this), this.PADDING = 6, this.HEIGHT = 20, this.label = this.createLabel(t), this.createBackground(), this.cacheAsBitmap = !0
        }
        return t.extend(r, PIXI.Container), r.fromText = function(t, e) {
            var n = new r(t),
                i = e.data.global;
            n.x = i.x, n.y = i.y - n.height;
            var o = i.x + n.width;
            return o > s.renderer.width && (n.x -= o - s.renderer.width), s.stage.addChild(n)
        }, r.prototype.createLabel = function(t) {
            var e = new PIXI.Text(t, {
                fontFamily: "Verdana",
                fontSize: "14px",
                fill: "white",
                dropShadow: !0,
                dropShadowColor: "black"
            });
            return e.x = this.PADDING, e.y = this.PADDING, this.addChild(e)
        }, r.prototype.createBackground = function() {
            var t = new PIXI.Graphics;
            return t.beginFill(0, .75), t.drawRoundedRect(0, 0, this.width + this.PADDING + this.PADDING / 2, this.height + this.PADDING, 8), t.endFill(), this.addChildAt(t, 0)
        }, r.prototype.destroy = function() {
            PIXI.Container.prototype.destroy.apply(this, arguments), this.label.destroy()
        }, r
    }), _d("^#*", ["^#", "!", "#", "^$!", "^$@", "@@", "^#^", "%!%", "&%", "#@"], function(t, e, n, i, o, s, r, a, h, p) {
        "use strict";
        function u(t) {
            PIXI.Container.call(this), e.bindAll(this), this.interactive = !0, this.options = this.parseOptions(t), this.content = this.createContent(), this.movementTracker = this.createMovementTracker(), this.scroller = this.createScroller(), this.marker = this.createMarker(), this.title = this.createTitle(), this.moving = !1, this.velocity = 0, this.click = this.tap = this.onSelectedCellClick, this._height = this.options.size
        }
        return t.extend(u, PIXI.Container), u.prototype.parseOptions = function(t) {
            var e = function() {};
            return t.renderer = t.renderer || o, t.size = t.size || s.renderer.height, t.movingThreshold = t.movingThreshold || 5, t.stoppingThreshold = t.stoppingThreshold || 20, t.onStopping = t.onStopping || e, t.onSelected = t.onSelected || e, t.onSelectedClick = t.onSelectedClick || e, t.onIndexChanged = this.onIndexChanged, t
        }, u.prototype.createContent = function() {
            var t = new i(this.options);
            return this.addChild(t)
        }, u.prototype.createMarker = function() {
            var t = new PIXI.Container;
            return t.lineTop = t.addChild(PIXI.Sprite.fromFrame("images/hud/value_picker_marker.png")), t.lineBottom = t.addChild(PIXI.Sprite.fromFrame("images/hud/value_picker_marker.png")), t.lineTop.anchor.x = t.lineBottom.anchor.x = .5, t.lineTop.anchor.y = t.lineBottom.anchor.y = .5, t.lineTop.y = .5 * -this.content.getCellSize(), t.lineBottom.y = .5 * this.content.getCellSize(), t.x = .5 * t.width, t.y = .5 * this.options.size, this.addChild(t)
        }, u.prototype.createMovementTracker = function() {
            return new r(this, {
                onStart: this.onMouseStart,
                onMove: this.onMouseMove,
                onComplete: this.onMouseMoveComplete
            })
        }, u.prototype.onMouseStart = function() {
            this.scroller.stopScrolling()
        }, u.prototype.onMouseMove = function(t, e) {
            this.moveBy(e)
        }, u.prototype.moveBy = function(t) {
            this.moving = !0, this.velocity = t, this.content.moveBy(t)
        }, u.prototype.onMouseMoveComplete = function(t, e) {
            var n = h.clamp(e, -700, 700);
            Math.abs(n) < 5 && (n = this.content.getDistanceToCenter()), this.scroller.run(this.content.currentPosition, n)
        }, u.prototype.createScroller = function() {
            var t = new a(this, {
                onScroll: this.onScroll,
                onComplete: this.onScrollComplete
            });
            return this.options.snapToGrid && t.snapToGridWithSize(this.content.getCellSize()), t
        }, u.prototype.onScroll = function(t) {
            this.moveBy(t), this.moving = Math.abs(t) >= this.options.movingThreshold
        }, u.prototype.onScrollComplete = function() {
            this.options.onSelected(this.content.getSelectedValue())
        }, u.prototype.onSelectedCellClick = function(t) {
            if (!this.moving) {
                var e = t.data.getLocalPosition(this.marker);
                this.marker.getLocalBounds().contains(e.x, e.y) && this.options.onSelectedClick(this.content.getSelectedValue())
            }
        }, u.prototype.stopScrolling = function() {
            this.scroller.stopScrolling(), this.onMouseMoveComplete(0, 0)
        }, u.prototype.getSelectedValue = function() {
            return this.content.getSelectedValue()
        }, u.prototype.setSelectedIndex = function(t) {
            this.content.setSelectedIndex(t)
        }, u.prototype.setSelectedValue = function(t) {
            var e = this.options.data.indexOf(t);
            0 <= e && this.setSelectedIndex(e)
        }, u.prototype.onIndexChanged = function() {
            Math.abs(this.velocity) < this.options.stoppingThreshold && this.options.onStopping(this.getSelectedValue())
        }, u.prototype.reload = function() {
            this.scroller.snapToGridWithSize(this.content.getCellSize()), this.content.reload(), this.marker.lineTop.y = .5 * -this.content.getCellSize(), this.marker.lineBottom.y = .5 * this.content.getCellSize()
        }, u.prototype.setSize = function(t, e) {
            var n = .5 * (e - this.options.size);
            this.content.y = n, this.marker.y = .5 * this.options.size + n
        }, u.prototype.createTitle = function() {
            var t = new PIXI.Text(p.get(this.options.title), {
                fontFamily: "Verdana",
                fontWeight: "bold",
                fontSize: "20pt",
                fill: "white",
                align: "center",
                wordWrap: !0,
                wordWrapWidth: 200
            });
            return t.anchor.set(.5, .5), t.x = .5 * this.marker.width, t.y = 1.2 * t.height, this.addChild(t)
        }, u
    }), _d("^#)", ["^#", "^#(", "$!"], function(t, e, n) {
        "use strict";
        function i(t) {
            e.call(this, t)
        }
        return t.extend(i, e), i.prototype.reload = function(t) {
            this.label.text = n.format(t)
        }, i
    }), _d("^#(", ["^#", "^$@", "^!", "^&"], function(t, e, n, i) {
        "use strict";
        function o(t) {
            e.call(this, t), this.pickerContent = t, this.label = this.createLabel()
        }
        return t.extend(o, e), o.prototype.createLabel = function() {
            var t = new PIXI.Text("", {
                fontFamily: "Verdana",
                fontSize: "45px",
                fill: "white"
            });
            return this.addChild(t)
        }, o.prototype.getBounds = function() {
            return this.getSizeBasedOnOrientation()
        }, o.prototype.getSizeBasedOnOrientation = function() {
            return this.landscaleSize = this.landscaleSize || new PIXI.Rectangle(0, 0, 300, 100), this.portraitSize = this.portraitSize || new PIXI.Rectangle(0, 0, 300, 70), n.isPortraitMode() ? this.portraitSize : this.landscaleSize
        }, o.prototype.reload = function(t) {
            this.label.text = i.formatStringFloatPrecision(t, 2), this.label.updateText()
        }, o.prototype.moved = function() {
            var t = Math.abs(this.pickerContent.center - this.y) / (2.5 * this.height),
                e = 1 - .4 * t,
                n = 1 - .6 * t;
            this.label.alpha = Math.max(1 - t, 0), this.label.scale.set(e, n), this.label.position.set(.5 * this.width - .5 * this.label.width, .5 * this.height - .5 * this.label.height)
        }, o
    }), _d("^$@", ["^#", "!"], function(t, e) {
        "use strict";
        function n(t) {
            PIXI.Container.call(this), e.bindAll(this)
        }
        return t.extend(n, PIXI.Container), n.prototype.reload = function(t) {}, n.prototype.moved = function(t) {}, n
    }), _d("^$!", ["^#", "!"], function(t, e) {
        "use strict";
        function n(t) {
            PIXI.Container.call(this), e.bindAll(this), this.options = t, this.currentPosition = 0, this.currentIndex = 0, this.center = 0, this.cells = this.createCells(), this.reload()
        }
        return t.extend(n, PIXI.Container), n.prototype.createCells = function() {
            for (var t = [], e = this.options.data; e.length > t.length;) {
                var n = new this.options.cellRenderer(this);
                this.addChild(n), t.push(n)
            }
            return t
        }, n.prototype.reload = function() {
            this.center = .5 * (this.options.size - this.cells[0].height);
            for (var t = this.options.data, e = 0; e < t.length; e++)
                this.cells[e].reload(t[e]), this.cells[e].y = e * this.cells[e].height + this.center;
            this.currentPosition = 0, this.currentIndex = 0, this.moveBy(0)
        }, n.prototype.getCellSize = function() {
            return 0 < this.cells.length ? this.cells[0].height : 0
        }, n.prototype.moveBy = function(t) {
            for (var e = this.getCellSize(), n = this.cells.length * e, i = 0; i < this.cells.length; i++)
                this.cells[i].y += t, this.cells[i].y >= n - e && 0 <= t && (this.cells[i].y -= n), this.cells[i].y <= -e && t < 0 && (this.cells[i].y += n), this.cells[i].moved();
            this.currentPosition += t, this.checkIndexChanged()
        }, n.prototype.checkIndexChanged = function() {
            this.currentIndex !== this.getSelectedIndex() && (this.currentIndex = this.getSelectedIndex(), this.options.onIndexChanged())
        }, n.prototype.getIndexBasedOnPosition = function(t) {
            var e = this.options.data,
                n = Math.round(t / this.getCellSize());
            return 0 < n && (n = e.length * this.getCellSize() - n), Math.abs(n) % e.length
        }, n.prototype.getSelectedIndex = function() {
            return this.getIndexBasedOnPosition(this.currentPosition)
        }, n.prototype.getSelectedValue = function() {
            return this.options.data[this.getSelectedIndex()]
        }, n.prototype.setSelectedIndex = function(t) {
            if (this.getSelectedIndex() !== t) {
                var e = this.getSelectedIndex() - t;
                this.moveBy(e * this.getCellSize())
            }
        }, n.prototype.getSelectedCell = function() {
            return this.cells[this.getSelectedIndex()]
        }, n.prototype.getDistanceToCenter = function() {
            return this.center - this.getSelectedCell().y
        }, n
    }), _d("$$!", ["@@"], function(t) {
        "use strict";
        function e() {}
        return Object.defineProperty(e.prototype, "stage", {
            get: function() {
                return t.stage
            }
        }), Object.defineProperty(e.prototype, "root", {
            get: function() {
                return t.game.root
            }
        }), Object.defineProperty(e.prototype, "machine", {
            get: function() {
                return this.root.machine
            }
        }), Object.defineProperty(e.prototype, "hud", {
            get: function() {
                return this.root.hud
            }
        }), Object.defineProperty(e.prototype, "symbolsContainer", {
            get: function() {
                return this.machine.symbolsContainer
            }
        }), Object.defineProperty(e.prototype, "stickyContainer", {
            get: function() {
                return this.symbolsContainer.stickySymbols
            }
        }), e.prototype.getSymbol = function(t, e, n) {
            return this.symbolsContainer.getSymbol(t, e, n)
        }, Object.defineProperty(e.prototype, "frame", {
            get: function() {
                return this.machine.frame
            }
        }), e
    }), _d("^$#", ["^#", "!", "$^", "#", "@&(", "@$", "@#@"], function(t, e, n, i, o, s, r) {
        "use strict";
        function a(t) {
            PIXI.Container.call(this), e.bindAll(this), this.title = this.createTitle(), this.label = this.createLabel(), this.onCompleteCallback = t
        }
        return t.extend(a, PIXI.Container), a.prototype.createTitle = function() {
            var t = new PIXI.Text("BIG WIN!", {
                fontFamily: "Arial",
                fontSize: "110px",
                fill: "white"
            });
            return t.anchor.set(.5, 1), this.addChild(t)
        }, a.prototype.createLabel = function() {
            var t = new PIXI.Text(0, {
                fontFamily: "Arial",
                fontSize: "150px",
                fill: "white"
            });
            return t.anchor.set(.5, 0), this.addChild(t)
        }, a.prototype.showPrize = function() {
            this.counter = o(this.onUpdate, this.onCountingComplete, this.getPrize())
        }, a.prototype.onUpdate = function(t, e) {
            var n = Math.min(this.calculatePrize(t), e);
            return this.updatePrize(n), e <= n
        }, a.prototype.getPrize = function() {
            return n.getTotalLineWin()
        }, a.prototype.onCountingComplete = function() {
            this.onComplete()
        }, a.prototype.updatePrize = function(t) {
            this.label.text = t
        }, a.prototype.calculatePrize = function(t) {
            return Math.round(50 * t + Math.pow(t, 3))
        }, a.prototype.skip = function() {
            this.counter || this.showPrize(), this.cleanUp(), this.updatePrize(this.getPrize()), this.onCountingComplete()
        }, a.prototype.cleanUp = function() {
            r(this.counter), this.counter = null
        }, a.prototype.isCounting = function() {
            return this.counter
        }, a.prototype.close = function() {
            this.onCompleteCallback = null
        }, a.prototype.onComplete = function() {
            this.onCompleteCallback && this.onCompleteCallback()
        }, a
    }), _d("^$$", ["^#", "!", "#", "@@", "^$#"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            PIXI.Container.call(this), e.bindAll(this), this.overlay = this.createOverlay(), this.counter = this.createCounter(), n.on("game/resize", this.onResize), this.onResize(), this.click = this.tap = this.onClick, this.interactive = !0, this.wasCanceled = !1, n.emit("bigwin/shown")
        }
        return t.extend(s, PIXI.Container), s.prototype.createOverlay = function() {
            var t = new PIXI.Graphics;
            return t.beginFill(0), t.drawRect(0, 0, i.renderer.width, i.renderer.height), t.endFill(), t.alpha = .1, this.addChild(t)
        }, s.prototype.onClick = function() {
            this.wasCanceled ? (this.click = this.tap = null, this.forceHide()) : (this.wasCanceled = !0, this.cancelCountUp(), n.emit("bigwin/cancelCountUp"))
        }, s.prototype.cancelCountUp = function() {
            TweenMax.killTweensOf(this.counter), this.counter.alpha = 1, this.counter.skip()
        }, s.prototype.forceHide = function() {
            this.counter.close()
        }, s.prototype.createCounter = function() {
            var t = new o(this.onCounterComplete);
            return this.addChild(t)
        }, s.prototype.onCounterComplete = function() {
            this.hide()
        }, s.prototype.hide = function() {
            n.off("game/resize", this.onResize), this.parent.removeChild(this), n.emit("winPopup/finished")
        }, s.prototype.onResize = function() {
            var t = i.game.root.winEffectLayer;
            this.overlay.width = (i.renderer.width + 100) / t.scale.x, this.overlay.height = (i.renderer.height + 100) / t.scale.y, this.overlay.x = -t.x / t.scale.x - 50, this.overlay.y = -t.y / t.scale.y - 50
        }, s
    }), _d("^$%", ["^#", "!", "$^", "#"], function(t, e, n, i) {
        "use strict";
        function o() {
            PIXI.Container.call(this), e.bindAll(this), this.label = this.createLabel(), this.showPrize(), i.once("initialAnimation/skip", this.onSkip), i.once("machine/click", this.onSkip), this.emitAllowSkip()
        }
        return t.extend(o, PIXI.Container), o.prototype.emitAllowSkip = function() {
            i.emit("skipPresentation/allowSkip")
        }, o.prototype.createLabel = function() {
            var t = new PIXI.Text(0, this.getTextStyle());
            return t.y = 120, t.anchor.set(.5, .5), this.addChild(t)
        }, o.prototype.getTextStyle = function() {
            return {
                fontFamily: "Arial",
                fontSize: "150px",
                fill: "black"
            }
        }, o.prototype.showPrize = function() {
            this.prize = 0;
            var t = this.getPrize();
            TweenMax.to(this, this.getAnimationTime(t), {
                prize: t,
                onUpdate: this.onUpdate,
                onComplete: this.onCountingComplete,
                ease: Linear.easeNone
            })
        }, o.prototype.getPrize = function() {
            return n.getTotalLineWin()
        }, o.prototype.getAnimationTime = function(t) {
            return Math.sqrt(t) / 5
        }, o.prototype.onUpdate = function() {
            this.label.text = Math.ceil(this.prize)
        }, o.prototype.onCountingComplete = function(t) {
            t = t || 1.5, this.fadeOut(t, this.onFadeOutComplete)
        }, o.prototype.fadeOut = function(t, e) {
            i.emit("winPopup/countUpFinished"), TweenMax.to(this.label.scale, .45, {
                delay: t,
                x: 1.2,
                y: 1.2,
                ease: Linear.easeNone
            }), TweenMax.to(this.label, .45, {
                delay: t,
                alpha: 0,
                y: this.label.y - 120,
                onComplete: e,
                ease: Linear.easeNone
            })
        }, o.prototype.onFadeOutComplete = function() {
            this.onComplete(), this.removePopup()
        }, o.prototype.onComplete = function() {
            i.emit("winPopup/finished"), i.off("initialAnimation/skip", this.onSkip), i.off("machine/click", this.onSkip)
        }, o.prototype.removePopup = function() {
            this.parent && this.parent.removeChild(this)
        }, o.prototype.onSkip = function() {
            TweenMax.killTweensOf(this), TweenMax.killTweensOf(this.label), this.label.text = this.getPrize(), this.onComplete(), this.fadeOut(.3, this.removePopup)
        }, o
    });
})();
