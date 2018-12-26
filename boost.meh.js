/****

Copyright (c) 2015-2018 Yggdrasil Gaming LTD. All rights reserved.

****/

(function() {
    _d("@!", ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"], function(t, e, o, n, i, s, r, a, u, p) {
        "use strict";
        function l() {
            t.bindAll(this), this.tools = [], this.currentTool = null, this.registerTools(), o.once("game/show", this.onGameShow, o.PRIORITY_LOWEST, !0), o.on("boost/toolEnd", this.onBoostToolEnd), o.on("promo/show", this.onPromoShow), o.on("winPresentation/end", this.onWinPresentationEnd, o.PRIORITY_NORMAL + 1, !0), a.on("totalBet/changed", this.onTotalBetChanged), window.addEventListener(r.CASHRACE_TOP_BAR_CHANGED, this.onBoostCashRaceTopBarChanged), o.on("popup/open", this.onPopupOpen), o.on("popup/close", this.onPopupClose), o.on("popup/hide", this.onPopupClose)
        }
        return l.prototype.registerTools = function() {
            this.add(function() {
                return e.hasPromoSpin()
            }, null, "promo"), this.add(n.hasTournament, function() {
                o.emit("tournament/show")
            }, "tournament"), this.add(i.hasMission, function() {
                o.emit("mission/show")
            }, "mission")
        }, l.prototype.add = function(t, e, o) {
            e = e || function() {}, this.tools.push({
                condition: t,
                action: e,
                type: o
            })
        }, l.prototype.onGameShow = function(t) {
            r.tryCalendar(), this.checkBoostTools(t)
        }, l.prototype.onWinPresentationEnd = function(t) {
            s.isLastSmallSpin() ? r.tryAfterPlay(t) : t()
        }, l.prototype.onBoostToolEnd = function() {
            this.currentTool && "promo" === this.currentTool.type && this.checkBoostTools()
        }, l.prototype.checkBoostTools = function(t) {
            this.getActiveTool() ? (this.currentTool = this.getActiveTool(), this.currentTool.action(), t && t()) : r.tryShowUi(t)
        }, l.prototype.getActiveTool = function() {
            for (var t = 0; t < this.tools.length; t++)
                if (this.tools[t].condition())
                    return this.tools[t];
            return null
        }, l.prototype.onPromoShow = function() {
            this.hasActivePromo() || (this.currentTool = this.getActiveTool(), o.emit("boost/hideButton"), o.emit("boost/hideTopPanel"), o.emit("boost/kill"))
        }, l.prototype.hasActivePromo = function() {
            return 0 === this.tools.indexOf(this.currentTool)
        }, l.prototype.onTotalBetChanged = function() {
            r.emitBetSizeChangedEvent(a.totalBet)
        }, l.prototype.onBoostCashRaceTopBarChanged = function(t) {
            t && t.detail && o.emit("boost/topBarStateChanged", t.detail)
        }, l.prototype.onPopupOpen = function() {
            u.root.setBoostVisibility(!1);
            var t = p.byClass("cashrace-bar")[0];
            t && (t.style.display = "none");
            var e = p.byClass("tournament-button")[0];
            e && (e.style.display = "none")
        }, l.prototype.onPopupClose = function() {
            u.root.setBoostVisibility(!0);
            var t = p.byClass("cashrace-bar")[0];
            t && (t.style.display = "block");
            var e = p.byClass("tournament-button")[0];
            e && (e.style.display = "block")
        }, l
    }), _d("@&", ["!", "#", "$", "@@", "%", "@#", "@$", "@%", "@^"], function(t, e, o, n, i, s, r, a, u) {
        "use strict";
        function p() {
            t.bindAll(this), e.on("tournament/show", this.onBoostToolShow, e.PRIORITY_LOW), e.on("mission/show", this.onBoostToolShow, e.PRIORITY_LOW), e.on("boost/kill", this.removeListeners)
        }
        return p.prototype.addListeners = function() {
            e.on("leaderboard/update", this.updateLeaderboard), e.on("tournament/highlight", this.onTournamentHighlight)
        }, p.prototype.removeListeners = function() {
            e.off("leaderboard/update", this.updateLeaderboard), e.off("tournament/highlight", this.onTournamentHighlight), a(this.updateTimeout)
        }, p.prototype.hasBoostTool = function() {
            return i.hasMission() || o.hasTournament()
        }, p.prototype.isBoostToolActive = function() {
            return i.isActive() || o.isActive()
        }, p.prototype.onBoostToolShow = function() {
            this.hasBoostTool() && (this.updateTimeout = r(this.updateLeaderboard, o.getTimeToStart() + o.UPDATE_LEADERBOARD_INTERVAL))
        }, p.prototype.onTournamentHighlight = function() {
            e.once("spin/definiteEnd", this.updateLeaderboard, e.PRIORITY_LOWEST - 1)
        }, p.prototype.updateLeaderboard = function() {
            this.hasBoostTool() && this.sendTournamentUpdateRequest()
        }, p.prototype.sendTournamentUpdateRequest = function() {
            n.exceedMaxIdleTime() ? e.once("spin/definiteEnd", this.updateLeaderboard, e.PRIORITY_LOW) : (this.getRequest().run(), this.isBoostToolActive() && (this.updateTimeout = r(this.updateLeaderboard, o.UPDATE_LEADERBOARD_INTERVAL)))
        }, p.prototype.getRequest = function() {
            return i.hasMission() ? new u : new s
        }, p
    }), _d("#*", ["!", "#", "@*", "@(", "@)", "#!", "%", "#@", "##", "#$", "#%", "#^", "@$", "#&", "$", "^"], function(t, e, o, n, i, s, r, a, u, p, l, h, c, d, f, g) {
        "use strict";
        function m() {
            t.bindAll(this), e.on("mission/show", this.showMission, e.PRIORITY_LOWEST)
        }
        return m.prototype.addListeners = function() {
            e.on("mission/open", this.openMissionFrame), e.on("mission/reset", this.tryToResetMission), e.on("mission/openRules", this.openMissionGameRules), e.on("spin/definiteEnd", this.onSpinEnd, e.PRIORITY_NORMAL + 1), e.on("restore/skip", this.onSpinEnd), e.on("tournament/winNotify", this.onWinNotify), r.on("status/changed", this.onStatusChange)
        }, m.prototype.removeListeners = function() {
            e.off("mission/open", this.openMissionFrame), e.off("mission/reset", this.tryToResetMission), e.off("mission/openRules", this.openMissionGameRules), e.off("spin/definiteEnd", this.onSpinEnd), e.off("restore/skip", this.onSpinEnd), e.off("tournament/winNotify", this.onWinNotify), r.on("status/changed", this.onStatusChange)
        }, m.prototype.updateWasCompleted = function() {
            this.wasCompleted = r.isCurrentObjectiveCompleted()
        }, m.prototype.openMissionFrame = function() {
            var t = new s;
            h.canPlayRaffle() && t.showRaffle()
        }, m.prototype.openMissionGameRules = function(t) {
            (new s).showRules(t)
        }, m.prototype.onSpinEnd = function() {
            g.isLastSmallSpin() && this.checkMission()
        }, m.prototype.checkMission = function() {
            this.checkAutoRestart(), this.checkObjectiveCompleted(), this.updateWasCompleted()
        }, m.prototype.checkAutoRestart = function() {
            r.autoResetPerformed && (new p({
                modal: !0,
                title: a.get("mission_spins_exceeded_title"),
                message: a.get("mission_spins_exceeded_message"),
                buttons: [{
                    label: a.get("continue_button"),
                    hideWindow: !0
                }]
            }), e.emit("autospin/stop"))
        }, m.prototype.checkObjectiveCompleted = function() {
            this.wasCompleted || r.isCurrentObjectiveCompleted() && (new i, e.emit("autospin/stop"))
        }, m.prototype.onMissionFinished = function() {
            e.emit("boost/hideButton"), e.emit("boost/hideTopPanel"), e.emit("boost/toolEnd"), this.removeListeners(), clearTimeout(this.statusTimeout)
        }, m.prototype.showMission = function() {
            this.addListeners(), this.updateWasCompleted(), this.onStatusChange(), this.checkIfShouldUpdateStatus(), (r.isActive() || r.isNotification()) && new n
        }, m.prototype.onStatusChange = function() {
            r.hasMission() ? r.isScheduled() || (!r.isRaffle() || h.qualified ? e.emit("boost/showButton", o.MISSION) : f.hasLeaderboardPosition() ? e.emit("boost/showButton", o.MISSION) : e.emit("boost/hideButton"), r.isActive() ? e.emit("boost/showTopPanel", o.MISSION) : e.emit("boost/hideTopPanel")) : this.onMissionFinished()
        }, m.prototype.checkIfShouldUpdateStatus = function() {
            this.statusTimeout = c(this.updateStatus, r.getTimeToNextStatus() + r.SERVER_CACHE_TIME)
        }, m.prototype.updateStatus = function() {
            r.hasMission() && new l(this.onMissionStatusRequestCompleted).run()
        }, m.prototype.onMissionStatusRequestCompleted = function() {
            r.hasMission() && !r.isRaffle() && this.checkIfShouldUpdateStatus()
        }, m.prototype.tryToResetMission = function() {
            r.isRestartPossible() ? new p({
                title: a.get("mission_reset_title"),
                message: a.get("mission_reset_message"),
                buttons: [{
                    label: a.get("mission_reset_yes"),
                    hideAsyncWindow: !0,
                    action: this.resetMission
                }, {
                    label: a.get("mission_reset_no"),
                    hideWindow: !0,
                    action: this.openMissionFrame
                }]
            }) : new p({
                title: a.get("mission_reset_not_possible_title"),
                message: a.get("mission_reset_not_possible_message", r.getMinSpinsToReset()),
                buttons: [{
                    label: a.get("continue_button"),
                    hideWindow: !0
                }]
            })
        }, m.prototype.resetMission = function(t) {
            new u(function() {
                t(), e.emit("mission/restarted")
            }).run()
        }, m.prototype.onWinNotify = function() {
            h.markWinNotified(), (new d).run()
        }, m
    }), _d("$@", ["!", "#", "@", "#(", "*", "#)", "$!", "@*"], function(t, o, n, i, e, s, r, a) {
        "use strict";
        function u() {
            t.bindAll(this), o.on("game/show", this.onGameShow, o.PRIORITY_LOW), o.on("restore/skip", this.onRestoreSkip), o.on("spin/definiteEnd", this.onDefiniteEnd)
        }
        return u.prototype.onGameShow = function() {
            this.forceNewOnSkip = !n.hasPromoSpin(), this.checkBegin()
        }, u.prototype.onRestoreSkip = function() {
            this.checkEnd(this.forceNewOnSkip)
        }, u.prototype.onDefiniteEnd = function() {
            this.checkEnd(this.forceNewOnSkip)
        }, u.prototype.checkBegin = function() {
            n.hasPromoSpin() && (this.showBeginWindow(), e.setTotalBet(n.totalBet), o.emit("promo/show"), o.emit("boost/showButton", a.PROMO), o.emit("boost/showTopPanel", a.PROMO))
        }, u.prototype.checkEnd = function(t) {
            n.isLastPromoSpin() ? (this.stopAutoSpin(), this.showFinishWindow(this.checkBegin), this.selectDefaultBet()) : t && this.checkBegin(), this.resetForceNewOnSkip()
        }, u.prototype.resetForceNewOnSkip = function() {
            this.forceNewOnSkip = !1
        }, u.prototype.selectDefaultBet = function() {
            s.selectDefault()
        }, u.prototype.showBeginWindow = function() {
            new i(n.getBeginWindowOptions())
        }, u.prototype.showFinishWindow = function(t) {
            var e = n.getFinishWindowOptions();
            e.onHideComplete = function() {
                n.clearFinalBalance(), o.emit("boost/hideButton"), o.emit("boost/hideTopPanel"), o.emit("boost/toolEnd"), t()
            }, new i(e)
        }, u.prototype.stopAutoSpin = function() {
            r.isDuringAutoSpins && o.emit("autospin/stop")
        }, u
    }), _d("$(", ["!", "#", "$#", "$$", "@@", "#@", "$%", "$^", "$&", "$*", "@*", "(", "&"], function(t, e, o, n, i, s, r, a, u, p, l, h, c) {
        "use strict";
        function d() {
            t.bindAll(this), this.FACEBOOK_URL = "https://www.facebook.com/sharer/sharer.php?", this.TWITTER_URL = "https://twitter.com/intent/tweet?", e.on("share/facebook", this.onShareFacebook), e.on("share/twitter", this.onShareTwitter), e.on("spin/definiteEnd", this.onSpinEnd)
        }
        return d.prototype.onShareFacebook = function() {
            var t = s.get("share_facebook_title", i.getFormatedGameName()),
                e = s.get("share_facebook_description", this.getWin(), u.getOperator());
            this.openWindow(this.FACEBOOK_URL, {
                u: u.getLink(),
                title: t,
                description: e
            })
        }, d.prototype.onShareTwitter = function() {
            var t = s.get("share_twitter_text", this.getWin(), i.getFormatedGameName()),
                e = [u.getOperator().replace(" ", ""), "yggdrasilgaming"].join(",");
            this.openWindow(this.TWITTER_URL, {
                url: u.getLink(),
                text: t,
                hashtags: e
            })
        }, d.prototype.getWin = function() {
            var t = a.getTotalPrize();
            return i.isRewatch() || (t = p.getAmountInCoins(a.getTotalPrize())), r.formatNumber(t)
        }, d.prototype.openWindow = function(t, e) {
            o.open(t + n.parseParams(e), "_blank", "width=600, height=400, scrollbars=no")
        }, d.prototype.onSpinEnd = function() {
            i.isReplayMode() || i.isShareEnabled() && this.isBigWin() && this.showShare()
        }, d.prototype.isBigWin = function() {
            return p.getAmountInCoins(a.getTotalPrize()) >= a.getBigWinThreshold()
        }, d.prototype.showShare = function() {
            h.root.promoButton || c.hasActiveCampaign() || (e.emit("boost/showButton", l.SHARE), e.once("spin/start", this.hideShare))
        }, d.prototype.hideShare = function() {
            e.emit("boost/hideButton", l.SHARE)
        }, d
    }), _d("%^", ["!", "@", "#", "$)", "%!", "#^", "$", "%@", "%#", "@@", "%$", "@$", "@%", "%%", "*", "@*"], function(t, e, o, n, i, s, r, a, u, p, l, h, c, d, f, g) {
        "use strict";
        function m() {
            t.bindAll(this), o.on("tournament/show", this.onTournamentShow), o.on("boost/kill", this.removeListeners)
        }
        return m.prototype.onTournamentShow = function() {
            this.addListeners(), this.setMinimumBet(), this.displayTournamentInterface()
        }, m.prototype.setMinimumBet = function() {
            r.isMinBetFulfilled() || f.setMinTotalBet(r.minimumBetSize)
        }, m.prototype.addListeners = function() {
            o.on("tournament/showTournamentFrame", this.showTournamentFrame), o.on("tournament/showTournamentFrameWithRules", this.showTournamentFrameWithRules), o.on("tournament/winNotify", this.onWinNotify), o.on("freespins/outroFinished", this.onFreespinsOutroFinished), r.on("status/changed", this.onTournamentStatusChanged)
        }, m.prototype.removeListeners = function() {
            o.off("tournament/showTournamentFrame", this.showTournamentFrame), o.off("tournament/winNotify", this.onWinNotify), o.off("freespins/outroFinished", this.onFreespinsOutroFinished), r.off("status/changed", this.onTournamentStatusChanged), c(this.infoTimeout)
        }, m.prototype.displayTournamentInterface = function() {
            this.canShowTournamentPopup() && new n, r.hasTournament() && this.onTournamentStatusChanged()
        }, m.prototype.showButton = function() {
            o.emit("boost/showButton", g.TOURNAMENT)
        }, m.prototype.canShowTournamentPopup = function() {
            return !a.hasPendingSpinToRestore() && !p.isReplayMode() && (r.isNotification() || r.isActive())
        }, m.prototype.showTournamentFrame = function() {
            var t = new i;
            s.canPlayRaffle() ? t.showRaffle() : t.showLeaderboard()
        }, m.prototype.showTournamentFrameWithRules = function(t) {
            (new i).showRules(t)
        }, m.prototype.onTournamentStatusChanged = function() {
            r.hasTournament() && !r.isScheduled() && this.showButton(), this.checkIfShouldUpdateInfo(), r.isRaffle() && (new u).run(), this.updateInterface()
        }, m.prototype.checkIfShouldUpdateInfo = function() {
            r.hasTournament() && r.isPostTournament() || (this.infoTimeout = h(this.updateTournamentInfo, r.getTimeToNextStatus() + r.SERVER_CACHE_TIME))
        }, m.prototype.updateInterface = function() {
            r.isActive() && o.emit("boost/showTopPanel", g.TOURNAMENT), r.isPostTournament() && (o.emit("boost/hideTopPanel"), s.qualified || r.hasLeaderboardPosition() || (this.removeListeners(), r.clear(), o.emit("boost/hideButton"), o.emit("boost/toolEnd")))
        }, m.prototype.updateTournamentInfo = function() {
            (new l).run()
        }, m.prototype.onWinNotify = function() {
            s.markWinNotified(), (new d).run()
        }, m.prototype.onFreespinsOutroFinished = function() {
            this.highlightTournament()
        }, m.prototype.highlightTournament = function() {
            r.isMinBetFulfilled() && o.emit("tournament/highlight")
        }, m
    }), _d("^@", ["!", "#", "#@", "%&", "@@", "%*", "%(", "$$", "%)", "^!", ")"], function(t, e, o, n, i, s, r, a, u, p, l) {
        "use strict";
        function h() {
            t.bindAll(this), e.on("watch/run", this.onWatch)
        }
        return h.prototype.onWatch = function(t) {
            i.game.requestFrame.disable(), n.saveEnabled = !1, this.soundEnabled = n.enabled, n.enabled = !1;
            var e = s.clone(i.params);
            (p.isTopFrame() || i.isDesktop) && (e.innerClient = "yes"), p.isTopFrame() || (e.replayFromIframeGame = "yes"), s.mixin(e, t);
            var o = document.location.origin + document.location.pathname + "?" + a.parseParams(e);
            p.isTopFrame() || i.isDesktop ? this.loadReplay(o) : u.goToURL(o)
        }, h.prototype.loadReplay = function(t) {
            i.isInGameHistoryEnabled() ? new r({
                src: t,
                customLoadHandler: !0,
                loadingText: o.get("gameHistory_loadingText"),
                onClose: this.onWatchReplayClosed,
                onLoad: this.hideLoadFrame
            }) : (new r({
                hideClose: !0,
                loadingText: o.get("gameHistory_loadingText")
            }), u.goToURL(t))
        }, h.prototype.hideLoadFrame = function() {
            l.byClass("loadingTextWrapper")[0].style.display = "none", document.body.getElementsByTagName("iframe")[0].style.visibility = "visible"
        }, h.prototype.onWatchReplayClosed = function() {
            i.game.requestFrame.enable(), n.enabled = this.soundEnabled, n.saveEnabled = !0
        }, h
    }), _d("^*", ["^#", "^$", "!", "%*", "#@", "@@", "$", "#^", "^%", "^^", "^&"], function(t, e, o, n, i, s, r, a, u, p, l) {
        "use strict";
        function h() {
            e.call(this), this.SERVER_CACHE_TIME = 10, this.property("status", null)
        }
        return t.extend(h, e), h.prototype.clear = function() {
            this.hasMission() && (r.clear(), a.clear()), this.status = null, this.missionId = null, this.name = null, this.objectives = null, this.currentObjective = null, this.completedObjectives = 0, this.minSpinsToReset = null, this.resetPossible = null, this.participationDecisionMade = !1
        }, h.prototype.parse = function(t) {
            this.parseDefinitions(t.definition), this.parseState(t.state), this.data = t, this.topOrg = t.topOrg, this.participationDecisionMade = t.participationDecisionMade
        }, h.prototype.refreshState = function() {
            r.parsePrizePool(this.prizePool), this.parseState(this.data.state), this.data.definition.excludeRaffle || a.parseRafflePrizePool(this.data.definition.rafflePool)
        }, h.prototype.parseDefinitions = function(t) {
            this.clear(), t && t.missionId && (r.notificationStart = t.notificationStart, r.startDate = t.leaderboardStart, r.endDate = t.leaderboardEnd, r.raffleEnd = t.raffleEnd, r.raffleTime = t.raffleEnd - t.leaderboardEnd, r.excludeRaffle = t.excludeRaffle, r.minimumBetSize = t.minimumBet, r.autopayoutsEnabled = t.autopayoutsEnabled, t.excludeRaffle || (t.excludeLeaderboardPlayers ? a.setQualifiedPositions(t.lastLeaderboard + 1, t.lastLeaderboard + t.lastRaffle) : a.setQualifiedPositions(1, t.lastRaffle)), this.prizePool = t.prizePool, this.missionId = t.missionId, this.name = t.name, this.objectives = t.objectives, this.minSpinsToReset = t.minimumSpinsToReset)
        }, h.prototype.parseState = function(t) {
            if (t) {
                t.leaderboard && r.parseLeaderboard(t.leaderboard), r.includeRaffle() && this.parseRaffle(t), this.status = t.status, this.score = t.score, this.bestScore = t.bestScore, this.resetPossible = t.resetPossible, this.completedObjectives = 0, this.autoResetPerformed = t.autoResetPerformed, this.games = [];
                for (var e = 0; e < this.objectives.length; e++) {
                    var o = this.objectives[e];
                    n.mixin(o, t.objectives[o.id]), o.description = i.get("mission_objective_description_" + o.id), o.longDescription = i.get("mission_objective_description_long_" + o.id), o.gameIconSmallSrc = this.getIconURL("icon_{0}_small.png", o.gameId), o.gameIconBigSrc = this.getIconURL("icon_{0}_big.png", o.gameId), this.updateProgress(o), o.isCompleted && this.completedObjectives++, o.gameId === s.getGameId() && (this.currentObjective = o), this.games.push(o.game)
                }
                this.objectives.sort(function(t, e) {
                    return t.gameId === s.getGameId() ? -1 : e.gameId === s.getGameId() ? 1 : e.isCompleted ? t.isCompleted ? -1 : 1 : -1
                })
            }
        }, h.prototype.getIconURL = function(t, e) {
            return p.generateIconURL("mission_icons", l.substitute(t, e))
        }, h.prototype.updateProgress = function(t) {
            t.completePercent = t.completed / t.total * 100, t.isCompleted = t.completed === t.total
        }, h.prototype.setNextCompleted = function() {
            this.currentObjective.isCompleted || (this.currentObjective.completed++, this.updateProgress(this.currentObjective))
        }, h.prototype.setCompleted = function(t) {
            this.currentObjective.completed = t, this.updateProgress(this.currentObjective)
        }, h.prototype.parseRaffle = function(t) {
            a.isActive = "raffle" === t.status, t.raffle && t.raffle.selected && (a.qualified = t.raffle.selected.qualified, a.winNotified = t.raffle.selected.winNotified, a.parseRaffleResults(t.raffle))
        }, h.prototype.clearProgress = function() {
            for (var t = this.score = 0; t < this.objectives.length; t++) {
                var e = this.objectives[t];
                e.isCompleted = !1, e.completed = 0, e.completePercent = 0
            }
        }, h.prototype.getName = function() {
            return this.name
        }, h.prototype.getNumberOfObjectives = function() {
            return this.getObjectives().length
        }, h.prototype.getTotalPrize = function() {
            return r.getTotalPrize() + a.getTotalPrize()
        }, h.prototype.getTotalPrizeValues = function() {
            return r.getTotalPrizeValues()
        }, h.prototype.getGames = function() {
            return this.games
        }, h.prototype.getCompleted = function() {
            return this.currentObjective.completed
        }, h.prototype.isCurrentObjectiveCompleted = function() {
            return this.currentObjective && this.currentObjective.isCompleted
        }, h.prototype.getTotal = function() {
            return this.currentObjective.total
        }, h.prototype.getCurrentObjective = function() {
            return this.currentObjective
        }, h.prototype.getScore = function() {
            return this.score
        }, h.prototype.getBestScore = function() {
            return this.bestScore
        }, h.prototype.getNumberOfNotCompletedObjectives = function() {
            return this.getNumberOfObjectives() - this.completedObjectives
        }, h.prototype.completedAllObjectives = function() {
            return this.completedObjectives === this.getNumberOfObjectives()
        }, h.prototype.isCurrentObjective = function(t) {
            return this.currentObjective.id === t
        }, h.prototype.isActive = function() {
            return "active" === this.status
        }, h.prototype.isScheduled = function() {
            return "scheduled" === this.status
        }, h.prototype.isNotification = function() {
            return "notification" === this.status
        }, h.prototype.isRaffle = function() {
            return "raffle" === this.status
        }, h.prototype.hasMission = function() {
            return !!this.status
        }, h.prototype.isRestartPossible = function() {
            return this.resetPossible
        }, h.prototype.getMinSpinsToReset = function() {
            return this.minSpinsToReset
        }, h.prototype.getObjectives = function() {
            return this.objectives
        }, h.prototype.getWholePrizePool = function() {
            return a.getRafflePrizePool().concat(r.getPrizePool())
        }, h.prototype.getTimeToNextStatus = function() {
            return this.isScheduled() ? r.getTimeToNotification() : this.isNotification() ? r.getTimeToStart() : this.isActive() ? r.getTimeToEnd() : 0
        }, h
    }), _d("^(", ["$%"], function(e) {
        "use strict";
        function t() {
            this.TYPES = {
                PREPAID: "prepaid",
                SUPER_SPIN: "super_spin",
                FEATURE_WIN: "featurewin",
                SINGLE_WIN: "singlewin",
                TOTAL_WIN: "totalwin"
            }, this.clear()
        }
        return t.prototype.clear = function() {
            this.type = null, this.subtype = null, this.totalWin = null, this.prepaidId = null, this.spinsLeft = null, this.totalBet = null, this.targetValue = null, this.currentValue = null, this.clearFinalBalance()
        }, t.prototype.clearFinalBalance = function() {
            this.finalTotalWin = null, this.finalTotalWin = null, this.finalType = null, this.finalSpinsPlayed = null, this.finalValue = null
        }, t.prototype.isLastPromoSpin = function() {
            return !!this.finalType
        }, t.prototype.hasPromoSpin = function() {
            return !!this.type
        }, t.prototype.getBeginWindowOptions = function() {
            return {
                begin: !0,
                type: this.type,
                subtype: this.subtype,
                targetValue: this.targetValue,
                helperValue: this.totalBet,
                counterValue: this.counterValue
            }
        }, t.prototype.getFinishWindowOptions = function() {
            return {
                finish: !0,
                type: this.finalType,
                subtype: this.subtype,
                prize: this.finalTotalWin,
                spinsPlayed: this.finalSpinsPlayed
            }
        }, t.prototype.parse = function(t, e) {
            this.clear(), t.promotionType === this.TYPES.PREPAID.toUpperCase() ? this.parsePrepaid(t) : t.promotionType === this.TYPES.SUPER_SPIN.toUpperCase() && this.parseSuperFreeSpin(t), this.parseFinalBalance(e)
        }, t.prototype.parsePrepaid = function(t) {
            this.type = t.promotionType.toLowerCase(), this.prepaidId = t.prepaidBase.prepaidId, this.totalWin = parseFloat(t.totalWin), this.spinsLeft = parseInt(t.spinsLeft, 10), this.spinsPlayed = parseInt(t.spinsPlayed, 10), this.targetValue = this.spinsLeft, this.currentValue = this.spinsLeft, this.totalBet = parseFloat(t.prepaidBase.betAmount)
        }, t.prototype.parseSuperFreeSpin = function(t) {
            this.type = t.prepaidBase.extendRuleType.toLowerCase(), this.prepaidId = t.prepaidBase.prepaidId, this.totalWin = parseFloat(t.prepaidBase.wct), this.targetValue = parseFloat(t.prepaidBase.extendRuleValue), this.counterValue = parseFloat(t.prepaidBase.extendRuleCount), this.spinsPlayed = t.prepaidBase.cnt, this.type !== this.TYPES.FEATURE_WIN ? (this.currentValue = this.spinsPlayed, this.targetValue = e.format(this.targetValue)) : (this.currentValue = t.prepaidBase.fscnt + "/" + this.counterValue, this.subtype = t.prepaidBase.extendRuleSubType.toLowerCase()), this.totalBet = parseFloat(t.prepaidBase.betAmount)
        }, t.prototype.parseFinalBalance = function(t) {
            t && (this.finalTotalWin = parseFloat(10000.0), this.finalType = t.ruleType.toLowerCase(), this.finalSpinsPlayed = parseInt(t.roundCount, 10), this.type === this.TYPES.PREPAID ? this.finalValue = 0 : this.type === this.TYPES.FEATURE_WIN ? this.finalValue = this.finalSpinsPlayed : this.finalValue = t.fscnt + "/" + t.fscnt)
        }, t
    }), _d("&!", ["!", "^)", "^%"], function(t, n, i) {
        "use strict";
        function e() {
            this.clear(), t.bindAll(this)
        }
        return e.prototype.clear = function() {
            this.qualified = !1, this.winNotified = !1, this.isActive = !1, this.results = [], this.reward = null, this.prizes = [], this.prizesGrouped = []
        }, e.prototype.parse = function(t) {
            this.qualified = "true" === t.qualified, this.winNotified = "true" === t.winNotified;
            var e = t.tournamentTO;
            e && !e.excludeRaffle && (this.isActive = "raffle" === e.status, e.excludeLeaderboardPlayers ? this.setQualifiedPositions(e.lastLeaderboard + 1, e.lastLeaderboard + e.lastRaffle) : this.setQualifiedPositions(1, e.lastRaffle))
        }, e.prototype.setQualifiedPositions = function(t, e) {
            this.qualifiedStart = t, this.qualifiedEnd = e
        }, e.prototype.parseRaffleResults = function(t) {
            this.results = t.results.filter(function(t) {
                return t.hasWon && t.winNotified
            }), this.results = this.results.map(i.formatRaffleResult), this.reward = i.formatRaffleResult(t.selected)
        }, e.prototype.parseRafflePrizePool = function(t) {
            this.prizes = i.formatPrizePool(t), this.prizesGrouped = i.groupPrizesByValue(this.prizes)
        }, e.prototype.getTotalPrize = function() {
            for (var t = 0, e = i.getPrizesOfType(i.PAYOUT_TYPE.CASH, this.prizes), o = 0; o < e.length; o++)
                t += e[o].prize;
            return t
        }, e.prototype.getTotalPrizeValues = function() {
            for (var t = 0, e = 0; e < this.prizes.length; e++)
                t += this.prizes[e].prize;
            return t
        }, e.prototype.parseSinglePrize = function(t, e) {
            return t.number = e + 1, t.formattedPrize = i.formatPrize(t.prize, t.currency), t
        }, e.prototype.getResults = function() {
            return this.results
        }, e.prototype.canPlayRaffle = function() {
            return this.isActive && this.hasUnopenedChest()
        }, e.prototype.hasUnopenedChest = function() {
            return this.qualified && !this.winNotified
        }, e.prototype.isChestPicked = function() {
            return this.qualified && this.winNotified
        }, e.prototype.markWinNotified = function() {
            this.winNotified = !0
        }, e.prototype.hasRafflePrizePool = function() {
            return 0 < this.prizes.length
        }, e.prototype.getRafflePrizePool = function(t) {
            return t ? this.prizesGrouped : this.prizes
        }, e.prototype.getRaffleRandomData = function() {
            return this.canPlayRaffle() ? this.generateRandomChests() : []
        }, e.prototype.getMaxChests = function() {
            return 10
        }, e.prototype.generateRandomChests = function() {
            var t = this.getMaxChests(),
                e = Math.round(Math.random() * (.5 * t) + 1),
                o = n.shuffle(this.results);
            return o = (o = o.slice(0, e)).concat(this.getClosedChests(t - o.length)), n.shuffle(o)
        }, e.prototype.getFakeChests = function() {
            for (var t = [], e = 0; e < this.getMaxChests(); e++)
                t.push({
                    closed: !0,
                    fakeClass: "fake"
                });
            return t
        }, e.prototype.getClosedChests = function(t) {
            for (var e = [], o = 0; o < t; o++)
                e.push({
                    closed: !0
                });
            return e
        }, e.prototype.getChestWon = function() {
            return this.isChestPicked() ? this.getRewardPrize() ? [{
                prizeWon: this.getFormattedRewardPrize(),
                empty: !1
            }] : [{
                empty: !0
            }] : []
        }, e.prototype.getRewardPrize = function() {
            return this.reward ? parseInt(this.reward.prize) : 0
        }, e.prototype.getFormattedRewardPrize = function() {
            return this.reward ? (this.reward.prize = parseInt(this.reward.prize), i.formatAnyReward(this.reward)) : 0
        }, e.prototype.getRaffleRange = function() {
            return 1e5 < this.qualifiedEnd ? {
                qualifiedStart: this.qualifiedStart + "+",
                qualifiedEnd: ""
            } : {
                qualifiedStart: this.qualifiedStart + "-",
                qualifiedEnd: this.qualifiedEnd
            }
        }, Object.defineProperty(e.prototype, "winChestId", {
            get: function() {
                return this.reward.resultId
            }
        }), e.prototype.getCurrency = function() {
            return 0 < this.prizes.length ? this.prizes[0].currency : i.getDefaultCurrency()
        }, e.prototype.hasCustomPrizes = function() {
            return 0 < i.getPrizesOfType(i.PAYOUT_TYPE.CUSTOM, this.prizes).length
        }, e
    }), _d("&#", ["^$", "^#", "@@", "^", "&@", "#@"], function(t, e, n, o, i, s) {
        "use strict";
        function r() {
            t.call(this)
        }
        return e.extend(r, t), r.prototype.getLink = function() {
            var t = {
                appsrv: n.baseURL,
                wagerid: o.getWagerId(),
                gameid: n.gameId,
                currency: n.currency,
                lang: n.language,
                client: document.location.origin,
                org: n.organization,
                shareOrg: n.shareOrg || n.organization,
                shareOrgName: this.getOperator(n.shareOrg)
            };
            return "https://player.yggdrasilgaming.com/watch?" + i.encode(JSON.stringify(t))
        }, r.prototype.getOperatorLink = function(t, e) {
            var o = {
                appsrv: n.baseURL,
                wagerid: t,
                gameid: e || n.gameId,
                currency: n.currency,
                lang: n.language,
                client: document.location.origin,
                org: n.organization,
                shareOrg: n.shareOrg || n.organization,
                shareOrgName: this.getOperator(n.shareOrg)
            };
            return "https://player.yggdrasilgaming.com/watch?" + i.encode(JSON.stringify(o))
        }, r.prototype.getOperator = function(t) {
            var e = "operator_name_" + (t = t || n.shareOrg || n.organization);
            return s.has(e) ? s.get(e) : t
        }, r
    }), _d("&^", ["$$", "@@", "^$", "^#", "%*", "#^", "^%", "&$", "*", "$%", "#@", "&%"], function(t, o, e, n, i, s, r, a, u, p, l, h) {
        "use strict";
        function c() {
            e.apply(this, arguments), this.clear(), this.property("status", null), this.property("player", null), this.SERVER_CACHE_TIME = 60, this.UPDATE_LEADERBOARD_INTERVAL = 60, this.leaderboard = [], this.prizePool = [], this.environments = {}
        }
        return n.extend(c, e), c.prototype.clear = function() {
            this.serverStatus = null, this.tournamentId = null, this.tournamentName = null, this.startDate = null, this.endDate = null, this.status = null, this.description = null, this.participationDecisionMade = !1
        }, c.prototype.parse = function(t) {
            this.clear();
            var e = t.tournamentTO;
            e && (this.tournamentId = e.tournamentId, this.tournamentName = e.tournamentName, this.notificationStart = e.notificationStart, this.startDate = e.tournamentStart, this.endDate = e.raffleStart, this.description = e.description, this.excludeRaffle = e.excludeRaffle, this.serverStatus = e.status, this.raffleEnd = e.raffleEnd, this.raffleTime = e.raffleEnd - e.raffleStart, this.lastRaffle = e.lastRaffle, this.lastLeaderboard = e.lastLeaderboard || 0, this.excludeLeaderboardPlayers = e.excludeLeaderboardPlayers, this.strategy = e.qualificationStrategy, this.autopayoutsEnabled = e.autopayoutsEnabled, this.participationDecisionMade = t.participationDecisionMade), this.games = this.getTournamentGames(t.tournamentGames), this.minimumBetSize = t.minimumBetSize || 0, this.topOrg = t.topOrg
        }, c.prototype.updateStatus = function() {
            this.status = this.serverStatus
        }, c.prototype.getTournamentGames = function(t) {
            var e = [];
            for (var o in t)
                e.push(t[o]);
            return e
        }, c.prototype.parseLeaderboard = function(e) {
            e.selected && !e.selected.playerName && (e.selected = null);
            var t = e.players.filter(function(t) {
                return null !== t.playerName
            });
            this.leaderboard = t.map(function(t) {
                return this.parseLeaderboardRow(e.selected, t)
            }.bind(this)), this.player = e.selected, this.environments = e.environments
        }, c.prototype.parseLeaderboardRow = function(t, e) {
            t && t.number === e.number ? (e = i.clone(t)).selected = "selected" : e.selected = "";
            var o = this.getPrizeAtPosition(e.number);
            return o && (e.prize = o.formattedPrize), e.qualifyForRaffle = this.doesPlayerQualifyForRaffle(e.number), e.prizeAndRaffle = e.prize && e.qualifyForRaffle, e
        }, c.prototype.parsePrizePool = function(t) {
            this.prizePool = r.formatPrizePool(t), this.prizePoolGrouped = this.groupPrizesByPosition(this.prizePool)
        }, c.prototype.groupPrizesByPosition = function(t) {
            for (var e = [], o = 1, n = t[0], i = 0; i < t.length; i++)
                (i + 1 >= t.length || t[i + 1].prize !== t[i].prize) && (n.number = o === i + 1 ? o : o + "-" + (i + 1), e.push(n), n = t[i + 1], o = i + 2);
            return e
        }, c.prototype.getTotalPrize = function() {
            for (var t = 0, e = r.getPrizesOfType(r.PAYOUT_TYPE.CASH, this.prizePool), o = 0; o < e.length; o++)
                t += e[o].prize;
            return t
        }, c.prototype.hasCustomPrizes = function() {
            return 0 < r.getPrizesOfType(r.PAYOUT_TYPE.CUSTOM, this.prizePool).length || s.hasCustomPrizes()
        }, c.prototype.getPrizePool = function(t) {
            return t ? this.prizePoolGrouped : this.prizePool
        }, c.prototype.hasTournament = function() {
            return null !== this.serverStatus
        }, c.prototype.isScheduled = function() {
            return "scheduled" === this.serverStatus
        }, c.prototype.isNotification = function() {
            return "notification" === this.serverStatus
        }, c.prototype.isActive = function() {
            return "tournament" === this.serverStatus
        }, c.prototype.isPostTournament = function() {
            return "raffle" === this.serverStatus
        }, c.prototype.isRaffle = function() {
            return "raffle" === this.serverStatus && this.includeRaffle()
        }, c.prototype.getLeaderboardData = function() {
            return this.leaderboard
        }, c.prototype.getTimeToNotification = function() {
            return Math.max(this.notificationStart - o.getServerTime(), 0) / 1e3
        }, c.prototype.getTimeToStart = function() {
            return Math.max(this.startDate - o.getServerTime(), 0) / 1e3
        }, c.prototype.getTimeToEnd = function() {
            return Math.max(this.endDate - o.getServerTime(), 0) / 1e3
        }, c.prototype.getRaffleTime = function() {
            return Math.floor(this.raffleTime / 1e3 / 60 / 60)
        }, c.prototype.getFirstPrizeValue = function() {
            return this.prizePool && 0 !== this.prizePool.length ? this.prizePool[0].prize : 0
        }, c.prototype.getFirstReward = function() {
            return this.prizePool[0] || {}
        }, c.prototype.getLeaderboardAndRaffleTotalPrize = function() {
            return this.getTotalPrize() + s.getTotalPrize()
        }, c.prototype.getTotalPrizeValues = function() {
            for (var t = s.getTotalPrizeValues(), e = 0; e < this.prizePool.length; e++)
                t += this.prizePool[e].prize;
            return t
        }, c.prototype.getGameRulesDynamicData = function() {
            var t = {},
                e = s.getRaffleRange();
            return t.raffleStartPosition = e.qualifiedStart, t.raffleEndPosition = e.qualifiedEnd, t.raffleTotalPrize = r.formatPrize(s.getTotalPrize(), s.getCurrency()), t.raffleTime = this.getRaffleTime(), t.formattedGameName = o.getFormatedGameName(), t.startDate = r.formatDateWithTime(this.startDate), t.endDate = r.formatDateWithTime(this.endDate), t.hasMinBetRule = this.hasMinBetRule(), t.formattedMinBet = this.getFormattedMinBet(), t
        }, c.prototype.isLeaderboardQualified = function() {
            return this.player && this.player.number <= this.lastLeaderboard
        }, c.prototype.hasLeaderboardPosition = function() {
            return this.player && 0 <= this.player.number
        }, c.prototype.isRaffleQualifiedBasedOnPosition = function() {
            return !!s.canPlayRaffle() || this.player && this.doesPlayerQualifyForRaffle(this.player.number)
        }, c.prototype.doesPlayerQualifyForRaffle = function(t) {
            return t >= s.qualifiedStart && t <= s.qualifiedEnd
        }, c.prototype.getCurrentPrize = function() {
            return this.isLeaderboardQualified() && 0 < this.prizePool.length ? this.prizePool[this.player.number - 1] : null
        }, c.prototype.getPrizeAtPosition = function(t) {
            return this.prizePool[t - 1]
        }, c.prototype.showPrizePanel = function() {
            return this.isRaffleQualifiedBasedOnPosition() || !!this.getCurrentPrize()
        }, c.prototype.getStrategyName = function() {
            return this.strategy
        }, c.prototype.includeRaffle = function() {
            return !this.excludeRaffle
        }, c.prototype.isMinBetFulfilled = function() {
            return u.totalBet > this.minimumBetSize || h.isEqual(u.totalBet, this.minimumBetSize)
        }, c.prototype.hasMinBetRule = function() {
            return 0 < this.minimumBetSize
        }, c.prototype.getFormattedMinBet = function() {
            return p.format(this.minimumBetSize)
        }, c.prototype.getCurrency = function() {
            return this.prizePool[0].currency
        }, c.prototype.getGamesNames = function() {
            return 0 < this.games.length ? this.games : [this.getGameRulesDynamicData().formattedGameName]
        }, c.prototype.getFormattedGamesNames = function() {
            return this.getGamesNames().join(", ")
        }, c.prototype.getTournamentName = function() {
            var t = "tournament_custom_name_" + this.getStrategyName().toLowerCase();
            return l.has(t) ? l.get(t) : o.getFormatedGameName().toUpperCase()
        }, c.prototype.getEnvironmentURL = function(t) {
            return this.environments[t]
        }, c.prototype.getTimeToNextStatus = function() {
            return this.isScheduled() ? this.getTimeToNotification() : this.isNotification() ? this.getTimeToStart() : this.isActive() ? this.getTimeToEnd() : 0
        }, c.prototype.isCrossGame = function() {
            return "crossgame" === this.getStrategyName().toLowerCase()
        }, c.prototype.showRewatch = function() {
            return o.isTournamentRewatchEnabled() && !this.isCrossGame()
        }, c
    }), _d("&*", ["&&", "^#", "&"], function(t, e, o) {
        "use strict";
        function n() {
            t.apply(this, arguments)
        }
        return e.extend(n, t), n.prototype.onRequestStart = function() {
            o.hasInstance() ? this.load() : this.loadBoostScript()
        }, n.prototype.getName = function() {
            return "BoostRequest"
        }, n.prototype.loadBoostScript = function() {
            var t = document.createElement("script");
            t.type = "text/javascript", t.src = o.getUrl(), t.onload = this.onBoostScriptLoaded, t.onerror = this.onBoostScriptLoadError, document.head.appendChild(t)
        }, n.prototype.onBoostScriptLoaded = function() {
            o.tryCreateInstance(), o.hasInstance() && o.isVersionSupported ? this.load() : this.onSuccess()
        }, n.prototype.onBoostScriptLoadError = function(t) {
            this.onSuccess()
        }, n.prototype.load = function() {
            o.tryLoad(this.onSuccess, this.error)
        }, n
    }), _d("&)", ["^#", "&(", "%"], function(t, e, o) {
        "use strict";
        function n() {
            e.apply(this, arguments)
        }
        return t.extend(n, e), n.prototype.getParams = function(t) {
            e.prototype.getParams.call(this, t), t.category = this.getTranslationCategories()
        }, n.prototype.getTranslationCategories = function() {
            return ["Slot/Mission/" + o.missionId, "SLOT/" + o.topOrg + "/CUSTOM_PRIZE"]
        }, n.prototype.getName = function() {
            return "GetMissionCustomRulesRequest"
        }, n
    }), _d("@^", ["^#", "&&", "@@", "%", "$"], function(t, e, o, n, i) {
        "use strict";
        function s() {
            e.apply(this, arguments)
        }
        return t.extend(s, e), s.prototype.getHeaders = function() {
            return {
                "SESSION-ID": o.sessionId
            }
        }, s.prototype.parse = function(t) {
            i.parseLeaderboard(t)
        }, s.prototype.getPath = function() {
            return "game.web/boost/mission/" + n.missionId + "/leaderboard"
        }, s.prototype.getName = function() {
            return "GetMissionLeaderboardRequest"
        }, s
    }), _d("#%", ["^#", "&&", "@@", "%"], function(t, e, o, n) {
        "use strict";
        function i() {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.getHeaders = function() {
            return {
                "SESSION-ID": o.sessionId
            }
        }, i.prototype.parse = function(t) {
            n.parseState(t)
        }, i.prototype.getPath = function() {
            return "game.web/boost/mission/" + n.missionId + "/state"
        }, i.prototype.getName = function() {
            return "GetMissionStateRequest"
        }, i
    }), _d("*!", ["^#", "&(", "&&", "$"], function(t, e, o, n) {
        "use strict";
        function i() {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.getParams = function(t) {
            e.prototype.getParams.call(this, t), t.category = this.getTranslationCategories()
        }, i.prototype.getTranslationCategories = function() {
            return ["Slot/Tournament/" + n.tournamentId, "SLOT/" + n.topOrg + "/CUSTOM_PRIZE"]
        }, i.prototype.getName = function() {
            return "GetTournamentCustomRulesRequest"
        }, i
    }), _d("*@", ["^#", "&&", "@@", "$"], function(t, e, o, n) {
        "use strict";
        function i() {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.getParams = function(t) {
            t.sessionId = o.sessionId, t.gameId = o.gameId
        }, i.prototype.parse = function(t) {
            n.parseLeaderboard(t)
        }, i.prototype.getPath = function() {
            return "game.web/services/tournament/" + n.tournamentId
        }, i.prototype.getName = function() {
            return "GetTournamentLeaderboardRequest"
        }, i
    }), _d("*#", ["^#", "&&", "@@", "$"], function(t, e, o, n) {
        "use strict";
        function i() {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.getParams = function(t) {
            t.sessionId = o.sessionId, t.gameId = o.gameId
        }, i.prototype.parse = function(t) {
            n.parsePrizePool(t)
        }, i.prototype.getPath = function() {
            return "game.web/services/tournament/" + n.tournamentId + "/prizes/leaderboard"
        }, i.prototype.getName = function() {
            return "GetTournamentPrizePoolRequest"
        }, i
    }), _d("*$", ["^#", "&&", "@@", "$", "#^"], function(t, e, o, n, i) {
        "use strict";
        function s() {
            e.apply(this, arguments)
        }
        return t.extend(s, e), s.prototype.getParams = function(t) {
            t.sessionId = o.sessionId, t.gameId = o.gameId
        }, s.prototype.parse = function(t) {
            i.parseRafflePrizePool(t)
        }, s.prototype.getPath = function() {
            return "game.web/services/tournament/" + n.tournamentId + "/prizes/raffle"
        }, s.prototype.getName = function() {
            return "GetTournamentRafflePrizePoolRequest"
        }, s
    }), _d("%#", ["^#", "&&", "@@", "$", "#^"], function(t, e, o, n, i) {
        "use strict";
        function s() {
            e.apply(this, arguments)
        }
        return t.extend(s, e), s.prototype.getParams = function(t) {
            t.sessionId = o.sessionId, t.gameId = o.gameId
        }, s.prototype.parse = function(t) {
            i.parseRaffleResults(t)
        }, s.prototype.getPath = function() {
            return "game.web/services/tournament/" + n.tournamentId + "/results"
        }, s.prototype.getName = function() {
            return "GetTournamentRaffleRequest"
        }, s
    }), _d("*%", ["^#", "&&", "@@", "%"], function(t, e, o, n) {
        "use strict";
        function i() {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.getHeaders = function() {
            return {
                "SESSION-ID": o.sessionId
            }
        }, i.prototype.parse = function(t) {
            n.parse(t)
        }, i.prototype.getName = function() {
            return "MissionRequest"
        }, i.prototype.getPath = function() {
            return "game.web/boost/mission/" + o.gameId + "/info"
        }, i
    }), _d("##", ["^#", "&&", "@@", "%"], function(t, e, o, n) {
        "use strict";
        function i() {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.getHeaders = function() {
            return {
                "SESSION-ID": o.sessionId
            }
        }, i.prototype.parse = function(t) {
            n.parseState(t)
        }, i.prototype.getName = function() {
            return "MissionRestartRequest"
        }, i.prototype.getPath = function() {
            return "game.web/boost/mission/" + n.missionId + "/reset"
        }, i
    }), _d("*&", ["^#", "&&", "@@", "*^", "#", "#@"], function(t, e, i, o, s, r) {
        "use strict";
        function n() {
            e.apply(this, arguments)
        }
        return t.extend(n, e), n.prototype.getParams = function(t) {
            t.participate = this.participate, t.campaignId = this.campaignId
        }, n.prototype.parse = function(t) {}, n.prototype.getPath = function() {
            return "game.web/boost/campaigns/participate"
        }, n.prototype.getName = function() {
            return "ParticipateInBoostRequest"
        }, n.prototype.getHeaders = function() {
            return {
                "SESSION-ID": i.sessionId
            }
        }, n.prototype.setCampaignId = function(t) {
            this.campaignId = t
        }, n.prototype.setDecision = function(t) {
            this.participate = t
        }, n.prototype.onResults = function(t, e) {
            if (s.emit("request/end"), t)
                this.error({
                    title: r.get("connection_error_title") || "Connection Problem",
                    msg: r.get("connection_error_message") || "Check your internet connection and try again"
                });
            else if (e) {
                var o = JSON.parse(e);
                o.utcts && i.setServerTime(o.utcts);
                var n = void 0 === o.code ? o : o.data;
                n ? (this.parse(n), this.onSuccess && this.onSuccess()) : this.error(o)
            }
        }, n.prototype.onRequestStart = function() {
            var t = {};
            this.getParams(t), (new o).post(i.baseURL + "/" + this.getPath(), t, this.getHeaders(), this.onResults)
        }, n
    }), _d("**", ["^#", "&&", "@@", "@"], function(t, e, o, n) {
        "use strict";
        function i() {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.getParams = function(t) {
            t.fn = "promotions", t.sessid = o.sessionId, t.gameid = o.gameId, t.currency = o.currency, t.org = o.organization
        }, i.prototype.parse = function(t) {
            n.parse(t)
        }, i.prototype.getName = function() {
            return "PromoRequest"
        }, i
    }), _d("%%", ["^#", "&&", "@@", "$", "#^"], function(t, e, o, n, i) {
        "use strict";
        function s() {
            e.apply(this, arguments)
        }
        return t.extend(s, e), s.prototype.getParams = function(t) {
            t.sessionId = o.sessionId, t.gameId = o.gameId
        }, s.prototype.parse = function(t) {}, s.prototype.getPath = function() {
            return "game.web/services/tournament/" + n.tournamentId + "/results/" + i.winChestId
        }, s.prototype.getName = function() {
            return "SendChestWinNotifyRequest"
        }, s
    }), _d("#&", ["^#", "&&", "@@", "%", "#^"], function(t, e, o, n, i) {
        "use strict";
        function s() {
            e.apply(this, arguments)
        }
        return t.extend(s, e), s.prototype.getHeaders = function() {
            return {
                "SESSION-ID": o.sessionId
            }
        }, s.prototype.parse = function(t) {}, s.prototype.getPath = function() {
            return "game.web/boost/raffle/" + n.missionId + "/result/" + i.winChestId
        }, s.prototype.getName = function() {
            return "SendMissionChestWinNotifyRequest"
        }, s
    }), _d("*(", ["^#", "&&", "@@", "$", "#^"], function(t, e, o, n, i) {
        "use strict";
        function s() {
            e.apply(this, arguments)
        }
        return t.extend(s, e), s.prototype.getParams = function(t) {
            t.fn = "tournament", t.sessid = o.sessionId, t.org = o.organization, t.gameid = o.gameId
        }, s.prototype.parse = function(t) {
            i.parse(t), n.parse(t)
        }, s.prototype.getName = function() {
            return "TournamentRequest"
        }, s
    }), _d("@#", ["^#", "*)", "$", "*@", "%#", "#^"], function(t, e, o, n, i, s) {
        "use strict";
        function r() {
            e.apply(this, arguments), this.add(n), this.add(i, this.hasActiveRaffle)
        }
        return t.extend(r, e), r.prototype.hasActiveRaffle = function() {
            return o.isRaffle() && s.qualified
        }, r.prototype.getName = function() {
            return "GetTournamentInfoRequestSequence"
        }, r
    }), _d("(!", ["@@", "^#", "*)", "%", "*%", "&)"], function(t, e, o, n, i, s) {
        "use strict";
        function r() {
            o.apply(this, arguments), this.add(i), this.add(s, this.hasMission)
        }
        return e.extend(r, o), r.prototype.hasMission = function() {
            return n.hasMission()
        }, r.prototype.onAllStepsCompleted = function() {
            this.hasMission() && n.refreshState()
        }, r.prototype.getName = function() {
            return "MissionInitRequestSequence"
        }, r
    }), _d("%$", ["@@", "^#", "*)", "*(", "*$", "*#", "*@", "$", "#^", "@#", "*!"], function(t, e, o, n, i, s, r, a, u, p, l) {
        "use strict";
        function h() {
            o.apply(this, arguments), this.add(n), this.add(l, this.hasTournament), this.add(i, this.shouldPrizePool), this.add(s, this.shouldPrizePool), this.add(p, this.shouldGetTournamentInfo)
        }
        return e.extend(h, o), h.prototype.onAllStepsCompleted = function() {
            a.updateStatus()
        }, h.prototype.hasTournament = function() {
            return a.hasTournament()
        }, h.prototype.shouldPrizePool = function() {
            return a.hasTournament() && !a.isScheduled()
        }, h.prototype.shouldGetTournamentInfo = function() {
            return a.hasTournament() && (a.isPostTournament() || a.isActive())
        }, h.prototype.getName = function() {
            return "TournamentInitRequestSequence"
        }, h
    }), _d("^^", ["@@", "^&"], function(o, n) {
        "use strict";
        return {
            generateIconURL: function(t, e) {
                return n.substitute("{0}/{1}/{2}", o.boostIconsURL, t, e)
            }
        }
    }), _d("((", [")", "!", "#", "(@", "$", "(#", "#^", "($", "(%", "(^", "(&", "(*", "#@"], function(n, t, e, o, i, s, r, a, u, p, l, h, c) {
        "use strict";
        function d() {
            t.bindAll(this), this.activePage = null, this.pages = [], this.addPages(), this.popup = this.createPopup(), this.configButtons()
        }
        return d.prototype.clearPopupStatusClass = function() {
            n.removeClass(this.popup, "active"), n.removeClass(this.popup, "notActive")
        }, d.prototype.getFrameConfig = function() {
            return {
                menuItems: this.getPagesAsConfig(),
                gameLogo: this.getGameLogoName(),
                loadingLabel: c.get("tournament_loadingLabel"),
                status: this.getStatusClass(),
                bottomLogoArea: this.getBottomLogoAreaContent()
            }
        }, d.prototype.getStatusClass = function() {
            return "active"
        }, d.prototype.getGameLogoName = function() {
            return "tournament_game_logo"
        }, d.prototype.getBottomLogoAreaContent = function() {
            return function() {
                return function(t, e) {
                    return e("<div class='{{gameLogo}} logoImage'></div>")
                }
            }
        }, d.prototype.getPagesAsConfig = function() {
            for (var t = [], e = 0; e < this.pages.length; e++) {
                var o = {};
                o.itemId = this.pages[e].pageName, o.title = this.pages[e].title, t.push(o)
            }
            return t
        }, d.prototype.addPages = function() {}, d.prototype.addPage = function(t, e) {
            var o = new e(this, t);
            this.pages.push(o)
        }, d.prototype.createPopup = function() {
            var t = this.getFrameConfig(),
                e = s.get("tournamentFrame.html", t),
                o = n.toHTML(e);
            return document.body.appendChild(o), o
        }, d.prototype.configButtons = function() {
            this.configCloseButton(), this.configMenuButtons(), this.configHamburgerButton()
        }, d.prototype.configCloseButton = function() {
            this.closeButton = this.popup.getElementsByClassName("closeTournament")[0], o.onClick(this.closeButton, this.closePopup)
        }, d.prototype.configMenuButtons = function() {
            for (var t = this.popup.getElementsByClassName("tournamentFrameMenuButton"), e = 0; e < t.length; e++)
                o.onClick(t[e], this.switchTab)
        }, d.prototype.configHamburgerButton = function() {
            var t = document.getElementById("tournamentHamburger");
            o.onClick(t, this.toggleMenu)
        }, d.prototype.closePopup = function() {
            document.body.removeChild(this.popup)
        }, d.prototype.switchTab = function(t) {
            var e = t.target.attributes.rel.value;
            this.pageChanged(e) && this.setActive(e)
        }, d.prototype.setActive = function(t) {
            this.clearPages(), this.hideExpandedMenu(), this.activePage = this.getPageById(t), this.activePage.show()
        }, d.prototype.getPageById = function(t) {
            for (var e = 0; e < this.pages.length; e++)
                if (this.pages[e].pageName === t)
                    return this.pages[e];
            return null
        }, d.prototype.clearPages = function() {
            for (var t = 0; t < this.pages.length; t++)
                this.pages[t].close()
        }, d.prototype.pageChanged = function(t) {
            for (var e = 0; e < this.pages.length; e++)
                if (this.pages[t] === this.activePage)
                    return !1;
            return !0
        }, d.prototype.switchButtons = function(t) {
            for (var e = this.popup.getElementsByClassName("tournamentFrameMenuButton"), o = 0; o < e.length; o++)
                n.removeClass(e[o], "selected");
            n.addClass(document.getElementById("button_" + t), "selected"), n.addClass(document.getElementById("portraitButton_" + t), "selected")
        }, d.prototype.getMenuElements = function() {
            return [this.popup.getElementsByClassName("tournamentMenu")[0], document.getElementById("portraitMenu"), this.popup.getElementsByClassName("tournamentFrameWrapper")[0]]
        }, d.prototype.toggleMenu = function() {
            for (var t = this.getMenuElements(), e = 0; e < t.length; e++)
                n.toggleClass(t[e], "expanded")
        }, d.prototype.hideExpandedMenu = function() {
            for (var t = this.getMenuElements(), e = 0; e < t.length; e++)
                n.removeClass(t[e], "expanded")
        }, d.prototype.feedPagesWrapper = function(t) {
            document.getElementById("tournamentPagesWrapper").innerHTML = t
        }, d.prototype.goToPageNumber = function(t) {
            this.setActive(this.pages[t].pageName)
        }, d
    }), _d("@*", ["()", ")!", ")@", ")#", ")$", ")%", ")^", ")&"], function(t, e, o, n, i, s, r, a) {
        "use strict";
        var u = {},
            p = {},
            l = {};
        function h(t, e, o) {
            p[t] = e, l[t] = o
        }
        return u.PROMO = "promo", u.TOURNAMENT = "tournament", u.SHARE = "share", u.MISSION = "mission", u.createButton = function(t) {
            return new p[t]
        }, u.createTopPanel = function(t) {
            return new l[t]
        }, h(u.PROMO, t, e), h(u.TOURNAMENT, o, n), h(u.SHARE, i, s), h(u.MISSION, r, a), u
    }), _d("#$", ["!", "^#", ")*", "(@"], function(t, e, o, n) {
        "use strict";
        function i(t) {
            t.template = "boostMessageWindow.html", o.call(this, t), !0 !== t.modal && n.onClick(this.overlay.overlay, this.hide)
        }
        return e.extend(i, o), i.prototype.getPrimaryButtonClass = function() {
            return ""
        }, i.prototype.getSecondaryButtonClass = function() {
            return ""
        }, i.prototype.getWidth = function() {
            return 1900
        }, i.prototype.getMobileScaleFactor = function() {
            return 1.4
        }, i.prototype.getPortraitScaleFactor = function() {
            return 1.2
        }, i
    }), _d(")(", ["("], function(e) {
        "use strict";
        function t(t) {
            this.isNewBoostTopPanel = !0, this.height = t, this.scale = {
                set: function() {}
            }, this.position = {
                set: function() {}
            }
        }
        return t.prototype.getHeight = function(t) {
            return t ? this.height / e.root.hud.scale.y : this.height
        }, t.prototype.removeListeners = function() {}, t
    }), _d(")^", ["^#", "))", "#@", "#", "%", "#^"], function(t, e, o, n, i, s) {
        "use strict";
        function r() {
            e.call(this, this.getText(), this.getStyle(), "promo/button_green_side", this.openMissionFrame), this.addEventListeners(), this.refresh()
        }
        return t.extend(r, e), r.prototype.addEventListeners = function() {
            i.on("status/changed", this.refresh), n.on("tournament/winNotify", this.refresh), n.once("boost/hideButton", this.removeEventListeners, n.PRIORITY_HIGHEST)
        }, r.prototype.removeEventListeners = function() {
            i.off("status/changed", this.refresh), n.off("tournament/winNotify", this.refresh)
        }, r.prototype.refresh = function() {
            this.updateImages(this.getTextureName()), this._label.text = this.getText(), this.refreshView()
        }, r.prototype.getTextureName = function() {
            return i.isActive() ? "promo/button_green_side" : s.canPlayRaffle() ? "promo/button_orange_side" : "promo/button_grey_side"
        }, r.prototype.getText = function() {
            return s.canPlayRaffle() ? o.get("tournament_raffle_info_button") : o.get("mission_button")
        }, r.prototype.getStyle = function() {
            return {
                fontFamily: "'Trebuchet MS', Helvetica, sans-serif",
                fontSize: "32px",
                fill: "#ffffff"
            }
        }, r.prototype.openMissionFrame = function() {
            n.emit("mission/open")
        }, r
    }), _d("@)", ["!", "^#", ")*", "#@", "%", "@$", "@%", "&$", "^&", "#^", "^%", "(@", "#"], function(t, e, o, n, i, s, r, a, u, p, l, h, c) {
        "use strict";
        function d(t) {
            this.onContinue = t, o.call(this, this.getPopupOptions()), this.closeButton = this.html.getElementsByClassName("closeTournament")[0], h.onClick(this.closeButton, this.hide), h.onClick(this.overlay.overlay, this.hide)
        }
        return e.extend(d, o), d.prototype.getPopupOptions = function() {
            return {
                template: "missionFinishedPopup.html",
                title: n.get("mission_finished_title"),
                titleDescription: this.getDescriptionTitle(),
                description: this.getDescription(),
                currentScore: i.getScore(),
                bestScore: i.getBestScore(),
                bestScoreLabel: n.get("mission_topbar_best_score"),
                currentScoreLabel: n.get("mission_current_score"),
                completedAllObjectives: i.completedAllObjectives(),
                finishedAllText: this.getFinishedAllText(),
                objectives: i.getObjectives(),
                buttons: [{
                    label: n.get("cashrace_win_popup_continue"),
                    action: this.continue,
                    hideWindow: !0
                }]
            }
        }, d.prototype.continue = function() {
            i.completedAllObjectives() && (i.clearProgress(), c.emit("mission/restarted")), this.isCompleted && this.onContinue()
        }, d.prototype.getPopupImageName = function() {
            return "mission_icon"
        }, d.prototype.getDescriptionTitle = function() {
            return i.completedAllObjectives() ? n.get("mission_completed") : n.get("mission_completed_objective")
        }, d.prototype.getDescription = function() {
            return i.completedAllObjectives() ? null : n.get("mission_complete_description", i.getNumberOfNotCompletedObjectives())
        }, d.prototype.getFinishedAllText = function() {
            return n.get("mission_complete_caption_html", "<span class='scoreValue'>" + i.getBestScore() + "</span>")
        }, d.prototype.getPrimaryButtonClass = function() {
            return ""
        }, d.prototype.getSecondaryButtonClass = function() {
            return ""
        }, d.prototype.getWidth = function() {
            return 2500
        }, d.prototype.getHeight = function() {
            return 1050
        }, d.prototype.getMobileScaleFactor = function() {
            return 1.1
        }, d.prototype.getPortraitScaleFactor = function() {
            return 1.6
        }, d
    }), _d("#!", ["^#", "((", ")", "!", "#", "(@", "(#", "#^", "@!!", "(^", "(&", "@!@", "@!#", "@!$", "$", "%"], function(t, e, o, n, i, s, r, a, u, p, l, h, c, d, f, g) {
        "use strict";
        function m() {
            e.call(this), this.timer = new c, this.setMandatoryPages(), f.on("status/changed", this.onTournamentStatusChanged), this.showObjectives()
        }
        return t.extend(m, e), m.prototype.setMandatoryPages = function() {
            this.objectivesPage = this.pages[0], this.leaderboardPage = this.pages[1], this.rafflePage = this.pages[2], this.rulesPage = this.pages[this.pages.length - 1]
        }, m.prototype.onTournamentStatusChanged = function() {
            this.clearPopupStatusClass(), o.addClass(this.popup, this.getStatusClass())
        }, m.prototype.getStatusClass = function() {
            return this.canShowLeaderboard() ? "active" : "notActive"
        }, m.prototype.canShowLeaderboard = function() {
            return g.isActive() || g.isRaffle()
        }, m.prototype.addPages = function() {
            this.addPage("mission_button", d), this.addPage("tournament_leaderboardLabel", u), f.includeRaffle() && this.addPage("tournament_raffleLabel", p), this.addPage("tournament_prizePoolLabel", l), this.addPage("tournament_rulesLabel", h)
        }, m.prototype.showObjectives = function() {
            this.setActive(this.objectivesPage.pageName)
        }, m.prototype.showLeaderboard = function() {
            this.setActive(this.leaderboardPage.pageName)
        }, m.prototype.showRaffle = function() {
            this.setActive(this.rafflePage.pageName)
        }, m.prototype.showRules = function(t) {
            this.callback = t, this.setActive(this.rulesPage.pageName)
        }, m.prototype.closePopup = function() {
            e.prototype.closePopup.call(this), this.callback && this.callback(), this.timer.resetTimer()
        }, m
    }), _d("@!!", ["@!%", "^#", "%", "#@", "$"], function(t, e, o, n, i) {
        "use strict";
        function s() {
            t.apply(this, arguments)
        }
        return e.extend(s, t), s.prototype.getPageOptions = function(t) {
            return {
                leaderboard: {
                    playersLabel: n.get("tournament_playersLabel"),
                    scoreLabel: n.get("tournament_scoreLabel").toUpperCase(),
                    prizeLabel: n.get("tournament_topbar_prize").toUpperCase(),
                    players: t
                }
            }
        }, s.prototype.getData = function() {
            return i.getLeaderboardData()
        }, s.prototype.getHtmlTemplate = function() {
            return "tournamentLeaderboard.html"
        }, s
    }), _d("@(", ["!", "^#", ")*", "#@", "%", "@$", "@%", "&$", "^&", "#^", "$", "^%", "(@", ")", "#", "#$", "*&", "^!", "@@"], function(t, e, o, n, i, s, r, a, u, p, l, h, c, d, f, g, m, y, _) {
        "use strict";
        function b(t) {
            this.onContinue = t, o.call(this, this.getPopupOptions()), c.onClick(d.byId("fullRulesLink"), this.openRules), this.displayDate()
        }
        return e.extend(b, o), b.prototype.openRules = function() {
            this.setVisibleFalse(), f.emit("mission/openRules", this.setVisibleTrue)
        }, b.prototype.getPopupOptions = function() {
            var t = [];
            return i.participationDecisionMade || t.push({
                label: n.get("tournament_popup_cancel"),
                action: this.showConfirmationPopup.bind(this),
                class: "grey"
            }), t.push({
                label: n.get("cashrace_popup_play"),
                action: this.saveConfirmationToServer,
                hideWindow: !0
            }), {
                template: "tournamentPopup.html",
                title: i.getName().toUpperCase(),
                descriptionTitle: this.getDescriptionTitle(),
                periodText: n.get("boost_campaign_period"),
                description: this.getDescription(),
                moreInfo: n.get("mission_popup_MoreInfo_additional"),
                image: this.getPopupImageName(),
                rules: n.get("tournament_rulesLabel"),
                buttons: t,
                autoclose: !0,
                onHideComplete: this.resetTimer
            }
        }, b.prototype.showConfirmationPopup = function() {
            new g({
                modal: !0,
                title: "",
                message: n.get("tournament_popup_cancel_confirmation_text"),
                buttons: [{
                    label: n.get("tournament_popup_confirmation_no"),
                    class: "grey",
                    hideWindow: !0
                }, {
                    label: n.get("tournament_popup_confirmation_yes"),
                    action: this.onCancelConfirmed,
                    class: "grey",
                    hideWindow: !0
                }]
            })
        }, b.prototype.saveConfirmationToServer = function() {
            if (!i.participationDecisionMade) {
                var t = new m;
                t.setCampaignId(i.missionId), t.setDecision(!0), t.run()
            }
            this.onContinue && this.onContinue()
        }, b.prototype.onCancelConfirmed = function() {
            this.hide(), f.emit("boost/hideButton"), f.emit("boost/hideTopPanel"), f.emit("boost/kill");
            var t = new m;
            t.setCampaignId(i.missionId), t.setDecision(!1), t.run(), this.clearModels()
        }, b.prototype.clearModels = function() {
            l.clear(), p.clear(), i.clear()
        }, b.prototype.getPopupImageName = function() {
            return "mission_icon"
        }, b.prototype.getDescriptionTitle = function() {
            return l.hasCustomPrizes() ? this.getDescriptionWithCustomPrizes() : "<p>" + n.get("cashrace_popup_prize", "<span class='prizePoolTitle'>", "</span>") + " <span>" + h.formatPrize(i.getTotalPrize(), l.getCurrency()) + "</span></p>"
        }, b.prototype.getDescriptionWithCustomPrizes = function() {
            var t = h.formatPrize(i.getTotalPrizeValues(), l.getCurrency());
            return "<span class='prizePoolTitle'>" + n.get("mission_popup_total_prize_values", t) + "</span>"
        }, b.prototype.getDescription = function() {
            return n.has("custom_mission_popup") ? n.get("custom_mission_popup").replace(/\n/g, "<br/>") : this.formatBullets(this.getBullets())
        }, b.prototype.formatBullets = function(t) {
            return (t = t.map(function(t) {
                return "- " + t
            })).join("<br>")
        }, b.prototype.getBullets = function() {
            var t = h.formatReward(l.getFirstReward(), l.getCurrency()),
                e = i.getGames(),
                o = ["<span class='highlighted'>" + n.get("mission_bullet_rule") + "</span>", n.get("cashrace_popup_bullet_winner_prize", "<span class='highlighted'>" + t + "</span>"), n.get("mission_bullet_objectives", i.getNumberOfObjectives()), 3 < e.length ? n.get("cashrace_popup_bullet_availability_rules") : n.get("cashrace_popup_bullet_which_games_rules", e.join(", ")), l.includeRaffle() ? n.get("tournament_popup_bullet_leaderboard_and_raffle") : n.get("tournament_popup_bullet_leaderboard")];
            return l.includeRaffle() && (o = o.concat(this.getRaffleBullets())), l.hasMinBetRule() && o.push(n.get("tournament_popup_bullet_betsize_required", l.getFormattedMinBet())), o
        }, b.prototype.displayDate = function() {
            this.showDates()
        }, b.prototype.showDates = function() {
            document.body.getElementsByClassName("date")[0].innerHTML = this.getDate()
        }, b.prototype.onResize = function() {
            if (this.html) {
                var t = Math.min(_.renderer.width / this.getWidth(), _.renderer.height / this.getHeight());
                _.showMobileUI && (t *= this.getMobileScaleFactor()), _.renderer.width < _.renderer.height && (t *= this.getPortraitScaleFactor());
                var e = _.getScaleFactor();
                t /= e, this.html.style.transform = this.html.style.webkitTransform = "scale(" + t + "," + t + ")", this.html.style.left = _.renderer.width / 2 / e - this.html.clientWidth / 2 * t + "px", this.html.style.top = _.renderer.height / this.getYPositionFactor() / e - this.html.clientHeight / 2 * t + "px"
            }
        }, b.prototype.getDate = function() {
            var t = h.formatDate(l.startDate),
                e = h.formatDate(l.endDate);
            return u.substitute("<span class='dateDays'>{0}</span>{1}", t.days, t.time) + " - " + u.substitute("<span class='dateDays'>{0}</span>{1}", e.days, e.time)
        }, b.prototype.getRaffleBullets = function() {
            var t = h.formatPrize(p.getTotalPrize(), p.getCurrency()),
                e = p.getRafflePrizePool().length;
            return [n.get("tournament_popup_bullet_raffle_prizes", t, e)]
        }, b.prototype.getPrimaryButtonClass = function() {
            return ""
        }, b.prototype.getSecondaryButtonClass = function() {
            return ""
        }, b.prototype.getWidth = function() {
            return 2500
        }, b.prototype.getHeight = function() {
            return 1450
        }, b.prototype.getYPositionFactor = function() {
            return 2.5
        }, b.prototype.getMobileScaleFactor = function() {
            return y.isIPhone() ? .75 : 1
        }, b.prototype.getPortraitScaleFactor = function() {
            return y.isIPhone() ? 2 : 1.6
        }, b
    }), _d("@!@", ["@!%", "^#", "%", "$", "#@", "^%"], function(t, e, o, n, i, s) {
        "use strict";
        function r() {
            t.apply(this, arguments)
        }
        return e.extend(r, t), r.prototype.getPageOptions = function(t) {
            return {
                rules: t
            }
        }, r.prototype.getData = function() {
            return i.has("custom_mission_rules") ? i.get("custom_mission_rules").replace(/\n/g, "<br/>") : this.formatBullets(this.getBullets())
        }, r.prototype.formatBullets = function(t) {
            return (t = t.map(function(t, e) {
                return e + 1 + ". " + t
            })).join("<br><br>")
        }, r.prototype.getBullets = function() {
            var t = [i.get("mission_gamerules_bullet_name", o.getName().toUpperCase()), i.get("mission_gamerules_bullet_period", s.formatDateWithTime(n.startDate), s.formatDateWithTime(n.endDate)), i.get("mission_gamerules_bullet_participatingGames", o.getGames().join(", ").toUpperCase()), i.get("mission_gamerules_bullet_objectives", o.getNumberOfObjectives()), i.get("mission_gamerules_bullet_objectivesOrder"), i.get("mission_gamerules_bullet_details"), i.get("mission_gamerules_bullet_free_to_participate"), i.get("mission_gamerules_bullet_complete_mission"), i.get("mission_gamerules_bullet_leaderboard_based_on_spin_number"), i.get("mission_gamerules_bullet_leaderboard_unique_id"), i.get("mission_gamerules_bullet_leaderboard_equal_score"), n.hasMinBetRule() ? i.get("tournament_gamerules_bullet_betsize_required", n.getFormattedMinBet()) : i.get("tournament_gamerules_bullet_betsize"), i.get("mission_gamerules_bullet_restart_mission", o.getMinSpinsToReset()), i.get("tournament_gamerules_bullet_score_improve"), i.get("mission_gamerules_bullet_autorestart_mission")];
            return n.includeRaffle() && (t = t.concat(this.getRaffleBullets())), n.autopayoutsEnabled ? t.push(i.get("mission_gamerules_bullet_auto_payout_true")) : t.push(i.get("mission_gamerules_bullet_auto_payout")), t.push(i.get("cashrace_gamerules_bullet_payout_cash")), t.push(i.get("mission_gamerules_bullet_leaderboard_refresh")), t
        }, r.prototype.getRaffleBullets = function() {
            var t = n.getGameRulesDynamicData();
            return [i.get("tournament_gamerules_bullet_raffle_prizepool", t.raffleStartPosition, t.raffleEndPosition, t.raffleTotalPrize, t.raffleTime), i.get("tournament_gamerules_bullet_raffle_period"), i.get("tournament_gamerules_bullet_raffle_unclaimed_prizes")]
        }, r.prototype.getHtmlTemplate = function() {
            return "tournamentGameRules.html"
        }, r
    }), _d("@!$", ["@!%", "^#", "%", "#@", "#", ")"], function(t, e, o, n, i, s) {
        "use strict";
        function r() {
            t.apply(this, arguments)
        }
        return e.extend(r, t), r.prototype.getPageOptions = function(t) {
            return {
                objectives: o.getObjectives(),
                restartButtonLabel: n.get("mission_reset_button"),
                isActive: o.isActive()
            }
        }, r.prototype.pageActions = function(t) {
            var e = document.getElementById("resetMissionButton");
            e && (e.onclick = this.restartMission), s.forEachWithClass("objective", function(t, e) {
                t.onclick = function(t) {
                    var e = t.currentTarget.getElementsByClassName("objectiveDescription")[0];
                    s.toggleClass(e, "open")
                }
            })
        }, r.prototype.restartMission = function() {
            this.tournamentFrame.closePopup(), i.emit("mission/reset")
        }, r.prototype.getData = function() {
            return {}
        }, r.prototype.getHtmlTemplate = function() {
            return "missions.html"
        }, r
    }), _d(")&", ["@!^", "^#", "#@", "#)", "*", "@!&", "@!*", "@!(", "%", "@$", "#", "$", "@@", "^&"], function(t, e, o, n, i, s, r, a, u, p, l, h, c, d) {
        "use strict";
        function f() {
            t.apply(this, arguments)
        }
        return e.extend(f, t), f.prototype.addListeners = function() {
            t.prototype.addListeners.call(this), l.on("mission/restarted", this.refreshAll), l.on("mission/refresh", this.refreshAll), i.on("totalBet/changed", this.onBetChanged)
        }, f.prototype.removeListeners = function() {
            t.prototype.removeListeners.call(this), l.off("mission/restarted", this.refreshAll), l.off("mission/refresh", this.refreshAll), i.off("totalBet/changed", this.onBetChanged)
        }, f.prototype.onSpinDataLoaded = function() {}, f.prototype.createSegments = function() {
            var t = u.getCurrentObjective().description;
            c.showMobileUI && (t = d.shortenLongString(t, 35)), this.icon = this.addSegment(new s({
                icon: "icon_mission.png",
                title: t,
                background: "top_bar_left_light_grey.png"
            })), this.progress = this.addSegment(new a({
                autoResize: !0,
                autoResizePadding: 5,
                width: 200,
                background: "top_bar_fill_white.png"
            })), this.scoreLabel = this.addSegment(new s({
                icon: "icon_score.png",
                title: o.get("tournament_topbar_score"),
                background: "top_bar_fill_light_grey.png"
            })), this.score = this.addSegment(new r({
                autoResize: !0,
                autoResizePadding: 25,
                background: "top_bar_right_white.png"
            })), this.minBetSegment = this.addSegment(new s({
                icon: "icon_error.png",
                showTitleInPortrait: !0,
                title: o.get("tournament_topnav_minBetSize", h.getFormattedMinBet()),
                background: "top_bar_left_right_light_grey.png"
            }))
        }, f.prototype.refreshValues = function() {
            var t = h.isMinBetFulfilled();
            this.progress.updateState({
                completed: u.getCompleted(),
                total: u.getTotal(),
                visible: t
            });
            var e = u.getScore();
            0 < u.getBestScore() && (e += " (" + u.getBestScore() + ")"), this.score.updateState({
                value: e,
                visible: t
            }), this.icon.updateState({
                visible: t
            }), this.scoreLabel.updateState({
                visible: t
            }), this.minBetSegment.updateState({
                visible: !t
            })
        }, f.prototype.onBetChanged = function() {
            this.refreshValues(), this.refreshLayout()
        }, f
    }), _d("()", ["^#", "))", "@", "#(", "#@"], function(t, e, o, n, i) {
        "use strict";
        function s() {
            e.call(this, i.get("promo_button_" + o.type), this.getFontVars(), "promo/button_green_side", this.createNewPromoMessage)
        }
        return t.extend(s, e), s.prototype.getFontVars = function() {
            return {
                font: "32px 'Trebuchet MS', Helvetica, sans-serif",
                fill: "#feffb6"
            }
        }, s.prototype.createNewPromoMessage = function() {
            new n(o.getBeginWindowOptions())
        }, s
    }), _d("#(", ["!", "^#", ")*", "#@", "$%"], function(t, e, o, n, i) {
        "use strict";
        function s(t) {
            this.attachOptions(t), o.call(this, t)
        }
        return e.extend(s, o), s.prototype.attachOptions = function(t) {
            t.modal = !1, t.template = "promoWindow.html", t.title = n.get("superSpin_" + t.type + "_welcomeMsg_top"), t.message = this.getMessage(t), t.buttonLabel = t.begin ? n.get("promo_window_button") : n.get("promo_window_button_end"), t.showValueInsideIcon = "prepaid" === t.type, t.iconValue = t.targetValue || t.spinsPlayed
        }, s.prototype.getMessage = function(t) {
            return t.begin ? this.getWelcomMessage(t) : t.finish ? this.getEndMessage(t) : void 0
        }, s.prototype.getWelcomMessage = function(t) {
            var e = t.type;
            return t.subtype && "" !== t.subtype && (e += "_" + t.subtype.toLowerCase()), n.get("superSpin_" + e + "_welcomeMsg_bottom", "<span class='" + t.type + "'>" + t.targetValue + "</span>", "<span class='" + t.type + "'>" + i.format(t.helperValue) + "</span>", "<span class='" + t.type + "'>" + t.counterValue + "</span>")
        }, s.prototype.getEndMessage = function(t) {
            var e = "<span class='" + t.type + "'>" + i.format(t.prize) + "</span>";
            return t.spinsPlayed ? n.get("superSpin_" + t.type + "_endMsg", "<span class='" + t.type + "'>" + t.spinsPlayed + "</span>", e) : n.get("freerounds_endMsg", e)
        }, s
    }), _d(")!", ["@!^", "^#", "@", "$%", "#@", "^", "@!&", "@!*"], function(t, e, o, n, i, s, r, a) {
        "use strict";
        function u() {
            t.apply(this, arguments)
        }
        return e.extend(u, t), u.prototype.createSegments = function() {
            this.refreshValues(!0), this.addSegment(new r({
                icon: "promo_s_icon_" + this.type + ".png",
                title: i.get("promo_value_" + this.type),
                background: "top_bar_left_light_grey.png"
            })), this.leftSegment = this.addSegment(new a({
                autoResize: !0,
                autoResizePadding: 5,
                width: 100,
                background: "top_bar_fill_white.png"
            })), this.addSegment(new r({
                icon: "icon_win_" + this.type + ".png",
                title: i.get("promo_total_win"),
                background: "top_bar_fill_light_grey.png"
            })), this.totalWinSegment = this.addSegment(new a({
                width: 200,
                background: "top_bar_right_white.png"
            }))
        }, u.prototype.refreshValues = function(t) {
            o.isLastPromoSpin() && !t || (this.type = o.type, this.currentValue = o.finalValue || o.currentValue), this.totalWin = o.finalTotalWin || o.totalWin
        }, u.prototype.onSpinDataLoaded = function() {
            s.isFirstSmallSpin() && (this.type === o.TYPES.PREPAID ? this.currentValue-- : this.type !== o.TYPES.SINGLE_WIN && this.type !== o.TYPES.TOTAL_WIN || this.currentValue++, this.refreshLayout())
        }, u.prototype.refreshLayout = function() {
            null !== this.currentValue && this.leftSegment.setState({
                value: this.currentValue
            }), null !== this.totalWin && this.totalWinSegment.setState({
                value: n.format(this.totalWin)
            }), t.prototype.refreshLayout.call(this)
        }, u
    }), _d("@!&", ["^#", "@!)", "@@", "^!"], function(t, e, o, n) {
        "use strict";
        function i(t) {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.createComponents = function(t) {
            e.prototype.createComponents.call(this, t), this.icon = this.createIcon(t), this.label = this.createLabel(t)
        }, i.prototype.createIcon = function(t) {
            if (t.icon) {
                var e = PIXI.Sprite.fromImage("images/promo/" + t.icon);
                return e.anchor.set(.5, .5), this.addChild(e)
            }
            return new PIXI.Container
        }, i.prototype.createLabel = function(t) {
            var e = new PIXI.Text(t.title, {
                fontFamily: "'Trebuchet MS', Helvetica, sans-serif",
                fontSize: "32px",
                fill: "#2f2f39",
                padding: 5
            });
            return e.anchor.set(.5, .5), this.addChild(e)
        }, i.prototype.refresh = function() {
            e.prototype.refresh.call(this), this.label.visible = !o.isMobile || !n.isPortraitMode() || this.config.showTitleInPortrait;
            var t = this.label.visible ? this.label.width : 0;
            this.label.updateText(), this.background.width = 15 + this.icon.width + 15 + t + 15, this.background.x = this.background.width / 2, this.icon.x = this.icon.width / 2 + 15 * (this.label.visible ? 1 : 1.5), this.label.x = this.icon.x + this.icon.width / 2 + 15 + this.label.width / 2
        }, i
    }), _d("@!(", ["^#", "@!)"], function(t, o) {
        "use strict";
        function e(t) {
            o.apply(this, arguments), this.coloredBackground = this.createColoredBackground()
        }
        return t.extend(e, o), e.prototype.createColoredBackground = function() {
            var t = this.createBackground(this.config);
            return this.setChildIndex(t, 1), t.alpha = 0, t
        }, e.prototype.createComponents = function(t) {
            o.prototype.createComponents.call(this, t), this.label = this.createProgress(t), this.label = this.createValue(t)
        }, e.prototype.getInitialState = function() {
            return {
                value: 0
            }
        }, e.prototype.createProgress = function() {
            this.progressBackground = this.addChild(PIXI.Sprite.fromFrame("images/promo/progress_bar_empty.png")), this.progressFill = this.addChild(PIXI.Sprite.fromFrame("images/promo/progress_bar_fill.png")), this.progressMask = this.addChild(new PIXI.Graphics), this.progressFill.mask = this.progressMask
        }, e.prototype.createValue = function() {
            var t = new PIXI.Text("", {
                fontFamily: "'Trebuchet MS', Helvetica, sans-serif",
                fontSize: "40px",
                fontWeight: "bold",
                fill: "white",
                padding: 5
            });
            return t.anchor.set(.5, .5), this.addChild(t)
        }, e.prototype.refresh = function() {
            o.prototype.refresh.call(this), this.label.text = this.state.completed + "/" + this.state.total, this.background.width = this.config.width, this.background.x = this.background.width / 2, this.coloredBackground && (this.coloredBackground.x = this.background.x, this.coloredBackground.width = this.background.width), this.label.x = this.background.x, this.progressBackground.y = -this.progressBackground.height / 2, this.progressFill.y = -this.progressFill.height / 2, this.progressMask.y = this.progressFill.y, this.progressBackground.x = this.background.x - this.progressBackground.width / 2, this.progressFill.x = this.background.x - this.progressFill.width / 2, this.progressMask.x = this.progressFill.x, this.refreshMask()
        }, e.prototype.refreshMask = function() {
            var t = this.state.completed / this.state.total;
            this.progressMask.clear(), this.progressMask.beginFill(0, 1), this.progressMask.drawRect(0, 0, this.progressBackground.width * t, this.progressBackground.height), this.progressMask.endFill()
        }, e.prototype.updateState = function(t) {
            var e = this.state.completed;
            this.tryToBlink(e, t.completed), o.prototype.updateState.call(this, t)
        }, e.prototype.tryToBlink = function(t, e) {
            void 0 !== t && e !== t && (0 === e ? this.blink(16711680) : this.blink(16774912))
        }, e.prototype.blink = function(t) {
            this.coloredBackground.tint = t, this.coloredBackground.alpha = 1, TweenMax.to(this.coloredBackground, .75, {
                alpha: 0,
                ease: Cubic.easeOut
            })
        }, e
    }), _d("@!)", ["^#", "!", "@@!", "^!", "@@", "%*"], function(t, e, o, n, i, s) {
        "use strict";
        function r(t) {
            PIXI.Container.call(this), e.bindAll(this), this.config = this.parseConfig(t), this.createComponents(this.config), this.setState(this.getInitialState())
        }
        return t.extend(r, PIXI.Container), r.prototype.createComponents = function(t) {
            this.background = this.createBackground(t)
        }, r.prototype.parseConfig = function(t) {
            return (t = t || {}).background = t.background || "top_bar_fill_light_grey.png", t
        }, r.prototype.getInitialState = function() {
            return {}
        }, r.prototype.updateState = function(t) {
            s.mixin(this.state, t), this.refresh()
        }, r.prototype.setState = function(t) {
            this.state = t, this.refresh()
        }, r.prototype.createBackground = function(t) {
            var e = new o("images/promo/" + t.background, new PIXI.Rectangle(.45, 0, .15, 1));
            return e.anchor.set(.5, .5), this.addChildAt(e, 0)
        }, r.prototype.refresh = function() {
            this.visible = void 0 === this.state.visible || this.state.visible, this.state.background && this.config.background !== this.state.background && (this.config.background = this.state.background, this.removeChild(this.background), this.background = this.createBackground(this.config)), this.background.x = this.background.width / 2
        }, r
    }), _d("@!*", ["^#", "@!)"], function(t, o) {
        "use strict";
        function e(t) {
            o.apply(this, arguments)
        }
        return t.extend(e, o), e.prototype.createComponents = function(t) {
            o.prototype.createComponents.call(this, t), this.label = this.createValue(t)
        }, e.prototype.getInitialState = function() {
            return {
                value: 0
            }
        }, e.prototype.createValue = function() {
            var t = new PIXI.Text("", {
                fontFamily: "'Trebuchet MS', Helvetica, sans-serif",
                fontSize: "40px",
                fill: "#2f2f39",
                padding: 5
            });
            return t.anchor.set(.5, .5), this.addChild(t)
        }, e.prototype.refresh = function() {
            o.prototype.refresh.call(this), this.label.text = this.state.value, this.label.scale.set(1);
            var t = 2 * (this.config.autoResizePadding || 0),
                e = this.config.width || 0;
            this.config.autoResize ? this.background.width = Math.max(e, this.label.width + t) : (this.background.width = this.config.width, this.label.width = Math.min(this.label.width, this.config.width - t), this.label.scale.y = this.label.scale.x), this.background.x = this.background.width / 2, this.label.x = this.background.x
        }, e
    }), _d(")%", ["@!^", "^#", "#@", "@!&"], function(t, e, o, n) {
        "use strict";
        function i() {
            t.apply(this, arguments)
        }
        return e.extend(i, t), i.prototype.createSegments = function() {
            this.addSegment(new n({
                icon: "icon_replay.png",
                title: o.get("share_replay"),
                background: "top_bar_left_right_light_grey.png",
                showTitleInPortrait: !0
            }))
        }, i
    }), _d(")$", ["^#", "))", "#@", "@@@", "@$", "#"], function(t, e, o, n, i, s) {
        "use strict";
        function r() {
            e.call(this, o.get("share_button"), this.getFontVars(), "promo/button_blue_side", this.openSharePopup), i(function() {
                this.show()
            }.bind(this), 0), this.visible = !1
        }
        return t.extend(r, e), r.prototype.getFontVars = function() {
            return {
                font: "32px 'Trebuchet MS', Helvetica, sans-serif",
                fill: "#ffffff"
            }
        }, r.prototype.openSharePopup = function() {
            new n
        }, r.prototype.show = function() {
            var t = this.x;
            this.x -= this.width, this.timeLineAnimation = new TimelineMax, this.timeLineAnimation.to(this, .4, {
                x: t
            }), this.timeLineAnimation.to(this, .4, {
                x: 8,
                repeat: 3,
                yoyo: !0,
                ease: Sine.easeInOut
            }, .4), this.visible = !0, s.once("orientation/changed", this.onOrientationChanged, s.PRIORITY_HIGHEST)
        }, r.prototype.onOrientationChanged = function() {
            this.timeLineAnimation && (this.timeLineAnimation.kill(), this.timeLineAnimation = null)
        }, r
    }), _d("@@@", ["!", "^#", ")*", "#@", ")", "^&", "(@", "#", "$&"], function(t, e, i, o, s, n, r, a, u) {
        "use strict";
        function p() {
            i.call(this, this.getPopupOptions()), this.closeButton = this.html.getElementsByClassName("closeTournament")[0], r.onClick(this.closeButton, this.hide), r.onClick(s.byId("iconFacebook"), this.onFacebookClicked), r.onClick(s.byId("iconTwitter"), this.onTwitterClicked)
        }
        return e.extend(p, i), p.prototype.getPopupOptions = function() {
            return {
                template: "sharePopup.html",
                title: o.get("share_popup_title"),
                description: o.get("share_popup_description"),
                orText: o.get("share_popup_or"),
                copyLinkText: o.get("share_popup_copyLink"),
                link: u.getLink()
            }
        }, p.prototype.onFacebookClicked = function() {
            a.emit("share/facebook")
        }, p.prototype.onTwitterClicked = function() {
            a.emit("share/twitter")
        }, p.prototype.getWidth = function() {
            return 1600
        }, p.prototype.getHeight = function() {
            return 700
        }, p.prototype.getMobileScaleFactor = function() {
            return 1.1
        }, p.prototype.getPortraitScaleFactor = function() {
            return 1.4
        }, p.prototype.show = function(t) {
            var e = i.prototype.show.call(this, t),
                o = s.byId("shareLink");
            o.onfocus = function(t) {
                t.target.setSelectionRange(0, this.value.length)
            }, o.focus(), o.setSelectionRange(0, o.value.length);
            var n = new Clipboard("#copyLink");
            return n.on("success", function(t) {
                o.className = "success"
            }), n.on("error", function(t) {
                o.className = "fail"
            }), e
        }, p
    }), _d("@!^", ["^#", "!", "#", "^"], function(t, e, o, n) {
        "use strict";
        function i() {
            PIXI.Container.call(this), e.bindAll(this), this.segments = this.addChild(new PIXI.Container), this.createSegments(), this.refreshAll(), this.addListeners()
        }
        return t.extend(i, PIXI.Container), i.prototype.addListeners = function() {
            o.on("restore/skip", this.refreshAll), o.on("spin/definiteEnd", this.refreshAll), o.on("spin/dataLoaded", this.onSpinDataLoaded), o.on("orientation/changed", this.refreshLayout)
        }, i.prototype.removeListeners = function() {
            o.off("restore/skip", this.refreshAll), o.off("spin/definiteEnd", this.refreshAll), o.off("spin/dataLoaded", this.onSpinDataLoaded), o.off("orientation/changed", this.refreshLayout)
        }, i.prototype.createSegments = function() {}, i.prototype.addSegment = function(t) {
            return t.x = this.segments.width, this.segments.addChild(t), this.segments.x = .5 * -this.segments.width, this.segments.y = this.segments.height / 2, t
        }, i.prototype.refreshValues = function() {}, i.prototype.onDefiniteEnd = function() {
            n.isLastSmallSpin() && this.refreshAll()
        }, i.prototype.onSpinDataLoaded = function() {
            this.refreshAll()
        }, i.prototype.refreshAll = function() {
            this.refreshValues(), this.refreshLayout()
        }, i.prototype.refreshLayout = function() {
            var e = 0;
            this.segments.children.forEach(function(t) {
                t.refresh(), t.visible && (t.x = e, e += t.width)
            }), this.segments.x = .5 * -this.segments.width
        }, i.prototype.getHeight = function() {
            return 55
        }, i
    }), _d("@!%", ["(#", "!", "#@"], function(n, o, i) {
        "use strict";
        function t(t, e) {
            o.bindAll(this), this.tournamentFrame = t, this.pageName = e, this.title = i.get(e)
        }
        return t.prototype.show = function() {
            var t = this.getData(),
                e = this.getHTML(t);
            this.tournamentFrame.feedPagesWrapper(e), this.tournamentFrame.switchButtons(this.pageName), this.pageActions(t)
        }, t.prototype.getHTML = function(t) {
            var e = this.getPageOptions(t),
                o = this.getHtmlTemplate();
            return n.get(o, e)
        }, t.prototype.getData = function() {
            throw new Error("Abstract method")
        }, t.prototype.getHtmlTemplate = function() {
            throw new Error("Abstract method")
        }, t.prototype.getPageOptions = function(t) {
            return {}
        }, t.prototype.close = function() {}, t.prototype.pageActions = function() {}, t
    }), _d("@@$", ["@@#", "^#", "^^"], function(i, t, s) {
        "use strict";
        function e() {
            i.apply(this, arguments)
        }
        return t.extend(e, i), e.prototype.getRendererData = function() {
            var t = i.prototype.getRendererData.call(this);
            return t.dataFieldName = "gameCoins", t.iconPrefix = "crossgame_icon", t
        }, e.prototype.getPageOptions = function(t) {
            var e = i.prototype.getPageOptions.call(this, t),
                o = this.getRendererData(),
                n = s.generateIconURL("cross_tournament_icons", "crossgame_icon_{{" + o.singleRowName + "}}.png");
            return e.getIconElement = function() {
                return function(t, e) {
                    return e("<div class='infoRowIco crossgame_icon_default'><img src='" + n + "' onerror='this.style.display=\"none\"' /></div>")
                }
            }, e
        }, e
    }), _d("@@#", ["(%", "^#", ")", "(@", "@$", "@%", "#"], function(n, t, p, o, e, i, s) {
        "use strict";
        function r() {
            n.apply(this, arguments), this.INFO_SCALE = {
                MAX_WIDTH: 1920,
                MIN_WIDTH: 1200,
                SCALE_FACTOR: 1.3
            }
        }
        return t.extend(r, n), r.prototype.show = function() {
            n.prototype.show.call(this), this.switchOnInfoButtons(), this.switchOnResizing()
        }, r.prototype.switchOnResizing = function() {
            s.on("game/resize", this.onResize), this.onResize()
        }, r.prototype.close = function() {
            n.prototype.close.call(this), this.switchOffInfoButtons(), this.removeWindowUpListener(this.onWindowMouseUp), this.removeWindowDownListener(this.onWindowClicked), s.off("game/resize", this.onResize), TweenMax.killTweensOf(this.tournamentPagesWrapper)
        }, r.prototype.switchOnInfoButtons = function() {
            for (var t = p.byClass("infoIcon"), e = 0; e < t.length; e++)
                o.onClick(t[e], this.onInfoClicked)
        }, r.prototype.switchOffInfoButtons = function() {
            for (var t = p.byClass("infoIcon"), e = 0; e < t.length; e++)
                o.removeOnClick(t[e], this.onInfoClicked)
        }, r.prototype.hideAllInfo = function() {
            for (var t = p.byClass("leaderboardExtraInfo"), e = 0; e < t.length; e++)
                p.addClass(t[e], "hidden")
        }, r.prototype.removeOnTopClasses = function() {
            for (var t = p.byClass("row"), e = 0; e < t.length; e++)
                p.removeClass(t[e], "onTop")
        }, r.prototype.onInfoClicked = function(t) {
            i(this.timeout), this.hideAllInfo(), this.switchOffInfoButtons(), this.addWindowUpListener(this.onWindowMouseUp), this.showInfo(t)
        }, r.prototype.onWindowMouseUp = function() {
            this.removeWindowUpListener(this.onWindowMouseUp), this.addWindowDownListener(this.onWindowClicked)
        }, r.prototype.addWindowUpListener = function(t) {
            window.addEventListener("mouseup", t), window.addEventListener("touchend", t)
        }, r.prototype.removeWindowUpListener = function(t) {
            window.removeEventListener("mouseup", t), window.removeEventListener("touchend", t)
        }, r.prototype.addWindowDownListener = function(t) {
            window.addEventListener("touchstart", t), window.addEventListener("click", t)
        }, r.prototype.removeWindowDownListener = function(t) {
            window.removeEventListener("touchstart", t), window.removeEventListener("click", t)
        }, r.prototype.showInfo = function(t) {
            var e = t.target.parentElement.parentElement,
                o = e.getElementsByClassName("leaderboardExtraInfo")[0],
                n = o.getElementsByClassName("leaderboardExtraInfoContent")[0];
            p.removeClass(o, "hidden"), p.removeClass(o, "inverted"), n.style.marginTop = "0px", p.addClass(e, "onTop");
            var i = document.getElementById("tournamentPagesWrapper").scrollTop,
                s = e.offsetTop,
                r = document.getElementById("tournamentPagesWrapper").clientHeight,
                a = document.getElementById("leaderboard").clientHeight,
                u = o.clientHeight;
            r < a && r + i < s + u && !(s - u + 80 < 0) ? (n.style.marginTop = -n.clientHeight + "px", p.addClass(o, "inverted")) : p.removeClass(o, "inverted")
        }, r.prototype.onWindowClicked = function() {
            this.hideAllInfo(), this.timeout = e(this.removeOnTopClasses, .3), this.removeWindowDownListener(this.onWindowClicked), e(this.switchOnInfoButtons, .35)
        }, r.prototype.onResize = function() {
            for (var t = p.byClass("leaderboardExtraInfoContent"), e = 0; e < t.length; e++) {
                var o = this.getScale();
                t[e].style.transform = t[e].style.webkitTransform = "scale(" + o + "," + o + ")"
            }
        }, r.prototype.getScale = function() {
            return Math.max(this.INFO_SCALE.MIN_WIDTH / this.INFO_SCALE.MAX_WIDTH * this.INFO_SCALE.SCALE_FACTOR, Math.min(1, window.innerWidth / this.INFO_SCALE.MAX_WIDTH * this.INFO_SCALE.SCALE_FACTOR))
        }, r.prototype.getPageOptions = function(t) {
            var o = this.getRendererData(),
                e = n.prototype.getPageOptions.call(this, t);
            return e.showExtraLabel = !0, e.extraLabel = "", e.extraValue = function() {
                return function(t, e) {
                    return e("<span class='infoIcon'>i</span></p><div class='leaderboardExtraInfo hidden'><div class='leaderboardExtraInfoContent'>{{#" + o.dataFieldName + "}}<div class='infoRow'>{{#getIconElement}}{{/getIconElement}}<span>{{#parseInt}}{{coins}}{{/parseInt}}</span></div>{{/" + o.dataFieldName + "}}</div></div>")
                }
            }, e.getIconElement = function() {
                return function(t, e) {
                    return e("<div class='infoRowIco " + o.iconPrefix + "_{{#toLowerCase}}{{#singleRowNameWrapper}}{{" + o.singleRowName + "}}{{/singleRowNameWrapper}}{{/toLowerCase}}'></div>")
                }
            }, e.toLowerCase = function() {
                return function(t, e) {
                    return e(t).toLowerCase()
                }
            }, e.parseInt = function() {
                return function(t, e) {
                    return parseInt(e(t))
                }
            }, e.singleRowNameWrapper = function() {
                return function(t, e) {
                    return e(t)
                }
            }, e
        }, r.prototype.getRendererData = function() {
            return {
                dataFieldName: "coins",
                singleRowName: "game",
                iconPrefix: "icon"
            }
        }, r
    }), _d("(%", ["@!%", "^#", "$", "#@", ")", "(@", "#", "@@"], function(t, e, n, o, i, s, r, a) {
        "use strict";
        function u() {
            t.apply(this, arguments)
        }
        return e.extend(u, t), u.prototype.getPageOptions = function(t) {
            return {
                leaderboard: {
                    playersLabel: o.get("tournament_playersLabel"),
                    scoreLabel: o.get("tournament_scoreLabel").toUpperCase(),
                    prizeLabel: o.get("tournament_topbar_prize").toUpperCase(),
                    players: t,
                    watchLabel: o.get("tournament_watch"),
                    showWatch: n.showRewatch()
                }
            }
        }, u.prototype.show = function() {
            if (t.prototype.show.call(this), n.showRewatch()) {
                var e = 0,
                    o = function(t) {
                        return function() {
                            this.onWatch(t)
                        }.bind(this)
                    }.bind(this);
                i.forEachWithClass("watchButton", function(t) {
                    s.onClick(t, o(this.getData()[e])), e++
                }.bind(this))
            }
        }, u.prototype.onWatch = function(t) {
            r.emit("watch/run", {
                wagerid: t.wagerId,
                org: t.organization,
                shareOrg: a.organization,
                appsrv: n.getEnvironmentURL(t.environment),
                rewatch: "yes",
                currency: a.currency
            })
        }, u.prototype.getData = function() {
            return n.getLeaderboardData()
        }, u.prototype.getHtmlTemplate = function() {
            return "tournamentLeaderboard.html"
        }, u
    }), _d("(&", ["@!%", "^#", "#@", "$", "#^"], function(t, e, o, n, i) {
        "use strict";
        function s() {
            t.apply(this, arguments)
        }
        return e.extend(s, t), s.prototype.getPageOptions = function(t) {
            return {
                prizes: t,
                includeRaffle: n.includeRaffle(),
                rafflePrizes: i.getRafflePrizePool(!0),
                leaderBoardLabel: o.get("tournament_leaderboardLabel"),
                raffleLabel: o.get("tournament_raffleLabel")
            }
        }, s.prototype.getData = function() {
            return n.getPrizePool(!0)
        }, s.prototype.getHtmlTemplate = function() {
            return "tournamentPrizePool.html"
        }, s
    }), _d("(^", ["@!%", "^#", "#", "#^", "(@", ")", "^%", "#@", "$", "%"], function(t, e, o, i, n, s, r, a, u, p) {
        "use strict";
        function l() {
            t.apply(this, arguments)
        }
        return e.extend(l, t), l.prototype.getPageOptions = function(t) {
            return {
                chooseButtonLabel: a.get("tournament_raffleChooseButton"),
                shuffleButtonLabel: a.get("tournament_raffleShuffleButton"),
                emptyLabel: a.get("tournament_raffleEmptyChest"),
                rewards: t,
                raffleStatus: this.getRaffleStatus(),
                chestWon: i.getChestWon(),
                prizes: i.getRafflePrizePool(!0)
            }
        }, l.prototype.getData = function() {
            return i.hasUnopenedChest() ? i.getRaffleRandomData() : i.getFakeChests()
        }, l.prototype.getRaffleStatus = function() {
            return u.isRaffle() || p.isRaffle() ? i.qualified ? i.winNotified ? a.get("tournament_raffleAlreadyWonAlert") : a.get("tournament_raffleActiveAlert") + " " + i.getRafflePrizePool()[0].formattedPrize : a.get("tournament_raffleNotQualifiedAlert") : a.get("tournament_raffleNoRaffleAlert")
        }, l.prototype.getHtmlTemplate = function() {
            return "tournamentRaffle.html"
        }, l.prototype.pageActions = function(t) {
            this.hideOrShowChests(t), i.canPlayRaffle() && (this.configChooseButtons(), this.activateShuffleButton(t), this.showShuffleButton())
        }, l.prototype.hideOrShowChests = function(t) {
            t && 0 !== t.length ? this.tournamentFrame.popup.getElementsByClassName("rewardsContainer")[0].style.display = "table-cell" : this.tournamentFrame.popup.getElementsByClassName("rewardsContainer")[0].style.display = "none"
        }, l.prototype.activateShuffleButton = function(t) {
            0 < t.length && !i.isChestPicked() && (document.getElementById("shuffleButton").onclick = this.shuffleChests)
        }, l.prototype.showWinInfo = function(t) {
            var e = document.getElementById("raffleStatus");
            t ? (s.addClass(e, "wonStatus"), e.innerHTML = a.get("tournament_raffleWon_banner", i.getFormattedRewardPrize())) : e.innerHTML = a.get("tournament_raffleWonEmpty")
        }, l.prototype.configChooseButtons = function() {
            for (var t = this.tournamentFrame.popup.getElementsByClassName("chooseButton"), e = 0; e < t.length; e++)
                t[e].onclick = this.chooseClicked
        }, l.prototype.hideChooseButtons = function() {
            for (var t = this.tournamentFrame.popup.getElementsByClassName("chooseButton"), e = 0; e < t.length; e++)
                s.addClass(t[e], "hidden"), t[e].onclick = null
        }, l.prototype.showShuffleButton = function() {
            document.getElementById("shuffleButton").style.display = "inline-block"
        }, l.prototype.hideShuffleButton = function() {
            var t = document.getElementById("shuffleButton");
            t.style.display = "none", n.removeOnClick(t)
        }, l.prototype.chooseClicked = function(t) {
            this.openChest(t), this.hideChooseButtons(), this.hideShuffleButton(), o.emit("tournament/winNotify")
        }, l.prototype.openChest = function(t) {
            var e = t.currentTarget.parentNode.getElementsByClassName("chestClosed")[0],
                o = t.currentTarget.parentNode.getElementsByClassName("prizeContainer")[0],
                n = t.currentTarget.parentNode;
            s.removeClass(e, "icon_raffle_chest_closed"), i.getRewardPrize() ? (this.showWonChest(e, n, o), this.showWinInfo(!0)) : (this.showEmptyChest(e, n, o), this.showWinInfo(!1))
        }, l.prototype.showWonChest = function(t, e, o) {
            s.addClass(e, "chestWon"), s.addClass(e, "chestOpen"), s.addClass(t, "icon_raffle_chest_open_win"), o.innerHTML = i.getFormattedRewardPrize()
        }, l.prototype.showEmptyChest = function(t, e, o) {
            s.addClass(e, "chestEmpty"), s.addClass(e, "chestOpen"), s.addClass(t, "icon_raffle_chest_open_empty"), o.innerHTML = a.get("tournament_raffleEmptyChest")
        }, l.prototype.shuffleChests = function() {
            for (var t = document.body.getElementsByClassName("chestContainer"), e = t.length, o = 0; o < e; o++) {
                var n = .5 < Math.random() ? -window.innerWidth : window.innerWidth,
                    i = 200 * Math.random() - 100,
                    s = function() {};
                e - 1 <= o && (s = this.loadNewChests), TweenMax.to(t[o], .25, {
                    x: n,
                    y: i,
                    scaleX: .8,
                    scaleY: .8,
                    yoyo: !0,
                    repeat: 1,
                    ease: Sine.easeInOut,
                    delay: .02 * o,
                    onComplete: s
                })
            }
        }, l.prototype.loadNewChests = function() {
            this.tournamentFrame.showRaffle()
        }, l
    }), _d("(*", ["@!%", "^#", "$", "#@", "^)"], function(t, e, n, i, o) {
        "use strict";
        function s() {
            t.apply(this, arguments)
        }
        return e.extend(s, t), s.prototype.getPageOptions = function(t) {
            return {
                rules: t
            }
        }, s.prototype.getData = function() {
            return i.has("custom_tournament_rules") ? i.get("custom_tournament_rules").replace(/\n/g, "<br/>") : this.formatBullets(this.getBullets())
        }, s.prototype.formatBullets = function(t) {
            return (t = t.map(function(t, e) {
                return e + 1 + ". " + t
            })).join("<br><br>")
        }, s.prototype.getBullets = function() {
            var t = n.getGameRulesDynamicData(),
                e = n.getStrategyName().toLowerCase(),
                o = [i.get("tournament_gamerules_bullet_tournament", n.getTournamentName()), i.get("tournament_gamerules_bullet_period", t.startDate, t.endDate), i.get("tournament_gamerules_bullet_strategy_" + e, t.formattedGameName.toUpperCase()), i.get("tournament_gamerules_bullet_uniqueid_" + e), i.get("tournament_gamerules_bullet_tournamentid"), i.get("tournament_gamerules_bullet_leaderboard_" + e), t.hasMinBetRule ? i.get("tournament_gamerules_bullet_betsize_required", t.formattedMinBet) : i.get("tournament_gamerules_bullet_betsize"), i.get("tournament_gamerules_bullet_score_improve")];
            return n.autopayoutsEnabled ? o.push(i.get("tournament_gamerules_bullet_tournament_prizes_true")) : o.push(i.get("tournament_gamerules_bullet_tournament_prizes")), n.includeRaffle() && (o = o.concat(this.getRaffleBullets())), (o = this.addParticipatingGamesInfo(o)).push(i.get("tournament_gamerules_bullet_leaderboard_refresh")), o
        }, s.prototype.addParticipatingGamesInfo = function(t) {
            if (n.games.length <= 1)
                return t;
            var e = i.get("tournament_gamerules_bullet_participatingGames", n.getGamesNames());
            return o.insertAt(t, 2, e), t
        }, s.prototype.getRaffleBullets = function() {
            var t = n.getGameRulesDynamicData(),
                e = [i.get("tournament_gamerules_bullet_raffle_prizepool", t.raffleStartPosition, t.raffleEndPosition, t.raffleTotalPrize, t.raffleTime), i.get("tournament_gamerules_bullet_raffle_period")];
            return n.autopayoutsEnabled ? e.push(i.get("tournament_gamerules_bullet_raffle_prizes_true")) : e.push(i.get("tournament_gamerules_bullet_raffle_prizes")), e.push(i.get("tournament_gamerules_bullet_raffle_unclaimed_prizes")), e
        }, s.prototype.getHtmlTemplate = function() {
            return "tournamentGameRules.html"
        }, s
    }), _d(")@", ["^#", "))", "%!", "#@", "#", "$", "#^"], function(t, e, o, n, i, s, r) {
        "use strict";
        function a() {
            e.call(this, this.getText(), this.getStyle(), "promo/button_green_side", this.onClick), this.addEventListeners(), this.refresh()
        }
        return t.extend(a, e), a.prototype.addEventListeners = function() {
            i.on("tournament/highlight", this.onHighlight), i.on("tournament/winNotify", this.refresh), s.on("status/changed", this.refresh), i.once("boost/hideButton", this.removeEventListeners, i.PRIORITY_HIGHEST)
        }, a.prototype.removeEventListeners = function() {
            i.off("tournament/highlight", this.onHighlight), i.off("tournament/winNotify", this.refresh), s.off("status/changed", this.refresh)
        }, a.prototype.refresh = function() {
            this.refreshTexture(), this.refreshLabel(), TweenMax.killTweensOf(this), r.canPlayRaffle() && !r.isChestPicked() && this.pulsate(-1), this.refreshView()
        }, a.prototype.refreshTexture = function() {
            this.updateImages(this.getTextureName())
        }, a.prototype.getTextureName = function() {
            return s.isActive() ? "promo/button_green_side" : r.canPlayRaffle() ? "promo/button_orange_side" : "promo/button_grey_side"
        }, a.prototype.refreshLabel = function() {
            this._label.text = this.getText(), this._label.style = this.getStyle()
        }, a.prototype.getText = function() {
            return r.canPlayRaffle() ? n.get("tournament_raffle_info_button") : n.get("tournament_info_button")
        }, a.prototype.getStyle = function() {
            return {
                font: "32px 'Trebuchet MS', Helvetica, sans-serif",
                fill: this.getLabelColor(),
                padding: 5
            }
        }, a.prototype.getLabelColor = function() {
            return s.isActive() || r.canPlayRaffle() ? "#feffb6" : "white"
        }, a.prototype.onClick = function() {
            i.emit("tournament/showTournamentFrame")
        }, a.prototype.onHighlight = function() {
            s.isActive() && this.pulsate(5)
        }, a.prototype.pulsate = function(t) {
            TweenMax.killTweensOf(this), TweenMax.to(this, .4, {
                x: 8,
                repeat: t,
                yoyo: !0,
                ease: Sine.easeInOut
            })
        }, a
    }), _d("%!", ["^#", "((", ")", "!", "#", "(@", "$", "(#", "#^", "($", "(%", "(^", "(&", "(*", "@!#", "@@$", "@@#"], function(t, e, o, n, i, s, r, a, u, p, l, h, c, d, f, g, m) {
        "use strict";
        function y() {
            this.LEADERBOARD_CLASS_BY_STRATEGY = {
                crossgame: g,
                orientexpress: m,
                seasons: m,
                chibeasties2: m,
                sumofhscwjunglebooks: m,
                mysterywin: m
            }, e.call(this), this.timer = new f, this.setMandatoryPages(), r.on("status/changed", this.onTournamentStatusChanged)
        }
        return t.extend(y, e), y.prototype.setMandatoryPages = function() {
            this.leaderboardPage = this.pages[0], this.rafflePage = this.pages[1], this.rulesPage = this.pages[this.pages.length - 1]
        }, y.prototype.onTournamentStatusChanged = function() {
            this.clearPopupStatusClass(), o.addClass(this.popup, this.getStatusClass())
        }, y.prototype.getStatusClass = function() {
            return this.canShowLeaderboard() ? "active" : "notActive"
        }, y.prototype.canShowLeaderboard = function() {
            return r.isActive() || r.isPostTournament()
        }, y.prototype.addPages = function() {
            this.addPage("tournament_leaderboardLabel", this.getLeaderboardClass()), r.includeRaffle() && this.addPage("tournament_raffleLabel", h), this.addPage("tournament_prizePoolLabel", c), this.addPage("tournament_rulesLabel", d)
        }, y.prototype.getLeaderboardClass = function() {
            var t = r.getStrategyName().toLowerCase();
            return this.LEADERBOARD_CLASS_BY_STRATEGY.hasOwnProperty(t) ? this.LEADERBOARD_CLASS_BY_STRATEGY[t] : l
        }, y.prototype.showLeaderboard = function() {
            this.setActive(this.leaderboardPage.pageName)
        }, y.prototype.showRaffle = function() {
            this.setActive(this.rafflePage.pageName)
        }, y.prototype.showRules = function(t) {
            this.callback = t, this.setActive(this.rulesPage.pageName)
        }, y.prototype.closePopup = function() {
            e.prototype.closePopup.call(this), this.callback && this.callback(), this.timer.resetTimer(), i.emit("tournament/leaderboardClosed")
        }, y
    }), _d("($", ["#@"], function(e) {
        "use strict";
        function t() {}
        return t.getFrameConfig = function(t) {
            return {
                menuItems: [{
                    itemId: t[0],
                    itemLabel: e.get("tournament_leaderboardLabel")
                }, {
                    itemId: t[1],
                    itemLabel: e.get("tournament_raffleLabel")
                }, {
                    itemId: t[2],
                    itemLabel: e.get("tournament_prizePoolLabel")
                }, {
                    itemId: t[3],
                    itemLabel: e.get("tournament_rulesLabel")
                }],
                loadingLabel: e.get("tournament_loadingLabel")
            }
        }, t
    }), _d("$)", ["!", "^#", ")*", "#@", "$", "@$", "@%", "&$", "^&", "#^", "^%", "(@", "@@", "#", ")", "%", "#$", "*&", "^!"], function(t, e, o, i, s, n, r, a, u, p, l, h, c, d, f, g, m, y, _) {
        "use strict";
        function b(t) {
            this.onContinue = t, o.call(this, this.getPopupOptions()), h.onClick(f.byId("fullRulesLink"), this.openRules), this.displayDate()
        }
        return e.extend(b, o), b.prototype.openRules = function() {
            this.setVisibleFalse(), d.emit("tournament/showTournamentFrameWithRules", this.setVisibleTrue)
        }, b.prototype.getPopupOptions = function() {
            var t = [];
            return s.participationDecisionMade || t.push({
                label: i.get("tournament_popup_cancel"),
                action: this.showConfirmationPopup.bind(this),
                class: "grey"
            }), t.push({
                label: i.get("tournament_popup_play"),
                action: this.saveConfirmationToServer,
                hideWindow: !0
            }), {
                template: "tournamentPopup.html",
                title: i.get("tournament_popup_title", s.getTournamentName()),
                descriptionTitle: this.getDescriptionTitle(),
                periodText: i.get("boost_campaign_period"),
                description: this.getDescription(),
                moreInfo: i.get("tournament_popup_MoreInfo_additional"),
                rules: i.get("tournament_rulesLabel"),
                image: this.getPopupImageName(),
                buttons: t,
                autoclose: !0,
                onHideComplete: this.resetTimer
            }
        }, b.prototype.showConfirmationPopup = function() {
            new m({
                modal: !0,
                title: "",
                message: i.get("tournament_popup_cancel_confirmation_text"),
                buttons: [{
                    label: i.get("tournament_popup_confirmation_no"),
                    class: "grey",
                    hideWindow: !0
                }, {
                    label: i.get("tournament_popup_confirmation_yes"),
                    action: this.onCancelConfirmed,
                    class: "grey",
                    hideWindow: !0
                }]
            })
        }, b.prototype.saveConfirmationToServer = function() {
            if (!s.participationDecisionMade) {
                var t = new y;
                t.setCampaignId(s.tournamentId), t.setDecision(!0), t.run()
            }
            this.onContinue && this.onContinue()
        }, b.prototype.onCancelConfirmed = function() {
            this.hide(), d.emit("boost/hideButton"), d.emit("boost/hideTopPanel"), d.emit("boost/kill");
            var t = new y;
            t.setCampaignId(s.tournamentId), t.setDecision(!1), t.run(), this.clearModels()
        }, b.prototype.clearModels = function() {
            s.clear(), p.clear(), g.clear()
        }, b.prototype.getPopupImageName = function() {
            return "tournament_icon"
        }, b.prototype.getDescriptionTitle = function() {
            return s.hasCustomPrizes() ? this.getTitleDescriptionWithCustomPrizes() : "<p>" + i.get("tournament_popup_prize", "<span class='prizePoolTitle'>", "</span>") + " <span>" + l.formatPrize(s.getLeaderboardAndRaffleTotalPrize(), s.getCurrency()) + "</span></p>"
        }, b.prototype.getTitleDescriptionWithCustomPrizes = function() {
            var t = l.formatPrize(s.getTotalPrizeValues(), s.getCurrency());
            return "<span class='prizePoolTitle'>" + i.get("tournament_popup_total_prize_values", t) + "</span>"
        }, b.prototype.getDescription = function() {
            return i.has("custom_tournament_popup") ? i.get("custom_tournament_popup").replace(/\n/g, "<br/>") : this.formatBullets(this.getBullets())
        }, b.prototype.formatBullets = function(t) {
            return (t = t.map(function(t) {
                return "- " + t
            })).join("<br>")
        }, b.prototype.getBullets = function() {
            var t = l.formatReward(s.getFirstReward(), s.getCurrency()),
                e = s.getPrizePool().length,
                o = s.getStrategyName().toLowerCase(),
                n = ["<span class='highlighted'>" + i.get("tournament_popup_bullet_winner_prize", t) + "</span>", "<span class='highlighted'>" + i.get("tournament_popup_bullet_strategy_" + o, s.getFormattedGamesNames()) + "</span>", 3 < s.getGamesNames().length ? i.get("cashrace_popup_bullet_availability_rules") : i.get("cashrace_popup_bullet_which_games_rules", s.getFormattedGamesNames()), i.get("tournament_popup_bullet_winning_positions", e), s.includeRaffle() ? i.get("tournament_popup_bullet_leaderboard_and_raffle") : i.get("tournament_popup_bullet_leaderboard")];
            return s.includeRaffle() && (n = n.concat(this.getRaffleBullets())), s.hasMinBetRule() && n.push(i.get("tournament_popup_bullet_betsize_required", s.getFormattedMinBet())), n
        }, b.prototype.getRaffleBullets = function() {
            return [this.getRafflePrizePoolBullet(), i.get("tournament_popup_bullet_raffle_positions", p.getRaffleRange().qualifiedStart, p.getRaffleRange().qualifiedEnd)]
        }, b.prototype.getRafflePrizePoolBullet = function() {
            var t = p.getTotalPrize(),
                e = l.formatPrize(t, p.getCurrency()),
                o = p.getRafflePrizePool().length;
            return t && p.hasCustomPrizes() ? i.get("tournament_popup_bullet_raffle_both_prizes", e, o) : p.hasCustomPrizes() ? i.get("tournament_popup_bullet_raffle_custom_prizes", o, o) : i.get("tournament_popup_bullet_raffle_prizes", e, o)
        }, b.prototype.displayDate = function() {
            this.showTournamentDates()
        }, b.prototype.showTournamentDates = function() {
            document.body.getElementsByClassName("date")[0].innerHTML = this.getDate()
        }, b.prototype.onResize = function() {
            if (this.html) {
                var t = Math.min(c.renderer.width / this.getWidth(), c.renderer.height / this.getHeight());
                c.showMobileUI && (t *= this.getMobileScaleFactor()), c.renderer.width < c.renderer.height && (t *= this.getPortraitScaleFactor());
                var e = c.getScaleFactor();
                t /= e, this.html.style.transform = this.html.style.webkitTransform = "scale(" + t + "," + t + ")", this.html.style.left = c.renderer.width / 2 / e - this.html.clientWidth / 2 * t + "px", this.html.style.top = c.renderer.height / this.getYPositionFactor() / e - this.html.clientHeight / 2 * t + "px"
            }
        }, b.prototype.getDate = function() {
            var t = l.formatDate(s.startDate),
                e = l.formatDate(s.endDate);
            return u.substitute("<span class='dateDays'>{0}</span>{1}", t.days, t.time) + " - " + u.substitute("<span class='dateDays'>{0}</span>{1}", e.days, e.time)
        }, b.prototype.getPrimaryButtonClass = function() {
            return ""
        }, b.prototype.getSecondaryButtonClass = function() {
            return ""
        }, b.prototype.getWidth = function() {
            return 2500
        }, b.prototype.getHeight = function() {
            return 1450
        }, b.prototype.getYPositionFactor = function() {
            return 2.5
        }, b.prototype.getMobileScaleFactor = function() {
            return _.isIPhone() ? .75 : 1
        }, b.prototype.getPortraitScaleFactor = function() {
            return _.isIPhone() ? 2 : 1.6
        }, b
    }), _d("@@%", ["^#", "@!)", "@@", "^!"], function(t, e, o, n) {
        "use strict";
        function i(t) {
            e.apply(this, arguments)
        }
        return t.extend(i, e), i.prototype.createComponents = function(t) {
            e.prototype.createComponents.call(this, t), this.prizeIcon = this.createTextPrizeIcon(), this.prizeLabel = this.createLabel(""), this.plusSign = this.createLabel(" + "), this.chestIcon = this.createIcon()
        }, i.prototype.createTextPrizeIcon = function() {
            var t = PIXI.Sprite.fromImage("images/promo/text_prize_icon.png");
            return t.anchor.set(0, .5), this.addChild(t)
        }, i.prototype.createIcon = function() {
            var t = PIXI.Sprite.fromImage("images/promo/top_bar_chest.png");
            return t.anchor.set(0, .5), this.addChild(t)
        }, i.prototype.getInitialState = function() {
            return {
                visible: !1
            }
        }, i.prototype.createLabel = function(t) {
            var e = new PIXI.Text(t, {
                font: "40px 'Trebuchet MS', Helvetica, sans-serif",
                fill: "#2f2f39",
                padding: 5
            });
            return e.anchor.set(0, .5), this.addChild(e)
        }, i.prototype.refresh = function() {
            this.visible = this.state.visible, this.prizeIcon.visible = this.state.showPrizeIcon, this.prizeLabel.visible = this.state.showPrize && !this.state.showPrizeIcon, this.chestIcon.visible = this.state.showChestIcon, this.plusSign.visible = this.state.showPrize && this.state.showChestIcon;
            var t = this.config.padding;
            this.prizeLabel.visible && (this.prizeLabel.text = this.state.prizeText, this.prizeLabel.x = t, t += this.prizeLabel.width), this.prizeIcon.visible && (this.prizeIcon.x = t, t += this.prizeIcon.width), this.plusSign.visible && (this.plusSign.x = t, t += this.plusSign.width), this.chestIcon.visible && (this.chestIcon.x = t, t += this.chestIcon.width), this.background.width = t + this.config.padding, this.background.x = this.background.width / 2
        }, i
    }), _d("@@^", ["^#", "@!&"], function(t, e) {
        "use strict";
        function o(t) {
            e.apply(this, arguments)
        }
        return t.extend(o, e), o.prototype.refresh = function() {
            this.label.text = this.state.title || this.config.title, this.state.icon && (this.icon.texture = PIXI.Texture.fromFrame("images/promo/" + this.state.icon)), e.prototype.refresh.call(this)
        }, o
    }), _d("@!#", ["@%", "@$", "#@", "&$", "$"], function(t, n, i, s, r) {
        "use strict";
        function e() {
            this.TIME_INTERVAL = 1, this.showTimer()
        }
        return e.prototype.showTimer = function() {
            this.isRunning() || (this.showTopCounter(), this.displayTimer())
        }, e.prototype.showTopCounter = function() {
            this.counter = document.getElementById("tournamentFrameCounter"), this.counter.innerHTML = "", this.counter.style.display = "block"
        }, e.prototype.isRunning = function() {
            return !!this.timer
        }, e.prototype.endTimer = function() {
            this.counter && (this.counter.innerHTML = "<span>" + i.get("tournament_endInfo").toUpperCase() + "<span>"), this.resetTimer()
        }, e.prototype.displayTimer = function() {
            var t = r.getTimeToStart(),
                e = r.getTimeToEnd();
            if (t <= 0)
                e <= 0 ? this.endTimer() : (this.timer = n(this.displayTimer.bind(this), this.TIME_INTERVAL), this.counter.innerHTML = i.get("tournament_endsIn") + " <span>" + s.showFormattedTime(1e3 * e) + "</span>");
            else {
                this.timer = n(this.displayTimer.bind(this), this.TIME_INTERVAL);
                var o = i.get("tournament_startsIn") + " <span>" + s.showFormattedTime(1e3 * t) + "</span>";
                this.counter.innerHTML = o, this.updateBigCounter(o)
            }
        }, e.prototype.updateBigCounter = function(t) {
            var e = document.getElementById("tournamentFrameCounterBig");
            e && (e.innerHTML = t)
        }, e.prototype.resetTimer = function() {
            t(this.timer), this.timer = null
        }, e
    }), _d(")#", ["@!^", "^#", "@", "*", "$", "#@", "^", "@!&", "@!*", "@@%", "@@^", "#)", "@@&"], function(t, e, o, n, i, s, r, a, u, p, l, h, c) {
        "use strict";
        function d() {
            t.apply(this, arguments), this.refreshValues()
        }
        return e.extend(d, t), d.prototype.createSegments = function() {
            this.positionTitle = this.addSegment(new a({
                icon: "icon_rank.png",
                title: s.get("tournament_topbar_rank"),
                background: "top_bar_left_light_grey.png"
            })), this.playerPosition = this.addSegment(new u({
                autoResize: !0,
                autoResizePadding: 5,
                width: 120,
                background: "top_bar_fill_white.png"
            })), this.scoreTitle = this.addSegment(new l({
                icon: "icon_score.png",
                title: s.get("tournament_topbar_score"),
                background: "top_bar_fill_light_grey.png"
            })), this.score = this.addSegment(new u({
                width: 200,
                background: "top_bar_right_white.png"
            })), this.prizeLabel = this.addSegment(new a({
                icon: "icon_prize.png",
                title: s.get("tournament_topbar_prize"),
                background: "top_bar_fill_light_grey.png"
            })), this.prize = this.addSegment(new p({
                padding: 20,
                background: "top_bar_right_white.png"
            })), this.minBetSegment = this.addSegment(new a({
                icon: "icon_error.png",
                showTitleInPortrait: !0,
                title: s.get("tournament_topnav_minBetSize", i.getFormattedMinBet()),
                background: "top_bar_left_right_light_grey.png"
            }))
        }, d.prototype.addListeners = function() {
            i.on("player/changed", this.onPlayerChanged), n.on("totalBet/changed", this.onPlayerChanged)
        }, d.prototype.removeListeners = function() {
            i.off("player/changed", this.onPlayerChanged), n.off("totalBet/changed", this.onPlayerChanged)
        }, d.prototype.onPlayerChanged = function() {
            this.refreshValues(), this.refreshLayout()
        }, d.prototype.refreshValues = function() {
            var t = i.isMinBetFulfilled();
            if (this.playerPosition.setState({
                value: i.player ? i.player.number : "-",
                visible: t
            }), this.score.setState({
                value: i.player ? i.player.score : 0,
                background: i.showPrizePanel() ? "top_bar_fill_white.png" : "top_bar_right_white.png",
                visible: t
            }), this.prizeLabel.setState({
                visible: i.showPrizePanel() && t
            }), i.player) {
                var e = !!i.getCurrentPrize();
                this.prize.setState({
                    visible: i.showPrizePanel() && t,
                    showChestIcon: i.isRaffleQualifiedBasedOnPosition(),
                    showPrize: e,
                    showPrizeIcon: e && i.getCurrentPrize().isCustom,
                    prizeText: e ? i.getCurrentPrize().formattedPrize : 0
                })
            }
            this.positionTitle.updateState({
                visible: t
            }), this.scoreTitle.updateState({
                visible: t
            }), this.minBetSegment.updateState({
                visible: !t
            })
        }, d.prototype.onSpinDataLoaded = function() {
            this.refreshLayout()
        }, d
    });
})();

