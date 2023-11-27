import bcrypt from 'bcrypt';
import _ from 'lodash';
import { Service } from 'typedi';
import { IAvatar } from '../../interfaces/IAvatar';
import { IChannelMetadata } from '../../interfaces/IChannelMetadata';
import { IMessage } from '../../interfaces/IMessage';
import { IPair } from '../../interfaces/IPair';
import { IQuickDrawPair } from '../../interfaces/IQuickDrawPair';
import { IStatsHistory } from '../../interfaces/IStatsHistory';
import { IUser } from '../../interfaces/IUser';
import avatarModel from '../../models/avatar';
import channelModel from '../../models/channel';
import messageModel from '../../models/message';
import pairModel from '../../models/pair';
import quickDrawPairModel from '../../models/quickDrawPair';
import statsHistoryModel from '../../models/statsHistory';
import userModel from '../../models/user';
import virtualAvatarModel from '../../models/virtualAvatar';

@Service()
export class DbCommunications {
    // message
    async getMessageHistory(channelName: string): Promise<IMessage[]> {
        return (await messageModel.find({ channelName })) as IMessage[];
    }
    saveMessage(messageObject: IMessage) {
        const message = new messageModel(messageObject);
        message.save((e: Error) => {
            if (e) console.error(e);
        });
    }
    removeMessageFromChannel(channelName: string) {
        messageModel.deleteMany({ channelName }, (e: Error) => {
            if (e) console.error(e);
        });
    }

    // user auth
    async getUser(username: string): Promise<IUser> {
        return (await userModel.findOne({ username })) as IUser;
    }
    async saveUser(userObject: IUser) {
        const user = new userModel(userObject);
        user.password = await bcrypt.hash(user.password, 10);
        user.theme = 0;
        await user.save();
    }
    async getAllUsername(): Promise<string[]> {
        const users = (await userModel.find({})) as IUser[];
        const username: string[] = [];
        users.forEach((user: IUser) => {
            username.push(user.username);
        });
        return username;
    }

    // profile
    updateTheme(username: string, theme: number) {
        if (_.isNil(theme) || _.isNil(username)) throw new Error('Bad parameters');
        userModel.updateOne({ username }, { theme }, (e: Error) => {
            if (e) console.error(e);
        });
    }
    async getProfile(username: string): Promise<object> {
        const user = await this.getUser(username);
        return user;
    }

    // chat channel
    saveChannel(channelMetadata: IChannelMetadata) {
        const channel = new channelModel(channelMetadata);
        channel.save((e: Error) => {
            if (e) console.error(e);
        });
    }
    removeChannel(channelName: string) {
        channelModel.deleteOne({ channelName }, (e: Error) => {
            if (e) console.error(e);
        });
    }
    async getChannelMetadatas(): Promise<IChannelMetadata[]> {
        return (await channelModel.find({})) as IChannelMetadata[];
    }
    addUserToChannel(username: string, channelName: string) {
        channelModel.updateOne({ channelName }, { $push: { users: username } }, (e: Error) => {
            if (e) console.error(e);
        });
    }
    removeUserFromChannel(username: string, channelName: string) {
        channelModel.updateOne({ channelName }, { $pull: { users: username } }, (e: Error) => {
            if (e) console.error(e);
        });
    }

    // pair
    async savePair(pairObject: IPair) {
        const pair = new pairModel(pairObject);
        await pair.save();
    }
    async getNRandomPair(n: number): Promise<IPair[]> {
        return (await pairModel.aggregate([{ $sample: { size: n } }])) as IPair[];
    }
    async getAllPairs(): Promise<IPair[]> {
        return (await pairModel.find()) as IPair[];
    }
    async getPairsByWord(word: string): Promise<IPair[]> {
        return (await pairModel.find({ word })) as IPair[];
    }
    async getPairsByDifficulty(difficulty: number): Promise<IPair[]> {
        return (await pairModel.find({ difficulty })) as IPair[];
    }
    async getQuickDrawPair(): Promise<IQuickDrawPair> {
        // const q = new quickDrawPairModel({
        //     word: '{ type: String, required: true }',
        //     countrycode: '{ type: String, required: true }',
        //     timestamp: '{ type: String, required: true }',
        //     recognized: true,
        //     key_id: '{ type: String, required: true }',
        //     drawing: [],
        // });
        // q.save();
        return (await quickDrawPairModel.aggregate([{ $sample: { size: 1 } }]))[0] as IQuickDrawPair;
    }

    // avatar
    async getAllAvatars(): Promise<IAvatar[]> {
        return (await avatarModel.find()) as IAvatar[];
    }
    async getAllVirtualAvatars(): Promise<IAvatar[]> {
        return (await virtualAvatarModel.find()) as IAvatar[];
    }

    // user statsHistory
    async getStatsHistory(username: string): Promise<IStatsHistory> {
        const statsHistory = (await statsHistoryModel.findOne({ username })) as IStatsHistory;
        if (!_.get(statsHistory, 'statistics.totalGamePlayed')) {
            statsHistory.statistics = {
                totalGamePlayed: 0,
                totalFFAPlayed: 0,
                totalSprintPlayed: 0,
                totalFFAWin: 0,
                FFAWinRatio: 0,
                totalGameTime: 0,
                timePerGame: 0,
                bestSoloScore: 0,
            };
        }
        return statsHistory;
    }
    updateStats(
        username: string,
        statsObject: {
            totalGamePlayed: number;
            totalFFAPlayed: number;
            totalSprintPlayed: number;
            totalFFAWin: number;
            FFAWinRatio: number;
            totalGameTime: number;
            timePerGame: number;
            bestSoloScore: number;
        },
    ) {
        statsHistoryModel.findOneAndUpdate(
            { username },
            {
                $set: {
                    statistics: {
                        totalGamePlayed: statsObject.totalGamePlayed,
                        totalFFAPlayed: statsObject.totalFFAPlayed,
                        totalSprintPlayed: statsObject.totalSprintPlayed,
                        totalFFAWin: statsObject.totalFFAWin,
                        FFAWinRatio: statsObject.FFAWinRatio,
                        totalGameTime: statsObject.totalGameTime,
                        timePerGame: statsObject.timePerGame,
                        bestSoloScore: statsObject.bestSoloScore,
                    },
                },
            },
            { upsert: true },
            (e: Error) => {
                if (e) console.error(e);
            },
        );
    }
    addSessionHistory(username: string, sessionObject: { type: string; timestamp: number }) {
        // const statsHistory = new statsHistoryModel({
        //     username: 'fds',
        //     history: {
        //         sessions: [],
        //         games: [],
        //     },
        //     statistics: {
        //         totalGamePlayed: 0,
        //         winRatio: 0,
        //         totalWin: 0,
        //         loseRatio: 0,
        //         totalLose: 0,
        //         timePerGame: 0,
        //         totalGameTime: 0,
        //         bestSoloScore: 0,
        //     },
        // });
        // await statsHistory.save();
        statsHistoryModel.findOneAndUpdate(
            { username },
            {
                $push: { 'history.sessions': sessionObject },
            },
            { upsert: true },
            (e: Error) => {
                if (e) console.error(e);
            },
        );
    }
    addGameHistory(username: string, sessionObject: { gameMode: number; scores: object; startTime: number; endTime: number }) {
        statsHistoryModel.findOneAndUpdate(
            { username },
            {
                $push: { 'history.games': sessionObject },
            },
            { upsert: true },
            (e: Error) => {
                if (e) console.error(e);
            },
        );
    }
}
