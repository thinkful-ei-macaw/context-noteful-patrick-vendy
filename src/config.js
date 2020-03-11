import 'dotenv/config';


export default {
    API_ENDPOINT: process.env.API_ENDPOINT || 'http://localhost:9090', 
    API_KEY: process.env.API_KEY
};