# CareDoc — Health & Social Care Documentation System
 
A professional, modular, browser-based care documentation app for care homes.
Supports 10 residents and covers all core daily documentation requirements.
 
---
 
## 📁 Project Structure
 
```
caredoc/
├── index.html              ← Main HTML shell (loads everything)
├── css/
│   └── styles.css          ← All shared styles
├── data/
│   ├── residents.js        ← Resident profiles (replace with your own)
│   └── store.js            ← Central in-memory data store
├── js/
│   ├── utils.js            ← Shared helper functions (XSS-safe rendering)
│   ├── app.js              ← App controller (routing, resident switching)
│   └── modules/
│       ├── dashboard.js        ← Dashboard summary
│       ├── dailyNotes.js       ← Daily notes entry & log
│       ├── continence.js       ← Continence monitoring
│       ├── activity.js         ← Activity & engagement
│       ├── nightReport.js      ← Night report & checks
│       ├── personalCare.js     ← Personal care & nail records
│       ├── freqSeverity.js     ← Frequency & severity monitoring
│       ├── medication.js       ← Medication administration record
│       ├── fluidNutrition.js   ← Fluid & nutrition records
│       ├── epilepsy.js         ← Epilepsy / seizure monitoring
│       └── residents.js        ← All residents overview
├── .gitignore
└── README.md
