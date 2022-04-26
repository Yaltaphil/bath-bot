module.exports = {
    setBotCommands: async (bot) => {
        await bot.telegram.setMyCommands([
            {
                command: "menu",
                description: "Что я умею ...",
            },
        ]);
    },

    sendOptionsKeyboard: async (ctx, bot, questionMessage) => {
        await bot.telegram.sendMessage(ctx.chat.id, questionMessage, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Улыбнуть", callback_data: "picture" },
                        { text: "Женщины", callback_data: "woman" },
                        { text: "Вино", callback_data: "wine" },
                    ],
                    [
                        { text: "Дни рождения", callback_data: "birthday" },
                        { text: "Кинуть кость", callback_data: "dice" },
                    ],
                ],
            },
        });
    },
};
