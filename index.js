require("dotenv").config();
const { Telegraf, Markup, Scenes, Extra } = require("telegraf");
const fetch = require("node-fetch").default;
const help = require("./help");
const { setBotCommands, sendOptionsKeyboard } = require("./utils");

const bot = new Telegraf(process.env.BOT_TOKEN);

setBotCommands(bot);
bot.help((ctx) => ctx.reply(help));

bot.start((ctx) => {
    ctx.reply("Физкульт привет!");
    sendOptionsKeyboard(ctx, bot, "Что делаем сегодня? 😀");
});
bot.command("menu", (ctx) => {
    sendOptionsKeyboard(ctx, bot, "Что делаем сегодня? 😀");
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
    try {
        await ctx.replyWithPhoto(
            { url: "https://random.imagecdn.app/500/360" },
            { caption: `This is random picture` }
        );
        await ctx.answerCbQuery();
    } catch (error) {
        console.error(error);
    }
});
bot.action("woman", async (ctx) => {
    try {
        await ctx.reply("Извини дружище пока в разработке ...");
        await ctx.reply("Cherchez la femme ...");
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
        await ctx.reply("Справочник когда у кого день рождения");
        await ctx.reply("Слава - 14 марта");
        await ctx.reply("Слава - 14 марта");
        await ctx.reply("Слава - 14 марта");
        await ctx.answerCbQuery();
    } catch (error) {
        console.error(error);
    }
});

bot.hears(/полит/i, async (ctx) => {
    const photo = (await bot.telegram.getUserProfilePhotos(ctx.botInfo.id))
        .photos[0][1].file_id;
    await ctx.replyWithPhoto(photo, {
        caption:
            "О политике!? Е%*?:!%уй!!!!! в п%*?:!%у!! вы%*?:!%!!!!!\nили послышалось?! извиняюсь :!%й!!!!",
    });
    return ctx;
});

bot.on("inline_query", async (ctx) => {
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;
    const response = await fetch(apiUrl);
    const results = await response.json();
    console.log(results);
    const answer = [
        {
            type: "article",
            id: 0,
            title: results.title,
            description: `${results.date} ${results.copyright}`,
            thumb_url: results.url,
            input_message_content: {
                message_text: results.explanation,
            },
            reply_markup: Markup.inlineKeyboard([
                Markup.button.url("Go to recipe", results.url),
            ]),
        },
    ];
    return await ctx.answerInlineQuery(answer);
});

bot.launch().then(() => console.log("Bath bot launched ..."));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
