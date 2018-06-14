pipeline {
    agent {
        dockerfile {
            reuseNode true
            args '--dns=8.8.8.8'
        }
    }
    environment {
    }
    stages {
        stage('Branch & PR: Staging & Test') {
            when {
                expression { env.GIT_COMMIT != null }
                expression { env.GIT_PREVIOUS_COMMIT != env.GIT_COMMIT }
            }
            steps {
                sshagent (credentials: ['my-git']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no git@github.com || true
                        yarn install --check-files
                        npm run test
                    '''
                }
            }
        }
    }
    options {
        durabilityHint('PERFORMANCE_OPTIMIZED')
    }
    post {
        always {
            allure results: [[path: 'allure-results']]
        }
    }
}