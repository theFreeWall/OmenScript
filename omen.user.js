// ==UserScript==
// @name         其乐小工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       jiye
// @match        https://keylol.com/*
// @match        https://login3.id.hp.com/*
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @connect     oauth.hpbp.io
// @connect    task.jysafe.cn
// @connect    www.hpgamestream.com
// @connect    rpc-prod.versussystems.com
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=keylol.com
// ==/UserScript==
// @require      http://127.0.0.1:5500/js/main.ed19e0b4.chunk.js

(function() {
    'use strict';

    // Your code here...
    const jq=$
    const ApplicationId = "6589915c-6aa7-4f1b-9ef5-32fa2220c844";
    const ClientId = "130d43f1-bb22-4a9c-ba48-d5743e84d113";
    const debug = true;
    const omenAuth = GM_getValue("omenAuth")

    const HTTP = (function(){

    // [修改自https://greasyfork.org/zh-CN/scripts/370650]
        const httpRequest = function (e) {
                const requestObj = {}
                requestObj.url = e.url
                requestObj.method = e.method.toUpperCase()
                requestObj.timeout = e.timeout || 30000
                if (e.dataType) requestObj.responseType = e.dataType
                if (e.headers) requestObj.headers = e.headers
                if (e.data) requestObj.data = e.data
                if (e.cookie) requestObj.cookie = e.cookie
                if (e.anonymous) requestObj.anonymous = e.anonymous
                if (e.onload) requestObj.onload = e.onload
                if (e.fetch) requestObj.fetch = e.fetch
                if (e.onreadystatechange) requestObj.onreadystatechange = e.onreadystatechange
                requestObj.ontimeout = e.ontimeout || function (data) {
                    if (debug) console.log(data)
                    if (e.status) e.status.error('Error:Timeout(0)')
                    if (e.r) e.r({ result: 'error', statusText: 'Timeout', status: 0, option: e })
                }
                requestObj.onabort = e.onabort || function (data) {
                    if (debug) console.log(data)
                    if (e.status) e.status.error('Error:Aborted(0)')
                    if (e.r) e.r({ result: 'error', statusText: 'Aborted', status: 0, option: e })
                }
                requestObj.onerror = e.onerror || function (data) {
                    if (debug) console.log(data)
                    if (e.status) e.status.error('Error:Error(0)')
                    if (e.r) e.r({ result: 'error', statusText: 'Error', status: 0, option: e })
                }
                if (debug) console.log('发送请求:', requestObj)
                GM_xmlhttpRequest(requestObj);
            }
        function get(url, e = {}){
            return new Promise((resolve, reject)=>{
                e.url = url;
                e.method = "GET";
                e.onload = resolve;
                e.onerror = reject;
                httpRequest(e)
            })
        }
        function post(url, e = {}){
            return new Promise((resolve, reject)=>{
                e.url = url;
                e.method = "POST";
                e.onload = resolve;
                e.onerror = reject;
                httpRequest(e)
            })
        }
        return {
            GET: get,
            POST: post
        }
    })();

    const UI = (function(){
        let login_link = "https://oauth.hpbp.io/oauth/v1/auth?response_type=code&client_id=" + ClientId +"&redirect_uri=http://localhost:9081/login&scope=email+profile+offline_access+openid+user.profile.write+user.profile.username+user.profile.read&state=G5g495-R4cEE" + (Math.random()*100000) +"&max_age=28800&acr_values=urn:hpbp:hpid&prompt=consent"
        let data = []

        const init = ()=>{
            initToolBar();
            initIframe(login_link);
            EventListener();
        }
        function initToolBar(){

              jq("#nav-user-action-bar > .list-inline > li:nth-child(3)").after(`<li id="jiye-action" class="btn btn-user-action" style="position: relative;z-index: 9;">工具
                   <ul class="jiye-action-list">
                           <li class="jiye-action-item" id="login-link">Omen</li>
                           <li class="jiye-action-item">2</li>
                   </ul>
                </li>
                <style>
                .jiye-action-list{
                    position: absolute;
                    background-color: white;
                    min-width: 46px;
                    left: 0px;
                    margin-top: 6px;
                    display: none;
                    color: black;
                    border: solid 1px #999;
                }
                 #jiye-action:hover .jiye-action-list{
                         display: block!important;
                 }
                 .jiye-action-item{
                    padding: 6px 0px;
                 }
                 .jiye-action-item:hover{
                     background-color: #f0f3f4;
                 }
                </style>
                `);

            document.getElementById("login-link").addEventListener("click", ()=>{
                /*GM_openInTab(link, {
                    active: true,
                    setParent :true
                })*/
                document.getElementById("tool-iframe").style.display = "block"
                OMEN.refreshToken(omenAuth.refresh_token).then(res=>{
                    console.log(res)
                    res = res.response;
                    if(res.status_code===undefined){
                        GM_setValue("omenAuth", res)
                        omenAuth = res;
                         jq("#tool-iframe .omen-tokenresult")[0].innerText = "refresh success"
                    }else{
                         jq("#tool-iframe .omen-tokenresult")[0].innerText = res.error_description
                    }
                })
                //let a = GM_addStyle("#tool-iframe{display:block!important;}")
                //GM_log(a)
            })
        }

        function initIframe(link){
            let html = `
<div id="tool-iframe" style="display:none">
    <div class="omen-content">
        <button id="jy-iframe-close" onclick="document.getElementById('tool-iframe').style.display = 'none'">关闭</button>
        <h2>功能</h2>
        <a href="${link}" target="_blank">登录</a><br>
        <lable for="omen-localhost-link">
        localhost:<input id="omen-localhost-link" type="text" />
        <lable>
        <br>CODE:<span class="omen-code">等待...</span>
        <br>
        <br>
        <button id="omen-gettoken">获取ACCESSTOKEN</button><span class="omen-tokenresult">等待...</span>
        <br>
        <button id="omen-getsession">获取SESSION</button><span class="omen-sessionresult">等待...</span>
        <br>
        <br>
        <div id="omen-data">
            <div class="omen-action-button">
                <button id="omen-list-btn">可参与列表</button>
                <button id="omen-current-btn">进行中</button>
                <button id="omen-history-btn">已结束</button>
            </div>
            <div>
                <ul>
                    <li>1</li>
                </ul>
            </div>
        </div>
    </div>
</div>
<style>
    #tool-iframe{
        position: fixed;
        top: 10%;
        left: 15%;
        width: 70%;
        background-color: aquamarine;
        height: 70%;

    }
    #tool-iframe .omen-content{
        margin:1rem;
    }
    #jy-iframe-close{
        position: absolute;
        right: 0;
    }
    #omen-data{
        border: solid 1px #f00;
        padding: .5rem;
    }
</style>
            `;
           jq("body").append(html);
           document.getElementById("tool-iframe").style.display = "block"
        }

        function EventListener(){
            let sessionToken = null;
            // localhost地址输入事件
            document.getElementById("omen-localhost-link").onchange = (e)=>{
                console.log(e)
                let value = e.target.value
                let codeR = value.match(/code=(.*?)&/)
                if(codeR==null || codeR.length<=1){
                    jq("#tool-iframe .omen-code")[0].innerText = "解析失败";
                }else{
                    jq("#tool-iframe .omen-code")[0].innerText = codeR[1]
                }
            }

            document.getElementById("omen-gettoken").addEventListener("click", (e)=>{
                let code = jq("#tool-iframe .omen-code")[0].innerText
                console.log(code)
                OMEN.getToken(code).then(res=>{
                    res = res.response
                    console.log(res)
                    if(res.status_code===undefined){
                        GM_setValue("omenAuth", res)
                        omenAuth = res;
                        jq("#tool-iframe .omen-tokenresult")[0].innerText = "success"
                    }else{
                        jq("#tool-iframe .omen-tokenresult")[0].innerText = res.error_description
                    }
                })
            })

            document.getElementById("omen-getsession").addEventListener("click", (e)=>{
                OMEN.getSession(omenAuth.access_token).then(res=>{
                    console.log(res)
                    if(res.status===200){
                        jq("#tool-iframe .omen-sessionresult")[0].innerText = sessionToken = res.response.result.sessionId;
                    }else{
                        jq("#tool-iframe .omen-sessionresult")[0].innerText = res.error_description;
                    }
                })
            })

            document.getElementById("omen-list-btn").addEventListener("click", ()=>{
                OMEN.getChallengeList(sessionToken).then(res=>{
                    console.log(res);
                });
            });

        }
        return {
            init: init,
            initIframe: initIframe
        }
    })();

    const OMEN = (()=>{
        const init = (data)=>{
        }
        const getToken = (code)=>{
            let url = "https://oauth.hpbp.io/oauth/v1/token";
            let json = OMEN_BODY.auth(code);
            var params = Object.keys(json).map(function (key) {
                // body...
                return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
            }).join("&");

            return HTTP.POST(url, {
                dataType: "json",
                data: params,
                headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
                    "Accept": "application/json",
                    "Except": "100-continue"
                }
            })
        }
        const refreshToken = (refresh_token)=>{
            let url = "https://oauth.hpbp.io/oauth/v1/token";
            let json = OMEN_BODY.refreshToken(refresh_token);
            var params = Object.keys(json).map(function (key) {
                // body...
                return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
            }).join("&");

            return HTTP.POST(url, {
                dataType: "json",
                data: params,
                headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
                    "Accept": "application/json",
                    "Except": "100-continue"
                }
            })
        }
        const getSession = (authorization)=>{
            let url = "https://www.hpgamestream.com/api/thirdParty/session/temporaryToken?applicationId=" + ApplicationId
            return HTTP.GET(url, {
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + authorization
                }
            }).then(res=>{
                console.log(res)
                if(res.status===200){

                    return RPCRequest(OMEN_BODY.handShake(res.response.token))
                }else{
                    return new Promise().reject()
                }
            }).then(res=>{
                res = res.response;

                return RPCRequest(OMEN_BODY.start(res.result.token));
            })
        }
        const getChallengeList = (session)=>{
            return RPCRequest(OMEN_BODY.challengeList(session))
        }
        const RPCRequest = (params) => {
            return HTTP.POST("https://rpc-prod.versussystems.com/rpc", {
                dataType: "json",
                data: JSON.stringify(params),
                headers: {
                    "content-type": "application/json; charset=UTF-8",
                    "User-Agent": ""
                }
            })
        }

        return {
            init: init,
            getToken:getToken,
            refreshToken: refreshToken,
            getSession: getSession,
            getChallengeList: getChallengeList
        }
    })();
    const OMEN_BODY = (()=>{
        const ClientId = "130d43f1-bb22-4a9c-ba48-d5743e84d113";
        const applicationId = "6589915c-6aa7-4f1b-9ef5-32fa2220c844";
        const basic = {
            "jsonrpc": "2.0",
            "method": null,
            "id": applicationId,
            "params": {
                "sessionToken": null,
                "applicationId": applicationId,
                "sdk": "custom01",
                "sdkVersion": "3.0.0",
                "appDefaultLanguage": "en",
                "userPreferredLanguage": "en"
            }
        }

        const challengeList = (session)=>{
            let body = JSON.parse(JSON.stringify(basic));
            body.method = "mobile.challenges.v4.list";
            body.params.sessionToken = session;
            body.params.onlyShowEligibleChallenges = true;
            body.params.page = 1;
            body.params.pageSize = 10;
            return body;
        }
        const handShake = (token)=>{
            let body = JSON.parse(JSON.stringify(basic));
            body.method = "mobile.accounts.v1.handshake";
            body.params.userToken = token;
            body.params.Birthdate = "2001-01-02";
            body.params.page = 1;
            body.params.pageSize = 10;
            return body;
        }
        const start = (token)=>{
            let body = {
                "jsonrpc": "2.0",
                "id": ApplicationId,
                "method": "mobile.sessions.v2.start",
                "params": {
                    "accountToken": null,
                    "applicationId": ApplicationId,
                    "externalPlayerId": "hpid_user_id",
                    "eventNames": [
                        "PLAY:OVERWATCH",
                        "PLAY:HEROES_OF_THE_STORM",
                        "PLAY:FORTNITE",
                        "PLAY:THE_DIVISION",
                        "PLAY:THE_DIVISION_2",
                        "PLAY:PUBG",
                        "PLAY:APEX_LEGENDS",
                        "PLAY:CS_GO",
                        "PLAY:LEAGUE_OF_LEGENDS",
                        "PLAY:DOTA_2",
                        "PLAY:SMITE",
                        "PLAY:AGE_OF_EMPIRES_2",
                        "PLAY:STARCRAFT_2",
                        "PLAY:COMPANY_OF_HEROES_2",
                        "PLAY:ASSASSINS_CREED_ODYSSEY",
                        "PLAY:WORLD_OF_WARCRAFT",
                        "PLAY:WORLD_OF_WARCRAFT_CLASSIC",
                        "PLAY:SPOTIFY",
                        "PLAY:RINGS_OF_ELYSIUM",
                        "PLAY:HEARTHSTONE",
                        "PLAY:GARRYS_MOD",
                        "PLAY:GOLF_IT",
                        "PLAY:DECEIT",
                        "PLAY:SEVEN_DAYS_TO_DIE",
                        "PLAY:DOOM_ETERNAL",
                        "PLAY:STARWARS_JEDI_FALLEN_ORDER",
                        "PLAY:MINECRAFT",
                        "PLAY:DEAD_BY_DAYLIGHT",
                        "PLAY:NETFLIX",
                        "PLAY:HULU",
                        "PLAY:PATH_OF_EXILE",
                        "PLAY:WARTHUNDER",
                        "PLAY:CALL_OF_DUTY_MODERN_WARFARE",
                        "PLAY:ROCKET_LEAGUE",
                        "PLAY:NBA_2K20",
                        "PLAY:STREET_FIGHTER_V",
                        "PLAY:DRAGON_BALL_FIGHTER_Z",
                        "PLAY:GEARS_OF_WAR_5",
                        "PLAY:FIFA_20",
                        "PLAY:MASTER_CHIEF_COLLECTION",
                        "PLAY:RAINBOW_SIX",
                        "PLAY:UPLAY",
                        "PLAY:ROBLOX",
                        "VERSUS_GAME_API:TEAMFIGHT_TACTICS:GOLD_LEFT",
                        "VERSUS_GAME_API:TEAMFIGHT_TACTICS:TIME_ELIMINATED",
                        "VERSUS_GAME_API:TEAMFIGHT_TACTICS:THIRD_PLACE_OR_HIGHER",
                        "VERSUS_GAME_API:TEAMFIGHT_TACTICS:SECOND_PLACE_OR_HIGHER",
                        "VERSUS_GAME_API:TEAMFIGHT_TACTICS:PLAYERS_ELIMINATED",
                        "VERSUS_GAME_API:TEAMFIGHT_TACTICS:TOTAL_DAMAGE_TO_PLAYERS",
                        "PLAY:MONSTER_HUNTER_WORLD",
                        "PLAY:WARFRAME",
                        "PLAY:LEGENDS_OF_RUNETERRA",
                        "PLAY:VALORANT",
                        "PLAY:CROSSFIRE",
                        "PLAY:PALADINS",
                        "PLAY:TROVE",
                        "PLAY:RIFT",
                        "PLAY:ARCHEAGE",
                        "PLAY:IRONSIGHT",
                        "GAMIGO_PLACEHOLDER",
                        "PLAY:TWINSAGA",
                        "PLAY:AURA_KINGDOM",
                        "PLAY:SHAIYA",
                        "PLAY:SOLITAIRE",
                        "PLAY:TONY_HAWK",
                        "PLAY:AVENGERS",
                        "PLAY:FALL_GUYS",
                        "PLAY:QQ_SPEED",
                        "PLAY:FIFA_ONLINE_3",
                        "PLAY:NBA2KOL2",
                        "PLAY:DESTINY2",
                        "PLAY:AMONG_US",
                        "PLAY:MAPLE_STORY",
                        "PLAY:ASSASSINS_CREED_VALHALLA",
                        "PLAY:FREESTYLE_STREET_BASKETBALL",
                        "PLAY:CRAZY_RACING_KART_RIDER",
                        "PLAY:COD_BLACK_OPS_COLD_WAR",
                        "PLAY:CYBERPUNK_2077",
                        "PLAY:HADES",
                        "PLAY:RUST",
                        "PLAY:GENSHIN_IMPACT",
                        "PLAY:ESCAPE_FROM_TARKOV",
                        "PLAY:RED_DEAD_REDEMPTION_2",
                        "PLAY:CIVILIZATION_VI",
                        "PLAY:VALHEIM",
                        "PLAY:FINAL_FANTASY_XIV",
                        "PLAY:OASIS",
                        "PLAY:CASTLE_CRASHERS",
                        "PLAY:GANG_BEASTS",
                        "PLAY:SPEEDRUNNERS",
                        "PLAY:OVERCOOKED_2",
                        "PLAY:OVERCOOKED_ALL_YOU_CAN_EAT",
                        "PLAY:BRAWLHALLA",
                        "PLAY:STELLARIS",
                        "PLAY:MOUNT_AND_BLADE",
                        "PLAY:EUROPA_UNIVERSALIS",
                        "PLAY:ELDER_SCROLLS_ONLINE",
                        "Launch OMEN Command Center",
                        "Use OMEN Command Center",
                        "OMEN Command Center Macro Created",
                        "OMEN Command Center Macro Assigned",
                        "Mindframe Adjust Cooling Option",
                        "Connect 2 different OMEN accessories to your PC at the same time",
                        "Use Omen Reactor",
                        "Use Omen Photon",
                        "Launch Game From GameLauncher",
                        "Image like From ImageGallery",
                        "Set as background From ImageGallery",
                        "Download image From ImageGallery",
                        "CLAIM:PRIZE",
                        "overwatch",
                        "heroesofthestorm",
                        "heroesofthestorm_x64",
                        "FortniteClient-Win64-Shipping",
                        "FortniteClient-Win64-Shipping_BE",
                        "thedivision",
                        "thedivision2",
                        "TslGame",
                        "r5apex",
                        "csgo",
                        "League of Legends",
                        "dota2",
                        "smite",
                        "AoE2DE_s",
                        "AoK HD",
                        "AoE2DE",
                        "sc2",
                        "s2_x64",
                        "RelicCoH2",
                        "acodyssey",
                        "wow",
                        "wow64",
                        "wow_classic",
                        "wowclassic",
                        "Spotify",
                        "Europa_client",
                        "hearthstone",
                        "hl2",
                        "GolfIt-Win64-Shipping",
                        "GolfIt",
                        "Deceit",
                        "7DaysToDie",
                        "DoomEternal_temp",
                        "starwarsjedifallenorder",
                        "Minecraft.Windows",
                        "net.minecraft.client.main.Main",
                        "DeadByDaylight-Win64-Shipping",
                        "4DF9E0F8.Netflix",
                        "HuluLLC.HuluPlus",
                        "PathOfExileSteam",
                        "PathOfExile_x64Steam",
                        "aces",
                        "modernwarfare",
                        "RocketLeague",
                        "NBA2K20",
                        "StreetFighterV",
                        "RED-Win64-Shipping",
                        "Gears5",
                        "fifa20",
                        "MCC-Win64-Shipping",
                        "MCC-Win64-Shipping-WinStore",
                        "RainbowSix",
                        "RainbowSix_BE",
                        "RainbowSix_Vulkan",
                        "upc",
                        "ROBLOXCORPORATION.ROBLOX",
                        "RobloxPlayerBeta",
                        "VERSUS_GAME_API_TEAMFIGHT_TACTICS_GOLD_LEFT",
                        "VERSUS_GAME_API_TEAMFIGHT_TACTICS_TIME_ELIMINATED",
                        "VERSUS_GAME_API_TEAMFIGHT_TACTICS_THIRD_PLACE_OR_HIGHER",
                        "VERSUS_GAME_API_TEAMFIGHT_TACTICS_SECOND_PLACE_OR_HIGHER",
                        "VERSUS_GAME_API_TEAMFIGHT_TACTICS_PLAYERS_ELIMINATED",
                        "VERSUS_GAME_API_TEAMFIGHT_TACTICS_TOTAL_DAMAGE_TO_PLAYERS",
                        "MonsterHunterWorld",
                        "Warframe.x64",
                        "lor",
                        "valorant-Win64-shipping",
                        "valorant",
                        "crossfire",
                        "Paladins",
                        "trove",
                        "rift_64",
                        "rift_x64",
                        "archeage",
                        "ironsight",
                        "Game",
                        "Game.bin",
                        "glyph_twinsaga",
                        "glyph_aurakingdom",
                        "glyph_shaiya",
                        "Solitaire",
                        "THPS12",
                        "avengers",
                        "Fallguys_client_game",
                        "GameApp",
                        "fifazf",
                        "NBA2KOL2",
                        "destiny2",
                        "Among Us",
                        "MapleStory",
                        "ACValhalla",
                        "FreeStyle",
                        "KartRider",
                        "BlackOpsColdWar",
                        "Cyberpunk2077",
                        "Hades",
                        "RustClient",
                        "GenshinImpact",
                        "EscapeFromTarkov",
                        "EscapeFromTarkov_BE",
                        "RDR2",
                        "CivilizationVI",
                        "valheim",
                        "ffxiv_dx11",
                        "AD2F1837.OMENSpectate",
                        "castle",
                        "Gang Beasts",
                        "SpeedRunners",
                        "Overcooked2",
                        "Overcooked All You Can Eat",
                        "Brawlhalla",
                        "stellaris",
                        "TaleWorlds.MountAndBlade.Launcher",
                        "eu4",
                        "eso64"
                    ],
                    "location": {
                        "latitude": 30.5823078,
                        "longitude": 103.984428
                    },
                    "sdk": "custom01",
                    "sdkVersion": "3.0.0",
                    "appDefaultLanguage": "en",
                    "userPreferredLanguage": "en"
                }
            };
            let uinfo = JSON.parse(window.atob(omenAuth.access_token.split(".")[1]))
            body.params.accountToken = token;
            body.params.externalPlayerId = uinfo.hpid_user_id;
            body.params.page = 1;
            body.params.pageSize = 10;
            return body;
        }

        const auth = (code)=>{
            return {
                grant_type: "authorization_code",
                code: code,
                client_id: ClientId,
                redirect_uri: "http://localhost:9081/login"
            }
        }

        const refreshToken = (refresh_token)=>{
            return {
                grant_type: "refresh_token",
                refresh_token: refresh_token,
                client_id: ClientId,
            }
        }

        return {
            auth: auth,
            refreshToken: refreshToken,
            challengeList: challengeList,
            handShake: handShake,
            start: start
        }
    })();

    jq(document).ready(()=>{
        if(window.location.href.includes("keylol")){
            UI.init();
        }else if(window.location.href.includes("hp.com")){
            //jq("script[src='https://static.id.hp.com/login3/static/js/main.ed19e0b4.chunk.js']")[0].remove()

           /* globalThis["RedirectToKeyLol"] = (url)=>{
                GM_log(url)
                HTTP.GET("https://task.jysafe.cn/test/r.php?url=" + encodeURIComponent(url)).then(res=>{
                    console.log(res)
                })
            }*/
        }

    })
})();