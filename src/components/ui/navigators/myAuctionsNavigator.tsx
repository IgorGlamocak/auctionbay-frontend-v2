import {useNavigate} from 'react-router-dom'

const MyAuctionsNavigator = () => {
    const navigate = useNavigate()

    function handleToBidding() {
        navigate('/bidding')
    }
    function handleToWon() {
        navigate('/won')
    }

    return (
        <div className="triple-navigator">
            <button className="triple-navigator-active">My auctions</button>
            <button onClick={handleToBidding}>Bidding</button>
            <button onClick={handleToWon}>Won</button>
        </div>
    )
}

export default MyAuctionsNavigator