const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MessageStorageService = require('../components/storage/messageStorageService');
const MessageListTypes = require('../components/storage/messageListTypes');
const MessageRequest = require('../dto/messageRequest');

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

    MessageStorageService.saveDataToFile(messageRequest);
};


router.post(
    '/messages/add',
    body('user_id').not().isEmpty().isString(),
    body('target_user_id').not().isEmpty().isString(),
    body('message').not().isEmpty().isString(),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
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

        return res.json(
            {
                success: true,
                data: MessageStorageService.getMessagesByUserId(userId)
            }
        );
    }
);

router.get(
    '/messages/target-list/:userId',
    (req, res) => {
        let userId = req.params.userId;

        return res.json(
            {
                success: true,
                data: MessageStorageService.getMessagesByUserId(userId, MessageListTypes.TARGET_TO_USER)
            }
        );
    }
)

module.exports = router;
