const fileSystem = require('fs');
const MessageStorageService = require('../../components/storage/messageStorageService');
const CacheService = require('../../components/cache/cacheService');

const FILESIZE_FOR_DELETE_OLD_MESSAGE = 1;

module.exports = async () => {
    await fileSystem.stat(MessageStorageService.filename, (err, stats) => {
        if (err) {
            console.log('Произошла ошибка при попытке удалить старые сообщения')
            return;
        }
        let size = stats.size / (1024 * 1024);

        if (size > FILESIZE_FOR_DELETE_OLD_MESSAGE) {
            CacheService.clearCache();
            MessageStorageService.clearOldMessages();
        }
    });
}
