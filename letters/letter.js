/* ====== Shared renderer for DI Letter article pages ======
   Each page defines window.LETTER (article data, 3 languages)
   then includes this script. Language is shared with the homepage
   via localStorage key "di_lang".
*/
(function(){
  var CH = {
    ko:{navLetter:"DI 레터",navQuiz:"DI 퀴즈",crumb:"← 데이터 완전성 레터 목록",
        read:function(n){return "읽는 데 약 "+n+"분";},
        footer:"본 포털은 사내 GMP · 데이터 완전성 교육 목적으로 제작되었습니다."},
    en:{navLetter:"DI Letter",navQuiz:"DI Quiz",crumb:"← Back to all letters",
        read:function(n){return "about "+n+" min read";},
        footer:"This portal is for internal GMP and data integrity training."},
    vn:{navLetter:"Thư DI",navQuiz:"Quiz DI",crumb:"← Quay lại danh sách thư",
        read:function(n){return "khoảng "+n+" phút đọc";},
        footer:"Cổng thông tin này phục vụ đào tạo GMP và tính toàn vẹn dữ liệu nội bộ."}
  };

  var LANG = 'ko';
  try{ var s=localStorage.getItem('di_lang'); if(s&&CH[s]) LANG=s; }catch(e){}

  function tx(o){ if(o==null) return ''; if(typeof o==='string') return o; return o[LANG]||o.en||o.ko||''; }
  function esc(){ } // content is author-trusted; inline <strong>/<em> allowed

  function blockHTML(b){
    switch(b.type){
      case 'figure':
        return '<figure><img src="'+b.img+'" alt="'+(b.alt||'')+'">'+
               (b.cap?'<figcaption>'+tx(b.cap)+'</figcaption>':'')+'</figure>';
      case 'lead':   return '<p class="lead">'+tx(b.text)+'</p>';
      case 'p':      return '<p>'+tx(b.text)+'</p>';
      case 'hr':     return '<hr class="div">';
      case 'h2':     return '<h2 class="sec">'+tx(b.text)+'</h2>';
      case 'quote':  return '<blockquote><p>'+tx(b.text)+'</p></blockquote>';
      case 'reg':{
        var rows=(b.rows||[]).map(function(r){return '<dt>'+tx(r.dt)+'</dt><dd>'+tx(r.dd)+'</dd>';}).join('');
        return '<div class="callout"><dl class="reg">'+rows+'</dl>'+
               (b.note?'<div class="reglist">'+tx(b.note)+'</div>':'')+'</div>';
      }
      case 'check':{
        var items=(b.items||[]).map(function(it,i){return '<li><span class="n">'+(i+1)+'</span>'+tx(it)+'</li>';}).join('');
        return '<div class="callout"><h3><span class="chip">CHECK</span>'+tx(b.head)+'</h3><ul>'+items+'</ul></div>';
      }
      case 'next':
        return '<div class="next"><div><div class="nx">'+tx(b.label)+'</div><div class="nt">'+tx(b.text)+'</div></div></div>';
      case 'cta':{
        var btns=(b.buttons||[]).map(function(x){
          return '<a class="'+(x.primary?'primary':'ghost')+'" href="'+x.href+'">'+tx(x.label)+'</a>';}).join('');
        return '<div class="cta">'+btns+'</div>';
      }
      case 'disclaimer': return '<div class="disclaimer">'+tx(b.text)+'</div>';
      default: return '';
    }
  }

  function render(){
    var D=window.LETTER||{};
    var c=CH[LANG];
    // chrome
    document.documentElement.lang = (LANG==='vn'?'vi':LANG);
    document.title = tx(D.title)+' · '+D.vol+' · DI Letter';
    document.querySelectorAll('[data-k]').forEach(function(el){
      var k=el.getAttribute('data-k');
      if(k==='navLetter') el.textContent=c.navLetter;
      else if(k==='navQuiz') el.textContent=c.navQuiz;
      else if(k==='crumb') el.textContent=c.crumb;
      else if(k==='footer') el.textContent=c.footer;
    });
    // tags
    var tagsHTML=(D.tags||[]).map(function(t,i){return '<span class="tag'+(i%2?' t2':'')+'">'+t+'</span>';}).join('');
    // body
    var html=''+
      '<div class="tags">'+tagsHTML+'</div>'+
      '<h1 class="title">'+tx(D.title)+'</h1>'+
      (D.series?'<div class="series">'+tx(D.series)+'</div>':'')+
      '<div class="meta"><div class="avatar">DI</div><div>'+
        '<div class="mname">'+(D.author||'S1 Plant · Data Management Team')+'</div>'+
        '<div class="msub">DI LETTER '+D.vol+' · '+D.date+' · '+c.read(D.readmin||5)+'</div>'+
      '</div></div>'+
      (D.intro?'<div class="intro-box">'+tx(D.intro)+'</div>':'')+
      (D.blocks||[]).map(blockHTML).join('');
    document.getElementById('art').innerHTML = html;
  }

  function setLang(l){
    if(!CH[l]) return; LANG=l;
    try{ localStorage.setItem('di_lang', l); }catch(e){}
    render();
    document.querySelectorAll('.langbtn').forEach(function(b){ b.classList.toggle('on', b.dataset.l===l); });
  }
  window.__setLetterLang=setLang;

  function init(){
    render();
    document.querySelectorAll('.langbtn').forEach(function(b){
      b.classList.toggle('on', b.dataset.l===LANG);
      b.addEventListener('click', function(){ setLang(b.dataset.l); });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
