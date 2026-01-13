pipeline {
  agent any
    
  tools {
    nodejs 'node-v22'
  }

  environment {
    ENV_SERVER_ADMINISTRACION = credentials('ENV_SERVER_ADMINISTRACION')
  }
    
  stages {

    stage('Copy .env files') {
      steps {
        script {
          def env_server = readFile(ENV_SERVER_ADMINISTRACION)
          
          writeFile file: './server/.env', text: env_server
          
          // Verificar
          sh 'ls -la ./server/.env'
          sh 'cat ./server/.env'
        }
      }
    }

    stage('Install Dependencies') {
      steps {
        script {
          sh 'cd ./server && npm install'
        }
      }
    }

    stage('Stop Docker Compose') {
      steps {
        script {
          sh 'docker compose down || true'
        }
      }
    }

    stage('Delete Old Image') {
      steps {
        script {
          def images = 'administracion-server'
          if (sh(script: "docker images -q ${images}", returnStdout: true).trim()) {
            sh "docker rmi ${images}"
          } else {
            echo "Image ${images} does not exist."
          }
        }
      }
    }
    
    stage('Build & Deploy') {
      steps {
        script {
          sh 'docker compose up -d --build'
        }
      }
    }
  }
}
