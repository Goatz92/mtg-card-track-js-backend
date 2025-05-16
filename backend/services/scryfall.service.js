const axios = require('axios');
const logger = require('../logger/logger');

class ScryfallService {
    constructor() {
        this.baseUrl = 'https://api.scryfall.com';
    }

    async getCardByName(name, exact = true) {
        try {
            const response = await axios.get(`${this.baseUrl}/cards/named`, {
                params: {
                    [exact ? 'exact' : 'fuzzy']: name
                }
            }); 
            return response.data;
        } catch (error) {
            logger.error('Scryfall API error', {
                error: error.message,
                cardName: name
            });
            throw error;
        }
    }

    async getCardById(id) {
        try {
            const response = await axios.get(`${this.baseUrl}/cards/${id}`, {
                timeout: 5000 // 5s timeout
            });
            return response.data
        } catch (error) {
            logger.error('Scryfall API error', {
                error: error.message,
                cardId: id
        });
        throw error;
        }
    }
}

module.exports = new ScryfallService();