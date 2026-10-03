const axios = require('axios');

// 1. Updated Base URL to the free Community Edition
const JUDGE0_URL = "https://ce.judge0.com";

const getLanguageById = (lang) => {
    const language = {
        "c": 50,
        "c++": 54,
        "java": 62,
        "javascript": 102,
        "python": 71
    };
    return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
    // Note: 'base64_encoded' is false because you said you are NOT encoding data
    const options = {
        method: 'POST',
        url: `${JUDGE0_URL}/submissions/batch`,
        params: { base64_encoded: 'false' }, 
        headers: { 'Content-Type': 'application/json' }, // NO RapidAPI keys needed
        data: { submissions }
    };

    try {
        const response = await axios.request(options);
        // Returns an array of tokens: [{token: "..."}, {token: "..."}]
        return response.data; 
    } catch (error) {
        console.error("Submission Error:", error.response?.data || error.message);
    }
};

// 2. FIXED: Real waiting function using a Promise
const waiting = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const submitToken = async (resultTokens) => {
    // Extract tokens from the array of objects if necessary
const tokenString = resultTokens.join(",");

    const options = {
        method: 'GET',
        url: `${JUDGE0_URL}/submissions/batch`,
        params: {
            tokens: tokenString,
            base64_encoded: 'false',
            fields: 'stdout,stderr,status_id,status,compile_output'
        }
    };

    while (true) {
        try {
            const response = await axios.request(options);
            const results = response.data.submissions;

            // status_id < 3 means "In Queue" or "Processing"
            const isFinished = results.every((r) => r.status_id > 2);

            if (isFinished) {
                return results;
            }

            console.log("Still processing... waiting 1 second");
            await waiting(1000); // Now this actually waits
        } catch (error) {
            console.error("Polling Error:", error.response?.data || error.message);
            break;
        }
    }
};

module.exports = { getLanguageById, submitBatch, submitToken };




// const axios = require('axios');


// const getLanguageById = (language)=>{

//     const language = {
//         "c++":54,
//         "java":62,
//         "javascript":63
//     }


//     return language[language.toLowerCase()];
// }


// const submitBatch = async (submissions)=>{


// const options = {
//   method: 'POST',
//   url: 'https://ce.judge0.com',
//   params: {
//     base64_encoded: 'true'
//   },
//   headers: {
   
//     'Content-Type': 'application/json'
//   },
//   data: {
//     submissions
//   }
// };

// async function fetchData() {
//     try {
//         const response = await axios.request(options);
//         return response.data;
//     } catch (error) {
//         console.error(error);
//     }
// }

//  return await fetchData();

// }




// module.exports = {getLanguageById,submitBatch, submitToken};











