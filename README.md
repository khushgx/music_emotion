

# Music Emotion Project
This project provides a mood-based music recommendation system. Users can select their current emotion, or draw a mood board and the system will suggest music accordingly.


## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
3. [Running the Application](#running-the-application)
   - [Starting the Backend](#starting-the-backend)
   - [Starting the Frontend](#starting-the-frontend)

## Prerequisites

- Python 3.10 or later
- Node.js
- Yarn or npm

## Getting Started

### Backend Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/khushgx/music_emotion.git
   ```

2. **Navigate to the backend directory**:

   ```bash
   cd music_emotion/backend
   ```

3. **Setup a virtual environment** 

   ```bash
   python3 -m venv venv
   ```


4. **Activate the virtual environments**:

   - On macOS and Linux:

     ```bash
     source venv/bin/activate
     ```

   - On Windows:

     ```bash
     .\venv\Scripts\activate
     ```

5. **Install the necessary Python packages**:

   ```bash
     pip install flask flask_sqlalchemy flask_cors Pillow webcolors openai metaphor-python
     ```

### Frontend Setup

1. **Navigate to the frontend directory**:

   ```bash
   cd ../frontend
   ```

2. **Install the necessary JavaScript packages**:

   ```bash
   npm install
   # or if you are using Yarn:
   # yarn install
   ```

## Running the Application

### Setting up the environment Variables Make sure you do this inside the venv in the backend directory: 
``` bash
export OPENAI_API_KEY='your_api_key_here'
export METAPHOR_API_KEY='your_metaphor_api_key_here' 
```

### Starting the Backend

While in the `backend` directory and with the virtual environment activated:

```bash
python app.py
```

### Starting the Frontend

While in the `frontend` directory:

```bash
npm run dev
# or if you are using Yarn:
# yarn start
```

### Usage
Once both the frontend and backend servers are running, navigate to the frontend URL (usually http://localhost:3000 if using Next.js by default) in your browser. Choose your current mood and get a personalized music recommendation.

