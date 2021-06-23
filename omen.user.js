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
// @grant        unsafeWindow
// @connect     oauth.hpbp.io
// @connect    task.jysafe.cn
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
    })()
    const UI = (function(){
        let login_link = "https://oauth.hpbp.io/oauth/v1/auth?response_type=code&client_id=" + ClientId +"&redirect_uri=http://localhost:9081/login&scope=email+profile+offline_access+openid+user.profile.write+user.profile.username+user.profile.read&state=G5g495-R4cEE" + (Math.random()*100000) +"&max_age=28800&acr_values=urn:hpbp:hpid&prompt=consent"

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
        <button id="omen-getsession">获取SESSION</button><span class="omen-sessionresult">等待...</span>
        <br>
        <br>
        <br>
        <div id="omen-action">
            <div class="omen-action-button">
                <button>可参与列表</button>
                <button>进行中</button>
                <button>已结束</button>
            </div>
        </div>
    </div>
</div>
<style>
    #tool-iframe{
        position: fixed;
        top: 30%;
        left: 29%;
        width: 50%;
        background-color: aquamarine;
        height: 50%;

    }
    #tool-iframe .omen-content{
        margin:1rem;
    }
    #jy-iframe-close{
        position: absolute;
        right: 0;
    }
    #omen-action{
        border: solid 1px #f00;
        padding: 1rem;
    }
</style>
            `;
           jq("body").append(html);
           //document.getElementById("tool-iframe").style.display = "block"
        }
        function EventListener()
        {
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
            document.getElementById("omen-getsession").addEventListener("click", (e)=>{
                 let code = jq("#tool-iframe .omen-code")[0].innerText
                 console.log(code)
                OMEN.session(code)
            })

        }
        return {
            init: init,
            initIframe: initIframe
        }
    })();
    const OMEN = (()=>{
        let code;
        let session;
        const init = (data)=>{
        }
        const getSession = (code)=>{
            let url = "https://oauth.hpbp.io/oauth/v1/token";
            let json = OMEN_BODY.auth(code);
            var params = Object.keys(json).map(function (key) {
                // body...
                return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
            }).join("&");

            HTTP.POST(url, {
                dataType: "json",
                data: params,
                headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
                    "Accept": "application/json",
                    "Except": "100-continue"
                }
            }).then(res=>{
                res = res.response
                console.log(res)
                if(res.status_code===403){
                     jq("#tool-iframe .omen-sessionresult")[0].innerText = res.error_description
                }else{
                    GM_setValue("authData", res)
                     jq("#tool-iframe .omen-sessionresult")[0].innerText = "success"
                }
            })
        }
        return {
            init: init,
            session:getSession
        }
    })();
    const OMEN_BODY = (()=>{
        const ClientId = "130d43f1-bb22-4a9c-ba48-d5743e84d113";
        let base = {
        }
        const auth = (code)=>{
            return {
                grant_type: "authorization_code",
                code, code,
                client_id: ClientId,
                redirect_uri: "http://localhost:9081/login"
            }
        }
        return {
            auth: auth
        }
    })();
    unsafeWindow.addEventListener('error', event => {
        console.log(event);
    }, true);
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