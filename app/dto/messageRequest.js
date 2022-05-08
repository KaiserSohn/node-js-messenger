module.exports = class MessageRequest {
    userId;
    targetUserId;
    message;

    constructor(user_id, target_user_id, message) {
        this.userId = user_id;
        this.targetUserId = target_user_id;
        this.message = message;
    }

    get userId()
    {
        return this.userId;
    }

    get targetUserId()
    {
        return this.targetUserId;
    }

    get message()
    {
        return this.message;
    }
}
