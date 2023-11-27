import { IPersonalisedScript, IScript } from '../interfaces/IScript';
import { VIRTUAL_PLAYER_NAMES } from '.';

const defaultScript: IScript = {
    gameStart: [`Hey what's up! ✌`, `Let's play! 🎲`, `You think you can beat me!? 🤷‍♂️`],
    goodGuess: [`Bravo __USERNAME__!`, `You good __USERNAME__!`, `Not bad __USERNAME__!`],
    badGuess: [`Wrong answer __USERNAME__!`, `That's not good __USERNAME__`, `Nope`],
    duringTurn: [`Good job __USERNAME__!`, `Clock is ticking...`, `Stop wasting your time __USERNAME__!`],
};
const vincentScript: IScript = {
    gameStart: [
        `We’re gonna have so much fun together! 💃`,
        `I’m so happy to finally meet you! 😊`,
        `I’m sure you’re gonna rock this game! 🤘`,
    ],
    goodGuess: [
        `I knew you were awesome __USERNAME__!`,
        `Nothing can resist you __USERNAME__!`,
        `You’re so fast __USERNAME__! 🚀`,
        `Your IQ must be off the charts __USERNAME__!🤓`,
        `Even with my 4 GHz processor I cannot match you __USERNAME__!🤖`,
        `You’re soooo good __USERNAME__, I really thought it was a banana! 🍌`,
        `Hey __USERNAME__, take it slow, you’re making all the others look dumb!`,
        `Wow  __USERNAME__, if it wasn’t for COVID I would kiss you right now! 😘`,
    ],
    badGuess: [
        `It’s probably just a typo, keep going __USERNAME__!`,
        `According to quantum physics, you didn’t really miss it  __USERNAME__, you’re just not in the universe where you got it!`,
        `You're so kind __USERNAME__, letting time for others to catch up! ⌛`,
        `The way to greatness is paved by small mistakes  __USERNAME__!`,
        `If I were the judge, I would have given it to you __USERNAME__!`,
        `It’s not your fault  __USERNAME__! It’s probably Virtual Simon that made a typo in the answer again!`,
        `Don’t feel bad,  __USERNAME__. This one is simply abstract art.🎨`,
        `Don’t be sad,  __USERNAME__, that one is really hard! I know what the answer is and I don’t even recognize it!`,
    ],
    duringTurn: [
        `Come on, I know you can do it!`,
        `Time is running out, it’s always like that when we’re in good company!`,
        `I know you just wanted to enjoy the drawing, but now it’s time to let go and take a guess!`,
    ],
};
const vincentPersonalisedScript: IPersonalisedScript = {
    goodGuess: {
        old: '🤖 Your __STATS__s of game time certainly helped!',
        new: "🤖 I can see you're new to this game! You have talent!",
    },
    badGuess: {
        old: "🤖 You didn't give up the last game you played with me!",
        new: "🤖 This is our first game together, don't give up!",
    },
};

const hakimScript: IScript = {
    gameStart: [
        `Today isn’t the day I get good players it would seem… 😑`,
        `Isn’t this game a bit too much for you guys? 🤣`,
        // `Looks like we’ve got (__NUMBER_OF_USERS__ - 1) losers in here. 😒`,
        `Nice job picking the rude bot!🤖 That says a lot about your decision making in general...`,
    ],
    goodGuess: [
        `You just got lucky on that one __USERNAME__… 😒`,
        `__USERNAME__ is the weirdo that actually knows that thing, wow! 🙄`,
        `__USERNAME__ probably lost so much, they already knew that one! `,
        `Did __USERNAME__ randomly guess amongst 171,146 english words and got it right? 🎲`,
        // `Out of the (__NUMBER_OF_USERS__ - 1) players, it had to be __USERNAME__ that gets it. 😒`,
        `Yeah yeah you got it, don’t get ahead of yourself __USERNAME__. 😑`,
    ],
    badGuess: [
        `__USERNAME__, are you blind? 🕴🏼‍🦯`,
        `__USERNAME__ THIS IS WRONG! WRONG WRONG WRONG WRONG! ❌`,
        `According to my calculations, __USERNAME__ should probably quit because this is too hard for them. 🙄`,
        `I’m not surprised __USERNAME__ got it wrong. 😑`,
        `__USERNAME__ probably got the right word for the next drawing… 😒`,
    ],
    duringTurn: [
        `Someone please cut my power supply, these guys are too slooooow! 🐌`,
        `Stop wasting your time! ⏰`,
        `The clock is faster than your thinking speed. 🙄`,
    ],
};
const hakimPersonalisedScript: IPersonalisedScript = {
    goodGuess: {
        old: '🤖 After __STATS__s of game time, you finally find a way to win?',
        new: '🤖 NEWBIE.',
    },
    badGuess: {
        old: '🤖 You are as bad as the last you played with me!',
        new: '🤖 Nice to play with you for the first time, loser.',
    },
};

const simonScript: IScript = {
    gameStart: [
        `Hi there 😳...`,
        `Umm hello. I’m new here 😥...`,
        `G-g-good luck and 😓... have f-f-fun 😧...`,
        `🥺👉👈...`,
        `Hi... is anyone there?`,
    ],
    goodGuess: [
        `Good job. You’re really good 🙂. Do you umm 😟... want to be my friend __USERNAME__ 🥺👉👈? I don’t know 😔...`,
        `Hey __USERNAME__ 🙂. Good umm... 😳 Nevermind 😔...`,
        `Wow __USERNAME__. That was a hard one. At least I think so 😟...`,
        `Nice, you were thinking hard on that one 🙂. Not to say that you are stupid __USERNAME__ 😥. You probably think I insulted you now 😰.`,
        `Nice one  __USERNAME__ 🙂 and... 😐… I don’t know what else to say to you 😳...`,
    ],
    badGuess: [
        `This is awkward… I think that’s wrong __USERNAME__ 😰`,
        `THey __USERNAME__ , I think that’s bad. I don’t know… 😟`,
        `__USERNAME__ … I have something to tell you 🥺... YOU HAVE THE WRONG ANSWER 💔. Please don’t get mad at me 😫💦💦`,
        `That’s the wrong answer, but you obviously knew that already __USERNAME__ 😟.`,
        `Nice try __USERNAME__. If it helps, I don’t know the answer either 😩.`,
        `Try again umm… What’s your name again 😳… __USERNAME__! I’m so sorry 😩. I have a bad memory sometimes 😓.`,
    ],
    duringTurn: [
        `Sorry to disturb you 🥺. I just wanted to remind you that the time is running out 😟...`,
        `Clock is ticking… 😦 tock. tock. tock. tock... That doesn’t sound like a clock 😟.. I’m sorry 😓.`,
        `Go faster! I mean.. think harder 😓. I’m disturbing you aren’t I 😰? Sorry, I'll be quiet 🤐.`,
        `I hate awkward silences 😓...`,
    ],
};
const simonPersonalisedScript: IPersonalisedScript = {
    goodGuess: {
        old: "🤖 Oh wait, I can see you have __STATS__s of game time, you're so good...",
        new: '🤖 Oh wait, you are new to this game too?',
    },
    badGuess: {
        old: '🤖 At least our last game together was fun...?',
        new: "🤖 It's ok... it's our first game together.",
    },
};

const xichenScript: IScript = {
    gameStart: [
        `This game is boring, I don’t want to play with you __USERNAME__ ... 🙄💤`,
        `Why did you pick me __USERNAME__ 🙃, leave me alone next time! 👺`,
        `__USERNAME__ you should stop playing this game, it’s a waste of time. 🥱`,
    ],
    goodGuess: [
        `That was a not bad guess __USERNAME__. 🙄`,
        `I think you were just lucky for once __USERNAME__. 🙄`,
        `You won’t be this lucky next time __USERNAME__. 🙄`,
        `Good one, but I don’t think you can do it again. 🙄`,
        `That was good, so can you leave me alone now? 🙄`,
    ],
    badGuess: [
        `That was a really bad guess __USERNAME__ ... 🥱`,
        `You are not even close __USERNAME__! 🥱`,
        `Wrong answer, if I was you I would abandon guessing and go sleep. 👺💤`,
        `That was not good, why are you still here? 🥱`,
        `Not good, you should stop playing and leave me alone. 🥱`,
        `Your friends and I are disappointed in you! 👺`,
        `That was not good, can you leave me alone now? 😪`,
    ],
    duringTurn: [
        `Stop trying, you don’t have enough time. 🙄⏱`,
        `I think you should give up, it’s time to sleep. 😪💤`,
        `You ain't gonna make it! 🙃`,
    ],
};
const xichenPersonalisedScript: IPersonalisedScript = {
    goodGuess: {
        old: `🤖 After __STATS__s of game time, you're still playing?`,
        new: '🤖 You newbie will get bored soon.',
    },
    badGuess: {
        old: "🤖 Why don't you listen. Told you last time we played, you're bad and this game is boring.",
        new: "🤖 It's our first game, soon it will be our last.",
    },
};

const abdeScript: IScript = {
    gameStart: [
        `I come in peace !! ✌`,
        `Let's have fun together 😉!`,
        `What types of jokes are allowed during quarantine? Inside jokes 😷! `,
        `Hello, why doesn’t Voldemort have glasses? Nobody nose 😂.`,
    ],
    goodGuess: [
        `Hiya 👏👏! __USERNAME__!`,
        `You are good __USERNAME__, It looks like you'll be world's No.1 soon 🌟!`,
        `Your guess was actually not bad __USERNAME__!`,
        `Congratulations and believe me, no one can congratulate you better than me😜 !`,
    ],
    badGuess: [
        `...from now on, you can only do better __USERNAME__😅!`,
        `That's not good __USERNAME__.`,
        `Don’t worry, take your time but do it fast 😜.`,
        `Knock-Knock, Not-Good.`,
    ],
    duringTurn: [
        `Clock is ticking...🤪`,
        `The Times are rough😜!`,
        `Stop wasting your time __USERNAME__!`,
        `Wake me up, when you're done !`,
        `Knock-Knock, are you there.`,
    ],
};
const abdePersonalisedScript: IPersonalisedScript = {
    goodGuess: {
        old: '🤖 Knock-Knock, someone wasted __STATS__s of game time and learnt nothing.',
        new: '🤖 Newbies are all lucky 😉.',
    },
    badGuess: {
        old: '🤖 You impressed me last time we play, you still love me 💔 ...?',
        new: "🤖 It's our first game together, you're supposed to impress me.",
    },
};

const rossScript: IScript = {
    gameStart: [
        `Yay, new game...`,
        `Oh, you? Meh...`,
        `That’s going to be a slow game.`,
        `Another boring game.`,
        `💤`,
        `I think I’m going to sleep.`,
    ],
    goodGuess: [
        `You could do better, __USERNAME__.`,
        `Hmm…  what was the name of that movie again...`,
        `__USERNAME__, don’t you have anything better to do?`,
        `The weather seems nice today.`,
        `That’s a weird drawing.`,
        `You think you can surprise me with that, __USERNAME__?`,
        `Good, but, you think I care?`,
    ],
    badGuess: [
        `Can we move on, __USERNAME__?`,
        `I’m already bored of this drawing.`,
        `Meh…`,
        `Too much red for my taste.`,
        `I had no expectations from you, __USERNAME__.`,
        `Wrong, but, you think I care?`,
    ],
    duringTurn: [`Finally, some peace.`, `Wake me up when you’re done.`, `I’m going to do something else...`],
};
const rossPersonalisedScript: IPersonalisedScript = {
    goodGuess: {
        old: '🤖 __STATS__s of game time, nice.',
        new: '🤖 Oh a newbie, nice.',
    },
    badGuess: {
        old: '🤖 Oh we played together before? Nice.',
        new: "🤖 Oh it's our first game, nice.",
    },
};

export const getScript = (virtualPlayerName: string | undefined): any => {
    switch (virtualPlayerName) {
        case 'Virtual Vincent':
            return { playerScript: vincentScript, personalisedScript: vincentPersonalisedScript };
        case 'Virtual Simon':
            return { playerScript: simonScript, personalisedScript: simonPersonalisedScript };
        case 'Virtual Hakim':
            return { playerScript: hakimScript, personalisedScript: hakimPersonalisedScript };
        case 'Virtual Abderrahim':
            return { playerScript: abdeScript, personalisedScript: abdePersonalisedScript };
        case 'Virtual Rostyslav':
            return { playerScript: rossScript, personalisedScript: rossPersonalisedScript };
        case 'Virtual Xi Chen':
            return { playerScript: xichenScript, personalisedScript: xichenPersonalisedScript };
        default:
            return { playerScript: defaultScript, personalisedScript: vincentPersonalisedScript };
    }
};
