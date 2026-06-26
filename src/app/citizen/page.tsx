"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ArrowLeft,
  Send,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  HelpCircle,
  Lock,
  ShieldAlert,
  Globe,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useKavach } from "@/context/KavachContext";

type Language = "en" | "hi" | "gu";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface RiskProfile {
  score: number;
  verdict: "DANGER" | "SUSPICIOUS" | "SAFE";
  tactics: string[];
  recommendation: string;
  mitigation: string[];
}

export default function CitizenPortal() {
  const { addAlert, systemStress } = useKavach();
  const [language, setLanguage] = useState<Language>("en");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am Citizen Kavach, your public safety assistant. Select one of the suggested prompts below or describe a suspicious message, WhatsApp claim, VoIP call, or money transfer request to evaluate scam risk.",
      timestamp: "Just now",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);

  // Active risk analysis status
  const [activeProfile, setActiveProfile] = useState<RiskProfile | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Suggested prompts structure based on language
  const suggestedPrompts = {
    en: [
      { id: "cbi", label: "I received a CBI call", text: "I received a call from someone claiming to be a CBI inspector. They told me my Aadhaar card is linked to money laundering and that I am under 'digital arrest' unless I transfer security verification fees." },
      { id: "upi", label: "Is this UPI request safe?", text: "Someone sent me a UPI request for ₹5,000 on PhonePe, claiming it is for a cash refund. They said I just need to click 'Pay' and enter my UPI PIN to receive the money." },
      { id: "transfer", label: "Someone asked me to transfer money", text: "A WhatsApp contact claiming to be my bank officer told me my account is locked. They asked me to transfer ₹25,000 to a temporary 'safe security escrow account' to keep it open." },
      { id: "whatsapp", label: "Verify this WhatsApp message", text: "I got a WhatsApp message from a personal number claiming to be a family member: 'Hi Mom, my phone broke, I am using this new number. I have an emergency hospital bill, please send ₹15,000 immediately to this account.'" }
    ],
    hi: [
      { id: "cbi", label: "मुझे सीबीआई का फोन आया", text: "मुझे एक व्यक्ति का फोन आया जो खुद को सीबीआई इंस्पेक्टर बता रहा था। उन्होंने कहा कि मेरा आधार कार्ड मनी लॉन्ड्रिंग से जुड़ा है और जब तक मैं सुरक्षा शुल्क ट्रांसफर नहीं करता, तब तक मैं 'डिजिटल अरेस्ट' में हूँ।" },
      { id: "upi", label: "क्या यह यूपीआई अनुरोध सुरक्षित है?", text: "किसी ने मुझे PhonePe पर ₹5,000 का यूपीआई कलेक्ट अनुरोध भेजा है और कहा कि यह रिफंड के लिए है। उन्होंने कहा कि मुझे पैसे पाने के लिए सिर्फ 'पे' पर क्लिक करना होगा और अपना यूपीआई पिन दर्ज करना होगा।" },
      { id: "transfer", label: "किसी ने पैसे ट्रांसफर करने को कहा", text: "एक व्हाट्सएप संपर्क ने बैंक अधिकारी होने का दावा करते हुए कहा कि मेरा खाता ब्लॉक हो गया है। उन्होंने खाता खुला रखने के लिए मुझे ₹25,000 एक अस्थायी 'सुरक्षित एस्क्रो खाते' में ट्रांसफर करने को कहा।" },
      { id: "whatsapp", label: "व्हाट्सएप संदेश सत्यापित करें", text: "मुझे एक व्यक्तिगत नंबर से व्हाट्सएप संदेश मिला: 'नमस्ते माँ, मेरा फोन टूट गया है, मैं इस नए नंबर का उपयोग कर रहा हूँ। अस्पताल का आपातकालीन बिल है, कृपया तुरंत इस खाते में ₹15,000 भेजें।'" }
    ],
    gu: [
      { id: "cbi", label: "મને સીબીઆઈ ફોન આવ્યો", text: "મને એક વ્યક્તિનો ફોન આવ્યો જેણે સીબીઆઈ ઇન્સ્પેક્ટર હોવાનો દાવો કર્યો. તેમણે કહ્યું કે મારું આધાર કાર્ડ મની લોન્ડરિંગ સાથે જોડાયેલું છે અને જો હું સુરક્ષા ફી ટ્રાન્સફર ન કરું તો હું 'ડિજિટલ અરેસ્ટ' માં છું." },
      { id: "upi", label: "શું આ UPI વિનંતી સુરક્ષિત છે?", text: "કોઈએ મને PhonePe પર ₹5,000 ની UPI કલેક્ટ વિનંતી મોકલી છે, અને કહ્યું કે તે રીફંડ માટે છે. તેમણે કહ્યું કે મારે પૈસા મેળવવા માટે ફક્ત 'Pay' પર ક્લિક કરી મારો UPI PIN દાખલ કરવો પડશે." },
      { id: "transfer", label: "કોઈએ પૈસા ટ્રાન્સફર કરવા કહ્યું", text: "એક વોટ્સએપ કોન્ટેક્ટ જેણે બેંક અધિકારી હોવાનો દાવો કર્યો અને કહ્યું કે મારું એકાઉન્ટ બ્લોક છે. ખાતું ચાલુ રાખવા માટે તેમણે મને ₹25,000 એક અસ્થાયી 'એસ્ક્રો સેક્યુરિટી એકાઉન્ટ' માં મોકલવા કહ્યું." },
      { id: "whatsapp", label: "આ વોટ્સએપ સંદેશ ચકાસો", text: "મને કોઈ અજાણ્યા નંબર પરથી વોટ્સએપ સંદેશ મળ્યો: 'હાય મમ્મી, મારો ફોન તૂટી ગયો છે, હું આ નવા નંબરનો ઉપયોગ કરી રહ્યો છું. હોસ્પિટલનું ઇમરજન્સી બિલ છે, કૃપા કરીને આ ખાતામાં તરત જ ₹15,000 મોકલો.'" }
    ]
  };

  // Translations for layout elements
  const localizations = {
    en: {
      title: "Citizen Kavach Shield",
      subtitle: "Evaluate calls, suspicious messages, and digital arrest threats instantly using public safety AI models.",
      activeConsole: "Launch Security Console",
      statusText: "Agent Status: Secure Outpost",
      languageLabel: "Interaction Language",
      promptLabel: "Suggested Safety Prompts",
      chatPlaceholder: "Describe call claims, paste suspicious text messages, or enter UPI transaction details...",
      riskTitle: "Scam Risk Engine Score",
      mitigationTitle: "Public Safety Recommendations",
      helplinePointers: "National Security Helpline Portal",
      helplineBody: "If you have transferred funds or shared private OTP codes, call the Cybercrime Hotline at 1930 immediately or submit detailed incident logs on cybercrime.gov.in.",
      threatVerdict: "VERDICT",
      tacticLabel: "Detected Coercion Tactics",
      mitigationAction: "Mitigation Actions",
      sendButton: "Assess Threat",
      typingText: "Citizen Agent is analyzing linguistic cues...",
    },
    hi: {
      title: "सिटीजन कवच शील्ड",
      subtitle: "सार्वजनिक सुरक्षा एआई मॉडल का उपयोग करके कॉल, संदिग्ध संदेशों और डिजिटल अरेस्ट के खतरों का तुरंत मूल्यांकन करें।",
      activeConsole: "सुरक्षा कंसोल लॉन्च करें",
      statusText: "एजेंट स्थिति: सुरक्षित आउटपोस्ट",
      languageLabel: "बातचीत की भाषा",
      promptLabel: "सुझाए गए सुरक्षा प्रश्न",
      chatPlaceholder: "कॉल के दावों का वर्णन करें, संदिग्ध संदेश पेस्ट करें, या यूपीआई लेनदेन विवरण दर्ज करें...",
      riskTitle: "धोखाधड़ी जोखिम इंजन स्कोर",
      mitigationTitle: "सार्वजनिक सुरक्षा सिफारिशें",
      helplinePointers: "राष्ट्रीय सुरक्षा हेल्पलाइन पोर्टल",
      helplineBody: "यदि आपने पैसे ट्रांसफर किए हैं या व्यक्तिगत ओटीपी कोड साझा किए हैं, तो तुरंत साइबर अपराध हॉटलाइन 1930 पर कॉल करें या cybercrime.gov.in पर विस्तृत शिकायत दर्ज करें।",
      threatVerdict: "निर्णय (Verdict)",
      tacticLabel: "पहचाने गए जबरदस्ती के तरीके",
      mitigationAction: "बचाव के उपाय",
      sendButton: "खतरे का आकलन करें",
      typingText: "सिटीजन एजेंट संदेश का विश्लेषण कर रहा है...",
    },
    gu: {
      title: "સિટીઝન કવચ શીલ્ડ",
      subtitle: "જાહેર સુરક્ષા AI મોડલ્સનો ઉપયોગ કરીને કોલ, શંકાસ્પદ સંદેશાઓ અને ડિજિટલ અરેસ્ટના જોખમોનું તુરંત મૂલ્યાંકન કરો.",
      activeConsole: "સુરક્ષા કન્સોલ લોંચ કરો",
      statusText: "એજન્ટ સ્થિતિ: સુરક્ષિત આઉટપોસ્ટ",
      languageLabel: "વાતચીતની ભાષા",
      promptLabel: "સૂચવેલા સુરક્ષા પ્રશ્નો",
      chatPlaceholder: "કોલના દાવાઓનું વર્ણન કરો, શંકાસ્પદ ટેક્સ્ટ પેસ્ટ કરો અથવા UPI ટ્રાન્ઝેક્શન વિગતો દાખલ કરો...",
      riskTitle: "છેતરપિંડી જોખમ એન્જિન સ્કોર",
      mitigationTitle: "જાહેર સુરક્ષા ભલામણો",
      helplinePointers: "રાષ્ટ્રીય સુરક્ષા હેલ્પલાઇન પોર્ટલ",
      helplineBody: "જો તમે પૈસા મોકલી દીધા હોય અથવા ખાનગી OTP વિગતો શેર કરી હોય, તો તરત જ સાયબર ક્રાઇમ હોટલાઇન 1930 પર ફોન કરો અથવા cybercrime.gov.in પર ફરિયાદ કરો.",
      threatVerdict: "નિર્ણય (Verdict)",
      tacticLabel: "ઓળખાયેલી બળજબરીની તકનીકો",
      mitigationAction: "બચાવના પગલાં",
      sendButton: "જોખમ મૂલ્યાંકન કરો",
      typingText: "સિટીઝન એજન્ટ સંદેશ વિશ્લેષણ કરી રહ્યો છે...",
    }
  };

  // Mock responses mapping based on query types
  const getMockResponse = (text: string, lang: Language): { text: string; profile: RiskProfile } => {
    const lower = text.toLowerCase();
    
    // Check scenario 1: CBI / Digital Arrest
    if (lower.includes("cbi") || lower.includes("arrest") || lower.includes("police") || lower.includes("सीबीआई") || lower.includes("पुलिस") || lower.includes("અરેસ્ટ") || lower.includes("સીબીઆઈ")) {
      if (lang === "hi") {
        return {
          text: "चेतावनी: यह एक गंभीर खतरा है। भारत में केंद्रीय जांच ब्यूरो (CBI), पुलिस, सीमा शुल्क विभाग (Customs) या अन्य कानून प्रवर्तन एजेंसियां ​​कभी भी व्हाट्सएप या वीडियो कॉल के माध्यम से जांच नहीं करती हैं, न ही आपको 'डिजिटल अरेस्ट' में रखती हैं और न ही किसी सुरक्षा भुगतान की मांग करती हैं। यह पूरी तरह से धोखाधड़ी है। बातचीत तुरंत बंद कर दें।",
          profile: {
            score: 95,
            verdict: "DANGER",
            tactics: ["अधिकारी का स्वांग (Authority Impersonation)", "जल्दबाजी का दबाव (Urgency Manipulation)", "वित्तीय जबरदस्ती (Financial Coercion)"],
            recommendation: "संचार तुरंत समाप्त करें। सरकारी अधिकारी फोन पर पैसे नहीं मांगते।",
            mitigation: [
              "वीडियो कॉल या चैट तुरंत काट दें और नंबर ब्लॉक करें।",
              "अपना आधार, पैन, या बैंक खाता नंबर किसी भी अनधिकृत व्यक्ति को न बताएं।",
              "कॉल नंबर को संचार साथी पोर्टल (चक्षु) पर दर्ज करें और स्थानीय पुलिस को 1930 पर सूचित करें।"
            ]
          }
        };
      } else if (lang === "gu") {
        return {
          text: "ચેતવણી: આ એક અત્યંત ગંભીર જોખમ છે. ભારતમાં સેન્ટ્રલ બ્યુરો ઓફ ઇન્વેસ્ટિગેશન (CBI), પોલીસ, કસ્ટમ્સ કે અન્ય કાયદા અમલીકરણ એજન્સીઓ ક્યારેય વોટ્સએપ કે વિડીયો કોલ દ્વારા તપાસ કરતી નથી, કે તમને 'ડિજિટલ અરેસ્ટ' માં રાખતી નથી કે કોઈ પણ રકમ ટ્રાન્સફર કરવા કહેતી નથી. આ એક કૌભાંડ છે. તરત જ સંપર્ક કાપી નાખો.",
          profile: {
            score: 95,
            verdict: "DANGER",
            tactics: ["અધિકારી સ્વાંગ (Authority Impersonation)", "ઉતાવળનું દબાણ (Urgency Manipulation)", "નાણાકીય બળજબરી (Financial Coercion)"],
            recommendation: "સંપર્ક તાત્કાલિક બંધ કરો. સરકારી એજન્સીઓ ફોન પર નાણાંની લેવડદેવડ કરતી નથી.",
            mitigation: [
              "વીડિયો કોલ તરત જ કાપી નાખો અને નંબર બ્લોક કરો.",
              "કોઈપણ સંજોગોમાં તમારું આધાર, પાન કાર્ડ કે બેંક વિગતો આપશો નહીં.",
              "આ નંબરને સંચાર સાથી પોર્ટલ પર ચક્ષુ (Chakshu) ના માધ્યમથી રિપોર્ટ કરો."
            ]
          }
        };
      } else {
        return {
          text: "WARNING: This is a critical threat vector mimicking a 'Digital Arrest' scam. The Central Bureau of Investigation (CBI), Police, Customs, or other enforcement agencies in India will NEVER place you under digital custody, demand money over Skype/WhatsApp video calls, or solicit verify fees. Disconnect communication immediately.",
          profile: {
            score: 95,
            verdict: "DANGER",
            tactics: ["Authority Impersonation", "Urgency Manipulation", "Linguistic Coercion"],
            recommendation: "End communication immediately. Government bodies do not use online payment escrows.",
            mitigation: [
              "Disconnect video/audio channels immediately and block the caller.",
              "Do not verify identity cards or share Aadhaar/PAN coordinates.",
              "Report the caller's identity on Sanchar Saathi (Chakshu register) and file a complaint at cybercrime.gov.in."
            ]
          }
        };
      }
    }

    // Check scenario 2: UPI Safe / Refund collect requests
    if (lower.includes("upi") || lower.includes("pin") || lower.includes("phonepe") || lower.includes("gpay") || lower.includes("पिन") || lower.includes("પિન")) {
      if (lang === "hi") {
        return {
          text: "चेतावनी: यूपीआई 'कलेक्ट' अनुरोध जिसमें पैसे प्राप्त करने के लिए 'पे' (Pay) पर क्लिक करने या यूपीआई पिन दर्ज करने के लिए कहा जाता है, वह पूरी तरह से एक घोटाला है। ध्यान रखें, यूपीआई द्वारा पैसे प्राप्त करने के लिए कभी भी पिन दर्ज करने की आवश्यकता नहीं होती है। पिन केवल पैसे भेजने के लिए होता है।",
          profile: {
            score: 88,
            verdict: "DANGER",
            tactics: ["वित्तीय हेरफेर (Financial Manipulation)", "विपरीत-भुगतान जाल (Reverse-Payment Trap)", "फर्जी रिफंड योजना (Fake Refund System)"],
            recommendation: "अनुरोध को तुरंत अस्वीकार करें। यूपीआई पिन कभी भी पैसे पाने के लिए दर्ज नहीं किया जाता।",
            mitigation: [
              "अनुरोध पर क्लिक न करें; यूपीआई ऐप में इसे 'Decline' और 'Report' करें।",
              "अपना यूपीआई पिन साझा न करें।",
              "यूपीआई आईडी प्रदाता ऐप की सुरक्षा टीम को सूचित करें।"
            ]
          }
        };
      } else if (lang === "gu") {
        return {
          text: "ચેતવણી: કોઈપણ UPI કલેક્ટ વિનંતી જેમાં પૈસા મેળવવા માટે 'Pay' પર ક્લિક કરવા અથવા UPI PIN દાખલ કરવા કહેવામાં આવે છે, તે છેતરપિંડી છે. યાદ રાખો કે, UPI દ્વારા પૈસા મેળવવા માટે ક્યારેય પિન દાખલ કરવો પડતો નથી. પિન ફક્ત પૈસા ચૂકવવા માટે જ ઉપયોગી છે.",
          profile: {
            score: 88,
            verdict: "DANGER",
            tactics: ["નાણાકીય હેરાફેરી (Financial Manipulation)", "ઉલટા-ચુકવણીની જાળ (Reverse-Payment Trap)", "નકલી રિફંડ યોજના (Fake Refund System)"],
            recommendation: "વિનંતીને તરત જ નકારી દો. પૈસા મેળવવા પિન દાખલ કરવાની જરૂર નથી.",
            mitigation: [
              "UPI કલેક્ટ રિક્વેસ્ટને નકારી કાઢો અને તેને સ્કેમ તરીકે ફ્લેગ કરો.",
              "કોઈપણ સંજોગોમાં તમારો UPI પિન અન્ય કોઈને આપશો નહીં.",
              "તે પેમેન્ટ એપ્લિકેશન પર તે આઈડીને બ્લોક કરો."
            ]
          }
        };
      } else {
        return {
          text: "WARNING: UPI collect requests asking you to click 'Pay' or enter your UPI PIN to 'receive' or 'refund' money are absolute scams. To receive money, you NEVER need to input your PIN or approve requests. The PIN is exclusively meant to authorize outflows.",
          profile: {
            score: 88,
            verdict: "DANGER",
            tactics: ["Financial Manipulation", "Reverse-Payment Trap", "Fake Refund Scheme"],
            recommendation: "Decline the request immediately. UPI PINs are strictly for debit transactions.",
            mitigation: [
              "Do not click 'Pay'; Decline the request immediately in your PhonePe/GPay app.",
              "Report the suspect UPI handle to the service provider.",
              "Disable temporary auto-payments in your banking app."
            ]
          }
        };
      }
    }

    // Check scenario 3: Money transfer / bank block / escrow
    if (lower.includes("transfer") || lower.includes("money") || lower.includes("escrow") || lower.includes("ट्रांसफर") || lower.includes("पैसे") || lower.includes("પૈસા") || lower.includes("ટ્રાન્સફર")) {
      if (lang === "hi") {
        return {
          text: "चेतावनी: संदिग्ध लेन-देनों का पैटर्न। बैंक अधिकारी बनकर पैसे ट्रांसफर करने या बैंक खाता ब्लॉक होने की धमकी देकर 'सुरक्षित खातों' (Secured Accounts) में पैसे भेजने के लिए कहना एक प्रमुख धोखाधड़ी का तरीका है। बैंक कभी भी व्यक्तिगत खातों में फंड ट्रांसफर नहीं करवाते हैं।",
          profile: {
            score: 90,
            verdict: "DANGER",
            tactics: ["वित्तीय जबरदस्ती (Financial Coercion)", "फर्जी बैंक अधिकारी (Spoofed Executive)", "कृत्रिम एस्क्रो (Synthetic Escrow Trap)"],
            recommendation: "फंड ट्रांसफर तुरंत रोकें। बैंक कभी भी निजी खातों में पैसे भेजने को नहीं कहते।",
            mitigation: [
              "किसी भी खाते में पैसे न भेजें।",
              "अपनी आधिकारिक बैंक शाखा में जाकर खाते की वास्तविक स्थिति की जांच करें।",
              "कॉल नंबर को ब्लॉक करें और 1930 सुरक्षा हेल्पलाइन पर शिकायत दर्ज कराएं।"
            ]
          }
        };
      } else if (lang === "gu") {
        return {
          text: "ચેતવણી: શંકાસ્પદ આર્થિક વ્યવહાર. બેંક અધિકારી હોવાનો સ્વાંગ રચી ખાતું બંધ થવાની ધમકી આપીને 'સેફ સેક્યુરિટી એકાઉન્ટ' માં નાણાં ટ્રાન્સફર કરવા કહેવું એ એક છેતરપિંડી છે. બેંક ક્યારેય આ રીતે ગ્રાહક પાસે નાણાં ટ્રાન્સફર કરાવતી નથી.",
          profile: {
            score: 90,
            verdict: "DANGER",
            tactics: ["નાણાકીય બળજબરી (Financial Coercion)", "નકલી બેંક અધિકારી (Spoofed Executive)", "કૃત્રિમ એસ્ક્રો (Synthetic Escrow Trap)"],
            recommendation: "નાણાં ટ્રાન્સફર અટકાવો. સત્તાવાર બેંક ક્યારેય આવી માંગ કરતી નથી.",
            mitigation: [
              "કોઈપણ અજાણ્યા ખાતામાં નાણાં મોકલવાનું ટાળો.",
              "તમારી નજીકની બેંક શાખાનો રૂબરૂ સંપર્ક કરીને વિગતો ચકાસો.",
              "જો પૈસા મોકલી દીધા હોય તો તરત જ સાયબર સેલ હેલ્પલાઇન 1930 પર ફોન કરો."
            ]
          }
        };
      } else {
        return {
          text: "WARNING: Suspect transaction pattern. Scammers impersonate banking officers or customs departments to coerce victims into transferring money to 'safe verification escrow accounts'. Legitimate banks never ask you to move funds to resolve security blockages.",
          profile: {
            score: 90,
            verdict: "DANGER",
            tactics: ["Financial Coercion", "Synthetic Escrow Trap", "Authority Impersonation"],
            recommendation: "Hold all transfers. Bank executives do not request cash outs to personal registry codes.",
            mitigation: [
              "Do not transfer any funds. Terminate active bank application processes.",
              "Manually visit your bank branch to verify lock statuses.",
              "Call the National Cybercell immediately at 1930 if transfers were executed."
            ]
          }
        };
      }
    }

    // Check scenario 4: WhatsApp message verify / Hi mom / Lottery / KBC
    if (lower.includes("whatsapp") || lower.includes("message") || lower.includes("mom") || lower.includes("son") || lower.includes("लॉटरी") || lower.includes("વોટ્સએપ") || lower.includes("સંદેશ")) {
      if (lang === "hi") {
        return {
          text: "संदिग्ध: यह संदेश फ़िशिंग या पारिवारिक सदस्यों का रूप धारण करके पैसे ठगने के लक्षण प्रदर्शित करता है। अक्सर घोटालेबाज आपातकालीन सहायता ('मेरा फोन खराब हो गया है, इस खाते में तुरंत पैसे भेजें') या लॉटरी (KBC इनाम) के संदेश भेजते हैं।",
          profile: {
            score: 78,
            verdict: "SUSPICIOUS",
            tactics: ["पारिवारिक रूप धारण (Family Impersonation)", "सामाजिक हेरफेर (Social Engineering)", "आपातकालीन प्रलोभन (Urgency Trap)"],
            recommendation: "पैसे भेजने से पहले हमेशा दूसरे माध्यम से अपने पारिवारिक सदस्य से सीधे संपर्क करें।",
            mitigation: [
              "उस नंबर पर सीधे फोन कॉल करके सच्चाई का पता लगाएं (व्हाट्सएप कॉल नहीं)।",
              "संदेश में दिए गए किसी भी लिंक या फाइल को न खोलें।",
              "व्हाट्सएप पर उस नंबर को ब्लॉक और 'Report Spam' करें।"
            ]
          }
        };
      } else if (lang === "gu") {
        return {
          text: "શંકાસ્પદ: આ સંદેશ પારિવારિક સભ્યોનો નકલી સ્વાંગ રચી પૈસા પડાવવાની પદ્ધતિ (Family Impersonation) દર્શાવે છે. સ્કેમર્સ વારંવાર કટોકટી દર્શાવીને ('મારો ફોન બગડી ગયો છે, સારવાર માટે તાત્કાલિક પૈસા મોકલો') અથવા લોટરીની લાલચ આપી નાણાં માંગે છે.",
          profile: {
            score: 78,
            verdict: "SUSPICIOUS",
            tactics: ["પારિવારિક નકલી સ્વાંગ (Family Impersonation)", "સામાજિક હેરાફેરી (Social Engineering)", "કટોકટી જાળ (Urgency Trap)"],
            recommendation: "પૈસા મોકલતા પહેલાં તમારા કુટુંબના સભ્ય સાથે સીધો સંપર્ક કરીને ખાતરી કરો.",
            mitigation: [
              "બીજા સામાન્ય કોલ દ્વારા તમારા સભ્ય સાથે સીધી વાત કરો.",
              "વોટ્સએપ પર મળેલ અજાણી લિંક્સ ખોલશો નહીં.",
              "વોટ્સએપ પર તે નંબરને બ્લોક કરો..."
            ]
          }
        };
      } else {
        return {
          text: "SUSPICIOUS: This message shows signs of a 'Family Impersonation' or text phishing scam. Scammers often use emergency text setups ('Hi Mom, my phone broke, send hospital funds immediately to this account') or fake lottery rewards (KBC prizes) to provoke panicked financial actions.",
          profile: {
            score: 78,
            verdict: "SUSPICIOUS",
            tactics: ["Family Impersonation", "Social Engineering", "Panic Exploitation"],
            recommendation: "Verify the claim independently. Scammers mimic loved ones to exploit concern.",
            mitigation: [
              "Call your family member on their known normal phone number (do not call the new number).",
              "Never click links or download PDF slips from unknown WhatsApp chats.",
              "Block the sender and flag the channel as spam in WhatsApp."
            ]
          }
        };
      }
    }

    // Default custom query response
    if (lang === "hi") {
      return {
        text: "विश्लेषण पूर्ण: प्रस्तुत पाठ में सामान्य सामाजिक हेरफेर के लक्षण पाए गए हैं। प्रेषक के बारे में कोई आधिकारिक जानकारी उपलब्ध नहीं है। कृपया अज्ञात संपर्कों से प्राप्त लिंक या भुगतान अनुरोधों को अस्वीकार करें।",
        profile: {
          score: 65,
          verdict: "SUSPICIOUS",
          tactics: ["अपुष्ट स्रोत संदेश (Unverified Source)", "संभावित हेरफेर पैटर्न (NLP Sentiment Pattern)"],
          recommendation: "आगे की कार्रवाई करने से बचें। आधिकारिक स्रोतों से संपर्क की पुष्टि करें।",
          mitigation: [
            "किसी भी संवेदनशील विवरण को साझा न करें।",
            "नंबर या लिंक की आधिकारिक चैनलों पर पुष्टि करें।"
          ]
        }
      };
    } else if (lang === "gu") {
      return {
        text: "વિશ્લેષણ પૂર્ણ: સબમિટ કરેલા સંદેશમાં સામાજિક હેરાફેરીના સંકેતો મળ્યા છે. મોકલનારનો સ્ત્રોત અજાણ્યો છે. કૃપા કરીને બિનસત્તાવાર લિંક્સ ખોલવાનું અથવા નાણાકીય વ્યવહારો કરવાનું ટાળો.",
        profile: {
          score: 65,
          verdict: "SUSPICIOUS",
          tactics: ["અજાણ્યો સ્ત્રોત (Unverified Source)", "શંકાસ્પદ લખાણ શૈલી (NLP Sentiment Pattern)"],
          recommendation: "સાવચેતી રાખો. સત્તાવાર બેંક અથવા સંસ્થા સાથે સીધી ચર્ચા કરો.",
          mitigation: [
            "કોઈપણ ખાનગી માહિતી આપશો નહીં.",
            "શંકાસ્પદ લિંક્સ પર ક્લિક કરવાનું ટાળો."
          ]
        }
      };
    } else {
      return {
        text: "ANALYSIS COMPLETE: The submitted text shows characteristics of social engineering and suspicious solicitation. The origin details are unverified. Please avoid clicking embedded redirect links or paying unverified collection requests.",
        profile: {
          score: 65,
          verdict: "SUSPICIOUS",
          tactics: ["Unverified Source Origin", "NLP Coercion Sentiment Pattern"],
          recommendation: "Proceed with high caution. Cross-verify credentials before initiating any actions.",
          mitigation: [
            "Do not input usernames, bank codes, or security pins.",
            "Report the suspect source handle to your carrier services and local cyber cells."
          ]
        }
      };
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim() || typing) return;

    // Add user message
    const userMsg: Message = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setTyping(true);

    const delay = systemStress ? 3000 : 1500;
    // AI thinking delay
    setTimeout(() => {
      const result = getMockResponse(text, language);
      const aiMsg: Message = {
        sender: "ai",
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setActiveProfile(result.profile);
      setTyping(false);

      if (result.profile) {
        const severity = result.profile.verdict === "SAFE" ? "SUCCESS" : "ALERT";
        addAlert(
          `Citizen Portal chat verified threat context: ${result.profile.verdict} (${result.profile.score}% Risk)`,
          severity,
          {
            type: "Citizen Chat Check",
            score: `${result.profile.score}% Risk`,
            status: result.profile.verdict === "SAFE" ? "VERIFIED" : "BLOCKED"
          }
        );
      }
    }, delay);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    
    // Clear chat and reset with language-specific initial message
    const initialMessages = {
      en: "Hello! I am Citizen Kavach, your public safety assistant. Select one of the suggested prompts below or describe a suspicious message, WhatsApp claim, VoIP call, or money transfer request to evaluate scam risk.",
      hi: "नमस्ते! मैं सिटीजन कवच हूँ, आपकी सुरक्षा का डिजिटल सहायक। नीचे दिए गए सुरक्षा प्रश्नों में से एक चुनें या किसी संदिग्ध कॉल, व्हाट्सएप संदेश, या मनी ट्रांसफर के दावे का वर्णन करें ताकि खतरे के स्तर का आकलन किया जा सके।",
      gu: "નમસ્તે! હું સિટીઝન કવચ છું, તમારી જાહેર સુરક્ષાનો સહાયક. નીચે આપેલા પ્રશ્નોમાંથી એક પસંદ કરો અથવા શંકાસ્પદ સંદેશ, વોટ્સએપ ક્લેઇમ કે નાણાકીય વ્યવહારના દાવાનું વર્ણન કરી જોખમ સ્તર તપાસો."
    };

    setMessages([
      {
        sender: "ai",
        text: initialMessages[lang],
        timestamp: "Just now"
      }
    ]);
    setActiveProfile(null);
  };

  // SVG Gauge specifications
  const strokeDasharray = 175;
  const strokeDashoffset = activeProfile 
    ? strokeDasharray - (strokeDasharray * activeProfile.score) / 100 
    : strokeDasharray;

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-fuchsia-500/5 rounded-full filter blur-[110px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-violet-500/5 rounded-full filter blur-[130px] pointer-events-none -z-10" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-zinc-955/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <Shield className="w-5.5 h-5.5 text-fuchsia-400" />
            </div>
            <span className="font-bold text-base tracking-tight text-zinc-100">
              Kavach <span className="text-violet-550">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="cursor-pointer">
              <button className="font-sans text-sm font-semibold px-5 py-2.5 rounded bg-violet-650 hover:bg-violet-550 text-white transition-all duration-300 shadow-[0_4px_15px_rgba(139,92,246,0.2)] cursor-pointer">
                {localizations[language].activeConsole}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Chatbot Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full h-[620px]">
          <Card variant="violet" className="flex-1 flex flex-col justify-between h-full p-6 relative overflow-hidden bg-zinc-900/10">
            {/* Header info / language selector */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-350 mr-1 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="font-bold text-base text-zinc-100 font-sans">
                  {localizations[language].title}
                </span>
              </div>
              
              {/* Language Selector */}
              <div className="flex items-center gap-2 border border-zinc-800 rounded-lg p-1 bg-zinc-950 text-xs">
                <Globe className="w-3.5 h-3.5 text-zinc-500 ml-1.5" />
                {(["en", "hi", "gu"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-2.5 py-1 rounded-md font-bold cursor-pointer transition-colors ${
                      language === lang 
                        ? "bg-fuchsia-955 text-fuchsia-400 font-extrabold" 
                        : "text-zinc-500 hover:text-zinc-350"
                    }`}
                  >
                    {lang === "en" ? "EN" : lang === "hi" ? "हिन्दी" : "ગુજરાતી"}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 max-h-[380px]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-xl p-4 text-sm leading-relaxed border ${
                      msg.sender === "user"
                        ? "bg-zinc-900 border-zinc-800 text-zinc-200 text-right"
                        : "bg-fuchsia-955/10 border-fuchsia-500/10 text-zinc-300 text-left"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5 opacity-60 text-[10px] uppercase font-bold tracking-wider">
                      {msg.sender === "ai" ? (
                        <>
                          <Shield className="w-3.5 h-3.5 text-fuchsia-400" />
                          <span>Citizen Shield</span>
                        </>
                      ) : (
                        <span>Citizen User</span>
                      )}
                      <span className="ml-auto font-mono text-[9px]">{msg.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-line font-medium">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-xl p-4 border bg-fuchsia-955/10 border-fuchsia-500/10 text-zinc-400 flex items-center gap-2.5 text-xs font-semibold">
                    <RefreshCw className="w-4 h-4 text-fuchsia-400 animate-spin" />
                    <span>{localizations[language].typingText}</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested prompts area */}
            <div className="border-t border-zinc-805 pt-4 mt-4">
              <label className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block mb-2">
                {localizations[language].promptLabel}
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedPrompts[language].map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleSend(prompt.text)}
                    disabled={typing}
                    className="text-xs px-3.5 py-2 rounded-lg border border-zinc-800 bg-zinc-950/40 hover:border-fuchsia-500/40 hover:bg-fuchsia-955/10 text-zinc-400 hover:text-fuchsia-300 font-sans cursor-pointer transition-all duration-200"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>

              {/* Chat Input Field */}
              <div className="flex gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 focus-within:border-fuchsia-500 transition-colors">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputVal.trim()) {
                      handleSend(inputVal);
                    }
                  }}
                  disabled={typing}
                  placeholder={localizations[language].chatPlaceholder}
                  className="flex-1 bg-transparent border-none px-3.5 text-sm text-zinc-300 placeholder-zinc-650 focus:outline-none"
                />
                <button
                  onClick={() => handleSend(inputVal)}
                  disabled={!inputVal.trim() || typing}
                  className={`p-2.5 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                    !inputVal.trim() || typing
                      ? "bg-zinc-900 text-zinc-600"
                      : "bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Risk Evaluation Report */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full h-[620px]">
          <Card variant="violet" className="flex-1 flex flex-col justify-between h-full p-6 relative overflow-hidden bg-zinc-900/10">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5.5 h-5.5 text-fuchsia-400" />
                <span className="font-bold text-base text-zinc-200">
                  {localizations[language].riskTitle}
                </span>
              </div>
              <span className="text-xs text-zinc-550 font-bold">Model: Citizen-NLP-v2</span>
            </div>

            <div className="flex-1 flex flex-col justify-center my-4 overflow-y-auto max-h-[360px] pr-1">
              <AnimatePresence mode="wait">
                {activeProfile ? (
                  <motion.div
                    key={language + activeProfile.score}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-5 text-xs font-sans"
                  >
                    {/* Circle Score Meter & Verdict */}
                    <div className="flex items-center gap-5 p-4 rounded-xl border border-zinc-800 bg-zinc-950/40">
                      <div className="relative w-16 h-16 shrink-0">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="32" cy="32" r="28" fill="none" stroke="#27272a" strokeWidth="4.5" />
                          <motion.circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke={activeProfile.verdict === "DANGER" ? "#f43f5e" : activeProfile.verdict === "SUSPICIOUS" ? "#f59e0b" : "#10b981"}
                            strokeWidth="4.5"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-zinc-150">
                          {activeProfile.score}%
                        </div>
                      </div>

                      <div>
                        <span
                          className={`text-[10px] font-extrabold px-3 py-1.5 rounded border inline-block tracking-wide uppercase ${
                            activeProfile.verdict === "DANGER"
                              ? "text-red-400 bg-red-955/20 border-red-900/25"
                              : activeProfile.verdict === "SUSPICIOUS"
                              ? "text-amber-400 bg-amber-955/20 border-amber-900/25"
                              : "text-emerald-400 bg-emerald-955/20 border-emerald-900/25"
                          }`}
                        >
                          {localizations[language].threatVerdict}: {activeProfile.verdict}
                        </span>
                        <div className="text-[9px] text-zinc-550 mt-2 font-bold uppercase tracking-wider">
                          Scam Coercion Probability
                        </div>
                      </div>
                    </div>

                    {/* Detected Threat Vectors */}
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2.5">
                        {localizations[language].tacticLabel}
                      </span>
                      <div className="flex flex-col gap-2">
                        {activeProfile.tactics.map((tactic, idx) => (
                          <div key={idx} className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/20 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="text-[11px] font-bold text-zinc-350">{tactic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mitigation checklist */}
                    <div className="border-t border-zinc-800/80 pt-4">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-3">
                        {localizations[language].mitigationAction}
                      </span>
                      <ul className="list-disc pl-4 flex flex-col gap-2 text-zinc-300 font-semibold text-xs leading-relaxed">
                        {activeProfile.mitigation.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="standby"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 p-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/10 max-w-[340px] mx-auto text-xs"
                  >
                    <HelpCircle className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-sm text-zinc-400 font-bold">Linguistic Diagnostics Standby</p>
                    <p className="text-xs text-zinc-550 mt-2 leading-relaxed font-sans font-medium">
                      Analyze phone calls or text messages in the chat advisor to populate probability scorecards and recommendations.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Helpline Panel */}
            <div className="border-t border-zinc-800 pt-4 mt-auto">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                {localizations[language].helplinePointers}
              </span>
              <p className="text-[10.5px] text-zinc-500 leading-relaxed font-medium">
                {localizations[language].helplineBody}
              </p>
              
              <div className="flex justify-between items-center text-[10px] text-zinc-600 mt-4 font-mono">
                <span>Verification: Synchronized</span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-fuchsia-500" /> Digital Public Safety
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
