/* 덩어리숲 · Korece Kelime Ormanı — © 2026 Wonju (원주). Tüm hakları saklıdır. */
{
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const SPK='<svg class="spk" viewBox="0 0 24 24" aria-hidden="true"><path class="sb" d="M3.4 9.3c0-.8.6-1.4 1.4-1.4h2.6l4.5-3.5c.9-.7 2.1-.1 2.1 1v13.2c0 1.1-1.2 1.7-2.1 1l-4.5-3.5H4.8c-.8 0-1.4-.6-1.4-1.4z" fill="currentColor"/><path d="M6.2 10.3h1.6" stroke="#fff" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round"/><path class="w1" d="M16.7 9.3c1.5 1.5 1.5 3.9 0 5.4" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/><path class="w2" d="M19.3 6.7c2.9 2.9 2.9 7.7 0 10.6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
const CH=window.FOREST_CHAR;
const CFG=window.SITE_CONFIG||{};
const OWNER=CFG.owner||'Wonju Kim (원주)';
const CONTACT=(CFG.contact||'').trim(),KAKAO=(CFG.kakao||'').trim(),KAKAO_OPEN=(CFG.kakaoOpen||'').trim(),ASLI_YT=(CFG.asliYoutube||'').trim(),INSTA=(CFG.instagram||'').trim().replace(/^@/,'');

// ---------- kelimeler ----------
const isVerb=tr=>/m[ae]k(\b|\s|\)|,|$)/i.test(tr);
const LEVELS=(window.LEVELS||[]).map(L=>{
 const units=[],words=[],seenKo={};let unit=null,n=0;
 for(const raw of L.text.split('\n')){
  const line=raw.trim();if(!line)continue;
  if(line.startsWith('#')){unit={key:line.slice(1).trim(),words:[]};units.push(unit);continue}
  let [ko,tr,ps='',note='']=line.split('|').map(x=>x.trim());if(!ko||!tr)continue;
  if(!unit){unit={key:'1',words:[]};units.push(unit)}
  let id;const mx=ko.match(/^(.+)#(\d+)$/);
  if(mx){ko=mx[1];id=L.id+':'+ko+'#'+mx[2]}else{const base=L.id+':'+ko;seenKo[base]=(seenKo[base]||0)+1;id=seenKo[base]>1?base+'#'+seenKo[base]:base}n++;
  const w={id,ko,tr,lv:L.id,unit:unit.key,ui:units.length-1,verb:isVerb(tr),hanja:!!L.hanja,note,pairs:[]};
  w.pairs=ps.split(';').map(x=>x.trim()).filter(Boolean).map((p,j)=>{const k=p.indexOf('=');const pt=p.slice(k+1).trim();return {id:id+'~'+j,ko:p.slice(0,k).trim(),tr:pt,parent:w,verb:isVerb(pt)}}).filter(p=>p.ko&&p.tr);
  unit.words.push(w);words.push(w);
 }
 return {...L,units,words};
}).filter(L=>L.words.length);
// B1.1–B2.2 tek seviyede (kelime kimlikleri değişmez: ilerleme ve kontrol kayıtları korunur)
const GROUPS=[{id:'B1-B2',name:'B1–B2',parts:['B1.1','B1.2','B2.1','B2.2']}];
for(const G of GROUPS){const parts=G.parts.map(id=>LEVELS.find(L=>L.id===id)).filter(Boolean);if(!parts.length)continue;
 const units=[],words=[];
 // aynı konu başlıkları birleşir (kelime kimlikleri dosyada kalır), 50'den büyük konular eşit parçalara bölünür
 const byKey=new Map();parts.forEach(P=>P.units.forEach(u=>{if(!byKey.has(u.key))byKey.set(u.key,[]);byKey.get(u.key).push(...u.words)}));
 for(const [key,ws] of byKey){const n=Math.ceil(ws.length/50),size=Math.ceil(ws.length/n),cut=key.indexOf(' (');
  for(let k=0;k<n;k++){const part=ws.slice(k*size,(k+1)*size);if(!part.length)continue;
   const nk=n>1?(cut>0?key.slice(0,cut)+' '+(k+1)+key.slice(cut):key+' '+(k+1)):key;const nu={key:nk,words:part};units.push(nu);
   part.forEach(w=>{w.unit=nu.key;w.ui=units.length-1;w.grp=G.id;words.push(w)})}}
 parts.forEach(P=>LEVELS.splice(LEVELS.indexOf(P),1));LEVELS.push({id:G.id,name:G.name,units,words})}
LEVELS.forEach(L=>L.words.forEach(w=>{if(!w.grp)w.grp=L.id}));
const ORDER=['A1-A2','B1-B2','TOPIK1','TOPIK2','HANJA'];
LEVELS.sort((a,b)=>ORDER.indexOf(a.id)-ORDER.indexOf(b.id));
const ALL=LEVELS.flatMap(L=>L.words);
const lvOf=w=>(w.parent||w).grp;
const BYID=new Map();ALL.forEach(w=>{BYID.set(w.id,w);w.pairs.forEach(p=>BYID.set(p.id,p))});
const lvById=id=>LEVELS.find(L=>L.id===id)||LEVELS[0];
const norm=s=>s.toLowerCase().replace(/\(.*?\)/g,'').replace(/[^a-zçğıöşüâîû0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const clash=(a,b)=>{const x=norm(a),y=norm(b);return !x||!y||x===y||x.includes(y)||y.includes(x)};

// ---------- dil ----------
const TX={
tr:{sub:'Korece kelime ormanı · A1–B2 · TOPIK Ⅰ·Ⅱ',a2hsT:'📲 Ana ekrana ekle (uygulama gibi kullan)',igSub:'İletişim ve iş birliği',installBtn:'Ana ekrana ekle',
 and1:'Bu sayfayı Chrome\'da aç.',and2:'Sağ üstteki ⋮ menüsüne dokun.',and3:'“Ana ekrana ekle” ya da “Uygulamayı yükle”yi seç.',
 ios1:'Bu sayfayı Safari\'de aç.',ios2:'Alttaki Paylaş düğmesine (□↑) dokun.',ios3:'“Ana Ekrana Ekle”yi seç ve “Ekle”ye dokun.',feedback:'💬 덩어리숲 düzenli olarak güncellenmeye devam edecek. Çalışırken zorlandığınız bir şey ya da ihtiyacınız olan bir özellik olursa lütfen bize yazın!',rvH:'Kelime kontrolü (editör)',rvOpen:'Kontrol modunu aç',rvTitle:'Kelime kontrolü',rvSend:'Gönder',rvMean:'Türkçe anlam',rvPairs:'Eş kelimeler (Korece = Türkçe)',rvAdd:'+ Eş kelime ekle',rvNote:'Not (isteğe bağlı)',rvNotePh:'Örn. bu kelime eski, yerine … daha doğal',rvEmpty:'Bu filtrede kelime yok.',
 rvAll:'Tümü',rvTodo:'Bakılmadı',rvOkF:'Doğru',rvEditF:'Düzeltildi',rvDelF:'Kaldırılacak',rvNewF:'Yeni eklenen',rvOkBtn:'✓ Doğru',rvSaveBtn:'✓ Kaydet',rvDelBtn:'🗑 Kaldır',rvUndel:'↺ Geri al',
 rvStOk:'Doğru',rvDraft:'✎ Kaydedilmedi (taslak)',rvStEdit:'Düzeltildi',rvStDel:'Kaldırılacak',rvStat:(d,n,e,x)=>`Kontrol: ${d} / ${n} · düzeltilen ${e} · kaldırılacak ${x}`,
 rvxTitle:'Kontrolü gönder',rvxStat:(d,e,x)=>`Toplam ${d} kelimeye bakıldı · ${e} düzeltme · ${x} kaldırma`,rvxHow:'Dosyayı Wonju\'ya KakaoTalk ya da e-postayla gönder. Çalışmaların telefonda kayıtlı kalır, istediğin zaman devam edebilirsin.',rvxShare:'Paylaş (KakaoTalk, e-posta…)',rvxDown:'Dosyayı indir (.json)',rvxCsv:'Excel için indir (.csv)',rvxNoShare:'Bu tarayıcı paylaşmayı desteklemiyor; dosyayı indirip gönder.',codex:'Bitki rehberi',storyTitle:'Deongi\'nin hikâyesi',
 story1:'Deongi (덩이), Kore\'deki 덩어리숲 ormanından gelen küçük bir gönül tohumu. Bir bahar rüzgârı onu uçurup İstanbul\'a, Boğaz kıyısındaki lale bahçesine getirdi.',
 story2:'Deongi Korece kelimelerle beslenir: her doğru cevap bir damla besin. Kelime öğrendikçe filizlenir, çiçek açar ve sonunda efsanevi bir bitkiye dönüşür. Bıyığını İstanbul\'daki ilk arkadaşı Berk kardeş hediye etti!',
 pathH:'Büyüme yolu',famH:'Bitki aileleri',
 path:[['Lv.1','Gönül Tohumu','Yolculuk başlıyor. Deongi toprağa düştü.'],['Lv.2','Gönül Filizi','İlk iki yaprak çıktı!'],['Lv.3','Aile seçimi','6 bitki ailesinden birini seçersin.'],['Lv.4–9','Büyüme','Her seviyede biraz daha büyür.'],['Lv.10','Evrim','Ailenin 3 yolundan birini seçersin.'],['Lv.15','Gizemli dönüşüm','İki gizemli formdan birini seçersin.'],['Lv.20','Efsanevi form','Antik ve efsanevi bitkiye dönüşür.']],
 kakaoOpen:'Açık sohbet · 덩어리숲',famTxt:(f,mine)=>mine?`Senin ailen: ${f}`:'Başka bir aile — gölge olarak görünür.',locked:'Kilitli',lvReq:n=>`Lv.${n}\'da`,cur:'Şu an',music:'Müzik',musicOn:'Arka plan müziği: Açık',musicOff:'Arka plan müziği: Kapalı',notesH:'Güncelleme notları',notesBtn:'Neler yeni?',kakaoCopied:'Kopyalandı ✓',bizTitle:'İş birliği ve iletişim',bizText:'Kurumsal iş birliği, eğitim ve içerik ortaklığı için ulaşabilirsiniz.',myProg:'İlerleme tablom',stLearned:'Öğrenildi',stReview:'Tekrar edilecek',stNew:'Henüz çalışılmadı',learned:'Öğrenilen',toReview:'Tekrar',bestStreak:'En iyi seri',
 start:'Başla',quiz:'Test',cards:'Kartlar',review:n=>`Tekrar ${n}`,allUnits:'Tüm bölümler',unitN:k=>{const m=k.match(/^(.+) · (\d+)$/);return m?`${m[1]} · Bölüm ${m[2]}`:/^\d+$/.test(k)?`Bölüm ${k}`:k},
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
 welTitle:'덩어리숲\'a hoş geldin!',
 letter:'Sevgili Türk arkadaşlarım, Koreceyi çok çalışıp TOPIK\'i mutlaka geçmenizi ve istediğiniz her şeyi başarmanızı dilerim!',
 sig:'— Koreli arkadaşınız Wonju (원주)',
 thanksPre:'Hazırlayanlar',roleMake:'Oyun yapımı ve tasarımı',roleCheck:'Kelime listeleri, kontrol ve düzeltme',thanksPost:'Aslı\'ya emeği için çok teşekkürler! 💚',
 how1:'Korece kelimeyi gör, dört seçenekten Türkçe anlamını seç.',how2:'Doğru cevaptan sonra eş kelime bonusuna katıl. Çevirmeli kartlarla da çalışabilirsin.',how3:'Her doğru cevap besin verir; bitki arkadaşın büyür.',
 namePh:'Bitki arkadaşının adı (isteğe bağlı)',nmTitle:'Bitki arkadaşına isim ver',nmSub:'İstediğin zaman değiştirebilirsin. Boş bırakırsan adı 덩이 olur.',nmSave:'Kaydet',nmCancel:'Vazgeç',nmHint:'Dokun, isim ver!',nmEdit:'İsmi değiştir',chromeTxt:'Bir uygulamanın içindeki tarayıcıdasın. Sesli okuma için Chrome\'da açman daha iyi olur.',openChrome:'Chrome\'da aç',copy:'Kopyala',copied:'Kopyalandı ✓',
 rights:'Tüm hakları saklıdır.',biz:'İş birliği',
 credit:'Oyun yapımı ve tasarımı: Wonju Kim · Kontrol ve düzeltme: Aslıhan Erdoğan',
 settings:'Ayarlar',lang:'Dil',roundSize:'Bir turdaki kelime',sizeAll:'Tümü',sound:'Ses',sfxOn:'Efekt sesleri: Açık',sfxOff:'Efekt sesleri: Kapalı',autoOn:'Kelimeyi otomatik oku: Açık',autoOff:'Kelimeyi otomatik oku: Kapalı',test:'Sesi dene',voiceH:'Ses seçimi',vAuto:'Otomatik (kadın sesi)',vGT:'Google Çeviri sesi (kadın · internet)',vMale:'Erkek sesi',vLow1:'Biraz kalın ses',vLow2:'Kalın ses',vHQ:'gelişmiş',vHQ2:'premium',vOnline:'çevrimiçi',noVoice:'Bu tarayıcıda Korece ses bulunamadı. Chrome\'da Google 한국의 sesini kullanabilirsin.',speedH:'Okuma hızı',rSlow2:'Çok yavaş',rSlow:'Yavaş',rNorm:'Normal',name:'Bitki arkadaşının adı',
 look:'Görünüm',guideH:'Tanıtım',guideBtn:'Tanıtımı tekrar izle',stacheOn:'Bıyık: Var',stacheOff:'Bıyık: Yok',
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
ko:{sub:'한국어 단어의 숲 · A1–B2 · TOPIK Ⅰ·Ⅱ',a2hsT:'📲 홈 화면에 추가하기 (앱처럼 쓰기)',igSub:'문의 및 협업',installBtn:'홈 화면에 추가',
 and1:'이 페이지를 Chrome에서 열어요.',and2:'오른쪽 위 ⋮ 메뉴를 눌러요.',and3:'“홈 화면에 추가” 또는 “앱 설치”를 골라요.',
 ios1:'이 페이지를 Safari에서 열어요.',ios2:'아래쪽 공유 버튼(□↑)을 눌러요.',ios3:'“홈 화면에 추가”를 고르고 “추가”를 눌러요.',feedback:'💬 덩어리숲은 앞으로도 꾸준히 업데이트돼요. 공부하면서 어려운 점이나 필요한 게 있으면 언제든 건의해 주세요!',rvH:'단어 검수 (편집자)',rvOpen:'검수 모드 열기',rvTitle:'단어 검수',rvSend:'보내기',rvMean:'튀르키예어 뜻',rvPairs:'짝꿍어휘 (한국어 = 튀르키예어)',rvAdd:'+ 짝꿍어휘 추가',rvNote:'메모 (선택)',rvNotePh:'예: 이 단어는 오래된 말, … 가 더 자연스러움',rvEmpty:'이 필터에 해당하는 단어가 없어요.',
 rvAll:'전체',rvTodo:'안 본 것',rvOkF:'맞음',rvEditF:'고침',rvDelF:'뺄 것',rvNewF:'새로 추가',rvOkBtn:'✓ 맞아요',rvSaveBtn:'✓ 저장',rvDelBtn:'🗑 빼기',rvUndel:'↺ 되돌리기',
 rvStOk:'맞음',rvDraft:'✎ 아직 저장 안 됨 (임시)',rvStEdit:'고침',rvStDel:'뺄 것',rvStat:(d,n,e,x)=>`검수 ${d} / ${n} · 고침 ${e} · 뺄 것 ${x}`,
 rvxTitle:'검수 결과 보내기',rvxStat:(d,e,x)=>`모두 ${d}개 확인 · 고침 ${e} · 뺄 것 ${x}`,rvxHow:'파일을 원주에게 카카오톡이나 이메일로 보내 주세요. 작업 내용은 휴대폰에 저장돼서 언제든 이어서 할 수 있어요.',rvxShare:'공유하기 (카카오톡, 이메일…)',rvxDown:'파일 내려받기 (.json)',rvxCsv:'엑셀용 내려받기 (.csv)',rvxNoShare:'이 브라우저는 공유를 지원하지 않아요. 파일을 내려받아 보내 주세요.',codex:'식물 도감',storyTitle:'덩이의 이야기',
 story1:'덩이는 한국의 덩어리숲에서 온 작은 마음씨예요. 어느 봄바람이 덩이를 이스탄불 보스포루스 해협 옆 튤립 정원까지 데려왔어요.',
 story2:'덩이는 한국어 단어를 먹고 자라요. 정답 하나가 양분 한 방울! 단어를 익힐수록 싹이 트고 꽃이 피고, 마침내 전설의 식물이 돼요. 콧수염은 이스탄불에서 처음 사귄 친구, Berk 동생의 선물이에요!',
 pathH:'성장 단계',famH:'식물 계열',
 path:[['Lv.1','마음씨','여행이 시작돼요. 덩이가 땅에 떨어졌어요.'],['Lv.2','마음싹','첫 떡잎 두 장이 나왔어요!'],['Lv.3','계열 선택','6가지 식물 계열 중 하나를 골라요.'],['Lv.4–9','쑥쑥 성장','레벨마다 조금씩 커져요.'],['Lv.10','진화','계열마다 3가지 길 중 하나를 골라요.'],['Lv.15','신기한 변신','두 갈래 중 하나를 골라요.'],['Lv.20','전설의 모습','고대·전설의 식물로 변신해요.']],
 kakaoOpen:'오픈채팅 · 덩어리숲',famTxt:(f,mine)=>mine?`나의 계열: ${f}`:'다른 계열이에요 — 그림자로 보여요.',locked:'잠김',lvReq:n=>`Lv.${n}`,cur:'지금',music:'음악',musicOn:'배경 음악: 켜짐',musicOff:'배경 음악: 꺼짐',notesH:'업데이트 노트',notesBtn:'새로운 내용 보기',kakaoCopied:'복사됨 ✓',bizTitle:'비즈니스 협업 · 문의',bizText:'기관·기업 협업, 교육·콘텐츠 제휴는 아래로 연락 주세요.',myProg:'나의 진도표',stLearned:'익힘',stReview:'다시 볼 단어',stNew:'아직 안 함',learned:'익힌 단어',toReview:'복습',bestStreak:'최고 연속',
 start:'시작하기',quiz:'퀴즈',cards:'카드',review:n=>`복습 ${n}`,allUnits:'전체 단원',unitN:k=>{const m=k.match(/^(.+) · (\d+)$/);return m?`${m[1]} · ${m[2]}단원`:/^\d+$/.test(k)?`${k}단원`:k},
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
 welTitle:'덩어리숲에 어서 오세요!',
 letter:'튀르키예 친구들, 한국어 열심히 공부해서 꼭 토픽을 합격하고 원하는 일 모두 이루기 바랍니다!',
 sig:'— 한국 친구 원주',
 thanksPre:'만든 사람들',roleMake:'게임 제작 및 기획',roleCheck:'단어 자료 · 검수 및 교정',thanksPost:'도와준 아슬르에게 정말 고마워요! 💚',
 how1:'한국어 단어를 보고 네 개의 보기에서 튀르키예어 뜻을 골라요.',how2:'맞히면 짝꿍어휘 보너스에 도전해요. 카드 뒤집기로도 공부할 수 있어요.',how3:'맞힐 때마다 양분이 쌓여 식물 친구가 자라요.',
 namePh:'식물 친구 이름 (선택)',nmTitle:'식물 친구 이름 짓기',nmSub:'언제든지 다시 바꿀 수 있어요. 비워 두면 「덩이」가 돼요.',nmSave:'저장',nmCancel:'취소',nmHint:'눌러서 이름 짓기!',nmEdit:'이름 바꾸기',chromeTxt:'앱 안의 브라우저에서는 음성이 안 나올 수 있어요. Chrome에서 여는 게 좋아요.',openChrome:'Chrome에서 열기',copy:'복사',copied:'복사됨 ✓',
 rights:'All rights reserved.',biz:'비즈니스 협업',
 credit:'게임 제작 및 기획: Wonju Kim · 검수 및 교정: Aslıhan Erdoğan',
 settings:'설정',lang:'언어',roundSize:'한 판 단어 수',sizeAll:'전체',sound:'소리',sfxOn:'효과음: 켜짐',sfxOff:'효과음: 꺼짐',autoOn:'단어 자동 읽기: 켜짐',autoOff:'단어 자동 읽기: 꺼짐',test:'소리 들어 보기',voiceH:'목소리 선택',vAuto:'자동 (여성 목소리)',vGT:'구글 번역 목소리 (여성 · 인터넷)',vMale:'남자 목소리',vLow1:'조금 낮은 목소리',vLow2:'낮은 목소리',vHQ:'고음질',vHQ2:'프리미엄',vOnline:'온라인',noVoice:'이 브라우저에는 한국어 음성이 없어요. Chrome의 Google 한국의 음성을 쓸 수 있어요.',speedH:'읽기 속도',rSlow2:'아주 느리게',rSlow:'느리게',rNorm:'보통',name:'식물 친구 이름',
 look:'꾸미기',guideH:'소개',guideBtn:'소개 다시 보기',stacheOn:'콧수염: 있음',stacheOff:'콧수염: 없음',
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
let S={music:true,vol:45,lang:'tr',xp:0,level:1,name:'',pet:'',route:'',branch:'',mem:{},retry:[],lv:LEVELS[0].id,unit:'all',timer:true,size:10,auto:true,best:0,stache:true,voice:'',rate:1};
try{Object.assign(S,JSON.parse(localStorage.getItem('deongeoriForestTR2')||'{}'))}catch(e){}
if(S.size!==0&&S.size!==10)S.size=10;
if(/^B[12]\.[12]$/.test(S.lv)){S.lv='B1-B2';S.unit='all'}
S.retry=S.retry.filter(id=>BYID.has(id));if(!LEVELS.some(L=>L.id===S.lv))S.lv=LEVELS[0].id;
const save=()=>{try{localStorage.setItem('deongeoriForestTR2',JSON.stringify(S))}catch(e){}};
// karakterin adı: kullanıcı verdiyse o, yoksa 덩이
const PN=()=>S.name||'덩이';
function josa(n,a,b){const c=n.charCodeAt(n.length-1);if(c>=0xAC00&&c<=0xD7A3)return (c-0xAC00)%28?a:b;return /[aeıioöuüAEIİOÖUÜ]$/.test(n)?b:a}
// Türkçe/Azərbaycanca ilgi eki (ses uyumu): Fıstık'ın, Ayşe'nin, Nar-ın
function gen(n,sep){const hc=n.charCodeAt(n.length-1);if(hc>=0xAC00&&hc<=0xD7A3)return sep+((hc-0xAC00)%28?'in':'nin');const l=n.toLocaleLowerCase('tr'),vs=l.match(/[aeıioöuüə]/g),v=vs?vs[vs.length-1]:'e',x={a:'ı',ı:'ı',e:'i',i:'i',ə:'i',o:'u',u:'u',ö:'ü',ü:'ü'}[v]||'i';return sep+(/[aeıioöuüə]$/.test(l)?'n':'')+x+'n'}
function pn(v){if(!S.name)return v;if(Array.isArray(v))return v.map(pn);if(typeof v!=='string')return v;const N=S.name;
 return v.replace(/Deongi(['-])nin/g,(m,sep)=>N+gen(N,sep)).replace(/Deongi \(덩이\)/g,N).replace(/Deongi/g,N).replace(/덩이는/g,N+josa(N,'은','는')).replace(/덩이가/g,N+josa(N,'이','가')).replace(/덩이를/g,N+josa(N,'을','를')).replace(/덩이(?!어)/g,N)}
const t=(k,...a)=>{const v=TX[S.lang][k];return pn(typeof v==='function'?v(...a):v)};

function applyLang(){
 document.documentElement.lang=S.lang;
 document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
 document.querySelectorAll('[data-al]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.al)));
 document.querySelectorAll('[data-ph]').forEach(el=>el.placeholder=t(el.dataset.ph));
 document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===S.lang));
 document.querySelectorAll('.copy').forEach(el=>el.textContent=`© 2026 ${OWNER} · ${t('rights')}`);
 renderLinks();
 renderHome();renderSettings();
 if(state&&!$('game').hidden){renderQuestionText();if(!$('fb').hidden)renderFeedback()}
 if(deck&&!$('cards').hidden)renderCard();
 if(!$('result').hidden)renderResult();
 if(!$('prog').hidden)renderProg();
 if(!$('mBook').hidden)renderBook();
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
function sceneSVG(intro){
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
 ${intro?bal(84,118,.8,'#d7263d','#f2b134')+bal(312,104,.7,'#2bb3a8','#f6e7c8')+bal(250,140,.5,'#e07a3a','#f9d38a')+bal(30,130,.6,'#7b4bb7','#f6e7c8')+bal(372,132,.6,'#d7263d','#fff'):bal(112,64,1,'#d7263d','#f2b134')+bal(292,48,.8,'#2bb3a8','#f6e7c8')+bal(244,96,.55,'#e07a3a','#f9d38a')+bal(30,90,.7,'#7b4bb7','#f6e7c8')+bal(372,96,.7,'#d7263d','#fff')}
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
function renderHome(){try{npShow(npCur);renderNameTag()}catch(e){}
 const L=S.level,a=xpStart(L),b=xpStart(L+1);
 $('mascot').innerHTML=art();
 $('cName').textContent=PN();
 $('cLv').textContent='Lv.'+L;
 $('cGrowth').textContent=growthName()+' · '+t('nextGoal',L);
 $('xpText').textContent=t('xpLeft',S.xp-a,b-a);
 $('xpBar').style.width=Math.min(100,(S.xp-a)/(b-a)*100)+'%';
 const lw=curLevel().words,ln=lw.filter(w=>status(w)==='ok').length;
 $('progSmall').textContent=`${S.lang==='ko'&&curLevel().nameKo?curLevel().nameKo:curLevel().name} · ${ln} / ${lw.length}`;
 $('progBar').style.width=(ln/lw.length*100)+'%';
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
 if(e.parent){const w=e.parent,L=lvById(w.grp);
  const sib=shuffle(w.pairs.filter(p=>p!==e));
  const near=rankCands({...w,verb:e.verb},L.words.filter(x=>x!==w&&x.pairs.length));
  const others=near.flatMap(x=>{const ps=shuffle(x.pairs.slice());return ps.filter(p=>p.verb===e.verb).concat(ps.filter(p=>p.verb!==e.verb)).slice(0,1)});
  cand=[...sib,...others];
 }else{const L=lvById(e.grp);cand=rankCands(e,L.words.filter(x=>x!==e&&x.ko!==e.ko))}
 const wrong=[];
 for(const c of cand){if(clash(c.tr,e.tr)||wrong.some(w=>clash(w.tr,c.tr))||c.ko===e.ko)continue;wrong.push(c);if(wrong.length===3)break}
 return shuffle([e,...wrong]);
}

// ---------- test ----------
let state=null,deck=null,timer=null;
const SECONDS=12,BONUS_EXTRA=2,BASE=5,BONUS=3,STREAK_EVERY=5,STREAK_XP=3;
function show(id){['home','game','cards','prog','review','result'].forEach(s=>$(s).hidden=s!==id);try{BGM.study(['game','cards','review'].includes(id))}catch(e){}}
function buildQueue(){
 const score=w=>{const m=S.mem[w.id];return (m?m.c*2-m.w:-1)+Math.random()*1.5};
 // önce zayıf ve yeni kelimeler seçilir, sonra seçilen 10 kelimenin sırası tamamen karıştırılır
 return shuffle(pool().slice().sort((x,y)=>score(x)-score(y)).slice(0,S.size||Infinity));
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
 const k=$('qKind'),lvName=lvById(lvOf(item)).name;
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
 BGM.sfx(correct?'ok':'no');if(!correct&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const gm=$('game');gm.classList.remove('shake');void gm.offsetWidth;gm.classList.add('shake');setTimeout(()=>gm.classList.remove('shake'),600)}
 renderFeedback();const fbAt=state;setTimeout(()=>{if(state!==fbAt||state.phase!=='fb')return;$('fb').hidden=false;$('fNext').focus({preventScroll:true})},correct?750:650);
 gain(g);
}
function renderFeedback(){
 const e=state.entry,correct=state.correctNow;
 $('fIcon').textContent=correct?'✓':state.timeout?'◷':'↻';$('fIcon').className='ficon'+(correct?'':' no');
 $('fTitle').textContent=correct?(state.sb?t('streakT',state.streak):t('right')):state.timeout?t('timeup'):t('wrong');
 $('fReward').textContent=correct?t('plus',state.gain,state.sb):state.bonus?t('bonusFree'):t('willRepeat');
 $('fWord').textContent=e.ko;$('fMean').textContent=e.tr;
 const w=e.parent||e;
 $('fPairs').innerHTML=(w.note&&!state.offerBonus?`<span class="note">${esc(w.note)}</span>`:'')+(!state.offerBonus?w.pairs:[]).map(p=>`<span>${esc(p.ko)} · ${esc(p.tr)}</span>`).join('');
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
 $('cUnit').textContent=w.parent?t('kPairRev'):`${lvById(base.grp).name} · ${t('unitN',base.unit)}`;
 $('cFront').textContent=w.ko;$('cFront').classList.toggle('long',w.ko.length>6);
 $('cBackKo').innerHTML=`<span>${esc(w.ko)}</span><button class="say sm" data-say="${esc(w.id)}" aria-label="${esc(t('listen'))}">${SPK}</button>`;
 $('cBackTr').textContent=w.tr;
 $('cPairs').innerHTML=(w.note?`<li class="note"><div><span>${esc(w.note)}</span></div></li>`:'')+(w.pairs||[]).map(p=>`<li><div><b>${esc(p.ko)}</b><span>${esc(p.tr)}</span></div><button class="say sm" data-say="${esc(p.id)}" aria-label="${esc(t('listen'))}">${SPK}</button></li>`).join('');
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
function finishCards(){played=true;save();show('result');renderResult()}
{let sx=null;$('flip').addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
 $('flip').addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>70){e.preventDefault();cardAnswer(dx>0)}})}

// ---------- ilerleme tablosu ----------
function status(w){if(S.retry.includes(w.id))return 'rv';const m=S.mem[w.id];return m&&m.c>0?'ok':m?'rv':'no'}
let progLv=null,openUnits=new Set();
function renderProg(){
 progLv=progLv||S.lv;
 const all=ALL.filter(w=>status(w)==='ok').length;
 $('pTotal').textContent=`${all} / ${ALL.length}`;
 $('pTabs').innerHTML=LEVELS.map(L=>{const n=L.words.filter(w=>status(w)==='ok').length;return `<button data-pl="${esc(L.id)}" aria-pressed="${L.id===progLv}">${esc(S.lang==='ko'&&L.nameKo?L.nameKo:L.name)} · ${Math.round(n/L.words.length*100)}%</button>`}).join('');
 const L=lvById(progLv);
 $('pList').innerHTML=L.units.map(u=>{
  const st=u.words.map(status),ok=st.filter(x=>x==='ok').length,rv=st.filter(x=>x==='rv').length,k=L.id+'|'+u.key,open=openUnits.has(k);
  return `<div class="unit${open?' open':''}" data-u="${esc(k)}"><button><b>${esc(t('unitN',u.key))}</b><small>✓ ${ok}${rv?` · ↺ ${rv}`:''} / ${u.words.length}</small><span class="pbar"><i style="width:${ok/u.words.length*100}%"></i></span></button>
  <div class="ws">${open?u.words.map((w,i)=>{const m=S.mem[w.id];return `<div class="wrow" data-w="${esc(w.id)}"><i class="st ${st[i]}"></i><b>${esc(w.ko)}</b><span>${esc(w.tr)}</span>${m?`<small>${m.c}✓ ${m.w}✗</small>`:''}</div>`}).join(''):''}</div></div>`}).join('');
}
$('bProg').onclick=()=>{progLv=S.lv;show('prog');renderProg()};
$('pQuit').onclick=()=>{show('home');renderHome()};
$('pTabs').addEventListener('click',e=>{const b=e.target.closest('[data-pl]');if(b){progLv=b.dataset.pl;renderProg();$('pList').scrollTop=0}});
$('pList').addEventListener('click',e=>{
 const r=e.target.closest('.wrow');if(r){speak(sayText(BYID.get(r.dataset.w)),true);return}
 const u=e.target.closest('.unit>button');if(u){const k=u.parentElement.dataset.u;openUnits.has(k)?openUnits.delete(k):openUnits.add(k);const y=$('pList').scrollTop;renderProg();$('pList').scrollTop=y}
});

// ---------- sonuç ----------
function finish(){played=true;clearInterval(timer);state.phase='done';save();show('result');renderResult()}
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
$('rHome').onclick=()=>{state=null;deck=null;show('home');renderHome();if(played){played=false;setTimeout(waterCheer,350)}};
$('rRetry').onclick=()=>{const list=shuffle(lastList.slice());if(deck)startCards(list);else start('review',list)};
$('bStart').onclick=()=>start('normal');
$('bCards').onclick=()=>startCards();
$('bReview').onclick=()=>start('review');

document.addEventListener('keydown',e=>{
 if(!$('mSong').hidden||!$('mName').hidden||!$('mLv').hidden||!$('mSet').hidden||!$('mWel').hidden||!$('mNotes').hidden||!$('mBook').hidden||!introDone||!$('review').hidden||!$('guide').hidden)return;
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
function renderSettings(){try{$('rvSet').hidden=!(RV.unlocked||Object.keys(RV.items||{}).length)}catch(e){}
 $('sizeChips').innerHTML=[10,0].map(n=>`<button class="chip" data-size="${n}" aria-pressed="${n===S.size}">${n?n:t('sizeAll')+' · '+pool().length}</button>`).join('');
 $('bTimer').textContent=S.timer?t('timerOn'):t('timerOff');$('bTimer').setAttribute('aria-pressed',S.timer);
 $('bAuto').textContent=S.auto?t('autoOn'):t('autoOff');$('bSfx').textContent=S.sfx===false?t('sfxOff'):t('sfxOn');$('bAuto').setAttribute('aria-pressed',S.auto);
 $('bMusic').textContent=S.music?t('musicOn'):t('musicOff');$('bMusic').setAttribute('aria-pressed',S.music);$('vol').value=S.vol;
 $('bStache').textContent=S.stache?t('stacheOn'):t('stacheOff');$('bStache').setAttribute('aria-pressed',S.stache);
 renderVoices();
 $('rateChips').innerHTML=RATES.map(([r,k])=>`<button class="chip" data-rate="${r}" aria-pressed="${S.rate==r}">${t(k)}</button>`).join('');
 $('nameSet').value=S.name;$('bReset').textContent=t('reset');
}
$('sizeChips').addEventListener('click',e=>{const b=e.target.closest('[data-size]');if(b){S.size=+b.dataset.size;save();renderSettings()}});
$('bTimer').onclick=()=>{S.timer=!S.timer;save();renderSettings()};
$('bStache').onclick=()=>{S.stache=!S.stache;save();renderSettings();renderHome()};
$('bAuto').onclick=()=>{S.auto=!S.auto;save();renderSettings()};
$('bSfx').onclick=()=>{S.sfx=S.sfx===false;save();renderSettings();if(S.sfx)BGM.sfx('ok')};
$('bTest').onclick=()=>speak('안녕하세요. 토픽 합격을 응원해요!',true);
$('voiceSel').onchange=e=>{S.voice=e.target.value;save();pickVoice();speak('안녕하세요. 반가워요!',true)};
$('rateChips').addEventListener('click',e=>{const b=e.target.closest('[data-rate]');if(!b)return;S.rate=+b.dataset.rate;save();renderSettings();speak('천천히 따라 읽어 보세요.',true)});
$('nameSet').addEventListener('input',e=>{S.name=e.target.value.trim();S.named=true;save();renderHome();nameIntro=!!S.name});
$('bSet').onclick=()=>{renderSettings();$('mSet').hidden=false};
$('bSetOk').onclick=()=>{$('mSet').hidden=true;if(nameIntro)setTimeout(()=>cheer(),350)};
let resetArm=false;
$('bReset').onclick=()=>{if(!resetArm){resetArm=true;$('bReset').textContent=t('resetSure');setTimeout(()=>{resetArm=false;$('bReset').textContent=t('reset')},3000);return}
 Object.assign(S,{xp:0,level:1,pet:'',route:'',branch:'',mem:{},retry:[],best:0});save();resetArm=false;$('mSet').hidden=true;renderHome()};

// ---------- iletişim bağlantıları ----------
function chromeURL(u){return /Android/i.test(navigator.userAgent)?'intent://'+u.replace(/^https?:\/\//,'')+'#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url='+encodeURIComponent(u)+';end':u}
function renderLinks(){
 const h=[];
 if(INSTA)h.push(`<a class="lk ig" href="${esc(chromeURL('https://www.instagram.com/'+encodeURIComponent(INSTA)+'/'))}" target="_blank" rel="noopener"><span class="ic"><svg><use href="#i-ig"/></svg></span><span class="tx"><b>Instagram<span class="igs"> · ${t('igSub')}</span></b><small>@${esc(INSTA)}</small></span></a>`);
 if(KAKAO_OPEN)h.push(`<a class="lk kk" href="${esc(KAKAO_OPEN)}" target="_blank" rel="noopener"><span class="ic"><svg><use href="#i-kk"/></svg></span><span class="tx"><b>KakaoTalk</b><small>${esc(t('kakaoOpen'))}</small></span></a>`);
 else if(KAKAO)h.push(`<button class="lk kk" data-copy="${esc(KAKAO)}"><span class="ic"><svg><use href="#i-kk"/></svg></span><span class="tx"><b>KakaoTalk</b><small>ID · ${esc(KAKAO)}</small></span></button>`);
 if(CONTACT)h.push(`<a class="lk ml" href="${esc(chromeURL('https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(CONTACT)+'&su='+encodeURIComponent('덩어리숲')))}" target="_blank" rel="noopener"><span class="ic"><svg><use href="#i-mail"/></svg></span><span class="tx"><b>E-mail</b><small>${esc(CONTACT)}</small></span></a>`);
 ['links','linksW','linksN'].forEach(id=>{$(id).innerHTML=h.join('')});
 if(ASLI_YT&&$('asliYt')){const a=$('asliYt');a.href=chromeURL(ASLI_YT);a.hidden=false;const m=ASLI_YT.match(/@[\w.-]+/);if(m)a.querySelector('span').innerHTML='<i class="ytp">YouTube · </i>'+esc(m[0])}
}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-copy]');if(!b)return;const sm=b.querySelector('small');
 try{await navigator.clipboard.writeText(b.dataset.copy);sm.textContent=t('kakaoCopied');sm.classList.add('ok')}catch(err){}
 setTimeout(()=>{sm.textContent='ID · '+b.dataset.copy;sm.classList.remove('ok')},2200)});
// logo: bıyıklı gönül tohumu
function logoSVG(){CH.setProfile({routes:{},branches:{}});const g=CH.plantGeometry('tree',null,1,null),[fx,fy]=g.face;
 return CH.creatureSVG('tree',null,1).replace(/viewBox="[^"]*"/,'viewBox="57 119 66 74"').replace('<g class="expression-normal">',stache(fx,fy,1)+'<g class="expression-normal">')}
document.querySelectorAll('.logo-seed').forEach(el=>el.innerHTML=logoSVG());

// ---------- bitki rehberi (도감) ----------
let bookFam=null;
function svgAt(pet,lv,route,branch,lock){CH.setProfile({routes:route?{[pet]:route}:{},branches:branch?{[pet]:branch}:{}});return CH.creatureSVG(pet,route||null,lv,undefined,lock,branch||null)}
function renderBook(){
 $('bkMascot').innerHTML=art();
 const L=S.level,stageIdx=L>=20?6:L>=15?5:L>=10?4:L>=4?3:L>=3?2:L>=2?1:0,mins=[1,2,3,4,10,15,20];
 $('bkPath').innerHTML=t('path').map(([lv,n,d],i)=>`<li class="${L>=mins[i]?'on':''}${i===stageIdx?' now':''}"><span class="lv">${esc(lv)}</span><div><b>${esc(n)}${i===stageIdx?` · ${esc(t('cur'))}`:''}</b><small>${esc(d)}</small></div></li>`).join('');
 const fams=Object.keys(CH.GROWTH);bookFam=bookFam||S.pet||fams[0];
 $('bkFam').innerHTML=fams.map(f=>`<button data-bf="${f}" aria-pressed="${f===bookFam}">${esc(TX[S.lang].fam[f])}${f===S.pet?' ★':''}</button>`).join('');
 const mine=bookFam===S.pet;
 $('bkFamTxt').textContent=t('famTxt',TX[S.lang].fam[bookFam],mine);
 const card=(svg,name,sub,ok)=>`<div class="ccard ${ok?'mine':'lock'}">${svg}<b>${esc(name)}</b><small>${esc(sub)}</small></div>`;
 const reach=(lv,route,branch)=>mine&&L>=lv&&(!route||S.route===route)&&(!branch||S.branch===branch);
 let h=`<div class="sep">Lv.3 · Lv.6</div>`;
 h+=card(svgAt(bookFam,3,null,null,!reach(3)),TX[S.lang].fam[bookFam],t('lvReq',3),reach(3));
 h+=card(svgAt(bookFam,6,null,null,!reach(6)),t('growing',TX[S.lang].fam[bookFam]),t('lvReq',6),reach(6));
 h+=`<div class="sep">Lv.10</div>`;
 const routes=CH.GROWTH[bookFam].routes;
 routes.forEach(r=>{const ok=reach(10,r.id);h+=card(svgAt(bookFam,10,r.id,null,!ok),TX[S.lang].route[r.id],t('lvReq',10),ok)});
 routes.forEach(r=>{h+=`<div class="sep">${esc(TX[S.lang].route[r.id])} · Lv.15 / Lv.20</div>`;
  r.branches.forEach((b,i)=>{
   const n15=S.lang==='ko'?b.name:t('magic',TX.tr.route[r.id])+' '+(i+1),n20=S.lang==='ko'?b.final:t('legend',TX.tr.route[r.id])+' '+(i+1);
   const o15=reach(15,r.id,b.id),o20=reach(20,r.id,b.id);
   h+=card(svgAt(bookFam,15,r.id,b.id,!o15),o15?n15:'?',t('lvReq',15),o15);
   h+=card(svgAt(bookFam,20,r.id,b.id,!o20),o20?n20:'?',t('lvReq',20),o20);
  })});
 $('bkGrid').innerHTML=h;
}
function openBook(){bookFam=S.pet||null;$('mBook').querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));renderBook();$('mBook').hidden=false;$('mBook').querySelector('.box').scrollTop=0}
$('bBook').onclick=openBook;$('mascot').addEventListener('click',openName);$('nameTag').addEventListener('click',openName);
$('bBookX').onclick=()=>{$('mBook').hidden=true};
$('bkFam').addEventListener('click',e=>{const b=e.target.closest('[data-bf]');if(b){bookFam=b.dataset.bf;renderBook()}});

// ---------- kelime kontrolü (editör modu) ----------
let RV={items:{}};try{RV=JSON.parse(localStorage.getItem('deongeoriReview')||'{"items":{}}')}catch(e){}
RV.drafts=RV.drafts||{};
const rvSave=()=>{try{localStorage.setItem('deongeoriReview',JSON.stringify(RV))}catch(e){}};
let rvLv=null,rvUnit='all',rvFilter='all',rvList=[],rvI=0;
const NEWSET=new Set(window.NEW_WORDS||[]);const isNew=w=>NEWSET.has(w.id);
// nerede kaldığını hatırla
function rvSavePos(){const w=rvList[rvI];RV.pos={lv:rvLv,unit:rvUnit,filter:rvFilter,id:w?w.id:null};rvSave()}
// yazılan ama kaydedilmeyen değişiklikler (taslak)
function rvDraft(){const w=rvList[rvI];if(!w)return;const v=rvRead(),r=RV.items[w.id]||{},c=rvCur(w);
 if(v.tr===c.tr&&JSON.stringify(v.pairs)===JSON.stringify(c.pairs)&&(v.note||'')===(r.note||''))delete RV.drafts[w.id];else RV.drafts[w.id]=v;rvSave()}
const rvOrig=w=>({tr:w.tr,pairs:w.pairs.map(p=>[p.ko,p.tr])});
function rvCur(w){const r=RV.items[w.id];return r&&r.st!=='del'&&r.tr!=null?{tr:r.tr,pairs:r.pairs}:rvOrig(w)}
function rvBuild(){
 const L=lvById(rvLv);let ws=rvUnit==='all'?L.words:(L.units.find(u=>u.key===rvUnit)||L).words;
 if(rvFilter==='new')ws=ws.filter(isNew);else if(rvFilter!=='all')ws=ws.filter(w=>{const st=(RV.items[w.id]||{}).st;return rvFilter==='todo'?!st:st===rvFilter});
 rvList=ws;if(rvI>=rvList.length)rvI=Math.max(0,rvList.length-1);
}
function rvRender(){
 const L=lvById(rvLv);
 $('rvLv').innerHTML=LEVELS.map(x=>`<option value="${esc(x.id)}"${x.id===rvLv?' selected':''}>${esc(x.name)}</option>`).join('');
 $('rvUnit').innerHTML=`<option value="all">${esc(t('allUnits'))}</option>`+L.units.map(u=>`<option value="${esc(u.key)}"${u.key===rvUnit?' selected':''}>${esc(t('unitN',u.key))}</option>`).join('');
 $('rvFil').innerHTML=(L.words.some(isNew)?[['new','rvNewF']]:[]).concat([['all','rvAll'],['todo','rvTodo'],['ok','rvOkF'],['edit','rvEditF'],['del','rvDelF']]).map(([k,l])=>`<button data-rf="${k}" aria-pressed="${k===rvFilter}"${k==='new'?' class="rvnew"':''}>${esc(t(l))}${k==='new'?' · '+L.words.filter(isNew).length:''}</button>`).join('');
 const all=rvFilter==='new'?L.words.filter(isNew):L.words,st=all.map(w=>(RV.items[w.id]||{}).st),d=st.filter(Boolean).length;
 $('rvBar').style.width=(d/all.length*100)+'%';
 $('rvStat').textContent=t('rvStat',d,all.length,st.filter(x=>x==='edit').length,st.filter(x=>x==='del').length);
 const w=rvList[rvI];
 ['rvTr','rvNote','rvAdd','rvPairs'].forEach(id=>$(id).hidden=!w);$('rvEmpty').hidden=!!w;
 document.querySelectorAll('#rvCard .rvl,#rvCard .rvhead').forEach(el=>el.hidden=!w);
 if(!w){$('rvOk').disabled=$('rvDel').disabled=true;return}
 $('rvOk').disabled=$('rvDel').disabled=false;
 const r=RV.items[w.id]||{},dr=RV.drafts[w.id],c=dr?{tr:dr.tr,pairs:dr.pairs}:rvCur(w);
 $('rvKo').textContent=w.ko;$('rvWhere').textContent=`${L.name} · ${t('unitN',w.unit)} · ${rvI+1}/${rvList.length}`;
 $('rvSt').className='rvst '+(r.st||'');$('rvSt').textContent=r.st?t({ok:'rvStOk',edit:'rvStEdit',del:'rvStDel'}[r.st]):'';
 $('rvTr').value=c.tr;$('rvNote').value=dr?(dr.note||''):(r.note||'');
 $('rvSt').hidden=false;if(dr){$('rvSt').className='rvst edit';$('rvSt').textContent=t('rvDraft')}
 $('rvPairs').innerHTML=c.pairs.map(([k,v],i)=>`<div class="rvpair" data-i="${i}"><input value="${esc(k)}" lang="ko"><input value="${esc(v)}"><button aria-label="sil">✕</button></div>`).join('');
 $('rvDel').textContent=r.st==='del'?t('rvUndel'):t('rvDelBtn');
 rvRefreshOk();rvSavePos();
}
function rvRead(){return {tr:$('rvTr').value.trim(),pairs:[...document.querySelectorAll('#rvPairs .rvpair')].map(r=>{const [a,b]=r.querySelectorAll('input');return [a.value.trim(),b.value.trim()]}).filter(p=>p[0]&&p[1]),note:$('rvNote').value.trim()}}
function rvChanged(w,v){const o=rvOrig(w);return v.tr!==o.tr||JSON.stringify(v.pairs)!==JSON.stringify(o.pairs)}
function rvRefreshOk(){const w=rvList[rvI];if(!w)return;$('rvOk').textContent=rvChanged(w,rvRead())?t('rvSaveBtn'):t('rvOkBtn')}
function rvStore(st){const w=rvList[rvI];if(!w)return;const v=rvRead();
 const ch=rvChanged(w,v);const rec={st:st||(ch?'edit':'ok'),lv:w.lv,ko:w.ko,otr:w.tr,note:v.note||undefined};
 if(rec.st==='edit'){rec.tr=v.tr;rec.pairs=v.pairs}
 if(rec.st==='del'&&ch){rec.tr=v.tr;rec.pairs=v.pairs}
 RV.items[w.id]=rec;delete RV.drafts[w.id];RV.updated=new Date().toISOString();rvSave()}
function rvGo(d){rvBuild();rvI=Math.max(0,Math.min(rvList.length-1,rvI+d));rvRender();$('rvCard').scrollTop=0}
function openReview(){if(!RV.unlocked){RV.unlocked=true;rvSave()}$('rvSet').hidden=false;
 if(!RV.newStart&&NEWSET.size){RV.newStart=1;rvSave();rvLv='A1-A2';rvUnit='all';rvFilter='new';rvI=0}
 if(!rvLv&&RV.pos&&LEVELS.some(L=>L.id===RV.pos.lv)){const P=RV.pos;rvLv=P.lv;rvUnit=P.unit||'all';rvFilter=P.filter||'all';rvBuild();const i=rvList.findIndex(w=>w.id===P.id);rvI=i>=0?i:0}
 rvLv=rvLv||S.lv;rvBuild();show('review');rvRender()}
$('bReview2').onclick=()=>{$('mSet').hidden=true;openReview()};
window.addEventListener('hashchange',()=>{if(location.hash==='#kontrol'&&introDone)openReview()});
$('rvQuit').onclick=()=>{show('home');renderHome()};
$('rvLv').onchange=e=>{rvLv=e.target.value;rvUnit='all';rvI=0;if(rvFilter==='new'&&!lvById(rvLv).words.some(isNew))rvFilter='all';rvBuild();rvRender()};
$('rvUnit').onchange=e=>{rvUnit=e.target.value;rvI=0;rvBuild();rvRender()};
$('rvFil').addEventListener('click',e=>{const b=e.target.closest('[data-rf]');if(b){rvFilter=b.dataset.rf;rvI=0;rvBuild();rvRender()}});
$('rvPrev').onclick=()=>rvGo(-1);$('rvNext').onclick=()=>rvGo(1);
$('rvOk').onclick=()=>{const w=rvList[rvI];rvStore();const keep=rvFilter!=='all';rvBuild();if(!keep||rvList[rvI]===w)rvGo(1);else rvRender()};
$('rvDel').onclick=()=>{const w=rvList[rvI];if((RV.items[w.id]||{}).st==='del'){delete RV.items[w.id];delete RV.drafts[w.id];rvSave();rvRender()}else{rvStore('del');rvBuild();if(rvList[rvI]===w)rvGo(1);else rvRender()}};
$('rvAdd').onclick=()=>{const d=document.createElement('div');d.className='rvpair';d.innerHTML='<input lang="ko"><input><button aria-label="sil">✕</button>';$('rvPairs').append(d);d.querySelector('input').focus();rvRefreshOk()};
$('rvPairs').addEventListener('click',e=>{const b=e.target.closest('button');if(b){b.parentElement.remove();rvRefreshOk();rvDraft()}});
$('rvCard').addEventListener('input',()=>{rvRefreshOk();rvDraft()});
addEventListener('pagehide',()=>{if(!$('review').hidden)rvDraft()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!$('review').hidden)rvDraft()});
$('rvSay').onclick=()=>{const w=rvList[rvI];if(w)speak(sayText(w),true)};
// gönderme
function rvPayload(){const items=RV.items;return {app:'덩어리숲',kind:'review',reviewer:S.name||'',updated:RV.updated||new Date().toISOString(),count:Object.keys(items).length,items}}
function rvFileName(ext){const d=new Date();return `deongeori-kontrol-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}.${ext}`}
function rvCSV(){const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';const rows=[['seviye','korece','eski_anlam','durum','yeni_anlam','yeni_es_kelimeler','not']];
 for(const [id,r] of Object.entries(RV.items))rows.push([r.lv,r.ko,r.otr,r.st,r.tr||'',(r.pairs||[]).map(p=>p.join('=')).join('; '),r.note||'']);
 return '﻿'+rows.map(r=>r.map(q).join(',')).join('\r\n')}
function rvDownload(text,name,type){const b=new Blob([text],{type});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
$('rvSend').onclick=()=>{const its=Object.values(RV.items);$('rvxStat').textContent=t('rvxStat',its.length,its.filter(x=>x.st==='edit').length,its.filter(x=>x.st==='del').length);$('mRvx').hidden=false};
$('rvxClose').onclick=()=>{$('mRvx').hidden=true};
$('rvxDown').onclick=()=>rvDownload(JSON.stringify(rvPayload(),null,1),rvFileName('json'),'application/json');
$('rvxCsv').onclick=()=>rvDownload(rvCSV(),rvFileName('csv'),'text/csv');
$('rvxShare').onclick=async()=>{const f=new File([JSON.stringify(rvPayload(),null,1)],rvFileName('json'),{type:'application/json'});
 if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:'덩어리숲 kontrol'})}catch(e){}}
 else{alert(t('rvxNoShare'));rvDownload(JSON.stringify(rvPayload(),null,1),rvFileName('json'),'application/json')}};

// ---------- güncelleme notları ----------
const NOTES=[
 ['5.3','2026-11-29',{tr:['Lobideki türkü çubuğuna dokun: türkünün hikâyesi ve çal / duraklat / sonraki türkü düğmeleri'],ko:['로비의 음악 표시를 누르면 곡 설명과 재생/일시정지/다음 곡 버튼']}],
 ['5.2','2026-11-29',{tr:['Bitki arkadaşının adı artık lobide: Deongi\'ye ya da kartındaki adına dokun, istediğin zaman ismini değiştir'],ko:['식물 친구 이름을 로비에서 바로 변경: 덩이나 카드의 이름을 누르면 이름 바꾸기 창 (환영 창의 이름 칸은 삭제)']}],
 ['5.1','2026-11-29',{tr:["Yeni fon müzikleri: türküler 'Dere Geliyor Dere', 'Hey Onbeşli', 'Entarisi Ala Benziyor' ve Kore halk şarkıları 'Arirang', 'Miryang Arirang' ve 'Doraji Taryeong' (daegeum, gayageum, janggu). Şarkılar rastgele sırayla çalar; lobide şu an çalan türkünün adı görünür"],ko:['새 배경 음악: 튀르키예 민요 「Dere Geliyor Dere」·「Hey Onbeşli」·「Entarisi Ala Benziyor」, 한국 민요 「아리랑」·「밀양아리랑」·「도라지타령」(대금·가야금·장구). 곡이 랜덤 순서로 재생, 로비에 지금 나오는 곡 이름 표시']}],
 ['5.0','2026-11-28',{tr:["Bir oyun bitip lobiye dönünce Deongi: sulama animasyonu, mutlu tepki ve 10 farklı konuşma balonu"],ko:['한 판을 마치고 로비로 돌아오면 물 주기 애니메이션 + 행복한 반응 + 말풍선 10종']}],
 ['4.9','2026-11-27',{tr:["Açılış rehberindeki Korece anlatım artık Wonju'nun kendi sesiyle"],ko:['오프닝 한국어 내레이션을 원주의 실제 목소리로 교체']}],
 ['4.8','2026-11-27',{tr:["Aslı'nın kontrolü uygulandı: abi, temel sıfat ve fiil örnekleri (-mak/-mek biçimi), özel adlar (Kore, Seul, Noel, Wi-Fi)"],ko:['아슬르 검수 반영: 형·오빠 → abi, 기본 형용사·동사 예문 -mak 형태 통일, 고유명사 대문자']}],
 ['4.7','2026-11-27',{tr:["Açılış rehberindeki Türkçe anlatım artık Aslı'nın kendi sesiyle 💚"],ko:['오프닝 튀르키예어 내레이션을 아슬르의 실제 목소리로 교체 💚']}],
 ['4.6','2026-11-27',{tr:["B1–B2 de artık konulara göre: 19 konu, 51 bölüm (kelime ilerlemen korunuyor)"],ko:['B1–B2도 주제별로 정리: 19개 주제, 51단원 (단어 학습 기록은 그대로)']}],
 ['4.5','2026-11-27',{tr:["Kontrol modunda 'Yeni eklenen' filtresi: sadece yeni eklenen 651 kelime kontrol edilebiliyor"],ko:['검수 모드에 \'새로 추가\' 필터: 새로 들어간 651개 단어만 골라서 검수할 수 있어요']}],
 ['4.4','2026-11-27',{tr:["TOPIK II artık konulara göre: 20 konu (duygular, sağlık, ekonomi, toplum, kültür, bilim, sık fiiller…), 82 bölüm"],ko:['TOPIK Ⅱ를 주제별로 정리: 감정·건강·경제·사회·문화·과학·자주 쓰는 동사 등 20개 주제, 82단원']}],
 ['4.3','2026-11-27',{tr:["Kelime sayıları yuvarlandı: A1–A2 1000 (aile ve temel fiiller dahil 62 yeni), B1–B2 2000, TOPIK I 2000, TOPIK II 3500, Hanca 400"],ko:['단어 수 정리: A1–A2 1000 (가족·기본 동사 등 62개 새로), B1–B2 2000, TOPIK Ⅰ 2000, TOPIK Ⅱ 3500, 한자 400']}],
 ['4.2','2026-11-27',{tr:["Yeni yazı tipi: Nunito — ş, ğ, ı, İ gibi Türkçe harfler artık düzgün ve uyumlu görünüyor"],ko:['새 글꼴 Nunito 적용: 튀르키예어·아제르바이잔어 특수 글자(ş, ğ, ı, ə 등)가 깔끔하게 보여요']}],
 ['4.1','2026-11-27',{tr:["Açılış rehberine Türkçe sesli anlatım eklendi (TR altyazıda Türkçe, 한 altyazıda Korece); geçince sıradaki ses hemen başlıyor, bitince otomatik ilerliyor (🔊/🔇 ile kapatılabilir)"],ko:['오프닝 안내에 음성 내레이션 추가 (TR 자막은 튀르키예어, 한 자막은 한국어). 넘기면 다음 음성이 바로 나오고, 끝나면 자동으로 넘어가요 (🔊/🔇로 끄기)']}],
 ['4.0','2026-11-27',{tr:["Bitki arkadaşına verdiğin isim her yerde kullanılıyor (konuşma balonu, rehber, hikâye); kaydırma, yakınlaştırma ve kopyalama engellendi; lobide sürüm bilgisi"],ko:['식물 친구 이름을 정하면 말풍선·오프닝 안내·이야기에서 그 이름으로 불러요. 화면 스크롤·확대·복사 방지, 로비 아래 버전 표시']}],
 ['3.9','2026-11-27',{tr:["Bitki arkadaşına isim verince kendini tanıtıyor ve dokununca adını söylüyor; hoş geldin başlığı tek satır"],ko:['식물 친구에게 이름을 지어 주면 그 이름으로 자기소개를 하고, 누르면 이름을 말해요. 환영 인사 한 줄로']}],
 ['3.8','2026-11-27',{tr:["Çalışırken fon müziği hep kısık çalıyor, kelime sesi hemen ve net çıkıyor; efekt sesleri okumayla çakışmıyor"],ko:['공부 화면에서는 배경 음악을 계속 작게 틀고, 단어 음성은 크게 바로 나와요. 효과음이 음성과 부딪히지 않아요']}],
 ['3.7','2026-11-27',{tr:["Lobide 덩이 artık konuşuyor: 20 farklı sınav ve çalışma motivasyon cümlesi, zıplama, takla, gülme gibi hareketlerle; 덩이'ya dokununca cevap veriyor (Bitki rehberi: üstteki kitap düğmesi)"],ko:['로비의 덩이가 말풍선으로 응원해요: 시험·공부 응원 20문장, 점프·구르기·웃음 등 랜덤 동작, 덩이를 누르면 대답해요 (식물 도감은 위쪽 책 버튼)']}],
 ['3.6','2026-11-27',{tr:["Fon müziği, kelime okunduktan sonra yavaşça geri geliyor ve iPhone'da kesilirse kendiliğinden devam ediyor"],ko:['단어를 읽은 뒤 배경 음악이 부드럽게 다시 커지고, 아이폰에서 끊겨도 스스로 다시 나와요']}],
 ['3.5','2026-11-27',{tr:["Doğru cevapta kanun sesiyle ışıltılı efekt ve kalın çerçeve, yanlışta bağlama sesi ve ekran sallanması (Ayarlar → Efekt sesleri)"],ko:['정답이면 카눈 소리 띠리링과 굵은 테두리, 오답이면 바을라마 소리 또롱과 화면 흔들림 (설정 → 효과음)']}],
 ['3.4','2026-11-26',{tr:["A1–A2'ye 45 yeni kelime: yönler (동·서·남·북…), vücut, renkler, hayvanlar, zaman (Aslı'nın listesi)"],ko:['A1–A2 초급 어휘 45개 추가: 방향(동·서·남·북…), 몸, 색깔, 동물, 시간']}],
 ['3.3','2026-11-26',{tr:['Yeni açılış rehberi: 덩이 zıplayarak, dönerek 덩어리숲\'u tanıtıyor (Ayarlar → Tanıtımı tekrar izle)','Karşılama penceresi sadeleştirildi','Rehberde altyazı seçimi: TR · 한'],ko:['새 오프닝 안내: 덩이가 점프·회전하며 덩어리숲을 소개해요 (설정 → 소개 다시 보기)','환영 창 간소화 (사용법 부분 삭제)','오프닝 자막 선택: TR · 한']}],
 ['3.2','2026-11-26',{tr:['TOPIK Ⅱ\'ye Aslı\'nın konu listesinden 143 yeni kelime: 경제 (ekonomi), 감정 (duygular), 의성어·의태어 (yansıma sözcükler), 건강 (sağlık), 과학 기술 (bilim ve teknoloji) bölümleri','TOPIK Ⅱ artık 3.459 kelime'],ko:['TOPIK Ⅱ에 아슬르 주제별 단어 143개 추가: 경제·감정·의성어·의태어·건강·과학 기술 단원','TOPIK Ⅱ 총 3,459단어']}],
 ['3.1','2026-11-26',{tr:['TOPIK Ⅱ\'ye Aslı\'nın 3–4. seviye listesinden 627 yeni kelime eklendi (bölüm 54–66), her kelimeye eş kelimeler','TOPIK Ⅱ artık 3.316 kelime'],ko:['TOPIK Ⅱ에 아슬르의 3–4급 단어 627개 추가 (54–66단원), 모든 단어에 짝꿍어휘','TOPIK Ⅱ 총 3,316단어']}],
 ['3.0','2026-11-26',{tr:['B1–B2 kelimeleri Aslı tarafından kontrol edildi: 380 kelimenin anlamı ve eş kelimeleri düzeltildi (자기소개서, 담다, 돌탑, 가까이 dahil)','Giriş ekranında TOPIK Ⅰ · TOPIK Ⅱ rozetleri'],ko:['B1–B2 아슬르 검수 반영: 380개 단어 뜻·짝꿍어휘 수정','첫 화면에 TOPIK Ⅰ · TOPIK Ⅱ 배지']}],
 ['2.9','2026-11-25',{tr:['Yeni fon müziği: anonim İstanbul türküsü “Üsküdar\'a Gider İken” (Kâtibim), ney, bağlama, kanun ve bendirle yavaş ve dinlendirici düzenleme','Kelime kontrol modu artık yalnızca editör bağlantısıyla açılır'],ko:['새 배경 음악: 튀르키예 전통 민요 “Üsküdar\'a Gider İken(카티빔)”을 네이·바을라마·카눈·벤디르로 느리고 편안하게 편곡','단어 검수 모드는 이제 검수자 링크로만 열려요']}],
 ['2.8','2026-11-25',{tr:['TOPIK Ⅰ: 1.671 kelimenin hepsine eş kelimeler (짝꿍어휘) eklendi'],ko:['TOPIK Ⅰ: 1,671개 모든 단어에 짝꿍어휘 추가']}],
 ['2.7','2026-11-25',{tr:['Yeni seviye: TOPIK Ⅰ — 1.671 başlangıç kelimesi, 27 konuya ayrıldı (843\'ü kontrol edilmiş seviyelerden, eş kelimeleriyle)'],ko:['새 레벨: TOPIK Ⅰ — 초급 단어 1,671개, 27개 주제별 단원 (843개는 검수된 레벨의 뜻·짝꿍어휘 사용)']}],
 ['2.6','2026-11-25',{tr:['A1–A2 kelime kontrolü tamamlandı (Aslı) · B1.1 kontrolü başladı'],ko:['A1–A2 단어 검수 완료 (아슬르) · B1.1 검수 시작']}],
 ['2.5','2026-11-25',{tr:['Kelime kontrolü: yazdıkların anında saklanır, uygulamayı kapatsan bile kaybolmaz; açınca kaldığın kelimeden devam edersin'],ko:['단어 검수: 입력하는 즉시 임시 저장, 앱을 꺼도 그대로 남고 다시 열면 보던 단어부터 이어서']}],
 ['2.4','2026-11-25',{tr:['KakaoTalk düğmesi artık açık sohbet odasına bağlanıyor','Aslı\'nın YouTube kanalı: @gumguri_korean'],ko:['카카오톡 버튼을 오픈채팅방으로 연결','아슬르 유튜브 채널 바로가기: @gumguri_korean']}],
 ['2.3','2026-11-25',{tr:['A1–A2 kelimeleri konulara göre yeniden düzenlendi (23 konu: meslekler, okul, zaman, hava, yemek, alışveriş, vücut…)'],ko:['A1–A2 단어를 주제별로 새로 정리 (23개 주제: 직업, 학교, 시간, 날씨, 음식, 쇼핑, 몸…)']}],
 ['2.2','2026-11-25',{tr:['A1–A2 bölümlerine konu adları eklendi (B1–B2 gibi)'],ko:['A1–A2 단원에도 주제 이름 추가 (B1–B2처럼)']}],
 ['2.1','2026-11-25',{tr:['Hazırlayanlar: Oyun yapımı ve tasarımı Wonju Kim · Kontrol ve düzeltme Aslıhan Erdoğan','KakaoTalk\'ta bağlantıya dokununca doğrudan tarayıcıda açılır'],ko:['만든 사람들: 게임 제작 및 기획 Wonju Kim · 검수 및 교정 Aslıhan Erdoğan','카카오톡에서 링크를 누르면 바로 외부 브라우저로 열림']}],
 ['2.0','2026-11-25',{tr:['B1.1–B2.2 tek seviyede birleşti: B1–B2 (ilerlemen korunur)','TOPIK Ⅱ: 2.689 kelimenin hepsine eş kelimeler eklendi','A1–A2: Aslı\'nın kontrolü uygulandı (893 kelime, 122 düzeltme)','Yeni seviye: TOPIK Ⅱ — gerçek TOPIK Ⅱ sınavlarından 2.689 kelime ve deyim (listeyi derleyen: Aslıhan Erdoğan)','Uzun anlamlarda açıklama: cevaptan sonra ve kartın arkasında görünür'],ko:['B1.1–B2.2를 B1–B2 한 레벨로 합침 (진도는 그대로)','TOPIK Ⅱ 2,689단어 전체에 짝꿍어휘 완성','A1–A2: 아슬르 검수 반영 (893단어 중 122개 수정)','새 레벨: TOPIK Ⅱ — 실제 TOPIK Ⅱ 기출에서 모은 단어·관용 표현 2,689개 (정리: Aslıhan Erdoğan)','긴 뜻은 설명으로: 정답 뒤와 카드 뒷면에 보여요']}],
 ['1.10','2026-11-25',{tr:['Yeni ses seçenekleri: Biraz kalın ses, Kalın ses (gerçek erkek sesi olan cihazlarda Erkek sesi)','Aynı sesin iki kez görünmesi düzeltildi','Okuma hızları arasındaki fark büyütüldü','Yeni fon müziği: daha aydınlık, Rast makamında ney, bağlama, kanun ve bendir'],ko:['새 목소리 선택: 조금 낮은 목소리, 낮은 목소리 (진짜 남자 음성이 있는 기기에선 남자 목소리)','같은 목소리가 두 번 보이던 문제 수정','읽기 속도 차이를 더 크게 조정','새 배경 음악: 더 밝은 라스트(Rast) 음계의 네이·바을라마·카눈·벤디르']}],
 ['1.9','2026-11-25',{tr:['Yeni sesler: Google Çeviri sesi (internet gerekir) ve Erkek sesi'],ko:['새 목소리: 구글 번역 목소리(인터넷 필요), 남자 목소리']}],
 ['1.8','2026-11-25',{tr:['Bir turdaki kelime: 10 ya da Tümü (seçili bölümün tüm kelimeleri)'],ko:['한 판 단어 수: 10개 또는 전체(고른 단원의 모든 단어)']}],
 ['1.7','2026-11-25',{tr:['Ses seçimi: Chrome\'un Google 한국의 sesi dahil, cihazdaki tüm Korece sesler','Okuma hızı: Çok yavaş / Yavaş / Normal'],ko:['목소리 선택: Chrome의 Google 한국의 음성 포함, 기기의 모든 한국어 음성','읽기 속도: 아주 느리게 / 느리게 / 보통']}],
 ['1.6','2026-11-25',{tr:['Kelime kontrol modu (editör): anlamları ve eş kelimeleri düzelt, eski kelimeleri işaretle, dosyayı paylaş','Türkçe ek düzeltmesi: 덩어리숲\'a hoş geldin! (Aslı\'ya teşekkürler)'],ko:['단어 검수 모드(편집자): 뜻·짝꿍어휘 고치기, 오래된 단어 표시, 파일로 보내기','터키어 접미사 수정: 덩어리숲\'a hoş geldin! (아슬르 고마워요)']}],
 ['1.5','2026-11-24',{tr:['Giriş ekranı ve Türk halk müziği esintili dinlendirici fon müziği (Hicaz makamı, saz, ney, darbuka)','Deongi\'nin hikâyesi ve bitki rehberi (seviyelere göre büyüme)','Bağlantı paylaşınca önizleme görseli, uygulama içi tarayıcıdan otomatik Chrome\'a geçiş','Ana ekrana ekleme rehberi, güncelleme notları, Instagram ve KakaoTalk bağlantıları'],ko:['인트로 화면과 튀르키예 민속 음악 느낌의 힐링 배경 음악(히자즈 음계, 사즈, 네이, 다르부카)','덩이의 이야기와 식물 도감(레벨별 성장)','링크 미리보기 그림, 앱 안 브라우저에서 Chrome으로 자동 전환','홈 화면 추가 안내, 업데이트 노트, 인스타그램·카카오톡 바로가기']}],
 ['1.4','2026-11-24',{tr:['A1–B2 kelime listeleri (Aslıhan Erdoğan) ve 390 Hanca','Her kelimeye eş kelimeler, mantıklı yanlış seçenekler','Çevirmeli kartlar, ilerleme tablom, ana ekrana ekleme simgesi'],ko:['A1–B2 단어장(Aslıhan Erdoğan)과 한자 390자','단어마다 짝꿍어휘, 같은 단원·품사에서 나오는 오답','카드 뒤집기, 나의 진도표, 홈 화면 아이콘']}],
 ['1.3','2026-11-24',{tr:['덩어리숲 bitki arkadaşları, büyüme ve evrim','Yüz ifadeleri düzeltildi, büyük bıyık eklendi'],ko:['덩어리숲 식물 친구, 성장과 진화','표정 겹침 수정, 큰 콧수염 추가']}],
 ['1.2','2026-11-24',{tr:['İstanbul manzaralı arka plan'],ko:['이스탄불 풍경 배경']}],
 ['1.1','2026-11-24',{tr:['Dört seçenekli test ve eş kelime bonusu','Türkçe / Korece arayüz, kadın sesiyle okuma'],ko:['4지선다 퀴즈와 짝꿍어휘 보너스','튀르키예어·한국어 화면, 여성 목소리 읽기']}],
 ['1.0','2026-11-24',{tr:['İlk sürüm'],ko:['첫 버전']}]
];
function renderNotes(){$('notesBody').innerHTML=NOTES.map(([v,d,n])=>`<div class="nver"><b>v${v}</b><small>${d}</small><ul>${n[S.lang].map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}
$('mBook').addEventListener('click',e=>{if(e.target.id==='mBook')$('mBook').hidden=true});
$('bNotes').onclick=()=>{renderNotes();$('mSet').hidden=true;$('mNotes').hidden=false;$('mNotes').querySelector('.box').scrollTop=0};
$('bNotesOk').onclick=()=>{$('mNotes').hidden=true};

// ---------- arka plan müziği (WebAudio ile üretilir) ----------
let lastSpeak=-1e9;
const BGM=(()=>{
 // Rastgele sırayla çalınan halk ezgileri (WebAudio ile üretilir):
 //  · "Üsküdar'a Gider İken" (Kâtibim), İstanbul türküsü, Bûselik — ney, bağlama, kanun, bendir
 //  · "Dere Geliyor Dere", Rumeli türküsü, Beyâtî, 9/8 karşılama (B yarım bemol)
 //  · "아리랑 (Arirang)", Kore halk şarkısı (bonjo, 3/4) — daegeum, gayageum, janggu
 //  · "밀양아리랑 (Miryang Arirang)", Kore halk şarkısı (9/8 semachi)
 //  · "도라지타령 (Doraji Taryeong)", Gyeonggi halk şarkısı (9/8 semachi)
 //  · "Hey Onbeşli" (Tokat) ve "Entarisi Ala Benziyor" (Rumeli, Hicaz) — Musa Çetiner notaları
 let studyOn=false,duckWatch=null,ctx=null,master=null,duckG=null,bus=null,timer=null,next=0,on=false,noise=null,pass=0,song=null,fi=0,lastSong=-1;
 const E=0.5;// bağlama tezene tremolosu için temel süre
 const N=m=>440*Math.pow(2,(m-69)/12);
 const R=null;
 // --- 1) Kâtibim (2/4, birim = onaltılık 0,25 sn) ---
 const K={A4:69,B4:71,C5:72,D5:74,E5:76,F5:77,G5:79,Gs:68};
 const KM={
  1:[[K.E5,1],[K.F5,1],[K.E5,1],[K.D5,1],[K.C5,1],[K.B4,1],[K.C5,1],[K.D5,1]],
  2:[[K.E5,1],[K.F5,1],[K.E5,1],[K.D5,1],[K.C5,1],[K.B4,1],[K.A4,2]],
  4:[[K.E5,6],[R,2]],
  5:[[K.B4,1],[K.D5,1],[K.C5,1],[K.B4,1],[K.B4,1],[K.A4,1],[K.A4,1],[K.Gs,1]],
  6:[[K.A4,6],[R,2]],
  7:[[K.A4,3],[K.E5,1],[K.E5,2],[K.E5,2]],
  8:[[K.F5,1],[K.E5,1],[K.F5,1],[K.G5,1],[K.E5,2],[K.E5,2]],
  9:[[K.D5,2],[K.D5,2],[K.C5,2],[K.D5,2]],
  10:[[K.E5,8]],
  11:[[K.A4,3],[K.B4,1],[K.C5,2],[K.D5,2]],
  13:[[K.B4,1],[K.D5,1],[K.C5,1],[K.B4,1],[K.B4,1],[K.A4,1],[K.Gs,1],[K.A4,1]],
  14:[[K.B4,4],[R,4]],
  17:[[K.B4,1],[K.D5,1],[K.C5,1],[K.B4,1],[K.B4,1],[K.A4,1],[K.A4,1],[K.Gs,1]],
  18:[[K.A4,4],[R,4]],
  0:[[R,8]]};
 KM[3]=KM[1];KM[12]=KM[2];KM[15]=KM[11];KM[16]=KM[2];
 const Am=[45,52,57],Em=[40,47,52],Dm=[38,45,50],G=[43,50,55],C=[36,43,48],D=[38,45,50],Bm=[35,42,47],Ems=[40,47,52];
 // --- 2) Dere Geliyor Dere (9/8 = 2+2+2+3, birim = sekizlik) — B yarım bemol = 70.5 ---
 const Bh=70.5;
 const DM={
  1:[[74,1],[76,1],[76,1],[76,1],[76,2],[74,1],[72,2]],
  2:[[76,1],[74,1],[74,2],[72,1],[74,1],[Bh,1],[69,2]],
  3:[[Bh,1],[72,1],[74,1],[76,1],[74,2],[Bh,1],[72,2]],
  4:[[Bh,1],[69,1],[69,2],[69,3],[R,2]],
  0:[[R,9]]};
 // --- 3) 아리랑 (3/4, birim = sekizlik) — kaynak: geleneksel bonjo Arirang, Sol majör pentatonik ---
 const T3=2/3;
 const AM={
  1:[[62,3],[64,1],[62,1],[64,1]],
  2:[[67,3],[69,1],[67,1],[69,1]],
  3:[[71,2],[69,T3],[71,T3],[69,T3],[67,1],[64,1]],
  6:[[71,1],[69,1],[67,1],[64,1],[62,1],[64,1]],
  7:[[67,3],[69,1],[67,2]],
  8:[[67,6]],
  9:[[74,4],[74,2]],
  10:[[74,2],[71,2],[69,2]],
  0:[[R,6]]};
 AM[4]=AM[1];AM[5]=AM[2];AM[11]=AM[3];AM[12]=AM[1];AM[13]=AM[2];AM[14]=AM[6];AM[15]=AM[7];AM[16]=AM[8];
 // --- 4) 밀양아리랑 (9/8 세마치, birim = sekizlik) — kaynak: 김경호·신인자 창, 서정매 채보 notası ---
 const MM={
  1:[[74,1],[74,2],[72,1],[74,1],[72,1],[69,3]],
  3:[[74,3],[72,1],[74,1],[72,1],[69,1],[67,1],[69,1]],
  4:[[72,3],[72,1],[74,1],[72,1],[69,3]],
  5:[[69,1],[69,2],[67,2],[65,1],[62,1],[65,2]],
  6:[[69,1],[69,2],[67,2],[72,1],[69,2],[67,1]],
  7:[[65,3],[65,1],[67,1],[65,1],[62,2],[60,1]],
  8:[[62,3],[62,2],[65,1],[62,2],[R,1]],
  9:[[62,2],[60,1],[62,2],[64,1],[62,3]],
  11:[[74,1],[74,2],[72,1],[74,1],[72,1],[69,1],[67,1],[69,1]],
  13:[[69,3],[67,2],[65,1],[62,1],[65,2]],
  14:[[69,3],[67,2],[72,1],[69,2],[67,1]],
  0:[[R,9]]};
 MM[2]=MM[1];MM[10]=MM[9];MM[12]=MM[4];MM[15]=MM[7];MM[16]=MM[8];
 const Dmk=[38,45,50],Fk=[41,48,53],Ck=[36,43,48];
 // --- 5) Hey Onbeşli (Tokat, 4/4, birim = onaltılık) — Musa Çetiner notası; Si = 2 koma bemol (≈70.55) ---
 const Bk=70.55;
 const HM={
  1:[[R,2],[72,1],[74,1],[76,2],[76,2],[76,2],[74,2],[76,2],[R,2]],
  3:[[79,2],[79,1],[78,1],[79,1],[78,1],[79,1],[76,1],[76,1],[76,2],[74,1],[76,2],[74,.5],[72,.5],[74,1]],
  4:[[72,1],[76,1],[74,2],[74,2],[74,2],[74,1],[76,1],[72,1],[76,1],[74,2],[R,2]],
  5:[[74,2],[74,1],[Bk,1],[72,2],[Bk,1],[69,1],[69,2],[69,1],[67,1],[69,2],[Bk,1],[69,1]],
  6:[[74,1],[72,1],[74,1],[Bk,1],[72,2],[Bk,1],[69,1],[69,4],[69,1],[67,1],[69,2]],
  8:[[72,2],[74,1],[Bk,1],[72,2],[Bk,1],[69,1],[69,3],[69,1],[69,1],[67,1],[69,2]],
  9:[[74,2],[74,1],[Bk,1],[72,2],[Bk,1],[69,1],[69,2],[69,1],[67,1],[69,1],[69,1],[Bk,1],[69,1]],
  0:[[R,16]]};
 HM[2]=HM[1];HM[7]=HM[5];HM[10]=HM[6];
 // --- 6) Entarisi Ala Benziyor (Rumeli, 9/8, birim = sekizlik, Hicaz: Si♭ · Do♯) — Musa Çetiner notası ---
 const EM={
  1:[[74,1],[76,1],[77,1],[76,1],[74,1],[73,2],[73,2]],
  2:[[69,1],[70,1],[74,1],[73,1],[70,1],[69,2],[76,2]],
  3:[[74,1],[76,1],[77,1],[76,1],[74,1],[76,1],[74,1],[73,2]],
  4:[[69,1],[70,1],[74,1],[73,1],[70,1],[69,2],[R,2]],
  5:[[69,2],[74,2],[73,1],[74,2],[R,2]],
  6:[[73,1],[74,1],[76,2],[77,1],[76,1],[74,1],[73,1],[70,1]],
  7:[[76,1],[74,1],[73,2],[69,1],[70,2],[70,1],[69,1]],
  8:[[76,1],[74,1],[73,2],[70,1],[69,2],[R,2]],
  0:[[R,9]]};
 const Ak=[45,52,57];
 // --- 7) 도라지타령 (경기민요, 세마치 9/8, birim = sekizlik) ---
 const TM={
  1:[[69,3],[69,3],[69,3]],
  2:[[69,3],[69,2],[67,1],[65,3]],
  3:[[72,3],[72,3],[74,2],[72,1]],
  5:[[67,2],[69,1],[69,3],[69,3]],
  6:[[67,2],[69,1],[67,2],[65,1],[62,1],[60,2]],
  7:[[62,3],[65,3],[65,2],[62,1]],
  8:[[60,3],[60,3],[R,3]],
  9:[[62,3],[62,2],[65,1],[60,3]],
  11:[[65,3],[65,3],[65,2],[67,1]],
  12:[[65,3],[65,3],[67,3]],
  15:[[72,2],[72,1],[72,3],[74,2],[72,1]],
  19:[[62,3],[65,3],[62,3]],
  0:[[R,9]]};
 TM[4]=TM[2];TM[10]=TM[9];TM[13]=TM[1];TM[14]=TM[2];TM[16]=TM[2];TM[17]=TM[5];TM[18]=TM[6];TM[20]=TM[8];
 const SONGS=[
  {name:'katibim',kit:'tr',u:.25,bar:8,M:KM,
   CH:{1:Am,2:Am,3:Am,4:Em,5:Em,6:Am,7:Am,8:Dm,9:G,10:Am,11:Am,12:Am,13:Em,14:Em,15:Am,16:Am,17:Em,18:Am,0:Am},
   FORM:[1,2,3,4,1,2,5,6,7,8,9,10,7,8,9,10,11,12,13,14,15,16,17,18,0,0],
   perc(t,u){dum(t,.1);tek(t+4*u,.026);if(Math.random()<.5)tek(t+6*u,.016)}},
  {name:'dere',kit:'tr',u:.27,bar:9,M:DM,
   CH:{1:Am,2:Am,3:G,4:Am,0:Am},
   FORM:[1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,0],
   perc(t,u){dum(t,.1);tek(t+2*u,.024);dum(t+4*u,.07);tek(t+6*u,.022);tek(t+7.5*u,.016)}},
  {name:'arirang',kit:'ko',u:.42,bar:6,M:AM,scale:[67,69,71,74,76],
   CH:{1:G,2:G,3:G,4:D,5:G,6:Ems,7:C,8:G,9:Bm,10:D,11:G,12:D,13:G,14:Ems,15:C,16:G,0:G},
   FORM:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,0],
   perc(t,u){kung(t,.09);deok(t,.02);deok(t+2*u,.018);kung(t+3*u,.06);deok(t+4*u,.016);if(Math.random()<.5)deok(t+5*u,.012)}},
  {name:'miryang',kit:'ko',u:.28,bar:9,M:MM,scale:[62,65,67,69,72,74],
   CH:{1:Dmk,2:Dmk,3:Dmk,4:Fk,5:Dmk,6:Ck,7:Fk,8:Dmk,9:Dmk,10:Dmk,11:Dmk,12:Fk,13:Dmk,14:Ck,15:Fk,16:Dmk,0:Dmk},
   FORM:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,0],
   perc(t,u){kung(t,.08);deok(t,.018);deok(t+2*u,.014);kung(t+3*u,.05);deok(t+4*u,.016);kung(t+6*u,.05);deok(t+7*u,.016);if(Math.random()<.5)deok(t+8*u,.011)}},
  {name:'onbesli',kit:'tr',u:.2,bar:16,M:HM,
   CH:{1:Am,2:Am,3:G,4:G,5:Am,6:Am,7:Am,8:Am,9:Am,10:Am,0:Am},
   FORM:[1,2,1,2,3,4,5,6,7,8,9,10,0],
   perc(t,u){dum(t,.1);tek(t+4*u,.024);dum(t+8*u,.07);tek(t+12*u,.024);if(Math.random()<.5)tek(t+14*u,.015)}},
  {name:'entari',kit:'tr',u:.24,bar:9,M:EM,
   CH:{1:Dm,2:Ak,3:Dm,4:Ak,5:Ak,6:Dm,7:Ak,8:Ak,0:Ak},
   FORM:[1,2,3,4,1,2,3,4,5,6,5,6,7,8,7,8,5,6,7,8,1,2,3,4,0],
   perc(t,u){dum(t,.1);tek(t+2*u,.024);dum(t+4*u,.07);tek(t+6*u,.022);tek(t+7.5*u,.016)}},
  {name:'doraji',kit:'ko',u:.26,bar:9,M:TM,scale:[60,62,65,67,69,72],
   CH:{1:Fk,2:Fk,3:Ck,4:Fk,5:Fk,6:Ck,7:Dmk,8:Ck,9:Dmk,10:Dmk,11:Fk,12:Fk,13:Fk,14:Fk,15:Ck,16:Fk,17:Fk,18:Ck,19:Dmk,20:Ck,0:Fk},
   FORM:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,0],
   perc(t,u){kung(t,.08);deok(t,.018);deok(t+2*u,.014);kung(t+3*u,.05);deok(t+4*u,.016);kung(t+6*u,.05);deok(t+7*u,.016);if(Math.random()<.5)deok(t+8*u,.011)}}
 ];
 function pick(){let i;do i=Math.floor(Math.random()*SONGS.length);while(i===lastSong&&SONGS.length>1);lastSong=i;song=SONGS[i];fi=0;pass++;
  const nm=song.name,d=ctx?Math.max(0,(next-ctx.currentTime)*1000):0;setTimeout(()=>{if(song&&song.name===nm)try{npShow(nm)}catch(e){}},d)}
 function reverb(){const len=ctx.sampleRate*3,b=ctx.createBuffer(2,len,ctx.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.4)}const r=ctx.createConvolver();r.buffer=b;return r}
 function init(){
  ctx=new (window.AudioContext||window.webkitAudioContext)();
  ctx.onstatechange=()=>{if(on&&ctx.state!=='running'&&!document.hidden)setTimeout(()=>BGM.wake(),300)};
  master=ctx.createGain();master.gain.value=0;duckG=ctx.createGain();duckG.gain.value=studyOn?.32:1;bus=ctx.createGain();bus.connect(duckG);
  const rv=reverb(),wet=ctx.createGain();wet.gain.value=.55;duckG.connect(master);duckG.connect(rv);rv.connect(wet);wet.connect(master);master.connect(ctx.destination);
  const len=ctx.sampleRate;noise=ctx.createBuffer(1,len,ctx.sampleRate);const d=noise.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
 }
 // yumuşak, sıcak dem: akorun kökü ve beşlisi
 function pad(ch,t,dur){
  ch.forEach((m,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();
   o.type=i?'triangle':'sawtooth';o.frequency.value=N(m);o.detune.value=i*3;f.type='lowpass';f.frequency.value=i?900:380;
   const v=[.04,.03,.018][i];
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.8);g.gain.setValueAtTime(v,t+dur-.4);g.gain.linearRampToValueAtTime(0,t+dur+.5);
   o.connect(f);f.connect(g);g.connect(bus);o.start(t);o.stop(t+dur+.6)});
 }
 // bağlama: parlak tel; uzun notalarda tezene tremolosu
 function saz(m,t,v=.08,len=1.2){
  const f=ctx.createBiquadFilter();f.type='lowpass';f.Q.value=3;f.frequency.setValueAtTime(4200,t);f.frequency.exponentialRampToValueAtTime(900,t+.5);
  const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.0008,t+len);
  [[0,'sawtooth',.5,1],[6,'triangle',.6,1],[-4,'triangle',.22,2]].forEach(([det,ty,gv,mul])=>{const o=ctx.createOscillator();o.type=ty;o.frequency.value=N(m)*mul;o.detune.value=det;
   const og=ctx.createGain();og.gain.value=gv;o.connect(og);og.connect(f);o.start(t);o.stop(t+len+.1)});
  f.connect(g);g.connect(bus);
 }
 function sazNote(m,t,dur,v){if(dur<=E*1.5){saz(m,t,v);return}const n=Math.round(dur/(E/2));for(let i=0;i<n;i++)saz(m,t+i*E/2,v*(i?(i%2?.55:.7):1),.45)}
 // ney: nefesli, hafif vibratolu
 function ney(m,t,dur,v=.055){
  const o=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain(),lfo=ctx.createOscillator(),lg=ctx.createGain();
  o.type='sine';o2.type='triangle';o.frequency.value=N(m);o2.frequency.value=N(m);lfo.frequency.value=4.6;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(7,t+Math.min(.5,dur*.6));lfo.connect(lg);lg.connect(o.detune);lg.connect(o2.detune);
  o.detune.setValueAtTime(-35,t);o.detune.linearRampToValueAtTime(0,t+.09);
  const g2=ctx.createGain();g2.gain.value=.22;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.08);g.gain.setValueAtTime(v,t+Math.max(.1,dur-.12));g.gain.linearRampToValueAtTime(0,t+dur+.15);
  const n=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),ng=ctx.createGain();n.buffer=noise;n.loop=true;bp.type='bandpass';bp.frequency.value=N(m)*2;bp.Q.value=2.5;ng.gain.value=.01;
  o.connect(g);o2.connect(g2);g2.connect(g);n.connect(bp);bp.connect(ng);ng.connect(g);g.connect(bus);
  [o,o2,lfo,n].forEach(x=>{x.start(t);x.stop(t+dur+.25)});
 }
 // kanun: tiz, ışıltılı çekme
 function kanun(m,t,v=.035){const o=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o2.type='sine';o.frequency.value=N(m);o2.frequency.value=N(m)*2;
  const g2=ctx.createGain();g2.gain.value=.3;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.003);g.gain.exponentialRampToValueAtTime(.0006,t+.9);
  o.connect(g);o2.connect(g2);g2.connect(g);g.connect(bus);o.start(t);o2.start(t);o.stop(t+1);o2.stop(t+1)}
 // bendir: yumuşak düm ve parmak tek
 function dum(t,v=.12){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(95,t);o.frequency.exponentialRampToValueAtTime(55,t+.25);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.45);o.connect(g);g.connect(bus);o.start(t);o.stop(t+.5)}
 function tek(t,v=.03){const n=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();n.buffer=noise;f.type='bandpass';f.frequency.value=2600;f.Q.value=1.1;
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.08);n.connect(f);f.connect(g);g.connect(bus);n.start(t);n.stop(t+.1)}
 // daegeum: derin nefesli bambu flüt, geniş vibrato ve aşağıdan kayarak giriş (sigimsae)
 function daegeum(m,t,dur,v=.05){
  const o=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain(),lfo=ctx.createOscillator(),lg=ctx.createGain();
  o.type='sine';o2.type='triangle';o.frequency.value=N(m);o2.frequency.value=N(m);lfo.frequency.value=5.2;
  lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(4,t+Math.min(.3,dur*.4));lg.gain.linearRampToValueAtTime(14,t+Math.max(.35,dur*.9));lfo.connect(lg);lg.connect(o.detune);lg.connect(o2.detune);
  o.detune.setValueAtTime(-70,t);o.detune.linearRampToValueAtTime(0,t+.14);o2.detune.setValueAtTime(-70,t);o2.detune.linearRampToValueAtTime(0,t+.14);
  const g2=ctx.createGain();g2.gain.value=.3;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.1);g.gain.setValueAtTime(v,t+Math.max(.12,dur-.15));g.gain.linearRampToValueAtTime(0,t+dur+.2);
  const n=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),ng=ctx.createGain();n.buffer=noise;n.loop=true;bp.type='bandpass';bp.frequency.value=N(m)*1.5;bp.Q.value=1.6;ng.gain.value=.018;
  o.connect(g);o2.connect(g2);g2.connect(g);n.connect(bp);bp.connect(ng);ng.connect(g);g.connect(bus);
  [o,o2,lfo,n].forEach(x=>{x.start(t);x.stop(t+dur+.3)});
 }
 // gayageum: yumuşak çekilen ipek tel; sonunda hafif titreşim (nonghyeon)
 function gayageum(m,t,v=.06,len=1.6){
  const o=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter(),g2=ctx.createGain();
  o.type='triangle';o2.type='sine';o.frequency.value=N(m);o2.frequency.value=N(m)*2;g2.gain.value=.25;
  [o,o2].forEach(x=>{x.detune.setValueAtTime(0,t+.18);x.detune.linearRampToValueAtTime(35,t+.4);x.detune.linearRampToValueAtTime(-10,t+.62);x.detune.linearRampToValueAtTime(0,t+.8)});
  f.type='lowpass';f.frequency.setValueAtTime(3000,t);f.frequency.exponentialRampToValueAtTime(700,t+.6);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.005);g.gain.exponentialRampToValueAtTime(.0006,t+len);
  o.connect(f);o2.connect(g2);g2.connect(f);f.connect(g);g.connect(bus);o.start(t);o2.start(t);o.stop(t+len+.1);o2.stop(t+len+.1)}
 // janggu: kung (sol, derin) ve deok (sağ, çubuk)
 function kung(t,v=.1){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(70,t+.3);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.5);o.connect(g);g.connect(bus);o.start(t);o.stop(t+.55)}
 function deok(t,v=.02){const n=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();n.buffer=noise;f.type='bandpass';f.frequency.value=1800;f.Q.value=2.2;
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.06);n.connect(f);f.connect(g);g.connect(bus);n.start(t);n.stop(t+.08)}
 function schedule(){
  if(!song)pick();
  while(next<ctx.currentTime+1.6){
   const s=song,id=s.FORM[fi],t=next,u=s.u,bd=s.bar*u,ch=s.CH[id]||s.CH[0],ko=s.kit==='ko',lead=pass%2?'a':'b';
   pad(ch,t,bd);
   if(id)s.perc(t,u);
   // arpej: kanun (Türk) / gayageum (Kore)
   for(let p=1;p<s.bar;p+=2)if(Math.random()<.55){const tt=t+p*u;
    if(ko){const sc=s.scale;gayageum(sc[Math.random()*sc.length|0]+12,tt,.018,1.1)}
    else kanun(ch[Math.random()*3|0]+24+(Math.random()<.3?12:0),tt,.022)}
   // melodi
   let acc=0;for(const[m,l]of s.M[id]){const tt=t+acc*u,dur=l*u;
    if(m!==null){
     if(ko){if(lead==='a'){daegeum(m,tt,dur*.97,.04);if(l>=3)gayageum(m-12,tt,.024)}else{gayageum(m,tt,.055,Math.max(1.2,dur*1.2));if(l>=3)daegeum(m-12,tt,dur*.9,.022)}}
     else{if(lead==='a'){ney(m,tt,dur*.97,.05);if(l>=4)kanun(m+12,tt,.02)}else{sazNote(m,tt,dur,.07);if(l>=4)ney(m-12,tt,dur*.9,.02)}}}
    acc+=l}
   next+=bd;fi++;if(fi>=s.FORM.length)pick();
  }
 }
 function vol(){return (S.vol/100)*.75}
 return{
  start(fast){if(!S.music)return;try{if(!ctx)init();ctx.resume();if(on)return;on=true;next=ctx.currentTime+.1;schedule();try{npShow(song&&song.name)}catch(e){}timer=setInterval(schedule,300);
   master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(master.gain.value,ctx.currentTime);master.gain.linearRampToValueAtTime(vol(),ctx.currentTime+(fast?.6:3))}catch(e){}},
  stop(){if(!ctx||!on)return;on=false;clearInterval(timer);master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(master.gain.value,ctx.currentTime);master.gain.linearRampToValueAtTime(0,ctx.currentTime+.8)},
  setVol(){if(ctx&&on){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(vol(),ctx.currentTime,.1)}},
  // ses/okuma sırasında müziği yumuşakça kıs, bitince yavaşça geri aç; iOS'ta bitiş olayı gelmezse kendisi fark eder
  // çalışma ekranlarında müzik hep kısık kalır, okuma için açılıp kapanmaz (iOS'ta gecikme olmasın)
  study(v){studyOn=v;clearInterval(duckWatch);if(ctx&&duckG){const g=duckG.gain,t=ctx.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.setTargetAtTime(v?.32:1,t,.6)}},
  duck(d){if(!ctx||!duckG||studyOn)return;const g=duckG.gain,t=ctx.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.setTargetAtTime(d?.3:1,t,d?.12:.5);
   clearInterval(duckWatch);if(d){let n=0;duckWatch=setInterval(()=>{n++;if(n>2&&!voiceBusy()||n>40)BGM.duck(false)},400)}else this.wake()},
  wake(){if(ctx&&on&&!document.hidden&&ctx.state!=='running'&&!voiceBusy()&&performance.now()-lastSpeak>2500)try{ctx.resume().catch(()=>{})}catch(e){}},
  // efekt sesleri: doğru = kanun ile Hicaz'da parlak çıkış (띠리링), yanlış = bağlamada inen iki tel (또롱)
  sfx(kind){if(S.sfx===false)return;try{if(!ctx)init();if(ctx.state!=='running'){if(voiceBusy())return;ctx.resume()}
   const t0=ctx.currentTime+.02,out=ctx.createGain();out.gain.value=.9;out.connect(ctx.destination);
   const pl=(m,t,v,len,bright,tri)=>{const f=ctx.createBiquadFilter();f.type='lowpass';f.Q.value=2;f.frequency.setValueAtTime(bright,t);f.frequency.exponentialRampToValueAtTime(bright*.25,t+len*.6);
    const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.0005,t+len);
    [[0,tri?'triangle':'sawtooth',.6,1],[5,'triangle',.5,1],[-3,'sine',.25,2]].forEach(([dt,ty,gv,mul])=>{const o=ctx.createOscillator();o.type=ty;o.frequency.value=N(m)*mul;o.detune.value=dt;const og=ctx.createGain();og.gain.value=gv;o.connect(og);og.connect(f);o.start(t);o.stop(t+len+.05)});
    f.connect(g);g.connect(out)};
   if(kind==='ok'){[74,75,78,79,81,86].forEach((m,i)=>pl(m,t0+i*.055,i===5?.16:.11,i===5?1.4:.7,6500,true));
    // zil (parmak zili) ışıltısı
    [2637,3520].forEach((fq,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=fq;const tt=t0+.3+i*.02;g.gain.setValueAtTime(0,tt);g.gain.linearRampToValueAtTime(.035,tt+.005);g.gain.exponentialRampToValueAtTime(.0004,tt+1.1);o.connect(g);g.connect(out);o.start(tt);o.stop(tt+1.2)})}
   else{pl(69,t0,.16,.5,2600,false);pl(64,t0+.17,.17,.9,1800,false);
    const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(110,t0+.17);o.frequency.exponentialRampToValueAtTime(55,t0+.4);g.gain.setValueAtTime(.18,t0+.17);g.gain.exponentialRampToValueAtTime(.001,t0+.45);o.connect(g);g.connect(out);o.start(t0+.17);o.stop(t0+.5)}
  }catch(e){}},
  pause(){if(ctx)ctx.suspend()},resume(){if(ctx&&on)ctx.resume()},
  // kullanıcı kontrolleri: çal/duraklat, sonraki türkü
  playing(){return on},cur(){return song&&song.name},
  toggle(){if(on){this.stop();try{npShow(song&&song.name)}catch(e){}}else{S.music=true;save();this.start(true)}return on},
  skip(){try{if(!ctx)init();if(on){const t=ctx.currentTime,old=bus;old.gain.cancelScheduledValues(t);old.gain.setValueAtTime(old.gain.value,t);old.gain.linearRampToValueAtTime(0,t+.35);setTimeout(()=>{try{old.disconnect()}catch(e){}},1500);
    bus=ctx.createGain();bus.connect(duckG);next=t+.45;pick();schedule()}else{pick();this.start(true)}}catch(e){}}
 };
})();
$('bMusic').onclick=()=>{S.music=!S.music;save();renderSettings();if(S.music)BGM.start();else{BGM.stop();npShow(null)}};
$('vol').addEventListener('input',e=>{S.vol=+e.target.value;save();BGM.setVol()});
document.addEventListener('visibilitychange',()=>{document.hidden?BGM.pause():BGM.resume()});
function voiceBusy(){try{return speechSynthesis.speaking||(!GTA.paused&&!GTA.ended)||(typeof GDA!=='undefined'&&!GDA.paused&&!GDA.ended)}catch(err){return false}}
document.addEventListener('pointerdown',()=>setTimeout(()=>BGM.wake(),1500),{capture:true});
setInterval(()=>BGM.wake(),2500);

// ---------- şu an çalan türkü (küçük durum çubuğu) ----------
const NP={katibim:["Üsküdar'a Gider İken","Üsküdar'a Gider İken",'tr'],dere:["Dere Geliyor Dere","Dere Geliyor Dere",'tr'],onbesli:["Hey Onbeşli","Hey Onbeşli",'tr'],entari:["Entarisi Ala Benziyor","Entarisi Ala Benziyor",'tr'],
 arirang:["Arirang (아리랑)","아리랑",'ko'],miryang:["Miryang Arirang (밀양아리랑)","밀양아리랑",'ko'],doraji:["Doraji Taryeong (도라지타령)","도라지타령",'ko']};
let npCur=null;
function npShow(n){npCur=n;const e=$('nowPlay');if(!e)return;const d=n&&NP[n];if(!d||!S.music){e.classList.remove('on');if(!$('mSong').hidden)$('mSong').hidden=true;return}
 const ko=S.lang==='ko',org=d[2]==='tr'?(ko?'튀르키예 민요':'Türk halk türküsü'):(ko?'한국 민요':'Kore halk şarkısı'),pl=BGM.playing();
 e.innerHTML=`<i aria-hidden="true">${pl?'♪':'❚❚'}</i><b>${esc(ko?d[1]:d[0])}</b><small>· ${esc(org)}</small>`;e.classList.add('on');e.classList.toggle('paused',!pl);
 e.setAttribute('aria-label',(ko?'곡 정보 보기: ':'Türkü bilgisi: ')+(ko?d[1]:d[0]));
 if(!$('mSong').hidden)renderSong()}
// türkü açıklamaları (kendi sözlerimizle)
const SONG_INFO={
 katibim:{tr:"İstanbul'un en bilinen türkülerinden biri. Üsküdar'a giderken yağmura yakalanan bir kâtibi anlatır. Aynı ezgi Balkanlar'dan Güney Asya'ya kadar pek çok ülkede farklı sözlerle söylenir.",
  ko:"이스탄불을 대표하는 민요예요. 위스퀴다르로 가다가 비를 만난 서기(kâtip)를 노래해요. 같은 가락이 발칸반도부터 남아시아까지 여러 나라에서 다른 가사로 불려요."},
 dere:{tr:"Rumeli (Balkanlar) türküsü. 9/8'lik karşılama ritmiyle oynanan neşeli bir halk havasıdır; Beyâtî makamındadır.",
  ko:"루멜리(발칸반도의 튀르키예 문화권) 민요예요. 9/8박자 카르실라마 리듬에 맞춰 춤추는 흥겨운 곡이고, 베야티 마캄(음계)으로 되어 있어요."},
 onbesli:{tr:"Tokat yöresinin türküsü. Adı, Birinci Dünya Savaşı'nda askere alınan 1315 (1899) doğumlu gençlerden gelir. Kimileri ağıt, kimileri oturak havası olarak bilir.",
  ko:"토카트 지방 민요예요. 제목의 '온베쉴리'는 1차 세계대전 때 징집된 1315년(서기 1899년)생 젊은이들을 가리켜요. 슬픈 애가로 보는 사람도, 흥겨운 노래로 보는 사람도 있어요."},
 entari:{tr:"Rumeli türküsü. Hicaz makamında ve 9/8'lik ritimle söylenen neşeli bir aşk türküsüdür.",
  ko:"루멜리 민요예요. 히자즈 마캄과 9/8박자로 부르는 흥겨운 사랑 노래로, 좋아하는 사람의 붉은 엔타리(긴 겉옷)를 노래해요."},
 arirang:{tr:"Kore'nin en çok bilinen halk şarkısı; 'gayriresmî milli marş' da denir. Yüzlerce bölgesel versiyonu vardır ve 2012'de UNESCO Somut Olmayan Kültürel Miras listesine girmiştir. Bu, Seul bölgesinin 'bonjo' Arirang'ıdır.",
  ko:"한국을 대표하는 민요로 '비공식 국가'라고도 불려요. 지역마다 수많은 아리랑이 있고, 2012년 유네스코 인류무형문화유산에 올랐어요. 이 곡은 서울·경기 지역의 본조 아리랑이에요."},
 miryang:{tr:"Jeongseon ve Jindo Arirang'ıyla birlikte Kore'nin 'üç büyük Arirang'ından biri. Gyeongsang bölgesindeki Miryang şehrinin hızlı ve neşeli şarkısıdır (9/8 semachi ritmi).",
  ko:"정선·진도 아리랑과 함께 3대 아리랑으로 꼽혀요. 경상도 밀양의 노래로, 경쾌한 세마치장단 곡이에요."},
 doraji:{tr:"Gyeonggi bölgesi halk şarkısı. Dağda doraji (balon çiçeği kökü) toplamayı anlatır. Kuzey ve Güney Kore'de, Çin ve Japonya'da da çok sevilir.",
  ko:"경기민요예요. 깊은 산에서 도라지를 캐는 모습을 노래하고, 남북한은 물론 중국·일본에서도 널리 사랑받아요."}};
const IC_PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',IC_PAUSE='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5.5" width="4" height="13" rx="1.3" fill="currentColor"/><rect x="13.5" y="5.5" width="4" height="13" rx="1.3" fill="currentColor"/></svg>',
 IC_NEXT='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6v12l8.5-6z" fill="currentColor"/><path d="M12 6v12l8.5-6z" fill="currentColor" opacity=".55"/></svg>';
function renderSong(){const n=npCur||BGM.cur(),d=NP[n],I=SONG_INFO[n];if(!d||!I)return;const ko=S.lang==='ko',songLang=d[2]==='tr'?'tr':'ko',pl=BGM.playing();
 $('sgNow').textContent=pl?(ko?'지금 나오는 곡':'Şu an çalıyor'):(ko?'일시정지됨':'Duraklatıldı');
 $('sgTitle').textContent=ko?d[1]:d[0];$('sgOrg').textContent=songLang==='tr'?(ko?'튀르키예 민요':'Türk halk türküsü'):(ko?'한국 민요':'Kore halk şarkısı');
 $('sgDesc').textContent=ko?I.ko:I.tr;
 $('sgPlay').innerHTML=pl?IC_PAUSE:IC_PLAY;$('sgPlay').setAttribute('aria-label',pl?(ko?'일시정지':'Duraklat'):(ko?'재생':'Çal'));$('sgNext').innerHTML=IC_NEXT;$('sgNext').setAttribute('aria-label',ko?'다음 곡':'Sonraki türkü');

 $('sgClose').textContent=ko?'닫기':'Kapat'}
function openSong(){renderSong();$('mSong').hidden=false;$('mSong').querySelector('.box').scrollTop=0}
$('nowPlay').addEventListener('click',openSong);
$('sgPlay').onclick=()=>{BGM.toggle();renderSettings&&renderSettings();npShow(BGM.cur());renderSong()};
$('sgNext').onclick=()=>{BGM.skip();setTimeout(()=>{npShow(BGM.cur());renderSong()},500)};
$('sgClose').onclick=()=>{$('mSong').hidden=true};
$('mSong').addEventListener('click',e=>{if(e.target.id==='mSong')$('mSong').hidden=true});
// ---------- 덩이 응원 말풍선 ----------
const CHEERS=[["오늘도 한 걸음!", "Bugün de bir adım!"], ["TOPIK 합격을 응원해요!", "TOPIK'te başarılar dilerim!"], ["천천히 해도 괜찮아요.", "Yavaş gitmek de olur."], ["할 수 있어요!", "Yapabilirsin!"], ["꾸준함이 실력이에요.", "Düzenli çalışmak en büyük güç."], ["틀려도 괜찮아요. 다시 하면 돼요!", "Yanlış yapmak sorun değil, tekrar dene!"], ["오늘은 단어 10개, 어때요?", "Bugün 10 kelimeye ne dersin?"], ["시험 잘 볼 거예요!", "Sınavın çok iyi geçecek!"], ["어제보다 오늘 더 잘하고 있어요.", "Bugün dünden daha iyisin."], ["한국어 실력이 쑥쑥 자라고 있어요!", "Korecen hızla büyüyor!"], ["파이팅!", "Haydi, sen yaparsın!"], ["조금씩, 매일매일.", "Azar azar, her gün."], ["포기하지 마세요!", "Sakın pes etme!"], ["잠깐 쉬어도 괜찮아요.", "Biraz mola vermek de iyidir."], ["열심히 하는 모습이 멋져요!", "Bu kadar çalışman harika!"], ["시험 날까지 같이 가요!", "Sınav gününe kadar birlikteyiz!"], ["단어 하나가 모여 문장이 돼요.", "Kelimeler birleşip cümle olur."], ["오늘의 노력이 내일의 합격!", "Bugünün emeği, yarının başarısı!"], ["{N}도 같이 공부할게요!", "{N} de seninle çalışıyor!"], ["물 한 잔 마시고 시작해요!", "Bir bardak su iç, sonra başlayalım!"]];
const TAPS=[["히히, 간지러워요!", "Hihi, gıdıklanıyorum!", "laugh"], ["불렀어요?", "Beni mi çağırdın?", "jump"], ["같이 공부할까요?", "Birlikte çalışalım mı?", "bounce"], ["{N} 여기 있어요!", "{N} burada!", "wiggle"], ["오늘 기분 어때요?", "Bugün nasılsın?", "squish"], ["한 문제만 더 풀어요!", "Bir soru daha çözelim!", "excited"], ["우와, 반가워요!", "Vay, seni gördüğüme sevindim!", "spin"], ["공부할수록 저도 자라요!", "Sen çalıştıkça ben de büyüyorum!", "jump"], ["데굴데굴~ 구르기 보여 줄게요!", "Bak, sana takla atıyorum!", "roll"], ["콧수염 멋있죠?", "Bıyığım yakışıklı değil mi?", "laugh"]];
const M_ACTS=['jump','spin','wiggle','squish','bounce','roll','laugh','excited'];
let chLast=-1,tpLast=-1,chHide=null,mActT=null;
function mAct(a){const m=$('mascot');clearTimeout(mActT);m.className='mascot';void m.offsetWidth;m.className='mascot happy m-'+a;mActT=setTimeout(()=>m.className='mascot',a==='roll'?1300:1100)}
function cheerY(){const m=$('mascot'),hab=m.parentElement,hr=hab.getBoundingClientRect();
 try{const sv=m.querySelector('svg'),bb=sv.getBBox(),vb=sv.viewBox.baseVal,r=sv.getBoundingClientRect();
  if(vb&&vb.height){const k=Math.min(r.width/vb.width,r.height/vb.height),oy=(r.height-vb.height*k)/2;return Math.max(40,Math.round(hr.bottom-(r.top+oy+(bb.y-vb.y)*k)+18))}}catch(e){}
 return hab.clientHeight-m.offsetTop+4}
const NM_INTRO=[["안녕! 내 이름은 {N}! 앞으로 잘 부탁해요!", "Merhaba! Benim adım {N}. Tanıştığıma çok sevindim!", "excited"], ["새 이름 {N}, 정말 마음에 들어요!", "Yeni adım {N}, çok beğendim!", "spin"], ["저는 {N}! 같이 쑥쑥 자라요!", "Ben {N}! Birlikte büyüyelim!", "jump"]],NM_TAP=[["저 {N} 여기 있어요!", "Ben {N}, buradayım!", "wiggle"], ["제 이름 기억하죠? {N}!", "Adımı hatırlıyor musun? {N}!", "bounce"], ["{N}도 오늘 열심히 자랄게요!", "{N} de bugün çok çalışıp büyüyecek!", "excited"]];
let nameIntro=false,played=false,wTimer=[];
// bir oyun bitince lobiye dönüşte: sulama + mutlu tepki + konuşma balonu
const WATER=[["시원하다~ 고마워요!", "Oh, ferahladım! Teşekkürler!"], ["물 맛있어요! 꿀꺽꿀꺽", "Su çok lezzetli! Lık lık…"], ["{N} 쑥쑥 자라는 중!", "{N} hızla büyüyor!"], ["오늘도 수고했어요!", "Bugün de çok emek verdin!"], ["한 판 더 할까요?", "Bir el daha oynayalım mı?"], ["덕분에 힘이 나요!", "Senin sayende güçlendim!"], ["온몸이 반짝반짝해졌어요!", "Her yerim pırıl pırıl oldu!"], ["정답 하나하나가 다 양분이에요!", "Her doğru cevap bana besin oldu!"], ["와, 키가 조금 큰 것 같아요!", "Vay, sanki biraz uzadım!"], ["물이 신선하네요~ 더 줄 수 있나요?", "Su çok taze~ Biraz daha verir misin?"]];let wLast=-1;
const WCAN='<svg viewBox="0 0 80 60" aria-hidden="true"><path d="M22 20h34a4 4 0 0 1 4 4v24a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6V24a4 4 0 0 1 4-4z" fill="#6fb6e6" stroke="#2f6b4f" stroke-width="3"/><path d="M60 26c12 0 14 18 2 20" fill="none" stroke="#2f6b4f" stroke-width="4" stroke-linecap="round"/><path d="M19 30L4 14" stroke="#2f6b4f" stroke-width="7" stroke-linecap="round"/><path d="M19 30L4 14" stroke="#6fb6e6" stroke-width="3" stroke-linecap="round"/><ellipse cx="3" cy="13" rx="5" ry="3.4" transform="rotate(-45 3 13)" fill="#2f6b4f"/><path d="M26 28h24" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></svg>';
function waterCheer(){
 const h=$('home'),m=$('mascot');if(!m||h.hidden||document.querySelector('.modal:not([hidden])')||!$('guide').hidden)return;
 const hab=m.parentElement,hr=hab.getBoundingClientRect(),mr=m.getBoundingClientRect();
 wTimer.forEach(clearTimeout);wTimer=[];hab.querySelectorAll('.wcan,.wdrops').forEach(e=>e.remove());
 $('cheer').classList.remove('show');
 const cx=mr.left+mr.width/2-hr.left,top=hr.height-(cheerY()-18);
 const can=document.createElement('div');can.className='wcan';can.innerHTML=WCAN;can.style.left=(cx+6)+'px';can.style.top=Math.max(0,top-92)+'px';
 const dr=document.createElement('div');dr.className='wdrops';dr.style.left=(cx-34)+'px';dr.style.top=Math.max(0,top-62)+'px';dr.style.height=Math.max(40,Math.min(70,top))+'px';
 dr.innerHTML=[0,1,2,3,4,5,6].map(i=>`<i style="left:${4+i*9}px;animation-delay:${(i%4)*.12+(i>3?.06:0)}s"></i>`).join('');
 hab.append(can,dr);
 wTimer.push(setTimeout(()=>dr.classList.add('on'),450));
 wTimer.push(setTimeout(()=>{m.classList.add('happy');try{BGM.sfx('ok')}catch(e){}},1100));
 wTimer.push(setTimeout(()=>{can.classList.add('out');dr.classList.remove('on')},1900));
 wTimer.push(setTimeout(()=>{can.remove();dr.remove();let i;do i=Math.floor(Math.random()*WATER.length);while(i===wLast&&WATER.length>1);wLast=i;
  cheer(false,[WATER[i][0],WATER[i][1],Math.random()<.5?'excited':'jump']);hab.querySelectorAll('.wspark').forEach(e=>e.remove());
  const sp=document.createElement('div');sp.className='wspark';sp.style.left=(cx-60)+'px';sp.style.top=(top-10)+'px';sp.innerHTML='<i></i><i></i><i></i><i></i>';hab.append(sp);wTimer.push(setTimeout(()=>sp.remove(),1400))},2300));
}
function cheer(tap,line){
 const b=$('cheer'),h=$('home'),m=$('mascot');if(!b||h.hidden||document.querySelector('.modal:not([hidden])')||!$('guide').hidden)return;
 let ko,tr,act;
 if(tap){let i;do i=Math.floor(Math.random()*TAPS.length);while(i===tpLast&&TAPS.length>1);tpLast=i;[ko,tr,act]=TAPS[i]}
 else{let i;do i=Math.floor(Math.random()*CHEERS.length);while(i===chLast&&CHEERS.length>1);chLast=i;[ko,tr]=CHEERS[i];act=M_ACTS[Math.floor(Math.random()*M_ACTS.length)]}
 if(nameIntro&&S.name){nameIntro=false;[ko,tr,act]=NM_INTRO[Math.floor(Math.random()*NM_INTRO.length)]}
 else if(tap&&S.name&&Math.random()<.35)[ko,tr,act]=NM_TAP[Math.floor(Math.random()*NM_TAP.length)];
 if(line)[ko,tr,act]=line;
 ko=ko.split('{N}').join(PN());tr=tr.split('{N}').join(PN());
 b.innerHTML=`<b>${esc(ko)}</b>`+(S.lang==='ko'?'':`<small>${esc(tr)}</small>`);
 b.style.bottom=cheerY()+'px';
 b.classList.remove('show');void b.offsetWidth;b.classList.add('show');mAct(act);
 clearTimeout(chHide);chHide=setTimeout(()=>b.classList.remove('show'),6000);
}
$('cheer').addEventListener('click',e=>{e.stopPropagation();cheer(true)});
setInterval(()=>{if(!document.hidden&&!$('cheer').classList.contains('show'))cheer()},10000);

// ---------- isim etiketi + isim değiştirme ----------
function renderNameTag(){const b=$('nameTag');if(!b)return;$('cName').textContent=PN();b.classList.toggle('new',!S.named);$('ntHint').textContent=t('nmHint');b.setAttribute('aria-label',t('nmEdit')+': '+PN())}
function openName(){const m=$('mName');m.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));$('nmIn').value=S.name;$('nmIn').placeholder='덩이';$('nmArt').innerHTML=art();
 $('cheer').classList.remove('show');m.hidden=false;setTimeout(()=>{try{$('nmIn').focus({preventScroll:true})}catch(e){}},80)}
function saveName(){const n=$('nmIn').value.trim().slice(0,14),changed=n!==S.name;S.name=n;S.named=true;save();$('mName').hidden=true;renderHome();
 if(changed)nameIntro=!!n;setTimeout(()=>cheer(),350)}
$('nmOk').onclick=saveName;$('nmNo').onclick=()=>{$('mName').hidden=true};
$('nmIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();saveName()}});
$('mName').addEventListener('click',e=>{if(e.target.id==='mName')$('mName').hidden=true});
// ---------- hoş geldin ----------
$('bMsg').onclick=()=>{$('mWel').hidden=false};
$('bWel').onclick=()=>{$('mWel').hidden=true;renderHome();setTimeout(()=>cheer(),400)};

// ---------- ses (kadın sesi öncelikli) ----------
let voice=null,KOV=[],maleReal=null;
const RATES=[[.4,'rSlow2'],[.65,'rSlow'],[1,'rNorm']];
if(!RATES.some(([r])=>r===S.rate))S.rate=S.rate<.6?.4:S.rate<.8?.65:1;
const FEMALE=/yuna|sora|sunhi|heami|jimin|seoyeon|female|여성|google 한국의|standard-a|wavenet-a|neural2-a/i;
const MALE=/injoon|minsu|hyunsu|bongjin|gookmin|\bmale\b|남성|standard-c|standard-d|wavenet-c|wavenet-d|neural2-c/i;
function pickVoice(){try{KOV=speechSynthesis.getVoices().filter(v=>/^ko/i.test(v.lang));
 maleReal=KOV.find(v=>MALE.test(v.name))||null;
 const fem=KOV.find(v=>FEMALE.test(v.name))||KOV.find(v=>!MALE.test(v.name))||KOV[0]||null;
 voice=S.voice==='male'?(maleReal||fem):(S.voice&&KOV.find(v=>v.voiceURI===S.voice||v.name===S.voice))||fem}catch(e){}
 if($('mSet')&&!$('mSet').hidden)renderVoices()}
function voiceLabel(v){let n=v.name.replace(/^Microsoft\s+/,'').replace(/\s*\(.*?\)\s*/g,' ').replace(/Online|Natural/g,'').replace(/\s*-\s*Korean.*$/i,'').replace(/\s+/g,' ').trim();
 if(/google/i.test(v.name))n='Google 한국의 (Chrome)';
 if(/premium/i.test(v.voiceURI+v.name))n+=' · '+t('vHQ2');else if(/enhanced/i.test(v.voiceURI+v.name))n+=' · '+t('vHQ');
 return n+(v.localService===false&&!/google/i.test(v.name)?' · '+t('vOnline'):'')}
function renderVoices(){const sel=$('voiceSel');if(!sel)return;
 const seen=new Set(),vs=[...KOV].sort((a,b)=>(/google/i.test(b.name)-/google/i.test(a.name))).filter(v=>{const k=voiceLabel(v);if(seen.has(k))return false;seen.add(k);return true});
 sel.innerHTML=`<option value="">${esc(t('vAuto'))}</option><option value="low1">${esc(t('vLow1'))}</option><option value="low2">${esc(t('vLow2'))}</option>`+(maleReal?`<option value="male">${esc(t('vMale'))}</option>`:'')+`<option value="gt">${esc(t('vGT'))}</option>`
  +vs.map(v=>`<option value="${esc(v.voiceURI)}">${esc(voiceLabel(v))}</option>`).join('');
 if(S.voice==='male'&&!maleReal)S.voice='low2';
 sel.value=(['gt','low1','low2'].includes(S.voice)||(S.voice==='male'&&maleReal)||vs.some(v=>v.voiceURI===S.voice))?S.voice:''}
try{pickVoice();speechSynthesis.onvoiceschanged=pickVoice;setTimeout(pickVoice,800)}catch(e){}
// Google Çeviri sesi (internet gerekir; olmazsa cihaz sesine döner)
const GTA=new Audio();GTA.preload='auto';try{GTA.referrerPolicy='no-referrer';GTA.crossOrigin=null}catch(e){}
let gtUnlocked=false;
const SILENT=(()=>{const n=800,b=new ArrayBuffer(44+n),d=new DataView(b),w=(o,t)=>{for(let k=0;k<t.length;k++)d.setUint8(o+k,t.charCodeAt(k))};
 w(0,'RIFF');d.setUint32(4,36+n,true);w(8,'WAVE');w(12,'fmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,1,true);d.setUint32(24,8000,true);d.setUint32(28,8000,true);d.setUint16(32,1,true);d.setUint16(34,8,true);w(36,'data');d.setUint32(40,n,true);for(let k=0;k<n;k++)d.setUint8(44+k,128);
 return URL.createObjectURL(new Blob([b],{type:'audio/wav'}))})();
document.addEventListener('pointerdown',()=>{if(gtUnlocked)return;gtUnlocked=true;
 try{GTA.src=SILENT;GTA.play().catch(()=>{})}catch(e){}
 try{if(!GDA.src||GDA.src===location.href){GDA.src=SILENT;GDA.play().catch(()=>{})}}catch(e){}},{capture:true});
// iOS ses motorunu önceden ısıt: ilk dokunuşta sessiz kısa okuma (ilk kelimede gecikme olmasın)
let ttsWarm=false;function ttsWarmUp(){if(ttsWarm)return;ttsWarm=true;try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;u.lang='ko-KR';if(voice)u.voice=voice;speechSynthesis.speak(u)}catch(e){}}
document.addEventListener('pointerdown',()=>ttsWarmUp(),{capture:true,once:true});
// basılan hoparlör düğmesi: ses bitene kadar dalgalar oynar
let sayBtn=null,sayPoll=null;
function sayOn(btn){if(sayBtn)sayBtn.classList.remove('on');sayBtn=btn;btn.classList.add('on');clearInterval(sayPoll);const t0=performance.now();
 sayPoll=setInterval(()=>{const el=performance.now()-t0;if(el>8000||(el>700&&!voiceBusy())){clearInterval(sayPoll);btn.classList.remove('on');if(sayBtn===btn)sayBtn=null}},150)}
document.addEventListener('click',e=>{const b=e.target.closest('.say');if(b)sayOn(b)},true);
let ttsT=null;function ttsWait(on){clearTimeout(ttsT);document.body.classList.toggle('tts-wait',on);if(on)ttsT=setTimeout(()=>document.body.classList.remove('tts-wait'),2500)}
function speakDevice(text,male){
 if(speechSynthesis.speaking||speechSynthesis.pending)speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';
 const v=male?(maleReal||voice):voice;if(v)u.voice=v;
 const r=+S.rate||1;u.rate=r;
 u.pitch=male?(maleReal?1:.65):S.voice==='low1'?.8:S.voice==='low2'?.62:(v&&FEMALE.test(v.name)||S.voice)?1:1.15;
 window.__utt=u;BGM.duck(true);ttsWait(true);u.onstart=()=>ttsWait(false);u.onend=u.onerror=()=>{if(window.__utt===u)window.__utt=null;ttsWait(false);BGM.duck(false)};speechSynthesis.speak(u)}
function speakGT(text){
 try{if(speechSynthesis.speaking)speechSynthesis.cancel()}catch(e){}
 let done=false;const fail=()=>{if(done)return;done=true;BGM.duck(false);try{speakDevice(text,false)}catch(e){}};
 GTA.onended=()=>{done=true;BGM.duck(false)};GTA.onerror=fail;
 const src='https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ko&q='+encodeURIComponent(text.slice(0,190));
 if(GTA.src===src&&GTA.readyState>=2){try{GTA.currentTime=0}catch(e){}}else GTA.src=src;
 const r=+S.rate||1;try{GTA.preservesPitch=true;GTA.playbackRate=Math.max(.35,r)}catch(e){}
 BGM.duck(true);const p=GTA.play();if(p&&p.catch)p.catch(fail)}
function speak(text,force){
 if(!S.auto&&!force)return;lastSpeak=performance.now();
 try{try{GTA.pause()}catch(e){}
  if(S.voice==='gt'&&navigator.onLine!==false)speakGT(text);else speakDevice(text,S.voice==='male')}catch(e){}
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
// Uygulama içi tarayıcıdan (KakaoTalk, Instagram…) otomatik olarak Chrome'a geç (bir kez)
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
if(inApp&&!standalone&&(isAndroid||/KAKAOTALK/i.test(ua))){
 let tried=false;try{tried=sessionStorage.getItem('toChrome')==='1';sessionStorage.setItem('toChrome','1')}catch(e){}
 if(!tried)setTimeout(()=>{location.href=$('openChrome').href},300);
}
// Ana ekrana ekleme
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('bInstall').hidden=false});
$('bInstall').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice.catch(()=>{});deferredPrompt=null;$('bInstall').hidden=true};
if(standalone)$('a2hs').hidden=true;

// ---------- başlat ----------
S.level=Math.max(S.level,levelOf(S.xp));
applyLang();

$('iScene').innerHTML=sceneSVG(1);$('iMascot').innerHTML=art();
/* ── 오프닝 안내 (덩이의 소개) ── */
const GD={"tr": {"ui": {"skip": "Geç ›", "tap": "dokun ›", "start": "Başla! 🌱", "l1": "başlangıç", "l2": "orta", "l3": "ileri", "soon": "yakında!", "sun": "gün · güneş"}, "s": [["hello", "Herkese merhaba! <b>덩어리숲</b>'a hoş geldiniz!", "jump"], ["wonju", "<b>덩어리숲</b>, Türkiye'de yaşayan ve Korece öğrenmeye gönül vermiş herkes için <b>Wonju</b> tarafından oluşturulmuş bir Korece öğrenme uygulamasıdır.", "wave"], ["roof", "<b>Korece öğrenme yolculuğunuzda ihtiyaç duyabileceğiniz her şey, tek bir çatı altında!</b> Bu mottoyla yola çıkarak uygulamamızdaki içerikleri farklı öğrenme amaçlarına göre kategorilere ayırdık.", "squish"], ["levels", "Koreceye yeni başlayanlar ve hobi olarak öğrenenler için <b>A1-A2, B1-B2</b> ve <b>C1-C2</b> seviyelerinde kelime çalışmaları hazırladık. (C1-C2 çok yakında!)", "bounce"], ["topik", "TOPIK sınavına hazırlananlar, Kore'de eğitim almak veya iş hayatında Koreceyi kullanmak isteyenler için ise <b>TOPIK I (1-2급)</b> ve <b>TOPIK II (3-6급)</b> kelime kategorilerini oluşturduk.", "jump"], ["hanja", "Ayrıca, ileri seviyede Korece öğrenmek ve TOPIK II'de 5. ve 6. seviyelere ulaşmak isteyenler için <b>Hanja (한자)</b> çalışmalarına da yer verdik.", "wiggle"], ["grow", "Üstelik içeriklerimiz <b>sürekli güncelleniyor</b> ve her geçen gün geliştiriliyor.", "spin"], ["all", "Korece öğrenmek için ihtiyaç duyabileceğiniz bu kadar kapsamlı içeriği daha önce bir arada görmüş müydünüz?", "wave"], ["end", "Şimdi keşfetme sırası sizde! Korece öğrenme yolculuğunuzda yeni yol arkadaşınız: <b>덩어리숲</b>!", "spin"]]}, "ko": {"ui": {"skip": "건너뛰기 ›", "tap": "터치 ›", "start": "시작! 🌱", "l1": "입문", "l2": "중급", "l3": "고급", "soon": "곧 출시!", "sun": "날 · 해"}, "s": [["hello", "여러분 안녕하세요. <b>덩어리숲</b>에 오신 것을 환영합니다.", "jump"], ["wonju", "<b>덩어리숲</b>은 튀르키예에 살면서 한국어 공부에 마음을 쏟는 모든 분들을 위해 제가 만든 한국어 학습 앱입니다.", "wave"], ["roof", "<b>한국어 공부 여정에 필요한 모든 것을 한곳에 넣었습니다.</b> 이 모토로 출발해서 앱의 내용을 학습 목적에 따라 나눴어요.", "squish"], ["levels", "한국어를 처음 시작하거나 취미로 배우는 분들을 위해 <b>A1, A2, B1, B2, C1, C2</b> 단어를 준비했습니다. (C1, C2는 곧 업데이트돼요!)", "bounce"], ["topik", "TOPIK을 준비하거나 한국에서 공부하고 일하고 싶은 분들을 위해 <b>TOPIK Ⅰ</b>과 <b>TOPIK Ⅱ</b> 단어를 만들었어요.", "jump"], ["hanja", "고급 한국어를 배우고 TOPIK Ⅱ 5, 6급을 목표로 하는 분들을 위해 <b>한자</b> 공부도 넣었습니다.", "wiggle"], ["grow", "게다가 내용은 계속 업데이트될 거고요. 날마다 저희가 개선하고 수정하고 있습니다.", "spin"], ["all", "한국어 공부에 필요한 이렇게 풍부한 내용을 한곳에서 보기가 쉽지 않거든요. 특히 튀르키예어로 된 자료는 많이 없을 거예요.", "wave"], ["end", "자, 이제 여러분이 한국어 탐험을 할 차례입니다. 한국어 여정의 친구가 되어 드리겠습니다. <b>덩어리숲!</b>", "spin"]]}};
let gdLang=null;
const gdT=()=>GD[gdLang]||GD[S.lang]||GD[Object.keys(GD)[0]];
/* 음성 나레이션: audio/guide/<언어>/01.mp3 … 09.mp3 를 올린 뒤 해당 언어를 true 로 바꾸세요. */
const GD_VOICE={tr:true,ko:true}; // tr: Aslı'nın sesi, ko: Wonju'nun sesi (a=6)
const GDA=new Audio();GDA.preload='auto';let gdAuto=null;
function gdStopVoice(){clearTimeout(gdAuto);try{GDA.pause()}catch(e){}GDA.onended=GDA.onerror=GDA.onloadedmetadata=null;BGM.duck(false)}
const GDPRE={};function gdPre(i){const g=gdT();if(i>=g.s.length)return;const src=`audio/guide/${gdLang}/${String(i+1).padStart(2,'0')}.mp3?a=6`;if(!GDPRE[src]){const a=new Audio();a.preload='auto';a.src=src;GDPRE[src]=a}}
function gdVoice(n,len){
 gdStopVoice();if(!GD_VOICE[gdLang]||S.gdMute)return 26;
 GDA.src=`audio/guide/${gdLang}/${String(n+1).padStart(2,'0')}.mp3?a=6`;
 GDA.onended=()=>{BGM.duck(false);const g=gdT();if(gdI===n&&n<g.s.length-1)gdAuto=setTimeout(()=>{if(gdI===n&&!$('guide').hidden){gdFinishType();gdShow(n+1)}},1400)};
 GDA.onerror=()=>BGM.duck(false);
 GDA.onloadedmetadata=()=>{if(isFinite(GDA.duration)&&gdI===n)gdSpeed=Math.max(18,Math.min(90,GDA.duration*1000*.85/Math.max(1,len)))};
 BGM.duck(true);const pr=GDA.play();if(pr&&pr.catch)pr.catch(()=>BGM.duck(false));
 gdPre(n+1);
 return 40;
}
let gdSpeed=26;
let gdI=0,gdTy=null,gdFull='',gdDone=null,gdBusy=false;
function gdAct(kind){
 const m=$('gdM');if(!m)return;const acts=['jump','spin','wiggle','squish','bounce','wave'];
 kind=kind||acts[Math.random()*acts.length|0];
 m.className='gm';void m.offsetWidth;
 if(kind==='jump'||kind==='spin'){m.classList.add('f-lift',kind==='spin'?'a-spin':'a-jump');setTimeout(()=>{m.classList.remove('f-lift');m.classList.add('f-land')},430);setTimeout(()=>{m.classList.remove('f-land');m.classList.add('happy')},620)}
 else{m.classList.add('a-'+kind,'happy')}
 clearTimeout(m._t);m._t=setTimeout(()=>{m.className='gm'+(gdTy?' talk':'')},1500);
}
function gdSparks(n){const ph=$('guide');for(let k=0;k<n;k++){const s=document.createElement('span');s.className='gsp';s.textContent=['✨','🌱','⭐','🍃'][k%4];s.style.left=(38+Math.random()*24)+'%';s.style.top=(58+Math.random()*10)+'%';s.style.setProperty('--x',(Math.random()*240-120)+'px');s.style.setProperty('--y',(-90-Math.random()*170)+'px');s.style.animationDelay=(k*.05)+'s';ph.appendChild(s);setTimeout(()=>s.remove(),2400)}}
function gdVis(v){
 const g=gdT(),st=$('gdStage');st.innerHTML='<div class="gvis"></div>';const box=st.firstChild;
 const add=(h,d=0)=>{const e=document.createElement('div');e.className='gpop';e.style.animationDelay=d+'s';e.innerHTML=h;box.appendChild(e);return e};
 if(v==='hello')gdSparks(10);
 if(v==='wonju')add(`<div class="gcard gwj"><span class="gheart">💚</span><b>덩어리숲</b><small>by Wonju</small></div>`);
 if(v==='roof')add(`<div class="groof"><svg viewBox="0 0 250 170"><path d="M15 80L125 12L235 80" fill="none" stroke="#a5523a" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><rect x="30" y="74" width="190" height="92" rx="12" fill="#fffaf1" stroke="#e2c3a4" stroke-width="3"/><circle cx="125" cy="52" r="9" fill="#f2b134"/></svg><div class="gin"><span>A1–C2</span><span>TOPIK Ⅰ</span><span>TOPIK Ⅱ</span><span>漢字</span></div></div>`);
 if(v==='levels'){add(`<div class="gcard glv">A1–A2<small>${g.ui.l1}</small></div>`,.1);add(`<div class="gcard glv">B1–B2<small>${g.ui.l2}</small></div>`,.4);add(`<div class="gcard glv gsoon">C1–C2<small>${g.ui.l3}</small><i>${g.ui.soon}</i></div>`,.7)}
 if(v==='topik'){add('<div class="gcard gtk"><b>TOPIK Ⅰ</b><span>1–2급</span></div>',.1);add('<div class="gcard gtk"><b>TOPIK Ⅱ</b><span>3–6급</span></div>',.45)}
 if(v==='hanja')add(`<div class="gflip"><div class="gf"><div>日</div><div class="gb">${g.ui.sun}<small>일 (날, 해)</small></div></div></div>`);
 if(v==='grow'){const pet=S.pet||'petal';add(`<div class="ggrow"><div class="gp">${art(1,pet,'','')}</div><span class="gar">›</span><div class="gp">${art(3,pet,'','')}</div><span class="gar">›</span><div class="gp">${art(7,pet,'','')}</div><span class="gar">›</span><div class="gp gbig">${art(12,pet,S.route||(pet==='petal'?'sunflower':''),'')}</div></div>`);[...box.querySelectorAll('.ggrow>*')].forEach((e,k)=>{e.classList.add('gpop');e.style.animationDelay=(.15+k*.3)+'s'})}
 if(v==='all'){['A1–A2','B1–B2','C1–C2','TOPIK Ⅰ','TOPIK Ⅱ','漢字','짝꿍어휘','🌱'].forEach((x,k)=>add(`<span class="gtag">${x}</span>`,.08*k))}
 if(v==='end')gdSparks(16);
 $('gdGo').hidden=v!=='end';
}
function gdType(h){
 clearInterval(gdTy);const b=$('gdBub'),t=$('gdTxt'),m=$('gdM');b.classList.remove('done');gdFull=h;
 const parts=h.split(/(<[^>]+>)/).filter(Boolean);let out='',pi=0,ci=0;m.classList.add('talk');
 gdTy=setInterval(()=>{
  while(pi<parts.length&&parts[pi].startsWith('<')){out+=parts[pi];pi++}
  if(pi>=parts.length){clearInterval(gdTy);gdTy=null;t.innerHTML=gdFull;b.classList.add('done');m.classList.remove('talk');return}
  out+=parts[pi][ci++];if(ci>=parts[pi].length){pi++;ci=0}
  t.innerHTML=out+'<span class="gcur">▍</span>';
 },gdSpeed);
}
function gdFinishType(){if(gdTy){clearInterval(gdTy);gdTy=null;$('gdTxt').innerHTML=gdFull;$('gdBub').classList.add('done');$('gdM').classList.remove('talk')}}
function gdShow(n){
 const g=gdT();gdI=n;[...$('gdDots').children].forEach((d,k)=>d.classList.toggle('on',k===gdI));
 const [v,txt,act]=g.s[gdI];gdVis(v);gdSpeed=gdVoice(gdI,txt.replace(/<[^>]+>/g,'').length);gdType(txt);setTimeout(()=>gdAct(act),120);
}
function gdApplyLang(){const g=gdT();$('gdLang').innerHTML=Object.keys(GD).map(k=>`<button data-gl="${k}" class="${k===gdLang?'on':''}">${k==='ko'?'한':k.toUpperCase()}</button>`).join('');$('gdMute').textContent=S.gdMute?'🔇':'🔊';$('gdMute').hidden=!GD_VOICE[gdLang];$('gdSkip').textContent=g.ui.skip;$('gdNext').textContent=g.ui.tap;$('gdGoB').textContent=g.ui.start;$('gdDots').innerHTML=g.s.map(()=>'<i></i>').join('')}
function openGuide(done){try{document.querySelector('#gdBub .gname').textContent=PN()}catch(e){}
 gdDone=done||null;gdLang=GD[S.lang]?S.lang:Object.keys(GD)[0];$('gdScene').innerHTML=sceneSVG(1);$('gdM').innerHTML=art();gdApplyLang();$('guide').hidden=false;requestAnimationFrame(()=>$('guide').classList.add('in'));gdShow(0);
}
function closeGuide(){
 if($('guide').hidden)return;clearInterval(gdTy);gdTy=null;gdStopVoice();S.guideSeen=true;save();
 $('guide').classList.remove('in');setTimeout(()=>{$('guide').hidden=true;$('gdStage').innerHTML='';const f=gdDone;gdDone=null;if(f)f()},350);
}
$('guide').addEventListener('click',e=>{
 if(e.target.closest('#gdSkip'))return closeGuide();
 const gl=e.target.closest('[data-gl]');if(gl){gdLang=gl.dataset.gl;gdApplyLang();gdShow(gdI);return}
 if(e.target.closest('#gdMute')){S.gdMute=!S.gdMute;save();gdApplyLang();if(S.gdMute)gdStopVoice();else gdShow(gdI);return}
 if(e.target.closest('#gdGo'))return closeGuide();
 if(e.target.closest('#gdMw')){gdAct();return}
 if(gdTy){clearInterval(gdTy);gdTy=null;$('gdTxt').innerHTML=gdFull;$('gdBub').classList.add('done');$('gdM').classList.remove('talk');return}
 clearTimeout(gdAuto);const g=gdT();if(gdI<g.s.length-1)gdShow(gdI+1);
});
document.addEventListener('keydown',e=>{if($('guide').hidden)return;if(e.key==='Escape')closeGuide();else if(e.key==='Enter'||e.key===' '||e.key==='ArrowRight'){e.preventDefault();$('guide').click()}});
$('bGuide').onclick=()=>{$('mSet').hidden=true;openGuide(()=>{})};

let introDone=false;
function closeIntro(){if(introDone)return;introDone=true;$('intro').classList.add('out');BGM.start();setTimeout(()=>{$('intro').remove();if(location.hash==='#kontrol')openReview();else openGuide(()=>{$('mWel').hidden=false})},550)}
$('intro').addEventListener('click',closeIntro);
document.addEventListener('keydown',e=>{if(!introDone){e.preventDefault();closeIntro()}},{capture:true});
$('intro').focus();
// lobi alt bilgisi: telif · sürüm · güncelleme tarihi (dokununca yenilikler)
function renderFoot(){const f=$('hFoot');if(!f||!NOTES.length)return;f.textContent=`© 2026 Wonju Kim (원주) · v${NOTES[0][0]} · ${NOTES[0][1].replace(/-/g,'.')}`}
renderFoot();$('hFoot').onclick=()=>$('bNotes').click();
// kaydırma, yakınlaştırma ve kopyalama engeli (yazı alanları hariç)
{const ed=el=>el&&el.closest&&el.closest('input,textarea,select,[contenteditable]');
 const scrollable=el=>{for(;el&&el!==document.body;el=el.parentElement){const cs=getComputedStyle(el),o=cs.overflowY,ox=cs.overflowX;if(((o==='auto'||o==='scroll')&&el.scrollHeight>el.clientHeight+1)||((ox==='auto'||ox==='scroll')&&el.scrollWidth>el.clientWidth+1))return true}return false};
 ['gesturestart','gesturechange','gestureend'].forEach(ev=>document.addEventListener(ev,e=>e.preventDefault(),{passive:false}));
 document.addEventListener('touchmove',e=>{if(e.touches.length>1||(!scrollable(e.target)&&!ed(e.target)))e.preventDefault()},{passive:false});
 document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});
 ['contextmenu','copy','cut','dragstart','selectstart'].forEach(ev=>document.addEventListener(ev,e=>{if(!ed(e.target))e.preventDefault()}));
 document.addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['+','-','=','0'].includes(e.key))e.preventDefault()});}
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
}
