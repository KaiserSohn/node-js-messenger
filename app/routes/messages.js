const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MessageStorageService = require('../components/storage/messageStorageService');
const MessageListTypes = require('../components/storage/messageListTypes');
const MessageRequest = require('../dto/messageRequest');
const CacheService = require('../components/cache/cacheService');

/**
 * @param message
 * @returns {*}
 */
const prepareMessageToSave = (message) => {
    let clearMessageFromHref = message.replace(/<a\b[^>]*>(.*?)<\/a>/i, '');

    return clearMessageFromHref.replace(/(\d\d).(\d\d).(\d{4})/, (fullMatch, $1, $2, $3) => {
        let prepareDate = new Date($3 + '-' + $2 + '-' + $1);

        return prepareDate.toLocaleDateString(
            'ru-RU',
            {day: '2-digit', month: '2-digit', year: '2-digit', weekday: 'long'}
        );
    });
};

/**
 * @param data
 */
const saveMessage = (data) => {
    let messageRequest = new MessageRequest(
        data.user_id,
        data.target_user_id,
        prepareMessageToSave(data.message),
    );

    CacheService.clearCache();
    MessageStorageService.saveData(messageRequest);
};


router.post(
    '/messages/add',
    body('user_id').not().isEmpty().isString(),
    body('target_user_id').not().isEmpty().isString(),
    body('message').not().isEmpty().isString(),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({success: false, errors: errors.array()});
        }

        try {
            saveMessage(req.body);
            return res.json({success: true});
        } catch (e) {
            return res.status(500).json({errors: e})
        }
    }
);

router.get(
    '/messages/my-list/:userId',
    (req, res) => {
        let userId = req.params.userId;
        let cacheKey = 'created_' + userId;

        let data = CacheService.readDataFromCache(cacheKey);

        if (!data) {
            data = MessageStorageService.getMessagesByUserId(userId);
            CacheService.putDataToCache(cacheKey, data);
        }

        return res.json(
            {
                success: true,
                data: data
            }
        );
    }
);

router.get(
    '/messages/target-list/:userId',
    (req, res) => {
        let userId = req.params.userId;
        let cacheKey = 'target_' + userId;

        let data = CacheService.readDataFromCache(cacheKey);

        if (!data) {
            data = MessageStorageService.getMessagesByUserId(userId, MessageListTypes.TARGET_TO_USER);
            CacheService.putDataToCache(cacheKey, data);
        }

        return res.json(
            {
                success: true,
                data: data
            }
        );
    }
)

router.post(
    '/message/mark-as-read',
    body('user_id').not().isEmpty().isString(),
    body('messages').not().isEmpty().isArray(),
    (req, res) => {
        try {
            const errors = validationResult(req);
            let userId = req.body.user_id;
            let messages = req.body.messages;

            if (!errors.isEmpty()) {
                return res.status(400).json({success: false, errors: errors.array()});
            }

            CacheService.clearCache();
            MessageStorageService.markMessagesAsRead(userId, messages);
            return res.json({success: true});
        } catch (e) {
            return res.status(500).json({success: false, errors: e.toString()});
        }
    }
)

module.exports = router;
