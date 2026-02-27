# CancerDetect AI 🔬

A full-stack, AI-powered web application for classifying medical images into 8 distinct cancer types. The app uses a deep learning model based on **MobileNetV3Large** to deliver fast, highly accurate predictions complete with confidence scores and top-3 ranked breakdowns.

![CancerDetect AI Preview](https://via.placeholder.com/1200x630/0f172a/00d4ff?text=CancerDetect+AI)

> **Disclaimer:** This project is for educational and research purposes only. It is not intended for clinical diagnosis. 

---

## ✨ Features

* **Advanced AI Classification:** Powered by a MobileNetV3Large model trained to detect 8 cancer types (Acute Lymphoblastic Leukemia, Brain Cancer, Breast Cancer, Cervical Cancer, Kidney Cancer, Lung/Colon Cancer, Lymphoma, Oral Cancer).
* **Batch Image Upload:** Upload and analyse up to 5 medical images concurrently in a single batch.
* **Instant Results:** Fast inference on the Python backend returning top-3 predictions and confidence scores.
* **Secure Authentication:** JWT-based user authentication (login/register) to keep prediction histories private.
* **Prediction History:** Browse past predictions with built-in filtering by cancer type, and the ability to view detailed breakdowns or delete records.
* **Cloud Storage:** User-uploaded medical images are securely stored in Cloudinary, organized in user-specific folders.
* **Responsive Modern UI:** Built with Next.js App Router and styled with Tailwind CSS, featuring glassmorphism, smooth animations, and interactive SVG iconography.

---

## 🛠 Tech Stack

### Frontend
* **Framework:** Next.js (App Router)
* **Styling:** Vanilla CSS + component-level inline styles (Tailwind-inspired utility classes)
* **Charting:** Recharts (for confidence bar charts)
* **Data Fetching:** Axios

### Backend
* **Framework:** FastAPI
* **Machine Learning:** TensorFlow / Keras (`multi_cancer_mobilenetv3_model.keras`)
* **Database:** MongoDB Atlas (accessed via `motor` async driver)
* **Authentication:** JWT (JSON Web Tokens), `passlib[bcrypt]`
* **Image Hosting:** Cloudinary

---

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites
* **Node.js** (v18+)
* **Python** (v3.10+)
* **MongoDB Atlas** account (or local MongoDB instance)
* **Cloudinary** account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Cancer-Detection.git
cd Cancer-Detection
```

### 2. Backend Setup
Navigate to the backend directory, set up a virtual environment, install dependencies, and configure your environment variables.

```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Environment Variables (`backend/.env`)**
Create a `.env` file in the `backend` folder:
```ini
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_ALGORITHM=HS256
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Run the Backend Server**
```bash
uvicorn main:app --reload
```
*The backend will be running at `http://127.0.0.1:8000`. You can view interactive API docs at `http://127.0.0.1:8000/docs`.*

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, install packages, and set up your environment variables.

```bash
cd frontend
npm install
```

**Environment Variables (`frontend/.env.local`)**
Create a `.env.local` file in the `frontend` folder:
```ini
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**Run the Frontend Development Server**
```bash
npm run dev
```
*The frontend will be running at `http://localhost:3000` (or whichever port Next CLI assigns, usually 3000 or 3001).*

---

## 📂 Project Structure

```text
Cancer-Detection/
├── backend/
│   ├── main.py              # FastAPI application entry point, routes
│   ├── auth.py              # JWT generation, token verification, password hashing
│   ├── database.py          # MongoDB and Cloudinary connection instances
│   ├── requirements.txt     # Python dependencies
│   └── multi_cancer_mobilenetv3_model.keras  # The compiled TensorFlow model
│
└── frontend/
    ├── app/
    │   ├── globals.css      # Global styles, variables, utility classes
    │   ├── layout.js        # Root Next.js layout
    │   ├── page.js          # Home/Landing page
    │   ├── login/           # Login page
    │   ├── register/        # Registration page
    │   ├── predict/         # Main upload/inference app page
    │   ├── history/         # User prediction history page
    │   └── about/           # Detailed cancer type information modal page
    │
    ├── components/
    │   ├── Navbar.js        # Main navigation bar (auth-aware)
    │   ├── ProtectedRoute.js# Wrapper to enforce authentication
    │   ├── ImageUploader.js # Drag-and-drop file uploader component (single/batch)
    │   └── PredictionResult.js # View component for chart rendering
    │
    └── lib/
        └── api.js           # Axios instance configured with JWT auth interceptor
```

---

## 💻 How to Use

1. **Sign Up / Login:** Create an account to secure your data.
2. **Navigate to Predict:** Click on the "Predict" tab.
3. **Upload an Image:** Drag and drop or browse to select a medical image (e.g., Histopathology, CT, MRI, Microscopy) in the `Single Image` tab.
4. **Batch Analysis (Optional):** Click the `Batch Upload` tab to select and process up to 5 images at once.
5. **View Results:** Click "Analyse". The model will return the predicted cancer type, a confidence score, and a top-3 breakdown graph.
6. **Review History:** Navigate to the "History" tab to review past analyses.
