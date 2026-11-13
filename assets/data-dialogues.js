/* 第四篇 · 场景对话数据（10 个生活场景） */
const SCENES = [
  {t:"茶楼饮茶", s:"周六朝早，同朋友去老字号茶楼「一盅两件」。广州社交从一壶茶开始。", l:[
    {w:"伙计", y:"欢迎光临，几位呀？", j:"fun1 jing4 gwong1 lam4, gei2 wai2 aa3", m:"欢迎光临，几位？"},
    {w:"你", y:"两位，唔该。", j:"loeng5 wai2, m4 goi1", m:"两位，谢谢。"},
    {w:"伙计", y:"入面请，呢张台得唔得？", j:"jap6 min6 ceng2, ni1 zoeng1 toi2 dak1 m4 dak1", m:"里面请，这张桌子行吗？"},
    {w:"你", y:"得，唔该。", j:"dak1, m4 goi1", m:"行，谢谢。"},
    {w:"伙计", y:"饮啲乜嘢茶？普洱定菊花？", j:"jam2 di1 mat1 je5 caa4, pou2 nei5 ding6 guk1 faa1", m:"喝什么茶？普洱还是菊花？"},
    {w:"你", y:"一壶普洱。唔该再嚟一笼虾饺同烧卖。", j:"jat1 wu4 pou2 nei5, m4 goi1 zoi3 lai4 jat1 lung4 haa1 gaau2 tung4 siu1 maai6", m:"一壶普洱。再来一笼虾饺和烧卖。"},
    {w:"伙计", y:"好，马上到。", j:"hou2, maa3 soeng6 dou3", m:"好，马上来。"},
    {w:"（食完）你", y:"唔该，埋单！", j:"m4 goi1, maai4 daan1", m:"服务员，结账！"},
    {w:"伙计", y:"一共八十八蚊。", j:"jat1 gung6 baat3 sap6 baat3 man1", m:"一共八十八块。"},
    {w:"你", y:"畀你，唔使找。", j:"bei2 nei5, m4 sai2 zaau2", m:"给你，不用找了。"},
    {w:"伙计", y:"多谢晒，慢行，下次再嚟。", j:"do1 ze6 saai3, maan6 haang4, haa6 ci3 zoi3 lai4", m:"多谢，慢走，下次再来。"}
  ]},
  {t:"早餐店食肠粉", s:"楼下肠粉店。广州人的一天，由一碟肠粉加一碗粥开始。", l:[
    {w:"老板", y:"食乜嘢呀？", j:"sik6 mat1 je5 aa3", m:"吃什么？"},
    {w:"你", y:"一份牛肉肠，同埋艇仔粥。", j:"jat1 fan6 ngau4 juk6 coeng2, tung4 maai4 teng5 zai2 zuk1", m:"一份牛肉肠粉，还有艇仔粥。"},
    {w:"老板", y:"喺度食定攞走呀？", j:"hai2 dou6 sik6 ding6 lo2 zau2 aa3", m:"在这儿吃还是带走？"},
    {w:"你", y:"喺度食。唔该帮我加少少酱油。", j:"hai2 dou6 sik6, m4 goi1 bong1 ngo5 gaa1 siu2 siu2 zoeng3 jau4", m:"在这儿吃。麻烦帮我加一点酱油。"},
    {w:"老板", y:"得。仲要唔要豆浆？", j:"dak1, zung6 jiu3 m4 jiu3 dung6 zaang1", m:"行。还要不要豆浆？"},
    {w:"你", y:"唔使喇，就咁多。", j:"m4 sai2 laa3, zau6 gam3 do1", m:"不用了，就这些。"},
    {w:"老板", y:"好，坐低等一阵。", j:"hou2, co5 dai1 dang2 jat1 zan6", m:"好，坐下稍等。"},
    {w:"（食完）你", y:"老板，埋单，几多钱？", j:"lou5 baan2, maai4 daan1, gei2 do1 cin2", m:"老板，结账，多少钱？"},
    {w:"老板", y:"廿五蚊。", j:"jaa6 ng5 man1", m:"二十五块。"}
  ]},
  {t:"菜市场买菜", s:"下昼去街市。讲价由「平啲啦」开始，街市是最快学会讲粤语的地方。", l:[
    {w:"你", y:"老板，菜心点卖呀？", j:"lou5 baan2, coi3 sam1 dim2 maai6 aa3", m:"老板，菜心怎么卖？"},
    {w:"老板", y:"五蚊一斤。", j:"ng5 man1 jat1 gan1", m:"五块一斤。"},
    {w:"你", y:"平啲啦，四蚊得唔得？", j:"peng4 di1 laa1, sei3 man1 dak1 m4 dak1", m:"便宜点，四块行不行？"},
    {w:"老板", y:"好啦好啦，开张畀你。", j:"hou2 laa3 hou2 laa3, hoi1 zoeng1 bei2 nei5", m:"好啦好啦，开张生意让给你。"},
    {w:"你", y:"再要一条鲩鱼，唔该帮我劏好佢。", j:"zoi3 jiu3 jat1 tiu4 waan6 jyu2, m4 goi1 bong1 ngo5 tong1 hou2 keoi5", m:"再要一条鲩鱼，麻烦帮我处理好。"},
    {w:"老板", y:"冇问题。仲要啲乜嘢？", j:"mou5 man6 tai4, zung6 jiu3 di1 mat1 je5", m:"没问题。还要些什么？"},
    {w:"你", y:"就咁多，唔该晒。", j:"zau6 gam3 do1, m4 goi1 saai3", m:"就这些，多谢。"},
    {w:"老板", y:"一共五十蚊。", j:"jat1 gung6 ng5 sap6 man1", m:"一共五十块。"},
    {w:"你", y:"畀你。", j:"bei2 nei5", m:"给你。"},
    {w:"老板", y:"慢行，听日再嚟。", j:"maan6 haang4, ting1 jat6 zoi3 lai4", m:"慢走，明天再来。"}
  ]},
  {t:"地铁问路", s:"第一次坐广州地铁。站务员一般都会中英双语，但讲粤语更亲切。", l:[
    {w:"你", y:"唔该，请问呢个站去唔去到体育西路？", j:"m4 goi1, ceng2 man6 ni1 go3 zaam6 heoi3 m4 heoi3 dou3 tai2 juk6 sai1 lou6", m:"请问这趟车到不到体育西路？"},
    {w:"职员", y:"去到嘅。你搭三号线，往番禺方向，五个站就到。", j:"heoi3 dou3 ge3, nei5 daap3 saam1 sin6 hou2, wong5 pun1 jyu4 fong1 hoeng3, ng5 go3 zaam6 zau6 dou3", m:"到的。你坐三号线，往番禺方向，五站就到。"},
    {w:"你", y:"要唔要转车呀？", j:"jiu3 m4 jiu3 zyun3 ce1 aa3", m:"需要换乘吗？"},
    {w:"职员", y:"唔使，直达。落车之后跟住「出口」指示行。", j:"m4 sai2, zik6 daat6, lok6 ce1 zi1 hau6 gan1 zyu6 ced1 hau2 zi2 si3 haang4", m:"不用，直达。下车后跟着「出口」指示走。"},
    {w:"你", y:"边个出口出呀？", j:"bin1 go3 ced1 hau2 ced1 aa3", m:"从哪个出口出去？"},
    {w:"职员", y:"C 出口，出嚟行两分钟就系。", j:"si1 ced1 hau2, ced1 lai4 haang4 loeng5 fan1 zung1 zau6 hai6", m:"C 出口，出来走两分钟就是。"},
    {w:"你", y:"唔该晒！", j:"m4 goi1 saai3", m:"多谢！"},
    {w:"职员", y:"唔使客气，慢行。", j:"m4 sai2 haak3 hei3, maan6 haang4", m:"不客气，慢走。"}
  ]},
  {t:"搭嘅士", s:"从北京路搭嘅士去天河。广州的士师傅健谈，是免费口语陪练。", l:[
    {w:"你", y:"师傅，唔该去天河正佳广场。", j:"si1 fu2, m4 goi1 heoi3 tin1 ho4 zing3 gaai1 gwong2 coeng4", m:"师傅，麻烦去天河正佳广场。"},
    {w:"司机", y:"好嘅，扣好安全带。", j:"hou2 ge3, kau1 hou2 on1 cyun4 daai3", m:"好的，系好安全带。"},
    {w:"你", y:"大概几耐呀？", j:"daai6 koi3 gei2 noi6 aa3", m:"大概要多久？"},
    {w:"司机", y:"唔塞车就二十分钟。呢排到处都修路，冇计。", j:"m4 sak1 ce1 zau6 ji6 sap6 fan1 zung1, ni1 paai4 dou3 cyu3 dou1 sau1 lou6, mou5 gai3", m:"不堵车就二十分钟。最近到处修路，没办法。"},
    {w:"你", y:"前面路口转左，唔该。", j:"cin4 min6 lou6 hau2 zyun3 zo2, m4 goi1", m:"前面路口左转，麻烦了。"},
    {w:"司机", y:"得。你系本地人定游客呀？", j:"dak1, nei5 hai6 bun2 dei6 jan4 ding6 jau4 haak3 aa3", m:"行。你是本地人还是游客？"},
    {w:"你", y:"我啱啱搬嚟广州，识听少少粤语。", j:"ngo5 ngaam1 ngaam1 bun6 lai4 gwong2 zau1, sik1 ting1 siu2 siu2 jyut6 jyu5", m:"我刚搬来广州，会听一点粤语。"},
    {w:"司机", y:"咁叻！学得快嘅。就喺呢度落车得唔得？", j:"gam3 lek1, hok6 dak1 faai3 ge3, zau6 hai2 ni1 dou6 lok6 ce1 dak1 m4 dak1", m:"厉害！学得快。在这儿下车行吗？"},
    {w:"你", y:"得，就呢度。师傅，几多钱？", j:"dak1, zau6 ni1 dou6, si1 fu2, gei2 do1 cin2", m:"行，就这儿。师傅，多少钱？"},
    {w:"司机", y:"三十六蚊。", j:"saam1 sap6 luk6 man1", m:"三十六块。"},
    {w:"你", y:"畀你，唔使找。", j:"bei2 nei5, m4 sai2 zaau2", m:"给你，不用找了。"},
    {w:"司机", y:"多谢老板，慢行。", j:"do1 ze6 lou5 baan2, maan6 haang4", m:"谢谢老板，慢走。"}
  ]},
  {t:"商场买衫", s:"周末去北京路买件外套。试衫、讲价、埋单一整套流程。", l:[
    {w:"店员", y:"欢迎光临，想睇啲乜嘢？", j:"fun1 jing4 gwong1 lam4, soeng2 tai2 di1 mat1 je5", m:"欢迎光临，想看点什么？"},
    {w:"你", y:"我想买件褛，呢个码数啱唔啱身？", j:"ngo5 soeng2 maai5 gin6 lau1, ni1 go3 maa5 sou3 ngaam1 m4 ngaam1 san1", m:"我想买件外套，这个尺码合不合身？"},
    {w:"店员", y:"你先试下，试身室喺嗰边。", j:"nei5 sin1 si3 haa5, si3 san1 sat1 hai2 go2 bin1", m:"你先试试，试衣间在那边。"},
    {w:"你", y:"（着完）有冇大一个码呀？", j:"zoek3 jyun4, jau5 mou5 daai6 jat1 go3 maa5 aa3", m:"（穿完）有没有大一号的？"},
    {w:"店员", y:"有，呢件啱身啲。依家买仲有八折。", j:"jau5, ni1 gin6 ngaam1 san1 di1, ji4 gaa1 maai5 zung6 jau5 baat3 zit3", m:"有，这件合身一点。现在买还有八折。"},
    {w:"你", y:"几多钱？", j:"gei2 do1 cin2", m:"多少钱？"},
    {w:"店员", y:"打完折三百九。", j:"daa2 jyun4 zit3 saam1 baak3 gau2 sap6", m:"打完折三百九十。"},
    {w:"你", y:"咁要啦。唔该帮我包起佢，我想送礼。", j:"gam3 jiu3 laa1, m4 goi1 bong1 ngo5 baau1 hei2 keoi5, ngo5 soeng2 sung3 lai5", m:"那要了。麻烦帮我包起来，我想送礼。"},
    {w:"店员", y:"冇问题，呢边埋单。", j:"mou5 man6 tai4, ni1 bin1 maai4 daan1", m:"没问题，这边结账。"},
    {w:"你", y:"唔该晒，唔使袋。", j:"m4 goi1 saai3, m4 sai2 doi6", m:"多谢，不用袋子。"}
  ]},
  {t:"睇医生", s:"感冒去社区医院。挂号、问诊、攞药，句句都用得上。", l:[
    {w:"你", y:"医生，我呢两日咳得好犀利，仲发烧。", j:"ji1 sang1, ngo5 ni1 loeng5 jat6 kat3 dak1 hou2 sai1 lei6, zung6 faat3 siu1", m:"医生，我这两天咳得厉害，还发烧。"},
    {w:"医生", y:"几时开始㗎？有冇喉咙痛？", j:"gei2 si4 hoi1 ci2 gaa3, jau5 mou5 hau4 lung4 tung3", m:"什么时候开始的？喉咙痛不痛？"},
    {w:"你", y:"寻晚开始，喉咙仲好痛，吞口水都痛。", j:"cam4 maan5 hoi1 ci2, hau4 lung4 zung6 hou2 tung3, tan1 hau2 seoi2 dou1 tung3", m:"昨晚开始，喉咙还很痛，咽口水都痛。"},
    {w:"医生", y:"打开个口，讲声「啊——」。", j:"daa2 hoi1 go3 hau2, gong2 seng1 aa3", m:"张开嘴，说声「啊——」。"},
    {w:"你", y:"啊——", j:"aa3", m:"啊——"},
    {w:"医生", y:"喉咙发炎。食啲消炎药，多啲饮水，唔好食煎炸嘢。", j:"hau4 lung4 faat3 jim4, sik6 di1 siu1 jim4 joek6, do1 di1 jam2 seoi2, m4 hou2 sik6 zin1 zaa3 je5", m:"喉咙发炎。吃点消炎药，多喝水，别吃煎炸的东西。"},
    {w:"你", y:"要唔要打针呀？", j:"jiu3 m4 jiu3 daa2 zam1 aa3", m:"需要打针吗？"},
    {w:"医生", y:"唔使，食药就得。三日后再嚟覆诊。", j:"m4 sai2, sik6 joek6 zau6 dak1, saam1 jat6 hau6 zoi3 lai4 fuk1 zan1", m:"不用，吃药就行。三天后再来复诊。"},
    {w:"你", y:"好，唔该医生。", j:"hou2, m4 goi1 ji1 sang1", m:"好，谢谢医生。"},
    {w:"医生", y:"唔使客气，早啲瞓，多啲休息。", j:"m4 sai2 haak3 hei3, zou2 di1 fan3, do1 di1 jau1 sik1", m:"不客气，早点睡，多休息。"}
  ]},
  {t:"租楼睇楼", s:"通过中介租房。租金、押金、管理费，签约前问清楚。", l:[
    {w:"你", y:"你好，我喺网上见到你放盘，想约睇楼。", j:"nei5 hou2, ngo5 hai2 mong5 soeng6 gin3 dou3 nei5 fong3 pun2, soeng2 joek3 tai2 lau4", m:"你好，我在网上看到你发的房源，想约看房。"},
    {w:"中介", y:"好啊。间屋喺八楼，两房一厅，家私电器齐全。", j:"hou2 aa3, gaan1 uk1 hai2 baat3 lau4, loeng5 fong2 jat1 teng1, gaa1 si1 din6 hei3 cai4 cyun4", m:"好啊。房子在八楼，两房一厅，家具电器齐全。"},
    {w:"你", y:"租金几多呀？", j:"zyun1 gam1 gei2 do1 aa3", m:"租金多少？"},
    {w:"中介", y:"三千八一个月，押金两个月。", j:"saam1 cin1 baat3 jat1 go3 jyut6, aat3 gam1 loeng5 go3 jyut6", m:"三千八一个月，押金两个月。"},
    {w:"你", y:"包唔包管理费呀？", j:"baau1 m4 baau1 gun2 lei5 fai3 aa3", m:"包不包物业费？"},
    {w:"中介", y:"包。水电、网络费就自己交。", j:"baau1, seoi2 din6, mong5 lou6 fai3 zau6 zi6 gei2 gaau1", m:"包。水电、网费自己交。"},
    {w:"你", y:"几时可以入伙呀？", j:"gei2 si4 ho2 ji5 jap6 fo2 aa3", m:"什么时候可以入住？"},
    {w:"中介", y:"下个月一号。你落咗定，我帮你留起。", j:"haa6 go3 jyut6 jat1 hou6, nei5 lok6 zo2 ding6, ngo5 bong1 nei5 lau4 hei2", m:"下个月一号。你付了定金，我帮你留着。"},
    {w:"你", y:"好，我谂多一日先答复你。", j:"hou2, ngo5 nam2 do1 jat1 jat6 sin1 daap3 fuk1 nei5", m:"好，我想一天再答复你。"}
  ]},
  {t:"返工日常", s:"第一天上班。同事之间的问候、交接与求助。", l:[
    {w:"同事", y:"早晨！食咗早餐未呀？", j:"zou2 san4, sik6 zo2 zou2 caan1 mei6 aa3", m:"早！吃早餐了吗？"},
    {w:"你", y:"早晨！食咗啦，你呢？", j:"zou2 san4, sik6 zo2 laa3, nei5 ne1", m:"早！吃了，你呢？"},
    {w:"同事", y:"未呀，阵间落楼买个包。今日有咩要做？", j:"mei6 aa3, zan6 gaan1 lok6 lau2 maai5 go3 baau1, gam1 jat6 jau5 mat1 zou6", m:"还没，待会儿下楼买个包子。今天有什么要做的？"},
    {w:"你", y:"朝早十点开会，倾新项目嘅进度。", j:"ziu1 zou2 sap6 dim2 hoi1 wui6, king1 san1 hang6 muk6 ge3 zeon3 dou6", m:"早上十点开会，聊新项目的进度。"},
    {w:"同事", y:"好。你头先嗰份报告整好未？", j:"hou2, nei5 tau4 sin1 go2 fan6 bou3 gou3 zing2 hou2 mei6", m:"好。你刚才那份报告弄好了吗？"},
    {w:"你", y:"整好喇，已经发咗畀老细。", j:"zing2 hou2 laa3, ji5 ging1 faat3 zo2 bei2 lou5 sai3", m:"弄好了，已经发给老板了。"},
    {w:"同事", y:"咁快？你真系叻！", j:"gam3 faai3, nei5 zan1 hai6 lek1", m:"这么快？你真能干！"},
    {w:"你", y:"唔好意思，想问下打印机点用呀？", j:"m4 hou2 ji3 si1, soeng2 man6 haa5 daa2 ban3 gei1 dim2 jung6 aa3", m:"不好意思，想问下打印机怎么用？"},
    {w:"同事", y:"嗰部坏咗，用茶水间嗰部啦。", j:"go2 bou6 waai6 zo2, jung6 caa4 seoi2 gaan1 go2 bou6 laa1", m:"那台坏了，用茶水间那台吧。"},
    {w:"你", y:"唔该晒！", j:"m4 goi1 saai3", m:"多谢！"}
  ]},
  {t:"街坊与物管", s:"新搬入小区，跟街坊打个招呼，顺便问清楚垃圾房和门禁。", l:[
    {w:"街坊", y:"早晨啊，出街呀？", j:"zou2 san4 aa3, ced1 gaai1 aa3", m:"早啊，出门？"},
    {w:"你", y:"系，去市场买啲餸。", j:"hai6, heoi3 si5 coeng4 maai5 di1 sung3", m:"是啊，去市场买点菜。"},
    {w:"街坊", y:"今日菜心好靓，快啲去啦，迟啲冇㗎喇。", j:"gam1 jat6 coi3 sam1 hou2 leng3, faai3 di1 heoi3 laa1, ci4 di1 mou5 gaa3 laa3", m:"今天菜心很好，快点去，晚了就没了。"},
    {w:"你", y:"系咩？唔好意思，想问下垃圾房喺边度呀？", j:"hai6 me1, m4 hou2 ji3 si1, soeng2 man6 haa5 laap6 sap6 fong2 hai2 bin1 dou6 aa3", m:"是吗？不好意思，想问下垃圾房在哪里？"},
    {w:"街坊", y:"行到尾，转右就系。朝早七点到晚上九点先开㗎。", j:"haang4 dou3 mei5, zyun3 jau6 zau6 hai6, ziu1 zou2 cat1 dim2 dou3 maan5 soeng6 gau2 dim2 sin1 hoi1 gaa3", m:"走到头，右转就是。早上七点到晚上九点才开。"},
    {w:"你", y:"明晒，唔该晒你！", j:"ming4 saai3, m4 goi1 saai3 nei5", m:"明白了，多谢你！"},
    {w:"街坊", y:"唔使客气，得闲上嚟饮茶。", j:"m4 sai2 haak3 hei3, dak1 haan4 soeng5 lai4 jam2 caa4", m:"不客气，有空上来喝茶。"},
    {w:"你", y:"一定一定，拜拜！", j:"jat1 ding6 jat1 ding6, baai1 baai3", m:"一定一定，再见！"}
  ]}
];
