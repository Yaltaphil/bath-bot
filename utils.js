module.exports = {
    setBotCommands: (bot) => {
        bot.telegram.setMyCommands([
            {
                command: "menu",
                description: "Что я умею",
            },
        ]);
    },
    sendOptionsKeyboard: (ctx, bot, questionMessage) => {
        bot.telegram.sendMessage(ctx.chat.id, questionMessage, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Картинка", callback_data: "picture" },
                        { text: "Женщину", callback_data: "woman" },
                    ],
                    [
                        { text: "Вино", callback_data: "wine" },
                        { text: "Дни рождения", callback_data: "birthday" },
                    ],
                    [{ text: "Рандом", callback_data: "dice" }],
                ],
            },
        });
    },
};
