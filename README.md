# Web Syllabus & E-Resource Technology (WSE)

A cloud-native, high-fidelity academic portal engineered to bridge the gap between academic syllabi and learning resources for engineering colleges. Featuring a dynamic role-based architecture, secure institutional access, a live streaming Gemini AI tutor, and Firestore synchronization.

---

## 🚀 Key Platform Features

### 1. Unified Syllabus Module Explorer
* Filter course details, credits weightage, and modular syllabus guidelines dynamically by branch (CS, IT, ECE) and semester.
* Displays clean, interactive accordion blueprints mapped strictly to standard assessment patterns.

### 2. Scholastic Asset Library (Downloads)
* Download verified lecture slides, solved exam question banks, micro-lecture PPTs, and e-books.
* Features automatic download counters and responsive category categorization (Notes, E-Book, Paper, PPT) with zero ads.

### 3. Collaborative Assignment Vault
* **Students**: Track deadlines, review task rules, and upload PDF solutions directly to the cloud.
* **Professors**: Access an interactive **Grading Vault** showing student answers queue to assign grades, review feedback scores, and record marks.

### 4. Agentic AI Learning Tutor
* A custom-trained chatbot powered by the **Google Gemini Flash API** providing conversational tutoring.
* Streams solutions chunk-by-chunk with typing indicators, outputting comprehensive concept guides, review checklists, and syntax-highlighted code panels.

### 5. Multi-Role Access Control (RBAC)
* **Student Scope**: Query course modules, download learning resources, upload solution files, and consult the AI tutor.
* **Professor Scope**: Full CRUD authority to upload files, add new syllabus topics, create homework, and score submissions.
* **Admin Scope**: Full collection CRUD control + **User Directory Role Approver Panel** to upgrade/demote user permissions dynamically in real-time.

---

## 🛠️ Technological Architecture

* **Frontend**: React 18, Vite, Tailwind CSS v4, React Router v6, Lucide Icons, Chart.js.
* **Database**: Firebase Cloud Firestore (real-time read/write CRUD streams).
* **Identity Protection**: Firebase Authentication supporting standard signup + **Google Popup Auth** (strictly gatekept to the institute's `@iare.ac.in` domain).
* **AI Engine**: Google Gemini API.

---

## 🔑 Security Gatekeep: Strict Domain Firewall
To protect collegiate assets, the platform enforces strict domain-level filters:
* **Registration**: Standard sign-ups with external emails (e.g., `@gmail.com`) are dynamically blocked.
* **Google Popup Auth**: If a user authenticates using a Google account outside the `@iare.ac.in` domain, the system forcefully signs them out and throws an access restriction error.

---

## 📦 Installation & Setup

Follow these steps to run this cloud portal locally on your environment:

### Prerequites
* Node.js (version 18 or higher recommended)
* npm (Node Package Manager)

### 1. Clone & Extract Repository
Navigate into the root directory inside your shell:
```bash
cd "wse final"
```

### 2. Configure Environment Keys
Create a `.env` file in the root directory and register your live Firebase & Gemini API credentials:
```env
VITE_FIREBASE_API_KEY="your_api_key_here"
VITE_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"

VITE_GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Launch Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser to evaluate the portal.

### 5. Compile Optimized Production Bundles
To compile and audit standard, high-performance static bundles:
```bash
npm run build
```
Compiled builds will sit inside the `/dist` directory.

---

## 👩‍💻 Developer Credits
* **Developer Name**: Satya Prasad
* **Roll Number**: 24951A235
* **Target Institution**: Institute of Aeronautical Engineering (IARE)
