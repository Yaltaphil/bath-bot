require("dotenv").config();
const { BOT_TOKEN, BOT_HOOK_PATH } = process.env;
const { Telegraf } = require("telegraf");
const help = require("./help");
const { setBotCommands, sendOptionsKeyboard } = require("./utils");
const { getAdvice } = require("./assets/advises");

const bot = new Telegraf(BOT_TOKEN);

setBotCommands(bot).then();

bot.help(async (ctx) => await ctx.reply(help));

bot.start(async (ctx) => {
    await ctx.reply("Физкульт привет!");
});

bot.command("menu", async (ctx) => {
    await sendOptionsKeyboard(ctx, bot, "Что делаем сегодня? 😀");
});

bot.action("dice", async (ctx) => {
    try {
        await ctx.replyWithDice();
        await ctx.answerCbQuery();
    } catch (error) {
        console.log(error);
    }
});
bot.action("picture", async (ctx) => {
    const idx = Math.floor(Math.random() * 17);
    try {
        await ctx.replyWithPhoto(
            {
                url: `https://storage.yandexcloud.net/bath-bot/img/bath%20(${idx}).jpg`,
            },
            { caption: `👍 👍 👍` }
        );
        await ctx.answerCbQuery();
    } catch (error) {
        console.error(error);
    }
});
bot.action("woman", async (ctx) => {
    try {
        await ctx.reply(
            "Извини дружище пока в разработке ...\nCherchez la femme ..."
        );
        await ctx.answerCbQuery();
    } catch (error) {
        console.error(error);
    }
});
bot.action("wine", async (ctx) => {
    try {
        await ctx.reply("Извини дружище пока в разработке ...");
        await ctx.answerCbQuery();
    } catch (error) {
        console.error(error);
    }
});
bot.action("birthday", async (ctx) => {
    try {
        await ctx.replyWithMarkdown(`
            * Справочник *

            Зиновий 🥇  18 февраля
            Славик 🔞  14 марта
            Фил 🤠  16 марта
            Эдвард 🎂 25 апреля
            Валера 🕍 23 мая
            Дима 🧠 9 июня
            Cергей Иваныч 🐲 27 октября
            Никита ❤️ 7 ноября
            Богдан 💰 12 ноября
            Авдей ☠️ 8 декабря
        `);
        await ctx.answerCbQuery();
    } catch (error) {
        console.error(error);
    }
});

bot.hears(
    /(полит|росс(ия)|украин(а)|война|путин|зеленск|спецоперац)/gim,
    async (ctx) => {
        const photo = (await bot.telegram.getUserProfilePhotos(ctx.botInfo.id))
            .photos[0][1].file_id;
        await ctx.replyWithPhoto(photo, {
            caption:
                "О политике!? Е%*?:!%уй!!!!! в п%*?:!%у!! вы%*?:!%!!!!!\nили послышалось?! извиняюсь :!%й!!!!",
        });
    }
);

bot.on("inline_query", async (ctx) => {
    let answer;

    if (ctx.inlineQuery.query === "girl") {
        answer = [
            {
                type: "photo",
                id: 1,
                title: "ВАу!",
                photo_url:
                    "https://storage.yandexcloud.net/bath-bot/Bath_bot_photo.jpg",
                thumb_url:
                    "https://storage.yandexcloud.net/bath-bot/Bath_bot_photo.jpg",
            },
        ];
    } else {
        const advice = getAdvice();
        answer = [
            {
                type: "article",
                id: 0,
                title: "Банные советы",
                description: advice,
                thumb_url:
                    "https://storage.yandexcloud.net/bath-bot/Bath_bot_photo.jpg",
                input_message_content: {
                    message_text: "Совет таков:\n" + advice,
                },
            },
        ];
    }

    return await ctx.answerInlineQuery(answer);
});

bot.on("text", () => {
    // default action
});

bot.telegram
    .setWebhook(BOT_HOOK_PATH)
    .then(() => console.log("Webhook was set"));

// bot.launch().then(() => console.log(`Bot launched locally`));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports.handler = async function (event) {
    const message = JSON.parse(event.body);
    await bot.handleUpdate(message);
    return {
        statusCode: 200,
        body: "",
    };
};
