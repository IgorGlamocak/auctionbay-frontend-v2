import {useNavigate} from 'react-router-dom'

const WonNavigator = () => {
    const navigate = useNavigate()

    function handleToMyAuctions() {
        navigate('/profile')
    }
    function handleToBidding() {
        navigate('/bidding')
    }
    return (
        <div className="triple-navigator">
            <button onClick={handleToMyAuctions}>My auctions</button>
            <button onClick={handleToBidding}>Bidding</button>
            <button className="triple-navigator-active">Won</button>
        </div>
    )
}

export default WonNavigator