export type Language = 'en' | 'kn' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    cropRecommendation: string;
    soilAnalysis: string;
    fertilizerAdvisory: string;
    irrigationAdvisory: string;
    diseaseDetection: string;
    chatAssistant: string;
    history: string;
    profile: string;
    login: string;
    register: string;
    logout: string;
  };
  dashboard: {
    welcome: string;
    quickSummary: string;
    totalCrops: string;
    totalSoilReports: string;
    totalDiagnoses: string;
    savedReports: string;
    recentActivity: string;
    startNew: string;
    alertsTitle: string;
    alertsBody: string;
  };
  actions: {
    submit: string;
    loading: string;
    save: string;
    delete: string;
    exportPdf: string;
    readAloud: string;
    stopAudio: string;
    retry: string;
    back: string;
  };
  disclaimerNotice: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "Krishi Mitra AI",
    tagline: "AI-Powered Agricultural Decision Support for Indian Farmers",
    nav: {
      dashboard: "Dashboard",
      cropRecommendation: "Crop Recommendation",
      soilAnalysis: "Soil Health Analysis",
      fertilizerAdvisory: "Fertilizer Advisory",
      irrigationAdvisory: "Irrigation Scheduling",
      diseaseDetection: "Plant Doctor (Disease)",
      chatAssistant: "Ask Krishi Mitra",
      history: "Advisory History",
      profile: "Farmer Profile",
      login: "Log In",
      register: "Register",
      logout: "Log Out"
    },
    dashboard: {
      welcome: "Welcome back, Farmer Friend!",
      quickSummary: "Real-time decision support based on verified agro-climatic conditions.",
      totalCrops: "Crop Plans",
      totalSoilReports: "Soil Tests",
      totalDiagnoses: "Plant Scans",
      savedReports: "Saved Reports",
      recentActivity: "Recent Farming Consultations",
      startNew: "Launch New Advisory",
      alertsTitle: "Seasonal Weather & Agronomy Notice",
      alertsBody: "Ensure timely basal fertilizer application and inspect crops for early seasonal pest pressure."
    },
    actions: {
      submit: "Generate AI Advisory",
      loading: "Analyzing with Agricultural Intelligence...",
      save: "Save Advisory",
      delete: "Delete Record",
      exportPdf: "Download PDF Dossier",
      readAloud: "Listen in Voice",
      stopAudio: "Stop Voice",
      retry: "Try Again",
      back: "Back to Dashboard"
    },
    disclaimerNotice: "Notice: AI-generated guidance is scientific decision-support information, not a guaranteed commercial prediction. Verify critical chemical applications with your local KVK or Agricultural Extension Officer."
  },
  kn: {
    appName: "ಕೃಷಿ ಮಿತ್ರ AI",
    tagline: "ಭಾರತೀಯ ರೈತರಿಗಾಗಿ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ ಕೃಷಿ ನಿರ್ಧಾರ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆ",
    nav: {
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      cropRecommendation: "ಬೆಳೆ ಶಿಫಾರಸು",
      soilAnalysis: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ",
      fertilizerAdvisory: "ಗೊಬ್ಬರ ಸಲಹಾ ಸೇವೆ",
      irrigationAdvisory: "ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ",
      diseaseDetection: "ಸಸ್ಯ ರೋಗ ಪತ್ತೆ (ಪ್ಲಾಂಟ್ ಡಾಕ್ಟರ್)",
      chatAssistant: "ಕೃಷಿ ಮಿತ್ರನನ್ನು ಕೇಳಿ",
      history: "ಹಿಂದಿನ ವರದಿಗಳು",
      profile: "ರೈತರ ವಿವರ",
      login: "ಲಾಗಿನ್",
      register: "ನೋಂದಣಿ",
      logout: "ಲಾಗ್‌ಔಟ್"
    },
    dashboard: {
      welcome: "ಮತ್ತೆ ಸುಸ್ವಾಗತ, ರೈತ ಮಿತ್ರರೇ!",
      quickSummary: "ನಿಮ್ಮ ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ ಸೂಕ್ತವಾದ ಕೃಷಿ ಮಾರ್ಗದರ್ಶನ.",
      totalCrops: "ಬೆಳೆ ಯೋಜನೆಗಳು",
      totalSoilReports: "ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಗಳು",
      totalDiagnoses: "ರೋಗ ತಪಾಸಣೆಗಳು",
      savedReports: "ಉಳಿಸಿದ ವರದಿಗಳು",
      recentActivity: "ಇತ್ತೀಚಿನ ಕೃಷಿ ಸಮಾಲೋಚನೆಗಳು",
      startNew: "ಹೊಸ ಸಲಹೆ ಆರಂಭಿಸಿ",
      alertsTitle: "ಋತುಮಾನದ ಹವಾಮಾನ ಮತ್ತು ಕೃಷಿ ಸೂಚನೆ",
      alertsBody: "ಸಕಾಲದಲ್ಲಿ ಮೂಲ ಗೊಬ್ಬರವನ್ನು ನೀಡಿ ಮತ್ತು ಕೀಟ ಬಾಧೆಯನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ."
    },
    actions: {
      submit: "AI ಸಲಹೆ ಪಡೆಯಿರಿ",
      loading: "ಕೃಷಿ ಬುದ್ಧಿಮತ್ತೆಯೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
      save: "ವರದಿ ಉಳಿಸಿ",
      delete: "ಅಳಿಸಿ",
      exportPdf: "ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್",
      readAloud: "ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ",
      stopAudio: "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ",
      retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
      back: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ"
    },
    disclaimerNotice: "ಸೂಚನೆ: AI-ಉತ್ಪಾದಿತ ಮಾರ್ಗದರ್ಶನವು ಕೃಷಿ ನಿರ್ಧಾರ-ಬೆಂಬಲ ಮಾಹಿತಿಯಾಗಿದೆ. ಯಾವುದೇ ರಾಸಾಯನಿಕ ಸಿಂಪಡಿಸುವ ಮುನ್ನ ನಿಮ್ಮ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿ ಅಥವಾ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರವನ್ನು (KVK) ಸಂಪರ್ಕಿಸಿ."
  },
  hi: {
    appName: "कृषि मित्र AI",
    tagline: "भारतीय किसानों के लिए एआई-संचालित कृषि निर्णय सहायता प्रणाली",
    nav: {
      dashboard: "डैशबोर्ड",
      cropRecommendation: "फसल सिफारिश",
      soilAnalysis: "मृदा स्वास्थ्य विश्लेषण",
      fertilizerAdvisory: "उर्वरक सलाह",
      irrigationAdvisory: "सिंचाई प्रबंधन",
      diseaseDetection: "पौध रोग पहचान",
      chatAssistant: "कृषि मित्र से पूछें",
      history: "परामर्श इतिहास",
      profile: "किसान प्रोफ़ाइल",
      login: "लॉग इन",
      register: "पंजीकरण",
      logout: "लॉग आउट"
    },
    dashboard: {
      welcome: "वापसी पर स्वागत है, किसान साथी!",
      quickSummary: "सत्यापित कृषि-जलवायु परिस्थितियों पर आधारित वास्तविक समय मार्गदर्शन।",
      totalCrops: "फसल योजनाएं",
      totalSoilReports: "मृदा परीक्षण",
      totalDiagnoses: "रोग जांच",
      savedReports: "सहेजी गई रिपोर्ट",
      recentActivity: "हाल के कृषि परामर्श",
      startNew: "नया परामर्श लें",
      alertsTitle: "मौसमी कृषि एवं मौसम सूचना",
      alertsBody: "समय पर आधार खाद डालें और कीटों के प्रकोप पर निरंतर नज़र रखें।"
    },
    actions: {
      submit: "एआई सलाह प्राप्त करें",
      loading: "कृषि बुद्धिमत्ता से विश्लेषण हो रहा है...",
      save: "रिपोर्ट सहेजें",
      delete: "हटाएं",
      exportPdf: "पीडीएफ डाउनलोड करें",
      readAloud: "आवाज़ में सुनें",
      stopAudio: "आवाज़ रोकें",
      retry: "पुनः प्रयास करें",
      back: "डैशबोर्ड पर वापस जाएं"
    },
    disclaimerNotice: "सूचना: एआई-जनित सलाह वैज्ञानिक निर्णय-समर्थन जानकारी है। किसी भी रासायनिक उपचार से पहले अपने स्थानीय कृषि विस्तार अधिकारी या कृषि विज्ञान केंद्र (KVK) से पुष्टि अवश्य करें।"
  }
};

