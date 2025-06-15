import { FC } from 'react'
import LoggedInNavBar from '../../components/ui/LoggedInNavbar'
import { useQuery } from 'react-query'
import {fetchAllAuctions} from '../../api/Auctions'
import {AuctionType} from '../../models/Auctions'
import {Link} from 'react-router-dom'
import DoneSmall from '../../components/ui/tags/small/status/done'
import InProgressSmall from '../../components/ui/tags/small/status/inProgress'
import LastDayTagSmall from '../../components/ui/tags/small/time/lastDay'
import {fetchMe} from '../../api/User'
import WinningSmall from '../../components/ui/tags/small/status/winning'
import MoreThanADayTagWordSmall from '../../components/ui/tags/small/time/moreThanADayWord'
import OutbidSmall from '../../components/ui/tags/small/status/outbid'

const Profile: FC = () => {
    const { data: userData, isLoading: isUserLoading, error: userError,} = useQuery('fetchMe', fetchMe, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
    const currentUserID = userData ? userData.id : null

    function getAuctionStatusAndTime(auction: AuctionType): [string, number | null, number | null] {
        const now = new Date()
        const startTime = new Date(auction.startTime)
        const endTime = new Date(auction.endTime)
        let hoursRemaining: number | null = null
        let daysRemaining: number | null = null

        if (now >= startTime && now <= endTime) {
            const msRemaining = endTime.getTime() - now.getTime()
            hoursRemaining = Math.ceil(msRemaining / (1000 * 60 * 60))
            daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60) / 24)
            return ['In Progress', hoursRemaining, daysRemaining]
        } else if (now > endTime) {
            return ['Done', null, null]
        } else {
            return ['Not Started', null, null]
        }
    }

    const getUserBiddingStatus = (auction: AuctionType) => {
        const isCurrentUserWinning = auction.currentWinner === currentUserID

        if (auction.userHasBid) {
            return isCurrentUserWinning ? 'winning' : 'outbid'
        } else {
            return 'inProgress'
        }
    }


    const { data, isLoading, error } = useQuery('fetchAllAuctions', fetchAllAuctions, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })

    const renderAuctions = () => {
        if (isLoading) return <p>Loading...</p>
        if (error) return <p>There was an error fetching the auctions.</p>
        if (data && data.length > 0) {
            return data.map((auction: AuctionType) => {
                const [status, hoursRemaining, daysRemaining] = getAuctionStatusAndTime(auction)
                const isAuctionInProgress = status === 'In Progress'
                const biddingStatus = getUserBiddingStatus(auction)

                return (
                    <Link to={`/auction/${auction.id}`} key={auction.id} className="bidding-container" style={{ textDecoration: 'none' }}>
                        <div key={auction.id} className="bidding-container">
                            <div className="in-progress-element-container">
                                {status === 'Done' ? (
                                    <DoneSmall/>
                                ) : null}


                                {daysRemaining !== null && hoursRemaining !== null ? (
                                    <>
                                        {biddingStatus === 'winning' && <WinningSmall/>}
                                        {biddingStatus === 'outbid' && <OutbidSmall/>}
                                        {biddingStatus === 'inProgress' && <InProgressSmall/>}
                                        {hoursRemaining > 25 ? (
                                            <MoreThanADayTagWordSmall time={daysRemaining}/>
                                        ) : (
                                            <LastDayTagSmall/>
                                        )}

                                    </>
                                ) : null}
                            </div>

                            <div className="element-twohundred">
                                <div className="caption-title">{auction.title}</div>
                            </div>

                            <div className="element-twohundred" style={{marginBottom: '5px', marginTop: '5px'}}>
                                {auction.currentPrice !== null ? (
                                    <div className="caption-price">{auction.currentPrice} €</div>
                                ) : (
                                    <div className="caption-price">{auction.startPrice} €</div>
                                )}

                            </div>


                            <div className="auction-normal-image-container">
                                {isAuctionInProgress ? (
                                    <img
                                        className={isAuctionInProgress ? 'auction-profile-image-editable' : 'auction-profile-image'}
                                        src={`${process.env.REACT_APP_API_URL}${auction.imageUrl}`}
                                        alt="Auction Image"
                                    />
                                ) : (
                                    <img
                                        className={isAuctionInProgress ? 'auction-profile-image-editable' : 'auction-profile-image'}
                                        src={`${process.env.REACT_APP_API_URL}${auction.imageUrl}`}
                                        alt="Auction Image"
                                    />
                                )}
                            </div>
                        </div>
                    </Link>
                )
            })
        }
        return (
            <>
                <div className="main-container-empty-state-bidding-won">
                    <div className="inner-empty-state-container">
                        <div className="heading-empty-state-text">Oh no, no auctions yet!</div>
                        <div className="text-empty-state-text">
                            {'To add new auction click "+" button in navigation bar or wait for other users to add new auctions.'}                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <LoggedInNavBar/>
            <div className="container-1440 primaryBackground">
                <div className="parent d-flex flex-column align-items-center">
                    <div className="heading-container">
                        <div className="heading-h1 custom-heading">
                            Auctions
                        </div>
                    </div>
                    <div className="auctions-container" style={{paddingTop: '18px'}}>
                        {renderAuctions()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile