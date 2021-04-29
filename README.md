# WebpoW
Sistema para criação de aplicações PWA




Clonar sistema

1. Criar projeto
2. Criar aplicativo com analitycs
3. Definir regras públicas firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write;
    }
  }
}
4. Iniciar diretório do firebase
5. Copiar pasta public com o sistema 
6. Alterar conexão no arquivo pow.js
7. Clonar WebpoW
8. Salvar indice e regras e firebase.json
9. fazer deploy
