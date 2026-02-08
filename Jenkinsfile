pipeline {
    agent any
	
	tools {
		maven 'Maven'
		nodejs 'NodeJS'
	}
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Getting code from Git...'
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                echo 'Building Spring Boot backend...'
                dir('appointments') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                echo 'Building React frontend...'
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker-compose build'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying with Docker Compose...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
                sh 'sleep 10'
                sh 'docker-compose ps'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo ' Pipeline failed!'
        }
    }
}