// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load TensorFlow.js: Universal Sentence Encoder model
async function loadModel() {
    const model = await tf.loadGraphModel('https://tfhub.dev/google/universal-sentence-encoder/4');
    return model;
}

// Fetch stored resources from Firebase Firestore
async function getStoredResources() {
    const resources = [];
    const snapshot = await db.collection("resources").get();
    snapshot.forEach(doc => {
        resources.push({ id: doc.id, title: doc.data().title, embedding: doc.data().embedding });
    });
    return resources;
}

// Generate embeddings for the query and resources using TensorFlow.js
async function getEmbeddings(model, text) {
    const embeddings = await model.executeAsync({ 'input': text });
    return embeddings.arraySync();
}

// Cosine Similarity Calculation
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Get Recommendations Based on User Query
async function getRecommendations(query) {
    const model = await loadModel();
    const queryEmbedding = await getEmbeddings(model, query);
    const storedResources = await getStoredResources();

    const similarities = storedResources.map(resource => {
        const resourceEmbedding = resource.embedding;
        const similarity = cosineSimilarity(queryEmbedding, resourceEmbedding);
        return { title: resource.title, similarity };
    });

    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, 3); // Top 3 recommendations
}

// Display Recommendations on the Webpage
async function searchResource() {
    const query = document.getElementById("queryInput").value;
    const recommendations = await getRecommendations(query);

    let resultsList = document.getElementById("results");
    resultsList.innerHTML = "";

    recommendations.forEach(item => {
        let listItem = document.createElement("li");
        listItem.innerText = `${item.title} (Score: ${item.similarity.toFixed(2)})`;
        resultsList.appendChild(listItem);
    });
}
