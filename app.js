/* 덩어리숲 · Korece Kelime Ormanı — © 2026 Wonju (원주). Tüm hakları saklıdır. */
{
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const SPK='<svg><use href="#i-spk"/></svg>';
const CH=window.FOREST_CHAR;
const CFG=window.SITE_CONFIG||{};
const OWNER=CFG.owner||'Wonju (원주)';
const CONTACT=(CFG.contact||'').trim();

// ---------- kelimeler ----------
const isVerb=tr=>/m[ae]k(\b|\s|\)|,|$)/i.test(tr);
const LEVELS=(window.LEVELS||[]).map(L=>{
 const units=[],words=[];let unit=null,n=0;
 for(const raw of L.text.split('\n')){
  const line=raw.trim();if(!line)continue;
  if(line.startsWith('#')){unit={key:line.slice(1).trim(),words:[]};units.push(unit);continue}
  const [ko,tr,ps='']=line.split('|').map(x=>x.trim());if(!ko||!tr)continue;
  if(!unit){unit={key:'1',words:[]};units.push(unit)}
  const id=L.id+':'+(n++);
  const w={id,ko,tr,lv:L.id,unit:unit.key,ui:units.length-1,verb:isVerb(tr),hanja:!!L.hanja,pairs:[]};
  w.pairs=ps.split(';').map(x=>x.trim()).filter(Boolean).map((p,j)=>{const k=p.indexOf('=');const pt=p.slice(k+1).trim();return {id:id+'~'+j,ko:p.slice(0,k).trim(),tr:pt,parent:w,verb:isVerb(pt)}}).filter(p=>p.ko&&p.tr);
  unit.words.push(w);words.push(w);
 }
 return {...L,units,words};
}).filter(L=>L.words.length);
const ORDER=['A1-A2','B1.1','B1.2','B2.1','B2.2','HANJA'];
LEVELS.sort((a,b)=>ORDER.indexOf(a.id)-ORDER.indexOf(b.id));
const ALL=LEVELS.flatMap(L=>L.words);
const BYID=new Map();ALL.forEach(w=>{BYID.set(w.id,w);w.pairs.forEach(p=>BYID.set(p.id,p))});
const lvById=id=>LEVELS.find(L=>L.id===id)||LEVELS[0];
const norm=s=>s.toLowerCase().replace(/\(.*?\)/g,'').replace(/[^a-zçğıöşüâîû0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const clash=(a,b)=>{const x=norm(a),y=norm(b);return !x||!y||x===y||x.includes(y)||y.includes(x)};

// ---------- dil ----------
const TX={
tr:{sub:'Korece kelime ormanı · A1–B2',learned:'Öğrenilen',toReview:'Tekrar',bestStreak:'En iyi seri',
 start:'Başla',quiz:'Test',cards:'Kartlar',review:n=>`Tekrar ${n}`,allUnits:'Tüm bölümler',unitN:k=>/^\d+$/.test(k)?`Bölüm ${k}`:k,
 level:'Seviye',unit:'Bölüm',timerOn:'12 saniye',timerOff:'Süre yok',timeLimit:'Süre sınırı (test)',
 hint:'Doğru anlama dokun · klavye 1–4',qWord:'Bu kelimenin anlamı nedir?',qPair:'Bu eş kelimenin anlamı nedir?',qHanja:'Bu Çince karakterin anlamı nedir?',
 kNew:'✦ Yeni kelime',kBase:'Kelime',kRev:'↺ Tekrar',kBonus:'✦ Eş kelime bonusu',kPairRev:'↺ Eş kelime tekrarı',
 modeTimed:'Zamanlı',modeFree:'Süre yok',sec:s=>`${s} sn`,
 ok:'Tamam',right:'Doğru!',streakT:n=>`${n} doğru üst üste!`,wrong:'Olsun, tekrar öğrenelim',timeup:'Süre doldu',
 plus:(x,s)=>`+${x} besin`+(s?` (seri bonusu +${s})`:''),bonusFree:'Bonus yanlış olsa da sorun yok',willRepeat:'Tekrar listesine eklendi',
 mine:'Senin seçimin: ',
 askBonus:'Bu kelimeyle birlikte kullanılan ifadeyi de öğrenelim mi?',sayIt:'Dinle ve yüksek sesle tekrar et.',
 bonusBtn:'Eş kelime bonusu · +3 besin',skip:'Geç →',next:'Sonraki kelime →',seeRes:'Sonuçları gör',
 resTitle:'Tur bitti!',resSub:(a,b)=>`${b} sorudan ${a} doğru`,correct:'Doğru',nutrient:'Besin',streak:'En uzun seri',
 cardRes:'Kartlar bitti!',cardSub:(a,b)=>`${b} karttan ${a} tanesini biliyorsun`,known:'Biliyorum',unknown:'Bilmiyorum',
 mistakes:'Tekrar edilecekler',noMistake:'Hepsi doğru! Harika iş çıkardın.',home:'Ana sayfa',retryWrong:'Yanlışları çalış',
 tapFlip:'Çevirmek için dokun',tapBack:'Ön yüze dönmek için dokun',cardHint:'Kartı çevir · sola kaydır: bilmiyorum · sağa: biliyorum',
 kNoBtn:'↺ Bilmiyorum',kYesBtn:'✓ Biliyorum',knownN:n=>`✓ ${n}`,
 welTitle:'덩어리숲\'e hoş geldin!',
 letter:'Sevgili Türk ve Azerbaycanlı arkadaşlarım, Koreceyi çok çalışıp TOPIK\'i mutlaka geçmenizi ve istediğiniz her şeyi başarmanızı dilerim!',
 sig:'— Koreli arkadaşınız Wonju (원주)',
 thanksPre:'Bu oyunun hazırlanmasında emeği geçen:',thanksPost:'— kelime listesi için çok teşekkürler!',
 how1:'Korece kelimeyi gör, dört seçenekten Türkçe anlamını seç.',how2:'Doğru cevaptan sonra eş kelime bonusuna katıl. Çevirmeli kartlarla da çalışabilirsin.',how3:'Her doğru cevap besin verir; bitki arkadaşın büyür.',
 namePh:'Bitki arkadaşının adı (isteğe bağlı)',chromeTxt:'Bir uygulamanın içindeki tarayıcıdasın. Sesli okuma için Chrome\'da açman daha iyi olur.',openChrome:'Chrome\'da aç',copy:'Kopyala',copied:'Kopyalandı ✓',
 rights:'Tüm hakları saklıdır.',biz:'İş birliği',bizTitle:'İş birliği ve iletişim',bizText:'Kurumsal iş birliği, eğitim ve içerik ortaklığı için e-posta gönderebilirsiniz.',
 credit:'Kelime listesi: Aslıhan Erdoğan · Karakter çizimleri: 덩어리숲',
 settings:'Ayarlar',lang:'Dil',roundSize:'Bir turdaki kelime',sound:'Ses',autoOn:'Kelimeyi otomatik oku: Açık',autoOff:'Kelimeyi otomatik oku: Kapalı',test:'Sesi dene',name:'Bitki arkadaşının adı',
 look:'Görünüm',stacheOn:'Bıyık: Var',stacheOff:'Bıyık: Yok',
 reset:'İlerlemeyi sıfırla',resetSure:'Emin misin? Tekrar dokun',msg:'Mesaj',settingsA:'Ayarlar',quit:'Çık',listen:'Dinle',
 lvUp:'Seviye atladın!',lvSub:n=>`Artık Lv.${n}`,great:'Harika!',
 pickFam:'Lv.3 · Hangi bitki olsun?',pickFamSub:'Bitki arkadaşının ailesini seç. Sonra değiştirilemez.',
 pickRoute:'Lv.10 · Evrim zamanı!',pickRouteSub:'Hangi yolda büyüsün?',pickBranch:'Lv.15 · Gizemli bir dönüşüm!',pickBranchSub:'İki yoldan birini seç.',
 xpLeft:(a,b)=>`${a} / ${b} besin`,
 seed:'Gönül Tohumu',sprout:'Gönül Filizi',growing:x=>'Büyüyen '+x,magic:x=>'Gizemli '+x,legend:x=>'Efsanevi '+x,
 nextGoal:L=>L<3?'Lv.3\'te bitki aileni seçeceksin':L<10?'Lv.10\'da evrim geçirecek':L<15?'Lv.15\'te gizemli dönüşüm':L<20?'Lv.20\'de efsanevi form':'En yüksek forma ulaştın!',
 fam:{petal:'Gönül Çiçeği',mushroom:'Gönül Mantarı',succulent:'Gönül Sukulenti',clover:'Gönül Yaprağı',berry:'Gönül Meyvesi',tree:'Gönül Ağacı'},
 route:{sunflower:'Altın Ayçiçeği',rose:'Kraliçe Gül',hibiscus:'Cesur Hibiskus',matsutake:'Kral Matsutake',horn:'Şık Boynuzlu Mantar',reishi:'Parlak Reishi',undulata:'Dev Undulata',euphorbia:'Nazlı Sütleğen',cactus:'Azimli Kaktüs',lucky:'Şanslı Dört Yapraklı Yonca',silver:'Ay Işığı Yoncası',crimson:'Sevecen Kırmızı Yonca',strawberry:'Tatlı Dev Çilek',blueberry:'Yıldızlı Yaban Mersini',raspberry:'Canlı Ahududu',oak:'Sağlam Meşe',willow:'Rüzgârlı Söğüt',ginkgo:'Altın Ginkgo'},
 way:'Yol'},
ko:{sub:'한국어 단어의 숲 · A1–B2',learned:'익힌 단어',toReview:'복습',bestStreak:'최고 연속',
 start:'시작하기',quiz:'퀴즈',cards:'카드',review:n=>`복습 ${n}`,allUnits:'전체 단원',unitN:k=>/^\d+$/.test(k)?`${k}단원`:k,
 level:'단계',unit:'단원',timerOn:'12초',timerOff:'시간제한 없음',timeLimit:'제한 시간 (퀴즈)',
 hint:'알맞은 뜻을 누르세요 · 키보드 1–4',qWord:'이 단어의 뜻은 무엇일까요?',qPair:'이 짝꿍어휘의 뜻은 무엇일까요?',qHanja:'이 한자의 뜻은 무엇일까요?',
 kNew:'✦ 새 단어',kBase:'기본 단어',kRev:'↺ 복습 단어',kBonus:'✦ 짝꿍어휘 보너스',kPairRev:'↺ 짝꿍어휘 복습',
 modeTimed:'시간제한',modeFree:'시간제한 없음',sec:s=>`${s}초`,
 ok:'확인',right:'정답이에요!',streakT:n=>`${n}개 연속 정답!`,wrong:'다시 익히면 괜찮아요',timeup:'시간이 다 됐어요',
 plus:(x,s)=>`+${x} 양분`+(s?` (연속 보너스 +${s})`:''),bonusFree:'보너스는 틀려도 괜찮아요',willRepeat:'복습 목록에 넣었어요',
 mine:'내가 고른 답: ',
 askBonus:'이 단어와 함께 쓰는 표현도 익혀 볼까요?',sayIt:'발음을 듣고 한 번 따라 말해 보세요.',
 bonusBtn:'짝꿍어휘 도전 · +3 양분',skip:'건너뛰기 →',next:'다음 단어 →',seeRes:'학습 결과 보기',
 resTitle:'한 판 끝!',resSub:(a,b)=>`${b}문제 중 ${a}개 정답`,correct:'정답',nutrient:'양분',streak:'최고 연속',
 cardRes:'카드 끝!',cardSub:(a,b)=>`${b}장 중 ${a}장 알아요`,known:'알아요',unknown:'몰라요',
 mistakes:'다시 익힐 단어',noMistake:'모두 맞혔어요! 정말 잘했어요.',home:'처음으로',retryWrong:'틀린 것 다시',
 tapFlip:'눌러서 뒤집기',tapBack:'다시 누르면 앞면',cardHint:'카드를 뒤집어요 · 왼쪽으로 밀면 몰라요 · 오른쪽은 알아요',
 kNoBtn:'↺ 몰라요',kYesBtn:'✓ 알아요',knownN:n=>`✓ ${n}`,
 welTitle:'덩어리숲에 오신 것을 환영해요!',
 letter:'튀르키예, 아제르바이잔 친구들, 한국어 열심히 공부해서 꼭 토픽을 합격하고 원하는 일 모두 이루기 바랍니다!',
 sig:'— 한국 친구 원주',
 thanksPre:'이 게임을 만드는 데 도움을 준 사람:',thanksPost:'— 단어 자료를 만들어 줘서 정말 고마워요!',
 how1:'한국어 단어를 보고 네 개의 보기에서 튀르키예어 뜻을 골라요.',how2:'맞히면 짝꿍어휘 보너스에 도전해요. 카드 뒤집기로도 공부할 수 있어요.',how3:'맞힐 때마다 양분이 쌓여 식물 친구가 자라요.',
 namePh:'식물 친구 이름 (선택)',chromeTxt:'앱 안의 브라우저에서는 음성이 안 나올 수 있어요. Chrome에서 여는 게 좋아요.',openChrome:'Chrome에서 열기',copy:'복사',copied:'복사됨 ✓',
 rights:'All rights reserved.',biz:'비즈니스 협업',bizTitle:'비즈니스 협업 · 문의',bizText:'기관·기업 협업, 교육·콘텐츠 제휴는 이메일로 연락 주세요.',
 credit:'단어 자료: Aslıhan Erdoğan · 캐릭터 그림: 덩어리숲',
 settings:'설정',lang:'언어',roundSize:'한 판 단어 수',sound:'소리',autoOn:'단어 자동 읽기: 켜짐',autoOff:'단어 자동 읽기: 꺼짐',test:'소리 들어 보기',name:'식물 친구 이름',
 look:'꾸미기',stacheOn:'콧수염: 있음',stacheOff:'콧수염: 없음',
 reset:'기록 초기화',resetSure:'정말요? 한 번 더 누르세요',msg:'메시지',quit:'그만하기',listen:'듣기',
 lvUp:'레벨 업!',lvSub:n=>`이제 Lv.${n}`,great:'좋아요!',
 pickFam:'Lv.3 · 어떤 식물로 자랄까요?',pickFamSub:'식물 친구의 계열을 골라요. 나중에 바꿀 수 없어요.',
 pickRoute:'Lv.10 · 진화할 시간!',pickRouteSub:'어떤 길로 자랄까요?',pickBranch:'Lv.15 · 신기한 변신!',pickBranchSub:'두 갈래 중 하나를 골라요.',
 xpLeft:(a,b)=>`${a} / ${b} 양분`,
 seed:'마음씨',sprout:'마음싹',growing:x=>'쑥쑥 자라는 '+x,magic:x=>'신비한 '+x,legend:x=>'전설의 '+x,
 nextGoal:L=>L<3?'Lv.3에 식물 계열을 골라요':L<10?'Lv.10에 진화해요':L<15?'Lv.15에 신기한 변신':L<20?'Lv.20에 전설의 모습':'가장 높은 모습이에요!',
 fam:{petal:'마음꽃',mushroom:'마음송이',succulent:'마음담이',clover:'마음잎',berry:'마음열매',tree:'마음나무'},
 route:{},
 way:'갈래'}
};
TX.ko.route=Object.fromEntries(Object.values(CH.GROWTH).flatMap(g=>g.routes.map(r=>[r.id,r.final])));
let S={lang:'tr',xp:0,level:1,name:'',pet:'',route:'',branch:'',mem:{},retry:[],lv:LEVELS[0].id,unit:'all',timer:true,size:10,auto:true,best:0,stache:true};
try{Object.assign(S,JSON.parse(localStorage.getItem('deongeoriForestTR2')||'{}'))}catch(e){}
S.retry=S.retry.filter(id=>BYID.has(id));if(!LEVELS.some(L=>L.id===S.lv))S.lv=LEVELS[0].id;
const save=()=>{try{localStorage.setItem('deongeoriForestTR2',JSON.stringify(S))}catch(e){}};
const t=(k,...a)=>{const v=TX[S.lang][k];return typeof v==='function'?v(...a):v};

function applyLang(){
 document.documentElement.lang=S.lang;
 document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
 document.querySelectorAll('[data-al]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.al)));
 document.querySelectorAll('[data-ph]').forEach(el=>el.placeholder=t(el.dataset.ph));
 document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===S.lang));
 document.querySelectorAll('.copy').forEach(el=>el.textContent=`© 2026 ${OWNER} · ${t('rights')}`);
 document.querySelectorAll('.bizline').forEach(el=>{el.innerHTML='';if(CONTACT){el.append(document.createElement('br'),`${t('biz')}: `);const a=document.createElement('a');a.href='mailto:'+CONTACT;a.textContent=CONTACT;el.append(a)}});
 $('bizBox').hidden=!CONTACT;if(CONTACT){$('bizMail').href='mailto:'+CONTACT;$('bizMail').textContent=CONTACT}
 renderHome();renderSettings();
 if(state&&!$('game').hidden){renderQuestionText();if(!$('fb').hidden)renderFeedback()}
 if(deck&&!$('cards').hidden)renderCard();
 if(!$('result').hidden)renderResult();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(b){S.lang=b.dataset.lang;save();applyLang()}});

// ---------- seviye ----------
const xpStart=L=>{const n=L-1;return Math.round(.4*(100*n+25*n*(n-1)+10*n*(n-1)*(2*n-1)/6))};
const levelOf=xp=>{let L=1;while(xp>=xpStart(L+1))L++;return L};
function growthName(L=S.level){
 if(L===1)return t('seed');if(L===2||!S.pet)return t('sprout');
 const fam=TX[S.lang].fam[S.pet];
 if(L>=10&&S.route){const r=TX[S.lang].route[S.route];return L>=20&&S.branch?t('legend',r):L>=15&&S.branch?t('magic',r):r}
 return L>=4?t('growing',fam):fam;
}
function art(L=S.level,pet=S.pet,route=S.route,branch=S.branch){
 const p=pet||'',r=L>=10?route||null:null,b=L>=15?branch||null:null;
 CH.setProfile({routes:p&&r?{[p]:r}:{},branches:p&&b?{[p]:b}:{}});
 const lv=!p&&L>=3?2:(L>=10&&!r?9:(L>=15&&!b?14:L));
 const svg=CH.creatureSVG(p||'tree',r,lv,undefined,false,b||null);
 if(!S.stache)return svg;
 const g=CH.plantGeometry(p||'tree',r,lv,b||null),[fx,fy]=g.face,k=g.form?(g.form.fs||1):1;
 return svg.replace('<g class="expression-normal">',stache(fx,fy,k)+'<g class="expression-normal">');
}
// büyük bıyık
function stache(x,y,k){
 const m=(sx)=>{const X=d=>x+sx*d*1.15*k,Y=d=>y+(d+4)*k;
  return `M${X(0)} ${Y(5)}C${X(5)} ${Y(1)} ${X(13)} ${Y(1)} ${X(19)} ${Y(5)}C${X(23)} ${Y(8)} ${X(27)} ${Y(8)} ${X(29)} ${Y(3)}C${X(31)} ${Y(9)} ${X(27)} ${Y(15)} ${X(19)} ${Y(14)}C${X(12)} ${Y(13)} ${X(5)} ${Y(11)} ${X(0)} ${Y(10)}Z`};
 return `<g class="stache"><path d="${m(-1)}${m(1)}" fill="#3a2a1f" stroke="#2a1d14" stroke-width="${.8*k}" stroke-linejoin="round"/><path d="M${x-17*k} ${y+9.5*k}Q${x-9*k} ${y+7.5*k} ${x-2*k} ${y+10*k}M${x+17*k} ${y+9.5*k}Q${x+9*k} ${y+7.5*k} ${x+2*k} ${y+10*k}" fill="none" stroke="#6b5140" stroke-width="${1.2*k}" stroke-linecap="round" opacity=".8"/></g>`;
}

const displayName=()=>S.name||growthName();

// ---------- İstanbul manzarası ----------
function sceneSVG(){
 const mina=(x,top,base=228,w=5)=>`<rect x="${x-w/2}" y="${top}" width="${w}" height="${base-top}"/><path d="M${x-w/2-1} ${top}L${x} ${top-16}L${x+w/2+1} ${top}Z"/><rect x="${x-w/2-2}" y="${top+14}" width="${w+4}" height="3"/><rect x="${x-w/2-2}" y="${top+34}" width="${w+4}" height="3"/>`;
 const dome=(cx,cy,rx,ry)=>`<path d="M${cx-rx} ${cy}A${rx} ${ry} 0 0 1 ${cx+rx} ${cy}Z"/><rect x="${cx-.8}" y="${cy-ry-9}" width="1.6" height="9"/>`;
 const bal=(x,y,s,a,b)=>`<g class="bal"><g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -26C-17 -26 -21 -10 -15 0L-5 14H5L15 0C21 -10 17 -26 0 -26Z" fill="${a}"/><path d="M0 -26C-6 -26 -8 -10 -5 0L-2 14H2L5 0C8 -10 6 -26 0 -26Z" fill="${b}"/><path d="M-5 14L-4 20M5 14L4 20" stroke="#7a5a3a" stroke-width="1"/><rect x="-4" y="20" width="8" height="6" rx="1" fill="#8a6142"/></g></g>`;
 const tulip=(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V-22" stroke="#4f7d3a" stroke-width="2.4"/><path d="M0 -6Q-9 -10 -10 -20Q-3 -16 0 -8Z" fill="#6f9e57"/><path d="M-7 -30Q-8 -20 0 -18Q8 -20 7 -30L3.5 -26L0 -32L-3.5 -26Z" fill="${c}"/></g>`;
 let houses='';for(let i=0;i<18;i++){const x=i*23-4,h=8+((i*37)%11);houses+=`<rect x="${x}" y="${228-h}" width="20" height="${h}"/>`}
 return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
 <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3c9a6"/><stop offset=".55" stop-color="#fbe3c4"/><stop offset="1" stop-color="#fdf0dc"/></linearGradient>
 <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc7cc"/><stop offset="1" stop-color="#7fb0b8"/></linearGradient></defs>
 <rect width="400" height="300" fill="url(#sky)"/>
 <circle cx="300" cy="150" r="34" fill="#fff4dc" opacity=".9"/><circle cx="300" cy="150" r="54" fill="#fff4dc" opacity=".35"/>
 ${bal(112,64,1,'#d7263d','#f2b134')}${bal(292,48,.8,'#2bb3a8','#f6e7c8')}${bal(244,96,.55,'#e07a3a','#f9d38a')}${bal(30,90,.7,'#7b4bb7','#f6e7c8')}${bal(372,96,.7,'#d7263d','#fff')}
 <g fill="#c7a99f" opacity=".75">${houses}</g>
 <g fill="#a98b8a">
  <rect x="150" y="196" width="100" height="32"/>${dome(200,198,40,36)}${dome(160,206,16,12)}${dome(240,206,16,12)}${dome(140,214,10,8)}${dome(260,214,10,8)}
  ${mina(126,132)}${mina(274,132)}${mina(110,150)}${mina(290,150)}
  <rect x="26" y="206" width="70" height="22"/>${dome(61,208,26,24)}${dome(36,214,9,7)}${dome(86,214,9,7)}${mina(18,160)}${mina(104,160)}
  <rect x="309" y="172" width="16" height="56"/><path d="M306 174L317 140L328 174Z"/><rect x="306" y="172" width="22" height="4"/><rect x="316.2" y="131" width="1.6" height="10"/>
 </g>
 <rect y="228" width="400" height="30" fill="url(#sea)"/>
 <path d="M20 236h40M120 242h60M240 236h30M300 246h70M60 250h40" stroke="#e6f2f0" stroke-width="2" stroke-linecap="round" opacity=".8"/>
 <g class="ferry"><path d="M0 238h34l-4 7H4Z" fill="#fff"/><rect x="8" y="231" width="18" height="7" fill="#fff"/><rect x="14" y="226" width="4" height="5" fill="#d7263d"/></g>
 <path d="M-10 300V262Q80 246 200 250Q320 246 410 262V300Z" fill="#b9cf98"/>
 <path d="M-10 300V276Q100 262 200 266Q300 262 410 276V300Z" fill="#a6c283"/>
 ${tulip(28,282,1,'#d7263d')}${tulip(372,284,1,'#d7263d')}${tulip(90,284,1,'#d7263d')}${tulip(106,291,.8,'#ef7aa0')}${tulip(80,294,.7,'#f2b134')}${tulip(310,284,1,'#ef7aa0')}${tulip(294,291,.8,'#d7263d')}${tulip(322,294,.7,'#f2b134')}
 </svg>`;
}

$('scene').innerHTML=sceneSVG();

// ---------- ana sayfa ----------
const curLevel=()=>lvById(S.lv);
function pool(){const L=curLevel();return S.unit==='all'?L.words:(L.units.find(u=>u.key===S.unit)||{words:L.words}).words}
function renderHome(){
 const L=S.level,a=xpStart(L),b=xpStart(L+1);
 $('mascot').innerHTML=art();
 $('cName').textContent=displayName();
 $('cLv').textContent='Lv.'+L;
 $('cGrowth').textContent=(S.name?growthName()+' · ':'')+t('nextGoal',L);
 $('xpText').textContent=t('xpLeft',S.xp-a,b-a);
 $('xpBar').style.width=Math.min(100,(S.xp-a)/(b-a)*100)+'%';
 const lw=curLevel().words;
 $('stLearn').textContent=`${lw.filter(w=>(S.mem[w.id]||{}).c>0).length}/${lw.length}`;
 $('stRev').textContent=S.retry.length;$('stBest').textContent=S.best;
 $('selLv').innerHTML=LEVELS.map(L=>`<option value="${esc(L.id)}"${L.id===S.lv?' selected':''}>${esc(S.lang==='ko'&&L.nameKo?L.nameKo:L.name)} · ${L.words.length}</option>`).join('');
 const units=curLevel().units;if(S.unit!=='all'&&!units.some(u=>u.key===S.unit))S.unit='all';
 $('selUnit').innerHTML=`<option value="all">${esc(t('allUnits'))}</option>`+units.map(u=>`<option value="${esc(u.key)}"${u.key===S.unit?' selected':''}>${esc(t('unitN',u.key))} · ${u.words.length}</option>`).join('');
 $('bStart').textContent=t('quiz')+' →';$('bCards').textContent=t('cards');
 $('bReview').textContent=t('review',S.retry.length);$('bReview').disabled=!S.retry.length;
}
$('selLv').onchange=e=>{S.lv=e.target.value;S.unit='all';save();renderHome()};
$('selUnit').onchange=e=>{S.unit=e.target.value;save();renderHome()};

// ---------- seçenekler: aynı bölüm, aynı tür, birbirine yakın ----------
function rankCands(e,list){
 const sc=x=>(x.verb!==e.verb?100:0)+(x.unit!==e.unit?10+Math.min(Math.abs(x.ui-e.ui),20):0)+(x.lv!==e.lv?50:0)+Math.random()*3;
 return list.map(x=>[sc(x),x]).sort((a,b)=>a[0]-b[0]).map(a=>a[1]);
}
function optionsFor(e){
 let cand;
 if(e.parent){const w=e.parent,L=lvById(w.lv);
  const sib=shuffle(w.pairs.filter(p=>p!==e));
  const near=rankCands({...w,verb:e.verb},L.words.filter(x=>x!==w&&x.pairs.length));
  const others=near.flatMap(x=>{const ps=shuffle(x.pairs.slice());return ps.filter(p=>p.verb===e.verb).concat(ps.filter(p=>p.verb!==e.verb)).slice(0,1)});
  cand=[...sib,...others];
 }else{const L=lvById(e.lv);cand=rankCands(e,L.words.filter(x=>x!==e&&x.ko!==e.ko))}
 const wrong=[];
 for(const c of cand){if(clash(c.tr,e.tr)||wrong.some(w=>clash(w.tr,c.tr))||c.ko===e.ko)continue;wrong.push(c);if(wrong.length===3)break}
 return shuffle([e,...wrong]);
}

// ---------- test ----------
let state=null,deck=null,timer=null;
const SECONDS=12,BONUS_EXTRA=2,BASE=5,BONUS=3,STREAK_EVERY=5,STREAK_XP=3;
function show(id){['home','game','cards','result'].forEach(s=>$(s).hidden=s!==id)}
function buildQueue(){
 const score=w=>{const m=S.mem[w.id];return (m?m.c*2-m.w:-1)+Math.random()*1.5};
 return pool().slice().sort((x,y)=>score(x)-score(y)).slice(0,S.size);
}
function start(kind,items){
 const queue=items||(kind==='review'?shuffle(S.retry.map(id=>BYID.get(id)).filter(Boolean)).slice(0,20):buildQueue());
 if(!queue.length)return;
 state={kind,queue,index:0,phase:'q',bonus:false,entry:null,options:[],correct:0,answered:0,xp:0,streak:0,bestStreak:0,mistakes:new Map(),offerBonus:false,chosen:null};
 deck=null;show('game');ask(false);
}
const sayText=e=>e.hanja?(e.ko.match(/\((.+?)\)/)||[,e.ko])[1]:e.ko;
function ask(bonus){
 clearInterval(timer);
 const item=state.queue[state.index];
 state.bonus=bonus;state.phase='q';state.chosen=null;
 state.entry=bonus?shuffle(item.pairs.slice())[0]:item;
 state.options=optionsFor(state.entry);
 $('fb').hidden=true;
 renderQuestionText();
 $('answers').innerHTML=state.options.map((o,i)=>`<button class="answer" data-o="${esc(o.id)}"><span class="n">${i+1}</span><span>${esc(o.tr)}</span></button>`).join('');
 $('qMini').innerHTML=art();
 const secs=SECONDS+(bonus?BONUS_EXTRA:0);
 $('tLine').hidden=!S.timer;state.secs=secs;
 if(S.timer){state.deadline=performance.now()+secs*1000;tick();timer=setInterval(tick,100)}else $('gTime').textContent='';
 if(S.auto)speak(sayText(state.entry));
 $('answers').querySelector('button').focus({preventScroll:true});
}
function renderQuestionText(){
 const e=state.entry,item=state.queue[state.index],m=S.mem[item.id];
 $('gCount').textContent=`${state.index+1} / ${state.queue.length}`;
 $('gXp').textContent=`+${state.xp} ${t('nutrient').toLowerCase()}`;
 $('gProg').style.width=(state.index/state.queue.length*100)+'%';
 $('gMode').textContent=S.timer?t('modeTimed'):t('modeFree');
 const k=$('qKind'),lvName=lvById((item.parent||item).lv).name;
 if(state.bonus){k.textContent=t('kBonus');k.className='qkind bonus'}
 else if(item.parent){k.textContent=t('kPairRev');k.className='qkind rev'}
 else if(state.kind==='review'){k.textContent=t('kRev')+' · '+lvName;k.className='qkind rev'}
 else{k.textContent=(m?t('kBase'):t('kNew'))+' · '+lvName;k.className='qkind'}
 $('qIns').textContent=e.parent?t('qPair'):e.hanja?t('qHanja'):t('qWord');
 $('qWord').textContent=e.ko;$('qWord').classList.toggle('long',e.ko.length>6);
}
function tick(){
 if(!state||state.phase!=='q'||!$('mLv').hidden)return;
 const left=Math.max(0,(state.deadline-performance.now())/1000);
 $('gTimer').style.width=(left/state.secs*100)+'%';
 $('gTime').textContent=t('sec',left.toFixed(1));
 $('tLine').classList.toggle('urgent',left<=3);$('gTime').classList.toggle('urgent',left<=3);
 if(left<=0)answer(null);
}
function addRetry(id){if(!S.retry.includes(id))S.retry=[...S.retry,id].slice(-200)}
function gain(n){const before=S.level;S.xp+=n;S.level=Math.max(S.level,levelOf(S.xp));save();if(S.level>before)setTimeout(levelUp,350)}
function answer(id){
 if(!state||state.phase!=='q')return;
 clearInterval(timer);state.phase='fb';
 const e=state.entry,item=state.queue[state.index],bonus=state.bonus,correct=id===e.id;
 state.chosen=id&&!correct?state.options.find(o=>o.id===id):null;state.timeout=id===null;
 document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;const o=b.dataset.o;b.classList.add(o===e.id?'ok':o===id?'no':'dim')});
 if(!bonus){
  state.answered++;
  const m=S.mem[item.id]||(S.mem[item.id]={c:0,w:0});
  if(correct){m.c++;state.correct++}else m.w++;
  if(correct&&state.kind==='review')S.retry=S.retry.filter(x=>x!==item.id);
 }
 if(!correct){state.mistakes.set(e.id,e);addRetry(e.id)}
 else if(bonus)S.retry=S.retry.filter(x=>x!==e.id);
 let g=0,sb=0;
 if(!bonus){state.streak=correct?state.streak+1:0;state.bestStreak=Math.max(state.bestStreak,state.streak);S.best=Math.max(S.best,state.streak);
  if(correct&&state.streak%STREAK_EVERY===0)sb=STREAK_XP}
 if(correct)g=(bonus?BONUS:BASE)+sb;
 state.gain=g;state.sb=sb;state.correctNow=correct;state.xp+=g;
 state.offerBonus=!bonus&&correct&&!item.parent&&item.pairs.length>0;
 if(correct){$('qMini').classList.add('happy');setTimeout(()=>$('qMini').classList.remove('happy'),1500)}
 renderFeedback();$('fb').hidden=false;$('fNext').focus({preventScroll:true});
 gain(g);
}
function renderFeedback(){
 const e=state.entry,correct=state.correctNow;
 $('fIcon').textContent=correct?'✓':state.timeout?'◷':'↻';$('fIcon').className='ficon'+(correct?'':' no');
 $('fTitle').textContent=correct?(state.sb?t('streakT',state.streak):t('right')):state.timeout?t('timeup'):t('wrong');
 $('fReward').textContent=correct?t('plus',state.gain,state.sb):state.bonus?t('bonusFree'):t('willRepeat');
 $('fWord').textContent=e.ko;$('fMean').textContent=e.tr;
 const w=e.parent||e;
 $('fPairs').innerHTML=(!state.offerBonus?w.pairs:[]).map(p=>`<span>${esc(p.ko)} · ${esc(p.tr)}</span>`).join('');
 $('fMine').hidden=!state.chosen;if(state.chosen)$('fMine').textContent=t('mine')+state.chosen.tr;
 $('fNote').textContent=state.offerBonus?t('askBonus'):correct?t('sayIt'):'';
 const last=state.index===state.queue.length-1;
 $('fNext').textContent=state.offerBonus?t('bonusBtn'):last?t('seeRes'):t('next');
 $('fSkip').hidden=!state.offerBonus;$('fSkip').textContent=last?t('seeRes'):t('skip');
}
function advance(){if(state.index>=state.queue.length-1){finish();return}state.index++;ask(false)}
$('answers').addEventListener('click',e=>{const b=e.target.closest('.answer');if(b)answer(b.dataset.o)});
$('fNext').onclick=()=>{if(state.offerBonus){state.offerBonus=false;ask(true)}else advance()};
$('fSkip').onclick=()=>advance();
$('qSay').onclick=()=>speak(sayText(state.entry),true);
$('fSay').onclick=()=>speak(sayText(state.entry),true);
$('bQuit').onclick=()=>{clearInterval(timer);if(state.answered)finish();else{state=null;show('home');renderHome()}};

// ---------- kartlar (çevirmeli) ----------
function startCards(items){
 const list=items||buildQueue();if(!list.length)return;
 state=null;deck={list:list.slice(),i:0,known:0,unknown:new Map(),xp:0,again:new Set()};
 show('cards');renderCard();
}
function renderCard(){
 const w=deck.list[deck.i];$('flip').classList.remove('on');
 $('cCount').textContent=`${deck.i+1} / ${deck.list.length}`;$('cKnown').textContent=t('knownN',deck.known);
 $('cProg').style.width=(deck.i/deck.list.length*100)+'%';
 const base=w.parent||w;
 $('cUnit').textContent=w.parent?t('kPairRev'):`${lvById(base.lv).name} · ${t('unitN',base.unit)}`;
 $('cFront').textContent=w.ko;$('cFront').classList.toggle('long',w.ko.length>6);
 $('cBackKo').innerHTML=`<span>${esc(w.ko)}</span><button class="say sm" data-say="${esc(w.id)}" aria-label="${esc(t('listen'))}">${SPK}</button>`;
 $('cBackTr').textContent=w.tr;
 $('cPairs').innerHTML=(w.pairs||[]).map(p=>`<li><div><b>${esc(p.ko)}</b><span>${esc(p.tr)}</span></div><button class="say sm" data-say="${esc(p.id)}" aria-label="${esc(t('listen'))}">${SPK}</button></li>`).join('');
 $('kNo').textContent=t('kNoBtn');$('kYes').textContent=t('kYesBtn');
 if(S.auto)speak(sayText(w));
}
$('flip').addEventListener('click',e=>{const s=e.target.closest('[data-say]');if(s){e.stopPropagation();speak(sayText(BYID.get(s.dataset.say)),true);return}$('flip').classList.toggle('on')});
function cardAnswer(knew){
 if(!deck||$('cards').hidden)return;const w=deck.list[deck.i];
 const m=S.mem[w.id]||(S.mem[w.id]={c:0,w:0});
 if(knew){m.c++;deck.known++;deck.xp+=1;S.retry=S.retry.filter(x=>x!==w.id);gain(1)}
 else{m.w++;deck.unknown.set(w.id,w);addRetry(w.id);if(!deck.again.has(w.id)){deck.again.add(w.id);deck.list.push(w)}save()}
 if(deck.i>=deck.list.length-1){finishCards();return}
 deck.i++;renderCard();
}
$('kNo').onclick=()=>cardAnswer(false);$('kYes').onclick=()=>cardAnswer(true);
$('cQuit').onclick=()=>{if(deck.i)finishCards();else{deck=null;show('home');renderHome()}};
function finishCards(){save();show('result');renderResult()}
{let sx=null;$('flip').addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
 $('flip').addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>70){e.preventDefault();cardAnswer(dx>0)}})}

// ---------- sonuç ----------
function finish(){clearInterval(timer);state.phase='done';save();show('result');renderResult()}
let lastList=[];
function renderResult(){
 $('rMini').innerHTML=art();
 if(deck){$('rTitle').textContent=t('cardRes');$('rSub').textContent=t('cardSub',deck.known,deck.list.length);
  $('rCorrect').textContent=deck.known;$('rL1').textContent=t('known');$('rXp').textContent='+'+deck.xp;$('rStreak').textContent=deck.unknown.size;$('rL3').textContent=t('unknown');lastList=[...deck.unknown.values()]}
 else{$('rTitle').textContent=t('resTitle');$('rSub').textContent=t('resSub',state.correct,state.answered);
  $('rCorrect').textContent=state.correct;$('rL1').textContent=t('correct');$('rXp').textContent='+'+state.xp;$('rStreak').textContent=state.bestStreak;$('rL3').textContent=t('streak');lastList=[...state.mistakes.values()]}
 $('rList').innerHTML=lastList.length?lastList.map(e=>`<div class="ritem"><div><strong>${esc(e.ko)}</strong><small>${esc(e.tr)}</small></div><button class="say sm" data-s="${esc(e.id)}" aria-label="${esc(t('listen'))}">${SPK}</button></div>`).join(''):`<div class="empty">${esc(t('noMistake'))}</div>`;
 $('rHome').textContent=t('home');$('rRetry').textContent=t('retryWrong');$('rRetry').disabled=!lastList.length;
}
$('rList').addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(b)speak(sayText(BYID.get(b.dataset.s)),true)});
$('rHome').onclick=()=>{state=null;deck=null;show('home');renderHome()};
$('rRetry').onclick=()=>{const list=shuffle(lastList.slice());if(deck)startCards(list);else start('review',list)};
$('bStart').onclick=()=>start('normal');
$('bCards').onclick=()=>startCards();
$('bReview').onclick=()=>start('review');

document.addEventListener('keydown',e=>{
 if(!$('mLv').hidden||!$('mSet').hidden||!$('mWel').hidden)return;
 if(state&&!$('game').hidden){
  if(state.phase==='q'&&/^[1-4]$/.test(e.key))answer(state.options[+e.key-1].id);
  else if(state.phase==='fb'&&e.key==='Enter'&&document.activeElement.tagName!=='BUTTON')$('fNext').click();
 }else if(deck&&!$('cards').hidden){
  if(e.key===' '||e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();$('flip').classList.toggle('on')}
  else if(e.key==='ArrowLeft')cardAnswer(false);else if(e.key==='ArrowRight')cardAnswer(true);
 }
});

// ---------- seviye atlama / evrim ----------
function levelUp(){
 const L=S.level;const box=$('lvBody');$('mLv').hidden=false;
 const need=L>=3&&!S.pet?'fam':L>=10&&!S.route?'route':L>=15&&!S.branch?'branch':null;
 if(need==='fam'){
  $('lvTitle').textContent=t('pickFam');$('lvSub').textContent=t('pickFamSub');
  box.innerHTML=`<div class="choice c3">${Object.keys(CH.GROWTH).map(p=>`<button class="pick" data-pet="${p}">${art(3,p,'','')}<span>${esc(TX[S.lang].fam[p])}</span></button>`).join('')}</div>`;
 }else if(need==='route'){
  $('lvTitle').textContent=t('pickRoute');$('lvSub').textContent=t('pickRouteSub');
  box.innerHTML=`<div class="choice c3">${CH.GROWTH[S.pet].routes.map(r=>`<button class="pick" data-route="${r.id}">${art(10,S.pet,r.id,'')}<span>${esc(TX[S.lang].route[r.id])}</span></button>`).join('')}</div>`;
 }else if(need==='branch'){
  $('lvTitle').textContent=t('pickBranch');$('lvSub').textContent=t('pickBranchSub');
  const r=CH.GROWTH[S.pet].routes.find(x=>x.id===S.route);
  box.innerHTML=`<div class="choice c2">${r.branches.map((b,i)=>`<button class="pick" data-branch="${b.id}">${art(15,S.pet,S.route,b.id)}<span>${esc(t('way'))} ${i+1}</span></button>`).join('')}</div>`;
 }else{
  $('lvTitle').textContent=t('lvUp');$('lvSub').textContent=t('lvSub',L);
  box.innerHTML=`<div class="rmini">${art()}</div><p style="font-weight:800;margin:4px 0 0">${esc(growthName())}</p><button class="primary" id="lvOk" style="margin-top:12px">${esc(t('great'))}</button>`;
  $('lvOk').onclick=closeLv;
 }
}
function closeLv(){$('mLv').hidden=true;renderHome();if(state&&state.phase==='q'&&S.timer)state.deadline=performance.now()+state.secs*1000}
$('lvBody').addEventListener('click',e=>{const b=e.target.closest('.pick');if(!b)return;
 if(b.dataset.pet)S.pet=b.dataset.pet;if(b.dataset.route)S.route=b.dataset.route;if(b.dataset.branch)S.branch=b.dataset.branch;save();
 const L=S.level;if((L>=3&&!S.pet)||(L>=10&&!S.route)||(L>=15&&!S.branch))levelUp();else closeLv();
});

// ---------- ayarlar ----------
function renderSettings(){
 $('sizeChips').innerHTML=[10,20,30].map(n=>`<button class="chip" data-size="${n}" aria-pressed="${n===S.size}">${n}</button>`).join('');
 $('bTimer').textContent=S.timer?t('timerOn'):t('timerOff');$('bTimer').setAttribute('aria-pressed',S.timer);
 $('bAuto').textContent=S.auto?t('autoOn'):t('autoOff');$('bAuto').setAttribute('aria-pressed',S.auto);
 $('bStache').textContent=S.stache?t('stacheOn'):t('stacheOff');$('bStache').setAttribute('aria-pressed',S.stache);
 $('nameSet').value=S.name;$('bReset').textContent=t('reset');
}
$('sizeChips').addEventListener('click',e=>{const b=e.target.closest('[data-size]');if(b){S.size=+b.dataset.size;save();renderSettings()}});
$('bTimer').onclick=()=>{S.timer=!S.timer;save();renderSettings()};
$('bStache').onclick=()=>{S.stache=!S.stache;save();renderSettings();renderHome()};
$('bAuto').onclick=()=>{S.auto=!S.auto;save();renderSettings()};
$('bTest').onclick=()=>speak('안녕하세요. 토픽 합격을 응원해요!',true);
$('nameSet').addEventListener('input',e=>{S.name=e.target.value.trim();save();renderHome()});
$('bSet').onclick=()=>{renderSettings();$('mSet').hidden=false};
$('bSetOk').onclick=()=>{$('mSet').hidden=true};
$('copyMail').onclick=async()=>{try{await navigator.clipboard.writeText(CONTACT);$('copyMail').textContent=t('copied')}catch(e){}};
let resetArm=false;
$('bReset').onclick=()=>{if(!resetArm){resetArm=true;$('bReset').textContent=t('resetSure');setTimeout(()=>{resetArm=false;$('bReset').textContent=t('reset')},3000);return}
 Object.assign(S,{xp:0,level:1,pet:'',route:'',branch:'',mem:{},retry:[],best:0});save();resetArm=false;$('mSet').hidden=true;renderHome()};

// ---------- hoş geldin ----------
$('bMsg').onclick=()=>{$('nameIn').value=S.name;$('mWel').hidden=false};
$('bWel').onclick=()=>{const n=$('nameIn').value.trim();if(n)S.name=n;save();$('mWel').hidden=true;renderHome();
 $('mascot').className='mascot hop';setTimeout(()=>$('mascot').className='mascot',1200);speak('안녕하세요! 같이 공부해요.')};

// ---------- ses (kadın sesi öncelikli) ----------
let voice=null;
const FEMALE=/yuna|sora|sunhi|heami|jimin|seoyeon|female|여성|google 한국의|standard-a|wavenet-a|neural2-a/i;
const MALE=/injoon|minsu|hyunsu|bongjin|gookmin|\bmale\b|남성/i;
function pickVoice(){try{const vs=speechSynthesis.getVoices().filter(v=>/^ko/i.test(v.lang));
 voice=vs.find(v=>FEMALE.test(v.name))||vs.find(v=>!MALE.test(v.name))||vs[0]||null}catch(e){}}
try{pickVoice();speechSynthesis.onvoiceschanged=pickVoice}catch(e){}
function speak(text,force){
 if(!S.auto&&!force)return;
 try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';if(voice)u.voice=voice;
  u.rate=.9;u.pitch=voice&&FEMALE.test(voice.name)?1:1.15;speechSynthesis.speak(u)}catch(e){}
}

// ---------- uygulama içi tarayıcı → Chrome ----------
const URL0='https://jindam1799.github.io/korece_Turkce_TOPIK/';
const ua=navigator.userAgent||'';
const inApp=/KAKAOTALK|Instagram|FBAN|FBAV|FB_IAB|Line\/|NAVER|DaumApps|everytimeApp|Twitter|Snapchat|TikTok|musical_ly|WhatsApp|Telegram|; wv\)/i.test(ua);
const isAndroid=/Android/i.test(ua),isIOS=/iPhone|iPad|iPod/i.test(ua);
const bare=URL0.replace(/^https?:\/\//,'');
$('openChrome').href=/KAKAOTALK/i.test(ua)?'kakaotalk://web/openExternal?url='+encodeURIComponent(URL0)
 :isAndroid?'intent://'+bare+'#Intent;scheme=https;package=com.android.chrome;end'
 :isIOS?'googlechromes://'+bare:URL0;
$('chrome').hidden=!(inApp&&(isAndroid||isIOS));
$('copyLink').onclick=async()=>{try{await navigator.clipboard.writeText(URL0);$('copyLink').textContent=t('copied')}catch(e){$('copyLink').textContent=URL0}};

// ---------- başlat ----------
S.level=Math.max(S.level,levelOf(S.xp));
applyLang();
$('mWel').hidden=false;$('nameIn').value=S.name;
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
}
