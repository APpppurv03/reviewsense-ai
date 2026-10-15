
pipeline {
    agent any

    environment {
        PYTHONDONTWRITEBYTECODE = '1'
        PYTHONUNBUFFERED = '1'
        GEMINI_API_KEY = 'test-mock-key-not-for-production'
        GEMINI_MODEL = 'gemini-2.5-flash'
        FLASK_ENV = 'testing'
        VENV = '.venv'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('Python Environment Check') {
            steps {
                echo 'Verifying Python installation...'
                sh 'python3 --version'
            }
        }

        stage('Create Virtual Environment') {
            steps {
                echo 'Creating isolated Python environment...'
                sh 'python3 -m venv "$VENV"'
                sh '"$VENV/bin/python" -m pip install --upgrade pip'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing project dependencies...'
                sh '"$VENV/bin/python" -m pip install -r requirements.txt'
            }
        }

        stage('Run Pytest Test Suite') {
            steps {
                echo 'Running automated tests...'
                sh '"$VENV/bin/python" -m pytest tests/ -v --junitxml=test-results.xml'
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results.xml'
                }
            }
        }
    }

    post {
        success {
            echo 'ReviewSense AI CI Pipeline completed successfully. All automated tests passed!'
        }
        failure {
            echo 'ReviewSense AI CI Pipeline failed. Check the console output.'
        }
        always {
            cleanWs deleteDirs: true, notFailBuild: true
        }
    }
}
