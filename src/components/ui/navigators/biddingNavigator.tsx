import {useNavigate} from 'react-router-dom'

const BiddingNavigator = () => {
    const navigate = useNavigate()

    function handleToMyAuctions() {
        navigate('/profile')
    }
    function handleToWon() {
        navigate('/won')
    }

    return (
        <div className="triple-navigator">
            <button onClick={handleToMyAuctions}>My auctions</button>
            <button className="triple-navigator-active">Bidding</button>
            <button onClick={handleToWon}>Won</button>
        </div>
    )
}

export default BiddingNavigator