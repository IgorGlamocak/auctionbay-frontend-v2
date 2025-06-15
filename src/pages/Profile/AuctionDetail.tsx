import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {fetchAuctionDetails} from '../../api/Auctions'
import type {AuctionType} from '../../models/Auctions'
import LoggedInNavBar from '../../components/ui/LoggedInNavbar'
import type {BidType} from '../../models/Bid'
import {fetchBids, placeBid} from '../../api/Bids'
import OutbidDefault from '../../components/ui/tags/default/status/outbid'
import LastDayTag from '../../components/ui/tags/default/time/lastDay'
import MoreThanADayTag from '../../components/ui/tags/default/time/moreThanADay'
import WinningDefault from '../../components/ui/tags/default/status/winning'
import InProgressDefault from '../../components/ui/tags/default/status/inProgress'
import { useQuery } from 'react-query'
import {fetchMe} from '../../api/User'
import DoneDefault from '../../components/ui/tags/default/status/done'
import ReactModal from 'react-modal'
import WonDefault from '../../components/ui/tags/default/status/won'

const AuctionDetail = () => {
    const { id } = useParams<string>()
    const [auction, setAuction] = useState<AuctionType | null>(null)
    const [bids, setBids] = useState<BidType[]>([])
    const [auctionError, setAuctionError] = useState<Error | null>(null)
    const [bidAmount, setBidAmount] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = () => setIsModalOpen(!isModalOpen)

    const { data: userData, isLoading, error } = useQuery('fetchMe', fetchMe, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
    const currentUserID = userData ? userData.id : null
    const loadAuctionDetails = async () => {
        try {
            const numericId = Number(id)
            const details = await fetchAuctionDetails(numericId)
            setAuction(details)
        } catch (err) {
            setAuctionError(err as Error)
        }
    }

    useEffect(() => {
        if (id) {
            loadAuctionDetails()
            loadBids()
        }
    }, [id])

    const loadBids = async () => {
        try {
            const numericId = Number(id)
            const bidsData = await fetchBids(numericId)
            setBids(bidsData)
        } catch (err) {
            console.error('Error fetching bids:', err)
        }
    }

    const submitBid = async () => {
        if (!bidAmount) {
            alert('Please enter a bid amount.')
            return
        }
        const numericBidAmount = parseFloat(bidAmount)
        if (isNaN(numericBidAmount) || numericBidAmount <= 0) {
            alert('Please enter a valid bid amount.')
            return
        }
        if (!currentUserID) {
            alert('User ID not found. Please ensure you are logged in.')
            return
        }
        if (auction && (numericBidAmount <= auction.currentPrice || numericBidAmount <= auction.startPrice)) {
            alert(`Your bid must be higher than the current price (${auction.currentPrice}) and the start price (${auction.startPrice}).`)
            return
        }
        try {
            const numericId = Number(id)
            await placeBid(numericId, numericBidAmount)
            setBidAmount('')
            // Refetch auction details and bids after a successful bid placement
            await loadAuctionDetails()
            await loadBids()
        } catch (error) {
            console.error('Error placing bid:', error)
            alert('Failed to place bid. Please try again.')
        }
    }


    const renderBids = () => bids.map((bid, index) => {
        const d = new Date(bid.bidTime) // Temporary variable to avoid creating multiple new Date objects
        const formattedDate = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`

        return (
            <div key={index} className="bidding-one-user-container">
                <div className="bidding-image-name-container">
                    <img className="bidding-user-icon"
                         src={
                                  bid.user.avatar
                                   ? `http://localhost:8080${bid.user.avatar}`
                                        : '/images/profile_pic.png'
                                    }
                         alt="profile"
                    />
                    <div className="bidding-user-text">{bid.user.first_name} {bid.user.last_name}</div>
                </div>
                <div>
                    <div className="bidding-user-time-text">{formattedDate}</div>
                </div>
                <div className="bidding-user-amount-container-yellow bidding-user-amount-container-yellow-text">
                    {bid.amount}
                    <img className="bidding-user-amount-container-yellow-icon"
                         src="/images/icons/euro_black.png"
                         alt="euro"
                    />
                </div>
            </div>
        )
    })
    const calculateRemainingDays = (auction: AuctionType | null): number | null => {
        if (!auction) return null
        const now = new Date()
        const endTime = new Date(auction.endTime)
        if (now > endTime) return null // Auction has ended

        const msRemaining = endTime.getTime() - now.getTime()
        return Math.ceil(msRemaining / (1000 * 60 * 60 * 24))
    }

    const remainingDays = calculateRemainingDays(auction)

    const getUserBiddingStatus = () => {
        const now = new Date()
        const endTime = new Date(auction?.endTime || now)
        const highestBid = bids[0] // Assuming bids are sorted with the highest first
        const userHasBids = bids.some(bid => bid.user.id === currentUserID)
        const auctionEnded = now >= endTime

        if (auctionEnded && highestBid && highestBid.user.id === currentUserID) {
            return 'won'
        } else if (!auctionEnded && userHasBids && highestBid && highestBid.user.id === currentUserID) {
            return 'winning'
        } else if (userHasBids) {
            return 'outbid'
        }
        return 'inProgress'
    }

    const biddingStatus = getUserBiddingStatus()


    return (
        <>
            <LoggedInNavBar/>
            <div className="container-1440-details-page">
                <div className="auction-image-details" onClick={toggleModal} role="button" aria-label="Preview image">
                    <img src={`${process.env.REACT_APP_API_URL}${auction?.imageUrl}`} alt="Auction Item"/>
                </div>
                <div className="auction-details-right-container">
                    <div className="item-detail-description">
                        <div className="time-element">
                            {biddingStatus === 'inProgress' && <InProgressDefault/>}
                            {biddingStatus === 'winning' && <WinningDefault/>}
                            {biddingStatus === 'outbid' && <OutbidDefault/>}
                            {biddingStatus === 'won' && <WonDefault />}


                            {remainingDays !== null && remainingDays > 1 && <MoreThanADayTag time={remainingDays}/>}
                            {remainingDays !== null && remainingDays === 1 && <LastDayTag/>}
                            {remainingDays === null  && <DoneDefault/>}
                        </div>
                        <h1>{auction?.title || ''}</h1>
                        <div className="item-detail-description-container item-detail-description-text">
                            {auction?.description || ''}
                        </div>
                        {remainingDays !== null && auction?.userId !== currentUserID && (
                            <div className="item-detail-placing-bid">
                                Bid:
                                <div className="bid-input-container">
                                    <input
                                        type="text"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                    />
                                </div>
                                <div
                                    className="place-bid-yellow-container place-bid-text"
                                    onClick={submitBid}
                                >
                                    Place bid
                                </div>
                            </div>
                        )}


                    </div>
                    <div className="item-detail-bidding-history">
                        <div className="bidding-history-title-container bidding-history-text">
                            Bidding history({bids.length})
                        </div>
                        <div className="item-detail-bidding-history-container">
                            {renderBids()}
                        </div>
                    </div>
                </div>

            </div>
            <ReactModal isOpen={isModalOpen} onRequestClose={toggleModal} ariaHideApp={false} className="show-image-bigger">
                <div style={{ position: 'relative' }}>
                    <img src={`${process.env.REACT_APP_API_URL}${auction?.imageUrl}`} alt="Auction Item Preview" style={{ width: '100%', height: 'auto', maxHeight: '600px' }} />
                    <button
                        onClick={toggleModal}
                        className="close-image-button"
                    >
                        X
                    </button>
                </div>
            </ReactModal>


        </>

    )
}

export default AuctionDetail