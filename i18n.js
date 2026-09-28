/* LocalFix i18n — shared across landing, customer, technician */
window.LF_LANGS = [
  {code:'en', name:'English', native:'English'},
  {code:'hi', name:'Hindi', native:'हिन्दी'},
  {code:'te', name:'Telugu', native:'తెలుగు'},
  {code:'ta', name:'Tamil', native:'தமிழ்'},
  {code:'kn', name:'Kannada', native:'ಕನ್ನಡ'},
  {code:'ml', name:'Malayalam', native:'മലയാളം'},
  {code:'mr', name:'Marathi', native:'मराठी'},
  {code:'bn', name:'Bengali', native:'বাংলা'},
  {code:'gu', name:'Gujarati', native:'ગુજરાતી'},
  {code:'pa', name:'Punjabi', native:'ਪੰਜਾਬੀ'},
  {code:'or', name:'Odia', native:'ଓଡ଼ିଆ'},
  {code:'as', name:'Assamese', native:'অসমীয়া'},
  {code:'ur', name:'Urdu', native:'اردو'},
  {code:'sa', name:'Sanskrit', native:'संस्कृतम्'},
  {code:'ne', name:'Nepali', native:'नेपाली'},
  {code:'sd', name:'Sindhi', native:'سنڌي'},
  {code:'ks', name:'Kashmiri', native:'کٲشُر'},
  {code:'kok', name:'Konkani', native:'कोंकणी'},
  {code:'mai', name:'Maithili', native:'मैथिली'},
  {code:'doi', name:'Dogri', native:'डोगरी'},
  {code:'mni', name:'Manipuri', native:'ꯃꯤꯇꯩꯂꯣꯟ'},
  {code:'sat', name:'Santali', native:'ᱥᱟᱱᱛᱟᱲᱤ'},
  {code:'brx', name:'Bodo', native:'बड़ो'}
];

const T = {
en:{
  brand:'localfix', brandSub:'Appliance care you can trust',
  navHow:'How it works', navFeat:'Features', navTrust:'Trust', navApply:'Apply for job',
  lang:'Language', login:'Log in', getStarted:'Get started', seeJourney:'See the journey',
  heroTitle:'Fix the appliance. Not the guesswork.',
  heroLead:'Book verified technicians for AC, fridge, washing machine, TV and more — track them live on the map.',
  howTitle:'One journey from problem to proof', howLead:'Customers and technicians share the same service flow.',
  s1:'Describe', s1d:'Tell us what the appliance is doing.',
  s2:'FixMatch', s2d:'Match a verified appliance technician.',
  s3:'Book slot', s3d:'Pick a time slot that works for you.',
  s4:'Track live', s4d:'Follow the technician on the map.',
  s5:'Repair', s5d:'Proof, payment, warranty & history.',
  featTitle:'Built for home appliances', featLead:'Everything you need before you log in.',
  f1:'AI FixMatch', f1d:'Match by appliance type, skills, location and availability.',
  f2:'Live map track', f2d:'See your technician moving toward you in the booked slot.',
  f3:'LocalFix Coins', f3d:'Earn coins on eligible requests, services and reviews.',
  f4:'QuoteCompare', f4d:'Parts and labour stay clear before you approve.',
  trustTitle:'Feel confident before you book', trustLead:'Blue-chip trust signals — who is coming, what they will fix, and what you pay.',
  t1:'Verified technicians', t1d:'ID-checked pros for electrical appliances.',
  t2:'Transparent pricing', t2d:'Parts and labour shown before approval.',
  t3:'Live tracking', t3d:'Map tracking inside your allotted time slot.',
  t4:'Warranty & history', t4d:'Keep warranty and past repairs in one place.',
  bandTitle:'One platform. Two ways in.', bandLead:'Customers book and track. Technicians receive jobs and navigate to the address.',
  loginLF:'Log in to LocalFix', applyJob:'Apply for job',
  welcome:'Welcome to LocalFix', welcomeHint:'Choose how you want to use the platform.',
  customer:'Customer', customerHint:'Book appliance services, track technicians on the map, pay securely.',
  technician:'Technician', techHint:'Use your LocalFix ID to receive jobs and see customer locations.',
  custLogin:'Customer login', techLogin:'Technician login', mobileOtp:'MOBILE + OTP', companyAccess:'COMPANY ACCESS',
  mobile:'Mobile number', sendOtp:'Send OTP & continue', techId:'LocalFix Technician ID / number', pin:'Company PIN',
  verify:'Verify & continue', chooseLang:'Choose language', langHint:'The whole site — landing, customer and technician — switches to this language.',
  applyTitle:'Apply for a technician job', applyHint:'Share your details. After admin selection you will see a message on the customer page.',
  name:'Full name', age:'Age', experience:'Experience (years)', submitApp:'Submit application',
  appOk:'Application submitted. Admin will review it.', appNeed:'Please fill all fields.',
  footer:'© 2026 localfix · Electrical appliance services', footer2:'Trusted · Tracked · Demo UI',
  scroll:'Scroll', invalidMobile:'Enter a valid mobile number.', openingCust:'Opening customer workspace…',
  needIdPin:'Enter Technician ID and company PIN.', openingTech:'Opening technician workspace…',
  langSet:'Language set to'
},
hi:{
  brand:'localfix', brandSub:'उपकरण सेवा जिस पर भरोसा हो',
  navHow:'कैसे काम करता है', navFeat:'विशेषताएँ', navTrust:'विश्वास', navApply:'नौकरी के लिए आवेदन',
  lang:'भाषा', login:'लॉग इन', getStarted:'शुरू करें', seeJourney:'यात्रा देखें',
  heroTitle:'उपकरण ठीक करें। अनुमान नहीं।',
  heroLead:'AC, फ्रिज, वॉशिंग मशीन, TV आदि के लिए सत्यापित तकनीशियन बुक करें — मैप पर लाइव ट्रैक करें।',
  howTitle:'समस्या से प्रमाण तक एक यात्रा', howLead:'ग्राहक और तकनीशियन एक ही सेवा प्रवाह साझा करते हैं।',
  s1:'वर्णन', s1d:'बताएँ उपकरण क्या कर रहा है।', s2:'FixMatch', s2d:'सत्यापित तकनीशियन मिलाएँ।',
  s3:'स्लॉट बुक', s3d:'अपना समय चुनें।', s4:'लाइव ट्रैक', s4d:'मैप पर तकनीशियन देखें।',
  s5:'मरम्मत', s5d:'प्रमाण, भुगतान, वारंटी।',
  featTitle:'घरेलू उपकरणों के लिए', featLead:'लॉगिन से पहले जो चाहिए।',
  f1:'AI FixMatch', f1d:'उपकरण, कौशल, स्थान और उपलब्धता से मिलान।',
  f2:'लाइव मैप', f2d:'बुक स्लॉट में तकनीशियन का रास्ता देखें।',
  f3:'LocalFix Coins', f3d:'पात्र सेवाओं पर सिक्के कमाएँ।',
  f4:'QuoteCompare', f4d:'स्वीकृति से पहले पार्ट्स और लेबर साफ़।',
  trustTitle:'बुक करने से पहले भरोसा', trustLead:'कौन आ रहा है, क्या ठीक होगा, कितना भुगतान।',
  t1:'सत्यापित तकनीशियन', t1d:'विद्युत उपकरणों के लिए जाँचे गए प्रो।',
  t2:'पारदर्शी कीमत', t2d:'स्वीकृति से पहले पार्ट्स और लेबर।',
  t3:'लाइव ट्रैकिंग', t3d:'आवंटित स्लॉट में मैप ट्रैक।',
  t4:'वारंटी व इतिहास', t4d:'वारंटी और पुरानी मरम्मत एक जगह।',
  bandTitle:'एक प्लेटफ़ॉर्म। दो रास्ते।', bandLead:'ग्राहक बुक और ट्रैक करते हैं। तकनीशियन जॉब पाते हैं।',
  loginLF:'LocalFix में लॉग इन', applyJob:'नौकरी के लिए आवेदन',
  welcome:'LocalFix में स्वागत', welcomeHint:'प्लेटफ़ॉर्म कैसे उपयोग करना चाहते हैं चुनें।',
  customer:'ग्राहक', customerHint:'सेवा बुक करें, मैप पर ट्रैक करें, सुरक्षित भुगतान।',
  technician:'तकनीशियन', techHint:'LocalFix ID से जॉब लें और ग्राहक स्थान देखें।',
  custLogin:'ग्राहक लॉगिन', techLogin:'तकनीशियन लॉगिन', mobileOtp:'मोबाइल + OTP', companyAccess:'कंपनी एक्सेस',
  mobile:'मोबाइल नंबर', sendOtp:'OTP भेजें और जारी रखें', techId:'LocalFix तकनीशियन ID / नंबर', pin:'कंपनी PIN',
  verify:'सत्यापित करें', chooseLang:'भाषा चुनें', langHint:'पूरा साइट — लैंडिंग, ग्राहक और तकनीशियन — इसी भाषा में बदलेगा।',
  applyTitle:'तकनीशियन नौकरी के लिए आवेदन', applyHint:'विवरण भरें। एडमिन चयन के बाद ग्राहक पेज पर संदेश दिखेगा।',
  name:'पूरा नाम', age:'उम्र', experience:'अनुभव (वर्ष)', submitApp:'आवेदन जमा करें',
  appOk:'आवेदन जमा हो गया। एडमिन समीक्षा करेगा।', appNeed:'कृपया सभी फ़ील्ड भरें।',
  footer:'© 2026 localfix · विद्युत उपकरण सेवाएँ', footer2:'विश्वसनीय · ट्रैक्ड · डेमो UI',
  scroll:'स्क्रॉल', invalidMobile:'वैध मोबाइल नंबर डालें।', openingCust:'ग्राहक वर्कस्पेस खुल रहा है…',
  needIdPin:'तकनीशियन ID और PIN डालें।', openingTech:'तकनीशियन वर्कस्पेस खुल रहा है…',
  langSet:'भाषा सेट:'
},
te:{
  brand:'localfix', brandSub:'నమ్మకమైన ఉపకరణ సేవ',
  navHow:'ఎలా పని చేస్తుంది', navFeat:'ఫీచర్లు', navTrust:'నమ్మకం', navApply:'ఉద్యోగానికి దరఖాస్తు',
  lang:'భాష', login:'లాగిన్', getStarted:'ప్రారంభించండి', seeJourney:'ప్రయాణం చూడండి',
  heroTitle:'ఉపకరణం సరిచేయండి. అంచనా కాదు.',
  heroLead:'AC, ఫ్రిజ్, వాషింగ్ మెషీన్, TV కోసం వెరిఫైడ్ టెక్నీషియన్ బుక్ చేసి మ్యాప్‌లో ట్రాక్ చేయండి.',
  howTitle:'సమస్య నుండి రుజువు వరకు ఒక ప్రయాణం', howLead:'కస్టమర్ మరియు టెక్నీషియన్ ఒకే సేవా ప్రవాహం.',
  s1:'వివరించండి', s1d:'ఉపకరణం ఏమి చేస్తోందో చెప్పండి.', s2:'FixMatch', s2d:'వెరిఫైడ్ టెక్నీషియన్ కనుగొనండి.',
  s3:'స్లాట్ బుక్', s3d:'మీ సమయం ఎంచుకోండి.', s4:'లైవ్ ట్రాక్', s4d:'మ్యాప్‌లో టెక్నీషియన్ చూడండి.',
  s5:'మరమ్మత్తు', s5d:'రుజువు, చెల్లింపు, వారంటీ.',
  featTitle:'గృహోపకరణాల కోసం', featLead:'లాగిన్ ముందు మీకు కావలసినవి.',
  f1:'AI FixMatch', f1d:'ఉపకరణం, నైపుణ్యం, స్థానం ఆధారంగా మ్యాచ్.',
  f2:'లైవ్ మ్యాప్', f2d:'బుక్ స్లాట్‌లో టెక్నీషియన్ మార్గం.',
  f3:'LocalFix Coins', f3d:'అర్హమైన సేవలపై కాయిన్లు.',
  f4:'QuoteCompare', f4d:'ఆమోదానికి ముందు పార్ట్స్ మరియు లేబర్.',
  trustTitle:'బుక్ చేసే ముందు నమ్మకం', trustLead:'ఎవరు వస్తున్నారు, ఏమి సరిచేస్తారు, ఎంత చెల్లించాలి.',
  t1:'వెరిఫైడ్ టెక్నీషియన్లు', t1d:'విద్యుత్ ఉపకరణాల ప్రోలు.',
  t2:'పారదర్శక ధర', t2d:'ఆమోదానికి ముందు ధర స్పష్టం.',
  t3:'లైవ్ ట్రాకింగ్', t3d:'కేటాయించిన స్లాట్‌లో మ్యాప్.',
  t4:'వారంటీ & చరిత్ర', t4d:'వారంటీ మరియు పాత సేవలు ఒకే చోట.',
  bandTitle:'ఒక ప్లాట్‌ఫామ్. రెండు మార్గాలు.', bandLead:'కస్టమర్లు బుక్ చేసి ట్రాక్ చేస్తారు. టెక్నీషియన్లు జాబ్‌లు పొందుతారు.',
  loginLF:'LocalFix లాగిన్', applyJob:'ఉద్యోగానికి దరఖాస్తు',
  welcome:'LocalFix కు స్వాగతం', welcomeHint:'మీరు ఎలా ఉపయోగించాలనుకుంటున్నారో ఎంచుకోండి.',
  customer:'కస్టమర్', customerHint:'సేవలు బుక్ చేసి మ్యాప్‌లో ట్రాక్ చేయండి.',
  technician:'టెక్నీషియన్', techHint:'LocalFix ID తో జాబ్‌లు మరియు కస్టమర్ లొకేషన్.',
  custLogin:'కస్టమర్ లాగిన్', techLogin:'టెక్నీషియన్ లాగిన్', mobileOtp:'మొబైల్ + OTP', companyAccess:'కంపెనీ యాక్సెస్',
  mobile:'మొబైల్ నంబర్', sendOtp:'OTP పంపి కొనసాగించండి', techId:'LocalFix టెక్నీషియన్ ID', pin:'కంపెనీ PIN',
  verify:'వెరిఫై చేయండి', chooseLang:'భాష ఎంచుకోండి', langHint:'మొత్తం సైట్ ఈ భాషకు మారుతుంది.',
  applyTitle:'టెక్నీషియన్ ఉద్యోగ దరఖాస్తు', applyHint:'వివరాలు ఇవ్వండి. అడ్మిన్ ఎంపిక తర్వాత కస్టమర్ పేజీలో సందేశం.',
  name:'పూర్తి పేరు', age:'వయస్సు', experience:'అనుభవం (సంవత్సరాలు)', submitApp:'దరఖాస్తు సమర్పించండి',
  appOk:'దరఖాస్తు సమర్పించబడింది.', appNeed:'అన్ని ఫీల్డ్‌లు పూరించండి.',
  footer:'© 2026 localfix · విద్యుత్ ఉపకరణ సేవలు', footer2:'నమ్మకం · ట్రాక్ · డెమో UI',
  scroll:'స్క్రోల్', invalidMobile:'సరైన మొబైల్ నంబర్ ఇవ్వండి.', openingCust:'కస్టమర్ వర్క్‌స్పేస్ తెరవబడుతోంది…',
  needIdPin:'ID మరియు PIN ఇవ్వండి.', openingTech:'టెక్నీషియన్ వర్క్‌స్పేస్ తెరవబడుతోంది…',
  langSet:'భాష సెట్:'
}
};

/* Customer page strings */
const TC = {
en:{
  findFix:'Find a Fix', myLF:'My LocalFix', home:'Home',
  useLoc:'Use my current location', addAddr:'Add current address', emergency:'Emergency appliance help',
  heroTitle:'Fix the appliance. Not the guesswork.',
  heroLead:'Describe the issue, book a verified technician, pick a slot and track them live on the map.',
  placeholder:'e.g. My AC is running but not cooling…', findMatch:'Find my FixMatch',
  whatFix:'What needs fixing?', pickIssue:'Pick an appliance issue or type your own.',
  ac:'AC not cooling', fridge:'Fridge not cold', wash:'Washing machine noise', tv:'TV no display', fan:'Fan not working',
  recs:'FixMatch recommendations', recsLead:'Verified appliance professionals near you.',
  estVisit:'EST. VISIT', reqQuote:'Request quote', bookSlot:'Book slot',
  aiLive:'LIVE DEMO', cat:'Appliance category', likely:'Likely issue', rec:'Recommended', conf:'Confidence',
  addPhotos:'Add photos & details',
  liveTrack:'Live technician map', liveTrackLead:'Tracking inside your booked time slot.',
  slotLabel:'Booked slot', eta:'ETA', onWay:'Technician on the way',
  you:'You', tech:'Technician',
  jobTrack:'Job status', viewDetails:'View details',
  acceptQuote:'Accept quote', choosePay:'Choose payment method',
  community:'LocalFix Community', openComm:'Open community',
  accountTitle:'My LocalFix', settings:'Settings', newReq:'New service request', prev:'Previous services',
  coins:'LOCALFIX COINS', viewCoins:'View coin activity',
  pending:'PENDING', completed:'COMPLETED',
  notifTitle:'Messages',
  notifApp:'Your technician job application was selected by admin. Check details below.',
  notifNone:'No new messages.',
  bookTitle:'Book technician slot', bookHint:'Choose a time slot. Tracking starts when they are within the allotted window.',
  slotMorning:'Today 10:00–12:00', slotEve:'Today 16:00–18:00', slotTom:'Tomorrow 11:00–13:00',
  confirmBook:'Confirm booking', booked:'Slot booked — map tracking armed for that window.',
  custLoc:'Your address on map', techNav:'Navigate to customer'
},
hi:{
  findFix:'फिक्स खोजें', myLF:'मेरा LocalFix', home:'होम',
  useLoc:'मेरा वर्तमान स्थान', addAddr:'पता जोड़ें', emergency:'आपातकालीन उपकरण सहायता',
  heroTitle:'उपकरण ठीक करें। अनुमान नहीं।',
  heroLead:'समस्या बताएँ, तकनीशियन बुक करें, स्लॉट चुनें और मैप पर लाइव ट्रैक करें।',
  placeholder:'उदा. AC चल रहा है पर ठंडक नहीं…', findMatch:'मेरा FixMatch खोजें',
  whatFix:'क्या ठीक करना है?', pickIssue:'उपकरण समस्या चुनें या लिखें।',
  ac:'AC ठंडा नहीं', fridge:'फ्रिज ठंडा नहीं', wash:'वॉशिंग मशीन शोर', tv:'TV डिस्प्ले नहीं', fan:'पंखा नहीं चल रहा',
  recs:'FixMatch सुझाव', recsLead:'आपके पास सत्यापित प्रो।',
  estVisit:'अनु. विज़िट', reqQuote:'कोट माँगें', bookSlot:'स्लॉट बुक',
  aiLive:'लाइव डेमो', cat:'उपकरण श्रेणी', likely:'संभावित समस्या', rec:'अनुशंसित', conf:'विश्वास',
  addPhotos:'फ़ोटो और विवरण',
  liveTrack:'लाइव तकनीशियन मैप', liveTrackLead:'बुक स्लॉट में ट्रैकिंग।',
  slotLabel:'बुक स्लॉट', eta:'ETA', onWay:'तकनीशियन रास्ते में',
  you:'आप', tech:'तकनीशियन',
  jobTrack:'जॉब स्थिति', viewDetails:'विवरण',
  acceptQuote:'कोट स्वीकार', choosePay:'भुगतान चुनें',
  community:'LocalFix समुदाय', openComm:'समुदाय खोलें',
  accountTitle:'मेरा LocalFix', settings:'सेटिंग्स', newReq:'नई सेवा', prev:'पिछली सेवाएँ',
  coins:'LOCALFIX कॉइन्स', viewCoins:'कॉइन गतिविधि',
  pending:'लंबित', completed:'पूर्ण',
  notifTitle:'संदेश',
  notifApp:'एडमिन ने आपका तकनीशियन आवेदन चुना। नीचे देखें।',
  notifNone:'कोई नया संदेश नहीं।',
  bookTitle:'तकनीशियन स्लॉट बुक', bookHint:'समय स्लॉट चुनें। आवंटित विंडो में ट्रैकिंग शुरू।',
  slotMorning:'आज 10:00–12:00', slotEve:'आज 16:00–18:00', slotTom:'कल 11:00–13:00',
  confirmBook:'बुकिंग पुष्टि', booked:'स्लॉट बुक — मैप ट्रैक तैयार।',
  custLoc:'मैप पर आपका पता', techNav:'ग्राहक तक जाएँ'
},
te:{
  findFix:'ఫిక్స్ కనుగొనండి', myLF:'నా LocalFix', home:'హోమ్',
  useLoc:'నా ప్రస్తుత స్థానం', addAddr:'చిరునామా జోడించండి', emergency:'అత్యవసర ఉపకరణ సహాయం',
  heroTitle:'ఉపకరణం సరిచేయండి. అంచనా కాదు.',
  heroLead:'సమస్య చెప్పి టెక్నీషియన్ బుక్ చేసి స్లాట్ ఎంచుకుని మ్యాప్‌లో ట్రాక్ చేయండి.',
  placeholder:'ఉదా. AC నడుస్తోంది కానీ చల్లదనం లేదు…', findMatch:'నా FixMatch కనుగొనండి',
  whatFix:'ఏమి సరిచేయాలి?', pickIssue:'ఉపకరణ సమస్య ఎంచుకోండి లేదా టైప్ చేయండి.',
  ac:'AC చల్లబడడం లేదు', fridge:'ఫ్రిజ్ చల్లగా లేదు', wash:'వాషింగ్ మెషీన్ శబ్దం', tv:'TV డిస్‌ప్లే లేదు', fan:'ఫ్యాన్ పని చేయడం లేదు',
  recs:'FixMatch సిఫార్సులు', recsLead:'మీ దగ్గర వెరిఫైడ్ ప్రోలు.',
  estVisit:'అంచనా విజిట్', reqQuote:'కోట్ అడగండి', bookSlot:'స్లాట్ బుక్',
  aiLive:'లైవ్ డెమో', cat:'ఉపకరణ వర్గం', likely:'సంభావ్య సమస్య', rec:'సిఫార్సు', conf:'నమ్మకం',
  addPhotos:'ఫోటోలు & వివరాలు',
  liveTrack:'లైవ్ టెక్నీషియన్ మ్యాప్', liveTrackLead:'బుక్ స్లాట్‌లో ట్రాకింగ్.',
  slotLabel:'బుక్ స్లాట్', eta:'ETA', onWay:'టెక్నీషియన్ వస్తున్నారు',
  you:'మీరు', tech:'టెక్నీషియన్',
  jobTrack:'జాబ్ స్థితి', viewDetails:'వివరాలు',
  acceptQuote:'కోట్ ఆమోదించండి', choosePay:'చెల్లింపు ఎంచుకోండి',
  community:'LocalFix కమ్యూనిటీ', openComm:'కమ్యూనిటీ తెరవండి',
  accountTitle:'నా LocalFix', settings:'సెట్టింగ్‌లు', newReq:'కొత్త సేవా అభ్యర్థన', prev:'మునుపటి సేవలు',
  coins:'LOCALFIX కాయిన్లు', viewCoins:'కాయిన్ కార్యకలాపం',
  pending:'పెండింగ్', completed:'పూర్తి',
  notifTitle:'సందేశాలు',
  notifApp:'అడ్మిన్ మీ టెక్నీషియన్ దరఖాస్తును ఎంపిక చేశారు.',
  notifNone:'కొత్త సందేశాలు లేవు.',
  bookTitle:'టెక్నీషియన్ స్లాట్ బుక్', bookHint:'సమయ స్లాట్ ఎంచుకోండి. కేటాయించిన విండోలో ట్రాకింగ్.',
  slotMorning:'ఈరోజు 10:00–12:00', slotEve:'ఈరోజు 16:00–18:00', slotTom:'రేపు 11:00–13:00',
  confirmBook:'బుకింగ్ నిర్ధారించండి', booked:'స్లాట్ బుక్ — మ్యాప్ ట్రాక్ సిద్ధం.',
  custLoc:'మ్యాప్‌లో మీ చిరునామా', techNav:'కస్టమర్ వద్దకు వెళ్లండి'
}
};

/* Technician page */
const TT = {
en:{
  jobs:'Incoming jobs', diagnose:'Diagnose & quote', history:'Job history', earnings:'Earnings',
  settings:'Settings', home:'Home', week:'This week', active:'Active jobs', nearby:'New nearby',
  ontime:'On-time rate', mtd:'Month to date',
  incoming:'Incoming jobs', incomingLead:'Appliance jobs matched to your skills.',
  refresh:'Refresh', accept:'Accept', decline:'Decline', openQuote:'Open & quote',
  custMap:'Customer location', custMapLead:'Map based on the service address.',
  navigate:'Open in maps', address:'Service address',
  diagTitle:'Diagnose & quote', diagLead:'Parts and labour separated for the customer.',
  sendQuote:'Send quote to customer', uploadProof:'Upload before / after proof', markDone:'Mark repair complete',
  histTitle:'Job history', earnTitle:'Earnings', payout:'Request payout',
  avail:'Available', pending:'Pending clearance', lastPay:'Last payout'
},
hi:{
  jobs:'आने वाले जॉब', diagnose:'निदान व कोट', history:'जॉब इतिहास', earnings:'कमाई',
  settings:'सेटिंग्स', home:'होम', week:'इस सप्ताह', active:'सक्रिय जॉब', nearby:'नए पास के',
  ontime:'समय पर दर', mtd:'महीने की तारीख तक',
  incoming:'आने वाले जॉब', incomingLead:'आपके कौशल से मिले उपकरण जॉब।',
  refresh:'रीफ़्रेश', accept:'स्वीकार', decline:'अस्वीकार', openQuote:'खोलें व कोट',
  custMap:'ग्राहक स्थान', custMapLead:'सेवा पते पर आधारित मैप।',
  navigate:'मैप में खोलें', address:'सेवा पता',
  diagTitle:'निदान व कोट', diagLead:'पार्ट्स और लेबर अलग।',
  sendQuote:'ग्राहक को कोट भेजें', uploadProof:'पहले/बाद प्रमाण', markDone:'मरम्मत पूर्ण',
  histTitle:'जॉब इतिहास', earnTitle:'कमाई', payout:'पेआउट माँगें',
  avail:'उपलब्ध', pending:'क्लीयरेंस लंबित', lastPay:'अंतिम पेआउट'
},
te:{
  jobs:'వచ్చే జాబ్‌లు', diagnose:'డయాగ్నోస్ & కోట్', history:'జాబ్ చరిత్ర', earnings:'సంపాదన',
  settings:'సెట్టింగ్‌లు', home:'హోమ్', week:'ఈ వారం', active:'యాక్టివ్ జాబ్‌లు', nearby:'కొత్త సమీప',
  ontime:'సమయానికి రేటు', mtd:'నెల నుండి ఇప్పటి వరకు',
  incoming:'వచ్చే జాబ్‌లు', incomingLead:'మీ నైపుణ్యాలకు మ్యాచ్ అయిన ఉపకరణ జాబ్‌లు.',
  refresh:'రిఫ్రెష్', accept:'ఆమోదించు', decline:'తిరస్కరించు', openQuote:'తెరిచి కోట్',
  custMap:'కస్టమర్ లొకేషన్', custMapLead:'సేవా చిరునామా ఆధారిత మ్యాప్.',
  navigate:'మ్యాప్‌లో తెరవండి', address:'సేవా చిరునామా',
  diagTitle:'డయాగ్నోస్ & కోట్', diagLead:'పార్ట్స్ మరియు లేబర్ వేరు.',
  sendQuote:'కస్టమర్‌కు కోట్ పంపండి', uploadProof:'ముందు/తర్వాత ప్రూఫ్', markDone:'రిపేర్ పూర్తి',
  histTitle:'జాబ్ చరిత్ర', earnTitle:'సంపాదన', payout:'పేఅవుట్ అభ్యర్థన',
  avail:'అందుబాటు', pending:'క్లియరెన్స్ పెండింగ్', lastPay:'చివరి పేఅవుట్'
}
};

/* Fill remaining languages by falling back to Hindi then English for T/TC/TT */
(function seed(){
  const codes = LF_LANGS.map(l=>l.code);
  function fill(bag, primary){
    codes.forEach(c=>{
      if(!bag[c]) bag[c] = Object.assign({}, bag.hi || bag.en, bag[c]||{});
      // ensure all keys from en
      Object.keys(bag.en).forEach(k=>{ if(bag[c][k]==null) bag[c][k]= (bag.hi&&bag.hi[k])||bag.en[k]; });
    });
  }
  fill(T); fill(TC); fill(TT);
})();

window.LF = {
  getLang(){ return localStorage.getItem('lf_lang') || 'en'; },
  setLang(code){
    localStorage.setItem('lf_lang', code);
    document.documentElement.lang = code;
    document.documentElement.dir = (code==='ur'||code==='sd'||code==='ks') ? 'rtl' : 'ltr';
  },
  t(key){ const L=T[this.getLang()]||T.en; return L[key]??T.en[key]??key; },
  tc(key){ const L=TC[this.getLang()]||TC.en; return L[key]??TC.en[key]??key; },
  tt(key){ const L=TT[this.getLang()]||TT.en; return L[key]??TT.en[key]??key; },
  apply(root){
    (root||document).querySelectorAll('[data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n');
      const ns=el.getAttribute('data-i18n-ns')||'t';
      const val = ns==='tc'?this.tc(k): ns==='tt'?this.tt(k): this.t(k);
      if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){
        if(el.hasAttribute('data-i18n-placeholder')) el.placeholder=val;
        else el.value=val;
      } else el.textContent=val;
    });
    (root||document).querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const k=el.getAttribute('data-i18n-placeholder');
      const ns=el.getAttribute('data-i18n-ns')||'t';
      el.placeholder = ns==='tc'?this.tc(k): ns==='tt'?this.tt(k): this.t(k);
    });
    const btn=document.getElementById('langBtnLabel');
    if(btn){
      const cur=LF_LANGS.find(l=>l.code===this.getLang());
      btn.textContent = cur?cur.native: 'English';
    }
  },
  langNative(){ const c=LF_LANGS.find(l=>l.code===this.getLang()); return c?c.native:'English'; }
};

document.addEventListener('DOMContentLoaded',()=>{ LF.setLang(LF.getLang()); LF.apply(); });
