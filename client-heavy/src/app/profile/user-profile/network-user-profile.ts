import { Theme } from '../profile-account/theme';

export interface INetworkUserProfile {
    username: string;
    firstName: string;
    password: string;
    lastName: string;
    avatarName: string;
    theme: Theme;
}
