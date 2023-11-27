import _ from 'lodash';
import { Service } from 'typedi';
import { getScript } from '../constants/virtualPlayerScript';
import { IMessage } from '../interfaces/IMessage';
import { IStatsHistory } from '../interfaces/IStatsHistory';
import { DbCommunications } from './communications/dbCommunications.service';
import { ChannelManager } from './managers/channelManager.service';
import { VIRTUAL_CHAT_DELAY, VIRTUAL_CHAT_PERSONALIZE_PROBABILITY } from '../constants';

@Service()
export class VirtualChatter {
    constructor(private channelManager: ChannelManager, private dbCommunications: DbCommunications) {}

    gameStart(virtualPlayerName: string | undefined, channelName: string, receiverUsername: string = '') {
        if (!virtualPlayerName) return;
        const { playerScript } = getScript(virtualPlayerName);
        let content = _.sample(playerScript.gameStart);
        if (content) {
            content = content.replace('__USERNAME__', receiverUsername);
            this.sendMessage(virtualPlayerName, content, channelName);
        }
    }
    turnEnd(virtualPlayerName: string | undefined, channelName: string, content: string) {
        if (virtualPlayerName) {
            setTimeout(() => {
                this.sendMessage(virtualPlayerName, content, channelName);
            }, 500);
        }
    }
    goodGuess(virtualPlayerName: string | undefined, channelName: string, receiverUsername: string = '') {
        if (!virtualPlayerName) return;
        this.dbCommunications.getStatsHistory(receiverUsername).then((statsHistory: IStatsHistory) => {
            const { playerScript, personalisedScript } = getScript(virtualPlayerName);
            const keyword = statsHistory.statistics.totalGameTime > 120 ? 'old' : 'new';
            const contentEnd = personalisedScript.goodGuess[keyword];
            let content = Math.random() < VIRTUAL_CHAT_PERSONALIZE_PROBABILITY ? contentEnd : _.sample(playerScript.goodGuess);
            content = content.replace('__USERNAME__', receiverUsername);
            content = content.replace('__STATS__', statsHistory.statistics.totalGameTime.toFixed(0).toString());
            this.sendMessage(virtualPlayerName, content, channelName);
        });
    }
    badGuess(virtualPlayerName: string | undefined, channelName: string, receiverUsername: string = '') {
        if (!virtualPlayerName) return;
        this.dbCommunications.getStatsHistory(receiverUsername).then((statsHistory: IStatsHistory) => {
            const { playerScript, personalisedScript } = getScript(virtualPlayerName);
            const keyword = JSON.stringify(statsHistory.history.games).includes(virtualPlayerName) ? 'old' : 'new';
            const contentEnd = personalisedScript.badGuess[keyword];
            let content = Math.random() < VIRTUAL_CHAT_PERSONALIZE_PROBABILITY ? contentEnd : _.sample(playerScript.badGuess);
            content = content.replace('__USERNAME__', receiverUsername);
            this.sendMessage(virtualPlayerName, content, channelName);
        });
    }
    duringTurn(virtualPlayerName: string | undefined, channelName: string, receiverUsername: string = '') {
        if (!virtualPlayerName) return;
        const { playerScript } = getScript(virtualPlayerName);
        let content = _.sample(playerScript.duringTurn);
        if (content) {
            content = content.replace('__USERNAME__', receiverUsername);
            this.sendMessage(virtualPlayerName, content, channelName);
        }
    }

    sendMessage(virtualPlayerName: string, content: string, channelName: string) {
        const message: IMessage = {
            username: virtualPlayerName,
            content,
            timestamp: Date.now(),
            channelName,
        };
        setTimeout(() => {
            this.channelManager.dispatchMessage(message);
            console.log(`👄  ${message.username} said "${message.content}" in ${message.channelName}`);
        }, VIRTUAL_CHAT_DELAY);
    }
}
