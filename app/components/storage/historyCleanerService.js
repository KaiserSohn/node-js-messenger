const fileSystem = require('fs');
const MessageStorageService = require('../../components/storage/messageStorageService');

const FILESIZE_FOR_DELETE_OLD_MESSAGE = 1;

module.exports = async () => {
    await fileSystem.stat(MessageStorageService.filename, (err, stats) => {
        if (err) {
            throw new Error('Произошла ошибка при попытке удалить старые сообщения');
        }
        let size = stats.size / (1024 * 1024);

        if (size > FILESIZE_FOR_DELETE_OLD_MESSAGE) {
            MessageStorageService.clearOldMessages();
        }
    });
}
