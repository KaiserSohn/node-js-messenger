const fileSystem = require('fs');
const MessageRequest = require('../../dto/messageRequest');
const MessageListTypes = require('../../components/storage/messageListTypes');

class MessageStorageService {
    static filename = 'messages.json';

    /**
     * @param {MessageRequest} data
     * @returns {any}
     */
    static prepareDataForSave = (data) => {
        let storageData = this.getDataFromFile();
        let date = new Date();

        let newItemToSave = {
            "user_id": data.userId,
            "target_user_id": data.targetUserId,
            "message": data.message,
            "date": date.toISOString(),
            "read": false
        };

        storageData.push(newItemToSave);
        return storageData;
    };

    /**
     * @returns {any | *[]}
     */
    static getDataFromFile = () => {
        if (!fileSystem.existsSync(this.filename)) {
            fileSystem.writeFileSync(this.filename, "[]");
        }

        let storageData = fileSystem.readFileSync(this.filename);

        return JSON.parse(storageData) || [];
    };

    /**
     * @param {MessageRequest} data
     */
    static saveDataToFile = (data) => {
        fileSystem.writeFile(
            this.filename,
            JSON.stringify(this.prepareDataForSave(data)),
            (error) => {
                if (error) {
                    throw error;
                }
            }
        );
    }

    /**
     * @param userId
     * @param type
     * @returns {object[]}
     */
    static getMessagesByUserId = (userId, type = MessageListTypes.CREATED_BY_USER) => {
        let storageData = this.getDataFromFile();

        let userMessages = [];

        storageData.forEach((message) => {
            if (type === MessageListTypes.CREATED_BY_USER && message.user_id === userId) {
                userMessages.push(message);
            } else if (type === MessageListTypes.TARGET_TO_USER && message.target_user_id === userId) {
                userMessages.push(message);
            }
        });

        userMessages.sort((messageOne, messageTwo) => {
            return new Date(messageTwo.date) - new Date(messageOne.date);
        })

        return userMessages;
    };
}

module.exports = MessageStorageService;
