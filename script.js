// Sélection des éléments HTML nécessaires
const sendButton = document.querySelector('.send'); // Bouton d'envoi du message
const inputField = document.querySelector('input[type="text"]'); // Champ de saisie de texte
const messageContainer = document.querySelector('.texte'); // Conteneur où s'affichent les messages

// Définition des constantes pour l'API Gemini
const API_KEY = "AIzaSyCxtoiY6FbSntEcR4_Zlxve5tFWoZIo2a8"; // Clé API pour authentifier la requête
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`; // URL de l'API Gemini

// Gestion de l'événement d'envoi de message
sendButton.addEventListener("click", () => {
    const message = inputField.value.trim(); // Récupère le texte entré par l'utilisateur et enlève les espaces inutiles
    if (message !== "") { // Vérifie que le champ de saisie n'est pas vide
        const userDiv = document.createElement('div'); // Crée une nouvelle div pour afficher le message utilisateur
        userDiv.classList.add("envoie"); // Ajoute la classe CSS "envoie" pour styliser le message utilisateur
        userDiv.textContent = message; // Ajoute le texte saisi dans la div créée
        messageContainer.appendChild(userDiv); // Ajoute le message utilisateur au conteneur de messages
        inputField.value = ""; // Réinitialise le champ de saisie après l'envoi

        // Envoi de la requête à l'API Gemini
        fetch(API_URL, {
            method: "POST", // Méthode HTTP pour envoyer des données à l'API
            headers: { "Content-Type": "application/json" }, // Spécifie que le format des données envoyées est JSON
            body: JSON.stringify({ // Corps de la requête avec la question posée par l'utilisateur
                contents: [{ 
                    parts: [{ 
                        text: `Tu es un assistant spécialisé en gestion de projet. Réponds aux questions liées à la gestion de projet de manière détaillée. Si la question n'est pas liée à la gestion de projet, dis que ce n'est pas ta spécialité.\n\nQuestion: ${message}` 
                    }] 
                }]
            })
        })
        .then(response => response.json()) // Convertit la réponse de l'API en JSON
        .then(data => {
            const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text; // Extrait la réponse de Gemini
            if (botResponse) { // Vérifie si une réponse valide a été reçue
                const botDiv = document.createElement('div'); // Crée une nouvelle div pour afficher la réponse de Gemini
                botDiv.classList.add("recu"); // Ajoute la classe CSS "recu" pour styliser la réponse de l'IA
                botDiv.textContent = botResponse; // Insère le texte de la réponse dans la div
                messageContainer.appendChild(botDiv); // Ajoute la réponse au conteneur de messages
            }
        })
        .catch(error => { // Gestion des erreurs en cas d'échec de la requête
            console.error("Erreur lors de la récupération de la réponse de Gemini:", error); // Affiche l'erreur dans la console
            const errorDiv = document.createElement('div'); // Crée une div pour afficher le message d'erreur
            errorDiv.classList.add("recu"); // Ajoute la classe "recu" pour le styliser comme un message de Gemini
            errorDiv.textContent = "Une erreur est survenue. Veuillez réessayer plus tard."; // Message d'erreur visible pour l'utilisateur
            messageContainer.appendChild(errorDiv); // Ajoute le message d'erreur au conteneur de messages
        });
    }
});

// Gestion de l'envoi avec la touche "Entrée"
inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { // Vérifie si la touche pressée est "Entrée"
        sendButton.click(); // Déclenche l'événement de clic sur le bouton d'envoi
    }
});
