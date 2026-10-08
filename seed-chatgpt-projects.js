const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function seedProjects() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const envFile = Object.fromEntries(
    envContent.split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const [key, ...val] = line.split('=');
        return [key.trim(), val.join('=').trim()];
      })
  );

  const supabaseUrl = envFile['NEXT_PUBLIC_SUPABASE_URL'] || envFile['SUPABASE_URL'];
  const supabaseKey = envFile['SUPABASE_SERVICE_ROLE_KEY'] || envFile['SUPABASE_SECRET_KEY'];

  const supabase = createClient(supabaseUrl, supabaseKey);

  const projects = [
    {
      id: "chatgpt-1",
      title: "AI Resume Analyzer",
      slug: "ai-resume-analyzer",
      branch: "AIML",
      category: "MAJOR_FINAL_YEAR",
      short_description: "An AI-powered tool that analyzes resumes against job descriptions.",
      full_description: "This project uses Natural Language Processing (NLP) to parse resumes and compare them against job requirements. It provides a match score, highlights missing keywords, and suggests improvements for candidates to increase their chances of selection. Built using Python, NLTK, and a modern web frontend.",
      tech_stack: ["Python", "NLP", "React", "Flask"],
      price_inr: 1500,
      discounted_price_inr: 999,
      thumbnail_url: "/images/resume_analyzer.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-2",
      title: "Student Performance Predictor",
      slug: "student-performance-predictor",
      branch: "CSE",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Machine learning model to predict student academic outcomes.",
      full_description: "This system uses historical student data (attendance, internal marks, extra-curriculars) to train an ML model (Random Forest / SVM) to predict final exam performance. It provides actionable insights to educators to help struggling students early.",
      tech_stack: ["Python", "Scikit-Learn", "Django"],
      price_inr: 1800,
      discounted_price_inr: 1199,
      thumbnail_url: "/images/student_performance.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-3",
      title: "AI-Based Attendance System",
      slug: "ai-based-attendance-system",
      branch: "CSEDS",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Facial recognition-based automated attendance system.",
      full_description: "A computer vision application that captures classroom photos and automatically marks attendance using facial recognition. Eliminates proxy attendance and saves lecture time. Uses OpenCV and deep learning facial embeddings.",
      tech_stack: ["OpenCV", "Python", "Deep Learning"],
      price_inr: 2500,
      discounted_price_inr: 1799,
      thumbnail_url: "/images/attendance_system.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-4",
      title: "College Placement Prediction System",
      slug: "college-placement-prediction",
      branch: "IT",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Predicts placement probability based on student skills and academics.",
      full_description: "This application analyzes a student's CGPA, technical skills, and internship experience to predict their probability of getting placed in top-tier, mid-tier, or service-based companies, and recommends areas of improvement.",
      tech_stack: ["Machine Learning", "Flask", "React"],
      price_inr: 1600,
      discounted_price_inr: 1099,
      thumbnail_url: "/images/placement_prediction.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-5",
      title: "Fake News Detection",
      slug: "fake-news-detection",
      branch: "AIML",
      category: "MAJOR_FINAL_YEAR",
      short_description: "NLP based system to classify news articles as real or fake.",
      full_description: "Using advanced text classification techniques (TF-IDF, LSTM), this project takes a news headline or article body and predicts the likelihood of it being fabricated, helping combat misinformation online.",
      tech_stack: ["Python", "TensorFlow", "NLP"],
      price_inr: 2000,
      discounted_price_inr: 1499,
      thumbnail_url: "/images/fake_news.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-6",
      title: "Sentiment Analysis Web App",
      slug: "sentiment-analysis-web-app",
      branch: "AIML",
      category: "MINI_PROJECT",
      short_description: "Analyzes text or social media posts to determine emotion.",
      full_description: "A web app where users can input text or a Twitter handle. The backend uses NLP models like VADER or BERT to classify the sentiment as Positive, Negative, or Neutral, and displays beautiful charts.",
      tech_stack: ["Python", "NLTK", "Next.js"],
      price_inr: 1200,
      discounted_price_inr: 799,
      thumbnail_url: "/images/sentiment_analysis.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-7",
      title: "College FAQ Chatbot",
      slug: "college-faq-chatbot",
      branch: "CSE",
      category: "MINI_PROJECT",
      short_description: "AI conversational agent for college admission inquiries.",
      full_description: "An intelligent chatbot trained on a college's FAQ documents. It uses intent recognition to automatically answer student queries regarding admissions, fees, hostel facilities, and courses, reducing the burden on administration.",
      tech_stack: ["Dialogflow", "Node.js", "React"],
      price_inr: 1500,
      discounted_price_inr: 999,
      thumbnail_url: "/images/faq_chatbot.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-8",
      title: "AI Study Planner",
      slug: "ai-study-planner",
      branch: "IT",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Smart schedule generator based on syllabus and exam dates.",
      full_description: "Students input their syllabus, weak subjects, and exam dates. The AI generates an optimized, spaced-repetition study schedule to maximize retention and ensure complete coverage before exams.",
      tech_stack: ["React", "Python AI", "MongoDB"],
      price_inr: 1800,
      discounted_price_inr: 1299,
      thumbnail_url: "/images/study_planner.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-9",
      title: "Online Complaint Management System",
      slug: "complaint-management-system",
      branch: "CSE",
      category: "MINI_PROJECT",
      short_description: "A portal for submitting and tracking civic or campus complaints.",
      full_description: "A clean web portal where users can register complaints (e.g., maintenance, infrastructure). Admins can assign tickets to staff, update statuses, and users receive email notifications upon resolution.",
      tech_stack: ["PHP", "MySQL", "Bootstrap"],
      price_inr: 900,
      discounted_price_inr: 599,
      thumbnail_url: "/images/complaint_system.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-10",
      title: "College Event Management System",
      slug: "event-management-system",
      branch: "IT",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Centralized hub for college fests and workshops.",
      full_description: "A comprehensive platform to host tech fests. Features include online registration, QR code generation for digital passes, an admin dashboard for attendance tracking, and payment gateway integration.",
      tech_stack: ["MERN Stack", "Stripe API"],
      price_inr: 2200,
      discounted_price_inr: 1599,
      thumbnail_url: "/images/event_management.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-11",
      title: "Expense Tracker with AI Insights",
      slug: "expense-tracker-ai",
      branch: "CSE",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Personal finance app with smart spending categorization.",
      full_description: "Users log their daily expenses, and the AI categorizes them automatically. It provides monthly predictive insights, flags unusual spending patterns, and suggests saving strategies.",
      tech_stack: ["React Native", "Firebase", "Python"],
      price_inr: 1800,
      discounted_price_inr: 1299,
      thumbnail_url: "/images/cseds_churn.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-12",
      title: "Hospital Appointment System",
      slug: "hospital-appointment-system",
      branch: "IT",
      category: "MINI_PROJECT",
      short_description: "Patient booking and doctor scheduling portal.",
      full_description: "A healthcare web app allowing patients to view doctor availability and book slots. Includes a doctor dashboard to manage queues and a prescription generation module.",
      tech_stack: ["Django", "PostgreSQL"],
      price_inr: 1000,
      discounted_price_inr: 699,
      thumbnail_url: "/images/aiml_medical_xray.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-13",
      title: "Smart Library Management System",
      slug: "smart-library",
      branch: "CSE",
      category: "MINI_PROJECT",
      short_description: "Automated book tracking and issuing system.",
      full_description: "Replaces traditional library ledgers. Features include barcode scanning for books, automatic fine calculation, and a student portal to check book availability and reserve titles.",
      tech_stack: ["Spring Boot", "React", "MySQL"],
      price_inr: 1100,
      discounted_price_inr: 799,
      thumbnail_url: "/images/hero_engineering_lab.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-14",
      title: "Food Recommendation System",
      slug: "food-recommendation",
      branch: "AIML",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Suggests meals based on user preferences and dietary restrictions.",
      full_description: "Uses collaborative filtering and content-based recommendation algorithms to suggest recipes or restaurant items based on a user's past ratings, allergies, and calorie goals.",
      tech_stack: ["Python", "Pandas", "Streamlit"],
      price_inr: 1600,
      discounted_price_inr: 1099,
      thumbnail_url: "/images/cse_microservices.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-15",
      title: "Job Recommendation System",
      slug: "job-recommendation",
      branch: "CSEDS",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Matches candidates with job descriptions.",
      full_description: "A machine learning project that uses TF-IDF and cosine similarity to map user skills to the most relevant job postings scraped from the internet.",
      tech_stack: ["Python", "BeautifulSoup", "Flask"],
      price_inr: 1900,
      discounted_price_inr: 1399,
      thumbnail_url: "/images/it_zero_trust.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-16",
      title: "Disease Prediction System",
      slug: "disease-prediction",
      branch: "AIML",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Predicts multiple diseases from patient symptoms.",
      full_description: "A unified healthcare AI that takes an array of symptoms as input and uses Decision Trees / Naive Bayes to predict the likelihood of common diseases, advising whether to consult a doctor.",
      tech_stack: ["Python ML", "React", "FastAPI"],
      price_inr: 2100,
      discounted_price_inr: 1599,
      thumbnail_url: "/images/aiml_medical_xray.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-17",
      title: "E-Learning Platform with Quiz Generator",
      slug: "elearning-quiz-generator",
      branch: "CSE",
      category: "MAJOR_FINAL_YEAR",
      short_description: "LMS that auto-generates quizzes from lecture notes.",
      full_description: "A learning management system where teachers upload PDF notes, and an AI module extracts text and automatically generates Multiple Choice Questions (MCQs) for student assessment.",
      tech_stack: ["Next.js", "OpenAI API", "Supabase"],
      price_inr: 2800,
      discounted_price_inr: 1999,
      thumbnail_url: "/images/ece_smart_agri.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-18",
      title: "AI Interview Preparation System",
      slug: "ai-interview-prep",
      branch: "AIML",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Mock interview bot with emotion and speech analysis.",
      full_description: "Students give a mock interview via webcam. The system analyzes their facial expressions, tone of voice, and answer relevance using AI, providing a detailed feedback report.",
      tech_stack: ["Deep Learning", "WebRTC", "Python"],
      price_inr: 3500,
      discounted_price_inr: 2499,
      thumbnail_url: "/images/aids_drowsiness.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-19",
      title: "Crop Disease Detection",
      slug: "crop-disease-detection",
      branch: "CSEDS",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Identifies plant diseases from leaf images.",
      full_description: "A CNN-based image classification model trained on the PlantVillage dataset. Farmers upload a photo of a diseased leaf, and the app identifies the disease and suggests pesticides.",
      tech_stack: ["TensorFlow", "Keras", "React Native"],
      price_inr: 2200,
      discounted_price_inr: 1499,
      thumbnail_url: "/images/ece_smart_agri.jpg",
      file_path: "placeholder.zip"
    },
    {
      id: "chatgpt-20",
      title: "Traffic Sign Recognition",
      slug: "traffic-sign-recognition",
      branch: "AIML",
      category: "MAJOR_FINAL_YEAR",
      short_description: "Autonomous vehicle component to detect traffic signs.",
      full_description: "Uses Convolutional Neural Networks (CNNs) to accurately classify German Traffic Sign datasets. A critical subsystem for self-driving cars to interpret stop signs, speed limits, and warnings.",
      tech_stack: ["Python", "CNN", "OpenCV"],
      price_inr: 2000,
      discounted_price_inr: 1399,
      thumbnail_url: "/images/eee_smart_meter.jpg",
      file_path: "placeholder.zip"
    }
  ];

  console.log(`Inserting ${projects.length} ChatGPT projects...`);
  
  for (const project of projects) {
    const { error } = await supabase.from('projects').insert(project);
    if (error) {
      console.error(`Failed to insert ${project.title}:`, error.message);
    } else {
      console.log(`Inserted: ${project.title}`);
    }
  }

  console.log('Finished seeding projects!');
}

seedProjects();
