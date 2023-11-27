import { Request, Response, Router } from 'express';
import Container from 'typedi';
import { IChannelMetadata } from '../../interfaces/IChannelMetadata';
import { IMessage } from '../../interfaces/IMessage';
import { DbCommunications } from '../../services/communications/dbCommunications.service';
import { ChannelManager } from '../../services/managers/channelManager.service';
import { Channel } from '../../classes/Channel';
const route = Router();

export default (app: Router) => {
    app.use(route);

    route.get('/chat/:channelName', async (req: Request, res: Response) => {
        const channelName: string = req.params.channelName;
        const messages: IMessage[] = await Container.get(DbCommunications).getMessageHistory(channelName);
        res.json({ messages });
    });

    route.get('/channels', async (req: Request, res: Response) => {
        const channels: Map<string, Channel> = Container.get(ChannelManager).channels;
        const channelMetadatas: IChannelMetadata[] = [];
        channels.forEach((channel: Channel) => {
            channelMetadatas.push(channel.channelMetadata);
        });
        res.json({ channels: channelMetadatas });
    });
};
