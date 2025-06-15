import {FC} from 'react'
import LoggedInNavBar from '../../components/ui/LoggedInNavbar'
import {useQuery} from 'react-query'
import {fetchWon} from '../../api/Auctions'
import {AuctionType} from '../../models/Auctions'
import WonNavigator from '../../components/ui/navigators/wonNavigator'
import {Link} from 'react-router-dom'

const Profile: FC = () => {

    function getAuctionStatusAndTime(auction: AuctionType): [string, number | null] {
        const now = new Date()
        const endTime = new Date(auction.endTime)

        if (now > endTime) {
            return ['Done', null]
        } else {
            return ['Not Relevant', null]
        }
    }

    const { data, isLoading, error } = useQuery('fetchWon', fetchWon, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })

    const renderAuctions = () => {
        if (isLoading) return <p>Loading...</p>
        if (error) return <p>There was an error fetching the auctions.</p>
        if (data && data.length > 0) {
            return data.map((auction: AuctionType) => {
                const [status] = getAuctionStatusAndTime(auction)

                if (status === 'Done') {
                    return (
                        <Link to={`/auction/${auction.id}`} key={auction.id} className="bidding-container" style={{ textDecoration: 'none' }}>
                            <div key={auction.id} className="auction-profile-card-won">
                                <div className="auction-texts-container"></div>

                                <div className="in-progress-element-container">
                                    <div className="done-element">
                                        <div className="caption">Done</div>
                                    </div>
                                </div>

                                <div className="element-twohundred">
                                    <div className="caption-title">{auction.title}</div>
                                </div>

                                <div className="element-twohundred" style={{marginBottom: '5px', marginTop: '5px'}}>
                                    <div className="caption-price">{auction.currentPrice} €</div>
                                </div>

                                <div className="auction-normal-image-container">
                                    <img
                                        className='auction-profile-image'
                                        src={`${process.env.REACT_APP_API_URL}${auction.imageUrl}`}
                                        alt="Auction Image"
                                    />
                                </div>
                            </div>
                        </Link>
                    )
                }
                return null
            }).filter(Boolean)
        }
        return (
            <>
                <div className="main-container-empty-state-bidding-won">
                    <div className="inner-empty-state-container">
                        <div className="heading-empty-state-text">Nothing here yet?</div>
                        <div className="text-empty-state-text">
                            {'When you win auction, items will be displayed here! Go on and bid on your favorite items!'}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <LoggedInNavBar/>
            <div className="container-1440 primaryBackground" >
                <div className="parent d-flex flex-column align-items-center">
                    <WonNavigator/>
                    <div
                        className={data && data.length > 0 ? 'auctions-container' : ''}
                        style={{paddingTop: '18px'}}>
                        {renderAuctions()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile