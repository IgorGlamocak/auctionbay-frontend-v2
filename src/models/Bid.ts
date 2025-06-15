import type {UserType} from './auth';

export type BidType = {
    id: number;
    amount: number;
    bidTime: Date;
    userId: string;
    auctionId: number;
    createdAt: Date;
    user: UserType;
};