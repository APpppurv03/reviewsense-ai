// ReviewSense AI - Jenkins Declarative Pipeline
// CI Pipeline for automated linting, dependency installation, and testing with pytest.
// Assumes a Jenkins agent equipped with Python 3.10+ and git.

pipeline {
    agent any

    environment {
        // Prevent Python from writing .pyc files and buffer stdout/stderr
        PYTHONDONTWRITEBYTECODE = '1'
        PYTHONUNBUFFERED        = '1'
        // Test environment - mocked tests do not require real Gemini API keys
        GEMINI_API_KEY          = 'test-mock-key-not-for-production'
        GEMINI_MODEL            = 'gemini-2.5-flash'
        FLASK_ENV               = 'testing'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from repository...'
                checkout scm
            }
        }

        stage('Python Environment Check') {
            steps {
                echo 'Verifying Python installation on Jenkins agent...'
                // Works on both Linux and Windows Jenkins nodes
                script {
                    if (isUnix()) {
                        sh 'python3 --version || python --version'
                    } else {
                        bat 'python --version'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing required dependencies from requirements.txt...'
                script {
                    if (isUnix()) {
                        sh 'python3 -m pip install --upgrade pip'
                        sh 'python3 -m pip install -r requirements.txt'
                    } else {
                        bat 'python -m pip install --upgrade pip'
                        bat 'python -m pip install -r requirements.txt'
                    }
                }
            }
        }

        stage('Run Pytest Test Suite') {
            steps {
                echo 'Running automated tests with pytest and generating JUnit report...'
                script {
                    if (isUnix()) {
                        sh 'python3 -m pytest tests/ -v --junitxml=test-results.xml'
                    } else {
                        bat 'python -m pytest tests/ -v --junitxml=test-results.xml'
                    }
                }
            }
            post {
                always {
                    // Record and publish JUnit test report if Jenkins JUnit plugin is installed
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
            echo 'ReviewSense AI CI Pipeline failed. Please check test results and build logs.'
        }
        always {
            cleanWs deleteDirs: true, notFailBuild: true
        }
    }
}
