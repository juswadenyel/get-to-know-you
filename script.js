var steps=[
{t:"intro",emoji:"💖",title:"The Get-to-Know-You Quiz",sub:"No right or wrong answers. Just you being you. Ready?"},
{t:"text",emoji:"👋",key:"Name",title:"First things first, Hello miss Kim~ how are you this fine day?",ph:"Good or bad?"},
{t:"chips",emoji:"🌤️",key:"Perfect free day",title:"Your perfect free day looks like…",sub:"Pick as many as you want!",opts:["😴 Sleeping in","☕ Café hopping","🏖️ Beach day","🎬 Movie marathon","🛍️ Shopping","🥾 Adventure","🎮 Gaming","🍰 Cooking or baking","📚 Reading","🎤 Karaoke"]},
{t:"text",emoji:"🔥",key:"Currently obsessed with",title:"What are you super into lately?",sub:"Hobbies, shows, songs, anything!",ph:"I can’t stop…",area:1},
{t:"chips",emoji:"🍜",key:"Foods and drinks she loves",title:"Okay, snack time. What do you love?",sub:"Tap all the yummy ones.",opts:["🍣 Sushi","🍕 Pizza","🍜 Ramen","🍝 Pasta","🍗 Fried chicken","🧋 Milk tea","☕ Coffee","🍓 Fruits","🍢 Street food","🍦 Ice cream","🍫 Chocolate","🧁 Pastries"]},
{t:"text",emoji:"🤢",key:"Foods or drinks she can’t stand",title:"Now the villains. What food can you NOT stand?",ph:"Be honest, I won’t judge…",area:1},
{t:"pairs",emoji:"⚖️",key:"This or that",title:"This or that?",sub:"Quick! Don’t overthink it.",pairs:[["🍬 Sweet","🧂 Savory"],["🌅 Morning","🌙 Night"],["📞 Calls","💬 Texts"],["⛰️ Mountains","🏝️ Beach"],["🐱 Cats","🐶 Dogs"]]},
{t:"chips",emoji:"🌸",key:"Scents she likes",title:"What scents make you go “ooh”?",sub:"Pick your favorites.",opts:["🌷 Floral","🍑 Fruity","🪵 Woody","🍦 Vanilla","🫧 Fresh and clean","🍋 Citrus","🤍 Musky","🌫️ Powdery","🙅 Not into perfume"]},
{t:"text",emoji:"🎨",key:"Favorite colors and style",title:"What are your favorite colors or style?",ph:"Soft pastels, all black, cozy fits…",area:1},
{t:"chips",emoji:"🙄",key:"Turn-offs",title:"What’s an instant “ugh”?",sub:"Tap whatever annoys you.",opts:["⏰ Being late","🐢 Slow replies","👂 Loud chewing","🚫 Crowds","🌶️ Super spicy food","👻 Horror movies","🥶 Cold weather","🧹 Messy places","📵 Dry texting"]},
{t:"text",emoji:"💭",key:"Anything else that annoys her",title:"Anything else that bugs you?",ph:"Spill it…",area:1},
{t:"text",emoji:"🌟",key:"Something she wants to try",title:"Last one! What have you been wanting to try?",sub:"A place, a food, an activity, a dream trip…",ph:"I’ve always wanted to…",area:1},
{t:"end"}
];

var A={}, i=0;
var stage=document.getElementById("stage");
var fill=document.getElementById("fill");
var count=document.getElementById("count");

function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

function burst(e){
  var x=(e&&e.clientX)||innerWidth/2, y=(e&&e.clientY)||innerHeight/2;
  var em=["💖","✨","🌸","💫"];
  for(var k=0;k<4;k++){
    var s=document.createElement("span");
    s.className="pop";
    s.textContent=em[(Math.random()*4)|0];
    s.style.left=(x+(Math.random()*60-30))+"px";
    s.style.top=y+"px";
    document.body.appendChild(s);
    setTimeout((function(n){return function(){n.remove()}})(s),1200);
  }
}

function summary(){
  var out=["💖 My answers 💖",""];
  steps.forEach(function(s){
    if(!s.key) return;
    var v=A[s.key];
    if(s.t==="pairs"){
      var ps=[];
      s.pairs.forEach(function(p,n){ if(v && v[n]) ps.push(v[n]); });
      if(ps.length) out.push(s.key+": "+ps.join(", "));
    } else if(Array.isArray(v)){
      if(v.length) out.push(s.key+": "+v.join(", "));
    } else if(v){
      out.push(s.key+": "+v);
    }
  });
  return out.join("\n");
}

function render(){
  var s=steps[i], total=steps.length-1;
  fill.style.width=(i/total*100)+"%";
  count.textContent=(s.t==="intro"||s.t==="end")?"":"Question "+i+" of "+(total-1);
  var h='<div class="card"><div class="big">'+s.emoji+'</div>';

  if(s.t==="intro"){
    h+='<h1>'+s.title+'</h1><p>'+s.sub+'</p><div class="nav"><span></span><button class="btn" id="next">Let’s go ✨</button></div>';
  } else if(s.t==="end"){
    h+='<h2>You’re done! 🎉</h2><p>Tap send and your answers go straight to me 💌</p>'
      +'<div class="sum" id="sum">'+esc(summary())+'</div>'
      +'<div class="nav"><button class="btn ghost" id="back">← Back</button><button class="btn" id="send">Send my answers 💌</button></div>'
      +'<p class="center"><button class="link" id="copy">or copy them instead</button></p>';
  } else {
    h+='<h2>'+s.title+'</h2>'+(s.sub?'<p>'+s.sub+'</p>':'<p>&nbsp;</p>');
    if(s.t==="text"){
      var val=esc(A[s.key]||"");
      h+= s.area
        ? '<textarea id="in" placeholder="'+esc(s.ph)+'">'+val+'</textarea>'
        : '<input type="text" id="in" placeholder="'+esc(s.ph)+'" value="'+val+'">';
    }
    if(s.t==="chips"){
      h+='<div class="chips">';
      s.opts.forEach(function(o){
        var on=(A[s.key]||[]).indexOf(o)>-1;
        h+='<button class="chip'+(on?' on':'')+'" data-o="'+esc(o)+'">'+o+'</button>';
      });
      h+='</div>';
    }
    if(s.t==="pairs"){
      A[s.key]=A[s.key]||{};
      s.pairs.forEach(function(p,n){
        h+='<div class="pair">'
          +'<button class="chip'+(A[s.key][n]===p[0]?' on':'')+'" data-n="'+n+'" data-v="'+esc(p[0])+'">'+p[0]+'</button>'
          +'<span>or</span>'
          +'<button class="chip'+(A[s.key][n]===p[1]?' on':'')+'" data-n="'+n+'" data-v="'+esc(p[1])+'">'+p[1]+'</button></div>';
      });
    }
    h+='<div class="nav"><button class="btn ghost" id="back">← Back</button><button class="btn" id="next">'+(i===total-1?'Finish 🎉':'Next →')+'</button></div>';
  }
  h+='</div>';
  stage.innerHTML=h;
  wire(s);
}

function saveText(s){
  if(s.t==="text") A[s.key]=document.getElementById("in").value.trim();
}

function wire(s){
  var n=document.getElementById("next"), b=document.getElementById("back");
  if(n) n.onclick=function(e){ saveText(s); burst(e); i++; render(); scrollTo(0,0); };
  if(b) b.onclick=function(){ saveText(s); i--; render(); };

  if(s.t==="chips"){
    stage.querySelectorAll(".chip").forEach(function(c){
      c.onclick=function(e){
        var o=c.getAttribute("data-o"), l=A[s.key]||[], k=l.indexOf(o);
        if(k>-1) l.splice(k,1); else { l.push(o); burst(e); }
        A[s.key]=l;
        c.classList.toggle("on");
      };
    });
  }

  if(s.t==="pairs"){
    stage.querySelectorAll(".chip").forEach(function(c){
      c.onclick=function(e){
        A[s.key][c.getAttribute("data-n")]=c.getAttribute("data-v");
        burst(e);
        c.parentNode.querySelectorAll(".chip").forEach(function(x){x.classList.remove("on")});
        c.classList.add("on");
      };
    });
  }

  var send=document.getElementById("send"), cp=document.getElementById("copy");

  if(send) send.onclick=function(e){
    send.disabled=true; send.textContent="Sending…";
    fetch("/",{
      method:"POST",
      headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body:new URLSearchParams({"form-name":"quiz",name:A.Name||"",answers:summary()}).toString()
    }).then(function(r){
      if(!r.ok) throw new Error("fail");
      send.textContent="Sent! 💖"; burst(e);
    }).catch(function(){
      send.disabled=false; send.textContent="Couldn’t send, tap to retry";
    });
  };

  if(cp) cp.onclick=function(){
    var t=summary();
    function ok(){ cp.textContent="Copied! Now paste it to me 💖"; }
    function fallback(){
      var r=document.createRange(); r.selectNodeContents(document.getElementById("sum"));
      var se=getSelection(); se.removeAllRanges(); se.addRange(r);
      try{ document.execCommand("copy"); ok(); }catch(e){ cp.textContent="Long-press the text to copy it"; }
    }
    try{ navigator.clipboard.writeText(t).then(ok,fallback); }catch(e){ fallback(); }
  };
}

render();