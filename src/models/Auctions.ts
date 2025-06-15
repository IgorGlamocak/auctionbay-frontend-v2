export type AuctionType = {
    id: string
    title: string
    description: string
    startPrice: number
    currentPrice: number
    startTime: Date
    endTime: Date
    imageUrl: string
    currentWinner: string
    userId: string
    createdAt: Date
    updatedAt: Date
    userHasBid?: boolean
}