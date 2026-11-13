/* ============================================================
   粤语系统教程 V2 · 站点引擎
   零依赖原生 JS。所有数据文件在每页统一引入，因此全站搜索、
   进度仪表盘、错题本在任意页面都可用。
   ============================================================ */
(function(){
  "use strict";

  /* ---------------- 站点配置 ---------------- */
  var SITE = {
    name: "粤语系统教程",
    sub: "广州话完全手册",
    motto: "日日讲两句，百日自成腔。"
  };

  var PAGES = [
    {id:"index",      file:"index.html",      nav:"首页",     sec:"总目录"},
    {id:"phonetics",  file:"phonetics.html",  nav:"语音",     sec:"第一篇"},
    {id:"vocabulary", file:"vocabulary.html", nav:"词汇",     sec:"第二篇"},
    {id:"grammar",    file:"grammar.html",    nav:"语法",     sec:"第三篇"},
    {id:"dialogues",  file:"dialogues.html",  nav:"场景",     sec:"第四篇"},
    {id:"diff",       file:"diff.html",       nav:"粤普差异", sec:"专题"},
    {id:"practice",   file:"practice.html",   nav:"练习",     sec:"第五篇"}
  ];

  var LS = {
    learned:"yy2.learned", stats:"yy2.stats", quiz:"yy2.quiz",
    mistakes:"yy2.mistakes", theme:"yy2.theme", fs:"yy2.fs"
  };

  /* ---------------- 基础工具 ---------------- */
  var $  = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s){
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function getJSON(k, d){ try{ var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }catch(e){ return d; } }
  function setJSON(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  function pad(n){ return String(n).padStart(2, "0"); }
  function toast(msg){
    var t = $("#toast");
    if(!t){ t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tm);
    t._tm = setTimeout(function(){ t.classList.remove("show"); }, 1800);
  }

  /* ---------------- 主题与字号 ---------------- */
  function initTheme(){
    var root = document.documentElement;
    if(!root.getAttribute("data-theme")){
      root.setAttribute("data-theme", getJSON(LS.theme, "light") === "dark" ? "dark" : "light");
    }
    if(!root.getAttribute("data-fs")){
      var f = getJSON(LS.fs, "m");
      root.setAttribute("data-fs", /^[sml]$/.test(f) ? f : "m");
    }
  }
  function toggleTheme(){
    var root = document.documentElement;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    setJSON(LS.theme, next);
    syncThemeBtn();
  }
  function setFs(size){
    document.documentElement.setAttribute("data-fs", size);
    setJSON(LS.fs, size);
    var b = $("#fs-btn");
    if(b) b.textContent = "字号 " + ({s:"小", m:"中", l:"大"}[size] || "中");
  }
  function cycleFs(){
    var order = ["s","m","l"];
    var cur = document.documentElement.getAttribute("data-fs") || "m";
    setFs(order[(order.indexOf(cur) + 1) % 3]);
  }
  function syncThemeBtn(){
    var b = $("#theme-btn");
    if(b) b.textContent = document.documentElement.getAttribute("data-theme") === "dark" ? "深色" : "浅色";
  }

  /* ---------------- 语音合成（粤语优先） ---------------- */
  function voices(){
    if(!("speechSynthesis" in window)) return [];
    return speechSynthesis.getVoices() || [];
  }
  function pickVoice(){
    var vs = voices();
    if(!vs.length) return null;
    var tries = [
      function(v){ return /^yue/i.test(v.lang); },
      function(v){ return /zh[-_]hant[-_]hk|zh[-_]hk/i.test(v.lang); },
      function(v){ return /cantonese|粵|粤/i.test(v.name); },
      function(v){ return /zh[-_]hant|zh[-_]tw/i.test(v.lang); },
      function(v){ return /^zh/i.test(v.lang); }
    ];
    for(var i = 0; i < tries.length; i++){
      var hit = vs.filter(tries[i])[0];
      if(hit) return hit;
    }
    return null;
  }
  function isYue(v){
    return !!v && (/^yue/i.test(v.lang) || /hk/i.test(v.lang) || /cantonese|粵|粤/i.test(v.name));
  }
  function speak(text, rate){
    if(!("speechSynthesis" in window)){ toast("当前浏览器不支持语音合成"); return; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text));
    var v = pickVoice();
    if(v){ u.voice = v; u.lang = v.lang; } else { u.lang = "zh-HK"; }
    u.rate = rate || 0.85;
    speechSynthesis.speak(u);
  }
  function voiceTip(){
    if(!("speechSynthesis" in window)) return "当前浏览器不支持语音合成，朗读不可用（建议使用 Edge 或 Chrome）。";
    var v = pickVoice();
    if(!v) return "未检测到中文语音。Windows：设置 → 时间和语言 → 语音 → 添加语音 → 中文（香港）。";
    if(isYue(v)) return "已启用粤语语音：" + v.name;
    return "暂无粤语语音，暂以「" + v.name + "」近似朗读；装粤语语音包或改用 Edge 体验更佳。";
  }
  function refreshVoiceTips(){
    var tip = voiceTip();
    $$(".voice-note").forEach(function(n){ n.textContent = tip; });
  }

  /* ---------------- 已学记录 ---------------- */
  var learned;
  try{ learned = new Set(getJSON(LS.learned, [])); }catch(e){ learned = new Set(); }
  function saveLearned(){ setJSON(LS.learned, Array.from(learned)); }
  function isLearned(id){ return learned.has(id); }
  function toggleLearned(id){
    if(learned.has(id)) learned.delete(id); else learned.add(id);
    saveLearned();
  }

  /* ---------------- 测验记录与错题本 ---------------- */
  function quizRecords(){ return getJSON(LS.quiz, {}); }
  function saveQuizRecords(o){ setJSON(LS.quiz, o); }
  function mistakes(){ return getJSON(LS.mistakes, []); }
  function saveMistakes(list){ setJSON(LS.mistakes, list); }
  function addMistake(rec){
    var list = mistakes();
    var i = list.findIndex(function(m){ return m.key === rec.key && m.qi === rec.qi; });
    if(i >= 0) list.splice(i, 1);
    list.unshift(rec);
    if(list.length > 200) list.length = 200;
    saveMistakes(list);
  }
  function dropMistake(key, qi){
    var list = mistakes();
    var i = list.findIndex(function(m){ return m.key === key && m.qi === qi; });
    if(i >= 0){ list.splice(i, 1); saveMistakes(list); }
  }

  /* ---------------- 进度聚合 ---------------- */
  function progress(){
    var vocabTotal = 0, vocabLearned = 0, catStats = [];
    if(typeof VOCAB !== "undefined"){
      VOCAB.forEach(function(cat, ci){
        var got = 0;
        cat.items.forEach(function(_, ii){ if(learned.has("v:" + ci + ":" + ii)) got++; });
        vocabTotal += cat.items.length; vocabLearned += got;
        catStats.push({cat:cat.cat, got:got, total:cat.items.length});
      });
    }
    var sceneTotal = 0, sceneRead = 0;
    if(typeof SCENES !== "undefined"){
      sceneTotal = SCENES.length;
      SCENES.forEach(function(_, i){ if(learned.has("d:" + i)) sceneRead++; });
    }
    var recs = quizRecords(), quizDone = 0, quizTotal = 0, bestSum = 0;
    if(typeof QUIZ_SECTIONS !== "undefined"){
      quizTotal = QUIZ_SECTIONS.length;
      QUIZ_SECTIONS.forEach(function(s){
        var r = recs[s.key];
        if(r){ quizDone++; bestSum += (r.best || 0); }
      });
    }
    var ms = mistakes();
    var done = vocabLearned + sceneRead;
    var all = vocabTotal + sceneTotal;
    return {
      vocabLearned:vocabLearned, vocabTotal:vocabTotal, catStats:catStats,
      sceneRead:sceneRead, sceneTotal:sceneTotal,
      quizDone:quizDone, quizTotal:quizTotal, bestSum:bestSum,
      mistakes:ms.length, mistakeList:ms,
      done:done, all:all, pct: all ? Math.round(done / all * 100) : 0,
      records:recs
    };
  }

  /* ---------------- 搜索索引 ---------------- */
  var INDEX = null;
  function buildIndex(){
    if(INDEX) return INDEX;
    var idx = [];
    if(typeof VOCAB !== "undefined"){
      VOCAB.forEach(function(cat, ci){
        cat.items.forEach(function(it, ii){
          idx.push({t:it.y, j:it.j, d:it.m, tag:"词汇", k:(it.y + " " + it.j + " " + it.m + " " + cat.cat).toLowerCase(), act:{type:"term", ci:ci, ii:ii}});
        });
        idx.push({t:cat.cat, j:"", d:"词汇分类 · " + cat.items.length + " 个词条", tag:"分类", k:cat.cat.toLowerCase(), act:{type:"page", file:"vocabulary.html", hash:"cat-" + ci}});
      });
    }
    if(typeof GRAMMAR !== "undefined"){
      GRAMMAR.forEach(function(g, i){
        var body = (g.p || []).join(" ");
        idx.push({t:g.t, j:"", d:body.slice(0, 60), tag:"语法", k:(g.t + " " + body + " " + (g.pat || "")).toLowerCase(), act:{type:"page", file:"grammar.html", hash:"g-" + i}});
      });
    }
    if(typeof SCENES !== "undefined"){
      SCENES.forEach(function(s, i){
        var body = s.l.map(function(l){ return l.y + " " + l.m; }).join(" ");
        idx.push({t:s.t, j:"", d:s.s, tag:"场景", k:(s.t + " " + s.s + " " + body).toLowerCase(), act:{type:"page", file:"dialogues.html", hash:"s-" + i}});
      });
    }
    if(typeof PH_TONES !== "undefined"){
      PH_TONES.forEach(function(t, i){
        idx.push({t:t.d + " · 第" + t.n + "声", j:t.jp, d:"调值 " + t.v + "　例字 " + t.ex, tag:"语音", k:("声调 " + t.n + " " + t.d + " " + t.jp + " " + t.ex).toLowerCase(), act:{type:"page", file:"phonetics.html", hash:"sec-2"}});
      });
    }
    if(typeof PH_INITIALS !== "undefined"){
      PH_INITIALS.forEach(function(x){
        idx.push({t:"声母 " + x.j, j:x.ipa, d:x.d + " · " + x.cmp, tag:"语音", k:("声母 " + x.j + " " + x.d + " " + (x.ex || []).map(function(e){ return e[0]; }).join(" ")).toLowerCase(), act:{type:"page", file:"phonetics.html", hash:"sec-3"}});
      });
    }
    if(typeof PH_FINALS !== "undefined"){
      PH_FINALS.forEach(function(g){
        g.rows.forEach(function(r){
          idx.push({t:"韵母 " + r[0], j:r[2], d:g.g + " · 例字 " + r[1], tag:"语音", k:("韵母 " + r[0] + " " + r[1] + " " + r[2]).toLowerCase(), act:{type:"page", file:"phonetics.html", hash:"sec-4"}});
        });
      });
    }
    if(typeof PH_LAZY !== "undefined"){
      PH_LAZY.forEach(function(x){
        idx.push({t:"懒音 · " + x.t, j:"", d:x.d.slice(0, 60), tag:"语音", k:("懒音 " + x.t + " " + x.d).toLowerCase(), act:{type:"page", file:"phonetics.html", hash:"sec-5"}});
      });
    }
    if(typeof DIFF_GROUPS !== "undefined"){
      DIFF_GROUPS.forEach(function(g, gi){
        idx.push({t:"粤普差异 · " + g.g, j:"", d:g.d, tag:"差异", k:("粤普差异 " + g.g + " " + g.d).toLowerCase(), act:{type:"page", file:"diff.html", hash:"dg-" + gi}});
        (g.pairs || []).forEach(function(p, pi){
          idx.push({t:p.y, j:p.j, d:"普通话：" + p.m, tag:"差异", k:(p.y + " " + p.j + " " + p.m + " " + (p.note || "")).toLowerCase(), act:{type:"page", file:"diff.html", hash:"dg-" + gi + "-" + pi}});
        });
      });
    }
    INDEX = idx;
    return idx;
  }

  function search(q){
    var kw = String(q || "").trim().toLowerCase();
    if(kw.length < 1) return [];
    var parts = kw.split(/\s+/);
    var out = [];
    buildIndex().forEach(function(it){
      var ok = parts.every(function(p){ return it.k.indexOf(p) >= 0; });
      if(!ok) return;
      var score = 0;
      if(it.t.toLowerCase() === kw) score += 100;
      else if(it.t.toLowerCase().indexOf(kw) === 0) score += 60;
      else if(it.t.toLowerCase().indexOf(kw) >= 0) score += 30;
      if(it.j && it.j.toLowerCase().indexOf(kw) >= 0) score += 20;
      if(it.d && it.d.toLowerCase().indexOf(kw) >= 0) score += 6;
      out.push({it:it, score:score});
    });
    out.sort(function(a, b){ return b.score - a.score; });
    return out.slice(0, 24).map(function(x){ return x.it; });
  }

  function goSearch(item){
    if(!item) return;
    if(item.act.type === "term"){
      openTerm(item.act.ci, item.act.ii);
    }else{
      if(item.act.file === currentPage && item.act.hash){
        var el = document.getElementById(item.act.hash);
        if(el){ el.scrollIntoView({block:"start"}); closeSearch(); return; }
      }
      location.href = item.act.file + (item.act.hash ? "#" + item.act.hash : "");
    }
    closeSearch();
  }

  var currentPage = "index";

  /* ---------------- 顶栏 ---------------- */
  function renderTopbar(){
    var host = $("#topbar");
    if(!host) return;
    var nav = PAGES.map(function(p){
      return '<a href="' + p.file + '"' + (p.id === currentPage ? ' class="active"' : "") + '>' + esc(p.nav) + "</a>";
    }).join("");
    host.className = "topbar";
    host.innerHTML =
      '<div class="topbar-in">' +
        '<a class="brand" href="index.html">' +
          '<span class="mark">粤</span>' +
          '<span><span class="zh">' + esc(SITE.name) + '</span><br><span class="en">Cantonese Course</span></span>' +
        '</a>' +
        '<nav class="topnav">' + nav + "</nav>" +
        '<div class="topacts">' +
          '<div class="search-wrap">' +
            '<span class="search-ico">⌕</span>' +
            '<input class="search" id="search-input" type="search" placeholder="搜索词汇、语法、场景…" autocomplete="off">' +
            '<span class="search-key">/</span>' +
            '<div class="search-pop" id="search-pop"><div class="sp-list" id="sp-list"></div></div>' +
          "</div>" +
          '<button class="iconbtn wide" id="fs-btn" title="切换字号">字号 中</button>' +
          '<button class="iconbtn wide" id="theme-btn" title="切换明暗">浅色</button>' +
        "</div>" +
      "</div>";

    $("#theme-btn").addEventListener("click", toggleTheme);
    $("#fs-btn").addEventListener("click", cycleFs);
    $("#fs-btn").textContent = "字号 " + ({s:"小", m:"中", l:"大"}[document.documentElement.getAttribute("data-fs")] || "中");
    syncThemeBtn();
    bindSearch();
  }

  function bindSearch(){
    var input = $("#search-input"), pop = $("#search-pop"), list = $("#sp-list");
    if(!input) return;
    var items = [], cursor = -1;

    function paint(){
      if(!items.length){
        list.innerHTML = '<div class="sp-empty">没有找到匹配的内容</div>';
        return;
      }
      list.innerHTML = items.map(function(it, i){
        return '<a class="sp-item' + (i === cursor ? " on" : "") + '" data-si="' + i + '" href="javascript:void(0)">' +
          '<div class="sp-t"><span class="sp-tag">' + esc(it.tag) + '</span>' + esc(it.t) +
            (it.j ? '<span class="jp">' + esc(it.j) + "</span>" : "") + "</div>" +
          '<div class="sp-d">' + esc(it.d || "") + "</div>" +
        "</a>";
      }).join("");
    }
    function open(){
      var q = input.value.trim();
      if(!q){ pop.classList.remove("open"); items = []; cursor = -1; return; }
      items = search(q); cursor = items.length ? 0 : -1;
      paint();
      pop.classList.add("open");
    }
    input.addEventListener("input", open);
    input.addEventListener("focus", open);
    input.addEventListener("keydown", function(e){
      if(e.key === "ArrowDown"){ e.preventDefault(); if(!items.length) return; cursor = (cursor + 1) % items.length; paint(); }
      else if(e.key === "ArrowUp"){ e.preventDefault(); if(!items.length) return; cursor = (cursor - 1 + items.length) % items.length; paint(); }
      else if(e.key === "Enter"){ e.preventDefault(); if(cursor >= 0) goSearch(items[cursor]); }
      else if(e.key === "Escape"){ closeSearch(); input.blur(); }
    });
    list.addEventListener("click", function(e){
      var a = e.target.closest(".sp-item");
      if(a) goSearch(items[+a.dataset.si]);
    });
    document.addEventListener("click", function(e){
      if(!e.target.closest(".search-wrap")) closeSearch();
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "/" && !/^(INPUT|TEXTAREA)$/.test((e.target.tagName || "")) && !e.target.isContentEditable){
        e.preventDefault(); input.focus(); input.select();
      }
      if(e.key === "Escape") closeSearch();
    });
  }
  function closeSearch(){
    var pop = $("#search-pop");
    if(pop) pop.classList.remove("open");
  }

  /* ---------------- 侧栏目录 ---------------- */
  var tocItems = [];
  function setToc(list){
    tocItems = list || [];
    var host = $("#sidebar");
    if(!host) return;
    var page = PAGES.filter(function(p){ return p.id === currentPage; })[0];
    host.innerHTML =
      '<div class="side-cap">' + esc(page ? page.sec + " · 目录" : "目录") + "</div>" +
      '<nav class="side-nav" id="side-nav">' +
        tocItems.map(function(t){
          return '<a href="#' + t.id + '" data-toc="' + t.id + '">' +
            (t.n ? '<span class="n">' + esc(t.n) + "</span>" : "") +
            "<span>" + esc(t.label) + "</span>" +
            (t.c != null ? '<span class="c">' + esc(t.c) + "</span>" : "") +
          "</a>";
        }).join("") +
      "</nav>";
    $("#side-nav").addEventListener("click", function(e){
      var a = e.target.closest("a[data-toc]");
      if(!a) return;
      e.preventDefault();
      var el = document.getElementById(a.dataset.toc);
      if(el) el.scrollIntoView({block:"start"});
    });
    spyToc();
  }
  function spyToc(){
    if(!("IntersectionObserver" in window) || !tocItems.length) return;
    var links = {};
    $$("#side-nav a").forEach(function(a){ links[a.dataset.toc] = a; });
    var targets = tocItems.map(function(t){ return document.getElementById(t.id); }).filter(Boolean);
    if(!targets.length) return;
    var active = targets[0].id;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting) active = en.target.id;
      });
      var first = targets[0].getBoundingClientRect();
      if(first.top > 90) active = targets[0].id;
      Object.keys(links).forEach(function(k){ links[k].classList.toggle("active", k === active); });
    }, {rootMargin:"-72px 0px -70% 0px", threshold:[0, 1]});
    targets.forEach(function(t){ io.observe(t); });
  }

  /* ---------------- 详情抽屉 ---------------- */
  function drawerEls(){
    var mask = $("#drawer-mask"), panel = $("#drawer");
    if(!mask){
      mask = document.createElement("div"); mask.id = "drawer-mask"; mask.className = "drawer-mask";
      panel = document.createElement("aside"); panel.id = "drawer"; panel.className = "drawer";
      document.body.appendChild(mask); document.body.appendChild(panel);
      mask.addEventListener("click", closeDrawer);
    }
    return {mask:mask, panel:panel};
  }
  function closeDrawer(){
    var d = drawerEls();
    d.mask.classList.remove("open");
    d.panel.classList.remove("open");
    document.body.style.overflow = "";
  }
  function showDrawer(headTag, html){
    var d = drawerEls();
    d.panel.innerHTML =
      '<div class="drawer-head"><span class="dh-tag">' + esc(headTag) + "</span>" +
      '<button class="btn sm ghost x" id="drawer-x">关闭 ✕</button></div>' +
      '<div class="drawer-body">' + html + "</div>";
    $("#drawer-x").addEventListener("click", closeDrawer);
    d.mask.classList.add("open");
    d.panel.classList.add("open");
    document.body.style.overflow = "hidden";
    d.panel.querySelector(".drawer-body").scrollTop = 0;
  }

  /* 词条详情：释义 + 全站用法 + 同类词 */
  function openTerm(ci, ii){
    if(typeof VOCAB === "undefined") return;
    var cat = VOCAB[ci]; if(!cat) return;
    var it = cat.items[ii]; if(!it) return;
    var id = "v:" + ci + ":" + ii;
    var on = learned.has(id);

    /* 检索场景对话里的实际用法 */
    var uses = [];
    if(typeof SCENES !== "undefined"){
      SCENES.forEach(function(s){
        s.l.forEach(function(ln){
          if(ln.y.indexOf(it.y) >= 0 && uses.length < 4){
            uses.push({scene:s.t, y:ln.y, j:ln.j, m:ln.m});
          }
        });
      });
    }
    /* 检索语法例句里的用法 */
    if(typeof GRAMMAR !== "undefined" && uses.length < 5){
      GRAMMAR.forEach(function(g){
        (g.ex || []).forEach(function(ex){
          if(ex.y.indexOf(it.y) >= 0 && uses.length < 5){
            uses.push({scene:"语法 · " + g.t, y:ex.y, j:ex.j, m:ex.m});
          }
        });
      });
    }
    /* 同类别其他词 */
    var siblings = cat.items.map(function(x, i){ return {x:x, i:i}; })
      .filter(function(o){ return o.i !== ii; }).slice(0, 14);

    showDrawer("词汇 · " + cat.cat,
      '<h2>' + esc(it.y) + "</h2>" +
      '<div class="dj">' + esc(it.j) + "</div>" +
      '<div class="btnrow" style="margin-top:16px">' +
        '<button class="btn primary" data-say="' + esc(it.y) + '">朗读</button>' +
        '<button class="btn' + (on ? " on" : "") + '" data-term-mark="' + id + '">' + (on ? "已学 ✓" : "标记已学") + "</button>" +
      "</div>" +
      '<div class="drawer-sec"><div class="ds-t">普通话释义</div><p>' + esc(it.m) + "</p></div>" +
      (uses.length
        ? '<div class="drawer-sec"><div class="ds-t">全站真实用法 · ' + uses.length + ' 处</div>' +
          uses.map(function(u){
            return '<div class="drawer-ex"><div class="de-y">' + esc(u.y) + "</div>" +
              '<div class="de-j">' + esc(u.j) + "</div>" +
              '<div class="de-m">' + esc(u.m) + "　·　" + esc(u.scene) + "</div></div>";
          }).join("") + "</div>"
        : '<div class="drawer-sec"><div class="ds-t">全站真实用法</div><p class="muted small">对话与语法例句中暂无该词，可在场景对话里主动练习。</p></div>') +
      '<div class="drawer-sec"><div class="ds-t">同类词</div><div class="chips" style="margin:0">' +
        siblings.map(function(o){
          return '<button class="chip mini" data-sibling="' + o.i + '">' + esc(o.x.y) + "</button>";
        }).join("") + "</div></div>"
    );
    var body = $("#drawer .drawer-body");
    body.addEventListener("click", function(e){
      var sib = e.target.closest("[data-sibling]");
      if(sib){ openTerm(ci, +sib.dataset.sibling); return; }
      var mk = e.target.closest("[data-term-mark]");
      if(mk){
        toggleLearned(mk.dataset.termMark);
        var now = learned.has(mk.dataset.termMark);
        mk.classList.toggle("on", now);
        mk.textContent = now ? "已学 ✓" : "标记已学";
        document.dispatchEvent(new CustomEvent("yy:progress"));
        syncCard(mk.dataset.termMark);
      }
    });
  }
  function syncCard(id){
    var card = document.querySelector('.tcard[data-id="' + id + '"]');
    if(!card) return;
    var on = learned.has(id);
    card.classList.toggle("learned", on);
    var flag = card.querySelector(".flag");
    if(flag) flag.textContent = on ? "已学 ✓" : "";
    var btn = card.querySelector("[data-markbtn]");
    if(btn){ btn.classList.toggle("on", on); btn.textContent = on ? "已学 ✓" : "标记"; }
  }

  /* ---------------- 组件：词条卡片 ---------------- */
  function renderVocabGrid(host, items, prefix){
    function idOf(x){ return prefix + x._ci + ":" + x._ii; }
    host.innerHTML = items.map(function(it){
      var id = idOf(it);
      var on = learned.has(id);
      return '<article class="tcard' + (on ? " learned" : "") + '" data-id="' + id + '" tabindex="0">' +
        '<span class="flag">' + (on ? "已学 ✓" : "") + "</span>" +
        '<div class="tc-top"><span class="tc-y">' + esc(it.y) + '</span><span class="tc-j">' + esc(it.j) + "</span></div>" +
        '<div class="tc-m">' + esc(it.m) + "</div>" +
        '<div class="tc-act">' +
          '<button class="btn sm ghost" data-say="' + esc(it.y) + '">朗读</button>' +
          '<button class="btn sm" data-markbtn="' + id + '">' + (on ? "已学 ✓" : "标记") + "</button>" +
          '<button class="btn sm ghost" data-open="1">详情</button>' +
        "</div>" +
      "</article>";
    }).join("");

    host.addEventListener("click", function(e){
      var say = e.target.closest("[data-say]");
      if(say){ e.stopPropagation(); speak(say.dataset.say); return; }
      var mk = e.target.closest("[data-markbtn]");
      if(mk){ e.stopPropagation(); toggleLearned(mk.dataset.markbtn); syncCard(mk.dataset.markbtn); document.dispatchEvent(new CustomEvent("yy:progress")); return; }
      var card = e.target.closest(".tcard");
      if(card){
        var hit = items.filter(function(x){ return idOf(x) === card.dataset.id; })[0];
        if(hit) openTerm(hit._ci, hit._ii);
      }
    });
    host.addEventListener("keydown", function(e){
      if(e.key !== "Enter" && e.key !== " ") return;
      var card = e.target.closest(".tcard"); if(!card) return;
      e.preventDefault();
      var hit = items.filter(function(x){ return idOf(x) === card.dataset.id; })[0];
      if(hit) openTerm(hit._ci, hit._ii);
    });
  }

  /* ---------------- 组件：对话场景 ---------------- */
  function renderScene(host, sc, idx){
    var done = learned.has("d:" + idx);
    host.innerHTML =
      '<div class="sec-head"><h2><span class="sceno" style="font-family:var(--mono);font-size:.82rem;color:var(--primary);margin-right:8px">' + pad(idx + 1) + "</span>" + esc(sc.t) + "</h2>" +
      '<span class="cnt">' + sc.l.length + " 句</span><span class=\"rule\"></span>" +
      '<button class="btn sm' + (done ? " on" : "") + '" data-scene-mark="' + idx + '">' + (done ? "已读完 ✓" : "标记读完") + "</button>" +
      '<button class="btn sm ghost" data-playall="' + idx + '">整段朗读</button></div>' +
      '<p class="muted small" style="margin-bottom:14px">' + esc(sc.s) + "</p>" +
      '<div class="lines">' + sc.l.map(function(ln, li){
        var me = ln.w === "你" || /^（/.test(ln.w);
        return '<div class="dline' + (me ? " me" : "") + '">' +
          '<span class="who">' + esc(ln.w) + "</span>" +
          "<div>" +
            '<div class="y">' + esc(ln.y) + "</div>" +
            '<div class="j">' + esc(ln.j) + "</div>" +
            '<div class="m">' + esc(ln.m) + "</div>" +
            '<div class="acts"><button class="btn sm ghost" data-say="' + esc(ln.y) + '">读这句</button>' +
              '<button class="btn sm ghost" data-dline-mark="d' + idx + "-" + li + '">收藏这句</button></div>' +
          "</div></div>";
      }).join("") + "</div>";
  }
  function playAll(sc){
    if(!("speechSynthesis" in window)){ toast("当前浏览器不支持语音合成"); return; }
    speechSynthesis.cancel();
    var v = pickVoice();
    sc.l.forEach(function(ln){
      var u = new SpeechSynthesisUtterance(ln.y);
      if(v){ u.voice = v; u.lang = v.lang; } else { u.lang = "zh-HK"; }
      u.rate = 0.85;
      speechSynthesis.speak(u);
    });
  }

  /* ---------------- 组件：测验 ---------------- */
  function renderQuiz(container, cfg){
    var sel = {};
    container.innerHTML = cfg.qs.map(function(q, qi){
      return '<div class="q-block">' +
        '<div class="q-idx">QUESTION ' + pad(qi + 1) + "</div>" +
        '<div class="q-text">' + q.q + "</div>" +
        '<div class="opts">' + q.o.map(function(o, oi){
          return '<button class="opt" data-qi="' + qi + '" data-oi="' + oi + '">' + String.fromCharCode(65 + oi) + "．" + esc(o) + "</button>";
        }).join("") + "</div>" +
        '<p class="q-explain" id="qex-' + cfg.key + "-" + qi + '"><b>讲解</b>　' + q.e + "</p>" +
      "</div>";
    }).join("");

    container.addEventListener("click", function(e){
      var o = e.target.closest(".opt");
      if(!o || o.disabled) return;
      var qi = +o.dataset.qi;
      sel[qi] = +o.dataset.oi;
      $$('.opt[data-qi="' + qi + '"]', container).forEach(function(x){ x.classList.remove("sel"); });
      o.classList.add("sel");
    });

    var bar = document.getElementById("quiz-bar-" + cfg.key);
    if(bar){
      bar.onclick = function(e){
        var sub = e.target.closest("[data-submit]"), rst = e.target.closest("[data-reset]");
        if(sub){
          var unanswered = cfg.qs.some(function(_, qi){ return sel[qi] === undefined; });
          if(unanswered && !confirm("还有题目未作答，确定交卷？")) return;
          var score = 0;
          cfg.qs.forEach(function(q, qi){
            var pick = sel[qi];
            $$('.opt[data-qi="' + qi + '"]', container).forEach(function(o2){
              var oi = +o2.dataset.oi;
              o2.disabled = true;
              if(oi === q.a) o2.classList.add("right");
              else if(oi === pick) o2.classList.add("wrong");
            });
            if(pick === q.a){
              score++;
              dropMistake(cfg.key, qi);
            }else{
              addMistake({key:cfg.key, t:cfg.title, qi:qi, q:q.q, o:q.o, a:q.a, chose:pick, e:q.e, ts:Date.now()});
            }
            var ex = document.getElementById("qex-" + cfg.key + "-" + qi);
            if(ex) ex.classList.add("show");
          });
          var recs = quizRecords();
          var prev = recs[cfg.key] || {best:0};
          var isNew = score > (prev.best || 0);
          if(isNew){ recs[cfg.key] = {best:score, total:cfg.qs.length, ts:Date.now()}; saveQuizRecords(recs); }
          var pct = Math.round(score / cfg.qs.length * 100);
          var box = document.getElementById("res-" + cfg.key);
          box.classList.add("show");
          box.innerHTML = '<span class="score">' + score + "</span> / " + cfg.qs.length + "（" + pct + " 分）　——　" +
            (pct >= 80 ? "过关，可以进入下一组。" : pct >= 60 ? "不错，翻下错题再来一次。" : "回课文复习一遍，慢慢嚟。") +
            (isNew && score > 0 ? "<br>刷新本组最好成绩。" : "") +
            (score < cfg.qs.length ? '<br><span class="small">做错的题已收入<a href="practice.html#mistakes">错题本</a>。</span>' : "");
          document.dispatchEvent(new CustomEvent("yy:progress"));
        }
        if(rst){
          renderQuiz(container, cfg);
          var rb = document.getElementById("res-" + cfg.key);
          if(rb){ rb.classList.remove("show"); rb.innerHTML = ""; }
        }
      };
    }
  }

  /* ---------------- 全局事件 ---------------- */
  function bindGlobal(){
    document.addEventListener("click", function(e){
      var say = e.target.closest("[data-say]");
      if(say){ speak(say.dataset.say); return; }
      var mark = e.target.closest("button[data-mark]");
      if(mark){
        var id = mark.dataset.mark;
        toggleLearned(id);
        var on = learned.has(id);
        mark.classList.toggle("on", on);
        mark.textContent = on ? (mark.dataset.done || "已学") : (mark.dataset.base || "标记");
        var host = mark.closest(".tcard");
        if(host) host.classList.toggle("learned", on);
        document.dispatchEvent(new CustomEvent("yy:progress"));
      }
    });
    if("speechSynthesis" in window){
      speechSynthesis.addEventListener && speechSynthesis.addEventListener("voiceschanged", refreshVoiceTips);
      setTimeout(refreshVoiceTips, 300);
    }
  }

  /* ---------------- 初始化 ---------------- */
  function init(){
    initTheme();
    currentPage = document.body.dataset.page || "index";
    renderTopbar();
    bindGlobal();
    refreshVoiceTips();
    document.dispatchEvent(new CustomEvent("yy:ready"));
  }
  init();

  /* ---------------- 导出 ---------------- */
  window.YY = {
    SITE:PAGES,
    pages:PAGES,
    $:$,
    $$:$$,
    esc:esc,
    pad:pad,
    toast:toast,

    speak:speak,
    voiceTip:voiceTip,
    refreshVoiceTips:refreshVoiceTips,

    isLearned:isLearned,
    toggleLearned:toggleLearned,

    progress:progress,
    quizRecords:quizRecords,
    mistakes:mistakes,
    saveMistakes:saveMistakes,
    dropMistake:dropMistake,

    search:search,
    setToc:setToc,

    renderVocabGrid:renderVocabGrid,
    renderScene:renderScene,
    playAll:playAll,
    renderQuiz:renderQuiz,

    openTerm:openTerm,
    closeDrawer:closeDrawer,
    showDrawer:showDrawer
  };
})();
