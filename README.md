# ScholarSync – Resume & Google Scholar Integration App

ScholarSync is a full-stack web application built with **Next.js** that intelligently integrates a user’s resume and their **Google Scholar** profile to recommend personalized project ideas based on skills, education, and research interests.

---

## 🚀 Features

- 📄 **Resume Upload** – Upload PDF or DOCX resumes
- 🧠 **AI-powered Resume Parsing** – Extracts name, contact, skills, education, experience
- 🎓 **Google Scholar Integration** – Fetches citations, interests, and publication data
- 💡 **Smart Project Recommendations** – Recommends projects tailored to user's expertise
- ⚛️ **Modern UI** – Built with Tailwind CSS and responsive React components
- 🔐 **Secure** – Input validation, file type checks, rate limiting

---

## 🧑‍💻 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **State Management:** React Context API
- **Backend:** Next.js API Routes
- **Resume Parsing:** pdf-parse / mammoth.js
- **Scholar Data Fetching:** Cheerio web scraping
- **Project Matching:** Custom recommendation engine
- **Testing (Optional):** Jest, React Testing Library, Cypress

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/menacingly-coded/scholarsync-resume-integration-shreya-sharma.git
cd scholarsync-resume-integration-shreya-sharma

# Install dependencies
npm install

# Run the app
npm run dev
