# 📁 DocuChain – Document Expiry & Reminder System

A full-stack MERN web application for securely managing personal documents and tracking their expiry with visual alerts and summaries.

## ✅ Features

1. **User authentication** using email and password with encrypted storage (`bcrypt`) and authorization via JWT
2. **Add, update, delete, and view** documents with details like title, category, expiry date, and file upload (PDF view supported)
3. **Expiry notification system** with urgency levels:
   - 🟥 Red: 0–7 days remaining
   - 🟨 Yellow: 8–15 days remaining
   - 🟩 Green: 16–30 days remaining
   - 🟫 Brown: Expired documents
4. **Dashboard with:**
   - All uploaded documents
   - Search by name, category, date, or file
   - Sorting options: upload date, expiry ascending/descending
5. **Profile page** showing user info, password reset option (min 6 characters), and a summary of document status
6. **Secure user data isolation** ensuring only logged-in users can access their own documents

## 🛠 Tech Stack

- **Frontend:** React.js, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** bcrypt for password hashing, JWT for secure access
